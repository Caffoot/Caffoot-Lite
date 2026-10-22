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

## All compatibility stubs inspected, 22 October 2026

Read all **27** temporary Markdown compatibility stubs (five at repository root and 22 at the former `docs/` root). Each is a short `# Document moved` notice linking to the corresponding subject-directory path. The target paths were compared with the repository tree listing, which includes the intended destination documents.

**Scope and limits:** This confirms the 27 stub destinations and target file presence. It does not prove that all inbound references have been updated, that external bookmarks can be discarded, or that every relative link inside relocated documents works. Keep all stubs pending that further review. No stub deletion or application code change was made.

## Release tooling reference inspection, 22 October 2026

Read `app/package-release.cjs`, `app/build-offline.cjs`, `app/check-app.cjs`, `app/check-release-privacy.cjs`, `app/verify-build.cjs`, `app/package.json` and the four tracked GitHub Actions workflow files. The inspected files do not contain direct references to the five relocated root documentation stubs or the 22 relocated `docs/` stubs. The release packaging script explicitly includes root release notes, installation guide, user guide, backup format and third-party notices; the offline build also includes third-party notices. `.github/workflows/validate-hotfix.yml` watches `RELEASE-NOTES-*.md`. The historical `publish-v1.0.0.yml` workflow explicitly lists root package members for v1.0.0.

This is a **targeted inspection of listed tooling**, not a claim that all code, documentation, external links or automation consumers have been checked. No temporary stub was removed. No build or browser test was executed.

## Documentation navigation and selected canonical files, 22 October 2026

Read `docs/README.md` and the Architecture, Audits, Releases, Roadmaps, Standards and Testing section indexes. The displayed Markdown navigation targets correspond to files present in the branch tree, including the new archive index. Also inspected Markdown link syntax and accidental `docs/docs/` duplication in six canonical documents: `docs/architecture/DISCOVERABILITY.md`, `docs/architecture/V1.2.0-DEVICE-FORM-TABS-PLAN.md`, `docs/audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md`, `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md`, `docs/workflows/TECHNICAL-WORKFLOWS.md` and `docs/standards/DEVELOPMENT-WORKFLOW.md`. These six did not contain Markdown inline links or the duplicated prefix. This does **not** validate code-formatted path references or every other document body.

Repository code search returned no results for three targeted terms, but it searches the default branch rather than the active documentation branch; it is **not valid negative evidence** for the current branch. Continue using branch-specific file inspection before removing stubs. No stubs removed, no build run and no application code modified.

## Additional reference corrections, 22 October 2026

Inspected `README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `SECURITY.md`, and six more canonical documentation files for selected old-path and ambiguous cross-directory references. Corrected two references in root `ROADMAP.md` from `docs/ROADMAP-DESIGN-NOTES.md` to `docs/roadmaps/ROADMAP-DESIGN-NOTES.md`. Made cross-directory document references explicit in `docs/standards/FUNCTION-NAMING-AND-REFERENCE.md` and `docs/audits/WF-01-TO-WF-04-CROSS-REFERENCE-RECONCILIATION.md`. This is a targeted text inspection, not a full Markdown or repository-wide link validation. The temporary stubs remain in place. No application code or release assets changed.

## Further technical and testing reference reconciliation, 22 October 2026

Inspected twelve additional canonical documents across Testing, Audits, Architecture and Releases for selected old-path, duplicated-prefix and ambiguous cross-directory references. Clarified six references: one workflow source path in `docs/testing/WF-04-IPAM-NETWORK-TEST-MATRIX.md`, four cross references in `docs/audits/P11-EXPLANATORY-COMMENT-IMPROVEMENT-REGISTER.md`, and one function-reference path in `docs/audits/WF-01-TO-WF-04-FUNCTION-AND-COMMENT-RECONCILIATION.md`. The companion test matrix reference in `docs/testing/WF-02-SAVING-AND-INTEGRITY-TEST-MATRIX.md` points to a file in the same directory and was retained.

These checks were targeted textual inspections, not comprehensive path extraction, link validation or executed tests. All 27 compatibility stubs remain until the remaining repository references have been reconciled.

## Roadmap readability correction, 22 October 2026

Found one literal escaped newline (`\\n`) joining M-007 and M-006 in the candidate table of `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md`. Replaced it with an actual line break, restoring the two distinct Markdown table rows. The candidate register changed from seven physical `| M-` rows to eight; candidate wording and status were not altered. No maintenance item was implemented, and no application code or tests changed. This correction does not establish that every table row is valid or that the roadmap priorities are approved.

## Release-facing guide link spot check, 22 October 2026

Read the release-packaged root `INSTALLATION.md`, `USER-GUIDE.md`, and `BACKUP-FORMAT.md`, plus canonical `docs/releases/RELEASE-CHECKLIST.md`, `docs/releases/RELEASE-ACCEPTANCE.md` and `docs/standards/DEVELOPMENT-WORKFLOW.md`. In this targeted inspection, installation and user guide links point to retained root-level release files; the release checklist links to the existing archive policy via `../archive/README.md`. No stale relocated `docs/FILE.md` reference or doubled `docs/docs/` prefix was found in these six files. This is not a full automated link checker or runtime test. Release-packaged root guides remain in place and the 27 compatibility stubs are still retained.

## Additional architecture, audit and test document path checks, 22 October 2026

Inspected twelve further canonical documents: `docs/architecture/TAILWIND-V4-EVALUATION.md`, `docs/architecture/V1.1-IPAM-HIERARCHY-DESIGN.md`, `docs/architecture/V1.2.0-DEVICE-FORM-TABS-PLAN.md`, `docs/roadmaps/ROADMAP-DESIGN-NOTES.md`, `docs/releases/RELEASE-REVIEW.md`, `docs/audits/PATCH-RELEASE-RECONCILIATION-CHECKLIST.md`, `docs/audits/WF-01-TO-WF-04-CROSS-REFERENCE-RECONCILIATION.md`, `docs/audits/WF-01-TO-WF-04-FUNCTION-AND-COMMENT-RECONCILIATION.md`, `docs/testing/WF-01-RECOVERY-TEST-PLAN.md`, `docs/testing/WF-02-SAVING-AND-INTEGRITY-TEST-MATRIX.md`, `docs/testing/WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md` and `docs/testing/WF-05-RACK-OCCUPANCY-REGRESSION-MATRIX.md`. No matches for the targeted old `docs/FILE.md` references, doubled `docs/docs/` paths, Markdown links to `.md` files, or selected ambiguous cross-directory names were found. This negative result applies **only to the search patterns used**, not to every possible reference form. No edits to these twelve files were needed. Continue retaining compatibility stubs pending a comprehensive branch-wide link and path audit.

## Repository entry-point Markdown links, 22 October 2026

Read and extracted Markdown link destinations from `README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/README.md`, `docs/getting-started/README.md` and `docs/archive/README.md`. Compared representative local targets including root release guides and notes, contributor standards, relocated release and roadmap documents, the relocation register and three README screenshots against the current branch tree; all checked targets exist. External URLs and in-page anchors were not verified. This is an entry-point review and selected tree cross-check, **not** a comprehensive repository-wide Markdown link checker. All 27 compatibility stubs remain in place; no application code, package contents or published release was changed.
