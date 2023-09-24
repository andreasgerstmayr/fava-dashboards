import datetime
import yaml
from collections import namedtuple
from functools import cached_property
from beancount.core.inventory import Inventory
from beancount.query.query import run_query
from fava.application import render_template_string
from fava.context import g
from fava.core.conversion import simple_units
from fava.ext import FavaExtensionBase
from fava.helpers import FavaAPIError

Config = namedtuple("Config", ["dashboards_path"])


class FavaDashboards(FavaExtensionBase):
    report_title = "Dashboards"
    has_js_module = True

    @cached_property
    def ext_config(self) -> Config:
        cfg = self.config if isinstance(self.config, dict) else {}
        return Config(
            dashboards_path=self.ledger.join_path(cfg.get("config", "dashboards.yaml"))
        )

    def read_dashboards_config(self):
        try:
            with open(self.ext_config.dashboards_path, encoding="utf-8") as f:
                return yaml.safe_load(f)
        except Exception as ex:
            raise FavaAPIError(
                f"Cannot read configuration file {self.ext_config.dashboards_path}: {ex}"
            )

    def exec_query(self, query, tmpl):
        try:
            query = render_template_string(query, **tmpl)
        except Exception as ex:
            raise FavaAPIError(f"Failed to template query {query}: {ex}")

        try:
            rtypes, rrows = run_query(g.filtered.entries, self.ledger.options, query)
        except Exception as ex:
            raise FavaAPIError(f"Failed to execute query {query}: {ex}")
        return rtypes, rrows

    def process_queries(self, ledger, panel):
        for query in panel.get("queries", []):
            if "bql" in query:
                # pass 'fava' for backwards compatibility
                tmpl = {"panel": panel, "ledger": ledger, "fava": ledger}
                query["result_types"], query["result"] = self.exec_query(
                    query["bql"], tmpl
                )

    def process_jinja2(self, ledger, panel):
        if panel.get("type") != "jinja2":
            return

        template = panel.get("template", "")
        tmpl = {
            "panel": panel,
            "ledger": ledger,
            "fava": ledger,
            "favaledger": self.ledger,
        }
        try:
            panel["template"] = render_template_string(template, **tmpl)
        except Exception as ex:
            raise FavaAPIError(f"Failed to parse template {template}: {ex}")

    def sanitize_panel(self, ledger, panel):
        """replace or remove fields which are not JSON serializable"""
        for query in panel.get("queries", []):
            if "result" in query:
                for i, row in enumerate(query["result"]):
                    for k, v in row._asdict().items():
                        if isinstance(v, Inventory):
                            query["result"][i] = query["result"][i]._replace(
                                **{k: simple_units(v)}
                            )

            if "result_types" in query:
                del query["result_types"]

    def process_panel(self, ledger, panel):
        self.process_queries(ledger, panel)
        self.process_jinja2(ledger, panel)
        self.sanitize_panel(ledger, panel)

    def bootstrap(self, dashboard_id):
        operating_currencies = self.ledger.options["operating_currency"]
        commodities = {c.currency: c for c in self.ledger.all_entries_by_type.Commodity}
        ledger = {
            "dateFirst": g.filtered._date_first,
            "dateLast": g.filtered._date_last - datetime.timedelta(days=1),
            "operatingCurrencies": operating_currencies,
            "ccy": operating_currencies[0],
            "commodities": commodities,
        }

        config = self.read_dashboards_config()
        dashboards = config.get("dashboards", [])
        if not (0 <= dashboard_id < len(dashboards)):
            raise FavaAPIError(f"Invalid dashboard ID: {dashboard_id}")

        for panel in dashboards[dashboard_id].get("panels", []):
            self.process_panel(ledger, panel)

        return {
            "ledger": ledger,
            "dashboards": dashboards,
        }
