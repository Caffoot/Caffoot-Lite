"""Apply Clean Start to inventory and Service Desk data in one transaction."""
import copy
import json
import sqlite3
from .audit_events import attribute_event
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import _write_detached, reconstruct_inventory
from .normalisation_pipeline import PUBLISHED_DEFAULTS
from .permissions import can_access
from .service_desk_schema import has_service_desk_storage


def reset_inventory(connection, account_id):
    """Reset operational data and retain accounts and central Change History."""
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

        # The ticket and attachment bytes are in SQLite, so a failed inventory
        # reset restores them too. Overwrite any pages freed by this deletion.
        connection.execute('PRAGMA secure_delete=ON')
        removed_tickets = (connection.execute('DELETE FROM service_desk_tickets').rowcount
                           if has_service_desk_storage(connection) else 0)
        if removed_tickets:
            changes.insert(0, {'action': 'Deleted', 'kind': 'Service Desk',
                               'label': 'Service Desk ticket data', 'fields': []})
        connection.execute("DELETE FROM device_edit_reservations")
        try:
            _write_detached(connection, clean)
        except sqlite3.IntegrityError as error:
            if str(error) == 'FOREIGN KEY constraint failed':
                raise ValueError('Existing equipment history prevents Clean Start. No data was cleared.') from error
            raise
        event = {
            "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "reason": "Clean inventory reset",
            "changes": changes[:60], "omitted": max(0, len(changes) - 60)
        }
        connection.execute(
            "INSERT INTO inventory_change_history(record_json) VALUES(?)",
            (json.dumps(attribute_event(connection, account_id, event), ensure_ascii=False),)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
