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

## Final verification procedure documented, 22 October 2026

Added `docs/audits/DOCUMENTATION-LINK-VERIFICATION-PLAN.md` and linked it from the Audits index. It defines branch-wide link and anchor checks, textual references, automated consumers, compatibility stub review, evidence requirements and sign-off conditions. **The plan has been documented, not executed.** The relocation remains in progress and all 27 compatibility stubs are retained. No application code, release package or published release was modified.

## Branch-tree link verification, first twelve navigation files, 22 October 2026

Captured the branch tree at commit `6c6553cdea78c699f1be86b8d721b66311a16112`, containing 88 tracked Markdown files. Read twelve entry-point and section-index documents: `docs/README.md`, `docs/audits/README.md`, `docs/standards/README.md`, `docs/testing/README.md`, `docs/releases/README.md`, `docs/roadmaps/README.md`, `docs/architecture/README.md`, `docs/workflows/README.md`, `docs/getting-started/README.md`, `README.md`, `CONTRIBUTING.md` and `ROADMAP.md`. Resolved local inline Markdown link destinations relative to each source directory and checked their existence in the tree. The first six files contained 34 inline links; the remaining six contained 37 local inline links. **No missing local file destinations were found in these twelve files.** External URLs, fragment anchors, reference-style definitions, Markdown parser edge cases and the remaining Markdown files were not validated. This is a partial verification result, not relocation sign-off. All 27 stubs remain in place.

## Canonical architecture and audit inline-link check, 22 October 2026

Read six canonical Architecture documents and six canonical Audits documents from the documentation branch. Extracted inline Markdown link destinations using the same targeted pattern as the previous entry-point pass and compared any local file targets against the branch tree. **These twelve documents contained no matching local inline Markdown links**, so no missing file targets were detected in this batch. This is a zero-applicable-links result, **not** evidence that their code-formatted paths, reference-style links, heading anchors or plain-text mentions are valid. The branch-wide verification remains incomplete; no compatibility stubs were removed and no application files were changed.

## Standards, workflows, testing and release inline-link check, 22 October 2026

Read fourteen further canonical files: four standards (`DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md`, `DEVELOPMENT-WORKFLOW.md`, `FUNCTION-NAMING-AND-REFERENCE.md`, `TECHNICAL-DOCUMENTATION-POLICY.md`), the technical workflow master, six test matrices or plans (`WF-01-RECOVERY-TEST-PLAN.md`, `WF-02-IMPORTED-RACK-TEST-MATRIX.md`, `WF-02-SAVING-AND-INTEGRITY-TEST-MATRIX.md`, `WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md`, `WF-04-IPAM-NETWORK-TEST-MATRIX.md`, `WF-05-RACK-OCCUPANCY-REGRESSION-MATRIX.md`) and three canonical release documents (`RELEASE-ACCEPTANCE.md`, `RELEASE-CHECKLIST.md`, `RELEASE-REVIEW.md`). Extracted local inline Markdown destinations and checked against the branch tree. Two matching local links were present, one in the technical documentation policy and one in the release checklist; both targets exist. No missing local inline file targets were detected in this batch. Reference-style links, heading anchors, code-formatted and plain-text references, and other Markdown files remain outside this pass. The documentation relocation is not signed off and no application code was changed.

## Roadmap, user guide and release history inline-link check, 22 October 2026

Read fourteen more Markdown files on the documentation branch: `docs/roadmaps/ROADMAP-DESIGN-NOTES.md`, `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md`, `BACKUP-FORMAT.md`, `INSTALLATION.md`, `USER-GUIDE.md`, `SECURITY.md`, `app/README.md`, `assets/README.md`, `THIRD-PARTY-NOTICES.md`, `RELEASE-NOTES-1.3.0.md`, `RELEASE-NOTES-1.2.1.md`, `RELEASE-NOTES-1.2.0.md`, `RELEASE-NOTES-1.1.2.md` and `RELEASE-NOTES-1.1.1.md`. Seven matching local inline links were found (two installation, two user guide, two third-party notices and one v1.3.0 release note); all seven destinations exist in the branch tree. No missing local file targets were found with the selected extraction pattern. The remaining historical release notes, relocation register, compatibility stubs and other reference formats still need checking. This does not constitute full Markdown validation or application testing.

## Historical release notes and first compatibility stubs, 22 October 2026

