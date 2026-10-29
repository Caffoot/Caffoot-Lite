"""SQLite schema foundation for Caffoot Lite Next.

These tables are internal only. No v1.3.3 inventory is imported or served yet.
Record JSON is retained to preserve optional and historical fields during the
later source-compatible projection work.
"""
import sqlite3

SCHEMA_VERSION = 7

DDL = """
CREATE TABLE IF NOT EXISTS inventory_devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    revision INTEGER NOT NULL DEFAULT 0 CHECK(revision >= 0),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS inventory_subnets (
    id TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS inventory_vlans (
    id TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS inventory_racks (
    id TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS inventory_rack_accessories (
    id TEXT PRIMARY KEY,
    rack_id TEXT NOT NULL,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_rack_accessories_rack
    ON inventory_rack_accessories(rack_id);
CREATE TABLE IF NOT EXISTS inventory_ip_allocations (
    ip TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json))
);
CREATE TABLE IF NOT EXISTS inventory_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL CHECK(json_valid(value_json))
);
CREATE TABLE IF NOT EXISTS inventory_change_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_json TEXT NOT NULL CHECK(json_valid(record_json))
);
"""

def initialise_database(connection: sqlite3.Connection) -> None:
    """Apply schema changes in one transaction; fail closed on newer versions."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        versions = {row[0] for row in connection.execute(
            "SELECT version FROM schema_migrations"
        )}
        if versions and max(versions) > SCHEMA_VERSION:
            raise RuntimeError("Database schema is newer than this application")
        if 1 not in versions:
            connection.execute(
                "INSERT INTO schema_migrations (version) VALUES (1)"
            )
        if 2 not in versions:
            for statement in DDL.split(";"):
                if statement.strip():
                    connection.execute(statement)
            connection.execute(
                "INSERT INTO schema_migrations (version) VALUES (2)"
            )
        if 3 not in versions:
            connection.execute("""
                CREATE TABLE accounts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
                    password_hash TEXT NOT NULL,
                    is_admin INTEGER NOT NULL DEFAULT 0 CHECK(is_admin IN (0,1)),
                    mfa_secret TEXT,
                    mfa_confirmed INTEGER NOT NULL DEFAULT 0
                        CHECK(mfa_confirmed IN (0,1)),
                    active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
                    CHECK(mfa_confirmed = 0 OR mfa_secret IS NOT NULL)
                )
            """)
            connection.execute(
                "INSERT INTO schema_migrations (version) VALUES (3)"
            )
        if 4 not in versions:
            connection.execute("""
                CREATE TABLE account_permissions (
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    section TEXT NOT NULL CHECK(section IN ('Devices','IPAM','Racks')),
                    level TEXT NOT NULL CHECK(level IN ('read','edit')),
                    PRIMARY KEY(account_id, section)
                )
            """)
            connection.execute(
                "INSERT INTO schema_migrations (version) VALUES (4)"
            )
        if 5 not in versions:
            connection.execute("""
                CREATE TABLE account_sessions (
                    token_hash TEXT PRIMARY KEY,
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL,
                    created_at INTEGER NOT NULL
                )
            """)
            connection.execute(
                "CREATE INDEX account_sessions_expiry ON account_sessions(expires_at)"
            )
            connection.execute(
                "INSERT INTO schema_migrations (version) VALUES (5)"
            )
        if 6 not in versions:
            connection.execute("""
                CREATE TABLE device_edit_reservations (
                    device_id TEXT PRIMARY KEY REFERENCES inventory_devices(id) ON DELETE CASCADE,
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL
                )
            """)
            connection.execute("INSERT INTO schema_migrations (version) VALUES (6)")
        if 7 not in versions:
            connection.execute(
                "ALTER TABLE device_edit_reservations ADD COLUMN base_revision INTEGER NOT NULL DEFAULT 0"
            )
            connection.execute("INSERT INTO schema_migrations (version) VALUES (7)")
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
