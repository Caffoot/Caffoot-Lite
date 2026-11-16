"""The association API uses existing session checks and independent live grants."""
import json
import sqlite3
import unittest

import test_device_assignments_http as assignments_http
from test_equipment_associations import insert_association
from test_stock_circulation import issue_payload
from test_stock_intake import receipt_payload
from backend.stock_intake import receive_stock
from backend.stock_circulation import issue_stock, stock_issue_records


class EquipmentAssociationHttpTests(unittest.TestCase):
    request = assignments_http.DeviceAssignmentHttpTests.request
    close_server = assignments_http.DeviceAssignmentHttpTests.close_server

    def setUp(self):
        assignments_http.DeviceAssignmentHttpTests.setUp(self)
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', payload=self.payload)[0], 200)
        with sqlite3.connect(self.path) as db:
            db.execute('PRAGMA foreign_keys=ON')
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            db.execute("INSERT INTO account_permission_overrides VALUES(3,'IT Assets','read')")
            db.commit()
            payload = receipt_payload()
            payload.update(readyQuantity=10, checks=dict(itemsChecked=True, conditionChecked=True))
            item = receive_stock(db, 1, self.tokens[1], payload)['stockItemId']
            issue_stock(db, 1, self.tokens[1], issue_payload(db, item))
            assignment = db.execute("SELECT id FROM device_assignments WHERE device_id='device'").fetchone()[0]
            insert_association(db, assignment, stock_issue_records(db)[0]['id'])

    def test_read_only_access_is_no_store_and_does_not_expose_unrelated_device_secrets(self):
        status, result, cache = self.request('/api/equipment/associations?deviceId=device', actor=3)
        self.assertEqual(status, 200)
        self.assertEqual(cache, 'no-store')
        self.assertEqual(len(result['current']), 1)
        self.assertEqual(result['history'][0]['issue']['quantity'], 1)
        self.assertNotIn('PRIVATE', json.dumps(result))
        self.assertNotIn('primaryIp', json.dumps(result))
        self.assertNotIn('Original Association Technician', json.dumps(self.request('/api/my-equipment', actor=4)[1]))
        self.assertEqual(self.request('/api/equipment/associations?deviceId=device', method='POST', payload={})[0], 404)

    def test_sessions_mfa_cross_origin_and_both_live_grants_are_required(self):
        path = '/api/equipment/associations?deviceId=device'
        self.assertEqual(self.request(path, actor=None)[0], 401)
        for actor in (2, 4, 5, 6):
            self.assertEqual(self.request(path, actor=actor)[0], 403 if actor != 6 else 401)
        for headers in ({'Origin': 'https://outside.example'}, {'Sec-Fetch-Site': 'cross-site'}):
            self.assertEqual(self.request(path, actor=3, headers=headers)[0], 403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE account_permission_overrides SET level='deny' WHERE account_id=3 AND section='IT Assets'")
        self.assertEqual(self.request(path, actor=3)[0], 403)
        self.assertEqual(self.request(path.replace('deviceId=device', 'deviceId=missing'), actor=3)[0], 403)
        with sqlite3.connect(self.path) as db:
            db.execute('DELETE FROM account_sessions WHERE account_id=1')
        self.assertEqual(self.request(path)[0], 401)

    def test_independent_feature_off_hides_history_and_reenabling_preserves_it(self):
        path = '/api/equipment/associations?deviceId=device'
        for feature in ('devices', 'it_assets'):
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            self.assertEqual(self.request(path)[0], 403)
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))
            self.assertEqual(len(self.request(path)[1]['history']), 1)

    def test_exact_query_shape_and_device_existence(self):
        for query in ('', '?deviceId=', '?staffId=person', '?deviceId=device&deviceId=missing',
                      '?deviceId=device&staffId=person'):
            self.assertEqual(self.request('/api/equipment/associations' + query)[0], 400)
        self.assertEqual(self.request('/api/equipment/associations?deviceId=missing')[0], 404)


if __name__ == '__main__':
    unittest.main()