Checked seven older root release notes (`RELEASE-NOTES-1.0.0-rc.1.md`, `RELEASE-NOTES-1.0.0.md`, `RELEASE-NOTES-1.0.1.md`, `RELEASE-NOTES-1.0.2.md`, `RELEASE-NOTES-1.0.3.md`, `RELEASE-NOTES-1.1.0.1.md`, `RELEASE-NOTES-1.1.0.md`) and seven compatibility stubs (`DEVELOPMENT-WORKFLOW.md`, `DISCOVERABILITY.md`, `RELEASE-ACCEPTANCE.md`, `RELEASE-CHECKLIST.md`, `RELEASE-REVIEW.md`, `docs/DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md`, `docs/FUNCTION-NAMING-AND-REFERENCE.md`). The seven release notes contained no matching local inline links. Each of the seven stubs had one local inline link and each destination exists in the branch tree. No broken file targets were found with this extraction method. Remaining stubs and other link forms have not been checked by this pass. No code changes or releases were made.

## Initial inline Markdown link pass completed, 22 October 2026

Read the final 22 tracked Markdown files: the 20 remaining `docs/` compatibility stubs, plus `docs/audits/DOCUMENTATION-RELOCATION-REGISTER.md` and the additional historical/canonical documents accounted for in preceding batches. More precisely, this final batch comprised `docs/P11-EXPLANATORY-COMMENT-IMPROVEMENT-REGISTER.md`, `docs/PATCH-RELEASE-RECONCILIATION-CHECKLIST.md`, `docs/ROADMAP-DESIGN-NOTES.md`, `docs/TAILWIND-V4-EVALUATION.md`, `docs/TECHNICAL-DOCUMENTATION-POLICY.md`, `docs/TECHNICAL-WORKFLOWS.md`, `docs/V1.1-IPAM-HIERARCHY-DESIGN.md`, `docs/V1.2.0-DEVICE-FORM-TABS-PLAN.md`, `docs/V1.2.0-DEVICE-MOUNTING-REVIEW.md`, `docs/V1.2.0-LOCATION-MOUNTING-SEPARATION.md`, `docs/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md`, `docs/V1.3.1-MAINTENANCE-ROADMAP.md`, `docs/WF-01-RECOVERY-TEST-PLAN.md`, `docs/WF-01-TO-WF-04-CROSS-REFERENCE-RECONCILIATION.md`, `docs/WF-01-TO-WF-04-FUNCTION-AND-COMMENT-RECONCILIATION.md`, `docs/WF-02-IMPORTED-RACK-TEST-MATRIX.md`, `docs/WF-02-SAVING-AND-INTEGRITY-TEST-MATRIX.md`, `docs/WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md`, `docs/WF-04-IPAM-NETWORK-TEST-MATRIX.md`, `docs/WF-05-RACK-OCCUPANCY-REGRESSION-MATRIX.md`, and `docs/audits/DOCUMENTATION-RELOCATION-REGISTER.md`. This list is **21 files**, not 22: the preceding cumulative count of 66 out of 88 overcounted by one. The initial inline-link checks therefore cover **87 distinct files** with one remaining file to reconcile against the tree. All 20 stub links in this batch resolve to existing destinations. The register has no matching local inline links. Do not call the initial pass complete until the missing file is identified and checked. Reference-style links, fragments and textual references remain pending regardless.

## Reconciled missing file from initial-pass count, 22 October 2026

Identified the one file omitted from the twelve-file entry-point batch and cumulative initial-pass count: `docs/archive/README.md`. Read it separately and found no matching inline Markdown links. The first-pass inventory is now reconciled to **88 of 88 distinct tracked Markdown files**, with no missing local file destinations detected by the targeted inline-link extraction pattern. This is **not** full Markdown validation: heading fragments, reference-style definitions, code-formatted paths, ordinary text references, external URLs and parser edge cases remain outside this check. No stubs removed and no application code changed.

## Deeper reference audit, first sample, 22 October 2026

Read seven navigation documents (`README.md`, `docs/README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/audits/README.md`, `docs/standards/README.md`, `docs/testing/README.md`) for inline fragment links and reference-style link definitions. Found one fragment link in root `README.md`: `#-security-and-deployment-guidance`, associated with the `## 🔐 Security and deployment guidance` heading at line 56. The heading exists, but the exact GitHub-generated fragment has **not** been confirmed against GitHub's slugging behaviour, so its validity remains open. No reference-style link definitions were found in this seven-file sample.

