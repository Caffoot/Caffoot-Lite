"""Resolve actual missing quantities before a prepared workstation changes holder."""
import concurrent.futures
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch
import uuid

from backend.device_assignments import read_assignments
from backend.device_stock import reissue_stock_device, reissue_device_choices
from backend.equipment_associations import add_associated_equipment, has_outstanding_associated_equipment
from backend.stock_circulation import (write_off_stock, stock_issue_records, return_stock,
    legacy_device_issue, registered_stock_devices, prepare_stock, publish_stock_movement)
from backend.stock_intake import stock_item
from test_associated_equipment_writes import association_payload
from test_stock_circulation import issue_payload
from test_device_reissue import reissue_payload
import test_equipment_associations_http as http_fixture
import test_equipment_associations as fixture
import test_stock_circulation as circulation


def missing_payload(source, quantity=1, **changes):
    return dict(dict(operationId=uuid.uuid4().hex, issueEntryId=source['id'],version=source['version'],
        quantity=quantity,fromState='issued',writtenOffOn=source['issuedOn'],reason='Missing mouse',note='Actual missing quantity'), **changes)


class AssociatedEquipmentResolutionTests(unittest.TestCase):
    setUp = fixture.EquipmentAssociationTests.setUp
    receipt = fixture.EquipmentAssociationTests.receipt
    issued = fixture.EquipmentAssociationTests.issued
    issue = fixture.EquipmentAssociationTests.issue
    legacy_device = fixture.EquipmentAssociationTests.legacy_device
    unchanged = circulation.StockCirculationTests.unchanged

    def linked(self, quantity=5):
        source = self.issued(quantity=quantity)
        add_associated_equipment(self.db,1,self.token,association_payload(self.db,
            issueEntryId=source['id'],version=source['version']))
        return source

    def writeoff(self, source, quantity=1, **changes):
        return write_off_stock(self.db,1,self.token,missing_payload(source,quantity,**changes))

    def test_missing_quantity_never_enters_held_or_ready_and_preserves_original_issue(self):
        source=self.linked()
        original=self.db.execute('SELECT * FROM it_asset_stock_entries WHERE id=?',(source['id'],)).fetchone()
        before=stock_item(self.db,source['stockItemId'])['balances']
        self.writeoff(source,2)
        current=stock_issue_records(self.db)[0]
        self.assertEqual((current['quantity'],current['outstanding']),(5,3))
        self.assertEqual(stock_item(self.db,source['stockItemId'])['balances'],before)
        self.assertEqual(stock_item(self.db,source['stockItemId'])['stateBalances']['writtenOff'],2)
        self.assertEqual(self.db.execute('SELECT * FROM it_asset_stock_entries WHERE id=?',(source['id'],)).fetchone(),original)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='returned'").fetchone(),(0,))
        row=self.db.execute("SELECT event_date,actor_id,actor_label,reason FROM it_asset_stock_movements WHERE kind='written_off'").fetchone()
        self.assertEqual(row,(source['issuedOn'],1,'Fictional Owner','Missing mouse'))
        return_stock(self.db,1,self.token,circulation.return_payload(current,quantityReturned=3))
        item=stock_item(self.db,source['stockItemId'])
        self.assertEqual(item['balances']['physicallyHeld'],8)
        self.assertEqual(item['balances']['readyToIssue'],5)
        self.assertFalse(has_outstanding_associated_equipment(self.db,'canonical'))

    def test_invalid_quantities_reason_state_and_stale_requests_leave_every_record_unchanged(self):
        source=self.linked()
        for quantity in (0,-1,True,1.5,6):
            self.unchanged(ValueError,lambda:self.writeoff(source,quantity))
        self.unchanged(ValueError,lambda:self.writeoff(source,reason=''))
        self.unchanged(ValueError,lambda:self.writeoff(source,fromState='ready'))
        self.writeoff(source,2)
        self.unchanged(FileExistsError,lambda:self.writeoff(source,1))
        source=stock_issue_records(self.db)[0]
        self.writeoff(source,3)
        self.unchanged(ValueError,lambda:self.writeoff(stock_issue_records(self.db)[0]))

    def test_idempotency_live_access_and_failure_after_persistence(self):
        source=self.linked()
        payload=missing_payload(source,2)
        result=write_off_stock(self.db,1,self.token,payload)
        before=tuple(self.db.iterdump())
        self.assertEqual(write_off_stock(self.db,1,self.token,payload),result)
        self.assertEqual(tuple(self.db.iterdump()),before)
        self.unchanged(FileExistsError,lambda:write_off_stock(self.db,1,self.token,dict(payload,quantity=1)))
        self.unchanged(PermissionError,lambda:write_off_stock(self.db,2,'a'*64,payload))
        self.unchanged(PermissionError,lambda:write_off_stock(self.db,1,'invalid',payload))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.unchanged(PermissionError,lambda:write_off_stock(self.db,1,self.token,payload))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        self.db.commit()
        source=stock_issue_records(self.db)[0]
        def fail(*args,**kwargs):
            publish_stock_movement(*args,**kwargs)
            raise RuntimeError('Injected failure after permanent facts were prepared')
        with patch('backend.stock_circulation.publish_stock_movement',side_effect=fail):
            self.unchanged(RuntimeError,lambda:self.writeoff(source))

    def test_reissue_waits_for_all_historical_accessories_and_requires_workstation_checks(self):
        source=self.linked()
        device_before=self.db.execute('SELECT * FROM inventory_devices').fetchall()
        workstation=legacy_device_issue(self.db,self.assignment)
        returned=circulation.return_payload(workstation)
        returned['deviceAssignmentId']=returned.pop('issueEntryId')
        return_stock(self.db,1,self.token,returned)
        held=registered_stock_devices(self.db)[0]
        preparation=dict(operationId=uuid.uuid4().hex,stockUnitId=held['stockUnitId'],version=held['version'],quantity=1,
            checkedOn=source['issuedOn'],checks=dict(cleanedWorking=True,dataPreparationConfirmed=False),note='')
        self.unchanged(ValueError,lambda:prepare_stock(self.db,1,self.token,preparation))
        preparation['checks']['dataPreparationConfirmed']=True
        prepare_stock(self.db,1,self.token,preparation)
        self.assertTrue(has_outstanding_associated_equipment(self.db,'canonical'))
        self.assertEqual(reissue_device_choices(self.db,1)['devices'],[])
        self.assertFalse(read_assignments(self.db,1,device_id='canonical')['canReissue'])
        request=reissue_payload(self.db,'canonical',recipientId='other')
        self.unchanged(ValueError,lambda:reissue_stock_device(self.db,1,self.token,request))
        self.writeoff(source,2)
        self.unchanged(ValueError,lambda:reissue_stock_device(self.db,1,self.token,request))
        return_stock(self.db,1,self.token,circulation.return_payload(stock_issue_records(self.db)[0],quantityReturned=3))
        original=self.db.execute('SELECT * FROM device_assignments WHERE id=?',(self.assignment,)).fetchone()
        second=reissue_stock_device(self.db,1,self.token,request)
        self.assertNotEqual(second['assignmentId'],self.assignment)
        self.assertEqual(self.db.execute('SELECT * FROM device_assignments WHERE id=?',(self.assignment,)).fetchone(),original)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),device_before)
        self.assertEqual(read_assignments(self.db,1,device_id='canonical')['current'][0]['staffId'],'other')
        self.assertEqual(stock_issue_records(self.db)[1]['staffId'],'person')
        self.assertEqual(stock_issue_records(self.db)[1]['outstanding'],0)

    def test_concurrent_missing_quantities_and_identical_retries_do_not_double_writeoff(self):
        source=self.linked()
        for replay in (False,True):
            with tempfile.TemporaryDirectory() as folder:
                path=Path(folder)/'resolution.sqlite3'
                with sqlite3.connect(path) as target:self.db.backup(target)
                payload=missing_payload(source,3);barrier=threading.Barrier(2)
                def save(index):
                    request=dict(payload,operationId=payload['operationId'] if replay else uuid.uuid4().hex)
                    with sqlite3.connect(path,timeout=5) as db:
                        db.execute('PRAGMA foreign_keys=ON');barrier.wait(timeout=5)
                        try:return write_off_stock(db,1,self.token,request)
                        except FileExistsError:return None
                with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(save,range(2)))
                self.assertEqual(sum(result is not None for result in results),2 if replay else 1)
                if replay:self.assertEqual(results[0],results[1])
                with sqlite3.connect(path) as db:
                    self.assertEqual(stock_issue_records(db)[0]['outstanding'],2)
                    self.assertEqual(db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='written_off'").fetchone(),(1,))


class MissingEquipmentHttpTests(unittest.TestCase):
    request = http_fixture.EquipmentAssociationHttpTests.request
    close_server = http_fixture.EquipmentAssociationHttpTests.close_server

    def setUp(self):
        http_fixture.EquipmentAssociationHttpTests.setUp(self)
        from backend.stock_circulation import issue_stock
        with sqlite3.connect(self.path) as db:
            item=db.execute('SELECT id FROM it_asset_stock_items').fetchone()[0]
            issue_stock(db,1,self.tokens[1],issue_payload(db,item,quantity=3))
            self.source=stock_issue_records(db)[0]
            self.payload=missing_payload(self.source,2)

    def test_exact_missing_quantity_saves_without_physical_return(self):
        status,result,_=self.request('/api/it-assets/write-off',method='POST',payload=self.payload)
        self.assertEqual(status,200,result)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(stock_issue_records(db)[0]['outstanding'],1)
            self.assertEqual(stock_item(db,self.source['stockItemId'])['balances']['physicallyHeld'],6)
            self.assertEqual(db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='returned'").fetchone(),(0,))

    def test_quantity_writeoff_keeps_existing_session_csrf_feature_and_edit_gates(self):
        for actor in (None,2,3,4,6):
            self.assertEqual(self.request('/api/it-assets/write-off',method='POST',payload=self.payload,actor=actor)[0],403)
        for headers in ({'X-CSRF-Token':''},{'Origin':'https://outside.example'}):
            self.assertEqual(self.request('/api/it-assets/write-off',method='POST',payload=self.payload,headers=headers)[0],403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.assertEqual(self.request('/api/it-assets/write-off',method='POST',payload=self.payload)[0],403)


if __name__=='__main__':
    unittest.main()
