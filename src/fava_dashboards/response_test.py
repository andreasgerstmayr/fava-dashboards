from decimal import Decimal

from beancount import Amount
from beancount.core.inventory import Inventory

from fava_dashboards.response import api_response


def test_api_response_serializes_portfolio_data():
    units = Inventory()
    units.add_amount(Amount(Decimal("2.5"), "CORP"))

    def endpoint():
        return {
            "units": units,
        }

    response = api_response(endpoint)()

    assert response.status_code == 200
    assert response.mimetype == "application/json"
    assert response.get_json() == {
        "success": True,
        "data": {
            "units": {"CORP": 2.5},
        },
    }
