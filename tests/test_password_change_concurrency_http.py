"""Password-change HTTP regressions for competing SQLite account writes."""
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

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, hash_password, verify_password
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session


ORIGIN = "https://caffoot.example"


class PasswordChangeConcurrencyHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / "password-change.sqlite3"
        with sqlite3.connect(self.path) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            self.account_id, secret = bootstrap_first_admin(db, "owner", "original")
            now = time.time()
            confirm_admin_mfa(db, self.account_id, code_at(secret, now), timestamp=now)
            self.secret = secret
            self.token = login_session(
                db, "owner", "original", mfa_code=code_at(secret, now), now=now,
            )
        self.assertIsNotNone(self.token)
        self.path_patch = patch("backend.server.DB_PATH", self.path)
        self.origin_patch = patch("backend.server.PUBLIC_ORIGIN", ORIGIN)
        self.path_patch.start()
        self.origin_patch.start()
        self.addCleanup(self.path_patch.stop)
        self.addCleanup(self.origin_patch.stop)
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.shutdown_server)

    def shutdown_server(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(10)

    def post_password(self, old="original", new="replacement"):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=15)
        headers = {
            "Content-Type": "application/json", "Origin": ORIGIN,
            "Cookie": COOKIE_NAME + "=" + self.token,
            "X-CSRF-Token": csrf_for_session(self.token),
        }
        try:
            conn.request(
                "POST", "/api/account/password",
                body=json.dumps({"currentPassword": old, "newPassword": new}),
                headers=headers,
            )
            response = conn.getresponse()
            return response.status, json.loads(response.read())
        finally:
            conn.close()

    def stored_hash(self):
        with sqlite3.connect(self.path) as db:
            return db.execute(
                "SELECT password_hash FROM accounts WHERE id=?", (self.account_id,),
            ).fetchone()[0]

    def history_count(self):
        with sqlite3.connect(self.path) as db:
            return db.execute("SELECT COUNT(*) FROM inventory_change_history").fetchone()[0]

    def test_success_and_invalid_proof_preserve_existing_security_behaviour(self):
        before = self.history_count()
        rejected, _ = self.post_password(old="incorrect")
        self.assertEqual(rejected, 400)
        self.assertTrue(verify_password("original", self.stored_hash()))
        self.assertEqual(self.history_count(), before)

        status, body = self.post_password()
        self.assertEqual(status, 200, body)
        self.assertEqual(body["status"], "password changed")
        self.assertTrue(verify_password("replacement", self.stored_hash()))
        self.assertFalse(verify_password("original", self.stored_hash()))
        self.assertEqual(self.history_count(), before + 1)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute(
                "SELECT COUNT(*) FROM account_sessions WHERE account_id=?",
                (self.account_id,),
            ).fetchone()[0], 0)
            self.assertIsNone(login_session(
                db, "owner", "original",
                mfa_code=code_at(self.secret, time.time()),
            ))
            self.assertIsNotNone(login_session(
                db, "owner", "replacement",
                mfa_code=code_at(self.secret, time.time()),
            ))

    def run_request_behind_writer(self, change):
        """An HTTP request must reassess credentials after a competing commit."""
        waiting_for_write = threading.Event()
        outcomes = []

        def traced_connect():
            db = sqlite3.connect(self.path, timeout=10)
            db.execute("PRAGMA foreign_keys=ON")
            db.execute("PRAGMA busy_timeout=10000")
            db.set_trace_callback(
                lambda statement: waiting_for_write.set()
                if statement.strip().upper().startswith("BEGIN IMMEDIATE") else None
            )
            return db

        writer = sqlite3.connect(self.path, timeout=10)
        writer.execute("PRAGMA foreign_keys=ON")
        try:
            writer.execute("BEGIN IMMEDIATE")
            change(writer)

            def send_request():
                try:
                    outcomes.append(self.post_password())
                except Exception as error:
                    outcomes.append(error)

            with patch("backend.server.connect", side_effect=traced_connect):
                thread = threading.Thread(target=send_request, daemon=True)
                thread.start()
                try:
                    self.assertTrue(
                        waiting_for_write.wait(5),
                        "Request never reached its write transaction",
                    )
                finally:
                    writer.commit()
                    thread.join(15)
                self.assertFalse(thread.is_alive(), "Competing request did not finish")
            self.assertEqual(len(outcomes), 1)
            self.assertIsInstance(outcomes[0], tuple, outcomes[0])
            return outcomes[0]
        finally:
            writer.close()

    def test_competing_password_update_cannot_be_overwritten_using_stale_proof(self):
        before = self.history_count()
        newer_hash = hash_password("from-other-writer")
        status, response = self.run_request_behind_writer(
            lambda db: db.execute(
                "UPDATE accounts SET password_hash=? WHERE id=?",
                (newer_hash, self.account_id),
            )
        )
        self.assertEqual(status, 400, response)
        self.assertTrue(verify_password("from-other-writer", self.stored_hash()))
        self.assertEqual(self.history_count(), before)

    def test_session_revoked_while_waiting_cannot_change_password(self):
        before = self.history_count()
        status, response = self.run_request_behind_writer(
            lambda db: db.execute(
                "DELETE FROM account_sessions WHERE account_id=?", (self.account_id,),
            )
        )
        self.assertEqual(status, 403, response)
        self.assertTrue(verify_password("original", self.stored_hash()))
        self.assertEqual(self.history_count(), before)


if __name__ == "__main__":
    unittest.main()
