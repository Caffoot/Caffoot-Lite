"""Server-owned, short-lived offline import drafts for the v1.3.3 workflow.

Not an HTTP route. No browser-supplied candidate, counts, revision or approval
state is trusted. Drafts are in-memory and intentionally lost on restart.
"""
import hashlib
import secrets
import threading
import time

from backend.http_security import read_session_cookie
from backend.import_service import (
    preview_published_export, replace_from_published_export,
)


class ImportDrafts:
    def __init__(self, *, ttl_seconds=900, max_drafts=16):
        self._drafts = {}
        self._lock = threading.RLock()
        self._ttl = ttl_seconds
        self._max = max_drafts

    def _identity(self, cookie_header):
        token = read_session_cookie(cookie_header)
        if token is None:
            raise PermissionError("Valid session cookie required")
        return hashlib.sha256(token.encode("ascii")).digest()

    def _get(self, draft_id, cookie_header):
        if not isinstance(draft_id, str):
            raise ValueError("Unknown or expired import draft")
        draft = self._drafts.get(draft_id)
        if (draft is None or draft["expires"] <= time.monotonic() or
                not secrets.compare_digest(
                    draft["session"], self._identity(cookie_header)
                )):
            raise ValueError("Unknown or expired import draft")
        return draft

    def begin(self, connection, raw_bytes, *, cookie_header, origin,
              allowed_origin, csrf_header, now=None):
        """Create a private draft only after authenticating and inspecting bytes."""
        with self._lock:
            preview = preview_published_export(
                connection, raw_bytes, cookie_header=cookie_header,
                origin=origin, allowed_origin=allowed_origin,
                csrf_header=csrf_header, now=now,
            )
            current = time.monotonic()
            self._drafts = {
                key: value for key, value in self._drafts.items()
                if value["expires"] > current
            }
            if len(self._drafts) >= self._max:
                raise ValueError("Too many pending imports; cancel one first.")
            draft_id = secrets.token_urlsafe(32)
            self._drafts[draft_id] = {
                "raw": bytes(raw_bytes), "session": self._identity(cookie_header),
                "expires": current + self._ttl, "choices": None,
                "revision": preview.get("inventoryRevision"),
                "ready": not preview["requiresAccessPointMountReview"],
            }
            return draft_id, preview

    def choose_access_point_mounts(self, connection, draft_id, choices, *,
                                  cookie_header, origin, allowed_origin,
                                  csrf_header, now=None):
        """Rebuild review from server-held original bytes and explicit choices."""
        with self._lock:
            draft = self._get(draft_id, cookie_header)
            preview = preview_published_export(
                connection, draft["raw"], cookie_header=cookie_header,
                origin=origin, allowed_origin=allowed_origin,
                csrf_header=csrf_header, access_point_choices=choices, now=now,
            )
            if preview["requiresAccessPointMountReview"]:
                raise ValueError("All Access Point mounting choices are required")
            draft["choices"] = list(choices)
            draft["ready"] = True
            draft["revision"] = preview["inventoryRevision"]
            return preview

    def confirm(self, connection, draft_id, *, cookie_header, origin,
                allowed_origin, csrf_header, legacy_mount_approved=False,
                replacement_confirmed=False, now=None):
        """Consume the draft once; recheck auth and inventory under write lock."""
        from backend.request_auth import authorised_inventory_import
        with self._lock:
            # Reject invalid CSRF and revoked permissions before consuming a draft.
            if authorised_inventory_import(
                connection, cookie_header, origin, allowed_origin,
                csrf_header, now=now
            ) is None:
                raise PermissionError("Authenticated import access required")
            draft = self._get(draft_id, cookie_header)
            if not draft["ready"]:
                raise ValueError("Access Point mounting review is required")
            if not replacement_confirmed:
                raise ValueError("Inventory replacement requires explicit confirmation.")
            # A confirmation attempt consumes the draft, including failures.
            # Retrying must begin with a fresh preview and fresh decisions.
            self._drafts.pop(draft_id)
            return replace_from_published_export(
                connection, draft["raw"], cookie_header=cookie_header,
                origin=origin, allowed_origin=allowed_origin,
                csrf_header=csrf_header, access_point_choices=draft["choices"],
                legacy_mount_approved=legacy_mount_approved,
                replacement_confirmed=True,
                expected_inventory_revision=draft["revision"], now=now,
            )

    def cancel(self, draft_id, *, cookie_header):
        with self._lock:
            self._get(draft_id, cookie_header)
            self._drafts.pop(draft_id)

    def cancel_authenticated(self, connection, draft_id, *, cookie_header,
                             origin, allowed_origin, csrf_header, now=None):
        """Cancel only with current authenticated full-import permissions."""
        from backend.request_auth import authorised_inventory_import
        with self._lock:
            if authorised_inventory_import(
                connection, cookie_header, origin, allowed_origin,
                csrf_header, now=now
            ) is None:
                raise PermissionError("Authenticated import access required")
            self.cancel(draft_id, cookie_header=cookie_header)
