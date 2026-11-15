"""Real stock writers retain receipt facts, atomic balances and existing security."""
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
from backend.http_security import COOKIE_NAME
from backend.permissions import can_access
from backend.request_auth import csrf_for_session
from backend.sessions import _digest
from backend.stock_intake import read_stock, receive_stock, stock_item, update_stock_readiness
from backend.history_permissions import visible_change_history
from test_it_asset_stock_schema import database, seed_people
import test_feature_settings_http as feature_http


def receipt_payload(**overrides):
    return dict(
        operationId=uuid.uuid4().hex, quantity=10, receivedOn="2026-11-15", readyQuantity=0,
        item=dict(category="Monitor", trackingMode="quantity", manufacturer="Fictional",
                  model="Display", sharedSpecifications={}),
        checks=dict(itemsChecked=False, conditionChecked=False),
        supplier="Fictional Purchasing Supplier", notes="Fictional delivery", **overrides)


def readiness_payload(connection, identity, **overrides):
    item = stock_item(connection, identity)
    result = dict(operationId=uuid.uuid4().hex, stockItemId=identity, version=item["version"],
                  readyQuantity=item["balances"]["readyToIssue"],
                  minimumStockLevel=item["minimumStockLevel"],
                  checks=dict(itemsChecked=True, conditionChecked=True), reason="")
    result.update(overrides)
    return result


