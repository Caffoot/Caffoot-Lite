"""Receive equipment and change readiness using the existing permanent stock journal."""
from datetime import date, datetime, timezone
import hashlib
import json
import math
import re
import uuid

from backend.audit_events import record_actor_event
from backend.equipment_suppliers import read_receipt_suppliers, selectable_supplier, write_receipt_supplier
from backend.permissions import can_access
from backend.sessions import session_account

MAX_QUANTITY = 9007199254740991
EQUIPMENT_TYPES = ("Desktop", "Laptop", "Server - Physical", "Monitor",
                   "Keyboard", "Mouse", "Docking Station", "Other")
COMPUTER_TYPES = ("Desktop", "Laptop", "Server - Physical")


def stock_json(value):
    """Keep saved specifications and request comparisons in a consistent form."""
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def stock_access(connection, account_id, *, edit=False):
    """Require the independent feature and existing section/MFA permissions."""
    if not can_access(connection, account_id, "IT Assets", edit=edit):
        raise PermissionError("IT Assets access required")


def stock_text(value, label, maximum=200, *, required=False):
    if not isinstance(value, str) or len(value) > maximum or "\x00" in value:
        raise ValueError("Invalid " + label)
    value = value.strip()
    try:
        value.encode('utf-8')
    except UnicodeEncodeError as exc:
        raise ValueError('Invalid ' + label) from exc
    if required and not value:
        raise ValueError(label + " is required")
    return value


def stock_quantity(value, label, minimum=0):
    if type(value) is not int or not minimum <= value <= MAX_QUANTITY:
        raise ValueError(label + " must be a whole number within the allowed range")
    return value


def stock_checks(value):
    if (not isinstance(value, dict) or set(value) != {"itemsChecked", "conditionChecked"}
            or any(type(flag) is not bool for flag in value.values())):
        raise ValueError("Confirm the receipt and condition checks explicitly")
    return value


def stock_specifications(value, equipment_type):
    """Keep computer fields separate from individual identities and other equipment."""
    if not isinstance(value, dict) or set(value) - {
            "processor", "memory", "memoryUnit", "storage", "storageUnit", "storageMedium"}:
        raise ValueError("Invalid shared specifications")
    value = dict(value)
    if value and equipment_type not in COMPUTER_TYPES:
        raise ValueError("Computer specifications do not apply to this equipment")
    for key, maximum in (("processor", 200), ("storageMedium", 100)):
        if key in value:
            value[key] = stock_text(value[key], key, maximum, required=True)
    for key, units in (("memory", ("MB", "GB", "TB")), ("storage", ("GB", "TB", "PB"))):
        unit_key = key + "Unit"
        if (key in value) != (unit_key in value):
            raise ValueError("Capacity and unit must be supplied together")
        if key in value:
            number = value[key]
            if (type(number) not in (int, float) or number <= 0
                    or number > 1.7976931348623157e308 or not math.isfinite(number)
                    or value[unit_key] not in units):
                raise ValueError("Enter a positive capacity and recognised unit")
    return value


def stock_configuration(item):
    return {key: item[key] for key in
            ("category", "trackingMode", "manufacturer", "model", "sharedSpecifications")}


def stock_digest(value):
    return hashlib.sha256(stock_json(value).encode()).hexdigest()


