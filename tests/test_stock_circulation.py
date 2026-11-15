"""Real stock operations preserve identities, quantities, history and privacy."""
import concurrent.futures
import copy
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend import schema
from backend.permissions import can_access
from backend.request_auth import csrf_for_session
from backend.stock_intake import receive_stock, stock_item, update_stock_readiness
from backend.stock_circulation import (issue_stock, read_stock_issues, stock_recipients,
    return_stock, prepare_stock, registered_stock_devices, write_off_stock, canonical_device_choice)
from test_stock_intake import receipt_payload
import test_stock_intake as intake_fixture
import test_feature_settings_http as feature_http


def issue_payload(connection, identity, **overrides):
    item=stock_item(connection,identity)
    return dict(dict(operationId=uuid.uuid4().hex,stockItemId=identity,version=item['version'],
        quantity=1,recipientKind='staff',recipientId='person',issuedOn='2026-11-15',note=''),**overrides)


def return_payload(source, **overrides):
    return dict(dict(operationId=uuid.uuid4().hex,issueEntryId=source['id'],version=source['version'],
        quantityReturned=1,readyQuantity=0,writeOffQuantity=0,returnedOn='2026-11-15',
        checks=dict(cleanedWorking=False,wipedReset=False),writeOffReason='',note=''),**overrides)


def preparation_payload(item, **overrides):
    return dict(dict(operationId=uuid.uuid4().hex,stockItemId=item['id'],version=item['version'],quantity=1,
        checkedOn='2026-11-15',checks=dict(cleanedWorking=True,wipedReset=False),note=''),**overrides)


def writeoff_payload(item, **overrides):
    return dict(dict(operationId=uuid.uuid4().hex,stockItemId=item['id'],version=item['version'],
        quantity=1,fromState='ready',writtenOffOn='2026-11-15',reason='Beyond use',note=''),**overrides)


