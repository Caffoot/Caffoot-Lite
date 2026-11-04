"""Actor attribution for successful inventory history, without sensitive data.

Store the authenticated account name at the time of the event so history
remains attributable if a user account is subsequently renamed or deleted.
All writers still own their existing transaction and permission boundaries.
"""

from datetime import datetime, timezone
import json

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


def record_actor_event(connection, actor_id, *, kind, action, label,
                       reason, fields=(), before=None, after=None):
    """Append one sanitised, attributable security/account event.

    Call only inside an already-authorised mutation transaction. Passing
    safe, explicit field/value details is the caller's responsibility.
    Never pass passwords, MFA values, tokens or secret-bearing objects.
    """
    change = {
        "kind": str(kind), "action": str(action),
        "label": str(label), "fields": list(fields),
    }
    if before is not None:
        change["before"] = before
    if after is not None:
        change["after"] = after
    event = {
        "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "reason": str(reason), "changes": [change], "omitted": 0,
    }
    connection.execute(
        "INSERT INTO inventory_change_history(record_json) VALUES(?)",
        (json.dumps(attribute_event(connection, actor_id, event), ensure_ascii=False),),
    )