def stock_item(connection, item_id):
    """Read genuine balances and identities from closed journal entries."""
    if not isinstance(item_id, str) or not re.fullmatch(r'[0-9a-f]{32}', item_id):
        raise ValueError('Invalid stock item identity')
    row = connection.execute(
        "SELECT id,name,category,tracking_mode,manufacturer,model,shared_spec_json,"
        "minimum_stock_level FROM it_asset_stock_items WHERE id=?", (item_id,)).fetchone()
    if row is None:
        raise LookupError("Stock item not found")
    result = dict(zip(("id", "name", "category", "trackingMode", "manufacturer", "model",
                       "sharedSpecifications", "minimumStockLevel"), row))
    result["sharedSpecifications"] = json.loads(result["sharedSpecifications"])
    units = {identity: dict(id=identity, serialNumber=serial, assetTag=tag,
                            deviceLinked=device_id is not None, balances={})
             for identity, serial, tag, device_id in connection.execute(
                 "SELECT id,serial_number,asset_tag,device_id FROM it_asset_stock_units "
                 "WHERE stock_item_id=? ORDER BY id", (item_id,))}
    balances = {}
    quantity_balances = {}
    latest = 0
    for _, unit_id, quantity, old, new, movement in connection.execute(
            "SELECT e.stock_item_id,e.stock_unit_id,e.quantity,e.from_state,e.to_state,e.movement_id "
            "FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id "
            "LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id "
            "WHERE e.stock_item_id=? OR u.stock_item_id=? ORDER BY e.id", (item_id, item_id)):
        latest = max(latest, movement)
        for state, delta in ((old, -quantity), (new, quantity)):
            if state is not None:
                balances[state] = balances.get(state, 0) + delta
                if unit_id is None:
                    quantity_balances[state]=quantity_balances.get(state,0)+delta
                if unit_id in units:
                    target = units[unit_id]["balances"]
                    target[state] = target.get(state, 0) + delta
    result["balances"] = dict(
        physicallyHeld=sum(balances.get(key, 0) for key in
                           ("awaiting_checks", "awaiting_preparation", "ready")),
        readyToIssue=balances.get("ready", 0),
        awaitingChecks=balances.get("awaiting_checks", 0) + balances.get("awaiting_preparation", 0))
    result['stateBalances'] = {key: balances.get(state,0) for key,state in (
        ('awaitingChecks','awaiting_checks'),('awaitingPreparation','awaiting_preparation'),
        ('currentlyIssued','issued'),('writtenOff','written_off'))}
    result['quantityStateBalances'] = quantity_balances
    for unit in units.values():
        unit["ready"] = unit["balances"].get("ready", 0) == 1
        unit["held"] = sum(unit["balances"].get(key, 0) for key in
                           ("awaiting_checks", "awaiting_preparation", "ready")) == 1
    result["units"] = list(units.values())
    latest = max(latest, connection.execute(
        "SELECT coalesce(max(id),0) FROM it_asset_stock_movements "
        "WHERE specification_item_id=?", (item_id,)).fetchone()[0])
    audit = connection.execute(
        "SELECT coalesce(max(id),0) FROM inventory_change_history "
        "WHERE json_extract(record_json,'$.changes[0].kind')='IT Assets' "
        "AND json_extract(record_json,'$.changes[0].after.stockItemId')=?", (item_id,)).fetchone()[0]
    result["configurationKey"] = stock_digest(stock_configuration(result))
    result["version"] = stock_digest([latest, audit, result["configurationKey"], row[-1]])
    return result


def stock_history(connection, item_id=None):
    """Return original receipt facts and subsequent readiness facts separately."""
    receipts, readiness = [], []
    for identity, kind, event_date, recorded, actor, reason, supplier, checks, snapshot, quantity, subject in connection.execute(
            "SELECT m.id,m.kind,m.event_date,m.recorded_at,m.actor_label,m.reason,m.supplier_name,"
            "m.checks_json,json_group_array(e.snapshot_json),sum(e.quantity),coalesce(e.stock_item_id,u.stock_item_id) "
            "FROM it_asset_stock_movements m JOIN it_asset_stock_entries e ON e.movement_id=m.id "
            "LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id "
            "WHERE m.kind IN ('received','readiness_changed') "
            "GROUP BY m.id,coalesce(e.stock_item_id,u.stock_item_id) ORDER BY m.id DESC"):
        if item_id is not None and subject != item_id:
            continue
        details = json.loads(checks)
        snapshots = [json.loads(value) for value in json.loads(snapshot)]
        original = snapshots[0]
        event = dict(id=identity, stockItemId=subject, name=original.get("name", "Stock Item"),
                     date=event_date, recordedAt=recorded, actor=actor, reason=reason,
                     quantity=quantity, checks=details.get("checks"),
                     notes=details.get("notes", ""))
        event['specification'] = {key: original.get(key) for key in
                                 ('category', 'manufacturer', 'model', 'sharedSpecifications')}
        event['units'] = [dict(id=value['stockUnitId'], serialNumber=value.get('serialNumber'),
                               assetTag=value.get('assetTag'))
                          for value in snapshots if value.get('stockUnitId')]
        if kind == "received":
            event.update(supplier=supplier, ready=details.get("readyQuantity"),
                         awaiting=quantity-details["readyQuantity"] if "readyQuantity" in details else None)
            receipts.append(event)
        else:
            event.update(readyBefore=details.get("readyBefore"), readyAfter=details.get("readyAfter"))
            event['preparation'] = isinstance(details.get('checks'),dict) and 'cleanedWorking' in details['checks']
            readiness.append(event)
    return dict(receipts=receipts, readinessChanges=readiness)


