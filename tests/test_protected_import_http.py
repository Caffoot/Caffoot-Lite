"""Exercise protected replacement through the authenticated import routes."""
import base64
import json
import sqlite3
import unittest

from backend.import_review import prepare_published_export_review
from backend.inventory import reconstruct_inventory
from test_import_review import fixture as legacy_inventory
import test_service_desk_http as desk_fixture


ATTACHMENT = b'Fictional equipment check'
TEST_FILE = {'filename': 'equipment-check.txt', 'contents': base64.b64encode(ATTACHMENT).decode()}


def exported_inventory():
    source = legacy_inventory()
    source['caffootBackup'] = {
        'format': 'caffoot-inventory', 'schemaVersion': 1, 'app': 'Caffoot Lite',
        'appVersion': '1.3.3', 'exportedAt': '2026-11-20T12:00:00Z',
    }
    return source


class ProtectedImportHttpTests(unittest.TestCase):
    setUp = desk_fixture.ServiceDeskHttpTests.setUp
    close_server = desk_fixture.ServiceDeskHttpTests.close_server
    request = desk_fixture.ServiceDeskHttpTests.request
    ticket_path = desk_fixture.ServiceDeskHttpTests.ticket_path
    create = desk_fixture.ServiceDeskHttpTests.create
    assign_device = desk_fixture.ServiceDeskHttpTests.assign_device
    hand_over = desk_fixture.ServiceDeskHttpTests.hand_over
    populate_reset_fixture = desk_fixture.ServiceDeskHttpTests.populate_reset_fixture
    download = desk_fixture.ServiceDeskHttpTests.download

    def preview(self, source, expected=200, **request_options):
        status, body, _ = self.request('/api/import/preview', method='POST',
                                       raw=json.dumps(source).encode(),
                                       headers={'Content-Type': 'application/octet-stream'},
                                       **request_options)
        self.assertEqual(status, expected, body)
        return body

    def confirm(self, draft, expected=200):
        status, body, _ = self.request('/api/import/confirm', method='POST',
                                       payload={'draftId': draft, 'replacementConfirmed': True})
        self.assertEqual(status, expected, body)
        return body

    def dump(self):
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(), [])
            return tuple(db.iterdump())

    def operational_fixture(self):
        self.populate_reset_fixture()
        source = exported_inventory()
        source['devices'].extend(dict(id=identity, name=name, type='Laptop', status='Active',
                                      mountType='Desktop', primaryIp='', customTag='Retained')
                                 for identity, name in (
                                     ('device', 'Laptop'), ('returned', 'Returned Laptop'),
                                     ('supplier-only', 'Supplier laptop'), ('lifecycle-only', 'Lifecycle laptop'),
                                 ))
        records = prepare_published_export_review(json.dumps(source).encode())['candidate']['devices']
        with sqlite3.connect(self.path) as db:
            db.execute('PRAGMA foreign_keys=ON')
            for record in records[1:]:
                db.execute('''
                    INSERT INTO inventory_devices(id,name,record_json,revision,ordinal)
                    VALUES (?,?,?,7,(SELECT max(ordinal)+1 FROM inventory_devices))
                    ON CONFLICT(id) DO UPDATE SET record_json=excluded.record_json, revision=excluded.revision
                ''', (record['id'], record['name'], json.dumps(record)))
            db.execute("INSERT INTO device_suppliers(device_id,supplier_id) VALUES('supplier-only',1)")
            db.execute("INSERT INTO device_lifecycle(device_id,purchase_date) VALUES('lifecycle-only','2026-11-20')")
        ticket = self.create('it', actor=1, equipmentId='device', attachments=[TEST_FILE])
        route = self.ticket_path('it', f'/{ticket}')
        status, body, _ = self.request(route + '/messages', method='POST',
                                       payload={'body': 'Fictional technician note'})
        self.assertEqual(status, 200, body)
        attachment, = self.request(route + '/messages')[1]['attachments']
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature IN ('it_assets','suppliers','equipment_lifecycle')")
        return source, ticket, attachment['id']

    def non_inventory_rows(self):
        with sqlite3.connect(self.path) as db:
            names = [name for name, in db.execute("SELECT name FROM sqlite_schema WHERE type='table'")
                     if (not name.startswith('inventory_') or name == 'inventory_change_history')
                     and name != 'device_edit_reservations']
            return {name: db.execute(f'SELECT * FROM {name} ORDER BY rowid').fetchall() for name in names}

    def test_identical_protected_devices_retain_rows_with_features_disabled(self):
        source, ticket, attachment = self.operational_fixture()
        before = self.non_inventory_rows()
        for table in ('staff_members', 'departments', 'device_assignments', 'it_asset_stock_movements',
                      'it_asset_stock_entries', 'device_equipment_associations', 'device_suppliers',
                      'device_lifecycle', 'supplier_issues', 'service_desk_tickets', 'service_desk_events',
                      'service_desk_messages', 'service_desk_attachments'):
            self.assertTrue(before[table], table)
        with sqlite3.connect(self.path) as db:
            protected = db.execute('SELECT rowid,id,revision,record_json FROM inventory_devices ORDER BY id').fetchall()
        source['devices'].reverse()
        self.confirm(self.preview(source)['draftId'])
        self.assertEqual(self.non_inventory_rows(), before)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute('SELECT rowid,id,revision,record_json FROM inventory_devices '
                                        'WHERE id!=? ORDER BY id', ('d',)).fetchall(), protected)
            self.assertEqual([d['id'] for d in reconstruct_inventory(db)['devices']],
                             [d['id'] for d in source['devices']])
        self.assertEqual(self.download('it', ticket, attachment, 1)[:2], (200, ATTACHMENT))
        self.dump()

    def test_preview_reports_every_conflict_and_keeps_database_unchanged(self):
        source, _, _ = self.operational_fixture()
        source['devices'] = [record for record in source['devices'] if record['id'] not in ('device', 'supplier-only')]
        for record in source['devices'][1:]:
            record['name'] += ' changed'
        before = self.dump()
        body = self.preview(source, 400)
        self.assertEqual(body['code'], 'protected_devices')
        self.assertNotIn('draftId', body)
        lines = body['error'].splitlines()
        self.assertEqual(len(lines), 6)
        for name, reason, labels in (
            ('Laptop', 'missing from the backup', ('associated equipment', 'Device handover history',
             'Staff or Department assignment history', 'Equipment Lifecycle record',
             'Service Desk ticket history', 'Supplier association')),
            ('Returned Laptop', 'changed in the backup', ('IT Assets stock links or movement history',
             'Staff or Department assignment history')),
            ('Supplier laptop', 'missing from the backup', ('Supplier association',)),
            ('Lifecycle laptop', 'changed in the backup', ('Equipment Lifecycle record',)),
        ):
            line, = [line for line in lines if line.startswith(name + ' — ')]
            self.assertIn(reason, line)
            for label in labels:
                self.assertIn(label, line)
        self.assertIn('No inventory or associated records have been changed.', lines)
        self.assertNotIn('Fictional technician note', body['error'])
        self.assertNotIn('equipment-check.txt', body['error'])
        denied = self.preview(source, 403, actor=2)
        self.assertEqual(denied, {'error': 'forbidden'})
        self.assertEqual(self.dump(), before)

    def test_dependency_added_after_preview_is_rechecked_at_confirmation(self):
        draft = self.preview(exported_inventory())['draftId']
        self.assign_device()
        before = self.dump()
        rejected = self.confirm(draft, 400)
        self.assertEqual(rejected['code'], 'protected_devices')
        self.assertIn('Laptop — missing from the backup (Staff or Department assignment history)', rejected['error'])
        self.assertIn('No inventory or associated records have been changed.', rejected['error'])
        self.assertIn('Unknown or expired', self.confirm(draft, 400)['error'])
        self.assertEqual(self.dump(), before)

    def test_late_write_failure_rolls_back_retained_and_unprotected_rows(self):
        source, _, _ = self.operational_fixture()
        source['devices'].reverse()
        with sqlite3.connect(self.path) as db:
            db.execute("INSERT INTO inventory_devices VALUES('spare','Spare','{}',3,20)")
            db.execute('''
                CREATE TRIGGER import_late_failure BEFORE INSERT ON inventory_ip_allocations
                BEGIN SELECT RAISE(ABORT, 'fictional late write failure'); END
            ''')
        before = self.dump()
        self.assertEqual(self.confirm(self.preview(source)['draftId'], 503), {'error': 'database unavailable'})
        self.assertEqual(self.dump(), before)

    def test_access_point_choices_report_protected_conflicts_before_confirmation(self):
        self.assign_device()
        source = exported_inventory()
        source['devices'].append(dict(id='ap', name='Roof AP', type='Access Point', mountType='Rack Mounted',
                                      rackId='rack', rackPosition=2, rackUnits=1, primaryIp=''))
        source['racks'].append(dict(id='rack', name='Rack', heightU=42))
        before = self.dump()
        preview = self.preview(source)
        self.assertTrue(preview['review']['requiresAccessPointMountReview'])
        draft = preview['draftId']
        status, body, _ = self.request('/api/import/access-point-choices', method='POST',
                                      payload={'draftId': draft, 'choices': ['Wall Mounted']})
        self.assertEqual(status, 400, body)
        self.assertEqual(body['code'], 'protected_devices')
        self.assertIn('Laptop — missing from the backup', body['error'])
        self.assertIn('Unknown or expired', self.confirm(draft, 400)['error'])
        self.assertEqual(self.dump(), before)
