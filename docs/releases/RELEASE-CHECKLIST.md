# Release Checklist

Use this checklist for every Caffoot Lite release, including patch releases. Keep changes on a reviewable branch and do not publish until the release owner approves.

## Before merging
- [ ] Inventory the complete feature-branch and main-branch file trees; confirm no local dummy-data generator, large generated inventory, private backup, credential, token, private key or customer data is tracked.
- [ ] Review repository history for accidentally committed sensitive material; a clean current tree does not prove history is clean. Escalate suspected secrets privately and rotate exposed credentials as appropriate.
- [ ] Run the repository privacy/security checks and inspect findings; do not rely on `.gitignore` to protect files already tracked or committed.
- [ ] Inspect generated standalone HTML and the exact release ZIP member list, including both reviewed fictional fixtures. Reject any unexpected test files, development utilities, private data or external dependencies.
- [ ] Review dependency versions, outbound network behaviour, CSP/browser mitigation decisions, and documented security limitations.
- [ ] Review all user-facing documentation and embedded Help & Guides against the current application, while preserving accurate historical release records.
- [ ] Inventory mandatory root documents, current documentation and archive candidates; preserve historical records and build inputs.
- [ ] Prepare to move the previous release's notes into [`docs/archive/release-notes/`](../archive/release-notes/README.md) once the new release is published, checking repository links and release tooling first. Keep the new current version's release notes at the repository root.
- [ ] Check public stable-release version statements and review affected website feature reference documents.
- [ ] Record reviewed, updated, archived and deliberately unchanged documents with release approval evidence.
- [ ] Review technical documentation against the release and identify genuinely superseded version-specific documents; prepare replacements and archive candidates under `docs/archive/vX.Y.Z/` using the [archive policy](../archive/README.md).
- [ ] For each archive move, check relative links, historical references, source/build consumers and release-critical root files; preserve necessary compatibility links and record the verification evidence.
- [ ] Confirm version in application, package metadata, release notes and filenames.
- [ ] Run the full local release command and confirm every automated check passes.
- [ ] Test the built standalone HTML in a browser and offline.
- [ ] Test JSON backup export, import/restore, and persistence with disposable data.
- [ ] Review security, rollback and compatibility changes as appropriate.
- [ ] Review README, INSTALLATION, USER-GUIDE, ROADMAP, BACKUP-FORMAT, release notes and relevant design documents for version accuracy, links and unfinished draft wording.
- [ ] Update and manually review the built-in offline Help & Guides topics for any new or changed features, controls, labels, safety guidance and navigation.
- [ ] Confirm source on the review branch matches the tested build; inspect merge changes.
- [ ] Merge only after review and owner approval.

**Optional targeted checker:** Run `npm run check:release-docs` from `app/` to check the current published release when package metadata still identifies that release. For a future candidate, run `npm run check:release-docs -- --candidate --published-version 1.3.0` with the **actual** published version in place of the example. Candidate mode requires candidate release notes named for the package version, but deliberately checks public stable version claims against the separately supplied published version. Run `node ../scripts/check-release-documentation.cjs --self-test` for positive and negative fixtures. These checks do not verify prose, links, packaging or publication status, are not part of CI or `npm run release`, and require a complete local checkout. Do not use the published mode after package metadata has advanced to a candidate version. Human review remains mandatory.


**GitHub pull request observation:** The `Release documentation consistency` workflow now runs on every pull request, with published or candidate mode selected from package and README version statements. Draft PR #52 produced a successful live GitHub Actions result before removal of the path filter. Recheck the revised workflow run before proposing mandatory status check enforcement. This automated check remains advisory until the product owner separately approves GitHub ruleset or branch protection changes. Human documentation sign-off is mandatory regardless.

## Mandatory documentation consistency sign-off

Complete this review for every release candidate, including maintenance releases. Record the results in the existing release handover or review record rather than opening a separate process document.

