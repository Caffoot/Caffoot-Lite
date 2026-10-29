"""Offline staging tests; not a published-v1.3.3 validator acceptance test."""
import json
import sqlite3
import unittest

from backend.inventory import ImportRejected, inspect_export, reconstruct_inventory, stage_inventory
from backend.schema import initialise_database


def fixture():
    return {
        "devices": [{"id": "d1", "name": "LAB-01", "typeDetails": {"custom": True},
                     "previousVirtualHosts": [{"hostId": "old", "action": "unassign"}]}],
        "subnets": [], "vlans": [], "racks": [], "rackAccessories": [],
        "ipAllocations": {"192.0.2.4": {"status": "Available", "notes": "retained"}},
        "hardwareSeedPreferences": {"model:[\"Desktop\",\"HP\",\"EliteDesk\"]": {"hidden": False}},
        "extraHistoricalOption": {"kept": True},
        "caffootBackup": {"format": "caffoot-inventory", "schemaVersion": 1,
                         "app": "Caffoot Lite", "appVersion": "1.3.3",
                         "exportedAt": "2026-10-29T00:00:00Z"},
    }


class StagingTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)

    def tearDown(self):
        self.db.close()

    def test_round_trip_preserves_inventory_values(self):
        data = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, data)
        expected = {k: v for k, v in data.items() if k != "caffootBackup"}
        self.assertEqual(reconstruct_inventory(self.db), expected)

    def test_reject_old_export(self):
        data = fixture()
        data["caffootBackup"]["appVersion"] = "1.3.2"
        with self.assertRaises(ImportRejected):
            inspect_export(json.dumps(data).encode())

    def test_reject_unsafe_keys(self):
        data = fixture()
        data["devices"][0]["typeDetails"]["__proto__"] = {}
        with self.assertRaises(ImportRejected):
            inspect_export(json.dumps(data).encode())

    def test_reject_duplicate_keys(self):
        raw = json.dumps(fixture()).replace(
            '"devices":', '"devices": [], "devices":', 1
        ).encode()
        with self.assertRaisesRegex(ImportRejected, "Duplicate"):
            inspect_export(raw)

    def test_reject_nonfinite_json_number(self):
        raw = json.dumps(fixture()).replace(
            '"stateVersion"', '"stateVersion"', 1
        ).replace('"extraHistoricalOption":', '"bad": NaN, "extraHistoricalOption":', 1).encode()
        with self.assertRaisesRegex(ImportRejected, "Non-finite"):
            inspect_export(raw)

    def test_reject_oversized_export(self):
        with self.assertRaisesRegex(ImportRejected, "10 MiB"):
            inspect_export(b"x" * (10 * 1024 * 1024 + 1))

    def test_rollback_preserves_prior_inventory(self):
        data = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, data)
        bad = fixture()
        bad["devices"].append({"id": "d1", "name": "duplicate"})
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db)["devices"], data["devices"])


if __name__ == "__main__":
    unittest.main()
