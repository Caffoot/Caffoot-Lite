"""Offline-only v1.3.3 inventory migration transaction.

Issue #215: application backups are external; no app-managed restore snapshots.
This is not a live endpoint or a substitute for source parity and RBAC.
"""
from backend.import_review import prepare_published_export_review
from backend.inventory import (
    _write_detached, reconstruct_inventory, preview_inventory_counts,
)


class RestoreCancelled(ValueError):
    """Required import review or confirmation was declined."""


def prepare_restore_confirmation(raw_bytes, *, access_point_choices=None,
                                 legacy_mount_approved=False):
    """Prepare read-only import review; approvals never imply persistence."""
    return prepare_published_export_review(raw_bytes, access_point_choices)


def restore_reviewed_export_offline(connection, raw_bytes, *,
                                    access_point_choices=None,
                                    legacy_mount_approved=False,
                                    final_confirmed=False):
    """Offline-only migration: validate, confirm, replace atomically or rollback."""
    if not final_confirmed:
        raise RestoreCancelled("Restore cancelled before final confirmation.")
    review = prepare_restore_confirmation(
        raw_bytes, access_point_choices=access_point_choices,
        legacy_mount_approved=legacy_mount_approved,
    )
    if review.get("requiresAccessPointMountReview"):
        raise RestoreCancelled("Access Point mounting review is required.")
    if review["requiresLegacyMountReview"] and not legacy_mount_approved:
        raise RestoreCancelled("Legacy mounting review is required.")
    candidate = review["candidate"]
    connection.execute("BEGIN IMMEDIATE")
    try:
        current = reconstruct_inventory(connection)
        summary = preview_inventory_counts(candidate, current)
        _write_detached(connection, candidate)
        restored = reconstruct_inventory(connection)
        expected = {key: value for key, value in candidate.items()
                    if key != "caffootBackup"}
        if restored != expected:
            raise RuntimeError("Saved import verification failed.")
        connection.commit()
        return summary
    except BaseException:
        connection.rollback()
        raise
