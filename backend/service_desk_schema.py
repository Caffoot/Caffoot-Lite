"""Store Service Desk tickets against the existing equipment and its history."""
from backend.stock_schema import stock_schema_statements

DEFAULT_TICKET_CATEGORIES = (
    'Access Permissions / Folder Access',
    'Email / Sending & Receiving Issues',
    'Hardware / Physical Damage',
    'Internet Issues / Website Problems',
    'LAN / Shared Drive Issues',
    'Maintenance / Upgrades',
    'Password / Access',
    'Peripherals / Accessories',
    'Printing / Printer Configuration',
    'Software / Applications',
    'User Account / Login',
    'Other / Not Listed',
)

SERVICE_DESK_SCHEMA = """
CREATE TABLE service_desk_categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK(length(trim(name))>0),
    hidden INTEGER NOT NULL DEFAULT 0 CHECK(hidden IN (0,1))
);
CREATE TABLE service_desk_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT REFERENCES inventory_devices(id) ON DELETE RESTRICT,
    stock_unit_id TEXT REFERENCES it_asset_stock_units(id) ON DELETE RESTRICT,
    stock_item_id TEXT REFERENCES it_asset_stock_items(id) ON DELETE RESTRICT,
    device_assignment_id INTEGER REFERENCES device_assignments(id) ON DELETE RESTRICT,
    stock_issue_id INTEGER REFERENCES it_asset_stock_entries(id) ON DELETE RESTRICT,
    stock_movement_at_creation INTEGER REFERENCES it_asset_stock_movements(id) ON DELETE RESTRICT,
    created_by INTEGER NOT NULL,
    created_by_label TEXT NOT NULL,
    employee_id TEXT REFERENCES staff_members(id) ON DELETE RESTRICT,
    employee_label TEXT,
    technician_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    category_id INTEGER NOT NULL REFERENCES service_desk_categories(id) ON DELETE RESTRICT,
    category_label TEXT NOT NULL,
    subject TEXT NOT NULL CHECK(length(trim(subject))>0),
    description TEXT NOT NULL CHECK(length(trim(description))>0),
    status TEXT NOT NULL DEFAULT 'Open' CHECK(status IN ('Open','In Progress','On Hold','Closed')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK(priority IN ('Low','Medium','High')),
    status_before_hold TEXT CHECK(status_before_hold IN ('Open','In Progress')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    CHECK((device_id IS NOT NULL)+(stock_unit_id IS NOT NULL)+(stock_item_id IS NOT NULL)=1),
    CHECK(device_assignment_id IS NULL OR device_id IS NOT NULL),
    CHECK(stock_issue_id IS NULL OR device_id IS NULL),
    CHECK((stock_issue_id IS NULL)=(stock_movement_at_creation IS NULL)),
    CHECK((status='On Hold')=(status_before_hold IS NOT NULL))
);
CREATE INDEX service_desk_tickets_device ON service_desk_tickets(device_id);
CREATE INDEX service_desk_tickets_unit ON service_desk_tickets(stock_unit_id);
CREATE INDEX service_desk_tickets_item ON service_desk_tickets(stock_item_id);
CREATE TABLE service_desk_events (
    id INTEGER PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES service_desk_tickets(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK(kind IN ('Created','Status Changed','Assignment Changed',
        'Priority Changed','Category Changed','Message Added','Message Edited','Closed','Reopened')),
    actor_id INTEGER NOT NULL,
    actor_label TEXT NOT NULL,
    happened_at TEXT NOT NULL,
    employee_visible INTEGER NOT NULL CHECK(employee_visible IN (0,1)),
    details TEXT NOT NULL CHECK(json_valid(details) AND json_type(details)='object'),
    private_details TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(private_details) AND json_type(private_details)='object'),
    UNIQUE(ticket_id,id)
);
CREATE TABLE service_desk_messages (
    id INTEGER PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES service_desk_tickets(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK(kind IN ('Reply','IT Update','Resolution Note')),
    employee_visible INTEGER NOT NULL CHECK(employee_visible IN (0,1)),
    actor_id INTEGER NOT NULL,
    actor_label TEXT NOT NULL,
    created_at TEXT NOT NULL,
    edited_at TEXT,
    body TEXT NOT NULL CHECK(length(trim(body))>0),
    CHECK(kind='IT Update' OR employee_visible=1),
    UNIQUE(ticket_id,id)
);
CREATE TABLE service_desk_attachments (
    id INTEGER PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    filename TEXT NOT NULL CHECK(length(trim(filename))>0),
    contents BLOB NOT NULL CHECK(typeof(contents)='blob' AND length(contents) BETWEEN 1 AND 10000000),
    FOREIGN KEY(ticket_id,message_id) REFERENCES service_desk_messages(ticket_id,id) ON DELETE CASCADE
);
CREATE INDEX service_desk_attachments_message ON service_desk_attachments(ticket_id,message_id);
CREATE TABLE service_desk_closures (
    id INTEGER PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES service_desk_tickets(id) ON DELETE CASCADE,
    closed_event_id INTEGER NOT NULL UNIQUE,
    resolution_message_id INTEGER NOT NULL UNIQUE,
    reopened_event_id INTEGER UNIQUE,
    resolution_working_seconds INTEGER CHECK(resolution_working_seconds>=0),
    FOREIGN KEY(ticket_id,closed_event_id) REFERENCES service_desk_events(ticket_id,id) ON DELETE CASCADE,
    FOREIGN KEY(ticket_id,resolution_message_id) REFERENCES service_desk_messages(ticket_id,id) ON DELETE CASCADE,
    FOREIGN KEY(ticket_id,reopened_event_id) REFERENCES service_desk_events(ticket_id,id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX service_desk_current_closure ON service_desk_closures(ticket_id)
    WHERE reopened_event_id IS NULL;
CREATE TRIGGER service_desk_ticket_equipment_insert BEFORE INSERT ON service_desk_tickets BEGIN
    SELECT RAISE(ABORT,'Ticket equipment must use its canonical record')
    WHERE EXISTS(SELECT 1 FROM it_asset_stock_units WHERE id=NEW.stock_unit_id AND device_id IS NOT NULL)
       OR EXISTS(SELECT 1 FROM it_asset_stock_items WHERE id=NEW.stock_item_id AND tracking_mode!='quantity');
    SELECT RAISE(ABORT,'Ticket assignment must match its Device')
    WHERE NEW.device_assignment_id IS NOT NULL AND NOT EXISTS(
        SELECT 1 FROM device_assignments WHERE id=NEW.device_assignment_id AND device_id=NEW.device_id);
    SELECT RAISE(ABORT,'Ticket issue must match its IT Asset')
    WHERE NEW.stock_issue_id IS NOT NULL AND NOT EXISTS(
        SELECT 1 FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE e.id=NEW.stock_issue_id AND e.to_state='issued' AND m.kind='issued'
          AND (e.stock_item_id=NEW.stock_item_id OR e.stock_unit_id=NEW.stock_unit_id)
          AND e.device_assignment_id IS NULL AND e.movement_id<=NEW.stock_movement_at_creation);
END;
CREATE TRIGGER service_desk_ticket_identity_update
BEFORE UPDATE OF id,device_id,stock_unit_id,stock_item_id,device_assignment_id,stock_issue_id,
    stock_movement_at_creation,created_by,created_by_label,employee_id,employee_label,created_at
ON service_desk_tickets BEGIN
    SELECT RAISE(ABORT,'Ticket identity and original assignment must be retained');
END;
"""


def has_service_desk_storage(connection):
    """Check for the ticket table when opening an earlier database schema."""
    return connection.execute(
        "SELECT 1 FROM sqlite_schema WHERE type='table' AND name='service_desk_tickets'"
    ).fetchone() is not None


def migrate_service_desk(connection):
    """Create the ticket tables within the existing versioned transaction."""
    # Old versions ignored unknown sections. A stray grant must never start
    # giving access to private conversations simply because of an upgrade.
    for table in ('role_grants', 'account_permission_overrides'):
        if connection.execute(f"SELECT 1 FROM {table} WHERE section='Service Desk'").fetchone():
            raise RuntimeError('Unexpected pre-existing Service Desk grants')
    for statement in stock_schema_statements(SERVICE_DESK_SCHEMA):
        connection.execute(statement)
    connection.executemany(
        'INSERT INTO service_desk_categories(id,name) VALUES(?,?)',
        enumerate(DEFAULT_TICKET_CATEGORIES, start=1),
    )


def migrate_ticket_software(connection):
    """Keep the software label as it was when the request was raised."""
    connection.execute('ALTER TABLE service_desk_tickets ADD COLUMN affected_software TEXT')
