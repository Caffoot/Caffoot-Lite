"""Prepared handovers preserve canonical identity, custody, privacy and atomic history."""
import concurrent.futures
from datetime import datetime, timezone, timedelta
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch
import uuid

from backend.device_handovers import device_handover_context, reassign_device
from backend.device_assignments import read_assignments, my_equipment
from backend.equipment_associations import add_associated_equipment
from backend.stock_circulation import (stock_issue_records, stock_movement_history, return_stock,
    publish_stock_movement, canonical_device_choice)
from backend.stock_intake import stock_item
from backend import schema
from test_associated_equipment_writes import association_payload
from test_associated_equipment_resolution import missing_payload
from backend.stock_circulation import write_off_stock
import test_device_reissue as reissue_fixture
import test_equipment_associations as association_fixture
import test_stock_circulation as circulation


def handover_payload(connection, device_id='canonical', actor=1, **values):
    context=device_handover_context(connection,actor,device_id)
    return dict(dict(operationId=uuid.uuid4().hex,deviceId=device_id,version=context['version'],
        recipientKind='staff',recipientId='other',handedOverOn=datetime.now(timezone.utc).date().isoformat(),
        checks=dict(cleanedWorking=True,dataPreparationConfirmed=True),readyConfirmed=True,note='Checked and wiped'),**values)


