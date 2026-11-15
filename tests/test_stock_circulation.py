"""Real stock operations preserve identities, quantities, history and privacy."""
import concurrent.futures
import copy
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend import schema
from backend.permissions import can_access
from backend.request_auth import csrf_for_session
from backend.stock_intake import receive_stock, stock_item
from backend.stock_circulation import issue_stock, read_stock_issues, stock_recipients
from test_stock_intake import receipt_payload
import test_stock_intake as intake_fixture
import test_feature_settings_http as feature_http


def issue_payload(connection, identity, **overrides):
    item=stock_item(connection,identity)
    return dict(dict(operationId=uuid.uuid4().hex,stockItemId=identity,version=item['version'],
        quantity=1,recipientKind='staff',recipientId='person',issuedOn='2026-11-15',note=''),**overrides)


class StockCirculationTests(unittest.TestCase):
    def setUp(self):
        intake_fixture.StockIntakeTests.setUp(self)
        schema.initialise_database(self.db)

    def receipt(self, quantity=10, *, individual=False, ready=None, model="Display"):
        ready=quantity if ready is None else ready
        payload=receipt_payload()
        payload['item']['model']=model
        payload.update(quantity=quantity,readyQuantity=ready,
            checks=dict(itemsChecked=ready>0,conditionChecked=ready>0))
        if individual:
            payload['item']['trackingMode']='individual'
        return receive_stock(self.db,1,self.token,payload)['stockItemId']

    def issue(self, identity, **values):
        return issue_stock(self.db,1,self.token,issue_payload(self.db,identity,**values))

    def unchanged(self, exception, operation):
        before=tuple(self.db.iterdump())
        with self.assertRaises(exception):
            operation()
        self.assertEqual(tuple(self.db.iterdump()),before)

    def test_quantity_issues_keep_original_records_and_distinct_outstanding_references(self):
        identity=self.receipt()
        original=self.db.execute("SELECT * FROM it_asset_stock_movements WHERE kind='received'").fetchall()
        records={table:self.db.execute('SELECT * FROM '+table).fetchall() for table in
                 ('accounts','roles','role_grants','account_roles','account_sessions','staff_members','departments','inventory_devices')}
        self.issue(identity,quantity=3)
        self.issue(identity,quantity=2,recipientKind='department',recipientId='department')
        item=stock_item(self.db,identity)
        self.assertEqual(item['balances']['physicallyHeld'],5)
        self.assertEqual(item['balances']['readyToIssue'],5)
        issues=read_stock_issues(self.db,1)['issues']
        self.assertEqual([row['outstanding'] for row in issues],[2,3])
        self.assertEqual(issues[0]['departmentId'],'department')
        self.assertEqual(issues[1]['staffId'],'person')
        self.assertNotEqual(issues[0]['id'],issues[1]['id'])
        self.assertEqual(self.db.execute("SELECT * FROM it_asset_stock_movements WHERE kind='received'").fetchall(),original)
        for table,before in records.items():
            self.assertEqual(self.db.execute('SELECT * FROM '+table).fetchall(),before,table)

    def test_individual_issue_retains_selected_identity_and_optional_identifiers(self):
        identity=self.receipt(1,individual=True)
        item=stock_item(self.db,identity)
        unit=item['units'][0]['id']
        self.issue(identity,stockUnitIds=[unit])
        current=stock_item(self.db,identity)
        self.assertEqual(current['units'][0]['id'],unit)
        self.assertFalse(current['units'][0]['held'])
        self.assertIsNone(current['units'][0]['serialNumber'])
        self.assertEqual(read_stock_issues(self.db,1)['issues'][0]['stockUnitId'],unit)
        self.unchanged(ValueError,lambda:self.issue(identity,stockUnitIds=[unit]))
        self.assertEqual(self.db.execute('SELECT count(*) FROM inventory_devices').fetchone(),(0,))

    def test_only_the_selected_ready_balance_can_be_issued(self):
        identity=self.receipt(10,ready=3)
        self.receipt(100,model="Other Equipment")
        for quantity in (0,-1,1.5,True,4,9007199254740992):
            self.unchanged(ValueError,lambda:self.issue(identity,quantity=quantity))
        self.issue(identity,quantity=3)
        self.unchanged(ValueError,lambda:self.issue(identity))
        self.assertEqual(stock_item(self.db,identity)['balances']['awaitingChecks'],7)

    def test_minimum_recipient_picker_does_not_grant_directory_or_devices_access(self):
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        for kind in ('staff','department'):
            choices=stock_recipients(self.db,2,kind=kind)
            self.assertTrue(choices)
            self.assertEqual(set(choices[0]),{'id','label','kind'})
        self.assertFalse(can_access(self.db,2,'Staff Members'))
        self.assertFalse(can_access(self.db,2,'Devices'))
        identity=self.receipt()
        issue_stock(self.db,2,'a'*64,issue_payload(self.db,identity))
        self.assertEqual(read_stock_issues(self.db,2)['issues'][0]['actor'],'Fictional Reader')

    def test_inactive_and_archived_recipients_are_rechecked(self):
        identity=self.receipt()
        self.db.execute("UPDATE staff_members SET active=0 WHERE id='person'")
        self.db.execute("UPDATE departments SET archived=1 WHERE id='department'")
        self.db.commit()
        self.assertNotIn('person',[r['id'] for r in stock_recipients(self.db,1)])
        self.assertEqual(stock_recipients(self.db,1,kind='department'),[])
        self.unchanged(ValueError,lambda:self.issue(identity))
        self.unchanged(ValueError,lambda:self.issue(identity,recipientKind='department',recipientId='department'))

    def test_retries_are_idempotent_but_stale_or_changed_requests_fail(self):
        identity=self.receipt()
        payload=issue_payload(self.db,identity,quantity=2)
        stale=issue_payload(self.db,identity)
        first=issue_stock(self.db,1,self.token,payload)
        before=tuple(self.db.iterdump())
        self.assertEqual(issue_stock(self.db,1,self.token,payload),first)
        self.assertEqual(tuple(self.db.iterdump()),before)
        self.unchanged(FileExistsError,lambda:issue_stock(self.db,1,self.token,dict(payload,quantity=3)))
        self.unchanged(FileExistsError,lambda:issue_stock(self.db,1,self.token,stale))

    def test_audit_failure_rolls_back_entries_and_header(self):
        identity=self.receipt()
        with patch('backend.stock_circulation.record_actor_event',side_effect=RuntimeError('Injected audit failure')):
            self.unchanged(RuntimeError,lambda:self.issue(identity,quantity=4))

    def test_read_only_mfa_revocation_and_feature_off_deny_operations(self):
        identity=self.receipt()
        self.unchanged(PermissionError,lambda:issue_stock(self.db,2,'a'*64,issue_payload(self.db,identity)))
        self.unchanged(PermissionError,lambda:stock_recipients(self.db,2))
        self.db.execute('UPDATE accounts SET mfa_confirmed=0 WHERE id=1')
        self.db.commit()
        self.unchanged(PermissionError,lambda:self.issue(identity))
        self.db.execute('UPDATE accounts SET mfa_confirmed=1 WHERE id=1')
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        self.unchanged(PermissionError,lambda:self.issue(identity))
        self.unchanged(PermissionError,lambda:read_stock_issues(self.db,1))
        self.unchanged(PermissionError,lambda:stock_recipients(self.db,1))

    def test_concurrent_technicians_cannot_double_issue_available_stock(self):
        identity=self.receipt()
        original=issue_payload(self.db,identity,quantity=7)
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'stock.sqlite3'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def issue(_):
                with sqlite3.connect(path,timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    try:
                        issue_stock(db,1,self.token,dict(original,operationId=uuid.uuid4().hex))
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(issue,range(2))),[False,True])
            with sqlite3.connect(path) as db:
                self.assertEqual(stock_item(db,identity)['balances']['readyToIssue'],3)
                self.assertEqual(read_stock_issues(db,1)['issues'][0]['outstanding'],7)
                self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(),[])


