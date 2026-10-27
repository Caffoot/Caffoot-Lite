# Development Workflow — Caffoot Lite

## Preferred workflow: update the existing development copy

For routine development batches, **prefer downloading only changed files** from the active GitHub feature branch into the existing local development checkout using Windows PowerShell. Do not repeatedly download and extract the whole repository unless required.

This is a **development-only** workflow, never an instruction to overwrite a published installation or customer inventory. The official repository is https://github.com/Caffoot/Caffoot-Lite.

### Before downloading

1. Confirm the active feature branch and the precise files changed in the batch. Never assume a branch name from an earlier release.
2. Confirm PowerShell is running in the `app` directory of the **development checkout**, not a published release directory.
3. Confirm there are no uncommitted local edits to the target files; this workflow **overwrites** those files. Preserve any local changes first.
4. Download only the required files; include `package.json` or lockfile only when actually changed. Do not download test-only utilities into a public release package.

### PowerShell template

Edit `$branch` and `$files` to match the current approved batch:

```powershell
$branch = "feature/v1.1.2-security-hardening" # EXAMPLE: verify the active branch
$base = "https://raw.githubusercontent.com/Caffoot/Caffoot-Lite/$branch/app"
$files = @(
    "caffoot-lite.html",
    "test-security-managed-fields.cjs",
    "package.json"
) # EXAMPLE: replace with the actual changed files

foreach ($file in $files) {
    Invoke-WebRequest -Uri "$base/$file" -OutFile ".\$file" -ErrorAction Stop
    Write-Host "Downloaded $file" -ForegroundColor Green
}
```

If any download fails, **stop** and investigate rather than testing a partially updated checkout. For multi-file changes, prefer downloading to a temporary directory first and copying into place only after every download succeeds.

### Validate

1. Run the focused tests relevant to the batch (for example `npm.cmd run check:security-managed-fields`).
2. Run `npm.cmd run release` for the complete test/build/package validation.
3. If dependencies are missing or `package-lock.json` changed, run `npm.cmd ci --no-audit --no-fund` before the tests.
4. Open the freshly built `app/dist/Caffoot-Lite.html` and perform relevant browser checks, including offline operation and backup/import compatibility where applicable.
5. Verify the generated release HTML/ZIP does **not** include test-data generators, sample inventory, or development-only artifacts. Keep the default installation clean.
6. Record results and failures before requesting approval to merge or publish.

### Exceptions and release controls

Use a fresh checkout/ZIP when files have been moved or removed, a large set of files changed, the local checkout is uncertain, or incremental updates would be unreliable. Never copy arbitrary downloaded files into a customer's live installation.

**Do not merge, tag, publish, or change the stable release without explicit project-owner approval.** Update release notes and versioned repository documentation as part of every version change. Development builds and packages are not published releases.

## Mandatory chat-session handover continuity

At the end of **every development chat-session handover**, append a section titled **Continuity and Development Workflow — Mandatory**. This requirement applies to all future Caffoot Lite development sessions, not only v1.1.2.

The handover must:
1. Link to this `DEVELOPMENT-WORKFLOW.md` and explicitly instruct the next session to read and follow it **before suggesting local downloads, commands, tests or repository changes**.
2. Record the official repository, active feature branch, **last verified commit SHA**, stable published version, changed files, and any uncommitted or untested work. Never assume the branch or SHA remains current: verify against GitHub at the start of the new session.
3. Record decisions already agreed with the project owner, including naming, compatibility, safety, UX, testing and release constraints. Do not silently overturn those decisions.
4. **Default to the existing Windows PowerShell `app` development folder.** Give copy-and-paste `Invoke-WebRequest` commands that fetch **only changed files** from the exact verified commit, then the specific `npm.cmd` tests. Do **not** ask for another repository ZIP or fresh extraction unless an exception in this document applies.
5. Warn that downloaded files overwrite matching local files. Confirm that the user is in the development checkout, not a published installation, and has no local edits to the target files. For multiple files, prefer a staged download before replacement.
6. List tests already passed, tests still pending, and the **single next recommended step**. Never describe unrun tests as passing.
7. Preserve the rule that **nothing is merged, tagged, released or published without explicit project-owner approval**.
8. Distinguish repository documentation from ChatGPT Project Library files: **never claim a handover was saved to the Project Library unless that save was actually verified**.

The last section of the handover must reproduce this continuity requirement or provide an explicit checklist with all eight items, so that the next chat session can follow it without relying on conversational memory.


