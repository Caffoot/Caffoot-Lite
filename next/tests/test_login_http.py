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
from backend.mfa import code_at, provisioning_uri
from backend.schema import initialise_database
from backend.server import Handler

ORIGIN = "https://inventory.example"


class LoginHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "test.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            admin, self.secret = bootstrap_first_admin(db, "owner", "password")
            now = time.time()
            confirm_admin_mfa(db, admin, code_at(self.secret, now), timestamp=now)
        self.path_patch = patch("backend.server.DB_PATH", self.path)
        self.origin_patch = patch("backend.server.PUBLIC_ORIGIN", ORIGIN)
        self.path_patch.start()
        self.origin_patch.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.origin_patch.stop()
        self.path_patch.stop()
        self.temp.cleanup()

    def request(self, method, path, payload=None, headers=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        data = json.dumps(payload) if payload is not None else None
        conn.request(method, path, body=data, headers=headers or {})
        response = conn.getresponse()
        body = json.loads(response.read())
        status = response.status
        cookie = response.getheader("Set-Cookie")
        conn.close()
        return status, body, cookie

    def test_first_admin_and_resume_supply_authenticator_qr_uri(self):
        with sqlite3.connect(self.path) as db:
            db.execute("DELETE FROM accounts")
        headers = {"Origin": ORIGIN, "Content-Type": "application/json"}
        status, created, _ = self.request(
            "POST", "/api/setup",
            {"username": "New Owner", "password": "test-password"}, headers,
        )
        self.assertEqual(status, 200)
        self.assertEqual(created["mfaUri"],
                         provisioning_uri("New Owner", created["mfaSecret"]))
        status, resumed, _ = self.request(
            "POST", "/api/setup/mfa-secret",
            {"username": "New Owner", "password": "test-password"}, headers,
        )
        self.assertEqual(status, 200)
        self.assertEqual(resumed["mfaSecret"], created["mfaSecret"])
        self.assertEqual(resumed["mfaUri"], created["mfaUri"])

    def test_pending_admin_secret_recovery_is_throttled(self):
        with sqlite3.connect(self.path) as db:
            db.execute("DELETE FROM accounts")
            bootstrap_first_admin(db, "pending-throttle-owner", "correct-password")
        headers = {"Origin": ORIGIN, "Content-Type": "application/json"}
        for _ in range(5):
            status, response, _ = self.request(
                "POST", "/api/setup/mfa-secret",
                {"username": "pending-throttle-owner", "password": "incorrect"},
                headers,
            )
            self.assertEqual(status, 400)
            self.assertNotIn("mfaSecret", response)
        status, response, _ = self.request(
            "POST", "/api/setup/mfa-secret",
            {"username": "pending-throttle-owner", "password": "correct-password"},
            headers,
        )
        self.assertEqual(status, 400)
        self.assertNotIn("mfaSecret", response)

    def test_login_session_logout(self):
        headers = {"Origin": ORIGIN, "Content-Type": "application/json"}
        status, _, cookie = self.request(
            "POST", "/api/login",
            {"username": "owner", "password": "password",
             "mfa_code": code_at(self.secret, time.time())}, headers,
        )
        self.assertEqual(status, 200)
        self.assertIn("HttpOnly", cookie)
        self.assertIn("Secure", cookie)
        session_cookie = cookie.split(";", 1)[0]
        status, body, _ = self.request("GET", "/api/session", headers={"Cookie": session_cookie})
        self.assertEqual(status, 200)
        self.assertEqual(body["username"], "owner")
        status, _, cleared = self.request(
            "POST", "/api/logout", headers={
                "Origin": ORIGIN, "Cookie": session_cookie,
                "X-CSRF-Token": body["csrf_token"],
            },
        )
        self.assertEqual(status, 200)
        self.assertIn("Max-Age=0", cleared)
        self.assertEqual(self.request("GET", "/api/session", headers={"Cookie": session_cookie})[0], 401)

    def test_reject_cross_origin_and_missing_mfa(self):
        headers = {"Origin": "https://attacker.example", "Content-Type": "application/json"}
        payload = {"username": "owner", "password": "password"}
        self.assertEqual(self.request("POST", "/api/login", payload, headers)[0], 403)
        headers["Origin"] = ORIGIN
        self.assertEqual(self.request("POST", "/api/login", payload, headers)[0], 401)
        self.assertEqual(self.request("POST", "/api/logout", headers={"Origin": ORIGIN})[0], 403)
        self.assertEqual(self.request("POST", "/api/unknown", payload, headers)[0], 404)


if __name__ == "__main__":
    unittest.main()
