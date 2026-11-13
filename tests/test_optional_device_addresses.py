"""Basic versus managed addresses, explicit linking and strict legacy import."""
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

from backend.schema import initialise_database
from enabled_inventory import enable_inventory_features
from backend.device_saves import create_device, save_reserved_device
from backend.ipam_linking import link_device_to_ipam
from backend.ipam_repair import plan_ipam_repairs
from backend.ipam_reconciliation import reconcile_published_ipam
from backend.application_integrity import validate_live_application_state, validate_detached_application_state
from backend.inventory import reconstruct_inventory
from backend.normalisation_addresses import validate_normalisation_addresses
from backend.permissions import can_access
from backend.sessions import _digest


class OptionalDeviceAddressTests(unittest.TestCase):
    def setUp(self):
        self.db=sqlite3.connect(':memory:');self.addCleanup(self.db.close)
        initialise_database(self.db);enable_inventory_features(self.db)
        self.token='a'*64
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'owner','hash',1,'secret',1)")
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(2,'devices-editor','hash','secret',1)")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)',(_digest(self.token),));self.db.commit()

    def ipam(self,enabled):
        self.db.execute("UPDATE organisation_features SET enabled=? WHERE feature='ipam'",(int(enabled),));self.db.commit()

    def create(self,ip='',actor=1,identifier='d1'):
        create_device(self.db,actor,dict(id=identifier,name=identifier,type='Printer',mountType='Desktop',primaryIp=ip))
        return self.device(identifier)

    def device(self,identifier='d1'):
        return json.loads(self.db.execute('SELECT record_json FROM inventory_devices WHERE id=?',(identifier,)).fetchone()[0])

    def subnet(self):
        subnet=dict(id='s1',name='LAN',cidr='10.0.0.0/24',gateway='10.0.0.1')
        self.db.execute('INSERT INTO inventory_subnets VALUES(?,?,0)',('s1',json.dumps(subnet)));self.db.commit()

    def save(self,record,actor=1):
        revision=self.db.execute('SELECT revision FROM inventory_devices WHERE id=?',(record['id'],)).fetchone()[0]
        self.db.execute('INSERT OR REPLACE INTO device_edit_reservations VALUES(?,?,?,?)',(record['id'],actor,int(time.time())+300,revision));self.db.commit()
        return save_reserved_device(self.db,actor,record['id'],revision,record)

    def link(self,**extra):
        return link_device_to_ipam(self.db,1,self.token,dict(deviceId='d1',revision=0,subnetId='s1',primaryIp='10.0.0.10',**extra))

    def test_no_ip_creation_requires_devices_edit_only_in_both_modes(self):
        self.assertFalse(can_access(self.db,2,'IPAM',edit=True))
        for enabled in (False,True):
            self.ipam(enabled);record=self.create(actor=2,identifier='offline-'+str(enabled))
            self.assertEqual(record['primaryIp'],'');self.assertNotIn('primaryIpMode',record)
        self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_ip_allocations').fetchone()[0],0)

    def test_basic_creation_and_edit_without_subnets_or_allocations(self):
        self.ipam(False);record=self.create('10.0.0.10',actor=2)
        self.assertEqual(record['primaryIpMode'],'basic')
        self.save(dict(record,primaryIp='10.0.0.11'),actor=2)
        self.assertEqual(self.device()['primaryIp'],'10.0.0.11')
        self.assertEqual(validate_live_application_state(reconstruct_inventory(self.db)),[])
        self.assertFalse(self.db.execute('SELECT 1 FROM inventory_ip_allocations').fetchone())
        self.assertFalse(self.db.execute('SELECT 1 FROM inventory_subnets').fetchone())

    def test_enabling_restart_repair_and_unrelated_edits_do_not_link(self):
        self.ipam(False);record=self.create('10.0.0.10',actor=2);self.ipam(True);self.subnet()
        self.save(dict(record,name='Changed',primaryIp='10.0.0.11'),actor=2)
        state=reconstruct_inventory(self.db)
        self.assertEqual(plan_ipam_repairs(state),[])
        self.assertEqual(reconcile_published_ipam(state)['ipAllocations'],{})
        with sqlite3.connect(':memory:') as copy:
            self.db.backup(copy);initialise_database(copy)
            self.assertEqual(reconstruct_inventory(copy),state)
        self.assertEqual(self.device()['primaryIpMode'],'basic')
        self.assertFalse(self.db.execute('SELECT 1 FROM inventory_ip_allocations').fetchone())

    def test_managed_reference_is_readonly_and_allocation_unchanged_while_off(self):
        self.subnet();record=self.create('10.0.0.10');self.ipam(False)
        before=self.db.execute('SELECT * FROM inventory_ip_allocations').fetchall()
        self.save(dict(record,name='Renamed'),actor=2)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_ip_allocations').fetchall(),before)
        with self.assertRaises(PermissionError):self.save(dict(self.device(),primaryIp=''),actor=2)
        with self.assertRaises(ValueError):self.save(dict(self.device(),primaryIpMode='basic'))
        self.assertEqual(self.device()['primaryIp'],'10.0.0.10')

    def test_managed_assignment_requires_ipam_edit_and_remains_strict(self):
        self.subnet()
        with self.assertRaises(PermissionError):self.create('10.0.0.10',actor=2)
        with self.assertRaises(ValueError):self.create('192.0.2.10')
        self.assertFalse(self.db.execute('SELECT 1 FROM inventory_devices').fetchone())

    def test_invalid_modes_ipv4_duplicates_and_hidden_reservations_rejected(self):
        self.ipam(False);record=self.create('10.0.0.10')
        for ip in ('bad','256.1.1.1','10.0.0.10','010.0.0.010'):
            with self.subTest(ip=ip),self.assertRaises(ValueError):self.create(ip,identifier='d2')
        for mode in (None,True,'managed','other'):
            with self.subTest(mode=mode),self.assertRaises(ValueError):self.save(dict(record,primaryIpMode=mode))
        self.subnet()
        self.db.execute('INSERT INTO inventory_ip_allocations VALUES(?,?)',('10.0.0.12',json.dumps(dict(status='Reserved',reservedForDeviceId='someone-else'))));self.db.commit()
        with self.assertRaises(ValueError):self.create('10.0.0.12',identifier='d2')
        with self.assertRaises(ValueError):self.save(dict(record,ipReserved=True))

    def test_explicit_link_is_atomic_and_preserves_notes(self):
        self.ipam(False);self.create('10.0.0.10');self.ipam(True);self.subnet()
        self.db.execute('INSERT INTO inventory_ip_allocations VALUES(?,?)',('10.0.0.10',json.dumps(dict(status='Available',notes='Preserve'))));self.db.commit()
        self.assertEqual(self.link(),{'revision':1})
        self.assertNotIn('primaryIpMode',self.device())
        allocation=reconstruct_inventory(self.db)['ipAllocations']['10.0.0.10']
        self.assertEqual(allocation['deviceId'],'d1');self.assertEqual(allocation['notes'],'Preserve')
        self.assertEqual(validate_live_application_state(reconstruct_inventory(self.db)),[])
        with self.assertRaises(ValueError):self.link()

    def test_no_subnet_wrong_subnet_conflict_and_stale_link_save_nothing(self):
        self.ipam(False);self.create('10.0.0.10');self.ipam(True)
        before=list(self.db.iterdump())
        with self.assertRaises(ValueError):self.link()
        self.assertEqual(list(self.db.iterdump()),before)
        self.subnet()
        for payload in (dict(deviceId='d1',revision=9,subnetId='s1',primaryIp='10.0.0.10'),dict(deviceId='d1',revision=0,subnetId='missing',primaryIp='10.0.0.10')):
            before=list(self.db.iterdump())
            with self.assertRaises(ValueError):link_device_to_ipam(self.db,1,self.token,payload)
            self.assertEqual(list(self.db.iterdump()),before)
        self.db.execute('INSERT INTO inventory_ip_allocations VALUES(?,?)',('10.0.0.10',json.dumps(dict(status='Reserved',reservedForDeviceId='other'))));self.db.commit()
        before=list(self.db.iterdump())
        with self.assertRaises(ValueError):self.link()
        self.assertEqual(list(self.db.iterdump()),before)

    def test_link_rechecks_both_features_grants_session_and_edit_reservation(self):
        self.ipam(False);self.create('10.0.0.10');self.subnet()
        with self.assertRaises(PermissionError):self.link()
        self.ipam(True)
        with self.assertRaises(PermissionError):link_device_to_ipam(self.db,2,self.token,dict(deviceId='d1',revision=0,subnetId='s1',primaryIp='10.0.0.10'))
        self.db.execute('INSERT INTO device_edit_reservations VALUES(?,?,?,0)',('d1',1,int(time.time())+300));self.db.commit()
        with self.assertRaises(ValueError):self.link()
        self.db.execute('DELETE FROM device_edit_reservations');self.db.execute('DELETE FROM account_sessions');self.db.commit()
        with self.assertRaises(PermissionError):self.link()

    def test_audit_failure_rolls_back_device_allocation_revision_and_history(self):
        self.ipam(False);self.create('10.0.0.10');self.ipam(True);self.subnet()
        before=list(self.db.iterdump())
        with patch('backend.ipam_linking.record_actor_event',side_effect=RuntimeError('Audit failed')):
            with self.assertRaises(RuntimeError):self.link()
        self.assertEqual(list(self.db.iterdump()),before)

    def test_legacy_import_validation_does_not_accept_basic_exemption(self):
        self.ipam(False);self.create('10.0.0.10');self.subnet()
        state=reconstruct_inventory(self.db)
        with self.assertRaises(ValueError):validate_normalisation_addresses(state)
        self.assertTrue(validate_detached_application_state(state))
        self.assertEqual(validate_live_application_state(state),[])
