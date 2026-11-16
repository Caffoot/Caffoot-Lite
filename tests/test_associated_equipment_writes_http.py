"""The two accessory write routes share existing session and request protections."""
import json
import sqlite3
import unittest

from backend.stock_circulation import issue_stock, stock_issue_records
import test_equipment_associations_http as association_http
from test_stock_circulation import issue_payload
from test_associated_equipment_writes import association_payload, combined_issue_payload


class AssociatedEquipmentWriteHttpTests(unittest.TestCase):
    request = association_http.EquipmentAssociationHttpTests.request
    close_server = association_http.EquipmentAssociationHttpTests.close_server

    def setUp(self):
        association_http.EquipmentAssociationHttpTests.setUp(self)
        with sqlite3.connect(self.path) as db:
            self.item = db.execute('SELECT id FROM it_asset_stock_items').fetchone()[0]
            issue_stock(db, 1, self.tokens[1], issue_payload(db, self.item))
            issue = stock_issue_records(db)[0]
            self.existing = association_payload(db, 'device', issueEntryId=issue['id'], version=issue['version'])
            self.issue_new = combined_issue_payload(db, self.item, 'device', quantity=2)
        self.routes = (('/api/equipment/associations', self.existing),
                       ('/api/equipment/issue-and-associate', self.issue_new))

    def snapshot(self):
        with sqlite3.connect(self.path) as db:
            return tuple(db.iterdump())

    def test_both_routes_commit_and_retry_without_second_issue_or_link(self):
        for route, payload in self.routes:
            with sqlite3.connect(self.path) as db:
                issued_before = db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='issued'").fetchone()[0]
            status, result, cache = self.request(route, method='POST', payload=payload)
            self.assertEqual(status, 200, result)
            self.assertEqual(cache, 'no-store')
            self.assertEqual(len(result['associationIds']), 1)
            self.assertNotIn('PRIVATE', json.dumps(result))
            before = self.snapshot()
            self.assertEqual(self.request(route, method='POST', payload=payload)[1], result)
            self.assertEqual(self.snapshot(), before)
            with sqlite3.connect(self.path) as db:
                self.assertEqual(db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='issued'").fetchone()[0],
                                 issued_before + int('issue-and-associate' in route))

    def test_both_routes_enforce_csrf_same_origin_read_only_permissions_and_mfa(self):
        before = self.snapshot()
        for route, payload in self.routes:
            for actor in (None, 2, 3, 4, 5, 6):
                self.assertEqual(self.request(route, method='POST', actor=actor, payload=payload)[0], 403)
            for headers in ({'X-CSRF-Token': ''}, {'Origin': 'https://outside.example'},
                            {'Sec-Fetch-Site': 'cross-site'}):
                self.assertEqual(self.request(route, method='POST', payload=payload, headers=headers)[0], 403)
        self.assertEqual(self.snapshot(), before)

    def test_live_feature_switches_and_revoked_sessions_block_both_routes(self):
        for feature in ('devices', 'it_assets'):
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            before = self.snapshot()
            for route, payload in self.routes:
                self.assertEqual(self.request(route, method='POST', payload=payload)[0], 403)
            self.assertEqual(self.snapshot(), before)
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))
        with sqlite3.connect(self.path) as db:
            db.execute('DELETE FROM account_sessions WHERE account_id=1')
        for route, payload in self.routes:
            self.assertEqual(self.request(route, method='POST', payload=payload)[0], 403)

    def test_effective_edit_grants_are_sufficient_without_administrator_role(self):
        with sqlite3.connect(self.path) as db:
            db.execute("INSERT INTO account_permission_overrides VALUES(2,'IT Assets','edit')")
        for route, payload in self.routes:
            self.assertEqual(self.request(route, method='POST', actor=2, payload=payload)[0], 200)

    def test_bad_shapes_duplicate_keys_wrong_recipient_and_stale_versions_fail_without_changes(self):
        before = self.snapshot()
        for route, payload in self.routes:
            self.assertEqual(self.request(route, method='POST', payload=payload,
                headers={'Content-Type': 'text/plain'})[0], 415)
            self.assertEqual(self.request(route, method='POST', raw=b'{"operationId":"a","operationId":"b"}')[0], 400)
            for request in ({}, dict(payload, recipientId='other'), dict(payload, deviceRevision=True)):
                self.assertEqual(self.request(route, method='POST', payload=request)[0], 400)
            self.assertEqual(self.request(route, method='POST', payload=dict(payload, deviceRevision=999))[0], 409)
            self.assertEqual(self.request(route, method='POST', payload=dict(payload, version='stale'))[0], 409)
            self.assertEqual(self.request(route+'?deviceId=device', method='POST', payload=payload)[0], 404)
        self.assertEqual(self.snapshot(), before)


if __name__ == '__main__':
    unittest.main()