class StockIntakeTests(unittest.TestCase):
    def setUp(self):
        self.db = database()
        self.addCleanup(self.db.close)
        seed_people(self.db)
        self.token = "b" * 64
        self.db.execute("INSERT INTO account_sessions VALUES(?,1,9999999999,1)", (_digest(self.token),))
        self.db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        self.db.commit()

    def receive(self, payload=None):
        return receive_stock(self.db, 1, self.token, payload or receipt_payload())

    def update(self, payload):
        return update_stock_readiness(self.db, 1, self.token, payload)

    def unchanged(self, exception, operation):
        before = tuple(self.db.iterdump())
        with self.assertRaises(exception):
            operation()
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_receipt_is_held_unready_and_preserves_other_records(self):
        tables = ("accounts", "account_sessions", "account_profiles", "roles", "role_grants",
                  "account_roles", "account_permission_overrides", "staff_members",
                  "departments", "device_assignments", "inventory_devices")
        before = {table: self.db.execute("SELECT * FROM " + table).fetchall() for table in tables}
        result = self.receive()
        details = read_stock(self.db, 1, result["stockItemId"])
        self.assertEqual(details["item"]["balances"],
                         dict(physicallyHeld=10, readyToIssue=0, awaitingChecks=10))
        self.assertEqual(details["receipts"][0]["supplier"], "Fictional Purchasing Supplier")
        self.assertEqual(details["receipts"][0]["actor"], "Fictional Owner")
        self.assertEqual(details["receipts"][0]["date"], "2026-11-15")
        self.assertEqual(details["readinessChanges"], [])
        self.assertEqual({table: self.db.execute("SELECT * FROM " + table).fetchall()
                          for table in tables}, before)

    def test_partial_checked_readiness_is_atomic_and_keeps_original_receipt(self):
        payload = receipt_payload()
        payload.update(readyQuantity=4, checks=dict(itemsChecked=True, conditionChecked=True))
        result = self.receive(payload)
        details = read_stock(self.db, 1, result["stockItemId"])
        self.assertEqual(details["item"]["balances"],
                         dict(physicallyHeld=10, readyToIssue=4, awaitingChecks=6))
        self.assertEqual((details["receipts"][0]["ready"], details["receipts"][0]["awaiting"]), (4, 6))
        self.assertEqual(details["readinessChanges"][0]["readyAfter"], 4)
        self.assertEqual(self.db.execute(
            "SELECT kind FROM it_asset_stock_movements ORDER BY id").fetchall(),
            [("received",), ("readiness_changed",)])
        self.assertIsNotNone(result["readinessId"])

    def test_additional_deliveries_keep_separate_supplier_dates_and_quantities(self):
        first = self.receive()
        original = self.db.execute("SELECT * FROM it_asset_stock_movements").fetchall()
        item = stock_item(self.db, first["stockItemId"])
        payload = receipt_payload()
        del payload["item"]
        payload.update(stockItemId=item["id"], configurationKey=item["configurationKey"],
                       quantity=5, receivedOn="2026-11-14", supplier="Another Supplier")
        self.receive(payload)
        details = read_stock(self.db, 1, item["id"])
        self.assertEqual(details["item"]["balances"]["physicallyHeld"], 15)
        self.assertEqual([(row["date"], row["quantity"], row["supplier"]) for row in details["receipts"]],
                         [("2026-11-14", 5, "Another Supplier"),
                          ("2026-11-15", 10, "Fictional Purchasing Supplier")])
        self.assertEqual(self.db.execute(
            "SELECT * FROM it_asset_stock_movements ORDER BY id LIMIT 1").fetchall(), original)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_items").fetchone(), (1,))

    def test_duplicate_configuration_is_rejected_and_different_specifications_are_distinct(self):
        first = receipt_payload()
        first["item"].update(category="Desktop", model="Workstation",
                             sharedSpecifications=dict(memory=8, memoryUnit="GB"))
        self.receive(first)
        duplicate = copy.deepcopy(first)
        duplicate["operationId"] = uuid.uuid4().hex
        self.unchanged(FileExistsError, lambda: self.receive(duplicate))
        different = copy.deepcopy(duplicate)
        different["item"]["sharedSpecifications"]["memory"] = 16
        self.receive(different)
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_items").fetchone(), (2,))
        self.assertEqual(self.db.execute("SELECT count(*) FROM inventory_devices").fetchone(), (0,))

    def test_readiness_and_reasoned_reversal_preserve_held_and_receipts(self):
        identity = self.receive()["stockItemId"]
        original = self.db.execute("SELECT * FROM it_asset_stock_movements WHERE kind='received'").fetchall()
        self.update(readiness_payload(self.db, identity, readyQuantity=7))
        self.unchanged(ValueError, lambda: self.update(readiness_payload(
            self.db, identity, readyQuantity=2)))
        self.update(readiness_payload(self.db, identity, readyQuantity=2, reason="Recheck these units"))
        self.assertEqual(stock_item(self.db, identity)["balances"],
                         dict(physicallyHeld=10, readyToIssue=2, awaitingChecks=8))
        self.assertEqual(self.db.execute(
            "SELECT * FROM it_asset_stock_movements WHERE kind='received'").fetchall(), original)
        details = read_stock(self.db, 1, identity)
        self.assertEqual(details["receipts"][0]["ready"], 0)
        self.assertEqual(details["readinessChanges"][0]["reason"], "Recheck these units")

    def test_individual_identity_optional_identifiers_and_selected_readiness(self):
        payload = receipt_payload()
        payload["item"]["trackingMode"] = "individual"
        payload.update(quantity=1, serialNumber="", assetTag="")
        identity = self.receive(payload)["stockItemId"]
        first = stock_item(self.db, identity)["units"][0]["id"]
        extra = copy.deepcopy(payload)
        del extra["item"]
        extra.update(operationId=uuid.uuid4().hex, stockItemId=identity,
                     configurationKey=stock_item(self.db, identity)["configurationKey"],
                     serialNumber="Fictional Serial", assetTag="Fictional Tag")
        self.receive(extra)
        units = stock_item(self.db, identity)["units"]
        self.assertEqual(len({unit["id"] for unit in units}), 2)
        second = next(unit["id"] for unit in units if unit["id"] != first)
        self.update(readiness_payload(self.db, identity, readyQuantity=1, readyUnitIds=[first]))
        self.unchanged(ValueError, lambda: self.update(readiness_payload(
            self.db, identity, readyQuantity=1, readyUnitIds=[second])))
        self.update(readiness_payload(
            self.db, identity, readyQuantity=1, readyUnitIds=[second], reason="Check the other unit"))
        self.assertEqual({unit["id"]: unit["ready"] for unit in stock_item(self.db, identity)["units"]},
                         {first: False, second: True})
        self.assertEqual(self.db.execute("SELECT count(*) FROM inventory_devices").fetchone(), (0,))

    def test_minimum_is_optional_zero_is_distinct_and_no_movement_is_fabricated(self):
        identity = self.receive()["stockItemId"]
        self.assertIsNone(stock_item(self.db, identity)["minimumStockLevel"])
        original = self.db.execute("SELECT * FROM it_asset_stock_movements").fetchall()
        payload = readiness_payload(self.db, identity, minimumStockLevel=0)
        self.update(payload)
        self.update(payload)
        self.assertEqual(stock_item(self.db, identity)["minimumStockLevel"], 0)
        self.assertEqual(self.db.execute("SELECT * FROM it_asset_stock_movements").fetchall(), original)
        self.assertEqual(self.db.execute("SELECT count(*) FROM inventory_change_history").fetchone(), (1,))
        self.update(readiness_payload(self.db, identity, minimumStockLevel=None))
        self.assertIsNone(stock_item(self.db, identity)["minimumStockLevel"])

    def test_feature_disabled_history_does_not_leak_even_to_an_inventory_administrator(self):
        identity = self.receive()["stockItemId"]
        self.update(readiness_payload(self.db, identity, minimumStockLevel=4))
        self.db.execute(
            "UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks')")
        self.db.commit()
        self.assertEqual(len(visible_change_history(self.db, 1)), 1)
        self.db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.db.commit()
        before = tuple(self.db.iterdump())
        self.assertEqual(visible_change_history(self.db, 1), [])
        self.unchanged(PermissionError, lambda: read_stock(self.db, 1))
        self.unchanged(PermissionError, lambda: self.receive())
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_retries_are_idempotent_and_changed_payload_cannot_reuse_a_reference(self):
        payload = receipt_payload()
        first = self.receive(payload)
        before = tuple(self.db.iterdump())
        self.assertEqual(self.receive(payload), first)
        self.assertEqual(tuple(self.db.iterdump()), before)
        changed = copy.deepcopy(payload)
        changed["quantity"] = 11
        self.unchanged(FileExistsError, lambda: self.receive(changed))
        update = readiness_payload(self.db, first["stockItemId"], readyQuantity=3)
        response = self.update(update)
        before = tuple(self.db.iterdump())
        self.assertEqual(self.update(update), response)
        self.assertEqual(tuple(self.db.iterdump()), before)

    def test_invalid_quantities_checks_specifications_and_identifiers_save_nothing(self):
        cases = [dict(quantity=value) for value in (0, -1, 0.5, True, 9007199254740992)]
        cases += [dict(readyQuantity=11), dict(readyQuantity=1),
                  dict(serialNumber="Not For Quantity Stock"), dict(receivedOn="2026-02-30"),
                  dict(checks=dict(itemsChecked=1, conditionChecked=True))]
        for changes in cases:
            payload = receipt_payload()
            payload.update(changes)
            self.unchanged(ValueError, lambda: self.receive(payload))
        payload = receipt_payload()
        payload["item"]["sharedSpecifications"] = dict(memory=16, memoryUnit="GB")
        self.unchanged(ValueError, lambda: self.receive(payload))
        payload["item"].update(category="Desktop")
        payload["item"]["sharedSpecifications"]["memory"] = 10 ** 400
        self.unchanged(ValueError, lambda: self.receive(payload))

    def test_stale_updates_unchecked_increases_and_negative_minimum_are_refused(self):
        identity = self.receive()["stockItemId"]
        stale = readiness_payload(self.db, identity, readyQuantity=2)
        self.update(readiness_payload(self.db, identity, readyQuantity=1))
        self.unchanged(FileExistsError, lambda: self.update(stale))
        for changes in (dict(readyQuantity=11), dict(minimumStockLevel=-1),
                        dict(readyQuantity=2, checks=dict(itemsChecked=False, conditionChecked=True))):
            self.unchanged(ValueError, lambda: self.update(readiness_payload(self.db, identity, **changes)))

    def test_read_only_missing_mfa_and_revoked_sessions_cannot_write(self):
        payload = receipt_payload()
        self.unchanged(PermissionError, lambda: receive_stock(self.db, 2, "a" * 64, payload))
        self.assertFalse(can_access(self.db, 2, "Staff Members"))
        self.assertFalse(can_access(self.db, 2, "Devices"))
        for statement in ("DELETE FROM account_sessions WHERE account_id=1",
                          "UPDATE accounts SET mfa_confirmed=0 WHERE id=1"):
            self.db.execute(statement)
            self.db.commit()
            self.unchanged(PermissionError, lambda: self.receive(payload))

    def test_failure_after_receipt_or_readiness_rolls_back_all_partial_records(self):
        from backend.stock_intake import append_stock_fact
        def failed(*args, **kwargs):
            if args[3] == "readiness_changed":
                raise RuntimeError("Injected readiness failure")
            return append_stock_fact(*args, **kwargs)
        payload = receipt_payload()
        payload.update(readyQuantity=2, checks=dict(itemsChecked=True, conditionChecked=True))
        with patch("backend.stock_intake.append_stock_fact", side_effect=failed):
            self.unchanged(RuntimeError, lambda: self.receive(payload))
        identity = self.receive()["stockItemId"]
        with patch("backend.stock_intake.record_actor_event", side_effect=RuntimeError("Audit failure")):
            self.unchanged(RuntimeError, lambda: self.update(readiness_payload(
                self.db, identity, readyQuantity=2, minimumStockLevel=3)))

    def test_concurrent_receipts_and_stale_readiness_keep_every_unit_and_history(self):
        identity = self.receive()["stockItemId"]
        existing = stock_item(self.db, identity)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "stock.sqlite3"
            with sqlite3.connect(path) as target:
                self.db.backup(target)
            def receive_more(_):
                payload = receipt_payload()
                del payload["item"]
                payload.update(stockItemId=identity, configurationKey=existing["configurationKey"], quantity=5)
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute("PRAGMA foreign_keys=ON")
                    return receive_stock(db, 1, self.token, payload)
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(receive_more, range(2)))
            self.assertNotEqual(results[0]["receiptId"], results[1]["receiptId"])
            with sqlite3.connect(path) as db:
                self.assertEqual(stock_item(db, identity)["balances"]["physicallyHeld"], 20)
                payload = readiness_payload(db, identity, readyQuantity=12)
            def mark_ready(_):
                with sqlite3.connect(path, timeout=5) as db:
                    db.execute("PRAGMA foreign_keys=ON")
                    try:
                        update_stock_readiness(db, 1, self.token,
                                               dict(payload, operationId=uuid.uuid4().hex))
                        return True
                    except FileExistsError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                self.assertEqual(sorted(pool.map(mark_ready, range(2))), [False, True])


