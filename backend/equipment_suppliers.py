"""Supplier selection and equipment attribution within existing save transactions."""
from .audit_events import record_actor_event
from .permissions import can_access, feature_enabled

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
