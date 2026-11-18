"""Schema 23 stores explicit Supplier links outside original equipment facts."""
from .equipment_suppliers import SUPPLIER_AUDIT_REASON
from .stock_schema import stock_schema_statements

EQUIPMENT_SUPPLIER_SCHEMA = """
CREATE TABLE device_suppliers (
    device_id TEXT PRIMARY KEY REFERENCES inventory_devices(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE RESTRICT,
    supplier_text TEXT NOT NULL DEFAULT '',
    CHECK((supplier_id IS NOT NULL AND supplier_text='') OR
          (supplier_id IS NULL AND length(trim(supplier_text)) BETWEEN 1 AND 200))
);
CREATE INDEX device_suppliers_by_company ON device_suppliers(supplier_id);
CREATE TABLE receipt_suppliers (
    receipt_id INTEGER PRIMARY KEY REFERENCES it_asset_stock_movements(id) ON DELETE RESTRICT,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE RESTRICT,
    revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>=1)
);
CREATE INDEX receipt_suppliers_by_company ON receipt_suppliers(supplier_id);
CREATE TRIGGER receipt_supplier_receipt_only BEFORE INSERT ON receipt_suppliers
WHEN NOT EXISTS (SELECT 1 FROM it_asset_stock_movements WHERE id=NEW.receipt_id AND kind='received')
BEGIN SELECT RAISE(ABORT,'A Supplier association requires an original receipt'); END;
CREATE TRIGGER receipt_supplier_identity BEFORE UPDATE OF receipt_id ON receipt_suppliers
BEGIN SELECT RAISE(ABORT,'Receipt association identity cannot change'); END;
CREATE TRIGGER receipt_supplier_no_delete BEFORE DELETE ON receipt_suppliers
BEGIN SELECT RAISE(ABORT,'Receipt association revision is retained'); END;
"""


def migrate_equipment_suppliers(connection):
    for statement in stock_schema_statements(EQUIPMENT_SUPPLIER_SCHEMA):
        connection.execute(statement)
    for table, section in (("device_suppliers", "Devices"), ("receipt_suppliers", "IT Assets")):
        for operation in ("INSERT", "UPDATE"):
            connection.execute(f"""
                CREATE TRIGGER {table}_retain_{operation.lower()} AFTER {operation} ON {table}
                WHEN NEW.supplier_id IS NOT NULL
                BEGIN
                    INSERT INTO supplier_supply_history(supplier_id,section) SELECT NEW.supplier_id,'{section}'
                    WHERE NOT EXISTS (SELECT 1 FROM supplier_supply_history
                                      WHERE supplier_id=NEW.supplier_id AND section='{section}');
                END
            """)
    for operation in ("UPDATE", "DELETE"):
        connection.execute(f"""
            CREATE TRIGGER equipment_supplier_audit_no_{operation.lower()}
            BEFORE {operation} ON inventory_change_history
            WHEN CASE WHEN json_valid(OLD.record_json) THEN
                json_extract(OLD.record_json,'$.reason')='{SUPPLIER_AUDIT_REASON}' END
            BEGIN SELECT RAISE(ABORT,'Equipment Supplier audit is retained'); END
        """)
    if connection.execute("PRAGMA foreign_key_check").fetchone():
        raise RuntimeError("Equipment Supplier upgrade failed relationship verification")
