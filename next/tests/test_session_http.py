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
            confirm_admin_mfa(db, admin, code_at(secret), timestamp=time.time())
            self.token = login_session(
                db, "owner", "password", mfa_code=code_at(secret)
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
