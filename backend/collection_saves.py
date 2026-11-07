"""Transactional inventory collection changes for published IPAM and Racks workflows."""
import json
from .audit_events import attribute_event, safe_inventory_differences
import time
from datetime import datetime, timezone

from .application_integrity import validate_detached_application_state
from .inventory import COLLECTIONS, reconstruct_inventory
from .ipam_validation import ip_belongs_to_subnet
from .subnet_validation import validate_subnet_mutation
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
        if (collection == "rackAccessories" and record is None and existing and
                existing.get("type") == "shelf" and
                any(d.get("rackShelfAccessoryId") == record_id for d in state["devices"])):
            raise ValueError("This shelf has linked devices. Review their reassignment or retirement with Devices and Racks edit permissions.")
        if record is None:
            if existing is None:
                raise ValueError("Inventory record not found")
            state[collection] = [item for item in records if item["id"] != record_id]
        elif existing is None:
            records.append(record)
        else:
            state[collection] = [record if item["id"] == record_id else item
                                 for item in records]
        if collection == "subnets":
            validate_subnet_mutation(record, existing, state)
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
                                  "label": label, "fields": fields,
                                  **safe_inventory_differences(existing, record, collection)}],
                     "omitted": 0}
            connection.execute(
                "INSERT INTO inventory_change_history(record_json) VALUES(?)",
                (json.dumps(attribute_event(connection, account_id, event), ensure_ascii=False),),
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

        created_networks = [record for collection, _, record, existing in operations
                            if collection == "subnets" and record is not None and
                            record.get("kind", "network") == "network" and existing is None]
        if len(created_networks) > 50:
            raise ValueError("Create between 1 and 50 subnets per operation.")

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
            validate_subnet_mutation(record, original, state)

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
                            "fields": [],
                            **safe_inventory_differences(existing, record, collection)})
        if changed:
            reason = "Inventory saved"
            if created_networks:
                ordered = sorted(created_networks, key=lambda item: tuple(
                    int(part) for part in item["cidr"].split("/")[0].split(".")))
                parents = {item.get("parentId") for item in created_networks}
                parent = next((s for s in state["subnets"] if len(parents) == 1 and
                               s["id"] in parents), None)
                context = str(parent.get("name") or parent["cidr"])[:100] if parent else "No single Address Block"
                reason = (f"Created {len(created_networks)} subnet(s): "
                          f"{ordered[0]['cidr']} – {ordered[-1]['cidr']} · {context}")
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": reason, "changes": changed[:16],
                     "omitted": max(0, len(changed) - 16)}
            connection.execute(
                "INSERT INTO inventory_change_history(record_json) VALUES(?)",
                (json.dumps(attribute_event(connection, account_id, event), ensure_ascii=False),),
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
                  if network and subnet.get("vlan") not in (None, "") else [])
        if (len(linked) > 1 or
                (network and not linked and any(
                    _number(v.get("vlanId")) == _number(subnet.get("vlan")) and
                    not v.get("parentId") for v in state["vlans"])) or
                (subnet.get("vlan") not in (None, "") and any(s["id"] != subnet_id and
                    (not s.get("kind") or s.get("kind") == "network") and
                    _number(s.get("vlan")) == _number(subnet.get("vlan")) and
                    (s.get("parentId") or "__unassigned__") == domain
                    for s in state["subnets"]))):
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
            (json.dumps(attribute_event(connection, account_id, event), ensure_ascii=False),)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def remove_linked_rack_shelf(connection, account_id, shelf_id, expected_shelf, devices):
    """Apply every reviewed device choice and shelf removal together, or none.

    Reuse device revisions and the existing five-minute reservations. The shelf
    preview is compared with its saved record; no extra locking table is needed.
    """
    from .audit_events import safe_device_differences
    if (not isinstance(shelf_id, str) or not shelf_id or
            not isinstance(expected_shelf, dict) or expected_shelf.get("id") != shelf_id or
            not isinstance(devices, list)):
        raise ValueError("Invalid rack shelf removal request")
    connection.execute("BEGIN IMMEDIATE")
    try:
        if not all(can_access(connection, account_id, section, edit=True)
                   for section in ("Devices", "Racks")):
            raise PermissionError("Devices and Racks edit permissions are required to remove a linked shelf")
        state = reconstruct_inventory(connection)
        shelf = next((item for item in state["rackAccessories"] if item["id"] == shelf_id), None)
        if shelf is None or shelf.get("type") != "shelf" or shelf != expected_shelf:
            raise ValueError("The rack shelf changed after review. Refresh and review it again.")
        linked = {d["id"]: d for d in state["devices"] if d.get("rackShelfAccessoryId") == shelf_id}
        choices = {}
        for item in devices:
            if not isinstance(item, dict):
                raise ValueError("Choose an action for every shelf-mounted device")
            action = item.get("action")
            keys = ({"deviceId", "revision", "action", "rackId", "shelfId"}
                    if action == "reassign" else {"deviceId", "revision", "action"})
            identifier = item.get("deviceId")
            if (set(item) != keys or action not in ("retire", "reassign") or
                    not isinstance(identifier, str) or identifier in choices or
                    type(item.get("revision")) is not int or item["revision"] < 0):
                raise ValueError("Invalid shelf-mounted device choice")
            choices[identifier] = item
        if set(choices) != set(linked):
            raise ValueError("Shelf contents changed after review. Review every linked device again.")
        updates, changes = {}, []
        now = int(time.time())
        for identifier, previous in linked.items():
            item = choices[identifier]
            revision = connection.execute(
                "SELECT revision FROM inventory_devices WHERE id=?", (identifier,)
            ).fetchone()
            if revision is None or revision[0] != item["revision"]:
                raise ValueError("A shelf-mounted device changed after review. Refresh and review again.")
            reservation = connection.execute(
                "SELECT account_id,expires_at,base_revision FROM device_edit_reservations WHERE device_id=?",
                (identifier,),
            ).fetchone()
            if reservation:
                if reservation[0] != account_id and reservation[1] > now:
                    raise ValueError("A shelf-mounted device is being edited by another user")
                if reservation[0] == account_id and (reservation[1] <= now or reservation[2] != revision[0]):
                    raise ValueError("Device edit reservation expired or changed. Reopen the shelf review.")
            record = dict(previous)
            if item["action"] == "retire":
                record.update(status="Retired", rackId="", rackShelfAccessoryId="")
            else:
                if (not isinstance(item["rackId"], str) or not isinstance(item["shelfId"], str)
                        or not item["rackId"] or not item["shelfId"] or item["shelfId"] == shelf_id):
                    raise ValueError("Choose another existing rack shelf for reassignment")
                record.update(rackId=item["rackId"], rackShelfAccessoryId=item["shelfId"])
            # Shelf placement is always derived, including when retiring a linked device.
            record.update(face=None, rackUStart=None, rackUEnd=None, rackUHeight=None)
            updates[identifier] = record
            fields = [key for key in dict.fromkeys((*previous, *record))
                      if previous.get(key) != record.get(key)]
            changes.append({"action": "Updated", "kind": "Device", "label": str(record["name"])[:100],
                            "fields": fields, **safe_device_differences(previous, record)})
        state["devices"] = [updates.get(d["id"], d) for d in state["devices"]]
        state["rackAccessories"] = [a for a in state["rackAccessories"] if a["id"] != shelf_id]
        validate_normalisation_devices(state)
        errors = validate_detached_application_state(state)
        conflicts = find_rack_import_conflicts(state)
        if errors or conflicts:
            raise ValueError((errors or conflicts)[0])
        for identifier, record in updates.items():
            connection.execute(
                "UPDATE inventory_devices SET record_json=?,revision=revision+1 WHERE id=?",
                (json.dumps(record, ensure_ascii=False, allow_nan=False), identifier),
            )
            connection.execute("DELETE FROM device_edit_reservations WHERE device_id=? AND account_id=?",
                               (identifier, account_id))
        connection.execute("DELETE FROM inventory_rack_accessories WHERE id=?", (shelf_id,))
        rack = next((r for r in state["racks"] if r["id"] == shelf.get("rackId")), {})
        former_location = f"{rack.get('name') or shelf.get('rackId')} · Shelf U{shelf.get('startU')} ({str(shelf.get('face')).title()})"
        changes.append({"action": "Deleted", "kind": "Rack", "label": former_location[:100],
                        "fields": ["rackShelfAccessoryId", "rackId", "startU", "face"],
                        **safe_inventory_differences(shelf, {}, "rackAccessories")})
        # Keep every affected device in the existing bounded history representation.
        for start in range(0, len(changes), 60):
            event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                     "reason": "Inventory saved", "changes": changes[start:start + 60], "omitted": 0}
            connection.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                               (json.dumps(attribute_event(connection, account_id, event), ensure_ascii=False),))
        connection.commit()
        return len(updates)
    except BaseException:
        connection.rollback()
        raise
