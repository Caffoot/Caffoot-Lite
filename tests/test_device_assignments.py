"""Canonical initial allocation, preservation, concurrency and private employee views."""
import concurrent.futures
import json
import sqlite3
import threading
import unittest
from unittest.mock import patch

from backend import schema
from backend.sessions import _digest
from backend.device_assignments import (assign_devices, assignment_recipients,
    read_assignments, my_equipment, assignment_device_choices)
from backend.staff_directory import save_staff_member, save_department, read_department
from enabled_inventory import enable_inventory_features
import test_staff_directory as directory_fixture


class DeviceAssignmentTests(unittest.TestCase):
    staff = directory_fixture.StaffDirectoryTests.staff
    department = directory_fixture.StaffDirectoryTests.department
    snapshot = directory_fixture.StaffDirectoryTests.snapshot
    # Reuse the existing real account/session fixture and its preservation tests.
    def setUp(self):
        directory_fixture.StaffDirectoryTests.setUp(self)
        enable_inventory_features(self.db)
        self.person = self.staff(dict(firstName='Alex', lastName='Example'))['id']
        self.dept = self.department()['id']
        for ordinal, device_id in enumerate(('one', 'two', 'three')):
            record = {'id': device_id, 'name': 'Device ' + device_id, 'type': 'Laptop', 'status': 'Active',
                      'notes': 'PRIVATE NOTES', 'primaryIp': '192.0.2.1', 'typeDetails': {'password': 'PRIVATE PASSWORD'}}
            self.db.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)',
                            (device_id, record['name'], json.dumps(record), ordinal))
        self.db.commit()

    def allocate(self, ids=('one',), *, kind='staff', recipient=None, actor=1, connection=None):
        return assign_devices(connection or self.db, actor, self.tokens[actor], {
            'recipientKind': kind, 'recipientId': recipient or (self.person if kind == 'staff' else self.dept),
            'devices': [{'id': device_id, 'revision': 0} for device_id in ids]})

    def test_same_device_identity_history_and_actor(self):
        before = self.db.execute('SELECT * FROM inventory_devices').fetchall()
        self.allocate(('one', 'two'))
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(), before)
        result = read_assignments(self.db, 1, staff_id=self.person)
        self.assertEqual(len(result['current']), 2)
        self.assertEqual(result['history'][0]['actorId'], 1)
        self.assertEqual(result['history'][0]['actorLabel'], 'owner')
        self.assertTrue(result['history'][0]['assignedAt'].endswith('Z'))
        self.assertEqual(read_assignments(self.db, 1, device_id='one')['current'][0]['staffId'], self.person)
        audit = json.loads(self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1').fetchone()[0])
        self.assertEqual((audit['actorId'], audit['changes'][0]['action']), (1, 'Assigned'))
        self.assertNotIn('Alex', json.dumps(audit))

    def test_batch_failure_is_atomic_and_duplicates_fail(self):
        self.allocate(('two',))
        before = self.snapshot()
        with self.assertRaises(FileExistsError):
            self.allocate(('one', 'two'))
        self.assertEqual(before, self.snapshot())
        with self.assertRaises(ValueError):
            self.allocate(('one', 'one'))
        self.assertEqual(before, self.snapshot())

    def test_eligibility_and_lifecycle_preserve_outstanding(self):
        self.staff({'active': False}, staff_id=self.person)
        with self.assertRaises(ValueError):
            self.allocate()
        self.staff({'active': True}, staff_id=self.person)
        self.allocate()
        self.staff({'active': False}, staff_id=self.person)
        self.assertEqual(len(read_assignments(self.db, 1, staff_id=self.person)['current']), 1)
        self.department({'archived': True}, department_id=self.dept)
        with self.assertRaises(ValueError):
            self.allocate(('two',), kind='department')
        self.department({'archived': False}, department_id=self.dept)
        self.allocate(('two',), kind='department')
        self.department({'archived': True}, department_id=self.dept)
        self.assertEqual(len(read_assignments(self.db, 1, department_id=self.dept)['current']), 1)
        self.assertFalse(read_department(self.db, 1, self.dept)['canDelete'])
        with self.assertRaises(FileExistsError):
            save_department(self.db, 1, self.tokens[1], {}, department_id=self.dept, delete=True)

    def test_only_devices_edit_gets_restricted_recipients(self):
        with self.assertRaises(PermissionError):
            self.allocate(actor=2)
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.execute("DELETE FROM account_permission_overrides WHERE account_id=2 AND section IN ('Staff Members','Departments')")
        self.db.commit()
        self.assertEqual(set(assignment_recipients(self.db, 2)[0]), {'id', 'kind', 'label'})
        self.allocate(actor=2)
        self.staff({'active': False}, staff_id=self.person)
        self.assertEqual(assignment_recipients(self.db, 2), [])
        self.department({'archived': True}, department_id=self.dept)
        self.assertEqual(assignment_recipients(self.db, 2, kind='department'), [])

    def test_self_service_uses_current_link_membership_and_safe_fields(self):
        other = self.staff(dict(firstName='Other', lastName='Person'))['id']
        self.db.execute('UPDATE staff_members SET account_id=3,department_id=? WHERE id=?', (self.dept, self.person))
        self.db.commit()
        self.allocate()
        self.allocate(('two',), kind='department')
        self.allocate(('three',), recipient=other)
        result = my_equipment(self.db, 3)
        self.assertEqual([d['id'] for d in result['assignedToMe']], ['one'])
        self.assertEqual([d['id'] for d in result['sharedWithMyDepartment']], ['two'])
        self.assertEqual(set(result['assignedToMe'][0]), {'id','name','type','manufacturer','model','assignedAt'})
        self.assertNotIn('PRIVATE', json.dumps(result))
        self.staff({'departmentId': None}, staff_id=self.person)
        self.assertEqual(my_equipment(self.db, 3)['sharedWithMyDepartment'], [])
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.db.commit()
        self.assertEqual(my_equipment(self.db, 3), {'assignedToMe': [], 'sharedWithMyDepartment': []})
        with self.assertRaises(PermissionError):
            read_assignments(self.db, 1, staff_id=self.person)

    def test_history_cannot_be_orphaned_or_rewritten(self):
        self.allocate()
        self.allocate(('two',), kind='department')
        for sql, args in (("DELETE FROM inventory_devices WHERE id=?", ('one',)),
                          ("DELETE FROM staff_members WHERE id=?", (self.person,)),
                          ("DELETE FROM departments WHERE id=?", (self.dept,)),
                          ("DELETE FROM device_assignments", ()),
                          ("UPDATE device_assignments SET ended_at='2099'", ())):
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(sql, args)
            self.db.rollback()
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])

    def test_concurrent_allocations_have_one_winner(self):
        barrier = threading.Barrier(2)
        def run(index):
            with sqlite3.connect(self.path, timeout=10) as db:
                db.execute('PRAGMA foreign_keys=ON')
                barrier.wait(timeout=10)
                try:
                    self.allocate(connection=db)
                    return 'assigned'
                except FileExistsError:
                    return 'conflict'
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(sorted(pool.map(run, range(2))), ['assigned', 'conflict'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_assignments').fetchone()[0], 1)

    def test_stale_reserved_retired_and_invalid_requests_are_blocked(self):
        self.db.execute("UPDATE inventory_devices SET revision=1 WHERE id='one'")
        self.db.execute("INSERT INTO device_edit_reservations VALUES('two',1,9999999999,0)")
        self.db.execute("UPDATE inventory_devices SET record_json=json_set(record_json,'$.status','Retired') WHERE id='three'")
        self.db.commit()
        for device_id in ('one', 'two', 'three'):
            with self.assertRaises(FileExistsError):
                self.allocate((device_id,))
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_assignments').fetchone()[0], 0)
        self.assertEqual([d['id'] for d in assignment_device_choices(self.db, 1)], ['one','two'])

    def test_upgrade_from_14_changes_no_existing_data_and_is_idempotent(self):
        db = sqlite3.connect(':memory:')
        self.addCleanup(db.close)
        db.execute('PRAGMA foreign_keys=ON')
        with patch.object(schema, 'SCHEMA_VERSION', 14):
            schema.initialise_database(db)
        db.execute("INSERT INTO inventory_devices VALUES('existing','Existing','{}',0,0)")
        db.commit()
        before = db.execute('SELECT * FROM inventory_devices').fetchall()
        schema.initialise_database(db)
        schema.initialise_database(db)
        self.assertEqual(db.execute('SELECT * FROM inventory_devices').fetchall(), before)
        self.assertEqual(db.execute('SELECT * FROM device_assignments').fetchall(), [])
        self.assertEqual(db.execute('SELECT max(version) FROM schema_migrations').fetchone()[0], 15)

    def test_audit_failure_rolls_back_every_device_and_general_history(self):
        before = self.snapshot()
        with patch('backend.device_assignments.record_actor_event', side_effect=RuntimeError('Audit unavailable')):
            with self.assertRaises(RuntimeError):
                self.allocate(('one', 'two'))
        self.assertEqual(before, self.snapshot())

    def test_delete_and_inventory_reset_retain_assignment_history(self):
        from backend.device_saves import delete_reserved_device
        from backend.reset_inventory import reset_inventory
        self.allocate()
        self.db.execute("INSERT INTO device_edit_reservations VALUES('one',1,9999999999,0)")
        self.db.commit()
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, 'assignment history'):
            delete_reserved_device(self.db, 1, 'one', 0)
        self.assertEqual(before, self.snapshot())
        with self.assertRaises(sqlite3.IntegrityError):
            reset_inventory(self.db, 1)
        self.assertEqual(before, self.snapshot())

    def test_waiting_allocation_rechecks_session_and_permission(self):
        for statement in ("DELETE FROM account_sessions WHERE account_id=2",
                          "UPDATE accounts SET mfa_confirmed=0 WHERE id=2",
                          "UPDATE account_permission_overrides SET level='deny' WHERE account_id=2 AND section='Devices'"):
            self.db.execute("INSERT OR REPLACE INTO account_permission_overrides VALUES(2,'Devices','edit')")
            self.db.execute("UPDATE accounts SET mfa_confirmed=1 WHERE id=2")
            self.db.execute('INSERT OR REPLACE INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(self.tokens[2]), 2))
            self.db.commit()
            ready = threading.Event()
            def waiting():
                with sqlite3.connect(self.path, timeout=10) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    ready.set()
                    try:
                        self.allocate(actor=2, connection=db)
                        return 'assigned'
                    except PermissionError:
                        return 'denied'
            self.db.execute('BEGIN IMMEDIATE')
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                result = pool.submit(waiting)
                self.assertTrue(ready.wait(5))
                self.db.execute(statement)
                self.db.commit()
                self.assertEqual(result.result(timeout=10), 'denied')
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_assignments').fetchone()[0], 0)

    def test_unreviewed_device_types_are_blocked_pending_eligibility_decision(self):
        self.db.execute("UPDATE inventory_devices SET record_json=json_set(record_json,'$.type','Switch') WHERE id='one'")
        self.db.commit()
        with self.assertRaisesRegex(FileExistsError, 'product-owner approval'):
            self.allocate()
        self.assertNotIn('one', [d['id'] for d in assignment_device_choices(self.db, 1)])
