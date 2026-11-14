"""One persistent relationship for initial Device allocations and private equipment views."""
import json
from datetime import datetime, timezone

from backend.audit_events import record_actor_event
from backend.permissions import can_access, feature_enabled
from backend.sessions import session_account


def require_assignment_access(connection, actor_id, *, edit=False):
    if not can_access(connection, actor_id, 'Devices', edit=edit):
        raise PermissionError('Devices Edit permission required' if edit else 'Devices Read permission required')


def assignment_recipients(connection, actor_id, *, query='', kind='staff', limit=50):
    """Offer only eligible recipient names and IDs, without directory/contact data."""
    require_assignment_access(connection, actor_id, edit=True)
    if kind not in ('staff', 'department') or not isinstance(query, str) or len(query) > 100:
        raise ValueError('Invalid recipient search')
    if type(limit) is not int or not 1 <= limit <= 100:
        raise ValueError('Invalid recipient limit')
    pattern = '%' + query.replace('!', '!!').replace('%', '!%').replace('_', '!_') + '%'
    if kind == 'staff':
        rows = connection.execute("SELECT id,trim(first_name||' '||last_name) FROM staff_members WHERE active=1 AND trim(first_name||' '||last_name) LIKE ? ESCAPE '!' ORDER BY last_name,first_name,id LIMIT ?", (pattern, limit))
    else:
        rows = connection.execute("SELECT id,name FROM departments WHERE archived=0 AND name LIKE ? ESCAPE '!' ORDER BY name,id LIMIT ?", (pattern, limit))
    return [{'id': row[0], 'label': row[1] or 'Name Not Recorded', 'kind': kind} for row in rows]


def device_assignment_dependency(connection, device_id, record):
    """An initial allocation records a holder; it never declares stock or readiness."""
    if connection.execute('SELECT 1 FROM device_assignments WHERE device_id=? LIMIT 1', (device_id,)).fetchone():
        return 'This Device has assignment history. Return and reissue require the later equipment preparation workflow.'
    if record.get('status', 'Active') != 'Active':
        return 'This Device is not active. Return, preparation and stock workflows are required before it can be issued.'
    if record.get('isVirtual') or record.get('virtualHostId') or record.get('type') in ('Virtual Machine', 'Server - Virtual'):
        return 'Virtual machines cannot be physically allocated as equipment.'
    if record.get('type') not in ('Desktop', 'Laptop', 'Printer'):
        return 'Initial allocation eligibility for this Device type needs product-owner approval.'
    return None


def assignment_device_choices(connection, actor_id, *, query='', limit=100, offset=0):
    require_assignment_access(connection, actor_id, edit=True)
    if not isinstance(query, str) or len(query) > 100 or type(limit) is not int or not 1 <= limit <= 100 or type(offset) is not int or not 0 <= offset <= 1000000:
        raise ValueError('Invalid Device search')
    pattern = '%' + query.replace('!', '!!').replace('%', '!%').replace('_', '!_') + '%'
    rows = connection.execute("SELECT id,record_json,revision FROM inventory_devices WHERE name LIKE ? ESCAPE '!' AND NOT EXISTS (SELECT 1 FROM device_assignments a WHERE a.device_id=inventory_devices.id) ORDER BY name,id LIMIT ? OFFSET ?", (pattern, limit, offset))
    result = []
    for device_id, raw, revision in rows:
        record = json.loads(raw)
        if device_assignment_dependency(connection, device_id, record) is None:
            result.append({'id': device_id, 'name': record['name'], 'type': record.get('type', ''), 'revision': revision})
    return result


def read_assignments(connection, actor_id, *, device_id=None, staff_id=None, department_id=None):
    """Authorised IT views share the same history and current-holder projection."""
    require_assignment_access(connection, actor_id)
    filters = [(key, value) for key, value in (('device_id', device_id), ('staff_id', staff_id), ('department_id', department_id)) if value is not None]
    if len(filters) != 1:
        raise ValueError('One assignment subject is required')
    column, value = filters[0]
    table = {'device_id': 'inventory_devices', 'staff_id': 'staff_members', 'department_id': 'departments'}[column]
    if connection.execute(f'SELECT 1 FROM {table} WHERE id=?', (value,)).fetchone() is None:
        raise LookupError('Assignment subject not found')
    rows = connection.execute(f'''SELECT a.id,a.device_id,d.name,a.staff_id,a.department_id,
        a.recipient_label,a.assigned_at,a.actor_id,a.actor_label,a.ended_at
        FROM device_assignments a JOIN inventory_devices d ON d.id=a.device_id
        WHERE a.{column}=? ORDER BY a.id DESC''', (value,))
    history = [dict(zip(('id', 'deviceId', 'deviceName', 'staffId', 'departmentId', 'recipientLabel', 'assignedAt', 'actorId', 'actorLabel', 'endedAt'), row)) for row in rows]
    result = {'current': [row for row in history if row['endedAt'] is None], 'history': history,
              'canAssign': can_access(connection, actor_id, 'Devices', edit=True)}
    if device_id is not None:
        raw, revision = connection.execute('SELECT record_json,revision FROM inventory_devices WHERE id=?', (device_id,)).fetchone()
        result.update(dependency=device_assignment_dependency(connection, device_id, json.loads(raw)), revision=revision)
    return result


