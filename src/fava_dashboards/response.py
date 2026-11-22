import dataclasses
import functools
import json
import traceback
from datetime import date
from decimal import Decimal

from beancount.core.inventory import Inventory
from fava.core.conversion import UNITS
from fava.helpers import FavaAPIError
from flask import Response
from msgspec import Struct
from msgspec.structs import asdict as struct_asdict


def _json_data(value) -> object:
    if isinstance(value, Inventory):
        return _json_data(UNITS.apply_inventory(value))
    if isinstance(value, Struct):
        return _json_data(struct_asdict(value))
    if isinstance(value, tuple) and hasattr(value, "_asdict"):  # namedtuples like Amount, Position, Cost
        return _json_data(value._asdict())
    if dataclasses.is_dataclass(value) and not isinstance(value, type):
        return _json_data(dataclasses.asdict(value))
    if isinstance(value, dict):
        return {key: _json_data(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set, frozenset)):
        return [_json_data(item) for item in value]

    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, date):
        return value.isoformat()
    return value


def api_response(func):
    """return {success: true, data: ...} or {success: false, error: ...}"""

    @functools.wraps(func)
    def decorator(*args, **kwargs) -> Response:
        try:
            data = func(*args, **kwargs)
            return Response(json.dumps({"success": True, "data": _json_data(data)}), mimetype="application/json")
        except FavaAPIError as e:
            return Response(json.dumps({"success": False, "error": e.message}), status=500, mimetype="application/json")
        except Exception as e:  # pylint: disable=broad-exception-caught
            traceback.print_exception(e)
            return Response(json.dumps({"success": False, "error": str(e)}), status=500, mimetype="application/json")

    return decorator
