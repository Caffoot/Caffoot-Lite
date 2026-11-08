"""Optional SMTP regression: confidential settings, security and test delivery."""
import http.client
import json
import os
import sqlite3
import stat
import tempfile
import threading
import time
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.permissions import create_user
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session
from backend.smtp_settings import config_path, public_settings

ORIGIN = "https://caffoot.example"
SECRET = "TEST-ONLY-SMTP-CREDENTIAL-DO-NOT-RETURN"


def settings():
    return {
        "host": "mail.example.test", "port": 587,
        "security": "starttls", "authenticate": True,
        "username": "smtp-user", "password": SECRET,
        "fromName": "Caffoot Lite", "fromEmail": "caffoot@example.test",
        "insecureConfirmed": False,
    }


class FakeSMTP:
    calls = []
    message = None

    def __init__(self, host, port, timeout, context=None):
        FakeSMTP.calls.append(("connect", host, port, timeout, bool(context)))

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return None

    def ehlo(self):
        FakeSMTP.calls.append(("ehlo",))

    def starttls(self, context):
        FakeSMTP.calls.append(("starttls", bool(context)))

    def login(self, username, password):
        FakeSMTP.calls.append(("login", username, password))

    def send_message(self, message):
        FakeSMTP.message = message
        FakeSMTP.calls.append(("send_message",))


class SMTPHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "caffoot.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            admin, secret = bootstrap_first_admin(db, "owner", "password")
            now = time.time()
            confirm_admin_mfa(db, admin, code_at(secret, now), timestamp=now)
            self.admin_token = login_session(
                db, "owner", "password", mfa_code=code_at(secret, now), now=now,
            )
            create_user(db, admin, "reader", "password")
            self.reader_token = login_session(db, "reader", "password")
        self.db_patch = patch("backend.server.DB_PATH", self.path)
        self.origin_patch = patch("backend.server.PUBLIC_ORIGIN", ORIGIN)
        self.db_patch.start()
        self.origin_patch.start()
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.origin_patch.stop()
        self.db_patch.stop()
        self.temp.cleanup()

    def request(self, method, path, token=None, payload=None, csrf=None,
                origin=ORIGIN):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        headers = {}
        if token:
            headers["Cookie"] = COOKIE_NAME + "=" + token
        if method == "POST":
            headers["Origin"] = origin
            headers["Content-Type"] = "application/json"
            if csrf is not None:
                headers["X-CSRF-Token"] = csrf
            body = json.dumps(payload).encode()
        else:
            body = None
        conn.request(method, path, headers=headers, body=body)
        response = conn.getresponse()
        status, raw = response.status, response.read()
        conn.close()
        return status, json.loads(raw)

    def save(self, payload=None):
        return self.request(
            "POST", "/api/settings/email", self.admin_token,
            payload or settings(), csrf_for_session(self.admin_token),
        )

    def test_unconfigured_smtp_is_optional_and_private(self):
        self.assertEqual(self.request("GET", "/api/settings/email")[0], 401)
        self.assertEqual(self.request(
            "GET", "/api/settings/email", self.reader_token,
        )[0], 403)
        status, result = self.request(
            "GET", "/api/settings/email", self.admin_token,
        )
        self.assertEqual(status, 200)
        self.assertFalse(result["configured"])
        self.assertFalse(result["passwordConfigured"])
        self.assertNotIn("password", result)
        self.assertFalse(config_path(self.path).exists())
        self.assertEqual(self.request(
            "GET", "/api/session", self.reader_token,
        )[0], 200, "SMTP must never gate ordinary login")

    def test_config_requires_session_csrf_and_verified_admin(self):
        self.assertEqual(self.request(
            "POST", "/api/settings/email", self.admin_token, settings(),
        )[0], 403)
        self.assertEqual(self.request(
            "POST", "/api/settings/email", self.reader_token, settings(),
            csrf_for_session(self.reader_token),
        )[0], 403)
        self.assertEqual(self.request(
            "POST", "/api/settings/email", self.admin_token, settings(),
            csrf_for_session(self.admin_token), origin="https://attacker.test",
        )[0], 403)
        self.assertFalse(config_path(self.path).exists())

    def test_save_masks_password_and_retains_password_on_unchanged_user(self):
        status, safe = self.save()
        self.assertEqual(status, 200, safe)
        self.assertTrue(safe["configured"])
        self.assertTrue(safe["passwordConfigured"])
        self.assertNotIn("password", safe)
        self.assertNotIn(SECRET, json.dumps(safe))
        mode = stat.S_IMODE(config_path(self.path).stat().st_mode)
        self.assertEqual(mode, 0o600)
        self.assertEqual(self.request(
            "GET", "/api/settings/email", self.reader_token,
        )[0], 403)
        modified = dict(settings(), password="", fromName="Caffoot Test")
        self.assertEqual(self.save(modified)[0], 200)
        with config_path(self.path).open() as f:
            private = json.load(f)
        self.assertEqual(private["password"], SECRET)
        self.assertEqual(private["fromName"], "Caffoot Test")
        self.assertTrue(public_settings(config_path(self.path))["passwordConfigured"])
        changed_user = dict(settings(), username="different", password="")
        self.assertEqual(self.save(changed_user)[0], 400)
        with config_path(self.path).open() as f:
            self.assertEqual(json.load(f)["username"], "smtp-user")

    def test_unsafe_smtp_and_invalid_details_fail_closed(self):
        for payload in (
            dict(settings(), security="none", insecureConfirmed=False),
            dict(settings(), security="none", insecureConfirmed=True),
            dict(settings(), port=True),
            dict(settings(), fromEmail="not-an-email"),
            dict(settings(), host="https://example.test"),
            dict(settings(), password="bad\npassword"),
        ):
            with self.subTest(payload=payload):
                self.assertEqual(self.save(payload)[0], 400)
        self.assertFalse(config_path(self.path).exists())
        accepted = dict(settings(), security="none", authenticate=False,
                        username="", password="", insecureConfirmed=True)
        status, result = self.save(accepted)
        self.assertEqual(status, 200, result)
        self.assertFalse(result["authenticate"])
        self.assertFalse(result["passwordConfigured"])

    def test_test_email_uses_tls_and_never_discloses_credentials(self):
        FakeSMTP.calls = []
        FakeSMTP.message = None
        self.assertEqual(self.request(
            "POST", "/api/settings/email/test", self.admin_token,
            {"recipient": "test@example.test"}, csrf_for_session(self.admin_token),
        )[0], 400, "Unconfigured installs cannot send mail")
        self.assertEqual(self.save()[0], 200)
        with patch("backend.smtp_settings._NEXT_TEST_AT", 0.0):
            with patch("backend.smtp_settings.smtplib.SMTP", FakeSMTP):
                status, result = self.request(
                    "POST", "/api/settings/email/test", self.admin_token,
                    {"recipient": "test@example.test"},
                    csrf_for_session(self.admin_token),
                )
                self.assertEqual((status, result), (200, {"status": "sent"}))
                self.assertIn(("starttls", True), FakeSMTP.calls)
                self.assertIn(("login", "smtp-user", SECRET), FakeSMTP.calls)
                self.assertEqual(FakeSMTP.message["To"], "test@example.test")
                status, _ = self.request(
                    "POST", "/api/settings/email/test", self.admin_token,
                    {"recipient": "test@example.test"},
                    csrf_for_session(self.admin_token),
                )
                self.assertEqual(status, 400, "Send must be rate-limited")
        self.assertEqual(self.request(
            "POST", "/api/settings/email/test", self.reader_token,
            {"recipient": "test@example.test"},
            csrf_for_session(self.reader_token),
        )[0], 403)
        with sqlite3.connect(self.path) as db:
            events = [json.loads(r[0]) for r in db.execute(
                "SELECT record_json FROM inventory_change_history"
            )]
        self.assertTrue(any(e.get("reason") == "SMTP test message sent"
                            for e in events))
        self.assertNotIn(SECRET, json.dumps(events))
        self.assertNotIn("test@example.test", json.dumps(events))


if __name__ == "__main__":
    unittest.main()
