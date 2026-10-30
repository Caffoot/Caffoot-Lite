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
        events = [json.loads(raw) for (raw,) in self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        )]
        self.assertEqual(len(events), 1)
        self.assertEqual([change["kind"] for change in events[0]["changes"]],
                         ["Device", "IPAM", "IPAM"])
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
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0], 0)

    def test_rejected_save_has_no_history(self):
        with self.assertRaises(ValueError):
            self.save(dict(self.original, primaryIp="10.0.0.11"))
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0], 0)


    def test_rename_refreshes_ipam_hostname_and_history(self):
        self.assertEqual(self.save(dict(self.original, name="Renamed")), 1)
        allocation = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_ip_allocations WHERE ip='10.0.0.10'"
        ).fetchone()[0])
        self.assertEqual(allocation["hostname"], "Renamed")
        event = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchone()[0])
        self.assertEqual([change["kind"] for change in event["changes"]],
                         ["Device", "IPAM"])
        self.assertEqual(event["changes"][0]["fields"], ["name"])
        self.assertEqual(event["changes"][1]["fields"], ["hostname"])

    def test_rack_move_is_recorded_with_device_change(self):
        self.assertEqual(self.save(dict(self.original, rackUStart=2, rackUEnd=2)), 1)
        event = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchone()[0])
        self.assertEqual(len(event["changes"]), 1)
        self.assertEqual(event["changes"][0]["kind"], "Device")
        self.assertEqual(event["changes"][0]["fields"], ["rackUStart", "rackUEnd"])

    def test_history_retains_published_two_hundred_event_limit(self):
        for index in range(200):
            self.db.execute(
                "INSERT INTO inventory_change_history(record_json) VALUES(?)",
                (json.dumps({"at": str(index), "changes": []}),)
            )
        self.db.commit()
        self.assertEqual(self.save(dict(self.original, name="Renamed")), 1)
        events = [json.loads(raw) for (raw,) in self.db.execute(
            "SELECT record_json FROM inventory_change_history ORDER BY id"
        )]
        self.assertEqual(len(events), 200)
        self.assertEqual(events[0]["at"], "1")
        self.assertEqual(events[-1]["changes"][0]["label"], "Renamed")

    def test_expired_reservation_rejects_save_without_history(self):
        self.db.execute(
            "UPDATE device_edit_reservations SET expires_at=? WHERE device_id='d1'",
            (int(time.time()) - 1,)
        )
        self.db.commit()
        with self.assertRaisesRegex(ValueError, "reservation is no longer valid"):
            self.save(dict(self.original, name="Renamed"))
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0], 0)

    def test_stale_revision_rejects_save_without_history(self):
        self.db.execute("UPDATE inventory_devices SET revision=1 WHERE id='d1'")
        self.db.commit()
        with self.assertRaisesRegex(ValueError, "changed since editing began"):
            self.save(dict(self.original, name="Renamed"))
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main()
