-- Published v2.1 schema from b13e5ce919d825280a6fa5450f04ff26c356eb11.
BEGIN TRANSACTION;
CREATE TABLE account_email_attempts (
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    purpose TEXT NOT NULL CHECK(purpose IN ('verify','recover')),
                    attempted_at INTEGER NOT NULL
                );
CREATE TABLE account_email_proofs (
                    token_hash TEXT PRIMARY KEY,
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    purpose TEXT NOT NULL CHECK(purpose IN ('verify','recover')),
                    email TEXT NOT NULL,
                    expires_at INTEGER NOT NULL, challenge_id TEXT, attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts>=0),
                    UNIQUE(account_id,purpose)
                );
CREATE TABLE account_permissions (
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    section TEXT NOT NULL CHECK(section IN ('Devices','IPAM','Racks')),
                    level TEXT NOT NULL CHECK(level IN ('read','edit')),
                    PRIMARY KEY(account_id, section)
                );
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
                );
CREATE TABLE account_sessions (
                    token_hash TEXT PRIMARY KEY,
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL,
                    created_at INTEGER NOT NULL
                );
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
                );
CREATE TABLE device_edit_reservations (
                    device_id TEXT PRIMARY KEY REFERENCES inventory_devices(id) ON DELETE CASCADE,
                    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL
                , base_revision INTEGER NOT NULL DEFAULT 0);
CREATE TABLE inventory_change_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_json TEXT NOT NULL CHECK(json_valid(record_json))
);
CREATE TABLE inventory_devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    revision INTEGER NOT NULL DEFAULT 0 CHECK(revision >= 0),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE inventory_ip_allocations (
    ip TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json))
);
CREATE TABLE inventory_rack_accessories (
    id TEXT PRIMARY KEY,
    rack_id TEXT NOT NULL,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE inventory_racks (
    id TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE inventory_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL CHECK(json_valid(value_json))
);
CREATE TABLE inventory_subnets (
    id TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE inventory_vlans (
    id TEXT PRIMARY KEY,
    record_json TEXT NOT NULL CHECK(json_valid(record_json)),
    ordinal INTEGER NOT NULL UNIQUE
);
CREATE TABLE schema_migrations (
                version INTEGER PRIMARY KEY,
                applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
INSERT INTO "schema_migrations" VALUES(1,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(2,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(3,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(4,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(5,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(6,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(7,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(8,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(9,'2026-11-11 08:34:30');
INSERT INTO "schema_migrations" VALUES(10,'2026-11-11 08:34:30');
CREATE INDEX idx_rack_accessories_rack
    ON inventory_rack_accessories(rack_id);
CREATE INDEX account_sessions_expiry ON account_sessions(expires_at);
CREATE UNIQUE INDEX account_email_challenge ON account_email_proofs(challenge_id);
CREATE INDEX account_email_attempt_window ON account_email_attempts(account_id,purpose,attempted_at);
DELETE FROM "sqlite_sequence";
COMMIT;
