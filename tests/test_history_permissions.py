"""Focused, defensive history projection regression tests for v2.0.2."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.history_permissions import visible_change_history


class HistoryPermissionProjectionTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("CREATE TABLE accounts (id INTEGER PRIMARY KEY, active INTEGER, "
                        "is_admin INTEGER, mfa_confirmed INTEGER)")
        self.db.execute("CREATE TABLE inventory_change_history "
                        "(id INTEGER PRIMARY KEY, record_json TEXT NOT NULL)")
        self.db.executemany("INSERT INTO accounts VALUES(?,?,?,?)", [
            (1, 1, 1, 1), (2, 1, 0, 1), (3, 0, 0, 1),
        ])
        self.allowed = {"Devices": True, "IPAM": False, "Racks": False}
        self.access = patch("backend.history_permissions.can_access",
                            side_effect=lambda _db, _user, section:
                            self.allowed[section])
        self.access.start()
        self.addCleanup(self.access.stop)
        self.addCleanup(self.db.close)

    def add(self, *kinds, omitted=0, reason="Inventory saved"):
        event = {"at": "2026-11-02T12:00:00Z", "reason": reason,
                 "changes": [{"action": "Updated", "kind": kind,
                              "label": "label-" + kind, "fields": []}
                             for kind in kinds], "omitted": omitted}
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                        (json.dumps(event),))
        return event

    def test_mixed_event_excludes_disallowed_changes_and_counts(self):
        self.add("Device", "IPAM", "Rack", omitted=9)
        result = visible_change_history(self.db, 2)
        self.assertEqual([c["kind"] for c in result[0]["changes"]], ["Device"])
        self.assertEqual(result[0]["omitted"], 0)
        self.assertNotIn("label-IPAM", json.dumps(result))
        self.assertNotIn("label-Rack", json.dumps(result))

    def test_all_supported_kinds_have_explicit_section_owners(self):
        self.add("Device", "Device types", "Locations", "Settings", "IPAM",
                 "Subnet", "VLAN", "Rack", "Unknown legacy")
        result = visible_change_history(self.db, 2)
        self.assertEqual([change["kind"] for change in result[0]["changes"]],
                         ["Device", "Device types", "Locations", "Settings"])
        self.allowed = {"Devices": False, "IPAM": True, "Racks": False}
        result = visible_change_history(self.db, 2)
        self.assertEqual([change["kind"] for change in result[0]["changes"]],
                         ["IPAM", "Subnet", "VLAN"])
        self.allowed = {"Devices": False, "IPAM": False, "Racks": True}
        result = visible_change_history(self.db, 2)
        self.assertEqual([change["kind"] for change in result[0]["changes"]],
                         ["Rack"])

    def test_unknown_kinds_fail_closed_for_nonadmins(self):
        self.add("Unknown legacy")
        self.assertEqual(visible_change_history(self.db, 2), [])
        self.add("Device", reason="Untrusted historical free-form text")
        result = visible_change_history(self.db, 2)
        self.assertNotIn("reason", result[0])

    def test_account_events_and_sensitive_details_are_hidden_from_section_viewers(self):
        """Section permissions cannot reveal account activity or before/after data."""
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({
                "at": "2026-11-04T08:00:00Z",
                "reason": "Personal details updated",
                "actor": "other-admin",
                "outcome": "Succeeded",
                "changes": [{
                    "kind": "Account", "action": "Updated",
                    "label": "private-user", "fields": ["Email Address"],
                    "before": {"email": "private-old@example.test"},
                    "after": {"email": "private-new@example.test"},
                }],
            }),),
        )
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({
                "at": "2026-11-04T08:01:00Z",
                "reason": "Inventory saved",
                "actor": "editor",
                "outcome": "Succeeded",
                "changes": [{
                    "kind": "Device", "action": "Updated",
                    "label": "Lab Server", "fields": ["name"],
                    "before": {"name": "old-server"},
                    "after": {"name": "new-server"},
                }],
            }),),
        )
        viewer = visible_change_history(self.db, 2)
        self.assertEqual(len(viewer), 1)
        self.assertEqual(viewer[0]["actor"], "editor")
        self.assertEqual(viewer[0]["outcome"], "Succeeded")
        self.assertNotIn("before", viewer[0]["changes"][0])
        self.assertNotIn("after", viewer[0]["changes"][0])
        self.assertNotIn("private-user", json.dumps(viewer))
        self.assertNotIn("private-old@example.test", json.dumps(viewer))
        self.allowed = {"Devices": True, "IPAM": True, "Racks": True}
        admin = visible_change_history(self.db, 1)
        self.assertEqual(len(admin), 2)
        self.assertEqual(admin[0]["changes"][0]["kind"], "Account")

    def test_admin_retains_unchanged_history(self):
        event = self.add("Device", "IPAM", "Unknown legacy", omitted=21)
        self.allowed = {"Devices": True, "IPAM": True, "Racks": True}
        self.assertEqual(visible_change_history(self.db, 1), [event])

    def test_revocation_and_no_read_permission(self):
        self.add("Device")
        self.assertEqual(len(visible_change_history(self.db, 2)), 1)
        self.allowed = {"Devices": False, "IPAM": False, "Racks": False}
        self.assertEqual(visible_change_history(self.db, 2), [])
        self.assertEqual(visible_change_history(self.db, 3), [])

    def test_unexpected_category_shape_is_ignored(self):
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                        (json.dumps({"changes": [{"kind": ["Device"]}, "invalid"]}),))
        self.assertEqual(visible_change_history(self.db, 2), [])


if __name__ == "__main__":
    unittest.main()
