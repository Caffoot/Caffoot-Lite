"""Approved reserved device save integration: IPAM, racks and rollback."""
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

from backend.device_saves import create_device, delete_reserved_device, save_reserved_device
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

    def test_related_changes_reject_non_guest_and_leave_database_unchanged(self):
        before = self.snapshot()
        unrelated = dict(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d2'"
        ).fetchone() and json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d2'"
        ).fetchone()[0]), status="Retired")
        with patch("backend.device_saves.can_access", return_value=True):
            with self.assertRaisesRegex(ValueError, "not hosted"):
                save_reserved_device(self.db, 1, "d1", 0,
                                     dict(self.original, name="Renamed"),
                                     related_devices=[{"deviceId":"d2", "revision":0,
                                                       "record":unrelated}])
        self.assertEqual(self.snapshot(), before)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0], 0)

    def test_related_changes_reject_unapproved_device_properties(self):
        # The host edit may only carry the published dependent guest decisions,
        # never arbitrary edits of unrelated device data.
        before = self.snapshot()
        guest = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d2'"
        ).fetchone()[0])
        guest["virtualHostId"] = "d1"
        self.db.execute(
            "UPDATE inventory_devices SET record_json=? WHERE id='d2'",
            (json.dumps(guest),)
        )
        self.db.commit()
        bad_guest = dict(guest, name="Unexpected rename")
        with patch("backend.device_saves.can_access", return_value=True):
            with self.assertRaisesRegex(ValueError, "Unsupported related"):
                save_reserved_device(self.db, 1, "d1", 0, dict(self.original),
                                     related_devices=[{"deviceId":"d2","revision":0,
                                                       "record":bad_guest}])
        self.assertEqual(self.snapshot(), before)

    def test_host_guest_choice_saves_with_host_and_revisions(self):
        guest = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d2'"
        ).fetchone()[0])
        guest["virtualHostId"] = "d1"
        self.db.execute(
            "UPDATE inventory_devices SET record_json=? WHERE id='d2'",
            (json.dumps(guest),)
        )
        self.db.commit()
        updated_guest = dict(guest, virtualHostId="",
                             previousVirtualHosts=[{"hostId":"d1", "action":"unassign"}])
        with patch("backend.device_saves.can_access", return_value=True):
            self.assertEqual(save_reserved_device(
                self.db, 1, "d1", 0, dict(self.original, name="Renamed"),
                related_devices=[{"deviceId":"d2", "revision":0, "record":updated_guest}]
            ), 1)
        stored_guest, revision = self.db.execute(
            "SELECT record_json,revision FROM inventory_devices WHERE id='d2'"
        ).fetchone()
        self.assertEqual(json.loads(stored_guest), updated_guest)
        self.assertEqual(revision, 1)
        kinds = [change["kind"] for (raw,) in self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ) for change in json.loads(raw)["changes"]]
        self.assertEqual(kinds.count("Device"), 2)

    def test_edit_primary_ip_respects_independent_reservations(self):
        self.db.execute(
            "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?)",
            ("10.0.0.20", json.dumps({
                "status":"Reserved", "deviceId":"", "reservedForDeviceId":"d2"
            }))
        )
        self.db.commit()
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, "reserved for another device"):
            self.save(dict(self.original, primaryIp="10.0.0.20"))
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


    def test_archived_software_installation_change_preserves_other_device_data(self):
        original = dict(self.original, typeDetails={
            "customSoftware_historic": True, "otherKey": "historical"
        })
        self.db.execute(
            "UPDATE inventory_devices SET record_json=? WHERE id='d1'",
            (json.dumps(original),)
        )
        self.db.commit()
        updated = dict(original, typeDetails={
            "customSoftware_historic": False, "otherKey": "historical"
        })
        self.assertEqual(self.save(updated), 1)
        actual = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d1'"
        ).fetchone()[0])
        self.assertEqual(actual["typeDetails"], updated["typeDetails"])
        self.assertEqual(actual["primaryIp"], "10.0.0.10")
        self.assertEqual(actual["rackId"], "r1")


    def test_devices_only_editor_can_rename_without_ipam_or_racks_edit(self):
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Devices"):
            self.assertEqual(save_reserved_device(
                self.db, 1, "d1", 0, dict(self.original, name="Renamed")
            ), 1)

    def test_devices_only_editor_cannot_change_primary_ip_or_reservation(self):
        before = self.snapshot()
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Devices"):
            for updated in (dict(self.original, primaryIp="10.0.0.12"),
                            dict(self.original, ipReserved=True)):
                with self.assertRaisesRegex(PermissionError, "IPAM edit"):
                    save_reserved_device(self.db, 1, "d1", 0, updated)
        self.assertEqual(self.snapshot(), before)

    def test_devices_only_editor_cannot_move_or_unmount_a_racked_device(self):
        before = self.snapshot()
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Devices"):
            for updated in (dict(self.original, rackUStart=2, rackUEnd=2),
                            dict(self.original, rackId="", mountType="Desktop")):
                with self.assertRaisesRegex(PermissionError, "Racks edit"):
                    save_reserved_device(self.db, 1, "d1", 0, updated)
        self.assertEqual(self.snapshot(), before)

    def test_ipam_only_save_cannot_modify_unrelated_device_details(self):
        before = self.snapshot()
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "IPAM"):
            with self.assertRaisesRegex(PermissionError, "IPAM edit permission allows"):
                save_reserved_device(self.db, 1, "d1", 0,
                    dict(self.original, name="Unauthorised"), section="IPAM")
            self.assertEqual(save_reserved_device(self.db, 1, "d1", 0,
                dict(self.original, primaryIp="10.0.0.12"), section="IPAM"), 1)
        self.assertEqual(self.db.execute(
            "SELECT name FROM inventory_devices WHERE id='d1'"
        ).fetchone()[0], "One")
        self.assertNotEqual(self.snapshot(), before)


