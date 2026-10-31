"""Independent IPAM allocation saves against the central SQLite database."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.inventory import stage_inventory
from backend.ipam_saves import change_independent_allocation, change_bulk_allocations
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

    def test_device_owned_ipam_notes_only_preserves_assignment(self):
        ip = "10.0.0.10"
        original = self.allocation(ip)
        updated = dict(original, notes="Access point port")
        self.change(ip, updated)
        self.assertEqual(self.allocation(ip), updated)
        events = [json.loads(row[0]) for row in self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        )]
        self.assertEqual(events[-1]["changes"][0]["fields"], ["notes"])

    def test_device_owned_ipam_changes_other_than_notes_still_rejected(self):
        ip = "10.0.0.10"
        original = self.allocation(ip)
        for updated in (dict(original, status="Available"),
                        dict(original, hostname="Different"),
                        dict(original, deviceId=""),
                        None):
            with self.assertRaisesRegex(ValueError, "Device-linked"):
                self.change(ip, updated)
            self.assertEqual(self.allocation(ip), original)

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

    def bulk(self, changes):
        with patch("backend.ipam_saves.can_access", return_value=True):
            change_bulk_allocations(self.db, 1, changes)

    def test_published_bulk_reservations_and_release_commit_together(self):
        changes = [
            {"ip": "10.0.0.20", "record": {"status": "Reserved", "deviceId": "",
                                          "hostname": "pool-20", "notes": "DHCP"}},
            {"ip": "10.0.0.21", "record": {"status": "Reserved", "deviceId": "",
                                          "hostname": "pool-21", "notes": "DHCP"}},
        ]
        self.bulk(changes)
        for change in changes:
            self.assertEqual(self.allocation(change["ip"]), change["record"])
        self.bulk([
            {"ip": change["ip"], "record": dict(change["record"], status="Available")}
            for change in changes
        ])
        self.assertTrue(all(self.allocation(change["ip"])["status"] == "Available"
                            for change in changes))

    def test_bulk_protects_device_addresses_gateway_and_rolls_back_every_change(self):
        candidate = {"ip": "10.0.0.20", "record": {"status": "Reserved", "deviceId": ""}}
        for protected in ("10.0.0.10", "10.0.0.1"):
            with self.assertRaisesRegex(ValueError, "Protected IP"):
                self.bulk([candidate, {"ip": protected,
                                      "record": {"status": "Reserved", "deviceId": ""}}])
            self.assertIsNone(self.allocation("10.0.0.20"))
            self.assertEqual(self.allocation("10.0.0.10")["deviceId"], "d1")

    def test_bulk_requires_ipam_edit_permission(self):
        with patch("backend.ipam_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                change_bulk_allocations(
                    self.db, 1, [{"ip": "10.0.0.20",
                                  "record": {"status": "Reserved", "deviceId": ""}}]
                )
