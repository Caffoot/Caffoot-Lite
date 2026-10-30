"""Focused transactional IPAM and Racks collection integration."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.collection_saves import (change_inventory_record,
                                      change_ipam_subnet_and_vlan_records,
                                      delete_subnet_with_dependencies)
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

    def test_vlan_delete_refuses_its_linked_network(self):
        network = {"id": "net", "cidr": "10.0.0.0/24", "name": "Network",
                   "vlan": 10, "gateway": "10.0.0.1"}
        vlan = {"id": "v1", "name": "Network", "vlanId": 10}
        self.change_ipam([
            {"collection": "subnets", "id": "net", "record": network},
            {"collection": "vlans", "id": "v1", "record": vlan},
        ])
        with self.assertRaisesRegex(ValueError, "Delete or reassign"):
            self.change_ipam([
                {"collection": "vlans", "id": "v1", "record": None},
            ])
        self.assertEqual(self.records("vlans"), [vlan])
        self.change_ipam([
            {"collection": "subnets", "id": "net", "record": None},
            {"collection": "vlans", "id": "v1", "record": None},
        ])
        self.assertEqual(self.records("vlans"), [])

    def test_legacy_vlan_ownership_can_be_updated(self):
        block = {"id": "block", "kind": "container",
                 "cidr": "10.0.0.0/16", "name": "Block"}
        network = {"id": "net", "cidr": "10.0.0.0/24",
                   "name": "Network", "vlan": 10, "gateway": "10.0.0.1",
                   "parentId": "block"}
        vlan = {"id": "v1", "name": "Network", "vlanId": 10}
        self.change_ipam([
            {"collection": "subnets", "id": "block", "record": block},
            {"collection": "subnets", "id": "net", "record": network},
            {"collection": "vlans", "id": "v1", "record": vlan},
        ])
        associated = dict(vlan, parentId="block")
        self.change_ipam([{"collection": "vlans", "id": "v1", "record": associated}])
        self.assertEqual(self.records("vlans"), [associated])
 
    def test_rack_accessory_create_edit_and_delete_through_collection_save(self):
        rack = {"id": "r1", "name": "Rack One", "heightU": 12}
        self.change("racks", "r1", rack)
        accessory = {"id": "a1", "rackId": "r1", "type": "patch",
                     "name": "Panel", "face": "front", "startU": 2,
                     "heightU": 1, "side": None, "portCount": 24}
        self.change("rackAccessories", "a1", accessory)
        self.assertEqual(self.records("rack_accessories"), [accessory])
        edited = dict(accessory, name="Fibre Panel")
        self.change("rackAccessories", "a1", edited)
        self.assertEqual(self.records("rack_accessories"), [edited])
        conflicting = dict(accessory, id="a2", name="Another")
        with self.assertRaises(ValueError):
            self.change("rackAccessories", "a2", conflicting)
        self.assertEqual(self.records("rack_accessories"), [edited])
        self.change("rackAccessories", "a1", None)
        self.assertEqual(self.records("rack_accessories"), [])

    def test_reviewed_subnet_delete_detaches_primary_ip_and_linked_vlan_atomically(self):
        network = {"id": "network", "name": "Network", "cidr": "10.0.0.0/24",
                   "gateway": "10.0.0.1", "vlan": 10}
        vlan = {"id": "vlan", "name": "Network", "vlanId": 10}
        self.change_ipam([
            {"collection": "subnets", "id": "network", "record": network},
            {"collection": "vlans", "id": "vlan", "record": vlan},
        ])
        device = {"id": "d1", "name": "Router", "mountType": "Desktop",
                  "primaryIp": "10.0.0.10"}
        self.db.execute(
            "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
            ("d1", "Router", json.dumps(device), 0)
        )
        self.db.execute(
            "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?)",
            ("10.0.0.10", json.dumps({"deviceId": "d1", "status": "Assigned",
                                     "hostname": "Router"}))
        )
        self.db.commit()
        with patch("backend.collection_saves.can_access", return_value=True):
            delete_subnet_with_dependencies(
                self.db, 1, "network", [{"id": "d1", "ip": "10.0.0.10"}],
                ["10.0.0.10"]
            )
        self.assertEqual(self.records("subnets"), [])
        self.assertEqual(self.records("vlans"), [])
        self.assertIsNone(self.db.execute(
            "SELECT 1 FROM inventory_ip_allocations WHERE ip='10.0.0.10'"
        ).fetchone())
        raw, revision = self.db.execute(
            "SELECT record_json,revision FROM inventory_devices WHERE id='d1'"
        ).fetchone()
        saved = json.loads(raw)
        self.assertEqual(saved["previousPrimaryIp"], "10.0.0.10")
        self.assertEqual(saved["primaryIp"], "")
        self.assertEqual(revision, 1)

    def test_subnet_delete_rejects_independent_reservations_and_preserves_all(self):
        network = {"id": "network", "name": "Network", "cidr": "10.0.0.0/24",
                   "gateway": "10.0.0.1", "vlan": 10}
        self.change_ipam([
            {"collection": "subnets", "id": "network", "record": network}
        ])
        self.db.execute(
            "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?)",
            ("10.0.0.20", json.dumps({"status": "Reserved", "deviceId": ""}))
        )
        self.db.commit()
        original = self.records("subnets")
        with patch("backend.collection_saves.can_access", return_value=True):
            with self.assertRaisesRegex(ValueError, "Dependencies changed"):
                delete_subnet_with_dependencies(self.db, 1, "network", [], ["10.0.0.20"])
        self.assertEqual(self.records("subnets"), original)
        self.assertIsNotNone(self.db.execute(
            "SELECT 1 FROM inventory_ip_allocations WHERE ip='10.0.0.20'"
        ).fetchone())