def read_stock(connection, account_id, item_id=None):
    stock_access(connection, account_id)
    if item_id is not None:
        return project_stock_details(connection, account_id,
            dict(item=stock_item(connection, item_id), **stock_history(connection, item_id)))
    result = dict(items=[stock_item(connection, identity) for identity, in connection.execute(
        "SELECT id FROM it_asset_stock_items ORDER BY name COLLATE NOCASE,id")],
        **stock_history(connection))
    from backend.stock_circulation import read_stock_issues,stock_movement_history
    result.update(read_stock_issues(connection,account_id))
    result['movements']=stock_movement_history(connection,account_id)
    return project_stock_details(connection, account_id, result)


def project_stock_details(connection, actor, result):
    """Keep authorised stock totals but omit individual hidden Device units."""
    read_receipt_suppliers(connection, actor, result.get("receipts", []))
    if can_access(connection, actor, "Devices"):
        return result
    hidden = {row[0] for row in connection.execute(
        "SELECT id FROM it_asset_stock_units WHERE device_id IS NOT NULL")}
    for item in result.get("items", [result["item"]] if "item" in result else []):
        item["units"] = [unit for unit in item["units"] if unit["id"] not in hidden]
    for key in ("receipts", "readinessChanges"):
        result[key] = [event for event in result.get(key, [])
                       if not any(unit["id"] in hidden for unit in event.get("units", []))]
    return result


def stock_operation(payload, allowed, required):
    if not isinstance(payload, dict) or set(payload) - allowed or required - set(payload):
        raise ValueError("Invalid stock request")
    operation = payload.get("operationId")
    if not isinstance(operation, str) or not re.fullmatch(r"[A-Za-z0-9-]{16,80}", operation):
        raise ValueError("A valid operation reference is required")
    return operation, stock_digest(payload)


def stock_replay(connection, key, digest):
    """Retry a completed request without recording the same delivery twice."""
    row = connection.execute(
        "SELECT checks_json FROM it_asset_stock_movements WHERE operation_key=?", (key,)).fetchone()
    if row:
        stored = json.loads(row[0])
    else:
        row = connection.execute(
            "SELECT record_json FROM inventory_change_history "
            "WHERE json_extract(record_json,'$.confirmationId')=?", (key,)).fetchone()
        if not row:
            return None
        stored = json.loads(row[0])["changes"][0]["after"]
    if stored.get("operationHash") != digest:
        raise FileExistsError("This operation reference was already used for different values")
    return stored["result"]


