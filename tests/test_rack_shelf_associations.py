"""Rack shelves, device preservation and all-or-nothing reviewed removal."""
import copy
import json
import sqlite3
import time
import unittest
from unittest.mock import patch

from backend.application_integrity import validate_detached_application_state
from backend.collection_saves import change_inventory_record, remove_linked_rack_shelf
from backend.device_saves import create_device, save_reserved_device
from backend.history_permissions import visible_change_history
from backend.inventory import reconstruct_inventory, stage_inventory
from backend.legacy_mounting import plan_legacy_computer_mounting_corrections
from backend.normalisation_pipeline import normalise_detached_v133_state
from backend.normalisation_validation import validate_normalisation_devices
from backend.rack_validation import find_rack_import_conflicts
from backend.schema import initialise_database


class RackShelfAssociationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'fictional-owner','test',1,'test',1)")
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(2,'fictional-viewer','test','test',1)")
        self.db.commit()
        self.shelf = {"id":"shelf-a", "type":"shelf", "rackId":"rack-a", "name":"Shelf A", "startU":10, "heightU":1, "face":"front"}
        self.other = dict(self.shelf, id="shelf-b", rackId="rack-b", name="Shelf B")
        self.state = {"devices":[self.device("printer"), self.device("router"),
            {"id":"server", "name":"Server", "type":"Server - Physical", "mountType":"Rack Mounted", "location":"Room", "rackId":"rack-a", "face":"front", "rackUStart":15, "rackUEnd":16, "rackUHeight":2}],
            "racks":[{"id":"rack-a", "name":"Rack A", "heightU":42}, {"id":"rack-b", "name":"Rack B", "heightU":42}],
            "rackAccessories":[self.shelf,self.other], "subnets":[], "vlans":[], "ipAllocations":{}}
        stage_inventory(self.db,self.state)

    def tearDown(self):
        self.db.close()

    def device(self, identifier):
        return {"id":identifier, "name":identifier.title(), "type":"Printer" if identifier=="printer" else "Router", "mountType":"Tabletop / Shelf Mounted", "location":"Room", "status":"Active", "rackId":"rack-a", "rackShelfAccessoryId":"shelf-a", "face":None, "rackUStart":None, "rackUEnd":None, "rackUHeight":None, "typeDetails":{"fictionalUnknown":{"preserve":True}}, "notes":"Fictional private notes"}

    def snapshot(self):
        return {table:self.db.execute("SELECT * FROM "+table).fetchall() for table in ("inventory_devices","inventory_rack_accessories","inventory_change_history","device_edit_reservations")}

    def choices(self):
        return [{"deviceId":"printer", "revision":0, "action":"reassign", "rackId":"rack-b", "shelfId":"shelf-b"}, {"deviceId":"router", "revision":0, "action":"retire"}]

    def remove(self, choices=None, expected=None):
        return remove_linked_rack_shelf(self.db,1,"shelf-a",expected if expected is not None else self.shelf, choices if choices is not None else self.choices())

    def reserve(self, owner=1, expiry=None, base=0):
        self.db.execute("INSERT INTO device_edit_reservations(device_id,account_id,expires_at,base_revision) VALUES('printer',?,?,?)",(owner,int(time.time())+300 if expiry is None else expiry,base));self.db.commit()

    def test_valid_shelves_do_not_occupy_device_u(self):
        validate_normalisation_devices(self.state)
        self.assertEqual(validate_detached_application_state(self.state),[])
        self.assertEqual(find_rack_import_conflicts(self.state),[])
        conflict=copy.deepcopy(self.state);conflict['devices'][2].update(rackUStart=10,rackUEnd=11)
        self.assertTrue(any('overlaps' in x for x in find_rack_import_conflicts(conflict)))

    def test_validation_rejects_wrong_missing_virtual_and_independent_u(self):
        for change in [dict(rackShelfAccessoryId='missing'),dict(rackShelfAccessoryId=''),dict(rackId='rack-b'),dict(isVirtual=True),dict(type='Server - Virtual'),dict(rackUStart=10),dict(face='front'),dict(mountType='Rack Mounted'),dict(rackShelfAccessoryId=True),dict(rackId='')]:
            with self.subTest(change=change):
                state=copy.deepcopy(self.state);state['devices'][0].update(change)
                with self.assertRaises(ValueError):validate_normalisation_devices(state)
        state=copy.deepcopy(self.state);state['rackAccessories'][0]['type']='patch'
        with self.assertRaisesRegex(ValueError,'no longer a shelf'):validate_normalisation_devices(state)

    def test_tabletop_without_rack_and_legacy_without_field_remain_valid(self):
        state=copy.deepcopy(self.state)
        for d in state['devices'][:2]:d['rackId']='';d.pop('rackShelfAccessoryId')
        validate_normalisation_devices(state);self.assertEqual(find_rack_import_conflicts(state),[])

    def test_normalisation_and_storage_roundtrip_preserve_reference_and_unknowns(self):
        state=normalise_detached_v133_state(self.state)
        self.assertEqual(state['devices'],self.state['devices'])
        clone=sqlite3.connect(':memory:');initialise_database(clone);stage_inventory(clone,json.loads(json.dumps(state)))
        self.assertEqual(reconstruct_inventory(clone)['devices'],self.state['devices']);clone.close()
        state['devices'][0]['type']='Desktop'
        planned,changes=plan_legacy_computer_mounting_corrections(state)
        self.assertEqual(changes,[]);self.assertEqual(planned,state)

    def test_new_shelf_device_uses_existing_devices_ipam_racks_permissions(self):
        record=dict(self.device('new'),id='new')
        for denied in ['Devices','IPAM','Racks']:
            with self.subTest(section=denied),patch('backend.device_saves.can_access',side_effect=lambda db,actor,section,edit=False:section!=denied):
                with self.assertRaises(PermissionError):create_device(self.db,1,record)
        self.assertEqual(create_device(self.db,1,record),0)

    def test_reserved_device_shelf_change_checks_racks_permission(self):
        self.reserve();record=dict(self.state['devices'][0],rackId='rack-b',rackShelfAccessoryId='shelf-b')
        with patch('backend.device_saves.can_access',side_effect=lambda db,actor,section,edit=False:section!='Racks'):
            with self.assertRaises(PermissionError):save_reserved_device(self.db,1,'printer',0,record)
        self.assertEqual(save_reserved_device(self.db,1,'printer',0,record),1)

    def test_ordinary_accessory_delete_type_change_cross_rack_are_blocked(self):
        before=self.snapshot()
        for record in [None,dict(self.shelf,type='patch'),dict(self.shelf,rackId='rack-b')]:
            with self.subTest(record=record):
                with self.assertRaises(ValueError):change_inventory_record(self.db,1,'rackAccessories','shelf-a',record)
                self.assertEqual(self.snapshot(),before)

    def test_shelf_movement_keeps_identity_links_and_device_revisions(self):
        previous=self.db.execute('SELECT record_json,revision FROM inventory_devices').fetchall()
        change_inventory_record(self.db,1,'rackAccessories','shelf-a',dict(self.shelf,startU=12))
        self.assertEqual(self.db.execute('SELECT record_json,revision FROM inventory_devices').fetchall(),previous)
        self.assertEqual(reconstruct_inventory(self.db)['rackAccessories'][0]['startU'],12)

    def test_parent_rack_delete_and_rack_mounted_collision_stay_protected(self):
        with self.assertRaises(ValueError):change_inventory_record(self.db,1,'racks','rack-a',None)
        with self.assertRaisesRegex(ValueError,'overlaps'):change_inventory_record(self.db,1,'rackAccessories','shelf-a',dict(self.shelf,startU=15))

    def test_atomic_reassign_and_retire_keep_records_ip_notes_and_audit(self):
        self.reserve();self.assertEqual(self.remove(),2)
        state=reconstruct_inventory(self.db);records={d['id']:d for d in state['devices']}
        self.assertEqual(len(records),3);self.assertEqual(records['printer']['rackShelfAccessoryId'],'shelf-b');self.assertEqual(records['printer']['rackId'],'rack-b')
        self.assertEqual(records['router']['status'],'Retired');self.assertEqual(records['router']['rackShelfAccessoryId'],'');self.assertEqual(records['router']['rackId'],'')
        for identifier in ['printer','router']:
            self.assertEqual(records[identifier]['typeDetails'],self.state['devices'][0]['typeDetails']);self.assertEqual(records[identifier]['notes'],'Fictional private notes')
        self.assertEqual([s['id']for s in state['rackAccessories']],['shelf-b']);self.assertEqual(self.db.execute('SELECT revision FROM inventory_devices WHERE id="printer"').fetchone()[0],1)
        audit=visible_change_history(self.db,1);self.assertIn('Shelf U10 (Front)',audit[-1]['changes'][-1]['label']);self.assertNotIn('Fictional private notes',json.dumps(audit));self.assertEqual(visible_change_history(self.db,2),[])
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_edit_reservations').fetchone()[0],0)

    def test_permission_denial_rolls_back(self):
        before=self.snapshot()
        for denied in ['Devices','Racks']:
            with patch('backend.collection_saves.can_access',side_effect=lambda db,actor,section,edit=False:section!=denied):
                with self.assertRaises(PermissionError):self.remove()
            self.assertEqual(self.snapshot(),before)

    def test_missing_duplicate_or_changed_linked_devices_roll_back(self):
        for choices in [self.choices()[:1],self.choices()+self.choices()[:1],self.choices()+[{'deviceId':'server','revision':0,'action':'retire'}]]:
            before=self.snapshot()
            with self.assertRaises(ValueError):self.remove(choices)
            self.assertEqual(self.snapshot(),before)

    def test_stale_revision_shelf_or_target_rolls_back(self):
        for changes in ['revision','shelf','target','action']:
            before=self.snapshot();choices=self.choices();shelf=dict(self.shelf)
            if changes=='revision':choices[0]['revision']=1
            if changes=='shelf':shelf['startU']=12
            if changes=='target':choices[0]['shelfId']='missing'
            if changes=='action':choices[0]['action']='delete'
            with self.assertRaises(ValueError):self.remove(choices,shelf)
            self.assertEqual(self.snapshot(),before)

    def test_other_active_reservation_blocks_all_changes(self):
        self.reserve(owner=2);before=self.snapshot()
        with self.assertRaisesRegex(ValueError,'another user'):self.remove()
        self.assertEqual(self.snapshot(),before)

    def test_own_expired_or_stale_reservation_is_not_overridden(self):
        self.reserve(expiry=int(time.time())-1);before=self.snapshot()
        with self.assertRaisesRegex(ValueError,'expired or changed'):self.remove()
        self.assertEqual(self.snapshot(),before)

    def test_expired_other_reservation_does_not_become_a_new_lock(self):
        self.reserve(owner=2,expiry=int(time.time())-1);self.assertEqual(self.remove(),2)

    def test_failure_after_sql_updates_rolls_back_devices_shelf_audit_and_reservation(self):
        self.reserve();before=self.snapshot()
        with patch('backend.collection_saves.attribute_event',side_effect=RuntimeError('Fictional audit failure')):
            with self.assertRaises(RuntimeError):self.remove()
        self.assertEqual(self.snapshot(),before)
