"""Canonical stock registration must preserve accounting and roll back every fact."""
import concurrent.futures
import copy
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend.device_saves import create_device, create_device_in_transaction, save_reserved_device
from backend.device_stock import device_stock_sources, register_stock_device
from backend.stock_intake import stock_item
from backend.request_auth import csrf_for_session
from backend.http_security import COOKIE_NAME
import test_stock_circulation as circulation_fixture
import test_feature_settings_http as feature_http


def registration_payload(connection, item, **changes):
    source = stock_item(connection, item)
    record = dict(id=uuid.uuid4().hex, name='Fictional Computer', type=source['category'],
                  manufacturer=source['manufacturer'], model=source['model'],
                  status='Active', serialNumber='', primaryIp='', mountType='Desktop',
                  location='Unknown', typeDetails=copy.deepcopy(source['sharedSpecifications']))
    return dict(dict(operationId=uuid.uuid4().hex, stockItemId=item,
                     version=source['version'], record=record), **changes)


class DeviceStockTests(unittest.TestCase):
    setUp = circulation_fixture.StockCirculationTests.setUp
    receipt = circulation_fixture.StockCirculationTests.receipt
    unchanged = circulation_fixture.StockCirculationTests.unchanged

    def source(self, **changes):
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        self.db.commit()
        return self.receipt(category='Desktop', model='Fictional PC '+uuid.uuid4().hex[:6], **changes)

    def register(self, payload):
        return register_stock_device(self.db, 1, self.token, payload)

    def test_registration_transfers_one_unit_keeps_receipt_and_does_not_issue(self):
        identity = self.source()
        originals = self.db.execute('SELECT * FROM it_asset_stock_movements').fetchall()
        payload = registration_payload(self.db, identity)
        before = tuple(self.db.iterdump())
        sources = device_stock_sources(self.db, 1)['sources']
        self.assertEqual(sources[0]['ready'], 10)
        self.assertEqual(tuple(self.db.iterdump()), before)  # Selection/cancellation has no write.
        result = self.register(payload)
        item = stock_item(self.db, identity)
        self.assertEqual(item['quantityStateBalances']['ready'], 9)
        self.assertEqual(item['balances']['readyToIssue'], 10)
        self.assertEqual(item['balances']['physicallyHeld'], 10)
        self.assertEqual(item['units'][0]['balances']['ready'], 1)
        self.assertEqual(self.db.execute('SELECT * FROM it_asset_stock_movements WHERE id<=2').fetchall(), originals)
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_assignments').fetchone()[0], 0)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='registered'").fetchone()[0], 1)
        self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_entries WHERE movement_id=?', (result['movementId'],)).fetchone()[0], 2)
        raw = self.db.execute('SELECT record_json FROM inventory_devices WHERE id=?', (result['deviceId'],)).fetchone()[0]
        self.assertEqual(json.loads(raw)['serialNumber'], '')
        audit = self.db.execute('SELECT record_json FROM inventory_change_history ORDER BY id DESC LIMIT 1').fetchone()[0]
        self.assertEqual(json.loads(audit)['actorId'], 1)
        # The quantity readiness form must never move a registered Ready Device.
        from backend.stock_intake import update_stock_readiness
        adjustment = dict(operationId=uuid.uuid4().hex, stockItemId=identity,
                          version=item['version'], readyQuantity=0,
                          minimumStockLevel=None,
                          checks=dict(itemsChecked=False, conditionChecked=False),
                          reason='Recheck only the anonymous stock')
        self.unchanged(ValueError, lambda: update_stock_readiness(
            self.db, 1, self.token, adjustment))
        self.assertEqual(stock_item(self.db, identity)['balances']['readyToIssue'], 10)
        adjustment.update(operationId=uuid.uuid4().hex, readyQuantity=1)
        update_stock_readiness(self.db, 1, self.token, adjustment)
        item = stock_item(self.db, identity)
        self.assertEqual(item['quantityStateBalances']['ready'], 0)
        self.assertEqual(item['units'][0]['balances']['ready'], 1)
        self.assertEqual(item['balances']['readyToIssue'], 1)
        self.assertEqual(item['balances']['physicallyHeld'], 10)

    def test_failed_journal_rolls_back_device_ipam_unit_and_audit(self):
        identity = self.source()
        payload = registration_payload(self.db, identity)
        self.db.execute('INSERT INTO inventory_subnets VALUES(?,?,0)', ('s', json.dumps(dict(id='s', name='Test', cidr='192.0.2.0/24', gateway='192.0.2.1'))))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='ipam'")
        self.db.commit()
        payload['record']['primaryIp'] = '192.0.2.12'
        def fail_after_persistence(*args, **kwargs):
            self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_devices').fetchone()[0], 1)
            self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_ip_allocations').fetchone()[0], 1)
            raise RuntimeError('Injected journal failure')
        with patch('backend.device_stock.append_stock_fact', side_effect=fail_after_persistence):
            self.unchanged(RuntimeError, lambda: self.register(payload))

    def test_stale_changed_and_identical_retries(self):
        identity = self.source()
        payload = registration_payload(self.db, identity)
        stale = registration_payload(self.db, identity)
        result = self.register(payload)
        before = tuple(self.db.iterdump())
        self.assertEqual(self.register(payload), result)
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.unchanged(FileExistsError, lambda: self.register(stale))
        self.unchanged(FileExistsError, lambda: self.register(dict(payload, record=dict(payload['record'], name='Changed'))))

    def test_compatible_stock_and_only_actual_unregistered_ready(self):
        identity = self.source(quantity=1)
        payload = registration_payload(self.db, identity)
        self.register(payload)
        self.assertEqual(device_stock_sources(self.db, 1)['sources'], [])
        self.unchanged(ValueError, lambda: self.register(registration_payload(self.db, identity)))
        for category in ('Monitor', 'Keyboard'):
            other = self.receipt(category=category)
            self.unchanged(ValueError, lambda: self.register(registration_payload(self.db, other)))
        awaiting = self.source(quantity=2, ready=0)
        self.unchanged(ValueError, lambda: self.register(registration_payload(self.db, awaiting)))

    def test_duplicate_identity_name_and_optional_serial(self):
        identity = self.source()
        payload = registration_payload(self.db, identity)
        payload['record']['serialNumber'] = 'Fictional-Serial'
        self.register(payload)
        for fields in (dict(id=payload['record']['id'], name='Unique'),
                       dict(name=' fictional computer '),
                       dict(name='Unique', serialNumber=' FICTIONAL-serial ')):
            other = registration_payload(self.db, identity)
            other['record'].update(fields)
            self.unchanged((ValueError, FileExistsError), lambda: self.register(other))
        other = registration_payload(self.db, identity)
        other['record']['name'] = 'Second Fictional Computer'
        self.register(other)

    def test_normal_device_validation_and_physical_type_are_retained(self):
        identity = self.source()
        for fields in (dict(type='Laptop'), dict(isVirtual=True), dict(virtualHostId='host'),
                       dict(primaryIp='invalid'), dict(rackId='missing', mountType='Rack Mounted'),
                       dict(name='')):
            payload = registration_payload(self.db, identity)
            payload['record'].update(fields)
            self.unchanged((ValueError, PermissionError), lambda: self.register(payload))

    def test_independent_feature_session_and_edit_gates(self):
        identity = self.source()
        payload = registration_payload(self.db, identity)
        self.unchanged(PermissionError, lambda: register_stock_device(self.db, 1, 'invalid', payload))
        for feature in ('it_assets', 'devices'):
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,)); self.db.commit()
            self.unchanged(PermissionError, lambda: self.register(payload))
            with self.assertRaises(PermissionError):
                device_stock_sources(self.db, 1)
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,)); self.db.commit()
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'"); self.db.commit()
        create_device(self.db, 1, dict(payload['record'], id='direct', name='Direct Device'))
        self.assertEqual(stock_item(self.db, identity)['quantityStateBalances']['ready'], 10)

    def test_creation_helper_cannot_be_used_without_a_transaction(self):
        with self.assertRaises(RuntimeError):
            create_device_in_transaction(self.db, 1, {})

    def test_registration_requires_both_independent_edit_rights(self):
        identity = self.source()
        payload = registration_payload(self.db, identity)
        for device_grant, stock_grant in (('read', 'read'), ('edit', 'read'), ('read', 'edit')):
            self.db.execute('DELETE FROM account_permission_overrides WHERE account_id=2')
            for section, grant in (('Devices', device_grant), ('IT Assets', stock_grant)):
                self.db.execute('INSERT INTO account_permission_overrides VALUES(?,?,?)', (2, section, grant))
            self.db.commit()
            self.unchanged(PermissionError, lambda: register_stock_device(self.db, 2, 'a'*64, payload))
            with self.assertRaises(PermissionError):
                device_stock_sources(self.db, 2)

    def test_laptop_and_physical_server_need_no_network_or_rack_dependency(self):
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        self.db.commit()
        for category in ('Laptop', 'Server - Physical'):
            identity = self.receipt(category=category, model='Fictional '+category)
            payload = registration_payload(self.db, identity)
            payload['record']['name'] = 'Fictional '+category
            self.register(payload)
            self.assertEqual(stock_item(self.db, identity)['balances']['physicallyHeld'], 10)

    def test_two_concurrent_registrations_cannot_consume_the_same_ready_unit(self):
        identity = self.source(quantity=1)
        payload = registration_payload(self.db, identity)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'stock.sqlite'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def register(index):
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    request = copy.deepcopy(payload)
                    request.update(operationId=uuid.uuid4().hex)
                    request['record'].update(id=str(index), name='Computer '+str(index))
                    try:
                        register_stock_device(db, 1, self.token, request)
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(register, range(2))), [False, True])
            with sqlite3.connect(path) as db:
                self.assertEqual(db.execute('SELECT count(*) FROM inventory_devices').fetchone()[0], 1)
                self.assertEqual(stock_item(db, identity)['balances']['physicallyHeld'], 1)

    def assert_registered_identity_protected(self, device, item):
        raw, revision = self.db.execute(
            'SELECT record_json,revision FROM inventory_devices WHERE id=?', (device,)).fetchone()
        record = json.loads(raw)
        self.assertEqual(record['id'], device)
        self.assertEqual(record['type'], 'Desktop')
        self.db.execute('INSERT INTO device_edit_reservations VALUES(?,1,9999999999,?)', (device, revision))
        self.db.commit()
        balances = stock_item(self.db, item)['balances']
        for enabled in (1, 0):
            self.db.execute("UPDATE organisation_features SET enabled=? WHERE feature='it_assets'", (enabled,))
            self.db.commit()
            for changes in (dict(type='Laptop'), dict(type='Server - Virtual'),
                            dict(isVirtual=True), dict(virtualHostId='forged-host')):
                before = tuple(self.db.iterdump())
                with self.subTest(enabled=enabled, changes=changes):
                    with self.assertRaisesRegex(ValueError, 'type or physical/virtual identity'):
                        save_reserved_device(self.db, 1, device, revision, dict(record, name='Rejected', **changes))
                    self.assertEqual(tuple(self.db.iterdump()), before)
                    self.assertEqual(stock_item(self.db, item)['balances'], balances)
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        self.db.execute('DELETE FROM device_edit_reservations WHERE device_id=?', (device,))
        self.db.commit()

    def test_type_identity_and_history_survive_registration_issue_return_reissue_and_writeoff(self):
        from backend.device_stock import reissue_stock_device
        from backend.stock_circulation import (read_stock_issues, return_stock, prepare_stock,
            registered_stock_devices, write_off_stock, canonical_device_choice)
        from backend.equipment_associations import add_associated_equipment
        from test_device_reissue import reissue_payload
        from test_associated_equipment_writes import combined_issue_payload

        item = self.source()
        result = self.register(registration_payload(self.db, item))
        device = result['deviceId']
        self.assert_registered_identity_protected(device, item)  # No assignment yet.
        reissue_stock_device(self.db, 1, self.token, reissue_payload(self.db, device))
        accessory = self.receipt(category='Monitor')
        add_associated_equipment(self.db, 1, self.token,
            combined_issue_payload(self.db, accessory, device), issue_new=True)
        self.assert_registered_identity_protected(device, item)
        issue = next(row for row in read_stock_issues(self.db, 1)['issues'] if row['deviceAssignmentId'])
        return_stock(self.db, 1, self.token, circulation_fixture.return_payload(issue))
        self.assert_registered_identity_protected(device, item)  # Only ended assignments remain.
        returned = next(row for row in registered_stock_devices(self.db) if row['deviceId'] == device)
        prepare_stock(self.db, 1, self.token, dict(operationId=uuid.uuid4().hex,
            stockUnitId=returned['stockUnitId'], version=returned['version'], quantity=1,
            checkedOn='2026-11-17', checks=dict(cleanedWorking=True, dataPreparationConfirmed=True), note=''))
        # The accessory has its own explicit return before the Device is reissued.
        accessory_issue = next(row for row in read_stock_issues(self.db, 1)['issues'] if not row['deviceAssignmentId'])
        return_stock(self.db, 1, self.token, circulation_fixture.return_payload(accessory_issue))
        reissue_stock_device(self.db, 1, self.token, reissue_payload(
            self.db, device, recipientKind='department', recipientId='department', issuedOn='2026-11-17'))
        self.assert_registered_identity_protected(device, item)
        choice = canonical_device_choice(self.db, device)
        write_off_stock(self.db, 1, self.token, dict(operationId=uuid.uuid4().hex,
            deviceId=device, version=choice['version'], quantity=1, fromState='issued',
            writtenOffOn='2026-11-17', reason='Beyond repair', note=''))
        self.assert_registered_identity_protected(device, item)
        self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_devices').fetchone()[0], 1)
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_assignments WHERE device_id=?', (device,)).fetchone()[0], 2)

    def test_catalogue_rename_delete_preserve_registered_links_and_recorded_history(self):
        from backend.device_catalogue import change_device_catalogue
        from backend.device_stock import reissue_stock_device
        from test_device_reissue import reissue_payload
        item = self.source()
        result = self.register(registration_payload(self.db, item))
        device = result['deviceId']
        reissue_stock_device(self.db, 1, self.token, reissue_payload(self.db, device))
        original = {table: self.db.execute('SELECT * FROM ' + table).fetchall() for table in
                    ('device_assignments', 'it_asset_stock_items', 'it_asset_stock_units',
                     'it_asset_stock_entries', 'it_asset_stock_movements')}
        history = self.db.execute('SELECT * FROM inventory_change_history').fetchall()
        for operation, old, new, expected in (('rename', 'Desktop', 'Workstation', 'Workstation'),
                                               ('delete', 'Workstation', '', 'Unknown')):
            self.assertEqual(change_device_catalogue(self.db, 1, 'type', operation, old, new, [device]), 1)
            self.assertEqual(json.loads(self.db.execute(
                'SELECT record_json FROM inventory_devices WHERE id=?', (device,)).fetchone()[0])['type'], expected)
            for table, records in original.items():
                self.assertEqual(self.db.execute('SELECT * FROM ' + table).fetchall(), records)
            self.assertEqual(self.db.execute('SELECT * FROM inventory_change_history ORDER BY id LIMIT ?',
                                            (len(history),)).fetchall(), history)
        raw, revision = self.db.execute('SELECT record_json,revision FROM inventory_devices WHERE id=?', (device,)).fetchone()
        self.db.execute('INSERT INTO device_edit_reservations VALUES(?,1,9999999999,?)', (device, revision))
        self.db.commit()
        # Ordinary edits use the current managed label after catalogue changes.
        self.assertEqual(save_reserved_device(self.db, 1, device, revision, dict(json.loads(raw), notes='Updated')), revision + 1)


