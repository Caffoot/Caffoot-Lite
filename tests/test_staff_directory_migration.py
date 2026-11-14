"""Staff upgrades retain login security, saved inventory and independent people."""
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch

from backend import schema
from backend.inventory import inspect_export, stage_inventory
from backend.permissions import create_user, delete_user, set_account_active
from backend.profiles import save_profile
from backend.role_policy import evaluate_role_policy
from backend.reset_inventory import reset_inventory
from enabled_inventory import enable_inventory_features
from test_inventory import fixture


class StaffDirectoryMigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / 'directory.sqlite3'
        self.db = sqlite3.connect(self.path)
        self.db.execute('PRAGMA foreign_keys=ON')
        self.addCleanup(self.db.close)
        with patch.object(schema, 'SCHEMA_VERSION', 13):
            schema.initialise_database(self.db)
        for account, username, admin, active, confirmed in (
                (1, 'owner', 1, 1, 1), (2, 'not-a-person-name', 0, 1, 0),
                (3, 'technician', 0, 1, 1), (4, 'disabled', 0, 0, 1),
                (5, 'profile-missing', 0, 1, 0)):
            self.db.execute(
                'INSERT INTO accounts(id,username,password_hash,is_admin,active,mfa_secret,mfa_confirmed) '
                'VALUES(?,?,?,?,?,?,?)',
                (account, username, 'unchanged-password-material', admin, active,
                 'TEST-ONLY-SECRET' if confirmed else None, confirmed))
            self.db.execute("INSERT INTO account_roles SELECT ?,id FROM roles WHERE role_key='staff_member'", (account,))
            self.db.execute('INSERT INTO account_sessions VALUES(?,?,?,?)',
                            ('session-' + str(account), account, 9999999999, 1))
        self.db.execute("INSERT INTO account_roles SELECT 3,id FROM roles WHERE role_key='it_staff'")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(3,'Devices','read')")
        self.db.execute("INSERT INTO account_permission_overrides VALUES(3,'Racks','deny')")
        self.db.execute("INSERT INTO account_profiles(account_id,first_name,last_name,display_name,email,email_verified) VALUES(2,'','', 'Display Is Not A Name','',0)")
        self.db.execute("INSERT INTO account_profiles(account_id,first_name,last_name,display_name,email,email_verified,photo_mime,photo_data) VALUES(3,'Alex','Example','Different Display','alex@example.test',1,'image/png',X'0102')")
        self.db.execute("INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at,challenge_id,attempts) VALUES('proof',3,'verify','alex@example.test',9999999999,'challenge',2)")
        self.db.commit()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))

    def rows(self, table):
        return self.db.execute(f'SELECT * FROM "{table}" ORDER BY rowid').fetchall()

    def snapshot(self):
        return {name: self.rows(name) for name, in self.db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name!='schema_migrations'")}

    def test_upgrade_preserves_every_existing_table_and_effective_policy(self):
        before = self.snapshot()
        policies = {account: evaluate_role_policy(self.db, account) for account in range(1, 6)}
        schema.initialise_database(self.db)
        after = self.snapshot()
        self.assertEqual(after.pop('departments'), [])
        staff = after.pop('staff_members')
        self.assertEqual(before, after)
        self.assertEqual(len(staff), 5)
        self.assertEqual(len({row[0] for row in staff}), 5)
        self.assertEqual(policies, {account: evaluate_role_policy(self.db, account) for account in range(1, 6)})
        for account in range(1, 6):
            self.assertEqual(self.db.execute(
                'SELECT first_name,last_name,email,department_id,job_title,telephone,location,active '
                'FROM staff_members WHERE account_id=?', (account,)).fetchone(),
                ('Alex', 'Example', 'alex@example.test', None, '', '', '', 1)
                if account == 3 else ('', '', '', None, '', '', '', 1))
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])

    def test_repeat_reopen_and_missing_marker_preserve_existing_links_and_blanks(self):
        schema.initialise_database(self.db)
        self.db.execute("INSERT INTO departments(id,name) VALUES('dept','Production')")
        self.db.execute("INSERT INTO staff_members(id,first_name,department_id) VALUES('no-login','Pat','dept')")
        self.db.execute("UPDATE staff_members SET first_name='Staff Choice',email='',department_id='dept' WHERE account_id=3")
        self.db.execute('DELETE FROM schema_migrations WHERE version=14')
        self.db.commit()
        before = self.snapshot()
        schema.initialise_database(self.db)
        schema.initialise_database(self.db)
        self.assertEqual(before, self.snapshot())
        with sqlite3.connect(self.path) as reopened:
            reopened.execute('PRAGMA foreign_keys=ON')
            schema.initialise_database(reopened)
            self.assertEqual(reopened.execute('SELECT * FROM staff_members ORDER BY rowid').fetchall(), before['staff_members'])

    def test_independent_staff_constraints_and_department_retention(self):
        schema.initialise_database(self.db)
        self.db.execute("INSERT INTO departments(id,name) VALUES('dept','Production')")
        self.db.execute("INSERT INTO staff_members(id,department_id) VALUES('no-login','dept')")
        self.db.execute("INSERT INTO staff_members(id) VALUES('another-no-login')")
        self.db.commit()
        invalid = (
            "INSERT INTO staff_members(id,account_id) VALUES('duplicate',1)",
            "INSERT INTO staff_members(id,account_id) VALUES('orphan',999)",
            "INSERT INTO staff_members(id,department_id) VALUES('missing-dept','missing')",
            "INSERT INTO staff_members(id) VALUES('no-login')",
            "INSERT INTO staff_members(id) VALUES('')",
            "INSERT INTO staff_members(id) VALUES(NULL)",
            "UPDATE staff_members SET active=2",
            "UPDATE staff_members SET active=0.5",
            "UPDATE staff_members SET first_name=NULL",
            "INSERT INTO departments(name) VALUES('production')",
            "INSERT INTO departments(name) VALUES('   ')",
            "UPDATE departments SET archived=0.5",
            "DELETE FROM departments WHERE id='dept'",
        )
        for statement in invalid:
            with self.subTest(statement=statement), self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(statement)
            self.db.rollback()
        self.db.execute("UPDATE departments SET archived=1 WHERE id='dept'")
        self.db.commit()
        self.assertEqual(self.db.execute("SELECT department_id FROM staff_members WHERE id='no-login'").fetchone(), ('dept',))

    def test_partial_backfill_keeps_valid_link_and_does_not_match_people_by_name(self):
        schema.initialise_database(self.db)
        self.db.execute('DELETE FROM schema_migrations WHERE version=14')
        self.db.execute('DELETE FROM staff_members WHERE account_id!=3')
        self.db.execute("UPDATE staff_members SET email='' WHERE account_id=3")
        self.db.execute("INSERT INTO staff_members(id,first_name,last_name) VALUES('unlinked','Alex','Example')")
        self.db.commit()
        retained = self.db.execute('SELECT * FROM staff_members WHERE account_id=3').fetchone()
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT * FROM staff_members WHERE account_id=3').fetchone(), retained)
        self.assertEqual(self.db.execute('SELECT account_id FROM staff_members WHERE account_id IS NOT NULL ORDER BY account_id').fetchall(), [(n,) for n in range(1, 6)])
        self.assertEqual(self.db.execute("SELECT account_id FROM staff_members WHERE id='unlinked'").fetchone(), (None,))
        self.assertEqual(len(self.rows('staff_members')), 6)

    def test_failure_after_schema_or_backfill_rolls_back_entire_upgrade(self):
        before = list(self.db.iterdump())
        for blocked_table in ('staff_members', 'schema_migrations'):
            def authorise(action, table, *rest):
                return (sqlite3.SQLITE_DENY if action == sqlite3.SQLITE_INSERT
                        and table == blocked_table else sqlite3.SQLITE_OK)
            self.db.set_authorizer(authorise)
            with self.subTest(blocked_table=blocked_table), self.assertRaises(sqlite3.DatabaseError):
                schema.initialise_database(self.db)
            self.db.set_authorizer(None)
            self.assertFalse(self.db.in_transaction)
            self.assertEqual(list(self.db.iterdump()), before)
        schema.initialise_database(self.db)
        self.assertEqual(len(self.rows('staff_members')), 5)

    def test_conflicting_preexisting_schema_fails_without_changes(self):
        self.db.execute('CREATE TABLE staff_members(id TEXT,account_id INTEGER)')
        self.db.executemany("INSERT INTO staff_members VALUES(?,1)", [('one',), ('two',)])
        self.db.commit()
        before = list(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError, 'incompatible table'):
            schema.initialise_database(self.db)
        self.assertEqual(list(self.db.iterdump()), before)

    def test_invalid_existing_link_fails_without_repairing_or_merging_people(self):
        schema.initialise_database(self.db)
        self.db.execute('DELETE FROM schema_migrations WHERE version=14')
        self.db.commit()
        self.db.execute('PRAGMA foreign_keys=OFF')
        self.db.execute('UPDATE staff_members SET account_id=999 WHERE account_id=1')
        self.db.commit()
        self.db.execute('PRAGMA foreign_keys=ON')
        before = list(self.db.iterdump())
        with self.assertRaisesRegex(RuntimeError, 'invalid relationships'):
            schema.initialise_database(self.db)
        self.assertEqual(list(self.db.iterdump()), before)

    def test_unknown_new_section_grants_cannot_silently_gain_access(self):
        for table, values in (
                ('role_grants', "2,'Staff Members','read'"),
                ('account_permission_overrides', "3,'IT Assets','edit'")):
            self.db.execute(f'INSERT INTO {table} VALUES({values})')
            self.db.commit()
            before = list(self.db.iterdump())
            with self.subTest(table=table), self.assertRaisesRegex(RuntimeError, 'pre-existing new-section grants'):
                schema.initialise_database(self.db)
            self.assertEqual(list(self.db.iterdump()), before)
            self.db.execute(f"DELETE FROM {table} WHERE section IN ('Staff Members','IT Assets')")
            self.db.commit()

    def test_account_profile_status_and_deletion_keep_staff_identity(self):
        schema.initialise_database(self.db)
        staff = self.db.execute('SELECT * FROM staff_members WHERE account_id=3').fetchone()
        save_profile(self.db, 3, dict(firstName='Changed', lastName='Name', displayName='', email='new@example.test'))
        self.assertEqual(self.db.execute('SELECT * FROM staff_members WHERE account_id=3').fetchone(), staff)
        set_account_active(self.db, 1, 3, False)
        self.assertEqual(self.db.execute('SELECT * FROM staff_members WHERE account_id=3').fetchone(), staff)
        before = list(self.db.iterdump())
        with patch('backend.permissions.record_actor_event', side_effect=RuntimeError('Audit failed')):
            with self.assertRaisesRegex(RuntimeError, 'Audit failed'):
                delete_user(self.db, 1, 3)
        self.assertEqual(list(self.db.iterdump()), before)
        delete_user(self.db, 1, 3)
        self.assertEqual(self.db.execute('SELECT * FROM staff_members WHERE id=?', (staff[0],)).fetchone(), (*staff[:-1], None))
        self.assertIsNone(self.db.execute('SELECT 1 FROM accounts WHERE id=3').fetchone())
        self.assertIsNone(self.db.execute('SELECT 1 FROM account_profiles WHERE account_id=3').fetchone())
        with self.assertRaisesRegex(ValueError, 'themselves'):
            delete_user(self.db, 1, 1)
        count = len(self.rows('staff_members'))
        user = create_user(self.db, 1, 'later-account', 'test-password')
        self.assertEqual(len(self.rows('staff_members')), count + 1)
        schema.initialise_database(self.db)
        self.assertEqual(self.db.execute('SELECT count(*) FROM staff_members WHERE account_id=?', (user,)).fetchone(), (1,))

    def test_concurrent_upgrade_creates_one_directory_record_per_account(self):
        barrier = threading.Barrier(2)
        def upgrade():
            with sqlite3.connect(self.path, timeout=10) as db:
                db.execute('PRAGMA foreign_keys=ON')
                barrier.wait(timeout=10)
                schema.initialise_database(db)
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            futures = [pool.submit(upgrade) for _ in range(2)]
            for future in futures:
                future.result(timeout=15)
        self.assertEqual(self.db.execute('SELECT account_id,count(*) FROM staff_members GROUP BY account_id ORDER BY account_id').fetchall(), [(n, 1) for n in range(1, 6)])

    def test_caller_transaction_is_not_committed_or_rolled_back(self):
        self.db.execute("UPDATE accounts SET username='pending' WHERE id=5")
        with self.assertRaises(sqlite3.OperationalError):
            schema.initialise_database(self.db)
        self.assertTrue(self.db.in_transaction)
        self.db.rollback()
        self.assertEqual(self.db.execute('SELECT username FROM accounts WHERE id=5').fetchone(), ('profile-missing',))

    def test_existing_inventory_import_and_clean_start_retain_directory(self):
        schema.initialise_database(self.db)
        enable_inventory_features(self.db)
        self.db.execute("INSERT INTO departments(id,name) VALUES('dept','Production')")
        self.db.execute("UPDATE staff_members SET department_id='dept' WHERE account_id=3")
        self.db.commit()
        directory = {table: self.rows(table) for table in ('staff_members', 'departments')}
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        self.assertEqual({table: self.rows(table) for table in directory}, directory)
        reset_inventory(self.db, 1)
        self.assertEqual({table: self.rows(table) for table in directory}, directory)
