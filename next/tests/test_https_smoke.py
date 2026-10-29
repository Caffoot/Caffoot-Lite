"""Exercise real HTTPS transport and the fixed internal Docker port."""
import http.client
import os
import shutil
import ssl
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from backend.server import Handler, validate_public_origin
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
                        self.assertIn(b'"ok"', response.read())
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

    def test_https_origin_examples(self):
        for address in ("https://10.128.20.3:8443", "https://caffoot.domainname.uk"):
            self.assertEqual(validate_public_origin(address), address)


if __name__ == "__main__":
    unittest.main()
