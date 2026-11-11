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

    def test_subnet_first_batch_permissions_atomicity_and_visible_count_http(self):
        from backend.inventory import stage_inventory
        from confirmed_permissions import set_permission
        with sqlite3.connect(self.path) as db:
            stage_inventory(db, {"devices":[],"subnets":[],"vlans":[],"racks":[],"rackAccessories":[],"ipAllocations":{}})
            admin = db.execute("SELECT id FROM accounts WHERE is_admin=1").fetchone()[0]
            editor = create_user(db, admin, "subnet-editor", "initial")
            secret = new_secret()
            db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(secret,editor));db.commit()
            set_permission(db,admin,editor,"IPAM","edit")
            editor_token=login_session(db,"subnet-editor","initial",mfa_code=code_at(secret,time.time()))
            reader=create_user(db,admin,"subnet-reader","initial");set_permission(db,admin,reader,"IPAM","read")
            reader_secret = new_secret()
            db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (reader_secret, reader))
            db.commit()
            reader_token=login_session(db,"subnet-reader","initial",mfa_code=code_at(reader_secret,time.time()))
            create_user(db,admin,"subnet-no-access","initial")
            none_token=login_session(db,"subnet-no-access","initial")
        parent={"id":"http-office","kind":"container","name":"Fictional office","cidr":"10.85.0.0/16"}
        records=[parent]+[{"id":f"http-net-{i}","kind":"network","name":f"Fictional {i}","purpose":"LAN","cidr":f"10.85.{i}.0/24","gateway":f"10.85.{i}.1","parentId":parent["id"]}for i in range(50)]
        payload={"changes":[{"collection":"subnets","id":r["id"],"record":r}for r in records]}
        with patch("backend.server.PUBLIC_ORIGIN","https://caffoot.example"):
            for token in [reader_token,none_token,None]:
                status,_=self.post("/api/ipam/subnets/save",payload,token,csrf_for_session(token))
                self.assertEqual(status,403)
            self.assertEqual(self.post("/api/ipam/subnets/save",payload,editor_token)[0],403)
            broken=json.loads(json.dumps(payload));broken["changes"][26]["record"]["gateway"]="10.85.25.255"
            self.assertEqual(self.post("/api/ipam/subnets/save",broken,editor_token,csrf_for_session(editor_token))[0],400)
            with sqlite3.connect(self.path) as db:self.assertEqual(db.execute("SELECT COUNT(*) FROM inventory_subnets").fetchone()[0],0)
            status,result=self.post("/api/ipam/subnets/save",payload,editor_token,csrf_for_session(editor_token))
            self.assertEqual(status,200,result)
        for token in [editor_token,reader_token]:
            status,raw,_=self.request("/api/inventory/state",COOKIE_NAME+"="+token)
            self.assertEqual(status,200);visible=json.loads(raw)
            self.assertNotIn("devices",visible)
            self.assertEqual(len(visible["subnets"]),51)
            summaries=[e for e in visible["changeHistory"] if "Created 50 subnet(s)" in e.get("reason","")]
            self.assertEqual(len(summaries),1)
            self.assertEqual(summaries[0]["actor"],"subnet-editor")
        with sqlite3.connect(self.path) as db:
            events=[json.loads(r[0]) for r in db.execute("SELECT record_json FROM inventory_change_history")]
            batches=[e for e in events if e.get("subnetBatch")]
            self.assertEqual(len(batches),1);self.assertEqual(batches[0]["omitted"],35)

    def test_legacy_device_vlan_metadata_survives_reserved_save_http(self):
        record={"id":"legacy-vlan-device","name":"Fictional legacy","mountType":"Desktop","primaryIp":"","vlan":"Historical value to retain"}
        with patch("backend.server.PUBLIC_ORIGIN","https://caffoot.example"):
            csrf=csrf_for_session(self.token)
            self.assertEqual(self.post("/api/devices/create",{"record":record},self.token,csrf)[0],200)
            status,reservation=self.post("/api/devices/edit/start",{"deviceId":record["id"]},self.token,csrf)
            self.assertEqual(status,200)
            changed=dict(record,name="Fictional renamed")
            status,result=self.post("/api/devices/edit/save",{"deviceId":record["id"],"revision":reservation["revision"],"record":changed},self.token,csrf)
            self.assertEqual(status,200,result)
        with sqlite3.connect(self.path) as db:
            saved=json.loads(db.execute("SELECT record_json FROM inventory_devices WHERE id=?",(record["id"],)).fetchone()[0])
        self.assertEqual(saved["vlan"],record["vlan"])

    def test_inventory_assets_are_served_from_existing_published_files(self):
        asset_root = Path(__file__).resolve().parents[1] / "assets"
        with patch("backend.server.ASSET_ROOT", asset_root):
            for asset in ("favicon.ico","apple-touch-icon.png","caffoot-icon-1024.png","caffoot-logo-256.png","qrcode.min.js","tailwind.css"):
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
        self.assertIn(b'/interface/loader.js', body)
        for filename, marker in (
                ("navigation.html", b'data-action="tab-users"'),
                ("settings.html", b'data-action="next-import-pick"'),
                ("migration.html", b'data-next-import-action="cancel"')):
            status, fragment, cache = self.request(
                "/interface/screens/" + filename, COOKIE_NAME + "=" + self.token)
            self.assertEqual(status, 200)
            self.assertEqual(cache, "private, no-store")
            self.assertIn(marker, fragment)
            self.assertEqual(self.request("/interface/screens/" + filename)[0], 401)
        self.assertNotIn(b"Your inventory is NOT saved in this browser", body)

    def test_packaged_account_resources_require_authentication_without_inventory_data(self):
        with sqlite3.connect(self.path) as db:
            user = create_user(db, 1, "no-inventory-access", "password")
            token = login_session(db, "no-inventory-access", "password")
        for path in ("/interface/application.js", "/interface/screens/dashboard.html",
                     "/interface/styles/device-details.css"):
            self.assertEqual(self.request(path)[0], 401)
            self.assertEqual(self.request(path, COOKIE_NAME + "=" + token)[0], 200)
            self.assertEqual(self.request(path, COOKIE_NAME + "=" + self.token)[0], 200)
        for path in ("/interface/../backend/server.py", "/interface/design-sources.json",
                     "/interface/screens/not-packaged.html"):
            self.assertEqual(self.request(path)[0], 404)
        for path in ("/interface/sign-in.js", "/interface/styles/sign-in.css"):
            self.assertEqual(self.request(path)[0], 200)

    def test_staff_account_route_and_mfa_eligibility_preserve_data_boundaries(self):
        from backend.roles import preview_role_change, confirm_role_change
        with sqlite3.connect(self.path) as db:
            user = create_user(db, 1, "staff-account", "password")
            secret = new_secret()
            db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, user))
            db.commit()
            token = login_session(db, "staff-account", "password", mfa_code=code_at(secret, time.time()))
        cookie = COOKIE_NAME + "=" + token
        self.assertEqual(self.request("/account")[0], 401)
        self.assertEqual(self.request("/account", cookie)[0], 200)
        self.assertTrue(json.loads(self.request("/api/session", cookie)[1])["mfa_removal_eligible"])
        self.assertFalse(json.loads(self.request("/api/session", COOKIE_NAME + "=" + self.token)[1])["mfa_removal_eligible"])
        for path in ("/inventory", "/inventory?rack-print=same-tab", "/api/inventory/state",
                     "/api/users", "/api/settings/email", "/api/inventory/devices", "/api/inventory/ipam", "/api/inventory/racks"):
            self.assertEqual(self.request(path, cookie)[0], 403, path)
        sections = json.loads(self.request("/api/inventory/sections", cookie)[1])["sections"]
        self.assertTrue(all(not rights["read"] and not rights["edit"] for rights in sections.values()))
        profile = json.loads(self.request("/api/account/profile", cookie)[1])
        self.assertNotIn("owner", json.dumps(profile))
        with sqlite3.connect(self.path) as db:
            action = {"type": "role.create", "roleKey": "zero_grant", "name": "Zero Grant", "grants": {}}
            proof = preview_role_change(db, 1, self.token, action)["proof"]
            confirm_role_change(db, 1, self.token, action, proof)
            role = db.execute("SELECT id FROM roles WHERE role_key='zero_grant'").fetchone()[0]
            action = {"type": "membership.assign", "roleId": role, "userId": user}
            proof = preview_role_change(db, 1, self.token, action)["proof"]
            confirm_role_change(db, 1, self.token, action, proof)
            token = login_session(db, "staff-account", "password", mfa_code=code_at(secret, time.time()))
        cookie = COOKIE_NAME + "=" + token
        self.assertFalse(json.loads(self.request("/api/session", cookie)[1])["mfa_removal_eligible"])
        self.assertEqual(self.request("/account", cookie)[0], 200)
        self.assertEqual(self.request("/inventory", cookie)[0], 403)

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

    def change_permission(self, data, token=None, csrf=None):
        action = {"type": "override.set", **data}
        status, preview = self.post("/api/users/roles/preview", {"action": action}, token, csrf)
        if status != 200:
            return status, preview
        return self.post("/api/users/roles/confirm", {"action": action, "proof": preview["proof"]}, token, csrf)

    def test_linked_shelf_removal_http_auth_permissions_and_atomic_result(self):
        from backend.inventory import stage_inventory, reconstruct_inventory
        shelf = {"id":"shelf", "type":"shelf", "rackId":"rack", "face":"front", "startU":10, "heightU":1}
        device = {"id":"device", "name":"Fictional shelf printer", "type":"Printer", "mountType":"Tabletop / Shelf Mounted", "rackId":"rack", "rackShelfAccessoryId":"shelf", "location":"Room"}
        with sqlite3.connect(self.path) as db:
            stage_inventory(db,{"devices":[device],"rackAccessories":[shelf],"racks":[{"id":"rack","heightU":42}],"subnets":[],"vlans":[],"ipAllocations":{}})
            user = create_user(db,1,"shelf-editor","password")
            user_token = login_session(db,"shelf-editor","password")
        payload = {"shelfId":"shelf", "expectedShelf":shelf,
                   "devices":[{"deviceId":"device","revision":0,"action":"retire"}]}
        route = "/api/inventory/rack-shelves/remove"
        with patch("backend.server.PUBLIC_ORIGIN","https://caffoot.example"):
            self.assertEqual(self.post(route,payload)[0],403)
            self.assertEqual(self.post(route,payload,self.token)[0],403)
            self.assertEqual(self.post(route,payload,user_token,csrf_for_session(user_token))[0],403)
            self.assertEqual(self.post(route,dict(payload,unexpected=True),self.token,csrf_for_session(self.token))[0],400)
            stale = dict(payload,expectedShelf=dict(shelf,startU=12))
            self.assertEqual(self.post(route,stale,self.token,csrf_for_session(self.token))[0],400)
            with sqlite3.connect(self.path) as db:
                self.assertEqual(reconstruct_inventory(db)['devices'],[device])
            self.assertEqual(self.post(route,payload,self.token,csrf_for_session(self.token))[0],200)
            with sqlite3.connect(self.path) as db:
                state = reconstruct_inventory(db)
                self.assertEqual(state['rackAccessories'],[])
                self.assertEqual(state['devices'][0]['status'],'Retired')
                self.assertEqual(state['devices'][0]['rackShelfAccessoryId'],'')
        with patch("backend.server.PUBLIC_ORIGIN","https://another.example"):
            self.assertEqual(self.post(route,payload,self.token,csrf_for_session(self.token))[0],403)

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

    def test_account_management_and_password_change_http(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            status, created = self.post("/api/users/create",
                                        {"username": "editor", "password": "initial"},
                                        self.token, csrf)
            self.assertEqual(status, 200)
            user_id = created["id"]
            status, _ = self.change_permission(
                                  {"userId": user_id, "section": "Devices", "level": "read"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
            status, _ = self.change_permission(
                                  {"userId": user_id, "section": "Devices", "level": "edit"},
                                  self.token, csrf)
            self.assertEqual(status, 200)  # Configured Edit stays blocked until enrolment.
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
            status, _ = self.change_permission(
                                  {"userId": user_id, "section": "Devices", "level": "read"},
                                  self.token, csrf)
            self.assertEqual(status, 200)
        with sqlite3.connect(self.path) as db:
            reader_secret = new_secret()
            db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (reader_secret, user_id))
            db.commit()
            reader_token = login_session(db, "reader", "initial", mfa_code=code_at(reader_secret, time.time()))
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
            status, _ = self.change_permission(
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
            status, _ = self.change_permission(
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

    def test_session_describes_only_own_assigned_roles_separately_from_administrator(self):
        with sqlite3.connect(self.path) as db:
            staff = create_user(db, 1, "role-display-staff", "password")
            for name, enabled in (("Support <Team>", 1), ("Retired Support", 0)):
                role = db.execute("INSERT INTO roles(role_key,name,enabled) VALUES(?,?,?)",
                                  ("display_" + str(enabled), name, enabled)).lastrowid
                db.execute("INSERT INTO account_roles VALUES(1,?)", (role,))
                if not enabled:
                    db.execute("INSERT INTO account_roles VALUES(?,?)", (staff, role))
            db.commit()
            token = login_session(db, "role-display-staff", "password")
        for bearer, administrator, expected in (
            (self.token, True, [{"name": "Staff Member", "enabled": True},
                                {"name": "Support <Team>", "enabled": True},
                                {"name": "Retired Support", "enabled": False}]),
            (token, False, [{"name": "Staff Member", "enabled": True},
                            {"name": "Retired Support", "enabled": False}]),
        ):
            status, body, _ = self.request("/api/session", COOKIE_NAME + "=" + bearer)
            self.assertEqual(status, 200)
            session = json.loads(body)
            self.assertEqual(session["assigned_roles"], expected)
            self.assertEqual(session["is_admin"], administrator)
        self.assertEqual(self.request("/api/session")[0], 401)


    def test_same_tab_print_direct_entry_and_reload_keep_inventory_security(self):
        cookie = COOKIE_NAME + "=" + self.token
        baseline = self.request("/inventory", cookie)
        for _ in range(2):
            self.assertEqual(self.request("/inventory?rack-print=same-tab", cookie), baseline)
        self.assertEqual(self.request("/inventory?rack-print=same-tab")[0], 401)
        with sqlite3.connect(self.path) as db:
            create_user(db, 1, "print-no-access", "password")
            token = login_session(db, "print-no-access", "password")
        self.assertEqual(self.request("/inventory?rack-print=same-tab", COOKIE_NAME + "=" + token)[0], 403)
        for target in ("/inventory/", "/inventory?rack-print=other", "/inventory?other=same-tab",
                       "/inventory?rack-print=same-tab&extra=1", "/interface/application.js?rack-print=same-tab"):
            self.assertEqual(self.request(target, cookie)[0], 404)
        for target in ("/inventory", "/inventory?rack-print=same-tab"):
            connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
            connection.request("GET", target, headers={"Cookie": cookie})
            response = connection.getresponse()
            self.assertEqual(response.getheader("X-Content-Type-Options"), "nosniff")
            self.assertEqual(response.getheader("Cache-Control"), "no-store")
            self.assertEqual(response.getheader("Content-Type"), "text/html; charset=utf-8")
            response.read()
            connection.close()

    def test_software_service_name_boundary_through_settings_api(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            for key in ("installedSoftware", "serverFunctions"):
                for length in (81, 100, 101):
                    payload = {"key": key, "value": [{"key": "fictional", "label": "N" * length}]}
                    status, result = self.post("/api/inventory/settings/save", payload,
                                               self.token, csrf_for_session(self.token))
                    self.assertEqual(status, 400 if length == 101 else 200, result)
                with sqlite3.connect(self.path) as db:
                    saved = json.loads(db.execute("SELECT value_json FROM inventory_settings WHERE key=?",
                                                   (key,)).fetchone()[0])
                self.assertEqual(saved[0]["label"], "N" * 100)


if __name__ == "__main__":
    unittest.main()
