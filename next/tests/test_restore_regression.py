"""Consolidated offline import approval and recovery regression coverage."""
import copy
import json
import sqlite3
import unittest

from backend.schema import initialise_database
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.import_commit import (
    RestoreCancelled, prepare_restore_confirmation,
    read_pre_restore_snapshot, restore_reviewed_export_offline,
)


def export(devices):
    return json.dumps({
        "caffootBackup": {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        },
        "devices": devices, "racks": [], "subnets": [], "vlans": [],
        "ipAllocations": {},
    }).encode()


class OfflineRestoreRegressionTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "original", "name": "Original"}],
            "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
            "historicalSetting": {"retained": [1, 2]},
        })
        self.original = reconstruct_inventory(self.db)
        self.db.execute(
            "CREATE TABLE user_accounts (id TEXT PRIMARY KEY, role TEXT NOT NULL)"
        )
        self.db.execute(
            "INSERT INTO user_accounts VALUES ('admin','admin')"
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def accounts(self):
        return self.db.execute("SELECT id,role FROM user_accounts").fetchall()

    def test_legacy_review_decline_and_final_cancel_are_read_only(self):
        raw = export([{
            "id": "pc", "name": "PC", "type": "Desktop",
            "mountType": "Rack Mounted", "location": "Racked",
        }])
        review = prepare_restore_confirmation(raw)
        self.assertTrue(review["requiresLegacyMountReview"])
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        with self.assertRaisesRegex(RestoreCancelled, "Legacy mounting"):
            restore_reviewed_export_offline(
                self.db, raw, final_confirmed=True,
            )
        with self.assertRaisesRegex(RestoreCancelled, "final confirmation"):
            restore_reviewed_export_offline(
                self.db, raw, legacy_mount_approved=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.original)
        self.assertIsNone(read_pre_restore_snapshot(self.db))
        self.assertEqual(self.accounts(), [("admin", "admin")])

    def test_approved_legacy_restore_preserves_accounts_and_snapshot(self):
        raw = export([{
            "id": "pc", "name": "PC", "type": "Desktop",
            "mountType": "Rack Mounted", "location": "Racked",
        }])
        restore_reviewed_export_offline(
            self.db, raw, legacy_mount_approved=True, final_confirmed=True,
        )
        restored = reconstruct_inventory(self.db)
        self.assertEqual(restored["devices"][0]["mountType"], "Desktop")
        self.assertEqual(restored["devices"][0]["location"], "Unknown")
        self.assertEqual(read_pre_restore_snapshot(self.db), self.original)
        self.assertEqual(self.accounts(), [("admin", "admin")])

    def test_failed_second_restore_keeps_active_inventory_and_prior_snapshot(self):
        first = export([{
            "id": "first", "name": "First", "type": "Router",
            "mountType": "Desktop", "location": "Unknown",
        }])
        restore_reviewed_export_offline(
            self.db, first, final_confirmed=True,
        )
        active = copy.deepcopy(reconstruct_inventory(self.db))
        previous_snapshot = copy.deepcopy(read_pre_restore_snapshot(self.db))
        self.db.execute("""
            CREATE TRIGGER block_second_restore
            BEFORE INSERT ON inventory_devices
            WHEN NEW.id='second'
            BEGIN SELECT RAISE(ABORT,'simulated failure'); END
        """)
        second = export([{
            "id": "second", "name": "Second", "type": "Router",
            "mountType": "Desktop", "location": "Unknown",
        }])
        with self.assertRaises(sqlite3.IntegrityError):
            restore_reviewed_export_offline(
                self.db, second, final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), active)
        self.assertEqual(read_pre_restore_snapshot(self.db), previous_snapshot)
        self.assertEqual(self.accounts(), [("admin", "admin")])

    def test_successful_second_restore_snapshots_immediate_predecessor(self):
        first = export([{
            "id": "first", "name": "First", "type": "Router",
            "mountType": "Desktop", "location": "Unknown",
        }])
        second = export([{
            "id": "second", "name": "Second", "type": "Router",
            "mountType": "Desktop", "location": "Unknown",
        }])
        restore_reviewed_export_offline(self.db, first, final_confirmed=True)
        intermediate = reconstruct_inventory(self.db)
        restore_reviewed_export_offline(self.db, second, final_confirmed=True)
        self.assertEqual(read_pre_restore_snapshot(self.db), intermediate)
        self.assertEqual(reconstruct_inventory(self.db)["devices"][0]["id"], "second")
        self.assertEqual(self.accounts(), [("admin", "admin")])


if __name__ == "__main__":
    unittest.main()
