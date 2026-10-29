import unittest

from backend.server import validate_public_origin


class PublicOriginTests(unittest.TestCase):
    def test_explicit_https_origin(self):
        for origin in ("https://10.128.20.3:8080", "https://caffoot.example.uk",
                       "https://inventory.local:8443"):
            self.assertEqual(validate_public_origin(origin), origin)

    def test_rejects_incorrect_or_unsafe_origin(self):
        for origin in ("", "https://", "http://10.128.20.3:8080",
                       "https://example.uk/path", "https://example.uk/",
                       "https://user:pass@example.uk", "https://example.uk?x=1",
                       "https://example.uk#fragment", "https://example.uk:bad",
                       " https://example.uk", "https://example.uk:"):
            with self.subTest(origin=origin), self.assertRaises(ValueError):
                validate_public_origin(origin)


if __name__ == "__main__":
    unittest.main()
