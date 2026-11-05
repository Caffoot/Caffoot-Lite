"""HTTP regressions for approved optional personal details and private profile photos."""
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
from backend.mfa import code_at
from backend.permissions import create_user
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session

ORIGIN = "https://caffoot.example"
PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j"
    "5l8AAAAASUVORK5CYII="
)


class ProfileHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "profiles.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            admin, secret = bootstrap_first_admin(db, "owner", "password")
            now = time.time()
            confirm_admin_mfa(db, admin, code_at(secret, now), timestamp=now)
            viewer = create_user(db, admin, "viewer", "password")
            self.viewer_id = viewer
            self.token = login_session(db, "viewer", "password")
        self.p1 = patch("backend.server.DB_PATH", self.path)
        self.p2 = patch("backend.server.PUBLIC_ORIGIN", ORIGIN)
        self.p1.start()
        self.p2.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.p2.stop()
        self.p1.stop()
        self.temp.cleanup()

    def request(self, method, path, data=None, token=None, csrf=None,
                origin=ORIGIN, mime=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        headers = {}
        if token:
            headers["Cookie"] = COOKIE_NAME + "=" + token
        if method == "POST":
            headers["Origin"] = origin
            headers["Content-Type"] = mime or "application/json"
            if csrf:
                headers["X-CSRF-Token"] = csrf
            body = data if isinstance(data, bytes) else json.dumps(data).encode()
        else:
            body = None
        conn.request(method, path, body=body, headers=headers)
        response = conn.getresponse()
        status = response.status
        content_type = response.getheader("Content-Type") or ""
        cache = response.getheader("Cache-Control")
        raw = response.read()
        conn.close()
        if "application/json" in content_type:
            raw = json.loads(raw)
        return status, raw, content_type, cache

    def test_profile_requires_session_and_csrf_and_preserves_username(self):
        self.assertEqual(self.request("GET", "/api/account/profile")[0], 401)
        status, initial, _, _ = self.request(
            "GET", "/api/account/profile", token=self.token
        )
        self.assertEqual(status, 200)
        self.assertEqual(initial["username"], "viewer")
        self.assertEqual(initial["email"], "")
        data = {"firstName":"Ada","lastName":"Lovelace",
                "displayName":"Ada","email":"ada@example.test"}
        self.assertEqual(self.request(
            "POST", "/api/account/profile", data, self.token
        )[0], 403)
        self.assertEqual(self.request(
            "POST", "/api/account/profile", data, self.token,
            csrf_for_session(self.token), origin="https://untrusted.example"
        )[0], 403)
        status, saved, _, _ = self.request(
            "POST", "/api/account/profile", data, self.token,
            csrf_for_session(self.token)
        )
        self.assertEqual(status, 200)
        self.assertEqual(saved["displayName"], "Ada")
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute(
                "SELECT username FROM accounts WHERE id=?", (self.viewer_id,)
            ).fetchone()[0], "viewer")

    def test_photo_is_private_validated_and_removable(self):
        csrf = csrf_for_session(self.token)
        self.assertEqual(self.request(
            "POST", "/api/account/photo", PNG, self.token,
            mime="image/png"
        )[0], 403)
        self.assertEqual(self.request(
            "POST", "/api/account/photo", b"not an image", self.token,
            csrf, mime="image/png"
        )[0], 400)
        self.assertEqual(self.request(
            "POST", "/api/account/photo", PNG, self.token,
            csrf, mime="image/png"
        )[0], 200)
        self.assertEqual(self.request("GET", "/api/account/photo")[0], 401)
        status, photo, mime, cache = self.request(
            "GET", "/api/account/photo", token=self.token
        )
        self.assertEqual((status,mime,cache),(200,"image/png","private, no-store"))
        self.assertEqual(photo,PNG)
        self.assertEqual(self.request(
            "POST", "/api/account/photo/remove", {"remove":True},
            self.token, csrf
        )[0], 200)
        self.assertEqual(self.request(
            "GET", "/api/account/photo", token=self.token
        )[0], 404)


if __name__ == "__main__":
    unittest.main()
