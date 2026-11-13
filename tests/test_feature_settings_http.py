"""Feature settings HTTP authentication, validation and request safeguards."""
import http.client
import json
import sqlite3
import unittest
from unittest.mock import patch

import test_session_http as session_http
from backend.http_security import COOKIE_NAME
from backend.permissions import create_user
from backend.request_auth import csrf_for_session
from backend.sessions import login_session


class FeatureSettingsHttpTests(unittest.TestCase):
    def setUp(self):
        session_http.SessionHttpTests.setUp(self)
        with sqlite3.connect(self.path) as db:
            db.execute('UPDATE organisation_features SET enabled=0')
    tearDown = session_http.SessionHttpTests.tearDown
    post = session_http.SessionHttpTests.post
    request = session_http.SessionHttpTests.request
    endpoint = '/api/settings/features'

    def test_administrator_get_post_and_confirmation(self):
        status, raw, cache = self.request(self.endpoint, COOKIE_NAME + '=' + self.token)
        self.assertEqual(status, 200)
        self.assertEqual(cache, 'no-store')
        self.assertEqual(json.loads(raw)['features'], dict(devices=False, ipam=False, racks=False, suppliers=False, equipment_lifecycle=False))
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            for feature in ('devices', 'ipam', 'racks'):
                status, result = self.post(self.endpoint, dict(feature=feature, enabled=True), self.token, csrf_for_session(self.token))
                self.assertEqual(status, 200, result)
                self.assertTrue(result['features'][feature])
                self.assertEqual(self.post(self.endpoint, dict(feature=feature, enabled=False), self.token, csrf_for_session(self.token))[0], 400)
                status, result = self.post(self.endpoint, dict(feature=feature, enabled=False, confirmDisable=True), self.token, csrf_for_session(self.token))
                self.assertEqual(status, 200, result)
                self.assertFalse(result['features'][feature])
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT count(*) FROM inventory_change_history').fetchone()[0], 6)

    def test_unauthenticated_ordinary_and_revoked_sessions_denied(self):
        self.assertEqual(self.request(self.endpoint)[0], 401)
        with sqlite3.connect(self.path) as db:
            create_user(db, 1, 'staff', 'password')
            staff_token = login_session(db, 'staff', 'password')
        self.assertEqual(self.request(self.endpoint, COOKIE_NAME + '=' + staff_token)[0], 403)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            for token, csrf in ((None, None), (self.token, None), (self.token, 'bad'), (staff_token, csrf_for_session(staff_token))):
                self.assertEqual(self.post(self.endpoint, dict(feature='devices', enabled=True), token, csrf)[0], 403)
            for column in ('active', 'mfa_confirmed'):
                with sqlite3.connect(self.path) as db:
                    db.execute(f'UPDATE accounts SET {column}=0 WHERE id=1')
                self.assertEqual(self.request(self.endpoint, COOKIE_NAME + '=' + self.token)[0], 401)
                self.assertEqual(self.post(self.endpoint, dict(feature='devices', enabled=True), self.token, csrf_for_session(self.token))[0], 403)
                with sqlite3.connect(self.path) as db:
                    db.execute(f'UPDATE accounts SET {column}=1 WHERE id=1')
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE account_sessions SET expires_at=1')
            self.assertEqual(self.request(self.endpoint, COOKIE_NAME + '=' + self.token)[0], 401)
            self.assertEqual(self.post(self.endpoint, dict(feature='devices', enabled=True), self.token, csrf_for_session(self.token))[0], 403)

    def test_strict_payload_validation_and_unavailable_features(self):
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            for payload in ([], None, {}, dict(feature='devices', enabled=1),
                            dict(feature='Devices', enabled=True),
                            dict(feature='suppliers', enabled=True),
                            dict(feature='equipment_lifecycle', enabled=True),
                            dict(feature='stocktakes', enabled=True),
                            dict(feature='devices', enabled=True, actorId=1)):
                self.assertEqual(self.post(self.endpoint, payload, self.token, csrf_for_session(self.token))[0], 400, payload)
        with sqlite3.connect(self.path) as db:
            self.assertFalse(db.execute('SELECT 1 FROM organisation_features WHERE enabled=1').fetchone())
            self.assertFalse(db.execute('SELECT 1 FROM inventory_change_history').fetchone())

    def test_origin_json_and_size_guards(self):
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            cases = [('POST', 'https://other.example', 'application/json', '{}', {}, 403),
                     ('POST', None, 'application/json', '{}', {}, 403),
                     ('POST', 'https://caffoot.example', 'text/plain', '{}', {}, 415),
                     ('POST', 'https://caffoot.example', 'application/json', ' ' * 4097, {}, 400),
                     ('POST', 'https://caffoot.example', 'application/json', '{', {}, 400),
                     ('POST', 'https://caffoot.example', 'application/json', '{"feature":"devices","enabled":false,"enabled":true}', {}, 400),
                     ('GET', 'https://other.example', None, None, {}, 403),
                     ('GET', None, None, None, {'Sec-Fetch-Site': 'cross-site'}, 403)]
            for method, origin, content_type, body, extra, expected in cases:
                conn = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
                headers = {'Cookie': COOKIE_NAME + '=' + self.token, 'X-CSRF-Token': csrf_for_session(self.token), **extra}
                if origin is not None:
                    headers['Origin'] = origin
                if content_type:
                    headers['Content-Type'] = content_type
                conn.request(method, self.endpoint, body=body, headers=headers)
                response = conn.getresponse()
                self.assertEqual(response.status, expected)
                response.read()
                conn.close()

    def test_session_revocation_between_request_check_and_write_is_denied(self):
        from backend.server import authorised_mutation
        def revoke_after_auth(connection, *args, **kwargs):
            actor = authorised_mutation(connection, *args, **kwargs)
            with sqlite3.connect(self.path) as other:
                other.execute('DELETE FROM account_sessions')
            return actor
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'), patch('backend.server.authorised_mutation', side_effect=revoke_after_auth):
            self.assertEqual(self.post(self.endpoint, dict(feature='devices', enabled=True), self.token, csrf_for_session(self.token))[0], 403)
        with sqlite3.connect(self.path) as db:
            self.assertFalse(db.execute('SELECT 1 FROM organisation_features WHERE enabled=1').fetchone())
