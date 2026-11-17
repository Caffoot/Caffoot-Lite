"""Focused reporting, mixed-stock privacy and role-upgrade acceptance checks."""
from datetime import date
import json
import sqlite3
import unittest

from backend import schema
from backend.role_policy import evaluate_role_policy
from backend.stock_reporting import read_stock_report
from backend.stock_intake import read_stock, stock_item, update_stock_readiness
from backend.stock_circulation import write_off_stock
from backend.stock_corrections import save_stock_correction
from backend.device_stock import register_stock_device
from test_device_stock import registration_payload
from test_stock_intake import readiness_payload
import test_stock_circulation as circulation_fixture
from test_stock_circulation import writeoff_payload, return_payload
from test_stock_corrections import correction_payload
import test_feature_settings_http as feature_http
from backend.http_security import COOKIE_NAME


class StockReportingTests(unittest.TestCase):
    setUp = circulation_fixture.StockCirculationTests.setUp
    receipt = circulation_fixture.StockCirculationTests.receipt
    issue = circulation_fixture.StockCirculationTests.issue
    outstanding = circulation_fixture.StockCirculationTests.outstanding
    return_equipment = circulation_fixture.StockCirculationTests.return_equipment
    legacy_device = circulation_fixture.StockCirculationTests.legacy_device

    def report(self, **kwargs):
        return read_stock_report(self.db, 1, today=date(2026, 11, 16), **kwargs)

    def test_mixed_registration_preserves_approved_warning_for_every_stock_reader(self):
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        self.db.commit()
        identity = self.receipt(category='Desktop', ready=10)
        registered = register_stock_device(self.db, 1, self.token, registration_payload(self.db, identity))
        update_stock_readiness(self.db, 1, self.token, readiness_payload(self.db, identity,
            readyQuantity=1, minimumStockLevel=1, reason='Recheck anonymous units'))
        before = tuple(self.db.iterdump())
        report = read_stock_report(self.db, 2)
        self.assertEqual(report['totals']['readyToIssue'], '1')
        self.assertEqual(report['totals']['physicallyHeld'], '10')
        self.assertEqual(report['totals']['itemsBelowMinimum'], '0')
        self.assertIsNone(report['classification'])
        self.assertFalse(report['canDrillAggregates'])
        self.assertFalse(any(row['kind'] == 'registered' for row in report['recentActivity']))
        self.assertNotIn(registered['deviceId'], json.dumps(report))
        self.assertNotIn(registered['stockUnitId'], json.dumps(report))
        for response in (read_stock(self.db, 2), read_stock(self.db, 2, identity)):
            self.assertNotIn(registered['stockUnitId'], json.dumps(response))
        self.assertEqual(self.report()['classification'], dict(unregistered='9', registered='1', individual='0'))
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.db.commit()
        self.assertIsNone(self.report()['classification'])
        self.assertEqual(self.report()['totals']['physicallyHeld'], '10')

    def test_thresholds_are_per_item_optional_quantity_only_and_strict(self):
        low = self.receipt(model='Low', ready=2)
        equal = self.receipt(model='Equal', ready=3)
        self.receipt(model='No Minimum', ready=0)
        self.receipt(1, model='Individual', individual=True)
        for identity in (low, equal):
            update_stock_readiness(self.db, 1, self.token, readiness_payload(self.db, identity, minimumStockLevel=3))
        report = self.report()
        self.assertEqual(report['totals']['itemsBelowMinimum'], '1')
        self.assertEqual([row['id'] for row in report['items'] if row['lowStock']], [low])

    def test_effective_quantities_business_dates_and_corrections_are_not_double_counted(self):
        identity = self.receipt(20, ready=10)
        original = self.db.execute("SELECT e.id FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id WHERE m.kind='received'").fetchone()[0]
        save_stock_correction(self.db, 1, self.token, correction_payload(self.db, original, 18))
        for happened in ('2026-11-16', '2026-10-18', '2026-10-17', '2026-08-19', '2026-08-18', '2026-11-17'):
            write_off_stock(self.db, 1, self.token, writeoff_payload(stock_item(self.db, identity), writtenOffOn=happened))
        short = self.report()
        long = self.report(days=90)
        self.assertEqual(short['start'], '2026-10-18')
        self.assertEqual(short['totals']['writtenOff'], '2')
        self.assertEqual(long['totals']['writtenOff'], '4')
        self.assertEqual(sum(int(row['counts']['received']) for row in short['movements']), 18)
        self.assertEqual(sum(int(row['counts']['written_off']) for row in long['movements']), 4)
        self.assertEqual(short['totals']['physicallyHeld'], '12')

    def test_issue_return_readiness_and_individual_stock_balance(self):
        identity = self.receipt(10, ready=8)
        self.receipt(1, individual=True, model='Individual')
        self.issue(identity, quantity=4)
        self.return_equipment(return_payload(self.outstanding(), quantityReturned=2, readyQuantity=1,
            checks=dict(cleanedWorking=True, dataPreparationConfirmed=False)))
        report = self.report()
        self.assertEqual({key: report['totals'][key] for key in ('physicallyHeld', 'readyToIssue', 'awaitingChecks', 'currentlyIssued')},
                         dict(physicallyHeld='9', readyToIssue='6', awaitingChecks='3', currentlyIssued='2'))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        self.db.commit()
        self.assertEqual(self.report()['classification']['individual'], '1')
        self.assertEqual(self.report(category='Monitor')['totals'], self.report()['totals'])
        for changes in (dict(days=7), dict(days=True), dict(category='Unknown')):
            with self.assertRaises(ValueError):
                self.report(**changes)

    def test_legacy_device_assignments_are_counted_once_without_identity_leaks(self):
        self.legacy_device()
        report = read_stock_report(self.db, 2)
        self.assertEqual(report['totals']['currentlyIssued'], '1')
        self.assertNotIn('canonical', json.dumps(report))
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        with self.assertRaises(PermissionError):
            self.report()

    def test_direct_handover_does_not_add_physical_issues_or_double_count_custody(self):
        from test_device_handovers import DeviceHandoverTests, handover_payload
        from backend.device_handovers import reassign_device
        fixture = DeviceHandoverTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        _, identity = fixture.stock_device()
        before = read_stock_report(fixture.db, 1)
        reassign_device(fixture.db, 1, fixture.token,
            handover_payload(fixture.db, identity, recipientKind='department', recipientId='department'))
        after = read_stock_report(fixture.db, 1)
        self.assertEqual(after['totals'], before['totals'])
        self.assertEqual(after['movements'], before['movements'])
        self.assertEqual(after['recentActivity'][0]['kind'], 'reassigned')



