"""A reissue records a new holder only when the same held Device leaves stock."""
import copy
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend.device_stock import register_stock_device, reissue_stock_device, reissue_device_choices
from backend.device_assignments import assign_devices, read_assignments, my_equipment
from backend.stock_circulation import (canonical_device_choice, read_stock_issues,
    return_stock, prepare_stock, registered_stock_devices)
from backend.stock_intake import stock_item
import test_device_stock as registration_fixture
import test_stock_circulation as circulation_fixture


def reissue_payload(connection, device, **changes):
    choice = canonical_device_choice(connection, device)
    return dict(dict(operationId=uuid.uuid4().hex, deviceId=device, version=choice['version'],
        recipientKind='staff', recipientId='person', issuedOn='2026-11-16', note='Fictional issue'), **changes)


class DeviceReissueTests(unittest.TestCase):
    setUp = circulation_fixture.StockCirculationTests.setUp
    receipt = circulation_fixture.StockCirculationTests.receipt
    unchanged = circulation_fixture.StockCirculationTests.unchanged
    source = registration_fixture.DeviceStockTests.source
    legacy_device = circulation_fixture.StockCirculationTests.legacy_device

    def ready_device(self):
        item = self.source()
        payload = registration_fixture.registration_payload(self.db, item)
        result = register_stock_device(self.db, 1, self.token, payload)
        return item, result['deviceId']

    def issue(self, device, **changes):
        return reissue_stock_device(self.db, 1, self.token, reissue_payload(self.db, device, **changes))

    def test_issue_new_registered_device_and_preserve_configuration(self):
        item, device = self.ready_device()
        before = self.db.execute('SELECT * FROM inventory_devices').fetchall()
        result = self.issue(device)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(), before)
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 9)
        self.assertEqual(stock_item(self.db, item)['balances']['readyToIssue'], 9)
        self.assertEqual(read_assignments(self.db, 1, device_id=device)['current'][0]['id'], result['assignmentId'])
        self.assertEqual(read_assignments(self.db, 1, staff_id='person')['current'][0]['deviceId'], device)
        self.assertEqual(my_equipment(self.db, 2)['assignedToMe'][0]['id'], device)
        self.assertEqual(reissue_device_choices(self.db, 1)['devices'], [])

    def test_return_prepare_reissue_keeps_every_previous_assignment(self):
        item, device = self.ready_device()
        first = self.issue(device)
        issue = read_stock_issues(self.db, 1)['issues'][0]
        return_stock(self.db, 1, self.token, circulation_fixture.return_payload(issue))
        self.assertEqual(reissue_device_choices(self.db, 1)['devices'], [])
        returned = registered_stock_devices(self.db)[0]
        prepare_stock(self.db, 1, self.token, dict(operationId=uuid.uuid4().hex,
            stockUnitId=returned['stockUnitId'], version=returned['version'], quantity=1,
            checkedOn='2026-11-16', checks=dict(cleanedWorking=True, dataPreparationConfirmed=True), note=''))
        originals = self.db.execute('SELECT * FROM device_assignments').fetchall()
        second = self.issue(device, recipientKind='department', recipientId='department')
        self.assertNotEqual(first['assignmentId'], second['assignmentId'])
        self.assertEqual(self.db.execute('SELECT * FROM device_assignments WHERE id=?', (first['assignmentId'],)).fetchall(), originals)
        assignments = read_assignments(self.db, 1, device_id=device)
        self.assertEqual(len(assignments['history']), 2)
        self.assertEqual(assignments['current'][0]['departmentId'], 'department')
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 9)
        self.unchanged(FileExistsError, lambda: assign_devices(self.db, 1, self.token,
            dict(recipientKind='staff', recipientId='person', devices=[dict(id=device, revision=0)])))

    def test_assignment_and_issue_rollback_together(self):
        _, device = self.ready_device()
        with patch('backend.device_stock.publish_stock_movement', side_effect=RuntimeError('Injected failure')):
            self.unchanged(RuntimeError, lambda: self.issue(device))
        self.assertEqual(read_assignments(self.db, 1, device_id=device)['current'], [])

    def test_inactive_staff_archived_department_and_changed_recipient_do_not_issue(self):
        _, device = self.ready_device()
        for table, flag, identity, kind in (('staff_members', 'active', 'person', 'staff'),
                                            ('departments', 'archived', 'department', 'department')):
            value = 0 if flag == 'active' else 1
            self.db.execute(f'UPDATE {table} SET {flag}=? WHERE id=?', (value, identity)); self.db.commit()
            self.unchanged(ValueError, lambda: self.issue(device, recipientKind=kind, recipientId=identity))
        self.unchanged(ValueError, lambda: self.issue(device, recipientId='missing'))

    def test_actual_hold_readiness_edit_reservation_and_stale_revision(self):
        _, device = self.ready_device()
        payload = reissue_payload(self.db, device)
        self.db.execute('UPDATE inventory_devices SET revision=revision+1 WHERE id=?', (device,)); self.db.commit()
        self.unchanged(FileExistsError, lambda: reissue_stock_device(self.db, 1, self.token, payload))
        self.db.execute('INSERT INTO device_edit_reservations VALUES(?,1,9999999999,1)', (device,)); self.db.commit()
        self.unchanged(FileExistsError, lambda: self.issue(device))
        self.db.execute('DELETE FROM device_edit_reservations'); self.db.commit()
        self.issue(device)
        self.unchanged(ValueError, lambda: self.issue(device))

    def test_identical_retries_are_safe_changed_retry_is_rejected(self):
        _, device = self.ready_device()
        payload = reissue_payload(self.db, device)
        result = reissue_stock_device(self.db, 1, self.token, payload)
        before = tuple(self.db.iterdump())
        self.assertEqual(reissue_stock_device(self.db, 1, self.token, payload), result)
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.unchanged(FileExistsError, lambda: reissue_stock_device(self.db, 1, self.token, dict(payload, note='changed')))

    def test_independent_feature_permissions_and_verified_session(self):
        _, device = self.ready_device()
        payload = reissue_payload(self.db, device)
        self.unchanged(PermissionError, lambda: reissue_stock_device(self.db, 1, 'invalid', payload))
        for feature in ('it_assets', 'devices'):
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,)); self.db.commit()
            self.unchanged(PermissionError, lambda: self.issue(device))
            with self.assertRaises(PermissionError):
                reissue_device_choices(self.db, 1)
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,)); self.db.commit()

    def test_legacy_unassigned_status_does_not_establish_possession(self):
        choice = self.legacy_device(assigned=False)
        self.assertEqual(reissue_device_choices(self.db, 1)['devices'], [])
        self.unchanged(ValueError, lambda: self.issue(choice['deviceId']))

    def test_independent_edit_rights_and_read_only_cannot_reissue(self):
        _, device = self.ready_device()
        for device_grant, stock_grant in (('read', 'read'), ('edit', 'read'), ('read', 'edit')):
            self.db.execute("DELETE FROM account_permission_overrides WHERE account_id=2")
            for section, grant in (('Devices', device_grant), ('IT Assets', stock_grant)):
                self.db.execute('INSERT INTO account_permission_overrides VALUES(?,?,?)', (2, section, grant))
            self.db.commit()
            self.unchanged(PermissionError, lambda: reissue_stock_device(self.db, 2, 'a'*64,
                reissue_payload(self.db, device)))
            self.assertEqual(read_stock_issues(self.db, 2)['reissueDevices'], [])

    def test_competing_issues_create_one_assignment_and_one_physical_issue(self):
        _, device = self.ready_device()
        payload = reissue_payload(self.db, device)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'stock.sqlite'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def issue(index):
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    try:
                        reissue_stock_device(db, 1, self.token, dict(payload, operationId=uuid.uuid4().hex))
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(issue, range(2))), [False, True])
            with sqlite3.connect(path) as db:
                self.assertEqual(db.execute('SELECT count(*) FROM device_assignments').fetchone()[0], 1)
                self.assertEqual(db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='issued'").fetchone()[0], 1)
