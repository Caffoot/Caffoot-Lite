"""Schema-only checks; no application inventory or compatibility claims."""
import sqlite3
import tempfile
import unittest
from pathlib import Path

from backend.schema import initialise_database, SCHEMA_VERSION


class SchemaTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "test.sqlite3"
        self.connection = sqlite3.connect(self.path)
        self.connection.execute("PRAGMA foreign_keys=ON")

    def tearDown(self):
        self.connection.close()
        self.temp.cleanup()

    def test_initialisation_is_repeatable(self):
        initialise_database(self.connection)
        initialise_database(self.connection)
        versions = [row[0] for row in self.connection.execute(
            "SELECT version FROM schema_migrations ORDER BY version"
        )]
        self.assertEqual(versions, list(range(1, SCHEMA_VERSION + 1)))

    def test_v2_0_1_accounts_upgrade_to_optional_profiles_without_changes(self):
        """Migration adds a child table without rebuilding logins or MFA records."""
        self.connection.execute("CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY)")
        for version in range(1, 8):
            self.connection.execute("INSERT INTO schema_migrations(version) VALUES (?)",
                                    (version,))
        self.connection.execute("""
            CREATE TABLE accounts (
                id INTEGER PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT,
                is_admin INTEGER, mfa_secret TEXT, mfa_confirmed INTEGER,
                active INTEGER
            )
        """)
        self.connection.execute("""
            INSERT INTO accounts VALUES (7,'existing','unchanged_hash',1,'mfa-key',1,1)
        """)
        self.connection.commit()
        initialise_database(self.connection)
        self.assertEqual(self.connection.execute(
            "SELECT * FROM accounts WHERE id=7").fetchone(),
            (7, "existing", "unchanged_hash", 1, "mfa-key", 1, 1))
        self.connection.execute("""
            INSERT INTO account_profiles (account_id,display_name)
            VALUES (7,'Someone')
        """)
        self.connection.commit()
        initialise_database(self.connection)
        self.assertEqual(self.connection.execute(
            "SELECT display_name FROM account_profiles WHERE account_id=7"
        ).fetchone()[0],"Someone")
        self.connection.execute("DELETE FROM accounts WHERE id=7")
        self.connection.commit()
        self.assertIsNone(self.connection.execute(
            "SELECT * FROM account_profiles WHERE account_id=7").fetchone())

    def test_reject_newer_database_without_downgrade(self):
        initialise_database(self.connection)
        self.connection.execute(
            "INSERT INTO schema_migrations(version) VALUES (999)"
        )
        self.connection.commit()
        with self.assertRaisesRegex(RuntimeError, "newer"):
            initialise_database(self.connection)
        self.assertEqual(
            self.connection.execute(
                "SELECT count(*) FROM schema_migrations WHERE version=999"
            ).fetchone()[0], 1
        )

    def test_device_identity_and_json_constraints(self):
        initialise_database(self.connection)
        self.connection.execute(
            "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
            ("one", "LAB-01", '{"id":"one"}', 0)
        )
        with self.assertRaises(sqlite3.IntegrityError):
            self.connection.execute(
                "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                ("two", "lab-01", '{"id":"two"}', 1)
            )
        with self.assertRaises(sqlite3.IntegrityError):
            self.connection.execute(
                "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                ("three", "LAB-03", "{invalid", 2)
            )


if __name__ == "__main__":
    unittest.main()
