"""Protected Staff and Department operations, including linked personal details."""
import hashlib
import json
import sqlite3

from backend.audit_events import record_actor_event
from backend.permissions import can_access, _admin, create_user_in_transaction
from backend.profiles import (FIELD_LABELS, read_personal_details, validate_profile_details,
                              write_personal_details)
from backend.staff_identity import (SHARED_PROFILE_FIELDS, fill_shared_profile_blanks,
                                    shared_profile_conflicts, staff_history_revision)
from backend.sessions import session_account

STAFF_FIELDS = {
    'firstName': ('first_name', 100), 'lastName': ('last_name', 100),
    'email': ('email', 254), 'jobTitle': ('job_title', 120),
    'telephone': ('telephone', 100), 'location': ('location', 200),
}


class StaleStaffEdit(FileExistsError):
    """Keep a newer Staff record when an older form is submitted."""


class DuplicateStaffLoginUsername(ValueError):
    """The authorised Staff login save conflicts with an existing username."""


def _staff_revision(connection, record):
    """Identify the saved Staff values without including linked-account details."""
    values = [record['id'], *[record[name] for name in STAFF_FIELDS],
              record['departmentId'], bool(record['active']), staff_history_revision(connection, record['id'])]
    return hashlib.sha256(json.dumps(values, ensure_ascii=False).encode('utf-8')).hexdigest()


def _is_administrator(connection, actor_id):
    try:
        _admin(connection, actor_id)
    except PermissionError:
        return False
    return True


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


def read_staff_member(connection, actor_id, staff_id, *, include_conflicts=True):
    require_directory_access(connection, actor_id, 'Staff Members')
    record = _staff_record(connection, staff_id)
    record['active'] = bool(record['active'])
    record['revision'] = _staff_revision(connection, record)
    if not _is_administrator(connection, actor_id):
        record.pop('accountId')
    elif record['accountId'] is not None:
        account_id = record['accountId']
        record['username'] = connection.execute('SELECT username FROM accounts WHERE id=?', (account_id,)).fetchone()[0]
        if include_conflicts:
            conflicts = shared_profile_conflicts(record, read_personal_details(connection, account_id))
            if conflicts:
                record['profileConflicts'] = conflicts
    return record


def department_has_associations(connection, department_id):
    """Retain Departments referenced currently or in append-only Staff history."""
    if connection.execute('SELECT 1 FROM device_assignment_departments WHERE department_id=? LIMIT 1',
                          (department_id,)).fetchone():
        return True
    if connection.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='it_asset_stock_entries'").fetchone():
        if connection.execute('SELECT 1 FROM it_asset_stock_entries WHERE department_id=? LIMIT 1',(department_id,)).fetchone():
            return True
    if connection.execute('SELECT 1 FROM staff_members WHERE department_id=? LIMIT 1',
                          (department_id,)).fetchone():
        return True
    return connection.execute("""
        SELECT 1 FROM inventory_change_history h, json_each(h.record_json,'$.changes') c
        WHERE json_extract(c.value,'$.kind')='Staff Member' AND
        (json_extract(c.value,'$.before.Department')=? OR json_extract(c.value,'$.after.Department')=?)
        LIMIT 1
    """, (department_id, department_id)).fetchone() is not None


def read_department(connection, actor_id, department_id):
    require_directory_access(connection, actor_id, 'Departments')
    record = _department_record(connection, department_id)
    record['canDelete'] = not department_has_associations(connection, department_id)
    return record


def list_directory(connection, actor_id, section, *, query='', limit=100, offset=0):
    """Search bounded pages, with sign-in names available only to administrators."""
    require_directory_access(connection, actor_id, section)
    query = _text(query, 'search', 100)
    if type(limit) is not int or not 1 <= limit <= 100 or type(offset) is not int or not 0 <= offset <= 1000000:
        raise ValueError('Invalid directory page')
    pattern = '%' + query.replace('!', '!!').replace('%', '!%').replace('_', '!_') + '%'
    if section == 'Staff Members':
        ids = connection.execute("""
            SELECT s.id FROM staff_members s LEFT JOIN departments d ON d.id=s.department_id
            LEFT JOIN accounts a ON a.id=s.account_id AND ?
            WHERE s.first_name||' '||s.last_name LIKE ? ESCAPE '!' OR d.name LIKE ? ESCAPE '!'
               OR a.username LIKE ? ESCAPE '!'
            ORDER BY s.last_name,s.first_name,s.id LIMIT ? OFFSET ?
        """, (_is_administrator(connection, actor_id), pattern, pattern, pattern, limit, offset)).fetchall()
        return [read_staff_member(connection, actor_id, row[0], include_conflicts=False) for row in ids]
    ids = connection.execute("SELECT id FROM departments WHERE name LIKE ? ESCAPE '!' ORDER BY name,id LIMIT ? OFFSET ?", (pattern, limit, offset)).fetchall()
    return [read_department(connection, actor_id, row[0]) for row in ids]


