"""Detached published v1.3.3 normalisation transformations.

This module deliberately handles only the established field migrations.
It does not replace normaliseState's validation, IPAM reconciliation,
legacy mounting review or the final import confirmation.
"""
import copy

LEGACY_ACCESSORY_TYPES = {
    "fan": "fan_tray", "pdu": "pdu_horizontal", "vent": "ventilation",
}


def _unique(values):
    result = []
    for value in values:
        if value not in result:
            result.append(value)
    return result


def normalise_published_fields(raw, default_device_types, default_locations):
    """Reproduce the field transformations in published normaliseState.

    Defaults must be supplied from the published v1.3.3 defaultData,
    never invented by the backend. Always return a detached copy.
    """
    state = copy.deepcopy(raw)
    for key in ("devices", "subnets", "vlans", "racks"):
        if not isinstance(state.get(key), list):
            raise ValueError("Imported data is missing a valid " + key + " array.")
    if not isinstance(state.get("ipAllocations"), dict):
        raise ValueError("Imported data is missing a valid ipAllocations object.")
    for device in state["devices"]:
        if not isinstance(device, dict):
            raise ValueError("Invalid device in migration.")
        if (device.get("location") == "Racked" and
                (device.get("mountType") == "Rack Mounted" or device.get("rackId"))):
            device["location"] = "Unknown"
    accessories = state.get("rackAccessories")
    if not isinstance(accessories, list):
        accessories = []
    state["rackAccessories"] = [
        {**item, "type": LEGACY_ACCESSORY_TYPES[item["type"]]}
        if isinstance(item, dict) and item.get("type") in LEGACY_ACCESSORY_TYPES
        else item
        for item in accessories
    ]
    types = state.get("deviceTypes")
    if not isinstance(types, list):
        types = default_device_types
    locations = state.get("deviceLocations")
    if not isinstance(locations, list):
        locations = default_locations
    state["deviceTypeGraphics"] = (
        state.get("deviceTypeGraphics")
        if isinstance(state.get("deviceTypeGraphics"), dict) else {}
    )
    discovered_types = [str(d.get("type") or "").strip() for d in state["devices"]]
    discovered_locations = [str(d.get("location") or "").strip() for d in state["devices"]]
    state["deviceTypes"] = _unique(
        list(types) + [x for x in discovered_types if x] +
        ["Layer 3 Switch", "Wireless LAN Controller"]
    )
    state["deviceLocations"] = [
        x for x in _unique(
            list(locations) + [x for x in discovered_locations if x] + ["Unknown"]
        ) if x not in ("Blank", "Racked")
    ]
    for device in state["devices"]:
        if device.get("location") in ("Blank", None, ""):
            device["location"] = "Unknown"
    state["stateVersion"] = 3
    return state
