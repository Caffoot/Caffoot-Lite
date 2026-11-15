# Published v2.1 Documentation Synchronisation — Milestone 01

This record accompanies the review branch `docs/sync-public-v21-to-milestone1`, created from the verified `milestone-1` checkpoint `05b162aa10a74994c970d0b6dbf111dc59b47513`. The source of the corrections is the owner-approved and merged public documentation PR [#384](https://github.com/Caffoot/Caffoot-Lite/pull/384), on `main` at `3d66c3ee6fd9d9c51ecbdd5822bc1c4fe98b8e7b`.

## Purpose and limits

Synchronise **published v2.1 documentation** with the released, owner-approved guides, screenshots, public direction and release boundaries, while keeping the **unreleased v2.2 milestone** code and its independently approved work intact.

This branch is a documentation review proposal. It does **not** merge `main` wholesale, merge `milestone-1` into `main`, start Batch 3.5, publish an image, change permissions or schemas, or approve a production upgrade. The Department Details screen still requires separate visual approval. Stage 3 Batch 3.4 manual/native acceptance remains deferred, not passed.

## Synced, unmodified published material

Thirty-seven Git blobs match the public `main` merge exactly:

- The eight published v2.1 guide files in both official and legacy compatibility locations (sixteen Markdown files, byte-identical by pair).
- All ten owner-approved v2.1 screenshot images, their approved gallery and capture metadata. Original historical images and their public paths are untouched.
- The root README, public ROADMAP, Community Participation and historical navigation index.
- Three product-direction documents with the latest approved core Staff Members/Departments and independently optional IT Assets distinction.
- The published-versus-development status guide and the public documentation correction record.

The official v2.1 instructions deliberately exclude the v2.2 Staff Member/IT Staff role contract, departmental functions and My Equipment workflows. Those remain version-specific, not published features.

## Reconciled development documentation

The integration branch keeps schema-15 and Stage 3 implementation detail rather than overwriting it with the older `main` Stage 1 descriptions. The architecture, database, frontend/backend, authentication, testing, development-guide entry and AGENTS status references distinguish published schema 10, accepted but unreleased Stage 1/schema 12 and `milestone-1` schema 15. The published v2.1 upgrade rehearsal remains pinned to the **historical Stage 1 source**, not the latest milestone.

Other common developer chapters incorporate the corrected modular-interface, account-recovery and contribution conventions. Two proven inaccurate import helper docstrings are corrected without editing executable statements. The inventory-migration guide now describes their live protected HTTP usage.

## Draft PR #383 — reconciliation after this PR

[Draft PR #383](https://github.com/Caffoot/Caffoot-Lite/pull/383) remains **unmerged and unchanged** on `docs/pre-batch35-guidance` at `4b73aa7412932b017684c45ea9a0f0dd9281f744`. It contains separate legitimate v2.2 work and must be reconciled against this synchronised baseline **after** the owner reviews and approves this synchronisation PR.

Retain and review its five draft v2.2 feature guides and their index, Stage 3/status, Role Permissions, Staff/Department, Device assignment, Optional Features, Function Index, source comments and evidence updates. Reconcile its edits to `README.md`, `ROADMAP.md`, `AGENTS.md`, the developer index and all three affected published guide pairs against the approved v2.1 wording. Do **not** restore unreleased role/MFA instructions to the public v2.1 guides. Link them from a clearly labelled v2.2 draft area instead.

The development Help & Guides/version-aware integration finding I12 remains **deferred**. It requires its own approved implementation and screen review; do not silently change published v2.1 help targets.

## Verification and remaining checks

- Compared the synchronisation branch Git tree with the approved `main` merge: all **37 selected public file blobs** match exactly.
- Confirmed **all eight** official/legacy guide pairs are byte-identical.
- Compared the integration base and proposed tree: no `interface/`, `tests/`, or other runtime file was changed. The only changed Python files are `backend/import_service.py` and `backend/inventory.py`, limited to the described docstring text.
- Historical screenshots and existing installation files were not altered.
- **Before any merge:** complete relevant documentation/Markdown reference checks, GitHub Actions evidence, and product-owner review. No Raspberry Pi, manual Safari, Docker deployment or whole-volume upgrade/restore acceptance is claimed by this synchronisation.

## Approval boundary

This is a separate pull request targeting `milestone-1`; no merge is authorised by preparing it. Keep PR #383 draft until the synchronisation has been reviewed and its remaining v2.2 material can be reconciled without loss. Approval of public PR #384 does not constitute approval to merge this PR.
