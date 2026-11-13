"""Durable organisation-wide feature choices, separate from inventory settings."""
from backend.audit_events import record_actor_event
from backend.permissions import _admin
from backend.sessions import session_account

FEATURES = ('devices', 'ipam', 'racks', 'suppliers', 'equipment_lifecycle')
AVAILABLE_FEATURES = frozenset(('devices', 'ipam', 'racks'))


def read_feature_settings(connection, account_id):
    """Return saved choices only to an active, MFA-enrolled administrator."""
    _admin(connection, account_id)
    return {feature: bool(enabled) for feature, enabled in connection.execute(
        "SELECT feature,enabled FROM organisation_features ORDER BY feature"
    )}


def save_feature_setting(connection, account_id, session_token, payload):
    """Save one confirmed choice and its audit event together.

    Recheck the session and administrator after obtaining the write lock, so a
    waiting request cannot use access that was revoked by another administrator.
    """
    connection.execute("BEGIN IMMEDIATE")
    try:
        if session_account(connection, session_token) != account_id:
            raise PermissionError("Verified administrator session required")
        _admin(connection, account_id)
        if (not isinstance(payload, dict)
                or set(payload) not in ({'feature', 'enabled'},
                                       {'feature', 'enabled', 'confirmDisable'})
                or not isinstance(payload['feature'], str)
                or payload['feature'] not in FEATURES
                or type(payload['enabled']) is not bool
                or ('confirmDisable' in payload and type(payload['confirmDisable']) is not bool)):
            raise ValueError("Invalid feature setting")
        feature, enabled = payload['feature'], payload['enabled']
        if feature not in AVAILABLE_FEATURES:
            raise ValueError("This feature is unavailable until Stage 4")
        if not enabled and payload.get('confirmDisable') is not True:
            raise ValueError("Disabling a feature requires confirmation")
        row = connection.execute(
            "SELECT enabled FROM organisation_features WHERE feature=?", (feature,)
        ).fetchone()
        if row is None:
            raise ValueError("Feature settings are incomplete")
        if bool(row[0]) != enabled:
            connection.execute(
                "UPDATE organisation_features SET enabled=? WHERE feature=?",
                (int(enabled), feature),
            )
            record_actor_event(
                connection, account_id, kind="Settings", action="Updated",
                label=feature, reason="Optional feature setting changed",
                fields=["Enabled"], before={"enabled": bool(row[0])},
                after={"enabled": enabled},
            )
        result = read_feature_settings(connection, account_id)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
