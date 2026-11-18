from pathlib import Path

import pytest
from fava.application import create_app


@pytest.fixture(name="client")
def query_client():
    ledger = Path(__file__).parent / "../../example/example.beancount"
    app = create_app([ledger.resolve()])
    app.testing = True
    return app.test_client()


@pytest.mark.parametrize(
    ("bql", "expected"),
    [
        (
            "SELECT sum(position) AS value WHERE account = 'Assets:US:ETrade:ITOT' AND date = 2020-10-04",
            [{"value": {"ITOT": 10.0}}],
        ),
        (
            "SELECT date, units(position) AS value, number AS quantity, position, tags WHERE account = 'Assets:US:ETrade:ITOT' AND date = 2020-10-04",
            [
                {
                    "date": "2020-10-04",
                    "value": {"number": 10.0, "currency": "ITOT"},
                    "quantity": 10.0,
                    "position": {
                        "units": {"number": 10.0, "currency": "ITOT"},
                        "cost": {"number": 105.27, "currency": "USD", "date": "2020-10-04", "label": None},
                    },
                    "tags": [],
                }
            ],
        ),
        ("SELECT account WHERE account = 'Assets:Missing'", []),
    ],
)
def test_query_json(client, bql, expected):
    response = client.get("/beancount/extension/FavaDashboards/query", query_string={"bql": bql})
    assert response.status_code == 200
    assert response.json == {"success": True, "data": {"result": expected}}


def test_legacy_panel_json(client):
    response = client.post(
        "/beancount/extension/FavaDashboards/v1_render_panel",
        json={
            "panel": {
                "type": "jinja2",
                "template": "{{ panel.queries[0].result[0].value }}",
                "queries": [
                    {
                        "bql": "SELECT sum(position) AS value WHERE account = 'Assets:US:ETrade:ITOT' AND date = 2020-10-04"
                    }
                ],
            }
        },
    )
    assert response.status_code == 200
    panel = response.json["data"]["panel"]
    assert panel["template"] == "(10 ITOT {105.27 USD, 2020-10-04})"
    assert panel["queries"][0]["result"] == [{"value": {"ITOT": 10.0}}]
