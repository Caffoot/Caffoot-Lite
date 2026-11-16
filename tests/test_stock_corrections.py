"""Corrections preserve original facts and validate later stock and assignment history."""
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend.http_security import COOKIE_NAME
from backend.request_auth import csrf_for_session
from backend.stock_corrections import (stock_correction_context, preview_stock_correction,
    save_stock_correction)
from backend.stock_intake import stock_item, receive_stock, update_stock_readiness
from backend.stock_circulation import read_stock_issues, stock_movement_history, write_off_stock
import test_stock_circulation as circulation_fixture
from test_stock_circulation import return_payload, writeoff_payload
from test_stock_intake import receipt_payload, readiness_payload
import test_feature_settings_http as feature_http


def correction_payload(db, entry, quantity, **changes):
    return dict(dict(operationId=uuid.uuid4().hex, entryId=entry,
        version=stock_correction_context(db, 1, entry)['version'], correctedQuantity=quantity,
        reason='Delivery or allocation record checked'), **changes)


def preview_payload(payload):
    return {key: value for key, value in payload.items() if key != 'operationId'}


class StockCorrectionTests(unittest.TestCase):
    setUp = circulation_fixture.StockCirculationTests.setUp
    receipt = circulation_fixture.StockCirculationTests.receipt
    issue = circulation_fixture.StockCirculationTests.issue
    outstanding = circulation_fixture.StockCirculationTests.outstanding
    return_equipment = circulation_fixture.StockCirculationTests.return_equipment
    unchanged = circulation_fixture.StockCirculationTests.unchanged
    legacy_device = circulation_fixture.StockCirculationTests.legacy_device

    def entry(self, kind):
        return self.db.execute('''SELECT e.id FROM it_asset_stock_entries e
            JOIN it_asset_stock_movements m ON m.id=e.movement_id WHERE m.kind=? ORDER BY e.id DESC''', (kind,)).fetchone()[0]

    def correct(self, entry, quantity, **changes):
        return save_stock_correction(self.db, 1, self.token, correction_payload(self.db, entry, quantity, **changes))

    def blocked(self, entry, quantity, **changes):
        payload = correction_payload(self.db, entry, quantity, **changes)
        before = tuple(self.db.iterdump())
        preview = preview_stock_correction(self.db, 1, self.token, preview_payload(payload))
        self.assertFalse(preview['allowed'], preview)
        self.assertIn('Blocked', preview['message'])
        self.unchanged(ValueError, lambda: save_stock_correction(self.db, 1, self.token, payload))
        self.assertEqual(tuple(self.db.iterdump()), before)
        return preview

    def test_receipt_preview_is_read_only_and_save_preserves_every_original_fact(self):
        identity = self.receipt(10, ready=4)
        entry = self.entry('received')
        originals = {table: self.db.execute('SELECT * FROM '+table).fetchall() for table in
            ('it_asset_stock_movements', 'it_asset_stock_entries', 'accounts', 'device_assignments', 'inventory_devices')}
        payload = correction_payload(self.db, entry, 8)
        before = tuple(self.db.iterdump())
        preview = preview_stock_correction(self.db, 1, self.token, preview_payload(payload))
        self.assertTrue(preview['allowed'])
        self.assertEqual(preview['after']['balances'], dict(physicallyHeld=8, readyToIssue=4,
            awaitingChecks=4, awaitingPreparation=0, currentlyIssued=0, writtenOff=0))
        self.assertEqual(tuple(self.db.iterdump()), before)
        result = save_stock_correction(self.db, 1, self.token, payload)
        self.assertEqual(result['balances'], preview['after']['balances'])
        for table, rows in originals.items():
            self.assertEqual(self.db.execute('SELECT * FROM '+table+' LIMIT ?', (len(rows),)).fetchall(), rows, table)
        context = stock_correction_context(self.db, 1, entry)
        self.assertEqual((context['originalQuantity'], context['effectiveQuantity']), (10, 8))
        self.assertEqual(context['supplier'], 'Fictional Purchasing Supplier')
        self.assertEqual(context['history'][0]['actorId'], 1)
        self.assertEqual(context['history'][0]['reason'], payload['reason'])
        self.assertEqual(stock_item(self.db, identity)['balances']['physicallyHeld'], 8)
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])

    def test_receipt_cannot_remove_later_checked_or_registered_stock(self):
        self.receipt(10, ready=4)
        self.blocked(self.entry('received'), 3)

    def test_issue_corrections_keep_partial_returns_and_original_assignment_balances(self):
        identity = self.receipt()
        self.issue(identity, quantity=8)
        issue = self.entry('issued')
        self.return_equipment(return_payload(self.outstanding(), quantityReturned=5))
        self.blocked(issue, 4)
        result = self.correct(issue, 7)
        self.assertEqual(result['outstanding'], 2)
        record = read_stock_issues(self.db, 1)['issues'][0]
        self.assertEqual((record['quantity'], record['effectiveQuantity'], record['outstanding']), (8, 7, 2))
        self.assertEqual(stock_item(self.db, identity)['stateBalances']['currentlyIssued'], 2)

    def test_issue_cannot_consume_stock_that_arrived_after_the_issue(self):
        identity = self.receipt(5)
        self.issue(identity, quantity=4)
        issue = self.entry('issued')
        item = stock_item(self.db, identity)
        receipt = receipt_payload()
        del receipt['item']
        receipt.update(stockItemId=identity, configurationKey=item['configurationKey'])
        receive_stock(self.db, 1, self.token, receipt)
        self.blocked(issue, 6)

    def test_return_increase_and_decrease_preserve_each_later_disposition(self):
        identity = self.receipt()
        self.issue(identity, quantity=8)
        self.return_equipment(return_payload(self.outstanding(), quantityReturned=5, readyQuantity=3,
            writeOffQuantity=2, checks=dict(cleanedWorking=True, dataPreparationConfirmed=False), writeOffReason='Broken'))
        returned = self.entry('returned')
        self.blocked(returned, 3)
        self.blocked(returned, 9)
        result = self.correct(returned, 6)
        self.assertEqual(result['outstanding'], 2)
        self.assertEqual(result['balances']['awaitingPreparation'], 1)
        self.assertEqual(result['balances']['readyToIssue'], 5)
        self.assertEqual(result['balances']['writtenOff'], 2)

    def test_writeoff_reversal_changes_held_stock_without_a_fabricated_return(self):
        identity = self.receipt(10, ready=4)
        write_off_stock(self.db, 1, self.token, writeoff_payload(stock_item(self.db, identity), quantity=2, fromState='awaiting_checks'))
        written = self.entry('written_off')
        self.blocked(written, 7)
        result = self.correct(written, 1)
        self.assertEqual((result['balances']['physicallyHeld'], result['balances']['writtenOff']), (9, 1))
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_movements WHERE kind='returned'").fetchone()[0], 0)

    def test_issued_writeoff_correction_restores_only_real_outstanding_quantity(self):
        identity = self.receipt()
        self.issue(identity, quantity=5)
        source = self.outstanding()
        payload = writeoff_payload(stock_item(self.db, identity), quantity=2, fromState='issued')
        del payload['stockItemId']
        payload.update(issueEntryId=source['id'], version=source['version'])
        write_off_stock(self.db, 1, self.token, payload)
        result = self.correct(self.entry('written_off'), 1)
        self.assertEqual(result['outstanding'], 4)
        self.assertEqual(result['balances']['physicallyHeld'], 5)

    def test_later_preparation_reversals_are_replayed_in_publication_order(self):
        identity = self.receipt(10, ready=8)
        entry = self.entry('received')
        update_stock_readiness(self.db, 1, self.token, readiness_payload(self.db, identity, readyQuantity=4, reason='Recheck'))
        self.blocked(entry, 6)
        self.correct(entry, 9)
        self.assertEqual(stock_item(self.db, identity)['balances'], dict(physicallyHeld=9, readyToIssue=4, awaitingChecks=5))

    def test_repeated_corrections_always_link_the_original_and_previous_effective_value(self):
        self.receipt(10, ready=0)
        entry = self.entry('received')
        self.correct(entry, 8)
        self.correct(entry, 12)
        self.correct(entry, 10)
        context = stock_correction_context(self.db, 1, entry)
        self.assertEqual((context['originalQuantity'], context['effectiveQuantity']), (10, 10))
        self.assertEqual([(row['previousQuantity'], row['correctedQuantity']) for row in context['history']], [(12, 10), (8, 12), (10, 8)])
        facts = stock_movement_history(self.db, 1)
        self.assertEqual([(r['previousQuantity'], r['correctedQuantity']) for r in facts if r['kind']=='corrected'], [(12, 10), (8, 12), (10, 8)])

    def test_invalid_quantities_reasons_and_no_change_never_write(self):
        self.receipt(10, ready=0)
        entry = self.entry('received')
        for quantity in (0, -1, 1.5, True, '8', None, 9007199254740992, 10):
            with self.subTest(quantity=quantity):
                self.blocked(entry, quantity)
        for reason in ('', '   ', None, 42, 'x'*2001, '\x00'):
            with self.subTest(reason=reason):
                self.blocked(entry, 8, reason=reason)

    def test_stale_form_and_changed_idempotency_payload_are_rejected(self):
        self.receipt(10, ready=0)
        entry = self.entry('received')
        payload = correction_payload(self.db, entry, 8)
        stale = correction_payload(self.db, entry, 7)
        first = save_stock_correction(self.db, 1, self.token, payload)
        before = tuple(self.db.iterdump())
        self.assertEqual(save_stock_correction(self.db, 1, self.token, payload), first)
        self.assertEqual(tuple(self.db.iterdump()), before)
        self.unchanged(FileExistsError, lambda: save_stock_correction(self.db, 1, self.token, dict(payload, reason='Different')))
        self.unchanged(FileExistsError, lambda: save_stock_correction(self.db, 1, self.token, stale))
        self.unchanged(FileExistsError, lambda: preview_stock_correction(self.db, 1, self.token, preview_payload(stale)))

    def test_concurrent_corrections_accept_one_version_once(self):
        self.receipt(10, ready=0)
        payload = correction_payload(self.db, self.entry('received'), 8)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'stock.sqlite3'
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def save(_):
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute('PRAGMA foreign_keys=ON')
                    try:
                        save_stock_correction(db, 1, self.token, dict(payload, operationId=uuid.uuid4().hex))
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(save, range(2))), [False, True])

    def test_audit_failure_rolls_back_correction_and_compensation(self):
        self.receipt(10, ready=0)
        payload = correction_payload(self.db, self.entry('received'), 8)
        with patch('backend.stock_corrections.record_actor_event', side_effect=RuntimeError('Audit failure')):
            self.unchanged(RuntimeError, lambda: save_stock_correction(self.db, 1, self.token, payload))

    def test_original_and_correction_records_are_database_immutable(self):
        self.receipt(10, ready=0)
        self.correct(self.entry('received'), 8)
        for table in ('it_asset_stock_movements', 'it_asset_stock_entries'):
            for statement in ('UPDATE '+table+' SET id=id', 'DELETE FROM '+table):
                self.unchanged(sqlite3.IntegrityError, lambda: self.db.execute(statement))
                self.db.rollback()

    def test_individual_identity_and_canonical_device_quantities_cannot_be_fabricated(self):
        self.receipt(1, individual=True)
        self.blocked(self.entry('received'), 2)
        self.blocked(self.entry('received'), 0)
        self.legacy_device(assigned=False)
        from backend.stock_circulation import return_stock, canonical_device_choice
        source = canonical_device_choice(self.db, 'canonical')
        payload = return_payload(dict(id=1, version=source['version']))
        del payload['issueEntryId']
        payload.update(deviceId='canonical', physicalReturnConfirmed=True)
        return_stock(self.db, 1, self.token, payload)
        self.blocked(self.entry('returned'), 2)

    def test_read_edit_feature_mfa_and_session_safeguards(self):
        self.receipt(10, ready=0)
        payload = correction_payload(self.db, self.entry('received'), 8)
        for fn in (preview_stock_correction, save_stock_correction):
            body = preview_payload(payload) if fn == preview_stock_correction else payload
            self.unchanged(PermissionError, lambda: fn(self.db, 2, 'a'*64, body))
            self.unchanged(PermissionError, lambda: fn(self.db, 1, 'wrong', body))
        self.db.execute("UPDATE account_permission_overrides SET level='edit' WHERE account_id=2 AND section='IT Assets'")
        self.db.commit()
        self.assertTrue(preview_stock_correction(self.db, 2, 'a'*64, preview_payload(payload))['allowed'])
        for statement, restore in (("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'", "UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'"),
                                   ('UPDATE accounts SET mfa_confirmed=0 WHERE id=1', 'UPDATE accounts SET mfa_confirmed=1 WHERE id=1')):
            self.db.execute(statement)
            self.db.commit()
            self.unchanged(PermissionError, lambda: save_stock_correction(self.db, 1, self.token, payload))
            self.db.execute(restore)
            self.db.commit()


