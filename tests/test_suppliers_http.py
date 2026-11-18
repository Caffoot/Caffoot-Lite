"""Supplier HTTP journeys exercise access, validation, attribution and retention."""
import http.client
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
from unittest.mock import patch

from backend.http_security import COOKIE_NAME
from backend.request_auth import csrf_for_session
from backend.schema import initialise_database
from backend.server import Handler
from backend.sessions import _digest

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
            if operation.startswith("category."):
                payload["revision"] = record["revision"]
        code, result = self.request(actor=actor, payload=payload)
        self.assertEqual(code, status, result)
        return result

    def company(self, **options):
        return {"name": "Northlight Ltd", "website": "", "description": "",
                "address": dict(ADDRESS), "categoryIds": [], **options}

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
