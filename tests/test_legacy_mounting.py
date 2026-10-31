"""Published v1.3.3 legacy mounting review regression cases."""
import copy
import unittest

from backend.legacy_mounting import plan_legacy_computer_mounting_corrections


def data(device):
    return {"devices": [device], "racks": [{"id": "r", "name": "Rack A"}]}


class LegacyMountingTests(unittest.TestCase):
    def test_orphaned_laptop_rack_mount_requires_review(self):
        original = data({"id": "d", "name": "Laptop", "type": "Laptop",
                         "mountType": "Rack Mounted", "location": "Office",
                         "notes": "preserve"})
        before = copy.deepcopy(original)
        candidate, changes = plan_legacy_computer_mounting_corrections(original)
        self.assertEqual(len(changes), 1)
        self.assertEqual(changes[0]["proposedMountType"], "Desktop")
        self.assertEqual(candidate["devices"][0]["location"], "Unknown")
        self.assertEqual(candidate["devices"][0]["notes"], "preserve")
        self.assertEqual(original, before)

    def test_legacy_racked_location_keeps_recognised_mount(self):
        candidate, changes = plan_legacy_computer_mounting_corrections(data({
            "id": "d", "type": "Desktop", "name": "Workstation",
            "mountType": "Under-Desk Mounted", "location": "Racked",
        }))
        self.assertEqual(changes[0]["proposedMountType"], "Under-Desk Mounted")
        self.assertEqual(candidate["devices"][0]["mountType"], "Under-Desk Mounted")

    def test_rack_assigned_tablet_proposes_detachment(self):
        candidate, changes = plan_legacy_computer_mounting_corrections(data({
            "id": "d", "type": "Tablet", "name": "Tablet",
            "mountType": "Rack Mounted", "rackId": "r",
            "rackUStart": 1, "rackUEnd": 1, "rackUHeight": 1,
        }))
        self.assertEqual(changes[0]["rack"], "Rack A")
        self.assertEqual(candidate["devices"][0]["rackId"], "")
        self.assertIsNone(candidate["devices"][0]["rackUStart"])

    def test_noncomputer_rack_mount_is_not_repaired(self):
        original = data({"id": "d", "type": "Server", "name": "Server",
                         "mountType": "Rack Mounted", "rackId": "r"})
        candidate, changes = plan_legacy_computer_mounting_corrections(original)
        self.assertEqual(changes, [])
        self.assertEqual(candidate, original)

    def test_unrecognised_legacy_location_mount_not_silently_fixed(self):
        original = data({"id": "d", "type": "Laptop", "name": "Laptop",
                         "mountType": "Mystery", "location": "Racked"})
        candidate, changes = plan_legacy_computer_mounting_corrections(original)
        self.assertEqual(changes, [])
        self.assertEqual(candidate, original)

    def test_no_corrections_on_ordinary_computer(self):
        original = data({"id": "d", "type": "Desktop", "name": "Desktop",
                         "mountType": "Desktop", "location": "Office"})
        candidate, changes = plan_legacy_computer_mounting_corrections(original)
        self.assertEqual(changes, [])
        self.assertEqual(candidate, original)


if __name__ == "__main__":
    unittest.main()
