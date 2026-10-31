import unittest
from backend.login_throttle import LoginThrottle, MAX_FAILURES, WINDOW_SECONDS

class LoginThrottleTests(unittest.TestCase):
    def test_blocks_after_five_failures_and_recovers(self):
        limiter = LoginThrottle()
        for _ in range(MAX_FAILURES):
            self.assertTrue(limiter.allowed("192.0.2.1", "Admin", now=100))
            limiter.failed("192.0.2.1", "Admin", now=100)
        self.assertFalse(limiter.allowed("192.0.2.1", "admin", now=101))
        self.assertTrue(limiter.allowed("192.0.2.1", "admin", now=101 + WINDOW_SECONDS))

    def test_peer_and_username_scoped(self):
        limiter = LoginThrottle()
        for _ in range(MAX_FAILURES):
            limiter.failed("192.0.2.1", "admin", now=100)
        self.assertTrue(limiter.allowed("192.0.2.2", "admin", now=101))
        self.assertTrue(limiter.allowed("192.0.2.1", "reader", now=101))

    def test_success_resets_only_its_identity(self):
        limiter = LoginThrottle()
        for _ in range(MAX_FAILURES):
            limiter.failed("192.0.2.1", "Admin", now=100)
        limiter.succeeded("192.0.2.1", "admin")
        self.assertTrue(limiter.allowed("192.0.2.1", "admin", now=101))

    def test_invalid_peer_rejected(self):
        with self.assertRaises(ValueError):
            LoginThrottle().allowed("", "admin", now=1)

if __name__ == "__main__":
    unittest.main()
