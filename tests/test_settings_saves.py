"""Focused managed inventory settings persistence tests."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from enabled_inventory import enable_inventory_features
from backend.schema import initialise_database
from backend.settings_saves import save_inventory_setting


class InventorySettingsTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        enable_inventory_features(self.db)
        self.db.execute(
            "INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES(1,'audit-tester','test-hash',1,'secret',1)"
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def save(self, key, value):
        with patch("backend.settings_saves.can_access", return_value=True):
            save_inventory_setting(self.db, 1, key, value)

    def test_create_update_and_noop_preserve_values(self):
        self.save("deviceLocations", ["Unknown", "Office"])
        self.save("deviceLocations", ["Unknown", "Office"])
        self.save("deviceLocations", ["Unknown", "Office", "Store"])
        self.assertEqual(json.loads(self.db.execute(
            "SELECT value_json FROM inventory_settings WHERE key='deviceLocations'"
        ).fetchone()[0]), ["Unknown", "Office", "Store"])
        events = list(self.db.execute("SELECT id FROM inventory_change_history"))
        self.assertEqual(len(events), 2)

    def test_history_is_not_deleted_after_two_hundred_events(self):
        """Approved Audit Trail: new events persist without automatic expiry."""
        for i in range(215):
            self.save("deviceLocations", ["Unknown", "Location %d" % i])
        count = self.db.execute(
            "SELECT COUNT(*) FROM inventory_change_history"
        ).fetchone()[0]
        self.assertEqual(count, 215)
        first = self.db.execute(
            "SELECT record_json FROM inventory_change_history ORDER BY id LIMIT 1"
        ).fetchone()
        self.assertIsNotNone(first)
        self.assertIn("deviceLocations", first[0])

    def test_reject_unknown_keys(self):
        with self.assertRaises(ValueError):
            self.save("password_hash", "bad")
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM inventory_settings"
        ).fetchone()[0], 0)

    def test_edit_permission_required(self):
        with patch("backend.settings_saves.can_access", return_value=False):
            with self.assertRaises(PermissionError):
                save_inventory_setting(self.db, 1, "deviceLocations", [])
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM inventory_settings"
        ).fetchone()[0], 0)

    def test_ipam_only_edit_cannot_modify_device_managed_settings(self):
        with patch("backend.settings_saves.can_access",
                   side_effect=lambda _c, _a, section, edit=False: section == "IPAM"):
            with self.assertRaises(PermissionError):
                save_inventory_setting(self.db, 1, "installedSoftware", [])
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM inventory_settings"
        ).fetchone()[0], 0)

    def test_software_service_names_create_and_edit_at_shared_boundary(self):
        for key in ("installedSoftware", "serverFunctions"):
            with self.subTest(key=key):
                for length in (80, 81, 99, 100):
                    value = [{"key": "fictional-entry", "label": "N" * length, "unknown": "retained"}]
                    self.save(key, value)
                    self.assertEqual(json.loads(self.db.execute(
                        "SELECT value_json FROM inventory_settings WHERE key=?", (key,)
                    ).fetchone()[0]), value)
                history = self.db.execute("SELECT count(*) FROM inventory_change_history").fetchone()[0]
                with self.assertRaisesRegex(ValueError, "100 characters"):
                    self.save(key, [{"key": "fictional-entry", "label": "N" * 101}])
                self.assertEqual(self.db.execute("SELECT count(*) FROM inventory_change_history").fetchone()[0], history)
                self.assertEqual(json.loads(self.db.execute(
                    "SELECT value_json FROM inventory_settings WHERE key=?", (key,)
                ).fetchone()[0]), value)

    def test_name_limit_matches_browser_unicode_length(self):
        for key in ("installedSoftware", "serverFunctions"):
            self.save(key, [{"key": "unicode", "label": "é" * 100}])
            self.save(key, [{"key": "unicode", "label": "😀" * 50}])
            with self.assertRaises(ValueError):
                self.save(key, [{"key": "unicode", "label": "😀" * 50 + "x"}])

    def test_existing_oversize_names_survive_other_changes_without_truncation(self):
        for key in ("installedSoftware", "serverFunctions"):
            legacy = {"key": "legacy", "label": "L" * 120, "unknown": "retained"}
            self.db.execute("INSERT INTO inventory_settings(key,value_json) VALUES(?,?)",
                            (key, json.dumps([legacy])))
            self.db.commit()
            value = [dict(legacy, archived=True), {"key": "new", "label": "N" * 100}]
            self.save(key, value)
            self.assertEqual(json.loads(self.db.execute(
                "SELECT value_json FROM inventory_settings WHERE key=?", (key,)
            ).fetchone()[0]), value)
            with self.assertRaises(ValueError):
                self.save(key, [dict(legacy, label="R" * 120)])

    def test_frontend_name_limits_share_backend_value_and_other_limits_stay(self):
        from pathlib import Path
        from backend.settings_saves import SOFTWARE_SERVICE_NAME_MAX_LENGTH
        root = Path(__file__).resolve().parents[1]
        self.assertEqual(SOFTWARE_SERVICE_NAME_MAX_LENGTH, 100)
        self.assertIn("const SOFTWARE_SERVICE_NAME_MAX_LENGTH = 100;",
                      (root / "interface/application.js").read_text())
        html = (root / "interface/screens/device-management.html").read_text()
        for field in ("software-custom-name", "server-service-name-input",
                      "server-service-manager-name-input", "software-name"):
            self.assertRegex(html, r'id="' + field + r'"[^>]*maxlength="100"')
        self.assertIn('maxlength="80"', (root / "interface/screens/racks.html").read_text())
        self.save("hardwareCatalogue", [{"model": "M" * 120}])
