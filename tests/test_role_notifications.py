"""Optional security email cannot undo a committed role change."""
import sqlite3
import threading
import unittest
from unittest.mock import patch

from backend import account_email
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user
from backend.roles import preview_role_change, confirm_role_change
from backend.schema import initialise_database
from backend.sessions import login_session


class RoleNotificationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.admin, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, self.admin, code_at(secret, 59), timestamp=59)
        self.token = login_session(self.db, "owner", "password", mfa_code=code_at(secret, 59), now=59)
        self.users = [create_user(self.db, self.admin, name, "password") for name in ("verified", "unverified", "missing", "disabled")]
        for user, address, verified in zip(self.users, ("verified@example.test", "unverified@example.test", "", "disabled@example.test"), (1, 0, 0, 1)):
            self.db.execute("INSERT INTO account_profiles(account_id,email,email_verified) VALUES(?,?,?)", (user, address, verified))
        self.db.execute("UPDATE accounts SET active=0 WHERE id=?", (self.users[-1],))
        self.db.commit()
        self.notice_state = patch.dict(account_email._NOTICE_NEXT, {}, clear=True)
        self.notice_state.start()

    def tearDown(self):
        self.notice_state.stop()
        self.db.close()

    def test_verified_active_recipients_generic_content_and_coalescing(self):
        with patch("backend.smtp_settings.public_settings", return_value={"configured": True}), patch("backend.account_email.queue_email", return_value=True) as queue:
            result = account_email.role_change_notifications(self.db, "/unused", self.users)
            self.assertEqual(result["eligibleAccountCount"], 1)
            self.assertEqual(result["recipientCount"], 1)
            self.assertEqual(result["queued"], 1)
            arguments = queue.call_args.args
            self.assertEqual(arguments[1], "verified@example.test")
            self.assertIn("MFA", arguments[3])
            for sensitive in ("Devices", "IPAM", "Racks", "password_hash", self.token):
                self.assertNotIn(sensitive, arguments[3])
            result = account_email.role_change_notifications(self.db, "/unused", self.users)
            self.assertEqual(result["coalesced"], 1)
            self.assertEqual(queue.call_count, 1)

    def test_smtp_absent_and_queue_failures_do_not_change_commit(self):
        for outcome in ("absent", "full", "exception"):
            with self.subTest(outcome=outcome):
                account_email._NOTICE_NEXT.clear()
                action = {"type": "override.set", "userId": self.users[0], "section": "Devices",
                          "level": {"absent": "read", "full": "edit", "exception": "deny"}[outcome]}
                preview = preview_role_change(self.db, self.admin, self.token, action, now=60)
                result = confirm_role_change(self.db, self.admin, self.token, action, preview["proof"], now=61)
                self.assertEqual(result["status"], "updated")
                def queue(*args):
                    self.assertFalse(self.db.in_transaction)
                    self.assertEqual(self.db.execute("SELECT level FROM account_permission_overrides WHERE account_id=?", (self.users[0],)).fetchone()[0], action["level"])
                    if outcome == "exception":
                        raise RuntimeError("queue unavailable")
                    return False
                with patch("backend.smtp_settings.public_settings", return_value={"configured": outcome != "absent"}), patch("backend.account_email.queue_email", side_effect=queue) as queued:
                    notice = account_email.role_change_notifications(self.db, "/unused", result["notificationAccountIds"])
                self.assertEqual(notice["queued"], 0)
                self.assertEqual(queued.call_count, 0 if outcome == "absent" else 1)
                self.assertEqual(notice["notQueued"], 0 if outcome == "absent" else 1)
                self.assertEqual(self.db.execute("SELECT level FROM account_permission_overrides WHERE account_id=?", (self.users[0],)).fetchone()[0], action["level"])

    def test_real_bounded_queue_and_delivery_exception_release_capacity(self):
        capacity = threading.BoundedSemaphore(1)
        capacity.acquire()
        with patch.object(account_email, "MAIL_CAPACITY", capacity):
            self.assertFalse(account_email.queue_email("/unused", "a@example.test", "Notice", "Generic"))
        class ImmediateExecutor:
            def submit(self, deliver):
                deliver()
        capacity.release()
        action = {"type": "override.set", "userId": self.users[0], "section": "Devices", "level": "read"}
        preview = preview_role_change(self.db, self.admin, self.token, action, now=60)
        self.assertEqual(confirm_role_change(self.db, self.admin, self.token, action, preview["proof"], now=61)["status"], "updated")
        with patch.object(account_email, "MAIL_CAPACITY", capacity), patch.object(account_email, "MAIL_EXECUTOR", ImmediateExecutor()), patch.object(account_email, "send_account_email", side_effect=OSError("SMTP unavailable")), patch("backend.smtp_settings.public_settings", return_value={"configured": True}):
            result = account_email.role_change_notifications(self.db, "/unused", [self.users[0]])
            self.assertEqual(result["queued"], 1)
            self.assertEqual(self.db.execute("SELECT level FROM account_permission_overrides WHERE account_id=?", (self.users[0],)).fetchone()[0], "read")
            self.assertTrue(capacity.acquire(blocking=False))
            capacity.release()
        with patch.object(account_email.MAIL_EXECUTOR, "submit", side_effect=RuntimeError("executor stopped")):
            self.assertFalse(account_email.queue_email("/unused", "a@example.test", "Notice", "Generic"))

    def test_administrator_recipient_deduplicates_and_settings_failure_is_optional(self):
        self.db.execute("INSERT INTO account_profiles(account_id,email,email_verified) VALUES(?, 'verified@example.test', 1)", (self.admin,))
        self.db.commit()
        with patch("backend.smtp_settings.public_settings", return_value={"configured": True}), patch("backend.account_email.queue_email", return_value=True) as queue:
            result = account_email.role_change_notifications(self.db, "/unused", self.users)
            self.assertEqual(result["recipientCount"], 1)
            self.assertEqual(queue.call_count, 1)
        with patch("backend.smtp_settings.public_settings", side_effect=OSError("private configuration")):
            result = account_email.role_change_notifications(self.db, "/unused", self.users)
            self.assertEqual(result["queued"], 0)
            self.assertNotIn("private configuration", str(result))


if __name__ == "__main__":
    unittest.main()
