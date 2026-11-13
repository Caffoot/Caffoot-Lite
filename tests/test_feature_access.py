"""Feature combinations retain configured grants and protect API projections."""
import itertools
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

import test_session_http as session_http
from backend.collection_saves import change_inventory_record
from backend.device_saves import save_reserved_device
from backend.http_security import COOKIE_NAME
from backend.inventory import stage_inventory
from backend.permissions import can_access, feature_enabled
from backend.request_auth import csrf_for_session
from backend.roles import account_access_details


class FeatureAccessHttpTests(unittest.TestCase):
    setUp = session_http.SessionHttpTests.setUp
    tearDown = session_http.SessionHttpTests.tearDown
    request = session_http.SessionHttpTests.request
    post = session_http.SessionHttpTests.post

    def seed(self):
        state = dict(devices=[dict(id='d1',name='PRIVATE_DEVICE',mountType='Rack Mounted',rackId='r1',rackUStart=1,rackUEnd=1,rackUHeight=1,primaryIp='10.0.0.10',location='Office')],
                     subnets=[dict(id='s1',name='PRIVATE_SUBNET',cidr='10.0.0.0/24',gateway='10.0.0.1',vlan=20)],
                     vlans=[],racks=[dict(id='r1',name='PRIVATE_RACK',heightU=12)],rackAccessories=[],
                     ipAllocations={'10.0.0.10':dict(deviceId='d1',hostname='PRIVATE_DEVICE',status='Assigned')},
                     deviceTypes=['PRIVATE_CATALOGUE'])
        with sqlite3.connect(self.path) as db:
            stage_inventory(db,state)
            db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)',(json.dumps(dict(reason='PRIVATE_LEGACY_REASON',changes=[dict(kind=kind,label=label,action='Created',fields=[]) for kind,label in [('Device','PRIVATE_DEVICE'),('IPAM','PRIVATE_SUBNET'),('Rack','PRIVATE_RACK')]])),))
        return state

    def features(self, enabled):
        with sqlite3.connect(self.path) as db:
            db.execute('UPDATE organisation_features SET enabled=0')
            db.executemany('UPDATE organisation_features SET enabled=1 WHERE feature=?',[(f,) for f in enabled])

    def get(self, endpoint):
        status, raw, _ = self.request(endpoint, COOKIE_NAME+'='+self.token)
        return status, json.loads(raw)

    def test_all_feature_combinations_filter_direct_combined_history_and_settings(self):
        self.seed()
        for flags in itertools.product((False,True),repeat=3):
            enabled=[name for name,flag in zip(('devices','ipam','racks'),flags) if flag]
            self.features(enabled)
            with self.subTest(enabled=enabled):
                status,result=self.get('/api/inventory/state')
                self.assertEqual(status,200)
                for name,section,collection,marker in zip(('devices','ipam','racks'),('Devices','IPAM','Racks'),('devices','subnets','racks'),('PRIVATE_DEVICE','PRIVATE_SUBNET','PRIVATE_RACK')):
                    self.assertEqual(result['sections'][section],name in enabled)
                    self.assertEqual(collection in result,name in enabled)
                    direct,data=self.get('/api/inventory/'+name)
                    self.assertEqual(direct,200 if name in enabled else 403)
                    if name not in enabled:
                        self.assertNotIn(marker,json.dumps(result))
                self.assertEqual('PRIVATE_CATALOGUE' in json.dumps(result['settings']),'devices' in enabled)
                if 'devices' not in enabled:
                    self.assertNotIn('deviceEditors',result)
                    self.assertNotIn('deviceRevisions',result)
                status,settings=self.get('/api/inventory/settings')
                self.assertEqual(status,200)
                self.assertEqual('PRIVATE_CATALOGUE' in json.dumps(settings),'devices' in enabled)
                status,history=self.get('/api/inventory/history')
                self.assertEqual(status,200 if enabled else 403)
                if len(enabled)<3:self.assertNotIn('PRIVATE_LEGACY_REASON',json.dumps(history))

    def test_all_off_admin_essentials_and_account_access(self):
        self.seed();self.features([])
        for endpoint in ('/inventory','/account','/api/users','/api/settings/features','/api/account/profile','/api/session'):
            self.assertEqual(self.request(endpoint,COOKIE_NAME+'='+self.token)[0],200,endpoint)
        status,session=self.get('/api/session')
        self.assertTrue(session['can_enter_inventory'])
        for endpoint in ('/api/inventory/devices','/api/inventory/ipam','/api/inventory/racks'):
            self.assertEqual(self.get(endpoint)[0],403)
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            requests=[('/api/devices/create',{'record':{'id':'new','name':'New'}}),
                      ('/api/devices/edit/start',{'deviceId':'d1'}),
                      ('/api/devices/delete',{'deviceId':'d1','revision':0}),
                      ('/api/ipam/allocation/save',{'ip':'10.0.0.12','record':{'status':'Available'}}),
                      ('/api/inventory/record/save',{'collection':'racks','id':'new','record':{'id':'new','heightU':12}}),
                      ('/api/inventory/reset',{'confirmed':True}),
                      ('/api/inventory/settings/save',{'key':'deviceTypes','value':[]})]
            for endpoint,payload in requests:
                self.assertEqual(self.post(endpoint,payload,self.token,csrf_for_session(self.token))[0],403,endpoint)

    def test_ordinary_users_keep_account_without_inventory_or_administrator_access(self):
        from backend.permissions import create_user
        from backend.sessions import login_session
        with sqlite3.connect(self.path) as db:
            create_user(db,1,'staff','password')
            token=login_session(db,'staff','password')
        self.features([])
        self.assertEqual(self.request('/account',COOKIE_NAME+'='+token)[0],200)
        for endpoint in ('/inventory','/api/users','/api/settings/features','/api/inventory/state'):
            self.assertEqual(self.request(endpoint,COOKIE_NAME+'='+token)[0],403,endpoint)

    def test_grants_overrides_mfa_status_and_future_features_fail_closed(self):
        self.features(['devices','ipam','racks'])
        with sqlite3.connect(self.path) as db:
            db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(2,'reader','hash','secret',1)")
            db.execute("INSERT INTO roles(id,role_key,name) VALUES(99,'readers','Readers')")
            db.execute("INSERT INTO account_roles VALUES(2,99)")
            db.execute("INSERT INTO role_grants VALUES(99,'Devices','read')")
            db.commit()
            for enabled,override in itertools.product((0,1),(None,'deny','read','edit')):
                db.execute("UPDATE organisation_features SET enabled=? WHERE feature='devices'",(enabled,))
                db.execute('DELETE FROM account_permission_overrides WHERE account_id=2')
                if override:db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices',?)",(override,))
                db.commit()
                expected=bool(enabled and override!='deny')
                self.assertEqual(can_access(db,2,'Devices'),expected)
                self.assertEqual(can_access(db,2,'Devices',edit=True),bool(enabled and override=='edit'))
                self.assertEqual(account_access_details(db,2)['sections']['Devices']['featureEnabled'],bool(enabled))
            for section in ('Suppliers','Equipment Lifecycle','Unknown'):
                self.assertFalse(feature_enabled(db,section));self.assertFalse(can_access(db,1,section))
            for column in ('active','mfa_confirmed'):
                db.execute(f'UPDATE accounts SET {column}=0 WHERE id=1');db.commit()
                self.assertFalse(can_access(db,1,'IPAM'))
                db.execute(f'UPDATE accounts SET {column}=1 WHERE id=1');db.commit()

    def test_hidden_ipam_and_rack_relationships_survive_unrelated_device_save(self):
        state=self.seed();self.features(['devices'])
        with sqlite3.connect(self.path) as db:
            before=db.execute('SELECT * FROM inventory_ip_allocations').fetchall()
            rack=db.execute('SELECT * FROM inventory_racks').fetchall()
            grants=db.execute('SELECT * FROM role_grants').fetchall()
            db.execute('INSERT INTO device_edit_reservations VALUES(?,1,?,0)',('d1',int(time.time())+300));db.commit()
            record=dict(state['devices'][0],name='Renamed')
            save_reserved_device(db,1,'d1',0,record)
            self.assertEqual(db.execute('SELECT * FROM inventory_ip_allocations').fetchall(),before)
            self.assertEqual(db.execute('SELECT * FROM inventory_racks').fetchall(),rack)
            self.assertEqual(db.execute('SELECT * FROM role_grants').fetchall(),grants)
            saved=json.loads(db.execute('SELECT record_json FROM inventory_devices').fetchone()[0])
            self.assertEqual(saved['rackId'],'r1');self.assertEqual(saved['primaryIp'],'10.0.0.10')
        self.features(['devices','ipam','racks'])
        self.assertEqual(self.get('/api/inventory/ipam')[1]['ipAllocations'],state['ipAllocations'])

    def test_hidden_devices_cannot_be_modified_through_another_section(self):
        state=self.seed();self.features(['ipam','racks'])
        with sqlite3.connect(self.path) as db:
            db.execute('INSERT INTO device_edit_reservations VALUES(?,1,?,0)',('d1',int(time.time())+300));db.commit()
            for section,record in [('IPAM',dict(state['devices'][0],primaryIp='')),('Racks',dict(state['devices'][0],rackUStart=2))]:
                with self.assertRaises(PermissionError):save_reserved_device(db,1,'d1',0,record,section)
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            self.assertEqual(self.post('/api/devices/edit/start',{'deviceId':'d1','section':'Racks'},self.token,csrf_for_session(self.token))[0],403)

    def test_inventory_import_requires_all_enabled_features(self):
        from backend.permissions import can_replace_inventory
        from backend.request_auth import authorised_inventory_import
        for feature in ('devices','ipam','racks'):
            self.features(set(('devices','ipam','racks'))-{feature})
            with sqlite3.connect(self.path) as db:
                self.assertFalse(can_replace_inventory(db,1))
                self.assertIsNone(authorised_inventory_import(db,COOKIE_NAME+'='+self.token,'https://caffoot.example','https://caffoot.example',csrf_for_session(self.token)))

    def test_waiting_writer_rechecks_feature_after_real_database_lock(self):
        import concurrent.futures
        import threading
        self.seed();self.features(['devices','ipam','racks'])
        entered=threading.Event()
        writer=sqlite3.connect(self.path);writer.execute('BEGIN IMMEDIATE')
        writer.execute("UPDATE organisation_features SET enabled=0 WHERE feature='racks'")
        def save():
            with sqlite3.connect(self.path,timeout=5) as db:
                db.set_trace_callback(lambda query:entered.set() if query=='BEGIN IMMEDIATE' else None)
                change_inventory_record(db,1,'racks','new',dict(id='new',name='New',heightU=12))
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                pending=pool.submit(save)
                try:
                    self.assertTrue(entered.wait(3));self.assertFalse(pending.done())
                finally:writer.commit()
                with self.assertRaises(PermissionError):pending.result(timeout=5)
        finally:writer.close()
        self.assertEqual(self.get('/api/inventory/racks')[0],403)
        with sqlite3.connect(self.path) as db:self.assertFalse(db.execute("SELECT 1 FROM inventory_racks WHERE id='new'").fetchone())
