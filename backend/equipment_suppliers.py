"""Supplier selection and equipment attribution within existing save transactions."""
import json
import time

from .audit_events import record_actor_event
from .permissions import _admin, can_access, feature_enabled
from .sessions import session_account

EQUIPMENT_SECTIONS = ("Devices", "IT Assets")
SUPPLIER_AUDIT_REASON = "Equipment Supplier association"


def read_supplier_choices(connection, actor, section):
    """An equipment editor can choose a company without browsing its directory."""
    if (section not in EQUIPMENT_SECTIONS
            or not can_access(connection, actor, section, edit=True)
            or not feature_enabled(connection, "Suppliers")):
        raise PermissionError("Equipment editing and the Suppliers feature are required")
    return {"suppliers": [{"id": identity, "name": name} for identity, name in connection.execute(
        "SELECT id,name FROM suppliers WHERE status='active' ORDER BY name_key,id"
    )]}


def selectable_supplier(connection, identity):
    if not feature_enabled(connection, "Suppliers"):
        raise PermissionError("Suppliers feature is disabled")
    if type(identity) is not int or not 0 < identity < 2**63:
        raise ValueError("Choose an available Supplier")
    row = connection.execute(
        "SELECT name FROM suppliers WHERE id=? AND status='active'", (identity,)
    ).fetchone()
    if row is None:
        raise ValueError("Choose an available Supplier")
    return row[0]


def device_supplier_values(connection, selection):
    if not feature_enabled(connection, "Suppliers"):
        raise PermissionError("Suppliers feature is disabled")
    if not isinstance(selection, dict) or set(selection) not in ({"id"}, {"text"}):
        raise ValueError("Invalid Device Supplier selection")
    if "id" in selection:
        identity = selection["id"]
        selectable_supplier(connection, identity)
        return identity, ""
    text = selection["text"]
    if (not isinstance(text, str) or len(text) > 200
            or any(ord(char) < 32 or ord(char) == 127 for char in text)):
        raise ValueError("Invalid Supplier name")
    text.encode("utf-8")
    return None, text.strip()


def write_device_supplier(connection, actor, device_id, label, supplier_id, supplier_text):
    previous = connection.execute(
        "SELECT supplier_id,supplier_text FROM device_suppliers WHERE device_id=?", (device_id,)
    ).fetchone() or (None, "")
    if previous == (supplier_id, supplier_text):
        return
    if supplier_id is None and not supplier_text:
        connection.execute("DELETE FROM device_suppliers WHERE device_id=?", (device_id,))
    else:
        connection.execute(
            "INSERT INTO device_suppliers(device_id,supplier_id,supplier_text) VALUES(?,?,?) "
            "ON CONFLICT(device_id) DO UPDATE SET supplier_id=excluded.supplier_id,supplier_text=excluded.supplier_text",
            (device_id, supplier_id, supplier_text),
        )
    record_actor_event(connection, actor, kind="Device", action="Updated", label=label[:100],
                       reason=SUPPLIER_AUDIT_REASON, fields=["Supplier"],
                       before={"deviceId": device_id, "supplierId": previous[0], "supplierText": previous[1]},
                       after={"deviceId": device_id, "supplierId": supplier_id, "supplierText": supplier_text})


def read_device_suppliers(connection, actor):
    disclose_identity = can_access(connection, actor, "Suppliers") or can_access(
        connection, actor, "Devices", edit=True)
    return {
        device: {"name": name, **({"id": identity} if disclose_identity else {})}
        for device, name, identity in connection.execute(
            "SELECT d.device_id,coalesce(s.name,d.supplier_text),d.supplier_id "
            "FROM device_suppliers d LEFT JOIN suppliers s ON d.supplier_id=s.id"
        )
    }


def read_receipt_suppliers(connection, actor, receipts):
    if not feature_enabled(connection, "Suppliers"):
        return
    can_edit = can_access(connection, actor, "IT Assets", edit=True)
    disclose_identity = can_edit or can_access(connection, actor, "Suppliers")
    matches = {identity: (supplier, name, revision) for identity, supplier, name, revision in connection.execute(
        "SELECT r.receipt_id,r.supplier_id,s.name,r.revision "
        "FROM receipt_suppliers r LEFT JOIN suppliers s ON s.id=r.supplier_id"
    )}
    for receipt in receipts:
        supplier, name, revision = matches.get(receipt["id"], (None, None, 0))
        receipt["supplierAssociation"] = (
            {"name": name, **({"id": supplier} if disclose_identity else {})} if supplier else None)
        if can_edit:
            receipt["supplierRevision"] = revision


