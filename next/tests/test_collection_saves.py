"""Focused transactional IPAM and Racks collection integration."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.collection_saves import change_inventory_record
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
