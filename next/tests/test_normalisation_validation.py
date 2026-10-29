"""Published normaliseState VLAN and device/rack validation regressions."""
import unittest

from backend.normalisation_validation import (
    validate_normalisation_devices, validate_normalisation_vlans,
)


def candidate():
    return {"vlans": [{"id": "v", "name": "Office", "vlanId": 20}],
            "devices": [{"id": "d", "name": "Router", "type": "Router",
                         "mountType": "Desktop", "location": "Office"}],
            "racks": [{"id": "r", "name": "Rack", "heightU": 12}]}


class NormalisationValidationTests(unittest.TestCase):
    def test_valid_records(self):
        state = candidate()
        validate_normalisation_vlans(state)
        validate_normalisation_devices(state)

    def test_duplicate_vlan_id(self):
        state = candidate()
        state["vlans"].append({"id": "v", "name": "Other", "vlanId": 21})
        with self.assertRaisesRegex(ValueError, "Duplicate VLAN ID"):
            validate_normalisation_vlans(state)

    def test_duplicate_vlan_number_same_parent(self):
        state = candidate()
        state["vlans"].append({"id": "v2", "name": "Other", "vlanId": "20"})
        with self.assertRaisesRegex(ValueError, "Duplicate VLAN number"):
            validate_normalisation_vlans(state)

    def test_same_vlan_number_different_parent_allowed(self):
        state = candidate()
        state["vlans"][0]["parentId"] = "a"
        state["vlans"].append({"id": "v2", "name": "Other",
                               "vlanId": 20, "parentId": "b"})
        validate_normalisation_vlans(state)

    def test_invalid_vlan_range(self):
        state = candidate()
        state["vlans"][0]["vlanId"] = 4095
        with self.assertRaisesRegex(ValueError, "Invalid VLAN ID"):
            validate_normalisation_vlans(state)

    def test_duplicate_device_id(self):
        state = candidate()
        state["devices"].append(dict(state["devices"][0]))
        with self.assertRaisesRegex(ValueError, "Duplicate device ID"):
            validate_normalisation_devices(state)

    def test_rack_assignment_requires_rack_mount(self):
        state = candidate()
        state["devices"][0]["rackId"] = "r"
        with self.assertRaisesRegex(ValueError, "not Rack Mounted"):
            validate_normalisation_devices(state)

    def test_valid_rack_position(self):
        state = candidate()
        state["devices"][0].update({
            "rackId": "r", "mountType": "Rack Mounted", "rackUStart": 3,
            "rackUHeight": 2, "rackUEnd": 4, "face": "rear",
        })
        validate_normalisation_devices(state)

    def test_rack_end_inconsistent(self):
        state = candidate()
        state["devices"][0].update({
            "rackId": "r", "mountType": "Rack Mounted", "rackUStart": 3,
            "rackUHeight": 2, "rackUEnd": 5,
        })
        with self.assertRaisesRegex(ValueError, "Rack end U"):
            validate_normalisation_devices(state)

    def test_rack_capacity(self):
        state = candidate()
        state["devices"][0].update({
            "rackId": "r", "mountType": "Rack Mounted", "rackUStart": 12,
            "rackUHeight": 2, "rackUEnd": 13,
        })
        with self.assertRaisesRegex(ValueError, "exceeds rack capacity"):
            validate_normalisation_devices(state)

    def test_invalid_primary_ip(self):
        state = candidate()
        state["devices"][0]["primaryIp"] = "not-an-ip"
        with self.assertRaisesRegex(ValueError, "Invalid primary IP"):
            validate_normalisation_devices(state)


if __name__ == "__main__":
    unittest.main()
