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