if __name__ == "__main__":
    unittest.main()

class CreateDeviceTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        stage_inventory(self.db, {
            "devices": [],
            "subnets": [{"id": "s1", "name": "Network", "cidr": "10.0.0.0/24",
                         "gateway": "10.0.0.1", "vlan": 20}],
            "vlans": [], "racks": [], "rackAccessories": [], "ipAllocations": {},
        })
        self.record = {"id": "new1", "name": "New", "mountType": "Desktop",
                       "primaryIp": "10.0.0.20"}

    def tearDown(self):
        self.db.close()

    def create(self, record):
        with patch("backend.device_saves.can_access", return_value=True):
            return create_device(self.db, 1, record)

    def test_create_commits_device_ipam_and_history(self):
        self.assertEqual(self.create(self.record), 0)
        saved = self.db.execute(
            "SELECT record_json,revision FROM inventory_devices WHERE id='new1'"
        ).fetchone()
        self.assertEqual(json.loads(saved[0]), self.record)
        self.assertEqual(saved[1], 0)
        ip = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_ip_allocations WHERE ip='10.0.0.20'"
        ).fetchone()[0])
        self.assertEqual(ip["deviceId"], "new1")
        history = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchone()[0])
        self.assertEqual([item["kind"] for item in history["changes"]],
                         ["Device", "IPAM"])

    def test_duplicate_identifier_and_name_do_not_mutate_inventory(self):
        self.create(self.record)
        for duplicate in (self.record, dict(self.record, id="new2", primaryIp="10.0.0.21")):
            with self.assertRaises((ValueError, sqlite3.IntegrityError)):
                self.create(duplicate)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_devices"
        ).fetchone()[0], 1)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0], 1)

    def test_competing_ip_and_bad_rack_roll_back(self):
        self.create(self.record)
        for invalid in (
            dict(self.record, id="new2", name="Other"),
            dict(self.record, id="new2", name="Other", primaryIp="",
                 mountType="Rack Mounted", rackId="missing"),
        ):
            with self.assertRaises(ValueError):
                self.create(invalid)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_devices"
        ).fetchone()[0], 1)

    def test_create_refuses_reserved_ipam_address(self):
        self.db.execute(
            "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?)",
            ("10.0.0.20", json.dumps({
                "status":"Reserved", "deviceId":"", "reservedForDeviceId":"another-device"
            }))
        )
        self.db.commit()
        with self.assertRaisesRegex(ValueError, "reserved for another device"):
            self.create(self.record)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_devices"
        ).fetchone()[0], 0)

    def test_requires_devices_edit_permission(self):
        with patch("backend.device_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                create_device(self.db, 1, self.record)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_devices"
        ).fetchone()[0], 0)

    def test_add_requires_devices_and_ipam_edit(self):
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Devices"):
            with self.assertRaisesRegex(PermissionError, "IPAM edit"):
                create_device(self.db, 1, self.record)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_devices"
        ).fetchone()[0], 0)

    def test_add_rack_mounted_requires_racks_edit_too(self):
        self.db.execute(
            "INSERT INTO inventory_racks(id,record_json,ordinal) VALUES(?,?,?)",
            ("r1", json.dumps({"id": "r1", "name": "Rack", "heightU": 12}), 0)
        )
        self.db.commit()
        mounted = dict(self.record, rackId="r1", mountType="Rack Mounted",
                       face="front", rackUStart=1, rackUEnd=1, rackUHeight=1)
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False:
                   section in ("Devices", "IPAM")):
            with self.assertRaisesRegex(PermissionError, "Racks edit"):
                create_device(self.db, 1, mounted)
            self.assertEqual(create_device(self.db, 1, self.record), 0)


