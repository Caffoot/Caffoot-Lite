"""Omitted Rack fields, forged changes and permission-safe IPAM aggregates."""
import json
import sqlite3
import time
import unittest

from backend.device_saves import create_device, save_reserved_device
from backend.inventory import stage_inventory
from backend.inventory_projection import count_basic_ips_outside_subnets
from backend.schema import initialise_database
from enabled_inventory import enable_inventory_features


class RacksOffPreservationTests(unittest.TestCase):
    def setUp(self):
        self.db=sqlite3.connect(':memory:');self.addCleanup(self.db.close)
        initialise_database(self.db);enable_inventory_features(self.db)
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'owner','hash',1,'secret',1)");self.db.commit()
        self.record=dict(id='mounted',name='Mounted',type='Printer',mountType='Rack Mounted',rackId='rack',rackUStart=2,rackUEnd=2,rackUHeight=1,face='rear',location='Original Rack Name',primaryIp='')
        stage_inventory(self.db,dict(devices=[self.record],subnets=[],vlans=[],racks=[dict(id='rack',name='Rack',heightU=12)],rackAccessories=[],ipAllocations={}))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='racks'")
        self.db.execute('INSERT INTO device_edit_reservations VALUES(?,1,?,0)',('mounted',int(time.time())+300));self.db.commit()

    def test_omitted_fields_are_merged_from_authoritative_record(self):
        saved=dict(id='mounted',name='Renamed',type='Printer',primaryIp='')
        racks=self.db.execute('SELECT * FROM inventory_racks').fetchall()
        save_reserved_device(self.db,1,'mounted',0,saved)
        record=json.loads(self.db.execute('SELECT record_json FROM inventory_devices').fetchone()[0])
        self.assertEqual(record,{**self.record,'name':'Renamed'})
        self.assertEqual(self.db.execute('SELECT * FROM inventory_racks').fetchall(),racks)

    def test_all_explicit_hidden_placement_changes_are_rejected_atomically(self):
        before=list(self.db.iterdump())
        for key,value in [('mountType','Desktop'),('rackId',''),('rackUStart',3),('rackUEnd',3),('rackUHeight',2),('face','front'),('rackFace','front'),('rackShelfAccessoryId','forged'),('location','')]:
            with self.subTest(key=key),self.assertRaises(PermissionError):save_reserved_device(self.db,1,'mounted',0,{**self.record,key:value})
            self.assertEqual(list(self.db.iterdump()),before)

    def test_new_placements_are_refused_but_nonrack_types_are_unchanged(self):
        for extra in (dict(mountType='Rack Mounted'),dict(rackId='rack'),dict(rackShelfAccessoryId='shelf'),dict(rackUStart=1)):
            with self.subTest(extra=extra),self.assertRaises(PermissionError):create_device(self.db,1,dict(id='new',name='New',**extra))
        self.assertEqual(create_device(self.db,1,dict(id='new',name='New',type='Printer',mountType='Tabletop / Shelf Mounted',primaryIp='')),0)

    def test_omitted_shelf_association_and_original_location_are_retained(self):
        original={**self.record,'mountType':'Tabletop / Shelf Mounted','rackShelfAccessoryId':'shelf',
                  'face':None,'rackUStart':None,'rackUEnd':None,'rackUHeight':None}
        shelf=dict(id='shelf',rackId='rack',type='shelf',startU=4,heightU=1,face='rear')
        self.db.execute('INSERT INTO inventory_rack_accessories VALUES(?,?,?,0)',('shelf','rack',json.dumps(shelf)))
        self.db.execute('UPDATE inventory_devices SET record_json=?',(json.dumps(original),));self.db.commit()
        before=self.db.execute('SELECT * FROM inventory_rack_accessories').fetchall()
        save_reserved_device(self.db,1,'mounted',0,dict(id='mounted',name='Renamed',type='Printer',primaryIp=''))
        saved=json.loads(self.db.execute('SELECT record_json FROM inventory_devices').fetchone()[0])
        self.assertEqual(saved,{**original,'name':'Renamed'})
        self.assertEqual(self.db.execute('SELECT * FROM inventory_rack_accessories').fetchall(),before)

    def test_no_ip_unrelated_save_does_not_require_ipam_edit(self):
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(2,'editor','hash','secret',1)")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.execute('UPDATE device_edit_reservations SET account_id=2');self.db.commit()
        save_reserved_device(self.db,2,'mounted',0,dict(id='mounted',name='Renamed',type='Printer',primaryIp='',ipReserved=False))
        self.assertFalse(self.db.execute('SELECT 1 FROM inventory_ip_allocations').fetchone())

    def test_absent_historical_fields_stay_absent(self):
        original={key:value for key,value in self.record.items() if key!='face'}
        self.db.execute('UPDATE inventory_devices SET record_json=?',(json.dumps(original),));self.db.commit()
        save_reserved_device(self.db,1,'mounted',0,dict(id='mounted',name='Renamed',type='Printer',primaryIp=''))
        saved=json.loads(self.db.execute('SELECT record_json FROM inventory_devices').fetchone()[0])
        self.assertNotIn('face',saved)


class BasicIpCountTests(unittest.TestCase):
    def test_ranges_include_network_and_broadcast_and_exclude_containers(self):
        records=[dict(primaryIpMode='basic',primaryIp=ip) for ip in ('10.0.0.0','10.0.0.255','10.0.0.10','192.0.2.10','172.16.0.10','')]
        records+=[dict(primaryIp='203.0.113.10'),dict(primaryIpMode='basic',primaryIp='invalid')]
        subnets=[dict(cidr='10.0.0.0/24',kind='network'),dict(cidr='172.16.0.0/16',kind='container')]
        self.assertEqual(count_basic_ips_outside_subnets(records,subnets),2)
        self.assertEqual(count_basic_ips_outside_subnets(records,[]),5)
