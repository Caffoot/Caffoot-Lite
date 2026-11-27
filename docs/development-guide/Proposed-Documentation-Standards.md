# Proposed Permanent Documentation Standards

**Proposal for separate explicit owner approval.** This wording is not yet an amendment to AGENTS.md, CONTRIBUTING.md or any acceptance gate. It follows the [agreed quality principles](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7196814971) and [Batch 8 scope](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7224076263).

## Proposed Addition To AGENTS.md

Add the following subsection after the existing Mandatory Documentation Quality Standard, retaining all existing working, verification and release rules:

### Documentation And Repository Care

Documentation is part of feature completion. Write and maintain comprehensive, accurate, version-correct British-English user and administrator instructions alongside every new or materially changed feature. Explain the task, prerequisites, permissions, feature switches, navigation, fields, numbered actions, expected outcomes, cancellation/rejection, realistic fictional examples, troubleshooting and relevant safety/privacy boundaries. Detail must serve the intended reader; do not pad short updates or duplicate maintained guidance.

Keep instructional and release-facing content focused on using Caffoot Lite. Review every paragraph, caption, callout and link. Exclude temporary batch/stage/checkpoint notices, internal issues/PRs, AI/development commentary, screenshot-production details and testing/review/acceptance/provenance links. Retain useful explanations, prerequisites, permission/security warnings, troubleshooting, examples, accessible captions and alternative text, related instructional links and necessary truthful version/draft notices.

Use genuine, correct-version, approved desktop light-theme application screenshots beside the relevant instructions. Do not use generated images, mock-ups, standalone HTML previews, misleading older states, or dark/mobile images as instructional illustrations. Reuse suitable existing images where possible; capture work and resource-intensive verification require the applicable owner authorisation. Preserve original images, hashes, manifests, mobile/dark development evidence and historical decisions separately. Record missing or outdated illustrations in development records without implying that visual or publication approval has passed.

Maintain repository organisation, indexes, navigation, links, README, release notes and relevant installation, deployment and configuration guidance with the same care as application code. Maintain supported version-specific guides, including published v2.1, and preserve release history, existing installation/image references and compatibility URLs. Clearly distinguish unreleased features and isolated-review procedures from published production guidance; never invent successful installation, upgrade, backup, recovery, security or release results.

Keep release inventories and documentation traceable to approved requirements, actual application behaviour and revision-specific verification evidence. Reconcile corrections when they occur. Keep traceability in the development/evidence register pointing to the guide so instructional readers need not navigate internal records. Seek separate owner approval before destructive removal or restructuring of obsolete or duplicated material.

Use approved version-specific documentation as the authoritative source for corresponding website content. Website implementation, synchronisation, deployment and publication require their own approval; documentation completion does not authorise them.

Include documentation completeness and repository accuracy in feature acceptance and release readiness. Record deferred work honestly. Preserve all existing application, functional, permission, security, accessibility, visual, compatibility, native/manual, testing and release gates. Independent review and explicit owner merge/release approval remain separate requirements.

## Proposed Addition To CONTRIBUTING.md

Add the following paragraphs to **Documentation Is Part Of The Change**, retaining its existing checklist and review gate:

Keep guides focused on what the reader needs to do. Remove development diaries, temporary batch/status notes, internal issue/PR/testing/review/provenance links and screenshot-production commentary from instructional and release-facing content. Retain useful instructions, examples, prerequisites, permission/security warnings, troubleshooting, related instructional links and truthful version/draft notices. Use genuine approved desktop light-theme images with accessible alternative text and captions beside the relevant task. Preserve original images and mobile/dark verification evidence in separate development records.

Review the affected repository navigation, local links, README, release notes and relevant installation/configuration guidance alongside the feature. Maintain supported version-specific guides and published history; do not mechanically change release numbers or claim unverified upgrade/recovery results. Keep evidence-to-guide traceability in the development register. Approved documentation supplies the corresponding website content only through a separately approved website change and publication process. Documentation completeness is part of acceptance and never replaces existing software, security, visual, native/manual or release checks.

## Proposed Correction To The Existing AGENTS.md Status Section

Replace the stale Stage 4/schema-24 and Stage 5 pending-development status bullets with:

- **Development target:** Milestone 01 targets unreleased v2.2. The owner-approved integrated application checkpoint is `0251b43a3b5d41d626aa022c6d7f9b4d860433da`, schema 31, including Stages 1–5, Stage 6 integration work and subsequent merged corrections. [Development Status](Development-Status.md) records current boundaries and dated evidence. Published v2.1 remains unchanged. Deferred native/manual checks, supported upgrades, complete-volume recovery, private exports, independent security audit and final release gates remain outstanding. Documentation acceptance, PR promotion, merge, deployment and publication require their applicable separate owner approvals.

When applying this bullet in AGENTS.md, use the repository-root link `docs/development-guide/Development-Status.md`. Retain the frozen design references and all settled Service Desk access rules; the proposed correction does not reopen them.
