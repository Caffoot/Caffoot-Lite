"""Real requests protect allocation mutations and private employee equipment."""
import json
import sqlite3
import unittest

import test_staff_directory_http as directory_http
from enabled_inventory import enable_inventory_features


class DeviceAssignmentHttpTests(unittest.TestCase):
    request = directory_http.StaffDirectoryHttpTests.request
    close_server = directory_http.StaffDirectoryHttpTests.close_server

    def setUp(self):
        directory_http.StaffDirectoryHttpTests.setUp(self)
        with sqlite3.connect(self.path) as db:
            enable_inventory_features(db)
            for actor, level in ((2, 'edit'), (3, 'read'), (6, 'edit')):
                db.execute('INSERT INTO account_permission_overrides VALUES(?,?,?)', (actor, 'Devices', level))
            record = {'id': 'device', 'name': 'Laptop', 'type': 'Laptop', 'notes': 'PRIVATE', 'primaryIp': '192.0.2.1'}
            db.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,0)', ('device', 'Laptop', json.dumps(record)))
        self.payload = {'recipientKind': 'staff', 'recipientId': 'person', 'devices': [{'id': 'device', 'revision': 0}]}

    def test_allocation_requires_devices_edit_csrf_same_origin_and_mfa(self):
        path = '/api/equipment/assignments'
        for actor in (None, 3, 4, 5, 6):
            self.assertEqual(self.request(path, method='POST', actor=actor, payload=self.payload)[0], 403)
        for headers in ({'X-CSRF-Token': ''}, {'Origin': 'https://outside.example'}, {'Sec-Fetch-Site': 'cross-site'}):
            self.assertEqual(self.request(path, method='POST', actor=2, payload=self.payload, headers=headers)[0], 403)
        self.assertEqual(self.request(path, method='POST', actor=2, payload=self.payload)[0], 200)
        self.assertEqual(self.request(path, method='POST', actor=2, payload=self.payload)[0], 409)
        status, result, cache = self.request(path+'?deviceId=device', actor=3)
        self.assertEqual(status, 200)
        self.assertIn('no-store', cache)
        self.assertEqual(result['history'][0]['actorId'], 2)

    def test_personal_equipment_accepts_no_foreign_identity_and_no_inventory_grant(self):
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', payload=self.payload)[0], 200)
        status, result, cache = self.request('/api/my-equipment', actor=4)
        self.assertEqual(status, 200)
        self.assertEqual(result['assignedToMe'][0]['id'], 'device')
        self.assertNotIn('PRIVATE', json.dumps(result))
        self.assertNotIn('primaryIp', json.dumps(result))
        self.assertEqual(self.request('/api/my-equipment?staffId=person', actor=4)[0], 400)
        self.assertEqual(self.request('/api/equipment/assignments?staffId=person', actor=4)[0], 403)
        self.assertEqual(self.request('/api/my-equipment', actor=None)[0], 401)
        self.assertEqual(self.request('/api/equipment/recipients', actor=3)[0], 403)
        status, result, _ = self.request('/api/equipment/recipients', actor=2)
        self.assertEqual(status, 200)
        self.assertEqual(set(result['recipients'][0]), {'id','kind','label'})
        with sqlite3.connect(self.path) as db:
            db.execute('DELETE FROM account_sessions WHERE account_id=2')
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', actor=2, payload=self.payload)[0], 403)

    def test_recipient_page_offset_and_request_validation(self):
        status, result, _ = self.request('/api/equipment/recipients?kind=staff&offset=1', actor=2)
        self.assertEqual(status, 200)
        self.assertEqual(result['recipients'], [])
        for offset in ('-1', 'not-a-number', '1.5', '1000001'):
            self.assertEqual(self.request('/api/equipment/recipients?offset='+offset, actor=2)[0], 400)
        self.assertEqual(self.request('/api/equipment/recipients?offset=0&offset=1', actor=2)[0], 400)
        self.assertEqual(self.request('/api/equipment/recipients?offset=0', actor=3)[0], 403)

    def test_strict_request_shape_and_unimplemented_actions(self):
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', raw=b'{"devices":[],"devices":[]}')[0], 400)
        self.assertEqual(self.request('/api/equipment/return', method='POST', payload={})[0], 404)
        self.assertEqual(self.request('/api/equipment/assignments?deviceId=device&staffId=person')[0], 400)
        self.assertEqual(self.request('/api/equipment/recipients?kind=staff&kind=department')[0], 400)
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', payload=self.payload,
            headers={'Content-Type':'text/plain'})[0], 415)
