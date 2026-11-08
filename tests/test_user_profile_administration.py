"""Approved Add/Manage User personal details: persistence and HTTP permissions."""
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
from backend.profiles import read_profile
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session


ORIGIN = "https://caffoot.example"


def personal_details(email="user@example.test"):
    return {
        "firstName": "Alex", "lastName": "Example",
        "displayName": "Alex E", "email": email,
    }


class UserProfileAdministrationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.path = Path(self.temporary.name) / "inventory.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            self.admin, secret = bootstrap_first_admin(db, "owner", "password")
            now = time.time()
            confirm_admin_mfa(db, self.admin, code_at(secret, now), timestamp=now)
            self.admin_token = login_session(
                db, "owner", "password", mfa_code=code_at(secret, now), now=now,
            )
            self.viewer = create_user(db, self.admin, "viewer", "password")
            self.viewer_token = login_session(db, "viewer", "password")
        self.db_patch = patch("backend.server.DB_PATH", self.path)
        self.origin_patch = patch("backend.server.PUBLIC_ORIGIN", ORIGIN)
        self.db_patch.start()
        self.origin_patch.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.origin_patch.stop()
        self.db_patch.stop()
        self.temporary.cleanup()

    def request(self, method, path, token=None, payload=None, csrf=None):
        connection = http.client.HTTPConnection(
            "127.0.0.1", self.server.server_port,
        )
        headers = {}
        if token:
            headers["Cookie"] = COOKIE_NAME + "=" + token
        if method == "POST":
            headers["Origin"] = ORIGIN
            headers["Content-Type"] = "application/json"
            if csrf is not None:
                headers["X-CSRF-Token"] = csrf
        body = json.dumps(payload).encode("utf-8") if method == "POST" else None
        connection.request(method, path, body=body, headers=headers)
        response = connection.getresponse()
        status, raw = response.status, response.read()
        connection.close()
        return status, json.loads(raw)

    def test_add_user_saves_optional_profile_and_never_grants_access(self):
        payload = {
            "username": "new.person", "password": "Strong-Initial-Password",
            "profile": personal_details(),
        }
        status, result = self.request(
            "POST", "/api/users/create", self.admin_token, payload,
            csrf_for_session(self.admin_token),
        )
        self.assertEqual(status, 200, result)
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            created = read_profile(db, self.admin, result["id"])
            self.assertEqual(created["displayName"], "Alex E")
            self.assertEqual(created["email"], "user@example.test")
            self.assertFalse(created["emailVerified"])
            account = db.execute(
                "SELECT username,is_admin,mfa_confirmed FROM accounts WHERE id=?",
                (result["id"],),
            ).fetchone()
            self.assertEqual(account, ("new.person", 0, 0))
            self.assertEqual(db.execute(
                "SELECT COUNT(*) FROM account_permissions WHERE account_id=?",
                (result["id"],),
            ).fetchone()[0], 0)
        status, result = self.request("GET", "/api/users", self.admin_token)
        self.assertEqual(status, 200)
        new_user = next(u for u in result["users"] if u["username"] == "new.person")
        self.assertEqual(new_user["profile"]["firstName"], "Alex")

    def test_rejects_bad_details_without_creating_a_partial_account(self):
        payload = {
            "username": "invalid.user", "password": "Strong-Initial-Password",
            "profile": dict(personal_details(), email="invalid email"),
        }
        status, _ = self.request(
            "POST", "/api/users/create", self.admin_token, payload,
            csrf_for_session(self.admin_token),
        )
        self.assertEqual(status, 400)
        with sqlite3.connect(self.path) as db:
            self.assertIsNone(db.execute(
                "SELECT 1 FROM accounts WHERE username='invalid.user'"
            ).fetchone())

    def test_manage_user_profile_restricts_writes_and_keeps_sign_in_unchanged(self):
        payload = {"userId": self.viewer, "profile": personal_details()}
        status, _ = self.request(
            "POST", "/api/users/profile", self.admin_token, payload,
        )
        self.assertEqual(status, 403, "CSRF must be enforced")
        status, _ = self.request(
            "POST", "/api/users/profile", self.viewer_token, payload,
            csrf_for_session(self.viewer_token),
        )
        self.assertEqual(status, 403, "A standard user cannot modify another user's profile")
        status, result = self.request(
            "POST", "/api/users/profile", self.admin_token, payload,
            csrf_for_session(self.admin_token),
        )
        self.assertEqual(status, 200, result)
        self.assertEqual(result["displayName"], "Alex E")
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            self.assertEqual(db.execute(
                "SELECT username,is_admin,active,mfa_confirmed FROM accounts WHERE id=?",
                (self.viewer,),
            ).fetchone(), ("viewer", 0, 1, 0))
            self.assertFalse(read_profile(db, self.admin, self.viewer)["emailVerified"])

    def test_legacy_username_password_create_still_works(self):
        status, result = self.request(
            "POST", "/api/users/create", self.admin_token,
            {"username": "legacy", "password": "Strong-Initial-Password"},
            csrf_for_session(self.admin_token),
        )
        self.assertEqual(status, 200, result)
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            self.assertEqual(read_profile(db, self.admin, result["id"])["email"], "")


if __name__ == "__main__":
    unittest.main()