def append_stock_fact(connection, actor, key, kind, item, entries, details,
                      *, event_date=None, reason="", supplier=None):
    """Insert entries first; their permanent header closes the complete record."""
    movement = connection.execute(
        "SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements").fetchone()[0]
    snapshot = stock_json({**stock_configuration(item), "name": item["name"]})
    for subject, quantity, old, new in entries:
        column = "stock_unit_id" if subject != item["id"] else "stock_item_id"
        entry_snapshot = json.loads(snapshot)
        if column == 'stock_unit_id':
            serial, tag = connection.execute(
                'SELECT serial_number,asset_tag FROM it_asset_stock_units WHERE id=?', (subject,)).fetchone()
            entry_snapshot.update(stockUnitId=subject, serialNumber=serial, assetTag=tag)
        connection.execute(
            "INSERT INTO it_asset_stock_entries(movement_id," + column +
            ",quantity,from_state,to_state,snapshot_json) VALUES(?,?,?,?,?,?)",
            (movement, subject, quantity, old, new, stock_json(entry_snapshot)))
    name = connection.execute("SELECT username FROM accounts WHERE id=?", (actor,)).fetchone()[0]
    connection.execute(
        "INSERT INTO it_asset_stock_movements(id,operation_key,kind,event_date,actor_id,"
        "actor_label,reason,supplier_name,checks_json) VALUES(?,?,?,?,?,?,?,?,?)",
        (movement, key, kind, event_date or datetime.now(timezone.utc).date().isoformat(),
         actor, name, reason, supplier, stock_json(details)))
    return movement


def stock_write_access(connection, actor, token):
    if session_account(connection, token) != actor:
        raise PermissionError("Verified session required")
    stock_access(connection, actor, edit=True)