class StockRoleUpgradeTests(unittest.TestCase):
    def test_existing_configured_access_and_overrides_survive_upgrade_and_restart(self):
        from test_stock_intake import StockIntakeTests
        fixture = StockIntakeTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        db = fixture.db
        schema.initialise_database(db)
        # Reconstruct the role default at the verified pre-dashboard checkpoint.
        db.execute("DELETE FROM role_grants WHERE section='IT Assets'")
        db.execute('DELETE FROM schema_migrations WHERE version=20')
        role = db.execute("SELECT id FROM roles WHERE role_key='it_staff'").fetchone()[0]
        for identity, active, enrolled, level in ((10, 1, 1, None), (11, 0, 0, None),
                                                (12, 1, 0, 'read'), (13, 1, 1, 'edit'), (14, 1, 1, 'deny')):
            db.execute('INSERT INTO accounts(id,username,password_hash,active,mfa_confirmed,mfa_secret) VALUES(?,?,?,?,?,?)',
                       (identity, 'user'+str(identity), 'unused', active, enrolled, 'JBSWY3DPEHPK3PXP'))
            db.execute('INSERT INTO account_roles VALUES(?,?)', (identity, role))
            if level:
                db.execute("INSERT INTO account_permission_overrides VALUES(?,'IT Assets',?)", (identity, level))
        custom = db.execute("INSERT INTO roles(role_key,name) VALUES('reporting','Reporting')").lastrowid
        db.execute("INSERT INTO role_grants VALUES(?,'IT Assets','read')", (custom,))
        db.execute('INSERT INTO account_roles VALUES(10,?)', (custom,))
        before = {row[0]: evaluate_role_policy(db, row[0]) for row in db.execute('SELECT id FROM accounts')}
        overrides = db.execute('SELECT * FROM account_permission_overrides').fetchall()
        db.commit()
        schema.initialise_database(db)
        self.assertEqual(db.execute("SELECT level FROM role_grants WHERE role_id=? AND section='IT Assets'", (role,)).fetchone(), ('edit',))
        for identity, policy in before.items():
            self.assertEqual(evaluate_role_policy(db, identity), policy)
        for row in overrides:
            self.assertIn(row, db.execute('SELECT * FROM account_permission_overrides').fetchall())
        snapshot = tuple(db.iterdump())
        schema.initialise_database(db)
        self.assertEqual(tuple(db.iterdump()), snapshot)

    def test_fresh_defaults_do_not_assign_new_accounts_it_staff(self):
        from backend.permissions import create_user
        from test_stock_intake import StockIntakeTests
        fixture = StockIntakeTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        db = fixture.db
        schema.initialise_database(db)
        role = db.execute("SELECT id FROM roles WHERE role_key='it_staff'").fetchone()[0]
        self.assertEqual(dict(db.execute('SELECT section,level FROM role_grants WHERE role_id=?', (role,))),
            dict.fromkeys(('Devices', 'IPAM', 'Racks', 'IT Assets'), 'edit'))
        identity = create_user(db, 1, 'new-staff', 'test-password')
        self.assertEqual(evaluate_role_policy(db, identity).permissions, {})
        self.assertFalse(db.execute('SELECT 1 FROM account_roles WHERE account_id=? AND role_id=?', (identity, role)).fetchone())


class StockReportHttpTests(unittest.TestCase):
    setUp = feature_http.FeatureSettingsHttpTests.setUp
    tearDown = feature_http.FeatureSettingsHttpTests.tearDown
    request = feature_http.FeatureSettingsHttpTests.request

    def test_direct_endpoint_feature_access_session_and_filter_guards(self):
        endpoint = '/api/it-assets/report'
        cookie = COOKIE_NAME + '=' + self.token
        self.assertEqual(self.request(endpoint)[0], 401)
        self.assertEqual(self.request(endpoint, cookie)[0], 403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        status, raw, cache = self.request(endpoint+'?days=90', cookie)
        self.assertEqual(status, 200, raw)
        self.assertEqual(cache, 'no-store')
        self.assertEqual(json.loads(raw)['totals']['physicallyHeld'], '0')
        for query in ('days=7', 'days=30&days=90', 'category=Unknown', 'deviceId=hidden'):
            self.assertEqual(self.request(endpoint+'?'+query, cookie)[0], 400)
        for column in ('active', 'mfa_confirmed'):
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE accounts SET '+column+'=0 WHERE id=1')
            self.assertEqual(self.request(endpoint, cookie)[0], 401)
            with sqlite3.connect(self.path) as db:
                db.execute('UPDATE accounts SET '+column+'=1 WHERE id=1')
        with sqlite3.connect(self.path) as db:
            db.execute('DELETE FROM account_sessions')
        self.assertEqual(self.request(endpoint, cookie)[0], 401)
