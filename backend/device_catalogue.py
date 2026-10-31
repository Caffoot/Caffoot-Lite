"""Published Device Types and Locations management on central SQLite."""
import json
import time
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import reconstruct_inventory
from .normalisation_pipeline import PUBLISHED_DEFAULTS
from .normalisation_validation import validate_normalisation_devices
from .permissions import can_access
from .rack_validation import find_rack_import_conflicts


def change_device_catalogue(connection, account_id, kind, operation, old_name,
                            new_name, expected_devices):
    """Save an existing v1.3.3 manager operation and dependent devices atomically."""
    if not can_access(connection, account_id, "Devices", edit=True):
        raise PermissionError("Devices edit permission required")
    if kind not in ("type", "location") or operation not in ("add", "rename", "delete"):
        raise ValueError("Invalid managed catalogue operation")
    if not isinstance(old_name, str) or not isinstance(new_name, str):
        raise ValueError("Invalid managed catalogue name")
    if (not isinstance(expected_devices, list) or
            any(not isinstance(item, str) for item in expected_devices) or
            len(set(expected_devices)) != len(expected_devices)):
        raise ValueError("Invalid affected device list")
    key = "deviceTypes" if kind == "type" else "deviceLocations"
    field = "type" if kind == "type" else "location"
    name = new_name.strip()
    connection.execute("BEGIN IMMEDIATE")
    try:
        state = reconstruct_inventory(connection)
        raw_list = state.get(key, PUBLISHED_DEFAULTS[key])
        if not isinstance(raw_list, list):
            raise ValueError("Invalid managed catalogue")
        original_list = list(raw_list)
        available = list(dict.fromkeys(
            value for value in (*raw_list, *(device.get(field) for device in state["devices"]))
            if isinstance(value, str) and value
        ))
        if operation != "delete":
            if not name:
                raise ValueError("Enter a name first.")
            if len(name) > 100:
                raise ValueError("Name is too long.")
            if (name.lower() == "unknown" or
                    (kind == "location" and name.lower() == "racked")) and (
                    operation == "add" or name.lower() != old_name.lower()
            ):
                raise ValueError("That name is reserved for a system value.")
            if any(value.lower() == name.lower() and
                   (operation == "add" or value != old_name) for value in available):
                raise ValueError("That name already exists.")
        if operation != "add" and (
                old_name.lower() == "unknown" or old_name not in available):
            raise ValueError("This entry cannot be changed.")
        if operation == "rename" and old_name == name:
            connection.commit()
            return 0

        affected = [device for device in state["devices"]
                    if operation != "add" and device.get(field) == old_name]
        if set(expected_devices) != {device["id"] for device in affected}:
            raise ValueError("Affected devices have changed. Refresh the inventory.")
        if affected:
            active = {device_id for (device_id,) in connection.execute(
                "SELECT device_id FROM device_edit_reservations WHERE expires_at>?",
                (int(time.time()),)
            )}
            if any(device["id"] in active for device in affected):
                raise ValueError("An affected device is being edited by another user.")

        if operation == "add":
            state[key] = list(dict.fromkeys((*raw_list, name)))
        elif operation == "rename":
            state[key] = list(dict.fromkeys(
                (*(name if value == old_name else value for value in raw_list), name)
            ))
        else:
            state[key] = [value for value in raw_list if value != old_name]

        original_graphics = state.get("deviceTypeGraphics", {})
        if not isinstance(original_graphics, dict):
            raise ValueError("Invalid device type graphics")
        graphics = dict(original_graphics)
        if kind == "type" and operation == "rename" and old_name in graphics:
            graphics[name] = graphics.pop(old_name)
        elif kind == "type" and operation == "delete":
            graphics.pop(old_name, None)
        state["deviceTypeGraphics"] = graphics

        new_value = name if operation == "rename" else "Unknown"
        updated = {device["id"]: dict(device, **{field: new_value}) for device in affected}
        state["devices"] = [updated.get(device["id"], device)
                            for device in state["devices"]]
        validate_normalisation_devices(state)
        errors = validate_detached_application_state(state)
        if errors:
            raise ValueError(errors[0])
        conflicts = find_rack_import_conflicts(state)
        if conflicts:
            raise ValueError(conflicts[0])

        for device in affected:
            connection.execute(
                "UPDATE inventory_devices SET record_json=?,revision=revision+1 WHERE id=?",
                (json.dumps(updated[device["id"]], ensure_ascii=False, allow_nan=False),
                 device["id"])
            )
        for setting in (key, "deviceTypeGraphics"):
            if setting != key and graphics == original_graphics:
                continue
            connection.execute(
                "INSERT INTO inventory_settings(key,value_json) VALUES(?,?) "
                "ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json",
                (setting, json.dumps(state[setting], ensure_ascii=False, allow_nan=False))
            )
        changes = [
            {"action": "Updated", "kind": "Device", "label": str(d["name"])[:100],
             "fields": [field]}
            for d in affected
        ]
        if original_list != state[key]:
            changes.append({
                "action": "Updated",
                "kind": "Device types" if kind == "type" else "Locations",
                "label": "Managed list", "fields": []
            })
        if changes:
            event = {
                "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "reason": "Inventory saved", "changes": changes[:60],
                "omitted": max(0, len(changes) - 60)
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
        return len(affected)
    except BaseException:
        connection.rollback()
        raise
