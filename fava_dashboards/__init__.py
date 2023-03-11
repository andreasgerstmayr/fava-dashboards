import os
import datetime
import yaml
from beancount.query.query import run_query
from fava.ext import FavaExtensionBase
from fava.helpers import FavaAPIException
from fava.context import g


class FavaDashboards(FavaExtensionBase):
    report_title = "Dashboards"

    @staticmethod
    def static_file(path):
        js_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "static", path
        )
        with open(js_path) as f:
            return f.read()

    def read_config(self):
        ext_config = self.config if isinstance(self.config, dict) else {}
        config_file = ext_config.get("config", "dashboards.yaml")

        try:
            with open(config_file) as f:
                return yaml.safe_load(f)
        except Exception as ex:
            raise FavaAPIException(
                f"Cannot read configuration file {config_file}: {ex}"
            )

    def exec_query(self, query):
        _, rrows = run_query(g.filtered.entries, self.ledger.options, query)
        return rrows

    def process_panel(self, panel):
        for query in panel.get("queries", []):
            query["result"] = self.exec_query(query["bql"])

    def bootstrap(self, dashboard_id):
        config = self.read_config()
        dashboards = config.get("dashboards", [])
        if not (0 <= dashboard_id < len(dashboards)):
            raise FavaAPIException(f"Invalid dashboard ID: {dashboard_id}")

        for panel in dashboards[dashboard_id].get("panels", []):
            self.process_panel(panel)

        return {
            "dateFirst": g.filtered._date_first,
            "dateLast": g.filtered._date_last - datetime.timedelta(days=1),
            "dashboardId": dashboard_id,
            "dashboards": dashboards,
        }
