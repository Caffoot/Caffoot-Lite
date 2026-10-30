"""Reserved device record saves against the authoritative SQLite inventory."""
import json
import time
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import reconstruct_inventory
from .normalisation_validation import validate_normalisation_devices
from .permissions import can_access
from .rack_validation import find_rack_import_conflicts


_GUEST_FIELDS = frozenset((
    "virtualHostId", "status", "virtualPlatform",
    "previousVirtualHosts", "previousVirtualPlatforms",
))


def _check_primary_ip_claim(allocations, new_ip, device_id, old_ip=""):
    """Apply the published primary-IP ownership and reservation checks."""
    if not new_ip:
        return
    allocation = allocations.get(new_ip)
    if allocation is None:
        return
    if allocation.get("deviceId") not in (None, "", device_id):
        raise ValueError(f"IP address {new_ip} is linked to another device in IPAM.")
    if allocation.get("reservedForDeviceId") not in (None, "", device_id):
        raise ValueError(f"IP address {new_ip} is reserved for another device.")
    if (new_ip != old_ip and not allocation.get("deviceId") and
            allocation.get("status") in ("Reserved", "Assigned") and
            allocation.get("reservedForDeviceId") != device_id):
        raise ValueError(
            f"IP address {new_ip} is already {allocation['status'].lower()} in IPAM."
        )


def _prepare_related_guests(connection, candidate, host_id, related_devices, account_id):
    """Validate the published host/guest choices within the host transaction."""
    if related_devices is None:
        return []
    if not isinstance(related_devices, list):
        raise ValueError("Invalid related device changes")
    originals = {record["id"]: record for record in candidate["devices"]}
    updates = []
    seen = set()
    now = int(time.time())
    for item in related_devices:
        if not isinstance(item, dict) or set(item) != {"deviceId", "revision", "record"}:
            raise ValueError("Invalid related device change")
        guest_id, revision, record = item["deviceId"], item["revision"], item["record"]
        if (not isinstance(guest_id, str) or guest_id == host_id or guest_id in seen
                or type(revision) is not int or revision < 0 or not isinstance(record, dict)
                or record.get("id") != guest_id):
            raise ValueError("Invalid related device change")
        seen.add(guest_id)
        previous = originals.get(guest_id)
        if previous is None or previous.get("virtualHostId") != host_id:
            raise ValueError("Related device is not hosted by this device")
        changed = {key for key in set(previous) | set(record)
                   if previous.get(key) != record.get(key)}
        if not changed or not changed.issubset(_GUEST_FIELDS):
            raise ValueError("Unsupported related device change")
        row = connection.execute(
            "SELECT revision FROM inventory_devices WHERE id=?", (guest_id,)
        ).fetchone()
        if row is None or row[0] != revision:
            raise ValueError("Related device has changed since editing began")
        reservation = connection.execute(
            "SELECT account_id,expires_at FROM device_edit_reservations WHERE device_id=?",
            (guest_id,)
        ).fetchone()
        if reservation and reservation[1] > now and reservation[0] != account_id:
            raise ValueError("Related device is being edited by another user")
        updates.append((previous, record, changed))
    replacements = {record["id"]: record for _, record, _ in updates}
    candidate["devices"] = [replacements.get(record["id"], record)
                            for record in candidate["devices"]]
    return updates


def _persist_related_guests(connection, updates):
    changes = []
    for previous, record, changed in updates:
        connection.execute(
            "UPDATE inventory_devices SET name=?,record_json=?,revision=revision+1 WHERE id=?",
            (record["name"], json.dumps(record, ensure_ascii=False, allow_nan=False), record["id"]),
        )
        changes.append({"action": "Updated", "kind": "Device",
                        "label": str(record["name"])[:100], "fields": sorted(changed)[:16]})
    return changes


