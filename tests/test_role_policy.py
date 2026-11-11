"""Shared access, sign-in and recovery rules for roles and individual choices."""
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.account_email import confirm_email_proof, issue_email_proof
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, verify_password
from backend.authentication import authenticate
from backend.mfa import code_at
from backend.permissions import can_access, create_user, set_permission
from backend.role_policy import evaluate_role_policy
from backend.schema import initialise_database
from backend.sessions import login_session, session_account


class RolePolicyTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.db = sqlite3.connect(Path(self.temporary.name) / "fictional.sqlite3")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        self.owner, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.owner, code_at(secret, 59), timestamp=59)
        self.user = create_user(self.db, self.owner, "staff", "password")
        self.secret = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"

    def tearDown(self):
        self.db.close()
        self.temporary.cleanup()

    def enrol(self):
        self.db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (self.secret, self.user))
        self.db.commit()

    def role(self, key, grants=(), *, enabled=True):
        role_id = self.db.execute(
            "INSERT INTO roles(role_key,name,enabled) VALUES(?,?,?)", (key, key.title(), int(enabled)),
        ).lastrowid
        self.db.execute("INSERT INTO account_roles VALUES(?,?)", (self.user, role_id))
        self.db.executemany("INSERT INTO role_grants VALUES(?,?,?)", [(role_id, section, level) for section, level in grants])
        self.db.commit()
        return role_id

    def test_staff_baseline_and_voluntary_mfa(self):
        policy = evaluate_role_policy(self.db, self.user)
        self.assertEqual(policy.permissions, {})
        self.assertFalse(policy.requires_mfa)
        self.assertEqual(authenticate(self.db, "staff", "password"), self.user)
        self.assertFalse(any(can_access(self.db, self.user, section) for section in ("Devices", "IPAM", "Racks")))
        self.enrol()
        self.assertTrue(evaluate_role_policy(self.db, self.user).requires_mfa)
        self.assertIsNone(authenticate(self.db, "staff", "password", timestamp=59))
        self.assertEqual(authenticate(self.db, "staff", "password", mfa_code=code_at(self.secret, 59), timestamp=59), self.user)

    def test_multiple_enabled_roles_take_maximum_grant(self):
        self.enrol()
        self.role("editors", [("Devices", "edit"), ("Racks", "read")])
        self.role("readers", [("Devices", "read"), ("IPAM", "read")])
        self.role("disabled", [("IPAM", "edit")], enabled=False)
        policy = evaluate_role_policy(self.db, self.user)
        self.assertEqual(policy.permissions, {"Devices": "edit", "IPAM": "read", "Racks": "read"})
        self.assertTrue(can_access(self.db, self.user, "Devices", edit=True))
        self.assertFalse(can_access(self.db, self.user, "IPAM", edit=True))

    def test_individual_deny_read_edit_and_inherit_supersede_roles(self):
        self.enrol()
        self.role("editors", [("Devices", "edit"), ("IPAM", "read")])
        for level, read, edit in (("deny", False, False), ("read", True, False), ("edit", True, True), (None, True, True)):
            with self.subTest(level=level):
                set_permission(self.db, self.owner, self.user, "Devices", level)
                self.assertEqual(can_access(self.db, self.user, "Devices"), read)
                self.assertEqual(can_access(self.db, self.user, "Devices", edit=True), edit)
        set_permission(self.db, self.owner, self.user, "IPAM", "edit")
        self.assertTrue(can_access(self.db, self.user, "IPAM", edit=True))

    def test_empty_additional_role_requires_mfa_and_disabled_role_does_not(self):
        role_id = self.role("additional")
        self.assertTrue(evaluate_role_policy(self.db, self.user).requires_mfa)
        self.assertIsNone(authenticate(self.db, "staff", "password"))
        self.db.execute("UPDATE roles SET enabled=0 WHERE id=?", (role_id,))
        self.db.commit()
        self.assertFalse(evaluate_role_policy(self.db, self.user).requires_mfa)
        self.assertEqual(authenticate(self.db, "staff", "password"), self.user)

    def test_read_requires_mfa_from_override_or_inherited_grant(self):
        for inherited in (False, True):
            with self.subTest(inherited=inherited):
                if inherited:
                    set_permission(self.db, self.owner, self.user, "Devices", None)
                    self.role("readers", [("Devices", "read")])
                else:
                    set_permission(self.db, self.owner, self.user, "Devices", "read")
                policy = evaluate_role_policy(self.db, self.user)
                self.assertEqual(policy.permissions, {"Devices": "read"})
                self.assertTrue(policy.requires_mfa)
                self.assertFalse(can_access(self.db, self.user, "Devices"))
                self.assertIsNone(login_session(self.db, "staff", "password", now=59))
        self.enrol()
        self.assertTrue(can_access(self.db, self.user, "Devices"))
        self.assertIsNone(login_session(self.db, "staff", "password", now=59))
        token = login_session(self.db, "staff", "password", mfa_code=code_at(self.secret, 59), now=59)
        self.assertEqual(session_account(self.db, token, now=60), self.user)

    def test_existing_session_rechecks_additional_role_and_read_policy(self):
        token = login_session(self.db, "staff", "password", now=59)
        role_id = self.role("readers", [("Devices", "read")])
        self.assertIsNone(session_account(self.db, token, now=60))
        self.db.execute("UPDATE roles SET enabled=0 WHERE id=?", (role_id,))
        self.db.commit()
        self.assertEqual(session_account(self.db, token, now=60), self.user)
        self.db.execute("INSERT INTO account_permission_overrides VALUES(?, 'IPAM', 'read')", (self.user,))
        self.db.commit()
        self.assertIsNone(session_account(self.db, token, now=60))

    def test_inactive_unknown_and_new_sections_fail_closed(self):
        self.enrol()
        self.role("editors", [("Devices", "edit"), ("Unknown", "edit")])
        self.db.execute("INSERT INTO account_permission_overrides VALUES(?, 'Unknown', 'edit')", (self.user,))
        self.db.commit()
        self.assertNotIn("Unknown", evaluate_role_policy(self.db, self.user).permissions)
        self.assertFalse(can_access(self.db, self.user, "Unknown"))
        self.assertFalse(can_access(self.db, self.owner, "Unknown"))
        with patch("backend.role_policy.SECTIONS", ("Devices", "IPAM", "Racks", "People")):
            self.assertFalse(can_access(self.db, self.user, "People"))
            self.db.execute("INSERT INTO role_grants VALUES(2,'People','read')")
            self.assertTrue(can_access(self.db, self.user, "People"))
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (self.user,))
        self.db.commit()
        self.assertFalse(can_access(self.db, self.user, "Devices", edit=True))
        self.assertIsNone(authenticate(self.db, "staff", "password", mfa_code=code_at(self.secret, 59), timestamp=59))
        self.assertFalse(can_access(self.db, -1, "Devices"))

    def test_administrator_is_independent_and_requires_mfa(self):
        set_permission(self.db, self.owner, self.owner, "Devices", "deny")
        self.assertTrue(can_access(self.db, self.owner, "Devices", edit=True))
        self.db.execute("UPDATE accounts SET mfa_confirmed=0 WHERE id=?", (self.owner,))
        self.db.commit()
        self.assertFalse(can_access(self.db, self.owner, "Devices"))

    def test_legacy_table_cannot_supply_access_or_receive_permission_writes(self):
        self.db.execute("INSERT INTO account_permissions VALUES(?, 'Devices', 'edit')", (self.user,))
        self.db.commit()
        historical = self.db.execute("SELECT * FROM account_permissions").fetchall()

        def reject_legacy_authority(action, table, *unused):
            if table == "account_permissions" and action in (sqlite3.SQLITE_READ, sqlite3.SQLITE_INSERT, sqlite3.SQLITE_UPDATE, sqlite3.SQLITE_DELETE):
                return sqlite3.SQLITE_DENY
            return sqlite3.SQLITE_OK

        self.db.set_authorizer(reject_legacy_authority)
        try:
            self.assertFalse(can_access(self.db, self.user, "Devices"))
            token = login_session(self.db, "staff", "password", now=59)
            self.assertEqual(session_account(self.db, token, now=60), self.user)
            set_permission(self.db, self.owner, self.user, "Devices", "read")
            self.assertIsNone(authenticate(self.db, "staff", "password", timestamp=59))
            set_permission(self.db, self.owner, self.user, "Devices", None)
            self.assertFalse(can_access(self.db, self.user, "Devices"))
        finally:
            self.db.set_authorizer(None)
        self.assertEqual(self.db.execute("SELECT * FROM account_permissions").fetchall(), historical)

    def test_recovery_uses_the_same_role_and_mfa_policy(self):
        self.db.execute("INSERT INTO account_profiles(account_id,email,email_verified) VALUES(?, 'staff@example.test',1)", (self.user,))
        self.db.commit()
        self.role("readers", [("Devices", "read")])
        proof, _, challenge = issue_email_proof(self.db, self.user, "recover", now=59)
        with self.assertRaises(ValueError):
            confirm_email_proof(self.db, proof, "recover", challenge_id=challenge, password="changed", now=59)
        password_hash = self.db.execute("SELECT password_hash FROM accounts WHERE id=?", (self.user,)).fetchone()[0]
        self.assertTrue(verify_password("password", password_hash))
        self.enrol()
        with self.assertRaises(ValueError):
            confirm_email_proof(self.db, proof, "recover", challenge_id=challenge, password="changed", now=59)
        self.db.set_authorizer(lambda action, table, *unused: sqlite3.SQLITE_DENY if table == "account_permissions" else sqlite3.SQLITE_OK)
        try:
            self.assertEqual(confirm_email_proof(
                self.db, proof, "recover", challenge_id=challenge, password="changed",
                mfa_code=code_at(self.secret, 59), now=59,
            ), self.user)
        finally:
            self.db.set_authorizer(None)
        self.assertEqual(self.db.execute("SELECT mfa_secret,mfa_confirmed FROM accounts WHERE id=?", (self.user,)).fetchone(), (self.secret, 1))
