"""Published v1.3.3 normaliseState IPAM repair regressions."""
import copy
import unittest

from backend.ipam_reconciliation import reconcile_published_ipam


def candidate():
    return {"devices": [{"id": "d", "name": "Router", "primaryIp": "192.0.2.4"}],
            "ipAllocations": {"192.0.2.4": {
                "status": "Assigned", "deviceId": "d",
                "hostname": "Old", "notes": "important", "custom": 7,
            }}}


class IpamReconciliationTests(unittest.TestCase):
    def test_updates_hostname_and_preserves_notes(self):
        source = candidate()
        before = copy.deepcopy(source)
        result = reconcile_published_ipam(source)
        allocation = result["ipAllocations"]["192.0.2.4"]
        self.assertEqual(allocation["hostname"], "Router")
        self.assertEqual(allocation["notes"], "important")
        self.assertEqual(allocation["custom"], 7)
        self.assertEqual(source, before)

    def test_repairs_stale_owner_and_status(self):
        source = candidate()
        source["ipAllocations"]["192.0.2.4"].update({
            "deviceId": "other", "status": "Available",
        })
        result = reconcile_published_ipam(source)
        self.assertEqual(result["ipAllocations"]["192.0.2.4"]["deviceId"], "d")
        self.assertEqual(result["ipAllocations"]["192.0.2.4"]["status"], "Assigned")

    def test_reserved_device_repairs_status(self):
        source = candidate()
        source["devices"][0]["ipReserved"] = True
        result = reconcile_published_ipam(source)
        self.assertEqual(result["ipAllocations"]["192.0.2.4"]["status"], "Reserved")

    def test_missing_allocation_created_as_assigned(self):
        source = candidate()
        source["devices"][0]["ipReserved"] = True
        source["ipAllocations"] = {}
        result = reconcile_published_ipam(source)
        self.assertEqual(result["ipAllocations"]["192.0.2.4"], {
            "status": "Assigned", "deviceId": "d", "hostname": "Router", "notes": "",
        })

    def test_stale_allocation_owner_released(self):
        source = candidate()
        source["ipAllocations"]["192.0.2.5"] = {
            "deviceId": "d", "status": "Assigned", "notes": "keep",
        }
        result = reconcile_published_ipam(source)
        self.assertEqual(result["ipAllocations"]["192.0.2.5"], {
            "deviceId": "", "status": "Available", "notes": "keep",
        })

    def test_reserved_stale_allocation_keeps_reserved_status(self):
        source = candidate()
        source["ipAllocations"]["192.0.2.5"] = {
            "deviceId": "d", "status": "Reserved",
        }
        result = reconcile_published_ipam(source)
        self.assertEqual(result["ipAllocations"]["192.0.2.5"]["status"], "Reserved")
        self.assertEqual(result["ipAllocations"]["192.0.2.5"]["deviceId"], "")

    def test_unlinked_allocation_untouched(self):
        source = candidate()
        source["ipAllocations"]["192.0.2.5"] = {
            "deviceId": "", "status": "Available", "notes": "free",
        }
        result = reconcile_published_ipam(source)
        self.assertEqual(result["ipAllocations"]["192.0.2.5"],
                         source["ipAllocations"]["192.0.2.5"])

    def test_no_primary_ip_does_not_create_allocation(self):
        source = candidate()
        source["devices"][0]["primaryIp"] = ""
        source["ipAllocations"] = {}
        self.assertEqual(reconcile_published_ipam(source)["ipAllocations"], {})


if __name__ == "__main__":
    unittest.main()