def list_staff_department_choices(connection, actor_id):
    """Expose only linked labels, plus active Department choices for Staff editors."""
    require_directory_access(connection, actor_id, 'Staff Members')
    can_edit = can_access(connection, actor_id, 'Staff Members', edit=True)
    rows = connection.execute("""
        SELECT d.id,d.name,d.archived FROM departments d
        WHERE d.id IN (SELECT department_id FROM staff_members WHERE department_id IS NOT NULL)
           OR (?=1 AND d.archived=0)
        ORDER BY d.name,d.id
    """, (int(can_edit),))
    return [{'id': row[0], 'name': row[1], 'archived': bool(row[2])} for row in rows]


def _validate_staff(payload, *, creating):
    if not isinstance(payload, dict) or not payload or set(payload) - {*STAFF_FIELDS, 'departmentId', 'active', 'login', 'revision', 'resolveProfile'}:
        raise ValueError('Invalid Staff fields')
    if creating:
        if 'revision' in payload:
            raise ValueError('A new Staff Member cannot have a saved revision')
    else:
        revision = payload.get('revision')
        if (not isinstance(revision, str) or len(revision) != 64
                or any(character not in '0123456789abcdef' for character in revision)):
            raise ValueError('Refresh the Staff Member before saving; a valid saved revision is required')
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


def _save_linked_personal_details(connection, actor_id, staff, values, resolutions, *, on_email_change):
    account_id = staff['accountId']
    account = read_personal_details(connection, account_id)
    conflicts = shared_profile_conflicts(staff, account)
    if (not isinstance(resolutions, dict) or resolutions.keys() - conflicts.keys()
            or any(choice not in ('staff', 'account') for choice in resolutions.values())):
        raise ValueError('Select a saved value for each conflict you want to resolve.')
    updated_staff, updated_account = staff.copy(), account.copy()
    fill_shared_profile_blanks(updated_staff, updated_account)
    for field in SHARED_PROFILE_FIELDS:
        if field in resolutions:
            updated_staff[field] = updated_account[field] = conflicts[field][resolutions[field]]
        elif field in values and values[field] != staff[field]:
            if field == 'email':
                _admin(connection, actor_id)
            if field in conflicts:
                message = ('Select which saved value to keep for ' if _is_administrator(connection, actor_id)
                           else 'Contact a Caffoot Lite administrator to reconcile ')
                raise ValueError(message + FIELD_LABELS[field] + '.')
            updated_staff[field] = updated_account[field] = values[field]
        values.pop(field, None)
        if updated_staff[field] != staff[field]:
            values[field] = updated_staff[field]
    write_personal_details(connection, actor_id, account_id, account, updated_account,
                           on_email_change=on_email_change)


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
    try:
        return create_user_in_transaction(connection, actor_id, login['username'], login['password'],
                                          profile, staff_id=staff_id)
    except sqlite3.IntegrityError as exc:
        if (exc.sqlite_errorcode == sqlite3.SQLITE_CONSTRAINT_UNIQUE
                and str(exc) == 'UNIQUE constraint failed: accounts.username'):
            raise DuplicateStaffLoginUsername(
                'This username is already in use. Please choose another username.'
            ) from exc
        raise


def save_staff_member(connection, actor_id, session_token, payload, *, staff_id=None, login_only=False,
                      on_email_change=None):
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
            record_actor_event(connection, actor_id, kind='Staff Member', action='Updated',
                label=staff_id, reason='Staff directory updated', fields=['Caffoot Login'])
        else:
            values = _validate_staff(payload, creating=creating)
            before = {} if creating else _staff_record(connection, staff_id)
            if not creating and payload['revision'] != _staff_revision(connection, before):
                raise StaleStaffEdit('This Staff Member was changed elsewhere. Refresh the current details before editing again.')
            if 'resolveProfile' in payload:
                _admin(connection, actor_id)
            if before.get('accountId') is not None:
                _save_linked_personal_details(connection, actor_id, before, values,
                    payload.get('resolveProfile', {}), on_email_change=on_email_change)
            elif 'resolveProfile' in payload:
                raise ValueError('An existing linked Staff Member is required.')
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
            if department_has_associations(connection, department_id):
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
