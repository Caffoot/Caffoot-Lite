"""Schema 22 adds retained Supplier Issues and their independent catalogue."""
from .stock_schema import stock_schema_statements

ISSUE_STATUSES = ("Open", "In Progress", "Resolved", "Closed")
INITIAL_ISSUE_CATEGORIES = (
    "Damaged Equipment", "Delivery", "Incorrect Equipment", "Warranty",
    "Billing", "Technical Support", "Service Quality", "Other",
)

ISSUE_SCHEMA = """
CREATE TABLE supplier_issue_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_key TEXT NOT NULL UNIQUE,
    archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
    revision INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE supplier_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    title TEXT NOT NULL CHECK(length(trim(title))>0),
    description TEXT NOT NULL CHECK(length(trim(description))>0),
    category_id INTEGER REFERENCES supplier_issue_categories(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'Open' CHECK(status IN ('Open','In Progress','Resolved','Closed')),
    created_by INTEGER NOT NULL,
    created_label TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(supplier_id,id)
);
CREATE INDEX supplier_issues_by_status ON supplier_issues(status,updated_at,id);
CREATE TABLE supplier_issue_contacts (
    supplier_id INTEGER NOT NULL,
    issue_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    PRIMARY KEY(issue_id,contact_id),
    FOREIGN KEY(supplier_id,issue_id) REFERENCES supplier_issues(supplier_id,id) ON DELETE RESTRICT,
    FOREIGN KEY(supplier_id,contact_id) REFERENCES supplier_contacts(supplier_id,id) ON DELETE RESTRICT
);
CREATE TABLE supplier_issue_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES supplier_issues(id) ON DELETE RESTRICT,
    body TEXT NOT NULL CHECK(length(trim(body))>0),
    created_by INTEGER NOT NULL,
    created_label TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_by INTEGER,
    updated_label TEXT,
    updated_at TEXT
);
CREATE INDEX supplier_issue_updates_by_issue ON supplier_issue_updates(issue_id,created_at,id);
CREATE TRIGGER supplier_issue_no_delete BEFORE DELETE ON supplier_issues
BEGIN SELECT RAISE(ABORT,'Supplier Issues are retained'); END;
CREATE TRIGGER supplier_issue_identity BEFORE UPDATE OF id,supplier_id,created_by,created_label,created_at ON supplier_issues
BEGIN SELECT RAISE(ABORT,'Supplier Issue identity and attribution cannot change'); END;
CREATE TRIGGER supplier_issue_update_no_delete BEFORE DELETE ON supplier_issue_updates
BEGIN SELECT RAISE(ABORT,'Supplier Issue Updates are retained'); END;
CREATE TRIGGER supplier_issue_update_identity BEFORE UPDATE OF id,issue_id,created_by,created_label,created_at ON supplier_issue_updates
BEGIN SELECT RAISE(ABORT,'Supplier Issue Update identity and attribution cannot change'); END;
CREATE TRIGGER supplier_issue_contact_history AFTER INSERT ON supplier_issue_contacts
BEGIN UPDATE supplier_contacts SET has_issue_history=1 WHERE id=NEW.contact_id; END;
CREATE TRIGGER supplier_issue_contact_retention BEFORE DELETE ON supplier_contacts WHEN OLD.has_issue_history=1
BEGIN SELECT RAISE(ABORT,'Supplier Contact has Issue history'); END;
CREATE TRIGGER supplier_issue_contact_history_immutable BEFORE UPDATE OF has_issue_history ON supplier_contacts
WHEN OLD.has_issue_history=1 AND NEW.has_issue_history!=1
BEGIN SELECT RAISE(ABORT,'Supplier Contact Issue history is retained'); END;
CREATE TRIGGER supplier_issue_audit_no_update BEFORE UPDATE ON inventory_change_history
WHEN CASE WHEN json_valid(OLD.record_json) THEN
    json_extract(OLD.record_json,'$.changes[0].kind')='Suppliers'
    AND json_extract(OLD.record_json,'$.reason') LIKE 'Supplier issue%' END
BEGIN SELECT RAISE(ABORT,'Supplier Issue audit is immutable'); END;
CREATE TRIGGER supplier_issue_audit_no_delete BEFORE DELETE ON inventory_change_history
WHEN CASE WHEN json_valid(OLD.record_json) THEN
    json_extract(OLD.record_json,'$.changes[0].kind')='Suppliers'
    AND json_extract(OLD.record_json,'$.reason') LIKE 'Supplier issue%' END
BEGIN SELECT RAISE(ABORT,'Supplier Issue audit is retained'); END;
"""


def migrate_supplier_issues(connection):
    connection.execute("""
        ALTER TABLE supplier_contacts ADD COLUMN has_issue_history INTEGER NOT NULL DEFAULT 0
        CHECK(has_issue_history IN (0,1))
    """)
    for statement in stock_schema_statements(ISSUE_SCHEMA):
        connection.execute(statement)
    connection.executemany(
        "INSERT INTO supplier_issue_categories(name,name_key) VALUES(?,?)",
        [(name, name.casefold()) for name in INITIAL_ISSUE_CATEGORIES],
    )
    if connection.execute("PRAGMA foreign_key_check").fetchone():
        raise RuntimeError("Supplier Issue upgrade failed relationship verification")
