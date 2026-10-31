"""End-to-end detached v1.3.3 import review and SQLite staging safeguards.

No live import endpoint or automatic approval is introduced.
"""
import copy
import sqlite3
import unittest

from backend.import_review import prepare_detached_import_review
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.schema import initialise_database


def backup():
    return {
        "subnets": [{"id": "s", "name": "Office", "cidr": "10.0.0.0/24",
                     "gateway": "10.0.0.1", "vlan": 20}],
        "vlans": [{"id": "v", "name": "Office", "vlanId": 20}],
        "racks": [{"id": "r", "name": "Rack", "heightU": 12}],
        "devices": [{"id": "d", "name": "Router", "type": "Router",
                     "location": "Office", "mountType": "Desktop",
                     "primaryIp": "10.0.0.10",
                     "historicalCustomField": {"keep": True}}],
        "ipAllocations": {
            "10.0.0.10": {"deviceId": "d", "status": "Assigned",
                          "notes": "preserve note"}
        },
        "historicalSetting": {"keep": [1, 2, 3]},
    }


class FullImportBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.original = backup()
        stage_inventory(self.db, self.original)

    def tearDown(self):
        self.db.close()

    def test_full_review_is_read_only(self):
        source = backup()
        original = copy.deepcopy(source)
        before = reconstruct_inventory(self.db)
        review = prepare_detached_import_review(source)
        self.assertEqual(source, original)
        self.assertEqual(reconstruct_inventory(self.db), before)
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        self.assertEqual(review["diagnostics"]["rackConflicts"], [])

    def test_rejected_rack_overlap_preserves_database(self):
        source = backup()
        source["devices"].append({
            "id": "d2", "name": "Server 2", "type": "Server - Physical",
            "mountType": "Rack Mounted", "rackId": "r",
            "location": "Office", "rackUStart": 1, "rackUHeight": 2,
            "rackUEnd": 2,
        })
        source["devices"][0].update({
            "type": "Server - Physical", "mountType": "Rack Mounted",
            "rackId": "r", "rackUStart": 1, "rackUHeight": 2, "rackUEnd": 2,
        })
        before = reconstruct_inventory(self.db)
        with self.assertRaisesRegex(ValueError, "overlaps"):
            prepare_detached_import_review(source)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_rejected_ipam_reserved_mismatch_preserves_database(self):
        source = backup()
        source["devices"][0]["ipReserved"] = True
        source["ipAllocations"] = {}
        before = reconstruct_inventory(self.db)
        # Published normaliseState creates Assigned for a missing allocation,
        # then validateApplicationState rejects the Reserved mismatch.
        with self.assertRaisesRegex(ValueError, "IPAM is out of sync"):
            prepare_detached_import_review(source)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_rejected_invalid_subnet_preserves_database(self):
        source = backup()
        source["subnets"][0]["cidr"] = "invalid"
        before = reconstruct_inventory(self.db)
        with self.assertRaises(ValueError):
            prepare_detached_import_review(source)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_unapproved_review_cannot_replace_inventory_by_itself(self):
        source = backup()
        source["devices"][0]["name"] = "Different"
        before = reconstruct_inventory(self.db)
        review = prepare_detached_import_review(source)
        self.assertEqual(review["candidate"]["devices"][0]["name"], "Different")
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_failed_staging_rolls_back_entire_inventory_replacement(self):
        # An invalid duplicate device ID fails after DELETE/INSERT has begun.
        # The previous inventory must remain byte-for-byte reconstructable.
        before = reconstruct_inventory(self.db)
        replacement = backup()
        replacement["devices"][0]["name"] = "Replacement"
        replacement["devices"].append({
            "id": "d", "name": "Duplicate ID", "type": "Router",
            "mountType": "Desktop",
        })
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, replacement)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_failed_staging_does_not_modify_account_tables(self):
        # Inventory replacement must not touch separately owned account data.
        self.db.execute(
            "CREATE TABLE user_accounts (id TEXT PRIMARY KEY, role TEXT NOT NULL)"
        )
        self.db.execute(
            "INSERT INTO user_accounts (id, role) VALUES ('admin', 'admin')"
        )
        self.db.commit()
        replacement = backup()
        replacement["devices"].append(copy.deepcopy(replacement["devices"][0]))
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, replacement)
        self.assertEqual(
            self.db.execute("SELECT id, role FROM user_accounts").fetchall(),
            [("admin", "admin")],
        )

    def test_staging_after_review_preserves_historical_fields(self):
        source = backup()
        review = prepare_detached_import_review(source)
        # Explicitly simulate a separately authorised staging operation in
        # an isolated test database; review itself never stages.
        stage_inventory(self.db, review["candidate"])
        restored = reconstruct_inventory(self.db)
        self.assertEqual(restored["devices"][0]["historicalCustomField"], {"keep": True})
        self.assertEqual(restored["historicalSetting"], {"keep": [1, 2, 3]})
        self.assertEqual(restored["ipAllocations"]["10.0.0.10"]["notes"], "preserve note")


if __name__ == "__main__":
    unittest.main()
