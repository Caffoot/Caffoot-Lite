"""The opt-in read-only Svelte route must not change published application access."""
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


class SvelteReadonlyRouteTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.db = self.root / "test.sqlite3"
        self.dist = self.root / "dist"
        (self.dist / "assets").mkdir(parents=True)
        (self.dist / "integration.html").write_text(
            "<html><title>Svelte integration test</title></html>", encoding="utf-8")
        (self.dist / "assets" / "integration-test.js").write_text(
            "console.log('integration asset');", encoding="utf-8")
        (self.dist / "assets" / "style-test.css").write_text("body{}", encoding="utf-8")

        with sqlite3.connect(self.db) as conn:
            conn.execute("PRAGMA foreign_keys=ON")
            initialise_database(conn)
            owner, secret = bootstrap_first_admin(conn, "owner", "password")
            now = time.time()
            confirm_admin_mfa(conn, owner, code_at(secret, now), timestamp=now)
            self.admin_token = login_session(conn, "owner", "password",
                                              mfa_code=code_at(secret, now), now=now)
            viewer = create_user(conn, owner, "viewer", "password")
            set_permission(conn, owner, viewer, "Devices", "read")
            self.viewer_token = login_session(conn, "viewer", "password")
            denied = create_user(conn, owner, "not-allowed", "password")
            set_permission(conn, owner, denied, "IPAM", "read")
            self.denied_token = login_session(conn, "not-allowed", "password")

        self.patchers = [
            patch("backend.server.DB_PATH", self.db),
            patch("backend.server.SVELTE_DEV_DIST", self.dist),
        ]
        for p in self.patchers:
            p.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=3)
        for p in reversed(self.patchers):
            p.stop()
        self.temp.cleanup()

    def get(self, path, token=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=5)
        headers = {"Cookie": COOKIE_NAME + "=" + token} if token else {}
        try:
            conn.request("GET", path, headers=headers)
            response = conn.getresponse()
            headers = {}
            for name, value in response.getheaders():
                # The existing global framing policy is deliberately added to
                # every response, even where the dev page adds a stricter CSP.
                headers[name] = (headers[name] + "; " + value
                                 if name in headers else value)
            data = (response.status, headers, response.read())
        finally:
            conn.close()
        return data

    def test_disabled_by_default_even_for_admin(self):
        route = "/__dev/svelte-device-details/"
        with patch("backend.server.SVELTE_DEV_ENABLED", False):
            self.assertEqual(self.get(route, self.admin_token)[0], 404)
            self.assertEqual(self.get(route + "assets/integration-test.js", self.admin_token)[0], 404)

    def test_route_requires_signed_in_devices_permission(self):
        route = "/__dev/svelte-device-details/"
        with patch("backend.server.SVELTE_DEV_ENABLED", True):
            self.assertEqual(self.get(route)[0], 401)
            self.assertEqual(self.get(route, self.denied_token)[0], 403)
            self.assertEqual(self.get(route + "assets/integration-test.js", self.denied_token)[0], 403)
            self.assertEqual(self.get(route, self.viewer_token)[0], 200)
            self.assertEqual(self.get(route, self.admin_token)[0], 200)

    def test_static_assets_are_nosniff_no_store_and_restricted_to_build(self):
        root = "/__dev/svelte-device-details/"
        with patch("backend.server.SVELTE_DEV_ENABLED", True):
            html_status, html_headers, html = self.get(root, self.viewer_token)
            self.assertEqual(html_status, 200)
            self.assertIn(b"Svelte integration test", html)
            self.assertEqual(html_headers["Cache-Control"], "no-store")
            self.assertEqual(html_headers["X-Content-Type-Options"], "nosniff")
            self.assertIn("script-src 'self'", html_headers["Content-Security-Policy"])
            for name, mime in (("integration-test.js", "text/javascript"),
                               ("style-test.css", "text/css")):
                status, headers, body = self.get(root + "assets/" + name, self.viewer_token)
                self.assertEqual(status, 200)
                self.assertTrue(headers["Content-Type"].startswith(mime))
                self.assertTrue(body)
                self.assertEqual(headers["Cache-Control"], "no-store")
            for path in ("assets/../integration.html", "assets/private.py",
                         "assets/.secret.js", "unknown", "assets/not-found.js"):
                self.assertEqual(self.get(root + path, self.viewer_token)[0], 404, path)

    def test_existing_pages_and_read_only_inventory_api_unchanged(self):
        with patch("backend.server.SVELTE_DEV_ENABLED", True):
            setup_status, _, setup_body = self.get("/setup")
            self.assertEqual(setup_status, 200)
            self.assertIn(b"Caffoot", setup_body)
            inventory_status, _, inventory_body = self.get("/inventory", self.viewer_token)
            self.assertEqual(inventory_status, 200)
            self.assertIn(b"Devices", inventory_body)
            self.assertEqual(self.get("/inventory")[0], 401)
            self.assertEqual(self.get("/api/inventory/devices")[0], 401)
            self.assertEqual(self.get("/api/inventory/devices", self.denied_token)[0], 403)
            self.assertEqual(self.get("/api/inventory/devices", self.viewer_token)[0], 200)


if __name__ == "__main__":
    unittest.main()
