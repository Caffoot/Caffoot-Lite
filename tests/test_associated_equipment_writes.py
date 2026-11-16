"""Combined accessory saves must share the stock writer's one transaction."""
import unittest

from backend.stock_circulation import issue_stock_in_transaction
import test_stock_circulation as circulation
from test_stock_circulation import issue_payload


class TransactionalStockIssueTests(unittest.TestCase):
    setUp = circulation.StockCirculationTests.setUp
    receipt = circulation.StockCirculationTests.receipt

    def test_issue_helper_refuses_to_own_a_transaction(self):
        item = self.receipt()
        with self.assertRaises(RuntimeError):
            issue_stock_in_transaction(self.db, 1, self.token, issue_payload(self.db, item))

    def test_issue_and_replay_leave_commit_and_rollback_to_the_caller(self):
        item = self.receipt()
        payload = issue_payload(self.db, item, quantity=3)
        before = tuple(self.db.iterdump())
        self.db.execute('BEGIN IMMEDIATE')
        result = issue_stock_in_transaction(self.db, 1, self.token, payload)
        self.assertTrue(self.db.in_transaction)
        self.assertEqual(issue_stock_in_transaction(self.db, 1, self.token, payload), result)
        self.assertTrue(self.db.in_transaction)
        self.db.rollback()
        self.assertEqual(tuple(self.db.iterdump()), before)


if __name__ == '__main__':
    unittest.main()
