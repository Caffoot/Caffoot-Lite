"""Reserved device record saves against the authoritative SQLite inventory."""
import json
import time

from .application_integrity import validate_detached_application_state
from .inventory import reconstruct_inventory
from .normalisation_validation import validate_normalisation_devices
from .permissions import can_access


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
        candidate["devices"] = [record if device["id"] == device_id else device
                                for device in candidate["devices"]]
        validate_normalisation_devices(candidate)
        errors = validate_detached_application_state(candidate)
        if errors:
            raise ValueError(errors[0])
        connection.execute(
            "UPDATE inventory_devices SET name=?,record_json=?,revision=revision+1 WHERE id=?",
            (record["name"], json.dumps(record, ensure_ascii=False, allow_nan=False), device_id),
        )
        connection.execute("DELETE FROM device_edit_reservations WHERE device_id=?", (device_id,))
        connection.commit()
        return revision + 1
    except BaseException:
        connection.rollback()
        raise
