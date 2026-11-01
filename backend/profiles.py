"""Optional account profile details and tightly bounded self-service images.

Profile data is in the existing /data SQLite database so normal database backups
retain it. This module never changes login identifiers, account roles or MFA.
"""
import base64
import binascii
import re
import struct
import zlib

MAX_PHOTO_BYTES = 5 * 1024 * 1024
MAX_PHOTO_PIXELS = 4096 * 4096
IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp"}
FIELD_LIMITS = {"firstName": 100, "lastName": 100,
                "emailAddress": 254, "displayName": 120}


def read_profile(connection, account_id):
    """Read only the authenticated account's profile; exclude photograph bytes."""
    row = connection.execute(
        "SELECT first_name,last_name,email_address,display_name,email_verified,"
        "photo_mime FROM account_profiles WHERE account_id=?", (account_id,)
    ).fetchone()
    if row is None:
        return {"firstName": "", "lastName": "", "emailAddress": "",
                "displayName": "", "emailVerified": False, "hasPhoto": False}
    return {"firstName": row[0], "lastName": row[1],
            "emailAddress": row[2], "displayName": row[3],
            "emailVerified": bool(row[4]), "hasPhoto": bool(row[5])}


def _clean_field(field, value):
    if not isinstance(value, str) or len(value) > FIELD_LIMITS[field]:
        raise ValueError("Invalid " + field + " field")
    text = value.strip()
    if any(ord(char) < 32 or ord(char) == 127 for char in text):
        raise ValueError("Control characters are not allowed in profile details")
    if field == "emailAddress" and text:
        # Optional email is not a verified recovery address in this version.
        if not re.fullmatch(r"[^\s@]{1,64}@[^\s@]+\.[^\s@]+", text, re.ASCII):
            raise ValueError("Enter a valid email address")
    return text


def save_profile(connection, account_id, fields):
    """Allow a user to edit only their own optional details, never the username."""
    if not isinstance(fields, dict) or set(fields) != set(FIELD_LIMITS):
        raise ValueError("Invalid personal details request")
    cleaned = {key: _clean_field(key, value) for key, value in fields.items()}
    connection.execute("BEGIN IMMEDIATE")
    try:
        connection.execute(
            "INSERT OR IGNORE INTO account_profiles(account_id) VALUES (?)",
            (account_id,)
        )
        connection.execute(
            "UPDATE account_profiles SET first_name=?,last_name=?,email_address=?,"
            "display_name=?,email_verified=CASE WHEN email_address=? THEN "
            "email_verified ELSE 0 END WHERE account_id=?",
            (cleaned["firstName"], cleaned["lastName"], cleaned["emailAddress"],
             cleaned["displayName"], cleaned["emailAddress"], account_id),
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    return read_profile(connection, account_id)


def _png_dimensions(data):
    if len(data) < 57 or not data.startswith(b"\x89PNG\r\n\x1a\n"):
        return None
    if data[8:16] != b"\x00\x00\x00\x0dIHDR":
        return None
    if zlib.crc32(data[12:29]) != struct.unpack(">I", data[29:33])[0]:
        return None
    # Require the concluding IEND chunk and at least one IDAT data chunk.
    if not data.endswith(b"\x00\x00\x00\x00IEND\xaeB\x60\x82"):
        return None
    if b"IDAT" not in data[33:-12]:
        return None
    return struct.unpack(">II", data[16:24])


def _jpeg_dimensions(data):
    if len(data) < 20 or not data.startswith(b"\xff\xd8\xff") or not data.endswith(b"\xff\xd9"):
        return None
    pos = 2
    while pos + 4 <= len(data):
        if data[pos] != 0xff:
            return None
        while pos < len(data) and data[pos] == 0xff:
            pos += 1
        if pos >= len(data):
            return None
        marker = data[pos]
        pos += 1
        if marker == 0xda:  # Start of the compressed scan.
            return None
        if marker in (0x01,) or 0xd0 <= marker <= 0xd9:
            continue
        if pos + 2 > len(data):
            return None
        size = int.from_bytes(data[pos:pos + 2], "big")
        if size < 2 or pos + size > len(data):
            return None
        if marker in (0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
                      0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf):
            if size < 7:
                return None
            height = int.from_bytes(data[pos + 3:pos + 5], "big")
            width = int.from_bytes(data[pos + 5:pos + 7], "big")
            return width, height
        pos += size
    return None


def _webp_dimensions(data):
    if len(data) < 30 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        return None
    if int.from_bytes(data[4:8], "little") != len(data) - 8:
        return None
    chunk = data[12:16]
    if chunk == b"VP8X" and len(data) >= 30:
        return (int.from_bytes(data[24:27], "little") + 1,
                int.from_bytes(data[27:30], "little") + 1)
    if chunk == b"VP8 " and len(data) >= 30 and data[23:26] == b"\x9d\x01\x2a":
        return (int.from_bytes(data[26:28], "little") & 0x3fff,
                int.from_bytes(data[28:30], "little") & 0x3fff)
    if chunk == b"VP8L" and len(data) >= 25 and data[20] == 0x2f:
        bits = int.from_bytes(data[21:25], "little")
        return ((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
    return None


def _validate_photo(data, media_type):
    if media_type not in IMAGE_TYPES:
        raise ValueError("Only JPG, PNG and WEBP profile images are supported")
    if not 0 < len(data) <= MAX_PHOTO_BYTES:
        raise ValueError("Profile image must be 5 MB or smaller")
    decoder = {"image/png": _png_dimensions,
               "image/jpeg": _jpeg_dimensions,
               "image/webp": _webp_dimensions}[media_type]
    dimensions = decoder(data)
    if not dimensions:
        raise ValueError("Invalid or mismatched profile image")
    width, height = dimensions
    if not (1 <= width <= 4096 and 1 <= height <= 4096
            and width * height <= MAX_PHOTO_PIXELS):
        raise ValueError("Profile image dimensions are too large")


def save_photo(connection, account_id, payload):
    """Validate a bounded raster image, never trust its filename or browser MIME."""
    if not isinstance(payload, dict) or set(payload) != {"mediaType", "contentBase64"}:
        raise ValueError("Invalid profile image request")
    encoded = payload["contentBase64"]
    mime = payload["mediaType"]
    if not isinstance(encoded, str) or len(encoded) > ((MAX_PHOTO_BYTES + 2) // 3) * 4:
        raise ValueError("Profile image must be 5 MB or smaller")
    try:
        data = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error) as exc:
        raise ValueError("Invalid profile image encoding") from exc
    _validate_photo(data, mime)
    connection.execute("BEGIN IMMEDIATE")
    try:
        connection.execute("INSERT OR IGNORE INTO account_profiles(account_id) VALUES (?)",
                           (account_id,))
        connection.execute(
            "UPDATE account_profiles SET photo_bytes=?,photo_mime=? WHERE account_id=?",
            (data, mime, account_id),
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    return read_profile(connection, account_id)


def delete_photo(connection, account_id):
    """Remove only this account's photograph without changing personal details."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        connection.execute(
            "UPDATE account_profiles SET photo_bytes=NULL,photo_mime=NULL WHERE account_id=?",
            (account_id,),
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    return read_profile(connection, account_id)


def read_photo(connection, account_id):
    return connection.execute(
        "SELECT photo_bytes,photo_mime FROM account_profiles WHERE account_id=? "
        "AND photo_bytes IS NOT NULL", (account_id,)
    ).fetchone()
