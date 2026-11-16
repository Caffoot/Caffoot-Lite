"""Keep explicit accessory links without copying stock or holder records."""
import re

from backend.permissions import can_access
from backend.audit_events import record_actor_event
from backend.stock_circulation import (stock_issue_records, stock_recipient,
    issue_stock_in_transaction, require_stock_device_edit)
from backend.stock_intake import stock_digest, stock_operation, stock_replay, stock_write_access
from backend.stock_schema import normalise_schema_statement, stock_schema_statements


EQUIPMENT_ASSOCIATION_SQL = """
CREATE TABLE device_equipment_associations (
 id INTEGER PRIMARY KEY AUTOINCREMENT CHECK(id>0),
 device_assignment_id INTEGER NOT NULL REFERENCES device_assignments(id) ON DELETE RESTRICT,
 issue_entry_id INTEGER NOT NULL UNIQUE REFERENCES it_asset_stock_entries(id) ON DELETE RESTRICT,
 operation_key TEXT NOT NULL UNIQUE CHECK(length(trim(operation_key))>0),
 operation_hash TEXT NOT NULL CHECK(length(operation_hash)=64 AND operation_hash NOT GLOB '*[^0-9a-f]*'),
 associated_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now'))
   CHECK(length(associated_at)=24 AND strftime('%Y-%m-%dT%H:%M:%fZ',associated_at) IS associated_at),
 actor_id INTEGER NOT NULL CHECK(typeof(actor_id)='integer' AND actor_id>0),
 actor_label TEXT NOT NULL CHECK(length(trim(actor_label))>0)
);
CREATE INDEX device_equipment_associations_assignment ON device_equipment_associations(device_assignment_id,id);
CREATE TRIGGER device_equipment_associations_insert_guard
BEFORE INSERT ON device_equipment_associations BEGIN
 SELECT RAISE(ABORT,'Equipment association identities cannot be replaced')
 WHERE EXISTS(SELECT 1 FROM device_equipment_associations
   WHERE id=NEW.id OR issue_entry_id=NEW.issue_entry_id OR operation_key=NEW.operation_key);
 SELECT RAISE(ABORT,'Association requires an eligible current holder and matching outstanding accessory issue')
 WHERE NOT EXISTS(
   SELECT 1 FROM device_assignments a
   JOIN it_asset_stock_entries e ON e.id=NEW.issue_entry_id
   JOIN it_asset_stock_movements m ON m.id=e.movement_id
   LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
   LEFT JOIN staff_members s ON s.id=a.staff_id
   LEFT JOIN departments d ON d.id=a.department_id
   WHERE a.id=NEW.device_assignment_id AND a.ended_at IS NULL
     AND ((a.staff_id IS NOT NULL AND s.active=1)
          OR (a.department_id IS NOT NULL AND d.archived=0))
     AND e.staff_id IS a.staff_id AND e.department_id IS a.department_id
     AND m.kind='issued' AND e.to_state='issued'
     AND e.device_assignment_id IS NULL AND u.device_id IS NULL
     AND (SELECT coalesce(sum(x.quantity*((x.to_state IS 'issued')-(x.from_state IS 'issued'))),0)
          FROM it_asset_stock_entries x JOIN it_asset_stock_movements published ON published.id=x.movement_id
          WHERE x.id=e.id OR x.source_issue_entry_id=e.id)>0);
END;
CREATE TRIGGER device_equipment_associations_no_update
BEFORE UPDATE ON device_equipment_associations BEGIN
 SELECT RAISE(ABORT,'Equipment association history is permanent');
END;
CREATE TRIGGER device_equipment_associations_no_delete
BEFORE DELETE ON device_equipment_associations BEGIN
 SELECT RAISE(ABORT,'Equipment association history is permanent');
END;
"""


def equipment_association_schema(connection):
    """Read only the association table and its named safeguards."""
    return {name: normalise_schema_statement(sql) for name, sql in connection.execute(
        "SELECT name,sql FROM sqlite_master WHERE sql IS NOT NULL AND "
        "(lower(name) GLOB 'device_equipment_associations*' OR tbl_name='device_equipment_associations')")}


def validate_equipment_associations(connection):
    """Refuse an unexpected relationship or missing history protection."""
    expected = {}
    for statement in stock_schema_statements(EQUIPMENT_ASSOCIATION_SQL):
        name = re.match(r'CREATE (?:TABLE|INDEX|TRIGGER) (\w+)', statement)[1]
        expected[name] = normalise_schema_statement(statement)
    if equipment_association_schema(connection) != expected:
        raise RuntimeError('Unexpected equipment association schema; review required')
    if connection.execute('PRAGMA foreign_key_check').fetchone():
        raise RuntimeError('Equipment association relationships failed verification')


def migrate_equipment_associations(connection):
    """Add empty explicit links within the existing database upgrade transaction."""
    if not connection.in_transaction:
        raise RuntimeError('Equipment associations require the database upgrade transaction')
    if equipment_association_schema(connection):
        raise RuntimeError('Unexpected existing equipment association schema; review required')
    for statement in stock_schema_statements(EQUIPMENT_ASSOCIATION_SQL):
        connection.execute(statement)
    validate_equipment_associations(connection)


