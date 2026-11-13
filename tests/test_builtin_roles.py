"""Configurable built-ins preserve existing access, identity and MFA safeguards."""
import itertools
import sqlite3
import unittest
from pathlib import Path
from unittest.mock import patch

from backend import schema
from backend.account_security import start_required_mfa_enrolment, confirm_required_mfa_enrolment
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.authentication import MFAEnrolmentRequired
from backend.mfa import code_at
from backend.permissions import create_user, can_access
from backend.role_policy import evaluate_role_policy
from backend.roles import preview_role_change, confirm_role_change
from backend.sessions import login_session, session_account

SECTIONS = ("Devices", "IPAM", "Racks")


class BuiltinRoleMigrationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        with patch.object(schema, "SCHEMA_VERSION", 11):
            schema.initialise_database(self.db)

    def tearDown(self):
        self.db.close()

    def snapshot(self):
        return {name: self.db.execute('SELECT * FROM "' + name + '" ORDER BY rowid').fetchall()
                for name, in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")}

    def populate_matrix(self):
        self.db.execute("INSERT INTO roles VALUES(7,'support','Support',1,0)")
        self.db.execute("INSERT INTO roles VALUES(9,'paused','Paused',0,0)")
        self.db.executemany("INSERT INTO role_grants VALUES(?,?,?)",
                            [(7, "Devices", "edit"), (7, "IPAM", "read"), (9, "Racks", "edit")])
        choices = itertools.product(itertools.product((None, "deny", "read", "edit"), repeat=3),
                                    (0, 1), (0, 1), (0, 1))
        for account, (levels, admin, active, enrolled) in enumerate(choices, 1):
            self.db.execute("INSERT INTO accounts VALUES(?,?,?,?,?,?,?)",
                            (account, "fictional-" + str(account), "preserved-hash", admin,
                             "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP", enrolled, active))
            self.db.execute("INSERT INTO account_roles VALUES(?,1)", (account,))
            self.db.execute("INSERT INTO account_roles VALUES(?,?)", (account, 7 if account % 3 else 9))
            for section, level in zip(SECTIONS, levels):
                if level:
                    self.db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)", (account, section, level))
            self.db.execute("INSERT INTO account_sessions VALUES(?,?,9999,1)", (str(account), account))
            self.db.execute("INSERT INTO account_profiles(account_id,display_name) VALUES(?,?)", (account, "Fictional Person"))
            self.db.execute("INSERT INTO account_email_proofs VALUES(?,?,'verify','test@example.test',9999,?,0)",
                            (str(account), account, str(account)))
        self.db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('device','Preserved','{}',0)")
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES('{\"reason\":\"Preserved\"}')")
        self.db.commit()

    def test_active_matrix_preserves_exact_levels_and_only_adds_necessary_overrides(self):
        self.populate_matrix()
        before = self.snapshot()
        policies = {row[0]: evaluate_role_policy(self.db, row[0]) for row in before["accounts"]}
        expected = {(account, section): level for account, section, level in before["account_permission_overrides"]}
        for account, policy in policies.items():
            if policy.active and not policy.is_admin:
                for section in SECTIONS:
                    level = policy.permissions.get(section)
                    if level != "edit" and (account, section) not in expected:
                        expected[account, section] = level or "deny"
        schema.initialise_database(self.db)
        after = self.snapshot()
        role = self.db.execute("SELECT id FROM roles WHERE role_key='it_staff'").fetchone()[0]
        self.assertEqual(self.db.execute("SELECT account_id FROM account_roles WHERE role_id=? ORDER BY account_id", (role,)).fetchall(),
                         [(account,) for account, policy in policies.items() if policy.active])
        self.assertEqual({(account, section): level for account, section, level in after["account_permission_overrides"]}, expected)
        for table in before:
            if table not in ("schema_migrations", "roles", "role_grants", "account_roles", "account_permission_overrides", "account_sessions", "account_email_proofs"):
                self.assertEqual(after[table], before[table], table)
        for table in ("roles", "role_grants", "account_roles"):
            self.assertEqual([row for row in after[table] if (row[0] if table == "roles" else row[0] if table == "role_grants" else row[1]) != role], before[table], table)
        for account, policy in policies.items():
            after_policy = evaluate_role_policy(self.db, account)
            for section in SECTIONS:
                self.assertEqual("edit" if policy.is_admin else policy.permissions.get(section),
                                 "edit" if after_policy.is_admin else after_policy.permissions.get(section))
            self.assertEqual(after_policy.mfa_mandatory, True if policy.active else policy.mfa_mandatory)
        self.assertEqual([row[1] for row in after["account_sessions"]], [account for account, policy in policies.items() if not policy.active])
        self.assertEqual([row[1] for row in after["account_email_proofs"]], [account for account, policy in policies.items() if not policy.active])
        self.assertEqual(self.db.execute("PRAGMA foreign_key_check").fetchall(), [])
        self.assertEqual(self.db.execute("PRAGMA integrity_check").fetchone(), ("ok",))
        schema.initialise_database(self.db)
        self.assertEqual(self.snapshot(), after)

    def test_failure_after_assignment_restores_tables_triggers_sessions_and_proofs(self):
        self.populate_matrix()
        before = list(self.db.iterdump())
        original = schema.evaluate_role_policy

        def reject_new_role(connection, account):
            if connection.execute("SELECT 1 FROM roles WHERE role_key='it_staff'").fetchone():
                raise RuntimeError("Injected post-assignment failure")
            return original(connection, account)

        with patch.object(schema, "evaluate_role_policy", side_effect=reject_new_role):
            with self.assertRaisesRegex(RuntimeError, "post-assignment"):
                schema.initialise_database(self.db)
        self.assertEqual(list(self.db.iterdump()), before)

    def test_schema_ten_reaches_current_version_sequentially_and_preserves_legacy_levels(self):
        self.db.close()
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript((Path(__file__).parent / "fixtures/schema-v10.sql").read_text())
        for account, active in ((1, 1), (2, 0), (3, 1)):
            self.db.execute("INSERT INTO accounts(id,username,password_hash,active) VALUES(?,?,?,?)",
                            (account, str(account), "preserved-hash", active))
        self.db.execute("INSERT INTO account_permissions VALUES(1,'Devices','read')")
        self.db.execute("INSERT INTO account_permissions VALUES(2,'Racks','edit')")
        self.db.commit()
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute("SELECT version FROM schema_migrations ORDER BY version").fetchall(), [(n,) for n in range(1, schema.SCHEMA_VERSION + 1)])
        self.assertEqual(evaluate_role_policy(self.db, 1).permissions, {"Devices": "read"})
        self.assertEqual(evaluate_role_policy(self.db, 2).permissions, {"Racks": "edit"})
        self.assertEqual(evaluate_role_policy(self.db, 3).permissions, {})
        self.assertFalse(self.db.execute("SELECT 1 FROM account_roles a JOIN roles r ON r.id=a.role_id WHERE a.account_id=2 AND r.role_key='it_staff'").fetchone())

    def test_existing_custom_identity_collision_fails_without_reinterpretation(self):
        self.db.execute("INSERT INTO roles(role_key,name) VALUES('it_staff','Existing Custom Role')")
        self.db.commit()
        before = list(self.db.iterdump())
        with self.assertRaises(sqlite3.IntegrityError):
            schema.initialise_database(self.db)
        self.assertEqual(list(self.db.iterdump()), before)

    def test_upgrade_without_foreign_key_pragma_preserves_dependent_rows(self):
        self.db.execute("INSERT INTO accounts(id,username,password_hash) VALUES(1,'fictional','hash')")
        self.db.execute("INSERT INTO roles VALUES(7,'support','Support',1,0)")
        self.db.execute("INSERT INTO role_grants VALUES(7,'Devices','read')")
        self.db.executemany("INSERT INTO account_roles VALUES(1,?)", [(1,), (7,)])
        self.db.commit()
        self.db.execute("PRAGMA foreign_keys=OFF")
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute("SELECT * FROM role_grants WHERE role_id=7").fetchall(), [(7, "Devices", "read")])
        self.assertEqual(self.db.execute("SELECT * FROM account_roles WHERE role_id IN (1,7) ORDER BY role_id").fetchall(), [(1, 1), (1, 7)])
        self.assertEqual(self.db.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_configurable_builtin_constraints_and_staff_protections(self):
        schema.initialise_database(self.db)
        # A fictional future built-in exercises the general identity constraint only.
        role = self.db.execute("INSERT INTO roles(role_key,name,is_builtin) VALUES('test_builtin','Test Built-In',1)").lastrowid
        self.db.execute("UPDATE roles SET enabled=0 WHERE id=?", (role,))
        self.db.execute("INSERT INTO role_grants VALUES(?,'Devices','read')", (role,))
        for statement in (
            "UPDATE roles SET name='Changed' WHERE is_builtin=1",
            "UPDATE roles SET is_builtin=0 WHERE role_key='it_staff'",
            "UPDATE roles SET role_key='changed' WHERE role_key='it_staff'",
            "DELETE FROM roles WHERE role_key='it_staff'",
            "UPDATE roles SET name='it staff' WHERE role_key='it_staff'",
            "UPDATE roles SET name='Other Test' WHERE role_key='test_builtin'",
            "DELETE FROM roles WHERE role_key='test_builtin'",
            "UPDATE roles SET enabled=0 WHERE role_key='staff_member'",
            "DELETE FROM roles WHERE role_key='staff_member'",
            "INSERT INTO role_grants VALUES(1,'Devices','edit')",
        ):
            with self.subTest(statement=statement), self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(statement)


class BuiltinRoleAdministrationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        schema.initialise_database(self.db)
        self.owner, self.secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.owner, code_at(self.secret, 59), timestamp=59)
        self.token = login_session(self.db, "owner", "password", mfa_code=code_at(self.secret, 59), now=59)
        self.dave = create_user(self.db, self.owner, "dave", "password")
        self.tim = create_user(self.db, self.owner, "tim", "password")
        self.role = self.db.execute("SELECT id FROM roles WHERE role_key='it_staff'").fetchone()[0]

    def tearDown(self):
        self.db.close()

    def change(self, action):
        preview = preview_role_change(self.db, self.owner, self.token, action, now=60)
        result = confirm_role_change(self.db, self.owner, self.token, action, preview["proof"], now=61)
        self.assertEqual(result["status"], "updated")
        return preview

    def assign(self, account):
        return self.change({"type": "membership.assign", "roleId": self.role, "userId": account})

    def test_fresh_defaults_and_new_accounts_remain_staff_only(self):
        self.assertEqual(self.db.execute("SELECT role_key,name,enabled,is_builtin FROM roles ORDER BY id").fetchall(),
                         [("staff_member", "Staff Member", 1, 1), ("it_staff", "IT Staff", 1, 1)])
        self.assertEqual(dict(self.db.execute("SELECT section,level FROM role_grants WHERE role_id=?", (self.role,))), dict.fromkeys(SECTIONS, "edit"))
        self.assertFalse(self.db.execute("SELECT 1 FROM account_roles WHERE role_id=?", (self.role,)).fetchone())
        self.assertEqual(evaluate_role_policy(self.db, self.tim).permissions, {})
        self.assertFalse(evaluate_role_policy(self.db, self.tim).requires_mfa)

    def test_configurable_grants_disable_membership_and_dave_tim_overrides(self):
        self.assign(self.dave)
        self.assign(self.tim)
        for section in ("Devices", "Racks"):
            self.change({"type": "override.set", "userId": self.dave, "section": section, "level": "read"})
        self.assertEqual(evaluate_role_policy(self.db, self.dave).permissions, {"Devices": "read", "IPAM": "edit", "Racks": "read"})
        self.assertEqual(evaluate_role_policy(self.db, self.tim).permissions, dict.fromkeys(SECTIONS, "edit"))
        for enabled in (False, True):
            self.change({"type": "role.update", "roleId": self.role, "name": "IT Staff", "enabled": enabled, "grants": {"IPAM": "read"}})
            self.assertEqual(evaluate_role_policy(self.db, self.tim).permissions, {"IPAM": "read"} if enabled else {})
            self.assertEqual(evaluate_role_policy(self.db, self.dave).permissions.get("Devices"), "read")
        self.change({"type": "override.set", "userId": self.dave, "section": "Devices", "level": None})
        self.assertNotIn("Devices", evaluate_role_policy(self.db, self.dave).permissions)
        self.change({"type": "role.update", "roleId": self.role, "name": "IT Staff", "enabled": True, "grants": {}})
        self.assertTrue(evaluate_role_policy(self.db, self.tim).mfa_mandatory)
        self.change({"type": "membership.remove", "roleId": self.role, "userId": self.tim})
        self.assertFalse(evaluate_role_policy(self.db, self.tim).mfa_mandatory)
        for action in ({"type": "role.delete", "roleId": self.role},
                       {"type": "role.update", "roleId": self.role, "name": "Renamed", "enabled": True, "grants": {}},
                       {"type": "membership.remove", "roleId": 1, "userId": self.dave}):
            with self.assertRaises(ValueError):
                preview_role_change(self.db, self.owner, self.token, action, now=60)

    def test_assignment_revokes_session_and_requires_existing_enrolment_flow(self):
        token = login_session(self.db, "tim", "password", now=59)
        preview = self.assign(self.tim)
        self.assertTrue(preview["users"][0]["revokeSessions"])
        self.assertIsNone(session_account(self.db, token, now=61))
        with self.assertRaises(MFAEnrolmentRequired):
            login_session(self.db, "tim", "password", report_enrolment=True, now=61)
        self.assertFalse(any(can_access(self.db, self.tim, section) for section in SECTIONS))
        _, secret = start_required_mfa_enrolment(self.db, "tim", "password")
        confirm_required_mfa_enrolment(self.db, "tim", "password", code_at(secret, 59), timestamp=59)
        self.assertFalse(self.db.execute("SELECT 1 FROM account_sessions WHERE account_id=?", (self.tim,)).fetchone())
        self.assertTrue(login_session(self.db, "tim", "password", mfa_code=code_at(secret, 59), now=59))

    def test_upgrade_staff_only_requires_mfa_even_with_three_preserved_denials(self):
        # Recreate the accepted schema-11 starting point with real credentials.
        self.db.close()
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        with patch.object(schema, "SCHEMA_VERSION", 11):
            schema.initialise_database(self.db)
        owner, secret = bootstrap_first_admin(self.db, "old-owner", "password")
        confirm_admin_mfa(self.db, owner, code_at(secret, 59), timestamp=59)
        staff = create_user(self.db, owner, "old-staff", "password")
        token = login_session(self.db, "old-staff", "password", now=59)
        schema.initialise_database(self.db)
        policy = evaluate_role_policy(self.db, staff)
        self.assertEqual(policy.permissions, {})
        self.assertTrue(policy.mfa_mandatory)
        self.assertIsNone(session_account(self.db, token, now=60))
        with self.assertRaises(MFAEnrolmentRequired):
            login_session(self.db, "old-staff", "password", report_enrolment=True, now=60)
        self.assertEqual(dict(self.db.execute("SELECT section,level FROM account_permission_overrides WHERE account_id=?", (staff,))), dict.fromkeys(SECTIONS, "deny"))
        _, pending = start_required_mfa_enrolment(self.db, "old-staff", "password")
        confirm_required_mfa_enrolment(self.db, "old-staff", "password", code_at(pending, 59), timestamp=59)
        self.assertFalse(self.db.execute("SELECT 1 FROM account_sessions WHERE account_id=?", (staff,)).fetchone())
        self.assertTrue(login_session(self.db, "old-staff", "password", mfa_code=code_at(pending, 59), now=59))
        self.assertFalse(any(can_access(self.db, staff, section) for section in SECTIONS))
        new = create_user(self.db, owner, "new-staff", "password")
        self.assertEqual(self.db.execute("SELECT role_id FROM account_roles WHERE account_id=?", (new,)).fetchall(), [(1,)])
