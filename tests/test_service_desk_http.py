"""Check the live Service Desk workflows and ticket access boundary."""
import base64
from concurrent.futures import ThreadPoolExecutor
import http.client
import json
from queue import Queue
import smtplib
import socketserver
import sqlite3
import threading
import unittest
from unittest.mock import patch

from backend.equipment_associations import add_associated_equipment
from backend.equipment_lifecycle import DEFAULT_LIFESPANS
from backend.history_permissions import visible_change_history
from backend.http_security import COOKIE_NAME
from backend.request_auth import csrf_for_session
from backend.sessions import _digest
from backend.inventory import reconstruct_inventory
from backend.normalisation_pipeline import PUBLISHED_DEFAULTS
from backend.schema import initialise_database
from backend.smtp_settings import config_path, save_settings
from backend.service_desk_calendar import DEFAULT_WORKING_HOURS, activate_deployment_timezone
from backend.service_desk_schema import (DEFAULT_TICKET_CATEGORIES, OTHER_TICKET_CATEGORY_ID,
                                         SOFTWARE_TICKET_CATEGORY_ID)
from backend.supplier_issue_schema import INITIAL_ISSUE_CATEGORIES
from backend.supplier_schema import INITIAL_CATEGORIES
from backend.stock_circulation import issue_stock, legacy_device_issue, return_stock, stock_issue_records
from backend.stock_corrections import save_stock_correction
from backend.stock_intake import receive_stock, stock_item
import test_device_assignments_http as fixture
from test_device_handovers import handover_payload
from test_staff_directory_http import ORIGIN
from test_email_templates_http import LocalMailReceiver
from test_import_review import fixture as legacy_export
from test_stock_circulation import issue_payload, return_payload
from test_stock_corrections import correction_payload
from test_stock_intake import receipt_payload


SERVICE_DESK = '/api/service-desk'
CREATE = dict(equipmentKind='device', equipmentId='device', categoryId=5,
              subject='Shared drive connection', description='The shared drive fails to open.')