class StockCirculationHttpTests(unittest.TestCase):
    setUp=feature_http.FeatureSettingsHttpTests.setUp
    tearDown=feature_http.FeatureSettingsHttpTests.tearDown
    request=feature_http.FeatureSettingsHttpTests.request
    post=feature_http.FeatureSettingsHttpTests.post

    def test_issue_routes_use_existing_session_csrf_and_narrow_picker(self):
        from backend.http_security import COOKIE_NAME
        self.assertEqual(self.request('/api/it-assets/issues')[0],401)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
            db.execute("INSERT INTO staff_members(id,first_name) VALUES('http-recipient','Fictional Recipient')")
        with patch('backend.server.PUBLIC_ORIGIN','https://caffoot.example'):
            payload=receipt_payload();payload.update(readyQuantity=10,checks=dict(itemsChecked=True,conditionChecked=True))
            status,result=self.post('/api/it-assets/receive',payload,self.token,csrf_for_session(self.token))
            self.assertEqual(status,200,result)
            with sqlite3.connect(self.path) as db:
                recipient=db.execute('SELECT id FROM staff_members LIMIT 1').fetchone()[0]
                payload=issue_payload(db,result['stockItemId'],recipientId=recipient)
            self.assertEqual(self.post('/api/it-assets/issue',payload,self.token,None)[0],403)
            status,result=self.post('/api/it-assets/issue',payload,self.token,csrf_for_session(self.token))
            self.assertEqual(status,200,result)
        status,raw,_=self.request('/api/it-assets/recipients?kind=staff',COOKIE_NAME+'='+self.token)
        self.assertEqual(status,200,raw)
        self.assertEqual(set(json.loads(raw)['recipients'][0]),{'id','kind','label'})
        status,raw,_=self.request('/api/it-assets/issues',COOKIE_NAME+'='+self.token)
        self.assertEqual(status,200,raw)
        self.assertEqual(json.loads(raw)['issues'][0]['outstanding'],1)
