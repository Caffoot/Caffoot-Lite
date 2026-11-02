"""HTTP regression for both inventory history response paths (isolated DB)."""
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
from backend.permissions import create_user, set_permission
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
            admin, secret = bootstrap_first_admin(db, "owner", "password")
            now = time.time()
            confirm_admin_mfa(db, admin, code_at(secret, now), timestamp=now)
            self.admin_token = login_session(db, "owner", "password",
                                             mfa_code=code_at(secret, now), now=now)
            self.viewer_id = create_user(db, admin, "viewer", "password")
            set_permission(db, admin, self.viewer_id, "Devices", "read")
            self.viewer_token = login_session(db, "viewer", "password")
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
                self.assertEqual(len(admin_result["changeHistory"][0]["changes"]), 5)
                self.assertEqual(admin_result["changeHistory"][0]["omitted"], 7)

    def test_revoked_permissions_invalidate_access_to_both_routes(self):
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            admin = db.execute("SELECT id FROM accounts WHERE username='owner'").fetchone()[0]
            set_permission(db, admin, self.viewer_id, "Devices", None)
            new_token = login_session(db, "viewer", "password")
        for path in ("/api/inventory/state", "/api/inventory/history"):
            with self.subTest(path=path):
                self.assertEqual(self.get(path, self.viewer_token)[0], 401)
                self.assertEqual(self.get(path, new_token)[0], 403)


if __name__ == "__main__":
    unittest.main()
