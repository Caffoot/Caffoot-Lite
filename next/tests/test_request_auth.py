import sqlite3
import unittest
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.request_auth import (
    login, csrf_for_session, authenticated_account, authorised_mutation, authorised_inventory_import, logout,
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


    def test_import_requires_authenticated_session_origin_and_csrf(self):
        authorise = lambda cookie, origin, proof, now=60: authorised_inventory_import(
            self.db, cookie, origin, ORIGIN, proof, now=now
        )
        self.assertEqual(authorise(self.cookie, ORIGIN, self.csrf), self.admin)
        self.assertIsNone(authorise("", ORIGIN, self.csrf))
        self.assertIsNone(authorise(self.cookie, "https://other.example", self.csrf))
        self.assertIsNone(authorise(self.cookie, ORIGIN, "0" * 64))
        self.assertIsNone(authorise(self.cookie, ORIGIN, self.csrf, now=50000))

    def test_import_denied_after_account_deactivation(self):
        self.assertEqual(authorised_inventory_import(
            self.db, self.cookie, ORIGIN, ORIGIN, self.csrf, now=60
        ), self.admin)
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (self.admin,))
        self.db.commit()
        self.assertIsNone(authorised_inventory_import(
            self.db, self.cookie, ORIGIN, ORIGIN, self.csrf, now=60
        ))

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
