"""Exercise shared custody through the established equipment and Service Desk routes."""
import base64
import sqlite3
import unittest

from backend.device_assignments import read_assignments
from backend.device_handovers import reassign_device
from backend.device_stock import reissue_stock_device
from backend.equipment_associations import add_associated_equipment
from backend.shared_devices import manage_departments
from backend.stock_circulation import return_stock, stock_issue_records, write_off_stock
from backend.stock_intake import stock_item
import test_associated_equipment_writes as association
import test_device_handovers as handover
import test_device_reissue as reissue
import test_service_desk_http as desk
import test_stock_circulation as stock


class SharedStockTests(unittest.TestCase):
    setUp = reissue.DeviceReissueTests.setUp
    receipt = reissue.DeviceReissueTests.receipt
    source = reissue.DeviceReissueTests.source
    ready_device = reissue.DeviceReissueTests.ready_device

    def test_custody_recipient_survives_multiple_to_one_and_physical_return(self):
        self.db.execute("INSERT INTO departments(id,name) VALUES('extra','Finance')")
        self.db.commit()
        item, identity = self.ready_device()
        payload = reissue.reissue_payload(self.db, identity, recipientKind='department',
                                          departmentIds=['department', 'extra'])
        del payload['recipientId']
        original = reissue_stock_device(self.db, 1, self.token, payload)
        canonical = next(issue for issue in stock_issue_records(self.db)
                         if issue['deviceAssignmentId'] == original['assignmentId'])
        self.assertEqual(canonical['custodyRecipientId'], original['assignmentId'])
        self.assertIsNone(canonical['departmentId'])
        accessory = self.receipt(model='Extra equipment')
        linked = add_associated_equipment(self.db, 1, self.token,
            association.combined_issue_payload(self.db, accessory, identity), issue_new=True)
        accessory_issue = next(issue for issue in stock_issue_records(self.db) if issue['id'] in linked['issueEntryIds'])
        self.assertEqual(accessory_issue['custodyRecipientId'], original['assignmentId'])
        self.assertEqual(stock_item(self.db, accessory)['balances']['physicallyHeld'], 9)
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 9)
        before = self.db.execute('SELECT * FROM it_asset_stock_entries ORDER BY id').fetchall()
        current = read_assignments(self.db, 1, device_id=identity)
        self.assertIsNone(current['handoverContext'])
        manage_departments(self.db, 1, self.token, dict(deviceId=identity, revision=current['revision'],
                           assignmentId=original['assignmentId'], departmentIds=['extra']))
        self.assertEqual(self.db.execute('SELECT * FROM it_asset_stock_entries ORDER BY id').fetchall(), before)
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 9)
        self.assertEqual(stock_item(self.db, accessory)['balances']['physicallyHeld'], 9)
        return_stock(self.db, 1, self.token, stock.return_payload(accessory_issue))
        self.assertEqual(stock_item(self.db, accessory)['balances']['physicallyHeld'], 10)
        reassign_device(self.db, 1, self.token, handover.handover_payload(self.db, identity))
        latest = stock_issue_records(self.db)[0]
        self.assertEqual(latest['staffId'], 'other')
        return_stock(self.db, 1, self.token, stock.return_payload(latest))
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 10)
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])

    def test_direct_handover_to_multiple_departments_keeps_one_unit(self):
        self.db.execute("INSERT INTO departments(id,name) VALUES('extra','Finance')")
        self.db.commit()
        item, identity = self.ready_device()
        original = reissue_stock_device(self.db, 1, self.token, reissue.reissue_payload(self.db, identity))
        payload = handover.handover_payload(self.db, identity, recipientKind='department',
                                            departmentIds=['extra', 'department'])
        del payload['recipientId']
        result = reassign_device(self.db, 1, self.token, payload)
        current, previous = stock_issue_records(self.db)
        self.assertEqual((current['custodyRecipientId'], current['outstanding']), (result['assignmentId'], 1))
        self.assertEqual((previous['deviceAssignmentId'], previous['staffId'], previous['outstanding']),
                         (original['assignmentId'], 'person', 0))
        self.assertEqual(current['stockUnitId'], previous['stockUnitId'])
        payload = stock.writeoff_payload(current, issueEntryId=current['id'], fromState='issued')
        del payload['stockItemId']
        write_off_stock(self.db, 1, self.token, payload)
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 9)
        self.assertEqual(read_assignments(self.db, 1, device_id=identity)['current'], [])
        self.assertEqual(stock_issue_records(self.db)[0]['outstanding'], 0)
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])


