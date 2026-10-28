# Caffoot Lite v1.3.3 release notes

**Version:** v1.3.3
**Status:** Published stable release.

## Scope

v1.3.3 is the final standalone HTML-only maintenance release before the separately planned Docker/database direction. It focuses on agreed outstanding audit findings, clearer function naming, targeted corrections and documentation reconciliation. No unrelated new features were added to this maintenance release.

The release branch includes the approved Add Device Virtual Machine visibility correction tracked through PR #197. The product owner reported successful Firefox acceptance of the corrected build. Focused rack backup import test coverage was added through PR #201, including accessory preservation and collision/malformed-data rejection; PR #202 reconciled existing audit and verification documentation. Historical evidence and precise coverage boundaries remain in the existing GitHub workflow register and issue #108.

## Data preservation and upgrading

The standalone application uses browser-local storage, not a shared database. Export a JSON backup before upgrading, changing browsers or moving/renaming the HTML file. Keep the previous working HTML and the original backup until the replacement is verified. A restore replaces the active inventory. Existing compatibility, recovery and rollback evidence must be reviewed at the final release gate; these notes do not claim every historical permutation has been retested.

## Verification and approval

Previous successful application, backup and browser evidence is retained unless changed code or a genuine coverage gap requires a focused check. The release gate records source/version alignment, documentation consistency, package verification and the product owner's separate publication decision. Existing outstanding audit findings and historical test coverage limits remain recorded; publication does not imply they were all resolved or retested. Track completion in [issue #108](https://github.com/Caffoot/Caffoot-Lite/issues/108).
