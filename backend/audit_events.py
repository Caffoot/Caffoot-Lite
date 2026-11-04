"""Actor attribution for successful inventory history, without sensitive data.

Store the authenticated account name at the time of the event so history
remains attributable if a user account is subsequently renamed or deleted.
All writers still own their existing transaction and permission boundaries.
"""


def attribute_event(connection, account_id, event):
    row = connection.execute(
        "SELECT username FROM accounts WHERE id=? AND active=1",
        (account_id,),
    ).fetchone()
    if row is None:
        raise PermissionError("Active account required for audited change")
    return {
        **event,
        "actor": row[0],
        "actorId": account_id,
        "outcome": "Succeeded",
    }
