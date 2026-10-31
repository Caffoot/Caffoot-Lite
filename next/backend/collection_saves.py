"""Transactional inventory collection changes for published IPAM and Racks workflows."""
import json
import time
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import COLLECTIONS, reconstruct_inventory
from .ipam_validation import ip_belongs_to_subnet
from .normalisation_validation import (_number, validate_normalisation_devices,
                                        validate_normalisation_vlans)
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


def change_ipam_subnet_and_vlan_records(connection, account_id, changes):
    """Save the published subnet form's linked subnet/VLAN edits as one transaction."""
    if not can_access(connection, account_id, "IPAM", edit=True):
        raise PermissionError("IPAM edit permission required")
    if not isinstance(changes, list) or not changes:
        raise ValueError("Invalid subnet changes")
    connection.execute("BEGIN IMMEDIATE")
    try:
        state = reconstruct_inventory(connection)
        before = {key: list(state[key]) for key in ("subnets", "vlans")}
        seen, operations = set(), []
        for change in changes:
            if not isinstance(change, dict) or set(change) != {"collection", "id", "record"}:
                raise ValueError("Invalid subnet change")
            collection, identifier, record = (change["collection"], change["id"],
                                              change["record"])
            if (collection not in ("subnets", "vlans") or
                    not isinstance(identifier, str) or not identifier or
                    (collection, identifier) in seen or
                    (record is not None and
                     (not isinstance(record, dict) or record.get("id") != identifier))):
                raise ValueError("Invalid subnet or VLAN record")
            seen.add((collection, identifier))
            records = state[collection]
            existing = next((item for item in records if item["id"] == identifier), None)
            if record is None:
                if existing is None:
                    raise ValueError("Inventory record not found")
                state[collection] = [item for item in records if item["id"] != identifier]
            elif existing is None:
                records.append(record)
            else:
                state[collection] = [record if item["id"] == identifier else item
                                     for item in records]
            operations.append((collection, identifier, record, existing))

        # The published VLAN removal workflow refuses to remove a linked VLAN.
        for collection, identifier, record, existing in operations:
            if collection != "vlans" or record is not None or existing is None:
                continue
            domain = existing.get("parentId") or "__unassigned__"
            linked = any(
                (not subnet.get("kind") or subnet.get("kind") == "network") and
                _number(subnet.get("vlan")) == _number(existing.get("vlanId")) and
                (subnet.get("parentId") or "__unassigned__") == domain
                for subnet in state["subnets"]
            )
            if linked:
                raise ValueError(
                    "Delete or reassign the linked subnet before deleting this VLAN."
                )

        # Retain the published form's CIDR dependency and gateway rules.
        for collection, identifier, record, _ in operations:
            if collection != "subnets" or record is None:
                continue
            original = next((item for item in before["subnets"]
                             if item["id"] == identifier), None)
            if original and original.get("cidr") != record.get("cidr"):
                dependent_devices = [
                    d for d in state["devices"] if d.get("primaryIp") and
                    ip_belongs_to_subnet(d["primaryIp"], original.get("cidr"))]
                dependent_ips = [
                    ip for ip in state["ipAllocations"] if
                    ip_belongs_to_subnet(ip, original.get("cidr"))]
                if dependent_devices or dependent_ips:
                    raise ValueError(
                        f"CIDR cannot be changed while {len(dependent_devices)} device(s) "
                        f"and {len(dependent_ips)} IPAM allocation(s) depend on the subnet."
                    )
            if record.get("kind") == "container":
                continue
            gateway = record.get("gateway")
            owners = [d for d in state["devices"] if d.get("primaryIp") == gateway]
            allocation = state["ipAllocations"].get(gateway)
            permitted = (original is not None and original.get("gateway") == gateway and
                         len(owners) == 1 and
                         owners[0].get("type") in ("Firewall", "Router", "Layer 3 Switch") and
                         allocation is not None and
                         allocation.get("deviceId") == owners[0]["id"] and
                         (not allocation.get("reservedForDeviceId") or
                          allocation["reservedForDeviceId"] == owners[0]["id"]))
            if (owners or allocation) and not permitted:
                raise ValueError(
                    "Gateway IP is already assigned or reserved. "
                    "Release that address before using it as a gateway."
                )

        validate_normalisation_vlans(state)
        validate_normalisation_devices(state)
        errors = validate_detached_application_state(state)
        if errors:
            raise ValueError(errors[0])
        conflicts = find_rack_import_conflicts(state)
        if conflicts:
            raise ValueError(conflicts[0])
        changed = []
        for collection, identifier, record, existing in operations:
            if existing == record:
                continue
            table = COLLECTIONS[collection]
            if record is None:
                connection.execute("DELETE FROM " + table + " WHERE id=?", (identifier,))
            elif existing is None:
                ordinal = connection.execute(
                    "SELECT COALESCE(MAX(ordinal),-1)+1 FROM " + table
                ).fetchone()[0]
                connection.execute(
                    "INSERT INTO " + table + "(id,record_json,ordinal) VALUES(?,?,?)",
                    (identifier, json.dumps(record, ensure_ascii=False, allow_nan=False),
                     ordinal),
                )
            else:
                connection.execute(
                    "UPDATE " + table + " SET record_json=? WHERE id=?",
                    (json.dumps(record, ensure_ascii=False, allow_nan=False), identifier),
                )
            kind = "IPAM"
            action = "Created" if existing is None else "Deleted" if record is None else "Updated"
            changed.append({"action": action, "kind": kind,
                            "label": str((record or existing).get("name") or identifier)[:100],
                            "fields": []})
        if changed:
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": "Inventory saved", "changes": changed[:16],
                     "omitted": max(0, len(changed) - 16)}
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