class DeviceStockHttpTests(unittest.TestCase):
    setUp = feature_http.FeatureSettingsHttpTests.setUp
    tearDown = feature_http.FeatureSettingsHttpTests.tearDown
    request = feature_http.FeatureSettingsHttpTests.request
    post = feature_http.FeatureSettingsHttpTests.post

    def test_registration_http_security_and_round_trip(self):
        from backend.stock_intake import receive_stock
        from test_stock_intake import receipt_payload
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('it_assets','devices')")
            db.commit()
            receipt = receipt_payload()
            receipt.update(readyQuantity=10, item=dict(category='Desktop', trackingMode='quantity', manufacturer='Fictional', model='PC', sharedSpecifications={}), checks=dict(itemsChecked=True, conditionChecked=True))
            identity = receive_stock(db, 1, self.token, receipt)['stockItemId']
            payload = registration_payload(db, identity)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            self.assertEqual(self.request('/api/it-assets/device-sources', COOKIE_NAME+'='+self.token)[0], 200)
            for token, csrf in ((None, None), (self.token, 'invalid')):
                self.assertEqual(self.post('/api/it-assets/register-device', payload, token, csrf)[0], 403)
            status, result = self.post('/api/it-assets/register-device', payload, self.token, csrf_for_session(self.token))
            self.assertEqual(status, 200, result)
            self.assertEqual(result['deviceId'], payload['record']['id'])

    def test_direct_api_preserves_unassigned_registered_identity_with_assets_disabled(self):
        from backend.stock_intake import receive_stock
        from test_stock_intake import receipt_payload
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('it_assets','devices')")
            db.commit()
            receipt = receipt_payload()
            receipt.update(readyQuantity=10, item=dict(category='Desktop', trackingMode='quantity',
                manufacturer='Fictional', model='PC', sharedSpecifications={}),
                checks=dict(itemsChecked=True, conditionChecked=True))
            item = receive_stock(db, 1, self.token, receipt)['stockItemId']
            registration = registration_payload(db, item)
            register_stock_device(db, 1, self.token, registration)
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        device = registration['record']['id']
        csrf = csrf_for_session(self.token)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            status, reservation = self.post('/api/devices/edit/start', {'deviceId': device}, self.token, csrf)
            self.assertEqual(status, 200, reservation)
            with sqlite3.connect(self.path) as db:
                before = tuple(db.iterdump())
                balances = stock_item(db, item)['balances']
            for changes in (dict(type='Laptop'), dict(isVirtual=True), dict(virtualHostId='forged-host')):
                status, result = self.post('/api/devices/edit/save', dict(deviceId=device,
                    revision=reservation['revision'], record=dict(registration['record'], **changes)), self.token, csrf)
                self.assertEqual(status, 400, result)
                self.assertEqual(result['error'], 'This edit cannot change the Device type or physical/virtual identity. '
                                 'Other permitted fields can still be edited.')
                with sqlite3.connect(self.path) as db:
                    self.assertEqual(tuple(db.iterdump()), before)
                    self.assertEqual(stock_item(db, item)['balances'], balances)
