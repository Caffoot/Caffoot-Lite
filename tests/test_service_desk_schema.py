"""Exercise the Service Desk migration and relationships in SQLite."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from backend import schema
from backend.service_desk_schema import DEFAULT_TICKET_CATEGORIES


def open_database(path=':memory:'):
    connection = sqlite3.connect(path)
    connection.execute('PRAGMA foreign_keys=ON')
    return connection


def insert_ticket(connection, device_id='host'):
    return connection.execute("""
        INSERT INTO service_desk_tickets
          (device_id,created_by,created_by_label,category_id,category_label,
           subject,description,created_at,updated_at)
        VALUES(?,1,'Technician',1,'Access Permissions / Folder Access',
               'Cannot open folder','An existing shared folder fails','2026-11-23','2026-11-23')
    """, (device_id,)).lastrowid


class ServiceDeskSchemaTests(unittest.TestCase):
    def setUp(self):
        self.connection = open_database()
        self.addCleanup(self.connection.close)
        with patch.object(schema, 'SCHEMA_VERSION', 24):
            schema.initialise_database(self.connection)
        self.connection.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('host','Host','{}',0)")
        self.connection.commit()

    def test_upgrade_and_repeat_start_preserve_equipment_and_categories(self):
        self.connection.execute("INSERT INTO staff_members(first_name,last_name) VALUES('Asha','Jones')")
        self.connection.execute("INSERT INTO suppliers(name,name_key,website,description) VALUES('Supplier','supplier','','')")
        self.connection.execute("INSERT INTO device_lifecycle(device_id,purchase_date) VALUES('host','2026-11-20')")
        self.connection.commit()
        schema.initialise_database(self.connection)
        self.assertEqual(self.connection.execute('SELECT max(version) FROM schema_migrations').fetchone(), (29,))
        self.assertEqual(self.connection.execute('SELECT name FROM service_desk_categories ORDER BY id').fetchall(),
                         [(name,) for name in DEFAULT_TICKET_CATEGORIES])
        ticket = insert_ticket(self.connection)
        self.connection.execute("UPDATE service_desk_categories SET name='Folder Access' WHERE id=1")
        self.connection.commit()
        before = tuple(self.connection.iterdump())
        schema.initialise_database(self.connection)
        self.assertEqual(tuple(self.connection.iterdump()), before)
        self.assertEqual(self.connection.execute(
            'SELECT status,priority,technician_id,category_label FROM service_desk_tickets WHERE id=?',
            (ticket,)).fetchone(), ('Open', 'Medium', None, DEFAULT_TICKET_CATEGORIES[0]))
        self.assertFalse(self.connection.execute('PRAGMA foreign_key_check').fetchall())

    def test_software_upgrade_preserves_existing_tickets_and_history(self):
        with patch.object(schema, 'SCHEMA_VERSION', 25):
            schema.initialise_database(self.connection)
        ticket = insert_ticket(self.connection)
        self.connection.execute("""
            INSERT INTO service_desk_events(ticket_id,kind,actor_id,actor_label,happened_at,
                                             employee_visible,details)
            VALUES(?, 'Created', 1, 'Technician', '2026-11-23', 1, '{}')
        """, (ticket,))
        self.connection.commit()
        schema.initialise_database(self.connection)
        self.assertEqual(self.connection.execute(
            'SELECT id,category_label,affected_software FROM service_desk_tickets'
        ).fetchone(), (ticket, DEFAULT_TICKET_CATEGORIES[0], None))
        self.assertEqual(self.connection.execute(
            'SELECT ticket_id,kind,actor_label FROM service_desk_events'
        ).fetchone(), (ticket, 'Created', 'Technician'))
        self.assertFalse(self.connection.execute('PRAGMA foreign_key_check').fetchall())

    def test_reporting_upgrade_keeps_legacy_attempts_without_a_duration(self):
        with patch.object(schema, 'SCHEMA_VERSION', 26):
            schema.initialise_database(self.connection)
        ticket = insert_ticket(self.connection)
        event = self.connection.execute("""
            INSERT INTO service_desk_events(ticket_id,kind,actor_id,actor_label,happened_at,employee_visible,details)
            VALUES(?, 'Closed', 1, 'Technician', '2026-11-23T10:00:00.000000Z', 1, '{}')
        """, (ticket,)).lastrowid
        note = self.connection.execute("""
            INSERT INTO service_desk_messages(ticket_id,kind,actor_id,actor_label,created_at,employee_visible,body)
            VALUES(?, 'Resolution Note', 1, 'Technician', '2026-11-23T10:00:00.000000Z', 1, 'Fixed.')
        """, (ticket,)).lastrowid
        self.connection.execute("""
            INSERT INTO service_desk_closures(ticket_id,closed_event_id,resolution_message_id) VALUES(?,?,?)
        """, (ticket, event, note))
        self.connection.commit()
        schema.initialise_database(self.connection)
        self.assertEqual(self.connection.execute("""
            SELECT ticket_id,closed_event_id,resolution_message_id,resolution_working_seconds
            FROM service_desk_closures
        """).fetchone(), (ticket, event, note, None))
        self.assertEqual(self.connection.execute('SELECT count(*) FROM service_desk_calendars').fetchone(), (0,))
        self.assertFalse(self.connection.execute('PRAGMA foreign_key_check').fetchall())

    def test_failed_upgrade_rolls_back_tables_and_version(self):
        def authorise(action, first, second, database, trigger):
            if action == sqlite3.SQLITE_CREATE_TRIGGER and first == 'service_desk_ticket_identity_update':
                return sqlite3.SQLITE_DENY
            return sqlite3.SQLITE_OK

        before = tuple(self.connection.iterdump())
        self.connection.set_authorizer(authorise)
        with self.assertRaises(sqlite3.DatabaseError):
            schema.initialise_database(self.connection)
        self.connection.set_authorizer(None)
        self.assertEqual(tuple(self.connection.iterdump()), before)

    def test_unknown_existing_grant_cannot_become_active_after_upgrade(self):
        self.connection.execute("INSERT INTO accounts(id,username,password_hash) VALUES(1,'staff','hash')")
        self.connection.execute("INSERT INTO account_permission_overrides VALUES(1,'Service Desk','edit')")
        self.connection.commit()
        with self.assertRaisesRegex(RuntimeError, 'pre-existing Service Desk grants'):
            schema.initialise_database(self.connection)
        self.assertEqual(self.connection.execute('SELECT max(version) FROM schema_migrations').fetchone(), (24,))

    def test_equipment_is_required_real_and_immutable(self):
        schema.initialise_database(self.connection)
        for device_id in ('missing', None):
            with self.subTest(device_id=device_id), self.assertRaises(sqlite3.IntegrityError):
                insert_ticket(self.connection, device_id)
        ticket = insert_ticket(self.connection)
        with self.assertRaises(sqlite3.IntegrityError):
            self.connection.execute("DELETE FROM inventory_devices WHERE id='host'")
        with self.assertRaisesRegex(sqlite3.IntegrityError, 'original assignment'):
            self.connection.execute("UPDATE service_desk_tickets SET device_id='other' WHERE id=?", (ticket,))

    def test_parallel_writes_get_distinct_ticket_ids(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'tickets.sqlite'
            with open_database(path) as connection:
                schema.initialise_database(connection)
                connection.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('host','Host','{}',0)")
            connection.close()

            def create_ticket():
                connection = open_database(path)
                try:
                    with connection:
                        return insert_ticket(connection)
                finally:
                    connection.close()

            with ThreadPoolExecutor(max_workers=4) as executor:
                ids = list(executor.map(lambda _: create_ticket(), range(8)))
            self.assertEqual(len(set(ids)), 8)
