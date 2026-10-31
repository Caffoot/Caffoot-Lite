import sqlite3
import unittest
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user, set_administrator, set_account_active, delete_user
from backend.schema import initialise_database

class AdministratorRolesTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.owner, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.owner, code_at(secret, 59), timestamp=59)
        self.other = create_user(self.db, self.owner, "second", "password")

    def tearDown(self):
        self.db.close()

    def test_promotion_requires_mfa(self):
        with self.assertRaisesRegex(ValueError, "MFA"):
            set_administrator(self.db, self.owner, self.other, True)

    def test_self_demote_and_admin_role_change(self):
        with self.assertRaisesRegex(ValueError, "themselves"):
            set_administrator(self.db, self.owner, self.owner, False)
        self.db.execute("UPDATE accounts SET mfa_secret='test',mfa_confirmed=1 WHERE id=?", (self.other,))
        self.db.commit()
        set_administrator(self.db, self.owner, self.other, True)
        set_administrator(self.db, self.owner, self.other, False)
        self.assertEqual(self.db.execute("SELECT is_admin FROM accounts WHERE id=?", (self.other,)).fetchone()[0], 0)

    def test_inactive_admin_cannot_manage_and_last_admin_survives(self):
        self.db.execute("UPDATE accounts SET mfa_secret='test',mfa_confirmed=1 WHERE id=?", (self.other,))
        self.db.commit()
        set_administrator(self.db, self.owner, self.other, True)
        set_account_active(self.db, self.owner, self.other, False)
        with self.assertRaises(PermissionError):
            delete_user(self.db, self.other, self.owner)
        self.assertEqual(self.db.execute("SELECT count(*) FROM accounts WHERE is_admin=1 AND active=1").fetchone()[0], 1)

if __name__ == "__main__":
    unittest.main()
