"""Detached v1.3.3 normaliseState VLAN and device/rack checks.

These are pre-reconciliation checks, not an import approval or persistence API.
"""
import ipaddress
import math

from backend.inventory import RECOGNISED_MOUNTS


def _number(value):
    if value is None:
        return 0.0
    if isinstance(value, str) and not value.strip():
        return 0.0
    try:
        return float(value)
    except (ValueError, TypeError, OverflowError):
        return math.nan


def _integer(value):
    return math.isfinite(_number(value)) and _number(value).is_integer()


def _valid_ipv4(value):
    if not isinstance(value, str):
        return False
    parts = value.strip().split(".")
    return len(parts) == 4 and all(
        1 <= len(p) <= 3 and p.isascii() and p.isdigit() and int(p) <= 255
        for p in parts
    )


def validate_normalisation_vlans(candidate):
    """Raise the published normaliseState VLAN error for the first failure."""
    ids = set()
    numbers = set()
    for vlan in candidate["vlans"]:
        if not isinstance(vlan, dict) or not vlan.get("id") or not vlan.get("name"):
            raise ValueError("Every VLAN must have an id and name.")
        number = _number(vlan.get("vlanId"))
        if not _integer(vlan.get("vlanId")) or not 1 <= number <= 4094:
            raise ValueError(f"Invalid VLAN ID: {vlan.get('vlanId')}.")
        if vlan["id"] in ids:
            raise ValueError(f"Duplicate VLAN ID: {vlan['id']}.")
        domain = vlan.get("parentId") or "__unassigned__"
        key = (domain, int(number))
        if key in numbers:
            raise ValueError(
                f"Duplicate VLAN number {int(number)} within the same IP Address Block."
            )
        ids.add(vlan["id"])
        numbers.add(key)


def validate_normalisation_devices(candidate):
    """Mirror published device identity, mounting and rack-position checks."""
    ids = set()
    racks = candidate["racks"]
    for device in candidate["devices"]:
        if not isinstance(device, dict) or not device.get("id") or not device.get("name"):
            raise ValueError("Every device must have an id and name.")
        name = device["name"]
        if device["id"] in ids:
            raise ValueError(f"Duplicate device ID: {device['id']}.")
        ids.add(device["id"])
        mount = device.get("mountType") or (
            "Rack Mounted" if device.get("rackId") else "Desktop"
        )
        if mount not in RECOGNISED_MOUNTS:
            raise ValueError(
                f"Device {name} has an incompatible mounting type for {device.get('type')}."
            )
        if device.get("primaryIp") and not _valid_ipv4(device["primaryIp"]):
            raise ValueError(f"Invalid primary IP on device {name}.")
        if device.get("mountType") == "Rack Mounted" or device.get("rackId"):
            if device.get("mountType") != "Rack Mounted":
                raise ValueError(
                    f"Device {name} has a rack assignment but is not Rack Mounted."
                )
            if not device.get("location") or device.get("location") == "Racked":
                raise ValueError(
                    f"Rack Mounted device {name} needs a physical location or Unknown."
                )
            rack = next((r for r in racks if r.get("id") == device.get("rackId")), None)
            if rack is None or not device.get("rackId"):
                raise ValueError(f"Device {name} references a missing rack.")
            if (device.get("face") or "front") not in ("front", "rear"):
                raise ValueError(f"Invalid rack face on device {name}.")
            start, height = _number(device.get("rackUStart")), _number(device.get("rackUHeight"))
            if not _integer(device.get("rackUStart")) or not _integer(device.get("rackUHeight")) or start < 1 or height < 1:
                raise ValueError(f"Invalid rack position on device {name}.")
            end = start + height - 1
            if _number(device.get("rackUEnd")) != end:
                raise ValueError(f"Rack end U is inconsistent for device {name}.")
            if end > _number(rack.get("heightU")):
                raise ValueError(f"Device {name} exceeds rack capacity.")
        elif device.get("location") == "Racked":
            raise ValueError(f"Racked device {name} is missing a rack assignment.")
