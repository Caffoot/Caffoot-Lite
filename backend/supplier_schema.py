"""Schema 21 adds independent Supplier records and preserves existing feature choices."""
from .stock_schema import stock_schema_statements, validate_feature_table

INITIAL_CATEGORIES = (
    "Hardware", "Software", "Licensing", "Networking", "Telecommunications",
    "Office Supplies", "Professional Services", "Other",
)

SUPPLIER_SCHEMA = """
CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_key TEXT NOT NULL UNIQUE,
    website TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','archived','disabled')),
    revision INTEGER NOT NULL DEFAULT 0,
    has_note_history INTEGER NOT NULL DEFAULT 0 CHECK(has_note_history IN (0,1))
);
CREATE TABLE supplier_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postcode TEXT NOT NULL,
    country TEXT NOT NULL,
    is_main INTEGER NOT NULL DEFAULT 0 CHECK(is_main IN (0,1)),
    archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
    UNIQUE(supplier_id,id)
);
CREATE UNIQUE INDEX supplier_main_office ON supplier_locations(supplier_id) WHERE is_main=1;
CREATE TABLE supplier_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phones TEXT NOT NULL CHECK(json_valid(phones) AND json_type(phones)='array'),
    emails TEXT NOT NULL CHECK(json_valid(emails) AND json_type(emails)='array'),
    profiles TEXT NOT NULL CHECK(json_valid(profiles) AND json_type(profiles)='array'),
    company_wide INTEGER NOT NULL CHECK(company_wide IN (0,1)),
    archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
    has_note_history INTEGER NOT NULL DEFAULT 0 CHECK(has_note_history IN (0,1)),
    UNIQUE(supplier_id,id)
);
CREATE TABLE supplier_contact_locations (
    supplier_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    PRIMARY KEY(contact_id,location_id),
    FOREIGN KEY(supplier_id,contact_id) REFERENCES supplier_contacts(supplier_id,id) ON DELETE CASCADE,
    FOREIGN KEY(supplier_id,location_id) REFERENCES supplier_locations(supplier_id,id) ON DELETE RESTRICT
);
CREATE INDEX supplier_contacts_by_location ON supplier_contact_locations(location_id);
CREATE TABLE supplier_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_key TEXT NOT NULL UNIQUE,
    archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
    revision INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE supplier_category_assignments (
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES supplier_categories(id) ON DELETE RESTRICT,
    PRIMARY KEY(supplier_id,category_id)
);
CREATE TABLE supplier_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    contact_id INTEGER,
    body TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_label TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_by INTEGER,
    updated_label TEXT,
    updated_at TEXT,
    FOREIGN KEY(supplier_id,contact_id) REFERENCES supplier_contacts(supplier_id,id) ON DELETE RESTRICT
);
CREATE INDEX supplier_notes_by_owner ON supplier_notes(supplier_id,contact_id);
CREATE TABLE supplier_supply_history (
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    section TEXT NOT NULL CHECK(section IN ('Devices','IT Assets')),
    PRIMARY KEY(supplier_id,section)
);
CREATE TRIGGER supplier_supply_history_no_update BEFORE UPDATE ON supplier_supply_history
BEGIN SELECT RAISE(ABORT,'Supplier supply history cannot change'); END;
CREATE TRIGGER supplier_supply_history_no_delete BEFORE DELETE ON supplier_supply_history
BEGIN SELECT RAISE(ABORT,'Supplier supply history cannot be deleted'); END;
"""


def migrate_suppliers(connection):
    """Create empty records with the owner-approved catalogue, once per installation."""
    choices = validate_feature_table(connection, upgraded=True, suppliers=False)
    for table in ("role_grants", "account_permission_overrides"):
        if connection.execute(f"SELECT 1 FROM {table} WHERE section='Suppliers' LIMIT 1").fetchone():
            raise RuntimeError("Supplier upgrade found pre-existing Supplier grants; review required")
    connection.execute("""
        CREATE TABLE organisation_features_next (
         feature TEXT NOT NULL PRIMARY KEY CHECK(feature IN
           ('devices','ipam','racks','suppliers','equipment_lifecycle','it_assets')),
         enabled INTEGER NOT NULL CHECK(typeof(enabled)='integer' AND enabled IN (0,1)),
         CHECK(feature IN ('devices','ipam','racks','it_assets','suppliers') OR enabled=0)
        )
    """)
    connection.execute("INSERT INTO organisation_features_next SELECT * FROM organisation_features")
    connection.execute("DROP TABLE organisation_features")
    connection.execute("ALTER TABLE organisation_features_next RENAME TO organisation_features")
    if validate_feature_table(connection, upgraded=True, suppliers=True) != choices:
        raise RuntimeError("Supplier upgrade changed existing feature choices")
    for statement in stock_schema_statements(SUPPLIER_SCHEMA):
        connection.execute(statement)
    connection.executemany(
        "INSERT INTO supplier_categories(name,name_key) VALUES(?,?)",
        [(name, name.casefold()) for name in INITIAL_CATEGORIES],
    )
    if connection.execute("PRAGMA foreign_key_check").fetchone():
        raise RuntimeError("Supplier upgrade failed relationship verification")
