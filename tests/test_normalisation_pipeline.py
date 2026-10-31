"""Detached normaliseState source-order integration regressions."""
import copy
import unittest

from backend.normalisation_pipeline import normalise_detached_v133_state


def base():
    return {
        "subnets": [{
            "id": "s", "name": "Office", "cidr": "192.168.4.0/24",
            "gateway": "192.168.4.1", "vlan": 20,
        }],
        "vlans": [{"id": "v", "name": "Office", "vlanId": 20}],
        "racks": [],
        "devices": [{
            "id": "d", "name": "Laptop", "type": "Laptop",
            "location": "Blank", "primaryIp": "192.168.4.10",
            "history": [{"action": "preserved"}],
        }],
        "ipAllocations": {
            "192.168.4.10": {
                "deviceId": "d", "status": "Available",
                "hostname": "Old", "notes": "keep",
            }
        },
        "hardwareSeedPreferences": {"keep": True},
    }


class DetachedPipelineTests(unittest.TestCase):
    def test_full_valid_candidate_preserves_and_repairs(self):
        source = base()
        before = copy.deepcopy(source)
        result = normalise_detached_v133_state(source)
        self.assertEqual(source, before)
        self.assertEqual(result["stateVersion"], 3)
        self.assertEqual(result["devices"][0]["location"], "Unknown")
        self.assertEqual(result["devices"][0]["history"], [{"action": "preserved"}])
        self.assertEqual(result["hardwareSeedPreferences"], {"keep": True})
        self.assertEqual(result["ipAllocations"]["192.168.4.10"]["notes"], "keep")
        self.assertEqual(result["ipAllocations"]["192.168.4.10"]["status"], "Assigned")
        self.assertEqual(result["ipAllocations"]["192.168.4.10"]["hostname"], "Laptop")

    def test_missing_required_array_not_hidden_by_defaults(self):
        source = base()
        del source["vlans"]
        with self.assertRaisesRegex(ValueError, "valid vlans array"):
            normalise_detached_v133_state(source)

    def test_missing_ipam_not_hidden_by_defaults(self):
        source = base()
        del source["ipAllocations"]
        with self.assertRaisesRegex(ValueError, "valid ipAllocations object"):
            normalise_detached_v133_state(source)

    def test_subnet_validation_before_vlan_validation(self):
        source = base()
        source["subnets"][0]["cidr"] = "not-cidr"
        source["vlans"][0]["vlanId"] = 9999
        with self.assertRaisesRegex(ValueError, "Every subnet must have"):
            normalise_detached_v133_state(source)

    def test_vlan_validation_before_device_validation(self):
        source = base()
        source["vlans"][0]["vlanId"] = 9999
        source["devices"][0]["name"] = ""
        with self.assertRaisesRegex(ValueError, "Invalid VLAN ID"):
            normalise_detached_v133_state(source)

    def test_device_validation_before_ipam_repair(self):
        source = base()
        source["devices"][0]["primaryIp"] = "invalid"
        before = copy.deepcopy(source)
        with self.assertRaisesRegex(ValueError, "Invalid primary IP"):
            normalise_detached_v133_state(source)
        self.assertEqual(source, before)

    def test_missing_device_ipam_link_rejected_before_repair(self):
        source = base()
        source["ipAllocations"]["192.168.4.10"]["deviceId"] = "missing"
        with self.assertRaisesRegex(ValueError, "references missing device"):
            normalise_detached_v133_state(source)

    def test_missing_allocation_created_after_validation(self):
        source = base()
        source["ipAllocations"] = {}
        result = normalise_detached_v133_state(source)
        self.assertEqual(result["ipAllocations"]["192.168.4.10"]["deviceId"], "d")

    def test_rejects_unrelated_overlapping_subnets(self):
        source = base()
        source["subnets"].append({
            "id": "s2", "name": "Other", "cidr": "192.168.4.0/25",
            "gateway": "192.168.4.2", "vlan": 21,
        })
        with self.assertRaisesRegex(ValueError, "Every subnet must have|Overlapping"):
            normalise_detached_v133_state(source)

    def test_default_managed_values_come_from_published_source(self):
        result = normalise_detached_v133_state(base())
        self.assertIn("Server - Physical", result["deviceTypes"])
        self.assertEqual(result["deviceLocations"], ["Unknown"])
        self.assertEqual(result["serverFunctions"], [])
        self.assertFalse(result["managedOptionsCleared"])


if __name__ == "__main__":
    unittest.main()
