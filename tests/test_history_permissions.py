"""Permission-filtered history retains existing inventory and stock boundaries."""
import json
import itertools
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
                            self.allowed.get(section, False))
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

    def test_subnet_batch_count_is_visible_only_to_ipam_readers(self):
        self.allowed = {"Devices": False, "IPAM": True, "Racks": False}
        event = {"changes": [{"kind": "IPAM", "label": "Subnet", "fields": []}] * 16,
                 "reason": "Do not forward arbitrary private descriptions", "omitted": 35,
                 "subnetBatch": {"createdCount": 50, "firstCidr": "10.80.0.0/24",
                                 "lastCidr": "10.80.49.0/24", "parentCidr": "10.80.0.0/16"}}
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)", (json.dumps(event),))
        visible = visible_change_history(self.db, 2)
        self.assertIn("Created 50 subnet(s)", visible[0]["reason"])
        self.assertIn("10.80.0.0/16", visible[0]["reason"])
        self.assertNotIn("private descriptions", json.dumps(visible))
        self.assertEqual(visible[0]["omitted"], 0)
        self.allowed = {"Devices": True, "IPAM": False, "Racks": False}
        self.assertEqual(visible_change_history(self.db, 2), [])

    def test_invalid_subnet_summary_cannot_forward_untrusted_text(self):
        self.allowed = {"Devices": False, "IPAM": True, "Racks": False}
        for count,cidr in [(51,"10.80.0.0/24"),(True,"10.80.0.0/24"),(50,"private text")]:
            event={"changes":[{"kind":"IPAM"}],"reason":"private text",
                   "subnetBatch":{"createdCount":count,"firstCidr":cidr,"lastCidr":"10.80.49.0/24","parentCidr":None}}
            self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",(json.dumps(event),))
        self.assertTrue(all("reason" not in e for e in visible_change_history(self.db,2)))

    def test_subject_projection_preserves_original_labels_and_section_boundary(self):
        from backend.audit_events import audit_subject
        event = self.add('Device', 'Staff Member', 'IT Assets')
        event['changes'][0].update(audit_subject('Device', 'device-id', 'Event-time Laptop'))
        event['changes'][0]['recordSubject']['extra'] = 'private extension'
        event['changes'][1].update(audit_subject('Staff Member', 'staff-id', 'Private Staff'))
        event['changes'][2].update(audit_subject('Stock Item', 'stock-id', 'Private Stock'))
        self.db.execute('UPDATE inventory_change_history SET record_json=?', (json.dumps(event),))
        stored = self.db.execute('SELECT record_json FROM inventory_change_history').fetchone()
        result = visible_change_history(self.db, 2)
        self.assertEqual(result[0]['changes'], [{
            'kind': 'Device', 'action': 'Updated', 'label': 'label-Device', 'fields': [],
            'recordSubject': {'kind': 'Device', 'id': 'device-id', 'name': 'Event-time Laptop'},
        }])
        self.assertEqual(self.db.execute('SELECT record_json FROM inventory_change_history').fetchone(), stored)
        self.assertEqual(audit_subject('Device', 'device-id', 'bad\nname'),
                         {'recordSubject': {'kind': 'Device', 'id': 'device-id'}})

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
        events = [self.add(kind, omitted=21, reason="Historical free-form reason")
                  for kind in ("Account", "Role", "Security", "Device", "IPAM",
                               "Rack", "IT Assets", "Unknown legacy")]
        events.append({"changes": [{"kind": "Account", "before": {"role": "Old"},
                                    "after": {"role": "New"}}],
                       "actorId": 1, "confirmationId": "historical-reference"})
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                        (json.dumps(events[-1]),))
        self.allowed = {"Devices": True, "IPAM": True, "Racks": True, "IT Assets": True}
        self.assertEqual(visible_change_history(self.db, 1), events)

    def test_admin_retains_exact_non_stock_history_with_it_assets_disabled(self):
        self.allowed = {"Devices": True, "IPAM": True, "Racks": True, "IT Assets": False}
        events = [{"at": "2026-11-02T12:00:00Z", "reason": "Established historical reason",
                   "actor": "owner", "actorId": 1, "outcome": "Succeeded", "omitted": 7,
                   "confirmationId": "historical-reference", "legacyDetail": {"retained": True},
                   "changes": [{"kind": kind, "action": "Updated", "label": "label-" + kind,
                                "fields": ["Status"], "before": {"Status": "Old"},
                                "after": {"Status": "New"}}]}
                  for kind in ("Account", "Role", "Security", "Device", "IPAM", "Rack", "Unknown legacy")]
        self.db.executemany("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                            [(json.dumps(event),) for event in events])
        self.add("IT Assets")
        self.add("Account", "IT Assets", reason="Hidden stock details", omitted=12)
        stored = self.db.execute("SELECT * FROM inventory_change_history ORDER BY id").fetchall()
        result = visible_change_history(self.db, 1)
        self.assertEqual(result[:-1], events)
        self.assertEqual(result[-1], {
            "at": "2026-11-02T12:00:00Z", "omitted": 0,
            "changes": [{"kind": "Account", "action": "Updated", "label": "label-Account", "fields": []}],
        })
        self.assertEqual(self.db.execute(
            "SELECT * FROM inventory_change_history ORDER BY id").fetchall(), stored)

    def test_admin_essential_events_survive_every_inventory_feature_combination(self):
        inventory_kinds = {"Devices": ("Device", "Device types", "Locations", "Settings"),
                           "IPAM": ("IPAM", "Subnet", "VLAN"), "Racks": ("Rack",),
                           "IT Assets": ("IT Assets",)}
        kinds = ["Account", "Role", "Security"]
        kinds += [kind for group in inventory_kinds.values() for kind in group]
        kinds += ["Unknown legacy"]
        events = [self.add(kind) for kind in kinds]
        stored = self.db.execute("SELECT * FROM inventory_change_history ORDER BY id").fetchall()
        for flags in itertools.product((False, True), repeat=4):
            self.allowed = dict(zip(inventory_kinds, flags))
            with self.subTest(sections=self.allowed):
                result = visible_change_history(self.db, 1)
                expected = kinds[:3] + [kind for section, group in inventory_kinds.items()
                                        if self.allowed[section] for kind in group]
                if all(flags[:3]):
                    expected.append("Unknown legacy")
                if all(flags):
                    self.assertEqual(result, events)
                self.assertEqual([event["changes"][0]["kind"] for event in result], expected)
                self.assertEqual(self.db.execute(
                    "SELECT * FROM inventory_change_history ORDER BY id").fetchall(), stored)

    def test_restricted_admin_mixed_events_do_not_forward_hidden_payloads(self):
        event = {"at": "2026-11-02T12:00:00Z", "actor": "owner", "outcome": "Succeeded",
                 "reason": "PRIVATE_REASON", "omitted": 99, "extra": "PRIVATE_EXTRA",
                 "subnetBatch": {"createdCount": 1, "firstCidr": "10.80.0.0/24",
                                 "lastCidr": "10.80.0.0/24", "parentCidr": None},
                 "changes": [{"kind": kind, "label": "label-" + kind, "action": "Updated",
                              "fields": ["Status"], "before": {"rackId": "PRIVATE_BEFORE"},
                              "after": {"rackId": "PRIVATE_AFTER"}, "extra": "PRIVATE_CHANGE"}
                             for kind in ("Account", "Device", "Role", "IPAM", "Security",
                                          "Rack", "IT Assets", "Unknown legacy")]}
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                        (json.dumps(event),))
        sections = {"Devices": "Device", "IPAM": "IPAM", "Racks": "Rack", "IT Assets": "IT Assets"}
        for disabled in [set(sections)] + [{section} for section in sections]:
            self.allowed = {section: section not in disabled for section in sections}
            with self.subTest(disabled=disabled):
                result = visible_change_history(self.db, 1)
                expected = [kind for kind in ("Account", "Device", "Role", "IPAM", "Security",
                                              "Rack", "IT Assets")
                            if kind not in {sections[section] for section in disabled}]
                self.assertEqual([change["kind"] for change in result[0]["changes"]], expected)
                self.assertEqual(result[0]["omitted"], 0)
                self.assertEqual(result[0]["actor"], "owner")
                self.assertEqual(result[0]["outcome"], "Succeeded")
                self.assertNotIn("reason", result[0])
                self.assertNotIn("PRIVATE", json.dumps(result))
                self.assertNotIn("subnetBatch", result[0])

    def test_restricted_admin_ignores_unrecognised_categories_and_event_shapes(self):
        self.allowed = {"Devices": False, "IPAM": False, "Racks": False, "IT Assets": False}
        for event in (None, [], "PRIVATE", {"changes": None}, {"changes": {}},
                      {"changes": [None, "PRIVATE", {"kind": ["Account"]},
                                   {"kind": {"Account": True}}, {"kind": "Unknown legacy"}]}):
            self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                            (json.dumps(event),))
        self.assertEqual(visible_change_history(self.db, 1), [])
        self.add("Security")
        self.assertEqual(len(visible_change_history(self.db, 1)), 1)

    def test_inventory_permissions_never_grant_essential_administrator_history(self):
        for kind in ("Account", "Role", "Security"):
            self.add(kind)
        self.add("Account", "Device", "Role", "Security")
        self.allowed = {"Devices": True, "IPAM": True, "Racks": True, "IT Assets": True}
        result = visible_change_history(self.db, 2)
        self.assertEqual(len(result), 1)
        self.assertEqual([change["kind"] for change in result[0]["changes"]], ["Device"])

    def test_essential_history_requires_an_active_administrator_with_confirmed_mfa(self):
        for kind in ("Account", "Role", "Security"):
            self.add(kind)
        self.allowed = {}
        for column in ("active", "is_admin", "mfa_confirmed"):
            with self.subTest(column=column):
                self.db.execute(f"UPDATE accounts SET {column}=0 WHERE id=1")
                self.assertEqual(visible_change_history(self.db, 1), [])
                self.db.execute(f"UPDATE accounts SET {column}=1 WHERE id=1")
        self.assertEqual(visible_change_history(self.db, 999), [])

    def test_admin_stock_device_associations_stay_hidden_without_devices(self):
        self.db.execute("CREATE TABLE it_asset_stock_units (id INTEGER PRIMARY KEY, device_id TEXT)")
        self.db.execute("CREATE TABLE it_asset_stock_entries (movement_id INTEGER, stock_unit_id INTEGER)")
        self.db.execute("INSERT INTO it_asset_stock_units VALUES(1,'PRIVATE_DEVICE')")
        self.db.execute("INSERT INTO it_asset_stock_entries VALUES(7,1)")
        changes = [{"kind": "IT Assets", "label": "PRIVATE_ASSOCIATION", "after": after}
                   for after in ({"deviceId": "PRIVATE_DEVICE"}, {"movementId": 7},
                                 {"closureMovementId": 7})]
        changes += [{"kind": "IT Assets", "label": "Unassociated stock", "after": {}},
                    {"kind": "Account", "label": "owner"}]
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                        (json.dumps({"changes": changes}),))
        self.allowed = {"Devices": False, "IPAM": True, "Racks": True, "IT Assets": True}
        result = visible_change_history(self.db, 1)
        self.assertEqual([change["label"] for change in result[0]["changes"]],
                         ["Unassociated stock", "owner"])
        self.assertNotIn("PRIVATE", json.dumps(result))

    def test_stock_subject_does_not_disclose_device_name_without_devices_read(self):
        event = {"changes": [
            {"kind": "IT Assets", "label": "Equipment", "fields": [],
             "recordSubject": {"kind": "Device", "id": "private-device", "name": "Private laptop"}},
            {"kind": "IT Assets", "label": "Stock", "fields": [],
             "recordSubject": {"kind": "Stock Item", "id": "stock-id", "name": "USB cable"}},
        ]}
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)", (json.dumps(event),))
        self.allowed = {"IT Assets": True}
        result = visible_change_history(self.db, 2)
        self.assertNotIn("Private laptop", json.dumps(result))
        self.assertNotIn("private-device", json.dumps(result))
        self.assertEqual(result[0]["changes"][1]["recordSubject"]["name"], "USB cable")
        self.allowed["Devices"] = True
        result = visible_change_history(self.db, 2)
        self.assertEqual(result[0]["changes"][0]["recordSubject"]["name"], "Private laptop")

    def test_stock_only_reader_cannot_reclassify_pre_reset_movement_using_reused_id(self):
        self.db.execute("CREATE TABLE it_asset_stock_units (id INTEGER PRIMARY KEY, device_id TEXT)")
        self.db.execute("CREATE TABLE it_asset_stock_entries (movement_id INTEGER, stock_unit_id INTEGER)")
        self.db.execute("INSERT INTO it_asset_stock_entries VALUES(7,NULL)")
        before = {"changes": [{"kind": "IT Assets", "label": "Historical Device movement",
                               "after": {"movementId": 7}}]}
        reset = {"changes": [], "reason": "Clean inventory reset", "operationalReset": True}
        after = {"changes": [{"kind": "IT Assets", "label": "Current quantity movement",
                              "after": {"movementId": 7}}]}
        self.db.executemany("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                           ((json.dumps(event),) for event in (before, reset, after)))
        self.allowed = {"IT Assets": True}
        self.assertEqual([event["changes"][0]["label"] for event in visible_change_history(self.db, 2)],
                         ["Current quantity movement"])
        self.allowed["Devices"] = True
        self.assertEqual([event["changes"][0]["label"] for event in visible_change_history(self.db, 2)],
                         ["Historical Device movement", "Current quantity movement"])

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


    def test_history_is_not_capped_at_two_hundred_events(self):
        # The approved Audit Trail retains all new entries by default.
        # The old browser history UI capped records at 200; SQLite must not.
        for _ in range(205):
            self.add("Device")
        self.assertEqual(len(visible_change_history(self.db, 1)), 205)
        self.assertEqual(len(visible_change_history(self.db, 2)), 205)
        self.allowed = {"Devices": False, "IPAM": False, "Racks": False}
        self.assertEqual(visible_change_history(self.db, 2), [])



if __name__ == "__main__":
    unittest.main()
