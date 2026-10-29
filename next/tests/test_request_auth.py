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


    def test_offline_import_requires_final_confirmation_and_preserves_accounts(self):
        import json
        from backend.import_service import replace_from_published_export
        from backend.inventory import reconstruct_inventory
        from test_import_review import fixture
        source = fixture()
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        raw = json.dumps(source).encode()
        args = dict(cookie_header=self.cookie, origin=ORIGIN,
                    allowed_origin=ORIGIN, csrf_header=self.csrf, now=60)
        before_accounts = self.db.execute("SELECT * FROM accounts").fetchall()
        with self.assertRaisesRegex(ValueError, "explicit confirmation"):
            replace_from_published_export(self.db, raw, **args)
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM inventory_devices"
        ).fetchone()[0], 0)
        with self.assertRaises(PermissionError):
            replace_from_published_export(
                self.db, raw, **dict(args, csrf_header="0" * 64),
                replacement_confirmed=True,
            )
        self.assertTrue(replace_from_published_export(
            self.db, raw, **args, replacement_confirmed=True
        ))
        self.assertEqual(
            reconstruct_inventory(self.db)["devices"][0]["name"], "PC"
        )
        self.assertEqual(
            self.db.execute("SELECT * FROM accounts").fetchall(),
            before_accounts,
        )

    def test_offline_import_rejects_untrusted_export_before_writing(self):
        import json
        from backend.import_service import replace_from_published_export
        from test_import_review import fixture
        source = fixture()
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        source["devices"][0]["primaryIp"] = "10.0.0.99"
        with self.assertRaises(ValueError):
            replace_from_published_export(
                self.db, json.dumps(source).encode(),
                cookie_header=self.cookie, origin=ORIGIN,
                allowed_origin=ORIGIN, csrf_header=self.csrf,
                replacement_confirmed=True, now=60,
            )
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM inventory_devices"
        ).fetchone()[0], 0)

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
