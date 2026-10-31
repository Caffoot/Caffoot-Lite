"""Published v1.3.3 migration confirmation: existing review and cancellation gates.

Offline regression only. No new application workflow or production endpoint.
"""
import copy
import json
import sqlite3
import unittest

from backend.import_commit import (
    RestoreCancelled, prepare_restore_confirmation,
    restore_reviewed_export_offline,
)
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.schema import initialise_database
from test_published_access_point_handoff import published_backup


class MigrationConfirmationHandoffTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.baseline = {
            "devices": [{"id": "existing", "name": "Existing"}],
            "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
        }
        stage_inventory(self.db, self.baseline)
        self.before = reconstruct_inventory(self.db)

    def tearDown(self):
        self.db.close()

    def test_mounting_review_never_approves_or_writes(self):
        source = published_backup()
        original = copy.deepcopy(source)
        raw = json.dumps(source).encode()
        review = prepare_restore_confirmation(raw)
        self.assertTrue(review["requiresAccessPointMountReview"])
        self.assertNotIn("candidate", review)
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        self.assertEqual(source, original)
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_confirmation_without_mount_choice_is_cancelled(self):
        raw = json.dumps(published_backup()).encode()
        with self.assertRaises(RestoreCancelled):
            restore_reviewed_export_offline(self.db, raw, final_confirmed=True)
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_choice_without_final_confirmation_is_cancelled(self):
        raw = json.dumps(published_backup()).encode()
        with self.assertRaises(RestoreCancelled):
            restore_reviewed_export_offline(
                self.db, raw,
                access_point_choices=["Ceiling Mounted"],
                final_confirmed=False,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_invalid_mounting_choice_cannot_write(self):
        raw = json.dumps(published_backup()).encode()
        with self.assertRaises(ValueError):
            restore_reviewed_export_offline(
                self.db, raw, access_point_choices=["Rack Mounted"],
                final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_invalid_export_cannot_write_even_when_confirmed(self):
        source = published_backup()
        source["caffootBackup"]["appVersion"] = "1.3.2"
        with self.assertRaises(ValueError):
            restore_reviewed_export_offline(
                self.db, json.dumps(source).encode(), final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)


if __name__ == "__main__":
    unittest.main()
