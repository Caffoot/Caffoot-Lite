"""Exercise real HTTPS transport and the fixed internal Docker port."""
import http.client
import concurrent.futures
import os
import shutil
import socket
import sqlite3
import ssl
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
from backend.server import Handler, INTERFACE_FILES, main, validate_public_origin
from backend.sessions import login_session
from backend.tls import ensure_certificate


@unittest.skipUnless(shutil.which("openssl"), "OpenSSL executable required")
class HttpsSmokeTests(unittest.TestCase):
    def test_https_health_and_http_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch("backend.server.DB_PATH", Path(directory) / "app.sqlite3"):
                from backend.server import initialise_database
                initialise_database()
                context = ensure_certificate(Path(directory) / "tls", "127.0.0.1")
                server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
                server.socket = context.wrap_socket(server.socket, server_side=True)
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                try:
                    port = server.server_address[1]
                    client = http.client.HTTPSConnection(
                        "127.0.0.1", port, timeout=3,
                        context=ssl._create_unverified_context())
                    try:
                        client.request("GET", "/health")
                        response = client.getresponse()
                        self.assertEqual(response.status, 200)
                        self.assertEqual(response.getheader("X-Frame-Options"), "DENY")
                        self.assertEqual(response.getheader("Content-Security-Policy"),
                                         "frame-ancestors 'none'")
                        self.assertEqual(response.getheader("Referrer-Policy"), "no-referrer")
                        self.assertIn(b'"ok"', response.read())
                        client.request("GET", "/setup")
                        setup = client.getresponse()
                        self.assertEqual(setup.status, 200)
                        self.assertEqual(setup.getheader("X-Frame-Options"), "DENY")
                        self.assertEqual(setup.getheader("Content-Security-Policy"),
                                         "frame-ancestors 'none'")
                        self.assertIn(b"Caffoot Lite", setup.read())
                    finally:
                        client.close()
                    with self.assertRaises((ConnectionError, OSError, TimeoutError,
                                            http.client.HTTPException)):
                        plain = http.client.HTTPConnection("127.0.0.1", port, timeout=2)
                        try:
                            plain.request("GET", "/health")
                            plain.getresponse()
                        finally:
                            plain.close()
                finally:
                    server.shutdown()
                    server.server_close()
                    thread.join(timeout=3)

    def test_startup_https_accepts_queued_interface_burst(self):
        # Match the 21 concurrently requested styles in initialiseInterface().
        # Hold one incomplete TLS handshake briefly while the connection burst
        # enters the listen queue. Release it before sending authenticated GETs.
        # The old backlog of five cannot queue this burst on Linux.
        styles = (
            "dashboard", "my-account", "settings", "device-details", "devices",
            "device-inventory", "device-management", "ipam", "racks", "users",
            "audit-trail", "staff", "equipment", "stock", "suppliers",
            "dashboard-lifecycle", "settings-lifecycle", "device-details-lifecycle",
            "device-management-lifecycle", "service-desk", "settings-email-templates",
        )
        paths = ["/interface/styles/" + name + ".css" for name in styles]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            db_path = root / "app.sqlite3"
            tls_dir = root / "tls"
            with patch.multiple("backend.server", DB_PATH=db_path,
                                TLS_DIR=tls_dir, TLS_NAMES="127.0.0.1",
                                HOST="127.0.0.1", PORT=0,
                                PUBLIC_ORIGIN="https://127.0.0.1"), patch.dict(
                                    os.environ, {"CAFFOOT_PORT": "8080",
                                                 "TZ": "Europe/London"}):
                # Capture the actual production startup server without entering
                # its blocking serve_forever call until the fixture is ready.
                servers = []
                with patch.object(ThreadingHTTPServer, "serve_forever",
                                  autospec=True, side_effect=servers.append):
                    main()
                self.assertEqual(len(servers), 1)
                with servers[0] as server:
                    with sqlite3.connect(db_path) as db:
                        db.execute("PRAGMA foreign_keys=ON")
                        admin, secret = bootstrap_first_admin(db, "burst-owner", "password")
                        now = time.time()
                        confirm_admin_mfa(db, admin, code_at(secret, now), timestamp=now)
                        token = login_session(db, "burst-owner", "password",
                                              mfa_code=code_at(secret, now), now=now)
                    context = ssl.create_default_context(cafile=str(tls_dir / "server.crt"))
                    address = server.server_address
                    accepted = threading.Event()
                    original_get_request = server.get_request

                    def observe_accept():
                        accepted.set()
                        return original_get_request()

                    server.get_request = observe_accept
                    thread = threading.Thread(target=server.serve_forever, daemon=True)
                    thread.start()
                    pending = []
                    try:
                        with socket.create_connection(address, timeout=2):
                            self.assertTrue(accepted.wait(3), "TLS accept did not start")
                            # No handshake is sent on any queued socket yet.
                            # A short TCP connect deadline detects queue saturation
                            # independently of database or HTTP response timing.
                            for path in paths:
                                with self.subTest(queue=path):
                                    pending.append(socket.create_connection(address, timeout=0.75))
                        self.assertEqual(len(pending), len(paths))

                        def fetch_asset(item):
                            path, raw = item
                            raw.settimeout(10)
                            client = http.client.HTTPSConnection(
                                "127.0.0.1", address[1], context=context, timeout=10)
                            try:
                                client.sock = context.wrap_socket(raw, server_hostname="127.0.0.1")
                                client.request("GET", path, headers={"Cookie": COOKIE_NAME + "=" + token})
                                response = client.getresponse()
                                return response.status, response.getheader("Cache-Control"), response.read()
                            finally:
                                client.close()

                        with concurrent.futures.ThreadPoolExecutor(max_workers=len(paths)) as pool:
                            results = list(pool.map(fetch_asset, zip(paths, pending)))
                        for path, (status, cache, body) in zip(paths, results):
                            with self.subTest(asset=path):
                                self.assertEqual(status, 200)
                                self.assertEqual(cache, "private, no-store")
                                self.assertEqual(body, INTERFACE_FILES[path].read_bytes())

                        client = http.client.HTTPSConnection(
                            "127.0.0.1", address[1], context=context, timeout=5)
                        try:
                            client.request("GET", paths[0])
                            denied = client.getresponse()
                            self.assertEqual(denied.status, 401)
                            denied.read()
                            client.request("GET", "/health")
                            healthy = client.getresponse()
                            self.assertEqual(healthy.status, 200)
                            healthy.read()
                        finally:
                            client.close()
                        with self.assertRaises((ConnectionError, OSError, TimeoutError,
                                                http.client.HTTPException)):
                            plain = http.client.HTTPConnection("127.0.0.1", address[1], timeout=3)
                            try:
                                plain.request("GET", "/health")
                                plain.getresponse()
                            finally:
                                plain.close()
                    finally:
                        for raw in pending:
                            raw.close()
                        server.shutdown()
                        thread.join(timeout=5)

    def test_https_origin_examples(self):
        for address in ("https://10.128.20.3:8443", "https://caffoot.domainname.uk"):
            self.assertEqual(validate_public_origin(address), address)


if __name__ == "__main__":
    unittest.main()