- [ ] Identify the exact **currently published** version and the **proposed** release version separately. Before publication, do not describe the candidate as already published.
- [ ] Check current-version claims in `README.md`, `INSTALLATION.md`, `USER-GUIDE.md`, `SECURITY.md`, `ROADMAP.md`, `BACKUP-FORMAT.md`, current release notes, `docs/README.md`, relevant feature and website reference pages, and embedded Help & Guides. Mark each reviewed, updated or not applicable with a reason.
- [ ] Confirm the proposed version, ZIP name, standalone HTML name, licence notices and expected asset list agree with the approved release build. Preserve correct historical version references and release notes.
- [ ] Check all changed relative documentation links and screenshot paths on the release candidate. Check the rendered public entry points and current download guidance; record any blocked external checks as outstanding.
- [ ] Confirm the release notes and documentation needed by the release package are present before moving or archiving files. Review archive redirects and references after moves.
- [ ] Reconcile technical workflows, applicable test matrices, open findings, maintenance roadmap and master audit statuses with the actual checks executed. Distinguish source inspection, automated results and owner-reported browser tests.
- [ ] Record who reviewed the documentation, evidence links, unresolved risks and the product owner's explicit merge or release approval. A green build alone does not authorise publication.

**After publication:** Recheck the actual latest release and its downloadable assets, then update the documentation to describe the newly published version. Complete the existing post-release archive and link checks before declaring documentation closeout finished.

## Publishing
- [ ] Recheck all intended public release assets for sensitive information and unexpected files immediately before upload.
- [ ] Create the version tag from the intended main commit.
- [ ] Publish the release with approved release notes, versioned ZIP, standalone HTML and SHA256SUMS.
- [ ] Check that Latest/pre-release settings are correct.
- [ ] Verify public downloads and compare SHA256 checksums with the original local build.
- [ ] Verify the ZIP opens and includes the intended guides, licences and notices.

## After publishing
- [ ] Update main-branch documentation from release-candidate to published status in a separate reviewable documentation change.
- [ ] Archive the previous release's notes without changing their historical content; update internal links and verify that the new current release notes remain at the root.
- [ ] Verify latest-release links and release asset names.
- [ ] Confirm the release tag remains unchanged after documentation-only housekeeping.
- [ ] Merge the documentation closeout change after review, including approved version archive moves and their version index.
- [ ] Confirm current documentation and archived version files are visible on `main` before relying on automatic source-branch deletion.
- [ ] Delete completed development/housekeeping branches only after all changes are safely merged.
- [ ] Record any remaining follow-ups for the next milestone.

## v1.1.0 closeout record — 18 October 2026

Published release: https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.1.0

The owner confirmed successful automated release, manual browser/offline and backup/restore tests. The downloaded ZIP and extracted release HTML matched the original local build hashes:

- ZIP: `3FBD5A5050C998D5A49FC834F0E0E13C0C88CFCD9433334777CFEFCA65468239`
- HTML: `0D5901373F50A9081AF6211B1D9BA0ED9832374857191983DBE3ACB52C62111C`

Documentation closeout and branch deletion remain subject to review and completion.

## v1.1.1 closeout record — 18 October 2026

Published release: https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.1.1

- [x] Owner completed nine browser acceptance checks, including offline operation and disposable backup/restore.
- [x] Automated regression suite, standalone build and versioned ZIP packaging passed.
- [x] GitHub Actions validation passed after updating the version check to follow package metadata.
- [x] PR #39 reviewed and merged into `main` with owner approval.
- [x] Public stable v1.1.1 release verified with ZIP, standalone HTML and SHA256SUMS assets.
- [ ] Compare public asset SHA256 hashes with the original locally generated artifacts; record results when checked.
- [ ] Confirm the historical v1.1.1 documentation closeout PR status if needed; this historical record is retained.

This record is historical; the reusable checklist above remains unchecked for the next release.

## v1.1.2 closeout record — 19 October 2026

Published release: https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.1.2

- [x] Owner completed final clean dependency installation and release pipeline.
- [x] Final standalone HTML SHA256 matched the previously tested build; release ZIP and SHA256SUMS were generated and matched.
- [x] GitHub release validation and Gitleaks Git-history checks passed on PR #44.
- [x] Owner approved PR #44; it was squash-merged into `main`.
- [x] Owner confirmed publication of v1.1.2 with standalone HTML, ZIP and checksum manifest.
- [ ] Independently verify public asset downloads and their checksums.
- [ ] Merge the v1.1.2 post-release documentation closeout PR after review.

