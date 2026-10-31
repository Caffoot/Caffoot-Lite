"""Published v1.3.3 Access Point import mounting review, detached from storage.

Source order: inspect raw backup, collect explicit choices, apply on a copy,
then run the existing normalisation and integrity review. Cancellation is
represented by not applying choices; no database writes occur here.
"""
import copy

from backend.inventory import RECOGNISED_MOUNTS

AP_TYPES = frozenset(("access point", "ap", "wireless access point"))
AP_CHOICES = (
    "Tabletop / Shelf Mounted", "Ceiling Mounted", "Wall Mounted",
    "Pole Mounted", "Desktop",
)


def find_access_point_mount_conflicts(raw):
    racks = {r.get("id"): r for r in raw["racks"]}
    conflicts = []
    for device in raw["devices"]:
        if str(device.get("type") or "").strip().lower() not in AP_TYPES:
            continue
        mount = device.get("mountType") or (
            "Rack Mounted" if device.get("rackId") else "Desktop"
        )
        if mount in RECOGNISED_MOUNTS and not device.get("rackId"):
            continue
        rack = racks.get(device.get("rackId"))
        conflicts.append({
            "id": device.get("id"), "name": device.get("name"),
            "type": device.get("type"), "mountType": mount,
            "rack": (rack.get("name") if rack else None)
                    or device.get("rackId") or "(none)",
        })
    return conflicts


def apply_access_point_mount_choices(raw, conflicts, choices):
    """Apply all explicitly selected published choices, or reject entirely."""
    if len(choices) != len(conflicts) or any(
        choice not in AP_CHOICES for choice in choices
    ):
        raise ValueError("Select a valid mounting type for every Access Point.")
    candidate = copy.deepcopy(raw)
    for conflict, choice in zip(conflicts, choices):
        device = next(
            (item for item in candidate["devices"]
             if item.get("id") == conflict["id"]), None
        )
        if (device is None or
                str(device.get("type") or "").strip().lower() not in AP_TYPES or
                choice not in RECOGNISED_MOUNTS):
            raise ValueError("Invalid Access Point mounting selection.")
        device.update({
            "mountType": choice, "rackId": "", "face": "front",
            "rackUStart": None, "rackUEnd": None, "rackUHeight": None,
        })
        if str(device.get("location") or "").lower() == "racked":
            device["location"] = "Unknown"
    return candidate
