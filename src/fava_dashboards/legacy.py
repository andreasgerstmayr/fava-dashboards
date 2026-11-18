from collections import namedtuple
from dataclasses import dataclass
from decimal import Decimal
from typing import Any
from typing import Dict

from beancount.core.inventory import Inventory
from beanquery.query import run_query
from fava.context import g
from fava.core import FavaLedger
from fava.core.conversion import UNITS
from fava.core.query import COLUMNS
from fava.core.query import ObjectColumn
from fava.core.query import QueryResultTable
from fava.helpers import FavaAPIError
from flask import render_template_string


@dataclass(frozen=True)
class PanelCtx:
    ledger: Dict[str, Any]
    favaledger: FavaLedger
    panel: Dict[str, Any]


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


def exec_query(ledger: FavaLedger, query):
    entries = g.filtered.entries_with_all_prices
    try:
        rtypes, rrows = run_query(entries, ledger.options, query)
    except Exception as ex:
        raise FavaAPIError(f'failed to execute query "{query}": {ex}') from ex

    querytable = _serialise(rtypes, rrows)

    # convert to legacy beancount.query format for backwards compat
    result_row = namedtuple("ResultRow", [col.name for col in rtypes])  # type: ignore[misc]
    rtypes = [(t.name, t.datatype) for t in rtypes]
    rrows = [result_row(*row) for row in rrows]

    return rtypes, rrows, querytable


def process_queries(ctx: PanelCtx):
    for query in ctx.panel.get("queries", []):
        if "bql" in query:
            bql = render_template(ctx, query["bql"])
            query["result_types"], query["result"], query["querytable"] = exec_query(ctx.favaledger, bql)


def process_jinja2(ctx: PanelCtx):
    if ctx.panel.get("type") != "jinja2":
        return

    template = ctx.panel.get("template", "")
    ctx.panel["template"] = render_template(ctx, template)


def sanitize_query_result(result):
    """Preserve the dashboard JSON format independently of Fava's encoder."""
    for i, row in enumerate(result):
        result[i] = _sanitize_query_value(row._asdict())


def _sanitize_query_value(value):
    if isinstance(value, Inventory):
        return _sanitize_query_value(UNITS.apply_inventory(value))
    if hasattr(value, "_asdict"):  # namedtuples like Amount, Position, Cost
        return _sanitize_query_value(value._asdict())
    if isinstance(value, dict):  # nested serialization, e.g. {"ITOT": Decimal("10")} => {"ITOT": 10.0}
        return {key: _sanitize_query_value(item) for key, item in value.items()}
    if isinstance(value, Decimal):  # serialize Decimal as numbers instead of strings
        return float(value)
    return value


def sanitize_panel(ctx):
    """replace or remove fields which are not JSON serializable"""
    for query in ctx.panel.get("queries", []):
        if "result" in query:
            sanitize_query_result(query["result"])

        if "result_types" in query:
            del query["result_types"]


def process_panel(ctx: PanelCtx):
    process_queries(ctx)
    process_jinja2(ctx)
    sanitize_panel(ctx)


# Copied from https://github.com/beancount/fava/blob/72d7504e6a86e72654d3974d2ca3ee3f3982f6ba/src/fava/core/query_shell.py#L242-L253
# Licensed under MIT License
def _serialise(rtypes, rrows) -> QueryResultTable:
    """Serialise the query result."""
    dtypes = [COLUMNS.get(c.datatype, ObjectColumn)(c.name) for c in rtypes]
    mappers = [d.serialise for d in dtypes]
    mapped_rows = [tuple(mapper(row[i]) for i, mapper in enumerate(mappers)) for row in rrows]
    return QueryResultTable(dtypes, mapped_rows)
