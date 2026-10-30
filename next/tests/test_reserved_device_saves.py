"""Approved reserved device save integration: IPAM, racks and rollback."""
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

from backend.device_saves import save_reserved_device
from backend.inventory import stage_inventory
from backend.schema import initialise_database


class ReservedDeviceSaveTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        state = {
            "devices": [
                {"id": "d1", "name": "One", "mountType": "Rack Mounted",
                 "rackId": "r1", "location": "Unknown", "rackUStart": 1, "rackUHeight": 1,
                 "rackUEnd": 1, "primaryIp": "10.0.0.10"},
                {"id": "d2", "name": "Two", "mountType": "Rack Mounted",
                 "rackId": "r1", "location": "Unknown", "rackUStart": 3, "rackUHeight": 1,
                 "rackUEnd": 3, "primaryIp": "10.0.0.11"},
            ],
            "subnets": [{"id": "s1", "name": "Network", "cidr": "10.0.0.0/24",
                         "gateway": "10.0.0.1", "vlan": 20}],
            "vlans": [], "racks": [{"id": "r1", "heightU": 12}],
            "rackAccessories": [],
            "ipAllocations": {
                "10.0.0.10": {"deviceId": "d1", "status": "Assigned", "hostname": "One"},
                "10.0.0.11": {"deviceId": "d2", "status": "Assigned", "hostname": "Two"},
            },
        }
        stage_inventory(self.db, state)
        self.db.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES('owner','hash',1,'secret',1)"
        )
        self.db.execute(
            "INSERT INTO device_edit_reservations(device_id,account_id,expires_at,base_revision) "
            "VALUES('d1',1,?,0)", (int(time.time()) + 300,)
        )
        self.db.commit()
        self.original = state["devices"][0]

    def tearDown(self):
        self.db.close()

    def snapshot(self):
        return (
            self.db.execute("SELECT record_json,revision FROM inventory_devices WHERE id='d1'").fetchone(),
            self.db.execute("SELECT ip,record_json FROM inventory_ip_allocations ORDER BY ip").fetchall(),
        )

    def save(self, record):
        with patch("backend.device_saves.can_access", return_value=True):
            return save_reserved_device(self.db, 1, "d1", 0, record)

    def test_move_primary_ip_and_rename_commits_together(self):
        record = dict(self.original, name="Renamed", primaryIp="10.0.0.12")
        self.assertEqual(self.save(record), 1)
        allocations = {ip: json.loads(raw) for ip, raw in self.db.execute(
            "SELECT ip,record_json FROM inventory_ip_allocations"
        )}
        self.assertEqual(allocations["10.0.0.12"]["deviceId"], "d1")
        self.assertEqual(allocations["10.0.0.12"]["hostname"], "Renamed")
        self.assertEqual(allocations["10.0.0.10"]["status"], "Available")
        self.assertEqual(allocations["10.0.0.10"]["deviceId"], "")
        self.assertIsNone(self.db.execute(
            "SELECT 1 FROM device_edit_reservations WHERE device_id='d1'"
        ).fetchone())

    def test_competing_ip_rolls_back(self):
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, "assigned to another device"):
            self.save(dict(self.original, primaryIp="10.0.0.11"))
        self.assertEqual(self.snapshot(), before)

    def test_overlapping_rack_position_rolls_back(self):
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, "overlaps"):
            self.save(dict(self.original, rackUStart=3, rackUEnd=3))
        self.assertEqual(self.snapshot(), before)

    def test_unmodified_device_save(self):
        self.assertEqual(self.save(dict(self.original)), 1)


if __name__ == "__main__":
    unittest.main()
