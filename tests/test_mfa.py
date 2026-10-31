"""Offline MFA primitives: no public enrolment or login endpoint."""
import base64
import unittest
from urllib.parse import parse_qs, urlparse, unquote

from backend.mfa import new_secret, provisioning_uri, code_at, verify_code


class MfaTests(unittest.TestCase):
    def test_secret_is_unique_and_has_160_bits(self):
        a, b = new_secret(), new_secret()
        self.assertNotEqual(a, b)
        self.assertEqual(len(base64.b32decode(a)), 20)

    def test_rfc_6238_sha1_vector_truncated_to_six_digits(self):
        secret = base64.b32encode(b"12345678901234567890").decode().rstrip("=")
        self.assertEqual(code_at(secret, 59), "287082")
        self.assertTrue(verify_code(secret, "287082", timestamp=59, window=0))
        self.assertFalse(verify_code(secret, "287082", timestamp=120, window=0))

    def test_time_drift_and_bad_codes(self):
        secret = new_secret()
        code = code_at(secret, 60)
        self.assertTrue(verify_code(secret, code, timestamp=90, window=1))
        self.assertFalse(verify_code(secret, code, timestamp=120, window=1))
        for bad in ("", "12345", "1234567", "12 456", "abcdef", "１２３４５６"):
            self.assertFalse(verify_code(secret, bad, timestamp=60))

    def test_uri_for_authenticator_qr_and_manual_key(self):
        secret = new_secret()
        uri = urlparse(provisioning_uri("a+b@example.com", secret))
        self.assertEqual(uri.scheme, "otpauth")
        self.assertEqual(uri.netloc, "totp")
        self.assertEqual(unquote(uri.path), "/Caffoot Lite:a+b@example.com")
        params = parse_qs(uri.query)
        self.assertEqual(params["secret"], [secret])
        self.assertEqual(params["issuer"], ["Caffoot Lite"])
        self.assertEqual(params["digits"], ["6"])
        self.assertEqual(params["period"], ["30"])

    def test_invalid_secret_or_user_rejected(self):
        with self.assertRaises(ValueError):
            provisioning_uri("", new_secret())
        with self.assertRaises(ValueError):
            provisioning_uri("admin", "invalid")
        with self.assertRaises(ValueError):
            code_at("invalid", 0)


if __name__ == "__main__":
    unittest.main()
