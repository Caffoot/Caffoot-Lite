"""HTTP safeguards and administrator role confirmation responses."""
import http.client
import json
import sqlite3
import unittest
from unittest.mock import patch

import test_session_http as session_http
from backend.request_auth import csrf_for_session
from backend.permissions import create_user
from backend.sessions import login_session
from backend.http_security import COOKIE_NAME


class RoleHttpTests(unittest.TestCase):
    setUp = session_http.SessionHttpTests.setUp
    tearDown = session_http.SessionHttpTests.tearDown
    post = session_http.SessionHttpTests.post
    request = session_http.SessionHttpTests.request

    def action(self):
        return {"type": "role.create", "roleKey": "readers", "name": "Readers", "grants": {"Devices": "read"}}

    def test_confirmation_contract_and_retired_direct_write(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            action = self.action()
            status, preview = self.post("/api/users/roles/preview", {"action": action}, self.token, csrf)
            self.assertEqual(status, 200, preview)
            with sqlite3.connect(self.path) as db:
                self.assertFalse(db.execute("SELECT 1 FROM roles WHERE role_key='readers'").fetchone())
            status, result = self.post("/api/users/roles/confirm", {"action": action, "proof": None}, self.token, csrf)
            self.assertEqual(status, 409, result)
            status, result = self.post("/api/users/roles/confirm", {"action": action, "proof": preview["proof"]}, self.token, csrf)
            self.assertEqual(status, 200, result)
            self.assertEqual(result["status"], "updated")
            self.assertFalse(result["notifications"]["smtpConfigured"])
            self.assertEqual(result["notifications"]["queued"], 0)
            status, result = self.post("/api/users/permission", {"userId": 1, "section": "Devices", "level": "edit"}, self.token, csrf)
            self.assertEqual(status, 410)
            status, result = self.post("/api/users/roles/confirm", {"action": action, "proof": preview["proof"]}, self.token, csrf)
            self.assertEqual(status, 409)
            self.assertFalse(result["preview"]["available"])
        status, raw, _ = self.request("/api/users", COOKIE_NAME + "=" + self.token)
        self.assertEqual(status, 200)
        result = json.loads(raw)
        self.assertIn("accessDetails", result["users"][0])
        self.assertEqual(next(role for role in result["roles"] if role["roleKey"] == "readers")["accountCount"], 0)
        for secret in ("password_hash", "mfa_secret", "token_hash"):
            self.assertNotIn(secret, raw.decode())

    def test_request_limits_csrf_origin_and_actor_spoofing(self):
        action = self.action()
        with sqlite3.connect(self.path) as db:
            create_user(db, 1, "staff", "password")
            staff_token = login_session(db, "staff", "password")
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            for endpoint in ("/api/users/roles/preview", "/api/users/roles/confirm", "/api/users/permission"):
                for token, csrf in ((None, None), (self.token, None), (self.token, "bad"), (staff_token, csrf_for_session(staff_token))):
                    status, _ = self.post(endpoint, {"action": action}, token, csrf)
                    self.assertEqual(status, 403, endpoint)
            status, _ = self.post("/api/users/roles/preview", {"action": action, "actorId": 1}, self.token, csrf_for_session(self.token))
            self.assertEqual(status, 400)
            status, _ = self.post("/api/users/roles/preview", {"action": {**action, "userId": 1}}, self.token, csrf_for_session(self.token))
            self.assertEqual(status, 400)
            for origin, content_type, body, expected in (("https://other.example", "application/json", "{}", 403),
                    ("https://caffoot.example", "text/plain", "{}", 415),
                    ("https://caffoot.example", "application/json", " " * 4097, 400)):
                conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
                conn.request("POST", "/api/users/roles/preview", body=body,
                             headers={"Origin": origin, "Content-Type": content_type,
                                      "Cookie": COOKIE_NAME + "=" + self.token, "X-CSRF-Token": csrf_for_session(self.token)})
                response = conn.getresponse()
                self.assertEqual(response.status, expected)
                response.read()
                conn.close()

    def test_server_revalidates_deleted_actor_and_stale_target(self):
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            csrf = csrf_for_session(self.token)
            action = self.action()
            status, preview = self.post("/api/users/roles/preview", {"action": action}, self.token, csrf)
            self.assertEqual(status, 200)
            with sqlite3.connect(self.path) as db:
                db.execute("UPDATE accounts SET active=0 WHERE id=1")
            status, _ = self.post("/api/users/roles/confirm", {"action": action, "proof": preview["proof"]}, self.token, csrf)
            self.assertEqual(status, 403)
            with sqlite3.connect(self.path) as db:
                self.assertFalse(db.execute("SELECT 1 FROM roles WHERE role_key='readers'").fetchone())


if __name__ == "__main__":
    unittest.main()
