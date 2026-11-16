"""Explicit physical returns preserve unassigned Devices without inventing an issue."""
import concurrent.futures
import http.client
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend import schema
from backend.device_assignments import read_assignments
from backend.request_auth import csrf_for_session
from backend.http_security import COOKIE_NAME
from backend.sessions import _digest
from backend.stock_circulation import (canonical_device_choice, prepare_stock,
    read_stock_issues, registered_stock_devices, return_stock, stock_movement_history)
import test_stock_circulation as circulation
import test_feature_settings_http as feature_http
import test_it_asset_stock_schema as stock_schema_fixture


def unassigned_return_payload(choice, **changes):
    payload=circulation.return_payload(dict(id=0,version=choice['version']))
    del payload['issueEntryId']
    payload.update(deviceId=choice['deviceId'],physicalReturnConfirmed=True)
    payload.update(changes)
    return payload


class UnassignedDeviceReturnTests(unittest.TestCase):
    setUp=circulation.StockCirculationTests.setUp
    legacy_device=circulation.StockCirculationTests.legacy_device
    unchanged=circulation.StockCirculationTests.unchanged

    def test_explicit_return_preserves_every_original_record_and_records_actual_provenance(self):
        choice=self.legacy_device(assigned=False,device_type='Server - Physical')
        original={table:self.db.execute('SELECT * FROM '+table).fetchall() for table in
            ('inventory_devices','accounts','account_sessions','account_profiles','roles','role_grants',
             'account_roles','account_permission_overrides','staff_members','departments','device_assignments')}
        self.assertEqual(registered_stock_devices(self.db),[])
        details=read_assignments(self.db,1,device_id='canonical')
        self.assertTrue(details['canReturn'])
        self.assertEqual(details['returnSource'],'unassigned-device:canonical')
        self.assertEqual(read_stock_issues(self.db,1)['deviceAssignments'],[])
        payload=unassigned_return_payload(choice)
        result=return_stock(self.db,1,self.token,payload)
        self.assertEqual(result['awaitingQuantity'],1)
        self.assertIsNone(result['readinessMovementId'])
        self.assertIsNone(result['writeOffMovementId'])
        held=registered_stock_devices(self.db)[0]
        self.assertEqual(held['deviceId'],'canonical')
        self.assertEqual(held['states'],dict(awaiting_preparation=1))
        for table,rows in original.items():
            self.assertEqual(self.db.execute('SELECT * FROM '+table).fetchall(),rows,table)
        self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_items').fetchone(),(0,))
        self.assertEqual(self.db.execute('''SELECT from_state,to_state,quantity,source_issue_entry_id,
            device_assignment_id,staff_id,department_id,recipient_label FROM it_asset_stock_entries''').fetchone(),
            (None,'awaiting_preparation',1,None,None,None,None,None))
        movement=self.db.execute('SELECT kind,event_date,actor_id,actor_label,recorded_at,checks_json FROM it_asset_stock_movements').fetchone()
        self.assertEqual(movement[:4],('returned',payload['returnedOn'],1,'Fictional Owner'))
        self.assertTrue(movement[4])
        metadata=json.loads(movement[5])
        self.assertTrue(metadata['physicalReturnConfirmed'])
        self.assertEqual(metadata['returnOrigin'],'unassigned_device')
        self.assertEqual(metadata['deviceRevision'],choice['revision'])
        self.assertIsNone(metadata['sourceIssueEntryId'])
        self.assertIsNone(metadata['originalAssignmentId'])
        event=stock_movement_history(self.db,1,device_id='canonical')[0]
        self.assertTrue(event['physicalReturnConfirmed'])
        self.assertIsNone(event['recipientLabel'])
        audit=json.loads(self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1').fetchone()[0])
        self.assertTrue(audit['changes'][0]['after']['physicalReturnConfirmed'])
        self.assertEqual(audit['changes'][0]['after']['deviceId'],'canonical')
        self.assertFalse(read_assignments(self.db,1,device_id='canonical')['canReturn'])
        preparation=circulation.preparation_payload(dict(id='unused',version=held['version']))
        del preparation['stockItemId'];preparation['stockUnitId']=held['stockUnitId']
        self.unchanged(ValueError,lambda:prepare_stock(self.db,1,self.token,preparation))
        preparation['checks']['dataPreparationConfirmed']=True
        prepare_stock(self.db,1,self.token,preparation)
        self.assertEqual(registered_stock_devices(self.db)[0]['states']['ready'],1)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='received'").fetchone(),(0,))

    def test_confirmation_must_be_true_and_cannot_be_attached_to_an_issue(self):
        choice=self.legacy_device(assigned=False)
        payload=unassigned_return_payload(choice)
        for value in (None,False,1,'true',[],{}):
            self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,dict(payload,physicalReturnConfirmed=value)))
        del payload['physicalReturnConfirmed']
        self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,payload))
        payload=unassigned_return_payload(choice,issueEntryId=1)
        self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,payload))
        del payload['deviceId']
        self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,payload))

    def test_quantity_dispositions_dates_and_stale_revisions_cannot_bypass_preparation(self):
        choice=self.legacy_device(assigned=False)
        for change in (dict(quantityReturned=0),dict(quantityReturned=2),dict(quantityReturned=True),
                       dict(readyQuantity=1,checks=dict(cleanedWorking=True,dataPreparationConfirmed=True)),
                       dict(writeOffQuantity=1,writeOffReason='Damaged'),dict(returnedOn='2099-01-01'),
                       dict(returnedOn='2026-02-30'),dict(actorId=2),dict(version='stale')):
            error=FileExistsError if 'version' in change else ValueError
            self.unchanged(error,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(choice,**change)))
        self.db.execute("UPDATE inventory_devices SET revision=revision+1 WHERE id='canonical'")
        self.db.commit()
        self.unchanged(FileExistsError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(choice)))

    def test_active_assignment_uses_the_existing_return_route(self):
        assigned=self.legacy_device()
        choice=canonical_device_choice(self.db,'canonical')
        self.assertFalse(choice['canReturnUnassigned'])
        self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(choice)))
        payload=circulation.return_payload(assigned)
        payload['deviceAssignmentId']=payload.pop('issueEntryId')
        return_stock(self.db,1,self.token,payload)
        self.assertIsNotNone(self.db.execute('SELECT ended_at FROM device_assignments').fetchone()[0])

    def test_old_completed_assignments_survive_without_becoming_an_invented_source(self):
        with stock_schema_fixture.database(version=16) as connection:
            stock_schema_fixture.seed_people(connection)
            stock_schema_fixture.device(connection,'legacy-server')
            connection.execute("UPDATE inventory_devices SET record_json=json_set(record_json,'$.type','Server - Physical')")
            connection.execute("INSERT INTO device_assignments(device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label,ended_at) VALUES('legacy-server','person','Historical Holder','2026-11-01',1,'Historical Technician','2026-11-02')")
            connection.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)',(_digest(self.token),))
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
            connection.commit();schema.initialise_database(connection)
            original=connection.execute('SELECT * FROM device_assignments').fetchall()
            return_stock(connection,1,self.token,unassigned_return_payload(canonical_device_choice(connection,'legacy-server')))
            self.assertEqual(connection.execute('SELECT * FROM device_assignments').fetchall(),original)
            self.assertEqual(connection.execute('SELECT device_assignment_id,source_issue_entry_id,recipient_label FROM it_asset_stock_entries').fetchone(),(None,None,None))

    def test_existing_empty_canonical_link_is_reused_and_edit_reservations_are_respected(self):
        self.legacy_device(assigned=False)
        self.db.execute("INSERT INTO it_asset_stock_units(id,device_id) VALUES('cccccccccccccccccccccccccccccccc','canonical')")
        self.db.execute("INSERT INTO device_edit_reservations VALUES('canonical',1,9999999999,0)")
        self.db.commit()
        choice=canonical_device_choice(self.db,'canonical')
        self.unchanged(FileExistsError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(choice)))
        self.db.execute('DELETE FROM device_edit_reservations');self.db.commit()
        return_stock(self.db,1,self.token,unassigned_return_payload(choice))
        self.assertEqual(self.db.execute('SELECT id FROM it_asset_stock_units').fetchall(),[('cccccccccccccccccccccccccccccccc',)])

    def test_held_ready_and_written_off_history_reject_another_physical_return(self):
        choice=self.legacy_device(assigned=False)
        payload=unassigned_return_payload(choice)
        result=return_stock(self.db,1,self.token,payload)
        before=tuple(self.db.iterdump())
        self.assertEqual(return_stock(self.db,1,self.token,payload),result)
        self.assertEqual(tuple(self.db.iterdump()),before)
        for state in ('awaiting_preparation','ready','written_off'):
            if state=='ready':
                held=registered_stock_devices(self.db)[0]
                prepared=circulation.preparation_payload(dict(id='unused',version=held['version']),
                    checks=dict(cleanedWorking=True,dataPreparationConfirmed=True))
                del prepared['stockItemId'];prepared['stockUnitId']=held['stockUnitId']
                prepare_stock(self.db,1,self.token,prepared)
            elif state=='written_off':
                from backend.stock_circulation import write_off_stock
                current=canonical_device_choice(self.db,'canonical')
                write=circulation.writeoff_payload(dict(id='unused',version=current['version']),
                    deviceId='canonical',fromState='ready')
                del write['stockItemId'];write_off_stock(self.db,1,self.token,write)
            current=canonical_device_choice(self.db,'canonical')
            self.assertFalse(current['canReturnUnassigned'])
            self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(current)))
        self.unchanged(FileExistsError,lambda:return_stock(self.db,1,self.token,dict(payload,operationId=uuid.uuid4().hex)))

    def test_virtual_types_and_virtual_relationships_are_rejected(self):
        choice=self.legacy_device(assigned=False)
        original=json.loads(self.db.execute('SELECT record_json FROM inventory_devices').fetchone()[0])
        for change in (dict(type='Server - Virtual'),dict(type='Virtual Machine'),
                       dict(isVirtual=True),dict(virtualHostId='host')):
            self.db.execute('UPDATE inventory_devices SET record_json=?',(json.dumps(dict(original,**change)),))
            self.db.commit()
            current=canonical_device_choice(self.db,'canonical')
            self.assertFalse(current['canReturnUnassigned'])
            self.unchanged(ValueError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(current)))

    def test_direct_or_imported_record_and_retired_status_never_create_stock_automatically(self):
        self.legacy_device(assigned=False,device_type='Server - Physical')
        self.db.execute("UPDATE inventory_devices SET record_json=json_set(record_json,'$.status','Retired')")
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.assertNotIn('returnSource',read_assignments(self.db,1,device_id='canonical'))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        self.db.commit()
        for _ in range(2):
            self.assertEqual(read_stock_issues(self.db,1)['registeredDevices'],[])
            self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_entries').fetchone(),(0,))
        original=self.db.execute('SELECT * FROM inventory_devices').fetchall()
        return_stock(self.db,1,self.token,unassigned_return_payload(canonical_device_choice(self.db,'canonical')))
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(),original)

    def test_permissions_features_mfa_sessions_and_replay_are_checked_live(self):
        choice=self.legacy_device(assigned=False)
        payload=unassigned_return_payload(choice)
        for field in ('active','mfa_confirmed'):
            self.db.execute('UPDATE accounts SET '+field+'=0 WHERE id=1');self.db.commit()
            self.unchanged(PermissionError,lambda:return_stock(self.db,1,self.token,payload))
            self.db.execute('UPDATE accounts SET '+field+'=1 WHERE id=1');self.db.commit()
        for feature in ('devices','it_assets'):
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?',(feature,));self.db.commit()
            self.unchanged(PermissionError,lambda:return_stock(self.db,1,self.token,payload))
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?',(feature,));self.db.commit()
        self.unchanged(PermissionError,lambda:return_stock(self.db,1,'invalid-session',payload))
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        self.unchanged(PermissionError,lambda:return_stock(self.db,2,'a'*64,payload))
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')");self.db.commit()
        self.db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=2 AND section='IT Assets'");self.db.commit()
        self.unchanged(PermissionError,lambda:return_stock(self.db,2,'a'*64,payload))
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'");self.db.commit()
        return_stock(self.db,2,'a'*64,payload)
        self.db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=2 AND section='Devices'");self.db.commit()
        self.unchanged(PermissionError,lambda:return_stock(self.db,2,'a'*64,payload))

    def test_audit_or_header_failure_rolls_back_the_identity_and_whole_return(self):
        choice=self.legacy_device(assigned=False)
        with patch('backend.stock_circulation.record_actor_event',side_effect=RuntimeError('Audit failed')):
            self.unchanged(RuntimeError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(choice)))
        self.db.execute("CREATE TRIGGER reject_return_header BEFORE INSERT ON it_asset_stock_movements BEGIN SELECT RAISE(ABORT,'Header failed'); END")
        self.db.commit()
        self.unchanged(sqlite3.IntegrityError,lambda:return_stock(self.db,1,self.token,unassigned_return_payload(choice)))

    def test_concurrent_returns_create_only_one_canonical_unit_and_movement(self):
        choice=self.legacy_device(assigned=False)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'returns.sqlite3'
            with sqlite3.connect(path) as target:self.db.backup(target)
            def save(_):
                with sqlite3.connect(path,timeout=5) as connection:
                    connection.execute('PRAGMA foreign_keys=ON')
                    try:
                        return_stock(connection,1,self.token,unassigned_return_payload(choice))
                        return True
                    except FileExistsError:return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(save,range(2))),[False,True])
            with sqlite3.connect(path) as connection:
                self.assertEqual(connection.execute('SELECT count(*) FROM it_asset_stock_units').fetchone(),(1,))
                self.assertEqual(connection.execute('SELECT count(*) FROM it_asset_stock_movements').fetchone(),(1,))
                self.assertEqual(connection.execute('SELECT count(*) FROM device_assignments').fetchone(),(0,))
                self.assertEqual(connection.execute('PRAGMA foreign_key_check').fetchall(),[])


