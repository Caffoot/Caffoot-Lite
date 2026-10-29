"""Issue #215: published legacy computer mounting decisions remain explicit.

Offline-only regression; no application API or additional workflow.
"""
import json
import sqlite3
import unittest

from backend.import_commit import (
    RestoreCancelled, prepare_restore_confirmation,
    restore_reviewed_export_offline,
)
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.schema import initialise_database


def published_legacy_export():
    return json.dumps({
        "caffootBackup": {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        },
        "devices": [{
            "id": "legacy-laptop", "name": "Laptop", "type": "Laptop",
            "mountType": "Rack Mounted", "location": "Racked",
            "notes": "preserve existing note",
        }],
        "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
    }).encode()


class LegacyReviewHandoffTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "existing", "name": "Existing"}],
            "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
        })
        self.before = reconstruct_inventory(self.db)
        self.raw = published_legacy_export()

    def tearDown(self):
        self.db.close()

    def test_preview_requires_existing_legacy_review_without_writing(self):
        review = prepare_restore_confirmation(self.raw)
        self.assertTrue(review["requiresLegacyMountReview"])
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        self.assertEqual(review["candidate"]["devices"][0]["notes"],
                         "preserve existing note")
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_final_confirmation_alone_cannot_skip_legacy_review(self):
        with self.assertRaisesRegex(RestoreCancelled, "Legacy mounting review"):
            restore_reviewed_export_offline(
                self.db, self.raw, final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_legacy_review_approval_without_final_confirmation_cannot_write(self):
        with self.assertRaises(RestoreCancelled):
            restore_reviewed_export_offline(
                self.db, self.raw,
                legacy_mount_approved=True, final_confirmed=False,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_approved_and_confirmed_migration_preserves_historical_fields(self):
        restore_reviewed_export_offline(
            self.db, self.raw,
            legacy_mount_approved=True, final_confirmed=True,
        )
        device = reconstruct_inventory(self.db)["devices"][0]
        self.assertEqual(device["id"], "legacy-laptop")
        self.assertEqual(device["mountType"], "Desktop")
        self.assertEqual(device["location"], "Unknown")
        self.assertEqual(device["notes"], "preserve existing note")


if __name__ == "__main__":
    unittest.main()
