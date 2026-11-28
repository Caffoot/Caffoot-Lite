# Contributing To Caffoot Lite

Thank you for helping improve Caffoot Lite. We want contributors to find understandable code, reliable documentation and an approachable review process. **The same standards apply to maintainers and outside contributors.**

## Start With An Agreed Scope

**The approved development target is unreleased v2.2, developed under Milestone 01 on `milestone-1`.** Follow [issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351) for stage progress and [#366](https://github.com/Caffoot/Caffoot-Lite/issues/366) for the documentation plan. Preserve archived guides, compatibility paths and historical evidence. Stage-specific work and merges need separate product-owner approval. Before writing code, read the [Development Guide](docs/development-guide/README.md), the [Coding And Naming Conventions](docs/development-guide/06-Coding-and-Naming-Conventions.md), and the [Function Index](docs/development-guide/Function-Index.md). Check existing source, tests and relevant approved GitHub decisions.

**One feature or improvement per GitHub issue.** Anyone is welcome to [suggest a feature](https://github.com/Caffoot/Caffoot-Lite/issues/new/choose) or join an existing discussion. Check [existing future requests](https://github.com/Caffoot/Caffoot-Lite/labels/future%20request) before opening a new issue. Every new idea should have its own issue. Record discussions, product-owner decisions, changes of scope and acceptance feedback in the relevant issue. The product owner decides what gets built and when; contributors should not start unrelated work or publish anything on their own initiative. Historical issues #215 and #218 are completed release history, not restrictions on future development.

Keep changes focused and link the relevant issue and recorded decision. Use testing proportionate to the work. **Do not start speculative features, unsolicited audits, unnecessary engineering investigations or unrelated architectural changes.**

## How We Write For Our Community

Caffoot Lite is an open-source project for real people. Write **issues, pull requests, guides, release notes and review comments** in clear, friendly **British English**. The same standard applies to maintainers, contributors and AI-assisted drafts.

- Start with **what matters to readers**: what isn't working, why a change helps, and what they'll notice. Prefer short headings such as **Why**, **What changed**, **Checks** and **Anything to be aware of?**
- Use natural, direct language such as "This fixes…", "We've updated…" and "Before merging, check…". Avoid internal status reports, repetitive "the product owner approved" phrasing, corporate jargon, unnecessary capital letters and text written as instructions to an AI.
- **Be welcoming.** Don't assume someone already knows our codebase, GitHub or Docker. Explain unfamiliar terms briefly where they're needed.
- **Keep records useful, not enormous.** Link to the issue or previous decision instead of copying conversations or reproducing test logs. Say what was checked, what still needs attention and what was deliberately left alone.
- **Keep technical truth and authority.** Identify the person or decision when it actually matters, especially for scope, compatibility, security, merge and release approval. A friendly style must never imply that a proposal is approved, a skipped test passed or a release was published.
- AI assistance is fine; whoever submits a contribution remains responsible for verifying and reviewing it. Write for community readers, not for an AI tool.

### Before Posting An Issue Or Pull Request Update

**The same writing standard applies to everyone who maintains Caffoot Lite, including AI-assisted work.** It covers issue descriptions, issue comments, pull requests, review comments, progress updates and merge or release notes. A technical update is still a public message to the community.

Before publishing an update, check that it:

1. **Leads with what happened and why it matters.** Tell readers what has changed for them, rather than opening with an internal stage name or a technical report.
2. **Explains essential checks in everyday words.** Say what was tested and whether it passed. Link to detailed evidence for people who want it rather than filling the comment with commit numbers, logs or unexplained terms.
3. **Makes the current position clear.** Explain what's available now, what's unchanged and what happens next. Record approvals, merge decisions and release decisions precisely when they matter.
4. **Sounds like a person talking to the community.** Use friendly, clear British English; remove internal shorthand, repetitive approval statements and unnecessary technical detail. Keep it short unless more detail genuinely helps.

For example, a completed change could be reported like this (illustrative wording, **not a current project status report**):

> **Device Details preview updated**
>
> We've improved the new Device Details preview so the text is easier to read and the appearance stays consistent across desktop and mobile screens.
>
> The browser and Docker checks passed. The existing application and saved data have not changed.
>
> The new screen is still a preview. We'll agree the next part of the work before making it available to everyone.

**Maintainers and reviewers must check the writing as well as the code.** The pull-request checklist explicitly includes descriptions and public progress comments. If an update doesn't meet this standard, improve it before posting or request clearer wording before approving the change. Apply the same self-check when posting updates directly to an issue without a pull request.

Automated tests cannot reliably decide whether English is friendly or understandable. Passing GitHub checks is **not** a substitute for that human review. These expectations are for people maintaining and reviewing the project; **people reporting a problem or asking for help are welcome to write in their own words**.

Don't rewrite completed issues, old PRs or historical records just to change their tone. Apply this style to new work, and improve current documents when there's a genuine reason to edit them.

## Mandatory Naming And UI Standards

Every new or modified code component must use a meaningful, searchable name that tells a reader **what it is or what it does**, not when or in which development phase it was written.

- **JavaScript:** descriptive `camelCase` functions and variables, preferably verb plus domain, such as `renderDeviceDetails`, `validateRackPlacement` and `saveUserPermissions`.
- **Python:** descriptive `snake_case` functions, methods, modules and variables; `PascalCase` classes and `UPPER_SNAKE_CASE` constants.
- **HTML/CSS:** descriptive semantic `kebab-case` IDs, classes and event/action hooks; keep selectors, event handlers, accessibility labels and CSS aligned.
- **Repository folders:** descriptive lowercase `kebab-case`, with hyphens rather than spaces or apostrophes (for example `docs/development-guide`). Preserve conventional filenames and language-specific Python names; review every dependent link, test and workflow before moving an existing folder.
- **UI labels:** use **Title Case** for headings, navigation, tabs, buttons, form and table labels, and short statuses; preserve established acronyms such as IPAM, MFA, VLAN and LDAP. Use readable sentence case for explanations and instructional prose.
- **Comments and docstrings:** treat these as **public-facing community documentation**, written in clear British English for people with little or no coding experience. Explain what code does and, where useful, why it is needed. They must not be written primarily for professional developers or AI tools. Avoid cryptic abbreviations, unexplained jargon, obsolete version prefixes and development-stage references.

Do not introduce names such as `phase3Handler`, `newThing2` or `tempFix`. Historical names should be improved when an approved change touches them or during an approved clean-up. **Clarity and maintainability are valid reasons to rename code**, provided every affected reference and test is updated safely.

## Source Comments Are Public-Facing Documentation

Comments in JavaScript, Python, HTML, CSS and other project-owned code are part of what the community reads. **Write them for someone who is new to programming, not for an expert or an AI assistant.** A reader should be able to understand the purpose of the code without needing to already know its implementation details.

- Use plain, natural **British English**, with accurate spelling and complete explanations where needed.
- Explain **what a section does**, what it affects and **why a rule or safeguard matters**. Define necessary technical terms in everyday language.
- Describe surprising behaviour and important safety or data-compatibility rules. Do not merely repeat a clear function name or comment on every obvious line.
- Keep explanations concise enough to remain useful; if a whole workflow needs teaching, link to a maintained developer or user guide rather than embedding a large essay.
- Do not use private shorthand, AI-specific instructions, prompts, development diary notes, unexplained acronyms or phase numbers.
- Update or remove a comment whenever the code changes so it never confidently describes behaviour that is no longer true.

**Example:**

```python
# Stop two people from changing the same device at once.
# This protects the first person's changes from being overwritten.
```

This standard applies equally to code written by maintainers and code submitted by community contributors. Comments are reviewed alongside the code, not treated as optional decoration.

## Documentation Is Part Of The Change

Do not leave documentation for a later release or for another contributor. For each approved development batch, update the **active handover for that version, if one exists**, with completed work, evidence, decisions and remaining work. At publication, archive the completed handover and remove active links; create a new active handover only once the following development scope is agreed. The [v2.0.3 handover](docs/historical/development-handovers/v2.0.3.md) is preserved as history.

- Update the relevant guides for changed behaviour, controls, data flows, deployment steps, configuration or security rules.
- **When functions are added, removed, moved or renamed, regenerate and review** [`docs/development-guide/Function-Index.md`](docs/development-guide/Function-Index.md) in the same pull request, keeping its source revision and links truthful. The index is a navigation aid, **not** proof that a function is unused; textual reference counts are not a call graph.
- Update the [Function And Code Reference](docs/development-guide/07-Function-and-Code-Reference.md) and other architecture or user guides where affected.
- New source lines do not each need an entry in a function index. Every meaningful new or changed function should be indexed; document components and behaviour at the appropriate level.
- Remove outdated user-facing development terminology in the part of the application being changed.

Keep guides focused on what the reader needs to do. Remove development diaries, temporary batch/status notes, internal issue/PR/testing/review/provenance links and screenshot-production commentary from instructional and release-facing content. Retain useful instructions, examples, prerequisites, permission/security warnings, troubleshooting, related instructional links and truthful version/draft notices. Use genuine approved desktop light-theme images with accessible alternative text and captions beside the relevant task. Preserve original images and mobile/dark verification evidence in separate development records.

Review the affected repository navigation, local links, README, release notes and relevant installation/configuration guidance alongside the feature. Maintain supported version-specific guides and published history; do not mechanically change release numbers or claim unverified upgrade/recovery results. Keep evidence-to-guide traceability in the development register. Approved documentation supplies the corresponding website content only through a separately approved website change and publication process. Documentation completeness is part of acceptance and never replaces existing software, security, visual, native/manual or release checks.

### Mandatory Long-Form User And Administrator Guides

**Our standard for all current and future feature instructions is the comprehensive, beginner-friendly approach used in the [Stage 1–3 draft v2.2 guides](docs/how-tos/features-and-instructions/v2.2/README.md).** Write and update the relevant instructions **alongside every new or materially changed feature**, rather than postponing them until release. This applies equally to maintainers, external contributors and AI-assisted drafts, and to archived version-specific guides whenever an approved change affects them.

Each applicable guide should give readers what they need to complete the task without guessing:

1. **Purpose and starting point:** what the feature does, when to use it, prerequisites, available settings and optional-feature switches, and the effective permissions required.
2. **Exact on-screen guidance:** where to go in Caffoot Lite, existing menu and tab names, buttons, form fields, options, validation rules and relevant status meanings, using the actual accepted application rather than a speculative redesign.
3. **Complete numbered procedures:** each user action in sequence, the expected outcome, and what Save, Cancel, confirmation, rejection or a stale/conflicting change does. Include connected end-to-end tasks across sections where relevant.
4. **Practical examples:** realistic, clearly fictional people, equipment and values; explain stock arithmetic, assignment/return state changes or access restrictions when those details help readers understand the result.
5. **Safety and recovery:** what the user may see or change, permissions and personal-data boundaries, important safeguards, common errors, troubleshooting and links to the next related task.
6. **Authentic illustrations:** relevant screenshots captured from the **actually implemented and correct-version application**, following the approved design, with informative captions and accessible alternative text. Record their source and approval. Do not present old UI, a mock-up, an HTML preview or a generated picture as an approved current application screenshot; disclose missing or older captures and obtain the necessary owner publication approval before using them as current evidence.
7. **Version and release accuracy:** keep unreleased v2.2 clearly marked draft, use truthful navigation and available features, and never invent successful tests, production upgrade steps, released images or future capabilities. Preserve existing installation guidance and dated historical decisions.

Installation, backup/restore, security, recovery, troubleshooting and developer reference material must be equally **clear, complete and accurate for their intended reader**, with the appropriate detail, evidence and warnings. This does **not** require padding short GitHub updates into lengthy manuals, rewriting audit history or duplicating the same instructions across several guides. Link related maintained documents instead.

**Review gate:** For each feature PR, link the updated guide, check the procedures against actual source and approved screens, verify current image provenance and links, and list any genuinely deferred screenshots or manual checks. Do not mark unfinished documentation or owner visual approval as completed. A complete guide cannot substitute for required software testing, version acceptance or separate merge/release approval.

## Target-Version Branch And Release Preparation Standard

Apply this standard to every future release, not just Milestone 01. The owner explicitly agrees the target release and integration branch at the start of each milestone (for example, v2.3 on `milestone-2`, if approved). Keep `main` and the current published release accurate and unchanged until their separately authorised release transition.

- Maintain the milestone branch's active release-facing files for its own target version throughout development: README, installation instructions, root Portainer/Compose configuration, permanent version-specific user and administrator guide locations, navigation and Help & Guides links, About/version presentation, release notes and relevant release tooling. Update them alongside approved feature work; do not leave a large version-conversion or file-relocation exercise until publication.
- Treat the whole active development repository as documentation and implementation for its approved target version, not as a mixture of the target and the preceding published release. README, installation/configuration, current guides/indexes, About/Help & Guides, release notes, roadmap, current development status, contributor guidance and release tooling must focus on that target from milestone start. Use a concise truthful target-version unreleased/non-production notice where appropriate; do not repeatedly identify the preceding version as the current release, embed its installation instructions in active target guidance, or require such wording in candidate checks. Keep previous release documentation in history and preserve necessary compatibility notices/URLs, upgrade/migration prerequisites, actual evidence, immutable references and legacy format identifiers. This applies throughout development, not only at publication.
- Clearly identify the candidate as unreleased without implying public availability. Prepare future image/tag/link destinations without claiming that they are already available. Never present an unverified installation, upgrade, backup or recovery procedure as supported or passed. Retain the separately approved publication boundary and strict finalisation gate.
- Preserve older published guidance, historical releases and evidence, legacy format identifiers and compatibility URLs. Archive superseded active release files in their agreed locations; obtain separate approval before destructive changes or restructuring.
- Verify candidate-version consistency in the normal read-only development/PR checks. Keep explicit publication checks strict and separate; no relaxation of owner approval, protected-main, exact-revision, required tests, version, collision, compatibility, architecture or image-availability safeguards. Changes to these checks require their own scoped approval.
- Before the final acceptance and release review, complete all practicable target-version preparation and reconcile outstanding evidence. Record the exact genuinely release-dependent actions that remain; avoid last-minute substantive documentation, configuration or version changes. Recheck affected evidence if the reviewed candidate changes.
- Preparing a milestone branch does not authorise a merge, deployment, tag, image, release, website publication or marketing activity. Preserve the approved acceptance and publication sequence and obtain each separate owner approval.

### Repository Lifecycle And Mandatory Release Finalisation

- At the start of each separately approved milestone, keep active user/administrator guides for its target version in the agreed version-specific directory and a clear documentation index. Archive the preceding published guides, associated instructional screenshots and superseded installation/configuration material under the appropriate version-specific location in `docs/historical/`. Keep prior tags and immutable version-pinned application help links valid. Where older installations use mutable main-branch URLs, retain minimal compatibility notices at those paths linking to the correct archived guide; check both existing legacy path variants and any required anchors. Never silently substitute newer-version instructions. Agree exact moves and compatibility verification before implementation.
- Keep current architecture, API/function references, operational runbooks, coding standards, active milestone plans and required application source/assets/tests in their active locations. At milestone completion, after the relevant acceptance and release records are genuinely complete, archive completed plans, handovers, batch reviews, historical screenshots and development evidence by version, preserving provenance, binary identities, relevant links and historical wording. Do not delete evidence or relocate it while still needed by an active gate. Obtain owner approval for the exact archive scope; do not undertake speculative repository-wide restructuring.
- **Mandatory draft-notice removal gate for every release:** during final documentation reconciliation, inventory every active release-facing notice and reference to the candidate being draft, unreleased, private-review-only, or the prior version being current. Prepare the final wording using actual accepted installation, upgrade, recovery and feature evidence; retain truthful candidate status until the owner explicitly authorises final release preparation. After all required acceptance, offline website preparation and independent audit gates, and before the separately authorised merge to main and publication workflow, complete a reviewed release-finalisation change removing or reconciling every obsolete candidate notice (including each individual user/administrator guide, README, installation instructions, configuration comments, release notes, indexes, About/Help & Guides and active status/support references). Do not replace a previous-version number indiscriminately or remove historical notices/evidence. Pin help links to the final accepted version-specific guide content and verify their actual destinations.
- Prepare the final intended public image/tag references in the reviewed release files before strict publication preflight; availability remains conditional on the owner-authorised publication workflow successfully building/pushing the exact tested revision and verifying platforms and anonymous public access. Do not require the public image to exist before the workflow that creates it, or announce a release prematurely.
- Make the draft-notice inventory and its resolution a recorded release acceptance criterion, not a memory-dependent reminder. Require a scoped residual-notice/link/version scan over all active release-facing files, appropriate automated negative tests for leftover candidate notices and incorrect versions/configuration, strict explicit-version preflight, and independent review of the exact final revision. Preserve historical/compatibility content that is intentionally version-specific. Record the results and any genuine exceptions in the master milestone tracker and release PR; stop if unresolved. Recheck any acceptance or audit evidence affected by final changes. Only after successful publication verification may the website, public download instructions and launch announcements describe the release as available, with their separate approvals.

## Protect Existing Installations

Preserve user data, permissions, existing features and self-hosted installation compatibility unless an explicitly approved specification changes them. Renaming an **internal identifier** is different from renaming an API payload key, exported record field, database column, user-visible file format or other established contract. External contract changes require separate compatibility review, migration planning and approval.

Review permissions and MFA enforcement on the **server**, not merely by hiding interface controls. Test related editing rights across Devices, IPAM and Racks; consider existing device edit reservations, backups, import, security and concurrent users where relevant.

## Security Fixes And Published Releases

For a short, practical security-fix and release sequence, use the [owner checklist](docs/development-guide/Security-Fixes-and-Releases.md). Report sensitive findings through [SECURITY.md](SECURITY.md), never a public issue. Product-owner approval is required separately for code changes, merging, release publication and security-advisory disclosure.

## Focused Development Checks And Final Regression

Keep verification proportionate while a change is in development. Run focused checks for changed features, including the relevant permissions, security and data-safety safeguards, then push a useful checkpoint. Avoid repeating unrelated full suites after each small edit. Evidence-only changes need direct evidence review, not a fresh application-wide local test run.

Draft pull requests defer the repository's complete backend, Docker Compose and multi-browser regression jobs. When the change and its required screenshots are ready for owner review, use **Ready For Review** to start those existing full checks. A further code change requires rechecking the revised head before merge. These three full suites do not run automatically again on a push to the `milestone-1` integration branch; that avoids duplicate work after an approved PR merge. Use PRs for all integration changes. If an exceptional direct change to `milestone-1` is authorised, manually run the full backend, Docker and browser checks. Before merging, confirm the final PR checks cover the current base and head, repeating affected checks if the base has changed materially. Manual and release acceptance checks remain available. Do not describe skipped or outstanding checks as passed.

Coding assistants should not spend their session continuously monitoring GitHub Actions. Report the pushed commit and focused test results and leave CI status checks to the reviewer. Preserve the existing secret-scanning, release-documentation and protected-branch requirements.

## Before Opening A Pull Request

1. Link the relevant issue, follow the product owner's agreed direction, and explain the actual change in plain British English.
2. Review the code and references before renaming; change callers, selectors, tests and documentation together.
3. Run proportionate tests and record actual results. Say plainly what was not run or could not be checked.
4. Complete the pull request template, including the naming, UI, documentation, Function Index and compatibility checks.
5. Respond constructively to review feedback. **Non-conforming contributions are not accepted or merged until corrected or an unavoidable compatibility exception is documented and explicitly approved.**

Automated checks can catch syntax, documentation omissions and some naming problems; **human review remains essential** to establish whether names are genuinely clear. Do not claim CI guarantees semantic naming quality.

The project maintainer agrees the scope and timing of changes and makes the final merge and release decisions. Please work within the agreed scope, test and document what you change, and don't publish preview images or releases unless we've agreed to do so.
