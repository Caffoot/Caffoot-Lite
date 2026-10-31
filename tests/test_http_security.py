import unittest
from backend.http_security import (
    COOKIE_NAME, session_cookie, clear_session_cookie, read_session_cookie,
    new_csrf_token, check_csrf, require_same_origin,
)

class HttpSecurityTests(unittest.TestCase):
    def test_secure_cookie_flags_and_roundtrip(self):
        token = "ab" * 32
        header = session_cookie(token)
        self.assertIn("HttpOnly", header)
        self.assertIn("SameSite=Strict", header)
        self.assertIn("Secure", header)
        self.assertIn("Path=/", header)
        self.assertEqual(read_session_cookie(header), token)
        self.assertIn("Max-Age=0", clear_session_cookie())

    def test_reject_duplicate_or_malformed_cookies(self):
        token = "ab" * 32
        self.assertIsNone(read_session_cookie(None))
        self.assertIsNone(read_session_cookie(COOKIE_NAME + "=not-a-token"))
        self.assertIsNone(read_session_cookie(COOKIE_NAME + "=" + token + "; " + COOKIE_NAME + "=" + token))
        self.assertIsNone(read_session_cookie("other=abc"))

    def test_csrf_token_and_origin(self):
        first = new_csrf_token()
        second = new_csrf_token()
        self.assertEqual(len(first), 64)
        self.assertNotEqual(first, second)
        self.assertTrue(check_csrf(first, first))
        self.assertFalse(check_csrf(first, second))
        self.assertFalse(check_csrf(first, None))
        self.assertTrue(require_same_origin("https://inventory.example", "https://inventory.example"))
        self.assertFalse(require_same_origin("https://evil.example", "https://inventory.example"))
        self.assertFalse(require_same_origin(None, "https://inventory.example"))

if __name__ == "__main__":
    unittest.main()
