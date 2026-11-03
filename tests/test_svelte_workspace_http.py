"""Protect the opt-in v2.1 workspace and preserve published v2.0.3 routes."""
import http.client
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


class SvelteWorkspaceRouteTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.db = self.root / "inventory.sqlite3"
        self.dist = self.root / "workspace-dist"
        (self.dist / "assets").mkdir(parents=True)
        (self.dist / "workspace.html").write_text(
            "<html><title>Workspace build fixture</title></html>", encoding="utf-8")
        (self.dist / "assets" / "workspace-123.js").write_text(
            "console.log('safe');", encoding="utf-8")
        with sqlite3.connect(self.db) as conn:
            conn.execute("PRAGMA foreign_keys=ON")
            initialise_database(conn)
            owner, secret = bootstrap_first_admin(conn, "owner", "password")
            now = time.time()
            confirm_admin_mfa(conn, owner, code_at(secret, now), timestamp=now)
            self.admin_token = login_session(
                conn, "owner", "password", mfa_code=code_at(secret, now), now=now)
            devices = create_user(conn, owner, "devices", "password")
            set_permission(conn, owner, devices, "Devices", "read")
            self.devices_token = login_session(conn, "devices", "password")
            ipam = create_user(conn, owner, "ipam", "password")
            set_permission(conn, owner, ipam, "IPAM", "read")
            self.ipam_token = login_session(conn, "ipam", "password")
            no_access = create_user(conn, owner, "blocked", "password")
            self.blocked_token = login_session(conn, "blocked", "password")
        self.patchers = [
            patch("backend.server.DB_PATH", self.db),
            patch("backend.server.WORKSPACE_DIST", self.dist),
        ]
        for item in self.patchers:
            item.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=3)
        for patcher in reversed(self.patchers):
            patcher.stop()
        self.temp.cleanup()

    def request(self, path, token=None):
        client = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=5)
        headers = {"Cookie": COOKIE_NAME + "=" + token} if token else {}
        try:
            client.request("GET", path, headers=headers)
            response = client.getresponse()
            collected = {}
            for name, value in response.getheaders():
                collected[name] = (collected[name] + "; " + value
                                   if name in collected else value)
            result = (response.status, collected, response.read())
        finally:
            client.close()
        return result

    def test_workspace_off_by_default(self):
        with patch("backend.server.WORKSPACE_ENABLED", False):
            self.assertEqual(self.request("/workspace/", self.admin_token)[0], 404)
            self.assertEqual(self.request(
                "/workspace/assets/workspace-123.js", self.admin_token)[0], 404)

    def test_workspace_requires_sign_in_and_independent_section_access(self):
        with patch("backend.server.WORKSPACE_ENABLED", True):
            self.assertEqual(self.request("/workspace/")[0], 401)
            self.assertEqual(self.request("/workspace/", self.blocked_token)[0], 403)
            self.assertEqual(self.request("/workspace/", self.devices_token)[0], 200)
            self.assertEqual(self.request("/workspace/", self.ipam_token)[0], 200)
            self.assertEqual(self.request("/workspace/", self.admin_token)[0], 200)
            self.assertEqual(self.request(
                "/workspace/assets/workspace-123.js", self.blocked_token)[0], 403)
            self.assertEqual(self.request("/api/inventory/devices", self.ipam_token)[0], 403)

    def test_only_compiled_assets_are_served_with_safe_headers(self):
        with patch("backend.server.WORKSPACE_ENABLED", True):
            status, headers, html = self.request("/workspace/", self.devices_token)
            self.assertEqual(status, 200)
            self.assertIn(b"Workspace build fixture", html)
            self.assertEqual(headers["Cache-Control"], "no-store")
            self.assertEqual(headers["X-Content-Type-Options"], "nosniff")
            self.assertIn("script-src 'self'", headers["Content-Security-Policy"])
            status, headers, script = self.request(
                "/workspace/assets/workspace-123.js", self.ipam_token)
            self.assertEqual(status, 200)
            self.assertTrue(headers["Content-Type"].startswith("text/javascript"))
            self.assertTrue(script)
            for suffix in ("assets/../workspace.html", "assets/.env.js",
                           "assets/secret.py", "assets/not-there.js",
                           "src/workspace-main.js", "integration.html", "../setup"):
                self.assertEqual(self.request(
                    "/workspace/" + suffix, self.devices_token)[0], 404, suffix)

    def test_existing_application_and_pilot_are_unaffected(self):
        with patch("backend.server.WORKSPACE_ENABLED", True):
            self.assertEqual(self.request("/setup")[0], 200)
            self.assertEqual(self.request("/inventory", self.devices_token)[0], 200)
            self.assertEqual(self.request("/inventory")[0], 401)
            self.assertEqual(self.request("/api/inventory/devices", self.devices_token)[0], 200)
            self.assertEqual(self.request("/__dev/svelte-device-details/",
                                          self.admin_token)[0], 404)


if __name__ == "__main__":
    unittest.main()
