"""Detached IPAM repair stage from published v1.3.3 normaliseState.

Only invoke after the earlier normaliseState structural, subnet, VLAN,
device and allocation validation stages. Never treat this as import approval.
"""
import copy


def reconcile_published_ipam(candidate):
    """Return a detached candidate with published primary-IP repairs applied.

    Device primary IP and name are authoritative; address-specific notes and
    other allocation fields are preserved. Missing allocations are created.
    """
    state = copy.deepcopy(candidate)
    allocations = state["ipAllocations"]
    devices = state["devices"]

    for device in devices:
        ip = device.get("primaryIp")
        if not ip:
            continue
        existing = allocations.get(ip)
        if not isinstance(existing, dict):
            allocations[ip] = {
                "status": "Assigned",
                "deviceId": device.get("id"),
                "hostname": device.get("name") or "",
                "notes": "",
            }
            continue
        expected = "Reserved" if device.get("ipReserved") else "Assigned"
        if (existing.get("deviceId") != device.get("id") or
                existing.get("status") != expected):
            existing["deviceId"] = device.get("id")
            existing["status"] = expected
        existing["hostname"] = device.get("name") or ""

    for ip, allocation in allocations.items():
        if not allocation.get("deviceId"):
            continue
        owner = next((d for d in devices if d.get("id") == allocation["deviceId"]), None)
        if owner is None or owner.get("primaryIp") != ip:
            allocation["deviceId"] = ""
            if allocation.get("status") == "Assigned":
                allocation["status"] = "Available"
    return state
