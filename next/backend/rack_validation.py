"""Detached rack-import conflict diagnostics from published Caffoot Lite v1.3.3.

Mirrors findRackImportConflicts. Does not approve or persist imports.
Run only after published normalisation and integrity validation are complete.
"""
import math

ACCESSORY_TYPES = frozenset((
    "blank", "patch", "brush", "cable", "shelf", "pdu_horizontal",
    "ventilation", "fan_tray", "environmental_sensor",
    "pdu_vertical", "cable_vertical",
))
VERTICAL_TYPES = frozenset(("pdu_vertical", "cable_vertical"))


def _number(value):
    """Approximate JavaScript Number() for rack-position fields."""
    if value is None:
        return 0.0
    if isinstance(value, bool):
        return float(value)
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        if not value.strip():
            return 0.0
        try:
            return float(value)
        except ValueError:
            return math.nan
    return math.nan


def _integer(value):
    number = _number(value)
    return math.isfinite(number) and number.is_integer()


def _label(record, prefix):
    return prefix + " " + str(record.get("name") or record.get("id") or "(unnamed)")


def find_rack_import_conflicts(candidate):
    """Return source-compatible conflict messages without mutating candidate."""
    issues = []
    occupied = {}
    ids = set()
    racks = {rack["id"]: rack for rack in candidate["racks"]}

    def place(label, rack_id, face, start, height, rail):
        rack = racks.get(rack_id)
        if rack is None:
            issues.append(label + " references a missing rack.")
            return
        limit = _number(rack.get("heightU"))
        if (not _integer(rack.get("heightU")) or limit < 1 or
                not _integer(start) or not _integer(height) or
                _number(height) < 1 or _number(start) < 1 or
                _number(start) + _number(height) - 1 > limit):
            issues.append(label + " has an invalid rack U position.")
            return
        if face not in ("front", "rear"):
            issues.append(label + " has an invalid rack face.")
            return
        key = (rack_id, face, rail)
        positions = occupied.setdefault(key, [])
        start_number = _number(start)
        end = start_number + _number(height) - 1
        collision = next((p for p in positions
                          if start_number <= p[1] and end >= p[0]), None)
        if collision:
            issues.append(label + " overlaps " + collision[2] + ".")
        positions.append((start_number, end, label))

    for device in candidate["devices"]:
        if not device.get("rackId"):
            continue
        place(_label(device, "Device"), device["rackId"],
              device.get("face") or "front", device.get("rackUStart"),
              device.get("rackUHeight"), "horizontal")

    accessories = candidate.get("rackAccessories", [])
    for accessory in accessories if isinstance(accessories, list) else []:
        if not isinstance(accessory, dict):
            issues.append("Backup contains an invalid rack accessory record.")
            continue
        label = _label(accessory, "Accessory")
        identifier = accessory.get("id")
        if not identifier or identifier in ids:
            issues.append(label + " has a missing or duplicate ID.")
        ids.add(identifier)
        kind = accessory.get("type")
        if kind not in ACCESSORY_TYPES:
            issues.append(label + " has an unsupported accessory type.")
            continue
        vertical = kind in VERTICAL_TYPES
        if vertical and accessory.get("side") not in ("left", "right"):
            issues.append(label + " has an invalid side rail.")
            continue
        place(label, accessory.get("rackId"), accessory.get("face"),
              accessory.get("startU"), accessory.get("heightU"),
              "rail-" + accessory["side"] if vertical else "horizontal")
    return issues
