"""Published validateApplicationState detached regression coverage."""
import copy
import unittest

from backend.application_integrity import validate_detached_application_state


def state():
    return {
        "subnets": [{"id": "s", "name": "Office", "cidr": "10.0.0.0/24",
                     "gateway": "10.0.0.1", "vlan": 20}],
        "vlans": [],
        "racks": [{"id": "r", "heightU": 12}],
        "devices": [{"id": "d", "name": "Server", "type": "Server - Physical",
                     "mountType": "Rack Mounted", "rackId": "r",
                     "location": "Office", "rackUStart": 1, "rackUHeight": 2,
                     "rackUEnd": 2, "primaryIp": "10.0.0.10"}],
        "ipAllocations": {
            "10.0.0.10": {"deviceId": "d", "status": "Assigned"}
        },
    }


class ApplicationIntegrityTests(unittest.TestCase):
    def test_valid_state_and_no_mutation(self):
        source = state()
        before = copy.deepcopy(source)
        self.assertEqual(validate_detached_application_state(source), [])
        self.assertEqual(source, before)

    def test_duplicate_subnet_id(self):
        source = state()
        source["subnets"].append(dict(source["subnets"][0]))
        self.assertTrue(any("Duplicate or missing subnet ID" in e
                            for e in validate_detached_application_state(source)))

    def test_duplicate_vlan_number_in_same_domain(self):
        source = state()
        source["subnets"].append({
            "id": "s2", "name": "Other", "cidr": "10.0.1.0/24",
            "gateway": "10.0.1.1", "vlan": 20,
        })
        self.assertTrue(any("Invalid or duplicate VLAN" in e
                            for e in validate_detached_application_state(source)))

    def test_duplicate_device_id(self):
        source = state()
        source["devices"].append(dict(source["devices"][0]))
        self.assertTrue(any("Duplicate or missing device ID" in e
                            for e in validate_detached_application_state(source)))

    def test_blank_location(self):
        source = state()
        source["devices"][0]["location"] = "Blank"
        self.assertTrue(any("retired Blank location" in e
                            for e in validate_detached_application_state(source)))

    def test_missing_rack(self):
        source = state()
        source["devices"][0]["rackId"] = "missing"
        self.assertTrue(any("references a missing rack" in e
                            for e in validate_detached_application_state(source)))

    def test_inconsistent_rack_range(self):
        source = state()
        source["devices"][0]["rackUEnd"] = 4
        self.assertTrue(any("Rack U range is inconsistent" in e
                            for e in validate_detached_application_state(source)))

    def test_ipam_out_of_sync(self):
        source = state()
        source["ipAllocations"]["10.0.0.10"]["status"] = "Available"
        self.assertTrue(any("IPAM is out of sync" in e
                            for e in validate_detached_application_state(source)))

    def test_ipam_mismatch(self):
        source = state()
        source["ipAllocations"]["10.0.0.11"] = {
            "deviceId": "d", "status": "Assigned"
        }
        self.assertTrue(any("IPAM/device mismatch" in e
                            for e in validate_detached_application_state(source)))

    def test_outside_all_subnets(self):
        source = state()
        source["ipAllocations"]["10.1.0.1"] = {"status": "Available"}
        self.assertTrue(any("outside all configured subnets" in e
                            for e in validate_detached_application_state(source)))


if __name__ == "__main__":
    unittest.main()
