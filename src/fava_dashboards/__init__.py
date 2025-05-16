import datetime
from collections import templatetuple
from dataclasses import dataclass
from dataclasses import field
from typing import Any
from typing import Dict
from typing import List

import yaml
from beancount.core.inventory import Inventory
from beanquery.query import run_query
from fava.application import render_template_string
from fava.beans.abc import Directive
from fava.beans.abc import Price
from fava.beans.abc import Transaction
from fava.context import g
from fava.core import FavaLedger
from fava.core.conversion import simple_units
from fava.ext import FavaExtensionBase
from fava.ext import extension_endpoint
from fava.helpers import FavaAPIError
from flask import Response
from flask import jsonify
from flask import request

ExtConfig = templatetuple("ExtConfig", ["dashboards_path"])


@dataclass(frozen=True)
class PanelCtx:
    ledger: Dict[str, Any]
    favaledger: FavaLedger
    panel: Dict[str, Any]


@dataclass(frozen=True)
class TemplateQuery:
    key: str
    args: Dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class GlobalCtx:
    template_queries: Dict[str, TemplateQuery] = field(default_factory=dict)


class FavaDashboards(FavaExtensionBase):
    report_title = "Dashboards"
    has_js_module = True

    def read_ext_config(self) -> ExtConfig:
        cfg = self.config if isinstance(self.config, dict) else {}
        return ExtConfig(dashboards_path=self.ledger.join_path(cfg.get("config", "dashboards.yaml")))

    @staticmethod
    def read_dashboards_yaml(path: str):
        try:
            with open(path, encoding="utf-8") as f:
                return yaml.safe_load(f)
        except Exception as ex:
            raise FavaAPIError(f"cannot read configuration file {path}: {ex}") from ex

    def read_dashboards_utils(self, dashboards_yaml):
        utils = dashboards_yaml.get("utils", {})
        if "inline" in utils:
            return utils["inline"]
        elif "path" in utils:
            path = self.ledger.join_path(utils["path"])
            try:
                with open(path, encoding="utf-8") as f:
                    return f.read()
            except Exception as ex:
                raise FavaAPIError(f"cannot read utils file {path}: {ex}") from ex
        else:
            return ""

    @staticmethod
    def render_template(ctx: PanelCtx, source: str) -> str:
        try:
            return render_template_string(
                source,
                # pass 'fava' for backwards compatibility
                fava=ctx.ledger,
                **ctx.__dict__,
            )
        except Exception as ex:
            raise FavaAPIError(f"failed to render template {source}: {ex}") from ex

    def exec_query(self, query):
        try:
            rtypes, rrows = run_query(g.filtered.entries, self.ledger.options, query)
        except Exception as ex:
            raise FavaAPIError(f"failed to execute query {query}: {ex}") from ex

        # convert to legacy beancount.query format for backwards compat
        result_row = templatetuple("ResultRow", [col.name for col in rtypes])
        rtypes = [(t.name, t.datatype) for t in rtypes]
        rrows = [result_row(*row) for row in rrows]

        return rtypes, rrows

    def process_queries(self, ctx: PanelCtx, panel_queries: dict[str, str]):
        for query in ctx.panel.get("queries", []):
            if "templateQuery" in query:
                template_query_data = query["templateQuery"]
                template_query = TemplateQuery(key=template_query_data["key"], args=template_query_data.get("args", {}))
                final_query = self.process_template_query(template_query, panel_queries)
                bql = self.render_template(ctx, final_query)
                query["result_types"], query["result"] = self.exec_query(bql)
            elif "bql" in query:
                bql = self.render_template(ctx, query["bql"])
                query["result_types"], query["result"] = self.exec_query(bql)

    def process_template_query(self, templateQuery: TemplateQuery, panel_queries) -> str:
        """Returns the beancount query whose key matches the one defined in panel_queries with all arg keys replaced by
        their values

        Example:
            Inputs:
                panel_queries = {
                    "myQuery": "SELECT * WHERE account ~ "{{account}}"
                    "myCountQuery": SELECT COUNT(*) WHERE account ~ "{{account}}"
                }
                templateQuery = TemplateQuery(key="myQuery", args={"account": "Expenses:Food"})
            Output:
                SELECT * WHERE account ~ "Expenses:Food"
        """
        query = panel_queries[templateQuery.key]
        for arg_key, arg_value in templateQuery.args.items():
            # 5 pairs of brackets because we replace two pairs of escaped brackets (2 x 2 = 4) and then need one pair to
            #   replace arg
            query = query.replace(f"{{{{{arg_key}}}}}", arg_value)
        return query

    def process_jinja2(self, ctx: PanelCtx):
        if ctx.panel.get("type") != "jinja2":
            return

        template = ctx.panel.get("template", "")
        ctx.panel["template"] = self.render_template(ctx, template)

    @staticmethod
    def sanitize_query_result(result):
        for i, row in enumerate(result):
            for k, v in row._asdict().items():
                if isinstance(v, Inventory):
                    result[i] = result[i]._replace(**{k: simple_units(v)})

    def sanitize_panel(self, ctx):
        """replace or remove fields which are not JSON serializable"""
        for query in ctx.panel.get("queries", []):
            if "result" in query:
                self.sanitize_query_result(query["result"])

            if "result_types" in query:
                del query["result_types"]

    def process_panel(self, ctx: PanelCtx, global_ctx: GlobalCtx):
        self.process_queries(ctx, global_ctx.template_queries)
        self.process_jinja2(ctx)
        self.sanitize_panel(ctx)

    def get_ledger_duration(self, entries: List[Directive]):
        date_first = None
        date_last = None
        for entry in entries:
            if isinstance(entry, Transaction):
                date_first = entry.date
                break
        for entry in reversed(entries):
            if isinstance(entry, (Transaction, Price)):
                date_last = entry.date
                break
        if not date_first or not date_last:
            raise FavaAPIError("no transaction found")
        return (date_first, date_last)

    def get_ledger(self):
        operating_currencies = self.ledger.options["operating_currency"]
        if len(operating_currencies) == 0:
            raise FavaAPIError("no operating currency specified in the ledger")

        if g.filtered.date_range:
            filter_first = g.filtered.date_range.begin
            filter_last = g.filtered.date_range.end - datetime.timedelta(days=1)

            # Adjust the dates in case the date filter is set to e.g. 2023-2024,
            # however the ledger only contains data up to summer 2024.
            # Without this, all averages in the dashboard are off,
            # because of a wrong number of days between dateFirst and dateLast.
            ledger_date_first, ledger_date_last = self.get_ledger_duration(self.ledger.all_entries)

            if filter_last < ledger_date_first or filter_first > ledger_date_last:
                date_first = filter_first
                date_last = filter_last
            else:
                # use min/max only if there is some overlap between filter and ledger dates
                date_first = max(filter_first, ledger_date_first)
                date_last = min(filter_last, ledger_date_last)
        else:
            # No time filter applied.
            filter_first = filter_last = None
            # Use filtered ledger here, as another filter (e.g. tag filter) could be applied.
            date_first, date_last = self.get_ledger_duration(g.filtered.entries)

        commodities = {c.currency: c for c in self.ledger.all_entries_by_type.Commodity}
        accounts = self.ledger.accounts
        return {
            "dateFirst": date_first,
            "dateLast": date_last,
            "filterFirst": filter_first,
            "filterLast": filter_last,
            "operatingCurrencies": operating_currencies,
            "ccy": operating_currencies[0],
            "accounts": accounts,
            "commodities": commodities,
        }

    def bootstrap(self, dashboard_id):
        ext_config = self.read_ext_config()
        ledger = self.get_ledger()

        dashboards_yaml = self.read_dashboards_yaml(ext_config.dashboards_path)
        dashboards = dashboards_yaml.get("dashboards", [])
        if not 0 <= dashboard_id < len(dashboards):
            raise FavaAPIError(f"invalid dashboard ID: {dashboard_id}")

        # Create global context with templateQueries
        global_ctx = GlobalCtx(
            template_queries=dashboards_yaml.get("templateQueries", {}),
        )

        for panel in dashboards[dashboard_id].get("panels", []):
            ctx = PanelCtx(ledger=ledger, favaledger=self.ledger, panel=panel)
            try:
                self.process_panel(ctx, global_ctx)
            except Exception as ex:
                raise FavaAPIError(f'error processing panel "{panel.get("title", "")}": {ex}') from ex

        utils = self.read_dashboards_utils(dashboards_yaml)
        return {
            "dashboards": dashboards,
            "ledger": ledger,
            "utils": utils,
        }

    @extension_endpoint("query")  # type: ignore
    def api_query(self) -> Response:
        bql = request.args.get("bql")

        try:
            _, result = self.exec_query(bql)
        except Exception as ex:  # pylint: disable=broad-exception-caught
            return jsonify({"success": False, "error": str(ex)})

        self.sanitize_query_result(result)
        return jsonify({"success": True, "data": {"result": result}})
