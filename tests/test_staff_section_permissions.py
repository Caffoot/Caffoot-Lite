"""Directory grants reuse the existing security model without widening import."""
import sqlite3
import unittest

from confirmed_permissions import set_permission
from enabled_inventory import enable_inventory_features
from backend.permissions import (
    can_access, can_replace_inventory, create_user, delete_user, set_administrator,
)
from backend.role_policy import assign_staff_member, evaluate_role_policy
from backend.roles import account_access_details, preview_role_change, confirm_role_change
from backend.schema import initialise_database
from backend.sessions import _digest, session_account
from backend.history_permissions import visible_change_history


DIRECTORY_SECTIONS = ('Staff Members', 'Departments', 'IT Assets')
INVENTORY_SECTIONS = ('Devices', 'IPAM', 'Racks')


class StaffSectionPermissionTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.db.execute('PRAGMA foreign_keys=ON')
        self.addCleanup(self.db.close)
        initialise_database(self.db)
        enable_inventory_features(self.db)
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'owner','hash',1,'TEST-ONLY-SECRET',1)")
        self.db.execute("INSERT INTO accounts(id,username,password_hash) VALUES(2,'staff','hash')")
        for account in (1, 2):
            assign_staff_member(self.db, account)
        self.token = 'a' * 64
        self.user_token = 'b' * 64
        self.db.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)', (_digest(self.token),))
        self.db.execute('INSERT INTO account_sessions VALUES(?,2,9999999999,1)', (_digest(self.user_token),))
        self.db.execute("INSERT INTO departments(id,name) VALUES('dept','IT')")
        self.db.execute("INSERT INTO staff_members(account_id,department_id) VALUES(2,'dept')")
        self.db.commit()

    def enrol(self):
        self.db.execute("UPDATE accounts SET mfa_secret='TEST-ONLY-SECRET',mfa_confirmed=1 WHERE id=2")
        self.db.commit()

    def role(self, key, grants, *, enabled=True):
        role_id = self.db.execute('INSERT INTO roles(role_key,name,enabled) VALUES(?,?,?)',
                                  (key, key.title(), int(enabled))).lastrowid
        self.db.executemany('INSERT INTO role_grants VALUES(?,?,?)',
                            [(role_id, section, level) for section, level in grants.items()])
        self.db.execute('INSERT INTO account_roles VALUES(2,?)', (role_id,))
        self.db.commit()
        return role_id

    def test_link_and_department_do_not_grant_access_or_change_staff_role(self):
        self.assertEqual(evaluate_role_policy(self.db, 2).permissions, {})
        details = account_access_details(self.db, 2)
        for section in DIRECTORY_SECTIONS:
            with self.subTest(section=section):
                self.assertFalse(can_access(self.db, 2, section))
                self.assertIsNone(details['sections'][section]['effective'])
        self.assertTrue(details['sections']['Staff Members']['featureEnabled'])
        self.assertTrue(details['sections']['Departments']['featureEnabled'])
        self.assertFalse(details['sections']['IT Assets']['featureEnabled'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM roles').fetchone(), (2,))
        self.assertEqual(self.db.execute("SELECT g.* FROM role_grants g JOIN roles r ON r.id=g.role_id WHERE r.role_key='staff_member'").fetchall(), [])
        self.assertEqual(self.db.execute("SELECT section,level FROM role_grants ORDER BY section").fetchall(), [('Devices', 'edit'), ('IPAM', 'edit'), ('Racks', 'edit')])

    def test_highest_enabled_grant_and_every_individual_override(self):
        self.enrol()
        self.role('readers', dict.fromkeys(DIRECTORY_SECTIONS, 'read'))
        self.role('editors', dict.fromkeys(DIRECTORY_SECTIONS, 'edit'))
        self.role('disabled', {'Devices': 'edit'}, enabled=False)
        for section in DIRECTORY_SECTIONS:
            for level, expected in (('deny', None), ('read', 'read'), ('edit', 'edit'), (None, 'edit')):
                with self.subTest(section=section, level=level):
                    set_permission(self.db, 1, 2, section, level)
                    details = account_access_details(self.db, 2)['sections'][section]
                    self.assertEqual(details['inherited'], 'edit')
                    self.assertEqual(details['effective'], expected)
                    self.assertEqual(evaluate_role_policy(self.db, 2).allows(section), expected is not None)
                    self.assertEqual(can_access(self.db, 2, section), expected is not None and section != 'IT Assets')
                    self.assertEqual(can_access(self.db, 2, section, edit=True), expected == 'edit' and section != 'IT Assets')
        self.assertFalse(can_access(self.db, 2, 'Devices'))

    def test_new_section_grants_require_mfa_and_invalidate_live_sessions(self):
        for section in DIRECTORY_SECTIONS:
            with self.subTest(section=section):
                self.db.execute('INSERT OR REPLACE INTO account_sessions VALUES(?,2,9999999999,1)', (_digest(self.user_token),))
                self.db.commit()
                set_permission(self.db, 1, 2, section, 'read')
                policy = evaluate_role_policy(self.db, 2)
                self.assertTrue(policy.mfa_mandatory)
                self.assertFalse(policy.allows(section))
                self.assertFalse(can_access(self.db, 2, section))
                self.assertIsNone(session_account(self.db, self.user_token, now=60))
                self.assertIsNone(self.db.execute('SELECT 1 FROM account_sessions WHERE account_id=2').fetchone())
                set_permission(self.db, 1, 2, section, None)
        self.enrol()
        self.role('directory_readers', {'Staff Members': 'read'})
        self.assertTrue(can_access(self.db, 2, 'Staff Members'))
        self.db.execute('UPDATE accounts SET active=0 WHERE id=2')
        self.db.commit()
        self.assertFalse(can_access(self.db, 2, 'Staff Members'))

    def test_admin_protection_unknown_sections_and_assets_feature_gate(self):
        for section in DIRECTORY_SECTIONS:
            set_permission(self.db, 1, 1, section, 'deny')
            self.assertEqual(can_access(self.db, 1, section, edit=True), section != 'IT Assets')
        self.assertFalse(can_access(self.db, 1, 'Unknown'))
        self.assertFalse(can_access(self.db, -1, 'Staff Members'))
        for column in ('mfa_confirmed', 'active'):
            self.db.execute(f'UPDATE accounts SET {column}=0 WHERE id=1')
            self.db.commit()
            self.assertFalse(can_access(self.db, 1, 'Staff Members'))
            self.db.execute(f'UPDATE accounts SET {column}=1 WHERE id=1')
            self.db.commit()
        with self.assertRaisesRegex(ValueError, 'themselves'):
            set_administrator(self.db, 1, 1, False)

    def test_directory_edit_never_grants_account_or_role_administration(self):
        self.enrol()
        self.role('directory_editors', dict.fromkeys(DIRECTORY_SECTIONS, 'edit'))
        self.assertTrue(can_access(self.db, 2, 'Staff Members', edit=True))
        before = list(self.db.iterdump())
        for operation in (
                lambda: create_user(self.db, 2, 'forbidden', 'password'),
                lambda: delete_user(self.db, 2, 1),
                lambda: set_administrator(self.db, 2, 2, True),
                lambda: preview_role_change(self.db, 2, self.user_token,
                    {'type': 'override.set', 'userId': 2, 'section': 'Devices', 'level': 'edit'}, now=60)):
            with self.assertRaises(PermissionError):
                operation()
            self.assertEqual(list(self.db.iterdump()), before)
        staff_role = self.db.execute("SELECT id FROM roles WHERE role_key='staff_member'").fetchone()[0]
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO role_grants VALUES(?,'Staff Members','edit')", (staff_role,))
        self.db.rollback()

    def test_role_preview_confirmation_accepts_new_sections_and_revokes_proofs(self):
        action = {'type': 'role.create', 'roleKey': 'directory_readers', 'name': 'Directory Readers',
                  'grants': dict.fromkeys(DIRECTORY_SECTIONS, 'read')}
        preview = preview_role_change(self.db, 1, self.token, action, now=60)
        self.assertIsNone(self.db.execute("SELECT 1 FROM roles WHERE role_key='directory_readers'").fetchone())
        result = confirm_role_change(self.db, 1, self.token, action, preview['proof'], now=61)
        self.assertEqual(result['status'], 'updated')
        role = self.db.execute("SELECT id FROM roles WHERE role_key='directory_readers'").fetchone()[0]
        self.db.execute("INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at) VALUES('proof',2,'recover','staff@example.test',9999999999)")
        self.db.commit()
        assignment = {'type': 'membership.assign', 'userId': 2, 'roleId': role}
        preview = preview_role_change(self.db, 1, self.token, assignment, now=62)
        self.assertTrue(preview['users'][0]['after']['mfaPending'])
        self.assertEqual(confirm_role_change(self.db, 1, self.token, assignment, preview['proof'], now=63)['status'], 'updated')
        self.assertIsNone(self.db.execute('SELECT 1 FROM account_sessions WHERE account_id=2').fetchone())
        self.assertIsNone(self.db.execute('SELECT 1 FROM account_email_proofs WHERE account_id=2').fetchone())

    def test_import_still_requires_exact_original_three_effective_edit_grants(self):
        self.enrol()
        for section in INVENTORY_SECTIONS:
            set_permission(self.db, 1, 2, section, 'edit')
        self.assertTrue(can_replace_inventory(self.db, 2))
        for section in DIRECTORY_SECTIONS:
            set_permission(self.db, 1, 2, section, 'deny')
        self.assertTrue(can_replace_inventory(self.db, 2))
        for section in DIRECTORY_SECTIONS:
            set_permission(self.db, 1, 2, section, 'edit')
        for section in INVENTORY_SECTIONS:
            for level in ('read', 'deny'):
                set_permission(self.db, 1, 2, section, level)
                self.assertFalse(can_replace_inventory(self.db, 2))
            set_permission(self.db, 1, 2, section, 'edit')
            feature = section.lower()
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            self.db.commit()
            self.assertFalse(can_replace_inventory(self.db, 2))
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))
            self.db.commit()
        self.assertTrue(can_replace_inventory(self.db, 2))
        self.db.execute('UPDATE accounts SET mfa_confirmed=0 WHERE id=2')
        self.db.commit()
        self.assertFalse(can_replace_inventory(self.db, 2))

    def test_inventory_history_keeps_complete_admin_access_and_directory_privacy(self):
        event = '{"reason":"Private security event","changes":[{"kind":"Account","label":"owner","fields":["Roles"]}]}'
        self.db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)', (event,))
        self.db.commit()
        self.assertEqual(visible_change_history(self.db, 1)[0]['reason'], 'Private security event')
        self.enrol()
        self.role('directory_only', dict.fromkeys(DIRECTORY_SECTIONS, 'edit'))
        self.assertEqual(visible_change_history(self.db, 2), [])
