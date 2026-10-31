"""Regression tests for published normaliseState field transformations."""
import copy
import unittest

from backend.normalisation import normalise_published_fields


def state():
    return {
        "devices": [{"id": "d", "name": "Workstation", "type": "Custom Type",
                     "location": "Blank", "historical": {"notes": "retain"}}],
        "subnets": [], "vlans": [], "racks": [],
        "ipAllocations": {}, "stateVersion": 1,
        "hardwareSeedPreferences": {"retained": True},
    }


def normalise(data):
    return normalise_published_fields(data, ["Desktop"], ["Office"])


class NormalisationTests(unittest.TestCase):
    def test_managed_types_and_locations(self):
        result = normalise(state())
        self.assertEqual(result["deviceTypes"], [
            "Desktop", "Custom Type", "Layer 3 Switch", "Wireless LAN Controller",
        ])
        self.assertEqual(result["deviceLocations"], ["Office", "Unknown"])
        self.assertEqual(result["devices"][0]["location"], "Unknown")
        self.assertEqual(result["stateVersion"], 3)

    def test_historical_fields_and_original_preserved(self):
        source = state()
        before = copy.deepcopy(source)
        result = normalise(source)
        self.assertEqual(source, before)
        self.assertEqual(result["devices"][0]["historical"], {"notes": "retain"})
        self.assertEqual(result["hardwareSeedPreferences"], {"retained": True})

    def test_legacy_rack_location(self):
        source = state()
        source["devices"][0].update({
            "location": "Racked", "mountType": "Rack Mounted", "rackId": "r",
        })
        result = normalise(source)
        self.assertEqual(result["devices"][0]["location"], "Unknown")

    def test_legacy_accessory_identifiers(self):
        source = state()
        source["rackAccessories"] = [
            {"id": "a", "type": "fan"}, {"id": "b", "type": "pdu"},
            {"id": "c", "type": "vent"}, {"id": "d", "type": "unknown"},
        ]
        self.assertEqual([x["type"] for x in normalise(source)["rackAccessories"]],
                         ["fan_tray", "pdu_horizontal", "ventilation", "unknown"])

    def test_managed_lists_deduplicated(self):
        source = state()
        source["deviceTypes"] = ["Custom Type", "Custom Type"]
        source["deviceLocations"] = ["Blank", "Racked", "Office", "Office"]
        result = normalise(source)
        self.assertEqual(result["deviceTypes"].count("Custom Type"), 1)
        self.assertEqual(result["deviceLocations"], ["Office", "Unknown"])

    def test_invalid_collection_is_rejected(self):
        source = state()
        source["vlans"] = None
        with self.assertRaisesRegex(ValueError, "valid vlans array"):
            normalise(source)

    def test_invalid_device_is_rejected(self):
        source = state()
        source["devices"] = [None]
        with self.assertRaisesRegex(ValueError, "Invalid device in migration"):
            normalise(source)

    def test_optional_graphics_fallback(self):
        source = state()
        source["deviceTypeGraphics"] = []
        self.assertEqual(normalise(source)["deviceTypeGraphics"], {})


if __name__ == "__main__":
    unittest.main()