Read seven additional documents (`docs/workflows/TECHNICAL-WORKFLOWS.md`, `docs/standards/DEVELOPMENT-WORKFLOW.md`, `docs/standards/TECHNICAL-DOCUMENTATION-POLICY.md`, `docs/audits/DOCUMENTATION-RELOCATION-REGISTER.md`, `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md`, `RELEASE-NOTES-1.3.0.md`, `USER-GUIDE.md`) for the same fragment and reference-definition patterns. None matched. The audit register contains historical old-path mentions as evidence of earlier corrections, which must not be mistaken automatically for active broken links. This is a **partial deeper audit**, not a branch-wide fragment, reference-style or code-formatted path validation. No application code was modified.

## Deeper link syntax audit, architecture, audits, releases and roadmaps, 22 October 2026

Inspected twenty further canonical Markdown documents for inline links containing heading fragments and reference-style link definitions: seven architecture documents, five audit documents, four release documents and four roadmap documents. No matching heading-fragment links or reference-style link definitions were found in these twenty files. This is a pattern-based check of those two forms only; the absence of matches is not evidence that all filenames, code-formatted paths or external references are correct. The root README security heading fragment remains an open GitHub-rendering verification item. No application code or published release changed.

## Deeper link syntax audit, standards, tests and user guides, 22 October 2026

Inspected twenty-one additional Markdown documents for inline heading-fragment links and reference-style link definitions. These were four canonical standards, the workflow index, six canonical test plans/matrices, seven root and app/asset guides or notices, and three recent release notes (v1.3.0, v1.2.1, v1.2.0). None contained matches for the selected fragment or reference-definition patterns. These results do not validate code-formatted filenames, plain text paths, external destinations or GitHub heading-slug rendering. The root README security heading link remains an explicit open item. Documentation-only branch; no app code, merge or publication.

## Deeper link syntax audit, historical releases and compatibility documents, 22 October 2026

Checked twenty more Markdown documents for inline heading fragments and reference-style link definitions. Ten were historical release notes and the archive index (`RELEASE-NOTES-1.0.0-rc.1.md`, `RELEASE-NOTES-1.0.0.md`, `RELEASE-NOTES-1.0.1.md`, `RELEASE-NOTES-1.0.2.md`, `RELEASE-NOTES-1.0.3.md`, `RELEASE-NOTES-1.1.0.1.md`, `RELEASE-NOTES-1.1.0.md`, `RELEASE-NOTES-1.1.1.md`, `RELEASE-NOTES-1.1.2.md`, `docs/archive/README.md`). Ten were compatibility stubs (`DEVELOPMENT-WORKFLOW.md`, `DISCOVERABILITY.md`, `RELEASE-ACCEPTANCE.md`, `RELEASE-CHECKLIST.md`, `RELEASE-REVIEW.md`, `docs/DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md`, `docs/FUNCTION-NAMING-AND-REFERENCE.md`, `docs/P11-EXPLANATORY-COMMENT-IMPROVEMENT-REGISTER.md`, `docs/PATCH-RELEASE-RECONCILIATION-CHECKLIST.md`, `docs/ROADMAP-DESIGN-NOTES.md`). No matches were found for either selected pattern. This is not yet a complete deeper audit; remaining compatibility documents, README heading slug and textual path references remain pending. No app code changes.

## Deeper link syntax review, final compatibility batch, 22 October 2026

Inspected eighteen additional documents for inline heading-fragment links and reference-style link definitions: `docs/TAILWIND-V4-EVALUATION.md`, `docs/TECHNICAL-DOCUMENTATION-POLICY.md`, `docs/TECHNICAL-WORKFLOWS.md`, `docs/V1.1-IPAM-HIERARCHY-DESIGN.md`, `docs/V1.2.0-DEVICE-FORM-TABS-PLAN.md`, `docs/V1.2.0-DEVICE-MOUNTING-REVIEW.md`, `docs/V1.2.0-LOCATION-MOUNTING-SEPARATION.md`, `docs/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md`, `docs/V1.3.1-MAINTENANCE-ROADMAP.md`, `docs/WF-01-RECOVERY-TEST-PLAN.md`, `docs/WF-01-TO-WF-04-CROSS-REFERENCE-RECONCILIATION.md`, `docs/WF-01-TO-WF-04-FUNCTION-AND-COMMENT-RECONCILIATION.md`, `docs/WF-02-IMPORTED-RACK-TEST-MATRIX.md`, `docs/WF-02-SAVING-AND-INTEGRITY-TEST-MATRIX.md`, `docs/WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md`, `docs/WF-04-IPAM-NETWORK-TEST-MATRIX.md`, `docs/WF-05-RACK-OCCUPANCY-REGRESSION-MATRIX.md` and `docs/audits/DOCUMENTATION-RELOCATION-REGISTER.md`. Neither selected pattern matched in these files. Previous batch totals may contain overlapping files, so the count of **unique** files in the deeper pass needs reconciliation before any 88/88 claim. The README security fragment and code-formatted/plain-text path references are still pending. This is a documentation-only change.