The reusable checklist above remains unchecked for the next release.


## v1.3.0 documentation baseline closeout, 23 October 2026

This is a **documentation publication review**, not a new application release or a declaration that the original technical audit is complete. The decision record is [v1.3.0 documentation baseline closeout](../audits/V1.3.0-DOCUMENTATION-BASELINE-CLOSEOUT.md). Draft PR #52 remains open and requires explicit product owner merge approval.

- [x] Compare the PR's changed-file paths against application source boundaries: 44 changed paths, comprising documentation, screenshot images, repository contribution template, validation workflow, npm check command and documentation check scripts. No application HTML source path is changed. This is path review, not a full byte-level or sensitive-data review.
- [x] Record the three passing GitHub Actions results on commit `4a44b057903982a81110d8535d268221dbdd5041`: documentation consistency 39933151092, release candidate validation 39933151070 and Git history secret scan 39933151056.
- [x] Record product owner positive feedback on the revised README wording. This is not approval to merge.
- [x] Confirm all three checks on documentation checkpoint `2fe5cb36264b821e925873b3676f17526d751eca`: documentation consistency 39935123617, release candidate validation 39935123615 and Git history secret scan 39935123699. Owner visually confirmed the two new overview screenshots show correct screens and fictional data. These results do not cover later commits.\n- [ ] Complete independent full diff and sensitive-data review, including the remaining screenshots and external destinations; record any blocked checks rather than claiming success.
- [x] Recheck master audit, WF-11 to WF-13, WF-14, documentation relocation register, maintenance roadmap and this checklist for shared status: technical verification remains incomplete; WF-14 and M-030 remain open; documentation baseline publication is not technical audit completion. Historical checkpoint statements remain dated evidence.\n- [ ] Final publication sign-off still requires the independent review limits to be resolved or explicitly accepted by the owner.
- [ ] Obtain explicit product owner approval to merge PR #52. No merge or release has been performed.
- [ ] After an approved merge, verify public `main` links, version claims and screenshot paths, then configure and verify the required documentation check under repository rules without weakening other protections.

**Still open:** WF-11 to WF-13 technical verification, WF-14 final public review and M-030 publication and required-check enforcement. No new application or browser tests were executed at this checkpoint.


## Final status alignment review, 23 October 2026

Re-read the master coverage audit, WF-11 to WF-13 reconciliation, WF-14, documentation relocation register, maintenance roadmap and baseline closeout record. Their operative status is consistent: v1.3.0 remains published, PR #52 is draft and unmerged, the technical audit remains in progress, and WF-13, WF-14 and M-030 are not closed. Older checkpoint notes mentioning pending CI remain historical and are superseded by exact commit-specific results above. No application or browser tests were executed during this source-document reconciliation. No merge, release or protection change. This checklist update requires fresh CI verification.

## Documentation baseline publication outcome, 23 October 2026

The product owner authorised proceeding with PR #52, and GitHub confirmed the squash merge into `main` as `f03159349f722499b41c92b90f9637b3a9cecadf`. The three PR checks passed on final head `7d32240ade4f9882878037f58140fac74bf61ed8`: release candidate validation 39935293996, documentation consistency 39935293999 and history secret scan 39935294000. GitHub confirmed `main` matched the merge commit. The unchecked approval and merge steps in the preceding dated preparation checklist are superseded by this outcome; the independent review limits and required-check enforcement remain open. No new application or browser tests were executed for this status update, and no new application release or repository protection change occurred. Master audit remains in progress; WF-13, WF-14 and M-030 are open.

## M-030 active GitHub ruleset checkpoint, 23 October 2026

