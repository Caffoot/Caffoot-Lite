"""Actor attribution for successful inventory history, without sensitive data.

Store the authenticated account name at the time of the event so history
remains attributable if a user account is subsequently renamed or deleted.
All writers still own their existing transaction and permission boundaries.
"""

from datetime import datetime, timezone
import json

# Only simple, approved inventory identifiers and placement properties may be
# retained as before/after values. Notes, passwords, credentials, arbitrary
# extension properties and nested objects are deliberately never copied.
_DEVICE_DIFFERENCE_FIELDS = frozenset((
    "name", "type", "status", "location", "manufacturer", "model",
    "assetTag", "serialNumber", "mountType", "rackId", "rackUStart",
    "rackUEnd", "rackUHeight", "face", "rackShelfAccessoryId", "virtualHostId",
    "virtualPlatform", "primaryIp", "ipReserved",
))
# Restrict new IPAM/Rack before-and-after snapshots to structural identifiers.
# Exclude notes, descriptions, passwords, private data and arbitrary extensions.
_INVENTORY_DIFFERENCE_FIELDS = {
    "ipAllocations": frozenset(("status", "deviceId", "reservedForDeviceId")),
    "subnets": frozenset(("name", "kind", "cidr", "parentId", "gateway", "vlan", "purpose")),
    "vlans": frozenset(("name", "vlanId", "parentId")),
    "racks": frozenset(("name", "heightU", "location")),
    "rackAccessories": frozenset(("type", "rackId", "face", "startU", "heightU")),
}


_UNSAFE = object()


def _safe_audit_value(value):
    if value is None or isinstance(value, bool):
        return value
    if type(value) is int and -1000000000 < value < 1000000000:
        return value
    if isinstance(value, str) and len(value) <= 160 and all(
        ord(character) >= 32 and ord(character) != 127 for character in value
    ):
        return value
    return _UNSAFE


def safe_device_differences(before, after):
    """Bounded, non-sensitive before/after data for updated device fields."""
    if not isinstance(before, dict) or not isinstance(after, dict):
        return {}
    older, newer = {}, {}
    for name in sorted(_DEVICE_DIFFERENCE_FIELDS):
        prior = before.get(name)
        current = after.get(name)
        if prior == current:
            continue
        safe_prior, safe_current = _safe_audit_value(prior), _safe_audit_value(current)
        if safe_prior is _UNSAFE or safe_current is _UNSAFE:
            continue
        older[name], newer[name] = safe_prior, safe_current
    # Record only the named OS fields, never the surrounding details or licence data.
    previous_details = before.get("typeDetails") if isinstance(before.get("typeDetails"), dict) else {}
    current_details = after.get("typeDetails") if isinstance(after.get("typeDetails"), dict) else {}
    for key, label in (("softwarePlatform", "Operating System"),
                       ("softwareVersion", "OS / Platform Version")):
        prior, current = previous_details.get(key), current_details.get(key)
        if prior == current:
            continue
        safe_prior, safe_current = _safe_audit_value(prior), _safe_audit_value(current)
        if safe_prior is not _UNSAFE and safe_current is not _UNSAFE:
            older[label], newer[label] = safe_prior, safe_current
    return {"before": older, "after": newer} if older else {}



def safe_inventory_differences(before, after, collection):
    """Safe structural before/after details for approved IPAM and Rack changes.

    Omit fields with unsafe, complex or excessively long values.  A record's
    private notes and arbitrary extra properties are never captured, even for
    full administrators.
    """
    allowed = _INVENTORY_DIFFERENCE_FIELDS.get(collection)
    if allowed is None or not isinstance(before, dict) or not isinstance(after, dict):
        return {}
    older, newer = {}, {}
    for key in sorted(allowed):
        old_value, new_value = before.get(key), after.get(key)
        if old_value == new_value:
            continue
        previous = _safe_audit_value(old_value)
        current = _safe_audit_value(new_value)
        if previous is _UNSAFE or current is _UNSAFE:
            continue
        older[key] = previous
        newer[key] = current
    return {"before": older, "after": newer} if older else {}


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
