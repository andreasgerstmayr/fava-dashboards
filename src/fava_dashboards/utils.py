from datetime import date
from typing import List

import yaml
from fava.beans.abc import Directive
from fava.beans.abc import Price
from fava.beans.abc import Transaction
from fava.helpers import FavaAPIError


def read_dashboards_yaml(path: str):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except Exception as ex:
        raise FavaAPIError(f"cannot read configuration file {path}: {ex}") from ex


def read_dashboards_tsx(path: str):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as ex:
        raise FavaAPIError(f"cannot read configuration file {path}: {ex}") from ex


def get_ledger_duration(entries: List[Directive]):
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


def clamp_to_ledger_range(filter_first: date, filter_last: date, ledger_first: date, ledger_last: date):
    # Adjust the dates in case the date filter is set to e.g. 2023-2024, however the ledger only contains data up to summer 2024.
    # Without this, all averages in the dashboard are off, because a wrong number of days between dateFirst and dateLast is calculated.
    clamped_first = max(filter_first, ledger_first)
    clamped_last = min(filter_last, ledger_last)

    # If there is no overlap of ledger and filter dates, leave them as-is.
    # For example filter: 2020-2021, but ledger data goes from 2022-2023.
    # The clamped date gives us from max(2020,2022) until min(2021,2023) = from 2022 until 2021, which is invalid.
    if clamped_first > clamped_last:
        return filter_first, filter_last

    return clamped_first, clamped_last
