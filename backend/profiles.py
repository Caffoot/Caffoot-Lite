"""Authorised optional account profiles held in the existing SQLite data store.

No profile field changes an account's sign-in identifier, roles, permissions or MFA.
Profile photographs are private user data, never static/public assets.
"""
import hashlib
import json
import re
import struct
from backend.audit_events import record_actor_event
from backend.staff_identity import (
    SHARED_PROFILE_FIELDS, fill_shared_profile_blanks, read_linked_staff,
    shared_profile_conflicts, staff_history_revision, write_shared_staff_details,
)

MAX_PHOTO_BYTES = 5 * 1024 * 1024
FIELD_LIMITS = {"firstName": 100, "lastName": 100, "displayName": 120, "email": 254}
FIELD_LABELS = {"firstName": "First Name", "lastName": "Surname",
                "displayName": "Display Name", "email": "Email Address"}
MIME_TYPES = frozenset(("image/jpeg", "image/png", "image/webp"))
_EMAIL = re.compile(r"^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$", re.UNICODE)


def _authorise(connection, actor_id, target_id):
    """A profile belongs to its active owner, or a verified administrator."""
    actor = connection.execute(
        "SELECT active,is_admin,mfa_confirmed FROM accounts WHERE id=?",
        (actor_id,),
    ).fetchone()
    target = connection.execute(
        "SELECT username FROM accounts WHERE id=?",
        (target_id,),
    ).fetchone()
    if not actor or not actor[0]:
        raise PermissionError("Active account required")
    if actor_id != target_id and (not actor[1] or not actor[2]):
        raise PermissionError("Administrator access required")
    if not target:
        raise ValueError("Account not found")
    return target[0]


def read_personal_details(connection, account_id):
    row = connection.execute(
        "SELECT first_name,last_name,display_name,email,email_verified,"
        "photo_mime FROM account_profiles WHERE account_id=?",
        (account_id,),
    ).fetchone()
    first, last, display, email, verified, mime = row or ("", "", "", "", 0, None)
    return {
        "firstName": first, "lastName": last,
        "displayName": display, "email": email,
        "emailVerified": bool(verified), "hasPhoto": bool(mime),
    }


class StaleProfileEdit(ValueError):
    """Reject a save from an account profile opened before a newer edit."""


def _profile_revision(connection, account_id, username, details, staff):
    history = connection.execute("""
        SELECT h.id FROM inventory_change_history h
        WHERE json_extract(h.record_json,'$.reason')='Personal details updated'
          AND EXISTS (SELECT 1 FROM json_each(h.record_json,'$.changes') c
            WHERE CASE WHEN c.type='object' THEN
                json_extract(c.value,'$.kind')='Account'
                AND json_extract(c.value,'$.label')=? END)
        ORDER BY h.id DESC LIMIT 1
    """, (username,)).fetchone()
    values = [account_id, [details[field] for field in FIELD_LIMITS],
              staff, staff_history_revision(connection, staff['id']) if staff else None,
              history[0] if history else None]
    return hashlib.sha256(json.dumps(values, ensure_ascii=False).encode('utf-8')).hexdigest()


def read_profile(connection, actor_id, target_id=None):
    target_id = actor_id if target_id is None else target_id
    username = _authorise(connection, actor_id, target_id)
    details = read_personal_details(connection, target_id)
    staff = read_linked_staff(connection, target_id)
    return {**details, "username": username,
            "revision": _profile_revision(connection, target_id, username, details, staff)}


def validate_profile_details(details):
    if not isinstance(details, dict) or set(details) != set(FIELD_LIMITS):
        raise ValueError("Personal details must contain the four approved fields")
    validated = {}
    for name, limit in FIELD_LIMITS.items():
        value = details[name]
        if (not isinstance(value, str) or len(value) > limit or
                any(ord(char) < 32 or ord(char) == 127 for char in value)):
            raise ValueError("Invalid personal detail: " + name)
        validated[name] = value.strip()
    if validated["email"] and not _EMAIL.fullmatch(validated["email"]):
        raise ValueError("Enter a valid email address")
    return validated


