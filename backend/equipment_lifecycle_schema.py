"""Schema 24 stores lifecycle information without inferring historical dates."""
from .equipment_lifecycle import DEFAULT_LIFESPANS
from .stock_schema import LIFECYCLE_FEATURE_TABLE_SQL, stock_schema_statements, validate_feature_table


def seed_equipment_lifecycle_defaults(connection):
    """Create the initial warning periods and equipment lifespan catalogue."""
    connection.execute("""
        INSERT INTO equipment_lifecycle_settings(singleton,warranty_days,replacement_days)
        VALUES(1,90,90)
    """)
    connection.executemany(
        "INSERT INTO equipment_lifecycle_types(name,years,original_name) VALUES(?,?,?)",
        ((name, years, name) for name, years in DEFAULT_LIFESPANS.items()),
    )


def migrate_equipment_lifecycle(connection):
    choices = validate_feature_table(connection, upgraded=True, lifecycle=False)
    ddl = """
    CREATE TABLE equipment_lifecycle_settings (
        singleton INTEGER PRIMARY KEY CHECK(singleton=1),
        warranty_days INTEGER NOT NULL CHECK(warranty_days BETWEEN 0 AND 3650),
        replacement_days INTEGER NOT NULL CHECK(replacement_days BETWEEN 0 AND 3650),
        revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0)
    );
    CREATE TABLE equipment_lifecycle_types (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        years INTEGER CHECK(years BETWEEN 1 AND 100),
        archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
        original_name TEXT UNIQUE
    );
    CREATE TABLE device_lifecycle (
        device_id TEXT PRIMARY KEY REFERENCES inventory_devices(id) ON DELETE CASCADE,
        purchase_date TEXT,
        original_in_service_date TEXT,
        warranty_expiry TEXT,
        replacement_override TEXT
    );
    """
    connection.execute(LIFECYCLE_FEATURE_TABLE_SQL.replace(
        '"organisation_features"', 'organisation_features_next', 1))
    connection.execute("INSERT INTO organisation_features_next SELECT * FROM organisation_features")
    connection.execute("DROP TABLE organisation_features")
    connection.execute("ALTER TABLE organisation_features_next RENAME TO organisation_features")
    for statement in stock_schema_statements(ddl):
        connection.execute(statement)
    seed_equipment_lifecycle_defaults(connection)
    if validate_feature_table(connection, upgraded=True, lifecycle=True) != choices:
        raise RuntimeError("Equipment Lifecycle upgrade changed existing feature choices")
