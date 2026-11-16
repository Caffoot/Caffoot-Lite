"""Combined accessory saves must share the stock writer's one transaction."""
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch
import uuid

from backend.equipment_associations import add_associated_equipment, read_equipment_associations
from backend.stock_circulation import (issue_stock_in_transaction, stock_issue_records,
    return_stock, legacy_device_issue, write_off_stock)
from backend.stock_intake import stock_item, receive_stock
from backend.device_assignments import assign_devices
from backend.history_permissions import visible_change_history
from backend.audit_events import record_actor_event
import test_equipment_associations as association_fixture
import test_stock_circulation as circulation
from test_stock_circulation import issue_payload
from test_stock_intake import receipt_payload
from test_it_asset_stock_schema import device


def association_payload(connection, device_id='canonical', **values):
    revision = connection.execute('SELECT revision FROM inventory_devices WHERE id=?', (device_id,)).fetchone()[0]
    assignment = connection.execute('SELECT id FROM device_assignments WHERE device_id=? AND ended_at IS NULL',
                                    (device_id,)).fetchone()[0]
    return dict(dict(operationId=uuid.uuid4().hex, deviceId=device_id,
                     deviceRevision=revision, deviceAssignmentId=assignment), **values)


def combined_issue_payload(connection, item, device_id='canonical', **values):
    stock = issue_payload(connection, item)
    del stock['operationId'], stock['recipientKind'], stock['recipientId']
    return association_payload(connection, device_id, **dict(stock, **values))


class TransactionalStockIssueTests(unittest.TestCase):
    setUp = circulation.StockCirculationTests.setUp
    receipt = circulation.StockCirculationTests.receipt

    def test_issue_helper_refuses_to_own_a_transaction(self):
        item = self.receipt()
        with self.assertRaises(RuntimeError):
            issue_stock_in_transaction(self.db, 1, self.token, issue_payload(self.db, item))

    def test_issue_and_replay_leave_commit_and_rollback_to_the_caller(self):
        item = self.receipt()
        payload = issue_payload(self.db, item, quantity=3)
        before = tuple(self.db.iterdump())
        self.db.execute('BEGIN IMMEDIATE')
        result = issue_stock_in_transaction(self.db, 1, self.token, payload)
        self.assertTrue(self.db.in_transaction)
        self.assertEqual(issue_stock_in_transaction(self.db, 1, self.token, payload), result)
        self.assertTrue(self.db.in_transaction)
        self.db.rollback()
        self.assertEqual(tuple(self.db.iterdump()), before)


