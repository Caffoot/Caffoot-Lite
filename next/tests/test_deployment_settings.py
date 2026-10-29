import unittest

from backend.deployment_settings import validate_published_port


class DeploymentSettingsTests(unittest.TestCase):
    def test_valid_ports(self):
        for value in ("1", "443", "8080", "8443", "65535"):
            self.assertEqual(validate_published_port(value), int(value))

    def test_invalid_ports(self):
        for value in ("", "0", "65536", "-1", "8o80", "8080:8080", " 8080", "999999", None):
            with self.subTest(value=value), self.assertRaises(ValueError):
                validate_published_port(value)


if __name__ == "__main__":
    unittest.main()