def read_equipment_associations(connection, actor_id, device_id):
    """Read explicit links only after both independent inventory grants pass."""
    if not all(can_access(connection, actor_id, section) for section in ('Devices', 'IT Assets')):
        raise PermissionError('Devices Read and IT Assets Read are required')
    if not isinstance(device_id, str) or not device_id:
        raise ValueError('One Device is required')
    if connection.execute('SELECT 1 FROM inventory_devices WHERE id=?', (device_id,)).fetchone() is None:
        raise LookupError('Device not found')
    rows = connection.execute('''SELECT l.id,l.device_assignment_id,l.issue_entry_id,
        l.associated_at,l.actor_id,l.actor_label,a.ended_at
        FROM device_equipment_associations l
        JOIN device_assignments a ON a.id=l.device_assignment_id
        WHERE a.device_id=? ORDER BY l.id DESC''', (device_id,)).fetchall()
    issues = {issue['id']: issue for issue in stock_issue_records(connection)} if rows else {}
    history = [dict(id=identity, deviceAssignmentId=assignment, associatedAt=associated,
        actorId=actor, actorLabel=label, assignmentEndedAt=ended, issue=issues[issue])
        for identity, assignment, issue, associated, actor, label, ended in rows]
    return dict(current=[record for record in history
                         if record['assignmentEndedAt'] is None and record['issue']['outstanding'] > 0],
                history=history)


def add_associated_equipment(connection, actor_id, token, payload, *, issue_new=False):
    """Save the issue, explicit links and attributed history as one complete change."""
    common = {'operationId', 'deviceId', 'deviceRevision', 'deviceAssignmentId'}
    selection = ({'stockItemId', 'version', 'quantity', 'stockUnitIds', 'issuedOn', 'note'}
                 if issue_new else {'issueEntryId', 'version'})
    operation, _ = stock_operation(payload, common | selection,
                                   common | (selection - {'stockUnitIds'}))
    key = 'equipment:associate:' + str(actor_id) + ':' + operation
    # Include the route in the request comparison so an operation reference
    # cannot be reused to perform a different kind of save.
    digest = stock_digest(dict(request=payload, issueNew=issue_new))
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection, actor_id, token)
        if not can_access(connection, actor_id, 'Devices', edit=True):
            raise PermissionError('Devices Edit and IT Assets Edit are required')
        replay = stock_replay(connection, key, digest)
        if replay is not None:
            connection.commit()
            return replay
        device_id = payload['deviceId']
        require_stock_device_edit(connection, actor_id, device_id)
        revision, assignment_id = payload['deviceRevision'], payload['deviceAssignmentId']
        if (type(revision) is not int or revision < 0
                or type(assignment_id) is not int or assignment_id < 1):
            raise ValueError('Select the current Device revision and assignment')
        device = connection.execute('SELECT revision FROM inventory_devices WHERE id=?', (device_id,)).fetchone()
        assignment = connection.execute('''SELECT staff_id,department_id FROM device_assignments
            WHERE id=? AND device_id=? AND ended_at IS NULL''', (assignment_id, device_id)).fetchone()
        if device is None or device[0] != revision or assignment is None:
            raise FileExistsError('Device or holder changed. Reload before adding equipment.')
        recipient = stock_recipient(connection, 'staff' if assignment[0] is not None else 'department',
                                    assignment[0] if assignment[0] is not None else assignment[1])
        movement = None
        if issue_new:
            issue_payload = {name: payload[name] for name in selection if name in payload}
            issue_payload.update(operationId=operation,
                recipientKind='staff' if recipient['staff_id'] is not None else 'department',
                recipientId=recipient['staff_id'] if recipient['staff_id'] is not None else recipient['department_id'])
            issued = issue_stock_in_transaction(connection, actor_id, token, issue_payload,
                                                operation_key=key + ':stock')
            movement = issued['movementId']
            issue_ids = [row[0] for row in connection.execute('''SELECT id FROM it_asset_stock_entries
                WHERE movement_id=? AND to_state='issued' ORDER BY id''', (movement,))]
        else:
            identity = payload['issueEntryId']
            if type(identity) is not int or identity < 1:
                raise ValueError('Select an original accessory issue')
            source = next((row for row in stock_issue_records(connection) if row['id'] == identity), None)
            if source is None:
                raise LookupError('Original stock issue not found')
            if source['version'] != payload['version']:
                raise FileExistsError('Issued equipment changed. Reload before associating it.')
            if (source['outstanding'] < 1 or source['deviceAssignmentId'] is not None
                    or (source['staffId'], source['departmentId']) != (recipient['staff_id'], recipient['department_id'])):
                raise ValueError('Select outstanding accessory equipment issued to this exact holder')
            if connection.execute('SELECT 1 FROM device_equipment_associations WHERE issue_entry_id=?', (identity,)).fetchone():
                raise FileExistsError('This original issue is already associated with a Device')
            issue_ids = [identity]
        actor_label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor_id,)).fetchone()[0]
        associations = []
        for index, identity in enumerate(issue_ids):
            associations.append(connection.execute('''INSERT INTO device_equipment_associations
                (device_assignment_id,issue_entry_id,operation_key,operation_hash,actor_id,actor_label)
                VALUES(?,?,?,?,?,?)''', (assignment_id, identity, key if index == 0 else key + ':' + str(index),
                                        digest, actor_id, actor_label)).lastrowid)
        result = dict(deviceId=device_id, deviceAssignmentId=assignment_id,
                      associationIds=associations, issueEntryIds=issue_ids, movementId=movement)
        record_actor_event(connection, actor_id, kind='IT Assets', action='Associated', label=device_id,
            reason='Equipment associated with Device', fields=['Associated Equipment'],
            confirmation_id=key, after=dict(deviceId=device_id, operationHash=digest, result=result))
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
