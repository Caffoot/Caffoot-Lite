"""Schema 20 upgrade and Supplier feature/role boundaries."""
import sqlite3
import unittest
from unittest.mock import patch

from backend import schema
from backend.permissions import can_access
from backend.supplier_schema import INITIAL_CATEGORIES


class SupplierSchemaTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.addCleanup(self.db.close)
        self.db.execute('PRAGMA foreign_keys=ON')

    def test_upgrade_retains_existing_choices_grants_and_inventory(self):
        with patch.object(schema, 'SCHEMA_VERSION', 20):
            schema.initialise_database(self.db)
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_confirmed,mfa_secret) "
                        "VALUES(1,'editor','hash',1,'secret')")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(1,'IT Assets','edit')")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(1,'Devices','deny')")
        self.db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('a','Host','{}',0)")
        self.db.commit()
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (21,))
        self.assertEqual(self.db.execute('SELECT id,name FROM inventory_devices').fetchall(), [('a','Host')])
        self.assertEqual(self.db.execute('SELECT section,level FROM account_permission_overrides ORDER BY section').fetchall(),
                         [('Devices','deny'),('IT Assets','edit')])
        self.assertTrue(can_access(self.db, 1, 'IT Assets', edit=True))
        self.assertFalse(can_access(self.db, 1, 'Suppliers'))
        self.assertEqual(self.db.execute("SELECT enabled FROM organisation_features WHERE feature='suppliers'").fetchone(), (0,))

    def test_defaults_and_role_gate_survive_reinitialisation(self):
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT name FROM supplier_categories ORDER BY id').fetchall(),
                         [(name,) for name in INITIAL_CATEGORIES])
        self.db.execute("UPDATE supplier_categories SET name='Equipment', name_key='equipment',archived=1 WHERE id=1")
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='suppliers'")
        self.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_confirmed,mfa_secret) "
                        "VALUES(1,'reader','hash',1,'secret')")
        self.db.commit()
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT name,archived FROM supplier_categories WHERE id=1').fetchone(),
                         ('Equipment',1))
        self.assertFalse(can_access(self.db, 1, 'Suppliers'))
        self.db.execute("INSERT INTO account_permission_overrides VALUES(1,'Suppliers','read')")
        self.assertTrue(can_access(self.db, 1, 'Suppliers'))
        self.assertFalse(can_access(self.db, 1, 'Suppliers', edit=True))
        self.assertFalse(can_access(self.db, 1, 'Devices'))
        self.assertFalse(can_access(self.db, 1, 'IT Assets'))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='suppliers'")
        self.assertFalse(can_access(self.db, 1, 'Suppliers'))

    def test_unknown_pre_upgrade_supplier_grant_fails_closed(self):
        with patch.object(schema, 'SCHEMA_VERSION', 20):
            schema.initialise_database(self.db)
        self.db.execute("INSERT INTO accounts(id,username,password_hash) VALUES(1,'reader','hash')")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(1,'Suppliers','read')")
        self.db.commit()
        with self.assertRaisesRegex(RuntimeError, 'pre-existing Supplier grants'):
            schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT max(version) FROM schema_migrations').fetchone(), (20,))
