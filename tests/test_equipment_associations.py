"""Explicit links preserve original stock facts and require both inventory grants."""
import json
import sqlite3
import unittest
from unittest.mock import patch
import uuid

from backend import schema
from backend.equipment_associations import read_equipment_associations
from backend.device_assignments import my_equipment
from backend.stock_circulation import legacy_device_issue, return_stock, stock_issue_records
from backend.stock_intake import stock_item
import test_stock_circulation as circulation
from test_it_asset_stock_schema import database, seed_people, device


def insert_association(connection, assignment, issue, **overrides):
    """Seed explicit test links until the protected Add Equipment writer is added."""
    values = dict(device_assignment_id=assignment, issue_entry_id=issue,
                  operation_key=uuid.uuid4().hex, operation_hash='a' * 64,
                  actor_id=1, actor_label='Original Association Technician', **overrides)
    columns = list(values)
    return connection.execute('INSERT INTO device_equipment_associations (' + ','.join(columns)
        + ') VALUES (' + ','.join('?' for _ in columns) + ')',
        [values[column] for column in columns]).lastrowid


class EquipmentAssociationMigrationTests(unittest.TestCase):
    def setUp(self):
        # Test the association upgrade independently of later assignment changes.
        version = patch.object(schema,'SCHEMA_VERSION',18)
        version.start()
        self.addCleanup(version.stop)
        self.db = database(version=17)
        self.addCleanup(self.db.close)
        seed_people(self.db)
        device(self.db)

    def test_upgrade_and_restart_preserve_all_rows_without_inferred_links(self):
        from backend.sessions import _digest
        from backend.stock_intake import receive_stock
        from backend.stock_circulation import issue_stock
        from test_stock_intake import receipt_payload
        token = 'b' * 64
        self.db.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)', (_digest(token),))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
        self.db.execute('''INSERT INTO device_assignments
            (device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label)
            VALUES('device','person','Fictional Staff','2026-11-15',1,'Fictional Owner')''')
        self.db.commit()
        receipt = receipt_payload()
        receipt.update(readyQuantity=10, checks=dict(itemsChecked=True, conditionChecked=True))
        item = receive_stock(self.db, 1, token, receipt)['stockItemId']
        issue_stock(self.db, 1, token, circulation.issue_payload(self.db, item, quantity=3))
        before = {name: self.db.execute('SELECT * FROM "' + name + '"').fetchall()
                  for name, in self.db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        schema.initialise_database(self.db)
        for table, rows in before.items():
            if table != 'schema_migrations':
                self.assertEqual(self.db.execute('SELECT * FROM "' + table + '"').fetchall(), rows, table)
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (18,))
        self.assertEqual(self.db.execute('SELECT * FROM device_equipment_associations').fetchall(), [])
        self.assertEqual(self.db.execute("SELECT enabled FROM organisation_features WHERE feature='it_assets'").fetchone(), (1,))
        snapshot = tuple(self.db.iterdump())
        schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()), snapshot)
        with database(version=18) as fresh:
            self.assertEqual(fresh.execute('SELECT * FROM device_equipment_associations').fetchall(), [])
            self.assertEqual(fresh.execute('PRAGMA foreign_key_check').fetchall(), [])
            self.assertEqual(fresh.execute("SELECT enabled FROM organisation_features WHERE feature='it_assets'").fetchone(), (0,))

    def test_failed_upgrade_rolls_back_table_guards_and_version(self):
        from backend.equipment_associations import EQUIPMENT_ASSOCIATION_SQL
        before = tuple(self.db.iterdump())
        with patch('backend.equipment_associations.EQUIPMENT_ASSOCIATION_SQL', EQUIPMENT_ASSOCIATION_SQL + '\nINVALID SQL;'):
            with self.assertRaises(sqlite3.OperationalError):
                schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_preexisting_or_tampered_schema_stops_without_repair(self):
        self.db.execute('CREATE TABLE device_equipment_associations_unexpected(id INTEGER)')
        self.db.commit()
        before = tuple(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError, 'Unexpected existing equipment association schema'):
            schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.db.execute('DROP TABLE device_equipment_associations_unexpected')
        self.db.commit()
        schema.initialise_database(self.db)
        self.db.execute('DROP TRIGGER device_equipment_associations_no_update')
        self.db.commit()
        before = tuple(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError, 'Unexpected equipment association schema'):
            schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()), before)


