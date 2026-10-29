"""Offline inventory import/projection groundwork for Caffoot Lite Next.

This is NOT the user-facing importer: the published v1.3.3 normalisation,
integrity, review and confirmation workflow must run before any live import.
No HTTP endpoint calls this module. Account/security tables are never touched.
"""
import json
import sqlite3

COLLECTIONS = {
    "devices": "inventory_devices",
    "subnets": "inventory_subnets",
    "vlans": "inventory_vlans",
    "racks": "inventory_racks",
    "rackAccessories": "inventory_rack_accessories",
}
SETTINGS = (
    "deviceTypes", "deviceTypeGraphics", "deviceLocations",
    "serverFunctions", "installedSoftware", "managedOptionsCleared",
    "stateVersion", "hardwareCatalogue", "hardwareSeedPreferences",
    "softwareTypeExclusions",
)
REQUIRED = ("devices", "subnets", "vlans", "racks", "ipAllocations")
MAX_BYTES = 10 * 1024 * 1024


class ImportRejected(ValueError):
    pass


def _json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def _check_keys(value):
    if isinstance(value, dict):
        if any(key in ("__proto__", "prototype", "constructor") for key in value):
            raise ImportRejected("Unsafe JSON key")
        for child in value.values():
            _check_keys(child)
    elif isinstance(value, list):
        for child in value:
            _check_keys(child)


def _unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ImportRejected("Duplicate JSON key")
        result[key] = value
    return result


def _reject_nonfinite(value):
    raise ImportRejected("Non-finite JSON number")


def validate_published_structure(data):
    """Published v1.3.3 validateBackupStructure's structural requirements.

    This is only the early structural stage, not normaliseState,
    validateApplicationState, or import confirmation.
    """
    if not isinstance(data, dict):
        raise ImportRejected("Backup must be a JSON object.")
    for key in ("devices", "subnets", "racks"):
        records = data.get(key)
        if not isinstance(records, list):
            raise ImportRejected("Backup is missing a valid " + key + " array.")
        if len(records) > 50000:
            raise ImportRejected("Backup contains too many " + key + " records.")
        if any(not isinstance(item, dict) for item in records):
            raise ImportRejected("Backup has invalid entries in " + key + ".")
    ipam = data.get("ipAllocations")
    if not isinstance(ipam, dict):
        raise ImportRejected("Backup is missing a valid IP allocation table.")
    if len(ipam) > 100000:
        raise ImportRejected("Backup contains too many IP allocations.")
    return True


def inspect_export(raw: bytes):
    """Reject obviously incompatible inputs before detached validation.

    Metadata is a format gate, not proof that a file was exported by v1.3.3.
    """
    if len(raw) > MAX_BYTES:
        raise ImportRejected("Export exceeds 10 MiB")
    try:
        data = json.loads(
            raw, object_pairs_hook=_unique_object, parse_constant=_reject_nonfinite
        )
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ImportRejected("Invalid JSON export") from exc
    if not isinstance(data, dict):
        raise ImportRejected("Backup must be a JSON object.")
    _check_keys(data)
    validate_published_structure(data)
    meta = data.get("caffootBackup")
    if not isinstance(meta, dict) or any((
        meta.get("format") != "caffoot-inventory",
        meta.get("schemaVersion") != 1,
        meta.get("app") != "Caffoot Lite",
        meta.get("appVersion") != "1.3.3",
        not isinstance(meta.get("exportedAt"), str),
    )):
        raise ImportRejected("A published v1.3.3 export is required")
    for key in REQUIRED:
        if key not in data:
            raise ImportRejected("Missing inventory collection: " + key)
    # Published normaliseState requires VLANs; the early structural gate does not.
    if not isinstance(data.get("vlans"), list):
        raise ImportRejected("Imported data is missing a valid vlans array.")
    # Published import checks this optional collection independently.
    if "rackAccessories" in data and not isinstance(data["rackAccessories"], list):
        raise ImportRejected("Backup has an invalid rackAccessories collection.")
    for key in ("vlans", "rackAccessories"):
        if any(not isinstance(item, dict) for item in data.get(key, [])):
            raise ImportRejected("Invalid inventory record: " + key)
    ipam = data["ipAllocations"]
    if not isinstance(ipam, dict) or len(ipam) > 100000:
        raise ImportRejected("Invalid IP allocations")
    if any(not isinstance(item, dict) for item in ipam.values()):
        raise ImportRejected("Invalid IP allocation record")
    return data


def _write_detached(connection: sqlite3.Connection, data):
    """Low-level staging writer. Caller MUST complete full source validation.

    Do not call on a production database until published import review,
    normalisation and integrity validation are implemented.
    """
    for table in (*COLLECTIONS.values(), "inventory_ip_allocations", "inventory_settings"):
        connection.execute("DELETE FROM " + table)
    for name, table in COLLECTIONS.items():
        for ordinal, record in enumerate(data.get(name, [])):
            identifier = record.get("id")
            if not isinstance(identifier, str) or not identifier:
                raise ImportRejected("Missing ID in " + name)
            if name == "devices":
                device_name = record.get("name")
                if not isinstance(device_name, str) or not device_name:
                    raise ImportRejected("Missing device name")
                connection.execute(
                    "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                    (identifier, device_name, _json(record), ordinal),
                )
            elif name == "rackAccessories":
                connection.execute(
                    "INSERT INTO inventory_rack_accessories(id,rack_id,record_json,ordinal) VALUES(?,?,?,?)",
                    (identifier, record.get("rackId", ""), _json(record), ordinal),
                )
            else:
                connection.execute(
                    "INSERT INTO " + table + "(id,record_json,ordinal) VALUES(?,?,?)",
                    (identifier, _json(record), ordinal),
                )
    for ip, record in data["ipAllocations"].items():
        connection.execute(
            "INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?)",
            (ip, _json(record)),
        )
    # Preserve optional and historical top-level inventory settings.
    # Backup metadata is not authoritative inventory state.
    for key, value in data.items():
        if key not in COLLECTIONS and key not in ("ipAllocations", "caffootBackup"):
            connection.execute(
                "INSERT INTO inventory_settings(key,value_json) VALUES(?,?)",
                (key, _json(value)),
            )


def stage_inventory(connection: sqlite3.Connection, data):
    """Atomically stage already-reviewed data in an isolated test database.

    This is deliberately not connected to any application API.
    """
    connection.execute("BEGIN IMMEDIATE")
    try:
        _write_detached(connection, data)
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def reconstruct_inventory(connection: sqlite3.Connection):
    """Rebuild source-shaped collections; retain optional top-level settings."""
    result = {}
    for name, table in COLLECTIONS.items():
        result[name] = [
            json.loads(row[0]) for row in connection.execute(
                "SELECT record_json FROM " + table + " ORDER BY ordinal"
            )
        ]
    result["ipAllocations"] = {
        ip: json.loads(raw) for ip, raw in connection.execute(
            "SELECT ip,record_json FROM inventory_ip_allocations ORDER BY rowid"
        )
    }
    for key, raw in connection.execute(
        "SELECT key,value_json FROM inventory_settings"
    ):
        result[key] = json.loads(raw)
    return result
