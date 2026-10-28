# Caffoot Lite v1.3.3 candidate release notes

**Version:** v1.3.3 candidate, not yet published.
**Current published stable release:** v1.3.2 (27 October 2026).
**Status:** Release evidence, documentation and product owner approval are outstanding. This file is not a publication announcement.

## Scope

v1.3.3 is planned as the final standalone HTML-only maintenance release before the separately planned Docker/database direction. It focuses on agreed outstanding audit findings, clearer function naming, targeted corrections and documentation reconciliation. No unrelated new features are authorised by this candidate.

The release branch includes the approved Add Device Virtual Machine visibility correction tracked through PR #197. The product owner reported successful Firefox acceptance of the corrected build. Focused rack backup import test coverage was added through PR #201, including accessory preservation and collision/malformed-data rejection; PR #202 reconciled existing audit and verification documentation. Historical evidence and precise coverage boundaries remain in the existing GitHub workflow register and issue #108.

## Data preservation and upgrading

The standalone application uses browser-local storage, not a shared database. Export a JSON backup before upgrading, changing browsers or moving/renaming the HTML file. Keep the previous working HTML and the original backup until the replacement is verified. A restore replaces the active inventory. Existing compatibility, recovery and rollback evidence must be reviewed at the final release gate; these notes do not claim every historical permutation has been retested.

## Verification and approval

Previous successful application, backup and browser evidence is retained unless changed code or a genuine coverage gap requires a focused check. The final candidate still requires exact source/version alignment, documentation consistency, package ZIP and SHA-256 integrity verification, applicable GitHub checks, outstanding findings review and explicit product owner approval. Do not merge into main, tag or publish before approval. Track completion in [issue #108](https://github.com/Caffoot/Caffoot-Lite/issues/108).
