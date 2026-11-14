"""Verify saved feature choices and basic addresses through real file lifecycles."""
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from backend.device_saves import create_device
from backend.feature_settings import read_feature_settings, save_feature_setting
from backend.inventory import inspect_export, reconstruct_inventory, stage_inventory
from backend.permissions import can_access, can_replace_inventory
from backend.reset_inventory import reset_inventory
from backend.schema import initialise_database
from backend.sessions import _digest
from test_inventory import fixture


class OptionalFeaturesPersistenceTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.path = Path(self.directory.name) / 'inventory.sqlite3'
        self.db = sqlite3.connect(self.path)
        self.addCleanup(lambda: self.db.close())
        initialise_database(self.db)
        self.token = 'a' * 64
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'owner','hash',1,'secret',1)")
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(2,'editor','hash','secret',1)")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)', (_digest(self.token),))
        self.db.commit()

    def switch(self, feature, enabled):
        save_feature_setting(self.db, 1, self.token,
                             dict(feature=feature, enabled=enabled, confirmDisable=True))

    def grants(self):
        return {table: self.db.execute('SELECT * FROM ' + table + ' ORDER BY rowid').fetchall()
                for table in ('roles', 'role_grants', 'account_roles', 'account_permission_overrides')}

    def test_close_reopen_and_database_restoration_preserve_unlinked_data_and_grants(self):
        self.switch('devices', True)
        create_device(self.db, 2, dict(id='printer', name='Offline Printer', type='Printer',
                                      mountType='Tabletop / Shelf Mounted', primaryIp='192.0.2.20'))
        saved_inventory = reconstruct_inventory(self.db)
        saved_grants = self.grants()
        self.switch('devices', False)
        saved_choices = read_feature_settings(self.db, 1)
        self.db.close()
        self.db = sqlite3.connect(self.path)
        initialise_database(self.db)
        self.assertEqual(read_feature_settings(self.db, 1), saved_choices)
        self.assertFalse(can_access(self.db, 2, 'Devices', edit=True))
        restored_path = Path(self.directory.name) / 'restored.sqlite3'
        with sqlite3.connect(restored_path) as restored:
            self.db.backup(restored)
        self.db.close()
        self.db = sqlite3.connect(restored_path)
        initialise_database(self.db)
        self.assertEqual(read_feature_settings(self.db, 1), saved_choices)
        self.assertEqual(self.grants(), saved_grants)
        for key in ('devices', 'subnets', 'racks', 'rackAccessories', 'ipAllocations'):
            self.assertEqual(reconstruct_inventory(self.db)[key], saved_inventory[key])
        self.switch('devices', True)
        self.switch('ipam', True)
        self.assertTrue(can_access(self.db, 2, 'Devices', edit=True))
        self.assertFalse(can_access(self.db, 2, 'IPAM', edit=True))
        state = reconstruct_inventory(self.db)
        self.assertEqual(state['devices'][0]['primaryIpMode'], 'basic')
        self.assertEqual(state['devices'][0]['primaryIp'], '192.0.2.20')
        self.assertEqual(state['subnets'], [])
        self.assertEqual(state['ipAllocations'], {})
        self.assertEqual(self.grants(), saved_grants)

    def test_inventory_replacement_reset_and_persistence_without_permission_mocks(self):
        for feature in ('devices', 'ipam', 'racks'):
            self.switch(feature, True)
        saved_choices = read_feature_settings(self.db, 1)
        saved_grants = self.grants()
        candidate = inspect_export(json.dumps(fixture()).encode())
        self.assertTrue(can_replace_inventory(self.db, 1))
        stage_inventory(self.db, candidate,
                        pre_write_check=lambda connection: self.assertTrue(can_replace_inventory(connection, 1)))
        self.assertEqual(read_feature_settings(self.db, 1), saved_choices)
        for feature in ('devices', 'ipam', 'racks'):
            self.switch(feature, False)
            before = list(self.db.iterdump())
            self.assertFalse(can_replace_inventory(self.db, 1))
            with self.assertRaises(PermissionError):
                reset_inventory(self.db, 1)
            self.assertEqual(list(self.db.iterdump()), before)
            self.switch(feature, True)
        reset_inventory(self.db, 1)
        self.assertEqual(reconstruct_inventory(self.db)['devices'], [])
        self.assertEqual(read_feature_settings(self.db, 1), saved_choices)
        self.assertEqual(self.grants(), saved_grants)
        self.db.close()
        self.db = sqlite3.connect(self.path)
        initialise_database(self.db)
        self.assertEqual(read_feature_settings(self.db, 1), saved_choices)
        self.assertEqual(self.grants(), saved_grants)
