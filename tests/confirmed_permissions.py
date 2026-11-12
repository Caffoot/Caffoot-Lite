"""Configure fictional fixture accounts through the live confirmation service.

Fixtures seed a temporary administrator session instead of storing credentials
for every test. This helper is used only by test fixtures.
"""
import secrets
import time

from backend.permissions import _admin, _target, set_permission as confirm_permission
from backend.roles import preview_role_change
from backend.sessions import _digest


def set_permission(connection, actor_id, target_id, section, level):
    """Use an explicit preview and confirmation when preparing test account access."""
    _admin(connection, actor_id)
    _target(connection, target_id)
    current = connection.execute(
        "SELECT level FROM account_permission_overrides WHERE account_id=? AND section=?",
        (target_id, section),
    ).fetchone()
    if (current[0] if current else None) == level:
        return
    token = secrets.token_hex(32)
    now = int(time.time())
    connection.execute("INSERT INTO account_sessions VALUES(?,?,?,?)", (_digest(token), actor_id, now + 60, now))
    connection.commit()
    try:
        action = {"type": "override.set", "userId": target_id, "section": section, "level": level}
        preview = preview_role_change(connection, actor_id, token, action)
        result = confirm_permission(connection, actor_id, target_id, section, level,
                                    session_token=token, proof=preview["proof"])
        if result["status"] != "updated":
            raise AssertionError("Fixture permission confirmation was rejected")
    finally:
        connection.execute("DELETE FROM account_sessions WHERE token_hash=?", (_digest(token),))
        connection.commit()
