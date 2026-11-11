"""SQLite tables and numbered upgrades for the shared Caffoot Lite application.

Inventory JSON retains optional and historical fields. Account, profile and
email-challenge tables support the authenticated server without changing
the published inventory import format."""
import sqlite3

SCHEMA_VERSION = 11

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
        if 8 not in versions:
            connection.execute("""
                CREATE TABLE account_profiles (
                    account_id INTEGER PRIMARY KEY
                        REFERENCES accounts(id) ON DELETE CASCADE,
                    first_name TEXT NOT NULL DEFAULT '',
                    last_name TEXT NOT NULL DEFAULT '',
                    display_name TEXT NOT NULL DEFAULT '',
                    email TEXT NOT NULL DEFAULT '',
                    email_verified INTEGER NOT NULL DEFAULT 0
                        CHECK(email_verified IN (0,1)),
                    photo_mime TEXT,
                    photo_data BLOB,
                    CHECK((photo_mime IS NULL AND photo_data IS NULL) OR
                          (photo_mime IN ('image/png','image/jpeg','image/webp')
                           AND photo_data IS NOT NULL
                           AND length(photo_data) <= 5242880))
                )
            """)
            connection.execute("INSERT INTO schema_migrations (version) VALUES (8)")
        if 9 not in versions:
            connection.execute("""
                CREATE TABLE account_email_proofs (
                    token_hash TEXT PRIMARY KEY,
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    purpose TEXT NOT NULL CHECK(purpose IN ('verify','recover')),
                    email TEXT NOT NULL,
                    expires_at INTEGER NOT NULL,
                    UNIQUE(account_id,purpose)
                )
            """)
            connection.execute("INSERT INTO schema_migrations(version) VALUES(9)")
        if 10 not in versions:
            # Old long-format proofs cannot be used with the new short-code challenge flow.
            connection.execute("DELETE FROM account_email_proofs")
            connection.execute("ALTER TABLE account_email_proofs ADD COLUMN challenge_id TEXT")
            connection.execute("ALTER TABLE account_email_proofs ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts>=0)")
            connection.execute("CREATE UNIQUE INDEX account_email_challenge ON account_email_proofs(challenge_id)")
            connection.execute("""
                CREATE TABLE account_email_attempts (
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    purpose TEXT NOT NULL CHECK(purpose IN ('verify','recover')),
                    attempted_at INTEGER NOT NULL
                )
            """)
            connection.execute("CREATE INDEX account_email_attempt_window ON account_email_attempts(account_id,purpose,attempted_at)")
            connection.execute("INSERT INTO schema_migrations(version) VALUES(10)")
        if 11 not in versions:
            migrate_role_permissions(connection)
            connection.execute("INSERT INTO schema_migrations(version) VALUES(11)")
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def migrate_role_permissions(connection):
    """Keep existing access and account details while introducing shared roles.

    The caller owns the upgrade transaction. A failed check therefore restores
    the old tables and sessions as well as removing the incomplete upgrade.
    """
    accounts_before = connection.execute("SELECT * FROM accounts ORDER BY id").fetchall()
    grants_before = connection.execute(
        "SELECT account_id,section,level FROM account_permissions ORDER BY account_id,section"
    ).fetchall()
    connection.execute("""
        CREATE TABLE roles (
            id INTEGER PRIMARY KEY,
            role_key TEXT NOT NULL UNIQUE
                CHECK(length(role_key)>0 AND role_key GLOB '[a-z]*'
                      AND role_key NOT GLOB '*[^a-z0-9_]*'),
            name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK(length(trim(name))>0),
            enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
            is_builtin INTEGER NOT NULL DEFAULT 0 CHECK(is_builtin IN (0,1)),
            CHECK((role_key='staff_member' AND name='Staff Member' COLLATE BINARY
                   AND enabled=1 AND is_builtin=1)
                  OR (role_key!='staff_member' AND is_builtin=0))
        )
    """)
    connection.execute("""
        CREATE TRIGGER immutable_role_key BEFORE UPDATE OF role_key ON roles
        WHEN NEW.role_key != OLD.role_key
        BEGIN SELECT RAISE(ABORT, 'Role keys cannot change'); END
    """)
    connection.execute("""
        CREATE TRIGGER protect_staff_member_update BEFORE UPDATE ON roles
        WHEN OLD.role_key='staff_member'
        BEGIN SELECT RAISE(ABORT, 'Staff Member cannot change'); END
    """)
    connection.execute("""
        CREATE TRIGGER protect_staff_member_delete BEFORE DELETE ON roles
        WHEN OLD.role_key='staff_member'
        BEGIN SELECT RAISE(ABORT, 'Staff Member cannot be deleted'); END
    """)
    connection.execute("""
        CREATE TABLE role_grants (
            role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
            section TEXT NOT NULL CHECK(length(trim(section))>0),
            level TEXT NOT NULL CHECK(level IN ('read','edit')),
            PRIMARY KEY(role_id,section)
        )
    """)
    for operation in ("INSERT", "UPDATE"):
        connection.execute(f"""
            CREATE TRIGGER protect_staff_grants_{operation.lower()}
            BEFORE {operation} ON role_grants
            WHEN NEW.role_id=(SELECT id FROM roles WHERE role_key='staff_member')
            BEGIN SELECT RAISE(ABORT, 'Staff Member has no inventory grants'); END
        """)
    connection.execute("""
        CREATE TABLE account_roles (
            account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
            PRIMARY KEY(account_id,role_id)
        )
    """)
    connection.execute("CREATE INDEX account_roles_role_id ON account_roles(role_id)")
    connection.execute("""
        CREATE TABLE account_permission_overrides (
            account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            section TEXT NOT NULL CHECK(length(trim(section))>0),
            level TEXT NOT NULL CHECK(level IN ('deny','read','edit')),
            PRIMARY KEY(account_id,section)
        )
    """)
    connection.execute(
        "INSERT INTO roles(role_key,name,enabled,is_builtin) VALUES('staff_member','Staff Member',1,1)"
    )
    connection.execute(
        "INSERT INTO account_roles(account_id,role_id) "
        "SELECT a.id,r.id FROM accounts a CROSS JOIN roles r WHERE r.role_key='staff_member'"
    )
    connection.execute(
        "INSERT INTO account_permission_overrides(account_id,section,level) "
        "SELECT account_id,section,level FROM account_permissions"
    )
    connection.execute("DELETE FROM account_sessions")
    verify_role_migration(connection, accounts_before, grants_before)


def verify_role_migration(connection, accounts_before, grants_before):
    """Refuse an upgrade that loses identities, grants or the safe baseline."""
    accounts_after = connection.execute("SELECT * FROM accounts ORDER BY id").fetchall()
    grants_after = connection.execute(
        "SELECT account_id,section,level FROM account_permission_overrides ORDER BY account_id,section"
    ).fetchall()
    memberships = connection.execute(
        "SELECT a.account_id FROM account_roles a JOIN roles r ON r.id=a.role_id "
        "WHERE r.role_key='staff_member' ORDER BY a.account_id"
    ).fetchall()
    if (accounts_before != accounts_after or grants_before != grants_after
            or memberships != [(row[0],) for row in accounts_before]
            or connection.execute("SELECT count(*) FROM account_roles").fetchone()[0] != len(accounts_before)
            or connection.execute("SELECT count(*) FROM roles").fetchone()[0] != 1
            or connection.execute("SELECT 1 FROM role_grants").fetchone()
            or connection.execute("SELECT 1 FROM account_sessions").fetchone()
            or connection.execute("PRAGMA foreign_key_check").fetchone()):
        raise RuntimeError("Role migration did not preserve accounts and permissions")