def write_personal_details(connection, actor_id, target_id, before, values, *, on_email_change=None):
    """Use the account email and proof rules inside either profile save."""
    changed = [FIELD_LABELS[field] for field in FIELD_LIMITS if before[field] != values[field]]
    if not changed:
        return
    email_changed = before['email'] != values['email']
    if email_changed and on_email_change:
        on_email_change(connection, target_id)
    connection.execute(
        "INSERT INTO account_profiles(account_id,first_name,last_name,"
        "display_name,email,email_verified) VALUES(?,?,?,?,?,0) "
        "ON CONFLICT(account_id) DO UPDATE SET "
        "first_name=excluded.first_name,last_name=excluded.last_name,"
        "display_name=excluded.display_name,email=excluded.email,"
        "email_verified=CASE WHEN account_profiles.email=excluded.email "
        "THEN account_profiles.email_verified ELSE 0 END",
        (target_id, *(values[field] for field in FIELD_LIMITS)),
    )
    if email_changed:
        connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (target_id,))
    if actor_id is not None:
        username = connection.execute("SELECT username FROM accounts WHERE id=?", (target_id,)).fetchone()[0]
        record_actor_event(connection, actor_id, kind="Account", action="Updated",
                           label=username, reason="Personal details updated", fields=changed)