class UnassignedDeviceReturnHttpTests(unittest.TestCase):
    setUp=feature_http.FeatureSettingsHttpTests.setUp
    tearDown=feature_http.FeatureSettingsHttpTests.tearDown
    request=feature_http.FeatureSettingsHttpTests.request
    post=feature_http.FeatureSettingsHttpTests.post

    def test_existing_return_endpoint_requires_origin_csrf_and_affirmative_provenance(self):
        with sqlite3.connect(self.path) as connection:
            connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('it_assets','devices')")
            record=dict(id='returned-server',name='Fictional Returned Server',type='Server - Physical',status='Maintenance',primaryIp='192.0.2.21')
            connection.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,0)',
                               (record['id'],record['name'],json.dumps(record)))
            payload=unassigned_return_payload(canonical_device_choice(connection,record['id']))
        csrf=csrf_for_session(self.token)
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            connection=http.client.HTTPConnection('127.0.0.1',self.server.server_port)
            connection.request('POST','/api/it-assets/return',body=json.dumps(payload),headers={
                'Content-Type':'application/json','Origin':'https://foreign.example',
                'Cookie':COOKIE_NAME+'='+self.token,'X-CSRF-Token':csrf})
            response=connection.getresponse();self.assertEqual(response.status,403);response.read();connection.close()
            self.assertEqual(self.post('/api/it-assets/return',payload,None,None)[0],403)
            self.assertEqual(self.post('/api/it-assets/return',payload,self.token,None)[0],403)
            self.assertEqual(self.post('/api/it-assets/return',dict(payload,physicalReturnConfirmed=False),self.token,csrf)[0],400)
            status,result=self.post('/api/it-assets/return',payload,self.token,csrf)
            self.assertEqual(status,200,result)
            self.assertEqual(result['awaitingQuantity'],1)
        with sqlite3.connect(self.path) as connection:
            self.assertEqual(json.loads(connection.execute('SELECT record_json FROM inventory_devices').fetchone()[0]),record)
            self.assertEqual(connection.execute('SELECT count(*) FROM device_assignments').fetchone(),(0,))
