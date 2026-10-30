"""Focused transactional IPAM and Racks collection integration."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.collection_saves import change_inventory_record, change_ipam_subnet_and_vlan_records
from backend.inventory import stage_inventory
from backend.schema import initialise_database


class CollectionSaveTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [], "subnets": [], "vlans": [],
            "racks": [], "rackAccessories": [], "ipAllocations": {},
        })

    def tearDown(self):
        self.db.close()

    def change(self, collection, record_id, record):
        with patch("backend.collection_saves.can_access", return_value=True):
            change_inventory_record(self.db, 1, collection, record_id, record)

    def records(self, table):
        return [json.loads(raw) for (raw,) in self.db.execute(
            "SELECT record_json FROM inventory_" + table + " ORDER BY ordinal"
        )]

    def test_create_update_delete_rack(self):
        rack = {"id": "r1", "name": "Rack One", "heightU": 12}
        self.change("racks", "r1", rack)
        self.assertEqual(self.records("racks"), [rack])
        renamed = dict(rack, name="Rack Two")
        self.change("racks", "r1", renamed)
        self.assertEqual(self.records("racks"), [renamed])
        self.change("racks", "r1", None)
        self.assertEqual(self.records("racks"), [])
        events = [json.loads(raw) for (raw,) in self.db.execute(
            "SELECT record_json FROM inventory_change_history ORDER BY id"
        )]
        self.assertEqual([event["changes"][0]["action"] for event in events],
                         ["Created", "Updated", "Deleted"])

    def test_rack_with_dependent_device_cannot_be_deleted(self):
        rack = {"id": "r1", "name": "Rack One", "heightU": 12}
        self.change("racks", "r1", rack)
        self.db.execute(
            "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
            ("d1", "One", json.dumps({"id": "d1", "name": "One",
                                    "mountType": "Rack Mounted", "location": "Unknown",
                                    "rackId": "r1", "rackUStart": 1,
                                    "rackUHeight": 1, "rackUEnd": 1}), 0),
        )
        self.db.commit()
        with self.assertRaises(ValueError):
            self.change("racks", "r1", None)
        self.assertEqual(self.records("racks"), [rack])

    def test_reject_invalid_vlan_without_partial_write(self):
        with self.assertRaises(ValueError):
            self.change("vlans", "v1", {"id": "v1", "name": "Invalid", "vlanId": 5000})
        self.assertEqual(self.records("vlans"), [])

    def test_permission_required(self):
        with patch("backend.collection_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                change_inventory_record(self.db, 1, "racks", "r1",
                                        {"id": "r1", "name": "Rack", "heightU": 12})
 
    def change_ipam(self, changes):
        with patch("backend.collection_saves.can_access", return_value=True):
            change_ipam_subnet_and_vlan_records(self.db, 1, changes)

    def test_network_and_linked_vlan_saved_in_one_transaction(self):
        block = {"id": "block", "kind": "container",
                 "cidr": "10.0.0.0/16", "name": "Main block", "parentId": None}
        network = {"id": "net", "cidr": "10.0.0.0/24", "name": "Admin",
                   "vlan": 10, "gateway": "10.0.0.1", "parentId": "block"}
        vlan = {"id": "v1", "name": "Admin", "vlanId": 10,
                "color": "indigo", "parentId": "block"}
        self.change_ipam([
            {"collection": "subnets", "id": "block", "record": block},
            {"collection": "subnets", "id": "net", "record": network},
            {"collection": "vlans", "id": "v1", "record": vlan}
        ])
        self.assertEqual(self.records("subnets"), [block, network])
        self.assertEqual(self.records("vlans"), [vlan])
        edited = dict(network, name="New name")
        new_vlan = dict(vlan, name="New name")
        self.change_ipam([
            {"collection": "subnets", "id": "net", "record": edited},
            {"collection": "vlans", "id": "v1", "record": new_vlan}
        ])
        self.assertEqual(self.records("subnets"), [block, edited])
        self.assertEqual(self.records("vlans"), [new_vlan])

    def test_failed_linked_vlan_save_preserves_original_subnet(self):
        network = {"id": "net", "cidr": "10.0.0.0/24", "name": "Valid",
                   "vlan": 10, "gateway": "10.0.0.1"}
        with self.assertRaises(ValueError):
            self.change_ipam([
                {"collection": "subnets", "id": "net", "record": network},
                {"collection": "vlans", "id": "bad",
                 "record": {"id": "bad", "name": "Invalid", "vlanId": 5000}}
            ])
        self.assertEqual(self.records("subnets"), [])
        self.assertEqual(self.records("vlans"), [])

    def test_ipam_subnet_batch_requires_edit_permission(self):
        with patch("backend.collection_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                change_ipam_subnet_and_vlan_records(
                    self.db, 1, [{"collection": "subnets", "id": "s",
                                  "record": {"id": "s", "name": "Block"}}]
                )
