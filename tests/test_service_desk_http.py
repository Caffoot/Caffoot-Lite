"""Check the live Service Desk boundary without exposing ticket screens."""
import http.client
import json
import sqlite3
import unittest

from backend.http_security import COOKIE_NAME
from backend.stock_circulation import issue_stock, return_stock, stock_issue_records
from backend.stock_corrections import save_stock_correction
from backend.stock_intake import receive_stock, stock_item
import test_device_assignments_http as fixture
from test_device_handovers import handover_payload
from test_staff_directory_http import ORIGIN
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

    def assert_ticket_hidden(self, scope, ticket_id, actor):
        for resource in ('', '/history', '/messages', '/attachments/1'):
            self.assertEqual(self.request(self.ticket_path(scope, f'/{ticket_id}{resource}'), actor=actor)[0], 404)
        status, search, _ = self.request(self.ticket_path(scope, f'?search={ticket_id}'), actor=actor)
        self.assertEqual(status, 200)
        self.assertEqual(search['tickets'], [])
        self.assertEqual(sum(search['counts'].values()), 0)
        self.assertEqual(self.save(scope, ticket_id, 'messages', {'body': 'Not permitted'}, actor=actor)[0], 404)

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

    def test_internal_history_attachments_and_closure_attempts(self):
        self.assign_device()
        ticket = self.create()
        self.assertEqual(self.save('personal', ticket, 'messages', {'body': 'Employee reply'}, actor=4)[0], 200)
        private = self.save('it', ticket, 'messages', {'body': 'Internal IT note'})[1]['id']
        public = self.save('it', ticket, 'messages',
                           {'body': 'Public update', 'employeeVisible': True})[1]['id']
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
        self.assertEqual([event['author'] for event in history['history'] if event['kind'] == 'Closed'],
                         ['account-2', 'account-2'])
        self.assertEqual([event['author'] for event in history['history'] if event['kind'] == 'Reopened'],
                         ['account-4', 'account-4'])
        self.assertIn('Internal assignment reason', json.dumps(history))

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
