# Legacy backup import compatibility matrix

**Status:** Initial source inspected design matrix, 24 October 2026. No application changes or browser tests executed. Owner approved lossless automatic conversion of unambiguous historical values and review of ambiguous or destructive corrections. Specific mappings require source and fixture confirmation before implementation.

**Baseline:** Published v1.3.0; current source inspected at `app/caffoot-lite.html` on `main`. `STATE_VERSION = 3`. Export uses `phase20CreateBackup` with `caffootBackup` metadata; import uses `phase16CReadJson`, `phase11ValidateBackupShape`, `phase20ValidateBackupVersion`, `phase20MigrateBackup`, `normaliseState`, `phase16CCheckBackup`, and `importData`. Existing import makes a detached JSON copy, reviews certain mounting corrections, validates integrity and uses a verified pre-restore safety snapshot and rollback.

## Proposed mapping decisions

| Incoming representation | Target representation | Handling | Evidence or outstanding decision |
| --- | --- | --- | --- |
| Backup without `caffootBackup` metadata | Compatible inventory model | Preserve and normalise | Already recognised as legacy by `phase20ValidateBackupVersion`; fixture coverage pending |
| Backup with supported schema metadata | Current supported schema | Preserve and normalise | Existing validation; test actual supported versions |
| Backup with newer unsupported schema | No import | Reject clearly | Existing version guard; regression test pending |
| Historical device type spelling or alias | Canonical device type only for a proven exact match | Automatic only after explicit mapping evidence | Alias inventory and old backup fixtures pending |
| Custom or unknown device type | Original type and `typeDetails` | Preserve unchanged | Mandatory owner decision; verify editing and round trips |
| Legacy physical server `serverService_Hypervisor` | Dedicated physical hosting setting | Conditional, not blindly automatic | Need proof of exact meaning, hypervisor product, host eligibility and dependent VM links |
| Virtual server host reference and platform | Host relationship and inherited platform | Preserve; reconcile if valid | Never infer a different host or silently reassign |
| OS or firmware stored as software | OS/firmware field | Automatic only when classification and device context are unambiguous | Preserve installed software if both concepts are independently meaningful |
| Historical software label | Equivalent current software catalogue label | Automatic only with exact semantic match | Do not infer server role from software name |
| Custom or archived software or server service | Original persisted key, selection and label | Preserve | Verify archival, export/import and conversion history |
| Ordinary physical or virtual server service | Shared service catalogue | Preserve selection | No physical-only restriction unless independently justified |
| Legacy desktop mounting or location | Valid mounting and location | Existing review | `phase16CReviewLegacyMountRepairs` asks before applying corrections |
| Legacy access point mounting conflict | Explicit selected mounting | Existing review | `phase16CChooseAPMounts` requires user decision |
| Malformed, unsafe or integrity-invalid JSON | No replacement | Reject | Preserve active inventory and pre-existing safety snapshot |

## Required verification

1. Obtain representative historic backups and fixtures across supported versions, including older metadata-free exports.
2. Inventory exact historical type strings, software keys, service keys, host relationships and OS fields before approving concrete aliases.
3. Confirm deterministic migrations are idempotent and preserve all unrecognised fields and custom catalogues.
4. Test ambiguous decisions, cancellation, existing AP and legacy mount reviews, invalid backups and failed storage writes.
5. Test export after migration and reimport into the same version, comparing all device relationships and custom values.
6. Keep source inspection separate from executed automated and browser tests, and reconcile WF-03, WF-06, WF-08, findings, roadmap and master audit before sign-off.

**Implementation approval:** Not granted. This matrix is a planning artefact, not evidence of released behaviour.
