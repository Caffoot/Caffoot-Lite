"""Exercise the approved settings and account messages through the real HTTP and SMTP handlers."""
import base64
from email import policy
from email.parser import BytesParser
import http.client
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
from queue import Queue
import re
import socketserver
import sqlite3
import struct
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
import zlib

from backend import account_email, schema, smtp_settings
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.profiles import save_profile
from backend.request_auth import csrf_for_session
from backend.server import Handler
from backend.sessions import _digest, login_session

ORIGIN = 'https://inventory.example.test'
TEMPLATE_URL = '/api/settings/email-templates'
VERIFY = 'email-verification'
FICTIONAL_JPEG = (
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkK'
    'DA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQ'
    'EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAMABgDAREAAhEBAxEB/8QA'
    'FQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAA'
    'AAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCSlwjAAAAAH//Z'
)
EXACT_CATALOGUE = {
    'ticket-closed': 'employee_name ticket_number device_name ticket_status resolution_note ticket_link',
    'ticket-hold': 'employee_name ticket_number device_name ticket_status hold_reason hold_explanation ticket_link',
    'ticket-update': 'employee_name ticket_number device_name visible_update ticket_link',
    'ticket-assigned': 'technician_name ticket_number device_name ticket_link',
    'ticket-reply': 'technician_name ticket_number employee_reply ticket_link',
    'ticket-reopened': 'technician_name ticket_number device_name ticket_link',
    'ticket-created': 'ticket_number ticket_status ticket_link',
    VERIFY: 'company_name recipient_name',
    'password-recovery': 'company_name recipient_name',
    'account-security-notice': 'company_name',
}


def fictional_png(width=360, height=144, *, compressed_rows=None):
    """Make a real solid-colour PNG without depending on an imaging package."""
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
    rows = (b'\x00' + b'\x15\x40\x5a' * width) * height if compressed_rows is None else None
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(rows) if compressed_rows is None else compressed_rows) + chunk(b'IEND', b''))


class LocalMailReceiver(socketserver.StreamRequestHandler):
    """Receive one real SMTP message on loopback without forwarding any email."""
    def handle(self):
        self.wfile.write(b'220 test.example SMTP ready\r\n')
        while line := self.rfile.readline():
            command = line.split(None, 1)[0].upper()
            if command == b'DATA':
                self.wfile.write(b'354 Send message\r\n')
                message = bytearray()
                while (data := self.rfile.readline()) and data != b'.\r\n':
                    message.extend(data[1:] if data.startswith(b'..') else data)
                self.server.messages.put(BytesParser(policy=policy.default).parsebytes(message))
                self.wfile.write(b'250 Delivered to the test mailbox\r\n')
            elif command == b'QUIT':
                self.wfile.write(b'221 Goodbye\r\n')
                return
            else:
                self.wfile.write(b'250 OK\r\n')


class EmailTemplateHttpTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.database = Path(self.temporary.name) / 'caffoot.sqlite3'
        with sqlite3.connect(self.database) as connection:
            with patch.object(schema, 'SCHEMA_VERSION', 27):
                schema.initialise_database(connection)
            self.owner, self.secret = bootstrap_first_admin(connection, 'Alex Admin', 'fixture-password')
            now = time.time()
            confirm_admin_mfa(connection, self.owner, code_at(self.secret, now), timestamp=now)
            self.admin = login_session(connection, 'Alex Admin', 'fixture-password',
                                       mfa_code=code_at(self.secret, now), now=now)
            save_profile(connection, self.owner, {'firstName': 'Alex', 'lastName': 'Admin',
                         'displayName': 'Alex <Admin>', 'email': 'owner@example.test'})
            for key, label, admin, mfa, active in [
                ('2', 'Technician', 0, 1, 1), ('3', 'Employee', 0, 0, 1),
                ('4', 'Unenrolled administrator', 1, 0, 1), ('5', 'Disabled administrator', 1, 1, 0),
            ]:
                actor = connection.execute(
                    'INSERT INTO accounts(username,password_hash,is_admin,mfa_confirmed,mfa_secret,active) '
                    "VALUES(?, 'fixture', ?, ?, 'JBSWY3DPEHPK3PXP', ?)", (label, admin, mfa, active)).lastrowid
                connection.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,?)', (_digest(key * 64), actor, mfa))
                if key == '2':
                    connection.execute("INSERT INTO account_permission_overrides VALUES(?, 'Service Desk', 'edit')",
                                       (actor,))
                    connection.execute("INSERT INTO account_permission_overrides VALUES(?, 'Devices', 'read')", (actor,))
        self.start_patch(patch('backend.server.DB_PATH', self.database))
        self.start_patch(patch('backend.server.PUBLIC_ORIGIN', ORIGIN))
        self.start_patch(patch.object(smtp_settings, '_NEXT_TEST_AT', 0.0))
        account_email.MAIL_REQUESTS._failures.clear()
        account_email._NOTICE_NEXT.clear()
        self.http = self.run_server(ThreadingHTTPServer(('127.0.0.1', 0), Handler))
        self.smtp_path = smtp_settings.config_path(self.database)
        self.smtp = self.run_server(socketserver.ThreadingTCPServer(('127.0.0.1', 0), LocalMailReceiver))
        self.smtp.messages = Queue()
        smtp_settings.save_settings(self.smtp_path, {
            'host': '127.0.0.1', 'port': self.smtp.server_address[1], 'security': 'none', 'authenticate': False,
            'username': '', 'password': '', 'fromName': 'Fictional SMTP Sender', 'fromEmail': 'sender@example.test',
            'insecureConfirmed': True,
        })
        self.smtp_bytes = self.smtp_path.read_bytes()
        with sqlite3.connect(self.database) as connection:
            schema.initialise_database(connection)

    def start_patch(self, patcher):
        patcher.start()
        self.addCleanup(patcher.stop)

    def run_server(self, server):
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        return server

    def request(self, path=TEMPLATE_URL, payload=None, *, token='admin', csrf=True, origin=ORIGIN):
        connection = http.client.HTTPConnection('127.0.0.1', self.http.server_port, timeout=10)
        token = self.admin if token == 'admin' else token
        headers = {'Origin': origin, 'Content-Type': 'application/json'}
        if token:
            headers['Cookie'] = COOKIE_NAME + '=' + token
            if csrf:
                headers['X-CSRF-Token'] = csrf_for_session(token)
        connection.request('GET' if payload is None else 'POST', path,
                           body=None if payload is None else json.dumps(payload), headers=headers)
        response = connection.getresponse()
        result = response.status, json.loads(response.read())
        connection.close()
        return result

    def post(self, **payload):
        status, result = self.request(payload=payload)
        self.assertEqual(status, 200, result)
        return result

    def test_exact_catalogue_all_sample_details_and_permission_matrix(self):
        status, result = self.request()
        self.assertEqual(status, 200)
        self.assertEqual({t['id']: ' '.join(v['key'] for v in t['variables']) for t in result['templates']},
                         EXACT_CATALOGUE)
        locked = ['Resolution', 'Waiting for Parts', 'replacement charger', 'Laptop-017', 'working well',
                  'Open (Reopened)', 'Status: Open', '15 minutes', '15 minutes', 'Audit Trail']
        for template, detail in zip(result['templates'], locked):
            sample = self.post(action='preview', id=template['id'], **template['default'])
            self.assertIn(detail, sample['text'])
            self.assertIn('Required Notification Details', sample['html'])
            self.assertNotIn('owner@example.test', sample['text'])
        actions = [
            {'action': 'preview'}, {'action': 'test'}, {'action': 'draft'}, {'action': 'publish'},
            {'action': 'restore'}, {'action': 'branding'}, {'action': 'branding-preview'},
        ]
        for token in ('2' * 64, '3' * 64, '4' * 64, '5' * 64, None):
            self.assertIn(self.request(token=token)[0], (401, 403))
            for action in actions:
                self.assertEqual(self.request(payload=action, token=token)[0], 403)
        self.assertEqual(self.request(payload=actions[0], csrf=False)[0], 403)
        self.assertEqual(self.request(payload=actions[0], origin='https://elsewhere.example.test')[0], 403)

    def test_drafts_publish_restore_audit_and_locks(self):
        wording = {'subject': 'Welcome {{recipient_name}}', 'body': '<p>Hello <b>{{company_name}}</b>.</p>'}
        state = self.post(action='draft', id=VERIFY, revision=0, **wording)
        self.assertEqual(state['published']['subject'], 'Caffoot Lite email verification')
        self.assertIn('<strong>{{company_name}}</strong>', state['draft']['body'])
        self.assertEqual(self.request(payload={'action': 'publish', 'id': VERIFY, 'revision': 0})[0], 409)
        sample = self.post(action='preview', id=VERIFY, **wording)
        self.assertEqual(sample['subject'], 'Welcome Jordan Taylor')
        self.assertIn('12345678', sample['text'])
        state = self.post(action='publish', id=VERIFY, revision=state['revision'])
        self.assertIsNone(state['draft'])
        self.assertEqual(state['published']['subject'], wording['subject'])
        default = self.post(action='restore', id=VERIFY)
        self.assertEqual(default['subject'], 'Caffoot Lite email verification')
        updated = next(t for t in self.request()[1]['templates'] if t['id'] == VERIFY)
        self.assertEqual(updated['published'], state['published'])
        status, history = self.request('/api/inventory/history')
        self.assertEqual(status, 200)
        serialised = json.dumps(history)
        self.assertIn('Email template draft saved', serialised)
        self.assertIn('default loaded into editor', serialised)
        self.assertIn('Alex Admin', serialised)
        self.assertNotIn('Welcome', serialised)
        self.assertNotIn('Email template published', json.dumps(self.request('/api/inventory/history', token='2' * 64)[1]))
        empty = self.post(action='draft', id=VERIFY, revision=state['revision'], subject='', body='')
        self.assertEqual(self.request(payload={'action': 'publish', 'id': VERIFY, 'revision': empty['revision']})[0], 400)

    def test_sanitises_markup_tokens_links_and_headers(self):
        html = ('<p onclick="alert(1)"><b>{{recipient_name}}</b><img src="x">'
                '<script>hidden()</script><a href="https://example.invalid/a">Help</a></p>')
        result = self.post(action='preview', id=VERIFY, subject='A & B', body=html)
        self.assertIn('<strong>Jordan Taylor</strong>', result['html'])
        self.assertIn('<a>Help</a>', result['html'])
        for value in ('onclick', '<img', 'hidden()', 'href='):
            self.assertNotIn(value, result['html'])
        for body in ('{{code}}', '{{ticket_number}}', '{{recipient_<b>name</b>}}',
                     '<a href="javascript:alert(1)">Link</a>', '<a href="https://user@example.invalid/">Link</a>',
                     '<a href="https://example.invalid/{{recipient_name}}">Link</a>'):
            status, detail = self.request(payload={'action': 'draft', 'id': VERIFY, 'revision': 0,
                                                  'subject': 'Verification', 'body': body})
            self.assertEqual(status, 400, detail)
        self.assertEqual(self.request(payload={'action': 'draft', 'id': VERIFY, 'revision': 0,
            'subject': 'One line\nBcc: hidden@example.test', 'body': '<p>Hello</p>'})[0], 400)

    def test_branding_validation_persistence_and_real_sample_mime(self):
        png = fictional_png()
        encoded = base64.b64encode(png).decode()
        branding = {'action': 'branding', 'revision': 0, 'name': 'Maplebrook & Co', 'primary': '#214260',
                    'accent': '#FF9922', 'footer': 'Help desk\n<Keep your code private>'}
        for logo in ({'mime': 'image/svg+xml', 'data': 'PHN2Zz4='},
                     {'mime': 'image/jpeg', 'data': encoded},
                     {'mime': 'image/png', 'data': encoded[:64]},
                     {'mime': 'image/png', 'data': base64.b64encode(fictional_png(compressed_rows=b'invalid rows')).decode()},
                     {'mime': 'image/png', 'data': base64.b64encode(
                         fictional_png(width=90000, height=90000, compressed_rows=b'ignored')).decode()},
                     {'mime': 'image/png', 'data': base64.b64encode(b'x' * (2 * 1024 * 1024 + 1)).decode()}):
            self.assertEqual(self.request(payload={**branding, 'logo': logo})[0], 400)
        self.assertEqual(self.request(payload={**branding, 'accent': 'red', 'logo': None})[0], 400)
        chosen = self.post(**branding, logo={'mime': 'image/png', 'data': encoded})
        self.assertEqual(chosen['logo']['width'], 360)
        self.assertEqual(self.request()[1]['branding'], chosen)
        test = {'action': 'test', 'id': VERIFY, 'subject': 'Hello {{recipient_name}}',
                'body': '<p>{{company_name}}</p>', 'recipient': 'reviewer@example.test'}
        self.assertEqual(self.request(payload={**test, 'recipient': 'bad@example.test,another@example.test'})[0], 400)
        self.assertEqual(self.request(payload={**test, 'recordId': self.owner})[0], 400)
        self.assertEqual(self.post(**test), {'status': 'sent'})
        message = self.smtp.messages.get(timeout=5)
        self.assertEqual(str(message['Subject']), '[Test] Hello Jordan Taylor')
        self.assertEqual(message['To'].addresses[0].addr_spec, 'reviewer@example.test')
        self.assertEqual(message['From'].addresses[0].display_name, 'Fictional SMTP Sender')
        self.assertEqual(message['From'].addresses[0].addr_spec, 'sender@example.test')
        plain = message.get_body(('plain',)).get_content()
        html = message.get_body(('html',)).get_content()
        self.assertIn('12345678', plain)
        self.assertIn('cid:company-logo', html)
        self.assertIn('width="180" height="72"', html)
        self.assertIn('&lt;Keep your code private&gt;', html)
        image = next(part for part in message.walk() if part.get_content_type() == 'image/png')
        self.assertEqual(image.get_payload(decode=True), png)
        self.assertEqual(self.request(payload=test)[0], 400)
        with self.smtp.messages.mutex:
            self.assertFalse(self.smtp.messages.queue)
        replaced = self.post(**{**branding, 'revision': chosen['revision']},
                             logo={'mime': 'image/jpeg', 'data': FICTIONAL_JPEG})
        self.assertEqual((replaced['logo']['width'], replaced['logo']['height']), (24, 12))
        preview = self.post(action='preview', id=VERIFY, subject='Sample', body='<p>Fictional</p>')
        self.assertIn('width="24" height="12"', preview['html'])
        removed = self.post(**{**branding, 'revision': replaced['revision']}, logo=None)
        self.assertIsNone(removed['logo'])
        self.assertEqual(removed['name'], 'Maplebrook & Co')
        self.assertEqual(self.smtp_path.read_bytes(), self.smtp_bytes)

    def test_published_account_messages_preserve_real_proofs_and_generic_notice(self):
        self.post(action='draft', id=VERIFY, revision=0, subject='Please verify, {{recipient_name}}',
                  body='<p>Welcome to {{company_name}}, {{recipient_name}}.</p>')
        path = '/api/account/email/request'
        first = self.request(path, {'password': 'fixture-password'})
        self.assertEqual(first[0], 200)
        default = self.smtp.messages.get(timeout=5)
        self.assertEqual(str(default['Subject']), 'Caffoot Lite email verification')
        self.post(action='publish', id=VERIFY, revision=1)
        second = self.request(path, {'password': 'fixture-password'})
        self.assertEqual(second[0], 200)
        message = self.smtp.messages.get(timeout=5)
        self.assertEqual(str(message['Subject']), 'Please verify, Alex <Admin>')
        html = message.get_body(('html',)).get_content()
        text = message.get_body(('plain',)).get_content()
        code = re.search(r'^([0-9]{8})\r?$', text, re.M)[1]
        self.assertIn('Alex &lt;Admin&gt;', html)
        self.assertIn(code, html)
        self.assertNotIn(second[1]['challengeId'], html)
        self.assertEqual(self.request('/api/account/email/confirm', {
            'password': 'fixture-password', 'challengeId': second[1]['challengeId'], 'token': code})[0], 200)
        notice = self.smtp.messages.get(timeout=5)
        self.assertEqual(str(notice['Subject']), 'Caffoot Lite account security notice')
        self.assertIn('Audit Trail', notice.get_body(('html',)).get_content())
        status, recovery = self.request('/api/recovery/request', {'username': 'Alex Admin'}, token=None)
        self.assertEqual(status, 200)
        self.assertEqual(recovery['message'], account_email.REQUEST_MESSAGE)
        message = self.smtp.messages.get(timeout=5)
        self.assertEqual(str(message['Subject']), 'Caffoot Lite password recovery')
        text = message.get_body(('plain',)).get_content()
        code = re.search(r'^([0-9]{8})\r?$', text, re.M)[1]
        self.assertIn('15 minutes', text)
        confirm = {'token': code, 'password': 'fictional-new-password', 'challengeId': recovery['challengeId'], 'mfa_code': ''}
        self.assertEqual(self.request('/api/recovery/confirm', confirm, token=None)[0], 400)
        confirm['mfa_code'] = code_at(self.secret, time.time())
        self.assertEqual(self.request('/api/recovery/confirm', confirm, token=None)[0], 200)
        self.assertEqual(self.request('/api/recovery/confirm', confirm, token=None)[0], 400)
