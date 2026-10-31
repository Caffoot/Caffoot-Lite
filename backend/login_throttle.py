"""Bounded, in-process login throttling for the small Next HTTP server.

This is a single-process safeguard, not a distributed rate limiter. Keys must
be derived from a trusted network peer and normalised username, never from
client-controlled forwarding headers. Avoid logging passwords or MFA codes.
"""
import threading
import time

WINDOW_SECONDS = 15 * 60
MAX_FAILURES = 5
MAX_TRACKED = 4096


class LoginThrottle:
    def __init__(self):
        self._failures = {}
        self._lock = threading.Lock()

    def _prune(self, now):
        stale = [key for key, values in self._failures.items()
                 if not values or values[-1] <= now - WINDOW_SECONDS]
        for key in stale:
            del self._failures[key]
        if len(self._failures) >= MAX_TRACKED:
            oldest = min(self._failures, key=lambda key: self._failures[key][-1])
            del self._failures[oldest]

    def allowed(self, peer, username, *, now=None):
        if now is None:
            now = time.monotonic()
        key = self._key(peer, username)
        with self._lock:
            values = self._failures.get(key, ())
            return sum(value > now - WINDOW_SECONDS for value in values) < MAX_FAILURES

    def failed(self, peer, username, *, now=None):
        if now is None:
            now = time.monotonic()
        key = self._key(peer, username)
        with self._lock:
            self._prune(now)
            values = [value for value in self._failures.get(key, ())
                      if value > now - WINDOW_SECONDS]
            values.append(now)
            self._failures[key] = values

    def succeeded(self, peer, username):
        key = self._key(peer, username)
        with self._lock:
            self._failures.pop(key, None)

    @staticmethod
    def _key(peer, username):
        if not isinstance(peer, str) or not peer or not isinstance(username, str):
            raise ValueError("Invalid login throttle identity")
        return (peer, username.strip().casefold())
