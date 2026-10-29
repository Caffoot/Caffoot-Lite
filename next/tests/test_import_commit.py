"""Offline restore boundary: explicit review, snapshot and atomicity."""
import json
import sqlite3
import unittest

from backend.schema import initialise_database
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.import_commit import (
    RestoreCancelled, restore_reviewed_export_offline,
    read_pre_restore_snapshot,
)


def backup():
    return {
        "caffootBackup": {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        },
        "devices": [{"id": "ap", "name": "AP", "type": "Access Point",
                     "mountType": "Rack Mounted", "rackId": "r",
                     "location": "Racked"}],
        "racks": [{"id": "r", "name": "Rack", "heightU": 12}],
        "subnets": [], "vlans": [], "ipAllocations": {},
    }


class OfflineRestoreTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "old", "name": "Old"}],
            "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
            "historicalSetting": {"preserve": True},
        })
        self.before = reconstruct_inventory(self.db)

    def tearDown(self):
        self.db.close()

    def test_cancel_missing_ap_choice_and_missing_final_confirmation(self):
        raw = json.dumps(backup()).encode()
        for kwargs in ({}, {"final_confirmed": True},
                       {"final_confirmed": True, "access_point_choices": []}):
            with self.subTest(kwargs=kwargs):
                with self.assertRaises((RestoreCancelled, ValueError)):
                    restore_reviewed_export_offline(self.db, raw, **kwargs)
                self.assertEqual(reconstruct_inventory(self.db), self.before)
                self.assertIsNone(read_pre_restore_snapshot(self.db))

    def test_confirmed_restore_preserves_previous_inventory_snapshot(self):
        raw = json.dumps(backup()).encode()
        summary = restore_reviewed_export_offline(
            self.db, raw, access_point_choices=["Ceiling Mounted"],
            final_confirmed=True,
        )
        self.assertEqual(summary["current"]["devices"], 1)
        self.assertEqual(read_pre_restore_snapshot(self.db), self.before)
        restored = reconstruct_inventory(self.db)
        self.assertEqual(restored["devices"][0]["mountType"], "Ceiling Mounted")
        self.assertEqual(restored["devices"][0]["rackId"], "")

    def test_write_failure_rolls_back_snapshot_and_inventory(self):
        self.db.execute("""
            CREATE TRIGGER fail_new_inventory BEFORE INSERT ON inventory_devices
            WHEN NEW.id='ap' BEGIN SELECT RAISE(ABORT,'simulated write failure'); END
        """)
        raw = json.dumps(backup()).encode()
        with self.assertRaises(sqlite3.IntegrityError):
            restore_reviewed_export_offline(
                self.db, raw, access_point_choices=["Desktop"],
                final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)
        self.assertIsNone(read_pre_restore_snapshot(self.db))

    def test_invalid_version_never_writes(self):
        source = backup()
        source["caffootBackup"]["appVersion"] = "1.3.2"
        with self.assertRaisesRegex(ValueError, "v1.3.3 export"):
            restore_reviewed_export_offline(
                self.db, json.dumps(source).encode(),
                access_point_choices=["Desktop"], final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)


if __name__ == "__main__":
    unittest.main()
