"""Upgrade disposable copies of the published schema, never installation data."""
import itertools
import sqlite3
import unittest
from pathlib import Path
from unittest.mock import patch

from backend import schema
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user


class RoleMigrationTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript((Path(__file__).parent / "fixtures/schema-v10.sql").read_text())

    def tearDown(self):
        self.db.close()

    def populate_accounts(self):
        for number, (levels, admin, active, enrolled) in enumerate(itertools.product(
                itertools.product((None, "read", "edit"), repeat=3), (0, 1), (0, 1), (0, 1)), 1):
            self.db.execute(
                "INSERT INTO accounts(id,username,password_hash,is_admin,active,mfa_secret,mfa_confirmed) "
                "VALUES(?,?,?,?,?,?,?)",
                (number, f"account-{number}", f"preserved-hash-{number}", admin, active,
                 "JBSWY3DPEHPK3PXP", enrolled),
            )
            self.db.execute(
                "INSERT INTO account_profiles(account_id,first_name,email,email_verified) VALUES(?,?,?,1)",
                (number, f"Person {number}", f"person-{number}@example.test"),
            )
            for section, level in zip(("Devices", "IPAM", "Racks"), levels):
                if level:
                    self.db.execute("INSERT INTO account_permissions VALUES(?,?,?)", (number, section, level))
            self.db.execute("INSERT INTO account_sessions VALUES(?,?,9999,1)", (str(number), number))
        self.db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('device','Example','{}',0)")
        self.db.execute("INSERT INTO inventory_change_history(record_json) VALUES('{\"reason\":\"Preserved\"}')")
        self.db.execute("INSERT INTO account_email_proofs VALUES('proof',1,'verify','person-1@example.test',9999,'challenge',2)")
        self.db.execute("INSERT INTO account_email_attempts VALUES(1,'verify',1)")
        self.db.commit()

    def snapshot(self):
        tables = [row[0] for row in self.db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('schema_migrations','account_sessions')"
        )]
        return {table: self.db.execute(f'SELECT * FROM "{table}" ORDER BY rowid').fetchall() for table in tables}

    def test_all_legacy_combinations_preserve_data_and_missing_rows(self):
        self.populate_accounts()
        before = self.snapshot()
        schema.initialise_database(self.db)
        after = self.snapshot()
        for table, rows in before.items():
            self.assertEqual(after[table], rows, table)
        self.assertEqual(after["account_permission_overrides"], before["account_permissions"])
        self.assertEqual(len(after["account_roles"]), 216)
        self.assertEqual(after["roles"], [(1, "staff_member", "Staff Member", 1, 1)])
        self.assertEqual(after["role_grants"], [])
        self.assertEqual(self.db.execute("SELECT * FROM account_sessions").fetchall(), [])
        self.assertEqual(self.db.execute("PRAGMA foreign_key_check").fetchall(), [])
        self.db.execute("INSERT INTO account_sessions VALUES('new',1,9999,2)")
        self.db.commit()
        schema.initialise_database(self.db)
        self.assertEqual(self.snapshot(), after)
        self.assertEqual(self.db.execute("SELECT token_hash FROM account_sessions").fetchall(), [("new",)])

    def test_failure_after_session_revocation_rolls_back_entire_upgrade(self):
        self.populate_accounts()
        before = list(self.db.iterdump())
        verify = schema.verify_role_migration

        def reject_upgrade(*args):
            verify(*args)
            self.assertEqual(self.db.execute("SELECT * FROM account_sessions").fetchall(), [])
            raise RuntimeError("Injected failure")

        with patch.object(schema, "verify_role_migration", side_effect=reject_upgrade):
            with self.assertRaisesRegex(RuntimeError, "Injected"):
                schema.initialise_database(self.db)
        self.assertEqual(list(self.db.iterdump()), before)
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute("SELECT max(version) FROM schema_migrations").fetchone()[0], 11)

    def test_corrupt_mapping_or_baseline_fails_before_commit(self):
        self.populate_accounts()
        before = list(self.db.iterdump())
        verify = schema.verify_role_migration

        def corrupt_mapping(connection, accounts, grants):
            connection.execute("DELETE FROM account_permission_overrides")
            verify(connection, accounts, grants)

        with patch.object(schema, "verify_role_migration", side_effect=corrupt_mapping):
            with self.assertRaisesRegex(RuntimeError, "preserve"):
                schema.initialise_database(self.db)
        self.assertEqual(list(self.db.iterdump()), before)

    def test_role_constraints_and_foreign_keys(self):
        schema.initialise_database(self.db)
        invalid = (
            "UPDATE roles SET enabled=0 WHERE role_key='staff_member'",
            "UPDATE roles SET name='Staff' WHERE role_key='staff_member'",
            "DELETE FROM roles WHERE role_key='staff_member'",
            "INSERT INTO roles(role_key,name,is_builtin) VALUES('other','Other',1)",
            "INSERT INTO roles(role_key,name) VALUES('bad-key','Invalid')",
            "INSERT INTO roles(role_key,name) VALUES('duplicate','staff member')",
            "INSERT INTO role_grants VALUES(1,'Devices','read')",
            "INSERT INTO account_roles VALUES(999,1)",
            "INSERT INTO role_grants VALUES(999,'Devices','read')",
            "INSERT INTO account_permission_overrides VALUES(999,'Devices','deny')",
        )
        for statement in invalid:
            with self.subTest(statement=statement), self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(statement)
        self.db.execute("INSERT INTO roles(role_key,name) VALUES('support','Support')")
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE roles SET role_key='renamed' WHERE role_key='support'")

    def test_bootstrap_and_ordinary_creation_assign_only_staff(self):
        schema.initialise_database(self.db)
        owner, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, owner, code_at(secret, 59), timestamp=59)
        user = create_user(self.db, owner, "staff", "password")
        self.assertEqual(self.db.execute("SELECT * FROM account_roles ORDER BY account_id").fetchall(), [(owner, 1), (user, 1)])
        self.assertEqual(self.db.execute("SELECT * FROM account_permission_overrides").fetchall(), [])

    def test_creation_failure_does_not_leave_partial_accounts(self):
        schema.initialise_database(self.db)
        with patch("backend.accounts.assign_staff_member", side_effect=RuntimeError("Unavailable")):
            with self.assertRaises(RuntimeError):
                bootstrap_first_admin(self.db, "owner", "password")
        self.assertEqual(self.db.execute("SELECT * FROM accounts").fetchall(), [])
        owner, secret = bootstrap_first_admin(self.db, "owner", "password")
        confirm_admin_mfa(self.db, owner, code_at(secret, 59), timestamp=59)
        before = list(self.db.iterdump())
        with patch("backend.permissions.assign_staff_member", side_effect=RuntimeError("Unavailable")):
            with self.assertRaises(RuntimeError):
                create_user(self.db, owner, "staff", "password", {
                    "firstName": "Example", "lastName": "Person", "displayName": "Example", "email": "",
                })
        self.assertEqual(list(self.db.iterdump()), before)