class ServiceDeskHttpTests(unittest.TestCase):
    request = fixture.DeviceAssignmentHttpTests.request
    close_server = fixture.DeviceAssignmentHttpTests.close_server

    def setUp(self):
        fixture.DeviceAssignmentHttpTests.setUp(self)
        self.allocation = self.payload
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='dept' WHERE id='person'")
            connection.execute("INSERT INTO departments(id,name) VALUES('other','Finance')")
            connection.execute("""INSERT INTO staff_members(id,account_id,first_name,last_name,department_id)
                                VALUES('colleague',5,'Asha','Jones','other')""")
            connection.execute("INSERT INTO account_permission_overrides VALUES(2,'Service Desk','edit')")
            connection.execute("INSERT INTO account_permission_overrides VALUES(3,'Service Desk','read')")
            connection.execute("""INSERT INTO account_roles
                SELECT 5,id FROM roles WHERE role_key='it_staff'""")
            for section in ('Devices', 'IPAM', 'Racks'):
                connection.execute('INSERT INTO account_permission_overrides VALUES(5,?,?)', (section, 'deny'))

    def ticket_path(self, scope, suffix=''):
        return f'{SERVICE_DESK}/{scope}/tickets' + suffix

    def create(self, scope='personal', actor=4, **fields):
        status, result, _ = self.request(self.ticket_path(scope), method='POST', actor=actor,
                                         payload=dict(CREATE, **fields))
        self.assertEqual(status, 201, result)
        return result['id']

    def assign_device(self, kind='staff', recipient='person'):
        status, result, _ = self.request('/api/equipment/assignments', method='POST',
                                        payload=dict(self.allocation, recipientKind=kind, recipientId=recipient))
        self.assertEqual(status, 200, result)

    def hand_over(self, kind, recipient):
        with sqlite3.connect(self.path) as connection:
            payload = handover_payload(connection, 'device', recipientKind=kind, recipientId=recipient)
        status, result, _ = self.request('/api/equipment/reassign', method='POST', payload=payload)
        self.assertEqual(status, 200, result)

    def save(self, scope, ticket_id, action, payload, *, actor=1):
        return self.request(self.ticket_path(scope, f'/{ticket_id}/{action}'),
                            method='POST', actor=actor, payload=payload)

    def download(self, scope, ticket_id, attachment_id, actor):
        client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        self.addCleanup(client.close)
        client.request('GET', self.ticket_path(scope, f'/{ticket_id}/attachments/{attachment_id}'),
                       headers={'Origin': ORIGIN, 'Cookie': COOKIE_NAME + '=' + self.tokens[actor]})
        response = client.getresponse()
        return response.status, response.read(), response.getheader('Cache-Control')

    def capture_ticket_mail(self, *, support_email='it-support@example.test', defer=False):
        receiver = socketserver.ThreadingTCPServer(('127.0.0.1', 0), LocalMailReceiver)
        receiver.messages = Queue()
        thread = threading.Thread(target=receiver.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(thread.join)
        self.addCleanup(receiver.server_close)
        self.addCleanup(receiver.shutdown)
        self.mail_settings = dict(host='127.0.0.1', port=receiver.server_address[1], security='none',
                                  authenticate=False, username='', password='', fromName='Fictional Support',
                                  fromEmail='sender@example.test', insecureConfirmed=True, itSupportEmail=support_email)
        save_settings(config_path(self.path), self.mail_settings)
        with sqlite3.connect(self.path) as connection:
            connection.executemany("""
                INSERT INTO account_profiles(account_id,email,email_verified) VALUES(?,?,1)
            """, [(actor, f'account-{actor}@example.test') for actor in range(1, 7)])
        self.mail_jobs = []
        submit = self.mail_jobs.append if defer else lambda job: job()
        worker = patch('backend.account_email.MAIL_EXECUTOR.submit', side_effect=submit)
        worker.start()
        self.addCleanup(worker.stop)
        if defer:
            self.addCleanup(self.finish_mail_jobs)
        self.mail = receiver.messages

    def finish_mail_jobs(self):
        while self.mail_jobs:
            self.mail_jobs.pop(0)()

    def ticket_mail(self, recipient, ticket, scope, *contains, excludes=()):
        mail = self.mail.get_nowait()
        text = mail.get_body(preferencelist=('plain',)).get_content()
        html = mail.get_body(preferencelist=('html',)).get_content()
        page = 'inventory' if scope == 'it' else 'account'
        link = f'{ORIGIN}/{page}?ticket={scope}-{ticket}'
        self.assertEqual(mail['To'].addresses[0].addr_spec, recipient)
        self.assertEqual(len(mail['To'].addresses), 1)
        self.assertIsNone(mail['Cc'])
        self.assertIsNone(mail['Bcc'])
        self.assertEqual(list(mail.iter_attachments()), [])
        self.assertIn(f'SD-{ticket:04d}', text)
        self.assertIn(link, text)
        self.assertIn(f'href="{link}"', html)
        self.assertIn('Required Notification Details', html)
        for content in contains:
            self.assertIn(content, text)
        for content in excludes:
            self.assertNotIn(content, text)
            self.assertNotIn(content, html)
            self.assertNotIn(content, str(mail['Subject']))
        return mail

    def test_unread_snapshot_counts_isolation_and_later_reply(self):
        self.assign_device()
        ticket = self.create(attachments=[{'filename': 'initial.txt',
                                            'contents': base64.b64encode(b'original').decode()}])
        personal = f'{SERVICE_DESK}/personal/unread'
        it = f'{SERVICE_DESK}/it/unread'
        def unread(path, actor):
            return self.request(path, actor=actor, headers={'X-CSRF-Token': csrf_for_session(self.tokens[actor])})
        self.assertEqual(unread(personal, 4)[1], {'personal': 0, 'department': 0, 'combined': 0,
                                                   'tickets': {'personal': {}, 'department': {}}})
        self.assertEqual(unread(it, 3)[1], {'it': 0, 'tickets': {'it': {}}})
        self.assertEqual(self.request(personal, actor=4)[0], 403)
        self.assertEqual(self.request(personal, actor=4,
                                     headers={'X-CSRF-Token': csrf_for_session(self.tokens[3])})[0], 403)
        self.assertEqual(self.save('personal', ticket, 'messages', {'body': 'My reply'}, actor=4)[0], 200)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Internal note'})[0], 200)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Visible reply', 'employeeVisible': True})[0], 200)
        self.assertEqual(unread(personal, 4)[1], {'personal': 1, 'department': 0, 'combined': 1,
                                                   'tickets': {'personal': {str(ticket): 1}, 'department': {}}})
        self.assertEqual(unread(it, 3)[1], {'it': 1, 'tickets': {'it': {str(ticket): 3}}})
        self.assertEqual(unread(it, 4)[0], 403)
        path = self.ticket_path('personal', f'/{ticket}')
        self.assertEqual(self.request(path, actor=4)[1]['unreadCount'], 1)
        self.assertEqual(self.request(self.ticket_path('personal')+'?status=Closed', actor=4)[1]['tickets'], [])
        self.assertEqual(unread(personal, 4)[1]['combined'], 1)
        snapshot = self.request(path+'/messages', actor=4)[1]
        self.assertNotIn('Internal note', [message['body'] for message in snapshot['messages']])
        self.assertEqual(self.request(path, actor=4)[1]['unreadCount'], 1)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Later reply', 'employeeVisible': True})[0], 200)
        self.assertEqual(self.save('it', ticket, 'read', {'proof': snapshot['readProof']}, actor=3)[0], 403)
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': snapshot['readProof']}, actor=4)[1],
                         {'unreadCount': 1})
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': snapshot['readProof']}, actor=4)[1],
                         {'unreadCount': 1})
        technician = self.request(self.ticket_path('it', f'/{ticket}/messages'), actor=3)[1]
        self.assertEqual(self.save('it', ticket, 'read', {'proof': technician['readProof']}, actor=3)[1],
                         {'unreadCount': 0})
        self.assertEqual(unread(personal, 4)[1]['combined'], 1)
        latest = self.request(path+'/messages', actor=4)[1]
        self.hand_over('department', 'dept')
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': latest['readProof']}, actor=4)[0], 404)
        self.assertEqual(unread(personal, 4)[1]['combined'], 0)

    def test_unread_acknowledgement_is_session_bound_expiring_and_csrf_protected(self):
        self.assign_device()
        ticket = self.create()
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Visible reply', 'employeeVisible': True})[0], 200)
        path = self.ticket_path('personal', f'/{ticket}')
        snapshot = self.request(path+'/messages', actor=4)[1]
        proof = snapshot['readProof']
        for headers in ({'Origin': 'https://outside.example'}, {'X-CSRF-Token': ''},
                        {'Sec-Fetch-Site': 'cross-site'}):
            self.assertEqual(self.request(path+'/read', method='POST', actor=4,
                                         payload={'proof': proof}, headers=headers)[0], 403)
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': proof, 'accountId': 4}, actor=4)[0], 400)
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': proof[:-1] + ('0' if proof[-1] != '0' else '1')},
                                   actor=4)[0], 403)
        original_token = self.tokens[4]
        alternate_token = 'a' * 64
        with sqlite3.connect(self.path) as connection:
            connection.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(alternate_token), 4))
        self.tokens[4] = alternate_token
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': proof}, actor=4)[0], 403)
        with patch('backend.service_desk_reads._PROOF_SECONDS', 0):
            expired = self.request(path+'/messages', actor=4)[1]['readProof']
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': expired}, actor=4)[0], 403)
        self.assertEqual(self.request(path, actor=4)[1]['unreadCount'], 1)
        fresh = self.request(path+'/messages', actor=4)[1]['readProof']
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': fresh}, actor=4)[1], {'unreadCount': 0})
        self.tokens[4] = original_token
        self.assertEqual(self.request(path, actor=4)[1]['unreadCount'], 0)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(connection.execute('SELECT account_id,count(*) FROM service_desk_message_reads GROUP BY account_id').fetchall(),
                             [(4, 1)])
            connection.execute('DELETE FROM account_sessions WHERE token_hash=?', (_digest(original_token),))
        self.assertEqual(self.save('personal', ticket, 'read', {'proof': proof}, actor=4)[0], 403)

    def test_department_unread_counts_are_individual_and_follow_current_membership(self):
        self.assign_device('department', 'dept')
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='dept' WHERE id='colleague'")
        ticket = self.create('department')
        self.assertEqual(self.save('department', ticket, 'messages', {'body': 'Employee reply'}, actor=4)[0], 200)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Visible update', 'employeeVisible': True})[0], 200)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Private IT note'})[0], 200)
        path = self.ticket_path('department', f'/{ticket}')
        def unread(actor):
            return self.request(f'{SERVICE_DESK}/personal/unread', actor=actor,
                                headers={'X-CSRF-Token': csrf_for_session(self.tokens[actor])})[1]
        self.assertEqual(unread(4), {'personal': 0, 'department': 1, 'combined': 1,
                                    'tickets': {'personal': {}, 'department': {str(ticket): 1}}})
        self.assertEqual(unread(5)['tickets']['department'], {str(ticket): 2})
        proof = self.request(path+'/messages', actor=5)[1]['readProof']
        self.assertEqual(self.save('department', ticket, 'read', {'proof': proof}, actor=5)[1], {'unreadCount': 0})
        self.assertEqual(unread(5)['combined'], 0)
        self.assertEqual(unread(4)['combined'], 1)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Another update', 'employeeVisible': True})[0], 200)
        proof = self.request(path+'/messages', actor=5)[1]['readProof']
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='other' WHERE id='colleague'")
        self.assertEqual(unread(5)['combined'], 0)
        self.assertEqual(self.save('department', ticket, 'read', {'proof': proof}, actor=5)[0], 404)
        self.assertEqual(unread(4)['tickets']['department'], {str(ticket): 2})

    def test_created_mail_scope_device_and_asset_published_wording_and_sign_in(self):
        self.capture_ticket_mail()
        self.assign_device()
        templates = '/api/settings/email-templates'
        draft = dict(id='ticket-created', revision=0, subject='Support intake {{ticket_number}}',
                     body='<p>Review this request.</p>')
        self.assertEqual(self.request(templates, method='POST', payload=dict(draft, action='draft'))[0], 200)
        forbidden = ('private subject', 'private description', 'private-file.txt', 'Laptop', 'account-4')
        private = dict(subject='private subject', description='private description',
                       attachments=[{'filename': 'private-file.txt', 'contents': base64.b64encode(b'private').decode()}])
        personal = self.create(**private)
        first = self.ticket_mail('it-support@example.test', personal, 'it', 'Status: Open', excludes=forbidden)
        self.assertEqual(str(first['Subject']), f'New support ticket SD-{personal:04d}')
        self.assertEqual(self.request(templates, method='POST',
                                      payload={'id': draft['id'], 'action': 'publish', 'revision': 1})[0], 200)
        self.hand_over('department', 'dept')
        department = self.create('department', **private)
        second = self.ticket_mail('it-support@example.test', department, 'it', 'Status: Open', excludes=forbidden)
        self.assertEqual(str(second['Subject']), f'Support intake SD-{department:04d}')
        self.create('it', actor=1)
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            connection.commit()
            receipt = dict(receipt_payload(), quantity=2, readyQuantity=2,
                           checks={'itemsChecked': True, 'conditionChecked': True})
            asset = receive_stock(connection, 1, self.tokens[1], receipt)['stockItemId']
            for scope, kind, recipient in (('personal', 'staff', 'person'), ('department', 'department', 'dept')):
                issue_stock(connection, 1, self.tokens[1],
                            issue_payload(connection, asset, recipientKind=kind, recipientId=recipient))
                issue = next(row for row in stock_issue_records(connection)
                             if row['departmentId' if kind == 'department' else 'staffId'] == recipient)
                fields = dict(equipmentKind='stockItem', equipmentId=asset, stockIssueId=issue['id'])
                ticket = self.create(scope, **fields)
                self.ticket_mail('it-support@example.test', ticket, 'it', 'Status: Open', excludes=('Fictional Display',))
                self.create('it', actor=1, **fields)
        self.assertTrue(self.mail.empty())
        for scope, page in (('it', 'inventory'), ('department', 'account')):
            client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
            self.addCleanup(client.close)
            client.request('GET', f'/{page}?ticket={scope}-{department}')
            response = client.getresponse()
            self.assertEqual(response.status, 303)
            self.assertEqual(response.getheader('Location'), f'/setup?ticket={scope}-{department}#sign-in-required')
            self.assertNotIn(b'private subject', response.read())
        self.assertEqual(self.request(self.ticket_path('it', f'/{department}'), actor=None)[0], 401)
        self.assertEqual(self.request(self.ticket_path('it', f'/{department}'), actor=4)[0], 403)
        self.assertEqual(self.request(self.ticket_path('it', f'/{department}'), actor=6)[0], 401)

    def test_ticket_mail_events_and_forbidden_events(self):
        self.capture_ticket_mail(support_email='')
        self.assign_device()
        ticket = self.create()
        self.assertTrue(self.mail.empty())
        reply = self.save('personal', ticket, 'messages', {'body': 'In the unassigned queue'}, actor=4)
        self.assertEqual(reply[0], 200)
        self.assertEqual(self.request(self.ticket_path('it', f'/{ticket}/messages'))[1]['messages'][0]['body'],
                         'In the unassigned queue')
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'assign', {'technicianId': 1})[0], 200)
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'assign',
                                   {'technicianId': 2, 'reason': 'Sickness', 'explanation': 'Private staffing'})[0], 200)
        self.ticket_mail('account-2@example.test', ticket, 'it', 'Laptop', excludes=('Private staffing', 'Sickness'))
        other_assignment = self.create('it', actor=1)
        self.assertEqual(self.save('it', other_assignment, 'assign', {'technicianId': 2})[0], 200)
        self.ticket_mail('account-2@example.test', other_assignment, 'it', 'Laptop')
        reply = self.save('personal', ticket, 'messages', {'body': 'The fault persists'}, actor=4)
        self.assertEqual(reply[0], 200)
        self.ticket_mail('account-2@example.test', ticket, 'it', 'The fault persists')
        self.assertEqual(self.save('personal', ticket, f'messages/{reply[1]["id"]}',
                                   {'body': 'Edited reply'}, actor=4)[0], 200)
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Private IT note'})[0], 200)
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'messages',
                                   {'body': '<b>Public update</b>', 'employeeVisible': True})[0], 200)
        visible = self.ticket_mail('account-4@example.test', ticket, 'personal', '<b>Public update</b>',
                                   excludes=('Private IT note',))
        self.assertIn('&lt;b&gt;Public update&lt;/b&gt;', visible.get_body(preferencelist=('html',)).get_content())
        self.assertEqual(self.save('it', ticket, 'hold',
                                   {'reason': 'Waiting for Parts', 'explanation': 'Private vendor detail'})[0], 200)
        self.ticket_mail('account-4@example.test', ticket, 'personal', 'Waiting for Parts', 'Status: On Hold',
                         excludes=('Private vendor detail',))
        self.assertEqual(self.save('it', ticket, 'resume', {})[0], 200)
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'hold', {'reason': 'Waiting for User',
                                   'explanation': 'Please confirm the port', 'employeeVisible': True})[0], 200)
        self.ticket_mail('account-4@example.test', ticket, 'personal', 'Waiting for User', 'Please confirm the port')
        self.assertEqual(self.save('it', ticket, 'resume', {})[0], 200)
        self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': ''})[0], 400)
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': 'Replaced cable'})[0], 200)
        self.ticket_mail('account-4@example.test', ticket, 'personal', 'Status: Closed', 'Replaced cable')
        self.assertEqual(self.save('personal', ticket, 'reopen', {}, actor=4)[0], 200)
        self.ticket_mail('account-2@example.test', ticket, 'it', 'Open (Reopened)')
        self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': 'Reseated cable'})[0], 200)
        self.ticket_mail('account-4@example.test', ticket, 'personal', 'Reseated cable')
        with sqlite3.connect(self.path) as connection:
            connection.execute('UPDATE accounts SET active=0 WHERE id=2')
        self.assertEqual(self.save('it', ticket, 'reopen', {})[0], 200)
        self.assertEqual(self.request(self.ticket_path('it', f'/{ticket}'))[1]['technicianId'], 2)
        self.assertTrue(self.mail.empty())

    def test_department_mail_rechecks_live_membership_custody_and_verified_addresses(self):
        self.capture_ticket_mail(support_email='', defer=True)
        self.assign_device()
        previous = self.create()
        self.hand_over('department', 'dept')
        department = self.create('department')
        self.finish_mail_jobs()
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='dept' WHERE id='colleague'")
            for account in range(7, 11):
                connection.execute("INSERT INTO accounts(id,username,password_hash,active) VALUES(?,?,?,?)",
                                   (account, str(account), 'fixture', int(account != 10)))
                connection.execute("INSERT INTO account_profiles(account_id,email,email_verified) VALUES(?,?,?)",
                                   (account, f'account-{account}@example.test', int(account != 9)))
                connection.execute("""
                    INSERT INTO staff_members(id,first_name,last_name,account_id,department_id,active)
                    VALUES(?,?,'Example',?,'dept',?)
                """, (str(account), str(account), account, int(account != 8)))
        update = {'body': 'Shared update', 'employeeVisible': True}
        self.assertEqual(self.save('it', previous, 'messages', update)[0], 200)
        self.assertEqual(self.save('it', department, 'messages', update)[0], 200)
        self.finish_mail_jobs()
        for recipient in ('account-4@example.test', 'account-5@example.test', 'account-7@example.test'):
            others = {'account-4@example.test', 'account-5@example.test', 'account-7@example.test'} - {recipient}
            self.ticket_mail(recipient, department, 'department', 'Shared update', excludes=others)
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', department, 'hold', {'reason': 'Other'})[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='other' WHERE id='colleague'")
            connection.execute('UPDATE account_profiles SET email_verified=0 WHERE account_id=7')
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', department, 'department', 'Status: On Hold', 'Reason: Other')
        self.assertTrue(self.mail.empty())
        self.assert_ticket_hidden('department', department, 5)
        self.assertEqual(self.save('it', department, 'resume', {})[0], 200)
        self.assertEqual(self.save('it', department, 'close', {'resolutionNote': 'Shared fix'})[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', department, 'department', 'Shared fix')
        self.assertEqual(self.save('it', department, 'reopen', {})[0], 200)
        self.assertEqual(self.save('it', department, 'messages', update)[0], 200)
        self.hand_over('department', 'other')
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())
        self.assert_ticket_hidden('department', department, 4)
        self.assert_ticket_hidden('department', department, 5)

    def test_ticket_mail_only_after_commit_and_smtp_failure_is_optional(self):
        self.capture_ticket_mail(defer=True)
        self.assign_device()
        for actor, payload, headers, expected in (
            (5, CREATE, {}, 404),
            (4, dict(CREATE, sendEmail=False), {}, 400),
            (4, CREATE, {'X-CSRF-Token': ''}, 403),
        ):
            self.assertEqual(self.request(self.ticket_path('personal'), actor=actor, method='POST',
                                          payload=payload, headers=headers)[0], expected)
        with sqlite3.connect(self.path) as connection:
            connection.execute("""CREATE TABLE fixture_reject_commit (
                                account_id REFERENCES accounts(id) DEFERRABLE INITIALLY DEFERRED)""")
            connection.execute("""CREATE TRIGGER fixture_reject_ticket AFTER INSERT ON service_desk_events
                                WHEN NEW.kind='Created' BEGIN INSERT INTO fixture_reject_commit VALUES(-1); END""")
        self.assertEqual(self.request(self.ticket_path('personal'), actor=4, method='POST', payload=CREATE)[0], 503)
        self.assertFalse(self.mail_jobs)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM service_desk_tickets').fetchone()[0], 0)
            connection.execute('DROP TRIGGER fixture_reject_ticket')
        with patch('backend.service_desk_email.deliver_email', side_effect=smtplib.SMTPDataError(451, b'Test')) as smtp:
            ticket = self.create()
            self.assertEqual(len(self.mail_jobs), 1)
            self.finish_mail_jobs()
            smtp.assert_called_once()
        self.assertEqual(self.request(self.ticket_path('personal', f'/{ticket}'), actor=4)[1]['status'], 'Open')
        with patch('backend.account_email.MAIL_CAPACITY.acquire', return_value=False):
            queued_out = self.create()
        self.assertEqual(self.request(self.ticket_path('personal', f'/{queued_out}'), actor=4)[1]['status'], 'Open')
        self.assertFalse(self.mail_jobs)
        config_path(self.path).unlink()
        self.create()
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())

    def assert_ticket_hidden(self, scope, ticket_id, actor):
        for resource in ('', '/history', '/messages', '/attachments/1'):
            self.assertEqual(self.request(self.ticket_path(scope, f'/{ticket_id}{resource}'), actor=actor)[0], 404)
        status, search, _ = self.request(self.ticket_path(scope, f'?search={ticket_id}'), actor=actor)
        self.assertEqual(status, 200)
        self.assertEqual(search['tickets'], [])
        self.assertEqual(sum(search['counts'].values()), 0)
        self.assertEqual(self.save(scope, ticket_id, 'messages', {'body': 'Not permitted'}, actor=actor)[0], 404)

    def test_admin_calendar_changes_are_validated_audited_and_prospective(self):
        settings = '/api/settings/service-desk'
        self.assertEqual(self.request(settings, actor=None)[0], 401)
        for actor in (2, 3, 4, 6):
            self.assertEqual(self.request(settings, actor=actor)[0], 401 if actor == 6 else 403)
            self.assertEqual(self.request(settings, method='POST', actor=actor, payload={})[0], 403)
        for header in ({'X-CSRF-Token': ''}, {'Origin': 'https://outside.example'}):
            self.assertEqual(self.request(settings, method='POST', payload={}, headers=header)[0], 403)
        with sqlite3.connect(self.path) as connection:
            activate_deployment_timezone(connection, 'Europe/London')
        initial = self.request(settings)[1]['serviceDesk']
        self.assertEqual(initial['timezone'], 'Europe/London')
        self.assertEqual(initial['excludedDates'], [])
        self.assertEqual(initial['workingHours'], DEFAULT_WORKING_HOURS)
        working = initial['workingHours']
        working[0]['end'] = '09:00'
        payload = {'action': 'working-hours', 'calendarRevision': initial['calendarRevision'],
                   'workingHours': working}
        self.assertEqual(self.request(settings, method='POST', payload=payload)[0], 400)
        working[0]['end'] = '18:00'
        self.assertEqual(self.request(settings, method='POST', payload=payload)[0], 200)
        self.assertEqual(self.request(settings, method='POST', payload=payload)[0], 409)
        exclusion = {'action': 'add-date', 'date': '2026-02-30', 'reason': 'Team training'}
        self.assertEqual(self.request(settings, method='POST', payload=exclusion)[0], 400)
        exclusion['date'] = '2026-12-21'
        self.assertEqual(self.request(settings, method='POST', payload=exclusion)[0], 200)
        self.assertEqual(self.request(settings, method='POST', payload=exclusion)[0], 400)
        self.assertEqual(self.request(settings, method='POST',
                                      payload={'action': 'remove-date', 'date': exclusion['date']})[0], 200)
        self.assertEqual(self.request(settings)[1]['serviceDesk']['excludedDates'], [])
        with sqlite3.connect(self.path) as connection:
            rows = connection.execute("""
                SELECT effective_at,saved_by,timezone_name FROM service_desk_calendars ORDER BY id
            """).fetchall()
            audit = [json.loads(row[0]) for row in connection.execute('SELECT record_json FROM inventory_change_history')]
            self.assertEqual(visible_change_history(connection, 1), audit)
            self.assertEqual(visible_change_history(connection, 2), [])
        self.assertEqual([row[1] for row in rows], [None, 1, 1, 1])
        self.assertEqual([row[2] for row in rows], ['Europe/London'] * 4)
        self.assertEqual([event['changes'][0]['after']['effectiveAt'] for event in audit], [row[0] for row in rows[1:]])
        self.assertEqual({event['actorId'] for event in audit}, {1})

    def test_category_management_preserves_labels_identity_and_software_selection(self):
        settings = '/api/settings/service-desk'
        self.assign_device()
        original = self.create('personal', categoryId=SOFTWARE_TICKET_CATEGORY_ID, affectedSoftware='other')
        rename = {'action': 'rename-category', 'id': SOFTWARE_TICKET_CATEGORY_ID,
                  'name': 'Applications', 'previousName': 'Software / Applications'}
        self.assertEqual(self.request(settings, method='POST', payload=rename)[0], 200)
        revised = self.create('personal', categoryId=SOFTWARE_TICKET_CATEGORY_ID, affectedSoftware='other')
        self.assertEqual(self.request(settings, method='POST',
                                      payload={'action': 'add-category', 'name': 'applications'})[0], 400)
        self.assertEqual(self.request(settings, method='POST', payload={'action': 'add-category', 'name': 'VPN'})[0], 200)
        self.assertEqual(self.request(settings, method='POST',
                                      payload={'action': 'hide-category', 'id': OTHER_TICKET_CATEGORY_ID})[0], 400)
        visibility = {'action': 'hide-category', 'id': SOFTWARE_TICKET_CATEGORY_ID}
        self.assertEqual(self.request(settings, method='POST', payload=visibility)[0], 200)
        for scope, actor in (('personal', 4), ('it', 2)):
            categories = self.request(f'{SERVICE_DESK}/{scope}/categories', actor=actor)[1]
            self.assertNotIn(SOFTWARE_TICKET_CATEGORY_ID, [entry['id'] for entry in categories['categories']])
            self.assertEqual(categories['categories'][-1]['id'], OTHER_TICKET_CATEGORY_ID)
        rejected = dict(CREATE, categoryId=SOFTWARE_TICKET_CATEGORY_ID)
        self.assertEqual(self.request(self.ticket_path('personal'), method='POST', actor=4, payload=rejected)[0], 400)
        self.assertEqual(self.request(settings, method='POST', payload=dict(visibility, action='restore-category'))[0], 200)
        for ticket, label in ((original, 'Software / Applications'), (revised, 'Applications')):
            detail = self.request(self.ticket_path('personal', f'/{ticket}'), actor=4)[1]
            self.assertEqual((detail['categoryId'], detail['category'], detail['affectedSoftware']),
                             (SOFTWARE_TICKET_CATEGORY_ID, label, 'Other / Not Listed'))
        self.assertEqual(self.save('it', original, 'category', {'categoryId': 5})[0], 200)
        change = self.request(self.ticket_path('it', f'/{original}/history'))[1]['history'][-1]['details']
        self.assertEqual(change['previousAffectedSoftware'], 'Other / Not Listed')

    def test_reporting_uses_actual_actors_separate_attempts_and_local_event_dates(self):
        report = f'{SERVICE_DESK}/it/report'
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=3 AND section='Service Desk'")
            connection.executemany('UPDATE accounts SET username=? WHERE id=?', [('Alex', 1), ('Sam', 2), ('Dave', 3)])
        with sqlite3.connect(self.path) as connection:
            activate_deployment_timezone(connection, 'Europe/London', at='2026-06-01T00:00:00.000000Z')
        self.assertEqual(self.request(report, actor=4)[0], 403)
        self.assertEqual(self.request(report, method='POST', actor=4, payload={'period': 'today'})[0], 403)
        self.assertEqual(self.request(report, actor=2)[1]['preference']['period'], 'this-month')
        day = {'period': 'custom', 'from': '2026-06-15', 'to': '2026-06-15'}
        with patch('backend.service_desk.utc_timestamp', return_value='2026-06-14T23:00:00.000000Z'):
            ticket = self.create('it', actor=1)
        with patch('backend.service_desk.utc_timestamp', return_value='2026-06-15T09:00:00.000000Z'):
            self.assertEqual(self.save('it', ticket, 'assign', {'technicianId': 2})[0], 200)
        current = self.request(report, method='POST', payload=day)[1]
        self.assertEqual(current['counts'], {'created': 1, 'closed': 0, 'reopened': 0})
        self.assertIsNone(current['averageSeconds'])
        self.assertFalse(current['durationUnavailable'])
        self.assertTrue(all(person['started'] == 0 for person in current['technicians']))
        for at, action, payload, actor in (
            ('09:15:00', 'messages', {'body': 'I reproduced the fault.'}, 2),
            ('09:30:00', 'messages', {'body': 'We have a workaround.', 'employeeVisible': True}, 3),
            ('10:00:00', 'close', {'resolutionNote': 'Fixed.'}, 3),
            ('10:30:00', 'messages', {'body': 'Internal follow-up.'}, 1),
            ('11:00:00', 'reopen', {}, 1),
            ('12:00:00', 'close', {'resolutionNote': 'Fixed again.'}, 2),
            ('22:59:59', 'reopen', {}, 1),
        ):
            with patch('backend.service_desk.utc_timestamp', return_value=f'2026-06-15T{at}.000000Z'):
                self.assertEqual(self.save('it', ticket, action, payload, actor=actor)[0], 200)
        current = self.request(report)[1]
        self.assertEqual(current['counts'], {'created': 1, 'closed': 2, 'reopened': 2})
        self.assertEqual({person['name']: (person['started'], person['closed']) for person in current['technicians']},
                         {'Alex': (0, 0), 'Sam': (2, 1), 'Dave': (0, 1)})
        self.assertEqual(current['averageSeconds'], (7200 + 3600) / 2)
        self.assertEqual(self.request(self.ticket_path('it', f'/{ticket}'))[1]['technician'], 'Sam')
        self.assertEqual(self.request(report, actor=2)[1]['preference']['period'], 'this-month')
        self.request(report, method='POST', payload={'period': 'today'})
        self.assertEqual(self.request(report)[1]['preference'], dict(day, period='today'))
        with patch('backend.service_desk.utc_timestamp', return_value='2026-06-15T23:00:00.000000Z'):
            self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': 'Final fix.'}, actor=2)[0], 200)
        next_day = self.request(report, method='POST', payload=dict(day, **{'from':'2026-06-16', 'to':'2026-06-16'}))[1]
        self.assertEqual(next_day['counts'], {'created': 0, 'closed': 1, 'reopened': 0})
        self.assertEqual(next_day['averageSeconds'], 0)

    def test_timezone_recovery_keeps_incomplete_closures_out_of_average(self):
        report = f'{SERVICE_DESK}/it/report'
        day = {'period': 'custom', 'from': '2026-06-15', 'to': '2026-06-15'}
        with sqlite3.connect(self.path) as connection:
            activate_deployment_timezone(connection, 'Invalid/Zone', at='2026-06-15T08:00:00.000000Z')
        missing = self.request(report, method='POST', payload=day)[1]
        self.assertFalse(missing['available'])
        self.assertTrue(missing['timezoneWarning'])
        non_admin = self.request(report, actor=2)[1]
        self.assertFalse(non_admin['available'])
        self.assertFalse(non_admin['timezoneWarning'])
        with patch('backend.service_desk.utc_timestamp', return_value='2026-06-15T09:00:00.000000Z'):
            first = self.create('it', actor=1)
            self.assertEqual(self.save('it', first, 'close', {'resolutionNote': 'Fixed.'})[0], 200)
        with sqlite3.connect(self.path) as connection:
            activate_deployment_timezone(connection, 'Europe/London', at='2026-06-15T10:00:00.000000Z')
        with patch('backend.service_desk.utc_timestamp', return_value='2026-06-15T11:00:00.000000Z'):
            second = self.create('it', actor=1)
            self.assertEqual(self.save('it', second, 'close', {'resolutionNote': 'Fixed.'})[0], 200)
        recovered = self.request(report)[1]
        self.assertTrue(recovered['available'])
        self.assertTrue(recovered['durationUnavailable'])
        self.assertEqual(recovered['counts'], {'created': 2, 'closed': 2, 'reopened': 0})
        self.assertIsNone(recovered['averageSeconds'])
        self.assertEqual(self.request(report, method='POST', actor=1, payload=dict(day, **{'to': '2026-06-14'}))[0], 400)
        self.assertEqual(self.request(report, method='POST', actor=1, payload=dict(day, **{'unapproved': True}))[0], 400)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.assertEqual(self.request(report)[1]['counts'], {'created': 0, 'closed': 0, 'reopened': 0})

    def test_creation_and_effective_technician_permissions(self):
        self.assertEqual(self.request(self.ticket_path('personal'), method='POST', actor=4, payload=CREATE)[0], 404)
        self.assertEqual(self.request(self.ticket_path('it'), actor=5)[0], 403)
        self.assertEqual(self.request(self.ticket_path('it'), actor=6)[0], 401)
        self.assertEqual(self.request(self.ticket_path('personal'), actor=None)[0], 401)
        self.assertEqual(self.request(self.ticket_path('it'), method='POST', actor=3, payload=CREATE)[0], 403)
        unassigned = self.create('it', actor=2)
        self.assert_ticket_hidden('personal', unassigned, 4)
        self.assign_device()
        ticket = self.create()
        self.assert_ticket_hidden('personal', unassigned, 4)
        detail = self.request(self.ticket_path('personal', f'/{ticket}'), actor=4)[1]
        self.assertEqual((detail['status'], detail['priority'], detail['technician']),
                         ('Open', 'Medium', None))
        self.assertNotIn('PRIVATE', json.dumps(detail))
        self.assertEqual(self.request('/api/inventory/devices', actor=4)[0], 403)
        self.assertEqual(self.request('/api/staff-members', actor=4)[0], 403)
        self.assertEqual(self.request(self.ticket_path('it'), actor=3)[1]['counts']['Open'], 2)
        self.assertEqual(self.request(self.ticket_path('personal'), method='POST', actor=4,
                                      payload=dict(CREATE, staffId='forged'))[0], 400)
        for headers in ({'X-CSRF-Token': ''}, {'Origin': 'https://elsewhere.example'},
                        {'Sec-Fetch-Site': 'cross-site'}):
            self.assertEqual(self.request(self.ticket_path('personal'), method='POST', actor=4,
                                          payload=CREATE, headers=headers)[0], 403)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE accounts SET active=0 WHERE id=4")
            connection.execute("DELETE FROM account_permission_overrides WHERE account_id=2 AND section='Service Desk'")
        self.assertEqual(self.request(self.ticket_path('personal'), actor=4)[0], 401)
        self.assertEqual(self.request(self.ticket_path('it'), actor=2)[0], 403)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.assert_ticket_hidden('it', ticket, 1)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM service_desk_tickets').fetchone(), (2,))

    def test_current_department_and_all_three_transfer_boundaries(self):
        self.assign_device()
        personal = self.create()
        self.hand_over('department', 'dept')
        self.assert_ticket_hidden('personal', personal, 4)
        self.assert_ticket_hidden('department', personal, 4)
        shared = self.create('department')
        self.assert_ticket_hidden('department', shared, 5)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='dept' WHERE id='colleague'")
            connection.execute("UPDATE staff_members SET department_id='other' WHERE id='person'")
        self.assertEqual(self.request(self.ticket_path('department', f'/{shared}'), actor=5)[0], 200)
        self.assert_ticket_hidden('department', shared, 4)
        self.hand_over('department', 'other')
        self.assert_ticket_hidden('department', shared, 4)
        self.assert_ticket_hidden('department', shared, 5)
        second_department = self.create('department')
        self.hand_over('staff', 'person')
        self.assert_ticket_hidden('personal', second_department, 4)
        self.assert_ticket_hidden('department', second_department, 4)
        self.assert_ticket_hidden('personal', personal, 4)
        newest = self.create()
        self.assertEqual(self.request(self.ticket_path('personal', f'/{newest}'), actor=4)[0], 200)
        self.assertEqual(self.request(self.ticket_path('it'))[1]['counts']['Open'], 4)

    def test_employee_choices_filters_and_affected_software(self):
        self.assign_device()
        with sqlite3.connect(self.path) as connection:
            device = json.loads(connection.execute(
                "SELECT record_json FROM inventory_devices WHERE id='device'").fetchone()[0])
            device.update(MicrosoftOffice=True, catalogSoftware_google_chrome=True, typeDetails={
                'catalogSoftware_google_chrome': False, 'catalogSoftware_microsoft_teams': True,
                'customSoftware_drawing': True, 'serverService_Hypervisor': True,
            })
            connection.execute("UPDATE inventory_devices SET record_json=? WHERE id='device'", (json.dumps(device),))
            connection.execute("INSERT INTO inventory_settings(key,value_json) VALUES('installedSoftware',?)",
                               (json.dumps([{'key': 'customSoftware_drawing', 'label': 'Drawing Studio'}]),))
        equipment = SERVICE_DESK + '/personal/equipment'
        self.assertEqual(self.request(equipment, actor=4)[1]['equipment'],
                         [{'id':'device', 'kind':'device', 'label':'Laptop', 'type':'Laptop'}])
        self.assertEqual(self.request(SERVICE_DESK + '/department/equipment', actor=4)[1]['equipment'], [])
        self.assertEqual(self.request(equipment, actor=5)[1]['equipment'], [])
        self.assertEqual(self.request(equipment + '?staffId=person', actor=4)[0], 400)
        software = SERVICE_DESK + '/personal/software?deviceId=device'
        status, choices, _ = self.request(software, actor=4)
        self.assertEqual(status, 200)
        self.assertEqual([choice['key'] for choice in choices['software']],
                         ['customSoftware_drawing', 'MicrosoftOffice', 'catalogSoftware_microsoft_teams', 'other'])
        self.assertEqual(self.request(software, actor=5)[0], 404)
        self.assertEqual(self.request(SERVICE_DESK + '/department/software?deviceId=device', actor=4)[0], 404)
        self.assertEqual(self.request(SERVICE_DESK + '/personal/software?deviceId=missing', actor=4)[0], 404)
        categories = self.request(SERVICE_DESK + '/personal/categories', actor=4)[1]['categories']
        names = [entry['name'] for entry in categories]
        self.assertEqual(names[:-1], sorted(names[:-1], key=str.casefold))
        self.assertEqual(names[-1], 'Other / Not Listed')
        category = next(entry['id'] for entry in categories if entry['name'] == 'Software / Applications')
        for fields in ({'categoryId': ''}, {'subject': ' '}, {'description': ' '},
                       {'affectedSoftware': 'other'}, {'categoryId': category, 'affectedSoftware': 'Microsoft Teams'},
                       {'categoryId': category, 'affectedSoftware': 'catalogSoftware_google_chrome'},
                       {'categoryId': category, 'affectedSoftware': True}):
            self.assertEqual(self.request(self.ticket_path('personal'), method='POST', actor=4,
                                          payload=dict(CREATE, **fields))[0], 400, fields)
        first = self.create(categoryId=category, affectedSoftware='customSoftware_drawing')
        second = self.create(categoryId=category, affectedSoftware='other')
        blank = self.create(categoryId=category)
        for ticket, expected in ((first, 'Drawing Studio'), (second, 'Other / Not Listed'), (blank, None)):
            for scope, actor in (('personal', 4), ('it', 2)):
                detail = self.request(self.ticket_path(scope, f'/{ticket}'), actor=actor)[1]
                self.assertEqual(detail['affectedSoftware'], expected)
        self.assertEqual(self.save('personal', first, 'category', {'categoryId': 5}, actor=4)[0], 403)
        self.assertEqual(self.save('it', first, 'category', {'categoryId': 5}, actor=2)[0], 200)
        detail = self.request(self.ticket_path('personal', f'/{first}'), actor=4)[1]
        self.assertIsNone(detail['affectedSoftware'])
        events = self.request(self.ticket_path('personal', f'/{first}/history'), actor=4)[1]['history']
        self.assertEqual(events[0]['details']['affectedSoftware'], 'Drawing Studio')
        self.assertEqual(events[-1]['details']['previousAffectedSoftware'], 'Drawing Studio')
        self.assertEqual(events[-1]['details']['previousCategory'], 'Software / Applications')
        self.assertEqual(events[-1]['author'], 'account-2')
        other = self.create('it', actor=2, subject='Another assigned request')
        for sort, expected in (('oldest', [second, blank, first, other]),
                               ('newest', [other, first, blank, second]), ('ticket', [other, blank, second, first])):
            result = self.request(self.ticket_path('personal', f'?sort={sort}&status=Open'), actor=4)[1]
            self.assertEqual([ticket['id'] for ticket in result['tickets']], expected)
            self.assertEqual(result['filteredTotal'], 4)
        result = self.request(self.ticket_path('personal', f'?search=SD-{first:04}&equipmentKind=device&equipmentId=device'),
                              actor=4)[1]
        self.assertEqual([ticket['id'] for ticket in result['tickets']], [first])
        self.assertEqual(result['workloadCounts']['Open'], 4)
        self.assertEqual(self.request(self.ticket_path('personal', '?assignment=mine'), actor=4)[0], 400)
        self.assertEqual(self.request(self.ticket_path('personal', '?sort=invalid'), actor=4)[0], 400)
        self.assertEqual(self.save('it', other, 'close', {'resolutionNote': 'Checked'})[0], 200)
        self.assertEqual(self.save('personal', other, 'reopen', {}, actor=4)[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.assertEqual(self.request(equipment, actor=4)[1]['equipment'], [])
        self.assertEqual(self.request(software, actor=4)[0], 404)

    def test_employee_non_author_reopen_and_attachment_permissions(self):
        self.assign_device('department', 'dept')
        file = {'filename': 'details.txt', 'contents': base64.b64encode(b'Employee-visible details').decode()}
        wrong_file = {'filename': 'details.pdf', 'contents': file['contents']}
        path = self.ticket_path('department')
        self.assertEqual(self.request(path, method='POST', actor=4,
                                      payload=dict(CREATE, attachments=[wrong_file]))[0], 400)
        ticket = self.create('department', attachments=[file])
        linked_by_it = self.create('it', actor=2, subject='IT-created shared request')
        self.assert_ticket_hidden('personal', ticket, 4)
        self.assert_ticket_hidden('personal', linked_by_it, 4)
        self.assertEqual(self.save('it', ticket, 'assign', {'technicianId': 2})[0], 200)
        for target in (ticket, linked_by_it):
            self.assertEqual(self.save('it', target, 'close', {'resolutionNote': 'Checked'})[0], 200)
            self.assertEqual(self.save('department', target, 'reopen', {}, actor=5)[0], 404)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='dept' WHERE id='colleague'")
        reply = {'body': 'The issue is still occurring.', 'attachments': [file]}
        self.assertEqual(self.save('department', ticket, 'messages', reply, actor=5)[0], 409)
        for target in (ticket, linked_by_it):
            self.assertEqual(self.save('department', target, 'reopen', {}, actor=5)[0], 200)
            self.assertEqual(self.save('department', target, 'reopen', {}, actor=5)[0], 409)
        self.assertEqual(self.save('department', ticket, 'messages', dict(reply, employeeVisible=False), actor=5)[0], 400)
        self.assertEqual(self.save('department', ticket, 'messages', dict(reply, attachments=[wrong_file]), actor=5)[0], 400)
        self.assertEqual(self.save('department', ticket, 'messages', reply, actor=5)[0], 200)
        updates = self.request(path + f'/{ticket}/messages', actor=5)[1]
        self.assertEqual(len(updates['attachments']), 2)
        attachment = updates['attachments'][-1]['id']
        self.assertEqual(self.download('department', ticket, attachment, 5)[:2], (200, b'Employee-visible details'))
        self.assertEqual(self.save('department', ticket, f'attachments/{attachment}', {}, actor=5)[0], 404)
        detail = self.request(path + f'/{ticket}', actor=5)[1]
        self.assertEqual(detail['status'], 'Open')
        self.assertIsNotNone(detail['technician'])
        history = self.request(self.ticket_path('it', f'/{ticket}/history'))[1]
        self.assertIsNotNone(history['closureAttempts'][0]['reopenedEventId'])
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id='other' WHERE id='colleague'")
        self.assertEqual(self.download('department', ticket, attachment, 5)[0], 404)
        self.hand_over('staff', 'person')
        self.assertEqual(self.download('department', ticket, attachment, 4)[0], 404)
        self.assertEqual(self.download('it', ticket, attachment, 2)[0], 200)
        self.assertEqual(self.save('personal', ticket, 'reopen', {}, actor=4)[0], 404)

    def test_internal_history_attachments_and_closure_attempts(self):
        self.assign_device()
        ticket = self.create()
        self.assertEqual(self.save('personal', ticket, 'messages', {'body': 'Employee reply'}, actor=4)[0], 200)
        private = self.save('it', ticket, 'messages', {'body': 'Internal IT note'})[1]['id']
        public = self.save('it', ticket, 'messages',
                           {'body': 'Public update', 'employeeVisible': True})[1]['id']
        self.assertEqual(self.save('it', ticket, f'messages/{private}', {'body':'Internal note corrected'},
                                   actor=2)[0], 404)
        self.assertEqual(self.save('it', ticket, f'messages/{private}', {'body':'Internal note corrected'})[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            ids = [connection.execute("""INSERT INTO service_desk_attachments(ticket_id,message_id,filename,contents)
                                        VALUES(?,?,'report.txt',?)""", (ticket, message, contents)).lastrowid
                   for message, contents in ((private, b'internal'), (public, b'public'))]
        self.assertEqual(self.download('personal', ticket, ids[0], 4)[0], 404)
        self.assertEqual(self.download('it', ticket, ids[0], 2), (200, b'internal', 'no-store'))
        self.assertEqual(self.download('personal', ticket, ids[1], 4), (200, b'public', 'no-store'))
        self.assertEqual(self.save('it', ticket, 'assign', {'technicianId': 2})[0], 200)
        self.assertEqual(self.save('it', ticket, 'assign', {'technicianId': 1, 'reason': 'Sickness',
                                                            'explanation': 'Internal assignment reason'})[0], 200)
        self.assertEqual(self.save('it', ticket, 'hold', {'reason': 'Waiting for Parts',
                                                         'explanation': 'Internal supplier explanation'})[0], 200)
        self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': 'Premature'})[0], 409)
        self.assertEqual(self.save('it', ticket, 'resume', {})[0], 200)
        for attempt in range(2):
            self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': f'Checked {attempt}'}, actor=2)[0], 200)
            self.assertEqual(self.save('personal', ticket, 'messages', {'body': 'Needs reopening'}, actor=4)[0], 409)
            self.assertEqual(self.save('personal', ticket, 'reopen', {}, actor=4)[0], 200)
        for suffix in ('/history', '/messages'):
            visible = json.dumps(self.request(self.ticket_path('personal', f'/{ticket}{suffix}'), actor=4)[1])
            self.assertNotIn('Internal', visible)
        history = self.request(self.ticket_path('it', f'/{ticket}/history'), actor=2)[1]
        self.assertEqual(len(history['closureAttempts']), 2)
        self.assertTrue(all(attempt['reopenedEventId'] for attempt in history['closureAttempts']))
        corrections = [event['details'] for event in history['history'] if event['kind'] == 'Message Edited']
        self.assertEqual(corrections, [{'messageId':private,'previousBody':'Internal IT note'}])
        self.assertEqual(self.save('it', ticket, 'hold', {'reason':'Waiting for User',
            'explanation':'Please confirm a time to call.', 'employeeVisible':True})[0], 200)
        visible_history = self.request(self.ticket_path('personal', f'/{ticket}/history'), actor=4)[1]
        self.assertEqual(visible_history['history'][-1]['details']['explanation'], 'Please confirm a time to call.')
        self.assertEqual([event['author'] for event in history['history'] if event['kind'] == 'Closed'],
                         ['account-2', 'account-2'])
        self.assertEqual([event['author'] for event in history['history'] if event['kind'] == 'Reopened'],
                         ['account-4', 'account-4'])
        self.assertIn('Internal assignment reason', json.dumps(history))

    def test_queue_filters_classification_and_stale_actions(self):
        self.assign_device()
        first = self.create('it', actor=2, subject='Drive unavailable')
        second = self.create('it', actor=2, subject='Printer unavailable')
        self.assertEqual(self.save('it', second, 'assign', {'technicianId': 2})[0], 200)
        detail_path = self.ticket_path('it', f'/{first}')
        detail = self.request(detail_path, actor=2)[1]
        self.assertTrue(detail['canEdit'])
        self.assertFalse(self.request(detail_path, actor=3)[1]['canEdit'])
        self.assertEqual(self.save('it', first, 'priority', {'priority':'High'}, actor=3)[0], 403)
        self.assertEqual(self.save('personal', first, 'category', {'categoryId':1}, actor=4)[0], 403)
        self.assertEqual(self.save('it', first, 'category', {'categoryId':0})[0], 400)
        self.assertEqual(self.save('it', first, 'priority', {'priority':'Urgent'})[0], 400)
        for action, payload in (('priority', {'priority':'High'}), ('category', {'categoryId':1})):
            self.assertEqual(self.save('it', first, action, payload)[0], 200)
        status, queue, _ = self.request(self.ticket_path('it',
            '?search=SD-0001&status=Open&priority=High&assignment=unassigned&sort=oldest'), actor=2)
        self.assertEqual(status, 200)
        self.assertEqual([row['id'] for row in queue['tickets']], [first])
        self.assertEqual(queue['filteredTotal'], 1)
        self.assertEqual(queue['workloadCounts']['Open'], 1)
        self.assertEqual(queue['workloadCounts']['In Progress'], 1)
        status, queue, _ = self.request(self.ticket_path('it', '?assignment=mine&technician=2'), actor=2)
        self.assertEqual(status, 200)
        self.assertEqual([row['id'] for row in queue['tickets']], [second])
        status, queue, _ = self.request(self.ticket_path('it', '?search=Alex%20Example&equipmentKind=device&equipmentId=device'))
        self.assertEqual(status, 200)
        self.assertEqual(queue['filteredTotal'], 2)
        self.assertEqual(self.request(detail_path + '/technicians', actor=3)[0], 403)
        self.assertNotIn(2, [entry['id'] for entry in self.request(
            self.ticket_path('it', f'/{second}/technicians'))[1]['technicians']])
        self.assertEqual(self.request(SERVICE_DESK + '/it/equipment', actor=3)[0], 403)
        self.assertEqual(self.request(SERVICE_DESK + '/it/equipment', actor=2)[1]['equipment'][0]['id'], 'device')
        latest = self.request(detail_path)[1]['updatedAt']
        with ThreadPoolExecutor(2) as workers:
            def place_on_hold(actor):
                return self.save('it', first, 'hold', {'reason':'Waiting for Parts',
                    'expectedUpdatedAt':latest}, actor=actor)[0]
            self.assertEqual(sorted(workers.map(place_on_hold, (1, 2))), [200, 409])
        self.assertEqual(self.request(detail_path)[1]['statusBeforeHold'], 'Open')
        self.assertEqual(self.save('it', first, 'resume', {})[0], 200)
        self.assertEqual(self.request(detail_path)[1]['status'], 'Open')
        self.assertEqual(self.save('it', first, 'close', {'resolutionNote':'  '})[0], 400)
        history = self.request(detail_path + '/history')[1]['history']
        self.assertEqual([event['kind'] for event in history],
                         ['Created','Priority Changed','Category Changed','Status Changed','Status Changed'])

    def test_uploaded_attachments_visibility_removal_and_revocation(self):
        self.assign_device()
        initial_file = {'filename':'check-équipement.txt','contents':base64.b64encode(b'Equipment report').decode()}
        ticket = self.create('it', actor=2, attachments=[initial_file])
        path = self.ticket_path('it', f'/{ticket}')
        messages = self.request(path + '/messages')[1]
        original, = messages['attachments']
        original_id = original['id']
        self.assertFalse(messages['messages'][0]['editable'])
        self.assertEqual(self.download('personal', ticket, original_id, 4)[1], b'Equipment report')
        private_path = self.ticket_path('it', f'/{ticket}/messages')
        internal_file = {'filename':'technician-only.txt','contents':base64.b64encode(b'Internal analysis').decode()}
        update = {'body':'Technician analysis', 'attachments':[internal_file]}
        for actor, headers in ((None, {}), (3, {}), (4, {}), (2, {'X-CSRF-Token':''}),
                               (2, {'Origin':'https://elsewhere.example'})):
            self.assertEqual(self.request(private_path, method='POST', actor=actor,
                                          payload=update, headers=headers)[0], 403)
        self.assertEqual(self.request(private_path, method='POST', actor=2, payload=update)[0], 200)
        private = self.request(path + '/messages')[1]['attachments'][-1]
        self.assertEqual(self.download('personal', ticket, private['id'], 4)[0], 404)
        client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        self.addCleanup(client.close)
        client.request('GET', path + f"/attachments/{private['id']}",
                       headers={'Cookie':COOKIE_NAME + '=' + self.tokens[2]})
        response = client.getresponse()
        self.assertEqual(response.status, 200)
        self.assertEqual(response.getheader('Content-Type'), 'application/octet-stream')
        self.assertEqual(response.getheader('X-Content-Type-Options'), 'nosniff')
        self.assertTrue(response.getheader('Content-Disposition').startswith('attachment;'))
        self.assertEqual(response.read(), b'Internal analysis')
        for actor in (None, 3, 4):
            self.assertEqual(self.save('it', ticket, f"attachments/{private['id']}", {}, actor=actor)[0], 403)
        self.assertEqual(self.save('it', ticket, f"attachments/{private['id']}", {}, actor=2)[0], 200)
        self.assertEqual(self.save('it', ticket, f"attachments/{private['id']}", {}, actor=2)[0], 404)
        self.assertEqual(self.request(private_path, method='POST', actor=2, payload=update)[0], 200)
        self.assertEqual(self.download('it', ticket, private['id'], 2)[0], 404)
        private_events = self.request(path + '/history')[1]['history']
        self.assertEqual([event['author'] for event in private_events
                          if event['details'].get('removedAttachmentId') == private['id']], ['account-2'])
        self.assertNotIn('technician-only.txt', json.dumps(self.request(
            self.ticket_path('personal', f'/{ticket}/history'), actor=4)[1]))
        self.hand_over('department', 'dept')
        self.assertEqual(self.download('personal', ticket, original_id, 4)[0], 404)
        self.assertEqual(self.download('it', ticket, original_id, 2)[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute('UPDATE accounts SET active=0 WHERE id=2')
        self.assertEqual(self.download('it', ticket, original_id, 2)[0], 401)
        self.assertEqual(self.request(private_path, method='POST', actor=2, payload=update)[0], 403)

    def test_upload_validation_and_simultaneous_retained_limit(self):
        good = {'filename':'notes.txt','contents':base64.b64encode(b'New attachment').decode()}
        create_path = self.ticket_path('it')
        for bad in (dict(good, filename='../notes.txt'), dict(good, filename='notes.pdf'),
                    dict(good, contents='invalid base64'), dict(good, filename='notes.exe')):
            self.assertEqual(self.request(create_path, method='POST',
                payload=dict(CREATE, attachments=[good, bad]))[0], 400)
        self.assertEqual(self.request(create_path)[1]['tickets'], [])
        ticket = self.create('it', actor=2, attachments=[good])
        message_path = self.ticket_path('it', f'/{ticket}/messages')
        frozen_files = self.request(message_path)[1]['attachments']
        # Lower the allowance so two real requests can exercise the write lock without large fixtures.
        with patch('backend.service_desk_attachments.MAX_RETAINED_TICKET_BYTES', 28):
            with ThreadPoolExecutor(2) as workers:
                def upload(actor):
                    return self.request(message_path, method='POST', actor=actor,
                                        payload={'body':'Concurrent update','attachments':[good]})[0]
                self.assertEqual(sorted(workers.map(upload, (1, 2))), [200, 400])
            with ThreadPoolExecutor(2) as workers:
                def add_note(actor):
                    return self.request(message_path, method='POST', actor=actor,
                                        payload={'body':'Independent technician note'})[0]
                self.assertEqual(list(workers.map(add_note, (1, 2))), [200, 200])
            data = self.request(message_path)[1]
            self.assertEqual(len(data['attachments']), 2)
            self.assertEqual(len(data['messages']), 4)
            self.assertEqual(self.save('it', ticket, f"attachments/{frozen_files[0]['id']}", {})[0], 200)
            self.assertEqual(upload(2), 200)

    def test_stock_correction_cannot_reopen_prior_ticket_visibility(self):
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            connection.commit()
            receipt = dict(receipt_payload(), quantity=2, readyQuantity=2,
                           checks={'itemsChecked': True, 'conditionChecked': True})
            asset = receive_stock(connection, 1, self.tokens[1], receipt)['stockItemId']
            item = stock_item(connection, asset)
            self.assertGreaterEqual(item['balances']['readyToIssue'], 2)
            issue_stock(connection, 1, self.tokens[1], issue_payload(connection, asset, quantity=2))
            issue = stock_issue_records(connection)[0]
        fields = dict(equipmentKind='stockItem', equipmentId=asset, stockIssueId=issue['id'])
        ticket = self.create(**fields)
        self.assertEqual(self.save('personal', ticket, 'messages', {'body': 'Previous context'}, actor=4)[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            return_stock(connection, 1, self.tokens[1], return_payload(issue, quantityReturned=2))
            returned = connection.execute("""SELECT e.id FROM it_asset_stock_entries e
                JOIN it_asset_stock_movements m ON m.id=e.movement_id WHERE m.kind='returned'""").fetchone()[0]
            self.assertEqual(stock_issue_records(connection)[0]['outstanding'], 0)
        self.assert_ticket_hidden('personal', ticket, 4)
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            save_stock_correction(connection, 1, self.tokens[1], correction_payload(connection, returned, 1))
            corrected = stock_issue_records(connection)[0]
            self.assertEqual((corrected['id'], corrected['outstanding']), (issue['id'], 1))
        self.assert_ticket_hidden('personal', ticket, 4)
        new_ticket = self.create(**fields)
        listing = self.request(self.ticket_path('personal'), actor=4)[1]
        self.assertEqual([row['id'] for row in listing['tickets']], [new_ticket])
        old_messages = self.request(self.ticket_path('it', f'/{ticket}/messages'))[1]
        self.assertEqual(old_messages['messages'][0]['body'], 'Previous context')

    def test_device_deletion_and_compatible_inventory_replacement(self):
        export = legacy_export()
        export['caffootBackup'] = {
            'format': 'caffoot-inventory', 'schemaVersion': 1, 'app': 'Caffoot Lite',
            'appVersion': '1.3.3', 'exportedAt': '2026-11-20T12:00:00Z',
        }

        def replace_inventory(candidate, expected):
            status, result, _ = self.request('/api/import/preview', method='POST',
                raw=json.dumps(candidate).encode(), headers={'Content-Type': 'application/octet-stream'})
            if expected == 400:
                self.assertEqual(status, expected, result)
                self.assertEqual(result['code'], 'protected_devices')
                self.assertNotIn('draftId', result)
                return result
            self.assertEqual(status, 200, result)
            status, result, _ = self.request('/api/import/confirm', method='POST',
                payload={'draftId': result['draftId'], 'replacementConfirmed': True})
            self.assertEqual(status, expected, result)
            return result

        replace_inventory(export, 200)
        identity = export['devices'][0]['id']
        ticket = self.create('it', actor=1, equipmentId=identity)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE inventory_devices SET revision=3 WHERE id=?", (identity,))
            unlinked = dict(id='spare', name='Spare equipment', type='Laptop', status='Active')
            connection.execute("INSERT INTO inventory_devices VALUES('spare','Spare equipment',?,0,1)",
                               (json.dumps(unlinked),))

        for device_id, expected in ((identity, 400), ('spare', 200)):
            status, result, _ = self.request('/api/devices/edit/start', method='POST', payload={'deviceId': device_id})
            self.assertEqual(status, 200, result)
            status, result, _ = self.request('/api/devices/delete', method='POST',
                                             payload={'deviceId': device_id, 'revision': result['revision']})
            self.assertEqual(status, expected, result)
            if expected == 400:
                self.assertIn('protected history', result['error'])

        replacement_device = dict(id='replacement', name='Replacement', type='Desktop',
                                  mountType='Desktop', primaryIp='')
        with sqlite3.connect(self.path) as connection:
            before = tuple(connection.iterdump())
        rejected = replace_inventory(dict(export, devices=[replacement_device], ipAllocations={}), 400)
        self.assertIn('protected history', rejected['error'])
        changed = replace_inventory(dict(export, devices=[dict(export['devices'][0], name='Different')]), 400)
        self.assertIn('protected history', changed['error'])
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(tuple(connection.iterdump()), before)
        replace_inventory(dict(export, devices=[replacement_device, export['devices'][0]]), 200)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(connection.execute(
                'SELECT id,revision,ordinal FROM inventory_devices ORDER BY ordinal'
            ).fetchall(), [('replacement', 0, 0), (identity, 3, 1)])
            self.assertEqual(connection.execute('PRAGMA foreign_key_check').fetchall(), [])
        self.assertEqual(self.request(self.ticket_path('it', f'/{ticket}'))[1]['equipmentId'], identity)

    def populate_reset_fixture(self):
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN "
                               "('it_assets','suppliers','equipment_lifecycle')")
            returned = dict(id='returned', name='Returned Laptop', type='Laptop', status='Active')
            connection.execute('INSERT INTO inventory_devices VALUES(?,?,?,0,1)',
                               ('returned', returned['name'], json.dumps(returned)))
        self.assign_device()
        self.hand_over('department', 'dept')
        status, result, _ = self.request('/api/equipment/assignments', method='POST', payload={
            'recipientKind': 'staff', 'recipientId': 'person', 'devices': [{'id': 'returned', 'revision': 0}],
        })
        self.assertEqual(status, 200, result)

        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            assignment_id = connection.execute(
                "SELECT id FROM device_assignments WHERE device_id='returned'").fetchone()[0]
            source = legacy_device_issue(connection, assignment_id)
            physical_return = return_payload(source)
            physical_return['deviceAssignmentId'] = physical_return.pop('issueEntryId')
            return_stock(connection, 1, self.tokens[1], physical_return)
            receipt = dict(receipt_payload(), quantity=4, readyQuantity=4,
                           checks={'itemsChecked': True, 'conditionChecked': True})
            asset = receive_stock(connection, 1, self.tokens[1], receipt)['stockItemId']
            issue_stock(connection, 1, self.tokens[1], issue_payload(
                connection, asset, quantity=3, recipientKind='department', recipientId='dept',
            ))
            issue = stock_issue_records(connection)[0]
            return_stock(connection, 1, self.tokens[1], return_payload(issue, quantityReturned=2))
            stock_return = connection.execute("""
                SELECT id FROM it_asset_stock_entries WHERE source_issue_entry_id=?
            """, (issue['id'],)).fetchone()[0]
            save_stock_correction(connection, 1, self.tokens[1], correction_payload(connection, stock_return, 1))
            issue = stock_issue_records(connection)[0]
            identity, revision = connection.execute("""
                SELECT assignment.id,device.revision FROM device_assignments assignment
                JOIN inventory_devices device ON device.id=assignment.device_id
                WHERE assignment.device_id='device' AND assignment.ended_at IS NULL
            """).fetchone()
            add_associated_equipment(connection, 1, self.tokens[1], {
                'operationId': 'clean-start-associate-equipment', 'deviceId': 'device',
                'deviceRevision': revision, 'deviceAssignmentId': identity,
                'issueEntryId': issue['id'], 'version': issue['version'],
            })
            connection.executescript("""
                INSERT INTO inventory_racks VALUES('rack','{"id":"rack","name":"Equipment Rack"}',0);
                INSERT INTO inventory_rack_accessories VALUES('shelf','rack','{"id":"shelf","rackId":"rack"}',0);
                INSERT INTO inventory_subnets VALUES('subnet','{"id":"subnet","cidr":"192.0.2.0/24"}',0);
                INSERT INTO inventory_vlans VALUES('vlan','{"id":"vlan","name":"Network"}',0);
                INSERT INTO inventory_ip_allocations VALUES('192.0.2.10','{}');
                INSERT INTO suppliers(id,name,name_key,website,description) VALUES(1,'Parts','parts','','');
                INSERT INTO supplier_locations(id,supplier_id,name,address,city,postcode,country)
                    VALUES(1,1,'Main','','','','');
                INSERT INTO supplier_contacts(id,supplier_id,name,role,phones,emails,profiles,company_wide)
                    VALUES(1,1,'Contact','','[]','[]','[]',0);
                INSERT INTO supplier_contact_locations VALUES(1,1,1);
                INSERT INTO supplier_category_assignments VALUES(1,1);
                INSERT INTO supplier_notes(supplier_id,contact_id,body,created_by,created_label,created_at)
                    VALUES(1,1,'Supplier note',1,'Administrator','2026-11-23');
                INSERT INTO supplier_issues(id,supplier_id,category_id,title,description,created_by,created_label,
                                            created_at,updated_at)
                    VALUES(1,1,1,'Delayed order','Purchasing history',1,'Administrator','2026-11-23','2026-11-23');
                INSERT INTO supplier_issue_contacts VALUES(1,1,1);
                INSERT INTO supplier_issue_updates(issue_id,body,created_by,created_label,created_at)
                    VALUES(1,'Supplier reply',1,'Administrator','2026-11-23');
                INSERT INTO device_suppliers(device_id,supplier_id) VALUES('device',1);
                INSERT INTO receipt_suppliers(receipt_id,supplier_id)
                    SELECT id,1 FROM it_asset_stock_movements WHERE kind='received';
                INSERT INTO device_lifecycle(device_id,purchase_date) VALUES('device','2026-11-20');
                UPDATE equipment_lifecycle_settings SET warranty_days=20,replacement_days=30;
                UPDATE equipment_lifecycle_types SET years=10,archived=1 WHERE id=1;
                UPDATE service_desk_categories SET hidden=1 WHERE id=1;
                UPDATE supplier_categories SET archived=1 WHERE id=1;
                UPDATE supplier_issue_categories SET archived=1 WHERE id=1;
                INSERT INTO staff_members(id,first_name,department_id) VALUES('unlinked','Jordan','dept');
                INSERT INTO account_profiles(account_id,first_name,last_name,display_name,email,email_verified)
                    VALUES(4,'Alex','Example','Alex E','alex@example.test',1);
                INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at,challenge_id,attempts)
                    VALUES('fixture-proof',4,'verify','alex@example.test',9999999999,'fixture-challenge',2);
                INSERT INTO account_email_attempts(account_id,purpose,attempted_at) VALUES(4,'verify',1);
            """)

    def test_clean_start_clears_all_operational_modules_and_rolls_back_on_failure(self):
        self.populate_reset_fixture()
        ticket = self.create('department')
        reply = self.save('department', ticket, 'messages', {'body': 'Staff reply'}, actor=4)[1]['id']
        self.assertTrue(reply)
        message = self.save('it', ticket, 'messages', {'body': 'Private ticket content'})[1]['id']
        snapshot = self.request(self.ticket_path('it', f'/{ticket}/messages'), actor=3)[1]
        self.assertEqual(self.save('it', ticket, 'read', {'proof': snapshot['readProof']}, actor=3)[0], 200)
        self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': 'Checked'})[0], 200)
        self.assertEqual(self.save('it', ticket, 'reopen', {})[0], 200)
        self.assertEqual(self.save('it', ticket, 'close', {'resolutionNote': 'Checked again'})[0], 200)
        retained_tables = ('accounts', 'account_profiles', 'account_sessions', 'account_email_proofs',
                           'account_email_attempts', 'roles', 'role_grants', 'account_roles',
                           'account_permission_overrides', 'organisation_features')
        cleared_tables = (
            'service_desk_tickets', 'service_desk_events', 'service_desk_messages', 'service_desk_message_reads',
            'service_desk_attachments', 'service_desk_closures', 'inventory_devices', 'inventory_racks',
            'inventory_rack_accessories', 'inventory_subnets', 'inventory_vlans', 'inventory_ip_allocations',
            'device_assignments', 'device_equipment_associations',
            'it_asset_stock_items', 'it_asset_stock_units', 'it_asset_stock_movements', 'it_asset_stock_entries',
            'departments', 'device_lifecycle', 'device_suppliers', 'receipt_suppliers', 'suppliers',
            'supplier_supply_history', 'supplier_locations', 'supplier_contacts', 'supplier_contact_locations',
            'supplier_category_assignments', 'supplier_notes', 'supplier_issues', 'supplier_issue_contacts',
            'supplier_issue_updates',
        )
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE organisation_features SET enabled=0 WHERE feature IN "
                               "('it_assets','suppliers','equipment_lifecycle')")
            attachment = connection.execute("""INSERT INTO service_desk_attachments(ticket_id,message_id,filename,contents)
                VALUES(?,?,'private.txt',?)""", (ticket, message, b'Unpublished attachment contents')).lastrowid
            connection.execute("""CREATE TRIGGER reject_clean_start BEFORE INSERT ON inventory_settings
                                  BEGIN SELECT RAISE(ABORT,'A reset write failed'); END""")
            connection.commit()
            for table in cleared_tables:
                self.assertTrue(connection.execute(f'SELECT 1 FROM {table}').fetchone(), table)
            retained = {table: connection.execute(f'SELECT * FROM {table}').fetchall()
                        for table in retained_tables}
            guard_definitions = dict(connection.execute("SELECT name,sql FROM sqlite_schema WHERE type='trigger' "
                                                       "AND name<>'reject_clean_start'"))
            earlier_events = connection.execute(
                'SELECT id,record_json FROM inventory_change_history ORDER BY id').fetchall()
            before = tuple(connection.iterdump())
        reset = '/api/inventory/reset'
        for actor in (None, 2, 4, 6):
            self.assertEqual(self.request(reset, method='POST', actor=actor, payload={'confirmed': True})[0], 403)
        self.assertEqual(self.request(reset, method='POST', payload={'confirmed': False})[0], 400)
        self.assertEqual(self.request(reset, method='POST', payload={'confirmed': True},
                                      headers={'X-CSRF-Token': ''})[0], 403)
        self.assertEqual(self.request(reset, method='POST', payload={'confirmed': True})[0], 400)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(tuple(connection.iterdump()), before)
            connection.execute('DROP TRIGGER reject_clean_start')
        self.assertEqual(self.download('it', ticket, attachment, 1)[0], 200)
        self.assertEqual(self.request(reset, method='POST', payload={'confirmed': True})[0], 200)
        self.assertEqual(self.download('it', ticket, attachment, 1)[0], 404)
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            for table in cleared_tables:
                self.assertFalse(connection.execute(f'SELECT 1 FROM {table}').fetchone(), table)
            for table, rows in retained.items():
                self.assertEqual(connection.execute(f'SELECT * FROM {table}').fetchall(), rows)
            self.assertEqual(dict(connection.execute("SELECT name,sql FROM sqlite_schema WHERE type='trigger'")),
                             guard_definitions)
            self.assertEqual(connection.execute('SELECT account_id,department_id FROM staff_members '
                                                'ORDER BY account_id').fetchall(), [(4, None), (5, None)])
            self.assertEqual(reconstruct_inventory(connection),
                             dict(PUBLISHED_DEFAULTS, managedOptionsCleared=True, stateVersion=3))
            for table, defaults in (('service_desk_categories', DEFAULT_TICKET_CATEGORIES),
                                    ('supplier_categories', INITIAL_CATEGORIES),
                                    ('supplier_issue_categories', INITIAL_ISSUE_CATEGORIES)):
                self.assertEqual(connection.execute(f'SELECT name FROM {table} ORDER BY id').fetchall(),
                                 [(name,) for name in defaults])
            self.assertEqual(connection.execute("SELECT warranty_days,replacement_days,revision "
                                                "FROM equipment_lifecycle_settings").fetchone(), (90, 90, 0))
            self.assertEqual(dict(connection.execute("SELECT name,years FROM equipment_lifecycle_types")),
                             DEFAULT_LIFESPANS)
            events = connection.execute('SELECT id,record_json FROM inventory_change_history ORDER BY id').fetchall()
            self.assertEqual(events[:-1], earlier_events)
            reset_event = json.loads(events[-1][1])
            self.assertEqual(reset_event['reason'], 'Clean inventory reset')
            self.assertEqual(reset_event['changes'][0]['label'], 'Service Desk ticket data')
            self.assertNotIn('Private ticket content', json.dumps(reset_event))
            self.assertEqual(connection.execute('PRAGMA foreign_key_check').fetchall(), [])
            device = dict(id='fresh', name='Fresh Device')
            connection.execute("INSERT INTO inventory_devices VALUES('fresh','Fresh Device',?,0,0)",
                               (json.dumps(device),))
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            connection.commit()
            self.assertIn('stockItemId', receive_stock(connection, 1, self.tokens[1], receipt_payload()))
            initialise_database(connection)
        self.assertGreater(self.create('it', actor=1, equipmentId='fresh'), ticket)

    def test_individual_asset_and_stock_backed_device_use_canonical_identities(self):
        with sqlite3.connect(self.path) as connection:
            connection.execute('PRAGMA foreign_keys=ON')
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            registered = connection.execute("""INSERT INTO it_asset_stock_units(device_id)
                VALUES('device') RETURNING id""").fetchone()[0]
            connection.commit()
            receipt = dict(receipt_payload(), quantity=1, readyQuantity=1,
                           checks={'itemsChecked': True, 'conditionChecked': True})
            receipt['item']['trackingMode'] = 'individual'
            asset = receive_stock(connection, 1, self.tokens[1], receipt)['stockItemId']
            unit = stock_item(connection, asset)['units'][0]['id']
            issue_stock(connection, 1, self.tokens[1], issue_payload(connection, asset, stockUnitIds=[unit]))
            issue_id = stock_issue_records(connection)[0]['id']
        equipment = SERVICE_DESK + '/personal/equipment'
        choice, = self.request(equipment, actor=4)[1]['equipment']
        self.assertEqual((choice['kind'], choice['id'], choice['stockIssueId']), ('stockUnit', unit, issue_id))
        self.assertEqual(self.request(equipment, actor=5)[1]['equipment'], [])
        for equipment_kind, equipment_id in (('stockUnit', registered), ('stockItem', asset)):
            self.assertEqual(self.request(self.ticket_path('it'), method='POST',
                payload=dict(CREATE, equipmentKind=equipment_kind, equipmentId=equipment_id))[0], 404)
        device_ticket = self.create('it', actor=1)
        asset_ticket = self.create(equipmentKind='stockUnit', equipmentId=unit, stockIssueId=issue_id)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(connection.execute("""SELECT device_id,stock_unit_id,stock_item_id
                FROM service_desk_tickets ORDER BY id""").fetchall(), [('device', None, None), (None, unit, None)])
            connection.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.assert_ticket_hidden('personal', asset_ticket, 4)
        self.assert_ticket_hidden('it', asset_ticket, 1)
        self.assertEqual(self.request(self.ticket_path('it', f'/{device_ticket}'))[0], 200)
