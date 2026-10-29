"""Concurrent inventory preview guard and safety snapshot invariants."""
import copy
import json
import sqlite3
import unittest

from backend.schema import initialise_database
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.import_commit import (
    StaleRestorePreview, inventory_preview_token,
    read_pre_restore_snapshot, restore_reviewed_export_offline,
)


def raw_backup(identifier):
    return json.dumps({
        "caffootBackup": {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        },
        "devices": [{"id": identifier, "name": identifier,
                     "type": "Router", "mountType": "Desktop",
                     "location": "Unknown"}],
        "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
    }).encode()


class RestoreConcurrencyTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "original", "name": "Original"}],
            "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
        })

    def tearDown(self):
        self.db.close()

    def test_preview_token_stable_across_dictionary_key_order(self):
        original = reconstruct_inventory(self.db)
        reversed_keys = dict(reversed(list(copy.deepcopy(original).items())))
        self.assertEqual(inventory_preview_token(original),
                         inventory_preview_token(reversed_keys))

    def test_matching_preview_can_commit_and_preserves_snapshot(self):
        before = reconstruct_inventory(self.db)
        restore_reviewed_export_offline(
            self.db, raw_backup("next"), final_confirmed=True,
            expected_inventory_token=inventory_preview_token(before),
        )
        self.assertEqual(read_pre_restore_snapshot(self.db), before)
        self.assertEqual(reconstruct_inventory(self.db)["devices"][0]["id"], "next")

    def test_stale_preview_refuses_restore_without_changing_snapshot(self):
        initial = reconstruct_inventory(self.db)
        token = inventory_preview_token(initial)
        restore_reviewed_export_offline(
            self.db, raw_backup("other"), final_confirmed=True,
            expected_inventory_token=token,
        )
        current = reconstruct_inventory(self.db)
        snapshot = read_pre_restore_snapshot(self.db)
        with self.assertRaises(StaleRestorePreview):
            restore_reviewed_export_offline(
                self.db, raw_backup("next"), final_confirmed=True,
                expected_inventory_token=token,
            )
        self.assertEqual(reconstruct_inventory(self.db), current)
        self.assertEqual(read_pre_restore_snapshot(self.db), snapshot)

    def test_malformed_token_fails_closed(self):
        current = reconstruct_inventory(self.db)
        with self.assertRaises(StaleRestorePreview):
            restore_reviewed_export_offline(
                self.db, raw_backup("next"), final_confirmed=True,
                expected_inventory_token="not-a-matching-token",
            )
        self.assertEqual(reconstruct_inventory(self.db), current)
        self.assertIsNone(read_pre_restore_snapshot(self.db))


if __name__ == "__main__":
    unittest.main()