def save_reserved_device(connection, account_id, device_id, revision, record, section="Devices", related_devices=None):
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
        if related_devices and not can_access(connection, account_id, "Devices", edit=True):
            raise PermissionError("Devices edit permission required for related changes")
        related_updates = _prepare_related_guests(
            connection, candidate, device_id, related_devices, account_id
        )

        # IPAM owns assignments: update the shared allocation table in the same
        # transaction as the device, never leave a second device-only IP authority.
        old_ip = previous.get("primaryIp")
        new_ip = record.get("primaryIp")
        allocations = candidate["ipAllocations"]
        before_allocations = json.loads(json.dumps(allocations))
        _check_primary_ip_claim(allocations, new_ip, device_id, old_ip)
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
        changes = _persist_related_guests(connection, related_updates)
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
            _check_primary_ip_claim(candidate["ipAllocations"], new_ip, record["id"])
            allocation = candidate["ipAllocations"].get(new_ip)
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


def delete_reserved_device(connection, account_id, device_id, revision, related_devices=None):
    """Delete an exclusively reserved device and release its IPAM assignment."""
    if not can_access(connection, account_id, "Devices", edit=True):
        raise PermissionError("Devices edit permission required")
    if not isinstance(device_id, str) or not device_id or type(revision) is not int or revision < 0:
        raise ValueError("Invalid device deletion")
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT record_json,revision FROM inventory_devices WHERE id=?", (device_id,)
        ).fetchone()
        reservation = connection.execute(
            "SELECT account_id,expires_at,base_revision FROM device_edit_reservations WHERE device_id=?",
            (device_id,),
        ).fetchone()
        if row is None or reservation is None or reservation[0] != account_id or reservation[1] <= int(time.time()):
            raise ValueError("Device edit reservation is no longer valid")
        if row[1] != revision or reservation[2] != revision:
            raise ValueError("Device has changed since editing began")
        previous = json.loads(row[0])
        candidate = reconstruct_inventory(connection)
        candidate["devices"] = [
            device for device in candidate["devices"] if device["id"] != device_id
        ]
        related_updates = _prepare_related_guests(
            connection, candidate, device_id, related_devices, account_id
        )
        # The published inventory's relationships must remain valid after deletion.
        # Do not silently delete dependent virtual machines or other records.
        old_ip = previous.get("primaryIp")
        allocation_updates = {}
        for ip, allocation in candidate["ipAllocations"].items():
            if allocation.get("deviceId") != device_id and allocation.get("reservedForDeviceId") != device_id:
                continue
            before = dict(allocation)
            if allocation.get("deviceId") == device_id:
                allocation["deviceId"] = ""
                allocation["status"] = "Available"
                if ip == old_ip:
                    allocation["hostname"] = ""
            if allocation.get("reservedForDeviceId") == device_id:
                allocation["reservedForDeviceId"] = ""
            if before != allocation:
                allocation_updates[ip] = (before, allocation)
        errors = validate_detached_application_state(candidate)
        if errors:
            raise ValueError(errors[0])
        conflicts = find_rack_import_conflicts(candidate)
        if conflicts:
            raise ValueError(conflicts[0])
        _persist_related_guests(connection, related_updates)
        connection.execute("DELETE FROM inventory_devices WHERE id=?", (device_id,))
        for ip, (_, allocation) in allocation_updates.items():
            connection.execute(
                "UPDATE inventory_ip_allocations SET record_json=? WHERE ip=?",
                (json.dumps(allocation, ensure_ascii=False, allow_nan=False), ip),
            )
        changes = [{"action": "Deleted", "kind": "Device",
                    "label": previous["name"][:100], "fields": []}]
        for old_guest, new_guest, fields in related_updates:
            changes.append({"action":"Updated", "kind":"Device",
                            "label":new_guest["name"][:100], "fields":sorted(fields)[:16]})
        for ip, (before, after) in allocation_updates.items():
            fields = [key for key in dict.fromkeys((*before, *after))
                      if before.get(key) != after.get(key)]
            changes.append({"action": "Updated", "kind": "IPAM",
                            "label": ip, "fields": fields[:16]})
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
        connection.execute("DELETE FROM device_edit_reservations WHERE device_id=?", (device_id,))
        connection.commit()
        return True
    except BaseException:
        connection.rollback()
        raise
