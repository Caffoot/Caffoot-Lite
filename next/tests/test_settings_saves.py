"""Focused managed inventory settings persistence tests."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.schema import initialise_database
from backend.settings_saves import save_inventory_setting


class InventorySettingsTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)

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
