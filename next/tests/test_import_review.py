"""Read-only import review orchestration regression tests."""
import copy
import json
import unittest

from backend.import_review import prepare_detached_import_review, prepare_published_export_review, confirm_detached_import_review
from backend.inventory import preview_inventory_counts


def fixture():
    return {
        "subnets": [{"id": "s", "name": "Office", "cidr": "10.0.0.0/24",
                     "gateway": "10.0.0.1", "vlan": 20}],
        "vlans": [{"id": "v", "name": "Office", "vlanId": 20}],
        "racks": [],
        "devices": [{"id": "d", "name": "PC", "type": "Desktop",
                     "mountType": "Desktop", "location": "Office",
                     "primaryIp": "10.0.0.10"}],
        "ipAllocations": {"10.0.0.10": {"status": "Assigned",
                                       "deviceId": "d", "notes": "keep"}},
    }


class ImportReviewTests(unittest.TestCase):

    def test_explicit_confirmation_required_for_normal_import(self):
        review = prepare_detached_import_review(fixture())
        with self.assertRaisesRegex(ValueError, "explicit confirmation"):
            confirm_detached_import_review(review)
        candidate = confirm_detached_import_review(
            review, replacement_confirmed=True
        )
        self.assertIs(candidate, review["candidate"])
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])

    def test_mounting_decisions_cannot_be_skipped(self):
        pending_ap = {
            "requiresAccessPointMountReview": True,
            "approved": False, "persistenceAllowed": False,
        }
        with self.assertRaisesRegex(ValueError, "Access Point"):
            confirm_detached_import_review(
                pending_ap, replacement_confirmed=True
            )
        pending_legacy = prepare_detached_import_review(fixture())
        pending_legacy["requiresLegacyMountReview"] = True
        with self.assertRaisesRegex(ValueError, "Legacy mounting"):
            confirm_detached_import_review(
                pending_legacy, replacement_confirmed=True
            )
        self.assertIs(
            confirm_detached_import_review(
                pending_legacy, legacy_mount_approved=True,
                replacement_confirmed=True,
            ),
            pending_legacy["candidate"],
        )
        self.assertFalse(pending_legacy["persistenceAllowed"])

    def test_confirmation_rejects_missing_candidate(self):
        with self.assertRaisesRegex(ValueError, "validated import candidate"):
            confirm_detached_import_review(
                {"approved": True, "persistenceAllowed": True},
                replacement_confirmed=True,
            )

    def test_normal_published_export_preserves_custom_inventory_fields(self):
        source = fixture()
        source["devices"][0]["assetTag"] = "ASSET-204"
        source["devices"][0]["notes"] = "Keep this exact note"
        source["ipAllocations"]["10.0.0.10"]["notes"] = "Reserved for office"
        source["customInventorySetting"] = {"nested": ["keep", 42]}
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        original = copy.deepcopy(source)
        review = prepare_published_export_review(json.dumps(source).encode("utf-8"))
        self.assertEqual(source, original)
        self.assertFalse(review["requiresAccessPointMountReview"])
        self.assertFalse(review["requiresLegacyMountReview"])
        self.assertEqual(review["legacyMountRepairs"], [])
        self.assertEqual(review["candidate"]["devices"][0]["assetTag"], "ASSET-204")
        self.assertEqual(review["candidate"]["devices"][0]["notes"], "Keep this exact note")
        self.assertEqual(
            review["candidate"]["ipAllocations"]["10.0.0.10"]["notes"],
            "Reserved for office",
        )
        self.assertEqual(
            review["candidate"]["customInventorySetting"],
            {"nested": ["keep", 42]},
        )
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])

    def test_restore_confirmation_counts_match_published_v133(self):
        candidate = fixture()
        current = fixture()
        current["devices"].append({"id": "second", "name": "Second"})
        current["racks"] = [{"id": "rack"}]
        before = copy.deepcopy((candidate, current))
        preview = preview_inventory_counts(candidate, current)
        self.assertEqual(preview["backup"], {
            "devices": 1, "racks": 0, "subnets": 1, "ipAllocations": 1,
        })
        self.assertEqual(preview["current"], {
            "devices": 2, "racks": 1, "subnets": 1,
        })
        self.assertEqual((candidate, current), before)

    def test_published_export_gate_precedes_detached_review(self):
        source = fixture()
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        raw = json.dumps(source).encode("utf-8")
        review = prepare_published_export_review(raw)
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        self.assertEqual(review["candidate"]["devices"][0]["name"], "PC")
        source["caffootBackup"]["appVersion"] = "1.3.2"
        with self.assertRaisesRegex(ValueError, "v1.3.3 export"):
            prepare_published_export_review(json.dumps(source).encode("utf-8"))

    def test_access_point_review_blocks_candidate_until_choices_supplied(self):
        source = fixture()
        source["devices"][0].update({
            "type": "Access Point", "mountType": "Desktop",
        })
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        raw = json.dumps(source).encode("utf-8")
        review = prepare_published_export_review(raw)
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        if review["requiresAccessPointMountReview"]:
            self.assertTrue(review["accessPointMountConflicts"])
            self.assertNotIn("candidate", review)

    def test_unrequested_access_point_choices_are_rejected(self):
        source = fixture()
        source["caffootBackup"] = {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        }
        with self.assertRaisesRegex(ValueError, "No Access Point mounting choices"):
            prepare_published_export_review(
                json.dumps(source).encode("utf-8"),
                access_point_choices={"unexpected": "Desktop"},
            )

    def test_candidate_is_detached_and_never_approved(self):
        source = fixture()
        original = copy.deepcopy(source)
        review = prepare_detached_import_review(source)
        self.assertEqual(source, original)
        self.assertIsNot(review["candidate"], source)
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        self.assertFalse(review["requiresLegacyMountReview"])
        self.assertEqual(review["diagnostics"]["ipam"], [])

    def test_legacy_computer_correction_is_proposed_not_approved(self):
        source = fixture()
        source["devices"][0].update({
            "type": "Laptop", "mountType": "Rack Mounted",
            "rackId": "", "location": "Racked",
        })
        original = copy.deepcopy(source)
        review = prepare_detached_import_review(source)
        self.assertEqual(source, original)
        self.assertTrue(review["requiresLegacyMountReview"])
        self.assertEqual(len(review["legacyMountRepairs"]), 1)
        self.assertEqual(
            review["candidate"]["devices"][0]["mountType"], "Desktop"
        )
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])

    def test_review_does_not_mutate_original_on_validation_failure(self):
        source = fixture()
        source["devices"][0]["primaryIp"] = "198.51.100.99"
        original = copy.deepcopy(source)
        with self.assertRaises(ValueError):
            prepare_detached_import_review(source)
        self.assertEqual(source, original)

    def test_review_of_ordinary_inventory_requires_no_mount_corrections(self):
        source = fixture()
        review = prepare_detached_import_review(source)
        self.assertEqual(review["legacyMountRepairs"], [])
        self.assertFalse(review["requiresLegacyMountReview"])
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])

    def test_mounting_review_is_explicitly_required(self):
        source = fixture()
        source["devices"][0].update({"mountType": "Rack Mounted", "location": "Racked"})
        review = prepare_detached_import_review(source)
        self.assertTrue(review["requiresLegacyMountReview"])
        self.assertTrue(review["legacyMountRepairs"])
        self.assertEqual(review["candidate"]["devices"][0]["mountType"], "Desktop")
        self.assertEqual(source["devices"][0]["mountType"], "Rack Mounted")
        self.assertFalse(review["persistenceAllowed"])

    def test_invalid_subnet_rejected_without_mutation(self):
        source = fixture()
        source["subnets"][0]["cidr"] = "invalid"
        original = copy.deepcopy(source)
        with self.assertRaises(ValueError):
            prepare_detached_import_review(source)
        self.assertEqual(source, original)

    def test_rack_conflicts_are_reported_not_approved(self):
        source = fixture()
        source["racks"] = [{"id": "r", "heightU": 12}]
        source["devices"] = [
            {"id": "a", "name": "A", "type": "Server - Physical",
             "mountType": "Rack Mounted", "rackId": "r",
             "location": "Office", "rackUStart": 1, "rackUHeight": 2, "rackUEnd": 2},
            {"id": "b", "name": "B", "type": "Server - Physical",
             "mountType": "Rack Mounted", "rackId": "r",
             "location": "Office", "rackUStart": 2, "rackUHeight": 2, "rackUEnd": 3},
        ]
        source["ipAllocations"] = {}
        with self.assertRaisesRegex(ValueError, "overlaps"):
            prepare_detached_import_review(source)

    def test_ipam_notes_survive_review(self):
        review = prepare_detached_import_review(fixture())
        self.assertEqual(review["candidate"]["ipAllocations"]["10.0.0.10"]["notes"], "keep")


if __name__ == "__main__":
    unittest.main()
