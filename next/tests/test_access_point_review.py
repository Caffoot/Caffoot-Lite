"""Focused published Access Point correction parity and cancellation safety."""
import copy
import unittest

from backend.access_point_review import (
    AP_CHOICES, find_access_point_mount_conflicts,
    apply_access_point_mount_choices,
)


class AccessPointReviewTests(unittest.TestCase):
    def test_review_matches_published_raw_conflicts_and_preserves_source(self):
        raw = {
            "racks": [{"id": "r", "name": "Rack"}],
            "devices": [
                {"id": "ap", "name": "AP", "type": "Wireless Access Point",
                 "mountType": "Rack Mounted", "rackId": "r",
                 "location": "Racked", "rackUStart": 1},
                {"id": "ok", "type": "AP", "mountType": "Desktop"},
                {"id": "router", "type": "Router", "mountType": "Rack Mounted",
                 "rackId": "r"},
            ],
        }
        before = copy.deepcopy(raw)
        conflicts = find_access_point_mount_conflicts(raw)
        self.assertEqual([c["id"] for c in conflicts], ["ap"])
        self.assertEqual(conflicts[0]["rack"], "Rack")
        self.assertEqual(raw, before)
        fixed = apply_access_point_mount_choices(raw, conflicts, ["Ceiling Mounted"])
        self.assertEqual(raw, before)
        self.assertEqual(fixed["devices"][0]["mountType"], "Ceiling Mounted")
        self.assertEqual(fixed["devices"][0]["location"], "Unknown")
        self.assertEqual(fixed["devices"][0]["rackId"], "")
        self.assertIsNone(fixed["devices"][0]["rackUStart"])
        self.assertEqual(fixed["devices"][1], raw["devices"][1])
        self.assertEqual(fixed["devices"][2], raw["devices"][2])

    def test_incomplete_or_invalid_choices_do_not_change_source(self):
        raw = {"racks": [], "devices": [
            {"id": "ap", "type": "Access Point", "mountType": "Invalid"}
        ]}
        before = copy.deepcopy(raw)
        conflicts = find_access_point_mount_conflicts(raw)
        for choices in ([], ["Rack Mounted"], ["Invalid"], [None]):
            with self.assertRaises(ValueError):
                apply_access_point_mount_choices(raw, conflicts, choices)
        self.assertEqual(raw, before)
        self.assertEqual(len(AP_CHOICES), 5)


if __name__ == "__main__":
    unittest.main()
