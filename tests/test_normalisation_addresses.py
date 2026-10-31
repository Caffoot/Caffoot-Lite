"""Regression coverage for published normaliseState address preflight."""
import unittest

from backend.normalisation_addresses import validate_normalisation_addresses


def candidate():
    return {
        "devices": [{"id": "d1", "name": "A", "primaryIp": "192.168.4.10"}],
        "subnets": [{"cidr": "192.168.4.0/24"}],
        "ipAllocations": {
            "192.168.4.10": {"deviceId": "d1", "status": "Assigned", "notes": "keep"}
        },
    }


class NormalisationAddressesTests(unittest.TestCase):
    def test_valid_addresses(self):
        validate_normalisation_addresses(candidate())

    def test_duplicate_primary_ip(self):
        state = candidate()
        state["devices"].append({"id": "d2", "name": "B", "primaryIp": "192.168.4.10"})
        with self.assertRaisesRegex(ValueError, "Duplicate primary IP"):
            validate_normalisation_addresses(state)

    def test_primary_ip_outside_subnet(self):
        state = candidate()
        state["devices"][0]["primaryIp"] = "192.168.8.10"
        with self.assertRaisesRegex(ValueError, "does not belong to an existing subnet"):
            validate_normalisation_addresses(state)

    def test_allocation_outside_subnet(self):
        state = candidate()
        state["ipAllocations"]["192.168.8.10"] = {"status": "Available"}
        with self.assertRaisesRegex(ValueError, "does not belong to any configured subnet"):
            validate_normalisation_addresses(state)

    def test_invalid_allocation_address(self):
        state = candidate()
        state["ipAllocations"]["bad"] = {"status": "Available"}
        with self.assertRaisesRegex(ValueError, "Invalid IP allocation record"):
            validate_normalisation_addresses(state)

    def test_invalid_allocation_value(self):
        state = candidate()
        state["ipAllocations"]["192.168.4.11"] = None
        with self.assertRaisesRegex(ValueError, "Invalid IP allocation record"):
            validate_normalisation_addresses(state)

    def test_missing_device_reference_rejected_before_repair(self):
        state = candidate()
        state["ipAllocations"]["192.168.4.11"] = {
            "status": "Assigned", "deviceId": "missing",
        }
        with self.assertRaisesRegex(ValueError, "references missing device"):
            validate_normalisation_addresses(state)

    def test_stale_existing_device_link_left_for_reconciliation(self):
        state = candidate()
        state["ipAllocations"]["192.168.4.11"] = {
            "status": "Assigned", "deviceId": "d1", "notes": "retain",
        }
        validate_normalisation_addresses(state)
        self.assertEqual(state["ipAllocations"]["192.168.4.11"]["deviceId"], "d1")

    def test_unallocated_address_allowed(self):
        state = candidate()
        state["ipAllocations"] = {}
        validate_normalisation_addresses(state)

    def test_network_and_broadcast_not_usable(self):
        state = candidate()
        state["devices"][0]["primaryIp"] = "192.168.4.0"
        with self.assertRaisesRegex(ValueError, "does not belong"):
            validate_normalisation_addresses(state)


if __name__ == "__main__":
    unittest.main()
