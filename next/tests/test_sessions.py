import sqlite3
import unittest
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user, set_permission
from backend.schema import initialise_database
from backend.sessions import (
    login_session, session_account, logout_session, revoke_account_sessions,
    SESSION_SECONDS,
)

class SessionTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.admin, self.secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.admin, code_at(self.secret, 59), timestamp=59)

    def tearDown(self):
        self.db.close()

    def test_admin_login_expiry_and_logout(self):
        self.assertIsNone(login_session(self.db, "owner", "password", now=59))
        token = login_session(
            self.db, "owner", "password", mfa_code=code_at(self.secret, 59), now=59
        )
        self.assertEqual(len(token), 64)
        self.assertEqual(session_account(self.db, token, now=60), self.admin)
        self.assertIsNone(session_account(self.db, token, now=59 + SESSION_SECONDS))
        self.assertNotEqual(self.db.execute(
            "SELECT token_hash FROM account_sessions"
        ).fetchone()[0], token)
        logout_session(self.db, token)
        self.assertIsNone(session_account(self.db, token, now=60))

    def test_revocation_and_deactivation(self):
        user = create_user(self.db, self.admin, "reader", "password")
        set_permission(self.db, self.admin, user, "Devices", "read")
        token = login_session(self.db, "reader", "password", now=59)
        self.assertEqual(session_account(self.db, token, now=60), user)
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (user,))
        self.db.commit()
        self.assertIsNone(session_account(self.db, token, now=60))
        revoke_account_sessions(self.db, user)
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM account_sessions WHERE account_id=?", (user,)
        ).fetchone()[0], 0)

    def test_bad_tokens_and_permission_change(self):
        user = create_user(self.db, self.admin, "reader", "password")
        token = login_session(self.db, "reader", "password", now=59)
        self.assertIsNone(session_account(self.db, "invalid", now=60))
        set_permission(self.db, self.admin, user, "Devices", "read")
        self.assertIsNone(session_account(self.db, token, now=60))
        fresh_token = login_session(self.db, "reader", "password", now=59)
        self.assertEqual(session_account(self.db, fresh_token, now=60), user)
        self.db.execute(
            "INSERT INTO account_permissions(account_id,section,level) VALUES(?,?,?)",
            (user, "IPAM", "edit"),
        )
        self.db.commit()
        self.assertIsNone(session_account(self.db, fresh_token, now=60))

if __name__ == "__main__":
    unittest.main()