## Actions minute conservation and required checks, 23 October 2026

To conserve the monthly GitHub Actions allowance, preserve required pull request checks and existing browser workflow path filters. The proposed workflow concurrency groups cancel older runs only when superseded on the same pull request or branch. Cancelled runs are not passing test evidence; the latest relevant run must finish successfully. A skipped required job can block merging, so do not use pull request path filters to suppress the required `release-documentation` job without separately verifying branch protection behaviour. Keep manual browser dispatch available for deliberate verification and record actual execution separately from source inspection. See `docs/audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md` for the dated proposal and open verification gate.


## Resource-conscious development, agreed 26 October 2026

Caffoot Lite treats responsible use of computing resources, contributor time and infrastructure costs as a core engineering principle. Resource efficiency must never weaken inventory safety, security, accessibility, backwards compatibility, required checks or release approval.

For GitHub Actions, apply these rules:

1. Check existing executed evidence and the current workflow triggers before planning tests or opening a pull request. Distinguish historical evidence from verification of changed behaviour.
2. Group related, reviewed changes into deliberate commits or batches where practical. Remember that opening a pull request and pushing further commits may each trigger multiple automatic workflows.
3. Prefer focused local or browser checks for changed behaviour while retaining the mandatory integration and release checks at the appropriate gate. Never report an unexecuted test as passed.
4. Record actual workflow run identifiers, conclusions and, when available, billable duration. A count of runs is not a count of billable minutes. Do not assume access to the owner's billing balance.
5. Investigate waste using measured workflow usage before proposing changes to path filters, concurrency or runner configuration. Keep required checks, security coverage and manual verification available. Any workflow behaviour change requires the established agreement, verification and approval process.
6. Reconcile test evidence and documentation with the exact source revision. Cancelled, skipped and superseded checks do not count as passing evidence.

This principle applies to future maintenance and architecture choices too: favour straightforward, maintainable, offline-capable solutions that avoid unnecessary services and recurring cost. The existing Actions conservation requirements above remain in force.

**Issue #99 / draft PR #155 checkpoint:** This policy update records the product owner's agreed ethos. It is documentation only, not a change to workflow triggers or application behaviour. Earlier PR activity caused automatic checks; do not describe that activity as no tests executed. The new focused issue #99 browser scenario remains unverified until its execution is explicitly evidenced. The outstanding master audit verification and release approval gates remain open.


## Lite development and bug investigation, agreed 27 October 2026

Use this approach for every issue, bug fix and feature, alongside the existing seven-stage process and resource-conscious testing rules. This is a clarification of the established workflow, not a new approval or release procedure.

1. **Investigate the cause before changing code.** Reproduce or inspect the reported behaviour, trace shared functions and related workflows, and check whether an existing finding or issue already covers it. Distinguish an observed defect from a hypothesis.
2. **Agree one coherent scope.** Identify affected forms, data paths, historical records and compatibility requirements together. Obtain product-owner approval for application behaviour changes; investigation alone is not implementation approval.
3. **Make the smallest maintainable change.** Prefer existing functions and data structures, avoid duplicated controls and competing procedures, and group closely related implementation into a deliberate batch and as few PRs as practical.
4. **Test what changed, not everything already tested.** Check existing passing evidence and workflow triggers first. Reuse valid results, identify actual gaps, and run focused checks for changed behaviour, integration risks and compatibility. Do not deliberately trigger duplicate CI or rerun passing application tests for documentation-only updates. Required release checks remain mandatory when their gate is reached.
5. **Protect users' inventories.** Preserve saved data, legacy imports, backups and offline standalone operation. Do not silently discard historical fields when changing a form or converting a device.
6. **Reconcile once in existing GitHub records.** Update affected audit, workflow, test, finding, roadmap and release documents at meaningful checkpoints, linking exact revisions and actual evidence. Do not create duplicate documents or unnecessary handovers.
7. **Report the true state and next action.** State what changed, what was inspected, what was actually tested, what remains unverified and what approval is needed. Never equate source inspection with a passing runtime test; never merge or release without explicit approval.

**Working principle:** Keep Caffoot Lite simple to use, develop, debug and maintain. Improve existing processes rather than introducing extra frameworks, paperwork or automation without a demonstrated need.

## Recovering work in a new session

Before resuming development after a conversation or contributor handover, follow the [new session recovery procedure](SESSION-RECOVERY.md). Verify live repository status rather than relying on a previous chat or handover document.
