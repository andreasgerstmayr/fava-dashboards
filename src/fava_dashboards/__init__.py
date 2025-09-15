import datetime
import functools
import json
import traceback
from pathlib import Path
from typing import List
from typing import NamedTuple

import yaml
from fava.beans.abc import Directive
from fava.beans.abc import Price
from fava.beans.abc import Transaction
from fava.context import g
from fava.ext import FavaExtensionBase
from fava.ext import extension_endpoint
from fava.helpers import FavaAPIError
from flask import request

from fava_dashboards import legacy


class ExtConfig(NamedTuple):
    dashboards_path: Path


def api_response(func):
    """return {success: true, data: ...} or {success: false, error: ...}"""

    @functools.wraps(func)
    def decorator(*args, **kwargs):
        try:
            data = func(*args, **kwargs)
            return {"success": True, "data": data}
        except FavaAPIError as e:
            return {"success": False, "error": e.message}, 500
        except Exception as e:  # pylint: disable=broad-exception-caught
            traceback.print_exception(e)
            return {"success": False, "error": str(e)}, 500

    return decorator


class FavaDashboards(FavaExtensionBase):
    report_title = "Dashboards"
    has_js_module = True

    def read_ext_config(self) -> ExtConfig:
        cfg = self.config if isinstance(self.config, dict) else {}

        if "config" in cfg:
            dashboards_path = self.ledger.join_path(cfg["config"])
        else:
            dashboards_path = self.ledger.join_path("dashboards.js")
            legacy_dashboards_path = self.ledger.join_path("dashboards.yaml")
            if not dashboards_path.exists() and legacy_dashboards_path.exists():
                dashboards_path = legacy_dashboards_path

        return ExtConfig(dashboards_path=dashboards_path)

    @staticmethod
    def read_dashboards_yaml(path: str):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f)
        except Exception as ex:
            raise FavaAPIError(f"cannot read configuration file {path}: {ex}") from ex

    @staticmethod
    def read_dashboards_js(path: str):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as ex:
            raise FavaAPIError(f"cannot read configuration file {path}: {ex}") from ex

    def read_dashboards_utils(self, dashboards_yaml):
        utils = dashboards_yaml.get("utils", {})
        if "inline" in utils:
            return utils["inline"]
        elif "path" in utils:
            path = self.ledger.join_path(utils["path"])
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return f.read()
            except Exception as ex:
                raise FavaAPIError(f"cannot read utils file {path}: {ex}") from ex
        else:
            return ""

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
            # Use filtered ledger here, as another filter (e.g. tag filter) could be applied.
            ledger_date_first, ledger_date_last = self.get_ledger_duration(g.filtered.entries)

            # Adjust the dates in case the date filter is set to e.g. 2023-2024,
            # however the ledger only contains data up to summer 2024.
            # Without this, all averages in the dashboard are off,
            # because a wrong number of days between dateFirst and dateLast is calculated.

            # First, check if there is an overlap between ledger and filter dates
            if filter_last < ledger_date_first or filter_first > ledger_date_last:
                # If there is no overlap of ledger and filter dates, leave them as-is.
                # For example filter: 2020-2021, but ledger data goes from 2022-2023.
                # Using min/max here would give from max(2020,2022) until min(2021,2023) = from 2022 until 2021, which is invalid.
                date_first = filter_first
                date_last = filter_last
            else:
                # If there is overlap between ledger and filter dates, use min/max
                date_first = max(filter_first, ledger_date_first)
                date_last = min(filter_last, ledger_date_last)
        else:
            # No time filter applied.
            filter_first = None
            filter_last = None
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

    @extension_endpoint("query")
    @api_response
    def api_v1_query(self):
        bql = request.args.get("bql")

        _, result, _ = legacy.exec_query(self.ledger, bql)

        legacy.sanitize_query_result(result)
        return {"result": result}

    @extension_endpoint("v1_render_panel", ["POST"])
    @api_response
    def api_v1_render_panel(self):
        ledger = self.get_ledger()
        panel = request.get_json().get("panel", {})

        ctx = legacy.PanelCtx(ledger=ledger, favaledger=self.ledger, panel=panel)
        try:
            legacy.process_panel(ctx)
        except Exception as ex:
            raise FavaAPIError(f'error processing panel "{panel.get("title", "")}": {ex}') from ex

        return {"panel": ctx.panel}

    @extension_endpoint("v2_config")
    @api_response
    def api_v2_config(self):
        ext_config = self.read_ext_config()
        ledger = self.get_ledger()

        dashboard_format = ext_config.dashboards_path.suffix
        if dashboard_format == ".js":
            dashboards_js = self.read_dashboards_js(ext_config.dashboards_path)
            return {"ledger": ledger, "dashboardsJs": dashboards_js}
        elif dashboard_format == ".yaml":
            dashboards_yaml = self.read_dashboards_yaml(ext_config.dashboards_path)
            dashboards_js = "return " + json.dumps(dashboards_yaml["dashboards"])
            utils = self.read_dashboards_utils(dashboards_yaml)
            return {"ledger": ledger, "dashboardsJs": dashboards_js, "utilsJs": utils}
        else:
            raise FavaAPIError(f'invalid dashboard file "{ext_config.dashboards_path}"')
