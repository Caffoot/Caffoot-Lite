"""Published v1.3.3 normaliseState pre-reconciliation address checks.

Must run after field migrations, subnet hierarchy/type checks, VLAN checks,
and device/rack checks, before any IPAM repair. No persistence.
"""
from backend.ipam_validation import ip_belongs_to_subnet, _ip_number


def validate_normalisation_addresses(candidate):
    devices = candidate["devices"]
    subnets = candidate["subnets"]
    allocations = candidate["ipAllocations"]
    ids = {d["id"] for d in devices}
    primary_ips = set()

    for device in devices:
        ip = device.get("primaryIp")
        if not ip:
            continue
        if ip in primary_ips:
            raise ValueError(f"Duplicate primary IP: {ip}.")
        primary_ips.add(ip)
        if not any(ip_belongs_to_subnet(ip, s.get("cidr")) for s in subnets):
            raise ValueError(
                f"Primary IP {ip} on device {device['name']} does not belong to an existing subnet."
            )

    for ip, allocation in allocations.items():
        if _ip_number(ip) is None or not isinstance(allocation, dict):
            raise ValueError(f"Invalid IP allocation record: {ip}.")
        if not any(ip_belongs_to_subnet(ip, s.get("cidr")) for s in subnets):
            raise ValueError(
                f"IP allocation {ip} does not belong to any configured subnet."
            )
        if allocation.get("deviceId") and allocation["deviceId"] not in ids:
            raise ValueError(
                f"IP {ip} references missing device {allocation['deviceId']}."
            )