class StockCirculationTests(unittest.TestCase):
    def setUp(self):
        intake_fixture.StockIntakeTests.setUp(self)
        schema.initialise_database(self.db)

    def receipt(self, quantity=10, *, individual=False, ready=None, model="Display", category='Monitor'):
        ready=quantity if ready is None else ready
        payload=receipt_payload()
        payload['item']['model']=model
        payload['item']['category']=category
        payload.update(quantity=quantity,readyQuantity=ready,
            checks=dict(itemsChecked=ready>0,conditionChecked=ready>0))
        if individual:
            payload['item']['trackingMode']='individual'
        return receive_stock(self.db,1,self.token,payload)['stockItemId']

    def issue(self, identity, **values):
        return issue_stock(self.db,1,self.token,issue_payload(self.db,identity,**values))

    def outstanding(self):
        return next(row for row in read_stock_issues(self.db,1)['issues'] if row['outstanding']>0)

    def return_equipment(self, payload):
        return return_stock(self.db,1,self.token,payload)

    def legacy_device(self, *, assigned=True):
        from backend.device_assignments import assign_devices
        record=dict(id='canonical',name='Fictional Laptop',type='Laptop',status='Active',
            primaryIp='192.0.2.10',rackId='retained-rack',location='Original Location',
            notes='PRIVATE DEVICE NOTES',typeDetails=dict(password='PRIVATE PASSWORD'))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        self.db.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,0)',
                        ('canonical',record['name'],json.dumps(record)))
        self.db.commit()
        if assigned:
            assign_devices(self.db,1,self.token,dict(recipientKind='staff',recipientId='person',devices=[dict(id='canonical',revision=0)]))
            return read_stock_issues(self.db,1)['deviceAssignments'][0]
        return canonical_device_choice(self.db,'canonical')

    def unchanged(self, exception, operation):
        before=tuple(self.db.iterdump())
        with self.assertRaises(exception):
            operation()
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_quantity_issues_keep_original_records_and_distinct_outstanding_references(self):
        identity=self.receipt()
        original=self.db.execute("SELECT * FROM it_asset_stock_movements WHERE kind='received'").fetchall()
        records={table:self.db.execute('SELECT * FROM '+table).fetchall() for table in
                 ('accounts','roles','role_grants','account_roles','account_sessions','staff_members','departments','inventory_devices')}
        self.issue(identity,quantity=3)
        self.issue(identity,quantity=2,recipientKind='department',recipientId='department')
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances']['physicallyHeld'],5)
        self.assertEqual(item['balances']['readyToIssue'],5)
        issues=read_stock_issues(self.db,1)['issues']
        self.assertEqual([row['outstanding'] for row in issues],[2,3])
        self.assertEqual(issues[0]['departmentId'],'department')
        self.assertEqual(issues[1]['staffId'],'person')
        self.assertNotEqual(issues[0]['id'],issues[1]['id'])
        self.assertEqual(self.db.execute("SELECT * FROM it_asset_stock_movements WHERE kind='received'").fetchall(),original)
        for table,before in records.items():
            self.assertEqual(self.db.execute('SELECT * FROM '+table).fetchall(),before,table)

    def test_individual_issue_retains_selected_identity_and_optional_identifiers(self):
        identity=self.receipt(1,individual=True)
        item=stock_item(self.db,identity)
        unit=item['units'][0]['id']
        self.issue(identity,stockUnitIds=[unit])
        current=stock_item(self.db,identity)
        self.assertEqual(current['units'][0]['id'],unit)
        self.assertFalse(current['units'][0]['held'])
        self.assertIsNone(current['units'][0]['serialNumber'])
        self.assertEqual(read_stock_issues(self.db,1)['issues'][0]['stockUnitId'],unit)
        self.unchanged(ValueError,lambda:self.issue(identity,stockUnitIds=[unit]))
        self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_devices').fetchone(),(0,))

    def test_only_the_selected_ready_balance_can_be_issued(self):
        identity=self.receipt(10,ready=3)
        self.receipt(100,model="Other Equipment")
        for quantity in (0,-1,1.5,True,4,9007199254740992):
            self.unchanged(ValueError,lambda:self.issue(identity,quantity=quantity))
        self.issue(identity,quantity=3)
        self.unchanged(ValueError,lambda:self.issue(identity))
        self.assertEqual(stock_item(self.db,identity)['balances']['awaitingChecks'],7)

    def test_minimum_recipient_picker_does_not_grant_directory_or_devices_access(self):
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        for kind in ('staff','department'):
            choices=stock_recipients(self.db,2,kind=kind)
            self.assertTrue(choices)
            self.assertEqual(set(choices[0]),{'id','label','kind'})
        self.assertFalse(can_access(self.db,2,'Staff Members'))
        self.assertFalse(can_access(self.db,2,'Devices'))
        identity=self.receipt()
        issue_stock(self.db,2,'a'*64,issue_payload(self.db,identity))
        self.assertEqual(read_stock_issues(self.db,2)['issues'][0]['actor'],'Fictional Reader')

    def test_inactive_and_archived_recipients_are_rechecked(self):
        identity=self.receipt()
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='person'")
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()
        self.assertNotIn('person',[r['id'] for r in stock_recipients(self.db,1)])
        self.assertEqual(stock_recipients(self.db,1,kind='department'),[])
        self.unchanged(ValueError,lambda:self.issue(identity))
        self.unchanged(ValueError,lambda:self.issue(identity,recipientKind='department',recipientId='department'))

    def test_retries_are_idempotent_but_stale_or_changed_requests_fail(self):
        identity=self.receipt()
        payload=issue_payload(self.db,identity,quantity=2)
        stale=issue_payload(self.db,identity)
        first=issue_stock(self.db,1,self.token,payload)
        before=tuple(self.db.iterdump())
        self.assertEqual(issue_stock(self.db,1,self.token,payload),first)
        self.assertEqual(tuple(self.db.iterdump()),before)
        self.unchanged(FileExistsError,lambda:issue_stock(self.db,1,self.token,dict(payload,quantity=3)))
        self.unchanged(FileExistsError,lambda:issue_stock(self.db,1,self.token,stale))

    def test_audit_failure_rolls_back_entries_and_header(self):
        identity=self.receipt()
        with patch('backend.stock_circulation.record_actor_event',side_effect=RuntimeError('Injected audit failure')):
            self.unchanged(RuntimeError,lambda:self.issue(identity,quantity=4))

    def test_read_only_mfa_revocation_and_feature_off_deny_operations(self):
        identity=self.receipt()
        self.unchanged(PermissionError,lambda:issue_stock(self.db,2,'a'*64,issue_payload(self.db,identity)))
        self.unchanged(PermissionError,lambda:stock_recipients(self.db,2))
        self.db.execute('UPDATE accounts SET mfa_confirmed=0 WHERE id=1')
        self.db.commit()
        self.unchanged(PermissionError,lambda:self.issue(identity))
        self.db.execute('UPDATE accounts SET mfa_confirmed=1 WHERE id=1')
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.unchanged(PermissionError,lambda:self.issue(identity))
        self.unchanged(PermissionError,lambda:read_stock_issues(self.db,1))
        self.unchanged(PermissionError,lambda:stock_recipients(self.db,1))

    def test_concurrent_technicians_cannot_double_issue_available_stock(self):
        identity=self.receipt()
        original=issue_payload(self.db,identity,quantity=7)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'stock.sqlite3'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def issue(_):
                with sqlite3.connect(path,timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    try:
                        issue_stock(db,1,self.token,dict(original,operationId=uuid.uuid4().hex))
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(issue,range(2))),[False,True])
            with sqlite3.connect(path) as db:
                self.assertEqual(stock_item(db,identity)['balances']['readyToIssue'],3)
                self.assertEqual(read_stock_issues(db,1)['issues'][0]['outstanding'],7)
                self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(),[])

    def test_partial_mixed_return_retains_original_issue_and_each_disposition(self):
        identity=self.receipt()
        self.issue(identity,quantity=8)
        original=self.db.execute("SELECT * FROM it_asset_stock_entries WHERE to_state='issued'").fetchall()
        result=self.return_equipment(return_payload(self.outstanding(),quantityReturned=5,readyQuantity=3,
            writeOffQuantity=2,checks=dict(cleanedWorking=True,wipedReset=False),writeOffReason='Broken buttons'))
        self.assertEqual(result['awaitingQuantity'],0)
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances']['physicallyHeld'],5)
        self.assertEqual(item['balances']['readyToIssue'],5)
        self.assertEqual(item['stateBalances'],dict(awaitingChecks=0,awaitingPreparation=0,currentlyIssued=3,writtenOff=2))
        self.assertEqual(self.outstanding()['outstanding'],3)
        self.assertEqual(self.db.execute("SELECT * FROM it_asset_stock_entries WHERE to_state='issued'").fetchall(),original)
        self.assertEqual([r[0] for r in self.db.execute('SELECT kind FROM it_asset_stock_movements ORDER BY id DESC LIMIT 3')],
                         ['written_off','readiness_changed','returned'])

    def test_return_retry_over_return_and_invalid_dispositions_cannot_change_stock(self):
        identity=self.receipt()
        self.issue(identity,quantity=5)
        source=self.outstanding()
        for values in (dict(quantityReturned=6),dict(quantityReturned=-1),dict(readyQuantity=2),
                       dict(writeOffQuantity=1),dict(readyQuantity=1),dict(returnedOn='2026-11-14')):
            self.unchanged(ValueError,lambda:self.return_equipment(return_payload(source,**values)))
        payload=return_payload(source,quantityReturned=5)
        first=self.return_equipment(payload)
        before=tuple(self.db.iterdump())
        self.assertEqual(self.return_equipment(payload),first)
        self.assertEqual(tuple(self.db.iterdump()),before)
        self.unchanged(ValueError,lambda:self.return_equipment(return_payload(source)))

    def test_later_preparation_is_not_a_second_receipt_and_old_readiness_cannot_bypass_it(self):
        identity=self.receipt(category='Laptop')
        self.issue(identity,quantity=4)
        self.return_equipment(return_payload(self.outstanding(),quantityReturned=3))
        item=stock_item(self.db,identity)
        self.assertEqual(item['stateBalances']['awaitingPreparation'],3)
        from test_stock_intake import readiness_payload
        self.unchanged(ValueError,lambda:update_stock_readiness(self.db,1,self.token,
            readiness_payload(self.db,identity,readyQuantity=9)))
        self.unchanged(ValueError,lambda:prepare_stock(self.db,1,self.token,preparation_payload(item,quantity=2)))
        held=item['balances']['physicallyHeld']
        payload=preparation_payload(item,quantity=2,checks=dict(cleanedWorking=True,wipedReset=True))
        result=prepare_stock(self.db,1,self.token,payload)
        self.assertEqual(prepare_stock(self.db,1,self.token,payload),result)
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances']['physicallyHeld'],held)
        self.assertEqual(item['stateBalances']['awaitingPreparation'],1)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='received'").fetchone(),(1,))
        update_stock_readiness(self.db,1,self.token,readiness_payload(self.db,identity,readyQuantity=7,reason='Recheck'))
        self.assertEqual(stock_item(self.db,identity)['stateBalances']['awaitingPreparation'],2)

    def test_non_data_equipment_preparation_does_not_require_a_wipe(self):
        identity=self.receipt(1,individual=True)
        unit=stock_item(self.db,identity)['units'][0]['id']
        self.issue(identity,stockUnitIds=[unit])
        self.return_equipment(return_payload(self.outstanding()))
        item=stock_item(self.db,identity)
        prepare_stock(self.db,1,self.token,preparation_payload(item,stockUnitIds=[unit]))
        self.assertEqual(stock_item(self.db,identity)['units'][0]['id'],unit)
        self.assertTrue(stock_item(self.db,identity)['units'][0]['ready'])

    def test_final_disposition_failure_rolls_back_the_whole_mixed_return(self):
        from backend.stock_circulation import publish_stock_movement
        identity=self.receipt()
        self.issue(identity,quantity=5)
        payload=return_payload(self.outstanding(),quantityReturned=5,readyQuantity=3,writeOffQuantity=2,
            checks=dict(cleanedWorking=True,wipedReset=False),writeOffReason='Damaged')
        def fail(*args,**kwargs):
            if args[3]=='written_off':
                raise RuntimeError('Injected final disposition failure')
            return publish_stock_movement(*args,**kwargs)
        with patch('backend.stock_circulation.publish_stock_movement',side_effect=fail):
            self.unchanged(RuntimeError,lambda:self.return_equipment(payload))

    def test_managed_device_return_keeps_canonical_record_and_closes_original_assignment(self):
        source=self.legacy_device()
        before=self.db.execute('SELECT * FROM inventory_devices').fetchall()
        original=self.db.execute('SELECT * FROM device_assignments').fetchone()[:8]
        self.assertEqual(registered_stock_devices(self.db),[])
        payload=return_payload(source)
        payload['deviceAssignmentId']=payload.pop('issueEntryId')
        self.return_equipment(payload)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),before)
        self.assertEqual(self.db.execute('SELECT * FROM device_assignments').fetchone()[:8],original)
        self.assertIsNotNone(self.db.execute('SELECT ended_at FROM device_assignments').fetchone()[0])
        held=registered_stock_devices(self.db)[0]
        self.assertEqual(held['states'],dict(awaiting_preparation=1))
        self.assertEqual(held['deviceId'],'canonical')
        self.assertNotIn('PRIVATE',json.dumps(held))
        self.assertNotIn('primaryIp',held)
        self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_items').fetchone(),(0,))
        preparation=preparation_payload(dict(id='unused',version=held['version']))
        del preparation['stockItemId']
        preparation['stockUnitId']=held['stockUnitId']
        self.unchanged(ValueError,lambda:prepare_stock(self.db,1,self.token,preparation))
        preparation['checks']['wipedReset']=True
        prepare_stock(self.db,1,self.token,preparation)
        self.assertEqual(registered_stock_devices(self.db)[0]['states']['ready'],1)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),before)

    def test_device_cross_permissions_and_disabled_secondary_projection(self):
        source=self.legacy_device()
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        payload=return_payload(source)
        payload['deviceAssignmentId']=payload.pop('issueEntryId')
        self.unchanged(PermissionError,lambda:return_stock(self.db,2,'a'*64,payload))
        self.assertEqual(read_stock_issues(self.db,2)['deviceAssignments'],[])
        self.return_equipment(payload)
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.db.commit()
        self.assertEqual(read_stock_issues(self.db,1)['registeredDevices'],[])
        from backend.history_permissions import visible_change_history
        self.assertNotIn('canonical',json.dumps(visible_change_history(self.db,1)))

    def test_inactive_holder_can_return_and_partial_return_keeps_the_remainder(self):
        identity=self.receipt()
        self.issue(identity,quantity=5,recipientKind='department',recipientId='department')
        source=self.outstanding()
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()
        self.return_equipment(return_payload(source,quantityReturned=2))
        source=self.outstanding()
        self.assertEqual(source['outstanding'],3)
        self.assertEqual(source['departmentId'],'department')

    def test_concurrent_partial_returns_cannot_process_the_same_outstanding_quantity_twice(self):
        identity=self.receipt()
        self.issue(identity,quantity=5)
        original=return_payload(self.outstanding(),quantityReturned=3)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'returns.sqlite3'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def save(_):
                with sqlite3.connect(path,timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    try:
                        return_stock(db,1,self.token,dict(original,operationId=uuid.uuid4().hex))
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(save,range(2))),[False,True])
            with sqlite3.connect(path) as db:
                self.assertEqual(read_stock_issues(db,1)['issues'][0]['outstanding'],2)

    def test_writeoff_removes_only_the_selected_physical_state(self):
        identity=self.receipt(10,ready=6)
        item=stock_item(self.db,identity)
        write_off_stock(self.db,1,self.token,writeoff_payload(item,quantity=2))
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances'],dict(physicallyHeld=8,readyToIssue=4,awaitingChecks=4))
        write_off_stock(self.db,1,self.token,writeoff_payload(item,fromState='awaiting_checks',quantity=3))
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances'],dict(physicallyHeld=5,readyToIssue=4,awaitingChecks=1))
        self.assertEqual(item['stateBalances']['writtenOff'],5)
        self.unchanged(ValueError,lambda:write_off_stock(self.db,1,self.token,writeoff_payload(item,quantity=5)))

    def test_issued_individual_writeoff_preserves_holder_without_fabricating_a_return(self):
        identity=self.receipt(1,individual=True)
        unit=stock_item(self.db,identity)['units'][0]['id']
        self.issue(identity,stockUnitIds=[unit])
        source=self.outstanding()
        payload=writeoff_payload(dict(id='unused',version=source['version']),fromState='issued')
        del payload['stockItemId'];payload['issueEntryId']=source['id']
        write_off_stock(self.db,1,self.token,payload)
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances']['physicallyHeld'],0)
        self.assertEqual(item['stateBalances']['writtenOff'],1)
        self.assertEqual(read_stock_issues(self.db,1)['issues'][0]['outstanding'],0)
        self.assertEqual(read_stock_issues(self.db,1)['issues'][0]['staffId'],'person')
        self.assertEqual(item['units'][0]['id'],unit)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='returned'").fetchone(),(0,))
        self.unchanged(ValueError,lambda:self.issue(identity,stockUnitIds=[unit]))

    def test_assigned_device_writeoff_closes_once_and_does_not_write_off_other_equipment(self):
        self.legacy_device()
        identity=self.receipt(1,individual=True)
        unit=stock_item(self.db,identity)['units'][0]['id']
        self.issue(identity,stockUnitIds=[unit])
        source=canonical_device_choice(self.db,'canonical')
        original=self.db.execute('SELECT * FROM inventory_devices').fetchall()
        payload=writeoff_payload(dict(id='unused',version=source['version']),fromState='unrecorded')
        del payload['stockItemId'];payload['deviceId']='canonical'
        result=write_off_stock(self.db,1,self.token,payload)
        self.assertEqual(write_off_stock(self.db,1,self.token,payload),result)
        self.assertIsNotNone(self.db.execute('SELECT ended_at FROM device_assignments').fetchone()[0])
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),original)
        self.assertEqual(self.outstanding()['stockUnitId'],unit)
        self.assertEqual(registered_stock_devices(self.db)[0]['states'],dict(written_off=1))
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='returned'").fetchone(),(0,))

    def test_unassigned_device_writeoff_never_invents_held_stock_or_changes_device_status(self):
        source=self.legacy_device(assigned=False)
        original=self.db.execute('SELECT * FROM inventory_devices').fetchall()
        payload=writeoff_payload(dict(id='unused',version=source['version']),fromState='unrecorded')
        del payload['stockItemId'];payload['deviceId']='canonical'
        write_off_stock(self.db,1,self.token,payload)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),original)
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_assignments').fetchone(),(0,))
        self.assertEqual(registered_stock_devices(self.db)[0]['states'],dict(written_off=1))
        self.assertEqual(self.db.execute('SELECT kind FROM it_asset_stock_movements').fetchall(),[('written_off',)])
        from backend.device_assignments import assign_devices
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.unchanged(FileExistsError,lambda:assign_devices(self.db,1,self.token,
            dict(recipientKind='staff',recipientId='person',devices=[dict(id='canonical',revision=0)])))

    def test_writeoff_requires_reason_live_rights_and_matching_version(self):
        identity=self.receipt()
        item=stock_item(self.db,identity)
        for changes in (dict(reason=' '),dict(quantity=0),dict(quantity=-1),dict(quantity=True),dict(fromState='issued')):
            self.unchanged(ValueError,lambda:write_off_stock(self.db,1,self.token,writeoff_payload(item,**changes)))
        self.unchanged(PermissionError,lambda:write_off_stock(self.db,2,'a'*64,writeoff_payload(item)))
        stale=writeoff_payload(item)
        write_off_stock(self.db,1,self.token,writeoff_payload(item))
        self.unchanged(FileExistsError,lambda:write_off_stock(self.db,1,self.token,stale))
        source=self.legacy_device(assigned=False)
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        payload=writeoff_payload(dict(id='unused',version=source['version']),fromState='unrecorded')
        del payload['stockItemId'];payload['deviceId']='canonical'
        self.unchanged(PermissionError,lambda:write_off_stock(self.db,2,'a'*64,payload))

    def test_held_device_writeoff_keeps_its_return_and_preparation_history(self):
        source=self.legacy_device()
        returned=return_payload(source)
        returned['deviceAssignmentId']=returned.pop('issueEntryId')
        self.return_equipment(returned)
        unit=registered_stock_devices(self.db)[0]['stockUnitId']
        source=canonical_device_choice(self.db,'canonical')
        payload=writeoff_payload(dict(id='unused',version=source['version']),fromState='awaiting_preparation')
        del payload['stockItemId'];payload['deviceId']='canonical'
        write_off_stock(self.db,1,self.token,payload)
        self.assertEqual(registered_stock_devices(self.db)[0]['stockUnitId'],unit)
        self.assertEqual(registered_stock_devices(self.db)[0]['states']['written_off'],1)
        self.assertEqual(self.db.execute('SELECT kind FROM it_asset_stock_movements ORDER BY id').fetchall(),[('returned',),('written_off',)])

    def test_writeoff_audit_failure_keeps_assignment_and_canonical_identity(self):
        source=self.legacy_device()
        choice=canonical_device_choice(self.db,source['deviceId'])
        payload=writeoff_payload(dict(id='unused',version=choice['version']),fromState='unrecorded')
        del payload['stockItemId'];payload['deviceId']=choice['deviceId']
        with patch('backend.stock_circulation.record_actor_event',side_effect=RuntimeError('Injected audit failure')):
            self.unchanged(RuntimeError,lambda:write_off_stock(self.db,1,self.token,payload))

    def test_staff_and_department_views_use_outstanding_canonical_stock_relationships(self):
        from backend.device_assignments import read_assignments
        personal=self.receipt(model='Personal Equipment')
        shared=self.receipt(model='Department Equipment')
        self.issue(personal,quantity=3)
        self.issue(shared,quantity=2,recipientKind='department',recipientId='department')
        staff=read_assignments(self.db,2,staff_id='person')
        department=read_assignments(self.db,2,department_id='department')
        self.assertEqual(staff['current'],[])
        self.assertEqual([r['outstanding'] for r in staff['assetCurrent']],[3])
        self.assertEqual([r['outstanding'] for r in department['assetCurrent']],[2])
        self.assertTrue(all(r['departmentId']=='department' for r in department['assetCurrent']))
        self.assertFalse(staff['canIssueStock'])
        self.assertNotIn('reader@example.invalid',json.dumps(staff))
        source=next(r for r in read_stock_issues(self.db,1)['issues'] if r['stockItemId']==personal)
        self.return_equipment(return_payload(source))
        staff=read_assignments(self.db,2,staff_id='person')
        self.assertEqual(staff['assetCurrent'][0]['outstanding'],2)
        self.assertEqual([row['kind'] for row in staff['assetMovements']],['returned','issued'])

    def test_employee_projection_needs_no_stock_or_directory_grant_and_keeps_sharing_separate(self):
        from backend.device_assignments import my_equipment
        personal=self.receipt(model='Personal Equipment')
        shared=self.receipt(model='Shared Equipment')
        other=self.receipt(model='Other Person Equipment')
        self.issue(personal,quantity=3)
        self.issue(shared,quantity=2,recipientKind='department',recipientId='department')
        self.issue(other,quantity=4,recipientId='other')
        self.db.execute('DELETE FROM account_permission_overrides WHERE account_id=2')
        self.db.commit()
        self.assertFalse(can_access(self.db,2,'IT Assets'))
        result=my_equipment(self.db,2)
        self.assertEqual([r['quantity'] for r in result['assignedToMe']],[3])
        self.assertEqual([r['quantity'] for r in result['sharedWithMyDepartment']],[2])
        self.assertEqual(set(result['assignedToMe'][0]),{'id','name','type','manufacturer','model','assignedAt','quantity','equipmentKind'})
        self.assertNotIn('Supplier',json.dumps(result))
        self.assertNotIn('Other Person',json.dumps(result))
        self.unchanged(PermissionError,lambda:read_stock_issues(self.db,2))
        self.db.execute("UPDATE staff_members SET department_id=NULL WHERE id='person'")
        self.db.commit()
        self.assertEqual(my_equipment(self.db,2)['sharedWithMyDepartment'],[])
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.assertEqual(my_equipment(self.db,2),dict(assignedToMe=[],sharedWithMyDepartment=[]))

    def test_stock_history_and_device_history_are_independently_filtered(self):
        from backend.stock_circulation import stock_movement_history
        source=self.legacy_device()
        payload=return_payload(source)
        payload['deviceAssignmentId']=payload.pop('issueEntryId')
        self.return_equipment(payload)
        self.assertTrue(stock_movement_history(self.db,1,device_id='canonical'))
        self.assertEqual(stock_movement_history(self.db,2),[])
        self.unchanged(PermissionError,lambda:stock_movement_history(self.db,2,device_id='canonical'))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.db.commit()
        self.assertEqual(stock_movement_history(self.db,1),[])
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.unchanged(PermissionError,lambda:stock_movement_history(self.db,1))

    def test_department_stock_history_blocks_unsafe_deletion_after_full_return(self):
        from backend.staff_directory import read_department,save_department
        self.db.execute("INSERT INTO departments(id,name) VALUES('stock-only-department','Stock Only Department')")
        self.db.commit()
        identity=self.receipt()
        self.issue(identity,quantity=2,recipientKind='department',recipientId='stock-only-department')
        self.return_equipment(return_payload(self.outstanding(),quantityReturned=2))
        self.assertFalse(read_department(self.db,1,'stock-only-department')['canDelete'])
        self.unchanged(FileExistsError,lambda:save_department(self.db,1,self.token,{},
            department_id='stock-only-department',delete=True))


