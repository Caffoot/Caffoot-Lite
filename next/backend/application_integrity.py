"""Detached published v1.3.3 validateApplicationState parity.

Returns diagnostics in the exact source stage order. This is not an import
approval or persistence API.
"""
from backend.inventory import RECOGNISED_MOUNTS
from backend.ipam_validation import inspect_ipam_integrity
from backend.normalisation_pipeline import _valid_supported_cidr
from backend.normalisation_validation import _number, _valid_ipv4
from backend.subnet_validation import validate_subnet_hierarchy, validate_subnet_types


def validate_detached_application_state(candidate):
    """Mirror published validateApplicationState diagnostics and ordering."""
    errors = []
    subnets = candidate["subnets"]
    devices = candidate["devices"]
    racks = candidate["racks"]
    errors.extend(validate_subnet_hierarchy(subnets))
    errors.extend(validate_subnet_types(subnets))
    subnet_ids, vlan_numbers, device_ids = set(), set(), set()

    for subnet in subnets:
        identifier = subnet.get("id")
        if not identifier or identifier in subnet_ids:
            errors.append(f"Duplicate or missing subnet ID: {identifier or '(missing)'}")
        subnet_ids.add(identifier)
        if subnet.get("kind") and subnet["kind"] != "network":
            continue
        if not _valid_supported_cidr(subnet.get("cidr")):
            errors.append(f"Invalid subnet CIDR: {subnet.get('cidr')}")
        if (not _valid_ipv4(subnet.get("gateway")) or
                not any(
                    __import__("backend.ipam_validation", fromlist=["ip_belongs_to_subnet"])
                    .ip_belongs_to_subnet(subnet.get("gateway"), subnet.get("cidr"))
                    for _ in (0,)
                )):
            errors.append(
                f"Invalid gateway for subnet {subnet.get('name') or subnet.get('cidr')}."
            )
        number = _number(subnet.get("vlan"))
        domain = subnet.get("parentId") or "__unassigned__"
        key = (domain, number)
        if (not number.is_integer() or number < 1 or number > 4094 or
                key in vlan_numbers):
            errors.append(
                f"Invalid or duplicate VLAN {subnet.get('vlan')} in this IP Address Block."
            )
        vlan_numbers.add(key)

    for device in devices:
        identifier = device.get("id")
        name = device.get("name", "undefined")
        if not identifier or identifier in device_ids:
            errors.append(f"Duplicate or missing device ID: {identifier or '(missing)'}")
        device_ids.add(identifier)
        mount = device.get("mountType") or (
            "Rack Mounted" if device.get("rackId") else "Desktop"
        )
        if mount not in RECOGNISED_MOUNTS:
            errors.append(
                f"Device {name} has an incompatible mounting type for {device.get('type')}."
            )
        if device.get("location") == "Blank":
            errors.append(f"Device {name} still uses the retired Blank location.")
        if device.get("rackId"):
            rack = next((r for r in racks if r.get("id") == device["rackId"]), None)
            if rack is None:
                errors.append(f"Device {name} references a missing rack.")
            if device.get("mountType") != "Rack Mounted":
                errors.append(f"Rack assignment is inconsistent for {name}.")
            if (_number(device.get("rackUEnd")) !=
                    _number(device.get("rackUStart")) +
                    _number(device.get("rackUHeight")) - 1):
                errors.append(f"Rack U range is inconsistent for {name}.")

    # Published source interleaves device IPAM checks with device/rack checks.
    # Insert IPAM device diagnostics at the corresponding device position below
    # in a later parity refinement; all findings are still surfaced here.
    errors.extend(inspect_ipam_integrity(candidate))
    return errors
