"""Existing-account enrolment and voluntary removal use fictional accounts."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.account_security import (
    start_required_mfa_enrolment, confirm_required_mfa_enrolment, remove_own_mfa,
)
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.authentication import MFAEnrolmentRequired
from backend.login_throttle import LoginThrottle
from backend.mfa import code_at
from backend.permissions import create_user, set_permission, set_administrator
from backend.request_auth import login
from backend.role_policy import evaluate_role_policy
from backend.schema import initialise_database
from backend.sessions import login_session, session_account


class RequiredMfaTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.admin, code_at(secret, 59), timestamp=59)
        self.user = create_user(self.db, self.admin, "worker", "password")
        self.throttle = LoginThrottle()
        self.throttle_patch = patch("backend.request_auth.THROTTLE", self.throttle)
        self.throttle_patch.start()

    def tearDown(self):
        self.throttle_patch.stop()
        self.db.close()

    def add_role(self, grants=()):
        role = self.db.execute(
            "INSERT INTO roles(role_key,name) VALUES('extra','Extra')",
        ).lastrowid
        self.db.execute("INSERT INTO account_roles VALUES(?,?)", (self.user, role))
        self.db.executemany("INSERT INTO role_grants VALUES(?,?,?)",
                            [(role, section, level) for section, level in grants])
        self.db.commit()
        return role

    def enrol(self):
        self.db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",
                        ("JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP", self.user))
        self.db.commit()
        return "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"

    def test_login_reports_setup_without_failure_or_session(self):
        set_permission(self.db, self.admin, self.user, "Devices", "read")
        for _ in range(7):
            with self.assertRaises(MFAEnrolmentRequired):
                login(self.db, "peer", "worker", "password", now=59)
        self.assertTrue(self.throttle.allowed("peer", "worker"))
        self.assertEqual(self.db.execute("SELECT count(*) FROM account_sessions").fetchone()[0], 0)
        self.assertIsNone(login(self.db, "peer", "worker", "wrong", now=59))
        self.assertEqual(len(self.throttle._failures[("peer", "worker")]), 1)

    def test_pending_secret_reused_and_confirm_revokes_sessions_with_safe_audit(self):
        stale = login_session(self.db, "worker", "password", now=59)
        self.add_role()
        name, secret = start_required_mfa_enrolment(self.db, " WORKER ", "password")
        self.assertEqual(name, "worker")
        self.assertEqual(start_required_mfa_enrolment(self.db, name, "password")[1], secret)
        self.assertIsNone(session_account(self.db, stale, now=59))
        with self.assertRaises(PermissionError):
            confirm_required_mfa_enrolment(self.db, name, "wrong", code_at(secret, 59), timestamp=59)
        confirm_required_mfa_enrolment(self.db, name, "password", code_at(secret, 59), timestamp=59)
        self.assertEqual(self.db.execute("SELECT count(*) FROM account_sessions").fetchone()[0], 0)
        self.assertIsNone(login_session(self.db, name, "password", now=59))
        self.assertIsNotNone(login_session(self.db, name, "password", mfa_code=code_at(secret, 59), now=59))
        event = self.db.execute("SELECT record_json FROM inventory_change_history ORDER BY id DESC").fetchone()[0]
        self.assertEqual(json.loads(event)["actorId"], self.user)
        self.assertNotIn(secret, event)
        self.assertNotIn("password", event)
        with self.assertRaises(PermissionError):
            start_required_mfa_enrolment(self.db, name, "password")

    def test_optional_disabled_unknown_and_already_confirmed_cannot_start(self):
        for username, password in (("worker", "password"), ("missing", "password"), ("worker", "wrong")):
            with self.subTest(username=username, password=password), self.assertRaises(PermissionError):
                start_required_mfa_enrolment(self.db, username, password)
        self.add_role()
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (self.user,))
        self.db.commit()
        with self.assertRaises(PermissionError):
            start_required_mfa_enrolment(self.db, "worker", "password")

    def test_inherited_read_and_individual_edit_both_allow_only_required_enrolment(self):
        role = self.add_role((("Devices", "read"),))
        for inherited in (True, False):
            with self.subTest(inherited=inherited):
                if not inherited:
                    self.db.execute("UPDATE roles SET enabled=0 WHERE id=?", (role,))
                    self.db.execute("INSERT INTO account_permission_overrides VALUES(?, 'Devices', 'edit')", (self.user,))
                    self.db.execute("UPDATE accounts SET mfa_confirmed=0,mfa_secret=NULL WHERE id=?", (self.user,))
                    self.db.commit()
                with self.assertRaises(MFAEnrolmentRequired):
                    login(self.db, "peer", "worker", "password", now=59)
                _, secret = start_required_mfa_enrolment(self.db, "worker", "password")
                confirm_required_mfa_enrolment(self.db, "worker", "password", code_at(secret, 59), timestamp=59)
                self.assertIsNotNone(login(self.db, "peer", "worker", "password", mfa_code=code_at(secret, 59), now=59))

    def test_confirmation_rechecks_role_and_account_changes(self):
        role = self.add_role()
        _, secret = start_required_mfa_enrolment(self.db, "worker", "password")
        for change, restore in (
            ("UPDATE roles SET enabled=0 WHERE id=?", "UPDATE roles SET enabled=1 WHERE id=?"),
            ("DELETE FROM account_roles WHERE role_id=?", "INSERT INTO account_roles VALUES(" + str(self.user) + ",?)"),
            ("UPDATE accounts SET active=0 WHERE id=?", "UPDATE accounts SET active=1 WHERE id=?"),
        ):
            target = self.user if "UPDATE accounts" in change else role
            self.db.execute(change, (target,))
            self.db.commit()
            with self.subTest(change=change), self.assertRaises(PermissionError):
                confirm_required_mfa_enrolment(self.db, "worker", "password", code_at(secret, 59), timestamp=59)
            self.assertEqual(self.db.execute("SELECT mfa_confirmed FROM accounts WHERE id=?", (self.user,)).fetchone()[0], 0)
            self.db.execute(restore, (target,))
            self.db.commit()
        self.db.execute("UPDATE accounts SET mfa_secret=NULL WHERE id=?", (self.user,))
        self.db.commit()
        with self.assertRaises(PermissionError):
            confirm_required_mfa_enrolment(self.db, "worker", "password", code_at(secret, 59), timestamp=59)

    def test_voluntary_removal_revokes_all_sessions_and_later_access_requires_setup(self):
        secret = self.enrol()
        tokens = [login_session(self.db, "worker", "password", mfa_code=code_at(secret, 59), now=59) for _ in range(2)]
        remove_own_mfa(self.db, self.user, "password", code_at(secret, 59), session_token=tokens[0], timestamp=59)
        self.assertEqual(self.db.execute("SELECT mfa_secret,mfa_confirmed FROM accounts WHERE id=?", (self.user,)).fetchone(), (None, 0))
        self.assertTrue(all(session_account(self.db, token, now=59) is None for token in tokens))
        self.assertIsNotNone(login_session(self.db, "worker", "password", now=59))
        self.add_role()
        self.assertTrue(evaluate_role_policy(self.db, self.user).mfa_mandatory)
        _, replacement = start_required_mfa_enrolment(self.db, "worker", "password")
        self.assertNotEqual(replacement, secret)
        confirm_required_mfa_enrolment(self.db, "worker", "password", code_at(replacement, 59), timestamp=59)

    def test_removal_requires_both_proofs_and_current_session(self):
        secret = self.enrol()
        token = login_session(self.db, "worker", "password", mfa_code=code_at(secret, 59), now=59)
        for password, code, session in (("wrong", code_at(secret, 59), token),
                                         ("password", "bad", token),
                                         ("password", "１２３４５６", token),
                                         ("password", code_at(secret, 59), "0" * 64)):
            with self.subTest(password=password, code=code), self.assertRaises(PermissionError):
                remove_own_mfa(self.db, self.user, password, code, session_token=session, timestamp=59)
            self.assertTrue(evaluate_role_policy(self.db, self.user).mfa_enrolled)
            self.assertEqual(session_account(self.db, token, now=59), self.user)

    def test_additional_roles_and_overrides_block_removal_until_explicitly_eligible(self):
        secret = self.enrol()
        token = login_session(self.db, "worker", "password", mfa_code=code_at(secret, 59), now=59)
        role = self.add_role()
        for grants in ((), (("Devices", "read"),)):
            self.db.executemany("INSERT INTO role_grants VALUES(?,?,?)", [(role, section, level) for section, level in grants])
            self.db.commit()
            with self.assertRaises(PermissionError):
                remove_own_mfa(self.db, self.user, "password", code_at(secret, 59), session_token=token, timestamp=59)
        self.db.execute("UPDATE roles SET enabled=0 WHERE id=?", (role,))
        self.db.commit()
        self.assertTrue(evaluate_role_policy(self.db, self.user).mfa_enrolled)
        for level in ("read", "edit"):
            self.db.execute("INSERT OR REPLACE INTO account_permission_overrides VALUES(?, 'Devices', ?)", (self.user, level))
            self.db.commit()
            with self.assertRaises(PermissionError):
                remove_own_mfa(self.db, self.user, "password", code_at(secret, 59), session_token=token, timestamp=59)
        self.db.execute("DELETE FROM account_permission_overrides WHERE account_id=?", (self.user,))
        self.db.commit()
        remove_own_mfa(self.db, self.user, "password", code_at(secret, 59), session_token=token, timestamp=59)
        self.assertEqual(self.db.execute("SELECT enabled FROM roles WHERE id=?", (role,)).fetchone()[0], 0)

    def test_administrator_promotion_still_requires_confirmed_mfa(self):
        with self.assertRaises(ValueError):
            set_administrator(self.db, self.admin, self.user, True)
        secret = self.enrol()
        set_administrator(self.db, self.admin, self.user, True)
        token = login_session(self.db, "worker", "password", mfa_code=code_at(secret, 59), now=59)
        with self.assertRaises(PermissionError):
            remove_own_mfa(self.db, self.user, "password", code_at(secret, 59), session_token=token, timestamp=59)

    def test_audit_failure_rolls_back_confirmation_and_removal(self):
        self.add_role()
        _, secret = start_required_mfa_enrolment(self.db, "worker", "password")
        with patch("backend.account_security.record_actor_event", side_effect=RuntimeError("audit failed")):
            with self.assertRaises(RuntimeError):
                confirm_required_mfa_enrolment(self.db, "worker", "password", code_at(secret, 59), timestamp=59)
        self.assertFalse(evaluate_role_policy(self.db, self.user).mfa_enrolled)
        self.db.execute("UPDATE roles SET enabled=0 WHERE role_key='extra'")
        self.db.commit()
        secret = self.enrol()
        token = login_session(self.db, "worker", "password", mfa_code=code_at(secret, 59), now=59)
        with patch("backend.account_security.record_actor_event", side_effect=RuntimeError("audit failed")):
            with self.assertRaises(RuntimeError):
                remove_own_mfa(self.db, self.user, "password", code_at(secret, 59), session_token=token, timestamp=59)
        self.assertEqual(session_account(self.db, token, now=59), self.user)
        self.assertTrue(evaluate_role_policy(self.db, self.user).mfa_enrolled)
