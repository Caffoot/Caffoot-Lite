"""Independent IPAM allocation saves against the central SQLite database."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.inventory import stage_inventory
from backend.ipam_saves import change_independent_allocation
from backend.schema import initialise_database


class IndependentIpamTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [{"id": "d1", "name": "One", "mountType": "Desktop",
                         "primaryIp": "10.0.0.10"}],
            "subnets": [{"id": "s1", "name": "Network", "cidr": "10.0.0.0/24",
                         "gateway": "10.0.0.1", "vlan": 20}],
            "vlans": [], "racks": [], "rackAccessories": [],
            "ipAllocations": {
                "10.0.0.10": {"deviceId": "d1", "status": "Assigned", "hostname": "One"}
            },
        })

    def tearDown(self):
        self.db.close()

    def change(self, ip, record):
        with patch("backend.ipam_saves.can_access", return_value=True):
            change_independent_allocation(self.db, 1, ip, record)

    def allocation(self, ip):
        row = self.db.execute(
            "SELECT record_json FROM inventory_ip_allocations WHERE ip=?", (ip,)
        ).fetchone()
        return json.loads(row[0]) if row else None

    def test_create_edit_and_delete_independent_reservation(self):
        ip = "10.0.0.20"
        record = {"deviceId": "", "status": "Reserved", "hostname": "", "notes": "Reserved"}
        self.change(ip, record)
        self.assertEqual(self.allocation(ip), record)
        changed = dict(record, notes="Updated")
        self.change(ip, changed)
        self.assertEqual(self.allocation(ip), changed)
        self.change(ip, None)
        self.assertIsNone(self.allocation(ip))
        events = [json.loads(row[0]) for row in self.db.execute(
            "SELECT record_json FROM inventory_change_history ORDER BY id"
        )]
        self.assertEqual([event["changes"][0]["action"] for event in events],
                         ["Created", "Updated", "Deleted"])

    def test_reject_device_linked_changes_without_mutation(self):
        before = self.allocation("10.0.0.10")
        with self.assertRaises(ValueError):
            self.change("10.0.0.10", None)
        with self.assertRaises(ValueError):
            self.change("10.0.0.21", {"deviceId": "d1", "status": "Assigned"})
        self.assertEqual(self.allocation("10.0.0.10"), before)
        self.assertIsNone(self.allocation("10.0.0.21"))

    def test_outside_subnet_rolls_back(self):
        with self.assertRaises(ValueError):
            self.change("192.168.2.10", {"deviceId": "", "status": "Reserved"})
        self.assertIsNone(self.allocation("192.168.2.10"))

    def test_permission_required(self):
        with patch("backend.ipam_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                change_independent_allocation(
                    self.db, 1, "10.0.0.20", {"deviceId": "", "status": "Reserved"}
                )
