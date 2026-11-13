"""Persist existing v1.3.3 managed inventory settings in SQLite."""
import json
from .audit_events import attribute_event
from datetime import datetime, timezone

from .inventory import SETTINGS
from .permissions import can_access

SOFTWARE_SERVICE_NAME_MAX_LENGTH = 100

# Managed hardware, software and device options belong to Devices.
def save_inventory_setting(connection, account_id, key, value):
    if key not in SETTINGS:
        raise ValueError("Unknown inventory setting")
    if not can_access(connection, account_id, "Devices", edit=True):
        raise PermissionError("Inventory edit permission required")
    encoded = json.dumps(value, ensure_ascii=False, allow_nan=False)
    connection.execute("BEGIN IMMEDIATE")
    try:
        if not can_access(connection, account_id, "Devices", edit=True):
            raise PermissionError("Section edit permission was revoked")
        row = connection.execute(
            "SELECT value_json FROM inventory_settings WHERE key=?", (key,)
        ).fetchone()
        if key in ("installedSoftware", "serverFunctions") and isinstance(value, list):
            previous = json.loads(row[0]) if row else []
            # Leave existing names untouched when saving other catalogue changes.
            # New or renamed entries must use the same limit as the browser forms.
            previous = previous if isinstance(previous, list) else []
            for item in value:
                if not isinstance(item, dict) or not isinstance(item.get("label"), str):
                    continue
                if (len(item["label"].encode("utf-16-le", errors="surrogatepass")) // 2 >
                        SOFTWARE_SERVICE_NAME_MAX_LENGTH and not any(
                            isinstance(old, dict) and old.get("key") == item.get("key") and
                            old.get("label") == item["label"] for old in previous)):
                    raise ValueError("Software and service names must be 100 characters or fewer.")
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
                (json.dumps(attribute_event(connection, account_id, event), ensure_ascii=False),),
            )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
