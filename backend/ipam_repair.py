"""Published safe IPAM integrity repair, applied to central SQLite."""
import json
import time
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import reconstruct_inventory
from .ipam_validation import ip_belongs_to_subnet
from .normalisation_validation import validate_normalisation_devices
from .permissions import can_access
from .rack_validation import find_rack_import_conflicts


def plan_ipam_repairs(state):
    """Derive only the safe device-owned IPAM synchronisations in v1.3.3."""
    owners = {}
    for device in state["devices"]:
        if device.get("primaryIp"):
            owners.setdefault(device["primaryIp"], []).append(device)
    fixes = []
    for ip, devices in owners.items():
        if len(devices) != 1:
            continue
        device = devices[0]
        existing = state["ipAllocations"].get(ip)
        if not any(ip_belongs_to_subnet(ip, subnet.get("cidr"))
                   for subnet in state["subnets"]):
            continue
        if existing and existing.get("deviceId") not in (None, "", device["id"]):
            continue
        if existing and not existing.get("deviceId") and existing.get("status") \
                and existing["status"] != "Available":
            continue
        expected = {
            "status": "Reserved" if device.get("ipReserved") else "Assigned",
            "deviceId": device["id"], "hostname": device.get("name") or ""
        }
        if not existing or any(existing.get(key) != value
                               for key, value in expected.items()):
            fixes.append({"ip": ip, "deviceId": device["id"],
                          "expected": expected})
    return fixes


def apply_ipam_repairs(connection, account_id, expected_fixes):
    """Replan from locked SQLite state; never accept client-proposed allocation values."""
    if (not can_access(connection, account_id, "Devices") or
            not can_access(connection, account_id, "IPAM", edit=True)):
        raise PermissionError("Devices view and IPAM edit permissions required")
    if (not isinstance(expected_fixes, list) or not expected_fixes or
            any(not isinstance(item, dict) or
                set(item) != {"ip", "deviceId"} or
                not isinstance(item["ip"], str) or
                not isinstance(item["deviceId"], str)
                for item in expected_fixes)):
        raise ValueError("Invalid IPAM repair confirmation")
    connection.execute("BEGIN IMMEDIATE")
    try:
        if (not can_access(connection, account_id, "Devices") or
                not can_access(connection, account_id, "IPAM", edit=True)):
            raise PermissionError("IPAM repair permission was revoked")
        state = reconstruct_inventory(connection)
        fixes = plan_ipam_repairs(state)
        supplied = [(item["ip"], item["deviceId"]) for item in expected_fixes]
        actual = [(fix["ip"], fix["deviceId"]) for fix in fixes]
        if supplied != actual:
            raise ValueError("Inventory changed. Preview repairs again.")
        active = {device_id for (device_id,) in connection.execute(
            "SELECT device_id FROM device_edit_reservations WHERE expires_at>?",
            (int(time.time()),)
        )}
        if any(fix["deviceId"] in active for fix in fixes):
            raise ValueError("An affected device is being edited by another user.")
        changes = []
        for fix in fixes:
            ip = fix["ip"]
            existing = state["ipAllocations"].get(ip)
            if (existing and existing.get("reservedForDeviceId") not in
                    (None, "", fix["deviceId"])):
                raise ValueError("IP address is reserved for another device")
            updated = dict(existing or {})
            updated.update(fix["expected"])
            state["ipAllocations"][ip] = updated
            action = "Updated" if existing else "Created"
            fields = ([key for key in dict.fromkeys((*existing, *updated))
                       if existing.get(key) != updated.get(key)][:16]
                      if existing else [])
            changes.append({
                "action": action, "kind": "IPAM", "label": ip, "fields": fields
            })
        validate_normalisation_devices(state)
        errors = validate_detached_application_state(state)
        if errors:
            raise ValueError(errors[0])
        conflicts = find_rack_import_conflicts(state)
        if conflicts:
            raise ValueError(conflicts[0])

        for fix in fixes:
            ip = fix["ip"]
            connection.execute(
                "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?) "
                "ON CONFLICT(ip) DO UPDATE SET record_json=excluded.record_json",
                (ip, json.dumps(state["ipAllocations"][ip],
                                ensure_ascii=False, allow_nan=False))
            )
        event = {
            "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "reason": "Phase 11C confirmed IPAM repairs",
            "changes": changes[:60], "omitted": max(0, len(changes) - 60)
        }
        connection.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps(event, ensure_ascii=False),)
        )
        connection.execute(
            "DELETE FROM inventory_change_history WHERE id NOT IN "
            "(SELECT id FROM inventory_change_history ORDER BY id DESC LIMIT 200)"
        )
        connection.commit()
        return len(fixes)
    except BaseException:
        connection.rollback()
        raise
