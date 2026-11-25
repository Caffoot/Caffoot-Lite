"""Stage 6.6 password reset and pre-session change through the real HTTP handler."""
import http.client
import json
import sqlite3
import tempfile
import threading
import time
import unittest
from http.cookies import SimpleCookie
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from backend import schema
from backend.account_email import issue_email_proof
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa, hash_password, verify_password
from backend.audit_events import record_actor_event
from backend.http_security import COOKIE_NAME
from backend.login_throttle import LoginThrottle
from backend.mfa import code_at, new_secret
from backend.permissions import create_user, set_account_active
from backend.request_auth import authorised_mutation, csrf_for_session
from backend.roles import confirm_role_change, preview_role_change
from backend.server import Handler
from backend.sessions import complete_password_change, login_session, _digest

ORIGIN = 'https://caffoot.example'
ORIGINAL = 'Fictional-Original-Password!'
TEMPORARY = 'Fictional-Temporary-Password!'
NEW = 'Fictional-New-Password!'


class PasswordResetHttpTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.path = Path(directory.name) / 'accounts.sqlite3'
        with self.database() as db:
            schema.initialise_database(db)
            self.owner, self.owner_secret = bootstrap_first_admin(db, 'owner', ORIGINAL)
            confirm_admin_mfa(db, self.owner, code_at(self.owner_secret, time.time()))
            self.target = create_user(db, self.owner, 'worker', ORIGINAL,
                                      {'firstName': 'Jamie', 'lastName': 'Taylor', 'displayName': '', 'email': 'jamie@example.invalid'})
            self.owner_token = login_session(db, 'owner', ORIGINAL, mfa_code=code_at(self.owner_secret, time.time()))
            self.target_token = login_session(db, 'worker', ORIGINAL)
        throttle = LoginThrottle()
        for path, value in [('server.DB_PATH', self.path), ('server.PUBLIC_ORIGIN', ORIGIN),
                            ('server.THROTTLE', throttle), ('request_auth.THROTTLE', throttle),
                            ('server.MAIL_REQUESTS', LoginThrottle())]:
            replacement = patch('backend.' + path, value)
            replacement.start()
            self.addCleanup(replacement.stop)
        self.notice = self.enterContext(patch('backend.server.notify_security_change'))
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.thread.join)
        self.addCleanup(self.server.shutdown)

    def database(self):
        db = sqlite3.connect(self.path)
        db.execute('PRAGMA foreign_keys=ON')
        return db

    def request(self, path, payload=None, *, token=None, headers=None):
        request_headers = {'Origin': ORIGIN, 'Content-Type': 'application/json'}
        if token:
            request_headers.update(Cookie=f'{COOKIE_NAME}={token}', **{'X-CSRF-Token': csrf_for_session(token)})
        request_headers.update(headers or {})
        connection = http.client.HTTPConnection('127.0.0.1', self.server.server_port, timeout=8)
        try:
            connection.request('GET' if payload is None else 'POST', path,
                               body=None if payload is None else json.dumps(payload), headers=request_headers)
            response = connection.getresponse()
            raw = response.read()
            body = json.loads(raw) if raw else None
            return response.status, body, response.getheader('Set-Cookie')
        finally:
            connection.close()

    def reset(self, password=TEMPORARY, *, target=None, token=None, confirmation=None, headers=None):
        return self.request('/api/users/reset-password', {
            'userId': self.target if target is None else target, 'password': password,
            'confirmation': password if confirmation is None else confirmation,
        }, token=self.owner_token if token is None else token, headers=headers)

    def sign_in(self, password=TEMPORARY, **credentials):
        return self.request('/api/login', {'username': 'worker', 'password': password, **credentials})

    def change(self, proof, password=NEW, confirmation=None, **request_options):
        return self.request('/api/login/change-password', {
            'proof': proof, 'password': password, 'confirmation': password if confirmation is None else confirmation,
        }, **request_options)

    def pending_proof(self, password=TEMPORARY, **credentials):
        status, body, cookie = self.sign_in(password, **credentials)
        self.assertEqual((status, cookie), (200, None))
        self.assertEqual(body['status'], 'password change required')
        return body['proof']

    def test_assisted_reset_requires_session_csrf_origin_and_non_admin_target(self):
        with self.database() as db:
            editor = create_user(db, self.owner, 'directory-editor', ORIGINAL)
            another_admin = create_user(db, self.owner, 'another-admin', ORIGINAL)
            secret = new_secret()
            db.execute('UPDATE accounts SET mfa_confirmed=1,mfa_secret=? WHERE id IN (?,?)',
                       (secret, editor, another_admin))
            db.execute('UPDATE accounts SET is_admin=1 WHERE id=?', (another_admin,))
            db.execute("INSERT INTO account_permission_overrides VALUES(?,'Staff Members','edit')", (editor,))
            db.commit()
            editor_token = login_session(db, 'directory-editor', ORIGINAL, mfa_code=code_at(secret, time.time()))
        for options in ({'token': ''}, {'token': editor_token}, {'target': self.owner}, {'target': another_admin},
                        {'headers': {'Origin': 'https://other.example'}}, {'headers': {'X-CSRF-Token': ''}}):
            with self.subTest(options=options):
                self.assertEqual(self.reset(**options)[:2], (403, {'error': 'forbidden'}))
        self.assertEqual(self.reset(confirmation='Different')[0], 400)
        self.assertEqual(self.sign_in(ORIGINAL)[0], 200)

    def test_reset_is_atomic_and_preserves_noncredential_data(self):
        with self.database() as db:
            db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?', (self.target,))
            db.commit()
            old_profile = db.execute('SELECT * FROM account_profiles WHERE account_id=?', (self.target,)).fetchone()
            old_staff = db.execute('SELECT * FROM staff_members WHERE account_id=?', (self.target,)).fetchone()
            old_roles = db.execute('SELECT * FROM account_roles WHERE account_id=?', (self.target,)).fetchall()
            recovery = issue_email_proof(db, self.target, 'recover')
            verification = issue_email_proof(db, self.target, 'verify')
        self.assertEqual(self.reset(), (200, {'status': 'password reset', 'active': True}, None))
        self.assertEqual(self.request('/api/session', token=self.target_token)[0], 401)
        self.assertEqual(self.request('/api/session', token=self.owner_token)[0], 200)
        self.assertEqual(self.sign_in(ORIGINAL)[0], 401)
        with self.database() as db:
            self.assertEqual(db.execute('SELECT * FROM account_profiles WHERE account_id=?', (self.target,)).fetchone(), old_profile)
            self.assertEqual(db.execute('SELECT * FROM staff_members WHERE account_id=?', (self.target,)).fetchone(), old_staff)
            self.assertEqual(db.execute('SELECT * FROM account_roles WHERE account_id=?', (self.target,)).fetchall(), old_roles)
            self.assertEqual(db.execute('SELECT count(*) FROM account_email_proofs WHERE account_id=?', (self.target,)).fetchone(), (0,))
            saved_hash, pending = db.execute('SELECT password_hash,must_change_password FROM accounts WHERE id=?', (self.target,)).fetchone()
            self.assertTrue(verify_password(TEMPORARY, saved_hash))
            self.assertEqual(pending, 1)
            audit = db.execute('SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1').fetchone()[0]
        event = json.loads(audit)
        self.assertEqual((event['actorId'], event['reason']), (self.owner, 'Administrator reset a password'))
        self.assertEqual((event['changes'][0]['label'], event['changes'][0]['after']['Account ID']), ('worker', self.target))
        for secret in (TEMPORARY, ORIGINAL, saved_hash, recovery[0], verification[0], self.target_token):
            self.assertNotIn(secret, audit)

    def test_audit_failure_rolls_back_password_sessions_and_proofs(self):
        with self.database() as db:
            db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?', (self.target,))
            db.commit()
            issue_email_proof(db, self.target, 'recover')
            before = list(db.iterdump())
        with patch('backend.permissions.record_actor_event', side_effect=ValueError('Audit unavailable')):
            self.assertEqual(self.reset()[0], 400)
        with self.database() as db:
            self.assertEqual(list(db.iterdump()), before)

    def test_ordinary_account_must_change_with_single_use_proof_then_sign_in(self):
        self.assertEqual(self.reset()[0], 200)
        proof = self.pending_proof()
        self.assertEqual(self.request('/api/session', token=proof)[0], 401)
        self.assertEqual(self.request('/api/my-equipment', token=proof)[0], 401)
        self.assertEqual(self.request('/account', token=proof)[0], 303)
        self.assertEqual(self.change(proof, headers={'Origin': 'https://other.example'})[0], 403)
        self.assertEqual(self.change(proof, confirmation='Other')[1], {'error': 'The passwords do not match.'})
        self.assertEqual(self.change(proof, TEMPORARY)[1], {'error': 'Choose a password different from your temporary password.'})
        self.assertEqual(self.change(proof), (200, {'status': 'password changed'}, None))
        self.assertEqual(self.change(proof)[0], 401)
        self.assertEqual(self.request('/api/session', token=proof)[0], 401)
        self.assertEqual(self.sign_in()[0], 401)
        status, body, raw_cookie = self.sign_in(NEW)
        self.assertEqual((status, body), (200, {'status': 'signed in'}))
        token = SimpleCookie(raw_cookie)[COOKIE_NAME].value
        self.assertEqual(self.request('/api/session', token=token)[1]['username'], 'worker')

    def test_current_mfa_and_enrolment_are_required_before_receiving_proof(self):
        with self.database() as db:
            role = db.execute("SELECT id FROM roles WHERE role_key='it_staff'").fetchone()[0]
            db.execute('INSERT INTO account_roles VALUES(?,?)', (self.target, role))
        self.assertEqual(self.reset()[0], 200)
        credentials = {'username': 'worker', 'password': TEMPORARY}
        self.assertEqual(self.sign_in(), (200, {'status': 'mfa enrolment required'}, None))
        started = self.request('/api/login/mfa/start', credentials)
        secret = started[1]['mfaSecret']
        code = code_at(secret, time.time())
        self.assertEqual(self.request('/api/login/mfa/confirm', {**credentials, 'mfa_code': code}),
                         (200, {'status': 'mfa enrolled'}, None))
        self.assertEqual(self.sign_in()[1]['code'], 'mfa_required')
        self.assertEqual(self.sign_in(mfa_code='bad')[1], {'error': 'invalid credentials'})
        self.assertEqual(self.change(self.pending_proof(mfa_code=code))[0], 200)
        self.assertEqual(self.sign_in(NEW)[1]['code'], 'mfa_required')
        self.assertEqual(self.sign_in(NEW, mfa_code=code)[0], 200)
        with self.database() as db:
            self.assertEqual(db.execute('SELECT mfa_secret,mfa_confirmed,must_change_password FROM accounts WHERE id=?',
                                        (self.target,)).fetchone(), (secret, 1, 0))
            self.assertIsNotNone(db.execute('SELECT 1 FROM account_roles WHERE account_id=? AND role_id=?', (self.target, role)).fetchone())

    def test_disabled_account_and_stale_proofs_remain_restricted(self):
        with self.database() as db:
            set_account_active(db, self.owner, self.target, False)
        self.assertEqual(self.reset()[1], {'status': 'password reset', 'active': False})
        self.assertEqual(self.sign_in(), (401, {'error': 'invalid credentials'}, None))
        with self.database() as db:
            set_account_active(db, self.owner, self.target, True)
        old_proof = self.pending_proof()
        with self.database() as db:
            set_account_active(db, self.owner, self.target, False)
            set_account_active(db, self.owner, self.target, True)
        self.assertEqual(self.change(old_proof)[0], 401)
        old_proof = self.pending_proof()
        another_temp = 'Fictional-Replacement-Temporary!'
        self.assertEqual(self.reset(another_temp)[0], 200)
        self.assertEqual(self.change(old_proof)[0], 401)
        self.assertEqual(self.sign_in()[0], 401)
        proof = self.pending_proof(another_temp)
        with self.database() as db:
            action = {'type': 'override.set', 'userId': self.target, 'section': 'Devices', 'level': 'read'}
            preview = preview_role_change(db, self.owner, self.owner_token, action)
            confirm_role_change(db, self.owner, self.owner_token, action, preview['proof'])
        self.assertEqual(self.change(proof)[0], 401)
        self.assertEqual(self.sign_in(another_temp), (200, {'status': 'mfa enrolment required'}, None))

    def test_completion_rechecks_current_state_after_waiting_for_writer(self):
        self.assertEqual(self.reset()[0], 200)
        proof = self.pending_proof()
        entered, result = threading.Event(), []
        def completing(*args, **kwargs):
            entered.set()
            return complete_password_change(*args, **kwargs)
        with self.database() as db, patch('backend.server.complete_password_change', side_effect=completing):
            db.execute('BEGIN IMMEDIATE')
            request = threading.Thread(target=lambda: result.append(self.change(proof)), daemon=True)
            request.start()
            self.assertTrue(entered.wait(3))
            db.execute("INSERT INTO account_permission_overrides VALUES(?,'Devices','read')", (self.target,))
            db.commit()
            request.join(5)
        self.assertEqual([item[0] for item in result], [401])
        with self.database() as db:
            self.assertEqual(db.execute('SELECT must_change_password FROM accounts WHERE id=?', (self.target,)).fetchone(), (1,))

    def test_concurrent_reset_supersedes_a_waiting_password_change(self):
        self.assertEqual(self.reset()[0], 200)
        proof = self.pending_proof()
        reset_writing, change_waiting, allow_commit = threading.Event(), threading.Event(), threading.Event()
        results = {}

        def hold_reset(*args, **kwargs):
            record_actor_event(*args, **kwargs)
            reset_writing.set()
            self.assertTrue(allow_commit.wait(5))

        def start_change(*args, **kwargs):
            change_waiting.set()
            return complete_password_change(*args, **kwargs)

        with patch('backend.permissions.record_actor_event', side_effect=hold_reset), \
                patch('backend.server.complete_password_change', side_effect=start_change):
            reset = threading.Thread(target=lambda: results.update(reset=self.reset('Replacement-Temporary!')), daemon=True)
            change = threading.Thread(target=lambda: results.update(change=self.change(proof)), daemon=True)
            reset.start()
            try:
                self.assertTrue(reset_writing.wait(3))
                change.start()
                self.assertTrue(change_waiting.wait(3))
            finally:
                allow_commit.set()
            reset.join(5)
            change.join(5)
        self.assertEqual((results['reset'][0], results['change'][0]), (200, 401))
        self.assertEqual(self.sign_in(NEW)[0], 401)
        self.assertTrue(self.pending_proof('Replacement-Temporary!'))

    def test_reset_rechecks_actor_session_after_initial_http_authorisation(self):
        def authenticate_then_revoke(*args, **kwargs):
            actor = authorised_mutation(*args, **kwargs)
            with self.database() as db:
                db.execute('DELETE FROM account_sessions WHERE token_hash=?', (_digest(self.owner_token),))
            return actor
        with patch('backend.server.authorised_mutation', side_effect=authenticate_then_revoke):
            self.assertEqual(self.reset()[0], 403)
        self.assertEqual(self.sign_in(ORIGINAL)[0], 200)

    def test_verified_email_recovery_clears_pending_change_with_mfa_and_new_password(self):
        secret = new_secret()
        with self.database() as db:
            db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?', (self.target,))
            db.execute('UPDATE accounts SET mfa_confirmed=1,mfa_secret=? WHERE id=?', (secret, self.target))
        self.assertEqual(self.reset()[0], 200)
        code = code_at(secret, time.time())
        proof = self.pending_proof(mfa_code=code)
        with self.database() as db:
            token, _, challenge_id = issue_email_proof(db, self.target, 'recover')
        recover = {'token': token, 'challengeId': challenge_id}
        self.assertEqual(self.request('/api/recovery/confirm', {**recover, 'password': NEW, 'mfa_code': ''})[0], 400)
        self.assertEqual(self.request('/api/recovery/confirm', {**recover, 'password': TEMPORARY, 'mfa_code': code})[1],
                         {'error': 'Choose a password different from your temporary password.'})
        response = self.request('/api/recovery/confirm', {**recover, 'password': NEW, 'mfa_code': code})
        self.assertEqual((response[0], response[2]), (200, None))
        self.notice.assert_called_once()
        self.assertEqual(self.change(proof)[0], 401)
        self.assertEqual(self.sign_in(NEW, mfa_code=code)[0], 200)

    def test_promotion_is_blocked_while_password_change_is_pending(self):
        secret = new_secret()
        with self.database() as db:
            db.execute('UPDATE accounts SET mfa_confirmed=1,mfa_secret=? WHERE id=?', (secret, self.target))
            db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?', (self.target,))
        self.assertEqual(self.reset()[0], 200)
        response = self.request('/api/users/admin', {'userId': self.target, 'isAdmin': True}, token=self.owner_token)
        self.assertEqual(response[:2], (400, {'error': 'The user must change their temporary password before becoming an administrator.'}))

    def test_promotion_requires_current_verified_email_and_mfa(self):
        secret = new_secret()
        action = {'userId': self.target, 'isAdmin': True}
        def promote():
            return self.request('/api/users/admin', action, token=self.owner_token)
        with self.database() as db:
            db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?', (self.target,))
        self.assertIn('MFA enrolment required', promote()[1]['error'])
        with self.database() as db:
            db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?', (secret, self.target))
            db.execute("UPDATE account_profiles SET email='',email_verified=0 WHERE account_id=?", (self.target,))
        self.assertIn('verify their email address', promote()[1]['error'])
        with self.database() as db:
            db.execute("UPDATE account_profiles SET email='jamie@example.invalid' WHERE account_id=?", (self.target,))
        self.assertIn('verify their email address', promote()[1]['error'])

        status, _, cookie = self.sign_in(ORIGINAL, mfa_code=code_at(secret, time.time()))
        self.assertEqual(status, 200)
        user_token = SimpleCookie(cookie)[COOKIE_NAME].value
        with self.database() as db:
            code, _, challenge_id = issue_email_proof(db, self.target, 'verify')
        verified = self.request('/api/account/email/confirm', {'password': ORIGINAL, 'token': code, 'challengeId': challenge_id},
                                token=user_token)
        self.assertEqual(verified[:2], (200, {'status': 'Email verified'}))
        self.assertEqual(promote()[:2], (200, {'status': 'updated'}))
        self.assertEqual(self.request('/api/session', token=user_token)[0], 401)

        _, _, cookie = self.sign_in(ORIGINAL, mfa_code=code_at(secret, time.time()))
        user_token = SimpleCookie(cookie)[COOKIE_NAME].value
        profile = self.request('/api/account/profile', token=user_token)[1]
        changed = {key: profile[key] for key in ('firstName', 'lastName', 'displayName', 'email', 'revision')}
        changed['email'] = 'updated@example.invalid'
        self.assertEqual(self.request('/api/account/profile', changed, token=user_token)[0], 200)
        self.assertFalse(self.request('/api/account/profile', token=user_token)[1]['emailVerified'])
        self.assertTrue(self.request('/api/session', token=user_token)[1]['is_admin'])
        self.assertEqual(self.request('/api/users', token=user_token)[0], 200)
        self.assertEqual(self.request('/api/users', token=self.owner_token)[0], 200)

    def test_promotion_checks_email_inside_the_transaction(self):
        with self.database() as db:
            db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?', (new_secret(), self.target))
            db.execute('UPDATE account_profiles SET email_verified=1 WHERE account_id=?', (self.target,))
        def authenticate_then_unverify(*args, **kwargs):
            actor = authorised_mutation(*args, **kwargs)
            with self.database() as db:
                db.execute('UPDATE account_profiles SET email_verified=0 WHERE account_id=?', (self.target,))
            return actor
        with patch('backend.server.authorised_mutation', side_effect=authenticate_then_unverify):
            response = self.request('/api/users/admin', {'userId': self.target, 'isAdmin': True}, token=self.owner_token)
        self.assertEqual(response[0], 400)
        self.assertIn('verify their email address', response[1]['error'])


