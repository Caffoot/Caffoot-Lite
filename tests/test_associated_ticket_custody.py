"""Verify associated accessory custody and privacy through live HTTP and SMTP."""
import base64
from contextlib import closing
import sqlite3
import unittest
from unittest.mock import patch

from backend.service_desk import record_ticket_event
from backend.stock_circulation import stock_issue_records
from backend.stock_intake import stock_item
from test_associated_equipment_writes import association_payload, combined_issue_payload
import test_shared_devices as fixture
from test_stock_circulation import issue_payload, return_payload
from test_stock_intake import receipt_payload


ACCOUNTS = 4
SALES = 5
DEPARTMENTS = {'dept': ACCOUNTS, 'other': SALES}


class AssociatedAccessoryVisibility(unittest.TestCase):
    setUp = fixture.SharedDeviceHttpTests.setUp
    close_server = fixture.SharedDeviceHttpTests.close_server
    request = fixture.SharedDeviceHttpTests.request
    create = fixture.SharedDeviceHttpTests.create
    save = fixture.SharedDeviceHttpTests.save
    ticket_path = fixture.SharedDeviceHttpTests.ticket_path
    assign_device = fixture.SharedDeviceHttpTests.assign_device
    hand_over = fixture.SharedDeviceHttpTests.hand_over
    download = fixture.SharedDeviceHttpTests.download
    capture_ticket_mail = fixture.SharedDeviceHttpTests.capture_ticket_mail
    finish_mail_jobs = fixture.SharedDeviceHttpTests.finish_mail_jobs
    ticket_mail = fixture.SharedDeviceHttpTests.ticket_mail
    allocated = fixture.SharedDeviceHttpTests.allocated
    manage = fixture.SharedDeviceHttpTests.manage

    def begin(self):
        with closing(sqlite3.connect(self.path)) as connection, connection:
            connection.execute("UPDATE departments SET name='Accounts' WHERE id='dept'")
            connection.execute("UPDATE departments SET name='Sales' WHERE id='other'")
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        self.assign_device('department', 'dept')
        self.capture_ticket_mail(support_email='', defer=True)

    def post(self, path, payload, *, expected=200, actor=1):
        status, result, _ = self.request(path, method='POST', actor=actor, payload=payload)
        self.assertEqual(status, expected, result)
        return result

    def get(self, path, actor=1, status=200):
        actual, result, _ = self.request(path, actor=actor)
        self.assertEqual(actual, status, result)
        return result

    def receive(self, model):
        receipt = dict(receipt_payload(), quantity=5, readyQuantity=5,
                       checks=dict(itemsChecked=True, conditionChecked=True))
        receipt['item']['model'] = model
        return self.post('/api/it-assets/receive', receipt)['stockItemId']

    def issue_to_accounts(self, item):
        with closing(sqlite3.connect(self.path)) as connection:
            payload = issue_payload(connection, item, quantity=2, recipientKind='department', recipientId='dept')
        self.post('/api/it-assets/issue', payload)
        with closing(sqlite3.connect(self.path)) as connection:
            issue, = [row for row in stock_issue_records(connection) if row['stockItemId'] == item]
        return issue

    def associate_existing(self, issue):
        with closing(sqlite3.connect(self.path)) as connection:
            payload = association_payload(connection, 'device', issueEntryId=issue['id'], version=issue['version'])
        return self.post('/api/equipment/associations', payload)

    def issue_to_current_custody(self, item):
        with closing(sqlite3.connect(self.path)) as connection:
            payload = combined_issue_payload(connection, item, 'device', quantity=2)
        return self.post('/api/equipment/issue-and-associate', payload)

    @staticmethod
    def attachment(text):
        return [{'filename': 'fixture.txt', 'contents': base64.b64encode(text.encode()).decode()}]

    @staticmethod
    def accessory_fields(issue):
        return dict(equipmentKind='stockItem', equipmentId=issue['stockItemId'], stockIssueId=issue['id'])

    def stock_snapshot(self, items):
        with closing(sqlite3.connect(self.path)) as connection:
            facts = {
                table: connection.execute(f'SELECT * FROM {table} ORDER BY id').fetchall()
                for table in ('it_asset_stock_items', 'it_asset_stock_entries', 'it_asset_stock_movements',
                              'it_asset_stock_units', 'device_equipment_associations', 'device_assignments')
            }
            self.assertEqual(connection.execute('PRAGMA foreign_key_check').fetchall(), [])
            return facts, {item: stock_item(connection, item)['balances'] for item in items}

    def assert_projections(self, expected_devices, accounts_issues, sales_issues):
        for department, actor in DEPARTMENTS.items():
            expected_issues = accounts_issues if actor == ACCOUNTS else sales_issues
            expected_device_ids = {'device'} if department in expected_devices else set()
            with self.subTest(department=department, current_devices=expected_devices):
                shared = self.get('/api/my-equipment', actor)['sharedWithMyDepartment']
                self.assertEqual({row['id'] for row in shared if row.get('equipmentKind') != 'IT Asset'},
                                 expected_device_ids)
                self.assertEqual({row['id']: row['quantity'] for row in shared
                                  if row.get('equipmentKind') == 'IT Asset'},
                                 {f'stock-issue-{identity}': 2 for identity in expected_issues})
                self.get(f'/api/departments/{department}')
                directory = self.get(f'/api/equipment/assignments?departmentId={department}')
                self.assertEqual({row['deviceId'] for row in directory['current']}, expected_device_ids)
                self.assertEqual({row['id']: row['outstanding'] for row in directory['assetCurrent']},
                                 {identity: 2 for identity in expected_issues})
                picker = self.get('/api/service-desk/department/equipment', actor)['equipment']
                self.assertEqual({row['id'] for row in picker if row['kind'] == 'device'}, expected_device_ids)
                self.assertEqual({row['stockIssueId'] for row in picker if row['kind'] == 'stockItem'}, expected_issues)

    def assert_ticket_scope(self, ticket, expected, visible, hidden):
        for actor in (ACCOUNTS, SALES):
            status = 200 if actor in expected else 404
            with self.subTest(ticket=ticket, actor=actor):
                for resource in ('', '/messages', '/history'):
                    self.get(self.ticket_path('department', f'/{ticket}{resource}'), actor, status)
                visible_status, body, _ = self.download('department', ticket, visible, actor)
                self.assertEqual(visible_status, status)
                if status == 200:
                    self.assertEqual(body, b'Employee-visible fixture')
                self.assertEqual(self.download('department', ticket, hidden, actor)[0], 404)
        self.assertEqual(self.download('it', ticket, hidden, 1)[:2], (200, b'Internal fixture'))

    def attachment_ids(self, ticket):
        self.assertEqual(self.save('it', ticket, 'messages', dict(
            body='Internal fixture', employeeVisible=False, attachments=self.attachment('Internal fixture')))[0], 200)
        messages = self.get(self.ticket_path('it', f'/{ticket}/messages'))
        attachment_ids = [entry['id'] for entry in messages['attachments']]
        self.assertEqual(len(attachment_ids), 2)
        return tuple(attachment_ids)

    def assert_queued_update(self, ticket, expected, text):
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'messages', dict(body=text, employeeVisible=True))[0], 200)
        self.assertEqual(len(self.mail_jobs), 1)
        self.finish_mail_jobs()
        for actor in expected:
            self.ticket_mail(f'account-{actor}@example.test', ticket, 'department', text)
        self.assertTrue(self.mail.empty())


    def assert_current_holder_label(self, issue, label):
        equipment = self.get('/api/service-desk/it/equipment')['equipment']
        match, = [row for row in equipment if row.get('stockIssueId') == issue['id']]
        self.assertTrue(match['label'].endswith(f' · {label} (Issue {issue["id"]})'), match)

    def create_fields(self, issue, *, association_id=None):
        fields = dict(self.accessory_fields(issue), categoryId=5,
                      subject='Accessory support request', description='Fictional accessory details')
        if association_id is not None:
            fields['associationId'] = association_id
        return fields

    def test_historical_access_fails_closed_and_new_tickets_follow_the_original_recipient_accessory(self):
        self.begin()
        accessory = self.receive('Explicitly associated monitor')
        independent = self.receive('Standalone monitor')
        original_issue = self.issue_to_accounts(accessory)
        standalone = self.issue_to_accounts(independent)
        visible_file = self.attachment('Employee-visible fixture')
        fields = self.accessory_fields(original_issue)
        prior = self.create('department', **fields, subject='Accessory ticket before linking', attachments=visible_file)
        prior_files = self.attachment_ids(prior)
        original_details = self.get(self.ticket_path('it', f'/{prior}'))
        self.assert_ticket_scope(prior, {ACCOUNTS}, *prior_files)
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', prior, 'messages',
                                  dict(body='Queued while standalone', employeeVisible=True))[0], 200)
        association_id, = self.associate_existing(original_issue)['associationIds']
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())
        self.assert_ticket_scope(prior, set(), *prior_files)
        self.assertEqual(self.get(self.ticket_path('it', f'/{prior}'))['description'],
                         original_details['description'])

        # Seed the original event format emitted by versions without the warning.
        def legacy_event(*args, **kwargs):
            if args[2] == 'Created':
                kwargs.pop('private', None)
            return record_ticket_event(*args, **kwargs)

        with patch('backend.service_desk.record_ticket_event', side_effect=legacy_event):
            historical = self.create('it', actor=1, **fields, subject='Ticket created without warning',
                                     attachments=visible_file)
        historic_files = self.attachment_ids(historical)
        separate = self.create('department', **self.accessory_fields(standalone), subject='Standalone asset ticket',
                               attachments=visible_file)
        separate_files = self.attachment_ids(separate)
        self.post(self.ticket_path('department'), self.create_fields(original_issue), actor=ACCOUNTS, expected=409)
        selected = next(row for row in self.get('/api/service-desk/department/equipment', ACCOUNTS)['equipment']
                        if row.get('stockIssueId') == original_issue['id'])
        self.assertEqual(selected['associationId'], association_id)
        warned = self.create('department', **fields, associationId=selected['associationId'],
                             subject='Accessory ticket with warning', attachments=visible_file)
        warned_files = self.attachment_ids(warned)
        device = self.create('department', subject='Canonical Device ticket', attachments=visible_file)
        device_files = self.attachment_ids(device)
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())

        original = self.stock_snapshot([accessory, independent])
        both_issues = {original_issue['id'], standalone['id']}
        self.assert_projections({'dept'}, both_issues, set())
        self.assertEqual(self.save('it', warned, 'messages',
                                  dict(body='Queued before Sales joined', employeeVisible=True))[0], 200)
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', warned, 'department', 'Queued before Sales joined')
        self.assertTrue(self.mail.empty())
        self.assert_projections({'dept','other'}, both_issues, {original_issue['id']})
        self.assert_ticket_scope(warned, {ACCOUNTS, SALES}, *warned_files)

        self.assertEqual(self.manage(['other'])[0], 200)
        self.assert_projections({'other'}, {standalone['id']}, {original_issue['id']})
        self.assert_current_holder_label(original_issue, 'Sales')
        self.assert_ticket_scope(prior, set(), *prior_files)
        self.assert_ticket_scope(historical, set(), *historic_files)
        self.assert_ticket_scope(warned, {SALES}, *warned_files)
        self.assert_ticket_scope(separate, {ACCOUNTS}, *separate_files)
        self.assert_ticket_scope(device, {SALES}, *device_files)
        for ticket in (prior, historical, warned):
            self.assertEqual(self.save('department', ticket, 'messages', dict(body='Reply'), actor=ACCOUNTS)[0], 404)
        self.assertEqual(self.save('department', historical, 'messages', dict(body='Reply'), actor=SALES)[0], 404)
        self.assertEqual(self.save('department', warned, 'messages', dict(body='Reply'), actor=SALES)[0], 200)
        self.assertEqual({row['id'] for row in self.get(self.ticket_path('department'), ACCOUNTS)['tickets']},
                         {separate})
        self.assertEqual({row['id'] for row in self.get(self.ticket_path('department'), SALES)['tickets']},
                         {warned, device})
        self.post(self.ticket_path('department'), self.create_fields(original_issue, association_id=association_id),
                  actor=ACCOUNTS, expected=404)
        self.assert_queued_update(historical, [], 'Legacy IT update')
        self.assert_queued_update(warned, [SALES], 'Current accessory update')
        self.assert_queued_update(separate, [ACCOUNTS], 'Standalone update')
        self.assert_queued_update(device, [SALES], 'Canonical Device update')
        self.assertEqual(self.stock_snapshot([accessory, independent]), original)
        associations = self.get('/api/equipment/associations?deviceId=device')
        self.assertEqual(associations['current'], associations['history'])
        self.assertEqual(associations['current'][0]['issue'], original_issue)
        accounts = self.get('/api/equipment/assignments?departmentId=dept')
        self.assertIn(original_issue['id'], {entry['entryId'] for entry in accounts['assetMovements']})

    def test_custody_recipient_it_ticket_rechecks_membership_features_and_return(self):
        self.begin()
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        custody = self.allocated()['current'][0]['id']
        item = self.receive('New custody-recipient monitor')
        issued = self.issue_to_current_custody(item)
        with closing(sqlite3.connect(self.path)) as connection:
            issue, = [row for row in stock_issue_records(connection) if row['id'] in issued['issueEntryIds']]
        self.assertEqual((issue['staffId'], issue['departmentId'], issue['deviceAssignmentId'],
                          issue['custodyRecipientId'], issue['outstanding']), (None, None, None, custody, 2))
        original = self.stock_snapshot([item])
        self.assert_projections({'dept','other'}, {issue['id']}, {issue['id']})
        self.assert_current_holder_label(issue, 'Accounts, Sales')
        it_ticket = self.create('it', actor=1, **self.accessory_fields(issue), subject='IT-created accessory ticket',
                                attachments=self.attachment('Employee-visible fixture'))
        files = self.attachment_ids(it_ticket)
        self.assert_ticket_scope(it_ticket, {ACCOUNTS, SALES}, *files)
        self.assertEqual(self.save('it', it_ticket, 'messages',
                                  dict(body='Queued before removal and re-add', employeeVisible=True))[0], 200)
        self.assertEqual(self.manage(['other'])[0], 200)
        self.assert_projections({'other'}, set(), {issue['id']})
        self.assert_ticket_scope(it_ticket, {SALES}, *files)
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-5@example.test', it_ticket, 'department', 'Queued before removal and re-add')
        self.assertTrue(self.mail.empty())
        self.assert_ticket_scope(it_ticket, {ACCOUNTS, SALES}, *files)
        self.assert_queued_update(it_ticket, [ACCOUNTS, SALES], 'New update after re-add')
        self.assertEqual(self.stock_snapshot([item]), original)

        for feature in ('devices', 'it_assets'):
            with closing(sqlite3.connect(self.path)) as connection, connection:
                connection.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            self.get(self.ticket_path('department', f'/{it_ticket}'), SALES, 404)
            shared = self.get('/api/my-equipment', SALES)['sharedWithMyDepartment']
            self.assertNotIn(f'stock-issue-{issue["id"]}', {row['id'] for row in shared})
            if feature == 'devices':
                self.assert_queued_update(it_ticket, [], 'Device feature disabled')
            with closing(sqlite3.connect(self.path)) as connection, connection:
                connection.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))

        self.assertEqual(self.save('it', it_ticket, 'messages',
                                  dict(body='Queued before full return', employeeVisible=True))[0], 200)
        self.post('/api/it-assets/return', return_payload(issue, quantityReturned=2))
        self.finish_mail_jobs()
        self.assertTrue(self.mail.empty())
        self.assert_projections({'dept','other'}, set(), set())
        self.assert_ticket_scope(it_ticket, set(), *files)
        self.assertEqual(self.save('department', it_ticket, 'messages', dict(body='After return'), actor=SALES)[0], 404)
        with closing(sqlite3.connect(self.path)) as connection:
            returned, = [row for row in stock_issue_records(connection) if row['id'] == issue['id']]
        self.assertEqual((returned['custodyRecipientId'], returned['quantity'], returned['outstanding']), (custody, 2, 0))
        associations = self.get('/api/equipment/associations?deviceId=device')
        self.assertEqual(associations['current'], [])
        self.assertEqual(associations['history'][0]['id'], issued['associationIds'][0])

    def test_new_physical_holder_can_report_an_accessory_without_inheriting_its_history(self):
        self.begin()
        self.assertEqual(self.manage(['dept', 'other'])[0], 200)
        original_custody = self.allocated()['current'][0]['id']
        item = self.receive('Monitor for the shared Device')
        association = self.issue_to_current_custody(item)
        with closing(sqlite3.connect(self.path)) as connection:
            original_issue, = stock_issue_records(connection)
        ticket = self.create('department', **self.accessory_fields(original_issue),
                             associationId=association['associationIds'][0],
                             attachments=self.attachment('Employee-visible fixture'))
        visible, private = self.attachment_ids(ticket)
        self.assert_ticket_scope(ticket, {ACCOUNTS, SALES}, visible, private)

        self.post('/api/it-assets/return', return_payload(original_issue, quantityReturned=2))
        self.hand_over('staff', 'colleague')
        new_custody, = self.allocated()['current']
        self.assertNotEqual(new_custody['id'], original_custody)
        self.assertEqual(new_custody['staffId'], 'colleague')
        reissued = self.issue_to_current_custody(item)
        self.assertNotEqual(reissued['issueEntryIds'], association['issueEntryIds'])
        with closing(sqlite3.connect(self.path)) as connection:
            new_issue, returned_issue = stock_issue_records(connection)
            self.assertEqual((returned_issue['id'], returned_issue['custodyRecipientId'],
                              returned_issue['quantity'], returned_issue['outstanding']),
                             (original_issue['id'], original_custody, 2, 0))
            self.assertEqual((new_issue['staffId'], new_issue['outstanding']), ('colleague', 2))
            self.assertEqual(stock_item(connection, item)['balances']['physicallyHeld'], 3)
            before = tuple(connection.iterdump())

        self.assert_ticket_scope(ticket, set(), visible, private)
        self.assertEqual(self.save('department', ticket, 'messages', dict(body='Old ticket'), actor=SALES)[0], 404)
        self.get(self.ticket_path('personal', f'/{ticket}'), SALES, 404)
        self.post(self.ticket_path('personal'), self.create_fields(new_issue), actor=SALES, expected=409)
        with closing(sqlite3.connect(self.path)) as connection:
            self.assertEqual(tuple(connection.iterdump()), before)

        picker = self.get('/api/service-desk/personal/equipment', SALES)['equipment']
        accessory, = [choice for choice in picker if choice.get('stockIssueId') == new_issue['id']]
        self.assertEqual(accessory['associationId'], reissued['associationIds'][0])
        current_ticket = self.create('personal', actor=SALES, **self.accessory_fields(new_issue),
                                     associationId=accessory['associationId'],
                                     attachments=self.attachment('Current custody fixture'))
        current_thread = self.get(self.ticket_path('personal', f'/{current_ticket}/messages'), SALES)
        current_file, = current_thread['attachments']
        self.assertEqual(self.download('personal', current_ticket, current_file['id'], SALES)[:2],
                         (200, b'Current custody fixture'))
