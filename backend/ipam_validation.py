"""Detached v1.3.3 IPAM integrity diagnostics.

Mirrors the device-primary-IP and allocation portions of validateApplicationState.
The published ipBelongsToSubnet uses parseSupportedIpv4Subnet (/23 through
/30), not the broader hierarchy CIDR parser. No writes or API exposure.
"""
import re


def _ip_number(value):
    if not isinstance(value, str):
        return None
    parts = value.split(".")
    if len(parts) != 4 or any(
        not re.fullmatch(r"[0-9]{1,3}", p) or int(p) > 255 for p in parts
    ):
        return None
    result = 0
    for part in parts:
        result = result * 256 + int(part)
    return result


def ip_belongs_to_subnet(ip, cidr):
    """Published isUsableHostAddressInSubnet and /23–/30 restriction."""
    if not isinstance(cidr, str):
        return False
    match = re.fullmatch(r"([^/]+)/([0-9]{1,2})", cidr)
    if not match:
        return False
    prefix = int(match.group(2))
    address = _ip_number(match.group(1))
    target = _ip_number(ip)
    if address is None or target is None or not 23 <= prefix <= 30:
        return False
    size = 2 ** (32 - prefix)
    network = (address // size) * size
    return address == network and network + 1 <= target <= network + size - 2


def inspect_ipam_integrity(candidate):
    """Return source-worded IPAM findings in published device/allocation order.

    This is a detached subset, not the complete validateApplicationState.
    """
    errors = []
    subnets = candidate["subnets"]
    devices = candidate["devices"]
    allocations = candidate["ipAllocations"]
    primary_ips = set()
    device_by_id = {device.get("id"): device for device in devices}

    for device in devices:
        ip = device.get("primaryIp")
        if not ip:
            continue
        name = str(device.get("name", "undefined"))
        if ip in primary_ips:
            errors.append("Duplicate primary IP: " + str(ip) + ".")
        primary_ips.add(ip)
        if not any(ip_belongs_to_subnet(ip, subnet.get("cidr")) for subnet in subnets):
            errors.append("Primary IP " + str(ip) + " on " + name + " has no subnet.")
        allocation = allocations.get(ip)
        status = "Reserved" if device.get("ipReserved") else "Assigned"
        if (not isinstance(allocation, dict) or
                allocation.get("deviceId") != device.get("id") or
                allocation.get("status") != status):
            errors.append("IPAM is out of sync for " + name + " (" + str(ip) + ").")

    for ip, allocation in allocations.items():
        if not any(ip_belongs_to_subnet(ip, subnet.get("cidr")) for subnet in subnets):
            errors.append("IPAM allocation " + ip + " is outside all configured subnets.")
        linked = allocation.get("deviceId") if isinstance(allocation, dict) else None
        if linked:
            device = device_by_id.get(linked)
            if device is None:
                errors.append("IPAM allocation " + ip + " references a missing device.")
            elif (device.get("primaryIp") != ip or
                  allocation.get("status") !=
                  ("Reserved" if device.get("ipReserved") else "Assigned")):
                errors.append("IPAM/device mismatch for " + ip + ".")
    return errors
