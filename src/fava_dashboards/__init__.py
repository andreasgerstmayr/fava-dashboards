import datetime
import functools
import json
import logging
import os
import traceback
from dataclasses import asdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from typing import Dict
from typing import List
from typing import Optional

from fava.context import g
from fava.ext import FavaExtensionBase
from fava.ext import extension_endpoint
from fava.helpers import FavaAPIError
from flask import request

from fava_dashboards import legacy
from fava_dashboards.utils import clamp_to_ledger_range
from fava_dashboards.utils import get_ledger_duration
from fava_dashboards.utils import read_dashboards_tsx
from fava_dashboards.utils import read_dashboards_yaml

logger = logging.getLogger(__name__)
if loglevel := os.environ.get("LOGLEVEL"):
    logger.setLevel(loglevel.upper())


@dataclass(frozen=True)
class ExtConfig:
    dashboards_path: Path


@dataclass(frozen=True)
class LedgerData:  # pylint: disable=invalid-name,too-many-instance-attributes
    dateFirst: datetime.date
    dateLast: datetime.date
    filterFirst: Optional[datetime.date]
    filterLast: Optional[datetime.date]
    operatingCurrencies: List[str]
    ccy: str
    accounts: Dict[str, Any]
    commodities: Dict[str, Any]


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
            default_paths = [
                self.ledger.join_path(path)
                for path in ["dashboards.tsx", "dashboards.ts", "dashboards.jsx", "dashboards.js", "dashboards.yaml"]
            ]
            dashboards_path = default_paths[0]
            for path in default_paths:
                if path.exists():
                    dashboards_path = path
                    break

        return ExtConfig(dashboards_path=dashboards_path)

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

    def get_ledger_data(self):
        operating_currencies = self.ledger.options["operating_currency"]
        if len(operating_currencies) == 0:
            raise FavaAPIError("no operating currency specified in the ledger")

        if g.filtered.date_range:
            filter_first = g.filtered.date_range.begin
            filter_last = g.filtered.date_range.end - datetime.timedelta(days=1)
            # Use filtered ledger here, as another filter (e.g. tag filter) could be applied.
            ledger_date_first, ledger_date_last = get_ledger_duration(g.filtered.entries)
            # Adjust the dates to align with ledger data.
            date_first, date_last = clamp_to_ledger_range(
                filter_first, filter_last, ledger_date_first, ledger_date_last
            )
        else:
            # No time filter applied.
            filter_first = None
            filter_last = None
            # Use filtered ledger here, as another filter (e.g. tag filter) could be applied.
            date_first, date_last = get_ledger_duration(g.filtered.entries)

        commodities = {c.currency: c for c in self.ledger.all_entries_by_type.Commodity}
        accounts = self.ledger.accounts
        return LedgerData(
            dateFirst=date_first,
            dateLast=date_last,
            filterFirst=filter_first,
            filterLast=filter_last,
            operatingCurrencies=list(operating_currencies),
            ccy=operating_currencies[0],
            accounts=accounts,
            commodities=commodities,
        )

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
        ledger = asdict(self.get_ledger_data())
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
        ledger_data = self.get_ledger_data()

        dashboard_format = ext_config.dashboards_path.suffix
        if dashboard_format == ".tsx":
            config_js = read_dashboards_tsx(ext_config.dashboards_path)
            return {"ledgerData": ledger_data, "configJs": config_js}
        elif dashboard_format == ".yaml":
            dashboards_yaml = read_dashboards_yaml(ext_config.dashboards_path)
            config_js = "export default " + json.dumps(dashboards_yaml)
            utils = self.read_dashboards_utils(dashboards_yaml)
            return {"ledgerData": ledger_data, "configJs": config_js, "utilsJs": utils}
        else:
            raise FavaAPIError(f'invalid dashboard file "{ext_config.dashboards_path}"')
