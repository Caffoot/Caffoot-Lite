"""Real SQLite writers check the latest account state after waiting for a lock."""
import sqlite3
import tempfile
import threading
import unittest
from pathlib import Path

from backend.account_security import (
    start_required_mfa_enrolment, confirm_required_mfa_enrolment, remove_own_mfa,
)
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.authentication import MFAEnrolmentRequired
from backend.mfa import code_at
from backend.permissions import create_user, set_permission
from backend.schema import initialise_database
from backend.sessions import login_session


class MfaConcurrencyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.sequence = 0

    def fixture(self, *, mandatory=False, enrolled=False):
        self.sequence += 1
        path = Path(self.temp.name) / f"fictional-{self.sequence}.sqlite3"
        writer = sqlite3.connect(path, timeout=10)
        self.addCleanup(writer.close)
        initialise_database(writer)
        admin, secret = bootstrap_first_admin(writer, "owner", "password")
        confirm_admin_mfa(writer, admin, code_at(secret, 59), timestamp=59)
        user = create_user(writer, admin, "worker", "password")
        if mandatory:
            set_permission(writer, admin, user, "Devices", "read")
            _, secret = start_required_mfa_enrolment(writer, "worker", "password")
        if enrolled:
            writer.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, user))
            writer.commit()
        token = None if mandatory else login_session(
            writer, "worker", "password", mfa_code=code_at(secret, 59) if enrolled else None, now=59,
        )
        return path, writer, user, secret, token

    def run_waiting_operation(self, path, writer, change, operation):
        waiting = threading.Event()
        result = []

        def worker():
            with sqlite3.connect(path, timeout=10) as reader:
                reader.set_trace_callback(lambda statement: waiting.set() if statement == "BEGIN IMMEDIATE" else None)
                try:
                    result.append(operation(reader))
                except Exception as error:
                    result.append(error)

        writer.execute("BEGIN IMMEDIATE")
        change(writer)
        thread = threading.Thread(target=worker)
        thread.start()
        try:
            self.assertTrue(waiting.wait(5), "The account operation did not reach its transaction")
        finally:
            writer.commit()
            thread.join(15)
        self.assertFalse(thread.is_alive(), "The account operation did not finish")
        self.assertEqual(len(result), 1)
        return result[0]

    def test_confirmation_rechecks_changes_committed_while_waiting(self):
        for change in (
            "DELETE FROM account_permission_overrides WHERE account_id=?",
            "UPDATE accounts SET active=0 WHERE id=?",
            "UPDATE accounts SET mfa_confirmed=1 WHERE id=?",
            "UPDATE accounts SET mfa_secret=NULL WHERE id=?",
        ):
            with self.subTest(change=change):
                path, writer, user, secret, _ = self.fixture(mandatory=True)
                result = self.run_waiting_operation(
                    path, writer, lambda db: db.execute(change, (user,)),
                    lambda db: confirm_required_mfa_enrolment(db, "worker", "password", code_at(secret, 59), timestamp=59),
                )
                self.assertIsInstance(result, PermissionError)

    def test_removal_rechecks_role_grant_active_mfa_and_session_changes(self):
        for change in ("role", "read", "edit", "inactive", "pending", "session"):
            with self.subTest(change=change):
                path, writer, user, secret, token = self.fixture(enrolled=True)

                def change_account(db):
                    if change == "role":
                        role = db.execute("INSERT INTO roles(role_key,name) VALUES('extra','Extra')").lastrowid
                        db.execute("INSERT INTO account_roles VALUES(?,?)", (user, role))
                    elif change in ("read", "edit"):
                        db.execute("INSERT INTO account_permission_overrides VALUES(?, 'Devices', ?)", (user, change))
                    elif change == "session":
                        db.execute("DELETE FROM account_sessions WHERE account_id=?", (user,))
                    else:
                        column = "active" if change == "inactive" else "mfa_confirmed"
                        db.execute(f"UPDATE accounts SET {column}=0 WHERE id=?", (user,))

                result = self.run_waiting_operation(
                    path, writer, change_account,
                    lambda db: remove_own_mfa(db, user, "password", code_at(secret, 59), session_token=token, timestamp=59),
                )
                self.assertIsInstance(result, PermissionError)
                self.assertEqual(writer.execute("SELECT mfa_secret FROM accounts WHERE id=?", (user,)).fetchone()[0], secret)

    def test_confirmation_rechecks_role_disable_and_membership_removal(self):
        for change in ("UPDATE roles SET enabled=0 WHERE id=?", "DELETE FROM account_roles WHERE role_id=?"):
            with self.subTest(change=change):
                path, writer, user, _, _ = self.fixture()
                role = writer.execute("INSERT INTO roles(role_key,name) VALUES('extra','Extra')").lastrowid
                writer.execute("INSERT INTO account_roles VALUES(?,?)", (user, role))
                writer.commit()
                _, secret = start_required_mfa_enrolment(writer, "worker", "password")
                result = self.run_waiting_operation(
                    path, writer, lambda db: db.execute(change, (role,)),
                    lambda db: confirm_required_mfa_enrolment(db, "worker", "password", code_at(secret, 59), timestamp=59),
                )
                self.assertIsInstance(result, PermissionError)
                self.assertEqual(writer.execute("SELECT mfa_confirmed FROM accounts WHERE id=?", (user,)).fetchone()[0], 0)

    def test_session_creation_rechecks_new_mandate_before_insert(self):
        path, writer, user, _, token = self.fixture()
        writer.execute("DELETE FROM account_sessions WHERE account_id=?", (user,))
        writer.commit()
        result = self.run_waiting_operation(
            path, writer,
            lambda db: db.execute("INSERT INTO account_permission_overrides VALUES(?, 'Devices', 'read')", (user,)),
            lambda db: login_session(db, "worker", "password", now=59, report_enrolment=True),
        )
        self.assertIsInstance(result, MFAEnrolmentRequired)
        self.assertEqual(writer.execute("SELECT count(*) FROM account_sessions WHERE account_id=?", (user,)).fetchone()[0], 0)
