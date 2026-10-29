import sqlite3
import unittest
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.request_auth import (
    login, csrf_for_session, authenticated_account, authorised_mutation, logout,
)
from backend.schema import initialise_database

ORIGIN = "https://inventory.example"

class RequestAuthenticationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.admin, code_at(secret, 59), timestamp=59)
        self.token = login(
            self.db, "192.0.2.200", "owner", "password",
            mfa_code=code_at(secret, 59), now=59,
        )
        self.cookie = COOKIE_NAME + "=" + self.token
        self.csrf = csrf_for_session(self.token)

    def tearDown(self):
        self.db.close()

    def test_session_bound_identity_and_mutation(self):
        self.assertEqual(authenticated_account(self.db, self.cookie, now=60), self.admin)
        self.assertEqual(authorised_mutation(
            self.db, self.cookie, ORIGIN, ORIGIN, self.csrf, now=60
        ), self.admin)
        self.assertIsNone(authorised_mutation(
            self.db, self.cookie, "https://attacker.example", ORIGIN, self.csrf, now=60
        ))
        self.assertIsNone(authorised_mutation(
            self.db, self.cookie, ORIGIN, ORIGIN, "0" * 64, now=60
        ))
        self.assertIsNone(authorised_mutation(
            self.db, self.cookie + "; " + self.cookie, ORIGIN, ORIGIN, self.csrf, now=60
        ))

    def test_logout_requires_csrf_and_revokes(self):
        self.assertFalse(logout(
            self.db, self.cookie, ORIGIN, ORIGIN, "0" * 64, now=60
        ))
        self.assertEqual(authenticated_account(self.db, self.cookie, now=60), self.admin)
        self.assertTrue(logout(
            self.db, self.cookie, ORIGIN, ORIGIN, self.csrf, now=60
        ))
        self.assertIsNone(authenticated_account(self.db, self.cookie, now=60))

    def test_invalid_login_and_expired_session(self):
        self.assertIsNone(login(self.db, "192.0.2.201", "owner", "wrong", now=59))
        self.assertIsNone(authorised_mutation(
            self.db, self.cookie, ORIGIN, ORIGIN, self.csrf, now=50000
        ))
        self.assertIsNone(csrf_for_session("invalid"))

if __name__ == "__main__":
    unittest.main()