def write_receipt_supplier(connection, actor, receipt_id, supplier_id, previous=None, *, revision=0):
    connection.execute(
        "INSERT INTO receipt_suppliers(receipt_id,supplier_id,revision) VALUES(?,?,?) "
        "ON CONFLICT(receipt_id) DO UPDATE SET supplier_id=excluded.supplier_id,revision=excluded.revision",
        (receipt_id, supplier_id, revision + 1),
    )
    record_actor_event(connection, actor, kind="IT Assets", action="Updated", label=f"Receipt #{receipt_id}",
                       reason=SUPPLIER_AUDIT_REASON, fields=["Supplier"],
                       before={"movementId": receipt_id, "supplierId": previous},
                       after={"movementId": receipt_id, "supplierId": supplier_id})

def assign_equipment_supplier(connection, actor, token, section, payload):
    """Revalidate confirmed selections under the same lock as every association and audit."""
    from .stock_intake import stock_operation, stock_replay

    fields = {"operationId", "confirmed", "supplierId", "records"}
    operation, digest = stock_operation(payload, fields, fields)
    devices = section == "Devices"
    key = f"supplier:assign:{section}:{actor}:{operation}"
    connection.execute("BEGIN IMMEDIATE")
    try:
        if (section not in EQUIPMENT_SECTIONS or session_account(connection, token) != actor
                or not can_access(connection, actor, section, edit=True)
                or not feature_enabled(connection, "Suppliers")):
            raise PermissionError("Equipment editing and the Suppliers feature are required")
        if devices:
            _admin(connection, actor)
        replay = stock_replay(connection, key, digest)
        if replay is not None:
            connection.commit()
            return replay
        records, supplier_id = payload["records"], payload["supplierId"]
        if (payload["confirmed"] is not True or not isinstance(records, list) or not records
                or supplier_id is None and (devices or len(records) != 1)):
            raise ValueError("Confirm the Supplier change for the selected records")
        if supplier_id is not None:
            selectable_supplier(connection, supplier_id)

        if devices:
            result = assign_device_suppliers(connection, actor, records, supplier_id)
        else:
            result = assign_receipt_suppliers(connection, actor, records, supplier_id)
        record_actor_event(connection, actor, kind="Device" if devices else "IT Assets",
                           action="Updated", label="Supplier assignments", reason=SUPPLIER_AUDIT_REASON,
                           fields=["Supplier"], confirmation_id=key,
                           after={"operationHash": digest, "result": result})
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def equipment_revisions(records, *, devices):
    seen = set()
    for record in records:
        if not isinstance(record, dict) or set(record) != {"id", "revision"}:
            raise ValueError("Invalid equipment selection")
        identity, revision = record["id"], record["revision"]
        valid_id = (isinstance(identity, str) and bool(identity) if devices
                    else type(identity) is int and 0 < identity < 2**63)
        if not valid_id or type(revision) is not int or revision < 0 or identity in seen:
            raise ValueError("Invalid or repeated equipment selection")
        seen.add(identity)
        yield identity, revision


def assign_device_suppliers(connection, actor, records, supplier_id):
    targets = []
    now = int(time.time())
    for identity, revision in equipment_revisions(records, devices=True):
        row = connection.execute(
            "SELECT d.name,d.revision,s.supplier_id,r.expires_at FROM inventory_devices d "
            "LEFT JOIN device_suppliers s ON s.device_id=d.id "
            "LEFT JOIN device_edit_reservations r ON r.device_id=d.id WHERE d.id=?", (identity,),
        ).fetchone()
        if row is None or row[1] != revision or (row[3] is not None and row[3] > now):
            raise FileExistsError("A selected Device is missing, changed or reserved for editing. Refresh the inventory.")
        if row[2] != supplier_id:
            targets.append((identity, row[0]))

    for identity, label in targets:
        write_device_supplier(connection, actor, identity, label, supplier_id, "")
        connection.execute("UPDATE inventory_devices SET revision=revision+1 WHERE id=?", (identity,))
    return {"updated": len(targets)}


