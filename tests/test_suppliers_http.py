"""Supplier HTTP journeys exercise access, validation, attribution and retention."""
from concurrent.futures import ThreadPoolExecutor
import http.client
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch
from uuid import uuid4

from backend.history_permissions import visible_change_history
from backend.stock_circulation import read_stock_issues
from backend.stock_intake import stock_item
from test_device_stock import registration_payload
from test_stock_circulation import issue_payload, return_payload
from test_stock_intake import receipt_payload

from backend.http_security import COOKIE_NAME
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import _digest
from backend.supplier_issue_schema import ISSUE_STATUSES

ORIGIN = "https://caffoot.example"
ROOT = "/api/suppliers"
ADDRESS = {"address": "", "city": "", "postcode": "", "country": ""}
CONTACT = {"name": "Kim Example", "role": "", "phones": [], "emails": [], "companyWide": False}


class SupplierHttpTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.db = Path(temp.name) / "suppliers.sqlite3"
        with sqlite3.connect(self.db) as db:
            db.execute("PRAGMA foreign_keys=ON")
            initialise_database(db)
            for actor in range(1, 6):
                db.execute(
                    "INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret) VALUES(?,?,?,?,?,?)",
                    (actor, f"actor-{actor}", "hash", int(actor == 1), int(actor != 5), "secret"),
                )
                db.execute("INSERT INTO account_sessions VALUES(?,?,9999999999,1)", (_digest(self.token(actor)), actor))
            db.executemany("INSERT INTO account_permission_overrides VALUES(?,'Suppliers',?)",
                           [(2, "edit"), (3, "read"), (4, "deny"), (5, "edit")])
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='suppliers'")
        for key, value in (("DB_PATH", self.db), ("PUBLIC_ORIGIN", ORIGIN)):
            setting = patch(f"backend.server.{key}", value)
            setting.start()
            self.addCleanup(setting.stop)
        server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        self.port = server.server_port

    def token(self, actor):
        return str(actor) * 64

    def request(self, path=ROOT, *, actor=2, payload=None, headers=None):
        request_headers = {"Origin": ORIGIN}
        if actor:
            request_headers["Cookie"] = f"{COOKIE_NAME}={self.token(actor)}"
        if payload is not None:
            request_headers.update({"Content-Type": "application/json",
                                    "X-CSRF-Token": csrf_for_session(self.token(actor))})
        request_headers.update(headers or {})
        client = http.client.HTTPConnection("127.0.0.1", self.port)
        try:
            client.request("GET" if payload is None else "POST", path,
                           body=None if payload is None else json.dumps(payload), headers=request_headers)
            response = client.getresponse()
            self.assertEqual(response.getheader("Cache-Control"), "no-store")
            return response.status, json.loads(response.read())
        finally:
            client.close()

    def save(self, operation, data, supplier=None, record=None, *, actor=2, status=200):
        payload = {"operation": operation, "data": data}
        if supplier:
            payload.update(supplierId=supplier["id"], revision=supplier["revision"])
        if record:
            payload["recordId"] = record["id"]
            if operation.startswith(("category.", "issue-category.")):
                payload["revision"] = record["revision"]
        code, result = self.request(actor=actor, payload=payload)
        self.assertEqual(code, status, result)
        return result

    def company(self, **options):
        return {"name": "Northlight Ltd", "website": "", "description": "",
                "address": dict(ADDRESS), "categoryIds": [], **options}

    def test_lookup_edit_boundaries_and_receipt_replay(self):
        company = self.save("supplier.save", self.company())
        archived = self.save("supplier.save", self.company(name="Distant Ltd"))
        self.save("supplier.archive", {"confirmed": True}, archived)
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
            db.executemany("INSERT INTO account_permission_overrides VALUES(?,?,?)", [
                (4, "IT Assets", "edit"), (3, "IT Assets", "read"),
                (4, "Devices", "edit"), (5, "IT Assets", "edit"),
            ])
        choice_uri = ROOT + "/choices/it-assets"
        self.assertEqual(self.request(choice_uri, actor=4), (200, {
            "suppliers": [{"id": company["id"], "name": company["name"]}],
        }))
        for actor in (2, 3):
            self.assertEqual(self.request(choice_uri, actor=actor)[0], 403)
        self.assertEqual(self.request(choice_uri, actor=5)[0], 401)
        self.assertEqual(self.request(ROOT, actor=4)[0], 403)
        device = {"id": "monitor", "name": "Office Monitor", "type": "Monitor"}
        code, result = self.request("/api/devices/create", actor=4, payload={
            "record": device, "supplier": {"id": company["id"]},
        })
        self.assertEqual(code, 200, result)
        self.assertEqual(self.request("/api/inventory/state", actor=4)[1]["deviceSuppliers"],
                         {"monitor": {"id": company["id"], "name": company["name"]}})
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE account_permission_overrides SET level='read' WHERE account_id=4 AND section='Devices'")
        self.assertEqual(self.request("/api/inventory/state", actor=4)[1]["deviceSuppliers"],
                         {"monitor": {"name": company["name"]}})

        path = "/api/it-assets/receive"
        free_text = receipt_payload()
        free_text["supplier"] = company["name"]
        code, first = self.request(path, actor=4, payload=free_text)
        self.assertEqual(code, 200, first)
        with sqlite3.connect(self.db) as db:
            config = stock_item(db, first["stockItemId"])["configurationKey"]
        explicit = receipt_payload(stockItemId=first["stockItemId"], configurationKey=config,
                                   supplierId=company["id"])
        explicit.pop("item")
        code, second = self.request(path, actor=4, payload=explicit)
        self.assertEqual(code, 200, second)
        self.assertEqual(self.request(path, actor=4, payload=explicit), (200, second))
        self.assertEqual(self.request(path, actor=4, payload={**explicit, "quantity": 2})[0], 409)
        invalid = {**explicit, "operationId": uuid4().hex, "supplierId": archived["id"]}
        self.assertEqual(self.request(path, actor=4, payload=invalid)[0], 400)
        receipt = self.request("/api/it-assets/stock", actor=4)[1]["receipts"]
        self.assertEqual([record["supplierAssociation"] for record in receipt], [
            {"id": company["id"], "name": company["name"]}, None,
        ])
        with sqlite3.connect(self.db) as db:
            self.assertEqual(db.execute("SELECT supplier_id,section FROM supplier_supply_history ORDER BY section").fetchall(),
                             [(company["id"], "Devices"), (company["id"], "IT Assets")])
            before = db.execute("SELECT * FROM it_asset_stock_movements").fetchall()
            self.assertEqual(len(before), 2)
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='suppliers'")
        self.assertEqual(self.request(choice_uri, actor=4)[0], 403)
        self.assertNotIn("deviceSuppliers", self.request("/api/inventory/state", actor=4)[1])
        hidden = self.request("/api/it-assets/stock", actor=4)[1]["receipts"]
        self.assertTrue(all(record["supplier"] == company["name"] for record in hidden))
        self.assertTrue(all("supplierAssociation" not in record for record in hidden))
        with sqlite3.connect(self.db) as db:
            self.assertEqual(db.execute("SELECT * FROM it_asset_stock_movements").fetchall(), before)
            self.assertFalse(any(event.get("reason") == "Equipment Supplier association"
                                 for event in visible_change_history(db, 1)))
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='suppliers'")
        self.assertEqual(self.request("/api/it-assets/stock", actor=4)[1]["receipts"][0]["supplierAssociation"]["id"],
                         company["id"])


    def test_atomic_confirmed_assignments_and_permanent_receipt_provenance(self):
        original = self.save("supplier.save", self.company())
        corrected = self.save("supplier.save", self.company(name="Dockland Ltd"))
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
            db.executemany("INSERT INTO account_permission_overrides VALUES(?,?,?)", [
                (4, "IT Assets", "edit"), (4, "Devices", "edit"),
            ])

        for device_id in ("a", "b"):
            self.assertEqual(self.request("/api/devices/create", actor=1, payload={
                "record": {"id": device_id, "name": device_id, "type": "Laptop"},
            })[0], 200)
        devices_uri = ROOT + "/assign/devices"
        devices = [{"id": device_id, "revision": 0} for device_id in ("a", "b")]
        device_request = {"operationId": uuid4().hex, "confirmed": True,
                          "supplierId": original["id"], "records": devices}
        self.assertEqual(self.request(devices_uri, actor=4, payload=device_request)[0], 403)
        self.assertEqual(self.request("/api/devices/edit/start", actor=4, payload={"deviceId": "b"})[0], 200)
        self.assertEqual(self.request(devices_uri, actor=1, payload=device_request)[0], 409)
        with sqlite3.connect(self.db) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM device_suppliers").fetchone(), (0,))
        self.assertEqual(self.request("/api/devices/edit/cancel", actor=4, payload={"deviceId": "b"})[0], 200)
        self.assertEqual(self.request(devices_uri, actor=1, payload={**device_request, "confirmed": False})[0], 400)
        self.assertEqual(self.request(devices_uri, actor=1, payload=device_request), (200, {"updated": 2}))
        self.assertEqual(self.request(devices_uri, actor=1, payload=device_request), (200, {"updated": 2}))
        stale = {**device_request, "operationId": uuid4().hex, "supplierId": corrected["id"]}
        self.assertEqual(self.request(devices_uri, actor=1, payload=stale)[0], 409)

        receipt_path = "/api/it-assets/receive"
        payload = receipt_payload(supplierId=original["id"])
        code, first = self.request(receipt_path, actor=4, payload=payload)
        self.assertEqual(code, 200, first)
        with sqlite3.connect(self.db) as db:
            config = stock_item(db, first["stockItemId"])["configurationKey"]
        payload = receipt_payload(stockItemId=first["stockItemId"], configurationKey=config)
        payload.pop("item")
        code, second = self.request(receipt_path, actor=4, payload=payload)
        self.assertEqual(code, 200, second)
        selected = [{"id": first["receiptId"], "revision": 1}, {"id": second["receiptId"], "revision": 0}]
        request = {"operationId": uuid4().hex, "confirmed": True,
                   "supplierId": corrected["id"], "records": selected}
        receipts_uri = ROOT + "/assign/receipts"
        with sqlite3.connect(self.db) as db:
            before = [db.execute("SELECT * FROM " + table).fetchall() for table in (
                "it_asset_stock_movements", "it_asset_stock_entries", "it_asset_stock_items")]
        invalid = {**request, "records": [selected[0], {**selected[1], "revision": 2}]}
        self.assertEqual(self.request(receipts_uri, actor=4, payload=invalid)[0], 409)
        self.assertEqual(self.request(receipts_uri, actor=3, payload=request)[0], 403)
        self.assertEqual(self.request(receipts_uri, actor=4, payload=request), (200, {"updated": 2}))
        self.assertEqual(self.request(receipts_uri, actor=4, payload=request), (200, {"updated": 2}))
        self.assertEqual(self.request(receipts_uri, actor=4, payload={**request, "supplierId": None})[0], 409)
        removal = {**request, "operationId": uuid4().hex, "supplierId": None,
                   "records": [{"id": first["receiptId"], "revision": 2}]}
        self.assertEqual(self.request(receipts_uri, actor=4, payload=removal), (200, {"updated": 1}))
        with sqlite3.connect(self.db) as db:
            self.assertEqual([db.execute("SELECT * FROM " + table).fetchall() for table in (
                "it_asset_stock_movements", "it_asset_stock_entries", "it_asset_stock_items")], before)
            self.assertEqual(db.execute("SELECT * FROM receipt_suppliers ORDER BY receipt_id").fetchall(),
                             [(first["receiptId"], None, 3), (second["receiptId"], corrected["id"], 1)])
            self.assertEqual(db.execute("SELECT count(*) FROM inventory_change_history "
                                        "WHERE json_extract(record_json,'$.changes[0].after.movementId')=?",
                                        (first["receiptId"],)).fetchone(), (3,))
        for supplier in (original, corrected):
            self.assertIn("IT Assets", self.request(f"{ROOT}/{supplier['id']}/impact", actor=1)[1]["sections"])
            self.save("supplier.delete", {"confirmed": True}, supplier, status=409)
        self.save("supplier.disable", {"confirmed": True, "sections": ["Devices"]}, original, actor=1, status=409)

    def test_association_audit_names_are_captured_at_event_time(self):
        from backend.equipment_suppliers import write_device_supplier, write_receipt_supplier
        from backend.equipment_suppliers import SUPPLIER_AUDIT_REASON
        company = self.save("supplier.save", self.company(name="Original Company"))
        other = self.save("supplier.save", self.company(name="Next Company"))
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
        code, result = self.request("/api/devices/create", actor=1, payload={
            "record": {"id": "audit-laptop", "name": "Audit Laptop", "type": "Laptop"},
            "supplier": {"id": company["id"]}})
        self.assertEqual(code, 200, result)
        code, receipt = self.request("/api/it-assets/receive", actor=1,
                                     payload=receipt_payload(supplierId=company["id"]))
        self.assertEqual(code, 200, receipt)
        def events(db):
            return [event["changes"][0] for (raw,) in db.execute(
                "SELECT record_json FROM inventory_change_history ORDER BY id")
                for event in [json.loads(raw)] if event.get("reason") == SUPPLIER_AUDIT_REASON
                and "before" in event["changes"][0]]
        with sqlite3.connect(self.db) as db:
            first = events(db)
            self.assertEqual(len(first), 2)
            self.assertTrue(all(row["after"]["supplierName"] == "Original Company" for row in first))
            stored = db.execute("SELECT * FROM inventory_change_history ORDER BY id").fetchall()
        renamed = self.save("supplier.save", self.company(name="Renamed Company"), company)
        self.save("supplier.archive", {"confirmed": True}, renamed)
        with sqlite3.connect(self.db) as db:
            self.assertEqual(events(db), first)
            write_device_supplier(db, 1, "audit-laptop", "Audit Laptop", other["id"], "")
            write_device_supplier(db, 1, "audit-laptop", "Audit Laptop", None, "Independent Company")
            write_device_supplier(db, 1, "audit-laptop", "Audit Laptop", None, "")
            write_receipt_supplier(db, 1, receipt["receiptId"], other["id"], company["id"], revision=1)
            write_receipt_supplier(db, 1, receipt["receiptId"], None, other["id"], revision=2)
            changes = events(db)
            self.assertEqual(changes[:2], first)
            self.assertEqual(changes[2]["before"]["supplierName"], "Renamed Company")
            self.assertEqual(changes[2]["after"]["supplierName"], "Next Company")
            self.assertEqual(changes[3]["after"]["supplierText"], "Independent Company")
            self.assertNotIn("supplierName", changes[3]["after"])
            self.assertEqual(changes[4]["after"]["supplierText"], "")
            self.assertEqual(changes[5]["before"]["supplierName"], "Renamed Company")
            self.assertEqual(changes[5]["after"]["supplierName"], "Next Company")
            self.assertIsNone(changes[6]["after"]["supplierId"])
            self.assertNotIn("supplierName", changes[6]["after"])
            self.assertEqual(db.execute("SELECT * FROM inventory_change_history ORDER BY id").fetchall()[:len(stored)], stored)

    def test_supplier_equipment_counts_visible_original_supply_through_stock_movement(self):
        company = self.save("supplier.save", self.company())
        other = self.save("supplier.save", self.company(name="Dockland Ltd"))
        endpoint = f"{ROOT}/{company['id']}"
        self.assertNotIn("equipment", self.request(endpoint, actor=1)[1])
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
            db.executemany("INSERT INTO account_permission_overrides VALUES(?,?,?)", [
                (2, "Devices", "read"), (3, "IT Assets", "read"), (4, "Devices", "edit"),
            ])
            db.execute("INSERT INTO staff_members(id,first_name) VALUES('person','Example Recipient')")
        self.assertEqual(self.request(endpoint, actor=4)[0], 403)

        receipt_request = receipt_payload(supplierId=company["id"])
        receipt_request.update(readyQuantity=10, checks={"itemsChecked": True, "conditionChecked": True})
        receipt_request["item"].update(category="Laptop", model="Fictional Laptop")
        code, receipt = self.request("/api/it-assets/receive", actor=1, payload=receipt_request)
        self.assertEqual(code, 200, receipt)
        item = receipt["stockItemId"]
        with sqlite3.connect(self.db) as db:
            key = stock_item(db, item)["configurationKey"]
            registration = registration_payload(db, item)
        code, registered = self.request("/api/it-assets/register-device", actor=1, payload=registration)
        self.assertEqual(code, 200, registered)
        excess = receipt_payload(stockItemId=item, configurationKey=key, supplierId=other["id"])
        excess.pop("item")
        self.assertEqual(self.request("/api/it-assets/receive", actor=1, payload=excess)[0], 200)

        self.assertEqual(self.request(ROOT + "/assign/devices", actor=1, payload={
            "operationId": uuid4().hex, "confirmed": True, "supplierId": company["id"],
            "records": [{"id": registered["deviceId"], "revision": 0}],
        })[0], 200)
        direct = {"id": "switch-1", "type": "Switch", "name": "Core Switch", "status": "Active"}
        self.assertEqual(self.request("/api/devices/create", actor=1, payload={
            "record": direct, "supplier": {"id": company["id"]},
        })[0], 200)
        self.assertEqual(self.request("/api/devices/edit/start", actor=1, payload={"deviceId": direct["id"]})[0], 200)
        self.assertEqual(self.request("/api/devices/edit/save", actor=1, payload={
            "deviceId": direct["id"], "revision": 0, "record": {**direct, "status": "Retired"},
        })[0], 200)

        def read(actor):
            code, data = self.request(endpoint, actor=actor)
            self.assertEqual(code, 200, data)
            return data

        all_equipment = read(1)["equipment"]
        self.assertEqual(all_equipment["quantity"], "11")
        self.assertEqual(len(all_equipment["records"]), 3)
        by_id = {row["id"]: row for row in all_equipment["records"]}
        self.assertEqual(by_id[receipt["receiptId"]]["date"], receipt_request["receivedOn"])
        self.assertEqual(by_id[receipt["receiptId"]]["quantity"], 10)
        self.assertEqual(by_id[direct["id"]]["status"], "Retired")
        self.assertIsNone(by_id[registered["deviceId"]]["quantity"])

        with sqlite3.connect(self.db) as db:
            issue_request = issue_payload(db, item)
        self.assertEqual(self.request("/api/it-assets/issue", actor=1, payload=issue_request)[0], 200)
        self.assertEqual(read(1)["equipment"], all_equipment)
        with sqlite3.connect(self.db) as db:
            issue = read_stock_issues(db, 1)["issues"][0]
        code, returned = self.request("/api/it-assets/return", actor=1,
                                      payload=return_payload(issue, writeOffQuantity=1, writeOffReason="Damaged"))
        self.assertEqual(code, 200, returned)
        self.assertEqual(read(1)["equipment"], all_equipment)

        devices = read(2)["equipment"]
        assets = read(3)["equipment"]
        self.assertEqual(devices["quantity"], "1")
        self.assertEqual({record["source"] for record in devices["records"]}, {"device"})
        self.assertEqual(assets, {"quantity": "10", "records": [by_id[receipt["receiptId"]]]})
        self.assertEqual(self.request("/api/it-assets/stock", actor=2)[0], 403)
        self.assertEqual(self.request("/api/inventory/devices", actor=3)[0], 403)
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='it_assets'")
        self.assertNotIn("equipment", read(3))
        self.assertEqual(read(1)["equipment"], devices)
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='devices'")
        self.assertNotIn("equipment", read(1))
        self.assertTrue(read(1)["hasSupplyHistory"])
        self.assertEqual(self.request(endpoint + "/impact", actor=1)[1]["sections"], ["Devices", "IT Assets"])
        self.assertEqual(self.request(endpoint + "/impact", actor=2)[0], 403)
        self.save("supplier.delete", {"confirmed": True}, company, status=409)
        disabled = self.save("supplier.disable", {"confirmed": True, "sections": ["Devices", "IT Assets"]},
                             company, actor=1)
        self.assertEqual(disabled["status"], "disabled")
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
        self.assertEqual(read(1)["equipment"], all_equipment)
        self.assertNotIn(company["id"], [supplier["id"] for supplier in
                                        self.request(ROOT + "/choices/devices", actor=1)[1]["suppliers"]])
        enabled = self.save("supplier.enable", {"confirmed": True, "sections": ["Devices", "IT Assets"]},
                            disabled, actor=1)
        renamed = self.save("supplier.save", self.company(name="Northlight Equipment Ltd"), enabled, actor=1)
        code, history = self.request("/api/it-assets/stock/" + item, actor=1)
        self.assertEqual(code, 200, history)
        original = next(row for row in history["receipts"] if row["id"] == receipt["receiptId"])
        self.assertEqual(original["supplier"], company["name"])
        self.assertEqual(original["supplierAssociation"], {"id": renamed["id"], "name": renamed["name"]})
        self.assertEqual(read(1)["equipment"], all_equipment)

    def test_issue_lifecycle_handover_corrections_and_audit(self):
        supplier = self.save("supplier.save", self.company(contacts=[CONTACT, {**CONTACT, "name": "Sam Example"}]))
        original, replacement = supplier["contacts"]
        other = self.save("supplier.save", self.company(name="Another Ltd", contacts=[CONTACT]))
        category = supplier["issueCategories"][0]
        fields = {"title": "Damaged monitors", "description": "Original description",
                  "categoryId": category["id"], "contactIds": [original["id"]]}
        self.save("issue.save", {**fields, "status": "Open"}, supplier, status=400)
        self.save("issue.save", {**fields, "description": " "}, supplier, status=400)
        self.save("issue.save", {**fields, "contactIds": [other["contacts"][0]["id"]]}, supplier, status=404)
        self.save("issue.save", fields, supplier, actor=3, status=403)
        company = self.save("issue.save", fields, supplier)
        issue = company["issue"]
        self.assertEqual((issue["status"], issue["createdBy"]), ("Open", "actor-2"))
        detail = f"{ROOT}/{supplier['id']}/issues/{issue['id']}"
        self.assertEqual(self.request(detail, actor=3), (200, issue))
        self.assertEqual(self.request(f"{ROOT}/{other['id']}/issues/{issue['id']}")[0], 404)
        self.save("supplier.delete", {"confirmed": True}, company, status=409)

        updated = self.save("issue.save", {**fields, "status": "Resolved", "newUpdate": "Original observation"},
                            company, issue)
        self.save("issue.save", {**fields, "status": "Closed"}, company, issue, status=409)
        first = updated["issue"]["updates"][0]
        updated = self.save("issue.save", {**fields, "status": "Closed", "newUpdate": "Accepted replacements"},
                            updated, issue)
        updated = self.save("issue-update.correct", {"issueId": issue["id"], "text": "Corrected observation"},
                            updated, first, actor=1)
        fields.update(description="Corrected description", contactIds=[replacement["id"]])
        updated = self.save("issue.save", {**fields, "status": "Open"}, updated, issue)
        self.assertEqual(updated["issue"]["createdAt"], issue["createdAt"])
        self.assertEqual(updated["issue"]["contactIds"], [replacement["id"]])
        self.assertEqual(updated["issue"]["status"], "Open")
        corrected, second = updated["issue"]["updates"]
        self.assertEqual((corrected["id"], corrected["createdAt"], corrected["createdBy"], corrected["updatedBy"]),
                         (first["id"], first["createdAt"], "actor-2", "actor-1"))
        self.assertEqual((corrected["text"], second["text"]), ("Corrected observation", "Accepted replacements"))
        self.save("contact.delete", {"confirmed": True}, updated, original, status=409)
        self.save("issue.delete", {"confirmed": True}, updated, issue, status=400)
        self.save("issue-update.delete", {"confirmed": True}, updated, first, status=400)
        events = self.request("/api/inventory/history", actor=1)[1]["changeHistory"]
        correction = next(event for event in events if event.get("reason") == "Supplier issue update corrected")
        self.assertEqual(correction["actor"], "actor-1")
        self.assertEqual(correction["changes"][0]["before"]["text"], "Original observation")
        self.assertEqual(correction["changes"][0]["after"]["text"], "Corrected observation")
        self.assertEqual(correction["changes"][0]["before"]["createdAt"], first["createdAt"])
        transitions = [(change["before"]["status"], change["after"]["status"])
                       for event in events if event.get("reason") == "Supplier issue updated"
                       for change in event["changes"]]
        self.assertEqual(transitions, [("Open", "Resolved"), ("Resolved", "Closed"), ("Closed", "Open")])
        with sqlite3.connect(self.db) as db:
            for query in ("DELETE FROM supplier_issues", "DELETE FROM supplier_issue_updates",
                          "UPDATE supplier_issue_updates SET created_by=1", "DELETE FROM inventory_change_history"):
                with self.assertRaises(sqlite3.IntegrityError):
                    db.execute(query)

    def test_every_status_transition_and_competing_edits(self):
        original = self.save("supplier.save", self.company())
        values = {"title": "Intermittent fault", "description": "Initial report", "categoryId": None, "contactIds": []}
        company = self.save("issue.save", {"title": values["title"], "description": values["description"]}, original)
        identity = company["issue"]
        self.assertIsNone(identity["categoryId"])
        self.assertEqual(identity["contactIds"], [])
        for start in ISSUE_STATUSES:
            for end in ISSUE_STATUSES:
                with self.subTest(start=start, end=end):
                    company = self.save("issue.save", {**values, "status": start}, company, identity)
                    company = self.save("issue.save", {**values, "status": end}, company, identity)
                    self.assertEqual(company["issue"]["status"], end)
                    self.assertEqual(company["issue"]["createdAt"], identity["createdAt"])
                    self.assertEqual(company["issue"]["updates"], [])

        def edit(actor):
            return self.request(actor=actor, payload={
                "operation": "issue.save", "supplierId": company["id"], "recordId": identity["id"],
                "revision": company["revision"], "data": {**values, "description": f"Correction by {actor}"},
            })

        with ThreadPoolExecutor(max_workers=2) as editors:
            responses = list(editors.map(edit, (1, 2)))
        self.assertEqual(sorted(code for code, _ in responses), [200, 409])
        saved = next(result["issue"] for code, result in responses if code == 200)
        self.assertEqual(self.request(f"{ROOT}/{company['id']}/issues/{identity['id']}")[1], saved)

    def test_issue_catalogue_and_dashboard_counts_feature_off(self):
        dashboard = ROOT + "/dashboard"
        collection = ROOT + "/issues"
        self.assertEqual(self.request(dashboard, actor=3)[1]["statusCounts"],
                         {"Open": 0, "In Progress": 0, "Resolved": 0, "Closed": 0})
        supplier = self.save("supplier.save", self.company())
        archived = self.save("supplier.save", self.company(name="Old Supplies"))
        archived = self.save("supplier.archive", {"confirmed": True}, archived)
        disabled = self.save("supplier.save", self.company(name="On Hold"))
        deleted = self.save("supplier.save", self.company(name="Unused Supplies"))
        self.save("supplier.delete", {"confirmed": True}, deleted)
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE suppliers SET status='disabled' WHERE id=?", (disabled["id"],))

        categories = self.save("issue-category.save", {"name": "Replacement Parts"})
        category = next(item for item in categories["issueCategories"] if item["id"] == categories["categoryId"])
        self.assertNotIn(category["name"], [item["name"] for item in self.request()[1]["categories"]])
        self.save("issue-category.save", {"name": "replacement parts"}, status=409)
        self.save("issue-category.save", {"name": "Private"}, actor=3, status=403)
        data = {"title": "Broken item", "description": "Three damaged items", "categoryId": category["id"], "contactIds": []}
        supplier = self.save("issue.save", data, supplier)
        opened = supplier["issue"]
        categories = self.save("issue-category.archive", {"confirmed": True}, record=category)
        retired = next(item for item in categories["issueCategories"] if item["id"] == category["id"])
        self.save("issue-category.save", {"name": "Stale name"}, record=category, status=409)
        self.save("issue.save", data, supplier, status=400)
        supplier = self.save("issue.save", {**data, "status": "In Progress"}, supplier, opened)
        self.assertEqual(supplier["issue"]["categoryId"], category["id"])
        self.save("issue-category.reactivate", {"confirmed": True}, record=retired)
        data["categoryId"] = None
        for company, title, status in ((archived, "Awaiting response", "Open"),
                                       (disabled, "Freight delay", "Resolved"),
                                       (supplier, "Invoice credit", "Closed")):
            row = self.save("issue.save", {**data, "title": title}, company)
            if status != "Open":
                self.save("issue.save", {**data, "title": title, "status": status}, row, row["issue"])
        counts = self.request(dashboard, actor=3)[1]
        self.assertEqual((counts["totalSuppliers"], counts["availableSuppliers"]), (3, 1))
        self.assertEqual(counts["statusCounts"], {"Open": 1, "In Progress": 1, "Resolved": 1, "Closed": 1})
        self.assertEqual([row["title"] for row in counts["recentIssues"]], ["Awaiting response", "Broken item"])
        self.assertEqual(len(self.request(collection, actor=3)[1]["issues"]), 4)
        self.assertEqual(self.request(dashboard, actor=4)[0], 403)
        self.assertEqual(self.request(collection, actor=5)[0], 401)
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='suppliers'")
        self.assertNotIn("Broken item", json.dumps(self.request("/api/inventory/history", actor=1)[1]))
        self.assertEqual(self.request(dashboard, actor=1)[0], 403)
        self.assertEqual(self.request(collection, actor=2)[0], 403)
        self.assertEqual(self.request(f"{ROOT}/{supplier['id']}/issues/{opened['id']}", actor=3)[0], 403)

    def test_access_disabled_reenable_and_audit_privacy(self):
        self.assertEqual(self.request(actor=None)[0], 401)
        self.assertEqual(self.request(actor=4)[0], 403)
        self.assertEqual(self.request(actor=5)[0], 401)
        self.assertEqual(self.request(actor=3)[0], 200)
        session = self.request("/api/session", actor=3)[1]
        self.assertTrue(session["can_enter_workspace"])
        self.assertFalse(session["can_enter_inventory"])
        self.assertEqual(session["supplier_permissions"], {"read": True, "edit": False})
        self.save("supplier.save", self.company(), actor=3, status=403)
        self.assertEqual(self.request(headers={"Origin": "https://wrong.example"})[0], 403)
        self.assertEqual(self.request(payload={}, headers={"X-CSRF-Token": "wrong"})[0], 403)
        supplier = self.save("supplier.save", self.company())
        self.assertEqual(self.request(f"{ROOT}/{supplier['id']}", actor=3)[0], 200)
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=0 WHERE feature='suppliers'")
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks')")
        self.assertEqual(self.request(actor=1)[0], 403)
        self.assertEqual(self.request(f"{ROOT}/{supplier['id']}", actor=2)[0], 403)
        self.assertNotIn("Northlight", json.dumps(self.request("/api/inventory/history", actor=1)[1]))
        with sqlite3.connect(self.db) as db:
            db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='suppliers'")
        self.assertEqual(self.request(actor=3)[1]["suppliers"][0]["id"], supplier["id"])
        self.assertIn("Northlight", json.dumps(self.request("/api/inventory/history", actor=1)[1]))

    def test_create_is_atomic_and_names_are_unique_across_statuses(self):
        self.save("supplier.save", self.company(contacts=[CONTACT, {**CONTACT, "name": "", "role": "Buyer"}]), status=400)
        self.assertEqual(self.request()[1]["suppliers"], [])
        self.save("supplier.save", self.company(website="javascript:alert(1)"), status=400)
        supplier = self.save("supplier.save", self.company(contacts=[{**CONTACT, "name": ""}, CONTACT]))
        self.assertEqual(len(supplier["contacts"]), 1)
        self.assertTrue(supplier["locations"][0]["main"])
        self.assertEqual(supplier["locations"][0]["address"], "")
        archived = self.save("supplier.archive", {"confirmed": True}, supplier)
        self.save("supplier.save", self.company(name="northLIGHT Ltd"), status=409)
        self.save("supplier.reactivate", {"confirmed": True}, archived)
        self.save("supplier.delete", {"confirmed": True}, archived, status=409)

    def test_company_location_contacts_and_categories(self):
        category = self.request()[1]["categories"][0]
        supplier = self.save("supplier.save", self.company(categoryIds=[category["id"]]))
        main = supplier["locations"][0]
        supplier = self.save("location.save", {"name": "Head Office", "address": {**ADDRESS, "city": "York"}}, supplier, main)
        self.assertEqual(self.request()[1]["suppliers"][0]["city"], "York")
        supplier = self.save("supplier.save", self.company(address={**ADDRESS, "city": "Leeds"},
                             categoryIds=[category["id"]]), supplier)
        self.assertEqual(supplier["locations"][0]["id"], main["id"])
        self.assertEqual(supplier["locations"][0]["city"], "Leeds")
        supplier = self.save("location.save", {"name": "Branch", "address": ADDRESS}, supplier)
        branch = supplier["locations"][1]
        contact = {**CONTACT, "locationIds": [main["id"], branch["id"]], "profiles": [
            {"label": "Profile", "url": "https://example.org/kim"}],
            "phones": ["0113 555 0100", "07700 900123"], "emails": ["kim@example.org", "team@example.org"]}
        supplier = self.save("contact.save", contact, supplier)
        self.assertEqual(supplier["contacts"][0]["locationIds"], [main["id"], branch["id"]])
        self.save("location.delete", {"confirmed": True}, supplier, branch, status=409)
        supplier = self.save("location.archive", {"confirmed": True}, supplier, branch)
        self.save("contact.save", {**contact, "name": "New Contact"}, supplier, status=400)
        self.assertEqual(len(supplier["contacts"]), 1)
        stored_contact = supplier["contacts"][0]
        supplier = self.save("contact.archive", {"confirmed": True}, supplier, stored_contact)
        self.save("contact.save", {**contact, "companyWide": True, "locationIds": []}, supplier,
                  stored_contact, status=400)
        supplier = self.save("contact.reactivate", {"confirmed": True}, supplier, stored_contact)
        self.assertEqual(supplier["contacts"][0]["locationIds"], [main["id"], branch["id"]])
        self.assertEqual(self.save("category.archive", {"confirmed": True}, record=category)["categories"][0]["archived"], True)
        self.save("supplier.save", self.company(name="New Supplier", categoryIds=[category["id"]]), status=400)
        self.assertEqual(self.request()[1]["suppliers"][0]["categoryIds"], [category["id"]])
        retired = next(c for c in self.request()[1]["categories"] if c["id"] == category["id"])
        renamed = self.save("category.save", {"name": "Network Supply"}, record=retired)
        renamed = next(c for c in renamed["categories"] if c["id"] == category["id"])
        self.assertEqual(renamed["name"], "Network Supply")
        self.save("category.reactivate", {"confirmed": True}, record=renamed)
        self.save("supplier.save", self.company(name="New Supplier", categoryIds=[category["id"]]))

    def test_notes_attribution_and_permanent_retention_after_deletion(self):
        supplier = self.save("supplier.save", self.company(contacts=[CONTACT]))
        contact = supplier["contacts"][0]
        supplier = self.save("note.save", {"contactId": contact["id"], "text": "First conversation"}, supplier)
        note = supplier["notes"][0]
        edited = self.save("note.save", {"contactId": contact["id"], "text": "Correction"}, supplier, note, actor=1)
        correction = edited["notes"][0]
        self.assertEqual((correction["id"], correction["createdBy"], correction["createdAt"], correction["updatedBy"]),
                         (note["id"], "actor-2", note["createdAt"], "actor-1"))
        self.save("note.save", {"contactId": None, "text": "Move note"}, edited, note, status=400)
        self.save("note.delete", {"confirmed": False}, edited, note, status=400)
        deleted = self.save("note.delete", {"confirmed": True}, edited, note)
        self.assertEqual(deleted["notes"], [])
        self.save("contact.delete", {"confirmed": True}, deleted, contact, status=409)
        self.save("supplier.delete", {"confirmed": True}, deleted, status=409)
        with sqlite3.connect(self.db) as db:
            audit = json.loads(db.execute("SELECT record_json FROM inventory_change_history ORDER BY id DESC").fetchone()[0])
        self.assertEqual((audit["actor"], audit["changes"][0]["action"]), ("actor-2", "Deleted"))
        self.assertEqual(audit["changes"][0]["after"]["createdBy"], "actor-2")
        self.assertNotIn("Correction", json.dumps(audit))

    def test_safe_deletion_main_office_replacement_and_supply_restriction(self):
        supplier = self.save("supplier.save", self.company(contacts=[{**CONTACT, "companyWide": True}]))
        main = supplier["locations"][0]
        self.save("location.delete", {"confirmed": True}, supplier, main, status=409)
        supplier = self.save("location.save", {"name": "Replacement", "address": ADDRESS}, supplier)
        supplier = self.save("location.make-main", {"confirmed": True}, supplier, supplier["locations"][1])
        supplier = self.save("location.delete", {"confirmed": True}, supplier, main)
        self.assertEqual(len(supplier["locations"]), 1)
        self.assertEqual(self.save("supplier.delete", {"confirmed": True}, supplier)["suppliers"], [])
        supplier = self.save("supplier.save", self.company())
        with sqlite3.connect(self.db) as db:
            db.execute("INSERT INTO supplier_supply_history VALUES(?,'Devices')", (supplier["id"],))
            db.execute("INSERT INTO supplier_supply_history VALUES(?,'IT Assets')", (supplier["id"],))
        impact = f"{ROOT}/{supplier['id']}/impact"
        self.assertEqual(self.request(impact, actor=2)[0], 403)
        self.assertEqual(self.request(impact, actor=1)[1]["sections"], ["Devices", "IT Assets"])
        self.save("supplier.delete", {"confirmed": True}, supplier, status=409)
        self.save("supplier.disable", {"confirmed": True, "sections": ["Devices"]}, supplier, actor=1, status=409)
        self.save("supplier.disable", {"confirmed": True, "sections": ["Devices", "IT Assets"]}, supplier, status=403)
        disabled = self.save("supplier.disable", {"confirmed": True, "sections": ["Devices", "IT Assets"]}, supplier, actor=1)
        self.assertEqual(disabled["status"], "disabled")
        active = self.save("supplier.enable", {"confirmed": True, "sections": ["Devices", "IT Assets"]}, disabled, actor=1)
        self.assertEqual(active["status"], "active")
