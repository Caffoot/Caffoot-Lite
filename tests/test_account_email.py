"""Email proofs must expire, be single-use and retain every existing MFA boundary."""
import json
import sqlite3
import time
import tempfile
from pathlib import Path
import unittest

from backend.account_email import (confirm_email_proof, issue_email_proof,
                                   record_blocked_sign_in, security_recipients)
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, verify_password
from backend.mfa import code_at
from backend.profiles import save_profile
from backend.schema import initialise_database
from backend.sessions import login_session


class AccountEmailTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.db = sqlite3.connect(Path(self.temp.name)/"account.sqlite3")
        self.challenges = {}
        self.db.execute("PRAGMA foreign_keys=ON")
        initialise_database(self.db)
        self.admin, self.secret = bootstrap_first_admin(self.db, "owner", "password")
        self.now = int(time.time())
        confirm_admin_mfa(self.db, self.admin, code_at(self.secret, self.now), timestamp=self.now)
        save_profile(self.db, self.admin, {"firstName":"", "lastName":"", "displayName":"", "email":"owner@example.org"})

    def tearDown(self):
        self.db.close()
        self.temp.cleanup()

    def proof(self, purpose="verify"):
        proof = issue_email_proof(self.db, self.admin, purpose, now=self.now)
        self.db.commit()
        if proof:
            self.challenges[proof[0]] = proof[2]
        return proof[0] if proof else None

    def confirm(self, token, purpose, **kwargs):
        return confirm_email_proof(self.db, token, purpose, challenge_id=self.challenges.get(token, "f"*64), **kwargs)

    def verify(self):
        self.confirm( self.proof(), "verify", account_id=self.admin, now=self.now)

    def test_unverified_email_cannot_recover_and_proofs_are_hashed(self):
        self.assertIsNone(self.proof("recover"))
        token = self.proof()
        self.assertNotIn(token, "\n".join(self.db.iterdump()))
        self.assertEqual(security_recipients(self.db, administrators=True), set())
        self.confirm( token, "verify", account_id=self.admin, now=self.now)
        self.assertEqual(security_recipients(self.db, administrators=True), {"owner@example.org"})
        with self.assertRaises(ValueError):
            self.confirm( token, "verify", account_id=self.admin, now=self.now)

    def test_expiry_replacement_and_account_binding(self):
        old = self.proof()
        current = self.proof()
        for token, target, now in [(old,self.admin,self.now), (current,self.admin+1,self.now),
                                    (current,self.admin,self.now+901)]:
            with self.assertRaises(ValueError):
                self.confirm( token, "verify", account_id=target, now=now)

    def test_recovery_requires_mfa_revokes_sessions_and_retains_secret(self):
        self.verify()
        login_session(self.db, "owner", "password", mfa_code=code_at(self.secret, self.now), now=self.now)
        token = self.proof("recover")
        for code in (None,"wrong-code"):
            with self.assertRaises(ValueError):
                self.confirm( token, "recover", password="new-password", mfa_code=code, now=self.now)
        self.confirm( token, "recover", password="new-password", mfa_code=code_at(self.secret,self.now), now=self.now)
        row = self.db.execute("SELECT password_hash,mfa_secret,mfa_confirmed FROM accounts WHERE id=?", (self.admin,)).fetchone()
        self.assertTrue(verify_password("new-password", row[0]))
        self.assertEqual(row[1:], (self.secret,1))
        self.assertEqual(self.db.execute("SELECT count(*) FROM account_sessions").fetchone()[0],0)
        history = "\n".join(row[0] for row in self.db.execute("SELECT record_json FROM inventory_change_history"))
        self.assertNotIn(token,history)
        self.assertNotIn("new-password",history)
        with self.assertRaises(ValueError):
            self.confirm( token, "recover", password="different", mfa_code=code_at(self.secret,self.now), now=self.now)

    def test_email_change_invalidates_prior_proofs_and_verification(self):
        self.verify()
        token = self.proof("recover")
        save_profile(self.db,self.admin,{"firstName":"", "lastName":"", "displayName":"", "email":"new@example.org"})
        self.assertEqual(self.db.execute("SELECT email_verified FROM account_profiles").fetchone()[0],0)
        self.assertEqual(self.db.execute("SELECT count(*) FROM account_email_proofs").fetchone()[0],0)
        with self.assertRaises(ValueError):
            self.confirm(token,"recover",password="new",mfa_code=code_at(self.secret,self.now),now=self.now)

    def test_failure_alerts_are_deduplicated_without_capturing_attempted_identity(self):
        self.assertTrue(record_blocked_sign_in(self.db,"test-peer","attempted-secret-name",now=1))
        self.assertFalse(record_blocked_sign_in(self.db,"test-peer","attempted-secret-name",now=2))
        self.assertTrue(record_blocked_sign_in(self.db,"test-peer","attempted-secret-name",now=902))
        event=json.loads(self.db.execute("SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1").fetchone()[0])
        self.assertEqual(event["outcome"],"Blocked")
        self.assertNotIn("attempted-secret-name",json.dumps(event))
