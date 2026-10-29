"""Offline-only published import confirmation and transactional restore boundary.

No HTTP endpoint calls this module. Authentication, complete source parity and
UI confirmation must be verified before production use. A caller cannot bypass
the published format gate by providing a prebuilt review or candidate.
"""
import json

from backend.import_review import prepare_published_export_review
from backend.inventory import (
    _write_detached, reconstruct_inventory, preview_inventory_counts,
)


class RestoreCancelled(ValueError):
    """A review or confirmation was declined; inventory is unchanged."""


def prepare_restore_confirmation(raw_bytes, *, access_point_choices=None,
                                 legacy_mount_approved=False):
    """Return a detached preview only after required correction reviews."""
    review = prepare_published_export_review(raw_bytes, access_point_choices)
    if review.get("requiresAccessPointMountReview"):
        return review
    if review["requiresLegacyMountReview"] and not legacy_mount_approved:
        return review
    return review


def restore_reviewed_export_offline(connection, raw_bytes, *,
                                    access_point_choices=None,
                                    legacy_mount_approved=False,
                                    final_confirmed=False):
    """Isolated backend test path, NOT a live or authenticated import API.

    Revalidates raw bytes; never trusts a caller-provided candidate. The
    snapshot, inventory replacement and readback verification share one
    transaction. Any failure rolls back the snapshot AND inventory together.
    """
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
        snapshot = json.dumps(current, ensure_ascii=False, separators=(",", ":"))
        connection.execute(
            "INSERT INTO inventory_pre_restore_snapshot(id,record_json) "
            "VALUES(1,?) ON CONFLICT(id) DO UPDATE SET "
            "record_json=excluded.record_json,created_at=CURRENT_TIMESTAMP",
            (snapshot,),
        )
        stored = connection.execute(
            "SELECT record_json FROM inventory_pre_restore_snapshot WHERE id=1"
        ).fetchone()
        if stored is None or stored[0] != snapshot:
            raise RuntimeError("Pre-restore safety snapshot verification failed.")
        _write_detached(connection, candidate)
        restored = reconstruct_inventory(connection)
        expected = {
            key: value for key, value in candidate.items()
            if key != "caffootBackup"
        }
        if restored != expected:
            raise RuntimeError("Saved backup verification failed.")
        connection.commit()
        return summary
    except BaseException:
        connection.rollback()
        raise


def read_pre_restore_snapshot(connection):
    """Read previous inventory without changing active inventory."""
    row = connection.execute(
        "SELECT record_json FROM inventory_pre_restore_snapshot WHERE id=1"
    ).fetchone()
    return json.loads(row[0]) if row else None
