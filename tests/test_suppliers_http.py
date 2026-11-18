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
