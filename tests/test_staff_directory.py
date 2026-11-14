"""Directory lifecycle, independent profiles and atomic optional login creation."""
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, verify_password
from backend.permissions import create_user, delete_user, set_account_active
from backend.profiles import save_profile
from backend.schema import initialise_database
from backend.sessions import _digest
from backend.staff_directory import (
    save_staff_member, save_department, read_staff_member, read_department, list_directory,
)


class StaffDirectoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'directory.sqlite3'
        self.db = sqlite3.connect(self.path)
        self.db.execute('PRAGMA foreign_keys=ON')
        self.addCleanup(self.db.close)
        initialise_database(self.db)
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret) VALUES(1,'owner','hash',1,1,'TEST-ONLY-SECRET')")
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_confirmed,mfa_secret) VALUES(2,'editor','hash',1,'TEST-ONLY-SECRET')")
        self.db.execute("INSERT INTO accounts(id,username,password_hash) VALUES(3,'ordinary','hash')")
        self.tokens = {n: str(n) * 64 for n in (1, 2, 3)}
        for actor, token in self.tokens.items():
            self.db.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(token), actor))
        for section in ('Staff Members', 'Departments'):
            self.db.execute("INSERT INTO account_permission_overrides VALUES(2,?,'edit')", (section,))
        self.db.commit()

    def staff(self, payload=None, **kwargs):
        return save_staff_member(self.db, 1, self.tokens[1], payload or dict(firstName='Alex', lastName='Example'), **kwargs)

    def department(self, payload=None, **kwargs):
        return save_department(self.db, 1, self.tokens[1], payload or {'name': 'Production'}, **kwargs)

    def snapshot(self):
        return list(self.db.iterdump())

    def test_staff_create_search_edit_and_independent_status(self):
        department = self.department()
        staff = self.staff(dict(firstName=' Alex ', lastName='Example', email='',
            departmentId=department['id'], jobTitle='Engineer', telephone='+44 123', location='Workshop'))
        self.assertEqual(staff['firstName'], 'Alex')
        self.assertIsNone(staff['accountId'])
        self.assertTrue(staff['active'])
        self.assertEqual(list_directory(self.db, 1, 'Staff Members', query='alex'), [staff])
        self.assertEqual(list_directory(self.db, 1, 'Staff Members', query='%'), [])
        for active in (False, True):
            self.assertEqual(self.staff({'active': active}, staff_id=staff['id'])['active'], active)
        self.assertEqual(self.db.execute('SELECT count(*) FROM accounts').fetchone(), (3,))
        self.staff({'departmentId': None}, staff_id=staff['id'])
        self.assertIsNone(read_staff_member(self.db, 1, staff['id'])['departmentId'])

    def test_staff_search_by_department_with_staff_read_only(self):
        department = self.department()
        first = self.staff(dict(firstName='Alex', lastName='Example', departmentId=department['id']))
        second = self.staff(dict(firstName='Production', lastName='Person', departmentId=department['id']))
        unassigned = self.staff(dict(firstName='Taylor', lastName='Unassigned'))
        self.department({'name': 'Unstaffed Department'})
        self.db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=2 AND section='Staff Members'")
        self.db.execute("DELETE FROM account_permission_overrides WHERE account_id=2 AND section='Departments'")
        self.db.execute('UPDATE staff_members SET account_id=3 WHERE id=?', (first['id'],))
        self.db.commit()
        before = self.snapshot()
        expected = [read_staff_member(self.db, 2, record['id']) for record in (first, second)]
        self.assertEqual(list_directory(self.db, 2, 'Staff Members', query='pRoDuC'), expected)
        self.assertEqual(list_directory(self.db, 2, 'Staff Members', query='Production', limit=1, offset=1), expected[1:])
        self.assertEqual(list_directory(self.db, 2, 'Staff Members', query='Alex'), expected[:1])
        self.assertEqual(list_directory(self.db, 2, 'Staff Members', query='Taylor'), [read_staff_member(self.db, 2, unassigned['id'])])
        for query in ('Unstaffed', 'ordinary', "' OR 1=1 --"):
            self.assertEqual(list_directory(self.db, 2, 'Staff Members', query=query), [])
        for record in expected:
            self.assertNotIn('accountId', record)
            self.assertNotIn('departmentName', record)
            self.assertNotIn('archived', record)
        with self.assertRaises(PermissionError):
            list_directory(self.db, 2, 'Departments', query='Production')
        with self.assertRaises(PermissionError):
            read_department(self.db, 2, department['id'])
        with self.assertRaises(PermissionError):
            list_directory(self.db, 3, 'Staff Members', query='Production')
        self.assertEqual(self.snapshot(), before)

    def test_staff_search_keeps_archived_departments_and_literal_wildcards(self):
        department = self.department({'name': 'Archive %_! Team'})
        staff = self.staff(dict(firstName='Alex', lastName='Example', departmentId=department['id']))
        self.department({'archived': True}, department_id=department['id'])
        self.db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=2 AND section='Staff Members'")
        self.db.execute("DELETE FROM account_permission_overrides WHERE account_id=2 AND section='Departments'")
        self.db.commit()
        expected = [read_staff_member(self.db, 2, staff['id'])]
        for query in ('archive', '%', '_', '!', '%_!'):
            self.assertEqual(list_directory(self.db, 2, 'Staff Members', query=query), expected)
        self.assertEqual(list_directory(self.db, 2, 'Staff Members', query='missing%'), [])

    def test_manual_names_required_but_migrated_blanks_are_editable(self):
        for payload in ({'firstName': 'Alex'}, {'firstName': '', 'lastName': 'Example'},
                {'firstName': 'Alex', 'lastName': '  '}):
            before = self.snapshot()
            with self.assertRaises(ValueError):
                self.staff(payload)
            self.assertEqual(before, self.snapshot())
        self.db.execute("INSERT INTO staff_members(id) VALUES('migrated')")
        self.db.commit()
        result = self.staff({'telephone': '123'}, staff_id='migrated')
        self.assertEqual((result['firstName'], result['lastName']), ('', ''))

    def test_validation_unknown_fields_types_and_missing_records(self):
        staff = self.staff()
        for field, value in (('email', 'invalid'), ('active', 1), ('departmentId', []),
                ('telephone', 'bad\n'), ('location', 'x' * 201), ('firstName', None),
                ('accountId', 2), ('roles', []), ('password', 'secret')):
            before = self.snapshot()
            with self.subTest(field=field), self.assertRaises((ValueError, TypeError)):
                self.staff({field: value}, staff_id=staff['id'])
            self.assertEqual(before, self.snapshot())
        with self.assertRaises(LookupError):
            self.staff({'active': False}, staff_id='missing')
        with self.assertRaises(LookupError):
            self.staff(dict(firstName='A', lastName='B', departmentId='missing'))

    def test_department_lifecycle_preserves_membership_and_historical_references(self):
        department = self.department()
        staff = self.staff(dict(firstName='A', lastName='B', departmentId=department['id']))
        self.department({'name': 'Renamed', 'archived': True}, department_id=department['id'])
        self.assertEqual(read_staff_member(self.db, 1, staff['id'])['departmentId'], department['id'])
        self.staff({'jobTitle': 'Changed'}, staff_id=staff['id'])
        with self.assertRaises(FileExistsError):
            self.staff(dict(firstName='C', lastName='D', departmentId=department['id']))
        with self.assertRaises(FileExistsError):
            save_department(self.db, 1, self.tokens[1], {}, department_id=department['id'], delete=True)
        self.staff({'departmentId': None}, staff_id=staff['id'])
        with self.assertRaises(FileExistsError):
            save_department(self.db, 1, self.tokens[1], {}, department_id=department['id'], delete=True)
        self.department({'archived': False}, department_id=department['id'])
        self.assertFalse(read_department(self.db, 1, department['id'])['archived'])
        event = json.loads(self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1').fetchone()[0])
        self.assertTrue(event['changes'][0]['before']['archived'])
        self.assertFalse(event['changes'][0]['after']['archived'])
        empty = self.department({'name': 'Empty'})
        self.assertTrue(save_department(self.db, 1, self.tokens[1], {}, department_id=empty['id'], delete=True)['deleted'])

    def test_department_validation_and_unique_names(self):
        self.department()
        for payload in ({'name': ''}, {'name': 'x' * 121}, {'name': 'A\n'},
                {'name': 'New', 'archived': 1}, {'name': 'New', 'parentId': 'tree'}):
            with self.assertRaises(ValueError):
                self.department(payload)
        with self.assertRaises(sqlite3.IntegrityError):
            self.department({'name': 'production'})

    def test_combined_login_uses_existing_security_and_independent_profiles(self):
        staff = self.staff(dict(firstName='A', lastName='B', email='', login=dict(username='new', password='test-password')))
        account = staff['accountId']
        self.assertEqual(self.db.execute('SELECT count(*) FROM staff_members WHERE account_id=?', (account,)).fetchone(), (1,))
        row = self.db.execute('SELECT password_hash,is_admin,active,mfa_confirmed,mfa_secret FROM accounts WHERE id=?', (account,)).fetchone()
        self.assertTrue(verify_password('test-password', row[0]))
        self.assertEqual(row[1:], (0, 1, 0, None))
        self.assertEqual(self.db.execute('SELECT r.role_key FROM account_roles a JOIN roles r ON r.id=a.role_id WHERE a.account_id=?', (account,)).fetchall(), [('staff_member',)])
        self.assertEqual(self.db.execute('SELECT display_name,email_verified FROM account_profiles WHERE account_id=?', (account,)).fetchone(), ('', 0))
        save_profile(self.db, 1, dict(firstName='Account', lastName='', displayName='', email=''), account)
        self.assertEqual(read_staff_member(self.db, 1, staff['id'])['firstName'], 'A')
        self.staff({'firstName': 'Directory', 'active': False}, staff_id=staff['id'])
        self.assertEqual(self.db.execute('SELECT active FROM accounts WHERE id=?', (account,)).fetchone(), (1,))
        set_account_active(self.db, 1, account, False)
        delete_user(self.db, 1, account)
        self.assertIsNone(read_staff_member(self.db, 1, staff['id'])['accountId'])

    def test_existing_staff_login_and_duplicate_prevention(self):
        staff = self.staff()
        result = self.staff(dict(username='new', password='test-password'), staff_id=staff['id'], login_only=True)
        self.assertEqual(result['id'], staff['id'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM staff_members').fetchone(), (1,))
        before = self.snapshot()
        with self.assertRaises(FileExistsError):
            self.staff(dict(username='another', password='test-password'), staff_id=staff['id'], login_only=True)
        self.assertEqual(before, self.snapshot())

    def test_optional_login_failure_rolls_back_every_table_and_audit(self):
        for login in (dict(username='owner', password='test-password'), dict(username='new', password=''),
                dict(username='new', password='test-password', isAdmin=True), None):
            before = self.snapshot()
            with self.assertRaises((ValueError, sqlite3.IntegrityError)):
                self.staff(dict(firstName='A', lastName='B', login=login))
            self.assertEqual(before, self.snapshot())
        for target in ('backend.permissions.record_actor_event', 'backend.staff_directory.record_actor_event',
                       'backend.permissions.link_account_staff'):
            before = self.snapshot()
            with patch(target, side_effect=RuntimeError('Injected failure')):
                with self.assertRaises(RuntimeError):
                    self.staff(dict(firstName='A', lastName='B', login=dict(username='new', password='test-password')))
            self.assertEqual(before, self.snapshot())

    def test_read_edit_permissions_and_non_admin_login_privacy(self):
        staff = self.staff(dict(firstName='A', lastName='B', login=dict(username='new', password='test-password')))
        self.assertNotIn('accountId', read_staff_member(self.db, 2, staff['id']))
        self.assertTrue(read_staff_member(self.db, 1, staff['id'])['accountId'])
        for section in ('Staff Members', 'Departments'):
            with self.assertRaises(PermissionError):
                list_directory(self.db, 3, section)
        before = self.snapshot()
        for payload, kwargs in ((dict(firstName='X', lastName='Y', login=dict(username='forbidden', password='pw')), {}),
                               (dict(username='forbidden', password='pw'), {'staff_id': staff['id'], 'login_only': True})):
            with self.assertRaises(PermissionError):
                save_staff_member(self.db, 2, self.tokens[2], payload, **kwargs)
            self.assertEqual(before, self.snapshot())
        self.db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=2")
        self.db.commit()
        self.assertTrue(list_directory(self.db, 2, 'Staff Members'))
        with self.assertRaises(PermissionError):
            save_staff_member(self.db, 2, self.tokens[2], {'active': False}, staff_id=staff['id'])

    def test_users_creation_and_bootstrap_link_exactly_one_staff_record(self):
        user = create_user(self.db, 1, 'users-created', 'test-password', dict(firstName='', lastName='', displayName='No invented name', email=''))
        self.assertEqual(self.db.execute('SELECT first_name,last_name FROM staff_members WHERE account_id=?', (user,)).fetchall(), [('', '')])
        with sqlite3.connect(':memory:') as fresh:
            fresh.execute('PRAGMA foreign_keys=ON')
            initialise_database(fresh)
            with patch('backend.accounts.link_account_staff', side_effect=RuntimeError('Link failed')):
                with self.assertRaises(RuntimeError):
                    bootstrap_first_admin(fresh, 'owner', 'test-password')
            self.assertEqual(fresh.execute('SELECT count(*) FROM accounts').fetchone(), (0,))
            admin, _ = bootstrap_first_admin(fresh, 'owner', 'test-password')
            self.assertEqual(fresh.execute('SELECT account_id FROM staff_members').fetchall(), [(admin,)])

    def test_concurrent_existing_staff_login_creates_one_account(self):
        staff = self.staff()
        barrier = threading.Barrier(2)
        def create(index):
            with sqlite3.connect(self.path, timeout=10) as db:
                db.execute('PRAGMA foreign_keys=ON')
                barrier.wait(timeout=10)
                try:
                    save_staff_member(db, 1, self.tokens[1], dict(username='parallel-' + str(index), password='test-password'), staff_id=staff['id'], login_only=True)
                    return 'created'
                except FileExistsError:
                    return 'conflict'
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(sorted(pool.map(create, range(2))), ['conflict', 'created'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM accounts').fetchone(), (4,))

    def test_audit_omits_contact_and_login_secrets(self):
        self.staff(dict(firstName='Private First', lastName='Private Last', email='private@example.test',
                        telephone='private telephone', login=dict(username='new', password='private-password')))
        history = json.dumps(self.db.execute('SELECT record_json FROM inventory_change_history').fetchall())
        for secret in ('Private First', 'Private Last', 'private@example.test', 'private telephone', 'private-password', self.tokens[1]):
            self.assertNotIn(secret, history)

    def test_waiting_write_rechecks_session_mfa_status_and_permission(self):
        for statement in (
                'DELETE FROM account_sessions WHERE account_id=2',
                'UPDATE accounts SET active=0 WHERE id=2',
                'UPDATE accounts SET mfa_confirmed=0 WHERE id=2',
                "UPDATE account_permission_overrides SET level='deny' WHERE account_id=2 AND section='Staff Members'"):
            with self.subTest(statement=statement):
                attempted = threading.Event()
                writer = sqlite3.connect(self.path)
                try:
                    writer.execute('BEGIN IMMEDIATE')
                    writer.execute(statement)
                    def waiting_save():
                        with sqlite3.connect(self.path, timeout=10) as db:
                            db.set_trace_callback(lambda sql: attempted.set() if sql == 'BEGIN IMMEDIATE' else None)
                            with self.assertRaises(PermissionError):
                                save_staff_member(db, 2, self.tokens[2], dict(firstName='Blocked', lastName='Save'))
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                        future = pool.submit(waiting_save)
                        self.assertTrue(attempted.wait(5))
                        writer.commit()
                        future.result(timeout=10)
                    self.assertEqual(self.db.execute('SELECT count(*) FROM staff_members').fetchone(), (0,))
                finally:
                    writer.close()
                self.db.execute('UPDATE accounts SET active=1,mfa_confirmed=1 WHERE id=2')
                self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2")
                self.db.execute('INSERT OR REPLACE INTO account_sessions VALUES(?,2,9999999999,1)', (_digest(self.tokens[2]),))
                self.db.commit()

    def test_queued_association_rechecks_department_archive(self):
        department = self.department()
        attempted = threading.Event()
        writer = sqlite3.connect(self.path)
        try:
            writer.execute('BEGIN IMMEDIATE')
            writer.execute('UPDATE departments SET archived=1 WHERE id=?', (department['id'],))
            def waiting_save():
                with sqlite3.connect(self.path, timeout=10) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    db.set_trace_callback(lambda sql: attempted.set() if sql == 'BEGIN IMMEDIATE' else None)
                    with self.assertRaises(FileExistsError):
                        save_staff_member(db, 1, self.tokens[1], dict(firstName='Blocked', lastName='Save', departmentId=department['id']))
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                future = pool.submit(waiting_save)
                self.assertTrue(attempted.wait(5))
                writer.commit()
                future.result(timeout=10)
        finally:
            writer.close()
        self.assertEqual(self.db.execute('SELECT count(*) FROM staff_members').fetchone(), (0,))

    def test_department_audit_failure_rolls_back_rename_and_archive(self):
        department = self.department()
        before = self.snapshot()
        with patch('backend.staff_directory.record_actor_event', side_effect=RuntimeError('Audit failed')):
            with self.assertRaises(RuntimeError):
                self.department(dict(name='Changed', archived=True), department_id=department['id'])
        self.assertEqual(before, self.snapshot())
