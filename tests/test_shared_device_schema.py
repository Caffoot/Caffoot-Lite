"""Schema 29 upgrades the custody ledger while retaining its original facts."""
import sqlite3
import unittest
from unittest.mock import patch

from backend import schema
from backend.device_assignments import assign_devices
from backend.equipment_associations import add_associated_equipment
from backend.stock_intake import stock_item
import test_associated_equipment_writes as fixture
from test_it_asset_stock_schema import device


class SharedDeviceSchemaTests(unittest.TestCase):
    receipt = fixture.AssociatedEquipmentWriteTests.receipt
    legacy_device = fixture.AssociatedEquipmentWriteTests.legacy_device

    def setUp(self):
        with patch.object(schema, 'SCHEMA_VERSION', 28):
            fixture.AssociatedEquipmentWriteTests.setUp(self)
        device(self.db, 'shared')
        result = assign_devices(self.db, 1, self.token, {
            'recipientKind': 'department', 'recipientId': 'department',
            'devices': [{'id': 'shared', 'revision': 0}],
        })
        self.assigned_at = result['assignedAt']
        self.assignment = self.db.execute("SELECT id FROM device_assignments WHERE device_id='shared'").fetchone()[0]
        self.item = self.receipt()
        add_associated_equipment(self.db, 1, self.token,
            fixture.combined_issue_payload(self.db, self.item, 'shared'), issue_new=True)
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()

    def test_upgrade_preserves_rows_ids_balances_and_existing_archived_relationship(self):
        originals = {}
        for (table,) in self.db.execute("SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'"):
            columns = ','.join(row[1] for row in self.db.execute(f'PRAGMA table_info({table})'))
            originals[table] = (columns, self.db.execute(f'SELECT {columns} FROM {table}').fetchall())
        balances = stock_item(self.db, self.item)['balances']
        # Earlier allocations can leave a sequence above the largest remaining ID.
        self.db.execute("""UPDATE sqlite_sequence SET seq=seq+100
            WHERE name IN ('device_assignments','it_asset_stock_entries')""")
        self.db.commit()
        sequence = self.db.execute('SELECT name,seq FROM sqlite_sequence').fetchall()
        schema.initialise_database(self.db)
        self.assertCountEqual(self.db.execute('SELECT name,seq FROM sqlite_sequence').fetchall(),
                              [*sequence, ('device_assignment_departments', 1)])
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (31,))
        for table, (columns, rows) in originals.items():
            if table != 'schema_migrations':
                self.assertCountEqual(self.db.execute(f'SELECT {columns} FROM {table}').fetchall(), rows, table)
        self.assertEqual(self.db.execute("""SELECT assignment_id,department_id,added_at,added_by,removed_at
            FROM device_assignment_departments""").fetchall(),
            [(self.assignment, 'department', self.assigned_at, 1, None)])
        self.assertEqual(stock_item(self.db, self.item)['balances'], balances)
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])
        self.assertEqual(self.db.execute('PRAGMA foreign_keys').fetchone(), (1,))
        original = tuple(self.db.iterdump())
        schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()), original)

    def test_failure_restores_previous_tables_guards_and_foreign_key_mode(self):
        original = tuple(self.db.iterdump())
        with patch('backend.shared_device_schema.validate_relationships', side_effect=RuntimeError('failed validation')):
            with self.assertRaisesRegex(RuntimeError, 'failed validation'):
                schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()), original)
        self.assertEqual(self.db.execute('PRAGMA foreign_keys').fetchone(), (1,))

    def test_existing_schema_requires_its_final_department_and_permanent_relationships(self):
        schema.initialise_database(self.db)
        with self.assertRaisesRegex(sqlite3.IntegrityError, 'Only attributed removal'):
            self.db.execute("""UPDATE device_assignment_departments
                SET removed_at='2099-01-01',removed_by=1,removed_by_label='Reviewer'""")
        self.db.rollback()
        with self.assertRaisesRegex(sqlite3.IntegrityError, 'history must be retained'):
            self.db.execute('DELETE FROM device_assignment_departments')
        self.db.rollback()
        with self.assertRaisesRegex(sqlite3.IntegrityError, 'requires an assigned Department'):
            device(self.db, 'none')
            self.db.execute("""INSERT INTO device_assignments
                (device_id,recipient_label,assigned_at,actor_id,actor_label)
                VALUES('none','Departments','2026-11-24',1,'Reviewer')""")
        self.db.rollback()
