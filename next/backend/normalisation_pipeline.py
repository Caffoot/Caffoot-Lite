"""Source-ordered detached v1.3.3 normaliseState assembly.

Not the user-facing import gate: backup metadata, unsafe-key checks,
legacy mounting review, validateApplicationState, rack occupancy,
confirmation and atomic persistence are separate mandatory stages.
"""
import copy

from backend.ipam_validation import ip_belongs_to_subnet
from backend.ipam_reconciliation import reconcile_published_ipam
from backend.normalisation import normalise_published_fields
from backend.normalisation_addresses import validate_normalisation_addresses
from backend.normalisation_validation import (
    _integer, _number, _valid_ipv4,
    validate_normalisation_devices, validate_normalisation_vlans,
)
from backend.subnet_validation import validate_subnet_hierarchy, validate_subnet_types


# Copied from the published v1.3.3 defaultData constant, not new product defaults.
PUBLISHED_DEFAULTS = {
    "subnets": [], "vlans": [], "racks": [], "devices": [],
    "rackAccessories": [],
    "deviceTypes": [
        "Server - Physical", "Server - Virtual", "Desktop", "Laptop",
        "Tablet", "Switch", "Layer 3 Switch", "Router", "Firewall",
        "NAS", "Printer", "Scanner", "Access Point",
        "Wireless LAN Controller", "PDU", "UPS", "Unknown",
    ],
    "deviceTypeGraphics": {}, "deviceLocations": ["Unknown"],
    "ipAllocations": {}, "serverFunctions": [], "installedSoftware": [],
    "managedOptionsCleared": False,
}


def _valid_supported_cidr(cidr):
    """Published isValidCidr24: aligned IPv4 /23 through /30."""
    if not isinstance(cidr, str):
        return False
    import re
    from backend.ipam_validation import _ip_number
    match = re.fullmatch(r"([^/]+)/([0-9]{1,2})", cidr)
    if not match:
        return False
    prefix = int(match.group(2))
    ip = _ip_number(match.group(1))
    return ip is not None and 23 <= prefix <= 30 and ip % (2 ** (32 - prefix)) == 0


def validate_normalisation_subnets(candidate):
    """Published normaliseState subnet checks, then hierarchy and type checks."""
    for subnet in candidate["subnets"]:
        if isinstance(subnet, dict) and subnet.get("kind") and subnet["kind"] != "network":
            continue
        if (not isinstance(subnet, dict) or not subnet.get("id") or
                not subnet.get("name") or not _valid_supported_cidr(subnet.get("cidr"))):
            raise ValueError("Every subnet must have an id, name and valid /23–/30 CIDR.")
        vlan = subnet.get("vlan")
        if not _integer(vlan) or not 1 <= _number(vlan) <= 4094:
            raise ValueError(f"Invalid VLAN ID on subnet {subnet['name']}.")
        if not _valid_ipv4(subnet.get("gateway")):
            raise ValueError(f"Invalid gateway on subnet {subnet['name']}.")
        if not ip_belongs_to_subnet(subnet["gateway"], subnet["cidr"]):
            raise ValueError(
                f"Gateway {subnet['gateway']} does not belong to subnet {subnet['cidr']}."
            )
    hierarchy = validate_subnet_hierarchy(candidate["subnets"])
    if hierarchy:
        raise ValueError(hierarchy[0])
    types = validate_subnet_types(candidate["subnets"])
    if types:
        raise ValueError(types[0])


def normalise_detached_v133_state(raw):
    """Mirror published normaliseState ordering without touching source or DB.

    Call only after the independent published backup format/structure gate.
    This deliberately does NOT grant import acceptance.
    """
    if not isinstance(raw, dict):
        raise ValueError("Imported data must be a JSON object.")
    for key in ("subnets", "vlans", "racks", "devices"):
        if not isinstance(raw.get(key), list):
            raise ValueError(f"Imported data is missing a valid {key} array.")
    if not isinstance(raw.get("ipAllocations"), dict):
        raise ValueError("Imported data is missing a valid ipAllocations object.")
    state = copy.deepcopy(PUBLISHED_DEFAULTS)
    state.update(copy.deepcopy(raw))
    state = normalise_published_fields(
        state, PUBLISHED_DEFAULTS["deviceTypes"], PUBLISHED_DEFAULTS["deviceLocations"]
    )
    validate_normalisation_subnets(state)
    validate_normalisation_vlans(state)
    validate_normalisation_devices(state)
    validate_normalisation_addresses(state)
    return reconcile_published_ipam(state)
