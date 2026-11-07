"""Subnet-first storage, transaction, legacy and gateway protection checks."""
import copy
import json
import sqlite3
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch

from backend.application_integrity import validate_detached_application_state
from backend.collection_saves import (change_inventory_record,
    change_ipam_subnet_and_vlan_records, delete_subnet_with_dependencies)
from backend.inventory import stage_inventory, reconstruct_inventory
from backend.normalisation_pipeline import normalise_detached_v133_state
from backend.schema import initialise_database


def network(index=0, **fields):
    return dict(id=f'net-{index}', kind='network', name=f'Fictional network {index}',
                cidr=f'10.80.{index}.0/24', purpose='LAN', gateway=f'10.80.{index}.1', **fields)


def changes(records):
    return [dict(collection='subnets', id=r['id'], record=r) for r in records]


class SubnetFirstTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.prepare(self.db)

    def tearDown(self):
        self.db.close()

    @staticmethod
    def prepare(db):
        initialise_database(db)
        db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'fictional-ipam','test-hash',1,'secret',1)")
        db.commit()
        stage_inventory(db, dict(devices=[],subnets=[],vlans=[],racks=[],rackAccessories=[],ipAllocations={}))

    def save(self, records):
        change_ipam_subnet_and_vlan_records(self.db, 1, changes(records))

    def state(self):
        return reconstruct_inventory(self.db)

    def audit(self):
        return [json.loads(r[0]) for r in self.db.execute('SELECT record_json FROM inventory_change_history')]

    def test_single_and_three_batches_of_fifty_without_installation_limit(self):
        parent=dict(id='office',kind='container',name='Fictional office',cidr='10.80.0.0/16')
        for start in [0,50,100]:
            rows=[network(i,parentId='office') for i in range(start,start+50)]
            self.save(([parent] if start==0 else [])+rows)
        self.assertEqual(len(self.state()['subnets']),151)
        self.assertEqual(self.state()['vlans'],[])
        for event in self.audit():
            self.assertIn('Created 50 subnet(s)',event['reason'])
            self.assertIn('Fictional office',event['reason'])
            self.assertEqual(event['actor'],'fictional-ipam')
            self.assertEqual(len(event['changes']),16)
        self.assertEqual([e['omitted'] for e in self.audit()],[35,34,34])

    def test_one_and_ten_subnets(self):
        self.save([network(0)])
        self.save([network(i) for i in range(1,11)])
        self.assertEqual(len(self.state()['subnets']),11)

    def test_fifty_one_and_empty_requests_leave_no_parent_or_audit(self):
        parent=dict(id='office',kind='container',name='Office',cidr='10.80.0.0/16')
        for rows in [[],[parent]+[network(i,parentId='office') for i in range(51)]]:
            with self.assertRaises(ValueError):self.save(rows)
            self.assertEqual(self.state()['subnets'],[])
            self.assertEqual(self.audit(),[])

    def test_invalid_first_middle_last_row_rolls_back_parent_and_every_row(self):
        parent=dict(id='office',kind='container',name='Office',cidr='10.80.0.0/16')
        for index in [0,5,9]:
            for key,value in [('name','  '),('purpose',''),('purpose','Other'),('gateway',f'10.80.{index}.255'),('vlan',4095)]:
                rows=[network(i,parentId='office') for i in range(10)]
                rows[index][key]=value
                with self.subTest(index=index,key=key),self.assertRaises(ValueError):self.save([parent]+rows)
                self.assertEqual(self.state()['subnets'],[])
                self.assertEqual(self.audit(),[])

    def test_invalid_new_parent_name_rolls_back_every_child(self):
        parent=dict(id='office',kind='container',name='  ',cidr='10.80.0.0/16')
        with self.assertRaisesRegex(ValueError,'name is required'):
            self.save([parent]+[network(i,parentId='office') for i in range(10)])
        self.assertEqual(self.state()['subnets'],[])
        self.assertEqual(self.audit(),[])

    def test_optional_vlan_and_vpn_gateway_round_trip_without_phantom_fields(self):
        rows=[network(0),network(1),network(2,vlan=20)]
        rows[1]['purpose']='VPN';del rows[1]['gateway']
        rows[2]['purpose']='VPN';del rows[2]['gateway']
        self.save(rows)
        result=self.state()
        self.assertNotIn('vlan',result['subnets'][0]);self.assertNotIn('gateway',result['subnets'][1])
        candidate=normalise_detached_v133_state(copy.deepcopy(result))
        self.assertEqual(candidate['subnets'],rows)
        self.assertEqual(validate_detached_application_state(candidate),[])
        stage_inventory(self.db,candidate)
        self.assertEqual(self.state()['subnets'],rows)
        self.assertEqual(self.state()['ipAllocations'],{})
        self.assertEqual(self.state()['vlans'],[])

    def test_tagged_vlan_scope_and_multiple_untagged(self):
        self.save([network(0,vlan=10),network(1),network(2)])
        with self.assertRaisesRegex(ValueError,'VLAN'):self.save([network(3,vlan=10)])
        with self.assertRaises(ValueError):self.save([network(4,vlan=0)])
        self.assertEqual(len(self.state()['subnets']),3)

    def test_purpose_required_at_both_save_boundaries_but_legacy_edit_is_preserved(self):
        old=network(0);del old['purpose'];old['extension']={'keep':True}
        for boundary in ['single','combined']:
            with self.subTest(boundary=boundary),self.assertRaises(ValueError):
                if boundary=='single':change_inventory_record(self.db,1,'subnets',old['id'],old)
                else:self.save([old])
        data=self.state();data['subnets']=[old];stage_inventory(self.db,data)
        updated=dict(old,description='Changed without reclassification')
        self.save([updated]);self.assertEqual(self.state()['subnets'],[updated])
        self.assertNotIn('purpose',self.state()['subnets'][0])
        classified=dict(updated,purpose='VPN');del classified['gateway'];self.save([classified])
        self.assertEqual(self.state()['subnets'],[classified])
        with self.assertRaises(ValueError):self.save([updated])

    def test_required_gateway_and_explicit_vpn_gateway_validation(self):
        for purpose in ['LAN','Management','VPN']:
            for value in ['not-an-ip','10.80.0.0','10.80.0.255','10.81.0.1']:
                record=network(0);record.update(purpose=purpose,gateway=value)
                with self.subTest(purpose=purpose,value=value),self.assertRaises(ValueError):self.save([record])
        for purpose in ['LAN','Management']:
            record=network(0);record['purpose']=purpose;del record['gateway']
            with self.assertRaises(ValueError):self.save([record])

    def test_new_optional_fields_use_omission_not_blank_or_zero(self):
        for key,value in [('vlan',None),('vlan',''),('vlan',0),('vlan',True),('gateway',None),('gateway','')]:
            record=network(0);record.update(purpose='VPN');record[key]=value
            with self.subTest(key=key,value=value),self.assertRaises(ValueError):self.save([record])

    def test_reserved_gateway_rejected_by_both_boundaries_without_history_changes(self):
        self.save([network(0)])
        state=self.state();state['ipAllocations']['10.80.0.2']={'status':'Reserved','deviceId':'','notes':'private text'};stage_inventory(self.db,state)
        before=copy.deepcopy(self.state());history=self.audit()
        updated=dict(network(0),gateway='10.80.0.2')
        for single in [True,False]:
            with self.assertRaisesRegex(ValueError,'assigned or reserved'):
                if single:change_inventory_record(self.db,1,'subnets',updated['id'],updated)
                else:self.save([updated])
            self.assertEqual(self.state(),before);self.assertEqual(self.audit(),history)

    def test_untagged_deletion_does_not_claim_or_remove_a_vlan(self):
        self.save([network(0),network(1)])
        change_inventory_record(self.db,1,'vlans','unrelated',dict(id='unrelated',name='Historical',vlanId=30))
        delete_subnet_with_dependencies(self.db,1,'net-0',[],[])
        self.assertEqual([s['id'] for s in self.state()['subnets']],['net-1'])
        self.assertEqual(self.state()['vlans'][0]['id'],'unrelated')

    def test_read_only_and_no_access_cannot_write(self):
        for allowed in [False]:
            with patch('backend.collection_saves.can_access',return_value=allowed),self.assertRaises(PermissionError):self.save([network(0)])
        self.assertEqual(self.state()['subnets'],[]);self.assertEqual(self.audit(),[])

    def test_concurrent_conflicting_batches_only_one_commits(self):
        with tempfile.TemporaryDirectory() as tmp:
            filename=Path(tmp)/'fictional.sqlite3';db=sqlite3.connect(filename);self.prepare(db);db.close()
            def attempt(identifier):
                connection=sqlite3.connect(filename,timeout=15)
                record=network(0);record['id']=identifier
                try:
                    change_ipam_subnet_and_vlan_records(connection,1,changes([record]));return True
                except ValueError:return False
                finally:connection.close()
            with ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(attempt,['first','second']))
            self.assertEqual(sorted(results),[False,True])
            db=sqlite3.connect(filename)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM inventory_subnets').fetchone()[0],1)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM inventory_change_history').fetchone()[0],1);db.close()
