"""Short mail codes retain binding, durable budgets, private keys and atomic use."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import os
import sqlite3
import tempfile
import time
import unittest
from unittest.mock import patch

from backend.account_email import (confirm_email_proof, email_proof_secret,
                                   issue_email_proof, TOKEN_SECONDS)
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user, set_account_active
from backend.profiles import save_profile
from backend.schema import initialise_database


class EmailChallengeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / 'inventory.sqlite3'
        self.db = sqlite3.connect(self.path)
        self.db.execute('PRAGMA foreign_keys=ON')
        initialise_database(self.db)
        self.account, self.mfa = bootstrap_first_admin(self.db, 'fictional-owner', 'password')
        self.now = int(time.time())
        confirm_admin_mfa(self.db, self.account, code_at(self.mfa, self.now), timestamp=self.now)
        save_profile(self.db, self.account, {'firstName':'','lastName':'','displayName':'','email':'fictional@example.test'})

    def tearDown(self):
        self.db.close()
        self.temp.cleanup()

    def issue(self, purpose='verify', now=None, account=None):
        return issue_email_proof(self.db, account or self.account, purpose, now=self.now if now is None else now)

    def confirm(self, proof, purpose='verify', now=None, **kwargs):
        return confirm_email_proof(self.db, proof[0], purpose, challenge_id=proof[2],
                                   account_id=self.account if purpose=='verify' else None,
                                   now=self.now if now is None else now, **kwargs)

    def fail(self, proof, code='not a code', now=None, purpose='verify', **kwargs):
        with self.assertRaises(ValueError):
            confirm_email_proof(self.db, code, purpose, challenge_id=proof[2],
                                account_id=self.account if purpose=='verify' else None,
                                now=self.now if now is None else now, **kwargs)

    def test_generation_preserves_zeroes_and_keeps_code_out_of_sqlite(self):
        with patch('backend.account_email.secrets.randbelow', return_value=0):
            proof = self.issue()
        self.assertEqual(proof[0], '00000000')
        self.assertRegex(proof[2], r'^[0-9a-f]{64}$')
        dump = '\n'.join(self.db.iterdump())
        self.assertNotIn(proof[0], dump)
        self.assertEqual(len(self.db.execute('SELECT token_hash FROM account_email_proofs').fetchone()[0]), 64)
        self.assertEqual(self.confirm(proof), self.account)

    def test_same_digits_have_distinct_challenge_bound_digests(self):
        with patch('backend.account_email.secrets.randbelow', return_value=1234):
            first = self.issue()
            old_digest = self.db.execute('SELECT token_hash FROM account_email_proofs').fetchone()[0]
            second = self.issue()
        self.assertEqual(first[0], '00001234')
        self.assertEqual(first[0], second[0])
        self.assertNotEqual(first[2], second[2])
        self.assertNotEqual(old_digest, self.db.execute('SELECT token_hash FROM account_email_proofs').fetchone()[0])
        with self.assertRaises(ValueError):
            self.confirm(first)
        self.confirm(second)

    def test_five_failures_survive_resend_and_database_reopen(self):
        proof = self.issue()
        for offset in range(3):
            self.fail(proof, now=self.now+offset)
        replacement = self.issue(now=self.now+3)
        self.assertNotEqual(proof[2], replacement[2])
        self.db.close()
        self.db = sqlite3.connect(self.path)
        for offset in range(3, 5):
            self.fail(replacement, now=self.now+offset)
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_email_proofs').fetchone()[0], 0)
        self.assertIsNone(self.issue(now=self.now+5))
        with self.assertRaises(ValueError):
            self.confirm(replacement, now=self.now+5)
        self.assertIsNotNone(self.issue(now=self.now+TOKEN_SECONDS+1))

    def test_budget_uses_a_rolling_window(self):
        proof = self.issue()
        for offset in [0, 10, 20, 30, 40]:
            self.fail(proof, now=self.now+offset)
        self.assertIsNone(self.issue(now=self.now+899))
        replacement = self.issue(now=self.now+900)
        self.assertIsNotNone(replacement)
        self.fail(replacement, now=self.now+900)
        self.assertIsNone(self.issue(now=self.now+901))

    def test_invalid_format_counts_against_a_known_challenge(self):
        proof = self.issue()
        for code in ['1234567', '123456789', '１２３４５６７８', 'abcdefgh', '1234 567']:
            self.fail(proof, code)
        self.assertIsNone(self.issue())

    def test_unknown_challenge_cannot_exhaust_another_accounts_budget(self):
        proof = self.issue()
        for _ in range(6):
            with self.assertRaises(ValueError):
                confirm_email_proof(self.db, '12345678', 'verify', challenge_id='f'*64,
                                    account_id=self.account, now=self.now)
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_email_attempts').fetchone()[0], 0)
        self.confirm(proof)

    def test_expiry_purpose_and_account_binding(self):
        proof = self.issue()
        with self.assertRaises(ValueError):
            confirm_email_proof(self.db, proof[0], 'recover', challenge_id=proof[2], now=self.now)
        with self.assertRaises(ValueError):
            confirm_email_proof(self.db, proof[0], 'verify', challenge_id=proof[2], account_id=self.account+1, now=self.now)
        with self.assertRaises(ValueError):
            self.confirm(proof, now=self.now+TOKEN_SECONDS)

    def test_failed_mfa_uses_the_same_durable_recovery_budget(self):
        self.confirm(self.issue())
        proof = self.issue('recover')
        for _ in range(5):
            self.fail(proof, code=proof[0], purpose='recover', password='new password', mfa_code='wrong')
        self.assertIsNone(self.issue('recover'))
        with self.assertRaises(ValueError):
            self.confirm(proof, 'recover', password='new password', mfa_code=code_at(self.mfa,self.now))

    def test_concurrent_confirmation_consumes_once(self):
        proof = self.issue()
        def attempt(_):
            with sqlite3.connect(self.path, timeout=10) as db:
                try:
                    confirm_email_proof(db, proof[0], 'verify', challenge_id=proof[2], account_id=self.account, now=self.now)
                    return True
                except ValueError:
                    return False
        with ThreadPoolExecutor(max_workers=2) as executor:
            self.assertEqual(sorted(executor.map(attempt, range(2))), [False, True])

    def test_secret_is_private_and_missing_key_does_not_rotate_live_proofs(self):
        proof = self.issue()
        secret_path = self.path.parent/'account-email-secret.key'
        self.assertEqual(secret_path.stat().st_mode & 0o777, 0o600)
        original = secret_path.read_bytes()
        self.assertEqual(len(original), 32)
        secret_path.unlink()
        with self.assertRaises(OSError):
            self.issue()
        self.assertFalse(secret_path.exists())
        with self.assertRaises(OSError):
            self.confirm(proof)
        secret_path.write_bytes(original)
        secret_path.chmod(0o600)
        self.confirm(proof)

    def test_secret_permissions_and_symlinks_are_rejected(self):
        self.issue()
        secret_path = self.path.parent/'account-email-secret.key'
        secret_path.chmod(0o644)
        with self.assertRaises(OSError):
            email_proof_secret(self.db)
        secret_path.chmod(0o600)
        other = self.path.parent/'other.key'
        secret_path.rename(other)
        secret_path.symlink_to(other)
        with self.assertRaises(OSError):
            email_proof_secret(self.db)

    def test_disable_and_reenable_invalidates_old_proof(self):
        user = create_user(self.db,self.account,'fictional-reader','password')
        save_profile(self.db,user,{'firstName':'','lastName':'','displayName':'','email':'reader@example.test'})
        proof = self.issue(account=user)
        set_account_active(self.db,self.account,user,False)
        set_account_active(self.db,self.account,user,True)
        with self.assertRaises(ValueError):
            confirm_email_proof(self.db,proof[0],'verify',challenge_id=proof[2],account_id=user,now=self.now)

    def test_upgrade_invalidates_only_old_proofs_and_preserves_accounts(self):
        user_before = self.db.execute('SELECT * FROM accounts').fetchall()
        self.db.execute('DROP TABLE account_email_proofs')
        self.db.execute("CREATE TABLE account_email_proofs(token_hash TEXT PRIMARY KEY,account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,purpose TEXT NOT NULL,email TEXT NOT NULL,expires_at INTEGER NOT NULL,UNIQUE(account_id,purpose))")
        self.db.execute('INSERT INTO account_email_proofs VALUES(?,?,?,?,?)',('a'*64,self.account,'verify','fictional@example.test',self.now+900))
        self.db.execute('DROP TABLE account_email_attempts')
        self.db.execute('DELETE FROM schema_migrations WHERE version=10')
        self.db.commit()
        initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT * FROM accounts').fetchall(),user_before)
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_email_proofs').fetchone()[0],0)
        self.assertIsNotNone(self.issue())

    def test_clipboard_padding_is_trimmed_without_numeric_conversion(self):
        with patch('backend.account_email.secrets.randbelow', return_value=1234):
            proof = self.issue()
        self.assertEqual(confirm_email_proof(self.db, ' 00001234\n', 'verify', challenge_id=proof[2],
                                            account_id=self.account, now=self.now), self.account)

    def test_concurrent_failures_cannot_exceed_the_account_budget(self):
        proof = self.issue()
        def attempt(_):
            with sqlite3.connect(self.path,timeout=10) as db:
                try:
                    confirm_email_proof(db,'invalid!','verify',challenge_id=proof[2],account_id=self.account,now=self.now)
                except ValueError:
                    return False
                return True
        with ThreadPoolExecutor(max_workers=4) as executor:
            self.assertEqual(list(executor.map(attempt,range(8))),[False]*8)
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_email_attempts').fetchone()[0],5)
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_email_proofs').fetchone()[0],0)
        self.assertIsNone(self.issue())

    def test_failure_budget_isolated_by_account_and_purpose_and_not_normal_login(self):
        from backend.sessions import login_session
        proof = self.issue()
        for _ in range(5):
            self.fail(proof)
        self.assertIsNone(self.issue())
        reader = create_user(self.db,self.account,'independent-reader','password')
        save_profile(self.db,reader,{'firstName':'','lastName':'','displayName':'','email':'independent@example.test'})
        self.assertIsNotNone(self.issue(account=reader))
        self.db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?',(self.account,))
        self.db.commit()
        self.assertIsNotNone(self.issue('recover'))
        self.assertIsNotNone(login_session(self.db,'fictional-owner','password',mfa_code=code_at(self.mfa,self.now),now=self.now))
