# Security Fixes And Releases — Owner Checklist

## In simple terms

This is Caffoot Lite's **short, repeatable process** for correcting security problems and publishing a release. It is written for the product owner and contributors in plain British English. Use the relevant steps once, record actual evidence, and avoid repeating a completed audit or test without a reason.

**The product owner authorises the scope, the merge, the release and any public vulnerability disclosure separately.** Planning, a green check or a merged pull request is not permission to publish. Preserve the protected `main` branch; do not bypass its pull-request rules or rename the required `release-documentation` check.

## The straightforward route

| Step | What we do | Owner decision or evidence |
| --- | --- | --- |
| **1 — Report privately when necessary** | For a possible security weakness, use [SECURITY.md](../../SECURITY.md) and a private GitHub Security Advisory/reporting route. Never put vulnerability details, credentials, demonstrations or secrets in public issues or PR discussion. Ordinary non-security bugs can use the public bug-report form. | Agree whether the report is a confirmed weakness, needs a focused check, or can be closed without a fix. |
| **2 — Agree a small scope** | Review the established application and existing tests; describe the intended fix and affected version without disclosing sensitive details. Keep the scope limited to what is evidenced. | **Approve the exact corrective work** before code or test changes begin. |
| **3 — Prepare the change** | Make a focused branch and reviewable PR against protected `main`. Include necessary regression tests, current documentation and, where appropriate, version-specific release notes, Portainer example and release-image workflow. If a public PR would reveal an unpatched weakness prematurely, agree a private/coordinated preparation and disclosure plan first. | Review the proposed files and decide whether the batch is ready for validation. |
| **4 — Verify once** | Run the relevant existing backend, browser and permissions tests; run Docker Compose lifecycle testing when deployment, persistence or the release gate warrants it. Check the required documentation status and history-secret scan. Record which checks actually ran and what was not tested. | Review results and any remaining practical risks; do not insist on unrelated, speculative audits. |
| **5 — Protect existing installations** | Verify affected roles, MFA and data paths where relevant. Preserve the actual Docker `/data` mount, SQLite inventory and TLS material. Review the applicable backup/restore and upgrade instructions without changing users' storage mappings. | Confirm the change is acceptable for existing installs and for the proposed new version. |
| **6 — Approve and merge** | Confirm the intended PR contents, passed required checks and active `main` protection. Merge through the normal PR process, then confirm the result and clean up the temporary branch. | **Explicit approval to merge**; never merge merely because CI is green. |
| **7 — Approve and publish a version** | Before tagging, verify that the *new version* has approved release notes, an appropriate versioned Portainer example, and a working image-publication workflow. Confirm the final `main` commit and release version; create/publish the Git tag and GitHub Release only after approval. Verify the Docker build produced the intended AMD64 and ARM64 image and that its GHCR package is public. Record any verification not actually performed. | **Separate explicit approval to tag, build and publish**. Website updates and production deployments are separate actions unless expressly included. |
| **8 — Disclose and close** | Coordinate the private advisory's publication only when the fix and affected-version guidance are ready. Record the release, tests, status, links and any consciously deferred work in the relevant tracker. Stop when the agreed checks are complete. | **Separate approval to publish an advisory**, where one exists; confirm the release is complete. |

### Important release-workflow check

### Publish Caffoot Lite in one controlled run

The [Publish Caffoot Lite workflow](../../.github/workflows/publish-release.yml) is the **only publishing entry point**. It runs on a manual GitHub Actions request, rather than publishing automatically when a PR is merged or a tag is pushed. It supports stable version numbers such as `2.0.3` and `2.1`; the leading `v` is optional.

After the version's development and release-preparation pull requests have been reviewed and merged, and **only after the owner has explicitly approved publication**:

1. Open [GitHub → Actions](https://github.com/Caffoot/Caffoot-Lite/actions), choose **Publish Caffoot Lite**, then **Run workflow**.
2. Select **main**, enter the approved version number, and select **Run workflow**.
3. Review the workflow results. Do **not** tell users to pull the new image until the GitHub Release and the public multi-platform image are confirmed.

The workflow permits publication only by the approved maintainer's GitHub login, `sdelnevo`, including re-runs, and only from protected `main`. Changing the permitted account needs a reviewed, separately approved update. This does **not** require a personal access token or account credentials in the repository.

Before making anything public, the workflow checks the About-page version, README, installation guide, root Portainer file, release notes, historical handover and duplicate version tags. It rejects a version that is not newer than the latest published release. It then runs our **existing backend, Chromium, Docker persistence, release-documentation and Git-history tests**, sharing their maintained definitions rather than creating alternative checks.

Once those checks pass, GitHub creates the new tag at the **exact tested commit**, builds and pushes the AMD64/ARM64 Docker image, checks both platforms and attempts an anonymous registry read to confirm public access. **Only then** does it publish the GitHub Release using the approved release-notes file. Creating a tag using the workflow's standard `GITHUB_TOKEN` does not start a second publication workflow; the old tag-triggered image workflow has been replaced.

**If any publication step fails:** stop and inspect the Actions log, tag, GHCR image and GitHub Release. A failed run may have created a tag or image already; those operations are not one atomic transaction. The duplicate-tag safeguard will intentionally refuse an ordinary re-run. Agree a focused recovery before trying again; never silently delete, rewrite or retag an existing release.

**Safe testing:** Pull requests modifying the release process run read-only preflight tests with **no tag, image or GitHub Release creation**. The existing required `release-documentation` check retains its job identifier. Each actual release still requires its own approved version references and documentation; the publishing workflow itself should not need a version-specific rewrite.

Website publication, production deployment and any security-advisory disclosure remain separate decisions.

The existing [release documentation check](../../.github/workflows/release-documentation.yml) retains the protected-branch job identifier `release-documentation`. The [backend tests](../../.github/workflows/backend-tests.yml), [browser tests](../../.github/workflows/browser-compat.yml), [Docker lifecycle test](../../.github/workflows/compose-lifecycle.yml) and [Git history secret scan](../../.github/workflows/git-history-secrets.yml) have different triggers. Inspect the actual run for the relevant commit: **a skipped or untriggered workflow is not a pass**. See [GitHub Actions](https://github.com/Caffoot/Caffoot-Lite/actions).

### Archive the completed development handover before publication

In the **product-owner-approved release-preparation PR, before creating the release tag**:

1. Update the **active development status for that version, if present**, with what was actually delivered, merged PRs and tests, deferred work and the release decision. The [v2.0.3 development handover](../historical/development-handovers/v2.0.3.md) is the archived example. Do not describe planned work as completed.
2. Move that version's active handover into `docs/historical/development-handovers/` using a version-specific name, for example `v2.0.3.md`. Mark the archived document **historical** at its top; update its relative links to work from the new folder.
3. Remove or replace links to the old active file in the root README, Development Guide, contributor guidance and any other referencing document. Check the resulting links and normal required GitHub checks. **Do not leave a stale "Current Development Status" document masquerading as active.**
4. Only create the next active handover once the product owner has agreed the **next** version's development scope. If no scope is approved, leave no active handover and use GitHub's current published release and closed issue/PR evidence as the starting point.

Archiving is part of release preparation, **not** an automatic background action. Publication, merging and the next implementation phase each still require product-owner approval.

### Keep the owner experience simple

Whenever available, the assistant or maintainer should prepare the branch, PR, changelog and evidence, then give the owner **one clear decision at a time**: approve the scope, approve the merge, approve the release, and separately approve advisory disclosure when needed. Do not ask the owner to repeat completed work or perform needless manual Git operations. If GitHub permissions require a direct owner action, provide the exact page and plain-English instruction; never imply an action succeeded without verification.

## Proportionate recurring security checks

The product owner approved this cadence on 2 November 2026 in the completed [v2.0.2 security tracker #255](https://github.com/Caffoot/Caffoot-Lite/issues/255):

- **Every release:** run security regression tests relevant to its changes, including applicable authentication, permissions and dependencies.
- **Broader review:** every **three feature releases or at least once annually**, whichever comes first.
- **Change-driven:** check security boundaries when authentication, MFA, authorisation, sensitive information, imports or deployment protections materially change.
- **Incident-driven:** investigate reported vulnerabilities privately and promptly, without waiting for the next release.

This is a proportionality rule, **not** an instruction to run a full security audit for a documentation or visual change.

## Reference without reopening completed work

The [v2.0.2 security review #255](https://github.com/Caffoot/Caffoot-Lite/issues/255) is complete. The published [v2.0.2 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.2), [release-preparation PR #256](https://github.com/Caffoot/Caffoot-Lite/pull/256), [workflow housekeeping PR #257](https://github.com/Caffoot/Caffoot-Lite/pull/257) and [historical documentation PR #258](https://github.com/Caffoot/Caffoot-Lite/pull/258) are historical examples, not steps to repeat.

Use the [testing and maintenance guide](08-Testing-and-Maintenance.md) for technical test details and [INSTALLATION.md](../../INSTALLATION.md) for supported deployment and backup instructions. Keep actionable security reports private under [SECURITY.md](../../SECURITY.md).