def reconcile_saved_staff_profiles(connection):
    """Fill safe blanks on start-up or restore, including databases already at schema 29."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        for account_id, in connection.execute("""
            SELECT s.account_id FROM staff_members s
            LEFT JOIN account_profiles p ON p.account_id=s.account_id
            WHERE s.account_id IS NOT NULL AND (
                ((s.first_name='' OR coalesce(p.first_name,'')='') AND s.first_name<>coalesce(p.first_name,'')) OR
                ((s.last_name='' OR coalesce(p.last_name,'')='') AND s.last_name<>coalesce(p.last_name,'')) OR
                (s.email='' AND p.email<>''))
        """).fetchall():
            staff = read_linked_staff(connection, account_id)
            account = read_personal_details(connection, account_id)
            updated_staff, updated_account = staff.copy(), account.copy()
            fill_shared_profile_blanks(updated_staff, updated_account)
            if updated_staff != staff:
                write_shared_staff_details(connection, staff['id'], updated_staff)
            write_personal_details(connection, None, account_id, account, updated_account)
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def save_profile(connection, actor_id, details, target_id=None, *, on_email_change=None):
    target_id = actor_id if target_id is None else target_id
    revision = details.get('revision') if isinstance(details, dict) else None
    if isinstance(details, dict) and 'revision' in details:
        if not isinstance(revision, str) or not re.fullmatch('[0-9a-f]{64}', revision):
            raise ValueError('Refresh your personal details before saving.')
        details = {field: value for field, value in details.items() if field != 'revision'}
    values = validate_profile_details(details)
    connection.execute("BEGIN IMMEDIATE")
    try:
        username = _authorise(connection, actor_id, target_id)
        before = read_personal_details(connection, target_id)
        staff = read_linked_staff(connection, target_id)
        if revision is not None and revision != _profile_revision(connection, target_id, username, before, staff):
            raise StaleProfileEdit('Personal details changed elsewhere. Reopen the profile and review the current values.')
        if staff:
            conflicts = shared_profile_conflicts(staff, before)
            changed_conflicts = [FIELD_LABELS[field] for field in conflicts if before[field] != values[field]]
            if changed_conflicts:
                raise ValueError('Contact a Caffoot Lite administrator to reconcile ' + ', '.join(changed_conflicts) + '.')
            updated_staff, updated_account = staff.copy(), before.copy()
            fill_shared_profile_blanks(updated_staff, updated_account)
            for field in SHARED_PROFILE_FIELDS:
                if values[field] != before[field]:
                    updated_staff[field] = updated_account[field] = values[field]
            changed_staff = [field for field in SHARED_PROFILE_FIELDS if updated_staff[field] != staff[field]]
            if changed_staff:
                write_shared_staff_details(connection, staff['id'], updated_staff)
                record_actor_event(connection, actor_id, kind='Staff Member', action='Updated',
                                   label=staff['id'], reason='Shared personal details updated',
                                   fields=[FIELD_LABELS[field] for field in changed_staff])
            values.update({field: updated_account[field] for field in SHARED_PROFILE_FIELDS})
        write_personal_details(connection, actor_id, target_id, before, values,
                               on_email_change=on_email_change)
        result = read_profile(connection, actor_id, target_id)
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    return result


def _check_dimensions(width, height):
    return 0 < width <= 4096 and 0 < height <= 4096 and width * height <= 16_777_216


def _jpeg_dimensions(data):
    if not (data.startswith(b"\xff\xd8") and data.endswith(b"\xff\xd9")):
        return None
    offset = 2
    while offset + 4 < len(data):
        if data[offset] != 0xff:
            return None
        while offset < len(data) and data[offset] == 0xff:
            offset += 1
        if offset >= len(data):
            return None
        marker = data[offset]
        offset += 1
        if marker in (0xd8, 0xd9, 0x01, *range(0xd0, 0xd8)):
            continue
        if offset + 2 > len(data):
            return None
        length = int.from_bytes(data[offset:offset + 2], "big")
        if length < 2 or offset + length > len(data):
            return None
        if marker in (0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
                      0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf):
            if length < 7:
                return None
            return (int.from_bytes(data[offset + 3:offset + 5], "big"),
                    int.from_bytes(data[offset + 5:offset + 7], "big"))
        if marker == 0xda:
            return None  # A valid image must declare dimensions before the scan.
        offset += length
    return None


def _image_dimensions(mime, data):
    if mime == "image/png":
        if (len(data) < 45 or not data.startswith(b"\x89PNG\r\n\x1a\n")
                or data[12:16] != b"IHDR" or data[8:12] != b"\x00\x00\x00\r"
                or data[-8:-4] != b"IEND"):
            return None
        return struct.unpack(">II", data[16:24])
    if mime == "image/jpeg":
        return _jpeg_dimensions(data)
    if mime == "image/webp":
        if (len(data) < 30 or data[:4] != b"RIFF" or data[8:12] != b"WEBP"
                or int.from_bytes(data[4:8], "little") > len(data) - 8):
            return None
        kind = data[12:16]
        if kind == b"VP8X":
            return (1 + int.from_bytes(data[24:27], "little"),
                    1 + int.from_bytes(data[27:30], "little"))
        if kind == b"VP8L" and data[20] == 0x2f:
            bits = int.from_bytes(data[21:25], "little")
            return ((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
        if kind == b"VP8 ":
            idx = data.find(b"\x9d\x01\x2a", 20, min(len(data), 48))
            if idx >= 0 and len(data) >= idx + 7:
                return (int.from_bytes(data[idx + 3:idx + 5], "little") & 0x3fff,
                        int.from_bytes(data[idx + 5:idx + 7], "little") & 0x3fff)
    return None


def save_profile_photo(connection, actor_id, mime, data, target_id=None):
    target_id = actor_id if target_id is None else target_id
    if (mime not in MIME_TYPES or not isinstance(data, bytes)
            or not 0 < len(data) <= MAX_PHOTO_BYTES):
        raise ValueError("Upload a JPG, PNG or WEBP image up to 5 MB")
    dimensions = _image_dimensions(mime, data)
    if dimensions is None or not _check_dimensions(*dimensions):
        raise ValueError("Invalid profile image or image dimensions")
    connection.execute("BEGIN IMMEDIATE")
    try:
        username = _authorise(connection, actor_id, target_id)
        connection.execute(
            "INSERT INTO account_profiles(account_id,photo_mime,photo_data) "
            "VALUES(?,?,?) ON CONFLICT(account_id) DO UPDATE SET "
            "photo_mime=excluded.photo_mime,photo_data=excluded.photo_data",
            (target_id, mime, data),
        )
        record_actor_event(
            connection, actor_id, kind="Account", action="Updated",
            label=username, reason="Profile image changed",
            fields=["Profile Image"],
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def read_profile_photo(connection, actor_id, target_id=None):
    target_id = actor_id if target_id is None else target_id
    _authorise(connection, actor_id, target_id)
    return connection.execute(
        "SELECT photo_mime,photo_data FROM account_profiles WHERE account_id=?",
        (target_id,),
    ).fetchone()


def remove_profile_photo(connection, actor_id, target_id=None):
    target_id = actor_id if target_id is None else target_id
    connection.execute("BEGIN IMMEDIATE")
    try:
        username = _authorise(connection, actor_id, target_id)
        had_photo = connection.execute(
            "SELECT photo_mime FROM account_profiles WHERE account_id=?",
            (target_id,),
        ).fetchone()
        connection.execute(
            "UPDATE account_profiles SET photo_mime=NULL,photo_data=NULL "
            "WHERE account_id=?",
            (target_id,),
        )
        if had_photo and had_photo[0]:
            record_actor_event(
                connection, actor_id, kind="Account", action="Updated",
                label=username, reason="Profile image removed",
                fields=["Profile Image"],
            )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
