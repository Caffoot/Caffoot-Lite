# Proportionate Testing — Workflow Change Proposal

**Issue:** [#363](https://github.com/Caffoot/Caffoot-Lite/issues/363)  
**Status:** Draft design for product-owner review. **No workflow changes are implemented in this PR.**  
**Baseline:** Published v2.1 `main` and separately reviewed Stage 1 `milestone-1` workflows on 11 November 2026.

## Purpose

Reduce unnecessary Codex work and repeated CI execution while preserving every explicitly approved functional, security, data, visual and release acceptance requirement.

The owner has approved the testing **schedule and principle**, with a strict condition: **nothing may be weakened**. That approval does not yet establish an equivalent replacement for duplicate push/PR workflow triggers.

## Current workflow inventory

| Workflow | Push | Pull request | Manual / reusable | Current checks |
| --- | --- | --- | --- | --- |
| `backend-tests.yml` | Main and established development branches, path-filtered | Path-filtered | Both | Python syntax and full discovered backend suite |
| `browser-compat.yml` | Main and established development branches, path-filtered | Path-filtered | Both | Chromium broad fixtures; Firefox and WebKit role/MFA and native selection fixtures |
| `compose-lifecycle.yml` | Established development branches, path-filtered | Path-filtered | Both | Real Docker Compose lifecycle, port and persisted TLS/data |
| `release-documentation.yml` | Selected development branches, no path filter | Unfiltered | Both | Documentation and historical path consistency |
| `git-history-secrets.yml` | Main and established development branches, no path filter | Unfiltered | Both | Full reachable Git history scan |
| `publish-release.yml` | None | Release-sensitive paths | Manual | PR preflight; manual protected-main publication gated on backend, browser, Docker, docs and history |

The **active main repository ruleset** `Protect main and require validation` (ID 25714246) requires exact context `release-documentation`. Do not rename the context or produce a permanently pending required status.

## Approved testing schedule — no weakened coverage

| Checkpoint | Required coverage |
| --- | --- |
| During implementation | Focused changed-feature tests and connected security/data tests. Chromium for affected browser UI; Firefox/WebKit where specifically relevant. Do not repeat unrelated completed screenshots after every small change. |
| Ordinary PR changes | Appropriate backend, browser, documentation and secrets checks selected against affected paths and dependencies. Preserve PR review evidence and all mandated checks. |
| Authentication, roles, MFA, database, storage, deployment changes | Broader affected security, backend, UI and/or Docker regression as demanded by scope; no shortcut around server-side enforcement. |
| Final batch handover | **Every expressly required batch gate on the final SHA**; includes full final-head cross-browser checks for already-approved Stage 1 Batch 04. Missing/blocked checks stay open. |
| Milestone approval | Full appropriate backend, Chromium/Firefox/WebKit, Docker, migration/rollback, source-fidelity and owner review. |
| Manual release | **No change** to existing `publish-release.yml` safety model: owner authorisation, protected main, exact-SHA guard, all reusable verification jobs and no publication until they pass. |

## Target before/after examples (not yet implemented)

| Example change | Existing automatic execution | Desired equivalent coverage | Must be demonstrated first |
| --- | --- | --- | --- |
| Documentation only | Unfiltered documentation + history scan on push and PR, potentially both | One definitive PR documentation and history result; independent direct-branch protection | Required `release-documentation` on every protected-main PR, including fork/first PR and PR-less branch commits |
| Users display change | Large Chromium suite plus Firefox and WebKit on both push and PR, plus backend if interface touched | Focused Users UI/browser checks during work; the approved final batch full browser gate remains | Dependencies, matching suites, exact statuses and final-head evidence |
| RBAC/MFA change | Entire backend suite and broad browser suite on push/PR | Broad security/backend and role/MFA browser checks; full approved cross-browser batch gate retained | Direct API denial, role preview/stale confirmation, MFA enrolment/removal and session invalidation |
| Docker/storage change | Backend plus Docker lifecycle on push/PR | Same persistence/security/compatibility checks, scheduled once per relevant checkpoint | PR-less pushes and explicit final-commit Docker evidence |
| Stage/release checkpoint | Existing manual/reusable full checks | **Unchanged** required tests and release protections | Manual invocation reaches all child workflows and publication remains blocked on failure |

## Important verification distinction — push versus pull request

GitHub normally uses the **head commit** for a `push` event, but the **synthetic merge commit** for a mergeable `pull_request` event (the default `actions/checkout` behaviour). These are **not necessarily equivalent test inputs**, especially when the target branch moves. Therefore counting push + PR workflow runs as automatically redundant was too broad.

**Revised recommendation:** retain both event types for existing required checks until a proposed replacement independently proves it covers (a) the pushed head commit before a PR exists, (b) the actual merged result during PR review, (c) protected-main behaviour, (d) existing manual/reusable release execution, and (e) every approved final-head acceptance gate. No such replacement has yet been established.

GitHub also documents that path-filtered workflows can leave required checks pending. Skipping a conditional job may produce a successful status **without executing its tests**; do not use that as evidence of equivalent verification.

Official references:
- [GitHub Actions: Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub Actions: Triggering workflows and filters](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
- [GitHub: Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)

### Safe immediate improvement without changing workflow coverage

Keep GitHub's current automatic checks, but change the **development operating procedure**: focused local tests during implementation, early clean commit checkpoints, no repeated screenshots without changed affected UI, no manual rerun of a confirmed passing unmodified check, and stop Codex investigation at independent runner dependency failures. Record exact final-source and blocked checks honestly. This does not solve the external Ubuntu DNS problem or claim a reduced GitHub Actions bill.

## Open implementation decisions / safety blockers

1. **Push-versus-PR duplication:** Removing development-branch push triggers would leave **PR-less branch commits** without automatic coverage. Replacing both triggers with concurrency cancellation can cancel a required PR run or its exact-SHA evidence. Neither shortcut meets the owner's 'no weakening' rule as currently demonstrated.
2. **Conditional test selection:** Moving unrelated archived visual suites off routine PR runs needs a verified mapping of changed paths to dependent tests and a reliable **mandatory full final-batch checkpoint**. Until this gate is designed and approved, keep the existing checks.
3. **Required status contexts:** `release-documentation` is ruleset-required. Before editing any trigger, prove required checks remain generated and complete for every PR path; do not rely on skipped/path-filtered jobs to satisfy protection.
4. **Dependency setup:** The existing Ubuntu DNS blocker in [#361](https://github.com/Caffoot/Caffoot-Lite/issues/361) / draft [#362](https://github.com/Caffoot/Caffoot-Lite/pull/362) is separate. Do not substitute a new browser runtime, remove browser engines, or keep rerunning Codex against failing Ubuntu package mirrors.
5. **No assumed performance benefit:** Measure baseline event/run counts and durations using actual Actions outcomes before claiming saved time. Do not make up percentages.

## Implementation sequence after explicit review

1. Map individual browser tests and cross-feature dependencies; record all status contexts and event types, including fork PRs, direct main commits, PR-less development commits, manual dispatch and reusable release calls.
2. Propose an **exact** amended YAML diff and demonstrate an event/check matrix that preserves coverage and final-commit gates.
3. Obtain explicit approval for those concrete workflow edits if any behaviour changes.
4. Apply only the approved changes in a **separate, narrow implementation commit**; validate YAML, event routing, status contexts, relevant test execution and the manual release graph.
5. Leave current Stage 1 Batch 04 browser requirement unresolved until final-head browser verification actually passes (or the owner separately revises the acceptance requirement). Keep existing [#358](https://github.com/Caffoot/Caffoot-Lite/pull/358) and [#362](https://github.com/Caffoot/Caffoot-Lite/pull/362) in draft.

## Evidence and boundaries

This document records read-only findings and the approved testing direction. It is **not** itself a tested efficiency fix or a browser-runner correction. No application source, feature behaviour, approved design, test code, workflow YAML or required checks are changed by adding this proposal.