class PasswordChangeMigrationTests(unittest.TestCase):
    def test_published_schema_10_upgrades_to_30_with_existing_administrator_access(self):
        with sqlite3.connect(':memory:') as db:
            db.execute('PRAGMA foreign_keys=ON')
            db.executescript((Path(__file__).parent / 'fixtures/schema-v10.sql').read_text())
            secret = new_secret()
            owner = db.execute(
                'INSERT INTO accounts(username,password_hash,is_admin,mfa_confirmed,mfa_secret) VALUES(?,?,1,1,?)',
                ('owner', hash_password(ORIGINAL), secret),
            ).lastrowid
            worker = db.execute('INSERT INTO accounts(username,password_hash) VALUES(?,?)',
                                ('worker', hash_password(ORIGINAL))).lastrowid
            db.commit()
            schema.initialise_database(db)
            self.assertEqual(db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (30,))
            self.assertEqual(db.execute('SELECT id,is_admin,must_change_password FROM accounts ORDER BY id').fetchall(),
                             [(owner, 1, 0), (worker, 0, 0)])
            self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(), [])
            self.assertTrue(login_session(db, 'owner', ORIGINAL, mfa_code=code_at(secret, time.time())))
            self.assertTrue(login_session(db, 'worker', ORIGINAL))

    def test_schema_29_upgrade_keeps_existing_accounts_profiles_and_sessions(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'schema29.sqlite3'
            with sqlite3.connect(path) as db, patch.object(schema, 'SCHEMA_VERSION', 29):
                db.execute('PRAGMA foreign_keys=ON')
                schema.initialise_database(db)
                owner, secret = bootstrap_first_admin(db, 'owner', ORIGINAL)
                confirm_admin_mfa(db, owner, code_at(secret, time.time()))
                worker = create_user(db, owner, 'worker', ORIGINAL, {'firstName': '', 'lastName': '', 'displayName': '', 'email': 'worker@example.invalid'})
                db.execute('INSERT INTO account_sessions VALUES(?,?,?,?)', (_digest('a' * 64), owner, 9999999999, 1))
                old_accounts = db.execute('SELECT * FROM accounts ORDER BY id').fetchall()
                old_profiles = db.execute('SELECT * FROM account_profiles ORDER BY account_id').fetchall()
            with sqlite3.connect(path) as db:
                db.execute('PRAGMA foreign_keys=ON')
                schema.initialise_database(db)
                schema.initialise_database(db)
                self.assertEqual(db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (30,))
                self.assertEqual(db.execute('SELECT * FROM accounts ORDER BY id').fetchall(), [(*row, 0) for row in old_accounts])
                self.assertEqual(db.execute('SELECT * FROM account_profiles ORDER BY account_id').fetchall(), old_profiles)
                self.assertEqual(db.execute('SELECT account_id FROM account_sessions WHERE token_hash=?', (_digest('a' * 64),)).fetchone(), (owner,))
                self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(), [])
                self.assertTrue(login_session(db, 'owner', ORIGINAL, mfa_code=code_at(secret, time.time())))
                self.assertTrue(login_session(db, 'worker', ORIGINAL))
                self.assertEqual(db.execute('SELECT must_change_password FROM accounts WHERE id=?', (worker,)).fetchone(), (0,))
