"""Regression checks for the detached SQLite import boundary.

These tests intentionally do not claim to reproduce v1.3.3 UI validation.
They verify transactionality, historical field preservation, and isolation
from future user/security data and separately stored audit history.
"""
import copy
import json
import sqlite3
import unittest

from backend.inventory import ImportRejected, inspect_export, reconstruct_inventory, stage_inventory
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