## Written path references, entry points and standards sample, 22 October 2026

Reviewed thirteen navigation/entry-point documents (`README.md`, `docs/README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, the seven canonical subject indexes, `docs/getting-started/README.md` and `docs/archive/README.md`) and five further canonical standards/workflow/audit documents (`docs/standards/DEVELOPMENT-WORKFLOW.md`, `docs/standards/TECHNICAL-DOCUMENTATION-POLICY.md`, `docs/standards/DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md`, `docs/workflows/TECHNICAL-WORKFLOWS.md`, `docs/audits/DOCUMENTATION-LINK-VERIFICATION-PLAN.md`) for backtick-quoted Markdown filenames and textual `docs/...md` paths. The sampled root-level instructions in `ROADMAP.md`, `CONTRIBUTING.md` and `README.md` use canonical `docs/` destinations where applicable; the quoted paths in the standards policy and principles also name canonical destinations. The workflow handover instruction in `docs/standards/DEVELOPMENT-WORKFLOW.md` line 57 uses the local filename `DEVELOPMENT-WORKFLOW.md` to refer to the document itself, which is unambiguous in context. These are **manual spot checks**, not a comprehensive automated audit of all written paths or a claim that every occurrence was verified. The README security heading fragment is still pending exact rendering verification. No application changes.

## Written Markdown filename references, testing and maintenance documents, 22 October 2026

Reviewed sixteen canonical files: six testing matrices/plans, two roadmaps, five audit documents and three release documents. Extracted backtick-quoted Markdown filenames and textual `docs/...md` mentions for inspection. For ten documents containing distinct backtick-quoted Markdown filenames, checked each distinct filename against the branch tree as a repository-root path or as a path relative to the referring document. Across these ten documents there were 29 distinct **per-document** filename references; none were missing by that existence test. Documents with no matching backtick-quoted Markdown filenames do not count as proof that every textual reference is correct. The check is not a full Markdown parser, and a file existing at one of the two candidate bases does not prove that a reader will interpret the path correctly. Continue reviewing clarity and context, historical mentions and all remaining files before sign-off. No application code changed.

## Written filename checks, guides, architecture and technical workflow, 22 October 2026

Read 22 further documents: `BACKUP-FORMAT.md`, `INSTALLATION.md`, `USER-GUIDE.md`, `SECURITY.md`, `THIRD-PARTY-NOTICES.md`, `app/README.md`, `assets/README.md`, six canonical architecture documents (`DISCOVERABILITY.md`, `TAILWIND-V4-EVALUATION.md`, `V1.1-IPAM-HIERARCHY-DESIGN.md`, `V1.2.0-DEVICE-FORM-TABS-PLAN.md`, `V1.2.0-DEVICE-MOUNTING-REVIEW.md`, `V1.2.0-LOCATION-MOUNTING-SEPARATION.md`), `docs/standards/FUNCTION-NAMING-AND-REFERENCE.md`, `docs/audits/DOCUMENTATION-LINK-VERIFICATION-PLAN.md`, `docs/audits/PATCH-RELEASE-RECONCILIATION-CHECKLIST.md`, `docs/releases/RELEASE-ACCEPTANCE.md`, `docs/releases/RELEASE-CHECKLIST.md`, `docs/workflows/TECHNICAL-WORKFLOWS.md`, and `RELEASE-NOTES-1.3.0.md`, `RELEASE-NOTES-1.2.1.md`, `RELEASE-NOTES-1.2.0.md`. Only the canonical function reference matched the targeted backtick-quoted `.md` filename pattern, with two distinct filenames; both existed in the branch tree under either repository-root or referring-document-relative interpretation. The other 21 files contained no matches for that exact pattern. This does not validate ordinary-text references or every form of Markdown path, nor does it settle README fragment slugging. No code or release changes.

## Written filename checks, historical releases and navigation, 22 October 2026

Checked 25 documents for backtick-quoted Markdown filenames: nine historical release notes from `RELEASE-NOTES-1.0.0-rc.1.md` through `RELEASE-NOTES-1.1.2.md`, three canonical standards (`DEVELOPMENT-WORKFLOW.md`, `TECHNICAL-DOCUMENTATION-POLICY.md`, `DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md`), and thirteen navigation or entry-point files (`README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/README.md`, `docs/archive/README.md`, and the eight canonical subject/getting-started indexes). The nine historical notes contained no matches. The standards had five distinct per-document filename references, and the navigation group had seven, all of which exist under repository-root or referring-file-relative interpretation. This is an existence check only, not confirmation of reader interpretation, historical text or GitHub fragment behaviour. The root README security fragment remains open. No application code changed.

## Written filename checks, remaining compatibility documents, 22 October 2026

Read the remaining 22 `docs/` compatibility stub documents for backtick-quoted Markdown filenames, and additionally searched ten of the WF/roadmap stubs for literal `docs/...md` references. None of the 22 stubs contained a backtick-quoted Markdown filename matching the selected extraction pattern, and none of the ten additional samples contained literal `docs/...md` references. Their active canonical links were previously checked in the initial inline-link pass. This completes the targeted **backtick-formatted filename existence** checks of the tracked Markdown inventory, subject to reconciliation of unique-file coverage; it does not constitute a complete ordinary-text path audit, does not verify GitHub heading slug behaviour, and does not approve merging. No application code changed.

## Unique-file reconciliation of deeper syntax review, 22 October 2026

Reconciled the filenames explicitly listed in the deeper heading-fragment and reference-definition review batches against the recursive Git tree for this branch. The tree contains 88 tracked Markdown files. The earlier batch totals counted repeated inspections of some documents, and should not be interpreted as 88 distinct files reviewed. The unique-path reconciliation found 87 previously listed distinct paths and identified `docs/getting-started/README.md` as the one remaining path. Checked that file directly: it has no matches for the selected inline heading-fragment, reference-style definition or backtick-quoted Markdown filename patterns. Its navigation links point to root guides and the docs homepage; those relative destinations were covered by the earlier initial link check. **Result: 88 of 88 distinct Markdown files have now been covered by the targeted deeper syntax-pattern review**, with the limitation that the regex patterns are not a complete Markdown parser and do not verify rendered GitHub heading slugs, every ordinary-text reference or external URLs. The `README.md` security heading fragment still needs exact rendering confirmation. No merge, release or application changes.

## README published-release status correction, 22 October 2026

Final quality review found a substantive stale instruction in root `README.md`: it described v1.3.0 as an unpublished release candidate, called v1.2.0 the current release and repeated v1.2.0 publication-preparation wording. Verified the GitHub latest-release API returns the published, non-draft, non-prerelease v1.3.0 release with `published_at` 2026-10-21T13:12:55Z and release page `https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.0`. Corrected those README statements on the documentation branch in commit `6363f24fa9691cf81a9ab6565f171093945caaf0`. Retained storage, backup and security warnings. This was a real content defect rather than a broken link. README security heading fragment rendering remains unverified; release packaging and hard-coded consumers remain outstanding before documentation sign-off. No application code, release or main branch changes.

## Release consumer inspection, 22 October 2026

Inspected the actual source of `app/package-release.cjs`, `app/build-offline.cjs`, `app/verify-build.cjs`, `app/package.json`, `.github/workflows/caffoot-lite.yml`, `.github/workflows/publish-v1.0.0.yml` and `.github/workflows/validate-hotfix.yml` for Markdown and relocated-document consumers. The current packaging script uses root-level `RELEASE-NOTES-<version>.md`, `THIRD-PARTY-NOTICES.md`, `INSTALLATION.md`, `USER-GUIDE.md` and `BACKUP-FORMAT.md` (plus licences and fixtures), which remain at their existing locations. The offline builder reads root-level third-party notices. The historical v1.0.0 publishing workflow expects root-level release guides and its version-specific notes. The hotfix validation workflow watches `RELEASE-NOTES-*.md`; the normal build workflow uses `app/**` paths and executes the release build. No examined consumer requires a relocated `docs/` source path, so no path correction is indicated by this targeted source inspection. This is **not** a full executable packaging or CI run, and it does not certify all possible consumers. README's emoji-heading fragment still awaits exact GitHub-rendered slug confirmation. No application code changed.

## README security fragment simplification, 22 October 2026

The README's only identified heading-fragment link formerly targeted `#-security-and-deployment-guidance`, corresponding to a heading beginning with a lock emoji. GitHub's exact rendered slug was not independently verified. To remove reliance on emoji-specific heading slugging, changed the heading to plain `## Security and deployment guidance` and the inline link to `#security-and-deployment-guidance` in documentation-only commit `9a319cfc57fda1d87d0e87557361f4d9eac35e7f`. The link and heading now have the same ordinary lower-case, hyphenated text under standard GitHub heading rules. This is a source-level risk reduction, **not** a claim that the rendered link was clicked or browser-tested. Security guidance and backup warnings were preserved. Remaining verification should review ordinary-text paths and any unexamined hard-coded consumers, then record a merge-readiness decision without merging automatically.

## Ordinary written paths and historical evidence review, 22 October 2026

Sampled ordinary `.md` mentions that are not Markdown links in `docs/README.md`, canonical development workflow and technical documentation policy, canonical v1.3.1 maintenance roadmap, canonical v1.3.0 documentation coverage audit, `CONTRIBUTING.md` and root `ROADMAP.md`. Active technical-policy references point to canonical `docs/workflows/` and `docs/standards/` files. The handover instruction naming `DEVELOPMENT-WORKFLOW.md` refers to the document containing that instruction. The root roadmap mentions root-level release guides which remain present. **Important distinction:** the maintenance roadmap and coverage audit contain statements that the v1.3.0 release notes still describe a draft. These are evidence records of a previously observed discrepancy, not proof that v1.3.0 is currently unpublished. The latest GitHub release API independently confirms v1.3.0 was published on 21 October 2026, and root README release status was corrected separately. Do not silently rewrite historical audit observations; reconcile M-016 and the release-notes document explicitly under the maintenance review after checking the published tag and assets. The current ordinary-path check is a targeted sample, not exhaustive verification of all Markdown prose or non-Markdown files. No application code or published release changed.

## Additional non-Markdown consumer review and readiness gate, 22 October 2026

Extended targeted source inspection to `app/check-app.cjs`, `app/check-release-privacy.cjs`, `app/check-offline.cjs`, `app/check-network-surface.cjs`, `app/test-browser-upgrade.cjs`, `app/test-backup-contract.cjs` and `.github/workflows/git-history-secrets.yml`. Searched their source lines for `.md`, `docs/`, README and root release-guide names. No matching references were found in these seven files. Together with the previously inspected package and workflow scripts, this provides useful evidence that the relocated `docs/` paths are not consumed by these selected executable entry points. It is not a comprehensive repository-wide text search and does not establish that tests have passed.

**Merge-readiness decision: not yet signed off.** The targeted Markdown link and syntax reviews cover all 88 Markdown files, and 27 compatibility stubs remain. README release status and security anchor were corrected. Outstanding before an unconditional sign-off: exhaustive plain-text reference search across tracked files, independent rendered-link check if required, and any release/package execution evidence selected by the owner. Preserve the historical M-016 release-notes observation and address it in the maintenance review, not by silent alteration. The branch remains documentation-only and unmerged.

## Targeted executable and configuration inventory reconciliation, 22 October 2026

Enumerated the recursive branch tree and identified 45 selected `.cjs`, `.yml` and `.json` configuration/executable files, excluding fixture JSON and the generated dependency lockfile. Reconciled prior inspections of the package script, offline builder, build verifier, application/offline/network/privacy checks, package configuration and four GitHub workflow files, and inspected the remaining JavaScript test and support files in three additional batches. The latter batches found no source lines matching `docs/`, `.md`, `README`, `INSTALLATION`, `USER-GUIDE` or `BACKUP-FORMAT`. Earlier checks found expected root-level release-guide consumers in the packaging and historical publishing scripts; those root files remain. This is a **targeted literal-pattern source search across the selected 45-file inventory**, not an exhaustive search of all repository files, dynamically constructed paths or generated artefacts, and not execution of tests or release packaging. No evidence from these inspections calls for changing code or release packaging.

**Readiness:** documentation branch remains unmerged. Before unconditional sign-off, consider an exhaustive text search over other tracked source formats and ordinary prose references, and run any owner-approved validation needed to establish rendered links or release package behaviour. Maintain M-016 as a separate reviewed maintenance issue. No application or published-release changes.
