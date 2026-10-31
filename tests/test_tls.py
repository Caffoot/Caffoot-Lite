import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.tls import ensure_certificate, subject_alternative_names


class TlsTests(unittest.TestCase):
    def test_san_ip_and_hostnames(self):
        self.assertEqual(subject_alternative_names("10.128.20.3,caffoot.local"),
                         "IP:10.128.20.3,DNS:caffoot.local")
        for bad in ("", "bad name", "example.com,"):
            with self.assertRaises(ValueError):
                subject_alternative_names(bad)

    def test_certificate_persists_and_missing_key_fails_closed(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch("backend.tls.subprocess.run") as run:
                def generate(*args, **kwargs):
                    Path(directory, "server.crt").write_text("cert")
                    Path(directory, "server.key").write_text("key")
                run.side_effect = generate
                with patch("backend.tls.ssl.SSLContext.load_cert_chain"):
                    ensure_certificate(directory, "10.128.20.3")
                    ensure_certificate(directory, "10.128.20.3")
                    self.assertEqual(run.call_count, 1)
                    self.assertIn("subjectAltName=IP:10.128.20.3", run.call_args_list[0].args[0])
                    Path(directory, "server.key").unlink()
                    with self.assertRaises(RuntimeError):
                        ensure_certificate(directory, "10.128.20.3")


if __name__ == "__main__":
    unittest.main()
