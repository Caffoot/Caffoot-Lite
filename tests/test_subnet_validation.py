"""Regression examples for published v1.3.3 hierarchyValidate."""
import copy
import unittest

from backend.subnet_validation import parse_hierarchy_cidr, validate_subnet_hierarchy


def subnet(identifier, cidr, kind="network", parent=None):
    value = {"id": identifier, "cidr": cidr, "kind": kind}
    if parent is not None:
        value["parentId"] = parent
    return value


class SubnetHierarchyTests(unittest.TestCase):
    def test_valid_container_with_network_and_reserved_child(self):
        data = [
            subnet("block", "10.0.0.0/16", "container"),
            subnet("network", "10.0.1.0/24", parent="block"),
            subnet("reserved", "10.0.2.0/24", "reserved", "block"),
        ]
        self.assertEqual(validate_subnet_hierarchy(data), [])

    def test_unrelated_overlaps_are_rejected(self):
        data = [subnet("a", "10.0.0.0/24"), subnet("b", "10.0.0.0/25")]
        self.assertTrue(any("Overlapping unrelated" in issue
                            for issue in validate_subnet_hierarchy(data)))

    def test_duplicate_ids_and_cidrs(self):
        data = [subnet("a", "10.0.0.0/24"), subnet("a", "10.0.1.0/24"),
                subnet("b", "10.0.0.0/24")]
        issues = validate_subnet_hierarchy(data)
        self.assertIn("Duplicate subnet ID: a", issues)
        self.assertIn("Duplicate CIDR: 10.0.0.0/24", issues)

    def test_missing_parent_and_noncontainer_parent(self):
        data = [subnet("a", "10.0.0.0/24"),
                subnet("b", "10.0.1.0/24", parent="missing"),
                subnet("c", "10.0.0.128/25", parent="a")]
        issues = validate_subnet_hierarchy(data)
        self.assertIn("Missing parent missing for b", issues)
        self.assertIn("Parent must be a container: a", issues)

    def test_self_parent_and_parent_cycle(self):
        data = [subnet("a", "10.0.0.0/16", "container", "a")]
        self.assertIn("Subnet cannot parent itself: a", validate_subnet_hierarchy(data))

    def test_misalignment_and_loopback_prefix(self):
        data = [subnet("a", "10.0.0.5/24"),
                subnet("b", "10.0.0.1/24", "loopback")]
        issues = validate_subnet_hierarchy(data)
        self.assertIn("Misaligned CIDR 10.0.0.5/24; use 10.0.0.0/24", issues)
        self.assertTrue(any("Invalid CIDR for b" in issue for issue in issues))

    def test_ipv4_canonicalisation_matches_published_parser(self):
        parsed = parse_hierarchy_cidr("010.000.000.000/8")
        self.assertEqual(parsed["canonical"], "10.0.0.0/8")
        self.assertIsNone(parse_hierarchy_cidr("10.0.0.256/24"))

    def test_diagnostics_are_read_only(self):
        data = [subnet("a", "10.0.0.0/24"), subnet("b", "10.0.0.0/25")]
        original = copy.deepcopy(data)
        validate_subnet_hierarchy(data)
        self.assertEqual(data, original)


if __name__ == "__main__":
    unittest.main()