def receipt_visible_to_equipment_reader(connection, receipt_id, can_read_devices):
    return connection.execute(
        "SELECT 1 FROM it_asset_stock_movements m WHERE m.id=? AND m.kind='received' AND "
        "(? OR NOT EXISTS (SELECT 1 FROM it_asset_stock_entries e "
        "JOIN it_asset_stock_units u ON u.id=e.stock_unit_id "
        "WHERE e.movement_id=m.id AND u.device_id IS NOT NULL))",
        (receipt_id, can_read_devices),
    ).fetchone() is not None


def assign_receipt_suppliers(connection, actor, records, supplier_id):
    targets = []
    can_read_devices = can_access(connection, actor, "Devices")
    for identity, revision in equipment_revisions(records, devices=False):
        if not receipt_visible_to_equipment_reader(connection, identity, can_read_devices):
            raise FileExistsError("A selected receipt is no longer available. Refresh Receipt History.")
        previous, current_revision = connection.execute(
            "SELECT supplier_id,revision FROM receipt_suppliers WHERE receipt_id=?", (identity,),
        ).fetchone() or (None, 0)
        if current_revision != revision:
            raise FileExistsError("A selected receipt association changed. Refresh Receipt History.")
        if previous != supplier_id:
            targets.append((identity, previous, revision))
    for identity, previous, revision in targets:
        write_receipt_supplier(connection, actor, identity, supplier_id, previous, revision=revision)
    return {"updated": len(targets)}


def read_supplied_equipment(connection, actor, supplier_id):
    """Return only readable source records, with original physical supply counted once."""
    devices = can_access(connection, actor, "Devices")
    assets = can_access(connection, actor, "IT Assets")
    if not (can_access(connection, actor, "Suppliers") and (devices or assets)):
        return None
    records = []
    supplied_quantity = 0
    if devices:
        for identity, name, raw, from_stock in connection.execute(
                "SELECT d.id,d.name,d.record_json,EXISTS ("
                "SELECT 1 FROM it_asset_stock_units u WHERE u.device_id=d.id AND u.stock_item_id IS NOT NULL) "
                "FROM device_suppliers s JOIN inventory_devices d ON d.id=s.device_id "
                "WHERE s.supplier_id=? ORDER BY d.name COLLATE NOCASE,d.id", (supplier_id,)):
            device = json.loads(raw)
            # Direct Devices can later enter circulation with a unit of their own.
            # Only a unit attached to pooled stock originated through registration.
            quantity = None if from_stock else 1
            records.append({
                "id": identity, "source": "device",
                "sourceLabel": ("Stock-derived Device" if assets else "Device") if from_stock else "Independent Device",
                "name": name, "type": device.get("type") or "Unknown",
                "identifier": device.get("assetTag") or device.get("serialNumber") or identity,
                "date": None, "quantity": quantity, "status": device.get("status") or "Active",
            })
            supplied_quantity += quantity or 0
    if assets:
        for identity, date, quantity, raw in connection.execute(
                "SELECT m.id,m.event_date,sum(e.quantity),e.snapshot_json FROM receipt_suppliers r "
                "JOIN it_asset_stock_movements m ON m.id=r.receipt_id "
                "JOIN it_asset_stock_entries e ON e.movement_id=r.receipt_id "
                "LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id "
                "WHERE r.supplier_id=? GROUP BY m.id "
                "HAVING ? OR max(u.device_id IS NOT NULL)=0 ORDER BY m.event_date DESC,m.id DESC",
                (supplier_id, devices)):
            snapshot = json.loads(raw)
            records.append({
                "id": identity, "source": "receipt", "sourceLabel": "IT Assets Receipt",
                "name": snapshot.get("name") or "Stock Item",
                "type": snapshot.get("category") or "Unknown",
                "identifier": f"Receipt #{identity}", "date": date,
                "quantity": quantity, "status": "Received",
            })
            supplied_quantity += quantity
    return {"quantity": str(supplied_quantity), "records": records}
