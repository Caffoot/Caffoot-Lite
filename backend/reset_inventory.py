"""Approved Clean Start: reset only central inventory, not user accounts."""
import copy
import json
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import _write_detached, reconstruct_inventory
from .normalisation_pipeline import PUBLISHED_DEFAULTS
from .permissions import can_access


def reset_inventory(connection, account_id):
    """Published Clean Start inventory defaults and Change History, atomically."""
    if not all(can_access(connection, account_id, section, edit=True)
               for section in ("Devices", "IPAM", "Racks")):
        raise PermissionError("All inventory section edit permissions required")
    clean = copy.deepcopy(PUBLISHED_DEFAULTS)
    clean["managedOptionsCleared"] = True
    clean["stateVersion"] = 3
    errors = validate_detached_application_state(clean)
    if errors:
        raise ValueError(errors[0])
    connection.execute("BEGIN IMMEDIATE")
    try:
        if not all(can_access(connection, account_id, section, edit=True)
                   for section in ("Devices", "IPAM", "Racks")):
            raise PermissionError("Inventory reset permission was revoked")
        current = reconstruct_inventory(connection)

        changes = []
        for key, kind, label_key in (
                ("devices", "Device", "name"),
                ("subnets", "Subnet", "cidr"),
                ("racks", "Rack", "name"),
                ("vlans", "VLAN", "name")):
            for record in current[key]:
                changes.append({
                    "action": "Deleted", "kind": kind,
                    "label": str(record.get(label_key) or record["id"])[:100],
                    "fields": []
                })
        for ip in current["ipAllocations"]:
            changes.append({
                "action": "Deleted", "kind": "IPAM", "label": ip,
                "fields": []
            })
        for key, kind in (("deviceTypes", "Device types"),
                          ("deviceLocations", "Locations")):
            if current.get(key, PUBLISHED_DEFAULTS[key]) != clean[key]:
                changes.append({
                    "action": "Updated", "kind": kind,
                    "label": "Managed list", "fields": []
                })

        # Keep existing Change History and accounts: published reset records one event.
        connection.execute("DELETE FROM device_edit_reservations")
        _write_detached(connection, clean)
        event = {
            "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "reason": "Clean inventory reset",
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
    except BaseException:
        connection.rollback()
        raise
