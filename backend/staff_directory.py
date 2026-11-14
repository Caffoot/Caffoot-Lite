"""Protected Staff and flat Department operations, separate from login profiles."""
from backend.audit_events import record_actor_event
from backend.permissions import can_access, _admin, create_user_in_transaction
from backend.profiles import validate_profile_details
from backend.sessions import session_account

STAFF_FIELDS = {
    'firstName': ('first_name', 100), 'lastName': ('last_name', 100),
    'email': ('email', 254), 'jobTitle': ('job_title', 120),
    'telephone': ('telephone', 100), 'location': ('location', 200),
}


def unique_directory_fields(pairs):
    """Reject duplicate request keys rather than choosing one submitted value."""
    values = {}
    for key, value in pairs:
        if key in values:
            raise ValueError('Duplicate directory field')
        values[key] = value
    return values


def require_directory_access(connection, actor_id, section, *, edit=False):
    """Check section rights before revealing whether a record exists."""
    if section not in ('Staff Members', 'Departments') or not can_access(connection, actor_id, section, edit=edit):
        raise PermissionError("Directory access required")


def _text(value, label, limit):
    if (not isinstance(value, str) or len(value) > limit
            or any(ord(char) < 32 or ord(char) == 127 for char in value)):
        raise ValueError('Invalid ' + label)
    return value.strip()


def _staff_record(connection, staff_id):
    row = connection.execute('SELECT id,first_name,last_name,email,job_title,telephone,location,department_id,active,account_id FROM staff_members WHERE id=?', (staff_id,)).fetchone()
    if row is None:
        raise LookupError('Staff Member not found')
    return dict(zip(('id', *STAFF_FIELDS, 'departmentId', 'active', 'accountId'), row))


def _department_record(connection, department_id):
    row = connection.execute('SELECT id,name,archived FROM departments WHERE id=?', (department_id,)).fetchone()
    if row is None:
        raise LookupError('Department not found')
    return dict(id=row[0], name=row[1], archived=bool(row[2]))


def read_staff_member(connection, actor_id, staff_id):
    require_directory_access(connection, actor_id, 'Staff Members')
    record = _staff_record(connection, staff_id)
    record['active'] = bool(record['active'])
    try:
        _admin(connection, actor_id)
    except PermissionError:
        record.pop('accountId')
    return record


def read_department(connection, actor_id, department_id):
    require_directory_access(connection, actor_id, 'Departments')
    return _department_record(connection, department_id)


def list_directory(connection, actor_id, section, *, query='', limit=100, offset=0):
    """Search bounded pages without exposing account names or security data."""
    require_directory_access(connection, actor_id, section)
    query = _text(query, 'search', 100)
    if type(limit) is not int or not 1 <= limit <= 100 or type(offset) is not int or not 0 <= offset <= 1000000:
        raise ValueError('Invalid directory page')
    pattern = '%' + query.replace('!', '!!').replace('%', '!%').replace('_', '!_') + '%'
    if section == 'Staff Members':
        ids = connection.execute("SELECT id FROM staff_members WHERE first_name||' '||last_name LIKE ? ESCAPE '!' ORDER BY last_name,first_name,id LIMIT ? OFFSET ?", (pattern, limit, offset)).fetchall()
        return [read_staff_member(connection, actor_id, row[0]) for row in ids]
    ids = connection.execute("SELECT id FROM departments WHERE name LIKE ? ESCAPE '!' ORDER BY name,id LIMIT ? OFFSET ?", (pattern, limit, offset)).fetchall()
    return [read_department(connection, actor_id, row[0]) for row in ids]


def _validate_staff(payload, *, creating):
    if not isinstance(payload, dict) or not payload or set(payload) - {*STAFF_FIELDS, 'departmentId', 'active', 'login'}:
        raise ValueError('Invalid Staff fields')
    values = {name: _text(value, name, STAFF_FIELDS[name][1])
              for name, value in payload.items() if name in STAFF_FIELDS}
    if creating and (not values.get('firstName') or not values.get('lastName')):
        raise ValueError('First Name and Surname are required')
    if 'email' in values:
        validate_profile_details(dict(firstName='', lastName='', displayName='', email=values['email']))
    if 'active' in payload and type(payload['active']) is not bool:
        raise ValueError('Invalid Staff status')
    if 'departmentId' in payload and payload['departmentId'] is not None:
        if not _text(payload['departmentId'], 'Department', 100):
            raise ValueError('Invalid Department')
    return values


