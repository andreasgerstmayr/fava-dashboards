import os
import datetime
import yaml
from beancount.query.query import run_query
from fava.ext import FavaExtensionBase
from fava.helpers import FavaAPIError
from fava.context import g
from fava.application import render_template_string


class FavaDashboards(FavaExtensionBase):
    report_title = "Dashboards"

    @staticmethod
    def static_file(path):
        js_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "static", path
        )
        with open(js_path, encoding="utf-8") as f:
            return f.read()

    def read_config(self):
        ext_config = self.config if isinstance(self.config, dict) else {}
        config_file = os.path.abspath(ext_config.get("config", "dashboards.yaml"))

        try:
            with open(config_file, encoding="utf-8") as f:
                return yaml.safe_load(f)
        except Exception as ex:
            raise FavaAPIError(f"Cannot read configuration file {config_file}: {ex}")

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
        """remove fields which are not JSON serializable"""
        for query in panel.get("queries", []):
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

        config = self.read_config()
        dashboards = config.get("dashboards", [])
        if not (0 <= dashboard_id < len(dashboards)):
            raise FavaAPIError(f"Invalid dashboard ID: {dashboard_id}")

        for panel in dashboards[dashboard_id].get("panels", []):
            self.process_panel(ledger, panel)

        return {
            "ledger": ledger,
            "dashboards": dashboards,
            "dashboardId": dashboard_id,
        }
