"""Keep feature-only collections out of other sections' API responses."""
from .permissions import can_access
from .inventory import SETTINGS


def project_inventory_response(connection, account_id, result):
    """Filter response copies only; saved records and relationships stay intact.

    A device's own primary address remains its approved visible reference.
    IPAM-only users receive allocation references without Device-derived names.
    """
    sections = {section: can_access(connection, account_id, section)
                for section in ("Devices", "IPAM", "Racks")}
    for section, keys in (("Devices", ("devices", "deviceEditors")),
                          ("IPAM", ("subnets", "vlans", "ipAllocations")),
                          ("Racks", ("racks", "rackAccessories"))):
        if not sections[section]:
            for key in keys:
                result.pop(key, None)
    if "settings" in result and not all(sections.values()):
        result["settings"] = {key: value for key, value in result["settings"].items()
                              if sections["Devices"] and key in SETTINGS}
    if not sections["Devices"]:
        if "settings" in result:
            result["settings"] = {}
        if "ipAllocations" in result:
            result["ipAllocations"] = {
                ip: {key: value for key, value in allocation.items()
                     if key != "hostname" or not (allocation.get("deviceId") or allocation.get("reservedForDeviceId"))}
                for ip, allocation in result["ipAllocations"].items()
            }
    return result