class StockCirculationHttpTests(unittest.TestCase):
    setUp=feature_http.FeatureSettingsHttpTests.setUp
    tearDown=feature_http.FeatureSettingsHttpTests.tearDown
    request=feature_http.FeatureSettingsHttpTests.request
    post=feature_http.FeatureSettingsHttpTests.post

    def test_issue_routes_use_existing_session_csrf_and_narrow_picker(self):
        from backend.http_security import COOKIE_NAME
        self.assertEqual(self.request('/api/it-assets/issues')[0],401)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            db.execute("INSERT INTO staff_members(id,first_name) VALUES('http-recipient','Fictional Recipient')")
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            payload=receipt_payload();payload.update(readyQuantity=10,checks=dict(itemsChecked=True,conditionChecked=True))
            status,result=self.post('/api/it-assets/receive',payload,self.token,csrf_for_session(self.token))
            self.assertEqual(status,200,result)
            with sqlite3.connect(self.path) as db:
                recipient=db.execute('SELECT id FROM staff_members LIMIT 1').fetchone()[0]
                payload=issue_payload(db,result['stockItemId'],recipientId=recipient)
            self.assertEqual(self.post('/api/it-assets/issue',payload,self.token,None)[0],403)
            status,result=self.post('/api/it-assets/issue',payload,self.token,csrf_for_session(self.token))
            self.assertEqual(status,200,result)
        status,raw,_=self.request('/api/it-assets/recipients?kind=staff',COOKIE_NAME+'='+self.token)
        self.assertEqual(status,200,raw)
        self.assertEqual(set(json.loads(raw)['recipients'][0]),{'id','kind','label'})
        status,raw,_=self.request('/api/it-assets/issues',COOKIE_NAME+'='+self.token)
        self.assertEqual(status,200,raw)
        self.assertEqual(json.loads(raw)['issues'][0]['outstanding'],1)

    def test_return_and_preparation_http_round_trip_preserves_the_receipt(self):
        from backend.http_security import COOKIE_NAME
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            db.execute("INSERT INTO staff_members(id,first_name) VALUES('return-person','Fictional Return Holder')")
        csrf=csrf_for_session(self.token)
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            receipt=receipt_payload();receipt.update(readyQuantity=10,checks=dict(itemsChecked=True,conditionChecked=True))
            status,result=self.post('/api/it-assets/receive',receipt,self.token,csrf)
            self.assertEqual(status,200,result)
            identity=result['stockItemId']
            with sqlite3.connect(self.path) as db:
                issued=issue_payload(db,identity,recipientId='return-person')
            self.assertEqual(self.post('/api/it-assets/issue',issued,self.token,csrf)[0],200)
            status,raw,_=self.request('/api/it-assets/issues',COOKIE_NAME+'='+self.token)
            source=json.loads(raw)['issues'][0]
            status,result=self.post('/api/it-assets/return',return_payload(source),self.token,csrf)
            self.assertEqual(status,200,result)
            with sqlite3.connect(self.path) as db:
                item=stock_item(db,identity)
            status,result=self.post('/api/it-assets/preparation',preparation_payload(item),self.token,csrf)
            self.assertEqual(status,200,result)
            with sqlite3.connect(self.path) as db:
                self.assertEqual(stock_item(db,identity)['balances']['readyToIssue'],10)
                self.assertEqual(db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='received'").fetchone(),(1,))
