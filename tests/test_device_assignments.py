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

    def test_recipient_pages_reach_every_eligible_staff_and_department(self):
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.executemany(
            'INSERT INTO staff_members(id,first_name,last_name,active) VALUES(?,?,?,?)',
            [(f'paged-staff-{i:03d}', 'Paged', f'Employee {i:03d}', int(i % 19 != 0))
             for i in range(130)])
        self.db.executemany(
            'INSERT INTO departments(id,name,archived) VALUES(?,?,?)',
            [(f'paged-dept-{i:03d}', f'Paged Department {i:03d}', int(i % 17 == 0))
             for i in range(130)])
        self.db.commit()
        for kind, condition in (('staff', 'active=1'), ('department', 'archived=0')):
            pages = [assignment_recipients(self.db, 2, kind=kind, query='Paged',
                         limit=50, offset=offset) for offset in (0, 50, 100, 150)]
            combined = [item for page in pages for item in page]
            table = 'staff_members' if kind == 'staff' else 'departments'
            eligible = self.db.execute(f"SELECT count(*) FROM {table} WHERE {condition}").fetchone()[0] - 1
            self.assertEqual(len(combined), eligible)
            self.assertEqual(len({item['id'] for item in combined}), len(combined))
            self.assertEqual({item['kind'] for item in combined}, {kind})
            self.assertEqual(pages[-1], [])
        for offset in (-1, '0', 1000001):
            with self.assertRaises(ValueError):
                assignment_recipients(self.db, 2, offset=offset)
        with self.assertRaises(PermissionError):
            assignment_recipients(self.db, 3, offset=50)

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
        self.assertEqual(db.execute('SELECT max(version) FROM schema_migrations').fetchone()[0], schema.SCHEMA_VERSION)

    def test_audit_failure_rolls_back_every_device_and_general_history(self):
        before = self.snapshot()
        with patch('backend.device_assignments.record_actor_event', side_effect=RuntimeError('Audit unavailable')):
            with self.assertRaises(RuntimeError):
                self.allocate(('one', 'two'))
        self.assertEqual(before, self.snapshot())

    def test_clean_start_clears_assignments_while_delete_and_import_protect_them(self):
        from backend.device_saves import delete_reserved_device
        from backend.inventory import ProtectedDeviceConflict, reconstruct_inventory, stage_inventory
        from backend.reset_inventory import reset_inventory

        self.allocate()
        self.db.execute("INSERT INTO device_edit_reservations VALUES('one',1,9999999999,0)")
        self.db.commit()
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, 'assignment history'):
            delete_reserved_device(self.db, 1, 'one', 0)
        self.assertEqual(before, self.snapshot())
        candidate = dict(reconstruct_inventory(self.db), devices=[])
        with self.assertRaisesRegex(ProtectedDeviceConflict, 'Staff or Department assignment history'):
            stage_inventory(self.db, candidate)
        self.assertEqual(before, self.snapshot())
        reset_inventory(self.db, 1)
        self.assertFalse(self.db.execute('SELECT 1 FROM device_assignments').fetchone())
        self.assertEqual(reconstruct_inventory(self.db)['devices'], [])
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])

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

    def test_current_names_follow_recipient_rename_while_history_keeps_original(self):
        self.allocate()
        self.staff({'lastName': 'Renamed'}, staff_id=self.person)
        result = read_assignments(self.db, 1, device_id='one')
        self.assertEqual(result['current'][0]['recipientLabel'], 'Alex Renamed')
        self.assertEqual(result['history'][0]['recipientLabel'], 'Alex Example')
        self.allocate(('two',), kind='department')
        self.department({'name': 'New Department Name'}, department_id=self.dept)
        result = read_assignments(self.db, 1, device_id='two')
        self.assertEqual(result['current'][0]['recipientLabel'], 'New Department Name')
        self.assertEqual(result['history'][0]['recipientLabel'], 'Production')

    def test_device_search_pages_count_only_eligible_matching_records(self):
        # A long run of infrastructure records must not hide later equipment.
        expected = []
        records = [('Switch', 'Active', False)] * 125
        for device_type in ('Desktop', 'Laptop', 'Printer') * 3:
            records.extend([(device_type, 'Active', False), ('Switch', 'Active', False),
                            ('Laptop', 'Retired', False), ('Laptop', 'Active', True)])
        for index, (device_type, status, virtual) in enumerate(records):
            device_id = f'page-device-{index:03d}'
            record = {'id': device_id, 'name': f'Page Device {index:03d}',
                      'type': device_type, 'status': status, 'isVirtual': virtual}
            self.db.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal,revision) VALUES(?,?,?,?,?)',
                            (device_id, record['name'], json.dumps(record), index + 3, index))
            if device_type in ('Desktop', 'Laptop', 'Printer') and status == 'Active' and not virtual:
                expected.append({'id': device_id, 'name': record['name'], 'type': device_type, 'revision': index})
        self.db.commit()
        before = self.snapshot()
        pages = [assignment_device_choices(self.db, 1, query='Page Device', limit=3, offset=offset)
                 for offset in (0, 3, 6, 9)]
        self.assertEqual(pages, [expected[:3], expected[3:6], expected[6:9], []])
        self.assertEqual(assignment_device_choices(self.db, 1, query='Page Device'), expected)
        self.assertEqual(before, self.snapshot())
        with self.assertRaises(PermissionError):
            assignment_device_choices(self.db, 3, query='Page Device', limit=3)
