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
from backend.profiles import read_profile, save_profile, StaleProfileEdit
from backend.schema import initialise_database
from backend.sessions import _digest
from backend.staff_directory import (
    save_staff_member, save_department, read_staff_member, read_department, list_directory,
    STAFF_FIELDS, StaleStaffEdit,
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
        payload = dict(payload) if payload is not None else dict(firstName='Alex', lastName='Example')
        if kwargs.get('staff_id') and not kwargs.get('login_only') and 'revision' not in payload:
            payload['revision'] = read_staff_member(self.db, 1, kwargs['staff_id'])['revision']
        return save_staff_member(self.db, 1, self.tokens[1], payload, **kwargs)

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

    def test_stale_forms_protect_every_staff_field_and_optional_login(self):
        department = self.department()
        changes = dict(firstName='New', lastName='Surname', email='new@example.test',
            jobTitle='Engineer', telephone='+44 123', location='Workshop',
            departmentId=department['id'], active=False)
        for field, value in changes.items():
            with self.subTest(field=field):
                original = self.staff()
                editor = read_staff_member(self.db, 2, original['id'])
                self.assertEqual(original['revision'], editor['revision'])
                self.assertNotIn('accountId', editor)
                updated = save_staff_member(self.db, 2, self.tokens[2],
                    {field: value, 'revision': editor['revision']}, staff_id=original['id'])
                before = self.snapshot()
                stale_payload = {name: original[name] for name in (*STAFF_FIELDS, 'departmentId', 'active')}
                stale_payload.update(revision=original['revision'],
                    login=dict(username='stale-login', password='test-password'))
                with patch('backend.staff_directory._create_login') as login, patch('backend.staff_directory.record_actor_event') as audit:
                    with self.assertRaisesRegex(StaleStaffEdit, 'changed elsewhere'):
                        save_staff_member(self.db, 1, self.tokens[1], stale_payload, staff_id=original['id'])
                    login.assert_not_called()
                    audit.assert_not_called()
                self.assertEqual(before, self.snapshot())
                self.assertNotEqual(original['revision'], updated['revision'])
                current = read_staff_member(self.db, 1, original['id'])
                refreshed = save_staff_member(self.db, 1, self.tokens[1],
                    dict(location='Deliberately refreshed', revision=current['revision']), staff_id=original['id'])
                self.assertEqual(refreshed['location'], 'Deliberately refreshed')
                if field != 'location':
                    self.assertEqual(refreshed[field], value)

    def test_quick_status_rejects_changes_to_other_fields_and_status(self):
        for change in ({'jobTitle': 'Changed'}, {'active': False}):
            with self.subTest(change=change):
                original = self.staff()
                self.staff(change, staff_id=original['id'])
                before = self.snapshot()
                with self.assertRaises(StaleStaffEdit):
                    save_staff_member(self.db, 2, self.tokens[2],
                        dict(active=False, revision=original['revision']), staff_id=original['id'])
                self.assertEqual(before, self.snapshot())

    def test_revision_rejects_reverted_values_and_another_staff_record(self):
        original = self.staff()
        other = self.staff()
        with self.assertRaises(StaleStaffEdit):
            save_staff_member(self.db, 1, self.tokens[1],
                dict(active=False, revision=other['revision']), staff_id=original['id'])
        self.staff({'active': False}, staff_id=original['id'])
        self.staff({'active': True}, staff_id=original['id'])
        current = read_staff_member(self.db, 1, original['id'])
        self.assertEqual(current['active'], original['active'])
        self.assertNotEqual(current['revision'], original['revision'])
        with self.assertRaises(StaleStaffEdit):
            save_staff_member(self.db, 1, self.tokens[1],
                dict(location='Old form', revision=original['revision']), staff_id=original['id'])

    def test_staff_operations_ignore_unrelated_historical_change_values(self):
        original = self.staff()
        entries = ('Historical text', '', '{invalid', 12, 1.5, None, True, False, [],
            ['nested'], {}, {'kind': ['Staff Member'], 'label': original['id']},
            {'kind': 'Staff Member', 'label': {}}, {'kind': 'Device', 'label': original['id']},
            {'kind': 'Staff Member', 'label': 'another-person'},
            json.dumps({'kind': 'Staff Member', 'label': original['id']}))
        for index, entry in enumerate(entries):
            with self.subTest(entry=entry):
                current = read_staff_member(self.db, 2, original['id'])
                self.db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)',
                    (json.dumps({'changes': [entry]}),))
                self.db.commit()
                history = self.db.execute('SELECT * FROM inventory_change_history ORDER BY id').fetchall()
                self.assertEqual(read_staff_member(self.db, 2, original['id']), current)
                self.assertEqual(list_directory(self.db, 2, 'Staff Members'), [current])
                self.assertNotIn('accountId', current)
                updated = save_staff_member(self.db, 2, self.tokens[2],
                    dict(location='Workshop ' + str(index), revision=current['revision']), staff_id=original['id'])
                self.assertEqual(updated['location'], 'Workshop ' + str(index))
                self.assertNotEqual(updated['revision'], current['revision'])
                self.assertEqual(self.db.execute('SELECT * FROM inventory_change_history ORDER BY id').fetchall()[:-1], history)

    def test_valid_staff_history_among_other_values_still_invalidates_old_forms(self):
        original = self.staff()
        event = json.dumps({'changes': ['Historical text', 12, None, {},
            {'kind': 'Staff Member', 'label': original['id'], 'action': 'Updated'}]})
        history_id = self.db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?) RETURNING id',
            (event,)).fetchone()[0]
        self.db.commit()
        current = read_staff_member(self.db, 2, original['id'])
        self.assertNotEqual(current['revision'], original['revision'])
        inactive = save_staff_member(self.db, 2, self.tokens[2],
            dict(active=False, revision=current['revision']), staff_id=original['id'])
        restored = save_staff_member(self.db, 2, self.tokens[2],
            dict(active=True, revision=inactive['revision']), staff_id=original['id'])
        self.assertEqual(restored['active'], original['active'])
        self.assertNotEqual(restored['revision'], current['revision'])
        before = self.snapshot()
        for revision in (original['revision'], current['revision'], inactive['revision']):
            with self.subTest(revision=revision), self.assertRaises(StaleStaffEdit):
                save_staff_member(self.db, 1, self.tokens[1], dict(active=False, revision=revision,
                    login=dict(username='stale-login', password='test-password')), staff_id=original['id'])
        self.assertEqual(self.snapshot(), before)
        self.assertEqual(self.db.execute('SELECT record_json FROM inventory_change_history WHERE id=?',
            (history_id,)).fetchone()[0], event)

    def test_unrelated_staff_department_and_account_changes_do_not_invalidate_revision(self):
        department = self.department()
        original = self.staff(dict(firstName='A', lastName='B', departmentId=department['id'],
            login=dict(username='linked', password='test-password')))
        self.staff()
        self.department(dict(name='Renamed', archived=True), department_id=department['id'])
        save_profile(self.db, 1, dict(firstName='A', lastName='B', displayName='Account display name', email=''), original['accountId'])
        self.assertEqual(read_staff_member(self.db, 2, original['id'])['revision'], original['revision'])
        result = save_staff_member(self.db, 2, self.tokens[2],
            dict(jobTitle='Updated', revision=original['revision']), staff_id=original['id'])
        self.assertEqual(result['departmentId'], department['id'])
        self.assertNotIn('accountId', result)

    def test_missing_and_malformed_revisions_never_write(self):
        original = self.staff()
        for revision in (None, '', True, 1, [], {}, 'x' * 64, 'A' * 64, 'a' * 63, 'a' * 65):
            payload = {'active': False}
            if revision is not None:
                payload['revision'] = revision
            before = self.snapshot()
            with self.subTest(revision=revision), self.assertRaises(ValueError):
                save_staff_member(self.db, 1, self.tokens[1], payload, staff_id=original['id'])
            self.assertEqual(before, self.snapshot())
        with self.assertRaises(ValueError):
            self.staff(dict(firstName='A', lastName='B', revision=original['revision']))

    def test_competing_connections_allow_only_one_save_from_the_same_revision(self):
        original = self.staff()
        barrier = threading.Barrier(2)
        def save(actor):
            with sqlite3.connect(self.path, timeout=10) as db:
                db.execute('PRAGMA foreign_keys=ON')
                record = read_staff_member(db, actor, original['id'])
                barrier.wait(timeout=10)
                try:
                    result = save_staff_member(db, actor, self.tokens[actor],
                        dict(location='Editor ' + str(actor), revision=record['revision']), staff_id=original['id'])
                    return result['location']
                except StaleStaffEdit:
                    return 'conflict'
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(save, (1, 2)))
        self.assertEqual(results.count('conflict'), 1)
        winner = next(result for result in results if result != 'conflict')
        self.assertEqual(read_staff_member(self.db, 1, original['id'])['location'], winner)
        self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_change_history').fetchone(), (2,))

    def test_waiting_edit_compares_current_values_after_acquiring_write_lock(self):
        original = self.staff()
        attempted = threading.Event()
        with sqlite3.connect(self.path) as writer:
            writer.execute('BEGIN IMMEDIATE')
            writer.execute('UPDATE staff_members SET location=? WHERE id=?', ('Newer location', original['id']))
            def waiting_save():
                with sqlite3.connect(self.path, timeout=10) as db:
                    db.set_trace_callback(lambda sql: attempted.set() if sql == 'BEGIN IMMEDIATE' else None)
                    with self.assertRaises(StaleStaffEdit):
                        save_staff_member(db, 2, self.tokens[2],
                            dict(active=False, revision=original['revision']), staff_id=original['id'])
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                future = pool.submit(waiting_save)
                self.assertTrue(attempted.wait(5))
                writer.commit()
                future.result(timeout=10)
        current = read_staff_member(self.db, 1, original['id'])
        self.assertEqual(current['location'], 'Newer location')
        self.assertTrue(current['active'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_change_history').fetchone(), (1,))

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
            save_staff_member(self.db, 1, self.tokens[1], dict(active=False, revision=staff['revision']), staff_id='missing')
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

    def test_combined_login_shares_details_and_offboards_login(self):
        staff = self.staff(dict(firstName='A', lastName='B', email='', login=dict(username='new', password='test-password')))
        account = staff['accountId']
        self.assertEqual(self.db.execute('SELECT count(*) FROM staff_members WHERE account_id=?', (account,)).fetchone(), (1,))
        row = self.db.execute('SELECT password_hash,is_admin,active,mfa_confirmed,mfa_secret FROM accounts WHERE id=?', (account,)).fetchone()
        self.assertTrue(verify_password('test-password', row[0]))
        self.assertEqual(row[1:], (0, 1, 0, None))
        self.assertEqual(self.db.execute('SELECT r.role_key FROM account_roles a JOIN roles r ON r.id=a.role_id WHERE a.account_id=?', (account,)).fetchall(), [('staff_member',)])
        self.assertEqual(self.db.execute('SELECT display_name,email_verified FROM account_profiles WHERE account_id=?', (account,)).fetchone(), ('', 0))
        save_profile(self.db, 1, dict(firstName='Account', lastName='', displayName='', email=''), account)
        self.assertEqual(read_staff_member(self.db, 1, staff['id'])['firstName'], 'Account')
        self.assertEqual(read_staff_member(self.db, 1, staff['id'])['lastName'], '')
        self.staff({'firstName': 'Directory', 'active': False}, staff_id=staff['id'])
        self.assertEqual(read_profile(self.db, 1, account)['firstName'], 'Directory')
        self.assertEqual(self.db.execute('SELECT active FROM accounts WHERE id=?', (account,)).fetchone(), (0,))
        set_account_active(self.db, 1, account, False)
        delete_user(self.db, 1, account)
        self.assertIsNone(read_staff_member(self.db, 1, staff['id'])['accountId'])

    def test_directory_only_edits_keep_the_linked_profile_revision(self):
        staff = self.staff(dict(firstName='Alex', lastName='Rivers',
            login=dict(username='linked', password='test-password')))
        account_id = staff['accountId']
        original = read_profile(self.db, account_id)
        self.staff({'active': False}, staff_id=staff['id'])
        update = dict(firstName='Alex', lastName='Rivers', email='',
                      jobTitle='Technician', active=True)
        current = self.staff(update, staff_id=staff['id'])
        self.assertNotEqual(current['revision'], staff['revision'])
        self.assertEqual(read_profile(self.db, 1, account_id), original)
        set_account_active(self.db, 1, account_id, True)
        values = {field: original[field] for field in ('firstName', 'lastName', 'email', 'revision')}
        saved = save_profile(self.db, account_id, dict(values, displayName='Alex R'))
        self.assertEqual(saved['displayName'], 'Alex R')

    def test_linked_writers_reject_stale_cross_screen_edits_and_roll_back(self):
        staff = self.staff(dict(firstName='Alex', lastName='Rivers', login=dict(username='linked', password='test-password')))
        account_id = staff['accountId']
        profile = read_profile(self.db, account_id)
        profile_values = {field: profile[field] for field in ('firstName', 'lastName', 'email', 'displayName', 'revision')}
        self.staff({'firstName': 'Alicia'}, staff_id=staff['id'])
        self.staff({'firstName': 'Alex'}, staff_id=staff['id'])
        before = self.snapshot()
        with self.assertRaises(StaleProfileEdit):
            save_profile(self.db, account_id, dict(profile_values, lastName='Lakes'))
        self.assertEqual(before, self.snapshot())
        profile_values['revision'] = read_profile(self.db, account_id)['revision']
        current = read_staff_member(self.db, 1, staff['id'])
        with patch('backend.profiles.record_actor_event', side_effect=RuntimeError('Audit failed')):
            with self.assertRaisesRegex(RuntimeError, 'Audit failed'):
                save_profile(self.db, account_id, dict(profile_values, lastName='Lakes'))
            with self.assertRaisesRegex(RuntimeError, 'Audit failed'):
                self.staff({'firstName': 'Alicia'}, staff_id=staff['id'])
        self.assertEqual(before, self.snapshot())
        save_profile(self.db, account_id, dict(profile_values, lastName='Lakes'))
        with self.assertRaises(StaleStaffEdit):
            self.staff(dict(active=False, revision=current['revision']), staff_id=staff['id'])
        self.assertEqual(read_staff_member(self.db, 1, staff['id'])['lastName'], 'Lakes')

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
        staff = self.staff(dict(firstName='Private First', lastName='Private Last', email='private@example.test',
                        telephone='private telephone', login=dict(username='new', password='private-password')))
        events = [json.loads(raw) for raw, in self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id')]
        directory_change = next(c for e in events for c in e['changes'] if c['kind'] == 'Staff Member')
        self.assertEqual(directory_change['label'], staff['id'])
        self.assertEqual(directory_change.pop('recordSubject'), {
            'kind': 'Staff Member', 'id': staff['id'], 'name': staff['firstName'] + ' ' + staff['lastName']})
        # The approved name is the sole exception. Keep all prior exclusions
        # in the remaining event, including contact and authentication data.
        history = json.dumps(events)
        for secret in ('Private First', 'Private Last', 'private@example.test', 'private telephone', 'private-password', self.tokens[1]):
            self.assertNotIn(secret, history)

    def test_audit_staff_rename_retains_original_event_and_canonical_label(self):
        staff = self.staff({'firstName': 'Casey', 'lastName': 'Reed'})
        original = self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1').fetchone()[0]
        self.staff({'lastName': 'Morgan'}, staff_id=staff['id'])
        records = self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id').fetchall()
        self.assertEqual(records[-2][0], original)
        changes = [json.loads(raw)['changes'][0] for raw, in records[-2:]]
        self.assertEqual([c['label'] for c in changes], [staff['id'], staff['id']])
        self.assertEqual([c['recordSubject']['name'] for c in changes], ['Casey Reed', 'Casey Morgan'])
        self.assertEqual([c['recordSubject']['id'] for c in changes], [staff['id'], staff['id']])

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

    def linked_staff(self):
        return self.staff(dict(firstName='Morgan', lastName='Example',
            login=dict(username='linked-employment', password='test-password')))

    def test_employment_editor_boundary_and_atomic_disable(self):
        unlinked = self.staff()
        save_staff_member(self.db, 2, self.tokens[2], dict(active=False, revision=unlinked['revision']), staff_id=unlinked['id'])
        linked = self.linked_staff()
        self.assertFalse(read_staff_member(self.db, 2, linked['id'])['canChangeEmploymentStatus'])
        before = self.snapshot()
        with self.assertRaises(PermissionError):
            save_staff_member(self.db, 2, self.tokens[2], dict(active=False, jobTitle='Forbidden', revision=linked['revision']), staff_id=linked['id'])
        self.assertEqual(self.snapshot(), before)
        # Ordinary employment details remain editable for linked Staff.
        save_staff_member(self.db, 2, self.tokens[2], dict(jobTitle='Technician', active=True, revision=linked['revision']), staff_id=linked['id'])
        account = linked['accountId']
        self.db.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest('employment-session'), account))
        self.db.execute("INSERT INTO account_email_proofs(account_id,purpose,token_hash,email,expires_at) VALUES(?,'verify','employment-proof','morgan@example.test',9999999999)", (account,))
        self.db.execute("INSERT INTO account_password_change_proofs VALUES(?,'password-proof','state',9999999999)", (account,))
        self.db.commit()
        self.staff(dict(active=False), staff_id=linked['id'])
        for table in ('account_sessions', 'account_email_proofs', 'account_password_change_proofs'):
            self.assertEqual(self.db.execute('SELECT count(*) FROM '+table+' WHERE account_id=?', (account,)).fetchone(), (0,))
        self.assertEqual(self.db.execute('SELECT active FROM accounts WHERE id=?', (account,)).fetchone(), (0,))
        with self.assertRaises(ValueError):
            set_account_active(self.db, 1, account, True)
        self.staff(dict(active=True), staff_id=linked['id'])
        self.assertEqual(self.db.execute('SELECT active FROM accounts WHERE id=?', (account,)).fetchone(), (0,))
        set_account_active(self.db, 1, account, True)
        self.assertEqual(self.db.execute('SELECT active FROM accounts WHERE id=?', (account,)).fetchone(), (1,))

    def test_employment_requires_staff_edit_even_for_administrator(self):
        linked = self.linked_staff()
        with patch('backend.staff_directory.can_access', return_value=False):
            with self.assertRaises(PermissionError):
                self.staff(dict(active=False), staff_id=linked['id'])
        self.assertTrue(read_staff_member(self.db, 1, linked['id'])['active'])

    def test_self_and_last_administrator_offboarding_roll_back(self):
        own = self.staff()
        self.db.execute('UPDATE staff_members SET account_id=1 WHERE id=?', (own['id'],))
        self.db.commit()
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, 'themselves'):
            self.staff(dict(active=False, jobTitle='Must Roll Back'), staff_id=own['id'])
        self.assertEqual(self.snapshot(), before)
        # A second actor with administrator authority still cannot remove the last active admin.
        with patch('backend.staff_directory._admin'), patch('backend.permissions._admin'):
            current = read_staff_member(self.db, 2, own['id'])
            with self.assertRaisesRegex(ValueError, 'last active administrator'):
                save_staff_member(self.db, 2, self.tokens[2], dict(active=False, revision=current['revision']), staff_id=own['id'])
        self.assertEqual(self.snapshot(), before)

    def test_offboarding_failure_rolls_back_account_and_proofs(self):
        linked = self.linked_staff()
        before = self.snapshot()
        with self.assertRaises(LookupError):
            self.staff(dict(active=False, departmentId='missing'), staff_id=linked['id'])
        self.assertEqual(self.snapshot(), before)

    def test_cannot_create_or_link_enabled_login_for_left_company(self):
        from backend.staff_identity import link_account_staff
        inactive = self.staff(dict(firstName='Former', lastName='Colleague', active=False))
        before = self.snapshot()
        with self.assertRaises(ValueError):
            self.staff(dict(username='must-not-exist', password='test-password'), staff_id=inactive['id'], login_only=True)
        self.assertEqual(self.snapshot(), before)
        with self.assertRaises(ValueError):
            self.staff(dict(firstName='Former', lastName='Colleague', active=False,
                login=dict(username='must-not-exist', password='test-password')))
        self.assertEqual(self.snapshot(), before)
        self.db.execute('BEGIN IMMEDIATE')
        with self.assertRaises(ValueError):
            link_account_staff(self.db, 3, staff_id=inactive['id'])
        self.db.rollback()
        self.assertEqual(self.snapshot(), before)

    def test_legacy_employment_reconciliation_is_safe_and_idempotent(self):
        linked = self.linked_staff()
        account = linked['accountId']
        self.db.execute('UPDATE staff_members SET active=0 WHERE id=?', (linked['id'],))
        self.db.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest('legacy-session'), account))
        self.db.commit()
        history = self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id').fetchall()
        initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT active FROM accounts WHERE id=?', (account,)).fetchone(), (0,))
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_sessions WHERE account_id=?', (account,)).fetchone(), (0,))
        self.assertEqual(self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id').fetchall()[:len(history)], history)
        reconciled = self.snapshot()
        initialise_database(self.db)
        self.assertEqual(self.snapshot(), reconciled)
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (31,))

    def test_legacy_last_administrator_conflict_stops_entire_upgrade(self):
        linked = self.linked_staff()
        own = self.staff()
        self.db.execute('UPDATE staff_members SET account_id=1,active=0 WHERE id=?', (own['id'],))
        self.db.execute('UPDATE staff_members SET active=0 WHERE id=?', (linked['id'],))
        self.db.commit()
        before = self.snapshot()
        with self.assertRaisesRegex(RuntimeError, 'product owner approval'):
            initialise_database(self.db)
        self.assertEqual(self.snapshot(), before)
