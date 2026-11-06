"""Same-origin, re-authentication and non-disclosure checks for email recovery."""
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

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.account_email import MAIL_REQUESTS, REQUEST_MESSAGE
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.profiles import save_profile
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import login_session


class AccountEmailHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / 'test.sqlite3'
        with sqlite3.connect(self.path) as db:
            initialise_database(db)
            self.admin,self.secret=bootstrap_first_admin(db,'email-owner','password')
            confirm_admin_mfa(db,self.admin,code_at(self.secret,time.time()))
            self.token=login_session(db,'email-owner','password',mfa_code=code_at(self.secret,time.time()))
            save_profile(db,self.admin,{'firstName':'','lastName':'','displayName':'','email':'owner@example.org'})
        self.patches=[patch('backend.server.DB_PATH',self.path),patch('backend.server.PUBLIC_ORIGIN','https://inventory.example'),
                      patch('backend.server.queue_email'),patch('backend.server.notify_security_change')]
        self.mocks=[p.start() for p in self.patches]
        MAIL_REQUESTS._failures.clear()
        self.server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown();self.server.server_close();self.thread.join()
        for p in reversed(self.patches):p.stop()
        self.temp.cleanup()

    def post(self,path,payload,*,authenticated=False,origin='https://inventory.example'):
        headers={'Origin':origin,'Content-Type':'application/json'}
        if authenticated:
            headers.update({'Cookie':COOKIE_NAME+'='+self.token,'X-CSRF-Token':csrf_for_session(self.token)})
        conn=http.client.HTTPConnection('127.0.0.1',self.server.server_port)
        conn.request('POST',path,json.dumps(payload),headers)
        response=conn.getresponse();status=response.status;data=json.loads(response.read());conn.close()
        if isinstance(data, dict) and "challengeId" in data:
            self.assertRegex(data["challengeId"], r"^[0-9a-f]{64}$")
            self.challenge_id = data["challengeId"]
            # Compare neutral public shape/content, not independently random identifiers.
            data["challengeId"] = "opaque-challenge"
        return status,data

    def test_recovery_no_smtp_and_unknown_account_return_identical_generic_response(self):
        expected=self.post('/api/recovery/request',{'username':'email-owner'})
        self.assertEqual(expected,self.post('/api/recovery/request',{'username':'nonexistent'}))
        self.assertEqual(expected[0],200)
        self.assertFalse(self.mocks[2].called)
        self.assertEqual(self.post('/api/recovery/request',{'username':'email-owner'},origin='https://evil.example')[0],403)

    def test_verification_requires_session_password_and_own_single_use_proof(self):
        path='/api/account/email/request'
        self.assertEqual(self.post(path,{'password':'password'})[0],403)
        self.assertEqual(self.post(path,{'password':'wrong'},authenticated=True)[0],400)
        with patch('backend.server.smtp_public_settings',return_value={'configured':True}):
            self.assertEqual(self.post(path,{'password':'password'},authenticated=True)[0],200)
        body=self.mocks[2].call_args.args[3]
        token=body.split('\n\n')[1]
        challenge_id=self.challenge_id
        self.assertRegex(token,r"^[0-9]{8}$")
        self.assertEqual(self.post('/api/account/email/confirm',{'token':token,'password':'password','challengeId':challenge_id},authenticated=True)[0],200)
        self.assertEqual(self.post('/api/account/email/confirm',{'token':token,'password':'password','challengeId':challenge_id},authenticated=True)[0],400)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT email_verified FROM account_profiles').fetchone()[0],1)

    def test_recovery_eligibility_and_queue_failures_keep_the_same_public_response(self):
        cases = [
            ("verified", 1, 1, True, "email-owner", True),
            ("unverified", 1, 0, True, "email-owner", False),
            ("disabled", 0, 1, True, "email-owner", False),
            ("unknown", 1, 1, True, "fictional-unknown", False),
            ("no SMTP", 1, 1, False, "email-owner", False),
            ("email is not a username lookup", 1, 1, True, "owner@example.org", False),
        ]
        for label, active, verified, configured, username, queued in cases:
            with self.subTest(label=label):
                MAIL_REQUESTS._failures.clear()
                with sqlite3.connect(self.path) as db:
                    db.execute("UPDATE accounts SET active=? WHERE id=?", (active, self.admin))
                    db.execute("UPDATE account_profiles SET email_verified=? WHERE account_id=?", (verified, self.admin))
                self.mocks[2].reset_mock()
                with patch('backend.server.smtp_public_settings', return_value={'configured': configured}):
                    response = self.post('/api/recovery/request', {'username': username})
                self.assertEqual(response, (200, {'message': REQUEST_MESSAGE, 'challengeId': 'opaque-challenge'}))
                self.assertEqual(self.mocks[2].called, queued)
        self.mocks[2].return_value = False
        with patch('backend.server.smtp_public_settings', return_value={'configured': True}):
            self.assertEqual(self.post('/api/recovery/request', {'username': 'email-owner'}),
                             (200, {'message': REQUEST_MESSAGE, 'challengeId': 'opaque-challenge'}))
        self.mocks[2].reset_mock()
        with patch.object(MAIL_REQUESTS, 'allowed', return_value=False):
            self.assertEqual(self.post('/api/recovery/request', {'username': 'email-owner'}),
                             (200, {'message': REQUEST_MESSAGE, 'challengeId': 'opaque-challenge'}))
        self.assertFalse(self.mocks[2].called)

    def test_recovery_does_not_accept_an_email_payload(self):
        self.assertEqual(self.post('/api/recovery/request', {'email': 'owner@example.org'})[0], 400)
        self.assertFalse(self.mocks[2].called)
