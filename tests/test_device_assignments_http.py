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

    def test_direct_device_save_cannot_replace_assigned_type_or_identity(self):
        with sqlite3.connect(self.path) as db:
            record = json.loads(db.execute("SELECT record_json FROM inventory_devices WHERE id='device'").fetchone()[0])
            record['primaryIp'] = ''
            db.execute("UPDATE inventory_devices SET record_json=? WHERE id='device'", (json.dumps(record),))
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', payload=self.payload)[0], 200)
        status, reservation, _ = self.request('/api/devices/edit/start', method='POST', payload={'deviceId': 'device'})
        self.assertEqual(status, 200, reservation)
        payload = dict(deviceId='device', revision=reservation['revision'], record=record)
        with sqlite3.connect(self.path) as db:
            before = tuple(db.iterdump())
        for changes in (dict(type='Switch'), dict(type='Printer'), dict(type='Server - Virtual'),
                        dict(isVirtual=True), dict(virtualHostId='forged-host'), dict(id='replacement')):
            for section in ('Devices', 'IPAM', 'Racks'):
                with self.subTest(changes=changes, section=section):
                    status, result, _ = self.request('/api/devices/edit/save', method='POST',
                        payload=dict(payload, section=section, record=dict(record, name='Rejected', **changes)))
                    if section == 'Devices' or 'id' in changes:
                        self.assertEqual(status, 400, result)
                        if section == 'Devices' and 'id' not in changes:
                            self.assertIn('type or physical/virtual identity', result['error'])
                    else:
                        self.assertEqual(status, 403, result)
                        self.assertEqual(result, {'error': 'forbidden'})
                    with sqlite3.connect(self.path) as db:
                        self.assertEqual(tuple(db.iterdump()), before)
        # A scoped editor must not learn whether this Device has protected history.
        for section in ('IPAM', 'Racks'):
            status, response, _ = self.request('/api/devices/edit/save', method='POST',
                payload=dict(payload, section=section, record=dict(record, type='Switch')))
            self.assertEqual(status, 403, response)
            self.assertEqual(response, {'error': 'forbidden'})
        status, result, _ = self.request('/api/inventory/record/save', method='POST', payload={
            'collection': 'devices', 'id': 'device', 'record': dict(record, type='Switch')})
        self.assertEqual(status, 403, result)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(tuple(db.iterdump()), before)
        status, result, _ = self.request('/api/devices/edit/save', method='POST',
            payload=dict(payload, record=dict(record, name='Renamed', notes='Updated')))
        self.assertEqual(status, 200, result)
        with sqlite3.connect(self.path) as db:
            saved = json.loads(db.execute("SELECT record_json FROM inventory_devices WHERE id='device'").fetchone()[0])
            self.assertEqual((saved['id'], saved['type'], saved['name']), ('device', 'Laptop', 'Renamed'))
        status, reservation, _ = self.request('/api/devices/edit/start', method='POST', actor=2,
            payload={'deviceId': 'device'})
        self.assertEqual(status, 200, reservation)
        with sqlite3.connect(self.path) as db:
            before = tuple(db.iterdump())
        status, result, _ = self.request('/api/devices/edit/save', method='POST', actor=2,
            payload=dict(deviceId='device', revision=reservation['revision'], record=dict(saved, type='Switch')))
        self.assertEqual(status, 400, result)
        self.assertEqual(result['error'], 'This edit cannot change the Device type or physical/virtual identity. '
                         'Other permitted fields can still be edited.')
        with sqlite3.connect(self.path) as db:
            self.assertEqual(tuple(db.iterdump()), before)

    def test_strict_request_shape_and_unimplemented_actions(self):
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', raw=b'{"devices":[],"devices":[]}')[0], 400)
        self.assertEqual(self.request('/api/equipment/return', method='POST', payload={})[0], 404)
        self.assertEqual(self.request('/api/equipment/assignments?deviceId=device&staffId=person')[0], 400)
        self.assertEqual(self.request('/api/equipment/recipients?kind=staff&kind=department')[0], 400)
        self.assertEqual(self.request('/api/equipment/assignments', method='POST', payload=self.payload,
            headers={'Content-Type':'text/plain'})[0], 415)
