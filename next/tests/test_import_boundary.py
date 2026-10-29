"""Regression checks for the detached SQLite import boundary.

These tests intentionally do not claim to reproduce v1.3.3 UI validation.
They verify transactionality, historical field preservation, and isolation
from future user/security data and separately stored audit history.
"""
import copy
import json
import sqlite3
import unittest

from backend.inventory import ImportRejected, inspect_export, inspect_device_mounts, inspect_import_relationships, preview_inventory_counts, reconstruct_inventory, stage_inventory
from backend.schema import initialise_database
from test_inventory import fixture


class ImportBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialise_database(self.db)

    def tearDown(self):
        self.db.close()

    def test_failed_second_import_preserves_all_collections_and_settings(self):
        good = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, good)
        before = reconstruct_inventory(self.db)
        bad = copy.deepcopy(good)
        bad["subnets"] = [{"id": "subnet-1", "name": "lab"}]
        bad["racks"] = [{"id": "rack-1", "name": "cabinet"}]
        bad["devices"].append({"id": "d2", "name": "LAB-01"})
        bad["hardwareSeedPreferences"] = {"overwritten": True}
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_missing_device_id_rolls_back_everything(self):
        good = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, good)
        before = reconstruct_inventory(self.db)
        bad = copy.deepcopy(good)
        bad["devices"] = [{"name": "missing identifier"}]
        with self.assertRaisesRegex(ImportRejected, "Missing ID"):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_case_insensitive_name_collision_rolls_back(self):
        good = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, good)
        before = reconstruct_inventory(self.db)
        bad = copy.deepcopy(good)
        bad["devices"].append({"id": "d2", "name": "lab-01"})
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_inventory_replacement_does_not_clear_change_history(self):
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"at": "2026-10-29", "reason": "prior change"}),),
        )
        self.db.commit()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        history = self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchall()
        self.assertEqual(len(history), 1)
        self.assertEqual(json.loads(history[0][0])["reason"], "prior change")

    def test_inspection_and_staging_do_not_mutate_source(self):
        original = fixture()
        original["devices"][0]["typeDetails"]["nested"] = [
            {"enabled": False, "value": None}
        ]
        untouched = copy.deepcopy(original)
        inspected = inspect_export(json.dumps(original).encode())
        self.assertEqual(original, untouched)
        stage_inventory(self.db, inspected)
        self.assertEqual(inspected, untouched)
        self.assertEqual(original, untouched)

    def test_staging_does_not_commit_a_rejected_replacement(self):
        first = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, first)
        before = reconstruct_inventory(self.db)
        replacement = copy.deepcopy(first)
        replacement["devices"][0]["name"] = "REPLACED"
        replacement["rackAccessories"] = [{"id": "accessory-1", "rackId": "rack-1"}]
        replacement["devices"].append({"id": "d2", "name": ""})
        with self.assertRaisesRegex(ImportRejected, "Missing device name"):
            stage_inventory(self.db, replacement)
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_failed_import_does_not_erase_change_history(self):
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"reason": "before rejected import"}),),
        )
        self.db.commit()
        bad = fixture()
        bad["devices"].append({"id": "d1", "name": "collision"})
        with self.assertRaises(sqlite3.IntegrityError):
            stage_inventory(self.db, bad)
        rows = self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchall()
        self.assertEqual(len(rows), 1)
        self.assertEqual(json.loads(rows[0][0])["reason"], "before rejected import")


    def test_cancelled_review_never_reaches_database_staging(self):
        """Cancellation at confirmation leaves existing inventory untouched."""
        from backend.import_review import prepare_published_export_review
        from test_import_review import fixture as review_fixture
        current = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, current)
        before = reconstruct_inventory(self.db)
        candidate = review_fixture()
        candidate["caffootBackup"] = fixture()["caffootBackup"]
        review = prepare_published_export_review(json.dumps(candidate).encode())
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        self.assertFalse(review["requiresLegacyMountReview"])
        self.assertFalse(review["requiresAccessPointMountReview"])
        # The user cancels: no stage_inventory call occurs.
        self.assertEqual(reconstruct_inventory(self.db), before)

    def test_late_sqlite_failure_rolls_back_all_inventory_sections(self):
        """An error after replacement starts cannot partially restore inventory."""
        original = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, original)
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"reason": "existing history"}),),
        )
        self.db.commit()
        before = reconstruct_inventory(self.db)
        history_before = self.db.execute(
            "SELECT record_json FROM inventory_change_history"
        ).fetchall()
        replacement = copy.deepcopy(original)
        replacement["devices"][0]["name"] = "REPLACEMENT"
        replacement["extraHistoricalOption"] = {"new": "value"}
        replacement["ipAllocations"]["192.0.2.5"] = {"status": "Available"}
        self.db.execute("""
            CREATE TRIGGER fail_late_allocation
            BEFORE INSERT ON inventory_ip_allocations
            WHEN NEW.ip = '192.0.2.5'
            BEGIN SELECT RAISE(ABORT, 'injected late failure'); END
        """)
        with self.assertRaisesRegex(sqlite3.IntegrityError, "injected late failure"):
            stage_inventory(self.db, replacement)
        self.assertEqual(reconstruct_inventory(self.db), before)
        self.assertEqual(
            self.db.execute("SELECT record_json FROM inventory_change_history").fetchall(),
            history_before,
        )


    def test_reviewed_candidate_replaces_inventory_but_not_security(self):
        """Detached v1.3.3 candidate can replace data without changing users."""
        from backend.import_review import prepare_published_export_review
        from test_import_review import fixture as review_fixture
        self.db.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES('admin','hash',1,'secret',1)"
        )
        self.db.execute(
            "INSERT INTO account_permissions(account_id,section,level) "
            "VALUES(1,'Devices','edit')"
        )
        self.db.execute(
            "INSERT INTO account_sessions(token_hash,account_id,expires_at,created_at) "
            "VALUES('session',1,9999999999,1)"
        )
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"reason": "previous inventory activity"}),),
        )
        self.db.commit()
        original = inspect_export(json.dumps(fixture()).encode())
        stage_inventory(self.db, original)
        security_tables = (
            "accounts", "account_permissions", "account_sessions",
            "inventory_change_history",
        )
        before_security = {
            table: self.db.execute("SELECT * FROM " + table).fetchall()
            for table in security_tables
        }
        source = review_fixture()
        source["caffootBackup"] = fixture()["caffootBackup"]
        review = prepare_published_export_review(json.dumps(source).encode())
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        # This is an isolated database-layer test, not an import approval flow.
        stage_inventory(self.db, review["candidate"])
        restored = reconstruct_inventory(self.db)
        self.assertEqual(restored["devices"], review["candidate"]["devices"])
        self.assertEqual(restored["ipAllocations"], review["candidate"]["ipAllocations"])
        for table in security_tables:
            self.assertEqual(
                self.db.execute("SELECT * FROM " + table).fetchall(),
                before_security[table],
            )


    def test_failed_reviewed_replacement_preserves_security_and_inventory(self):
        """Late failure during reviewed staging leaves all existing data intact."""
        from backend.import_review import prepare_published_export_review
        from test_import_review import fixture as review_fixture

        self.db.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
            "VALUES('admin','hash',1,'secret',1)"
        )
        self.db.execute(
            "INSERT INTO account_permissions(account_id,section,level) "
            "VALUES(1,'IPAM','edit')"
        )
        self.db.execute(
            "INSERT INTO account_sessions(token_hash,account_id,expires_at,created_at) "
            "VALUES('session',1,9999999999,1)"
        )
        self.db.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps({"reason": "existing change"}),),
        )
        self.db.commit()
        stage_inventory(self.db, inspect_export(json.dumps(fixture()).encode()))
        before_inventory = reconstruct_inventory(self.db)
        protected = ("accounts", "account_permissions", "account_sessions",
                     "inventory_change_history")
        before_protected = {
            table: self.db.execute("SELECT * FROM " + table).fetchall()
            for table in protected
        }
        source = review_fixture()
        source["caffootBackup"] = fixture()["caffootBackup"]
        review = prepare_published_export_review(json.dumps(source).encode())
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        # Inject failure after inventory rows have begun replacing the old state.
        self.db.execute("""
            CREATE TRIGGER fail_reviewed_restore
            BEFORE INSERT ON inventory_ip_allocations
            BEGIN SELECT RAISE(ABORT, 'simulated disk failure'); END
        """)
        with self.assertRaisesRegex(sqlite3.IntegrityError, "simulated disk failure"):
            stage_inventory(self.db, review["candidate"])
        self.assertEqual(reconstruct_inventory(self.db), before_inventory)
        for table in protected:
            self.assertEqual(
                self.db.execute("SELECT * FROM " + table).fetchall(),
                before_protected[table],
            )

    def test_replacement_preview_counts_without_writing_inventory(self):
        current = fixture()
        candidate = copy.deepcopy(current)
        candidate["devices"].append({"id": "d2", "name": "LAB-02"})
        candidate["racks"].append({"id": "r1", "name": "RACK-01"})
        candidate["subnets"].append({"id": "s1", "name": "NET-01"})
        candidate["ipAllocations"]["192.0.2.5"] = {"status": "Available"}
        before_candidate = copy.deepcopy(candidate)
        before_current = copy.deepcopy(current)
        preview = preview_inventory_counts(candidate, current)
        self.assertEqual(preview, {
            "backup": {"devices": 2, "racks": 1, "subnets": 1, "ipAllocations": 2},
            "current": {"devices": 1, "racks": 0, "subnets": 0},
        })
        self.assertEqual(candidate, before_candidate)
        self.assertEqual(current, before_current)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM inventory_devices").fetchone()[0], 0
        )

    def test_preview_does_not_imply_import_approval(self):
        invalid = fixture()
        invalid["devices"].append({"id": "d1", "name": "duplicate"})
        preview = preview_inventory_counts(invalid, fixture())
        self.assertEqual(preview["backup"]["devices"], 2)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM inventory_devices").fetchone()[0], 0
        )

    def test_detached_relationship_diagnostics_find_source_defined_conflicts(self):
        data = fixture()
        data["devices"].append({"id": "d1", "name": "LAB-02", "primaryIp": "192.0.2.4"})
        data["devices"][0]["primaryIp"] = "192.0.2.4"
        data["devices"][0]["rackId"] = "missing-rack"
        data["ipAllocations"]["192.0.2.5"] = {
            "deviceId": "missing-device", "status": "Assigned"
        }
        original = copy.deepcopy(data)
        issues = inspect_import_relationships(data)
        self.assertTrue(any("Duplicate devices ID" in issue for issue in issues))
        self.assertTrue(any("Duplicate primary IP" in issue for issue in issues))
        self.assertTrue(any("IPAM is out of sync" in issue for issue in issues))
        self.assertTrue(any("missing rack" in issue for issue in issues))
        self.assertTrue(any("missing device" in issue for issue in issues))
        self.assertEqual(data, original)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM inventory_devices").fetchone()[0], 0
        )

    def test_detached_relationship_diagnostics_allow_unlinked_available_ip(self):
        data = fixture()
        self.assertEqual(inspect_import_relationships(data), [])

    def test_published_mount_types_are_all_accepted_without_type_restrictions(self):
        data = fixture()
        mounts = (
            "Desktop", "Tabletop / Shelf Mounted", "Shelf Mounted",
            "Rack Mounted", "Wall Mounted", "Ceiling Mounted", "Pole Mounted",
            "DIN Rail Mounted", "Under-Desk Mounted", "Floor Standing",
            "Tower / Floor Standing", "Handheld", "Mobile", "Vehicle Mounted",
            "Not Applicable", "Unknown",
        )
        data["devices"] = [
            {"id": str(i), "name": "DEVICE-" + str(i), "type": "Laptop",
             "mountType": mount}
            for i, mount in enumerate(mounts)
        ]
        self.assertEqual(inspect_device_mounts(data), [])

    def test_mount_diagnostics_preserve_source_and_reject_unknown_mount(self):
        data = fixture()
        data["devices"][0]["mountType"] = "Unrecognised Mount"
        untouched = copy.deepcopy(data)
        self.assertEqual(inspect_device_mounts(data), [data["devices"][0]])
        self.assertEqual(data, untouched)

    def test_missing_mount_uses_published_rack_or_desktop_fallback(self):
        data = fixture()
        self.assertEqual(inspect_device_mounts(data), [])
        data["devices"][0]["rackId"] = "rack-1"
        self.assertEqual(inspect_device_mounts(data), [])

    def test_optional_unknown_top_level_fields_survive(self):
        data = fixture()
        data["futureUnrecognisedState"] = {
            "nested": [{"value": None, "flag": False, "count": 0}],
            "unicode": "Café – 日本語",
        }
        data["devices"][0]["historicalOptionalField"] = {
            "old": ["A", "B", "A"], "empty": ""
        }
        original = inspect_export(json.dumps(data, ensure_ascii=False).encode())
        stage_inventory(self.db, original)
        expected = {k: v for k, v in original.items() if k != "caffootBackup"}
        self.assertEqual(reconstruct_inventory(self.db), expected)


if __name__ == "__main__":
    unittest.main()
