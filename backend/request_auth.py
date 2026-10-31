"""Authenticated request boundary for the future Next HTTP endpoints.

Keeps the HTTP handler thin: identity always comes from a verified cookie,
not caller-supplied account IDs. No inventory or account routes are exposed yet.
"""
import hashlib
import hmac

from backend.http_security import (
    check_csrf, read_session_cookie, require_same_origin,
)
from backend.login_throttle import LoginThrottle
from backend.sessions import (
    login_session, logout_session, session_account,
)

THROTTLE = LoginThrottle()


def login(connection, peer, username, password, *, mfa_code=None, now=None):
    """Throttle invalid credentials; return a session token or None."""
    if not isinstance(username, str) or not username.strip():
        return None
    if not THROTTLE.allowed(peer, username):
        return None
    token = login_session(
        connection, username, password, mfa_code=mfa_code, now=now
    )
    if token is None:
        THROTTLE.failed(peer, username)
    else:
        THROTTLE.succeeded(peer, username)
    return token


def csrf_for_session(token):
    """Derive a per-session request proof without persisting another secret.

    A client can obtain this proof only from an authenticated same-origin
    response. Never expose it in a URL or log.
    """
    if not isinstance(token, str) or len(token) != 64:
        return None
    try:
        raw = bytes.fromhex(token)
    except ValueError:
        return None
    return hmac.new(raw, b"caffoot-next-csrf-v1", hashlib.sha256).hexdigest()


def authenticated_account(connection, cookie_header, *, now=None):
    token = read_session_cookie(cookie_header)
    if token is None:
        return None
    return session_account(connection, token, now=now)


def authorised_mutation(connection, cookie_header, origin, allowed_origin,
                        csrf_header, *, now=None):
    """Require active session, matching origin and session-bound CSRF proof."""
    token = read_session_cookie(cookie_header)
    if token is None or not require_same_origin(origin, allowed_origin):
        return None
    if not check_csrf(csrf_for_session(token), csrf_header):
        return None
    return session_account(connection, token, now=now)


def logout(connection, cookie_header, origin, allowed_origin, csrf_header,
           *, now=None):
    """Revoke only a session whose owner supplied the correct CSRF proof."""
    account_id = authorised_mutation(
        connection, cookie_header, origin, allowed_origin, csrf_header, now=now
    )
    if account_id is None:
        return False
    logout_session(connection, read_session_cookie(cookie_header))
    return True


def authorised_inventory_import(connection, cookie_header, origin,
                                allowed_origin, csrf_header, *, now=None):
    """Require a verified session and edit access to every inventory section.

    Returns the authenticated account ID or None. This does not approve an
    import, validate its contents, or write to the database.
    """
    from backend.permissions import can_replace_inventory

    account_id = authorised_mutation(
        connection, cookie_header, origin, allowed_origin, csrf_header, now=now
    )
    if account_id is None or not can_replace_inventory(connection, account_id):
        return None
    return account_id
