"""Published v1.3.3 findRackImportConflicts regression examples."""
import copy
import unittest

from backend.rack_validation import find_rack_import_conflicts


def candidate():
    return {
        "racks": [{"id": "rack-1", "heightU": 12}],
        "devices": [{"id": "d1", "name": "Switch", "rackId": "rack-1",
                     "face": "front", "rackUStart": 1, "rackUHeight": 2}],
        "rackAccessories": [],
    }


def accessory(name, kind, start=1, face="front", side=None):
    record = {"id": name, "name": name, "rackId": "rack-1",
              "type": kind, "face": face, "startU": start, "heightU": 1}
    if side is not None:
        record["side"] = side
    return record


class RackConflictTests(unittest.TestCase):
    def test_overlapping_front_equipment_conflicts(self):
        data = candidate()
        data["rackAccessories"].append(accessory("Panel", "blank"))
        self.assertEqual(find_rack_import_conflicts(data),
                         ["Accessory Panel overlaps Device Switch."])

    def test_rear_face_does_not_conflict_with_front(self):
        data = candidate()
        data["rackAccessories"].append(accessory("Panel", "blank", face="rear"))
        self.assertEqual(find_rack_import_conflicts(data), [])

    def test_vertical_side_rails_are_independent_of_horizontal_units(self):
        data = candidate()
        data["rackAccessories"].extend([
            accessory("Left PDU", "pdu_vertical", side="left"),
            accessory("Right PDU", "pdu_vertical", side="right"),
        ])
        self.assertEqual(find_rack_import_conflicts(data), [])

    def test_same_vertical_rail_overlap_conflicts(self):
        data = candidate()
        data["rackAccessories"].extend([
            accessory("Left PDU", "pdu_vertical", side="left"),
            accessory("Left Cable", "cable_vertical", side="left"),
        ])
        self.assertEqual(find_rack_import_conflicts(data),
                         ["Accessory Left Cable overlaps Accessory Left PDU."])

    def test_missing_rack_and_out_of_bounds(self):
        data = candidate()
        data["devices"][0]["rackId"] = "missing"
        data["rackAccessories"].append(accessory("Too high", "shelf", start=13))
        self.assertEqual(find_rack_import_conflicts(data), [
            "Device Switch references a missing rack.",
            "Accessory Too high has an invalid rack U position.",
        ])

    def test_accessory_type_side_and_duplicate_id(self):
        data = candidate()
        data["devices"] = []
        data["rackAccessories"] = [
            accessory("A", "unknown"),
            accessory("A", "pdu_vertical"),
        ]
        self.assertEqual(find_rack_import_conflicts(data), [
            "Accessory A has an unsupported accessory type.",
            "Accessory A has a missing or duplicate ID.",
            "Accessory A has an invalid side rail.",
        ])

    def test_diagnostic_does_not_mutate_inventory(self):
        data = candidate()
        data["rackAccessories"].append(accessory("Panel", "blank"))
        original = copy.deepcopy(data)
        find_rack_import_conflicts(data)
        self.assertEqual(data, original)


if __name__ == "__main__":
    unittest.main()
