from typing import Any, Dict
import datetime
from dataclasses import dataclass
from collections import namedtuple
import yaml
from flask import request, Response, jsonify
from beancount.core.inventory import Inventory  # type: ignore
from beanquery.query import run_query  # type: ignore
from fava.application import render_template_string
from fava.context import g
from fava.core import FavaLedger
from fava.core.conversion import simple_units
from fava.ext import FavaExtensionBase, extension_endpoint
from fava.helpers import FavaAPIError

ExtConfig = namedtuple("ExtConfig", ["dashboards_path"])


@dataclass(frozen=True)
class PanelCtx:
    ledger: Dict[str, Any]
    favaledger: FavaLedger
    panel: Dict[str, Any]


class FavaDashboards(FavaExtensionBase):
    report_title = "Dashboards"
    has_js_module = True

    def read_ext_config(self) -> ExtConfig:
        cfg = self.config if isinstance(self.config, dict) else {}
        return ExtConfig(
            dashboards_path=self.ledger.join_path(cfg.get("config", "dashboards.yaml"))
        )

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
        result_row = namedtuple("ResultRow", [col.name for col in rtypes])
        rtypes = [(t.name, t.datatype) for t in rtypes]
        rrows = [result_row(*row) for row in rrows]

        return rtypes, rrows

    def process_queries(self, ctx: PanelCtx):
        for query in ctx.panel.get("queries", []):
            if "bql" in query:
                bql = self.render_template(ctx, query["bql"])
                query["result_types"], query["result"] = self.exec_query(bql)

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

    def process_panel(self, ctx: PanelCtx):
        self.process_queries(ctx)
        self.process_jinja2(ctx)
        self.sanitize_panel(ctx)

    def bootstrap(self, dashboard_id):
        ext_config = self.read_ext_config()
        operating_currencies = self.ledger.options["operating_currency"]
        commodities = {c.currency: c for c in self.ledger.all_entries_by_type.Commodity}
        accounts = self.ledger.accounts
        ledger = {
            # pylint: disable=protected-access
            "dateFirst": g.filtered._date_first,
            # pylint: disable=protected-access
            "dateLast": g.filtered._date_last - datetime.timedelta(days=1),
            "operatingCurrencies": operating_currencies,
            "ccy": operating_currencies[0],
            "accounts": accounts,
            "commodities": commodities,
        }

        dashboards_yaml = self.read_dashboards_yaml(ext_config.dashboards_path)
        dashboards = dashboards_yaml.get("dashboards", [])
        if not 0 <= dashboard_id < len(dashboards):
            raise FavaAPIError(f"invalid dashboard ID: {dashboard_id}")

        for panel in dashboards[dashboard_id].get("panels", []):
            ctx = PanelCtx(ledger, self.ledger, panel)
            try:
                self.process_panel(ctx)
            except Exception as ex:
                raise FavaAPIError(
                    f"error processing panel \"{panel.get('title', '')}\": {ex}"
                ) from ex

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
