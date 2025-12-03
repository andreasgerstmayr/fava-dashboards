import unittest
from datetime import date

from fava_dashboards.utils import clamp_to_ledger_range


class TestUtils(unittest.TestCase):
    def test_clamp(self):
        # filter contained in ledger
        assert clamp_to_ledger_range(date(2020, 1, 1), date(2021, 12, 31), date(2000, 1, 1), date(2024, 5, 1)) == (
            date(2020, 1, 1),
            date(2021, 12, 31),
        )

        # filter start outside of ledger
        assert clamp_to_ledger_range(date(1999, 1, 1), date(2024, 1, 1), date(2000, 1, 1), date(2024, 5, 1)) == (
            date(2000, 1, 1),
            date(2024, 1, 1),
        )

        # filter end outside of ledger
        assert clamp_to_ledger_range(date(2023, 1, 1), date(2024, 12, 31), date(2000, 1, 1), date(2024, 5, 1)) == (
            date(2023, 1, 1),
            date(2024, 5, 1),
        )

        # filter outside of ledger
        assert clamp_to_ledger_range(date(1990, 1, 1), date(1991, 12, 31), date(2000, 1, 1), date(2024, 5, 1)) == (
            date(1990, 1, 1),
            date(1991, 12, 31),
        )