def delete_subnet_with_dependencies(connection, account_id, subnet_id,
                                    expected_devices, expected_ips):
    """Published reviewed subnet deletion, including device detachment, in one save."""
    if not can_access(connection, account_id, "IPAM", edit=True):
        raise PermissionError("IPAM edit permission required")
    if (not isinstance(subnet_id, str) or not subnet_id or
            not isinstance(expected_devices, list) or
            not isinstance(expected_ips, list)):
        raise ValueError("Invalid subnet deletion request")
    connection.execute("BEGIN IMMEDIATE")
    try:
        state = reconstruct_inventory(connection)
        subnet = next((s for s in state["subnets"] if s["id"] == subnet_id), None)
        if subnet is None:
            raise ValueError("Subnet no longer exists.")
        if any(s.get("parentId") == subnet_id for s in state["subnets"]):
            raise ValueError("Dependencies changed; deletion cancelled. Review the subnet again.")
        cidr = subnet.get("cidr")
        devices = [d for d in state["devices"] if d.get("primaryIp") and
                   ip_belongs_to_subnet(d["primaryIp"], cidr)]
        ips = [ip for ip in state["ipAllocations"] if ip_belongs_to_subnet(ip, cidr)]
        owners = {d["primaryIp"]: d for d in devices}
        for ip in ips:
            a = state["ipAllocations"][ip]
            if ip not in owners or a.get("deviceId") != owners[ip]["id"] or a.get("reservedForDeviceId"):
                raise ValueError("Dependencies changed; deletion cancelled. Review the subnet again.")
        if any(d["primaryIp"] not in state["ipAllocations"] for d in devices):
            raise ValueError("Dependencies changed; deletion cancelled. Review the subnet again.")
        actual_devices = sorted((d["id"], d["primaryIp"]) for d in devices)
        if (actual_devices != sorted(
                (d.get("id"), d.get("ip")) for d in expected_devices
                if isinstance(d, dict)) or
                len(expected_devices) != len(actual_devices) or
                sorted(ips) != sorted(expected_ips)):
            raise ValueError("Subnet or dependent records changed after preview. Deletion cancelled; please review again.")

        network = not subnet.get("kind") or subnet.get("kind") == "network"
        domain = subnet.get("parentId") or "__unassigned__"
        linked = ([v for v in state["vlans"]
                   if _number(v.get("vlanId")) == _number(subnet.get("vlan")) and
                   (v.get("parentId") or "__unassigned__") == domain]
                  if network else [])
        if (len(linked) > 1 or
                (network and not linked and any(
                    _number(v.get("vlanId")) == _number(subnet.get("vlan")) and
                    not v.get("parentId") for v in state["vlans"])) or
                any(s["id"] != subnet_id and
                    (not s.get("kind") or s.get("kind") == "network") and
                    _number(s.get("vlan")) == _number(subnet.get("vlan")) and
                    (s.get("parentId") or "__unassigned__") == domain
                    for s in state["subnets"])):
            raise ValueError("VLAN ownership changed; deletion cancelled.")

        now = int(time.time())
        for device in devices:
            reservation = connection.execute(
                "SELECT account_id,expires_at FROM device_edit_reservations WHERE device_id=?",
                (device["id"],)
            ).fetchone()
            if reservation and reservation[1] > now and reservation[0] != account_id:
                raise ValueError("Device is being edited by another user")

        # Published confirmation retains the previous IP as device metadata,
        # and removes active allocation records with the deleted subnet.
        for device in devices:
            device["previousPrimaryIp"] = device["primaryIp"]
            device["primaryIp"] = ""
        for ip in ips:
            del state["ipAllocations"][ip]
        state["subnets"] = [s for s in state["subnets"] if s["id"] != subnet_id]
        if linked:
            state["vlans"] = [v for v in state["vlans"] if v["id"] != linked[0]["id"]]
        validate_normalisation_vlans(state)
        validate_normalisation_devices(state)
        errors = validate_detached_application_state(state)
        if errors:
            raise ValueError(errors[0])

        for device in devices:
            connection.execute(
                "UPDATE inventory_devices SET record_json=?,revision=revision+1 WHERE id=?",
                (json.dumps(device, ensure_ascii=False, allow_nan=False), device["id"])
            )
            connection.execute(
                "DELETE FROM device_edit_reservations WHERE device_id=? AND account_id=?",
                (device["id"], account_id)
            )
        for ip in ips:
            connection.execute("DELETE FROM inventory_ip_allocations WHERE ip=?", (ip,))
        connection.execute("DELETE FROM inventory_subnets WHERE id=?", (subnet_id,))
        if linked:
            connection.execute("DELETE FROM inventory_vlans WHERE id=?", (linked[0]["id"],))
        changes = [{"action": "Updated", "kind": "Device",
                    "label": str(d["name"])[:100],
                    "fields": ["previousPrimaryIp", "primaryIp"]} for d in devices]
        changes.extend({"action": "Deleted", "kind": "IPAM",
                        "label": ip, "fields": []} for ip in ips)
        changes.append({"action": "Deleted", "kind": "IPAM",
                        "label": str(subnet.get("name") or subnet_id)[:100],
                        "fields": []})
        if linked:
            changes.append({"action": "Deleted", "kind": "IPAM",
                            "label": str(linked[0].get("name") or linked[0]["id"])[:100],
                            "fields": []})
        event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                 "reason": "Inventory saved", "changes": changes[:60],
                 "omitted": max(0, len(changes) - 60)}
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
