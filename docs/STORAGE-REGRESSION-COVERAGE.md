# v1.4.0 — Browser Storage Regression Coverage Matrix

**Date:** 21 October 2026  
**Status:** Read-only static test review; tests were **not executed** during this audit.  
**Baseline:** `app/caffoot-lite.html` and `app/test-*.cjs` on `main`, published v1.3.0 source.

## Existing test evidence

| Storage boundary | Observed tests | Confidence and remaining gap |
| --- | --- | --- |
| `caffoot_state` save/reload | `test-browser-offline.cjs` | Browser persistence and failed device edits/creates covered; not an exhaustive quota/failure audit |
| Corrupt inventory on startup | `test-security-storage.cjs`, `test-browser-offline.cjs` | Corrupt data preservation/recovery paths tested |
| JSON restore and safety snapshot | `test-browser-restore.cjs`, `test-browser-upgrade.cjs` | Cancel, failed save, approved restore, safety snapshot and reload covered |
| Clean reset and rollback | `test-security-reset.cjs` | Silent inventory/safety rollback write failures tested; full browser preference isolation not established |
| Storage notice acknowledgement | `test-browser-offline.cjs` | First-run acknowledgement and permanent reminder covered; persistence across reset/restore should be asserted |
| `caffoot_audit_v1` | Audit implementation in source | No dedicated key-level audit retention/export/reset test identified in reviewed tests |
| `caffoot_theme_preference` / `caffoot_dark` | Theme UI checks exist in broader suite | Explicit persistence and fallback compatibility tests not established in this review |
| `caffoot_phase11c_pre_repair_v1` | Repair implementation in source | Pre-repair snapshot failure, replacement and recovery behaviour need targeted tests |
| `caffoot_phase12b_prebulk_snapshot` | Bulk IPAM implementation in source | Test snapshot write failure and silent write mismatch; current handler catches thrown writes but inspected source does not read back snapshot |

## Prioritized next test cases (proposed, not implemented)

### P0 — Data-loss protection

1. Bulk IPAM snapshot write throws: no allocation changes, no save, actionable error.
2. Bulk IPAM snapshot silently fails: decide and implement verification contract **only after a separate reviewed code change**; confirm original inventory remains unchanged.
3. Pre-repair snapshot failure: reject repair without changing IPAM state.
4. Restore and clean reset with blocked/silent writes: preserve prior inventory and safety snapshot; block saves if rollback cannot be verified.
5. Restore from schema-v1 and unversioned fixtures: preserve linked devices, IP allocations, VLAN scopes and racks.

### P1 — Boundary separation

6. Restore inventory while theme preference, legacy dark flag, notice acknowledgement and audit history exist: verify intended non-inventory keys remain unchanged.
7. Clean reset with preferences and audit history: explicitly decide whether historical audit events should survive; verify resulting behaviour.
8. Audit retention: append more than 200 events, verify truncation to latest 200 and independent JSON export.
9. Audit storage failure after successful inventory save: user receives accurate warning; inventory is not rolled back as though the audit write were atomic.
10. Snapshot discoverability: each snapshot is accessible through its documented recovery path, or a missing recovery UI is explicitly documented.

### P2 — Compatibility and operating limits

11. Theme `system` preference and legacy `caffoot_dark` compatibility across reloads.
12. Quota exhaustion and blocked `file://` storage in a disposable browser profile.
13. Compare generated offline HTML behaviour to source tests; check historical backup fixtures.
14. Confirm no unintended `localStorage.clear()` calls or deletion of unrelated keys on reset/restore.

## Guardrails

- Use synthetic inventories and isolated browser profiles; never operate on an owner's only inventory.
- Keep changes off published `main` and out of release assets.
- Record test name, expected/actual outcome, browser/runtime and commit SHA.
- Distinguish static test coverage from a passing execution result.
- Any discovered defect requires a separate reviewed fix, regression test and owner acceptance.
- No application migration, storage engine or backup schema change is authorized here.

## Recommended implementation sequence

1. Add dedicated **read-only or synthetic fixture** tests for audit, preference and snapshot boundaries.
2. Run existing release regression suite and record results.
3. Review any failing cases and agree fixes individually.
4. Only after coverage is established, prototype a storage adapter on a separate branch.

**Related:** [Browser Storage Key Audit](BROWSER-STORAGE-KEY-AUDIT.md), [Data Storage Boundaries](DATA-STORAGE-BOUNDARIES.md), [Identity & Migration Contract](IDENTITY-MIGRATION-CONTRACT.md).
