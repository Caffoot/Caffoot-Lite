"""Existing device type/location manager integration against SQLite."""
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

from backend.device_catalogue import change_device_catalogue
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.schema import initialise_database


class DeviceCatalogueTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [
                {"id": "d1", "name": "One", "type": "Desktop",
                 "mountType": "Desktop", "location": "Office", "notes": "Keep"},
                {"id": "d2", "name": "Two", "type": "Desktop",
                 "mountType": "Desktop", "location": "Store"},
            ],
            "deviceTypes": ["Desktop", "Laptop", "Unknown"],
            "deviceLocations": ["Unknown", "Office", "Store"],
            "deviceTypeGraphics": {"Desktop": "generic_1"},
            "subnets": [], "vlans": [], "racks": [],
            "rackAccessories": [], "ipAllocations": {},
        })
        self.db.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES('owner','hash',1,'secret',1)"
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def change(self, kind, operation, old="", new="", affected=None):
        if affected is None:
            affected = [d["id"] for d in self.state()["devices"]
                        if operation != "add" and d.get(
                            "type" if kind == "type" else "location") == old]
        with patch("backend.device_catalogue.can_access", return_value=True):
            return change_device_catalogue(
                self.db, 1, kind, operation, old, new, affected
            )

    def state(self):
        return reconstruct_inventory(self.db)

    def events(self):
        return [json.loads(row[0]) for row in self.db.execute(
            "SELECT record_json FROM inventory_change_history ORDER BY id"
        )]

    def test_add_and_rename_managed_lists(self):
        self.assertEqual(self.change("type", "add", new="Switch"), 0)
        self.assertIn("Switch", self.state()["deviceTypes"])
        self.assertEqual(self.change("location", "add", new="Lab"), 0)
        self.assertEqual(self.change("location", "rename", "Office", "HQ"), 1)
        state = self.state()
        self.assertEqual(state["deviceLocations"], ["Unknown", "HQ", "Store", "Lab"])
        self.assertEqual(state["devices"][0]["location"], "HQ")
        self.assertEqual(state["devices"][0]["notes"], "Keep")
        self.assertEqual(state["devices"][1]["location"], "Store")
        self.assertEqual(self.db.execute(
            "SELECT revision FROM inventory_devices WHERE id='d1'"
        ).fetchone()[0], 1)
        self.assertEqual([c["kind"] for c in self.events()[-1]["changes"]],
                         ["Device", "Locations"])

    def test_rename_and_delete_type_updates_graphics_devices_and_history(self):
        self.assertEqual(self.change("type", "rename", "Desktop", "Workstation"), 2)
        self.assertEqual(self.state()["deviceTypeGraphics"], {"Workstation": "generic_1"})
        self.assertEqual([d["type"] for d in self.state()["devices"]],
                         ["Workstation", "Workstation"])
        self.assertEqual(self.change("type", "delete", "Workstation"), 2)
        state = self.state()
        self.assertEqual([d["type"] for d in state["devices"]], ["Unknown", "Unknown"])
        self.assertNotIn("Workstation", state["deviceTypes"])
        self.assertEqual(state["deviceTypeGraphics"], {})
        self.assertEqual(self.db.execute(
            "SELECT SUM(revision) FROM inventory_devices"
        ).fetchone()[0], 4)
        self.assertEqual([c["kind"] for c in self.events()[-1]["changes"]],
                         ["Device", "Device", "Device types"])

    def test_delete_location_only_updates_matching_device(self):
        self.assertEqual(self.change("location", "delete", "Office"), 1)
        self.assertEqual([d["location"] for d in self.state()["devices"]],
                         ["Unknown", "Store"])

    def test_protected_and_duplicate_names_leave_inventory_unchanged(self):
        before = self.state()
        for args in (("type", "delete", "Unknown", ""),
                     ("location", "add", "", "Racked"),
                     ("type", "add", "", "desktop"),
                     ("location", "rename", "Office", "Store")):
            with self.subTest(args=args), self.assertRaises(ValueError):
                self.change(*args)
        self.assertEqual(self.state(), before)
        self.assertEqual(self.events(), [])

    def test_reserved_device_and_changed_confirmation_are_rejected(self):
        self.db.execute(
            "INSERT INTO device_edit_reservations(device_id,account_id,expires_at,base_revision) "
            "VALUES('d1',1,?,0)", (int(time.time()) + 300,)
        )
        self.db.commit()
        before = self.state()
        with self.assertRaisesRegex(ValueError, "being edited"):
            self.change("type", "rename", "Desktop", "Workstation")
        with self.assertRaisesRegex(ValueError, "Affected devices have changed"):
            self.change("location", "delete", "Office", affected=[])
        self.assertEqual(self.state(), before)
        self.assertEqual(self.events(), [])

    def test_devices_edit_permission_required(self):
        before = self.state()
        with patch("backend.device_catalogue.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                change_device_catalogue(
                    self.db, 1, "type", "delete", "Desktop", "", ["d1", "d2"]
                )
        self.assertEqual(self.state(), before)


if __name__ == "__main__":
    unittest.main()