class DeleteReservedDeviceTests(ReservedDeviceSaveTests):
    def delete(self, revision=0):
        with patch("backend.device_saves.can_access", return_value=True):
            return delete_reserved_device(self.db, 1, "d1", revision)

    def test_delete_clears_independent_device_reservations(self):
        self.db.execute(
            "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?)",
            ("10.0.0.20", json.dumps({
                "status":"Reserved", "deviceId":"", "reservedForDeviceId":"d1",
                "notes":"Keep existing note"
            }))
        )
        self.db.commit()
        self.assertTrue(self.delete())
        record = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_ip_allocations WHERE ip='10.0.0.20'"
        ).fetchone()[0])
        self.assertEqual(record["reservedForDeviceId"], "")
        self.assertEqual(record["notes"], "Keep existing note")
        history = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchone()[0])
        self.assertIn("10.0.0.20", [change["label"] for change in history["changes"]])

    def test_delete_host_and_guest_choice_commit_together(self):
        guest = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d2'"
        ).fetchone()[0])
        guest["virtualHostId"] = "d1"
        self.db.execute(
            "UPDATE inventory_devices SET record_json=? WHERE id='d2'",
            (json.dumps(guest),)
        )
        self.db.commit()
        updated_guest = dict(guest, virtualHostId="", status="Retired",
                             previousVirtualHosts=[{"hostId":"d1", "action":"retire"}])
        with patch("backend.device_saves.can_access", return_value=True):
            self.assertTrue(delete_reserved_device(
                self.db, 1, "d1", 0,
                related_devices=[{"deviceId":"d2", "revision":0, "record":updated_guest}]
            ))
        self.assertIsNone(self.db.execute(
            "SELECT id FROM inventory_devices WHERE id='d1'"
        ).fetchone())
        self.assertEqual(json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d2'"
        ).fetchone()[0]), updated_guest)

    def test_delete_releases_ip_and_records_history(self):
        self.assertTrue(self.delete())
        self.assertIsNone(self.db.execute(
            "SELECT id FROM inventory_devices WHERE id='d1'"
        ).fetchone())
        allocation = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_ip_allocations WHERE ip='10.0.0.10'"
        ).fetchone()[0])
        self.assertEqual(allocation["status"], "Available")
        self.assertEqual(allocation["deviceId"], "")
        event = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchone()[0])
        self.assertEqual([change["action"] for change in event["changes"]],
                         ["Deleted", "Updated"])
        self.assertIsNone(self.db.execute(
            "SELECT 1 FROM device_edit_reservations WHERE device_id='d1'"
        ).fetchone())

    def test_stale_revision_preserves_device(self):
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, "changed"):
            self.delete(1)
        self.assertEqual(self.snapshot(), before)

    def test_expired_reservation_preserves_device(self):
        self.db.execute(
            "UPDATE device_edit_reservations SET expires_at=0 WHERE device_id='d1'"
        )
        self.db.commit()
        before = self.snapshot()
        with self.assertRaisesRegex(ValueError, "no longer valid"):
            self.delete()
        self.assertEqual(self.snapshot(), before)

    def test_requires_edit_permission(self):
        with patch("backend.device_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                delete_reserved_device(self.db, 1, "d1", 0)
        self.assertIsNotNone(self.db.execute(
            "SELECT id FROM inventory_devices WHERE id='d1'"
        ).fetchone())

    def test_racks_section_can_move_device_with_reservation(self):
        moved = dict(self.original, rackUStart=2, rackUEnd=2)
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Racks"):
            self.assertEqual(save_reserved_device(
                self.db, 1, "d1", 0, moved, section="Racks"
            ), 1)
        result = self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='d1'"
        ).fetchone()
        self.assertEqual(json.loads(result[0])["rackUStart"], 2)

    def test_racks_edit_permission_does_not_allow_unrelated_device_changes(self):
        before = self.snapshot()
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Racks"):
            with self.assertRaisesRegex(PermissionError, "rack placement"):
                save_reserved_device(self.db, 1, "d1", 0,
                    dict(self.original, name="Unapproved"), section="Racks")
        self.assertEqual(self.snapshot(), before)

    def test_racks_section_collision_keeps_device_and_reservation(self):
        before = self.snapshot()
        with patch("backend.device_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "Racks"):
            with self.assertRaisesRegex(ValueError, "overlaps"):
                save_reserved_device(
                    self.db, 1, "d1", 0,
                    dict(self.original, rackUStart=3, rackUEnd=3), section="Racks"
                )
        self.assertEqual(self.snapshot(), before)
