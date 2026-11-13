"""Optional-feature migration, retained choices and atomic settings changes."""
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend import schema
from backend.feature_settings import read_feature_settings, save_feature_setting
from backend.inventory import inspect_export, reconstruct_inventory, stage_inventory
from backend.reset_inventory import reset_inventory
from backend.sessions import _digest
from test_inventory import fixture


class FeatureSettingsTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.db.execute('PRAGMA foreign_keys=ON')
        self.addCleanup(self.db.close)
        self.token = 'a' * 64

    def owner(self):
        self.db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) VALUES(1,'owner','hash',1,'secret',1)")
        self.db.execute('INSERT INTO account_sessions VALUES(?,1,9999999999,1)', (_digest(self.token),))
        self.db.commit()

    def choices(self):
        return dict(self.db.execute('SELECT feature,enabled FROM organisation_features'))

    def save(self, feature='devices', enabled=True, **extra):
        return save_feature_setting(self.db, 1, self.token, dict(feature=feature, enabled=enabled, **extra))

    def snapshot(self):
        tables = [r[0] for r in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('schema_migrations','organisation_features','sqlite_sequence')")]
        return {t: self.db.execute(f'SELECT * FROM "{t}" ORDER BY rowid').fetchall() for t in tables}

    def test_fresh_defaults_and_repeated_initialisation(self):
        schema.initialise_database(self.db)
        self.assertEqual(self.choices(), dict.fromkeys(('devices', 'ipam', 'racks', 'suppliers', 'equipment_lifecycle'), 0))
        self.owner()
        self.save()
        before = self.choices()
        schema.initialise_database(self.db)
        self.assertEqual(self.choices(), before)
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (13,))

    def test_empty_existing_schema_12_uses_upgrade_defaults(self):
        with patch.object(schema, 'SCHEMA_VERSION', 12):
            schema.initialise_database(self.db)
        schema.initialise_database(self.db)
        self.assertEqual(self.choices(), dict(devices=1, ipam=1, racks=1, suppliers=0, equipment_lifecycle=0))

    def test_populated_upgrade_preserves_every_existing_table_and_session(self):
        with patch.object(schema, 'SCHEMA_VERSION', 12):
            schema.initialise_database(self.db)
        self.owner()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        self.db.execute("INSERT INTO account_permission_overrides VALUES(1,'Devices','deny')")
        self.db.commit()
        before = self.snapshot()
        schema.initialise_database(self.db)
        self.assertEqual(self.snapshot(), before)
        self.assertEqual(self.choices()['devices'], 1)

    def test_failed_migration_rolls_back_table_and_version(self):
        with patch.object(schema, 'SCHEMA_VERSION', 12):
            schema.initialise_database(self.db)
        before = list(self.db.iterdump())
        self.db.set_authorizer(lambda action, arg, *rest: sqlite3.SQLITE_DENY
                               if action == sqlite3.SQLITE_INSERT and arg == 'organisation_features'
                               else sqlite3.SQLITE_OK)
        with self.assertRaises(sqlite3.DatabaseError):
            schema.initialise_database(self.db)
        self.db.set_authorizer(None)
        self.assertEqual(list(self.db.iterdump()), before)

    def test_choices_survive_import_clean_start_database_copy_and_restart(self):
        schema.initialise_database(self.db)
        self.owner()
        self.save('ipam')
        before = self.choices()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        self.assertEqual(self.choices(), before)
        with patch("backend.reset_inventory.can_access", return_value=True):
            reset_inventory(self.db, 1)
        self.assertEqual(self.choices(), before)
        with sqlite3.connect(':memory:') as restored:
            self.db.backup(restored)
            schema.initialise_database(restored)
            self.assertEqual(read_feature_settings(restored, 1), {k: bool(v) for k, v in before.items()})

    def test_transitions_audit_actor_values_noop_and_preserve_data(self):
        schema.initialise_database(self.db)
        self.owner()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        before = self.snapshot()
        self.save()
        self.save()
        self.save(enabled=False, confirmDisable=True)
        self.save(enabled=False, confirmDisable=True)
        events = [json.loads(r[0]) for r in self.db.execute('SELECT record_json FROM inventory_change_history')]
        self.assertEqual(len(events), 2)
        for event, older, newer in zip(events, (False, True), (True, False)):
            self.assertEqual((event['actor'], event['actorId'], event['outcome']), ('owner', 1, 'Succeeded'))
            self.assertEqual(event['changes'][0]['before'], {'enabled': older})
            self.assertEqual(event['changes'][0]['after'], {'enabled': newer})
        after = self.snapshot()
        del before['inventory_change_history'], after['inventory_change_history']
        self.assertEqual(before, after)

    def test_validation_confirmation_and_future_features_save_nothing(self):
        schema.initialise_database(self.db)
        self.owner()
        before = list(self.db.iterdump())
        payloads = [None, [], {}, {'feature': 'devices', 'enabled': 1},
                    {'feature': 'devices', 'enabled': 'false'},
                    {'feature': [], 'enabled': True},
                    {'feature': 'unknown', 'enabled': True},
                    {'feature': 'suppliers', 'enabled': True},
                    {'feature': 'equipment_lifecycle', 'enabled': False, 'confirmDisable': True},
                    {'feature': 'devices', 'enabled': False},
                    {'feature': 'devices', 'enabled': False, 'confirmDisable': 1},
                    {'feature': 'devices', 'enabled': True, 'actorId': 1}]
        for payload in payloads:
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                save_feature_setting(self.db, 1, self.token, payload)
            self.assertEqual(list(self.db.iterdump()), before)

    def test_storage_rejects_unknown_nonboolean_and_future_activation(self):
        schema.initialise_database(self.db)
        for sql in ("INSERT INTO organisation_features VALUES('unknown',0)",
                    "UPDATE organisation_features SET enabled=2 WHERE feature='devices'",
                    "UPDATE organisation_features SET enabled=0.5 WHERE feature='devices'",
                    "UPDATE organisation_features SET enabled=1 WHERE feature='suppliers'",
                    "UPDATE organisation_features SET enabled=1 WHERE feature='equipment_lifecycle'"):
            with self.subTest(sql=sql), self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(sql)
            self.db.rollback()

    def test_audit_failure_rolls_back_setting(self):
        schema.initialise_database(self.db)
        self.owner()
        before = list(self.db.iterdump())
        with patch('backend.feature_settings.record_actor_event', side_effect=RuntimeError('Audit failed')):
            with self.assertRaises(RuntimeError):
                self.save()
        self.assertEqual(list(self.db.iterdump()), before)

    def test_authorisation_rechecked_inside_write_transaction(self):
        schema.initialise_database(self.db)
        self.owner()
        observed = []
        def revoked(connection, token):
            observed.append(connection.in_transaction)
            return None
        with patch('backend.feature_settings.session_account', side_effect=revoked):
            with self.assertRaises(PermissionError):
                self.save()
        self.assertEqual(observed, [True])
        self.assertFalse(self.db.in_transaction)
        for column in ('active', 'is_admin', 'mfa_confirmed'):
            self.db.execute(f'UPDATE accounts SET {column}=0 WHERE id=1')
            self.db.commit()
            with self.assertRaises(PermissionError):
                self.save()
            self.db.execute(f'UPDATE accounts SET {column}=1 WHERE id=1')
            self.db.commit()
        self.assertEqual(self.choices()['devices'], 0)

    def test_waiting_writer_rechecks_revocation_and_administrator_state(self):
        import concurrent.futures
        import tempfile
        import threading
        from pathlib import Path

        schema.initialise_database(self.db)
        self.owner()
        for statement in ('DELETE FROM account_sessions',
                          'UPDATE account_sessions SET expires_at=1',
                          'UPDATE accounts SET active=0 WHERE id=1',
                          'UPDATE accounts SET is_admin=0 WHERE id=1',
                          'UPDATE accounts SET mfa_confirmed=0 WHERE id=1'):
            with self.subTest(statement=statement), tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / 'features.sqlite3'
                with sqlite3.connect(path) as target:
                    self.db.backup(target)
                attempted = threading.Event()
                writer = sqlite3.connect(path)
                writer.execute('BEGIN IMMEDIATE')
                writer.execute(statement)
                def save_waiting():
                    with sqlite3.connect(path, timeout=5) as waiting:
                        waiting.set_trace_callback(lambda query: attempted.set() if query == 'BEGIN IMMEDIATE' else None)
                        return save_feature_setting(waiting, 1, self.token, dict(feature='devices', enabled=True))
                try:
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                        pending = pool.submit(save_waiting)
                        try:
                            self.assertTrue(attempted.wait(3))
                            self.assertFalse(pending.done())
                        finally:
                            writer.commit()
                        with self.assertRaises(PermissionError):
                            pending.result(timeout=5)
                finally:
                    writer.close()
                with sqlite3.connect(path) as check:
                    self.assertEqual(check.execute("SELECT enabled FROM organisation_features WHERE feature='devices'").fetchone(), (0,))
                    self.assertFalse(check.execute('SELECT 1 FROM inventory_change_history').fetchone())
