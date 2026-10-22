# Documentation relocation and compatibility register

**Scope:** Documentation branch only. The published v1.3.0 application is unchanged.

## Completed

- 22 technical documents copied into subject directories with their original blob content retained.
- Five non-packaged root documents copied into subject directories with their original blob content retained.
- Documentation homepage, contributor guide, getting-started index and section indexes created.
- Root README, contributor guide and documentation homepage updated for selected canonical paths.

## Temporary compatibility locations

The 22 former docs root document paths and five former repository root document paths currently contain navigation stubs. These are **not** the authoritative technical documents. Keep them until all internal references, external references and release guidance are reviewed.

The five root stubs are:
- `DEVELOPMENT-WORKFLOW.md`
- `DISCOVERABILITY.md`
- `RELEASE-ACCEPTANCE.md`
- `RELEASE-CHECKLIST.md`
- `RELEASE-REVIEW.md`

## Release build dependencies

Source inspection of `app/package-release.cjs` found an explicit package input list containing:
- `RELEASE-NOTES-<version>.md`
- `LICENSE`
- `THIRD-PARTY-NOTICES.md`
- `INSTALLATION.md`
- `USER-GUIDE.md`
- `BACKUP-FORMAT.md`

Source inspection of `app/build-offline.cjs` also found `THIRD-PARTY-NOTICES.md` among its notice paths.

**Do not remove or move these release inputs** until the build and package paths are updated with approval, release verification is run and the resulting archive is inspected. Moving them is not required to complete documentation navigation.

`README.md`, `CONTRIBUTING.md`, `ROADMAP.md` and `SECURITY.md` should remain discoverable at the root.

## Outstanding checks

1. Search Markdown and source files for references to former locations.
2. Update relative links based on the *new document's* directory, not just its filename.
3. Check Markdown link destinations and fragment anchors.
4. Inspect GitHub workflow and release package references before considering any root release file move.
5. Decide whether temporary stubs can be removed without breaking links to prior documentation.
6. Review the resulting directory tree with the project owner.
7. Resume the v1.3.0 technical workflow audit, with P11/P12 and browser tests still open.

## Safety

Documentation moves and index updates are not evidence that application behaviour has changed or browser tests have passed. No production release, merge or application code change is authorised by this register.

## Reference reconciliation checkpoint, 22 October 2026

Updated the root README, contributor guide and docs homepage to link to selected canonical document paths. Subsequently updated `docs/standards/TECHNICAL-DOCUMENTATION-POLICY.md`, `docs/testing/WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md` and `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md` to replace specific old code-formatted document references with their repository-relative canonical paths.

This was a **targeted reference pass**, not an exhaustive repository-wide link or fragment validation. The remaining temporary stubs must not be removed on the strength of this checkpoint alone. No browser, release build or archive verification has been performed in this housekeeping pass.

## Coverage audit reference checkpoint, 22 October 2026

Reconciled 30 additional code-formatted references across `docs/standards/DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md` and `docs/audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md`, including test matrices, workflow documentation and the maintenance roadmap. The original audit findings and application behaviour were not intentionally altered.

**Limit:** This is not a complete automated link checker, and text references outside the specifically replaced code-formatted filenames may remain. Historical references and external links still require review before temporary stubs can be removed.

## Documentation index verification checkpoint, 22 October 2026

Compared the relative Markdown links in nine main navigation indexes (`docs/README.md` and the eight section README files) against the repository tree. Their destinations exist at the expected paths. This check establishes file existence for those navigation links only, not complete anchor correctness or a repository-wide link audit.

Clarified `docs/getting-started/README.md`: `INSTALLATION.md`, `USER-GUIDE.md` and `BACKUP-FORMAT.md` are release package inputs, while the root README and contributor guide are retained for discoverability. Release packaging and browser tests have not been run in this documentation pass.

## Root and compatibility-link inspection, 22 October 2026

Inspected `README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/standards/DEVELOPMENT-WORKFLOW.md`, `docs/releases/RELEASE-CHECKLIST.md` and `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md` for a focused set of former documentation names. The contributor guide already points to `docs/standards/DEVELOPMENT-WORKFLOW.md`; the maintenance roadmap points to the canonical technical workflows and function reference. The development workflow still uses the short filename `DEVELOPMENT-WORKFLOW.md` in a handover instruction to refer to itself. This is understandable in context but should be reviewed if links are made clickable.

Also read representative temporary compatibility stubs at `docs/TECHNICAL-WORKFLOWS.md`, `docs/V1.3.1-MAINTENANCE-ROADMAP.md`, `docs/WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md`, `DEVELOPMENT-WORKFLOW.md` and `RELEASE-CHECKLIST.md`. Each points to its expected canonical location. This sample is **not** proof that every compatibility stub or every link is valid.

**Outstanding:** Inspect all 27 stubs, review non-Markdown consumers of their paths, check fragment links, and assess external bookmarks before deleting anything. No stub was deleted in this checkpoint.

## Release archive policy, 22 October 2026

Created `docs/archive/README.md` with release tidy-up and archive rules, linked it from `docs/README.md`, and added a reference to `docs/standards/TECHNICAL-DOCUMENTATION-POLICY.md`. No version-specific technical documents were moved. Superseded documents should be archived only when their current replacements are ready and release-critical dependencies have been checked. A merged archive survives automatic source-branch deletion; unmerged changes do not become part of `main`.

## Release checklist integration, 22 October 2026

Updated `docs/releases/RELEASE-CHECKLIST.md` to require version-specific archive review during release preparation, including current replacements, path and release-dependency checks, and confirmation that the archive is present on `main` after the documentation closeout merge. This is a prospective checklist change, not evidence that a release tidy-up or build has already occurred. No v1.3.0 baseline documents have been moved into the archive.
