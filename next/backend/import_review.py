"""Detached import review preparation, matching published v1.3.3 stage order.

This is NOT an import acceptance gate. Full validateApplicationState parity,
backup version gate and explicit confirmation are required before persistence.
"""
from backend.legacy_mounting import plan_legacy_computer_mounting_corrections
from backend.normalisation_pipeline import normalise_detached_v133_state
from backend.inventory import inspect_device_mounts
from backend.import_diagnostics import inspect_detached_candidate


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
    findings = inspect_detached_candidate(candidate)
    return {
        "candidate": candidate,
        "legacyMountRepairs": repairs,
        "diagnostics": findings,
        "requiresLegacyMountReview": bool(repairs),
        "approved": False,
        "persistenceAllowed": False,
    }
