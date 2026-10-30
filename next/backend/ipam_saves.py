"""SQLite-backed independent IPAM allocation changes."""
import json
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import reconstruct_inventory
from .permissions import can_access


def change_independent_allocation(connection, account_id, ip, record):
    """Save or delete an unassigned IP allocation without altering device-owned links."""
    if not can_access(connection, account_id, "IPAM", edit=True):
        raise PermissionError("IPAM edit permission required")
    if not isinstance(ip, str) or not ip or (record is not None and not isinstance(record, dict)):
        raise ValueError("Invalid IPAM allocation")
    connection.execute("BEGIN IMMEDIATE")
    try:
        state = reconstruct_inventory(connection)
        before = state["ipAllocations"].get(ip)
        if before and before.get("deviceId"):
            raise ValueError("Device-linked IP assignments must be edited through the device")
        if record is not None and record.get("deviceId"):
            raise ValueError("Device-linked IP assignments must be edited through the device")
        if record is None:
            if before is None:
                raise ValueError("IPAM allocation not found")
            del state["ipAllocations"][ip]
        else:
            state["ipAllocations"][ip] = record
        errors = validate_detached_application_state(state)
        if errors:
            raise ValueError(errors[0])
        if record is None:
            connection.execute("DELETE FROM inventory_ip_allocations WHERE ip=?", (ip,))
        else:
            connection.execute(
                "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?) "
                "ON CONFLICT(ip) DO UPDATE SET record_json=excluded.record_json",
                (ip, json.dumps(record, ensure_ascii=False, allow_nan=False)),
            )
        if before != record:
            action = "Created" if before is None else "Deleted" if record is None else "Updated"
            fields = ([key for key in dict.fromkeys((*before, *record))
                       if before.get(key) != record.get(key)][:16]
                      if action == "Updated" else [])
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": "Inventory saved",
                     "changes": [{"action": action, "kind": "IPAM",
                                  "label": ip, "fields": fields}], "omitted": 0}
            connection.execute(
                "INSERT INTO inventory_change_history(record_json) VALUES(?)",
                (json.dumps(event, ensure_ascii=False),),
            )
            connection.execute(
                "DELETE FROM inventory_change_history WHERE id NOT IN "
                "(SELECT id FROM inventory_change_history ORDER BY id DESC LIMIT 200)"
            )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