def _create_login(connection, actor_id, staff_id, login):
    _admin(connection, actor_id)
    if not isinstance(login, dict) or set(login) != {'username', 'password'}:
        raise ValueError('Login requires username and password only')
    record = _staff_record(connection, staff_id)
    if record['accountId'] is not None:
        raise FileExistsError('Staff Member already has a login')
    # The combined form has no Display Name field. It remains blank rather
    # than becoming an additional required field or an invented personal name.
    profile = dict(firstName=record['firstName'], lastName=record['lastName'],
                   email=record['email'], displayName='')
    return create_user_in_transaction(connection, actor_id, login['username'], login['password'],
                                      profile, staff_id=staff_id)


def save_staff_member(connection, actor_id, session_token, payload, *, staff_id=None, login_only=False):
    """Save directory changes and an optional administrator-created login together."""
    connection.execute('BEGIN IMMEDIATE')
    try:
        if session_account(connection, session_token) != actor_id:
            raise PermissionError('Verified session required')
        require_directory_access(connection, actor_id, 'Staff Members', edit=True)
        creating = staff_id is None
        if login_only:
            if creating:
                raise ValueError('An existing Staff Member is required')
            _admin(connection, actor_id)
            _create_login(connection, actor_id, staff_id, payload)
        else:
            values = _validate_staff(payload, creating=creating)
            before = {} if creating else _staff_record(connection, staff_id)
            department = payload.get('departmentId', before.get('departmentId'))
            if department is not None and department != before.get('departmentId'):
                if _department_record(connection, department)['archived']:
                    raise FileExistsError('Archived Department cannot receive new Staff associations')
            if creating:
                staff_id = connection.execute('INSERT INTO staff_members DEFAULT VALUES RETURNING id').fetchone()[0]
            columns = {STAFF_FIELDS[name][0]: value for name, value in values.items()}
            for name, column in (('departmentId', 'department_id'), ('active', 'active')):
                if name in payload:
                    columns[column] = payload[name]
            if columns:
                connection.execute('UPDATE staff_members SET ' + ','.join(column+'=?' for column in columns) + ' WHERE id=?', (*columns.values(), staff_id))
            after = _staff_record(connection, staff_id)
            record_actor_event(connection, actor_id, kind='Staff Member',
                action='Created' if creating else 'Updated', label=staff_id,
                reason='Staff directory updated', fields=list(columns),
                before={'Department': before.get('departmentId'), 'Active': before.get('active')},
                after={'Department': after['departmentId'], 'Active': bool(after['active'])})
            if 'login' in payload:
                _create_login(connection, actor_id, staff_id, payload['login'])
        result = read_staff_member(connection, actor_id, staff_id)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def save_department(connection, actor_id, session_token, payload, *, department_id=None, delete=False):
    """Keep memberships and historic Department references through lifecycle changes."""
    connection.execute('BEGIN IMMEDIATE')
    try:
        if session_account(connection, session_token) != actor_id:
            raise PermissionError('Verified session required')
        require_directory_access(connection, actor_id, 'Departments', edit=True)
        creating = department_id is None
        before = {} if creating else _department_record(connection, department_id)
        if not isinstance(payload, dict) or set(payload) - {'name', 'archived'} or (delete and payload):
            raise ValueError('Invalid Department fields')
        if delete:
            if creating:
                raise ValueError('Department is required')
            associated = connection.execute('SELECT 1 FROM staff_members WHERE department_id=? LIMIT 1', (department_id,)).fetchone()
            historic = connection.execute("""
                SELECT 1 FROM inventory_change_history h, json_each(h.record_json,'$.changes') c
                WHERE json_extract(c.value,'$.kind')='Staff Member' AND
                (json_extract(c.value,'$.before.Department')=? OR json_extract(c.value,'$.after.Department')=?) LIMIT 1
            """, (department_id, department_id)).fetchone()
            if associated or historic:
                raise FileExistsError('Department has current or historical associations; archive it instead')
            connection.execute('DELETE FROM departments WHERE id=?', (department_id,))
            result = {'id': department_id, 'deleted': True}
        else:
            name = _text(payload.get('name', before.get('name')), 'Department name', 120)
            if not name:
                raise ValueError('Department name is required')
            archived = payload.get('archived', before.get('archived', False))
            if type(archived) is not bool:
                raise ValueError('Invalid Department status')
            if creating:
                department_id = connection.execute('INSERT INTO departments(name,archived) VALUES(?,?) RETURNING id', (name, archived)).fetchone()[0]
            else:
                connection.execute('UPDATE departments SET name=?,archived=? WHERE id=?', (name, archived, department_id))
            result = _department_record(connection, department_id)
        record_actor_event(connection, actor_id, kind='Department',
            action='Deleted' if delete else ('Created' if creating else 'Updated'),
            label=department_id, reason='Department directory updated', fields=['Department'],
            before={key: before.get(key) for key in ('name', 'archived')},
            after={key: result.get(key) for key in ('name', 'archived')})
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
