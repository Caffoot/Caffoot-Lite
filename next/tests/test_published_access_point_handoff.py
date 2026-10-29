"""Published v1.3.3 Access Point review handoff, without persistence."""
import copy
import json
import unittest

from backend.import_review import (
    inspect_published_export_mounting, prepare_published_export_review,
)


def published_backup():
    return {
        "caffootBackup": {
            "format": "caffoot-inventory", "schemaVersion": 1,
            "app": "Caffoot Lite", "appVersion": "1.3.3",
            "exportedAt": "2026-10-29T12:00:00Z",
        },
        "devices": [{
            "id": "ap1", "name": "AP 1", "type": "Access Point",
            "mountType": "Rack Mounted", "rackId": "rack1",
            "rackUStart": 1, "rackUEnd": 1, "rackUHeight": 1,
            "location": "Racked",
        }],
        "racks": [{"id": "rack1", "name": "Main Rack", "heightU": 12}],
        "subnets": [], "vlans": [], "ipAllocations": {},
    }


class PublishedAccessPointHandoffTests(unittest.TestCase):
    def test_unreviewed_access_point_requires_choices_without_candidate(self):
        raw = json.dumps(published_backup()).encode()
        conflicts = inspect_published_export_mounting(raw)
        self.assertEqual(len(conflicts), 1)
        self.assertEqual(conflicts[0]["rack"], "Main Rack")
        review = prepare_published_export_review(raw)
        self.assertTrue(review["requiresAccessPointMountReview"])
        self.assertNotIn("candidate", review)
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])

    def test_explicit_choice_then_detached_review_does_not_modify_input(self):
        source = published_backup()
        original = copy.deepcopy(source)
        raw = json.dumps(source).encode()
        review = prepare_published_export_review(raw, ["Ceiling Mounted"])
        self.assertFalse(review["requiresAccessPointMountReview"])
        self.assertFalse(review["approved"])
        self.assertFalse(review["persistenceAllowed"])
        device = review["candidate"]["devices"][0]
        self.assertEqual(device["mountType"], "Ceiling Mounted")
        self.assertFalse(device.get("rackId"))
        self.assertEqual(device["location"], "Unknown")
        self.assertEqual(source, original)

    def test_invalid_and_incomplete_choices_rejected(self):
        raw = json.dumps(published_backup()).encode()
        for choices in ([], ["Rack Mounted"], ["Desktop", "Ceiling Mounted"]):
            with self.subTest(choices=choices):
                with self.assertRaises(ValueError):
                    prepare_published_export_review(raw, choices)

    def test_version_gate_runs_before_access_point_review(self):
        source = published_backup()
        source["caffootBackup"]["appVersion"] = "1.3.2"
        with self.assertRaisesRegex(ValueError, "v1.3.3 export"):
            inspect_published_export_mounting(json.dumps(source).encode())


if __name__ == "__main__":
    unittest.main()
