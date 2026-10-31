"""Regression tests for detached diagnostic assembly and its non-authority."""
import copy
import unittest

from backend.import_diagnostics import inspect_detached_candidate


def candidate():
    return {
        "subnets": [{"id": "s", "kind": "network", "cidr": "192.0.2.0/24",
                     "vlan": 10, "gateway": "192.0.2.1"}],
        "devices": [{"id": "d", "name": "Router", "mountType": "Desktop",
                     "primaryIp": "192.0.2.4"}],
        "racks": [{"id": "r", "heightU": 12}],
        "rackAccessories": [],
        "ipAllocations": {"192.0.2.4": {"deviceId": "d", "status": "Assigned"}},
    }


class DetachedDiagnosticsTests(unittest.TestCase):
    def test_valid_source_shaped_candidate_has_no_component_findings(self):
        report = inspect_detached_candidate(candidate())
        self.assertEqual(report, {
            "hierarchy": [], "subnetTypes": [], "mounts": [],
            "ipam": [], "rackConflicts": [],
        })

    def test_multiple_components_report_without_changing_candidate(self):
        data = candidate()
        data["devices"][0]["mountType"] = "unsupported"
        data["devices"][0]["primaryIp"] = "198.51.100.4"
        data["rackAccessories"].append({
            "id": "a", "name": "Panel", "type": "blank", "rackId": "r",
            "face": "front", "startU": 13, "heightU": 1,
        })
        data["subnets"][0]["vlan"] = 5000
        original = copy.deepcopy(data)
        report = inspect_detached_candidate(data)
        self.assertEqual(report["mounts"][0]["id"], "d")
        self.assertTrue(report["subnetTypes"])
        self.assertTrue(report["ipam"])
        self.assertTrue(report["rackConflicts"])
        self.assertEqual(data, original)

    def test_no_import_write_or_approval_side_effects(self):
        report = inspect_detached_candidate(candidate())
        self.assertNotIn("accepted", report)
        self.assertNotIn("committed", report)
        self.assertNotIn("normalised", report)


if __name__ == "__main__":
    unittest.main()
