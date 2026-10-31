"""Offline first-admin setup safeguards; no login endpoints."""
import sqlite3
import unittest

from backend.accounts import (
    bootstrap_first_admin, confirm_admin_mfa, hash_password, verify_password,
)
from backend.mfa import code_at
from backend.schema import initialise_database


class FirstAdminTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)

    def tearDown(self):
        self.db.close()

    def test_passwords_are_salted_and_verified(self):
        a, b = hash_password("correct horse"), hash_password("correct horse")
        self.assertNotEqual(a, b)
        self.assertTrue(verify_password("correct horse", a))
        self.assertFalse(verify_password("wrong", a))
        self.assertFalse(verify_password("correct horse", "bad"))

    def test_first_admin_requires_mfa_confirmation(self):
        account_id, secret = bootstrap_first_admin(self.db, "ExampleAdmin", "password")
        row = self.db.execute(
            "SELECT username,is_admin,mfa_confirmed,password_hash FROM accounts WHERE id=?",
            (account_id,),
        ).fetchone()
        self.assertEqual(row[:3], ("ExampleAdmin", 1, 0))
        self.assertNotEqual(row[3], "password")
        with self.assertRaisesRegex(ValueError, "Invalid authenticator"):
            confirm_admin_mfa(self.db, account_id, "000000", timestamp=59)
        self.assertEqual(self.db.execute(
            "SELECT mfa_confirmed FROM accounts WHERE id=?", (account_id,)
        ).fetchone()[0], 0)
        confirm_admin_mfa(self.db, account_id, code_at(secret, 59), timestamp=59)
        self.assertEqual(self.db.execute(
            "SELECT mfa_confirmed FROM accounts WHERE id=?", (account_id,)
        ).fetchone()[0], 1)
        with self.assertRaisesRegex(ValueError, "already enrolled"):
            confirm_admin_mfa(self.db, account_id, code_at(secret, 59), timestamp=59)

    def test_no_second_bootstrap_even_with_case_variation(self):
        bootstrap_first_admin(self.db, "admin", "password")
        with self.assertRaisesRegex(ValueError, "already exists"):
            bootstrap_first_admin(self.db, "ADMIN", "password")
        self.assertEqual(self.db.execute("SELECT count(*) FROM accounts").fetchone()[0], 1)

    def test_invalid_bootstrap_does_not_create_account(self):
        with self.assertRaises(ValueError):
            bootstrap_first_admin(self.db, "", "password")
        with self.assertRaises(ValueError):
            bootstrap_first_admin(self.db, "admin", "")
        self.assertEqual(self.db.execute("SELECT count(*) FROM accounts").fetchone()[0], 0)

    def test_schema_upgrade_preserves_existing_inventory(self):
        self.db.execute(
            "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
            ("one", "Example", '{"id":"one"}', 0),
        )
        self.db.commit()
        initialise_database(self.db)
        self.assertEqual(self.db.execute("SELECT count(*) FROM inventory_devices").fetchone()[0], 1)
        self.assertEqual(self.db.execute("SELECT count(*) FROM accounts").fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main()
