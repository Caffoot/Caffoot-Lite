"""Equipment Lifecycle date rules, data boundaries and SQLite persistence."""
from datetime import date
import json
import sqlite3
import unittest
from unittest.mock import patch

from backend import schema
from backend.device_saves import create_device, save_reserved_device
from backend.equipment_lifecycle import (DEFAULT_LIFESPANS, add_calendar_years, project_device_lifecycle,
    read_lifecycle_settings, save_lifecycle_settings, warning_state)
from backend.history_permissions import visible_change_history
from backend.inventory_projection import project_inventory_response
import test_feature_settings as feature_fixture


class EquipmentLifecycleTests(unittest.TestCase):
    setUp = feature_fixture.FeatureSettingsTests.setUp
    owner = feature_fixture.FeatureSettingsTests.owner

    def setup_devices(self):
        schema.initialise_database(self.db)
        self.owner()
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','equipment_lifecycle')")
        self.db.commit()
        self.record = dict(id='desk', name='Fictional Desktop', type='Desktop', status='Active',
                           location='Unknown', mountType='Desktop', primaryIp='')
        create_device(self.db, 1, self.record)
        self.record = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='desk'").fetchone()[0])

    def save_dates(self, updates, *, actor=1, section='Devices'):
        self.db.execute("DELETE FROM device_edit_reservations")
        revision = self.db.execute("SELECT revision FROM inventory_devices WHERE id='desk'").fetchone()[0]
        self.db.execute("INSERT INTO device_edit_reservations VALUES('desk',?,9999999999,?)", (actor, revision))
        self.db.commit()
        return save_reserved_device(self.db, actor, 'desk', revision, self.record, section=section, lifecycle=updates)

    def configuration_payload(self, **changes):
        result = read_lifecycle_settings(self.db, 1)
        result['types'] = [{k: entry[k] for k in ('name', 'years')} for entry in result['types']]
        return dict(result, **changes)

    def test_upgrade_has_defaults_without_historical_dates_and_full_backup_retains_data(self):
        with patch.object(schema, 'SCHEMA_VERSION', 23):
            schema.initialise_database(self.db)
        self.owner()
        self.assertEqual(self.db.execute("SELECT enabled FROM organisation_features WHERE feature='equipment_lifecycle'").fetchone(), (0,))
        self.db.execute("INSERT INTO inventory_devices VALUES('desk','Fictional Desktop',?,0,0)", (
            json.dumps(dict(id='desk', name='Fictional Desktop', type='Desktop', status='Active')),))
        self.db.commit()
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT * FROM device_lifecycle').fetchall(), [])
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='equipment_lifecycle'")
        self.db.commit()
        config = self.configuration_payload()
        self.assertEqual((config['warrantyDays'], config['replacementDays']), (90, 90))
        self.assertEqual({x['name']: x['years'] for x in config['types']}, DEFAULT_LIFESPANS)
        self.db.execute("INSERT INTO device_lifecycle(device_id,purchase_date) VALUES('desk','2024-02-29')")
        self.db.commit()
        save_lifecycle_settings(self.db, 1, self.token, dict(config, warrantyDays=0))
        with sqlite3.connect(':memory:') as restored:
            self.db.backup(restored)
            schema.initialise_database(restored)
            self.assertEqual(read_lifecycle_settings(restored, 1)['warrantyDays'], 0)
            self.assertEqual(restored.execute('SELECT purchase_date FROM device_lifecycle').fetchone(), ('2024-02-29',))
            self.assertEqual(restored.execute('PRAGMA foreign_key_check').fetchall(), [])

    def test_calendar_and_warning_boundaries(self):
        self.assertEqual(add_calendar_years(date(2024, 2, 29), 3), date(2027, 2, 28))
        self.assertEqual(add_calendar_years(date(2024, 2, 29), 4), date(2028, 2, 29))
        today = date(2026, 1, 1)
        for value, period, expected in (
            (None, 0, None), (date(2025, 12, 31), 0, 'past'), (today, 0, 'upcoming'),
            (date(2026, 1, 2), 0, None), (date(2026, 4, 1), 90, 'upcoming'),
            (date(2026, 4, 2), 90, None),
        ):
            with self.subTest(value=value, period=period):
                self.assertEqual(warning_state(value, today, period), expected)

    def test_settings_validation_is_atomic_and_audited(self):
        self.setup_devices()
        payload = self.configuration_payload(warrantyDays=0, replacementDays=3650)
        payload['types'][0]['years'] = None
        payload['types'][-1]['years'] = 101
        before = tuple(self.db.iterdump())
        with self.assertRaisesRegex(ValueError, 'whole number'):
            save_lifecycle_settings(self.db, 1, self.token, payload)
        self.assertEqual(tuple(self.db.iterdump()), before)
        payload['types'][-1]['years'] = 100
        saved = save_lifecycle_settings(self.db, 1, self.token, payload)
        self.assertEqual((saved['warrantyDays'], saved['replacementDays']), (0, 3650))
        with self.assertRaises(FileExistsError):
            save_lifecycle_settings(self.db, 1, self.token, payload)
        audit = visible_change_history(self.db, 1)
        self.assertTrue(any(change.get('after', {}).get('Warranty Expiry Warning Period') == 0
                            for event in audit for change in event['changes']))

    def test_device_validation_permissions_override_and_disabled_projection(self):
        self.setup_devices()
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(2,'engineer','hash','secret',1)")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','edit')")
        self.db.commit()
        with patch('backend.equipment_lifecycle.utc_today', return_value=date(2026, 11, 18)):
            with self.assertRaisesRegex(ValueError, 'cannot be in the future'):
                self.save_dates({'purchaseDate': '2026-11-19'})
            with self.assertRaisesRegex(ValueError, 'valid'):
                self.save_dates({'warrantyExpiry': '2023-02-29'})
            self.save_dates({'purchaseDate': '2024-03-12', 'originalInServiceDate': '2024-02-29'}, actor=2)
            result = project_device_lifecycle(self.db, [self.record, dict(self.record, id='vm', isVirtual=True)])
            self.assertEqual(len(result['devices']), 1)
            self.assertEqual(result['devices'][0]['plannedReplacementDate'], '2027-02-28')
            self.assertIsNone(result['devices'][0]['warrantyExpiry'])
            with self.assertRaises(PermissionError):
                self.save_dates({'replacementOverride': '2026-01-01'}, actor=2)
            self.save_dates({'replacementOverride': '2026-01-01'})
            self.save_dates({'originalInServiceDate': None}, actor=2)
            self.assertEqual(project_device_lifecycle(self.db, [self.record])['devices'][0]['plannedReplacementDate'], '2026-01-01')
            self.save_dates({'replacementOverride': None})
            self.assertEqual(project_device_lifecycle(self.db, [self.record])['devices'][0]['plannedReplacementDate'], '2027-03-12')
            self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='equipment_lifecycle'")
            self.db.commit()
            with self.assertRaises(PermissionError):
                self.save_dates({'warrantyExpiry': '2025-12-01'})
            self.assertNotIn('equipmentLifecycle', project_inventory_response(self.db, 1, {'devices': [self.record]}))
            self.assertNotIn('2024-03-12', json.dumps(visible_change_history(self.db, 1)))
            self.assertEqual(self.db.execute('SELECT purchase_date FROM device_lifecycle').fetchone(), ('2024-03-12',))

    def test_existing_custom_server_label_and_new_name_reservation(self):
        from backend.device_catalogue import change_device_catalogue
        self.setup_devices()
        with self.assertRaisesRegex(ValueError, 'Server is the existing physical server type'):
            change_device_catalogue(self.db, 1, 'type', 'add', '', 'Server', [])
        # A historical custom type is part of the managed catalogue, not just
        # its lifespan table. Reproduce both persisted records without using
        # the newly protected Add Device Type operation.
        managed = self.db.execute(
            "SELECT value_json FROM inventory_settings WHERE key='deviceTypes'"
        ).fetchone()
        existing = json.loads(managed[0]) if managed else []
        self.assertNotIn('Server', existing)
        self.db.execute(
            "INSERT INTO inventory_settings(key,value_json) VALUES('deviceTypes',?) "
            "ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json",
            (json.dumps([*existing, 'Server']),))
        self.db.execute("INSERT INTO equipment_lifecycle_types(name,years) VALUES('Server',7)")
        self.db.commit()
        labels = {row['name']: row['label'] for row in read_lifecycle_settings(self.db, 1)['types']}
        self.assertEqual(labels['Server - Physical'], 'Server')
        self.assertEqual(labels['Server'], 'Server (Custom)')
        self.assertEqual(self.db.execute(
            "SELECT name,years FROM equipment_lifecycle_types WHERE name='Server'").fetchone(),
            ('Server', 7))

    def test_archive_and_rename_keep_type_identity_and_existing_calculation(self):
        from backend.device_catalogue import change_device_catalogue
        self.setup_devices()
        self.save_dates({'purchaseDate': '2024-02-29'})
        original = self.db.execute(
            "SELECT id FROM equipment_lifecycle_types WHERE name='Desktop'").fetchone()
        change = lambda op, old, new: change_device_catalogue(self.db, 1, 'type', op, old, new, ['desk'])
        change('archive', 'Desktop', '')
        self.assertTrue(read_lifecycle_settings(self.db, 1)['types'][0]['archived'])
        with self.assertRaisesRegex(ValueError, 'available for new selections'):
            create_device(self.db, 1, dict(self.record, id='new', name='Archived New Device'))
        self.save_dates({'warrantyExpiry': '2025-02-28'})
        change('rename', 'Desktop', 'Fictional Workstation')
        self.record = json.loads(self.db.execute(
            "SELECT record_json FROM inventory_devices WHERE id='desk'").fetchone()[0])
        self.assertEqual(self.record['type'], 'Fictional Workstation')
        self.assertEqual(project_device_lifecycle(self.db, [self.record])['devices'][0]['plannedReplacementDate'], '2027-02-28')
        self.assertEqual(self.db.execute(
            "SELECT id FROM equipment_lifecycle_types WHERE name='Fictional Workstation'").fetchone(), original)
        self.assertNotIn('Desktop', {entry['name'] for entry in read_lifecycle_settings(self.db, 1)['types']})
        change('unarchive', 'Fictional Workstation', '')
        create_device(self.db, 1, dict(self.record, id='new', name='Unarchived New Device'))
        self.assertEqual(self.db.execute("SELECT count(*) FROM device_lifecycle").fetchone(), (1,))
