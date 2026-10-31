"""Existing reviewed IPAM integrity repair through the central database."""
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

from backend.inventory import reconstruct_inventory, stage_inventory
from backend.ipam_repair import apply_ipam_repairs, plan_ipam_repairs
from backend.schema import initialise_database


class IpamIntegrityRepairTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [
                {"id": "d1", "name": "One", "type": "Desktop",
                 "location": "Unknown", "mountType": "Desktop",
                 "primaryIp": "10.0.0.10"},
                {"id": "d2", "name": "Two", "type": "Desktop",
                 "location": "Unknown", "mountType": "Desktop",
                 "primaryIp": "10.0.0.11"},
            ],
            "subnets": [{"id": "s1", "name": "Network", "cidr": "10.0.0.0/24",
                         "gateway": "10.0.0.1", "vlan": 20}],
            "vlans": [], "racks": [], "rackAccessories": [],
            "ipAllocations": {"10.0.0.10": {
                "status": "Available", "deviceId": "", "hostname": "", "notes": "Keep"
            }},
        })
        self.db.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES('owner','hash',1,'secret',1)"
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def apply(self, expected=None):
        if expected is None:
            expected = [{"ip": fix["ip"], "deviceId": fix["deviceId"]}
                        for fix in plan_ipam_repairs(reconstruct_inventory(self.db))]
        with patch("backend.ipam_repair.can_access", return_value=True):
            return apply_ipam_repairs(self.db, 1, expected)

    def test_safe_device_allocations_repaired_without_other_mutations(self):
        self.assertEqual(self.apply(), 2)
        data = reconstruct_inventory(self.db)
        self.assertEqual(data["ipAllocations"]["10.0.0.10"], {
            "status": "Assigned", "deviceId": "d1", "hostname": "One", "notes": "Keep"
        })
        self.assertEqual(data["ipAllocations"]["10.0.0.11"], {
            "status": "Assigned", "deviceId": "d2", "hostname": "Two"
        })
        self.assertEqual([d["name"] for d in data["devices"]], ["One", "Two"])
        history = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchone()[0])
        self.assertEqual(history["reason"], "Phase 11C confirmed IPAM repairs")
        self.assertEqual([change["action"] for change in history["changes"]],
                         ["Updated", "Created"])

    def test_stale_repair_preview_cannot_overwrite_current_allocations(self):
        before = reconstruct_inventory(self.db)
        with self.assertRaisesRegex(ValueError, "Preview repairs again"):
            self.apply([{"ip": "10.0.0.10", "deviceId": "d1"}])
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_active_device_edit_and_edit_permissions_reject_without_writes(self):
        before = reconstruct_inventory(self.db)
        self.db.execute(
            "INSERT INTO device_edit_reservations(device_id,account_id,expires_at,base_revision) "
            "VALUES('d1',1,?,0)", (int(time.time())+300,)
        )
        self.db.commit()
        with self.assertRaisesRegex(ValueError, "being edited"):
            self.apply()
        with patch("backend.ipam_repair.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                apply_ipam_repairs(self.db, 1, [{"ip": "10.0.0.10", "deviceId": "d1"}])
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_transaction_rolls_back_if_history_write_fails(self):
        before = reconstruct_inventory(self.db)
        self.db.execute(
            "CREATE TRIGGER reject_history BEFORE INSERT ON inventory_change_history "
            "BEGIN SELECT RAISE(ABORT,'history unavailable'); END;"
        )
        with self.assertRaisesRegex(sqlite3.IntegrityError, "history unavailable"):
            self.apply()
        self.assertEqual(reconstruct_inventory(self.db), before)


if __name__ == "__main__":
    unittest.main()
