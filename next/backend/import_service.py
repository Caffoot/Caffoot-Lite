"""Offline orchestration for the published v1.3.3 inventory import.

No HTTP route calls this module. The caller must pass the original export,
not a client-supplied candidate. Authentication, review and final confirmation
are independently checked before the atomic SQLite replacement.
"""
from backend.import_review import (
    prepare_published_export_review, confirm_detached_import_review,
)
from backend.inventory import stage_inventory
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
    stage_inventory(connection, candidate)
    return True
