import sqlite3
import unittest
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.account_security import change_own_password
from backend.mfa import code_at
from backend.permissions import create_user, set_permission, set_account_active, set_administrator
from backend.schema import initialise_database
from backend.sessions import login_session, session_account

class SessionInvalidationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "admin", "password")
        confirm_admin_mfa(self.db, self.admin, code_at(secret, 59), timestamp=59)
        self.user = create_user(self.db, self.admin, "user", "password")

    def tearDown(self):
        self.db.close()

    def login(self):
        return login_session(self.db, "user", "password", now=59)

    def test_password_change_revokes_sessions(self):
        token = self.login()
        change_own_password(self.db, self.user, "password", "new")
        self.assertIsNone(session_account(self.db, token, now=60))
        self.assertIsNone(login_session(self.db, "user", "password", now=59))
        self.assertIsNotNone(login_session(self.db, "user", "new", now=59))

    def test_permission_change_revokes_sessions(self):
        token = self.login()
        set_permission(self.db, self.admin, self.user, "Devices", "read")
        self.assertIsNone(session_account(self.db, token, now=60))

    def test_disable_revokes_sessions(self):
        token = self.login()
        set_account_active(self.db, self.admin, self.user, False)
        self.assertIsNone(session_account(self.db, token, now=60))
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM account_sessions WHERE account_id=?", (self.user,)
        ).fetchone()[0], 0)

    def test_role_change_revokes_sessions(self):
        token = self.login()
        with self.assertRaises(ValueError):
            set_administrator(self.db, self.admin, self.user, True)
        self.assertEqual(session_account(self.db, token, now=60), self.user)
        self.db.execute("UPDATE accounts SET mfa_secret='test',mfa_confirmed=1 WHERE id=?", (self.user,))
        self.db.commit()
        set_administrator(self.db, self.admin, self.user, True)
        self.assertIsNone(session_account(self.db, token, now=60))

if __name__ == "__main__":
    unittest.main()
