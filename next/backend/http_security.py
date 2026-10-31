"""Small HTTP security boundary for Next's eventual authenticated routes.

No routes are enabled by this module. A reverse proxy must provide HTTPS;
the application must not trust client-supplied forwarded-proto headers.
"""
import hmac
import secrets
from http.cookies import SimpleCookie

COOKIE_NAME = "caffoot_session"
CSRF_HEADER = "X-CSRF-Token"


def session_cookie(token, *, secure=True):
    """Issue a host-only, HttpOnly, SameSite=Strict cookie."""
    if not isinstance(token, str) or len(token) != 64:
        raise ValueError("Invalid session token")
    cookie = SimpleCookie()
    cookie[COOKIE_NAME] = token
    morsel = cookie[COOKIE_NAME]
    morsel["path"] = "/"
    morsel["httponly"] = True
    morsel["samesite"] = "Strict"
    if secure:
        morsel["secure"] = True
    return morsel.OutputString()


def clear_session_cookie(*, secure=True):
    cookie = SimpleCookie()
    cookie[COOKIE_NAME] = ""
    morsel = cookie[COOKIE_NAME]
    morsel["path"] = "/"
    morsel["httponly"] = True
    morsel["samesite"] = "Strict"
    morsel["max-age"] = 0
    if secure:
        morsel["secure"] = True
    return morsel.OutputString()


def read_session_cookie(header):
    """Never accept a duplicate cookie name or malformed token."""
    if not isinstance(header, str) or len(header) > 8192:
        return None
    if sum(part.strip().startswith(COOKIE_NAME + "=") for part in header.split(";")) != 1:
        return None
    try:
        cookies = SimpleCookie()
        cookies.load(header)
        value = cookies[COOKIE_NAME].value
    except (KeyError, ValueError):
        return None
    if len(value) != 64:
        return None
    try:
        bytes.fromhex(value)
    except ValueError:
        return None
    return value


def new_csrf_token():
    return secrets.token_hex(32)


def check_csrf(expected, supplied):
    """Double-submit requests require a secret tied to the current session."""
    return (
        isinstance(expected, str)
        and isinstance(supplied, str)
        and len(expected) == 64
        and len(supplied) == 64
        and hmac.compare_digest(expected, supplied)
    )


def require_same_origin(origin, allowed_origin):
    """Reject absent, malformed and cross-origin state-changing requests."""
    if not isinstance(origin, str) or not isinstance(allowed_origin, str):
        return False
    if not origin or not allowed_origin:
        return False
    return hmac.compare_digest(origin, allowed_origin)
