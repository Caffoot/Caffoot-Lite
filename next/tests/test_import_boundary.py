"""Regression checks for the detached SQLite import boundary.

These tests intentionally do not claim to reproduce v1.3.3 UI validation.
They verify transactionality, historical field preservation, and isolation
from future user/security data and separately stored audit history.
"""
import copy
import json
import sqlite3
import unittest

from backend.inventory import ImportRejected, inspect_export, preview_inventory_counts, reconstruct_inventory, stage_inventory
from backend.schema import initialise_database
from test_inventory import fixture


class ImportBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)

    def tearDown(self):
        self.db.close()

    def test_failed_second_import_preserves_all_collections_and_settings(self):
        good = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, good)
        before = reconstruct_inventory(self.db)
        bad = copy.deepcopy(good)
        bad["subnets"] = [{"id": "subnet-1", "name": "lab"}]
        bad["racks"] = [{"id": "rack-1", "name": "cabinet"}]
        bad["devices"].append({"id": "d2", "name": "LAB-01"})
        bad["hardwareSeedPreferences"] = {"overwritten": True}
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_missing_device_id_rolls_back_everything(self):
        good = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, good)
        before = reconstruct_inventory(self.db)
        bad = copy.deepcopy(good)
        bad["devices"] = [{"name": "missing identifier"}]
        with self.assertRaisesRegex(ImportRejected, "Missing ID"):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_case_insensitive_name_collision_rolls_back(self):
        good = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, good)
        before = reconstruct_inventory(self.db)
        bad = copy.deepcopy(good)
        bad["devices"].append({"id": "d2", "name": "lab-01"})
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_inventory_replacement_does_not_clear_change_history(self):
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"at": "2026-10-29", "reason": "prior change"}),),
        )
        self.db.commit()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        history = self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchall()
        self.assertEqual(len(history), 1)
        self.assertEqual(json.loads(history[0][0])["reason"], "prior change")

    def test_inspection_and_staging_do_not_mutate_source(self):
        original = fixture()
        original["devices"][0]["typeDetails"]["nested"] = [
            {"enabled": False, "value": None}
        ]
        untouched = copy.deepcopy(original)
        inspected = inspect_export(json.dumps(original).encode())
        self.assertEqual(original, untouched)
        stage_inventory(self.db, inspected)
        self.assertEqual(inspected, untouched)
        self.assertEqual(original, untouched)

    def test_staging_does_not_commit_a_rejected_replacement(self):
        first = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, first)
        before = reconstruct_inventory(self.db)
        replacement = copy.deepcopy(first)
        replacement["devices"][0]["name"] = "REPLACED"
        replacement["rackAccessories"] = [{"id": "accessory-1", "rackId": "rack-1"}]
        replacement["devices"].append({"id": "d2", "name": ""})
        with self.assertRaisesRegex(ImportRejected, "Missing device name"):
            stage_inventory(self.db, replacement)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_failed_import_does_not_erase_change_history(self):
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"reason": "before rejected import"}),),
        )
        self.db.commit()
        bad = fixture()
        bad["devices"].append({"id": "d1", "name": "collision"})
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        rows = self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchall()
        self.assertEqual(len(rows), 1)
        self.assertEqual(json.loads(rows[0][0])["reason"], "before rejected import")

    def test_replacement_preview_counts_without_writing_inventory(self):
        current = fixture()
        candidate = copy.deepcopy(current)
        candidate["devices"].append({"id": "d2", "name": "LAB-02"})
        candidate["racks"].append({"id": "r1", "name": "RACK-01"})
        candidate["subnets"].append({"id": "s1", "name": "NET-01"})
        candidate["ipAllocations"]["192.0.2.5"] = {"status": "Available"}
        before_candidate = copy.deepcopy(candidate)
        before_current = copy.deepcopy(current)
        preview = preview_inventory_counts(candidate, current)
        self.assertEqual(preview, {
            "backup": {"devices": 2, "racks": 1, "subnets": 1, "ipAllocations": 2},
            "current": {"devices": 1, "racks": 0, "subnets": 0, "ipAllocations": 1},
        })
        self.assertEqual(candidate, before_candidate)
        self.assertEqual(current, before_current)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM inventory_devices").fetchone()[0], 0
        )

    def test_preview_does_not_imply_import_approval(self):
        invalid = fixture()
        invalid["devices"].append({"id": "d1", "name": "duplicate"})
        preview = preview_inventory_counts(invalid, fixture())
        self.assertEqual(preview["backup"]["devices"], 2)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM inventory_devices").fetchone()[0], 0
        )

    def test_optional_unknown_top_level_fields_survive(self):
        data = fixture()
        data["futureUnrecognisedState"] = {
            "nested": [{"value": None, "flag": False, "count": 0}],
            "unicode": "Café – 日本語",
        }
        data["devices"][0]["historicalOptionalField"] = {
            "old": ["A", "B", "A"], "empty": ""
        }
        original = inspect_export(json.dumps(data, ensure_ascii=False).encode())
        stage_inventory(self.db, original)
        expected = {k: v for k, v in original.items() if k != "caffootBackup"}
        self.assertEqual(reconstruct_inventory(self.db), expected)


if __name__ == "__main__":
    unittest.main()