class StockCorrectionHttpTests(unittest.TestCase):
    setUp = feature_http.FeatureSettingsHttpTests.setUp
    tearDown = feature_http.FeatureSettingsHttpTests.tearDown
    request = feature_http.FeatureSettingsHttpTests.request
    post = feature_http.FeatureSettingsHttpTests.post

    def seed(self):
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            status, result = self.post('/api/it-assets/receive', receipt_payload(), self.token, csrf_for_session(self.token))
        self.assertEqual(status, 200, result)
        with sqlite3.connect(self.path) as db:
            entry = db.execute('SELECT id FROM it_asset_stock_entries LIMIT 1').fetchone()[0]
            return correction_payload(db, entry, 8)

    def test_protected_context_preview_save_and_idempotent_retry(self):
        payload = self.seed()
        status, raw, cache = self.request('/api/it-assets/corrections/'+str(payload['entryId']), COOKIE_NAME+'='+self.token)
        self.assertEqual((status, cache), (200, 'no-store'))
        self.assertEqual(json.loads(raw)['originalQuantity'], 10)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            status, preview = self.post('/api/it-assets/corrections/preview', preview_payload(payload), self.token, csrf_for_session(self.token))
            self.assertEqual(status, 200, preview)
            self.assertTrue(preview['allowed'])
            status, result = self.post('/api/it-assets/corrections', payload, self.token, csrf_for_session(self.token))
            self.assertEqual(status, 200, result)
            self.assertEqual(result['balances'], preview['after']['balances'])
            self.assertEqual(self.post('/api/it-assets/corrections', payload, self.token, csrf_for_session(self.token)), (200, result))

    def test_missing_authentication_origin_csrf_and_strict_payloads(self):
        payload = self.seed()
        self.assertEqual(self.request('/api/it-assets/corrections/'+str(payload['entryId']))[0], 401)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            for endpoint, body in (('/api/it-assets/corrections', payload), ('/api/it-assets/corrections/preview', preview_payload(payload))):
                self.assertEqual(self.post(endpoint, body, None, None)[0], 403)
                self.assertEqual(self.post(endpoint, body, self.token, None)[0], 403)
                self.assertEqual(self.post(endpoint, body, self.token, 'invalid')[0], 403)
                self.assertEqual(self.post(endpoint, dict(body, actorId=99), self.token, csrf_for_session(self.token))[0], 400)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://another.example'):
            self.assertEqual(self.post('/api/it-assets/corrections', payload, self.token, csrf_for_session(self.token))[0], 403)

    def test_disabled_feature_denies_context_preview_and_write(self):
        payload = self.seed()
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.assertEqual(self.request('/api/it-assets/corrections/'+str(payload['entryId']), COOKIE_NAME+'='+self.token)[0], 403)
        with patch('backend.server.PUBLIC_ORIGIN', 'https://caffoot.example'):
            for endpoint, body in (('/api/it-assets/corrections', payload), ('/api/it-assets/corrections/preview', preview_payload(payload))):
                self.assertEqual(self.post(endpoint, body, self.token, csrf_for_session(self.token))[0], 403)
