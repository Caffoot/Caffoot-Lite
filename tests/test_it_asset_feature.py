"""Independent IT Assets access reuses established roles, MFA and feature saves."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.feature_settings import save_feature_setting
from backend.http_security import COOKIE_NAME
from backend.permissions import can_access, feature_enabled
from backend.request_auth import csrf_for_session
from backend.role_policy import evaluate_role_policy
from backend.roles import account_access_details
import test_feature_settings_http as feature_http
import test_staff_section_permissions as staff_permissions
from test_it_asset_stock_schema import item


class ItAssetsPermissionTests(unittest.TestCase):
    setUp = staff_permissions.StaffSectionPermissionTests.setUp
    enrol = staff_permissions.StaffSectionPermissionTests.enrol
    role = staff_permissions.StaffSectionPermissionTests.role

    def enabled(self, value):
        return save_feature_setting(
            self.db, 1, self.token,
            dict(feature="it_assets", enabled=value, confirmDisable=True))

    def test_flag_preserves_roles_mfa_sessions_and_existing_section_choices(self):
        self.enrol()
        self.role("asset_readers", {"IT Assets": "read"})
        tables = ("accounts", "account_sessions", "roles", "role_grants",
                  "account_roles", "account_permission_overrides", "staff_members",
                  "departments", "device_assignments")
        before = {table: self.db.execute("SELECT * FROM " + table).fetchall() for table in tables}
        choices = dict(self.db.execute("SELECT * FROM organisation_features"))
        self.assertFalse(can_access(self.db, 2, "IT Assets"))
        self.enabled(True)
        self.assertTrue(can_access(self.db, 2, "IT Assets"))
        self.assertFalse(can_access(self.db, 2, "IT Assets", edit=True))
        for section in ("Devices", "Staff Members", "Departments"):
            self.assertFalse(can_access(self.db, 2, section))
        self.assertTrue(account_access_details(self.db, 2)["sections"]["IT Assets"]["featureEnabled"])
        self.enabled(False)
        self.assertFalse(can_access(self.db, 1, "IT Assets"))
        self.assertFalse(can_access(self.db, 2, "IT Assets"))
        self.assertEqual({table: self.db.execute("SELECT * FROM " + table).fetchall()
                          for table in tables}, before)
        self.assertEqual(dict(self.db.execute("SELECT * FROM organisation_features")), choices)

    def test_highest_grant_overrides_disabled_roles_and_mfa_are_unchanged(self):
        self.role("asset_readers", {"IT Assets": "read"})
        self.role("asset_editors", {"IT Assets": "edit"})
        self.enabled(True)
        self.assertFalse(can_access(self.db, 2, "IT Assets"))
        self.enrol()
        self.assertTrue(can_access(self.db, 2, "IT Assets", edit=True))
        self.db.execute("UPDATE roles SET enabled=0 WHERE role_key='asset_editors'")
        self.db.commit()
        self.assertTrue(can_access(self.db, 2, "IT Assets"))
        self.assertFalse(can_access(self.db, 2, "IT Assets", edit=True))
        for level in ("deny", "read", "edit"):
            self.db.execute(
                "INSERT OR REPLACE INTO account_permission_overrides VALUES(2,'IT Assets',?)",
                (level,))
            self.db.commit()
            self.assertEqual(can_access(self.db, 2, "IT Assets"), level != "deny")
            self.assertEqual(can_access(self.db, 2, "IT Assets", edit=True), level == "edit")
        self.assertTrue(evaluate_role_policy(self.db, 2).mfa_mandatory)
        self.db.execute("UPDATE accounts SET mfa_confirmed=0 WHERE id=2")
        self.db.commit()
        self.assertFalse(can_access(self.db, 2, "IT Assets"))

    def test_independent_features_missing_flag_and_administration_denial(self):
        self.enrol()
        self.role("asset_editors", {"IT Assets": "edit"})
        self.enabled(True)
        self.db.execute(
            "UPDATE organisation_features SET enabled=0 WHERE feature IN ('devices','ipam','racks')")
        self.db.commit()
        self.assertTrue(can_access(self.db, 2, "IT Assets", edit=True))
        for section in ("Devices", "IPAM", "Racks"):
            self.assertFalse(can_access(self.db, 1, section))
        for section in ("Staff Members", "Departments"):
            self.assertTrue(feature_enabled(self.db, section))
        with self.assertRaises(PermissionError):
            save_feature_setting(self.db, 2, self.user_token,
                                 dict(feature="it_assets", enabled=False, confirmDisable=True))
        self.db.execute("DELETE FROM organisation_features WHERE feature='it_assets'")
        self.db.commit()
        self.assertFalse(can_access(self.db, 1, "IT Assets"))
        self.assertFalse(can_access(self.db, 2, "IT Assets"))


class ItAssetsHttpTests(unittest.TestCase):
    setUp = feature_http.FeatureSettingsHttpTests.setUp
    tearDown = feature_http.FeatureSettingsHttpTests.tearDown
    request = feature_http.FeatureSettingsHttpTests.request
    post = feature_http.FeatureSettingsHttpTests.post

    def test_enabled_and_disabled_stock_is_not_exposed_as_an_unfinished_api(self):
        with sqlite3.connect(self.path) as connection:
            stock_item = item(connection)
            connection.execute("UPDATE it_asset_stock_items SET name=? WHERE id=?",
                               ("PRIVATE_STOCK_SPECIFICATION", stock_item))
            connection.commit()
        for enabled in (False, True):
            with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
                status, _ = self.post(
                    "/api/settings/features",
                    dict(feature="it_assets", enabled=enabled, confirmDisable=True),
                    self.token, csrf_for_session(self.token))
            self.assertEqual(status, 200)
            for endpoint in ("/api/inventory/state", "/api/inventory/history",
                             "/api/staff-members", "/api/departments", "/api/session"):
                status, raw, _ = self.request(endpoint, COOKIE_NAME + "=" + self.token)
                self.assertIn(status, (200, 403))
                self.assertNotIn("PRIVATE_STOCK_SPECIFICATION", raw.decode())
            status, _, _ = self.request("/api/it-assets/stock", COOKIE_NAME + "=" + self.token)
            self.assertEqual(status, 404)

    def test_assets_switch_has_existing_csrf_confirmation_and_atomic_audit_guards(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            for payload, csrf, expected in (
                    (dict(feature="it_assets", enabled=True), None, 403),
                    (dict(feature="it_assets", enabled=True, minimumStockLevel=2),
                     csrf_for_session(self.token), 400),
                    (dict(feature="it_assets", enabled=False), csrf_for_session(self.token), 400)):
                self.assertEqual(self.post(
                    "/api/settings/features", payload, self.token, csrf)[0], expected)
            for enabled in (True, True, False, False):
                self.assertEqual(self.post(
                    "/api/settings/features",
                    dict(feature="it_assets", enabled=enabled, confirmDisable=True),
                    self.token, csrf_for_session(self.token))[0], 200)
        with sqlite3.connect(self.path) as connection:
            rows = [json.loads(raw) for raw, in connection.execute(
                "SELECT record_json FROM inventory_change_history")]
            self.assertEqual(len(rows), 2)
            self.assertEqual([row["changes"][0]["label"] for row in rows], ["it_assets"] * 2)
            self.assertEqual([row["actorId"] for row in rows], [1, 1])
