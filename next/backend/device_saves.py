"""Reserved device record saves against the authoritative SQLite inventory."""
import json
import time
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import reconstruct_inventory
from .normalisation_validation import validate_normalisation_devices
from .permissions import can_access
from .rack_validation import find_rack_import_conflicts


def save_reserved_device(connection, account_id, device_id, revision, record, section="Devices"):
    """Commit one reserved device change only if its original revision still matches."""
    if section not in ("Devices", "IPAM", "Racks") or not can_access(
        connection, account_id, section, edit=True
    ):
        raise PermissionError("Section edit permission required")
    if (not isinstance(device_id, str) or not device_id or
            type(revision) is not int or revision < 0 or
            not isinstance(record, dict) or record.get("id") != device_id or
            not isinstance(record.get("name"), str) or not record["name"].strip()):
        raise ValueError("Invalid device update")
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT revision FROM inventory_devices WHERE id=?", (device_id,)
        ).fetchone()
        reservation = connection.execute(
            "SELECT account_id,expires_at,base_revision FROM device_edit_reservations WHERE device_id=?",
            (device_id,),
        ).fetchone()
        if row is None or reservation is None or reservation[0] != account_id or reservation[1] <= int(time.time()):
            raise ValueError("Device edit reservation is no longer valid")
        if row[0] != revision or reservation[2] != revision:
            raise ValueError("Device has changed since editing began")
        candidate = reconstruct_inventory(connection)
        previous = next(device for device in candidate["devices"] if device["id"] == device_id)
        candidate["devices"] = [record if device["id"] == device_id else device
                                for device in candidate["devices"]]

        # IPAM owns assignments: update the shared allocation table in the same
        # transaction as the device, never leave a second device-only IP authority.
        old_ip = previous.get("primaryIp")
        new_ip = record.get("primaryIp")
        allocations = candidate["ipAllocations"]
        before_allocations = json.loads(json.dumps(allocations))
        if new_ip:
            current = allocations.get(new_ip)
            if current and current.get("deviceId") not in (None, "", device_id):
                raise ValueError("Primary IP is assigned to another device")
        if old_ip and old_ip != new_ip:
            old_allocation = allocations.get(old_ip)
            if old_allocation and old_allocation.get("deviceId") == device_id:
                old_allocation["deviceId"] = ""
                if old_allocation.get("status") in ("Assigned", "Reserved"):
                    old_allocation["status"] = "Available"
                old_allocation["hostname"] = ""
        if new_ip:
            allocation = allocations.setdefault(new_ip, {
                "status": "Assigned", "deviceId": "", "hostname": "", "notes": ""
            })
            allocation["deviceId"] = device_id
            allocation["status"] = "Reserved" if record.get("ipReserved") else "Assigned"
            allocation["hostname"] = record["name"]
        validate_normalisation_devices(candidate)
        errors = validate_detached_application_state(candidate)
        if errors:
            raise ValueError(errors[0])
        rack_conflicts = find_rack_import_conflicts(candidate)
        if rack_conflicts:
            raise ValueError(rack_conflicts[0])
        connection.execute(
            "UPDATE inventory_devices SET name=?,record_json=?,revision=revision+1 WHERE id=?",
            (record["name"], json.dumps(record, ensure_ascii=False, allow_nan=False), device_id),
        )
        for ip in {old_ip, new_ip} - {None, ""}:
            if ip in allocations:
                connection.execute(
                    "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?) "
                    "ON CONFLICT(ip) DO UPDATE SET record_json=excluded.record_json",
                    (ip, json.dumps(allocations[ip], ensure_ascii=False, allow_nan=False)),
                )
        changes = []
        if previous != record:
            fields = [key for key in dict.fromkeys((*previous, *record))
                      if key != "id" and previous.get(key) != record.get(key)]
            changes.append({"action": "Updated", "kind": "Device",
                            "label": str(record["name"])[:100], "fields": fields[:16]})
        for ip in dict.fromkeys((old_ip, new_ip)):
            if not ip:
                continue
            before_ip = before_allocations.get(ip)
            after_ip = allocations.get(ip)
            if before_ip == after_ip:
                continue
            action = ("Created" if before_ip is None else
                      "Deleted" if after_ip is None else "Updated")
            fields = ([key for key in dict.fromkeys(
                (*(before_ip or {}), *(after_ip or {})))
                if (before_ip or {}).get(key) != (after_ip or {}).get(key)][:16]
                if action == "Updated" else [])
            changes.append({"action": action, "kind": "IPAM",
                            "label": ip, "fields": fields})
        if changes:
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": "Inventory saved", "changes": changes[:60],
                     "omitted": max(0, len(changes) - 60)}
            connection.execute(
                "INSERT INTO inventory_change_history(record_json) VALUES(?)",
                (json.dumps(event, ensure_ascii=False),),
            )
            connection.execute(
                "DELETE FROM inventory_change_history WHERE id NOT IN "
                "(SELECT id FROM inventory_change_history ORDER BY id DESC LIMIT 200)"
            )
        connection.execute("DELETE FROM device_edit_reservations WHERE device_id=?", (device_id,))
        connection.commit()
        return revision + 1
    except BaseException:
        connection.rollback()
        raise


