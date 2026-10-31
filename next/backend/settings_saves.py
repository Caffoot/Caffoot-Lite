"""Persist existing v1.3.3 managed inventory settings in SQLite."""
import json
from datetime import datetime, timezone

from .inventory import SETTINGS
from .permissions import can_access

# Managed hardware, software and device options belong to Devices.
def save_inventory_setting(connection, account_id, key, value):
    if key not in SETTINGS:
        raise ValueError("Unknown inventory setting")
    if not can_access(connection, account_id, "Devices", edit=True):
        raise PermissionError("Inventory edit permission required")
    encoded = json.dumps(value, ensure_ascii=False, allow_nan=False)
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT value_json FROM inventory_settings WHERE key=?", (key,)
        ).fetchone()
        if row is None or json.loads(row[0]) != value:
            connection.execute(
                "INSERT INTO inventory_settings(key,value_json) VALUES(?,?) "
                "ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json",
                (key, encoded),
            )
            action = "Created" if row is None else "Updated"
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": "Inventory saved",
                     "changes": [{"action": action, "kind": "Settings",
                                  "label": key, "fields": []}], "omitted": 0}
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
