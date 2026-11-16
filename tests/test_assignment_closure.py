"""Guard allocation closure without changing earlier identities or stock facts."""
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend import schema
from backend.audit_events import record_actor_event
from backend.role_policy import evaluate_role_policy
from test_it_asset_stock_schema import database, seed_people, device


def allocation_fixture(connection):
    seed_people(connection)
    device(connection)
    identity = connection.execute('''INSERT INTO device_assignments
        (device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label)
        VALUES('device','person','Original Holder','2026-11-14T09:00:00Z',1,'Original Technician')''').lastrowid
    connection.commit()
    return identity


def pending_closure(connection, assignment, *, kind='returned', audit=True):
    """Build test-only facts in the order required by both independent guards."""
    movement = connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
    unit = uuid.uuid4().hex
    connection.execute('INSERT INTO it_asset_stock_units(id,device_id) VALUES(?,?)', (unit, 'device'))
    connection.execute('''INSERT INTO it_asset_stock_entries
        (movement_id,stock_unit_id,quantity,to_state,device_assignment_id)
        VALUES(?,?,1,?,?)''', (movement, unit,
        'awaiting_preparation' if kind == 'returned' else 'written_off', assignment))
    ended = '2026-11-15T12:00:00Z'
    if audit:
        record_actor_event(connection, 1, kind='IT Assets', action='Returned' if kind == 'returned' else 'Written Off',
            label='device', reason='Fictional physical operation', fields=['Assignment'],
            after=dict(assignmentId=assignment, closureMovementId=movement, deviceId='device', endedAt=ended))
    return movement, ended


def publish_closure(connection, movement, *, kind='returned', reason=''):
    connection.execute('''INSERT INTO it_asset_stock_movements
        (id,operation_key,kind,event_date,actor_id,actor_label,reason)
        VALUES(?,?,?,'2026-11-15',1,'Fictional Owner',?)''',
        (movement, uuid.uuid4().hex, kind, reason))


