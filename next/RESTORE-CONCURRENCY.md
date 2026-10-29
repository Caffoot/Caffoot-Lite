# Concurrent restore preview guard

The offline-only restore boundary now accepts an optional inventory preview
fingerprint. A caller may obtain the fingerprint of the inventory presented
for confirmation with `inventory_preview_token(reconstruct_inventory(db))`.

At restore time the backend compares that fingerprint **inside the same
BEGIN IMMEDIATE transaction** that creates the safety snapshot and replaces
inventory. If another operator has changed inventory since the preview, the
restore is rejected before snapshot or inventory mutation. A fresh review
is then required.

This fingerprint is a **stale-preview detection aid**, not authentication,
authorization or proof of full v1.3.3 import parity. The existing offline
function permits callers without a fingerprint for compatibility with
foundation tests; any future live integration must require a reviewed
fingerprint and enforce authentication/RBAC/MFA before calling it.

No live import endpoint or user-visible workflow is introduced.
