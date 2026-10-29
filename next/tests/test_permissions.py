import sqlite3
import unittest

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import (
    create_user, set_permission, can_access, can_replace_inventory, set_account_active, delete_user,
)
from backend.schema import initialise_database


class PermissionsTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "Owner", "secret")
        confirm_admin_mfa(self.db, self.admin, code_at(secret, 59), timestamp=59)

    def tearDown(self):
        self.db.close()


    def test_full_inventory_replacement_requires_all_section_edit_permissions(self):
        self.assertTrue(can_replace_inventory(self.db, self.admin))
        user = create_user(self.db, self.admin, "importer", "secret")
        self.assertFalse(can_replace_inventory(self.db, user))
        self.db.execute(
            "UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",
            ("TEST-ONLY-SECRET", user),
        )
        self.db.commit()
        for section in ("Devices", "IPAM"):
            set_permission(self.db, self.admin, user, section, "edit")
        self.assertFalse(can_replace_inventory(self.db, user))
        set_permission(self.db, self.admin, user, "Racks", "read")
        self.assertFalse(can_replace_inventory(self.db, user))
        set_permission(self.db, self.admin, user, "Racks", "edit")
        self.assertTrue(can_replace_inventory(self.db, user))
        set_permission(self.db, self.admin, user, "IPAM", None)
        self.assertFalse(can_replace_inventory(self.db, user))

    def test_inactive_or_unverified_admin_cannot_replace_inventory(self):
        self.assertTrue(can_replace_inventory(self.db, self.admin))
        self.db.execute(
            "UPDATE accounts SET mfa_confirmed=0 WHERE id=?", (self.admin,)
        )
        self.db.commit()
        self.assertFalse(can_replace_inventory(self.db, self.admin))
        self.db.execute(
            "UPDATE accounts SET mfa_confirmed=1,active=0 WHERE id=?",
            (self.admin,),
        )
        self.db.commit()
        self.assertFalse(can_replace_inventory(self.db, self.admin))
        self.assertFalse(can_replace_inventory(self.db, -1))

    def test_default_no_access_and_section_scoping(self):
        user = create_user(self.db, self.admin, "viewer", "secret")
        self.assertFalse(can_access(self.db, user, "Devices"))
        set_permission(self.db, self.admin, user, "Devices", "read")
        self.assertTrue(can_access(self.db, user, "Devices"))
        self.assertFalse(can_access(self.db, user, "IPAM"))
        self.assertFalse(can_access(self.db, user, "Devices", edit=True))

    def test_edit_requires_mfa_and_removal(self):
        user = create_user(self.db, self.admin, "editor", "secret")
        with self.assertRaisesRegex(ValueError, "MFA"):
            set_permission(self.db, self.admin, user, "Racks", "edit")
        self.db.execute(
            "UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",
            ("TEST-ONLY-SECRET", user),
        )
        self.db.commit()
        set_permission(self.db, self.admin, user, "Racks", "edit")
        self.assertTrue(can_access(self.db, user, "Racks", edit=True))
        set_permission(self.db, self.admin, user, "Racks", None)
        self.assertFalse(can_access(self.db, user, "Racks"))

    def test_only_verified_admin_can_manage(self):
        user = create_user(self.db, self.admin, "viewer", "secret")
        with self.assertRaises(PermissionError):
            create_user(self.db, user, "other", "secret")
        with self.assertRaises(PermissionError):
            set_permission(self.db, user, user, "IPAM", "read")

    def test_self_protection_and_disable(self):
        user = create_user(self.db, self.admin, "viewer", "secret")
        with self.assertRaisesRegex(ValueError, "themselves"):
            delete_user(self.db, self.admin, self.admin)
        with self.assertRaisesRegex(ValueError, "themselves"):
            set_account_active(self.db, self.admin, self.admin, False)
        set_account_active(self.db, self.admin, user, False)
        self.assertFalse(can_access(self.db, user, "Devices"))
        delete_user(self.db, self.admin, user)
        self.assertEqual(self.db.execute("SELECT count(*) FROM accounts").fetchone()[0], 1)

    def test_invalid_section_does_not_change_permissions(self):
        user = create_user(self.db, self.admin, "viewer", "secret")
        with self.assertRaises(ValueError):
            set_permission(self.db, self.admin, user, "Unknown", "read")
        self.assertFalse(can_access(self.db, user, "Unknown"))


if __name__ == "__main__":
    unittest.main()
