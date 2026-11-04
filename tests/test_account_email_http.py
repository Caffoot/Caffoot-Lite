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
from backend.account_email import MAIL_REQUESTS
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
        self.assertEqual(len(token),64)
        self.assertEqual(self.post('/api/account/email/confirm',{'token':token,'password':'password'},authenticated=True)[0],200)
        self.assertEqual(self.post('/api/account/email/confirm',{'token':token,'password':'password'},authenticated=True)[0],400)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT email_verified FROM account_profiles').fetchone()[0],1)
