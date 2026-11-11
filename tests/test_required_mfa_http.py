"""Password-verified MFA routes never grant application access before sign-in."""
from confirmed_permissions import set_permission
import http.client
import json
import sqlite3
import tempfile
import threading
import time
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, hash_password
from backend.login_throttle import LoginThrottle
from backend.mfa import code_at, new_secret, provisioning_uri
from backend.permissions import create_user, delete_user
from backend.request_auth import csrf_for_session, authorised_mutation
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session

ORIGIN = "https://inventory.example"


class RequiredMfaHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "fictional.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            self.admin, secret = bootstrap_first_admin(db, "owner", "password")
            confirm_admin_mfa(db, self.admin, code_at(secret, time.time()))
            self.user = create_user(db, self.admin, "worker", "password")
            self.staff_token = login_session(db, "worker", "password")
            set_permission(db, self.admin, self.user, "Devices", "read")
        throttle = LoginThrottle()
        for name, value in (("DB_PATH", self.path), ("PUBLIC_ORIGIN", ORIGIN), ("THROTTLE", throttle)):
            patcher = patch("backend.server." + name, value)
            patcher.start()
            self.addCleanup(patcher.stop)
        patcher = patch("backend.request_auth.THROTTLE", throttle)
        patcher.start()
        self.addCleanup(patcher.stop)
        notice_patch = patch("backend.server.notify_security_change")
        self.notice = notice_patch.start()
        self.addCleanup(notice_patch.stop)
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temp.cleanup()

    def request(self, path, payload=None, *, method="POST", headers=None):
        supplied = {"Origin": ORIGIN, "Content-Type": "application/json"}
        supplied.update(headers or {})
        supplied = {key: value for key, value in supplied.items() if value is not None}
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port)
        connection.request(method, path, json.dumps(payload) if payload is not None else None, supplied)
        response = connection.getresponse()
        body = json.loads(response.read())
        result = response.status, body, response.getheader("Set-Cookie")
        self.assertEqual(response.getheader("Cache-Control"), "no-store")
        connection.close()
        return result

    def credentials(self, **extra):
        return {"username": "worker", "password": "password", **extra}

    def enrol(self):
        status, pending, cookie = self.request("/api/login/mfa/start", self.credentials())
        self.assertEqual(status, 200)
        self.assertIsNone(cookie)
        self.assertEqual(pending["mfaUri"], provisioning_uri("worker", pending["mfaSecret"]))
        status, result, cookie = self.request("/api/login/mfa/confirm", self.credentials(mfa_code=code_at(pending["mfaSecret"], time.time())))
        self.assertEqual((status, result, cookie), (200, {"status": "mfa enrolled"}, None))
        return pending["mfaSecret"]

    def test_required_response_no_cookie_no_session_and_no_normal_api_access(self):
        for _ in range(7):
            self.assertEqual(self.request("/api/login", self.credentials()), (200, {"status": "mfa enrolment required"}, None))
        for path in ("/api/session", "/api/inventory/state", "/api/users"):
            self.assertEqual(self.request(path, method="GET")[0], 401)
            self.assertEqual(self.request(path, method="GET", headers={"Cookie": "caffoot_session=" + self.staff_token})[0], 401)
        self.assertEqual(self.request("/api/account/mfa/start", {"password": "password"})[0], 403)
        self.assertEqual(self.request("/api/setup/mfa-secret", self.credentials())[0], 400)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM account_sessions WHERE account_id=?", (self.user,)).fetchone()[0], 0)

    def test_start_reuses_secret_and_confirm_requires_fresh_normal_login(self):
        first = self.request("/api/login/mfa/start", self.credentials())[1]
        self.assertEqual(self.request("/api/login/mfa/start", self.credentials())[1], first)
        secret = self.enrol()
        self.assertEqual(self.request("/api/session", method="GET")[0], 401)
        self.assertEqual(self.request("/api/login", self.credentials())[0], 401)
        status, _, cookie = self.request("/api/login", self.credentials(mfa_code=code_at(secret, time.time())))
        self.assertEqual(status, 200)
        for attribute in ("Secure", "HttpOnly", "SameSite=Strict"):
            self.assertIn(attribute, cookie)
        self.assertEqual(self.request("/api/login/mfa/start", self.credentials())[0], 401)
        self.assertEqual(self.request("/api/login/mfa/confirm", self.credentials(mfa_code=code_at(secret, time.time())))[0], 401)
        self.notice.assert_called_once()

    def test_upgraded_legacy_reader_enrols_without_losing_existing_access(self):
        with sqlite3.connect(":memory:") as legacy, sqlite3.connect(self.path) as destination:
            legacy.executescript((Path(__file__).parent / "fixtures/schema-v10.sql").read_text())
            legacy.execute("INSERT INTO accounts(id,username,password_hash) VALUES(?, 'worker', ?)",
                           (self.user, hash_password("password")))
            legacy.execute("INSERT INTO account_permissions VALUES(?, 'Devices', 'read')", (self.user,))
            legacy.commit()
            initialise_database(legacy)
            legacy.backup(destination)
        self.assertEqual(self.request("/api/login", self.credentials()), (200, {"status": "mfa enrolment required"}, None))
        secret = self.enrol()
        status, _, cookie = self.request("/api/login", self.credentials(mfa_code=code_at(secret, time.time())))
        self.assertEqual(status, 200)
        status, result, _ = self.request("/api/inventory/sections", method="GET", headers={"Cookie": cookie.split(";", 1)[0]})
        self.assertEqual(status, 200)
        self.assertEqual(result["sections"]["Devices"], {"read": True, "edit": False})
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute("SELECT section,level FROM account_permission_overrides WHERE account_id=?", (self.user,)).fetchall(), [("Devices", "read")])

    def test_bad_password_unknown_and_inactive_are_generic_and_do_not_leak_secret(self):
        cases = (self.credentials(password="wrong"), self.credentials(username="unknown"))
        for path in ("/api/login", "/api/login/mfa/start", "/api/login/mfa/confirm"):
            for payload in cases:
                if path.endswith("confirm"):
                    payload = dict(payload, mfa_code="123456")
                status, result, cookie = self.request(path, payload)
                self.assertEqual(status, 401)
                self.assertIsNone(cookie)
                self.assertEqual(set(result), {"error"})
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE accounts SET active=0 WHERE id=?", (self.user,))
        self.assertEqual(self.request("/api/login", self.credentials())[0], 401)
        self.assertEqual(self.request("/api/login/mfa/start", self.credentials())[0], 401)

    def test_start_and_valid_password_login_do_not_reset_failed_code_budget(self):
        secret = self.request("/api/login/mfa/start", self.credentials())[1]["mfaSecret"]
        for _ in range(5):
            self.assertEqual(self.request("/api/login/mfa/start", self.credentials())[0], 200)
            self.assertEqual(self.request("/api/login", self.credentials())[0], 200)
            self.assertEqual(self.request("/api/login/mfa/confirm", self.credentials(mfa_code="bad"))[0], 401)
        self.assertEqual(self.request("/api/login/mfa/confirm", self.credentials(mfa_code=code_at(secret, time.time())))[0], 401)
        self.assertEqual(self.request("/api/login/mfa/start", self.credentials())[0], 401)
        self.assertEqual(self.request("/api/login", self.credentials())[0], 401)

    def test_bad_password_budget_is_shared_between_all_prelogin_routes(self):
        for path in ("/api/login", "/api/login/mfa/start", "/api/login/mfa/confirm", "/api/login", "/api/login/mfa/start"):
            payload = self.credentials(password="wrong")
            if path.endswith("confirm"):
                payload["mfa_code"] = "123456"
            self.assertEqual(self.request(path, payload)[0], 401)
        self.assertEqual(self.request("/api/login/mfa/start", self.credentials())[0], 401)

    def test_prelogin_origin_content_size_and_field_guards(self):
        for path in ("/api/login/mfa/start", "/api/login/mfa/confirm"):
            payload = self.credentials(**({"mfa_code": "123456"} if path.endswith("confirm") else {}))
            for headers, expected in (({"Origin": None}, 403), ({"Origin": "https://attacker.example"}, 403),
                                      ({"Content-Type": "text/plain"}, 415), ({"Content-Length": "4097"}, 400)):
                with self.subTest(path=path, headers=headers):
                    self.assertEqual(self.request(path, payload, headers=headers)[0], expected)
            self.assertEqual(self.request(path, dict(payload, userId=self.admin))[0], 400)

    def voluntary_account(self):
        secret = new_secret()
        with sqlite3.connect(self.path) as db:
            db.execute("DELETE FROM account_permission_overrides WHERE account_id=?", (self.user,))
            db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, self.user))
            db.commit()
            token = login_session(db, "worker", "password", mfa_code=code_at(secret, time.time()))
        headers = {"Cookie": "caffoot_session=" + token, "X-CSRF-Token": csrf_for_session(token)}
        return secret, token, headers

    def test_removal_protects_origin_csrf_and_proofs_then_revokes_session(self):
        secret, token, headers = self.voluntary_account()
        payload = {"password": "password", "code": code_at(secret, time.time())}
        for changes in ({"Origin": "https://attacker.example"}, {"X-CSRF-Token": None}, {"Cookie": None}):
            self.assertEqual(self.request("/api/account/mfa/remove", payload, headers={**headers, **changes})[0], 403)
        for bad in ({**payload, "password": "wrong"}, {**payload, "code": "bad"}):
            self.assertEqual(self.request("/api/account/mfa/remove", bad, headers=headers)[0], 403)
        status, result, cookie = self.request("/api/account/mfa/remove", payload, headers=headers)
        self.assertEqual((status, result), (200, {"status": "mfa removed"}))
        self.assertIn("Max-Age=0", cookie)
        self.assertEqual(self.request("/api/session", method="GET", headers=headers)[0], 401)
        self.assertEqual(self.request("/api/login", self.credentials())[0], 200)
        with sqlite3.connect(self.path) as db:
            event = db.execute("SELECT record_json FROM inventory_change_history ORDER BY id DESC").fetchone()[0]
            self.assertNotIn(secret, event)
            self.assertEqual(json.loads(event)["actorId"], self.user)
        self.notice.assert_called_once()

    def test_removal_failures_are_throttled_and_permission_assignment_blocks_removal(self):
        secret, token, headers = self.voluntary_account()
        for _ in range(5):
            self.assertEqual(self.request("/api/account/mfa/remove", {"password": "password", "code": "bad"}, headers=headers)[0], 403)
        self.assertEqual(self.request("/api/account/mfa/remove", {"password": "password", "code": code_at(secret, time.time())}, headers=headers)[0], 403)
        self.assertEqual(self.request("/api/session", method="GET", headers=headers)[0], 200)
        self.notice.assert_not_called()

    def test_account_deleted_after_request_authentication_has_generic_removal_error(self):
        secret, _, headers = self.voluntary_account()

        def authenticate_then_delete(*args, **kwargs):
            actor = authorised_mutation(*args, **kwargs)
            with sqlite3.connect(self.path) as db:
                db.execute("PRAGMA foreign_keys=ON")
                delete_user(db, self.admin, self.user)
            return actor

        with patch("backend.server.authorised_mutation", side_effect=authenticate_then_delete):
            status, result, cookie = self.request(
                "/api/account/mfa/remove", {"password": "password", "code": code_at(secret, time.time())},
                headers=headers,
            )
        self.assertEqual((status, result, cookie), (403, {"error": "forbidden"}, None))

    def test_role_assignment_after_login_refuses_removal_without_altering_grants(self):
        secret, token, headers = self.voluntary_account()
        with sqlite3.connect(self.path) as db:
            role = db.execute("INSERT INTO roles(role_key,name) VALUES('extra','Extra')").lastrowid
            db.execute("INSERT INTO account_roles VALUES(?,?)", (self.user, role))
        self.assertEqual(self.request("/api/account/mfa/remove", {"password": "password", "code": code_at(secret, time.time())}, headers=headers)[0], 403)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute("SELECT mfa_confirmed FROM accounts WHERE id=?", (self.user,)).fetchone()[0], 1)
            self.assertIsNotNone(db.execute("SELECT 1 FROM account_roles WHERE account_id=? AND role_id=?", (self.user, role)).fetchone())