def receive_stock(connection, actor, token, payload):
    """Save a delivery, its optional checked readiness and provenance atomically."""
    allowed = {"operationId", "item", "stockItemId", "configurationKey", "quantity",
               "receivedOn", "supplier", "supplierId", "notes", "checks", "readyQuantity", "serialNumber", "assetTag"}
    operation, digest = stock_operation(payload, allowed,
        {"operationId", "quantity", "receivedOn", "checks", "readyQuantity"})
    key = "stock:receive:" + str(actor) + ":" + operation
    connection.execute("BEGIN IMMEDIATE")
    try:
        stock_write_access(connection, actor, token)
        repeated = stock_replay(connection, key, digest)
        if repeated is not None:
            connection.commit()
            return repeated
        quantity = stock_quantity(payload["quantity"], "Quantity Received", 1)
        ready = stock_quantity(payload["readyQuantity"], "Checked & Ready To Issue")
        checks = stock_checks(payload["checks"])
        received = payload["receivedOn"]
        if not isinstance(received, str) or date.fromisoformat(received).isoformat() != received:
            raise ValueError("Enter a valid Date Received")
        if ready > quantity or (ready and not all(checks.values())):
            raise ValueError("Ready quantity requires both checks and cannot exceed the received quantity")
        supplier = stock_text(payload.get("supplier", ""), "Supplier", 200) or None
        supplier_id = payload.get("supplierId")
        if "supplierId" in payload:
            supplier = selectable_supplier(connection, supplier_id)
        notes = stock_text(payload.get("notes", ""), "Receipt Notes", 2000)
        if "item" in payload:
            if "stockItemId" in payload or "configurationKey" in payload:
                raise ValueError("Choose a new item or an existing item")
            values = payload["item"]
            if not isinstance(values, dict) or set(values) != {
                    "category", "trackingMode", "manufacturer", "model", "sharedSpecifications"}:
                raise ValueError("Invalid stock item")
            category = values["category"]
            if category not in EQUIPMENT_TYPES or values["trackingMode"] not in ("individual", "quantity"):
                raise ValueError("Choose a recognised Equipment Type and Tracking Method")
            manufacturer = stock_text(values["manufacturer"], "Manufacturer", 120)
            model = stock_text(values["model"], "Model / Description", 120, required=True)
            specs = stock_specifications(values["sharedSpecifications"], category)
            existing = connection.execute(
                "SELECT shared_spec_json FROM it_asset_stock_items WHERE category=? AND tracking_mode=? "
                "AND lower(manufacturer)=lower(?) AND lower(model)=lower(?)",
                (category, values["trackingMode"], manufacturer, model))
            if any(json.loads(raw) == specs for raw, in existing):
                raise FileExistsError("An identical stock item exists. Choose Receive More Of An Existing Item.")
            item_id = uuid.uuid4().hex
            connection.execute(
                "INSERT INTO it_asset_stock_items(id,name,category,tracking_mode,device_type,"
                "manufacturer,model,shared_spec_json) VALUES(?,?,?,?,?,?,?,?)",
                (item_id, model, category, values["trackingMode"],
                 category if category in COMPUTER_TYPES else None, manufacturer, model, stock_json(specs)))
            item = stock_item(connection, item_id)
        else:
            if set(payload) & {"stockItemId", "configurationKey"} != {"stockItemId", "configurationKey"}:
                raise ValueError("Choose an existing stock item")
            item = stock_item(connection, payload["stockItemId"])
            if payload["configurationKey"] != item["configurationKey"]:
                raise FileExistsError("Stock specifications changed. Reload the item before receiving more.")
        if item['balances']['physicallyHeld'] + quantity > MAX_QUANTITY:
            raise ValueError('Physically Held exceeds the supported whole-number range')
        serial = stock_text(payload.get("serialNumber", ""), "Serial Number", 200) or None
        tag = stock_text(payload.get("assetTag", ""), "Asset Tag", 200) or None
        subject = item["id"]
        if item["trackingMode"] == "individual":
            if quantity != 1:
                raise ValueError("Receive each individually tracked unit separately")
            subject = uuid.uuid4().hex
            connection.execute(
                "INSERT INTO it_asset_stock_units(id,stock_item_id,serial_number,asset_tag) VALUES(?,?,?,?)",
                (subject, item["id"], serial, tag))
        elif serial or tag:
            raise ValueError("Serial numbers and asset tags belong to individually tracked equipment")
        next_id = connection.execute(
            "SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements").fetchone()[0]
        result = dict(stockItemId=item["id"], receiptId=next_id,
                      readinessId=next_id+1 if ready else None)
        details = dict(operationHash=digest, result=result, checks=checks, notes=notes,
                       readyQuantity=ready)
        append_stock_fact(connection, actor, key, "received", item,
                          [(subject, quantity, None, "awaiting_checks")], details,
                          event_date=received, supplier=supplier)
        if supplier_id is not None:
            write_receipt_supplier(connection, actor, next_id, supplier_id)
        if ready:
            append_stock_fact(connection, actor, key+":ready", "readiness_changed", item,
                [(subject, ready, "awaiting_checks", "ready")],
                dict(checks=checks, receiptId=next_id, readyBefore=item["balances"]["readyToIssue"],
                     readyAfter=item["balances"]["readyToIssue"]+ready),
                event_date=received, reason="Checked during receipt")
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def update_stock_readiness(connection, actor, token, payload):
    """Change checked readiness while retaining physical quantities and receipts."""
    allowed = {"operationId", "stockItemId", "version", "readyQuantity", "readyUnitIds",
               "minimumStockLevel", "checks", "reason"}
    operation, digest = stock_operation(payload, allowed,
        {"operationId", "stockItemId", "version", "readyQuantity", "minimumStockLevel", "checks", "reason"})
    key = "stock:readiness:" + str(actor) + ":" + operation
    connection.execute("BEGIN IMMEDIATE")
    try:
        stock_write_access(connection, actor, token)
        repeated = stock_replay(connection, key, digest)
        if repeated is not None:
            connection.commit()
            return repeated
        item = stock_item(connection, payload["stockItemId"])
        if payload["version"] != item["version"]:
            raise FileExistsError("Stock changed. Reload the item before saving readiness.")
        ready = stock_quantity(payload["readyQuantity"], "New Ready To Issue Total")
        if ready > item["balances"]["physicallyHeld"]:
            raise ValueError("Ready quantity cannot exceed Physically Held")
        checks = stock_checks(payload["checks"])
        reason = stock_text(payload["reason"], "Reason / Note", 2000)
        minimum = payload["minimumStockLevel"]
        if minimum is not None:
            stock_quantity(minimum, "Minimum Stock Level")
            if item["trackingMode"] != "quantity":
                raise ValueError("Minimum Stock Level applies only to quantity-based stock")
        entries = []
        old_ready = item["balances"]["readyToIssue"]
        increasing = decreasing = False
        if item["trackingMode"] == "quantity":
            if "readyUnitIds" in payload:
                raise ValueError("Quantity stock does not accept individual unit selections")
            registered_ready = old_ready - item['quantityStateBalances'].get('ready', 0)
            if ready < registered_ready:
                raise ValueError('Registered Ready Devices cannot be changed through quantity readiness')
            delta = ready-old_ready
            if delta>item['quantityStateBalances'].get('awaiting_checks', 0):
                raise ValueError('Complete the returned-equipment preparation checks before marking this quantity ready')
            if delta:
                returned=connection.execute('''SELECT 1 FROM it_asset_stock_entries e
                    JOIN it_asset_stock_movements m ON m.id=e.movement_id
                    WHERE e.stock_item_id=? AND m.kind='returned' LIMIT 1''',(item['id'],)).fetchone()
                entries.append((item["id"], abs(delta),
                                "awaiting_checks" if delta > 0 else "ready",
                                "ready" if delta > 0 else "awaiting_preparation" if returned else "awaiting_checks"))
            increasing, decreasing = delta > 0, delta < 0
        else:
            selected = payload.get("readyUnitIds")
            if (not isinstance(selected, list) or any(not isinstance(identity, str) for identity in selected)
                    or len(selected) != len(set(selected)) or len(selected) != ready):
                raise ValueError("Select the individually tracked units confirmed ready")
            valid = {unit["id"] for unit in item["units"] if unit["held"]}
            if set(selected) - valid:
                raise ValueError("Selected unit is not physically held")
            for unit in item["units"]:
                if not unit["held"] or unit["ready"] == (unit["id"] in selected):
                    continue
                if unit["deviceLinked"]:
                    raise ValueError("Managed Device stock actions are not available in this workflow")
                if not unit['ready'] and unit['balances'].get('awaiting_preparation',0):
                    raise ValueError('Complete the returned-equipment preparation checks for this unit')
                returned=connection.execute('''SELECT 1 FROM it_asset_stock_entries e
                    JOIN it_asset_stock_movements m ON m.id=e.movement_id
                    WHERE e.stock_unit_id=? AND m.kind='returned' LIMIT 1''',(unit['id'],)).fetchone()
                increasing |= unit["id"] in selected
                decreasing |= unit["ready"]
                entries.append((unit["id"], 1, "ready" if unit["ready"] else "awaiting_checks",
                                "ready" if unit["id"] in selected else "awaiting_preparation" if returned else "awaiting_checks"))
        if increasing and not all(checks.values()):
            raise ValueError("Confirm quantity/items and condition checks before increasing readiness")
        if decreasing and not reason:
            raise ValueError("A reason is required to move Ready stock back to Awaiting Checks")
        next_id = connection.execute(
            "SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements").fetchone()[0]
        result = dict(stockItemId=item["id"], readinessId=next_id if entries else None)
        if entries:
            append_stock_fact(connection, actor, key, "readiness_changed", item, entries,
                dict(operationHash=digest, result=result, checks=checks,
                     readyBefore=old_ready, readyAfter=ready), reason=reason)
        if minimum != item["minimumStockLevel"]:
            connection.execute(
                "UPDATE it_asset_stock_items SET minimum_stock_level=? WHERE id=?", (minimum, item["id"]))
            record_actor_event(connection, actor, kind="IT Assets", action="Updated", label=item["name"],
                reason="Minimum Stock Level changed", fields=["Minimum Stock Level"],
                subject=("Stock Item", item["id"], item["name"]),
                before={"minimumStockLevel": item["minimumStockLevel"]},
                after=dict(stockItemId=item["id"], minimumStockLevel=minimum,
                           operationHash=digest, result=result), confirmation_id=key)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
