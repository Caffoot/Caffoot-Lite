"""Shared checks for devices resting on an existing rack shelf.

The accessory owns its U position. A resting device keeps only the rack and
stable shelf identity, so moving the shelf never creates a second U footprint.
"""


def validate_device_shelf_association(device, state):
    """Validate the optional reference; return whether this is a linked shelf device."""
    shelf_id = device.get("rackShelfAccessoryId")
    has_shelf = shelf_id not in (None, "")
    tabletop = device.get("mountType") == "Tabletop / Shelf Mounted"
    if not has_shelf and not (tabletop and device.get("rackId")):
        return False
    name = device.get("name") or device.get("id") or "(unnamed)"
    if not isinstance(shelf_id, str) or not shelf_id:
        raise ValueError(f"Select an existing rack shelf for device {name}, or clear its rack.")
    if not tabletop or device.get("isVirtual") is True or device.get("type") == "Server - Virtual":
        raise ValueError(f"Only physical Tabletop / Shelf Mounted devices can use a rack shelf: {name}.")
    if not device.get("rackId"):
        raise ValueError(f"Device {name} has a rack shelf without a rack.")
    shelf = next((item for item in state.get("rackAccessories", [])
                  if isinstance(item, dict) and item.get("id") == shelf_id), None)
    if shelf is None or shelf.get("type") != "shelf":
        raise ValueError(f"The selected rack shelf for {name} is missing or no longer a shelf.")
    if shelf.get("rackId") != device["rackId"]:
        raise ValueError(f"The selected rack shelf for {name} belongs to another rack.")
    if not any(r.get("id") == device["rackId"] for r in state["racks"]):
        raise ValueError(f"Device {name} references a missing rack.")
    if any(device.get(key) not in (None, "") for key in
           ("rackUStart", "rackUEnd", "rackUHeight", "face")):
        raise ValueError(f"Shelf-mounted device {name} must not have its own rack U or face.")
    return True
