"""Detached import review preparation, matching published v1.3.3 stage order.

This is NOT an import acceptance gate. Full validateApplicationState parity,
backup version gate and explicit confirmation are required before persistence.
"""
from backend.legacy_mounting import plan_legacy_computer_mounting_corrections
from backend.normalisation_pipeline import normalise_detached_v133_state
from backend.inventory import inspect_device_mounts
from backend.import_diagnostics import inspect_detached_candidate
from backend.application_integrity import validate_detached_application_state
from backend.rack_validation import find_rack_import_conflicts


def prepare_detached_import_review(raw):
    """Prepare a source-ordered candidate and report; never write to storage.

    Legacy mounting changes are proposals, not automatically approved.
    A candidate returned here is not authorised for stage_inventory.
    """
    proposed, repairs = plan_legacy_computer_mounting_corrections(raw)
    candidate = normalise_detached_v133_state(proposed)
    invalid_mounts = inspect_device_mounts(candidate)
    if invalid_mounts:
        names = ", ".join(str(d.get("name")) for d in invalid_mounts[:4])
        raise ValueError("Backup contains unsupported device mounting types: " + names)
    issues = validate_detached_application_state(candidate)
    issues.extend(find_rack_import_conflicts(candidate))
    if issues:
        summary = "; ".join(issues[:4]) + ("; and more" if len(issues) > 4 else "")
        raise ValueError(
            f"Inventory integrity check found {len(issues)} issue(s): {summary}"
        )
    findings = inspect_detached_candidate(candidate)
    return {
        "candidate": candidate,
        "legacyMountRepairs": repairs,
        "diagnostics": findings,
        "requiresLegacyMountReview": bool(repairs),
        "approved": False,
        "persistenceAllowed": False,
    }
