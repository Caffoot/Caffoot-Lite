"""Detached import review preparation, matching published v1.3.3 stage order.

This is NOT an import acceptance gate. Full validateApplicationState parity,
backup version gate and explicit confirmation are required before persistence.
"""
from backend.access_point_review import (
    find_access_point_mount_conflicts, apply_access_point_mount_choices,
)
from backend.legacy_mounting import plan_legacy_computer_mounting_corrections
from backend.normalisation_pipeline import normalise_detached_v133_state
from backend.inventory import inspect_device_mounts, inspect_export
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


def inspect_published_export_mounting(raw_bytes):
    """Read-only first stage of the published import sequence.

    Access Point mounting decisions precede normalisation. Callers must
    explicitly collect every choice or cancel; nothing is written here.
    """
    raw = inspect_export(raw_bytes)
    return find_access_point_mount_conflicts(raw)


def prepare_published_export_review(raw_bytes, access_point_choices=None):
    """Apply the existing v1.3.3 export gate before detached review.

    This remains read-only and does not approve persistence.
    """
    raw = inspect_export(raw_bytes)
    conflicts = find_access_point_mount_conflicts(raw)
    if conflicts:
        if access_point_choices is None:
            return {
                "accessPointMountConflicts": conflicts,
                "requiresAccessPointMountReview": True,
                "approved": False,
                "persistenceAllowed": False,
            }
        raw = apply_access_point_mount_choices(raw, conflicts, access_point_choices)
    elif access_point_choices is not None and access_point_choices:
        raise ValueError("No Access Point mounting choices are required.")
    review = prepare_detached_import_review(raw)
    review["accessPointMountConflicts"] = conflicts
    review["requiresAccessPointMountReview"] = False
    return review


def confirm_detached_import_review(review, *, legacy_mount_approved=False,
                                   replacement_confirmed=False):
    """Offline confirmation gate; never writes to SQLite or trusts UI flags.

    The caller must have already resolved the Access Point stage and obtained
    any required legacy mounting approval. This is NOT authentication,
    authorisation, or a live import endpoint.
    """
    if not isinstance(review, dict) or review.get("requiresAccessPointMountReview"):
        raise ValueError("Access Point mounting review must be completed first.")
    if not isinstance(review.get("candidate"), dict):
        raise ValueError("A fully validated import candidate is required.")
    if review.get("requiresLegacyMountReview") and not legacy_mount_approved:
        raise ValueError("Legacy mounting corrections require explicit approval.")
    if not replacement_confirmed:
        raise ValueError("Inventory replacement requires explicit confirmation.")
    # Do not change the review or mark it as permission to persist. The
    # eventual authenticated backend must revalidate before any database write.
    return review["candidate"]
