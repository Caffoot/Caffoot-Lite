# Caffoot Lite — Current Development Status

> **ACTIVE DEVELOPMENT HANDOVER — PLANNING ONLY (v2.0.3).**
> Last verified against public GitHub on **3 November 2026**. This is **not** a release note or an implementation authorisation. Always recheck today's repository state; the status here is a dated checkpoint, not live telemetry.
>
> **IMPORTANT:** This document must be **archived and removed from the active location during the v2.0.3 release-preparation PR, before the release tag is published**. See [Security Fixes And Releases](Security-Fixes-and-Releases.md#archive-the-completed-development-handover-before-publication). Do **not** reuse a completed version's handover as the next version's instructions.

## 1. Published baseline and checkpoint

- **Latest published application:** [v2.0.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.2), released **2 November 2026**. Docker/SQLite, Python backend, existing multi-user Devices, IPAM, Racks, Change History, MFA and permissions. It is the **published functional baseline** even where `main` has received documentation-only housekeeping since the tag.
- **Repository at checkpoint:** protected [`main`](https://github.com/Caffoot/Caffoot-Lite/tree/main), commit `1cbfc1dd2a1ff6438dc4869192dc70a94be5fe75` after [PR #259](https://github.com/Caffoot/Caffoot-Lite/pull/259). At that check, no open pull requests and no other branches. These facts **must be verified again** at the start of a new session.
- **v2.0.3 is not released.** Its detailed work scope, implementation batches and release gate have **not** been approved. This handover is the agreed preparation for scoping it, not permission to start coding.

## 2. Completed — do not do again

| Completed work | Evidence / decision | Don't repeat |
| --- | --- | --- |
| Standalone v1.3.3 → Docker/SQLite v2.0–v2.0.1 foundation and release | [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215), [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218), [v2.0.1 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1) | Do not restart the migration, reconstruct old code trees or redo historical acceptance tests as a new project |
| Focused security review, confirmed correction, proportional tests and v2.0.2 publication | Closed [#255](https://github.com/Caffoot/Caffoot-Lite/issues/255), [release #v2.0.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.2), merged [PR #256](https://github.com/Caffoot/Caffoot-Lite/pull/256) | Do not reopen the completed review or publish private findings again; investigate **new** evidenced problems privately under [SECURITY.md](../../SECURITY.md) |
| Remove obsolete `Next` workflow names and tidy legacy guidance | Merged [PR #257](https://github.com/Caffoot/Caffoot-Lite/pull/257) | Do not repeat the workflow cleanup or restore discarded temporary terminology |
| Archive old version documents; enforce consistent naming; move Development Guide | Merged [PR #258](https://github.com/Caffoot/Caffoot-Lite/pull/258) | Do not move version documents back into the root or redo the already-completed folder renames |
| Straightforward security correction and release owner checklist | Merged [PR #259](https://github.com/Caffoot/Caffoot-Lite/pull/259), [owner checklist](Security-Fixes-and-Releases.md) | Do not design another release process; follow the one already documented |

Completed issue and PR records are **evidence**, not instructions to regenerate their deliverables.

## 3. Next direction — v2.0.3 scope to agree

**Product-owner direction:** a **small, proportionate functional audit, evidenced bug fixes, justified code/frontend cleanup, accurate documentation and tests** to provide a stable baseline for the subsequent interface refresh. Avoid a full second migration, speculative refactor, sweeping security re-audit or engineering for its own sake.

Candidate work to **scope and explicitly approve before implementation**:

- Review the actual v2.0.2 user-facing workflows against the backend, permissions and existing tests, **reusing** the [Development Guide](README.md), [Function Index](Function-Index.md) and tests rather than rebuilding them. Focus on demonstrated gaps.
- Correct reproducible bugs in owner-approved batches, preserving data and installation compatibility, Device/VM relationships, IPAM and Rack behaviour.
- Tidy obsolete frontend/code names **only where beneficial and approved**, keeping function references and the Function Index truthful.
- Plan the agreed rename `docs/How To's/Features and Instructions/` to `docs/how-tos/features-and-instructions/` **as part of v2.0.3 release work**. **Compatibility constraint:** published v2.0.2 images already contain URLs pointing to the old `main` path. Simply moving files would break existing users' Help & Guides links. Approve a backward-compatible old-path arrangement, update new app links/tests/website references and verify old v2.0.2 links still work before removing anything.
- Prepare and verify a **v2.0.3-specific release-image trigger and tag**, because the [current workflow](../../.github/workflows/v2-release-image.yml) is tied to v2.0.2. No tag or image work is authorised by this note.
- Use [proportionate recurring security checks](Security-Fixes-and-Releases.md#proportionate-recurring-security-checks) relevant to actual changes, not a duplicate v2.0.2 review.

**Immediate next action:** agree the v2.0.3 scope and the smallest first test/audit batch with the product owner, then record explicit approval **before** starting code or opening implementation issues/PRs.

## 4. Later direction — v2.1 interface refresh

The **premium application-wide UI refresh** is a separate subsequent stage, governed by [design issue #244](https://github.com/Caffoot/Caffoot-Lite/issues/244) and the exact [approved standalone design sources](../../future-design/README.md). **Do not redraw accepted screens or revive abandoned redesign work** (notably historical [#227](https://github.com/Caffoot/Caffoot-Lite/issues/227)). Protect the existing live application, user data, rack logic, Device/IPAM behaviour, authentication, roles and self-hosted Docker/SQLite simplicity.

**Svelte** is the product owner's **preferred framework direction**, but **not yet a final framework decision**. A representative owner-approved pilot and review of parity, accessibility, security, performance and deployment compatibility must precede a separately approved architecture/implementation decision. Do not implement a Svelte migration during v2.0.3 cleanup without that approval.

Other ideas remain in [#222](https://github.com/Caffoot/Caffoot-Lite/issues/222) and their dedicated issues. **An idea is not authority to build it.**

## 5. Working rules across new chats and PRs

1. **At session start:** Read this file, then check **live** GitHub `main`, open PRs, relevant issues, latest release and current checks. Distinguish **published v2.0.2 functionality** from unpublished proposals or old issue wording. Prefer newer explicitly approved decisions.
2. **Before changing anything:** Confirm the exact owner-approved scope, affected behaviour and tests. Reuse existing evidence and solutions. No unsolicited new issues, code, build workflow, release, architecture commitment or design changes.
3. **After each meaningful approved batch:** Update the appropriate product/developer guides and this handover **in the same PR** with evidence (PR, commit, tests actually executed), completed/not completed, decisions, remaining work and a single next action. Never claim skipped checks passed or a draft is published.
4. **No rework from chat loss:** Use this version-controlled status and the relevant PR/issue as the source of truth. Do not restart finished stages merely because a chat session ended.
5. **Protect sensitive details:** Security advisories and reproductions stay private until separately approved for disclosure. Keep public tracking limited to nonsensitive statuses.
6. **On release:** Follow the mandatory versioned archive procedure below.

## 6. Mandatory handover archive at the v2.0.3 release gate

In the approved **v2.0.3 release-preparation PR, before tagging/publishing**:

- Verify final merged code and tests, then update this handover to distinguish **actual delivered work** from deferred or rejected proposals.
- **Move this file** from `docs/development-guide/Current-Development-Status.md` to `docs/historical/development-handovers/v2.0.3.md`. At the top of the archived copy, prominently label it **HISTORICAL — v2.0.3 development handover; not an active work instruction**. Fix all relative links for the new location.
- Remove the **active** handover links from the root README, Development Guide, maintenance guide, contributor guide and anywhere else they appear; only link the archived version as history. Make no false claim that another phase is approved or already under way.
- Validate document paths and the protected `release-documentation` status, then obtain the owner's **separate release publication approval** as normal. Do not rely on automation to archive the document.
- Start a **new** active status document only after the product owner agrees the next development phase. Never leave an old `Current-Development-Status.md` active beyond its release.

That archive move belongs to the **release-preparation** changes (before the tag), rather than an after-the-fact tidy-up.

*Maintained checkpoint, 3 November 2026. This is a living handover for the v2.0.3 planning stage, not a guarantee that GitHub will remain unchanged.*
