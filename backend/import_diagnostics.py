"""Read-only assembly of published v1.3.3 import diagnostic components.

This is NOT an import acceptance decision. The published normaliseState,
legacy mounting repair review, full validateApplicationState, and final user
confirmation are still required. No database or HTTP access is provided.
"""
from backend.inventory import inspect_device_mounts
from backend.ipam_validation import inspect_ipam_integrity
from backend.rack_validation import find_rack_import_conflicts
from backend.subnet_validation import validate_subnet_hierarchy, validate_subnet_types


def inspect_detached_candidate(candidate):
    """Report component findings separately, without pretending they form a gate.

    Input must already have passed structural checks and source normalisation.
    This deliberately does not call stage_inventory or approve an import.
    """
    return {
        "hierarchy": validate_subnet_hierarchy(candidate["subnets"]),
        "subnetTypes": validate_subnet_types(candidate["subnets"]),
        "mounts": [
            {"id": device.get("id"), "name": device.get("name"),
             "mountType": device.get("mountType")}
            for device in inspect_device_mounts(candidate)
        ],
        "ipam": inspect_ipam_integrity(candidate),
        "rackConflicts": find_rack_import_conflicts(candidate),
    }