class EquipmentAssociationTests(unittest.TestCase):
    receipt = circulation.StockCirculationTests.receipt
    issue = circulation.StockCirculationTests.issue
    legacy_device = circulation.StockCirculationTests.legacy_device

    def setUp(self):
        circulation.StockCirculationTests.setUp(self)
        self.assignment = self.legacy_device()['id']

    def issued(self, *, individual=False, quantity=3, **values):
        item = self.receipt(quantity=1 if individual else 10, individual=individual, model=uuid.uuid4().hex)
        if individual:
            quantity = 1
            values['stockUnitIds'] = [stock_item(self.db, item)['units'][0]['id']]
        self.issue(item, quantity=quantity, **values)
        return stock_issue_records(self.db)[0]

    def link(self, issue):
        identity = insert_association(self.db, self.assignment, issue['id'])
        self.db.commit()
        return identity

    def test_same_recipient_does_not_infer_association_and_link_does_not_move_stock(self):
        issue = self.issued()
        unlinked = read_equipment_associations(self.db, 1, 'canonical')
        self.assertEqual(unlinked['current'], [])
        self.assertEqual(unlinked['history'], [])
        self.assertTrue(unlinked['canAdd'])
        self.assertEqual(unlinked['existingIssues'], [issue])
        self.assertEqual(unlinked['context']['deviceAssignmentId'], self.assignment)
        before = {table: self.db.execute('SELECT * FROM ' + table).fetchall() for table in
                  ('it_asset_stock_entries', 'it_asset_stock_movements', 'device_assignments', 'inventory_devices')}
        identity = self.link(issue)
        record = read_equipment_associations(self.db, 1, 'canonical')['current'][0]
        self.assertEqual(record['id'], identity)
        self.assertEqual(record['issue'], issue)
        self.assertEqual(record['deviceAssignmentId'], self.assignment)
        self.assertEqual(record['actorLabel'], 'Original Association Technician')
        for table, rows in before.items():
            self.assertEqual(self.db.execute('SELECT * FROM ' + table).fetchall(), rows)
        schema.initialise_database(self.db)

    def test_partial_and_complete_returns_keep_link_and_original_issue_history(self):
        issue = self.issued()
        self.link(issue)
        return_stock(self.db, 1, self.token, circulation.return_payload(issue))
        records = read_equipment_associations(self.db, 1, 'canonical')
        self.assertEqual(records['current'][0]['issue']['outstanding'], 2)
        self.assertEqual(records['history'][0]['issue']['quantity'], 3)
        self.assertEqual(stock_item(self.db, issue['stockItemId'])['balances']['readyToIssue'], 7)
        return_stock(self.db, 1, self.token, circulation.return_payload(
            stock_issue_records(self.db)[0], quantityReturned=2))
        records = read_equipment_associations(self.db, 1, 'canonical')
        self.assertEqual(records['current'], [])
        self.assertEqual(records['history'][0]['issue']['outstanding'], 0)
        self.assertEqual(records['history'][0]['issue']['actor'], issue['actor'])
        self.assertEqual(self.db.execute('SELECT count(*) FROM device_equipment_associations').fetchone(), (1,))

    def test_individual_identity_and_writeoff_history_are_retained(self):
        from backend.stock_circulation import write_off_stock
        issue = self.issued(individual=True)
        self.link(issue)
        write_off_stock(self.db, 1, self.token, dict(operationId=uuid.uuid4().hex,
            issueEntryId=issue['id'], version=issue['version'], quantity=1,
            fromState='issued', writtenOffOn=issue['issuedOn'], reason='Damaged', note=''))
        result = read_equipment_associations(self.db, 1, 'canonical')
        self.assertEqual(result['current'], [])
        self.assertEqual(result['history'][0]['issue']['stockUnitId'], issue['stockUnitId'])
        self.assertEqual(result['history'][0]['issue']['outstanding'], 0)
        self.assertEqual(stock_item(self.db, self.db.execute(
            'SELECT stock_item_id FROM it_asset_stock_units WHERE id=?', (issue['stockUnitId'],)).fetchone()[0])['balances']['physicallyHeld'], 0)

    def test_immutable_links_reject_changes_deletion_and_replacement(self):
        issue = self.issued()
        identity = self.link(issue)
        before = tuple(self.db.iterdump())
        for sql, values in (
                ('UPDATE device_equipment_associations SET actor_label=?', ('Changed',)),
                ('DELETE FROM device_equipment_associations', ()),
                ('''INSERT OR REPLACE INTO device_equipment_associations
                    (id,device_assignment_id,issue_entry_id,operation_key,operation_hash,actor_id,actor_label)
                    VALUES(?,?,?,'replacement',?,1,'Replacement')''', (identity, self.assignment, issue['id'], 'b' * 64))):
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(sql, values)
            self.db.rollback()
            self.assertEqual(tuple(self.db.iterdump()), before)
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, self.assignment, issue['id'])
        self.db.rollback()

    def test_wrong_holder_returned_issue_and_unpublished_entry_are_rejected(self):
        wrong = self.issued(recipientId='other')
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, self.assignment, wrong['id'])
        self.db.rollback()
        issue = self.issued(quantity=1)
        return_stock(self.db, 1, self.token, circulation.return_payload(issue))
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, self.assignment, issue['id'])
        self.db.rollback()
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, self.assignment, 99999)
        self.db.rollback()

    def test_inactive_holder_cannot_gain_link_but_existing_history_remains(self):
        issue = self.issued()
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='person'")
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, self.assignment, issue['id'])
        self.db.rollback()
        self.db.execute("UPDATE staff_members SET active=1 WHERE id='person'")
        self.db.commit()
        self.link(issue)
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='person'")
        self.db.commit()
        self.assertEqual(len(read_equipment_associations(self.db, 1, 'canonical')['current']), 1)

    def test_closed_assignment_keeps_history_and_rejects_new_links(self):
        issue = self.issued()
        self.link(issue)
        source = legacy_device_issue(self.db, self.assignment)
        payload = circulation.return_payload(source)
        payload['deviceAssignmentId'] = payload.pop('issueEntryId')
        return_stock(self.db, 1, self.token, payload)
        result = read_equipment_associations(self.db, 1, 'canonical')
        self.assertEqual(result['current'], [])
        self.assertEqual(result['history'][0]['issue']['outstanding'], 3)
        self.assertIsNotNone(result['history'][0]['assignmentEndedAt'])
        another = self.issued()
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, self.assignment, another['id'])
        self.db.rollback()

    def test_department_holder_is_exact_and_archived_department_cannot_gain_links(self):
        from backend.device_assignments import assign_devices
        device(self.db, 'shared')
        assign_devices(self.db, 1, self.token, dict(recipientKind='department', recipientId='department',
            devices=[dict(id='shared', revision=0)]))
        assignment = self.db.execute("SELECT id FROM device_assignments WHERE device_id='shared'").fetchone()[0]
        personal = self.issued()
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, assignment, personal['id'])
        self.db.rollback()
        issue = self.issued(recipientKind='department', recipientId='department')
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            insert_association(self.db, assignment, issue['id'])
        self.db.rollback()
        self.db.execute("UPDATE departments SET archived=0 WHERE id='department'")
        insert_association(self.db, assignment, issue['id'])
        self.db.commit()
        self.assertEqual(read_equipment_associations(self.db, 1, 'shared')['current'][0]['issue']['departmentId'], 'department')

    def test_live_effective_permissions_feature_switches_and_employee_projection(self):
        self.link(self.issued())
        with self.assertRaises(PermissionError):
            read_equipment_associations(self.db, 2, 'canonical')
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','read')")
        self.db.commit()
        self.assertEqual(len(read_equipment_associations(self.db, 2, 'canonical')['history']), 1)
        readonly = read_equipment_associations(self.db, 2, 'canonical')
        self.assertFalse(readonly['canAdd'])
        self.assertIsNone(readonly['context'])
        self.assertEqual(readonly['existingIssues'], [])
        self.assertNotIn('Association Technician', json.dumps(my_equipment(self.db, 2)))
        for feature in ('devices', 'it_assets'):
            self.db.execute('UPDATE organisation_features SET enabled=0 WHERE feature=?', (feature,))
            self.db.commit()
            with self.assertRaises(PermissionError):
                read_equipment_associations(self.db, 1, 'canonical')
            self.db.execute('UPDATE organisation_features SET enabled=1 WHERE feature=?', (feature,))
            self.db.commit()
        self.db.execute("UPDATE account_permission_overrides SET level='deny' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        with self.assertRaises(PermissionError):
            read_equipment_associations(self.db, 2, 'missing')


if __name__ == '__main__':
    unittest.main()
