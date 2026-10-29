"""Published hierarchyValidateTypes compatibility tests."""
import copy
import unittest

from backend.subnet_validation import validate_subnet_types


def network(**overrides):
    result = {"id": "n", "kind": "network", "cidr": "192.0.2.0/24",
              "vlan": 100, "gateway": "192.0.2.1"}
    result.update(overrides)
    return result


class SubnetTypeTests(unittest.TestCase):
    def test_valid_network_and_non_network_kinds(self):
        data = [network(), {"id": "c", "kind": "container", "cidr": "10.0.0.0/8"},
                {"id": "r", "kind": "reserved", "cidr": "0.0.0.0/0"},
                {"id": "l", "kind": "loopback", "cidr": "192.0.2.3/32"}]
        self.assertEqual(validate_subnet_types(data), [])

    def test_network_prefix_gateway_and_vlan(self):
        data = [network(cidr="192.0.2.0/31", vlan=4095, gateway="192.0.2.0")]
        self.assertEqual(validate_subnet_types(data), [
            "Network requires a /1–/30 CIDR: 192.0.2.0/31",
            "Network requires VLAN 1–4094: n",
            "Network requires a usable gateway: n",
        ])

    def test_missing_network_vlan_and_gateway(self):
        data = [network(vlan=None, gateway=None)]
        self.assertEqual(validate_subnet_types(data), [
            "Network requires VLAN 1–4094: n",
            "Network requires a usable gateway: n",
        ])

    def test_non_network_forbids_gateway_and_vlan(self):
        data = [{"id": "r", "kind": "reserved", "cidr": "10.0.0.0/8",
                 "gateway": "10.0.0.1", "vlan": 5}]
        self.assertEqual(validate_subnet_types(data), [
            "reserved must not have a gateway: r",
            "reserved must not have a VLAN: r",
        ])

    def test_loopback_must_be_32(self):
        self.assertEqual(validate_subnet_types([
            {"id": "l", "kind": "loopback", "cidr": "192.0.2.0/24"}
        ]), ["Loopback requires /32: l"])

    def test_invalid_record_kind_and_cidr(self):
        self.assertEqual(validate_subnet_types([
            None, {"id": "x", "kind": "wrong", "cidr": "10.0.0.0/24"},
            {"id": "y", "kind": "network", "cidr": "10.0.0.1/24"}
        ]), [
            "Invalid subnet record.", "Invalid subnet kind: x",
            "Invalid subnet CIDR: 10.0.0.1/24",
        ])

    def test_vlan_numeric_string_matches_published_number_coercion(self):
        self.assertEqual(validate_subnet_types([network(vlan="100")]), [])

    def test_does_not_mutate_source(self):
        data = [network()]
        original = copy.deepcopy(data)
        validate_subnet_types(data)
        self.assertEqual(data, original)


if __name__ == "__main__":
    unittest.main()
