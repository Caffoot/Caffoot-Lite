"""Regression coverage for v1.3.3 IPAM ownership and usable-address rules."""
import copy
import unittest

from backend.ipam_validation import inspect_ipam_integrity, ip_belongs_to_subnet


def inventory():
    return {
        "subnets": [{"id": "s", "cidr": "192.0.2.0/24"}],
        "devices": [{"id": "d", "name": "Router", "primaryIp": "192.0.2.4"}],
        "ipAllocations": {
            "192.0.2.4": {"deviceId": "d", "status": "Assigned", "notes": "keep"},
        },
    }


class IpamIntegrityTests(unittest.TestCase):
    def test_valid_assignment(self):
        self.assertEqual(inspect_ipam_integrity(inventory()), [])

    def test_reserved_status(self):
        data = inventory()
        data["devices"][0]["ipReserved"] = True
        data["ipAllocations"]["192.0.2.4"]["status"] = "Reserved"
        self.assertEqual(inspect_ipam_integrity(data), [])

    def test_duplicate_primary_address(self):
        data = inventory()
        data["devices"].append({"id": "e", "name": "Other", "primaryIp": "192.0.2.4"})
        issues = inspect_ipam_integrity(data)
        self.assertIn("Duplicate primary IP: 192.0.2.4.", issues)
        self.assertIn("IPAM is out of sync for Other (192.0.2.4).", issues)

    def test_missing_and_mismatched_allocation(self):
        data = inventory()
        data["ipAllocations"].clear()
        self.assertEqual(inspect_ipam_integrity(data),
                         ["IPAM is out of sync for Router (192.0.2.4)."])

    def test_orphaned_allocation(self):
        data = inventory()
        data["ipAllocations"]["192.0.2.5"] = {"deviceId": "missing", "status": "Assigned"}
        self.assertIn("IPAM allocation 192.0.2.5 references a missing device.",
                      inspect_ipam_integrity(data))

    def test_allocation_to_wrong_primary_address(self):
        data = inventory()
        data["ipAllocations"]["192.0.2.5"] = {"deviceId": "d", "status": "Assigned"}
        self.assertIn("IPAM/device mismatch for 192.0.2.5.",
                      inspect_ipam_integrity(data))

    def test_outside_subnet(self):
        data = inventory()
        data["ipAllocations"]["198.51.100.4"] = {"status": "Available"}
        self.assertIn("IPAM allocation 198.51.100.4 is outside all configured subnets.",
                      inspect_ipam_integrity(data))

    def test_published_usable_host_limits(self):
        self.assertTrue(ip_belongs_to_subnet("192.0.2.1", "192.0.2.0/24"))
        self.assertTrue(ip_belongs_to_subnet("192.0.2.254", "192.0.2.0/24"))
        self.assertFalse(ip_belongs_to_subnet("192.0.2.0", "192.0.2.0/24"))
        self.assertFalse(ip_belongs_to_subnet("192.0.2.255", "192.0.2.0/24"))
        self.assertFalse(ip_belongs_to_subnet("192.0.2.1", "192.0.2.0/22"))
        self.assertFalse(ip_belongs_to_subnet("192.0.2.1", "192.0.2.1/24"))

    def test_notes_and_candidate_are_untouched(self):
        data = inventory()
        original = copy.deepcopy(data)
        self.assertEqual(inspect_ipam_integrity(data), [])
        self.assertEqual(data, original)


if __name__ == "__main__":
    unittest.main()