def assign_devices(connection, actor_id, session_token, payload):
    """Validate every selected Device before committing any allocation or audit event."""
    connection.execute('BEGIN IMMEDIATE')
    try:
        if session_account(connection, session_token) != actor_id:
            raise PermissionError('Verified session required')
        require_assignment_access(connection, actor_id, edit=True)
        if not isinstance(payload, dict) or set(payload) != {'recipientKind', 'recipientId', 'devices'}:
            raise ValueError('Invalid assignment fields')
        kind, recipient_id, devices = payload['recipientKind'], payload['recipientId'], payload['devices']
        if kind not in ('staff', 'department') or not isinstance(recipient_id, str) or not recipient_id:
            raise ValueError('Invalid recipient')
        if not isinstance(devices, list) or not 1 <= len(devices) <= 100:
            raise ValueError('Select between 1 and 100 Devices')
        if kind == 'staff':
            recipient = connection.execute("SELECT trim(first_name||' '||last_name),active FROM staff_members WHERE id=?", (recipient_id,)).fetchone()
        else:
            recipient = connection.execute('SELECT name,1-archived FROM departments WHERE id=?', (recipient_id,)).fetchone()
        if not recipient or not recipient[1]:
            raise ValueError('An active Staff Member or non-archived Department is required')
        seen = set()
        for device in devices:
            if (not isinstance(device, dict) or set(device) != {'id', 'revision'}
                    or not isinstance(device['id'], str) or type(device['revision']) is not int
                    or device['revision'] < 0 or device['id'] in seen):
                raise ValueError('Invalid or duplicate Device selection')
            seen.add(device['id'])
            row = connection.execute('SELECT record_json,revision FROM inventory_devices WHERE id=?', (device['id'],)).fetchone()
            if row is None or row[1] != device['revision']:
                raise FileExistsError('Device changed; refresh the selection')
            dependency = device_assignment_dependency(connection, device['id'], json.loads(row[0]))
            if dependency:
                raise FileExistsError(dependency)
            if connection.execute("SELECT 1 FROM device_edit_reservations WHERE device_id=? AND expires_at>strftime('%s','now')", (device['id'],)).fetchone():
                raise FileExistsError('Device is being edited; try again after editing finishes')
        actor_label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor_id,)).fetchone()[0]
        assigned_at = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
        for device in devices:
            connection.execute('''INSERT INTO device_assignments(device_id,staff_id,department_id,recipient_label,assigned_at,actor_id,actor_label)
                VALUES(?,?,?,?,?,?,?)''', (device['id'], recipient_id if kind == 'staff' else None,
                recipient_id if kind == 'department' else None, recipient[0] or 'Name Not Recorded', assigned_at, actor_id, actor_label))
            # The general Device audit contains IDs only, never employee names or contacts.
            record_actor_event(connection, actor_id, kind='Device', action='Assigned', label=device['id'],
                reason='Initial equipment allocation', fields=['Assignment'],
                after={'recipientKind': kind, 'recipientId': recipient_id, 'assignedAt': assigned_at})
        connection.commit()
        return {'assigned': len(devices), 'assignedAt': assigned_at}
    except BaseException:
        connection.rollback()
        raise


def my_equipment(connection, actor_id):
    """Resolve the current login link and membership without accepting a client identity."""
    result = {'assignedToMe': [], 'sharedWithMyDepartment': []}
    if not feature_enabled(connection, 'Devices'):
        return result
    staff = connection.execute('SELECT id,department_id FROM staff_members WHERE account_id=?', (actor_id,)).fetchone()
    if staff is None:
        return result
    rows = connection.execute('''SELECT a.staff_id,a.department_id,d.id,d.record_json,a.assigned_at
        FROM device_assignments a JOIN inventory_devices d ON d.id=a.device_id
        WHERE a.ended_at IS NULL AND (a.staff_id=? OR a.department_id=?) ORDER BY d.name,d.id''', staff)
    for staff_id, department_id, device_id, raw, assigned_at in rows:
        record = json.loads(raw)
        safe = {'id': device_id, 'name': record['name'], 'type': record.get('type', ''),
                'manufacturer': record.get('manufacturer', ''), 'model': record.get('model', ''),
                'assignedAt': assigned_at}
        result['assignedToMe' if staff_id == staff[0] else 'sharedWithMyDepartment'].append(safe)
    return result
