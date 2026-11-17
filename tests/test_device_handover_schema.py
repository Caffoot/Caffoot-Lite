"""The separately numbered handover upgrade preserves data and physical-return guards."""
import sqlite3
import unittest
from unittest.mock import patch

from backend import schema
from backend.role_policy import evaluate_role_policy
from test_it_asset_stock_schema import database, post_fixture
import test_associated_equipment_writes as fixture
import test_stock_circulation as circulation


class DeviceHandoverSchemaTests(unittest.TestCase):
    def setUp(self):
        # Use real stock writers to preserve a populated pre-handover installation.
        with patch.object(schema,'SCHEMA_VERSION',18):
            fixture.AssociatedEquipmentWriteTests.setUp(self)
        self.addCleanup(self.db.close)

    receipt = fixture.AssociatedEquipmentWriteTests.receipt
    issued = fixture.AssociatedEquipmentWriteTests.issued
    issue = fixture.AssociatedEquipmentWriteTests.issue
    legacy_device = fixture.AssociatedEquipmentWriteTests.legacy_device

    def test_populated_upgrade_restart_and_fresh_creation_preserve_every_record_and_policy(self):
        self.issued()
        tables=[name for name, in self.db.execute("SELECT name FROM sqlite_master WHERE type='table'")]
        before={name:self.db.execute('SELECT * FROM '+name).fetchall() for name in tables}
        policy=evaluate_role_policy(self.db,2)
        # Keep this handover acceptance at its original schema-19 boundary.
        with patch.object(schema, 'SCHEMA_VERSION',19):
            schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(),(19,))
        for table,records in before.items():
            if table=='schema_migrations':continue
            after=self.db.execute('SELECT * FROM '+table).fetchall()
            if table=='device_assignments':
                self.assertTrue(all(row[-2:]==(None,None) for row in after))
                after=[row[:-2] for row in after]
            self.assertEqual(after,records,table)
        self.assertEqual(evaluate_role_policy(self.db,2),policy)
        snapshot=tuple(self.db.iterdump())
        with patch.object(schema, 'SCHEMA_VERSION',19):
            schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()),snapshot)
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(),[])
        with database(version=19) as fresh:
            self.assertEqual(fresh.execute('SELECT * FROM device_assignments').fetchall(),[])
            self.assertEqual(fresh.execute('SELECT * FROM it_asset_stock_movements').fetchall(),[])
            self.assertEqual(fresh.execute("SELECT enabled FROM organisation_features WHERE feature='it_assets'").fetchone(),(0,))

    def test_failure_rolls_back_columns_guards_and_migration_marker_together(self):
        from backend.handover_schema import HANDOVER_AUDIT_SQL
        before=tuple(self.db.iterdump())
        with patch('backend.handover_schema.HANDOVER_AUDIT_SQL',HANDOVER_AUDIT_SQL+'\nINVALID SQL;'):
            with self.assertRaises(sqlite3.OperationalError):schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_unexpected_original_schema_and_missing_new_guard_are_not_silently_repaired(self):
        self.db.execute('CREATE INDEX unexpected_assignment_index ON device_assignments(actor_id)');self.db.commit()
        before=tuple(self.db.iterdump())
        with self.assertRaises(RuntimeError):schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()),before)
        self.db.execute('DROP INDEX unexpected_assignment_index');self.db.commit();schema.initialise_database(self.db)
        self.db.execute('DROP TRIGGER device_handover_audit_no_update');self.db.commit()
        before=tuple(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError,'handover schema'):schema.initialise_database(self.db)
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_a_handover_flag_cannot_issue_unreceived_stock_without_canonical_history(self):
        schema.initialise_database(self.db)
        unit='a'*32
        self.db.execute('INSERT INTO it_asset_stock_units(id,device_id) VALUES(?,?)',(unit,'canonical'))
        self.db.commit();before=tuple(self.db.iterdump())
        with self.assertRaisesRegex(sqlite3.IntegrityError,'canonical custody entries'):
            post_fixture(self.db,'issued',[dict(stock_unit_id=unit,quantity=1,to_state='issued',
                device_assignment_id=self.assignment,staff_id='person',recipient_label='Fictional Staff')],
                checks_json='{"directHandover":true}')
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_existing_physical_closure_still_requires_its_original_audit_and_stock_fact(self):
        schema.initialise_database(self.db)
        before=tuple(self.db.iterdump())
        for sql in ("UPDATE device_assignments SET ended_at='2099-01-01'",
                    "UPDATE device_assignments SET ended_at='2099-01-01',successor_assignment_id=99999",
                    'UPDATE device_assignments SET handover_event_id=99999,successor_assignment_id=99999'):
            with self.assertRaises(sqlite3.IntegrityError):self.db.execute(sql)
            self.db.rollback();self.assertEqual(tuple(self.db.iterdump()),before)
        from backend.stock_circulation import legacy_device_issue,return_stock
        source=legacy_device_issue(self.db,self.assignment)
        payload=circulation.return_payload(source);payload['deviceAssignmentId']=payload.pop('issueEntryId')
        return_stock(self.db,1,self.token,payload)
        closed=self.db.execute('SELECT closure_movement_id,handover_event_id,successor_assignment_id FROM device_assignments').fetchone()
        self.assertIsNotNone(closed[0]);self.assertEqual(closed[1:],(None,None))


if __name__=='__main__':unittest.main()
