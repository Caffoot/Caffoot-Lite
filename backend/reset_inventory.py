"""Restore empty operational data while retaining security and Change History."""
import copy
from datetime import datetime, timezone
import json

from .application_integrity import validate_detached_application_state
from .audit_events import attribute_event
from .equipment_lifecycle_schema import seed_equipment_lifecycle_defaults
from .inventory import _write_detached, reconstruct_inventory
from .normalisation_pipeline import PUBLISHED_DEFAULTS
from .permissions import can_access
from .service_desk_schema import DEFAULT_TICKET_CATEGORIES
from .supplier_issue_schema import INITIAL_ISSUE_CATEGORIES
from .supplier_schema import INITIAL_CATEGORIES

# Ticket detail rows cascade with their ticket. Other dependants are removed
# before their parents, apart from the cycles in the stock and assignment ledger.
OPERATIONAL_TABLES = (
    'service_desk_tickets', 'service_desk_categories',
    'device_equipment_associations', 'device_suppliers', 'receipt_suppliers',
    'device_lifecycle', 'it_asset_stock_entries', 'device_assignments',
    'it_asset_stock_movements', 'it_asset_stock_units', 'it_asset_stock_items',
    'supplier_issue_updates', 'supplier_issue_contacts', 'supplier_issues',
    'supplier_notes', 'supplier_contact_locations', 'supplier_category_assignments',
    'supplier_supply_history', 'supplier_contacts', 'supplier_locations', 'suppliers',
    'supplier_issue_categories', 'supplier_categories',
    'equipment_lifecycle_settings', 'equipment_lifecycle_types',
)
OPERATIONAL_DELETE_GUARDS = (
    'device_equipment_associations_no_delete', 'receipt_supplier_no_delete',
    'it_asset_entries_no_delete', 'retain_device_assignment_delete',
    'it_asset_movements_no_delete', 'it_asset_units_no_delete',
    'supplier_issue_update_no_delete', 'supplier_issue_no_delete',
    'supplier_supply_history_no_delete', 'supplier_issue_contact_retention',
)


def _restore_operational_defaults(connection, tables):
    """Replace cleared catalogues with the defaults used for a new installation."""
    if 'service_desk_categories' in tables:
        connection.executemany(
            'INSERT INTO service_desk_categories(id,name) VALUES(?,?)',
            enumerate(DEFAULT_TICKET_CATEGORIES, start=1),
        )
    for table, names in (('supplier_categories', INITIAL_CATEGORIES),
                         ('supplier_issue_categories', INITIAL_ISSUE_CATEGORIES)):
        if table in tables:
            connection.executemany(f'INSERT INTO {table}(name,name_key) VALUES(?,?)',
                                   ((name, name.casefold()) for name in names))
    if 'equipment_lifecycle_settings' in tables:
        seed_equipment_lifecycle_defaults(connection)


def _clear_operational_records(connection):
    """Clear populated modules and restore their deletion guards before commit."""
    tables = {name for (name,) in connection.execute("SELECT name FROM sqlite_schema WHERE type='table'")}
    guards = dict(connection.execute(
        "SELECT name,sql FROM sqlite_schema WHERE type='trigger' AND name IN ("
        + ','.join('?' for _ in OPERATIONAL_DELETE_GUARDS) + ')', OPERATIONAL_DELETE_GUARDS,
    ))
    # The ledger has references in both directions. SQLite checks the final
    # relationships at commit even for references normally restricted at once.
    connection.execute('PRAGMA defer_foreign_keys=ON')
    for name in guards:
        connection.execute(f'DROP TRIGGER {name}')
    removed_tickets = 0
    for table in OPERATIONAL_TABLES:
        if table in tables:
            deleted = connection.execute(f'DELETE FROM {table}').rowcount
            if table == 'service_desk_tickets':
                removed_tickets = deleted
    if 'staff_members' in tables:
        connection.execute('DELETE FROM staff_members WHERE account_id IS NULL')
        # A retained login keeps its Staff identity and eligibility. Rebuild
        # its contact fields from the account profile and clear directory data.
        connection.execute("""
            UPDATE staff_members
            SET first_name=coalesce((SELECT first_name FROM account_profiles
                                     WHERE account_id=staff_members.account_id),''),
                last_name=coalesce((SELECT last_name FROM account_profiles
                                    WHERE account_id=staff_members.account_id),''),
                email=coalesce((SELECT email FROM account_profiles
                                WHERE account_id=staff_members.account_id),''),
                department_id=NULL, job_title='', telephone='', location=''
        """)
        connection.execute('DELETE FROM departments')
    _restore_operational_defaults(connection, tables)
    for definition in guards.values():
        connection.execute(definition)
    return removed_tickets


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
    connection.execute("PRAGMA foreign_keys=ON")
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

        # Secure deletion overwrites freed SQLite data, including attachments.
        connection.execute('PRAGMA secure_delete=ON')
        if _clear_operational_records(connection):
            changes.insert(0, {'action': 'Deleted', 'kind': 'Service Desk',
                               'label': 'Service Desk ticket data', 'fields': []})
        connection.execute("DELETE FROM device_edit_reservations")
        _write_detached(connection, clean)
        if connection.execute('PRAGMA foreign_key_check').fetchone() is not None:
            raise ValueError('Clean Start could not verify the remaining relationships. No data was cleared.')
        event = {
            "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "reason": "Clean inventory reset",
            "operationalReset": True,
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
