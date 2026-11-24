"""Resolve and edit Department relationships belonging to a Device custody period."""
from datetime import datetime, timezone
import json

from backend.audit_events import record_actor_event
from backend.sessions import session_account


SHARED_DEVICE_TYPES = frozenset(('Desktop', 'Laptop', 'Printer'))


def is_shared_device_type(record):
    return (record.get('type') in SHARED_DEVICE_TYPES
            and not record.get('isVirtual') and not record.get('virtualHostId'))


def department_selection(connection, identities, *, current=()):
    if (not isinstance(identities, list) or not identities or
            any(not isinstance(identity, str) or not 0 < len(identity) <= 200 for identity in identities)):
        raise ValueError('Select at least one Department.')
    if len(set(identities)) != len(identities):
        raise ValueError('Select each Department only once.')
    retained = set(current)
    names = {}
    for identity in identities:
        row = connection.execute('SELECT name,archived FROM departments WHERE id=?', (identity,)).fetchone()
        if row is None or (row[1] and identity not in retained):
            raise ValueError('Choose non-archived Departments for new assignments.')
        names[identity] = row[0]
    return names


def device_recipient(connection, payload):
    """Read either the established recipient ID or a Department selection."""
    from backend.stock_circulation import stock_recipient
    kind = payload.get('recipientKind')
    if 'departmentIds' in payload:
        if kind != 'department' or 'recipientId' in payload:
            raise ValueError('Choose one Staff Member or one or more Departments.')
        departments = department_selection(connection, payload['departmentIds'])
        if len(departments) > 1:
            return dict(staff_id=None, department_id=None,
                        recipient_label=', '.join(departments.values())), departments
        identity = next(iter(departments))
    else:
        identity = payload.get('recipientId')
        departments = {}
    return stock_recipient(connection, kind, identity), departments


def recipient_audit(payload):
    department_ids = payload.get('departmentIds', [])
    if len(department_ids) == 1:
        return dict(recipientKind='department', recipientId=department_ids[0])
    return {key: payload[key] for key in ('recipientKind', 'recipientId', 'departmentIds') if key in payload}


def custody_stock_recipient(assignment_id):
    return dict(staff_id=None, department_id=None, custody_recipient_id=assignment_id,
                recipient_label='Shared Device Custody')


def historical_stock_recipient(issue):
    recipient = dict(staff_id=issue['staffId'], department_id=issue['departmentId'],
                     recipient_label=issue['recipientLabel'])
    if issue.get('custodyRecipientId') is not None:
        recipient['custody_recipient_id'] = issue['custodyRecipientId']
    return recipient


def shared_device_schema_active(connection):
    return connection.execute('SELECT 1 FROM schema_migrations WHERE version=29').fetchone() is not None


def next_custody_id(connection):
    return connection.execute("""SELECT max(
        coalesce((SELECT seq FROM sqlite_sequence WHERE name='device_assignments'),0),
        coalesce((SELECT max(id) FROM device_assignments),0))+1""").fetchone()[0]


def insert_device_custody(connection, device_id, recipient, departments, at, actor, actor_label,
                          *, identity=None):
    if identity is None:
        identity = next_custody_id(connection)
    if len(departments) > 1:
        connection.executemany("""INSERT INTO device_assignment_departments
            (assignment_id,department_id,added_at,added_by,added_by_label) VALUES(?,?,?,?,?)""",
            [(identity, department, at, actor, actor_label) for department in departments])
    connection.execute("""INSERT INTO device_assignments
        (id,device_id,staff_id,department_id,recipient_label,assigned_at,actor_id,actor_label)
        VALUES(?,?,?,?,?,?,?,?)""",
        (identity, device_id, recipient['staff_id'], recipient['department_id'],
         recipient['recipient_label'], at, actor, actor_label))
    return identity


def current_departments(connection, assignment_id):
    if not shared_device_schema_active(connection):
        row = connection.execute("""SELECT d.id,d.name,d.archived FROM device_assignments a
            JOIN departments d ON d.id=a.department_id WHERE a.id=?""", (assignment_id,)).fetchone()
        return [dict(id=row[0],label=row[1],archived=bool(row[2]))] if row else []
    return [dict(id=identity, label=name, archived=bool(archived))
            for identity, name, archived in connection.execute("""
        SELECT d.id,d.name,d.archived FROM device_assignment_departments r
        JOIN departments d ON d.id=r.department_id
        WHERE r.assignment_id=? AND r.removed_at IS NULL ORDER BY d.name COLLATE NOCASE,d.id
        """, (assignment_id,))]


def manage_departments(connection, actor, token, payload):
    """Change sharing inside the current custody and invalidate stale edits."""
    from backend.device_assignments import require_assignment_access

    fields = {'deviceId', 'assignmentId', 'revision', 'departmentIds'}
    if (not isinstance(payload, dict) or set(payload) != fields
            or not isinstance(payload['deviceId'], str) or not payload['deviceId']
            or type(payload['assignmentId']) is not int or payload['assignmentId'] <= 0
            or type(payload['revision']) is not int or payload['revision'] < 0):
        raise ValueError('Select the current Device revision and assignment.')
    connection.execute('BEGIN IMMEDIATE')
    try:
        if session_account(connection, token) != actor:
            raise PermissionError('Verified session required.')
        require_assignment_access(connection, actor, edit=True)
        device_id, identity, revision = payload['deviceId'], payload['assignmentId'], payload['revision']
        row = connection.execute("""SELECT d.record_json,d.revision,a.id,a.staff_id
            FROM inventory_devices d LEFT JOIN device_assignments a ON a.device_id=d.id AND a.ended_at IS NULL
            WHERE d.id=?""", (device_id,)).fetchone()
        if row is None or row[1:3] != (revision, identity):
            raise FileExistsError('The Device or its current assignment changed. Reload and try again.')
        if row[3] is not None or not is_shared_device_type(json.loads(row[0])):
            raise ValueError('Choose an eligible Device currently assigned to a Department.')
        if connection.execute("""SELECT 1 FROM device_edit_reservations
            WHERE device_id=? AND expires_at>strftime('%s','now')""", (device_id,)).fetchone():
            raise FileExistsError('Device is being edited. Try again after editing finishes.')
        previous = {item['id'] for item in current_departments(connection, identity)}
        selected = department_selection(connection, payload['departmentIds'], current=previous)
        added, removed = sorted(selected.keys() - previous), sorted(previous - selected.keys())
        if added or removed:
            now = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
            label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor,)).fetchone()[0]
            connection.executemany("""INSERT INTO device_assignment_departments
                (assignment_id,department_id,added_at,added_by,added_by_label) VALUES(?,?,?,?,?)""",
                [(identity, department, now, actor, label) for department in added])
            connection.executemany("""UPDATE device_assignment_departments
                SET removed_at=?,removed_by=?,removed_by_label=?
                WHERE assignment_id=? AND department_id=? AND removed_at IS NULL""",
                [(now, actor, label, identity, department) for department in removed])
            connection.execute('UPDATE inventory_devices SET revision=revision+1 WHERE id=?', (device_id,))
            revision += 1
            record_actor_event(connection, actor, kind='Device', action='Updated', label=device_id,
                reason='Device Departments changed', fields=['Assignment'],
                after=dict(assignmentId=identity, addedDepartmentIds=added, removedDepartmentIds=removed))
        connection.commit()
        return dict(assignmentId=identity, revision=revision, addedDepartmentIds=added, removedDepartmentIds=removed)
    except BaseException:
        connection.rollback()
        raise
