"""Real session, request-proof and revision checks for optional IP operations."""
import http.client
import json
import sqlite3
import unittest
from unittest.mock import patch

import test_session_http as session_http
from backend.request_auth import csrf_for_session
from backend.http_security import COOKIE_NAME


class OptionalIpHttpTests(unittest.TestCase):
    setUp=session_http.SessionHttpTests.setUp
    tearDown=session_http.SessionHttpTests.tearDown
    post=session_http.SessionHttpTests.post
    request=session_http.SessionHttpTests.request
    endpoint='/api/devices/ipam/link'

    def basic(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='ipam'")
        record=dict(id='printer',name='Printer',type='Printer',mountType='Desktop',primaryIp='10.0.0.10')
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            self.assertEqual(self.post('/api/devices/create',{'record':record},self.token,csrf_for_session(self.token))[0],200)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='ipam'")
            subnet=dict(id='network',name='LAN',cidr='10.0.0.0/24',gateway='10.0.0.1')
            db.execute('INSERT INTO inventory_subnets VALUES(?,?,0)',('network',json.dumps(subnet)))
        return dict(deviceId='printer',revision=0,subnetId='network',primaryIp='10.0.0.10')

    def snapshot(self):
        with sqlite3.connect(self.path) as db:return list(db.iterdump())

    def test_explicit_link_http_and_replay_rejection(self):
        payload=self.basic()
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            status,result=self.post(self.endpoint,payload,self.token,csrf_for_session(self.token))
            self.assertEqual((status,result),(200,{'revision':1}))
            self.assertEqual(self.post(self.endpoint,payload,self.token,csrf_for_session(self.token))[0],400)
        with sqlite3.connect(self.path) as db:
            device=json.loads(db.execute('SELECT record_json FROM inventory_devices').fetchone()[0])
            allocation=json.loads(db.execute('SELECT record_json FROM inventory_ip_allocations').fetchone()[0])
            self.assertNotIn('primaryIpMode',device);self.assertEqual(allocation['deviceId'],'printer')

    def test_missing_proofs_disabled_features_and_mfa_save_nothing(self):
        payload=self.basic();before=self.snapshot()
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            for token,csrf in ((None,None),(self.token,None),(self.token,'bad')):
                self.assertEqual(self.post(self.endpoint,payload,token,csrf)[0],403)
                self.assertEqual(self.snapshot(),before)
            for feature in ('devices','ipam'):
                with sqlite3.connect(self.path) as db:db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?',(feature,))
                unchanged=self.snapshot()
                self.assertEqual(self.post(self.endpoint,payload,self.token,csrf_for_session(self.token))[0],403)
                self.assertEqual(self.snapshot(),unchanged)
                with sqlite3.connect(self.path) as db:db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?',(feature,))
            with sqlite3.connect(self.path) as db:db.execute('UPDATE accounts SET mfa_confirmed=0 WHERE id=1')
            self.assertEqual(self.post(self.endpoint,payload,self.token,csrf_for_session(self.token))[0],403)

    def test_missing_subnet_explanation_remains_available_with_racks_off(self):
        payload=self.basic()
        with sqlite3.connect(self.path) as db:
            db.execute('DELETE FROM inventory_subnets')
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='racks'")
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            status,result=self.post(self.endpoint,payload,self.token,csrf_for_session(self.token))
        self.assertEqual(status,400)
        self.assertIn('existing managed subnet',result['error'])

    def test_cancel_has_no_request_and_get_cannot_link(self):
        self.basic();before=self.snapshot()
        self.assertEqual(self.request(self.endpoint,COOKIE_NAME+'='+self.token)[0],404)
        self.assertEqual(self.snapshot(),before)

    def test_shape_origin_json_size_and_duplicate_keys_rejected(self):
        payload=self.basic();before=self.snapshot()
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            for body in ({**payload,'actorId':1},{**payload,'revision':True},{**payload,'primaryIp':'changed'}):
                self.assertEqual(self.post(self.endpoint,body,self.token,csrf_for_session(self.token))[0],400)
            for origin,content,body,expected in [('https://other.example','application/json',json.dumps(payload),403),('https://caffoot.example','text/plain','{}',415),('https://caffoot.example','application/json',' '*4097,400),('https://caffoot.example','application/json','{"revision":0,"revision":1}',400)]:
                conn=http.client.HTTPConnection('127.0.0.1',self.server.server_port)
                conn.request('POST',self.endpoint,body=body,headers={'Origin':origin,'Content-Type':content,'Cookie':COOKIE_NAME+'='+self.token,'X-CSRF-Token':csrf_for_session(self.token)})
                response=conn.getresponse();self.assertEqual(response.status,expected);response.read();conn.close()
        self.assertEqual(self.snapshot(),before)
