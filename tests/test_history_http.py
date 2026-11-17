"""HTTP regression for both inventory history response paths (isolated DB)."""
from confirmed_permissions import set_permission
from enabled_inventory import enable_inventory_features
import http.client
import json
import sqlite3
import tempfile
import threading
import time
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.permissions import create_user
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session


class HistoryHttpPermissionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "test.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            # Complete administrator history requires every inventory feature.
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            enable_inventory_features(db)
            admin, secret = bootstrap_first_admin(db, "owner", "password")
            now = time.time()
            confirm_admin_mfa(db, admin, code_at(secret, now), timestamp=now)
            self.admin_token = login_session(db, "owner", "password",
                                             mfa_code=code_at(secret, now), now=now)
            self.viewer_id = create_user(db, admin, "viewer", "password")
            self.viewer_secret = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"
            db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (self.viewer_secret, self.viewer_id))
            db.commit()
            set_permission(db, admin, self.viewer_id, "Devices", "read")
            self.viewer_token = login_session(db, "viewer", "password", mfa_code=code_at(self.viewer_secret, now), now=now)
            self.assertTrue(self.viewer_token)
            event = {"at": "2026-11-02T12:00:00Z", "reason": "Inventory saved",
                     "changes": [
                         {"action": "Updated", "kind": "Device", "label": "allowed", "fields": []},
                         {"action": "Updated", "kind": "IPAM", "label": "hidden-ipam", "fields": []},
                         {"action": "Updated", "kind": "Rack", "label": "hidden-rack", "fields": []},
                         {"action": "Updated", "kind": "Settings", "label": "device-setting", "fields": []},
                         {"action": "Updated", "kind": "unknown-legacy", "label": "hidden-other", "fields": []},
                     ], "omitted": 7}
            db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                       (json.dumps(event),))
            db.commit()
        self.path_patch = patch("backend.server.DB_PATH", self.path)
        self.path_patch.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.path_patch.stop()
        self.temp.cleanup()

    def get(self, path, token):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        headers = {"Cookie": COOKIE_NAME + "=" + token} if token else {}
        connection.request("GET", path, headers=headers)
        response = connection.getresponse()
        status, raw = response.status, response.read()
        connection.close()
        return status, json.loads(raw)

    def test_history_is_filtered_on_both_routes_and_admin_retains_all(self):
        for path in ("/api/inventory/state", "/api/inventory/history"):
            with self.subTest(path=path):
                status, result = self.get(path, self.viewer_token)
                self.assertEqual(status, 200, result)
                entries = result["changeHistory"]
                self.assertEqual(len(entries), 1)
                self.assertEqual([change["label"] for change in entries[0]["changes"]],
                                 ["allowed", "device-setting"])
                self.assertEqual(entries[0]["omitted"], 0)
                status, admin_result = self.get(path, self.admin_token)
                self.assertEqual(status, 200)
                inventory_events = [
                    event for event in admin_result["changeHistory"]
                    if event.get("reason") == "Inventory saved"
                ]
                self.assertEqual(len(inventory_events), 1)
                self.assertEqual(len(inventory_events[0]["changes"]), 5)
                self.assertEqual(inventory_events[0]["omitted"], 7)
                with sqlite3.connect(self.path) as db:
                    stored = [json.loads(raw) for (raw,) in db.execute(
                        "SELECT record_json FROM inventory_change_history ORDER BY id")]
                self.assertEqual(admin_result["changeHistory"], stored)

    def test_admin_essential_history_survives_disabled_features_on_both_routes(self):
        essential = ("Account", "Role", "Security")
        inventory = {"devices": "Device", "ipam": "IPAM", "racks": "Rack", "it_assets": "IT Assets"}
        events = [{"at": "2026-11-02T12:00:00Z", "actor": "owner", "outcome": "Succeeded",
                   "reason": "PRIVATE_REASON", "omitted": 4, "extra": "PRIVATE_EVENT",
                   "changes": [{"kind": kind, "action": "Updated", "label": "essential-" + kind,
                                "fields": ["Status"], "before": {"rackId": "PRIVATE_BEFORE"},
                                "after": {"rackId": "PRIVATE_AFTER"}}]}
                  for kind in essential]
        mixed = {"reason": "PRIVATE_MIXED_REASON", "omitted": 12, "extra": "PRIVATE_EXTRA",
                 "changes": [{"kind": kind, "label": "mixed-" + kind, "fields": [],
                              "after": {"rackId": "PRIVATE_DETAIL"}}
                             for kind in (*essential, *inventory.values(), "Unknown legacy")]}
        events.append(mixed)
        with sqlite3.connect(self.path) as db:
            db.executemany("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                           [(json.dumps(event),) for event in events])
            stored = db.execute("SELECT * FROM inventory_change_history ORDER BY id").fetchall()
        for disabled in [set(inventory)] + [{feature} for feature in inventory]:
            with sqlite3.connect(self.path) as db:
                db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks','it_assets')")
                db.executemany("UPDATE organisation_features SET enabled=0 WHERE feature=?",
                               [(feature,) for feature in disabled])
            for path in ("/api/inventory/state", "/api/inventory/history"):
                with self.subTest(disabled=disabled, path=path):
                    status, result = self.get(path, self.admin_token)
                    self.assertEqual(status, 200, result)
                    history = result["changeHistory"]
                    singles = [event for event in history
                               if event["changes"][0]["label"].startswith("essential-")]
                    self.assertEqual([event["changes"][0]["kind"] for event in singles], list(essential))
                    self.assertTrue(all(event["actor"] == "owner" and event["outcome"] == "Succeeded"
                                        for event in singles))
                    self.assertEqual([change["kind"] for change in history[-1]["changes"]],
                                     [*essential, *(kind for feature, kind in inventory.items()
                                                    if feature not in disabled)])
                    if disabled == {"it_assets"}:
                        self.assertEqual(history[:-1], [json.loads(row[1]) for row in stored[:-1]])
                    else:
                        self.assertTrue(all(event["omitted"] == 0 for event in history))
                        self.assertNotIn("PRIVATE", json.dumps(history))
                    self.assertEqual(history[-1]["omitted"], 0)
                    self.assertNotIn("PRIVATE", json.dumps(history[-1]))
                    self.assertNotIn("Unknown legacy", json.dumps(history))
                    for feature, kind in inventory.items():
                        if feature in disabled:
                            self.assertNotIn(kind, [change["kind"] for event in history
                                                   for change in event["changes"]])
            with sqlite3.connect(self.path) as db:
                self.assertEqual(db.execute(
                    "SELECT * FROM inventory_change_history ORDER BY id").fetchall(), stored)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks','it_assets')")
        for path in ("/api/inventory/state", "/api/inventory/history"):
            self.assertEqual(self.get(path, self.admin_token)[1]["changeHistory"],
                             [json.loads(row[1]) for row in stored])

    def test_inventory_read_and_edit_never_reveal_essential_history_on_either_route(self):
        essential = ("Account", "Role", "Security")
        with sqlite3.connect(self.path) as db:
            admin = db.execute("SELECT id FROM accounts WHERE username='owner'").fetchone()[0]
            db.executemany("INSERT INTO inventory_change_history(record_json) VALUES(?)", [
                (json.dumps({"changes": [{"kind": kind, "label": "PRIVATE_" + kind}]}),)
                for kind in essential])
            db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                       (json.dumps({"changes": [{"kind": kind, "label": "PRIVATE_" + kind}
                                                for kind in essential] +
                                               [{"kind": "Device", "label": "visible-mixed"}]}),))
            db.commit()
            for level in ("read", "edit"):
                for section in ("Devices", "IPAM", "Racks", "IT Assets"):
                    set_permission(db, admin, self.viewer_id, section, level)
                token = login_session(db, "viewer", "password",
                                      mfa_code=code_at(self.viewer_secret, time.time()))
                for path in ("/api/inventory/state", "/api/inventory/history"):
                    with self.subTest(level=level, path=path):
                        status, result = self.get(path, token)
                        self.assertEqual(status, 200, result)
                        self.assertNotIn("PRIVATE", json.dumps(result["changeHistory"]))
                        self.assertTrue(all(change["kind"] not in essential
                                            for event in result["changeHistory"] for change in event["changes"]))
                        self.assertEqual(result["changeHistory"][-1]["changes"][0]["label"], "visible-mixed")

    def test_history_routes_reject_unauthenticated_inactive_and_unconfirmed_admins(self):
        for path in ("/api/inventory/state", "/api/inventory/history"):
            for token in (None, "invalid", "0" * 64):
                with self.subTest(path=path, token=token):
                    self.assertEqual(self.get(path, token)[0], 401)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0")
        for column in ("active", "mfa_confirmed"):
            with sqlite3.connect(self.path) as db:
                db.execute(f"UPDATE accounts SET {column}=0 WHERE username='owner'")
            for path in ("/api/inventory/state", "/api/inventory/history"):
                with self.subTest(path=path, column=column):
                    self.assertEqual(self.get(path, self.admin_token)[0], 401)
            with sqlite3.connect(self.path) as db:
                db.execute(f"UPDATE accounts SET {column}=1 WHERE username='owner'")

    def test_revoked_permissions_invalidate_access_to_both_routes(self):
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            admin = db.execute("SELECT id FROM accounts WHERE username='owner'").fetchone()[0]
            set_permission(db, admin, self.viewer_id, "Devices", None)
            new_token = login_session(db, "viewer", "password", mfa_code=code_at(self.viewer_secret, time.time()))
        for path in ("/api/inventory/state", "/api/inventory/history"):
            with self.subTest(path=path):
                self.assertEqual(self.get(path, self.viewer_token)[0], 401)
                self.assertEqual(self.get(path, new_token)[0], 403)


if __name__ == "__main__":
    unittest.main()
