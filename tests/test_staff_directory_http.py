"""Real directory HTTP requests enforce sessions, CSRF, privacy and section rights."""
import http.client
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch

from backend.http_security import COOKIE_NAME
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import _digest

ORIGIN = 'https://caffoot.example'


class StaffDirectoryHttpTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'http.sqlite3'
        self.tokens = {n: str(n) * 64 for n in range(1, 7)}
        with sqlite3.connect(self.path) as db:
            db.execute('PRAGMA foreign_keys=ON')
            initialise_database(db)
            for actor in range(1, 7):
                db.execute('INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret) VALUES(?,?,?,?,?,?)',
                           (actor, 'account-' + str(actor), 'private-hash', int(actor == 1), int(actor != 6), 'PRIVATE-MFA-SECRET'))
                db.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(self.tokens[actor]), actor))
            for actor, section, level in ((2, 'Staff Members', 'edit'), (2, 'Departments', 'edit'),
                    (3, 'Staff Members', 'read'), (5, 'Departments', 'edit'), (6, 'Staff Members', 'edit')):
                db.execute('INSERT INTO account_permission_overrides VALUES(?,?,?)', (actor, section, level))
            db.execute("INSERT INTO staff_members(id,first_name,last_name,account_id) VALUES('person','Alex','Example',4)")
            db.execute("INSERT INTO departments(id,name) VALUES('dept','Production')")
        for target, value in (('backend.server.DB_PATH', self.path), ('backend.server.PUBLIC_ORIGIN', ORIGIN)):
            setting = patch(target, value)
            setting.start()
            self.addCleanup(setting.stop)
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.close_server)

    def close_server(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def request(self, path='/api/staff-members', *, method='GET', actor=1, payload=None, headers=None, raw=None):
        request_headers = {'Origin': ORIGIN}
        if actor:
            request_headers['Cookie'] = COOKIE_NAME + '=' + self.tokens[actor]
        if method == 'POST':
            request_headers['Content-Type'] = 'application/json'
            if actor:
                request_headers['X-CSRF-Token'] = csrf_for_session(self.tokens[actor])
        request_headers.update(headers or {})
        body = raw if raw is not None else (json.dumps(payload).encode() if method == 'POST' else None)
        client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        client.request(method, path, body=body, headers=request_headers)
        response = client.getresponse()
        result = (response.status, json.loads(response.read()), response.getheader('Cache-Control'))
        client.close()
        return result

    def test_sessions_section_rights_mfa_and_non_enumerating_denial(self):
        for actor, expected in ((None, 401), (4, 403), (5, 403), (6, 401), (3, 200)):
            self.assertEqual(self.request(actor=actor)[0], expected)
        for identifier in ('person', 'missing'):
            self.assertEqual(self.request('/api/staff-members/' + identifier, actor=4)[0], 403)
        self.assertEqual(self.request('/api/staff-members/missing', actor=3)[0], 404)
        self.assertEqual(self.request('/api/departments', actor=3)[0], 403)
        self.assertEqual(self.request('/api/departments', actor=5)[0], 200)
        self.assertEqual(self.request(method='POST', actor=3, payload=dict(firstName='A', lastName='B'))[0], 403)
        with sqlite3.connect(self.path) as db:
            db.execute('DELETE FROM account_sessions WHERE account_id=3')
        self.assertEqual(self.request(actor=3)[0], 401)

    def test_staff_responses_hide_link_identity_and_all_security_fields(self):
        status, response, cache = self.request('/api/staff-members/person', actor=3)
        self.assertEqual(status, 200)
        self.assertEqual(cache, 'no-store')
        self.assertNotIn('accountId', response['staffMember'])
        text = json.dumps(response)
        for secret in ('account-4', 'private-hash', 'PRIVATE-MFA-SECRET', 'roles', 'username', 'mfa'):
            self.assertNotIn(secret, text)
        self.assertEqual(self.request('/api/staff-members/person')[1]['staffMember']['accountId'], 4)

    def test_origin_csrf_json_and_duplicate_key_guards(self):
        cases = (
            ({'Origin': 'https://other.example'}, b'{}', 403),
            ({'Origin': ''}, b'{}', 403),
            ({'X-CSRF-Token': 'bad'}, b'{}', 403),
            ({'Sec-Fetch-Site': 'cross-site'}, b'{}', 403),
            ({'Content-Type': 'text/plain'}, b'{}', 415),
            ({}, b'{', 400), ({}, b'[]', 400), ({}, b'\xff', 400),
            ({}, b'{"firstName":"A","firstName":"B","lastName":"C"}', 400),
            ({}, b'x' * 4097, 400),
        )
        for headers, raw, expected in cases:
            with self.subTest(headers=headers, raw=raw[:20]):
                self.assertEqual(self.request(method='POST', headers=headers, raw=raw)[0], expected)
        self.assertEqual(self.request(headers={'Origin': 'https://other.example'})[0], 403)
        self.assertEqual(self.request(headers={'Sec-Fetch-Site': 'cross-site'})[0], 403)
        self.assertEqual(self.request(method='POST', actor=None, payload={})[0], 403)

    def test_staff_create_update_and_search_http(self):
        status, result, _ = self.request(method='POST', actor=2,
            payload=dict(firstName='Sam', lastName='Person', departmentId='dept'))
        self.assertEqual(status, 200, result)
        staff = result['staffMember']
        self.assertNotIn('accountId', staff)
        for active in (False, True):
            response = self.request('/api/staff-members/' + staff['id'], method='POST', actor=2, payload={'active': active})
            self.assertEqual(response[1]['staffMember']['active'], active)
        self.assertEqual(len(self.request('/api/staff-members?query=Sam&limit=1&offset=0', actor=3)[1]['staffMembers']), 1)
        for query in ('limit=101', 'limit=bad', 'offset=-1', 'query=a&query=b', 'accountId=1'):
            self.assertEqual(self.request('/api/staff-members?' + query)[0], 400)
        self.assertEqual(self.request('/api/staff-members/person/delete', method='POST', payload={})[0], 404)

    def test_combined_login_admin_only_and_safe_conflict(self):
        payload = dict(firstName='Sam', lastName='Person', login=dict(username='new', password='test-password'))
        self.assertEqual(self.request(method='POST', actor=2, payload=payload)[0], 403)
        status, response, _ = self.request(method='POST', payload=payload)
        self.assertEqual(status, 200, response)
        staff = response['staffMember']
        self.assertTrue(staff['accountId'])
        status, response, _ = self.request(method='POST', payload=payload)
        self.assertEqual(status, 409)
        self.assertEqual(response, {'error': 'Directory record conflict'})
        status, response, _ = self.request('/api/staff-members/person/login', method='POST', actor=2, payload=payload['login'])
        self.assertEqual(status, 403)
        self.assertEqual(self.request('/api/staff-members/person/login', method='POST', payload=payload['login'])[0], 409)
        unlinked = self.request(method='POST', payload=dict(firstName='A', lastName='B'))[1]['staffMember']
        status, response, _ = self.request('/api/staff-members/' + unlinked['id'] + '/login', method='POST', payload=dict(username='existing-person-login', password='test-password'))
        self.assertEqual(status, 200, response)
        self.assertEqual(response['staffMember']['id'], unlinked['id'])

    def test_department_http_archive_reactivate_history_and_delete(self):
        status, response, _ = self.request('/api/departments', method='POST', actor=5, payload={'name': 'Empty'})
        self.assertEqual(status, 200)
        identifier = response['department']['id']
        self.assertEqual(self.request('/api/departments/' + identifier + '/delete', method='POST', actor=5, payload={})[0], 200)
        self.assertEqual(self.request('/api/departments/' + identifier)[0], 404)
        self.assertEqual(self.request('/api/departments/dept', method='POST', actor=5, payload={'archived': True})[0], 200)
        self.assertEqual(self.request(method='POST', actor=2, payload=dict(firstName='A', lastName='B', departmentId='dept'))[0], 409)
        self.assertEqual(self.request('/api/departments/dept', method='POST', actor=5, payload={'archived': False})[0], 200)
        self.request('/api/staff-members/person', method='POST', actor=2, payload={'departmentId': 'dept'})
        self.request('/api/staff-members/person', method='POST', actor=2, payload={'departmentId': None})
        self.assertEqual(self.request('/api/departments/dept/delete', method='POST', actor=5, payload={})[0], 409)
