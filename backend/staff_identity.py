"""Link new accounts to independent Staff identities inside the caller's save."""


def link_account_staff(connection, account_id, details=None, *, staff_id=None):
    """Create one directory identity, or link the explicitly selected person.

    This helper never commits. Account creation, the protected login role and
    the Staff link must succeed or roll back together.
    """
    if not connection.in_transaction:
        raise RuntimeError("Account linking requires an active transaction")
    if staff_id is not None:
        updated = connection.execute(
            'UPDATE staff_members SET account_id=? WHERE id=? AND account_id IS NULL',
            (account_id, staff_id))
        if updated.rowcount != 1:
            raise ValueError("Staff Member is missing or already linked")
        return staff_id
    details = details or {}
    return connection.execute(
        'INSERT INTO staff_members(account_id,first_name,last_name,email) VALUES(?,?,?,?) RETURNING id',
        (account_id, details.get('firstName', ''), details.get('lastName', ''),
         details.get('email', ''))).fetchone()[0]
