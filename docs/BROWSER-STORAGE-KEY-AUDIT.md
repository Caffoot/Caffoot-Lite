# v1.4.0 — Browser Storage Key Audit (read-only)

**Date:** 21 October 2026  
**Source:** `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`.  
**Method:** Static inspection of source storage references and associated handlers. No browser storage accessed, application executed, or data changed.

## Eight explicit localStorage keys

| Key | Purpose | Source lines | Routine inventory JSON backup | Notes |
| --- | --- | --- | --- | --- |
| `caffoot_state` | Main application inventory snapshot | 1615–1640, 1839–1840 | **Yes** (state serialized with backup metadata) | `STATE_VERSION = 3`; startup parse/normalisation and unsafe-key guard |
| `caffoot_audit_v1` | Best-effort local audit trail | 1738–1748, 1788–1804 | **No** | Maximum 200 recent events; separately downloadable JSON; audit write failure can occur after successful inventory save |
| `caffoot_theme_preference` | Light/dark/system preference | 1703–1718 | **No** | Presentation preference |
| `caffoot_dark` | Legacy/effective dark-mode flag | 1703–1728 | **No** | Compatibility and system-theme tracking; do not discard before migration review |
| `caffoot_browser_storage_notice_v1` | Browser-storage warning acknowledgement | 2153–2170 | **No** | Local UI acknowledgement |
| `caffoot_phase11_pre_restore` | Pre-restore and pre-reset safety snapshot | 7404–7444, 7505–7550, 7803–7836 | **No** | Verified before destructive replacement; rollback protects original |
| `caffoot_phase11c_pre_repair_v1` | Pre-IPAM-repair snapshot | 2200, 2240–2282 | **No** | Captured before confirmed repair; previous snapshot restored on repair failure |
| `caffoot_phase12b_prebulk_snapshot` | Pre-bulk-IPAM operation snapshot | 4493–4514 | **No** | Written before bulk mutation; write exception blocks bulk operation; check read-back and retention in later tests |

These are the eight explicit `localStorage` key names found in this source file; this is **not** proof that no older builds, other scripts or browsers retain additional keys.

## Backup and restore boundaries

- `phase20CreateBackup` (7460–7470) deep-copies the current application state and adds `caffootBackup` metadata, format `caffoot-inventory`, schema version 1 and application version 1.3.0.
- `phase20ValidateBackupVersion` (7472–7485) recognises historical unversioned backups, validates schema-v1 metadata and rejects future schema versions.
- `phase20MigrateBackup` (7487–7494) normalises a detached copy. Separate import validation and unsafe-key checks must continue to be traced and regression-tested.
- Restore (7803–7839) writes and verifies a pre-restore snapshot, saves the replacement, reads back the inventory and attempts rollback on failure. Failed rollback blocks further saves.
- Clean reset (7390–7444) replaces the main inventory after a safety snapshot, with read-back verification and rollback.
- Audit history is exported separately via `exportAuditHistory` (1798–1804), not embedded in the routine inventory export.

## Storage behaviour and design implications

1. **Inventory:** Keep coupled device, IPAM, VLAN and rack state consistent across any future transaction boundary.
2. **Audit:** Treat local audit as best-effort metadata, not a tamper-proof security log. Future authenticated audit storage needs actor identity, access controls, retention and separate export rules.
3. **Preferences:** Keep theme and warning acknowledgement independent from inventory backup and restoration.
4. **Recovery:** Keep pre-restore, pre-repair and pre-bulk safeguards separate and protected; define snapshot retention and quota/error handling.
5. **Bulk IPAM review:** The bulk handler checks for a thrown snapshot write error, but the inspected lines do not show a read-back verification of that snapshot. This is a candidate for a focused test and design review, **not** a confirmed defect.
6. **Restore/reset:** Neither handler calls `localStorage.clear()`; their inspected paths target inventory and safety snapshot keys. Confirm expected persistence of preferences and audit records in browser tests.
7. **Browser constraints:** `file://` origin handling and localStorage quotas remain durability limitations. A future hosted backend cannot be inferred from merely serving the existing HTML.
8. **Security:** No browser-stored credentials or sessions were identified among these keys; this does not constitute a full security audit.

## Next validation tasks

- Cross-check these keys against build output, scripts, tests, historical fixtures and `BACKUP-FORMAT.md`.
- Exercise backup/restore, clean reset, IPAM repair and bulk IPAM using disposable test inventories, including storage quota and write-failure injection.
- Check audit/history behaviour on successful saves, failed saves, restores and resets.
- Verify theme and warning acknowledgement persist appropriately across inventory restores and resets.
- Confirm snapshot read-back, discoverability, replacement and retention rules for all three snapshot keys.
- Inventory all application-state fields and classify inventory-wide settings versus browser-only preferences.
- Do not modify published v1.3.0 or user inventory during this investigation.

**Status:** Source audit completed for explicit browser storage references; runtime validation pending.
