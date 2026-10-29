"""Issue #215 import boundary: no app backups, atomic migration only."""
import json
import sqlite3
import unittest

from backend.schema import initialise_database
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.import_commit import RestoreCancelled, restore_reviewed_export_offline


def export(identifier, version="1.3.3"):
    return json.dumps({
        "caffootBackup": {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": version,
            "exportedAt": "2026-10-29T12:00:00Z",
        },
        "devices": [{"id": identifier, "name": identifier,
                     "type": "Router", "mountType": "Desktop",
                     "location": "Unknown"}],
        "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
    }).encode()


class ApprovedMigrationBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "old", "name": "Old"}],
            "racks": [], "subnets": [], "vlans": [], "ipAllocations": {},
        })
        self.before = reconstruct_inventory(self.db)
        self.db.execute("CREATE TABLE user_accounts(id TEXT PRIMARY KEY)")
        self.db.execute("INSERT INTO user_accounts VALUES ('admin')")
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_cancel_and_invalid_version_do_not_write(self):
        with self.assertRaises(RestoreCancelled):
            restore_reviewed_export_offline(self.db, export("new"))
        with self.assertRaisesRegex(ValueError, "v1.3.3 export"):
            restore_reviewed_export_offline(
                self.db, export("new", "1.3.2"), final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)

    def test_successful_import_preserves_accounts_without_snapshot_tables(self):
        restore_reviewed_export_offline(
            self.db, export("new"), final_confirmed=True,
        )
        self.assertEqual(reconstruct_inventory(self.db)["devices"][0]["id"], "new")
        self.assertEqual(self.db.execute("SELECT id FROM user_accounts").fetchall(),
                         [("admin",)])
        self.assertFalse(self.db.execute(
            "SELECT name FROM sqlite_master "
            "WHERE name='inventory_pre_restore_snapshot'"
        ).fetchall())

    def test_failed_write_rolls_back_inventory(self):
        self.db.execute("""
            CREATE TRIGGER fail_new BEFORE INSERT ON inventory_devices
            WHEN NEW.id='new'
            BEGIN SELECT RAISE(ABORT,'failed write'); END
        """)
        with self.assertRaises(sqlite3.IntegrityError):
            restore_reviewed_export_offline(
                self.db, export("new"), final_confirmed=True,
            )
        self.assertEqual(reconstruct_inventory(self.db), self.before)


if __name__ == "__main__":
    unittest.main()