class AssociatedEquipmentWriteTests(unittest.TestCase):
    setUp = association_fixture.EquipmentAssociationTests.setUp
    receipt = association_fixture.EquipmentAssociationTests.receipt
    issued = association_fixture.EquipmentAssociationTests.issued
    issue = association_fixture.EquipmentAssociationTests.issue
    legacy_device = association_fixture.EquipmentAssociationTests.legacy_device
    unchanged = circulation.StockCirculationTests.unchanged

    def add(self, payload, *, issue_new=False):
        return add_associated_equipment(self.db, 1, self.token, payload, issue_new=issue_new)

    def existing_payload(self, issue, **values):
        return association_payload(self.db, **dict(issueEntryId=issue['id'], version=issue['version'], **values))

    def test_issue_and_associate_quantity_preserves_canonical_identity_and_deducts_once(self):
        item = self.receipt()
        original = self.db.execute('SELECT * FROM inventory_devices').fetchall()
        assignments = self.db.execute('SELECT * FROM device_assignments').fetchall()
        payload = combined_issue_payload(self.db, item, quantity=3)
        result = self.add(payload, issue_new=True)
        self.assertEqual(len(result['associationIds']), 1)
        issue = stock_issue_records(self.db)[0]
        self.assertEqual(issue['quantity'], 3)
        self.assertEqual(issue['staffId'], 'person')
        self.assertEqual(result['issueEntryIds'], [issue['id']])
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 7)
        self.assertEqual(stock_item(self.db, item)['balances']['readyToIssue'], 7)
        self.assertEqual(self.db.execute('SELECT * FROM inventory_devices').fetchall(), original)
        self.assertEqual(self.db.execute('SELECT * FROM device_assignments').fetchall(), assignments)
        self.assertEqual(read_equipment_associations(self.db, 1, 'canonical')['current'][0]['issue'], issue)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='issued'").fetchone(), (1,))

    def test_existing_issue_links_without_any_ledger_or_stock_changes(self):
        issue = self.issued()
        tables = ('it_asset_stock_entries', 'it_asset_stock_movements', 'it_asset_stock_items',
                  'it_asset_stock_units', 'inventory_devices', 'device_assignments')
        before = {table: self.db.execute('SELECT * FROM ' + table).fetchall() for table in tables}
        result = self.add(self.existing_payload(issue))
        self.assertIsNone(result['movementId'])
        self.assertEqual(result['issueEntryIds'], [issue['id']])
        for table, rows in before.items():
            self.assertEqual(self.db.execute('SELECT * FROM ' + table).fetchall(), rows, table)
        self.assertEqual(read_equipment_associations(self.db, 1, 'canonical')['current'][0]['issue'], issue)

    def two_individual_units(self):
        item = self.receipt(quantity=1, individual=True)
        more = receipt_payload()
        del more['item']
        more.update(stockItemId=item, configurationKey=stock_item(self.db, item)['configurationKey'],
                    quantity=1, readyQuantity=1, checks=dict(itemsChecked=True, conditionChecked=True))
        receive_stock(self.db, 1, self.token, more)
        units = [unit['id'] for unit in stock_item(self.db, item)['units']]
        return item, units

    def test_selected_individual_units_each_get_one_link_and_keep_original_identity(self):
        item, units = self.two_individual_units()
        payload = combined_issue_payload(self.db, item, quantity=2, stockUnitIds=units)
        result = self.add(payload, issue_new=True)
        self.assertEqual(len(result['associationIds']), 2)
        issues = stock_issue_records(self.db)
        self.assertEqual({issue['stockUnitId'] for issue in issues}, set(units))
        self.assertEqual({record['issue']['stockUnitId'] for record in read_equipment_associations(
            self.db, 1, 'canonical')['current']}, set(units))
        self.assertEqual(stock_item(self.db, item)['balances']['physicallyHeld'], 0)
        before = tuple(self.db.iterdump())
        self.assertEqual(self.add(payload, issue_new=True), result)
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_idempotent_retry_returns_same_result_and_different_values_or_route_conflict(self):
        item = self.receipt()
        payload = combined_issue_payload(self.db, item, quantity=2)
        result = self.add(payload, issue_new=True)
        before = tuple(self.db.iterdump())
        self.assertEqual(self.add(payload, issue_new=True), result)
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.unchanged(FileExistsError, lambda: self.add(dict(payload, quantity=1), issue_new=True))
        issue = stock_issue_records(self.db)[0]
        existing = self.existing_payload(issue)
        existing['operationId'] = payload['operationId']
        self.unchanged(FileExistsError, lambda: self.add(existing))
        return_stock(self.db, 1, self.token, circulation.return_payload(issue, quantityReturned=2))
        before = tuple(self.db.iterdump())
        self.assertEqual(self.add(payload, issue_new=True), result)
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_existing_retry_is_idempotent_and_other_references_cannot_duplicate_link(self):
        issue = self.issued()
        payload = self.existing_payload(issue)
        result = self.add(payload)
        before = tuple(self.db.iterdump())
        self.assertEqual(self.add(payload), result)
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.unchanged(FileExistsError, lambda: self.add(self.existing_payload(issue)))
        device(self.db, 'second')
        assign_devices(self.db, 1, self.token, dict(recipientKind='staff', recipientId='person',
            devices=[dict(id='second', revision=0)]))
        self.unchanged(FileExistsError, lambda: self.add(association_payload(
            self.db, 'second', issueEntryId=issue['id'], version=issue['version'])))

    def test_versions_and_closed_assignments_reject_stale_saves(self):
        item = self.receipt()
        payload = combined_issue_payload(self.db, item)
        self.issue(item)
        self.unchanged(FileExistsError, lambda: self.add(payload, issue_new=True))
        payload = combined_issue_payload(self.db, item)
        self.db.execute("UPDATE inventory_devices SET revision=revision+1 WHERE id='canonical'")
        self.db.commit()
        self.unchanged(FileExistsError, lambda: self.add(payload, issue_new=True))
        payload = combined_issue_payload(self.db, item)
        self.unchanged(FileExistsError, lambda: self.add(dict(payload, deviceAssignmentId=99999), issue_new=True))
        source = legacy_device_issue(self.db, self.assignment)
        returned = circulation.return_payload(source)
        returned['deviceAssignmentId'] = returned.pop('issueEntryId')
        return_stock(self.db, 1, self.token, returned)
        self.unchanged(FileExistsError, lambda: self.add(payload, issue_new=True))

    def test_existing_partial_return_requires_fresh_version_and_preserves_original_quantity(self):
        issue = self.issued()
        payload = self.existing_payload(issue)
        return_stock(self.db, 1, self.token, circulation.return_payload(issue))
        self.unchanged(FileExistsError, lambda: self.add(payload))
        self.add(self.existing_payload(stock_issue_records(self.db)[0]))
        current = read_equipment_associations(self.db, 1, 'canonical')['current'][0]['issue']
        self.assertEqual((current['quantity'], current['outstanding']), (3, 2))

    def test_returned_and_written_off_original_issues_cannot_be_associated(self):
        issue = self.issued(quantity=1)
        return_stock(self.db, 1, self.token, circulation.return_payload(issue))
        self.unchanged(ValueError, lambda: self.add(self.existing_payload(stock_issue_records(self.db)[0])))
        issue = self.issued(individual=True)
        write_off_stock(self.db, 1, self.token, dict(operationId=uuid.uuid4().hex, issueEntryId=issue['id'],
            version=issue['version'], quantity=1, fromState='issued', writtenOffOn=issue['issuedOn'], reason='Damaged', note=''))
        self.unchanged(ValueError, lambda: self.add(self.existing_payload(stock_issue_records(self.db)[0])))

    def test_exact_holder_and_eligibility_are_revalidated_for_both_routes(self):
        wrong = self.issued(recipientId='other')
        self.unchanged(ValueError, lambda: self.add(self.existing_payload(wrong)))
        issue = self.issued()
        item = self.receipt(model=uuid.uuid4().hex)
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='person'")
        self.db.commit()
        self.unchanged(ValueError, lambda: self.add(self.existing_payload(issue)))
        self.unchanged(ValueError, lambda: self.add(combined_issue_payload(self.db, item), issue_new=True))

    def test_department_is_actual_holder_and_membership_does_not_substitute_for_it(self):
        device(self.db, 'shared')
        assign_devices(self.db, 1, self.token, dict(recipientKind='department', recipientId='department',
            devices=[dict(id='shared', revision=0)]))
        item = self.receipt()
        self.add(combined_issue_payload(self.db, item, 'shared'), issue_new=True)
        issue = stock_issue_records(self.db)[0]
        self.assertEqual((issue['staffId'], issue['departmentId']), (None, 'department'))
        self.unchanged(ValueError, lambda: self.add(self.existing_payload(issue)))
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()
        self.unchanged(ValueError, lambda: self.add(combined_issue_payload(self.db, item, 'shared'), issue_new=True))

    def test_selected_availability_quantity_and_individual_selection_are_not_bypassed(self):
        awaiting = self.receipt(ready=0)
        self.unchanged(ValueError, lambda: self.add(combined_issue_payload(self.db, awaiting), issue_new=True))
        item, units = self.two_individual_units()
        for selected in ([units[0], units[0]], [units[0], 'missing']):
            self.unchanged(ValueError, lambda: self.add(combined_issue_payload(
                self.db, item, quantity=2, stockUnitIds=selected), issue_new=True))
        self.unchanged(ValueError, lambda: self.add(combined_issue_payload(self.db, item, quantity=3, stockUnitIds=units), issue_new=True))

    def test_device_edit_reservations_and_strict_request_fields_block_both_routes(self):
        issue = self.issued()
        item = self.receipt(model=uuid.uuid4().hex)
        for payload, issue_new in ((self.existing_payload(issue), False), (combined_issue_payload(self.db, item), True)):
            for field, value in (('deviceRevision', True), ('deviceAssignmentId', True), ('recipientId', 'other')):
                self.unchanged(ValueError, lambda: self.add(dict(payload, **{field:value}), issue_new=issue_new))
        self.db.execute("INSERT INTO device_edit_reservations VALUES('canonical',1,9999999999,0)")
        self.db.commit()
        self.unchanged(FileExistsError, lambda: self.add(self.existing_payload(issue)))
        self.unchanged(FileExistsError, lambda: self.add(combined_issue_payload(self.db, item), issue_new=True))

    def test_live_grants_features_and_sessions_are_checked_even_for_replay(self):
        issue = self.issued()
        payload = self.existing_payload(issue)
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        add_associated_equipment(self.db, 2, 'a' * 64, payload)
        for section in ('Devices', 'IT Assets'):
            for level in ('read', 'deny'):
                self.db.execute('UPDATE account_permission_overrides SET level=? WHERE account_id=2 AND section=?', (level, section))
                self.db.commit()
                self.unchanged(PermissionError, lambda: add_associated_equipment(self.db, 2, 'a' * 64, payload))
            self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section=?", (section,))
            self.db.commit()
        for feature in ('devices', 'it_assets'):
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            self.db.commit()
            self.unchanged(PermissionError, lambda: add_associated_equipment(self.db, 2, 'a' * 64, payload))
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))
            self.db.commit()
        self.db.execute('DELETE FROM account_sessions WHERE account_id=2')
        self.db.commit()
        self.unchanged(PermissionError, lambda: add_associated_equipment(self.db, 2, 'a' * 64, payload))
        self.unchanged(PermissionError, lambda: add_associated_equipment(self.db, 1, 'a' * 64, payload))

    def test_failure_after_link_insertion_rolls_back_issue_links_and_both_audits(self):
        for issue_new in (False, True):
            issue = self.issued()
            item = self.receipt(model=uuid.uuid4().hex)
            payload = combined_issue_payload(self.db, item) if issue_new else self.existing_payload(issue)
            def fail(*args, **kwargs):
                self.assertEqual(self.db.execute('SELECT count(*) FROM device_equipment_associations').fetchone(), (1,))
                record_actor_event(*args, **kwargs)
                raise RuntimeError('Injected association audit failure')
            with patch('backend.equipment_associations.record_actor_event', side_effect=fail):
                self.unchanged(RuntimeError, lambda: self.add(payload, issue_new=issue_new))

    def test_failure_on_second_individual_link_rolls_back_first_link_and_whole_issue(self):
        item, units = self.two_individual_units()
        self.db.execute('''CREATE TRIGGER fail_second_association BEFORE INSERT ON device_equipment_associations
            WHEN (SELECT count(*) FROM device_equipment_associations)=1 BEGIN
            SELECT RAISE(ABORT,'Injected second link failure'); END''')
        self.db.commit()
        self.unchanged(sqlite3.IntegrityError, lambda: self.add(combined_issue_payload(
            self.db, item, quantity=2, stockUnitIds=units), issue_new=True))

    def test_association_audit_does_not_leak_when_either_feature_is_hidden(self):
        self.add(self.existing_payload(self.issued()))
        self.assertIn('Associated', json.dumps(visible_change_history(self.db, 1)))
        for feature in ('devices', 'it_assets'):
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            self.db.commit()
            self.assertNotIn('Equipment associated with Device', json.dumps(visible_change_history(self.db, 1)))
            self.assertNotIn('"action": "Associated"', json.dumps(visible_change_history(self.db, 1)))
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))
            self.db.commit()

    def test_concurrent_issue_saves_revalidate_selected_item_after_write_lock(self):
        item = self.receipt(quantity=1)
        payload = combined_issue_payload(self.db, item)
        self.race(payload, issue_new=True, same_operation=False)

    def test_concurrent_existing_saves_prevent_duplicate_association(self):
        self.race(self.existing_payload(self.issued()), issue_new=False, same_operation=False)

    def test_existing_individual_issue_retains_its_original_unit_and_movement(self):
        issue = self.issued(individual=True)
        movements = self.db.execute('SELECT * FROM it_asset_stock_movements').fetchall()
        self.add(self.existing_payload(issue))
        record = read_equipment_associations(self.db, 1, 'canonical')['current'][0]['issue']
        self.assertEqual(record, issue)
        self.assertEqual(self.db.execute('SELECT * FROM it_asset_stock_movements').fetchall(), movements)

    def test_department_existing_issue_and_archived_recipient_validation(self):
        device(self.db, 'shared')
        assign_devices(self.db, 1, self.token, dict(recipientKind='department', recipientId='department',
            devices=[dict(id='shared', revision=0)]))
        issue = self.issued(recipientKind='department', recipientId='department')
        payload = association_payload(self.db, 'shared', issueEntryId=issue['id'], version=issue['version'])
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()
        self.unchanged(ValueError, lambda: self.add(payload))
        self.db.execute("UPDATE departments SET archived=0 WHERE id='department'")
        self.db.commit()
        self.add(payload)
        self.assertEqual(read_equipment_associations(self.db, 1, 'shared')['current'][0]['issue'], issue)

    def test_concurrent_identical_retries_return_one_completed_result(self):
        item = self.receipt(quantity=1)
        self.race(combined_issue_payload(self.db, item), issue_new=True, same_operation=True)
        self.race(self.existing_payload(self.issued()), issue_new=False, same_operation=True)

    def race(self, payload, *, issue_new, same_operation):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'association.sqlite3'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            barrier = threading.Barrier(2)
            def save(index):
                request = dict(payload, operationId=payload['operationId'] if same_operation else uuid.uuid4().hex)
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    barrier.wait(timeout=5)
                    try:
                        return add_associated_equipment(db, 1, self.token, request, issue_new=issue_new)
                    except FileExistsError:
                        return None
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(save, range(2)))
            self.assertEqual(sum(result is not None for result in results), 2 if same_operation else 1)
            if same_operation:
                self.assertEqual(results[0], results[1])
            with sqlite3.connect(path) as db:
                self.assertEqual(db.execute('SELECT count(*) FROM device_equipment_associations').fetchone(), (1,))
                self.assertEqual(db.execute("SELECT count(*) FROM inventory_change_history WHERE json_extract(record_json,'$.changes[0].action')='Associated'").fetchone(), (1,))
                if issue_new:
                    self.assertEqual(db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='issued'").fetchone(), (1,))


if __name__ == '__main__':
    unittest.main()
