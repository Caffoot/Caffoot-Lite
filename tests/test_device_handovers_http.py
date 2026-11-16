"""Direct handovers use the existing live session, permission and CSRF boundary."""
import json
import sqlite3
import unittest

from backend.device_assignments import read_assignments
from backend.device_handovers import reassign_device
from backend.stock_circulation import (legacy_device_issue, return_stock, registered_stock_devices, prepare_stock)
from backend.device_stock import reissue_stock_device
from test_device_handovers import handover_payload
from test_device_reissue import reissue_payload
import test_device_assignments_http as fixture
import test_stock_circulation as circulation


class DeviceHandoverHttpTests(unittest.TestCase):
    request = fixture.DeviceAssignmentHttpTests.request
    close_server = fixture.DeviceAssignmentHttpTests.close_server

    def setUp(self):
        fixture.DeviceAssignmentHttpTests.setUp(self)
        self.assertEqual(self.request('/api/equipment/assignments',method='POST',payload=self.payload)[0],200)
        with sqlite3.connect(self.path) as db:
            self.payload=handover_payload(db,'device',recipientKind='department',recipientId='dept')

    def test_devices_only_nonadministrator_handover_preserves_identity_and_no_stock_is_created(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
            before=db.execute('SELECT * FROM inventory_devices').fetchall()
        status,result,cache=self.request('/api/equipment/reassign',method='POST',actor=2,payload=self.payload)
        self.assertEqual(status,200,result);self.assertEqual(cache,'no-store')
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT * FROM inventory_devices').fetchall(),before)
            self.assertEqual(db.execute('SELECT count(*) FROM it_asset_stock_movements').fetchone(),(0,))
            self.assertEqual(read_assignments(db,2,device_id='device')['current'][0]['departmentId'],'dept')
        status,data,_=self.request('/api/equipment/assignments?deviceId=device',actor=3)
        self.assertEqual(status,200);self.assertIsNone(data['handoverContext'])
        self.assertEqual(data['history'][1]['closure']['kind'],'reassigned')
        self.assertNotIn('PRIVATE',json.dumps(data))

    def test_session_csrf_origin_mfa_edit_and_devices_feature_are_required(self):
        route='/api/equipment/reassign'
        for actor in (None,3,4,5,6):
            self.assertEqual(self.request(route,method='POST',actor=actor,payload=self.payload)[0],403)
        for headers in ({'X-CSRF-Token':''},{'Origin':'https://outside.example'},{'Sec-Fetch-Site':'cross-site'}):
            self.assertEqual(self.request(route,method='POST',payload=self.payload,headers=headers)[0],403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.assertEqual(self.request(route,method='POST',payload=self.payload)[0],403)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT count(*) FROM device_assignments').fetchone(),(1,))

    def test_strict_fields_checks_and_stale_requests_keep_the_old_assignment(self):
        route='/api/equipment/reassign'
        for request in (dict(self.payload,readyConfirmed=False),dict(self.payload,unknown=True),
                        dict(self.payload,checks=dict(cleanedWorking=True,dataPreparationConfirmed=False))):
            self.assertEqual(self.request(route,method='POST',payload=request)[0],400)
        self.assertEqual(self.request(route,method='POST',payload=dict(self.payload,version='stale'))[0],409)
        self.assertEqual(self.request(route,method='POST',raw=b'{"operationId":"a","operationId":"b"}')[0],400)
        self.assertEqual(self.request(route,method='POST',payload=self.payload,headers={'Content-Type':'text/plain'})[0],415)
        with sqlite3.connect(self.path) as db:
            self.assertIsNone(db.execute('SELECT ended_at FROM device_assignments').fetchone()[0])
        self.assertEqual(self.request(route,method='POST',payload=self.payload)[0],200)
        self.assertEqual(self.request(route,method='POST',payload=self.payload)[0],200)
        self.assertEqual(self.request(route,method='POST',payload=dict(self.payload,note='changed'))[0],409)

    def test_stock_linked_device_requires_assets_edit_and_hides_context_when_feature_off(self):
        with sqlite3.connect(self.path) as db:
            db.execute('PRAGMA foreign_keys=ON')
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'");db.commit()
            assignment=db.execute('SELECT id FROM device_assignments').fetchone()[0]
            source=legacy_device_issue(db,assignment)
            payload=circulation.return_payload(source);payload['deviceAssignmentId']=payload.pop('issueEntryId')
            return_stock(db,1,self.tokens[1],payload)
            held=registered_stock_devices(db)[0]
            prepare_stock(db,1,self.tokens[1],dict(operationId='prepare-fixture-00001',stockUnitId=held['stockUnitId'],
                version=held['version'],quantity=1,checkedOn=source['issuedOn'],
                checks=dict(cleanedWorking=True,dataPreparationConfirmed=True),note=''))
            reissue_stock_device(db,1,self.tokens[1],reissue_payload(db,'device'))
            payload=handover_payload(db,'device',recipientKind='department',recipientId='dept')
        self.assertEqual(self.request('/api/equipment/reassign',method='POST',payload=payload,actor=2)[0],403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        status,result,_=self.request('/api/equipment/assignments?deviceId=device')
        self.assertEqual(status,200);self.assertIsNone(result['handoverContext']);self.assertNotIn('stockHistory',result)
        self.assertEqual(self.request('/api/equipment/reassign',method='POST',payload=payload)[0],403)


if __name__=='__main__':unittest.main()
