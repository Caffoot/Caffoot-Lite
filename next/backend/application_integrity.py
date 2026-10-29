"""Detached published v1.3.3 validateApplicationState parity.

Returns diagnostics in the exact source stage order. This is not an import
approval or persistence API.
"""
from backend.inventory import RECOGNISED_MOUNTS
from backend.ipam_validation import ip_belongs_to_subnet
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
    subnet_ids, vlan_numbers, device_ids, primary_ips = set(), set(), set(), set()

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
                not ip_belongs_to_subnet(subnet.get("gateway"), subnet.get("cidr"))):
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
        ip = device.get("primaryIp")
        if ip:
            if ip in primary_ips:
                errors.append(f"Duplicate primary IP: {ip}.")
            primary_ips.add(ip)
            if not any(ip_belongs_to_subnet(ip, s.get("cidr")) for s in subnets):
                errors.append(f"Primary IP {ip} on {name} has no subnet.")
            allocation = candidate["ipAllocations"].get(ip)
            expected = "Reserved" if device.get("ipReserved") else "Assigned"
            if (not isinstance(allocation, dict) or
                    allocation.get("deviceId") != identifier or
                    allocation.get("status") != expected):
                errors.append(f"IPAM is out of sync for {name} ({ip}).")
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

    by_id = {device.get("id"): device for device in devices}
    for ip, allocation in candidate["ipAllocations"].items():
        if not any(ip_belongs_to_subnet(ip, s.get("cidr")) for s in subnets):
            errors.append(f"IPAM allocation {ip} is outside all configured subnets.")
        linked = allocation.get("deviceId") if isinstance(allocation, dict) else None
        if linked:
            device = by_id.get(linked)
            if device is None:
                errors.append(f"IPAM allocation {ip} references a missing device.")
            elif (device.get("primaryIp") != ip or
                  allocation.get("status") !=
                  ("Reserved" if device.get("ipReserved") else "Assigned")):
                errors.append(f"IPAM/device mismatch for {ip}.")
    return errors