def create_device(connection, account_id, record):
    """Create a published-shape device with its IPAM allocation atomically."""
    if not can_access(connection, account_id, "Devices", edit=True):
        raise PermissionError("Devices edit permission required")
    if (not isinstance(record, dict) or not isinstance(record.get("id"), str)
            or not record["id"] or not isinstance(record.get("name"), str)
            or not record["name"].strip()):
        raise ValueError("Invalid device")
    connection.execute("BEGIN IMMEDIATE")
    try:
        candidate = reconstruct_inventory(connection)
        if any(device.get("id") == record["id"] for device in candidate["devices"]):
            raise ValueError("Device identifier already exists")
        candidate["devices"].append(record)
        new_ip = record.get("primaryIp")
        if new_ip:
            allocation = candidate["ipAllocations"].get(new_ip)
            if allocation and allocation.get("deviceId") not in (None, ""):
                raise ValueError("Primary IP is assigned to another device")
            if allocation is None:
                allocation = {"status": "Available", "deviceId": "", "hostname": "", "notes": ""}
                candidate["ipAllocations"][new_ip] = allocation
            allocation.update({
                "deviceId": record["id"],
                "status": "Reserved" if record.get("ipReserved") else "Assigned",
                "hostname": record["name"],
            })
        validate_normalisation_devices(candidate)
        errors = validate_detached_application_state(candidate)
        if errors:
            raise ValueError(errors[0])
        conflicts = find_rack_import_conflicts(candidate)
        if conflicts:
            raise ValueError(conflicts[0])
        ordinal = connection.execute(
            "SELECT COALESCE(MAX(ordinal),-1)+1 FROM inventory_devices"
        ).fetchone()[0]
        connection.execute(
            "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
            (record["id"], record["name"],
             json.dumps(record, ensure_ascii=False, allow_nan=False), ordinal),
        )
        if new_ip:
            connection.execute(
                "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?) "
                "ON CONFLICT(ip) DO UPDATE SET record_json=excluded.record_json",
                (new_ip, json.dumps(candidate["ipAllocations"][new_ip],
                                    ensure_ascii=False, allow_nan=False)),
            )
        changes = [{"action": "Created", "kind": "Device",
                    "label": record["name"][:100], "fields": []}]
        if new_ip:
            changes.append({"action": "Updated", "kind": "IPAM",
                            "label": new_ip, "fields": ["deviceId", "status", "hostname"]})
        event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                 "reason": "Inventory saved", "changes": changes, "omitted": 0}
        connection.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps(event, ensure_ascii=False),),
        )
        connection.execute(
            "DELETE FROM inventory_change_history WHERE id NOT IN "
            "(SELECT id FROM inventory_change_history ORDER BY id DESC LIMIT 200)"
        )
        connection.commit()
        return 0
    except BaseException:
        connection.rollback()
        raise