class AssignmentClosureTests(unittest.TestCase):
    def setUp(self):
        self.db = database(version=16)
        self.addCleanup(self.db.close)
        self.assignment = allocation_fixture(self.db)

    def upgrade(self):
        # Preserve this historical closure migration's exact schema/stock checks.
        # The later handover migration has its own populated-upgrade coverage.
        with patch.object(schema,'SCHEMA_VERSION',18):
            schema.initialise_database(self.db)

    def rows(self):
        return {name: self.db.execute('SELECT * FROM "'+name+'" ORDER BY rowid').fetchall()
                for name, in self.db.execute("SELECT name FROM sqlite_master WHERE type='table'")}

    def test_fresh_upgrade_and_restart_preserve_every_record_and_effective_policy(self):
        before = self.rows()
        policy = evaluate_role_policy(self.db, 2)
        stock = self.db.execute("SELECT name,sql FROM sqlite_master WHERE name GLOB 'it_asset_*' ORDER BY name").fetchall()
        self.upgrade()
        after = self.rows()
        self.assertEqual(after.pop('schema_migrations')[-1][0], 18)
        self.assertEqual(after.pop('device_equipment_associations'), [])
        before.pop('schema_migrations')
        self.assertTrue(all(row[-1] is None for row in after['device_assignments']))
        after['device_assignments'] = [row[:-1] for row in after['device_assignments']]
        self.assertEqual(after, before)
        self.assertEqual(evaluate_role_policy(self.db, 2), policy)
        self.assertEqual(self.db.execute("SELECT name,sql FROM sqlite_master WHERE name GLOB 'it_asset_*' ORDER BY name").fetchall(), stock)
        complete = tuple(self.db.iterdump())
        self.upgrade()
        self.assertEqual(tuple(self.db.iterdump()), complete)
        with database(version=17) as fresh:
            self.assertEqual(fresh.execute('SELECT max(version) FROM schema_migrations').fetchone(), (17,))
            for table in ('it_asset_stock_items','it_asset_stock_units','it_asset_stock_movements','it_asset_stock_entries'):
                self.assertEqual(fresh.execute('SELECT count(*) FROM '+table).fetchone(), (0,))
            self.assertEqual(fresh.execute("SELECT enabled FROM organisation_features WHERE feature='it_assets'").fetchone(), (0,))

    def test_populated_stock_and_feature_choices_are_preserved(self):
        from backend.sessions import _digest
        from backend.stock_intake import receive_stock
        from test_stock_intake import receipt_payload
        token = 'b'*64
        self.db.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)', (_digest(token),))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('it_assets','racks')")
        self.db.commit()
        receive_stock(self.db, 1, token, receipt_payload())
        before = self.rows()
        self.upgrade()
        after = self.rows()
        for table in before:
            if table not in ('schema_migrations','device_assignments'):
                self.assertEqual(after[table], before[table], table)

    def test_preexisting_completed_allocations_survive_without_invented_closure_facts(self):
        device(self.db,'older-device')
        identity=self.db.execute('''INSERT INTO device_assignments
            (device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label,ended_at)
            VALUES('older-device','person','Historic Holder','2026-11-12',1,'Historic Technician','2026-11-13')''').lastrowid
        self.db.commit()
        original=self.db.execute('SELECT * FROM device_assignments WHERE id=?',(identity,)).fetchone()
        self.upgrade()
        self.assertEqual(self.db.execute('SELECT * FROM device_assignments WHERE id=?',(identity,)).fetchone(),(*original,None))
        self.assertEqual(self.db.execute('SELECT count(*) FROM it_asset_stock_movements').fetchone(),(0,))
        for statement in ('UPDATE device_assignments SET ended_at=NULL WHERE id=?',
                          'DELETE FROM device_assignments WHERE id=?'):
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(statement,(identity,))
            self.db.rollback()

    def test_restart_refuses_missing_closure_guards_without_repair_or_data_changes(self):
        self.upgrade()
        self.db.execute('DROP TRIGGER retain_device_assignment_update')
        self.db.commit()
        before=tuple(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError,'Unexpected assignment closure schema'):
            self.upgrade()
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_failure_rolls_back_the_column_guard_and_version_together(self):
        from backend.assignment_closure import ASSIGNMENT_CLOSURE_SQL
        before = tuple(self.db.iterdump())
        with patch('backend.assignment_closure.ASSIGNMENT_CLOSURE_SQL', ASSIGNMENT_CLOSURE_SQL+'\nINVALID SQL;'):
            with self.assertRaises(sqlite3.OperationalError):
                self.upgrade()
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.assertEqual(len(self.db.execute('PRAGMA table_info(device_assignments)').fetchall()), 9)

    def test_unexpected_existing_guards_are_not_adopted_or_silently_repaired(self):
        self.db.execute('CREATE INDEX unexpected_assignment_index ON device_assignments(actor_id)')
        self.db.commit()
        before = tuple(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError, 'Unexpected existing assignment schema'):
            self.upgrade()
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_return_and_writeoff_close_once_and_preserve_original_assignment(self):
        for kind in ('returned','written_off'):
            with self.subTest(kind=kind), database(version=16) as db:
                assignment = allocation_fixture(db)
                original = db.execute('SELECT * FROM device_assignments').fetchone()[:8]
                schema.initialise_database(db)
                db.execute('BEGIN IMMEDIATE')
                movement, ended = pending_closure(db, assignment, kind=kind)
                db.execute('UPDATE device_assignments SET ended_at=?,closure_movement_id=? WHERE id=?',
                           (ended, movement, assignment))
                publish_closure(db, movement, kind=kind, reason='Damaged' if kind == 'written_off' else '')
                db.commit()
                self.assertEqual(db.execute('SELECT * FROM device_assignments').fetchone()[:8], original)
                self.assertEqual(db.execute('SELECT ended_at,closure_movement_id FROM device_assignments').fetchone(), (ended,movement))
                self.assertEqual(db.execute('SELECT kind FROM it_asset_stock_movements').fetchall(), [(kind,)])
                self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(), [])
                for sql in ('UPDATE device_assignments SET ended_at=NULL',
                            "UPDATE device_assignments SET ended_at='2026-11-16'",
                            'DELETE FROM device_assignments'):
                    with self.assertRaises(sqlite3.IntegrityError):
                        db.execute(sql)
                    db.rollback()

    def test_missing_audit_or_pending_fact_cannot_close_an_assignment(self):
        self.upgrade()
        before = tuple(self.db.iterdump())
        self.db.execute('BEGIN IMMEDIATE')
        movement, ended = pending_closure(self.db, self.assignment, audit=False)
        with self.assertRaisesRegex(sqlite3.IntegrityError, 'audit record'):
            self.db.execute('UPDATE device_assignments SET ended_at=?,closure_movement_id=?', (ended,movement))
        self.db.rollback()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE device_assignments SET ended_at='2026-11-15',closure_movement_id=1")
        self.db.rollback()
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_missing_or_invalid_header_rolls_back_closure_audit_and_stock(self):
        self.upgrade()
        before = tuple(self.db.iterdump())
        for invalid in ('missing','received','written_off'):
            with self.subTest(header=invalid):
                self.db.execute('BEGIN IMMEDIATE')
                movement, ended = pending_closure(self.db, self.assignment)
                self.db.execute('UPDATE device_assignments SET ended_at=?,closure_movement_id=?', (ended,movement))
                with self.assertRaises(sqlite3.IntegrityError):
                    if invalid != 'missing':
                        publish_closure(self.db, movement, kind=invalid)
                    self.db.commit()
                self.db.rollback()
                self.assertEqual(tuple(self.db.iterdump()), before)

    def test_original_fields_and_replacement_are_independently_protected(self):
        self.upgrade()
        for field,value in [('device_id','other'),('staff_id','other'),('recipient_label','Changed'),
                            ('assigned_at','2026-11-13'),('actor_id',2),('actor_label','Changed'),('id',99)]:
            self.db.execute('BEGIN IMMEDIATE')
            movement, ended = pending_closure(self.db, self.assignment)
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute('UPDATE device_assignments SET ended_at=?,closure_movement_id=?,'+field+'=?', (ended,movement,value))
            self.db.rollback()
        for identity in (self.assignment,99):
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute('''INSERT OR REPLACE INTO device_assignments
                    (id,device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label)
                    VALUES(?,'device','person','Replacement','2026-11-15',1,'Replacement')''',(identity,))
            self.db.rollback()

    def test_concurrent_closure_retains_one_fact_and_original_identity(self):
        self.upgrade()
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'closure.sqlite3'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def close(_):
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    db.execute('BEGIN IMMEDIATE')
                    try:
                        movement,ended = pending_closure(db,self.assignment)
                        db.execute('UPDATE device_assignments SET ended_at=?,closure_movement_id=?',(ended,movement))
                        publish_closure(db,movement)
                        db.commit()
                        return True
                    except sqlite3.IntegrityError:
                        db.rollback()
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(close,range(2))),[False,True])
            with sqlite3.connect(path) as db:
                self.assertEqual(db.execute('SELECT count(*) FROM it_asset_stock_movements').fetchone(),(1,))
                self.assertEqual(db.execute('SELECT count(*) FROM inventory_devices').fetchone(),(1,))
                self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(),[])
