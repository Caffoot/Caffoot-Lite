# Caffoot Lite — Current Development Status

> **ACTIVE DEVELOPMENT HANDOVER — v2.0.3 (UNRELEASED).**
> Last verified against public GitHub on **3 November 2026**. This records approved work, not permission for new scope, merging or publication. Always recheck today's repository state; the status here is a dated checkpoint, not live telemetry.
>
> **IMPORTANT:** This document must be **archived and removed from the active location during the v2.0.3 release-preparation PR, before the release tag is published**. See [Security Fixes And Releases](Security-Fixes-and-Releases.md#archive-the-completed-development-handover-before-publication). Do **not** reuse a completed version's handover as the next version's instructions.

## 1. Published baseline and checkpoint

- **Latest published application:** [v2.0.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.2), released **2 November 2026**. Docker/SQLite, Python backend, existing multi-user Devices, IPAM, Racks, Change History, MFA and permissions. It is the **published functional baseline** even where `main` has received documentation-only housekeeping since the tag.
- **Repository at checkpoint:** protected [`main`](https://github.com/Caffoot/Caffoot-Lite/tree/main), merge commit [`67acd546`](https://github.com/Caffoot/Caffoot-Lite/commit/67acd546f0f424032e3caae09232d86170304e80) following merged [PR #262](https://github.com/Caffoot/Caffoot-Lite/pull/262) on **3 November 2026**. There were no open pull requests before the new How To compatibility batch began. Recheck GitHub at the start of each session.
- **v2.0.3 is not released.** The first functional-baseline batch has merged; the How To compatibility batch is separately approved for review. Further scope, merging and the eventual release gate each require explicit product-owner approval.

## 2. Completed — do not do again

| Completed work | Evidence / decision | Don't repeat |
| --- | --- | --- |
| Standalone v1.3.3 → Docker/SQLite v2.0–v2.0.1 foundation and release | [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215), [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218), [v2.0.1 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1) | Do not restart the migration, reconstruct old code trees or redo historical acceptance tests as a new project |
| Focused security review, confirmed correction, proportional tests and v2.0.2 publication | Closed [#255](https://github.com/Caffoot/Caffoot-Lite/issues/255), [release #v2.0.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.2), merged [PR #256](https://github.com/Caffoot/Caffoot-Lite/pull/256) | Do not reopen the completed review or publish private findings again; investigate **new** evidenced problems privately under [SECURITY.md](../../SECURITY.md) |
| Remove obsolete `Next` workflow names and tidy legacy guidance | Merged [PR #257](https://github.com/Caffoot/Caffoot-Lite/pull/257) | Do not repeat the workflow cleanup or restore discarded temporary terminology |
| Archive old version documents; enforce consistent naming; move Development Guide | Merged [PR #258](https://github.com/Caffoot/Caffoot-Lite/pull/258) | Do not move version documents back into the root or redo the already-completed folder renames |
| Straightforward security correction and release owner checklist | Merged [PR #259](https://github.com/Caffoot/Caffoot-Lite/pull/259), [owner checklist](Security-Fixes-and-Releases.md) | Do not design another release process; follow the one already documented |
| Active status and release-time handover archiving rules | Merged [PR #260](https://github.com/Caffoot/Caffoot-Lite/pull/260), [release owner checklist](Security-Fixes-and-Releases.md) | Don't recreate handovers from scratch each chat; update this one and archive it at the release gate |
| v2.0.3 About version, refreshed Function Index (494 entries), Rack/VM browser regression checks | Merged [PR #262](https://github.com/Caffoot/Caffoot-Lite/pull/262) on 3 November 2026, all four GitHub checks passed; merge commit [`67acd546`](https://github.com/Caffoot/Caffoot-Lite/commit/67acd546f0f424032e3caae09232d86170304e80) | Do not repeat these fixes, the index refresh or completed tests |

Completed issue and PR records are **evidence**, not instructions to regenerate their deliverables.

## 3. v2.0.3 — completed work and agreed next batch

**Product-owner direction:** a **small, proportionate functional audit, evidenced bug fixes, justified code/frontend cleanup, accurate documentation and tests** to provide a stable baseline for the later interface refresh. Avoid a full second migration, speculative refactor, sweeping security re-audit or engineering for its own sake.

**Completed on 3 November 2026:** [PR #262](https://github.com/Caffoot/Caffoot-Lite/pull/262) was merged into protected `main` after all four required checks passed. It corrected the upcoming v2.0.3 About label, refreshed the Function Index to 494 entries, and added focused Rack front/rear/printing and VM host-selection browser checks. Do not repeat this batch. The corrected About label does **not** mean v2.0.3 has been released.

**Approved How To compatibility batch (3 November 2026; awaiting review):**

- Make `docs/how-tos/features-and-instructions/` the official home for the eight existing guide files. Retain the original eight files at `docs/How To's/Features and Instructions/` as identical copies. Published v2.0.2 images point to the old `main` URLs, so moving them outright would break older Help & Guides links.
- Point the upcoming v2.0.3 application guide links, current README/installation/community guidance and relevant GitHub question template to the new location. Leave historical release notes and approved v2.1 interface design drafts unchanged.
- Extend the protected `release-documentation` check to confirm that all eight guides exist under both paths and match byte-for-byte. Update the existing browser regression assertions for the new link destinations. Verify the original paths remain present for v2.0.2 users.
- Keep the application, permissions, data, database/schema, Docker installation and release workflows otherwise unchanged. Website content remains a separate deployment decision; no website publication is authorised.

**Future consideration only:** The product owner suggested that a later version might remove the old directory. This is **not approved for implementation**. Publishing a newer image does not change the old URLs embedded in v2.0.2; any later removal needs a separately agreed, reliable way to keep those links working (or an explicit decision about the consequences).

**Other possible v2.0.3 work — not yet approved:** Investigate evidenced workflow bugs or justified code clean-up in separately scoped batches. Prepare a v2.0.3 release-image trigger only when authorised: the existing image workflow still targets v2.0.2. Use proportional security and regression checks for actual changes rather than repeating the completed security review.

**Next action:** Review the How To compatibility PR and its actual GitHub checks; resolve any failures and obtain the product owner's **separate approval before merging**. Do not merge, tag, publish, start the v2.1 redesign or archive this active handover yet. At v2.0.3 release preparation, follow the mandatory archive instructions in section 6.

## 4. Later direction — v2.1 interface refresh

The **premium application-wide UI refresh** is a separate subsequent stage, governed by [design issue #244](https://github.com/Caffoot/Caffoot-Lite/issues/244) and the exact [approved standalone design sources](../../future-design/README.md). **Do not redraw accepted screens or revive abandoned redesign work** (notably historical [#227](https://github.com/Caffoot/Caffoot-Lite/issues/227)). Protect the existing live application, user data, rack logic, Device/IPAM behaviour, authentication, roles and self-hosted Docker/SQLite simplicity.

**Svelte** is the product owner's **preferred framework direction**, but **not yet a final framework decision**. A representative owner-approved pilot and review of parity, accessibility, security, performance and deployment compatibility must precede a separately approved architecture/implementation decision. Do not implement a Svelte migration during v2.0.3 cleanup without that approval.

Other ideas remain in [#222](https://github.com/Caffoot/Caffoot-Lite/issues/222) and their dedicated issues. **An idea is not authority to build it.**

## 5. Working rules across new chats and PRs

**Community writing decision (3 November 2026):** Use natural, welcoming British English for new GitHub issues, PRs and documentation. Start with the reason and the change, explain tests plainly, and avoid repetitive third-person approval/status language or AI-oriented prose. Preserve actual decision authority, accurate test records and private security reporting. The maintained standard is in [CONTRIBUTING.md](../../CONTRIBUTING.md); our issue and PR templates should follow it. **Do not rewrite historical issues and PRs** simply to change their tone.

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
