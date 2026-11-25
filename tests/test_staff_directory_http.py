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
from urllib.parse import urlencode

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

    def test_linked_conflicts_require_admin_selection_and_protect_email_proofs(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE accounts SET username='person_%!login' WHERE id=4")
            db.execute("UPDATE staff_members SET email='staff@example.test' WHERE id='person'")
            db.execute("INSERT INTO account_profiles(account_id,first_name,last_name,email,email_verified) VALUES(4,'Alexa','Example','saved@example.test',1)")
            db.execute("INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at) VALUES('existing-proof',4,'recover','saved@example.test',9999999999)")

        url = '/api/staff-members/person'
        admin = self.request(url)[1]['staffMember']
        self.assertEqual(admin['username'], 'person_%!login')
        self.assertEqual(admin['profileConflicts'], {
            'firstName': {'staff': 'Alex', 'account': 'Alexa'},
            'email': {'staff': 'staff@example.test', 'account': 'saved@example.test'},
        })
        for actor in (2, 3):
            private = self.request(url, actor=actor)[1]['staffMember']
            self.assertTrue({'username', 'accountId', 'profileConflicts'}.isdisjoint(private))
            self.assertEqual(self.request('/api/staff-members?query=person_%25%21', actor=actor)[1]['staffMembers'], [])
        self.assertEqual(len(self.request('/api/staff-members?query=person_%25%21')[1]['staffMembers']), 1)
        self.assertEqual(self.request('/api/staff-members?query=_%25%21no')[1]['staffMembers'], [])
        for change in ({'email': 'new@example.test'}, {'resolveProfile': {'email': 'staff'}}):
            self.assertEqual(self.request(url, method='POST', actor=2,
                payload=dict(change, revision=admin['revision']))[0], 403)

        profile_path = '/api/account/profile'
        profile = self.request(profile_path, actor=4)[1]
        values = {field: profile[field] for field in ('firstName', 'lastName', 'email', 'displayName', 'revision')}
        status, error, _ = self.request(profile_path, method='POST', actor=4, payload=dict(values, firstName='Changed'))
        self.assertEqual(status, 400)
        self.assertIn('Contact a Caffoot Lite administrator', error['error'])
        self.assertEqual(self.request(profile_path, method='POST', actor=4, payload=dict(values, displayName='Alex'))[0], 200)
        updated = self.request(url, method='POST', actor=2, payload={'revision': admin['revision'], 'location': 'Workshop'})
        self.assertEqual(updated[0], 200)
        self.assertEqual(self.request(url)[1]['staffMember']['profileConflicts'], admin['profileConflicts'])

        for choice, expected_email, verified in (('account', 'saved@example.test', 1), ('staff', 'staff@example.test', 0)):
            with self.subTest(choice=choice):
                if choice == 'staff':
                    with sqlite3.connect(self.path) as db:
                        db.execute("UPDATE staff_members SET email='staff@example.test' WHERE id='person'")
                current = self.request(url)[1]['staffMember']
                stale = self.request(url, method='POST', payload={'revision': admin['revision'], 'resolveProfile': {'email': choice}})
                self.assertEqual((stale[0], stale[1]['code']), (409, 'stale_staff_edit'))
                with patch('backend.server.notify_security_change') as notify:
                    status, result, _ = self.request(url, method='POST', payload={
                        'revision': current['revision'], 'resolveProfile': {'email': choice}})
                    self.assertEqual(status, 200, result)
                    self.assertEqual(result['staffMember']['email'], expected_email)
                    if verified:
                        notify.assert_not_called()
                    else:
                        self.assertEqual(notify.call_args.args[1], {'saved@example.test'})
                with sqlite3.connect(self.path) as db:
                    self.assertEqual(db.execute('SELECT email,email_verified FROM account_profiles WHERE account_id=4').fetchone(), (expected_email, verified))
                    self.assertEqual(db.execute('SELECT count(*) FROM account_email_proofs WHERE account_id=4').fetchone(), (verified,))

    def test_startup_reconciliation_fills_only_safe_blanks_on_existing_schema(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE staff_members SET last_name='' WHERE id='person'")
            db.execute("INSERT INTO account_profiles(account_id,last_name,display_name,email,email_verified) VALUES(4,'Rivers','Alex R','verified@example.test',1)")
            db.execute("INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at) VALUES('existing-proof',4,'recover','verified@example.test',9999999999)")
            db.execute("INSERT INTO staff_members(id,account_id,email) VALUES('staff-email',5,'contact@example.test')")
        restored = self.path.with_name('restored.sqlite3')
        with sqlite3.connect(self.path) as db, sqlite3.connect(restored) as backup:
            db.backup(backup)
        from backend.server import initialise_database as initialise_server_database
        initialise_server_database()
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute("SELECT id,first_name,last_name,email,account_id FROM staff_members WHERE id='person'").fetchone(),
                ('person', 'Alex', 'Rivers', 'verified@example.test', 4))
            self.assertEqual(db.execute('SELECT first_name,last_name,display_name,email,email_verified FROM account_profiles WHERE account_id=4').fetchone(),
                ('Alex', 'Rivers', 'Alex R', 'verified@example.test', 1))
            self.assertEqual(db.execute('SELECT token_hash FROM account_email_proofs WHERE account_id=4').fetchone(), ('existing-proof',))
            self.assertIsNone(db.execute('SELECT 1 FROM account_profiles WHERE account_id=5').fetchone())
            self.assertEqual(db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (29,))
            preserved = list(db.iterdump())
        initialise_server_database()
        with sqlite3.connect(self.path) as db:
            self.assertEqual(list(db.iterdump()), preserved)
        with patch('backend.server.DB_PATH', restored):
            initialise_server_database()
        with sqlite3.connect(restored) as db:
            self.assertEqual(list(db.iterdump()), preserved)


    def test_staff_only_workspace_entry_never_grants_inventory_access(self):
        status, session, _ = self.request('/api/session', actor=3)
        self.assertEqual(status, 200)
        self.assertFalse(session['can_enter_inventory'])
        self.assertTrue(session['can_enter_workspace'])
        self.assertEqual(session['directory_permissions']['staffMembers'], {'read': True, 'edit': False})
        self.assertEqual(session['directory_permissions']['departments'], {'read': False, 'edit': False})
        self.assertEqual(self.request('/api/inventory/state', actor=3)[0], 403)
        self.assertEqual(self.request('/api/inventory/devices', actor=3)[0], 403)
        self.assertEqual(self.request('/api/departments', actor=3)[0], 403)

        status, department_session, _ = self.request('/api/session', actor=5)
        self.assertEqual(status, 200)
        self.assertTrue(department_session['can_enter_workspace'])
        self.assertFalse(department_session['can_enter_inventory'])
        self.assertFalse(department_session['directory_permissions']['staffMembers']['read'])
        self.assertTrue(department_session['directory_permissions']['departments']['edit'])

        self.assertFalse(self.request('/api/session', actor=4)[1]['can_enter_workspace'])
        self.assertEqual(self.request('/inventory', actor=4)[0], 403)

        client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        client.request('GET', '/inventory', headers={'Origin': ORIGIN,
            'Cookie': COOKIE_NAME + '=' + self.tokens[3]})
        response = client.getresponse()
        self.assertEqual(response.status, 200)
        self.assertIn(b'interface/loader.js', response.read())
        client.close()

    def test_staff_department_labels_reveal_only_attached_names_and_active_choices(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE staff_members SET department_id='dept' WHERE id='person'")
            db.execute("INSERT INTO departments(id,name) VALUES('empty','Unstaffed Team')")
            db.execute("INSERT INTO departments(id,name,archived) VALUES('former','Old Team',1)")
            db.execute("INSERT INTO departments(id,name,archived) VALUES('linked','Linked Archive',1)")
            db.execute("INSERT INTO staff_members(id,first_name,last_name,department_id) VALUES('retired','Person','Example','linked')")

        url = '/api/staff-members/department-choices'
        self.assertEqual(self.request(url, actor=4)[0], 403)
        self.assertEqual(self.request(url, actor=5)[0], 403)
        self.assertEqual(self.request(url, actor=None)[0], 401)
        self.assertEqual(self.request(url, method='POST', actor=1, payload={})[0], 404)
        self.assertEqual(self.request(url + '?query=dept', actor=3)[0], 400)
        status, result, cache = self.request(url, actor=3)
        self.assertEqual(status, 200)
        self.assertEqual(cache, 'no-store')
        self.assertEqual({d['name'] for d in result['departments']}, {'Production', 'Linked Archive'})
        self.assertEqual(set(result['departments'][0]), {'id', 'name', 'archived'})
        self.assertEqual(self.request(url, actor=2)[0], 200)
        editor_options = self.request(url, actor=2)[1]['departments']
        self.assertEqual({d['name'] for d in editor_options},
            {'Production', 'Unstaffed Team', 'Linked Archive'})
        self.assertNotIn('Old Team', [d['name'] for d in editor_options])

    def test_department_delete_eligibility_is_read_only_and_history_aware(self):
        with sqlite3.connect(self.path) as db:
            db.execute("INSERT INTO departments(id,name) VALUES('unused','Never Used')")
            db.execute("UPDATE staff_members SET department_id='dept' WHERE id='person'")
        listed = {d['id']: d for d in self.request('/api/departments', actor=5)[1]['departments']}
        self.assertTrue(listed['unused']['canDelete'])
        self.assertFalse(listed['dept']['canDelete'])
        self.assertEqual(self.request('/api/departments/dept', actor=5)[1]['department']['canDelete'], False)
        self.assertEqual(self.request('/api/departments/unused', actor=5)[1]['department']['canDelete'], True)
        self.assertEqual(self.request('/api/staff-members/person', method='POST', actor=2,
            payload={'departmentId': None, 'revision': self.request('/api/staff-members/person', actor=2)[1]['staffMember']['revision']})[0], 200)
        self.assertFalse(self.request('/api/departments/dept', actor=5)[1]['department']['canDelete'])
        self.assertEqual(self.request('/api/departments/dept/delete', method='POST', actor=5,
            payload={})[0], 409)

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
            response = self.request('/api/staff-members/' + staff['id'], method='POST', actor=2,
                payload={'active': active, 'revision': staff['revision']})
            self.assertEqual(response[0], 200, response)
            self.assertEqual(response[1]['staffMember']['active'], active)
            staff = response[1]['staffMember']
        self.assertEqual(len(self.request('/api/staff-members?query=Sam&limit=1&offset=0', actor=3)[1]['staffMembers']), 1)
        for query in ('limit=101', 'limit=bad', 'offset=-1', 'query=a&query=b', 'accountId=1'):
            self.assertEqual(self.request('/api/staff-members?' + query)[0], 400)
        self.assertEqual(self.request('/api/staff-members/person/delete', method='POST', payload={})[0], 404)

    def test_staff_department_search_preserves_read_permissions_and_privacy(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE staff_members SET department_id='dept' WHERE id='person'")
            db.execute("INSERT INTO departments(id,name) VALUES('empty','Unstaffed Department')")
        expected = self.request('/api/staff-members/person', actor=3)[1]['staffMember']
        status, response, cache = self.request('/api/staff-members?query=pRoDuC', actor=3)
        self.assertEqual(status, 200, response)
        self.assertEqual(response, {'staffMembers': [expected]})
        self.assertEqual(cache, 'no-store')
        self.assertEqual(set(expected), {'id', 'firstName', 'lastName', 'email', 'jobTitle',
            'telephone', 'location', 'departmentId', 'active', 'revision'})
        for query in ('Unstaffed', 'account-4', 'PRIVATE-MFA-SECRET', 'private-hash'):
            self.assertEqual(self.request('/api/staff-members?' + urlencode({'query': query}), actor=3)[1], {'staffMembers': []})
        for path in ('/api/departments', '/api/departments/dept', '/api/departments?query=Production'):
            self.assertEqual(self.request(path, actor=3)[0], 403)
        self.assertEqual(self.request('/api/staff-members?query=Production', actor=4)[0], 403)
        self.assertEqual(self.request('/api/staff-members?query=Production', actor=5)[0], 403)
        self.assertEqual(self.request('/api/staff-members?query=Production', actor=None)[0], 401)
        self.assertEqual(self.request('/api/staff-members?query=Alex', actor=3)[1], {'staffMembers': [expected]})
        with sqlite3.connect(self.path) as db:
            self.assertIsNone(db.execute("SELECT 1 FROM account_permission_overrides WHERE account_id=3 AND section='Departments'").fetchone())

    def test_staff_archived_department_search_escapes_wildcards(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE departments SET name='Archive %_! Team',archived=1 WHERE id='dept'")
            db.execute("UPDATE staff_members SET department_id='dept' WHERE id='person'")
            db.execute("INSERT INTO staff_members(id,first_name,last_name) VALUES('unassigned','Taylor','Unassigned')")
        expected = self.request('/api/staff-members/person', actor=3)[1]['staffMember']
        for query in ('archive', '%', '_', '!', '%_!'):
            status, response, _ = self.request('/api/staff-members?' + urlencode({'query': query}), actor=3)
            self.assertEqual(status, 200)
            self.assertEqual(response, {'staffMembers': [expected]})
        self.assertEqual(self.request('/api/staff-members?query=missing%25', actor=3)[1], {'staffMembers': []})
        self.assertEqual(self.request('/api/staff-members?query=Taylor', actor=3)[1]['staffMembers'][0]['id'], 'unassigned')

    def test_combined_login_admin_only_and_safe_conflict(self):
        payload = dict(firstName='Sam', lastName='Person', login=dict(username='new', password='test-password'))
        self.assertEqual(self.request(method='POST', actor=2, payload=payload)[0], 403)
        status, response, _ = self.request(method='POST', payload=payload)
        self.assertEqual(status, 200, response)
        staff = response['staffMember']
        self.assertTrue(staff['accountId'])
        with sqlite3.connect(self.path) as db:
            accounts = db.execute('SELECT id,username,password_hash FROM accounts ORDER BY id').fetchall()
            staff_members = db.execute('SELECT id,account_id FROM staff_members ORDER BY id').fetchall()
        duplicate = {**payload, 'firstName': 'Another', 'login': {'username': 'NeW', 'password': 'different-password'}}
        self.assertEqual(self.request(method='POST', actor=2, payload=duplicate)[0], 403)
        status, response, _ = self.request(method='POST', payload=duplicate)
        self.assertEqual(status, 409)
        self.assertEqual(response, {'error': 'This username is already in use. Please choose another username.',
                                    'code': 'duplicate_username'})
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT id,username,password_hash FROM accounts ORDER BY id').fetchall(), accounts)
            self.assertEqual(db.execute('SELECT id,account_id FROM staff_members ORDER BY id').fetchall(), staff_members)
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
        status, body, _ = self.request(method='POST', actor=2, payload=dict(firstName='A', lastName='B', departmentId='dept'))
        self.assertEqual((status, body), (409, {'error': 'Directory record conflict'}))
        self.assertEqual(self.request('/api/departments/dept', method='POST', actor=5, payload={'archived': False})[0], 200)
        for department in ('dept', None):
            revision = self.request('/api/staff-members/person', actor=2)[1]['staffMember']['revision']
            self.assertEqual(self.request('/api/staff-members/person', method='POST', actor=2,
                payload={'departmentId': department, 'revision': revision})[0], 200)
        self.assertEqual(self.request('/api/departments/dept/delete', method='POST', actor=5, payload={})[0], 409)

    def test_stale_edit_and_quick_status_return_clear_private_conflicts(self):
        path = '/api/staff-members/person'
        original = self.request(path)[1]['staffMember']
        editor = self.request(path, actor=2)[1]['staffMember']
        self.assertEqual(original['revision'], editor['revision'])
        status, response, _ = self.request(path, method='POST', actor=2,
            payload=dict(departmentId='dept', active=False, jobTitle='New title', revision=editor['revision']))
        self.assertEqual(status, 200, response)
        with sqlite3.connect(self.path) as db:
            before = list(db.iterdump())
        for payload in (dict(active=True, revision=original['revision']),
                dict(firstName='Old form', departmentId=None, active=True, revision=original['revision'],
                     login=dict(username='must-not-exist', password='test-password'))):
            status, conflict, cache = self.request(path, method='POST', payload=payload)
            self.assertEqual(status, 409, conflict)
            self.assertEqual(cache, 'no-store')
            self.assertEqual(conflict, {'code': 'stale_staff_edit',
                'error': 'This Staff Member was changed elsewhere. Refresh the current details before editing again.'})
        status, conflict, _ = self.request(path, method='POST', actor=2,
            payload=dict(active=True, revision=editor['revision']))
        self.assertEqual(status, 409)
        self.assertEqual(set(conflict), {'error', 'code'})
        with sqlite3.connect(self.path) as db:
            self.assertEqual(before, list(db.iterdump()))
        refreshed = self.request(path, actor=2)[1]['staffMember']
        self.assertEqual((refreshed['departmentId'], refreshed['active'], refreshed['jobTitle']), ('dept', False, 'New title'))
        status, response, _ = self.request(path, method='POST', actor=2,
            payload=dict(active=True, revision=refreshed['revision']))
        self.assertEqual(status, 200, response)
        self.assertTrue(response['staffMember']['active'])
        self.assertNotIn('accountId', response['staffMember'])

    def test_revision_validation_keeps_authentication_and_permission_guards(self):
        path = '/api/staff-members/person'
        revision = self.request(path)[1]['staffMember']['revision']
        for payload in ({'active': False}, *[dict(active=False, revision=value)
                for value in (None, True, 0, [], {}, '', 'a' * 63, 'A' * 64, 'a' * 65)]):
            with self.subTest(payload=payload):
                self.assertEqual(self.request(path, method='POST', payload=payload)[0], 400)
        self.assertEqual(self.request(path, method='POST',
            raw=b'{"active":false,"revision":"a","revision":"b"}')[0], 400)
        self.assertEqual(self.request(path, method='POST', payload=dict(active=False, revision='0' * 64))[0], 409)
        for actor in (None, 3, 4, 5, 6):
            for identifier in ('person', 'missing'):
                for submitted in ('bad', revision):
                    self.assertEqual(self.request('/api/staff-members/' + identifier, method='POST', actor=actor,
                        payload=dict(active=False, revision=submitted))[0], 403)
        self.assertEqual(self.request(path, method='POST', headers={'X-CSRF-Token': 'bad'},
            payload=dict(active=False, revision=revision))[0], 403)
        self.assertEqual(self.request('/api/staff-members/missing', method='POST',
            payload=dict(active=False, revision=revision))[0], 404)
        self.assertEqual(self.request(path, method='POST', actor=2,
            payload=dict(location='Forbidden login', revision=revision,
                login=dict(username='forbidden', password='test-password')))[0], 403)
        self.assertEqual(self.request(path)[1]['staffMember']['location'], '')
        self.assertEqual(self.request(method='POST',
            payload=dict(firstName='A', lastName='B', revision=revision))[0], 400)

    def test_historical_change_values_preserve_staff_reads_saves_and_conflicts(self):
        path = '/api/staff-members/person'
        original = self.request(path, actor=2)[1]['staffMember']
        event = json.dumps({'changes': ['Historical text', '{invalid', 12, 1.5, None, True,
            {'kind': 'Device', 'label': 'unrelated'}, {'kind': ['Staff Member']}]})
        with sqlite3.connect(self.path) as db:
            db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)', (event,))
        for actor in (2, 3):
            status, response, _ = self.request(path, actor=actor)
            self.assertEqual(status, 200, response)
            self.assertEqual(response['staffMember'], original)
            status, response, _ = self.request(actor=actor)
            self.assertEqual(status, 200, response)
            self.assertEqual(response['staffMembers'], [original])
        status, response, _ = self.request(path, method='POST', actor=2,
            payload=dict(location='Updated', revision=original['revision']))
        self.assertEqual(status, 200, response)
        updated = response['staffMember']
        self.assertEqual(updated['location'], 'Updated')
        with sqlite3.connect(self.path) as db:
            before = list(db.iterdump())
        status, response, _ = self.request(path, method='POST', actor=2,
            payload=dict(active=False, revision=original['revision']))
        self.assertEqual(status, 409, response)
        self.assertEqual(response['code'], 'stale_staff_edit')
        with sqlite3.connect(self.path) as db:
            self.assertEqual(list(db.iterdump()), before)
            self.assertEqual(db.execute('SELECT record_json FROM inventory_change_history ORDER BY id LIMIT 1').fetchone()[0], event)
        status, response, _ = self.request(path, method='POST', actor=2,
            payload=dict(active=False, revision=updated['revision']))
        self.assertEqual(status, 200, response)
        self.assertFalse(response['staffMember']['active'])
