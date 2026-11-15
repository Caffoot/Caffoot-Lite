"""Department Details reads preserve the existing independent access boundaries."""
import json
import sqlite3
import unittest

import test_staff_directory_http as directory_http
from enabled_inventory import enable_inventory_features


class DepartmentDetailsHttpTests(unittest.TestCase):
    request = directory_http.StaffDirectoryHttpTests.request
    close_server = directory_http.StaffDirectoryHttpTests.close_server

    def setUp(self):
        directory_http.StaffDirectoryHttpTests.setUp(self)
        with sqlite3.connect(self.path) as db:
            enable_inventory_features(db)
            for actor, section, level in ((2, 'Devices', 'edit'),
                    (3, 'Departments', 'read'), (3, 'Devices', 'read'),
                    (6, 'Departments', 'read'), (6, 'Devices', 'read')):
                db.execute('INSERT INTO account_permission_overrides VALUES(?,?,?)', (actor, section, level))
            db.execute("UPDATE staff_members SET department_id='dept' WHERE id='person'")
            for ordinal, (device_id, name) in enumerate((('shared', 'Shared Printer'), ('personal', 'Personal Laptop'))):
                record = dict(id=device_id, name=name, type='Printer' if device_id == 'shared' else 'Laptop', status='Active', notes='PRIVATE DEVICE NOTE')
                db.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)', (device_id, name, json.dumps(record), ordinal))
        for kind, recipient, device in (('department', 'dept', 'shared'), ('staff', 'person', 'personal')):
            self.assertEqual(self.request('/api/equipment/assignments', method='POST', actor=2,
                payload=dict(recipientKind=kind, recipientId=recipient, devices=[dict(id=device, revision=0)]))[0], 200)

    def test_department_access_never_grants_staff_devices_or_history(self):
        status, result, cache = self.request('/api/departments/dept', actor=5)
        self.assertEqual(status, 200)
        self.assertIn('no-store', cache)
        self.assertEqual(set(result['department']), {'id', 'name', 'archived', 'canDelete'})
        for path in ('/api/staff-members', '/api/inventory/devices',
                     '/api/equipment/assignments?departmentId=dept', '/api/inventory/history'):
            self.assertEqual(self.request(path, actor=5)[0], 403, path)
        self.assertEqual(self.request('/api/departments/dept', actor=4)[0], 403)
        self.assertEqual(self.request('/api/departments/dept', actor=None)[0], 401)
        for path in ('/api/departments/dept', '/api/staff-members', '/api/equipment/assignments?departmentId=dept'):
            self.assertEqual(self.request(path, actor=6)[0], 401, path)
        self.assertEqual(self.request('/api/departments/dept', actor=3,
            headers={'Sec-Fetch-Site': 'cross-site'})[0], 403)

    def test_shared_history_excludes_personal_equipment_and_reads_preserve_data(self):
        self.assertEqual(self.request('/api/departments/dept', method='POST',
            payload={'name': 'Accounts', 'archived': True})[0], 200)
        with sqlite3.connect(self.path) as db:
            before = tuple(db.iterdump())
        status, result, _ = self.request('/api/equipment/assignments?departmentId=dept', actor=3)
        self.assertEqual(status, 200)
        self.assertEqual([r['deviceId'] for r in result['current']], ['shared'])
        self.assertEqual([r['deviceId'] for r in result['history']], ['shared'])
        self.assertIsNone(result['current'][0]['staffId'])
        self.assertEqual(result['current'][0]['recipientLabel'], 'Accounts')
        self.assertEqual(result['history'][0]['recipientLabel'], 'Production')
        self.assertNotIn('PRIVATE DEVICE NOTE', json.dumps(result))
        people = self.request('/api/staff-members', actor=3)[1]['staffMembers']
        self.assertEqual([p['id'] for p in people if p['departmentId'] == 'dept'], ['person'])
        self.assertTrue(all('accountId' not in p for p in people))
        history = self.request('/api/inventory/history', actor=3)[1]['changeHistory']
        self.assertFalse(any(c['kind'] == 'Department' for e in history for c in e['changes']))
        admin_history = self.request('/api/inventory/history')[1]['changeHistory']
        self.assertTrue(any(c['kind'] == 'Department' and c['label'] == 'dept' for e in admin_history for c in e['changes']))
        with sqlite3.connect(self.path) as db:
            self.assertEqual(tuple(db.iterdump()), before)
        self.assertEqual(self.request('/api/departments/dept/delete', method='POST', payload={})[0], 409)

    def test_features_and_revoked_rights_remain_server_enforced(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.assertEqual(self.request('/api/departments/dept', actor=3)[0], 200)
        self.assertEqual(self.request('/api/staff-members', actor=3)[0], 200)
        for path in ('/api/inventory/devices', '/api/equipment/assignments?departmentId=dept'):
            self.assertEqual(self.request(path, actor=3)[0], 403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE account_permission_overrides SET level='deny' WHERE account_id=3 AND section='Staff Members'")
        self.assertEqual(self.request('/api/staff-members', actor=3)[0], 403)
        self.assertEqual(self.request('/api/departments/dept', actor=3)[0], 200)
