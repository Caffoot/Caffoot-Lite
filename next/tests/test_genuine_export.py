"""Run source-shaped SQLite round-trip against a genuine v1.3.3 export.

Usage (from next/):
    python -m unittest discover -s tests -v

To exercise a private genuine backup locally, set CAFFOOT_V133_FIXTURE to
its absolute path. Never commit the backup or its contents to the repository.
This tests preservation of input values, NOT v1.3.3 import acceptance.
"""
import json
import os
import sqlite3
import unittest
from pathlib import Path

from backend.inventory import inspect_export, reconstruct_inventory, stage_inventory
from backend.schema import initialise_database


class GenuineExportRoundTrip(unittest.TestCase):
    @unittest.skipUnless(
        os.environ.get("CAFFOOT_V133_FIXTURE"),
        "Set CAFFOOT_V133_FIXTURE to a private genuine v1.3.3 export",
    )
    def test_genuine_export_reconstructs_without_data_loss(self):
        path = Path(os.environ["CAFFOOT_V133_FIXTURE"])
        raw = path.read_bytes()
        original = inspect_export(raw)
        with sqlite3.connect(":memory:") as db:
            initialise_database(db)
            stage_inventory(db, original)
            rebuilt = reconstruct_inventory(db)

        expected = {
            key: value for key, value in original.items()
            if key != "caffootBackup"
        }
        self.assertEqual(rebuilt, expected)
        for key in ("devices", "subnets", "vlans", "racks",
                    "rackAccessories", "ipAllocations"):
            self.assertEqual(len(rebuilt[key]), len(original[key]), key)
        self.assertEqual(
            [device["id"] for device in rebuilt["devices"]],
            [device["id"] for device in original["devices"]],
        )
        # A round trip must preserve historical fields and their ordering,
        # not merely the current device identity/relationship columns.
        for old, new in zip(original["devices"], rebuilt["devices"]):
            self.assertEqual(old, new)
        # Verify the import is idempotent in an isolated database.
        with sqlite3.connect(":memory:") as db:
            initialise_database(db)
            stage_inventory(db, original)
            stage_inventory(db, original)
            self.assertEqual(reconstruct_inventory(db), expected)


if __name__ == "__main__":
    unittest.main()
