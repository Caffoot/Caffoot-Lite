"""Security and persistence regressions for optional Caffoot Lite profiles."""
import base64
import sqlite3
import unittest

from backend.accounts import hash_password
from backend.profiles import (
    read_profile, read_profile_photo, remove_profile_photo,
    save_profile, save_profile_photo, MAX_PHOTO_BYTES,
)
from backend.schema import initialise_database


# Valid, minimal 1×1 PNG; this test deliberately avoids image libraries.
PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j"
    "5l8AAAAASUVORK5CYII="
)


class ProfileTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        for account_id, name, admin, mfa in [
            (1, "admin", 1, 1), (2, "colleague", 0, 0), (3, "other", 0, 0),
        ]:
            self.db.execute(
                "INSERT INTO accounts(id,username,password_hash,is_admin,"
                "mfa_secret,mfa_confirmed) VALUES(?,?,?,?,?,?)",
                (account_id, name, hash_password("Test-Passphrase!"), admin,
                 "STABLEMFASECRET" if mfa else None, mfa),
            )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def details(self, email="user@example.test", display="Display Name"):
        return {
            "firstName": "First", "lastName": "Last",
            "displayName": display, "email": email,
        }

    def test_optional_defaults_and_account_identity_unchanged(self):
        result = read_profile(self.db, 2)
        self.assertEqual(result["username"], "colleague")
        self.assertEqual(result["firstName"], "")
        self.assertFalse(result["hasPhoto"])
        self.assertFalse(result["emailVerified"])
        updated = save_profile(self.db, 2, self.details())
        self.assertEqual(updated["displayName"], "Display Name")
        self.assertEqual(self.db.execute(
            "SELECT username,is_admin,mfa_confirmed FROM accounts WHERE id=2"
        ).fetchone(), ("colleague", 0, 0))
        initialise_database(self.db)
        self.assertEqual(read_profile(self.db, 2)["firstName"], "First")

    def test_email_change_invalidates_existing_verification(self):
        save_profile(self.db, 2, self.details())
        self.db.execute(
            "UPDATE account_profiles SET email_verified=1 WHERE account_id=2"
        )
        self.db.commit()
        save_profile(self.db, 2, self.details())
        self.assertTrue(read_profile(self.db, 2)["emailVerified"])
        save_profile(self.db, 2, self.details("new@example.test"))
        self.assertFalse(read_profile(self.db, 2)["emailVerified"])

    def test_admin_access_and_cross_user_restrictions(self):
        save_profile(self.db, 2, self.details())
        with self.assertRaises(PermissionError):
            read_profile(self.db, 3, 2)
        with self.assertRaises(PermissionError):
            save_profile(self.db, 3, self.details(), 2)
        self.assertEqual(read_profile(self.db, 1, 2)["firstName"], "First")
        save_profile(self.db, 1, self.details(display="Admin saved"), 2)
        self.assertEqual(read_profile(self.db, 2)["displayName"], "Admin saved")

    def test_reject_invalid_fields_without_partial_saving(self):
        for invalid in (
            {"firstName": "A"},
            self.details(email="bad address"),
            self.details(display="A" * 121),
            dict(self.details(), firstName="bad\\nname"),
        ):
            with self.assertRaises(ValueError):
                save_profile(self.db, 2, invalid)
        self.assertEqual(read_profile(self.db, 2)["firstName"], "")

    def test_profile_photo_saved_privately_and_removed(self):
        save_profile_photo(self.db, 2, "image/png", PNG)
        self.assertTrue(read_profile(self.db, 2)["hasPhoto"])
        self.assertEqual(read_profile_photo(self.db, 2), ("image/png", PNG))
        with self.assertRaises(PermissionError):
            read_profile_photo(self.db, 3, 2)
        remove_profile_photo(self.db, 2)
        self.assertFalse(read_profile(self.db, 2)["hasPhoto"])

    def test_invalid_image_format_and_size_rejected(self):
        with self.assertRaises(ValueError):
            save_profile_photo(self.db, 2, "image/svg+xml", b"<svg></svg>")
        with self.assertRaises(ValueError):
            save_profile_photo(self.db, 2, "image/png", b"not a photo")
        with self.assertRaises(ValueError):
            save_profile_photo(self.db, 2, "image/png", PNG + b"X" * MAX_PHOTO_BYTES)
        self.assertFalse(read_profile(self.db, 2)["hasPhoto"])


if __name__ == "__main__":
    unittest.main()
