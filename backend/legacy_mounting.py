"""Detached v1.3.3 legacy computer mounting correction plan.

Mirrors planLegacyComputerMountingCorrections on a deep copy. Proposed
changes always require the existing explicit review and final confirmation.
No persistence or automatic approval.
"""
import copy

from backend.inventory import RECOGNISED_MOUNTS


def plan_legacy_computer_mounting_corrections(raw):
    candidate = copy.deepcopy(raw)
    changes = []
    for device in candidate["devices"]:
        mount = device.get("mountType") or (
            "Rack Mounted" if device.get("rackId") else "Desktop"
        )
        legacy_computer = str(device.get("type") or "").strip().lower() in (
            "desktop", "laptop", "tablet"
        )
        no_rack_position = (
            not device.get("rackId") and
            all(device.get(key) is None for key in (
                "rackUStart", "rackUEnd", "rackUHeight"
            ))
        )
        legacy_location = (
            legacy_computer and no_rack_position and
            device.get("location") == "Racked" and
            mount != "Rack Mounted" and mount in RECOGNISED_MOUNTS
        )
        orphaned_mount = (
            legacy_computer and no_rack_position and mount == "Rack Mounted"
        )
        incompatible_rack_mount = (
            legacy_computer and (
                mount == "Rack Mounted" or bool(device.get("rackId"))
            )
        )
        if not (legacy_location or orphaned_mount or incompatible_rack_mount):
            continue
        proposed_mount = mount if legacy_location else "Desktop"
        rack = next((r for r in candidate["racks"]
                     if r.get("id") == device.get("rackId")), None)
        changes.append({
            "id": device.get("id"), "name": device.get("name"),
            "type": device.get("type"), "mountType": mount,
            "location": device.get("location"),
            "proposedMountType": proposed_mount,
            "rack": ((rack.get("name") if rack else None) or
                     device.get("rackId") or "(none)"),
            "startU": device.get("rackUStart"), "endU": device.get("rackUEnd"),
        })
        device.update({
            "mountType": proposed_mount, "location": "Unknown",
            "rackId": "", "face": "front", "rackUStart": None,
            "rackUEnd": None, "rackUHeight": None,
        })
    return candidate, changes
