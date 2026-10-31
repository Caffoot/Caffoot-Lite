"""TOTP enrolment primitives for the approved Next account/MFA workflow.

No account state or HTTP endpoints are exposed here. An enrolment is not
active until a code is verified by the eventual authenticated account service.
"""
import base64
import hashlib
import hmac
import secrets
import struct
import time
from urllib.parse import urlencode

ISSUER = "Caffoot Lite"
PERIOD = 30
DIGITS = 6


def new_secret():
    """Generate a unique 160-bit authenticator secret."""
    return base64.b32encode(secrets.token_bytes(20)).decode("ascii").rstrip("=")


def _secret_bytes(secret):
    if not isinstance(secret, str) or not secret:
        raise ValueError("Invalid MFA secret")
    clean = secret.strip().upper()
    try:
        decoded = base64.b32decode(clean + "=" * (-len(clean) % 8), casefold=False)
    except (ValueError, base64.binascii.Error) as exc:
        raise ValueError("Invalid MFA secret") from exc
    if len(decoded) < 20:
        raise ValueError("Invalid MFA secret")
    return decoded


def provisioning_uri(username, secret):
    """Standard otpauth URI; a QR renderer will encode this exact value."""
    if not isinstance(username, str) or not username.strip():
        raise ValueError("Username is required")
    _secret_bytes(secret)
    from urllib.parse import quote
    label = quote(f"{ISSUER}:{username}", safe="")
    query = urlencode({
        "secret": secret.upper(), "issuer": ISSUER,
        "algorithm": "SHA1", "digits": DIGITS, "period": PERIOD,
    })
    return f"otpauth://totp/{label}?{query}"


def code_at(secret, timestamp):
    """RFC 6238 SHA1 TOTP with six digits and a 30-second period."""
    if timestamp < 0:
        raise ValueError("Invalid time")
    counter = int(timestamp // PERIOD)
    digest = hmac.new(
        _secret_bytes(secret), struct.pack(">Q", counter), hashlib.sha1
    ).digest()
    offset = digest[-1] & 15
    number = struct.unpack(">I", digest[offset:offset + 4])[0] & 0x7fffffff
    return f"{number % (10 ** DIGITS):0{DIGITS}d}"


def verify_code(secret, supplied, *, timestamp=None, window=1):
    """Accept adjacent time steps for clock drift; reject malformed input."""
    if not isinstance(supplied, str) or len(supplied) != DIGITS or not supplied.isascii() or not supplied.isdigit():
        return False
    if timestamp is None:
        timestamp = time.time()
    if timestamp < 0 or window not in (0, 1):
        raise ValueError("Invalid MFA verification parameters")
    step = int(timestamp // PERIOD)
    return any(
        hmac.compare_digest(code_at(secret, (step + shift) * PERIOD), supplied)
        for shift in range(-window, window + 1) if step + shift >= 0
    )
