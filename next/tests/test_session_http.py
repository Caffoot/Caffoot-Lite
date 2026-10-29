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
from backend.mfa import code_at
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
