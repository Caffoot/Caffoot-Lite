"""Link Staff identities and share approved profile fields in the caller's transaction."""

SHARED_PROFILE_FIELDS = {'firstName': 'first_name', 'lastName': 'last_name', 'email': 'email'}


def read_linked_staff(connection, account_id):
    row = connection.execute(
        'SELECT id,first_name,last_name,email FROM staff_members WHERE account_id=?',
        (account_id,),
    ).fetchone()
    return dict(zip(('id', *SHARED_PROFILE_FIELDS), row)) if row else None


def staff_history_revision(connection, staff_id, *, shared_profile_only=False):
    # Account forms track shared Staff fields. Staff forms track the whole record.
    row = connection.execute("""
        SELECT h.id FROM inventory_change_history h
        WHERE EXISTS (SELECT 1 FROM json_each(h.record_json,'$.changes') c
            WHERE CASE WHEN c.type='object' THEN
                json_extract(c.value,'$.kind')='Staff Member'
                AND json_extract(c.value,'$.label')=?
                AND (NOT ? OR EXISTS (SELECT 1 FROM json_each(c.value,'$.fields') f
                    WHERE f.type='text' AND f.value IN (
                        'first_name','last_name','email',
                        'First Name','Surname','Email Address','Caffoot Login'))) END)
        ORDER BY h.id DESC LIMIT 1
    """, (staff_id, shared_profile_only)).fetchone()
    return row[0] if row else None


def shared_profile_conflicts(staff, account):
    return {
        field: {'staff': staff[field], 'account': account[field]}
        for field in SHARED_PROFILE_FIELDS
        if staff[field] and staff[field] != account[field] and (account[field] or field == 'email')
    }


def fill_shared_profile_blanks(staff, account):
    """Copy a missing name either way, and a saved email to Staff only."""
    for field in SHARED_PROFILE_FIELDS:
        if not staff[field]:
            staff[field] = account[field]
        elif field != 'email' and not account[field]:
            account[field] = staff[field]


def write_shared_staff_details(connection, staff_id, details):
    connection.execute(
        'UPDATE staff_members SET first_name=?,last_name=?,email=? WHERE id=?',
        (*[details[field] for field in SHARED_PROFILE_FIELDS], staff_id),
    )


def link_account_staff(connection, account_id, details=None, *, staff_id=None):
    """Create one directory identity, or link the explicitly selected person.

    This helper never commits. Account creation, the protected login role and
    the Staff link must succeed or roll back together.
    """
    if not connection.in_transaction:
        raise RuntimeError("Account linking requires an active transaction")
    if staff_id is not None:
        updated = connection.execute(
            'UPDATE staff_members SET account_id=? WHERE id=? AND account_id IS NULL AND active=1',
            (account_id, staff_id))
        if updated.rowcount != 1:
            raise ValueError("Staff Member is missing, has left the company or is already linked")
        return staff_id
    details = details or {}
    return connection.execute(
        'INSERT INTO staff_members(account_id,first_name,last_name,email) VALUES(?,?,?,?) RETURNING id',
        (account_id, details.get('firstName', ''), details.get('lastName', ''),
         details.get('email', ''))).fetchone()[0]