The product owner provided GitHub Settings screenshots confirming creation and subsequent activation of the ruleset **Protect main and require validation**. GitHub displayed **Ruleset updated**, **Active**, target **Default** resolving to `main`, and an empty bypass list. Saved rule screenshots show **Require a pull request before merging** with zero required approvals, **Restrict deletions**, **Block force pushes**, and **Require status checks to pass** with **Release documentation consistency** from **GitHub Actions** as the sole required check. The optional `validate` check was removed to avoid requiring a job whose coverage across every pull request has not been established. Branch-up-to-date enforcement was not selected.

This is product owner screenshot evidence of configuration and activation, **not** an executed attempt to merge a failing pull request under the active ruleset. Earlier positive GitHub workflow results and the deliberate failing PR #53 remain valid checker evidence, but PR #53 was run before enforcement. The documentation consistency workflow is configured for every pull request; its actual required-check enforcement after activation remains to be observed on a new pull request. M-030 is **partially implemented, enforcement observation pending**, not fully closed. WF-11 to WF-14 and the master technical audit remain in progress. No application behaviour was changed, no new release was published and no application or browser tests were executed in this checkpoint. The ruleset was changed by the product owner through GitHub Settings, not by a repository commit.

### M-030 required check name correction and live PR observation, 23 October 2026

On PR #55, GitHub initially showed an **Expected, waiting for status** requirement for `Release documentation consistency`, despite the actual `Release documentation consistency / release-documentation (pull_request)` job passing. This demonstrated that the ruleset had the workflow display name rather than the emitted job check name. The product owner edited the active ruleset, replacing that entry with **`release-documentation`**, sourced from GitHub Actions. On refreshing PR #55, the owner provided a screenshot showing **All checks have passed**, **2 successful checks**, **No conflicts with base branch** and an enabled **Squash and merge** control. The actual GitHub Actions runs for PR head `79cf05eecf7df8d3f011b89307f054d1f7ccbfba` were release documentation consistency 39937585696 and Git history secret scan 39937585755, both successful. This is observed positive enforcement and correct required check resolution on a live pull request. A fresh negative enforcement attempt under the active ruleset was not executed; earlier deliberate failing PR #53 demonstrated checker rejection before activation, not protected-branch rejection. M-030 implementation and positive observation are verified; retain any negative enforcement evidence gap explicitly rather than claim a new negative test passed. The master audit and WF-11 to WF-14 remain in progress. No application changes or new release; no application or browser tests executed. PR #55 remains subject to product owner approval before merging.


## WF-13 historical release CI evidence recovery, 23 October 2026

The original v1.3.0 release candidate [GitHub Actions run 39605067641](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39605067641), job `119239027726`, completed successfully on 21 October 2026 for commit `be778285e6d1180052802255d1c283abfbd5238e`. The downloaded job log confirms the `npm run release` chain, including 29 named checks, build, build verification and packaging. The companion history secret scan run `39605067721` succeeded. GitHub compare reports no file changes between that tested revision and published v1.3.0 merge commit `92d6a60b0e4bc9f73589b27820cb283def377dbd`.

This is **recovered historical evidence, not a fresh test**. The main-branch `caffoot-lite.yml` workflow defines four additional Chromium browser scripts, but a successful historical run for the published revision has not yet been independently located. Published asset hash verification and the remaining WF-13 source-to-test mapping remain open. The [WF-11 to WF-13 reconciliation](../audits/WF-11-TO-WF-13-BASELINE-RECONCILIATION.md) and [master audit](../audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md) agree that WF-13 and the wider technical audit are in progress. No new application tests, application changes, merge or release were performed for this evidence recovery.


## Evidence update and documentation gate, 23 October 2026

The earlier evidence section is historical. Later Chromium runs 39940647187, 39944710633, 39955498407, 39957395113 and 39959581469 were recorded as passing for their targeted scenarios. Published ZIP integrity and representative v1.2.1 backup compatibility were verified in run 39961182872. These were previously executed tests, not fresh checks, and do not certify all workflow gates.

Before the next release, check the exact release commit, built HTML, ZIP and version statements. Reconcile affected workflows, test matrices, function references, findings, roadmap, master audit and release notes. Record any outstanding P12 gates and obtain explicit owner approval. M-030 remains open: this written gate is not yet automated or verified. See [workflow verification coverage](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md).
