import sqlite3
import unittest
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.account_security import begin_mfa_enrolment, complete_mfa_enrolment
from backend.authentication import authenticate
from backend.mfa import code_at
from backend.permissions import create_user, set_permission
from backend.schema import initialise_database

class AuthenticationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "Owner", "admin-pass")
        self.admin_secret = secret

    def tearDown(self):
        self.db.close()

    def test_first_admin_requires_confirmed_mfa(self):
        self.assertIsNone(authenticate(self.db, "Owner", "admin-pass", timestamp=59))
        confirm_admin_mfa(self.db, self.admin, code_at(self.admin_secret, 59), timestamp=59)
        self.assertIsNone(authenticate(self.db, "Owner", "admin-pass", timestamp=59))
        self.assertIsNone(authenticate(self.db, "Owner", "wrong", mfa_code=code_at(self.admin_secret, 59), timestamp=59))
        self.assertEqual(authenticate(self.db, "owner", "admin-pass", mfa_code=code_at(self.admin_secret, 59), timestamp=59), self.admin)

    def test_read_only_optional_mfa_and_editor_required(self):
        confirm_admin_mfa(self.db, self.admin, code_at(self.admin_secret, 59), timestamp=59)
        viewer = create_user(self.db, self.admin, "Viewer", "view-pass")
        set_permission(self.db, self.admin, viewer, "Devices", "read")
        self.assertEqual(authenticate(self.db, "viewer", "view-pass"), viewer)
        secret = begin_mfa_enrolment(self.db, viewer, "view-pass")
        complete_mfa_enrolment(self.db, viewer, code_at(secret, 59), timestamp=59)
        set_permission(self.db, self.admin, viewer, "Devices", "edit")
        self.assertIsNone(authenticate(self.db, "viewer", "view-pass", timestamp=59))
        self.assertEqual(authenticate(self.db, "viewer", "view-pass", mfa_code=code_at(secret, 59), timestamp=59), viewer)

    def test_unknown_inactive_and_invalid_password(self):
        confirm_admin_mfa(self.db, self.admin, code_at(self.admin_secret, 59), timestamp=59)
        viewer = create_user(self.db, self.admin, "Viewer", "view-pass")
        self.assertIsNone(authenticate(self.db, "missing", "view-pass"))
        self.assertIsNone(authenticate(self.db, "viewer", "bad"))
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (viewer,))
        self.db.commit()
        self.assertIsNone(authenticate(self.db, "viewer", "view-pass"))

if __name__ == "__main__":
    unittest.main()
