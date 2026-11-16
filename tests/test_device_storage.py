"""Optional storage documentation preserves legacy hardware and normal Device writes."""
import copy
import json
import unittest

from backend.device_saves import create_device
from backend.device_storage import validate_device_storage
import test_optional_device_addresses as address_fixture


def pool():
    return dict(id='pool-one', name='Fictional Pool', vdevs=[dict(id='vdev-one',
        layout='RAIDZ2', driveCount=6, capacity=4, unit='TB', driveType='HDD')])


def independent_boot():
    return dict(source='independent', driveType='SATA SSD', driveCount=2, capacity=500,
                unit='GB', configuration='Mirror', poolName='Fictional Boot')


class DeviceStorageTests(unittest.TestCase):
    setUp = address_fixture.OptionalDeviceAddressTests.setUp
    device = address_fixture.OptionalDeviceAddressTests.device
    save = address_fixture.OptionalDeviceAddressTests.save

    def create(self, kind='Server - Physical', **details):
        record = dict(id='d1', name='Fictional Storage Device', type=kind, mountType='Desktop',
                      primaryIp='', typeDetails=details)
        create_device(self.db, 1, record)
        return self.device()

    def test_storage_type_add_edit_and_unknown_legacy_medium(self):
        for kind in ('Desktop', 'Laptop', 'Server - Physical'):
            self.db.execute('DELETE FROM inventory_devices'); self.db.commit()
            record = self.create(kind, storageType='Legacy Custom Medium', storage='7.5', storageUnit='TB')
            self.assertEqual(record['typeDetails']['storageType'], 'Legacy Custom Medium')
            self.save(dict(record, name='Renamed Device'))
            record = self.device()
            self.assertEqual(record['typeDetails']['storageType'], 'Legacy Custom Medium')
            record['typeDetails']['storageType'] = 'NVMe SSD'
            self.save(record)
            self.assertEqual(self.device()['typeDetails']['storageType'], 'NVMe SSD')
            self.assertEqual(self.device()['typeDetails']['storage'], '7.5')

    def test_blank_medium_and_no_optional_server_storage_are_valid(self):
        record = self.create(storageType='', raid='Legacy RAID Selection', storage='Unknown Legacy Capacity')
        self.save(dict(record, name='Renamed'))
        self.assertEqual(self.device()['typeDetails'], record['typeDetails'])

    def test_ordinary_non_zfs_boot_storage_and_legacy_capacity_stay_independent(self):
        record = self.create(bootStorage=independent_boot(), raid='RAID 10', storage='4', storageUnit='TB', driveCount='8')
        self.assertNotIn('zfsPools', record['typeDetails'])
        record['typeDetails']['bootStorage']['capacity'] = 960
        self.save(record)
        self.assertEqual(self.device()['typeDetails']['storage'], '4')
        self.assertEqual(self.device()['typeDetails']['raid'], 'RAID 10')
        self.assertEqual(self.device()['typeDetails']['driveCount'], '8')

    def test_multiple_vdevs_and_boot_pool_reference_are_recorded_once(self):
        first = pool()
        first['vdevs'].append(dict(first['vdevs'][0], id='vdev-two'))
        second = dict(id='pool-two', name='Boot Pool', vdevs=[dict(id='vdev-boot', layout='Mirror', driveCount=2, capacity=500, unit='GB', driveType='SATA SSD')])
        record = self.create(zfsPools=[first, second], bootStorage=dict(source='pool', poolId='pool-two'), raid='Other', storage='Unchanged')
        self.assertEqual(self.device()['typeDetails'], record['typeDetails'])
        self.save(dict(record, name='Renamed'))
        self.assertEqual(self.device()['typeDetails']['bootStorage'], dict(source='pool', poolId='pool-two'))

    def test_invalid_pool_layout_count_capacity_and_names_are_rejected(self):
        valid = dict(id='new', name='New', type='Server - Physical', typeDetails=dict(zfsPools=[pool()]))
        mutations = [lambda d: d.update(zfsPools=[pool(), pool()]),
                     lambda d: d['zfsPools'][0].update(name=''),
                     lambda d: d['zfsPools'][0].update(vdevs=[]),
                     lambda d: d['zfsPools'][0]['vdevs'][0].update(layout='RAID 5'),
                     lambda d: d['zfsPools'][0]['vdevs'][0].update(driveCount=3),
                     lambda d: d['zfsPools'][0]['vdevs'][0].update(driveCount=2.5),
                     lambda d: d['zfsPools'][0]['vdevs'][0].update(capacity=0),
                     lambda d: d['zfsPools'][0]['vdevs'][0].update(unit='unknown')]
        for mutate in mutations:
            record = copy.deepcopy(valid); mutate(record['typeDetails'])
            with self.subTest(record=record), self.assertRaises(ValueError):
                validate_device_storage(record)

    def test_each_approved_layout_and_minimum_drive_count(self):
        for layout, count in (('Single', 1), ('Mirror', 2), ('RAIDZ1', 3), ('RAIDZ2', 4), ('RAIDZ3', 5)):
            item = pool(); item['vdevs'][0].update(layout=layout, driveCount=count)
            validate_device_storage(dict(type='Server - Physical', typeDetails=dict(zfsPools=[item])))

    def test_invalid_boot_and_duplicate_drive_representation_are_rejected(self):
        for boot in (dict(source='pool', poolId='missing'), dict(source='pool', poolId='pool-one', driveCount=2),
                     dict(independent_boot(), capacity=-1), dict(independent_boot(), driveCount=True),
                     dict(independent_boot(), driveCount=1), dict(independent_boot(), configuration='RAIDZ2')):
            with self.subTest(boot=boot), self.assertRaises(ValueError):
                validate_device_storage(dict(type='Server - Physical', typeDetails=dict(zfsPools=[pool()], bootStorage=boot)))

    def test_server_only_fields_do_not_become_desktop_laptop_or_virtual_fields(self):
        for kind, virtual in (('Desktop', False), ('Laptop', False), ('Server - Virtual', True), ('Server - Physical', True)):
            with self.subTest(kind=kind, virtual=virtual), self.assertRaises(ValueError):
                validate_device_storage(dict(type=kind, isVirtual=virtual, typeDetails=dict(bootStorage=independent_boot())))

    def test_unrelated_edit_preserves_historic_details_without_reinterpretation(self):
        record = dict(type='Server - Physical', typeDetails=dict(raid='Legacy RAID', storage='Unspecified',
            bootStorage=dict(source='Historic Boot Arrangement'), zfsPools=[dict(id='historic', unknown='Preserved')]))
        validate_device_storage(dict(record, name='New Name'), record)
        self.assertEqual(record['typeDetails']['zfsPools'][0]['unknown'], 'Preserved')

    def test_invalid_storage_save_rolls_back_device_revision_and_audit(self):
        record = self.create(raid='RAID 1', storage='4')
        record['typeDetails']['bootStorage'] = dict(independent_boot(), capacity=0)
        original = self.db.execute('SELECT record_json,revision FROM inventory_devices').fetchall()
        with self.assertRaises(ValueError):
            self.save(record)
        self.assertEqual(self.db.execute('SELECT record_json,revision FROM inventory_devices').fetchall(), original)
