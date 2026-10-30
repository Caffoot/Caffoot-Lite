"""Transactional inventory collection changes for published IPAM and Racks workflows."""
import json
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import COLLECTIONS, reconstruct_inventory
from .normalisation_validation import validate_normalisation_devices, validate_normalisation_vlans
from .permissions import can_access
from .rack_validation import find_rack_import_conflicts

SECTIONS = {"subnets": "IPAM", "vlans": "IPAM",
            "racks": "Racks", "rackAccessories": "Racks"}


def change_inventory_record(connection, account_id, collection, record_id, record):
    """Create, update or delete one source-shaped record without replacing other inventory."""
    section = SECTIONS.get(collection)
    if section is None or not can_access(connection, account_id, section, edit=True):
        raise PermissionError("Section edit permission required")
    if (not isinstance(record_id, str) or not record_id or
            (record is not None and
             (not isinstance(record, dict) or record.get("id") != record_id))):
        raise ValueError("Invalid inventory record")
    connection.execute("BEGIN IMMEDIATE")
    try:
        state = reconstruct_inventory(connection)
        records = state[collection]
        existing = next((item for item in records if item["id"] == record_id), None)
        if record is None:
            if existing is None:
                raise ValueError("Inventory record not found")
            state[collection] = [item for item in records if item["id"] != record_id]
        elif existing is None:
            records.append(record)
        else:
            state[collection] = [record if item["id"] == record_id else item
                                 for item in records]
        validate_normalisation_vlans(state)
        validate_normalisation_devices(state)
        errors = validate_detached_application_state(state)
        if errors:
            raise ValueError(errors[0])
        conflicts = find_rack_import_conflicts(state)
        if conflicts:
            raise ValueError(conflicts[0])
        table = COLLECTIONS[collection]
        if record is None:
            connection.execute("DELETE FROM " + table + " WHERE id=?", (record_id,))
        elif existing is None:
            ordinal = connection.execute(
                "SELECT COALESCE(MAX(ordinal),-1)+1 FROM " + table
            ).fetchone()[0]
            if collection == "rackAccessories":
                connection.execute(
                    "INSERT INTO inventory_rack_accessories(id,rack_id,record_json,ordinal) "
                    "VALUES(?,?,?,?)",
                    (record_id, record.get("rackId", ""),
                     json.dumps(record, ensure_ascii=False, allow_nan=False), ordinal),
                )
            else:
                connection.execute(
                    "INSERT INTO " + table + "(id,record_json,ordinal) VALUES(?,?,?)",
                    (record_id, json.dumps(record, ensure_ascii=False, allow_nan=False),
                     ordinal),
                )
        elif collection == "rackAccessories":
            connection.execute(
                "UPDATE inventory_rack_accessories SET rack_id=?,record_json=? WHERE id=?",
                (record.get("rackId", ""),
                 json.dumps(record, ensure_ascii=False, allow_nan=False), record_id),
            )
        else:
            connection.execute(
                "UPDATE " + table + " SET record_json=? WHERE id=?",
                (json.dumps(record, ensure_ascii=False, allow_nan=False), record_id),
            )
        if existing != record:
            action = "Created" if existing is None else "Deleted" if record is None else "Updated"
            fields = ([key for key in dict.fromkeys((*existing, *record))
                       if existing.get(key) != record.get(key)][:16]
                      if action == "Updated" else [])
            kind = {"subnets": "IPAM", "vlans": "IPAM",
                    "racks": "Rack", "rackAccessories": "Rack"}[collection]
            label = str((record or existing).get("name") or record_id)[:100]
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": "Inventory saved",
                     "changes": [{"action": action, "kind": kind,
                                  "label": label, "fields": fields}], "omitted": 0}
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