class SharedDeviceHttpTests(unittest.TestCase):
    setUp = desk.ServiceDeskHttpTests.setUp
    close_server = desk.ServiceDeskHttpTests.close_server
    request = desk.ServiceDeskHttpTests.request
    create = desk.ServiceDeskHttpTests.create
    save = desk.ServiceDeskHttpTests.save
    ticket_path = desk.ServiceDeskHttpTests.ticket_path
    assign_device = desk.ServiceDeskHttpTests.assign_device
    hand_over = desk.ServiceDeskHttpTests.hand_over
    download = desk.ServiceDeskHttpTests.download
    assert_ticket_hidden = desk.ServiceDeskHttpTests.assert_ticket_hidden
    capture_ticket_mail = desk.ServiceDeskHttpTests.capture_ticket_mail
    finish_mail_jobs = desk.ServiceDeskHttpTests.finish_mail_jobs
    ticket_mail = desk.ServiceDeskHttpTests.ticket_mail

    def allocated(self):
        return self.request('/api/equipment/assignments?deviceId=device')[1]

    def manage(self, departments, *, snapshot=None, actor=1):
        record = snapshot or self.allocated()
        return self.request('/api/equipment/manage-departments', method='POST', actor=actor, payload=dict(
            deviceId='device', revision=record['revision'], assignmentId=record['current'][0]['id'],
            departmentIds=departments))

    def test_initial_department_assignment_retains_one_identity_and_rejects_mixed_recipients(self):
        route = '/api/equipment/assignments'
        selected = {'recipientKind': 'department', 'departmentIds': ['dept','other'],
                    'devices': self.allocation['devices']}
        self.assertEqual(self.request(route, method='POST', payload=dict(selected, recipientId='person'))[0], 400)
        self.assertEqual(self.request(route, method='POST', payload=dict(selected, recipientKind='staff'))[0], 400)
        self.assertEqual(self.request(route, method='POST', payload=dict(selected, departmentIds=['dept','dept']))[0], 400)
        self.assertEqual(self.allocated()['current'], [])
        self.assertEqual(self.request(route, method='POST', payload=selected)[0], 200)
        current, = self.allocated()['current']
        self.assertIsNone(current['staffId'])
        self.assertEqual({department['id'] for department in current['departments']}, {'dept','other'})
        for department in selected['departmentIds']:
            records = self.request(f'{route}?departmentId={department}')[1]['current']
            self.assertEqual([(row['id'],row['deviceId']) for row in records], [(current['id'],'device')])

    def test_current_custody_ticket_scope_and_private_attachments(self):
        self.assign_device()
        personal = self.create('personal')
        self.hand_over('department', 'dept')
        department = self.create('department', attachments=[
            {'filename': 'visible.txt', 'contents': base64.b64encode(b'Visible attachment').decode()}])
        it_created = self.create('it', actor=1, subject='Technician recorded')
        hidden_message = self.save('it', department, 'messages', dict(
            body='Internal note', employeeVisible=False, attachments=[
                {'filename': 'private.txt', 'contents': base64.b64encode(b'Private attachment').decode()}]))
        self.assertEqual(hidden_message[0], 200, hidden_message[1])
        self.assert_ticket_hidden('department', department, 5)
        old = self.allocated()
        self.assertEqual(self.manage(['dept','other'], actor=5)[0], 403)
        self.assertEqual(self.manage(['dept','other','other'])[0], 400)
        self.assertEqual(self.manage([])[0], 400)
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.assertEqual(self.manage(['dept'], snapshot=old)[0], 409)
        self.assertEqual(self.allocated()['current'][0]['id'], old['current'][0]['id'])
        self.assertEqual(self.request('/api/my-equipment', actor=5)[1]['sharedWithMyDepartment'][0]['id'], 'device')
        for ticket in (department, it_created):
            self.assertEqual(self.request(self.ticket_path('department', f'/{ticket}'), actor=5)[0], 200)
        self.assertEqual(self.download('department', department, 1, 5)[:2], (200, b'Visible attachment'))
        self.assertEqual(self.download('department', department, 2, 5)[0], 404)
        self.assert_ticket_hidden('personal', personal, 4)
        self.assertEqual(self.manage(['dept'])[0], 200)
        self.assert_ticket_hidden('department', department, 5)
        self.assertEqual(self.request('/api/my-equipment', actor=5)[1]['sharedWithMyDepartment'], [])
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.assertEqual(self.request(self.ticket_path('department', f'/{department}'), actor=5)[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE staff_members SET department_id=NULL WHERE id='colleague'")
        self.assert_ticket_hidden('department', department, 5)
        self.hand_over('staff', 'person')
        self.assert_ticket_hidden('department', department, 4)

    def test_archived_department_is_retained_until_authorised_removal(self):
        self.assign_device('department', 'dept')
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE departments SET archived=1 WHERE id='other'")
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.assertEqual(self.request('/api/my-equipment', actor=5)[1]['sharedWithMyDepartment'][0]['id'], 'device')
        self.assertEqual(self.manage(['dept'])[0], 200)
        self.assertEqual(self.manage(['dept','other'])[0], 400)

    def test_queued_update_excludes_removed_and_new_department_recipients(self):
        self.capture_ticket_mail(support_email='', defer=True)
        self.assign_device('department', 'dept')
        ticket = self.create('department')
        self.finish_mail_jobs()
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Before sharing', 'employeeVisible': True})[0], 200)
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', ticket, 'department', 'Before sharing')
        self.assertTrue(self.mail.empty())
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Shared update', 'employeeVisible': True})[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', ticket, 'department', 'Shared update')
        self.ticket_mail('account-5@example.test', ticket, 'department', 'Shared update')
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE account_profiles SET email='ACCOUNT-4@example.test' WHERE account_id=5")
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'One mailbox', 'employeeVisible': True})[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', ticket, 'department', 'One mailbox')
        self.assertTrue(self.mail.empty())
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE account_profiles SET email='account-5@example.test' WHERE account_id=5")
        self.assertEqual(self.save('it', ticket, 'messages', {'body': 'Queued update', 'employeeVisible': True})[0], 200)
        self.assertEqual(self.manage(['dept'])[0], 200)
        self.assertEqual(self.manage(['dept','other'])[0], 200)
        self.finish_mail_jobs()
        self.ticket_mail('account-4@example.test', ticket, 'department', 'Queued update')
        self.assertTrue(self.mail.empty())
