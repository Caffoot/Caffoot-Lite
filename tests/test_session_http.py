import base64
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
from backend.mfa import code_at, new_secret, provisioning_uri
from backend.schema import initialise_database
from backend.permissions import create_user
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

    def test_inventory_assets_are_served_from_existing_published_files(self):
        asset_root = Path(__file__).resolve().parents[1] / "assets"
        with patch("backend.server.ASSET_ROOT", asset_root):
            for asset in ("favicon.ico","apple-touch-icon.png","caffoot-icon-1024.png","qrcode.min.js","tailwind.css"):
                status, raw, _ = self.request("/assets/" + asset)
                self.assertEqual(status, 200)
                self.assertEqual(raw, (asset_root / asset).read_bytes())
        self.assertEqual(self.request("/assets/not-in-application.png")[0], 404)

    def test_ipam_notes_on_device_primary_ip_http(self):
        from backend.inventory import stage_inventory
        state = {
            "devices": [{"id":"linked-device", "name":"Router",
                         "mountType":"Desktop", "primaryIp":"10.0.0.10"}],
            "subnets":[{"id":"network","name":"Network",
                         "cidr":"10.0.0.0/24","gateway":"10.0.0.1","vlan":20}],
            "vlans":[],"racks":[],"rackAccessories":[],
            "ipAllocations":{"10.0.0.10":{"deviceId":"linked-device",
                                          "status":"Assigned","hostname":"Router"}}
        }
        with sqlite3.connect(self.path) as db:
            stage_inventory(db,state)
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, result = self.post("/api/ipam/allocation/save",{
                "ip":"10.0.0.10",
                "record":{"deviceId":"linked-device","status":"Assigned",
                          "hostname":"Router","notes":"Rack port A"}
            },self.token,csrf)
            self.assertEqual(status,200,result)
            status, rejected = self.post("/api/ipam/allocation/save",{
                "ip":"10.0.0.10",
                "record":{"deviceId":"linked-device","status":"Available",
                          "hostname":"Router","notes":"Rack port A"}
            },self.token,csrf)
            self.assertEqual(status,400,rejected)
        with sqlite3.connect(self.path) as db:
            saved = json.loads(db.execute(
                "SELECT record_json FROM inventory_ip_allocations WHERE ip='10.0.0.10'"
            ).fetchone()[0])
        self.assertEqual(saved["status"],"Assigned")
        self.assertEqual(saved["notes"],"Rack port A")

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

    def test_user_mfa_start_supplies_authenticator_qr_uri(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            status, user = self.post(
                "/api/users/create", {"username": "qr-user", "password": "initial"},
                self.token, csrf_for_session(self.token),
            )
            self.assertEqual(status, 200)
            with sqlite3.connect(self.path) as db:
                user_token = login_session(db, "qr-user", "initial")
            self.assertIsNotNone(user_token)
            status, enrolled = self.post(
                "/api/account/mfa/start", {"password": "initial"},
                user_token, csrf_for_session(user_token),
            )
            self.assertEqual(status, 200)
            self.assertEqual(enrolled["mfaUri"],
                             provisioning_uri("qr-user", enrolled["mfaSecret"]))


    def test_optional_profile_storage_and_private_photo(self):
        """Account profiles never change identities, session MFA or inventory access."""
        token = self.token
        csrf = csrf_for_session(token)
        cookie = COOKIE_NAME + "=" + token
        fields = {"firstName":"Jane", "lastName":"Example",
                  "emailAddress":"jane@example.test","displayName":"Jane E"}
        png = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ"
            "AAAADUlEQVQIHWP4z8DwHwAFgAI/ScL8/QAAAABJRU5ErkJggg==")
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            self.assertEqual(self.post("/api/account/profile", fields, token)[0],403)
            status, saved = self.post("/api/account/profile", fields, token, csrf)
            self.assertEqual(status,200,saved)
            self.assertEqual(saved["profile"]["displayName"], "Jane E")
            self.assertFalse(saved["profile"]["emailVerified"])
            session=json.loads(self.request("/api/session",cookie)[1])
            self.assertEqual(session["username"],"owner")
            self.assertEqual(session["profile"]["firstName"],"Jane")
            self.assertFalse(session["profile"]["hasPhoto"])
            self.assertEqual(self.post("/api/account/profile",
                {**fields,"username":"renamed"},token,csrf)[0],400)
            self.assertEqual(self.post("/api/account/profile",
                {**fields,"firstName":"\\nno"},token,csrf)[0],400)
            self.assertEqual(self.post("/api/account/photo",{
                "mediaType":"image/svg+xml","contentBase64":base64.b64encode(png).decode()
                },token,csrf)[0],400)
            self.assertEqual(self.post("/api/account/photo",{
                "mediaType":"image/png","contentBase64":"bogus"},token,csrf)[0],400)
            status,result=self.post("/api/account/photo",{
                "mediaType":"image/png","contentBase64":base64.b64encode(png).decode()
                },token,csrf)
            self.assertEqual(status,200,result)
            self.assertTrue(result["profile"]["hasPhoto"])
            self.assertEqual(self.request("/api/account/photo")[0],401)
            self.assertEqual(self.request("/api/account/photo",cookie)[1],png)
            status,user=self.post("/api/users/create",{
                "username":"profile-reader","password":"reader-password"},token,csrf)
            self.assertEqual(status,200,user)
            with sqlite3.connect(self.path) as db:
                other=login_session(db,"profile-reader","reader-password")
            self.assertIsNotNone(other)
            other_cookie=COOKIE_NAME + "=" + other
            self.assertEqual(json.loads(self.request("/api/session",other_cookie)[1])
                             ["profile"]["displayName"],"")
            self.assertEqual(self.request("/api/account/photo",other_cookie)[0],404)
            self.assertEqual(self.post("/api/account/profile",{
                "firstName":"Sam","lastName":"","emailAddress":"","displayName":""
            },other,csrf_for_session(other))[0],200)
            self.assertEqual(json.loads(self.request("/api/session",cookie)[1])
                             ["profile"]["firstName"],"Jane")
            status,removed=self.post("/api/account/photo/remove",
                                   {"confirmed":True},token,csrf)
            self.assertEqual(status,200,removed)
            self.assertFalse(removed["profile"]["hasPhoto"])
            self.assertEqual(self.request("/api/account/photo",cookie)[0],404)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute("SELECT id,is_admin,mfa_confirmed FROM accounts "
                          "WHERE username='owner'").fetchone(),(1,1,1))

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

    def test_device_editor_name_visible_and_competing_edit_still_refused(self):
        with sqlite3.connect(self.path) as db:
            owner_id = db.execute("SELECT id FROM accounts WHERE username='owner'").fetchone()[0]
            editor_id = create_user(db, owner_id, "Steve", "initial")
            db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                       ("device-1", "Test Server", '{"id":"device-1","name":"Test Server"}', 0))
            db.execute("INSERT INTO device_edit_reservations(device_id,account_id,expires_at,base_revision) "
                       "VALUES(?,?,?,0)", ("device-1", editor_id, int(time.time()) + 300))
            db.commit()
        cookie = COOKIE_NAME + "=" + self.token
        status, raw, _ = self.request("/api/inventory/state", cookie)
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)["deviceEditors"], {"device-1": "Steve"})
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            status, rejected = self.post(
                "/api/devices/edit/start", {"deviceId": "device-1"},
                self.token, csrf_for_session(self.token))
        self.assertEqual(status, 400)
        self.assertEqual(rejected["error"], "Device is being edited by Steve")
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE device_edit_reservations SET expires_at=? WHERE device_id=?",
                       (int(time.time()) - 1, "device-1"))
            db.commit()
        status, raw, _ = self.request("/api/inventory/state", cookie)
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)["deviceEditors"], {})
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
