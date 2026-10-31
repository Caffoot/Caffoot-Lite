"""HTTP import routes: real handler dispatch with isolated SQLite storage."""
import io
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.request_auth import login, csrf_for_session
from backend.schema import initialise_database
from backend import server
from test_import_review import fixture

ORIGIN = "https://inventory.example"


class ImportHttpTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "inventory.sqlite"
        with sqlite3.connect(self.path) as db:
            initialise_database(db)
            admin, secret = bootstrap_first_admin(db, "owner", "password")
            confirm_admin_mfa(db, admin, code_at(secret, 59), timestamp=59)
            token = login(db, "192.0.2.200", "owner", "password",
                          mfa_code=code_at(secret, 59), now=59)
        self.cookie = COOKIE_NAME + "=" + token
        self.csrf = csrf_for_session(token)
        self.drafts = server.ImportDrafts()
        self.patches = [
            patch.object(server, "DB_PATH", self.path),
            patch.object(server, "PUBLIC_ORIGIN", ORIGIN),
            patch.object(server, "IMPORT_DRAFTS", self.drafts),
            patch("backend.sessions.time.time", return_value=60),
        ]
        for item in self.patches:
            item.start()

    def tearDown(self):
        for item in reversed(self.patches):
            item.stop()
        self.tmp.cleanup()

    def request(self, route, payload, *, csrf=None, origin=ORIGIN, cookie=None):
        handler = object.__new__(server.Handler)
        body = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
        handler.path = route
        handler.headers = {
            "Origin": origin,
            "Cookie": self.cookie if cookie is None else cookie,
            "X-CSRF-Token": self.csrf if csrf is None else csrf,
            "Content-Type": "application/octet-stream" if isinstance(payload, bytes) else "application/json",
            "Content-Length": str(len(body)),
        }
        handler.rfile = io.BytesIO(body)
        result = []
        handler.respond = lambda status, data, **kwargs: result.append((status, data))
        handler.do_POST()
        return result[0]

    def test_full_http_preview_confirm_and_no_replay(self):
        source = fixture()
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        raw = json.dumps(source).encode()
        status, preview = self.request("/api/import/preview", raw)
        self.assertEqual(status, 200, preview)
        self.assertNotIn("candidate", preview["review"])
        draft_id = preview["draftId"]
        status, _ = self.request("/api/import/confirm", {
            "draftId": draft_id, "replacementConfirmed": True,
        }, csrf="invalid")
        self.assertEqual(status, 403)
        status, result = self.request("/api/import/confirm", {
            "draftId": draft_id, "replacementConfirmed": True,
        })
        self.assertEqual(status, 200, result)
        self.assertEqual(result["status"], "imported")
        status, _ = self.request("/api/import/confirm", {
            "draftId": draft_id, "replacementConfirmed": True,
        })
        self.assertEqual(status, 400)
        with sqlite3.connect(self.path) as db:
            self.assertEqual(db.execute(
                "SELECT count(*) FROM inventory_devices"
            ).fetchone()[0], 1)

    def test_cross_origin_and_untrusted_client_candidate_rejected(self):
        status, _ = self.request("/api/import/preview", b"{}", origin="https://attacker.example")
        self.assertEqual(status, 403)
        status, _ = self.request("/api/import/confirm", {
            "draftId": "fake", "candidate": fixture(),
            "replacementConfirmed": True,
        })
        self.assertEqual(status, 400)


if __name__ == "__main__":
    unittest.main()
