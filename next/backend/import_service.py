"""Offline orchestration for the published v1.3.3 inventory import.

No HTTP route calls this module. The caller must pass the original export,
not a client-supplied candidate. Authentication, review and final confirmation
are independently checked before the atomic SQLite replacement.
"""
from backend.import_review import (
    prepare_published_export_review, confirm_detached_import_review,
)
from backend.inventory import stage_inventory, reconstruct_inventory, preview_inventory_counts
from backend.request_auth import authorised_inventory_import


def replace_from_published_export(connection, raw_bytes, *,
                                  cookie_header, origin, allowed_origin,
                                  csrf_header, access_point_choices=None,
                                  legacy_mount_approved=False,
                                  replacement_confirmed=False, now=None):
    """One-shot offline adapter; caller collects v1.3.3 review decisions first.

    Never accept candidate inventory from the client. Rebuild it from original
    bytes on every call. A missing review choice or final confirmation fails
    without changing inventory. No live endpoint is registered.
    """
    if authorised_inventory_import(
        connection, cookie_header, origin, allowed_origin, csrf_header, now=now
    ) is None:
        raise PermissionError("Authenticated full inventory edit access required")
    review = prepare_published_export_review(raw_bytes, access_point_choices)
    candidate = confirm_detached_import_review(
        review, legacy_mount_approved=legacy_mount_approved,
        replacement_confirmed=replacement_confirmed,
    )
    # The transaction either replaces all inventory or rolls it all back.
    # Account, permission, session and history tables are never touched.
    # Recheck identity and permissions after acquiring SQLite's write lock;
    # a concurrent administrator may have revoked access during review.
    def require_current_permission(locked_connection):
        if authorised_inventory_import(
            locked_connection, cookie_header, origin, allowed_origin,
            csrf_header, now=now
        ) is None:
            raise PermissionError('Inventory import permission was revoked')

    stage_inventory(connection, candidate, pre_write_check=require_current_permission)
    return True


def preview_published_export(connection, raw_bytes, *,
                             cookie_header, origin, allowed_origin,
                             csrf_header, access_point_choices=None, now=None):
    """Read-only, authenticated preparation for the published import reviews.

    Access Point decisions come first. Only a fully validated candidate gets
    replacement counts. This returns no approval and never persists inventory.
    The eventual HTTP workflow must retain original bytes server-side.
    """
    if authorised_inventory_import(
        connection, cookie_header, origin, allowed_origin, csrf_header, now=now
    ) is None:
        raise PermissionError("Authenticated full inventory edit access required")
    review = prepare_published_export_review(raw_bytes, access_point_choices)
    if review.get("requiresAccessPointMountReview"):
        return {
            "requiresAccessPointMountReview": True,
            "accessPointMountConflicts": review["accessPointMountConflicts"],
            "approved": False,
            "persistenceAllowed": False,
        }
    return {
        "requiresAccessPointMountReview": False,
        "accessPointMountConflicts": review["accessPointMountConflicts"],
        "requiresLegacyMountReview": review["requiresLegacyMountReview"],
        "legacyMountRepairs": review["legacyMountRepairs"],
        "counts": preview_inventory_counts(
            review["candidate"], reconstruct_inventory(connection)
        ),
        "approved": False,
        "persistenceAllowed": False,
    }
