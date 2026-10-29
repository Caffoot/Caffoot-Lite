import sqlite3
import unittest

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, verify_password
from backend.account_security import (
    change_own_password, begin_mfa_enrolment, complete_mfa_enrolment,
)
from backend.mfa import code_at, provisioning_uri
from backend.permissions import create_user, set_permission, can_access
from backend.schema import initialise_database


class AccountSecurityTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "admin", "original")
        confirm_admin_mfa(self.db, self.admin, code_at(secret, 59), timestamp=59)
        self.user = create_user(self.db, self.admin, "worker", "initial")

    def tearDown(self):
        self.db.close()

    def test_change_password_requires_current_password(self):
        with self.assertRaises(PermissionError):
            change_own_password(self.db, self.user, "wrong", "new")
        change_own_password(self.db, self.user, "initial", "new")
        stored = self.db.execute(
            "SELECT password_hash FROM accounts WHERE id=?", (self.user,)
        ).fetchone()[0]
        self.assertTrue(verify_password("new", stored))
        self.assertFalse(verify_password("initial", stored))

    def test_user_enrols_mfa_before_editor_permission(self):
        with self.assertRaises(ValueError):
            set_permission(self.db, self.admin, self.user, "Devices", "edit")
        with self.assertRaises(PermissionError):
            begin_mfa_enrolment(self.db, self.user, "wrong")
        secret = begin_mfa_enrolment(self.db, self.user, "initial")
        self.assertIn("otpauth://", provisioning_uri("worker", secret))
        with self.assertRaises(ValueError):
            complete_mfa_enrolment(self.db, self.user, "invalid", timestamp=59)
        self.assertFalse(can_access(self.db, self.user, "Devices", edit=True))
        complete_mfa_enrolment(self.db, self.user, code_at(secret, 59), timestamp=59)
        set_permission(self.db, self.admin, self.user, "Devices", "edit")
        self.assertTrue(can_access(self.db, self.user, "Devices", edit=True))

    def test_confirmed_mfa_cannot_be_overwritten(self):
        secret = begin_mfa_enrolment(self.db, self.user, "initial")
        complete_mfa_enrolment(self.db, self.user, code_at(secret, 59), timestamp=59)
        with self.assertRaisesRegex(ValueError, "already enrolled"):
            begin_mfa_enrolment(self.db, self.user, "initial")
        with self.assertRaises(ValueError):
            complete_mfa_enrolment(self.db, self.user, code_at(secret, 59), timestamp=59)

    def test_inactive_account_cannot_enrol_or_change_password(self):
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (self.user,))
        self.db.commit()
        with self.assertRaises(PermissionError):
            begin_mfa_enrolment(self.db, self.user, "initial")
        with self.assertRaises(PermissionError):
            change_own_password(self.db, self.user, "initial", "new")


if __name__ == "__main__":
    unittest.main()
