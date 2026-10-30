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
from backend.request_auth import csrf_for_session
from backend.mfa import code_at, new_secret
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session


class SessionHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "test.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            admin, secret = bootstrap_first_admin(db, "owner", "password")
            timestamp = time.time()
            confirm_admin_mfa(db, admin, code_at(secret, timestamp), timestamp=timestamp)
            self.token = login_session(
                db, "owner", "password", mfa_code=code_at(secret, timestamp), now=timestamp
            )
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

    def request(self, path, cookie=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        headers = {} if cookie is None else {"Cookie": cookie}
        conn.request("GET", path, headers=headers)
        response = conn.getresponse()
        body = response.read()
        status = response.status
        cache = response.getheader("Cache-Control")
        conn.close()
        return status, body, cache

    def test_admin_inventory_page_contains_users_and_migration_navigation(self):
        status, body, cache = self.request(
            "/inventory", COOKIE_NAME + "=" + self.token
        )
        self.assertEqual(status, 200)
        self.assertEqual(cache, "no-store")
        self.assertIn(b'data-action="tab-users"', body)
        self.assertIn(b'data-action="next-import-pick"', body)
        self.assertIn(b'data-next-import-action="confirm"', body)
        self.assertNotIn(b"Your inventory is NOT saved in this browser", body)

    def test_inventory_requires_authenticated_inventory_access(self):
        status, body, cache = self.request("/inventory")
        self.assertEqual(status, 401)
        self.assertIn(b"unauthorised", body)
        self.assertEqual(cache, "no-store")

    def post(self, path, data, token=None, csrf=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        headers = {"Content-Type": "application/json", "Origin": "https://caffoot.example"}
        if token:
            headers["Cookie"] = COOKIE_NAME + "=" + token
        if csrf:
            headers["X-CSRF-Token"] = csrf
        conn.request("POST", path, body=json.dumps(data), headers=headers)
        response = conn.getresponse()
        status, body = response.status, json.loads(response.read())
        conn.close()
        return status, body

    def test_account_management_and_password_change_http(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, created = self.post("/api/users/create",
                                        {"username": "editor", "password": "initial"},
                                        self.token, csrf)
            self.assertEqual(status, 200)
            user_id = created["id"]
            status, _ = self.post("/api/users/permission",
                                  {"userId": user_id, "section": "Devices", "level": "read"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
            status, _ = self.post("/api/users/permission",
                                  {"userId": user_id, "section": "Devices", "level": "edit"},
                                  self.token, csrf)
            self.assertEqual(status, 400)  # Editing requires MFA enrolment.
            status, _ = self.post("/api/users/delete", {"userId": user_id}, self.token)
            self.assertEqual(status, 403)  # CSRF required.
            status, _ = self.post("/api/users/delete", {"userId": user_id}, self.token, csrf)
            self.assertEqual(status, 200)
            status, _ = self.post("/api/account/password",
                                  {"currentPassword": "password", "newPassword": "changed"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
            self.assertEqual(self.request("/api/session", COOKIE_NAME + "=" + self.token)[0], 401)

    def test_inventory_snapshot_is_sqlite_owned_and_permission_filtered(self):
        with sqlite3.connect(self.path) as db:
            db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) "
                       "VALUES(?,?,?,?)", ("device-1", "Switch", '{"id":"device-1","name":"Switch"}', 0))
            db.execute("INSERT INTO inventory_subnets(id,record_json,ordinal) "
                       "VALUES(?,?,?)", ("subnet-1", '{"id":"subnet-1"}', 0))
            db.commit()
        status, raw, _ = self.request("/api/inventory/state", COOKIE_NAME + "=" + self.token)
        self.assertEqual(status, 200)
        snapshot = json.loads(raw)
        self.assertEqual(snapshot["devices"][0]["name"], "Switch")
        self.assertEqual(snapshot["deviceRevisions"], {"device-1": 0})
        self.assertEqual(snapshot["editPermissions"],
                         {"Devices": True, "IPAM": True, "Racks": True})
        self.assertEqual(snapshot["subnets"][0]["id"], "subnet-1")
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, result = self.post("/api/users/create",
                                       {"username": "reader", "password": "initial"},
                                       self.token, csrf)
            self.assertEqual(status, 200)
            user_id = result["id"]
            status, _ = self.post("/api/users/permission",
                                  {"userId": user_id, "section": "Devices", "level": "read"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
        with sqlite3.connect(self.path) as db:
            reader_token = login_session(db, "reader", "initial")
        status, raw, _ = self.request("/api/inventory/state", COOKIE_NAME + "=" + reader_token)
        self.assertEqual(status, 200)
        snapshot = json.loads(raw)
        self.assertEqual(len(snapshot["devices"]), 1)
        self.assertNotIn("subnets", snapshot)
        self.assertNotIn("ipAllocations", snapshot)
        self.assertNotIn("racks", snapshot)
        self.assertEqual(snapshot["sections"], {"Devices": True, "IPAM": False, "Racks": False})
        self.assertEqual(snapshot["deviceRevisions"], {})
        self.assertEqual(snapshot["editPermissions"],
                         {"Devices": False, "IPAM": False, "Racks": False})
        self.assertEqual(self.request("/api/inventory/state")[0], 401)

    def test_ipam_editor_does_not_receive_hidden_device_revisions(self):
        with sqlite3.connect(self.path) as db:
            db.execute(
                "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                ("hidden-device", "Hidden", '{"id":"hidden-device","name":"Hidden"}', 0),
            )
            db.commit()
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, created = self.post(
                "/api/users/create", {"username": "ipam-editor", "password": "initial"},
                self.token, csrf,
            )
            self.assertEqual(status, 200)
            editor_id = created["id"]
            secret = new_secret()
            with sqlite3.connect(self.path) as db:
                db.execute(
                    "UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",
                    (secret, editor_id),
                )
                db.commit()
            status, _ = self.post(
                "/api/users/permission",
                {"userId": editor_id, "section": "IPAM", "level": "edit"},
                self.token, csrf,
            )
            self.assertEqual(status, 200)
        with sqlite3.connect(self.path) as db:
            editor_token = login_session(
                db, "ipam-editor", "initial",
                mfa_code=code_at(secret, time.time()),
            )
        status, raw, _ = self.request(
            "/api/inventory/state", COOKIE_NAME + "=" + editor_token
        )
        self.assertEqual(status, 200)
        snapshot = json.loads(raw)
        self.assertNotIn("devices", snapshot)
        self.assertEqual(snapshot["deviceRevisions"], {})
        self.assertEqual(snapshot["editPermissions"]["IPAM"], True)
        self.assertEqual(snapshot["editPermissions"]["Devices"], False)

    def test_device_create_edit_delete_through_authenticated_http(self):
        record = {"id":"http-new","name":"HTTP New","mountType":"Desktop","primaryIp":""}
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, created = self.post("/api/devices/create",
                                        {"record":record}, self.token, csrf)
            self.assertEqual(status, 200)
            self.assertEqual(created["revision"], 0)
            status, reserved = self.post("/api/devices/edit/start",
                                         {"deviceId":"http-new"}, self.token, csrf)
            self.assertEqual(status, 200)
            renamed = dict(record, name="HTTP Renamed")
            status, saved = self.post("/api/devices/edit/save", {
                "deviceId":"http-new","revision":reserved["revision"],
                "record":renamed,"relatedDevices":[]}, self.token, csrf)
            self.assertEqual(status, 200)
            self.assertEqual(saved["revision"], 1)
            status, reserved = self.post("/api/devices/edit/start",
                                         {"deviceId":"http-new"}, self.token, csrf)
            self.assertEqual(status, 200)
            status, deleted = self.post("/api/devices/delete", {
                "deviceId":"http-new","revision":reserved["revision"],
                "relatedDevices":[]}, self.token, csrf)
            self.assertEqual(status, 200)
            self.assertEqual(deleted["status"], "deleted")
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute(
                "SELECT COUNT(*) FROM inventory_devices WHERE id='http-new'"
            ).fetchone()[0], 0)
            self.assertEqual(db.execute(
                "SELECT COUNT(*) FROM inventory_change_history"
            ).fetchone()[0], 3)

    def test_published_device_notes_exceed_login_request_limit(self):
        # The published notes textarea is intentionally unbounded; a normal
        # device save must not be rejected by the 4 KiB login payload limit.
        record = {"id":"notes","name":"Notes","mountType":"Desktop",
                  "notes":"a" * 5000}
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            status, result = self.post(
                "/api/devices/create", {"record":record}, self.token,
                csrf_for_session(self.token)
            )
        self.assertEqual(status, 200)
        with sqlite3.connect(self.path) as db:
            stored = json.loads(db.execute(
                "SELECT record_json FROM inventory_devices WHERE id='notes'"
            ).fetchone()[0])
        self.assertEqual(stored["notes"], record["notes"])

    def test_device_edit_reservation_conflict_cancel_and_expiry(self):
        with sqlite3.connect(self.path) as db:
            db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                       ("device-1", "Switch", '{"id":"device-1","name":"Switch"}', 0))
            db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                       ("device-2", "Router", '{"id":"device-2","name":"Router"}', 1))
            db.commit()
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, result = self.post("/api/users/create",
                                       {"username": "second", "password": "initial"}, self.token, csrf)
            self.assertEqual(status, 200)
            second_id = result["id"]
            second_secret = new_secret()
            with sqlite3.connect(self.path) as db:
                db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",
                           (second_secret, second_id))
                db.commit()
            status, _ = self.post("/api/users/permission",
                                  {"userId": second_id, "section": "IPAM", "level": "edit"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
            with sqlite3.connect(self.path) as db:
                second_token = login_session(db, "second", "initial",
                                             mfa_code=code_at(second_secret, time.time()))
            self.assertIsNotNone(second_token)
            second_csrf = csrf_for_session(second_token)
            status, reservation = self.post("/api/devices/edit/start", {"deviceId": "device-1"},
                                            self.token, csrf)
            self.assertEqual(status, 200)
            self.assertEqual(reservation["revision"], 0)
            with sqlite3.connect(self.path) as db:
                db.execute("UPDATE inventory_devices SET revision=revision+1 WHERE id=?", ("device-1",))
                db.commit()
            status, repeated = self.post("/api/devices/edit/start", {"deviceId": "device-1"},
                                         self.token, csrf)
            self.assertEqual(status, 200)
            self.assertEqual(repeated["revision"], 0)
            status, _ = self.post("/api/devices/edit/start", {"deviceId": "device-1", "section": "IPAM"},
                                  second_token, second_csrf)
            self.assertEqual(status, 400)
            status, _ = self.post("/api/devices/edit/start", {"deviceId": "device-2", "section": "IPAM"},
                                  second_token, second_csrf)
            self.assertEqual(status, 200)
            status, _ = self.post("/api/devices/edit/cancel", {"deviceId": "device-1", "section": "IPAM"},
                                  second_token, second_csrf)
            self.assertEqual(status, 200)
            status, _ = self.post("/api/devices/edit/start", {"deviceId": "device-1", "section": "IPAM"},
                                  second_token, second_csrf)
            self.assertEqual(status, 400)
            status, _ = self.post("/api/devices/edit/cancel", {"deviceId": "device-1"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
            status, _ = self.post("/api/devices/edit/start", {"deviceId": "device-1", "section": "IPAM"},
                                  second_token, second_csrf)
            self.assertEqual(status, 200)
            with sqlite3.connect(self.path) as db:
                db.execute("UPDATE device_edit_reservations SET expires_at=0 WHERE device_id=?",
                           ("device-1",))
                db.commit()
            status, _ = self.post("/api/devices/edit/start", {"deviceId": "device-1"},
                                  self.token, csrf)
            self.assertEqual(status, 200)

    def test_anonymous_request_is_rejected(self):
        status, body, cache = self.request("/api/session")
        self.assertEqual(status, 401)
        self.assertIn(b"unauthorised", body)
        self.assertEqual(cache, "no-store")

    def test_valid_session_and_no_inventory_exposure(self):
        status, body, _ = self.request(
            "/api/session", COOKIE_NAME + "=" + self.token
        )
        self.assertEqual(status, 200)
        payload = json.loads(body)
        self.assertEqual(payload["username"], "owner")
        self.assertTrue(payload["is_admin"])
        self.assertEqual(len(payload["csrf_token"]), 64)
        self.assertEqual(self.request("/api/inventory")[0], 404)
        self.assertEqual(self.request("/health")[0], 200)


if __name__ == "__main__":
    unittest.main()