class StockIntakeHttpTests(unittest.TestCase):
    setUp = feature_http.FeatureSettingsHttpTests.setUp
    tearDown = feature_http.FeatureSettingsHttpTests.tearDown
    request = feature_http.FeatureSettingsHttpTests.request
    post = feature_http.FeatureSettingsHttpTests.post

    def test_protected_receipt_readiness_and_history_round_trip(self):
        self.assertEqual(self.request("/api/it-assets/stock", COOKIE_NAME+"="+self.token)[0], 403)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            status, result = self.post("/api/it-assets/receive", receipt_payload(),
                                       self.token, csrf_for_session(self.token))
            self.assertEqual(status, 200, result)
            identity = result["stockItemId"]
            with sqlite3.connect(self.path) as db:
                update = readiness_payload(db, identity, readyQuantity=4)
            status, result = self.post("/api/it-assets/readiness", update,
                                       self.token, csrf_for_session(self.token))
            self.assertEqual(status, 200, result)
        status, raw, cache = self.request("/api/it-assets/stock/"+identity, COOKIE_NAME+"="+self.token)
        self.assertEqual((status, cache), (200, "no-store"))
        result = json.loads(raw)
        self.assertEqual(result["item"]["balances"]["readyToIssue"], 4)
        self.assertEqual(len(result["receipts"]), 1)
        self.assertEqual(len(result["readinessChanges"]), 1)

    def test_authentication_csrf_payload_and_unapproved_routes(self):
        self.assertEqual(self.request("/api/it-assets/stock")[0], 401)
        with sqlite3.connect(self.path) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        with patch("backend.server.PUBLIC_ORIGIN", "https://caffoot.example"):
            self.assertEqual(self.post("/api/it-assets/receive", receipt_payload(),
                                       self.token, None)[0], 403)
            self.assertEqual(self.post("/api/it-assets/receive", {"operationId": "bad"},
                                       self.token, csrf_for_session(self.token))[0], 400)
            for action in ("issue", "return", "write-off", "correct", "register", "specifications"):
                self.assertEqual(self.post("/api/it-assets/"+action, {}, self.token,
                                           csrf_for_session(self.token))[0], 404)
