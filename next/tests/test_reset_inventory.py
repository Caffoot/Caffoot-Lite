"""Approved central Clean Start preserves published reset results and accounts."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.inventory import reconstruct_inventory, stage_inventory
from backend.normalisation_pipeline import PUBLISHED_DEFAULTS
from backend.reset_inventory import reset_inventory
from backend.schema import initialise_database


class CleanInventoryResetTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "d1", "name": "Computer",
                         "type": "Desktop", "mountType": "Desktop",
                         "location": "Office"}],
            "subnets": [{"id": "s1", "name": "Network", "cidr": "10.0.0.0/24",
                         "gateway": "10.0.0.1", "vlan": 20}],
            "vlans": [],
            "racks": [{"id": "r1", "heightU": 12, "name": "Rack"}],
            "rackAccessories": [],
            "ipAllocations": {"10.0.0.10": {
                "status": "Available", "deviceId": "", "hostname": "", "notes": ""
            }},
            "deviceTypes": ["Desktop", "Unknown", "Custom"],
            "deviceLocations": ["Unknown", "Office"],
            "installedSoftware": [{"key": "custom", "label": "Tool"}],
            "hardwareCatalogue": {"manufacturers": ["Acme"]},
        })
        self.db.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES('owner','passwordhash',1,'secret',1)"
        )
        self.db.execute(
            "INSERT INTO account_permissions(account_id,section,level) "
            "VALUES(1,'Devices','edit')"
        )
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) "
            "VALUES(?)", (json.dumps({"reason": "Older change", "changes": []}),)
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def reset(self):
        with patch("backend.reset_inventory.can_access", return_value=True):
            reset_inventory(self.db, 1)

    def test_clean_start_retains_users_and_history_and_resets_all_inventory(self):
        account = self.db.execute(
            "SELECT id,username,password_hash,mfa_secret,mfa_confirmed "
            "FROM accounts"
        ).fetchall()
        self.reset()
        actual = reconstruct_inventory(self.db)
        expected = dict(PUBLISHED_DEFAULTS, managedOptionsCleared=True, stateVersion=3)
        self.assertEqual(actual, expected)
        self.assertEqual(self.db.execute(
            "SELECT id,username,password_hash,mfa_secret,mfa_confirmed "
            "FROM accounts"
        ).fetchall(), account)
        self.assertEqual(self.db.execute(
            "SELECT section,level FROM account_permissions"
        ).fetchall(), [("Devices", "edit")])
        events = [json.loads(raw) for (raw,) in self.db.execute(
            "SELECT record_json FROM inventory_change_history ORDER BY id"
        )]
        self.assertEqual(len(events), 2)
        self.assertEqual(events[0]["reason"], "Older change")
        self.assertEqual(events[1]["reason"], "Clean inventory reset")
        self.assertEqual(
            [change["kind"] for change in events[1]["changes"]],
            ["Device", "Subnet", "Rack", "IPAM", "Device types", "Locations"]
        )

    def test_requires_edit_permission_for_every_inventory_section(self):
        before = reconstruct_inventory(self.db)
        with patch("backend.reset_inventory.can_access",
                   side_effect=lambda _db, _actor, section, edit=False: section != "Racks"):
            with self.assertRaises(PermissionError):
                reset_inventory(self.db, 1)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_failed_database_write_rolls_back_every_collection_and_history(self):
        before = reconstruct_inventory(self.db)
        prior_history = list(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ))
        self.db.execute(
            "CREATE TRIGGER reject_reset BEFORE INSERT ON inventory_settings "
            "BEGIN SELECT RAISE(ABORT,'reset unavailable'); END;"
        )
        with self.assertRaisesRegex(sqlite3.IntegrityError, "reset unavailable"):
            self.reset()
        self.assertEqual(reconstruct_inventory(self.db), before)
        self.assertEqual(list(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        )), prior_history)


if __name__ == "__main__":
    unittest.main()
