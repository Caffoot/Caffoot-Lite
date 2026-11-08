"""The local emergency command must preserve identity, inventory and MFA protection."""
import json
import sqlite3
import time
import unittest

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, verify_password
from backend.authentication import authenticate
from backend.mfa import code_at
from backend.recover_admin import recover_sole_administrator
from backend.schema import initialise_database
from backend.sessions import login_session


class HostRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        self.account, self.secret = bootstrap_first_admin(self.db, "owner", "old-password")
        confirm_admin_mfa(self.db, self.account, code_at(self.secret, time.time()))
        login_session(self.db, "owner", "old-password", mfa_code=code_at(self.secret, time.time()))
        self.db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('d','Device','{}',0)")
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_recovery_requires_fresh_confirmed_mfa_and_preserves_data(self):
        recover_sole_administrator(self.db, "owner", "replacement-password")
        row = self.db.execute("SELECT id,password_hash,mfa_secret,mfa_confirmed FROM accounts").fetchone()
        self.assertEqual(row[0], self.account)
        self.assertTrue(verify_password("replacement-password", row[1]))
        self.assertNotEqual(row[2], self.secret)
        self.assertEqual(row[3], 0)
        self.assertIsNone(authenticate(self.db, "owner", "replacement-password"))
        self.assertIsNone(authenticate(self.db, "owner", "replacement-password", mfa_code=code_at(self.secret, time.time())))
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM account_sessions").fetchone()[0], 0)
        self.assertEqual(self.db.execute("SELECT name FROM inventory_devices").fetchone()[0], "Device")
        event = json.loads(self.db.execute("SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1").fetchone()[0])
        self.assertEqual(event["actorId"], self.account)
        self.assertNotIn("replacement-password", json.dumps(event))
        confirm_admin_mfa(self.db, self.account, code_at(row[2], time.time()))
        self.assertEqual(authenticate(self.db, "owner", "replacement-password", mfa_code=code_at(row[2], time.time())), self.account)

    def test_wrong_identity_does_not_change_anything(self):
        before = list(self.db.iterdump())
        with self.assertRaises(ValueError):
            recover_sole_administrator(self.db, "someone-else", "replacement-password")
        self.assertEqual(list(self.db.iterdump()), before)