class DeviceHandoverTests(unittest.TestCase):
    setUp = association_fixture.EquipmentAssociationTests.setUp
    receipt = association_fixture.EquipmentAssociationTests.receipt
    issued = association_fixture.EquipmentAssociationTests.issued
    issue = association_fixture.EquipmentAssociationTests.issue
    legacy_device = association_fixture.EquipmentAssociationTests.legacy_device
    unchanged = circulation.StockCirculationTests.unchanged
    source = reissue_fixture.DeviceReissueTests.source
    ready_device = reissue_fixture.DeviceReissueTests.ready_device

    def save(self,payload=None):
        return reassign_device(self.db,1,self.token,payload or handover_payload(self.db))

    def stock_device(self):
        # Registration validates all inventory; keep this fixture's unrelated
        # workstation free of the deliberately invalid rack/IP test values.
        record=dict(id='canonical',name='Fictional Laptop',type='Laptop',status='Active',
                    mountType='Desktop',location='Unknown',primaryIp='')
        self.db.execute("UPDATE inventory_devices SET record_json=? WHERE id='canonical'",(json.dumps(record),))
        self.db.commit()
        item,identity=self.ready_device()
        reissue_fixture.reissue_stock_device(self.db,1,self.token,reissue_fixture.reissue_payload(self.db,identity))
        return item,identity

    def test_devices_only_handover_creates_no_stock_and_preserves_original_identity(self):
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'");self.db.commit()
        original=self.db.execute('SELECT * FROM inventory_devices').fetchall()
        old=self.db.execute('SELECT * FROM device_assignments WHERE id=?',(self.assignment,)).fetchone()
        result=self.save()
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),original)
        closed=self.db.execute('SELECT * FROM device_assignments WHERE id=?',(self.assignment,)).fetchone()
        self.assertEqual(closed[:8],old[:8]);self.assertIsNotNone(closed[8])
        self.assertIsNone(closed[9]);self.assertIsNotNone(closed[10]);self.assertEqual(closed[11],result['assignmentId'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_units').fetchone(),(0,))
        self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_movements').fetchone(),(0,))
        self.assertEqual(read_assignments(self.db,1,device_id='canonical')['current'][0]['staffId'],'other')
        self.assertEqual(read_assignments(self.db,1,device_id='canonical')['history'][1]['closure']['kind'],'reassigned')
        self.assertTrue(read_assignments(self.db,1,device_id='canonical')['history'][1]['closure']['readyConfirmed'])
        self.assertEqual(my_equipment(self.db,2)['assignedToMe'],[])
        schema.initialise_database(self.db)

    def test_registered_device_changes_custody_without_held_ready_receipt_or_duplicate_identity(self):
        item,identity=self.stock_device()
        before=stock_item(self.db,item)['balances']
        units=self.db.execute('SELECT * FROM it_asset_stock_units').fetchall()
        original=next(issue for issue in stock_issue_records(self.db) if issue['deviceAssignmentId'])
        physical_before=self.db.execute("SELECT id,kind FROM it_asset_stock_movements WHERE kind IN ('received','returned','readiness_changed')").fetchall()
        result=self.save(handover_payload(self.db,identity,recipientKind='department',recipientId='department'))
        self.assertEqual(stock_item(self.db,item)['balances'],before)
        self.assertEqual(self.db.execute('SELECT * FROM it_asset_stock_units').fetchall(),units)
        issues=[row for row in stock_issue_records(self.db) if row['stockUnitId']==original['stockUnitId']]
        self.assertEqual([(row['outstanding'],row['staffId'],row['departmentId']) for row in issues],[(1,None,'department'),(0,'person',None)])
        self.assertEqual(self.db.execute("SELECT id,kind FROM it_asset_stock_movements WHERE kind IN ('received','returned','readiness_changed')").fetchall(),physical_before)
        movements=stock_movement_history(self.db,1,device_id=identity)
        self.assertEqual(movements[0]['kind'],'reassigned');self.assertEqual(movements[0]['quantity'],1)
        self.assertEqual((movements[0]['fromState'],movements[0]['toState']),('issued','issued'))
        self.assertTrue(movements[0]['directHandover'])
        return_stock(self.db,1,self.token,circulation.return_payload(issues[0]))
        self.assertEqual(canonical_device_choice(self.db,identity)['states']['awaiting_preparation'],1)
        self.assertEqual(self.db.execute('SELECT handover_event_id FROM device_assignments WHERE id=?',(result['assignmentId'],)).fetchone(),(None,))
        schema.initialise_database(self.db)

    def test_applicable_checks_and_explicit_ready_are_mandatory(self):
        payload=handover_payload(self.db)
        for changes in (dict(readyConfirmed=False),dict(readyConfirmed=1),
            dict(checks=dict(cleanedWorking=False,dataPreparationConfirmed=True)),
            dict(checks=dict(cleanedWorking=True,dataPreparationConfirmed=False)),
            dict(checks=dict(cleanedWorking=1,dataPreparationConfirmed=True))):
            self.unchanged(ValueError,lambda:self.save(dict(payload,**changes)))
        self.unchanged(ValueError,lambda:self.save(dict(payload,recipientId='person')))

    def test_new_recipient_eligibility_and_actual_former_leaver_are_respected(self):
        payload=handover_payload(self.db)
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='other'");self.db.commit()
        self.unchanged(ValueError,lambda:self.save(payload))
        self.db.execute("UPDATE staff_members SET active=1 WHERE id='other'")
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'");self.db.commit()
        self.unchanged(ValueError,lambda:self.save(dict(payload,recipientKind='department',recipientId='department')))
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='person'");self.db.commit()
        self.save(payload)
        self.assertEqual(read_assignments(self.db,1,device_id='canonical')['current'][0]['staffId'],'other')

    def test_outstanding_associated_accessories_block_even_when_hidden(self):
        issue=self.issued(quantity=2)
        add_associated_equipment(self.db,1,self.token,association_payload(self.db,issueEntryId=issue['id'],version=issue['version']))
        self.assertIsNone(device_handover_context(self.db,1,'canonical'))
        payload=dict(operationId=uuid.uuid4().hex,deviceId='canonical',version='stale',recipientKind='staff',recipientId='other',
            handedOverOn=issue['issuedOn'],checks=dict(cleanedWorking=True,dataPreparationConfirmed=True),readyConfirmed=True,note='')
        self.unchanged(ValueError,lambda:self.save(payload))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'");self.db.commit()
        result=read_assignments(self.db,1,device_id='canonical')
        self.assertIsNone(result['handoverContext']);self.assertNotIn('stockHistory',result)
        self.unchanged(ValueError,lambda:self.save(payload))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'");self.db.commit()
        write_off_stock(self.db,1,self.token,missing_payload(issue,1))
        self.assertIsNone(device_handover_context(self.db,1,'canonical'))
        return_stock(self.db,1,self.token,circulation.return_payload(stock_issue_records(self.db)[0]))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'");self.db.commit()
        self.save();self.assertEqual(stock_issue_records(self.db)[0]['staffId'],'person')
        self.assertEqual(stock_issue_records(self.db)[0]['outstanding'],0)

    def test_registered_stock_requires_both_live_feature_edit_rights_without_leaking_its_context(self):
        _,identity=self.stock_device();payload=handover_payload(self.db,identity)
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')");self.db.commit()
        self.assertIsNone(device_handover_context(self.db,2,identity))
        self.unchanged(PermissionError,lambda:reassign_device(self.db,2,'a'*64,payload))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'");self.db.commit()
        self.assertIsNone(device_handover_context(self.db,1,identity))
        self.unchanged(PermissionError,lambda:self.save(payload))

    def test_devices_only_nonadministrator_can_reassign_with_no_assets_grant(self):
        self.db.execute("DELETE FROM account_permission_overrides WHERE account_id=2")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'");self.db.commit()
        payload=handover_payload(self.db,actor=2)
        reassign_device(self.db,2,'a'*64,payload)
        self.db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=2");self.db.commit()
        self.unchanged(PermissionError,lambda:reassign_device(self.db,2,'a'*64,payload))

    def test_session_mfa_feature_stale_versions_and_edit_reservations_are_checked(self):
        payload=handover_payload(self.db)
        self.unchanged(PermissionError,lambda:reassign_device(self.db,1,'invalid',payload))
        self.db.execute('UPDATE accounts SET mfa_confirmed=0 WHERE id=1');self.db.commit()
        self.unchanged(PermissionError,lambda:self.save(payload))
        self.db.execute('UPDATE accounts SET mfa_confirmed=1 WHERE id=1')
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'");self.db.commit()
        self.unchanged(PermissionError,lambda:self.save(payload))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        self.db.execute("UPDATE inventory_devices SET revision=revision+1 WHERE id='canonical'");self.db.commit()
        self.unchanged(FileExistsError,lambda:self.save(payload))
        payload=handover_payload(self.db)
        self.db.execute("INSERT INTO device_edit_reservations VALUES('canonical',1,9999999999,1)");self.db.commit()
        self.unchanged(FileExistsError,lambda:self.save(payload))

    def test_idempotent_retries_after_later_changes_and_conflicting_references(self):
        payload=handover_payload(self.db);result=self.save(payload)
        before=tuple(self.db.iterdump());self.assertEqual(self.save(payload),result)
        self.assertEqual(tuple(self.db.iterdump()),before)
        self.unchanged(FileExistsError,lambda:self.save(dict(payload,note='Different request')))
        self.db.execute("INSERT INTO device_edit_reservations VALUES('canonical',1,9999999999,0)");self.db.commit()
        before=tuple(self.db.iterdump());self.assertEqual(self.save(payload),result)
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_invalid_dates_payload_and_virtual_devices_fail_without_changes(self):
        payload=handover_payload(self.db)
        for changes in (dict(handedOverOn='2026-02-30'),dict(handedOverOn='2000-01-01'),
                        dict(handedOverOn=(datetime.now(timezone.utc)+timedelta(days=1)).date().isoformat()),dict(extra=True)):
            self.unchanged(ValueError,lambda:self.save(dict(payload,**changes)))
        raw=json.loads(self.db.execute("SELECT record_json FROM inventory_devices WHERE id='canonical'").fetchone()[0])
        raw['isVirtual']=True
        self.db.execute("UPDATE inventory_devices SET record_json=? WHERE id='canonical'",(json.dumps(raw),));self.db.commit()
        self.assertIsNone(device_handover_context(self.db,1,'canonical'))
        self.unchanged(ValueError,lambda:self.save(payload))

    def test_registered_failure_after_all_facts_rolls_back_old_and_new_custody_and_audits(self):
        _,identity=self.stock_device();payload=handover_payload(self.db,identity)
        def fail(*args,**kwargs):
            publish_stock_movement(*args,**kwargs)
            self.assertEqual(read_assignments(self.db,1,device_id=identity)['current'][0]['staffId'],'other')
            raise RuntimeError('Injected failure after handover persistence')
        with patch('backend.device_handovers.publish_stock_movement',side_effect=fail):
            self.unchanged(RuntimeError,lambda:self.save(payload))
        with patch('backend.device_handovers.publish_stock_movement',return_value=None):
            self.unchanged(sqlite3.IntegrityError,lambda:self.save(payload))

    def test_devices_only_successor_failure_rolls_back_old_closure_and_preparation(self):
        payload=handover_payload(self.db)
        self.db.execute('''CREATE TRIGGER reject_successor BEFORE INSERT ON device_assignments
            WHEN NEW.id>1 BEGIN SELECT RAISE(ABORT,'Injected successor failure'); END''');self.db.commit()
        self.unchanged(sqlite3.IntegrityError,lambda:self.save(payload))

    def test_handover_audit_assignment_fields_and_successor_links_are_permanent(self):
        result=self.save()
        event=self.db.execute('SELECT handover_event_id FROM device_assignments WHERE id=?',(result['previousAssignmentId'],)).fetchone()[0]
        before=tuple(self.db.iterdump())
        for sql,values in (('DELETE FROM inventory_change_history WHERE id=?',(event,)),
            ("UPDATE inventory_change_history SET record_json='{}' WHERE id=?",(event,)),
            ('UPDATE device_assignments SET successor_assignment_id=NULL WHERE id=?',(result['previousAssignmentId'],)),
            ("UPDATE device_assignments SET recipient_label='Changed' WHERE id=?",(result['assignmentId'],))):
            with self.assertRaises(sqlite3.IntegrityError):self.db.execute(sql,values)
            self.db.rollback();self.assertEqual(tuple(self.db.iterdump()),before)

    def test_successive_registered_handovers_keep_one_issued_unit_and_both_former_holders(self):
        item,identity=self.stock_device()
        self.save(handover_payload(self.db,identity))
        self.save(handover_payload(self.db,identity,recipientKind='department',recipientId='department'))
        issues=[issue for issue in stock_issue_records(self.db) if issue['stockUnitId']]
        self.assertEqual([issue['outstanding'] for issue in issues],[1,0,0])
        self.assertEqual(len(read_assignments(self.db,1,device_id=identity)['history']),3)
        self.assertEqual(stock_item(self.db,item)['balances']['physicallyHeld'],9)
        schema.initialise_database(self.db)

    def test_concurrent_requests_and_identical_retries_preserve_exactly_one_new_holder(self):
        for registered in (False,True):
            identity=self.stock_device()[1] if registered else 'canonical'
            for identical in (False,True):
                payload=handover_payload(self.db,identity)
                with tempfile.TemporaryDirectory() as directory:
                    path=Path(directory)/'handover.sqlite3'
                    with sqlite3.connect(path) as target:self.db.backup(target)
                    barrier=threading.Barrier(2)
                    def save(index):
                        request=dict(payload,operationId=payload['operationId'] if identical else uuid.uuid4().hex)
                        with sqlite3.connect(path,timeout=5) as db:
                            db.execute('PRAGMA foreign_keys=ON');barrier.wait(timeout=5)
                            try:return reassign_device(db,1,self.token,request)
                            except FileExistsError:return None
                    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(save,range(2)))
                    self.assertEqual(sum(row is not None for row in results),2 if identical else 1)
                    if identical:self.assertEqual(*results)
                    with sqlite3.connect(path) as db:
                        self.assertEqual(db.execute('SELECT count(*) FROM device_assignments WHERE device_id=? AND ended_at IS NULL',(identity,)).fetchone(),(1,))
                        self.assertEqual(db.execute('SELECT count(*) FROM device_assignments WHERE device_id=?',(identity,)).fetchone(),(2,))
                        if registered:self.assertEqual(sum(issue['outstanding'] for issue in stock_issue_records(db)),1)


if __name__=='__main__':unittest.main()
