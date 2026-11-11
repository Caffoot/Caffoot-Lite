"""Role administration uses the displayed consequences and a current session."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user
from backend.role_policy import evaluate_role_policy
from backend.roles import preview_role_change, confirm_role_change, account_access_details
from backend.schema import initialise_database
from backend.sessions import login_session, session_account


class RoleAdministrationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        self.admin, self.secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.admin, code_at(self.secret, 59), timestamp=59)
        self.token = login_session(self.db, "owner", "password", mfa_code=code_at(self.secret, 59), now=59)
        self.user = create_user(self.db, self.admin, "staff", "password")
        self.other = create_user(self.db, self.admin, "other", "password")
        self.user_token = login_session(self.db, "staff", "password", now=59)
        self.other_token = login_session(self.db, "other", "password", now=59)

    def tearDown(self):
        self.db.close()

    def preview(self, action, **kwargs):
        return preview_role_change(self.db, self.admin, self.token, action, now=60, **kwargs)

    def confirm(self, action, preview=None, **kwargs):
        preview = preview or self.preview(action)
        return confirm_role_change(self.db, self.admin, self.token, action, preview["proof"], now=61, **kwargs)

    def create_role(self, key="readers", grants=None):
        action = {"type": "role.create", "roleKey": key, "name": key.title(), "grants": grants or {}}
        result = self.confirm(action)
        self.assertEqual(result["status"], "updated")
        return self.db.execute("SELECT id FROM roles WHERE role_key=?", (key,)).fetchone()[0]

    def assign(self, role_id, user=None):
        return self.confirm({"type": "membership.assign", "roleId": role_id, "userId": user or self.user})

    def update(self, role_id, *, name="Readers", enabled=True, grants=None):
        return {"type": "role.update", "roleId": role_id, "name": name, "enabled": enabled, "grants": grants or {}}

    def test_role_lifecycle_stable_key_and_historical_audit(self):
        role = self.create_role(grants={"Devices": "read"})
        self.assertEqual(self.db.execute("SELECT count(*) FROM account_roles WHERE role_id=?", (role,)).fetchone()[0], 0)
        self.assign(role)
        action = self.update(role, name="Renamed", grants={"Devices": "read"})
        preview = self.preview(action)
        self.assertFalse(preview["users"][0]["revokeSessions"])
        self.assertEqual(self.confirm(action, preview)["status"], "updated")
        self.assertEqual(self.db.execute("SELECT role_key FROM roles WHERE id=?", (role,)).fetchone()[0], "readers")
        for enabled in (False, True):
            self.assertEqual(self.confirm(self.update(role, name="Renamed", enabled=enabled, grants={"Devices": "read"}))["status"], "updated")
            self.assertEqual(evaluate_role_policy(self.db, self.user).mfa_mandatory, enabled)
        action = {"type": "role.delete", "roleId": role}
        self.assertEqual(self.confirm(action)["status"], "updated")
        self.assertFalse(self.db.execute("SELECT 1 FROM roles WHERE id=?", (role,)).fetchone())
        history = [json.loads(raw) for raw, in self.db.execute("SELECT record_json FROM inventory_change_history")]
        self.assertEqual(history[-1]["actorId"], self.admin)
        self.assertEqual(history[-1]["changes"][0]["before"]["Roles and permissions"]["name"], "Renamed")
        text = json.dumps(history)
        for secret in (self.token, self.secret, "password_hash", "signature"):
            self.assertNotIn(secret, text)

    def test_multiple_roles_overrides_and_retained_access(self):
        reader = self.create_role(grants={"Devices": "read", "IPAM": "read"})
        editor = self.create_role("editors", {"Devices": "edit"})
        self.assign(reader)
        self.assign(editor)
        for level, effective in (("deny", None), ("read", "read"), ("edit", "edit"), (None, "edit")):
            action = {"type": "override.set", "userId": self.user, "section": "Devices", "level": level}
            preview = self.preview(action)
            section = preview["users"][0]["after"]["sections"]["Devices"]
            self.assertEqual(section["inherited"], "edit")
            self.assertEqual(section["override"], level)
            self.assertEqual(section["effective"], effective)
            self.assertEqual(self.confirm(action, preview)["status"], "updated")
        removal = {"type": "membership.remove", "userId": self.user, "roleId": editor}
        preview = self.preview(removal)
        self.assertEqual(preview["users"][0]["retainedPermissions"], {"Devices": "read", "IPAM": "read"})
        self.assertTrue(preview["users"][0]["revokeSessions"])
        self.confirm(removal, preview)
        self.assertEqual(evaluate_role_policy(self.db, self.user).permissions["Devices"], "read")

    def test_zero_grant_mfa_and_voluntary_enrolment_retained(self):
        role = self.create_role()
        preview = self.preview({"type": "membership.assign", "roleId": role, "userId": self.user})
        user = preview["users"][0]
        self.assertFalse(user["before"]["mfaMandatory"])
        self.assertTrue(user["after"]["mfaPending"])
        self.assign(role)
        self.assertIsNone(session_account(self.db, self.user_token, now=61))
        self.db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (self.secret, self.user))
        self.db.commit()
        self.confirm({"type": "membership.remove", "roleId": role, "userId": self.user})
        policy = evaluate_role_policy(self.db, self.user)
        self.assertFalse(policy.mfa_mandatory)
        self.assertTrue(policy.requires_mfa)
        self.assertTrue(policy.mfa_enrolled)

    def test_exact_session_revocation_and_hidden_grants(self):
        role = self.create_role(grants={"Devices": "read"})
        self.assign(role)
        self.db.execute("INSERT INTO account_permission_overrides VALUES(?, 'Devices', 'edit')", (self.user,))
        self.db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (self.secret, self.user))
        self.db.commit()
        token = login_session(self.db, "staff", "password", mfa_code=code_at(self.secret, 59), now=59)
        action = self.update(role, grants={"Devices": "edit"})
        preview = self.preview(action)
        self.assertFalse(preview["users"][0]["revokeSessions"])
        self.confirm(action, preview)
        self.assertEqual(session_account(self.db, token, now=61), self.user)
        self.assertEqual(session_account(self.db, self.other_token, now=61), self.other)
        removal = {"type": "membership.remove", "roleId": role, "userId": self.user}
        self.assertEqual(self.preview(removal)["revokedSessionCount"], 1)
        self.confirm(removal)
        self.assertIsNone(session_account(self.db, token, now=61))
        self.assertEqual(session_account(self.db, self.other_token, now=61), self.other)

    def test_session_actor_action_forgery_expiry_and_replay(self):
        role = self.create_role()
        action = {"type": "membership.assign", "roleId": role, "userId": self.user}
        preview = self.preview(action)
        second = login_session(self.db, "owner", "password", mfa_code=code_at(self.secret, 59), now=59)
        # A new actor session changes the displayed security dependencies too.
        preview = self.preview(action)
        for token, actor, changed, now in ((second, self.admin, action, 61), (self.token, self.admin, {**action, "userId": self.other}, 61),
                                            (self.token, self.admin, action, 400)):
            result = confirm_role_change(self.db, actor, token, changed, preview["proof"], now=now)
            self.assertEqual(result["status"], "confirmation required")
        with self.assertRaises(PermissionError):
            confirm_role_change(self.db, self.other, self.token, action, preview["proof"], now=61)
        forged = {**preview["proof"], "state": "0" * 64}
        self.assertEqual(confirm_role_change(self.db, self.admin, self.token, action, forged, now=61)["status"], "confirmation required")
        self.assertEqual(self.confirm(action, preview)["status"], "updated")
        self.confirm({"type": "membership.remove", "roleId": role, "userId": self.user})
        self.assertEqual(self.confirm(action, preview)["status"], "confirmation required")

    def test_stale_security_dependencies_and_refreshed_impact(self):
        role = self.create_role(grants={"Devices": "read"})
        self.assign(role)
        action = self.update(role, enabled=False, grants={"Devices": "read"})
        changes = ["UPDATE accounts SET active=0 WHERE id=?", "UPDATE accounts SET mfa_confirmed=1,mfa_secret='JBSWY3DPEHPK3PXP' WHERE id=?",
                   "INSERT INTO account_permission_overrides VALUES(?, 'Devices', 'deny')"]
        for sql in changes:
            with self.subTest(sql=sql):
                preview = self.preview(action)
                self.db.execute(sql, (self.user,))
                self.db.commit()
                result = self.confirm(action, preview)
                self.assertEqual(result["status"], "confirmation required")
                self.assertTrue(result["preview"]["available"])
                self.assertEqual(self.db.execute("SELECT enabled FROM roles WHERE id=?", (role,)).fetchone()[0], 1)
        preview = self.preview(action)
        self.db.execute("DELETE FROM roles WHERE id=?", (role,))
        self.db.commit()
        self.assertFalse(self.confirm(action, preview)["preview"]["available"])

    def test_atomic_rollback_on_audit_or_revocation_failure(self):
        role = self.create_role()
        action = {"type": "membership.assign", "roleId": role, "userId": self.user}
        preview = self.preview(action)
        history = self.db.execute("SELECT count(*) FROM inventory_change_history").fetchone()[0]
        with patch("backend.roles.record_actor_event", side_effect=RuntimeError("audit unavailable")):
            with self.assertRaises(RuntimeError):
                self.confirm(action, preview)
        self.assertFalse(self.db.execute("SELECT 1 FROM account_roles WHERE role_id=?", (role,)).fetchone())
        self.db.execute("CREATE TRIGGER reject_revocation BEFORE DELETE ON account_sessions BEGIN SELECT RAISE(ABORT,'test'); END")
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            self.confirm(action, preview)
        self.assertFalse(self.db.execute("SELECT 1 FROM account_roles WHERE role_id=?", (role,)).fetchone())
        self.assertEqual(self.db.execute("SELECT count(*) FROM inventory_change_history").fetchone()[0], history)
        self.assertEqual(session_account(self.db, self.user_token, now=61), self.user)

    def test_staff_admin_and_validation_safeguards(self):
        staff = self.db.execute("SELECT id FROM roles WHERE role_key='staff_member'").fetchone()[0]
        for action in (self.update(staff), {"type": "role.delete", "roleId": staff},
                       {"type": "membership.remove", "roleId": staff, "userId": self.user}):
            with self.assertRaisesRegex(ValueError, "Staff Member"):
                self.preview(action)
        action = {"type": "override.set", "userId": self.admin, "section": "Devices", "level": "deny"}
        self.confirm(action)
        self.assertTrue(evaluate_role_policy(self.db, self.admin).allows("Devices", edit=True))
        for action in ({"type": "override.set", "userId": True, "section": "Devices", "level": "read"},
                       {"type": "role.create", "roleKey": "staff_member", "name": "Fake", "grants": {}},
                       {"type": "override.set", "userId": self.user, "section": "Unknown", "level": "read"}):
            with self.assertRaises(ValueError):
                self.preview(action)
        with self.assertRaises(PermissionError):
            preview_role_change(self.db, self.other, self.other_token, {"type": "override.set", "userId": self.user, "section": "Devices", "level": "read"}, now=60)


if __name__ == "__main__":
    unittest.main()
