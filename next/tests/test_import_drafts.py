"""Offline server-owned import draft regression coverage."""
import json
import sqlite3
import unittest

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.import_drafts import ImportDrafts
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.mfa import code_at
from backend.request_auth import login, csrf_for_session
from backend.schema import initialise_database
from test_import_review import fixture
from test_published_access_point_handoff import published_backup

ORIGIN = "https://inventory.example"


def export(source):
    data = dict(source)
    data["caffootBackup"] = {
        "format": "caffoot-inventory", "schemaVersion": 1,
        "app": "Caffoot Lite", "appVersion": "1.3.3",
        "exportedAt": "2026-10-29T12:00:00Z",
    }
    return json.dumps(data).encode()


class ImportDraftTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        admin, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, admin, code_at(secret, 59), timestamp=59)
        token = login(self.db, "192.0.2.200", "owner", "password",
                      mfa_code=code_at(secret, 59), now=59)
        self.cookie = COOKIE_NAME + "=" + token
        self.args = dict(cookie_header=self.cookie, origin=ORIGIN,
                         allowed_origin=ORIGIN,
                         csrf_header=csrf_for_session(token), now=60)
        self.drafts = ImportDrafts()

    def tearDown(self):
        self.db.close()

    def test_preview_confirmation_one_use_and_no_candidate_exposure(self):
        draft_id, preview = self.drafts.begin(self.db, export(fixture()), **self.args)
        self.assertNotIn("candidate", preview)
        self.assertFalse(preview["persistenceAllowed"])
        self.assertEqual(reconstruct_inventory(self.db)["devices"], [])
        with self.assertRaisesRegex(ValueError, "explicit confirmation"):
            self.drafts.confirm(self.db, draft_id, **self.args)
        self.assertTrue(self.drafts.confirm(
            self.db, draft_id, replacement_confirmed=True, **self.args
        ))
        self.assertEqual(reconstruct_inventory(self.db)["devices"][0]["name"], "PC")
        with self.assertRaisesRegex(ValueError, "Unknown or expired"):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True, **self.args
            )

    def test_cancel_and_stale_inventory_do_not_replace(self):
        draft_id, _ = self.drafts.begin(self.db, export(fixture()), **self.args)
        self.drafts.cancel(draft_id, cookie_header=self.cookie)
        with self.assertRaisesRegex(ValueError, "Unknown or expired"):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True, **self.args
            )
        draft_id, _ = self.drafts.begin(self.db, export(fixture()), **self.args)
        changed = fixture()
        changed["devices"][0]["name"] = "Concurrent change"
        stage_inventory(self.db, changed)
        with self.assertRaisesRegex(ValueError, "changed since import preview"):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True, **self.args
            )
        self.assertEqual(
            reconstruct_inventory(self.db)["devices"][0]["name"], "Concurrent change"
        )

    def test_session_and_csrf_binding(self):
        draft_id, _ = self.drafts.begin(self.db, export(fixture()), **self.args)
        with self.assertRaises(ValueError):
            self.drafts.cancel(
                draft_id, cookie_header=COOKIE_NAME + "=" + "a" * 64
            )
        with self.assertRaises(PermissionError):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True,
                **dict(self.args, csrf_header="invalid")
            )
        self.assertEqual(reconstruct_inventory(self.db)["devices"], [])

    def test_authenticated_cancel_rejects_bad_csrf_without_losing_draft(self):
        draft_id, _ = self.drafts.begin(self.db, export(fixture()), **self.args)
        with self.assertRaises(PermissionError):
            self.drafts.cancel_authenticated(
                self.db, draft_id, **dict(self.args, csrf_header="invalid")
            )
        self.assertTrue(self.drafts.confirm(
            self.db, draft_id, replacement_confirmed=True, **self.args
        ))

    def test_authenticated_cancel_revokes_draft(self):
        draft_id, _ = self.drafts.begin(self.db, export(fixture()), **self.args)
        self.drafts.cancel_authenticated(self.db, draft_id, **self.args)
        with self.assertRaisesRegex(ValueError, "Unknown or expired"):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True, **self.args
            )

    def test_access_point_review_does_not_reset_original_inventory_revision(self):
        draft_id, preview = self.drafts.begin(
            self.db, export(published_backup()), **self.args
        )
        self.assertTrue(preview["requiresAccessPointMountReview"])
        changed = fixture()
        changed["devices"][0]["name"] = "Other user's update"
        stage_inventory(self.db, changed)
        self.drafts.choose_access_point_mounts(
            self.db, draft_id, ["Ceiling Mounted"], **self.args
        )
        with self.assertRaisesRegex(ValueError, "changed since import preview"):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True, **self.args
            )
        self.assertEqual(
            reconstruct_inventory(self.db)["devices"][0]["name"],
            "Other user's update",
        )

    def test_access_point_choices_are_required_and_server_rebuilt(self):
        draft_id, preview = self.drafts.begin(
            self.db, export(published_backup()), **self.args
        )
        self.assertTrue(preview["requiresAccessPointMountReview"])
        with self.assertRaisesRegex(ValueError, "Access Point"):
            self.drafts.confirm(
                self.db, draft_id, replacement_confirmed=True, **self.args
            )
        with self.assertRaises(ValueError):
            self.drafts.choose_access_point_mounts(
                self.db, draft_id, ["Rack Mounted"], **self.args
            )
        reviewed = self.drafts.choose_access_point_mounts(
            self.db, draft_id, ["Ceiling Mounted"], **self.args
        )
        self.assertFalse(reviewed["requiresAccessPointMountReview"])
        self.assertTrue(self.drafts.confirm(
            self.db, draft_id, replacement_confirmed=True, **self.args
        ))
        device = reconstruct_inventory(self.db)["devices"][0]
        self.assertEqual(device["mountType"], "Ceiling Mounted")
        self.assertFalse(device.get("rackId"))


if __name__ == "__main__":
    unittest.main()
