"""Real SQLite writers must recheck role confirmations after waiting for a lock."""
import concurrent.futures
import sqlite3
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user
from backend.roles import preview_role_change, confirm_role_change
from backend.schema import initialise_database
from backend.sessions import login_session


class RoleConcurrencyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "roles.sqlite3"
        with self.connect() as db:
            initialise_database(db)
            self.admin, self.secret = bootstrap_first_admin(db, "owner", "password")
            confirm_admin_mfa(db, self.admin, code_at(self.secret, 59), timestamp=59)
            self.token = login_session(db, "owner", "password", mfa_code=code_at(self.secret, 59), now=59)
            self.user = create_user(db, self.admin, "staff", "password")
            self.role = db.execute("INSERT INTO roles(role_key,name) VALUES('readers','Readers')").lastrowid
            db.execute("INSERT INTO role_grants VALUES(?, 'Devices', 'read')", (self.role,))

    def tearDown(self):
        self.temp.cleanup()

    def connect(self):
        db = sqlite3.connect(self.path, timeout=5)
        db.execute("PRAGMA foreign_keys=ON")
        return db

    def preview(self, action):
        with self.connect() as db:
            return preview_role_change(db, self.admin, self.token, action, now=60)

    def test_two_parallel_confirmations_apply_once(self):
        action = {"type": "membership.assign", "userId": self.user, "roleId": self.role}
        first, second = self.preview(action), self.preview(action)
        barrier = threading.Barrier(2)
        def confirm(preview):
            with self.connect() as db:
                barrier.wait(timeout=5)
                return confirm_role_change(db, self.admin, self.token, action, preview["proof"], now=61)
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(confirm, (first, second)))
        self.assertEqual(sorted(result["status"] for result in results), ["confirmation required", "updated"])
        with self.connect() as db:
            self.assertEqual(db.execute("SELECT count(*) FROM account_roles WHERE role_id=?", (self.role,)).fetchone()[0], 1)
            self.assertEqual(db.execute("SELECT count(*) FROM inventory_change_history WHERE json_extract(record_json,'$.confirmationId') IS NOT NULL").fetchone()[0], 1)

    def test_waiting_confirmation_rechecks_grants_membership_overrides_and_account(self):
        action = {"type": "role.update", "roleId": self.role, "name": "Readers", "enabled": False, "grants": {"Devices": "read"}}
        with self.connect() as db:
            db.execute("INSERT INTO account_roles VALUES(?,?)", (self.user, self.role))
        for sql, parameters in (
            ("UPDATE role_grants SET level='edit' WHERE role_id=?", (self.role,)),
            ("INSERT INTO account_permission_overrides VALUES(?, 'Devices', 'deny')", (self.user,)),
            ("DELETE FROM account_roles WHERE account_id=? AND role_id=?", (self.user, self.role)),
            ("UPDATE accounts SET active=0 WHERE id=?", (self.user,)),
        ):
            with self.subTest(sql=sql):
                with self.connect() as db:
                    db.execute("INSERT OR IGNORE INTO account_roles VALUES(?,?)", (self.user, self.role))
                preview = self.preview(action)
                attempted = threading.Event()
                writer = self.connect()
                writer.execute("BEGIN IMMEDIATE")
                writer.execute(sql, parameters)
                def confirm():
                    with self.connect() as db:
                        db.set_trace_callback(lambda query: attempted.set() if query == "BEGIN IMMEDIATE" else None)
                        return confirm_role_change(db, self.admin, self.token, action, preview["proof"], now=61)
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                    result = pool.submit(confirm)
                    self.assertTrue(attempted.wait(3))
                    self.assertFalse(result.done())
                    writer.commit()
                    writer.close()
                    result = result.result(timeout=5)
                self.assertEqual(result["status"], "confirmation required")
                self.assertTrue(result["preview"]["available"])
                with self.connect() as db:
                    self.assertEqual(db.execute("SELECT enabled FROM roles WHERE id=?", (self.role,)).fetchone()[0], 1)

    def test_waiting_confirmation_rejects_revoked_administrator_session(self):
        action = {"type": "membership.assign", "userId": self.user, "roleId": self.role}
        preview = self.preview(action)
        attempted = threading.Event()
        writer = self.connect()
        writer.execute("BEGIN IMMEDIATE")
        writer.execute("DELETE FROM account_sessions WHERE account_id=?", (self.admin,))
        def confirm():
            with self.connect() as db:
                db.set_trace_callback(lambda query: attempted.set() if query == "BEGIN IMMEDIATE" else None)
                return confirm_role_change(db, self.admin, self.token, action, preview["proof"], now=61)
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
            result = pool.submit(confirm)
            self.assertTrue(attempted.wait(3))
            writer.commit()
            writer.close()
            with self.assertRaises(PermissionError):
                result.result(timeout=5)
        with self.connect() as db:
            self.assertFalse(db.execute("SELECT 1 FROM account_roles WHERE role_id=?", (self.role,)).fetchone())

    def test_waiting_for_writer_does_not_extend_confirmation_expiry(self):
        action = {"type": "membership.assign", "userId": self.user, "roleId": self.role}
        preview = self.preview(action)
        attempted = threading.Event()
        clock = [60]
        writer = self.connect()
        writer.execute("BEGIN IMMEDIATE")
        def confirm():
            with self.connect() as db:
                db.set_trace_callback(lambda query: attempted.set() if query == "BEGIN IMMEDIATE" else None)
                return confirm_role_change(db, self.admin, self.token, action, preview["proof"])
        with patch("backend.roles.time.time", side_effect=lambda: clock[0]):
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                result = pool.submit(confirm)
                self.assertTrue(attempted.wait(3))
                clock[0] = 400
                writer.commit()
                writer.close()
                self.assertEqual(result.result(timeout=5)["status"], "confirmation required")
        with self.connect() as db:
            self.assertFalse(db.execute("SELECT 1 FROM account_roles WHERE role_id=?", (self.role,)).fetchone())


if __name__ == "__main__":
    unittest.main()
