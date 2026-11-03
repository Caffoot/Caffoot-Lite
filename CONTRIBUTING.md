# Contributing To Caffoot Lite

Thank you for helping improve Caffoot Lite. We want contributors to find understandable code, reliable documentation and an approachable review process. **The same standards apply to maintainers and outside contributors.**

## Start With An Agreed Scope

Caffoot Lite v2.0.3 is the current Docker/SQLite release; v2.0.2 remains its published security-maintenance predecessor. Before writing code, read the [Development Guide](docs/development-guide/README.md), the [Coding And Naming Conventions](docs/development-guide/06-Coding-and-Naming-Conventions.md), and the [Function Index](docs/development-guide/Function-Index.md). Check existing source, tests and relevant approved GitHub decisions.

**One feature or improvement per GitHub issue.** Anyone is welcome to [suggest a feature](https://github.com/Caffoot/Caffoot-Lite/issues/new/choose) or join an existing discussion. [Future Ideas Index #222](https://github.com/Caffoot/Caffoot-Lite/issues/222) links existing ideas; new requests should have their own issues. Record discussions, product-owner decisions, changes of scope and acceptance feedback in the relevant issue. The product owner decides what gets built and when; contributors should not start unrelated work or publish anything on their own initiative. Historical issues #215 and #218 are completed release history, not restrictions on future development.

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

## Protect Existing Installations

Preserve user data, permissions, existing features and self-hosted installation compatibility unless an explicitly approved specification changes them. Renaming an **internal identifier** is different from renaming an API payload key, exported record field, database column, user-visible file format or other established contract. External contract changes require separate compatibility review, migration planning and approval.

Review permissions and MFA enforcement on the **server**, not merely by hiding interface controls. Test related editing rights across Devices, IPAM and Racks; consider existing device edit reservations, backups, import, security and concurrent users where relevant.

## Security Fixes And Published Releases

For a short, practical security-fix and release sequence, use the [owner checklist](docs/development-guide/Security-Fixes-and-Releases.md). Report sensitive findings through [SECURITY.md](SECURITY.md), never a public issue. Product-owner approval is required separately for code changes, merging, release publication and security-advisory disclosure.

## Before Opening A Pull Request

1. Link the relevant issue, follow the product owner's agreed direction, and explain the actual change in plain British English.
2. Review the code and references before renaming; change callers, selectors, tests and documentation together.
3. Run proportionate tests and record actual results. Say plainly what was not run or could not be checked.
4. Complete the pull request template, including the naming, UI, documentation, Function Index and compatibility checks.
5. Respond constructively to review feedback. **Non-conforming contributions are not accepted or merged until corrected or an unavoidable compatibility exception is documented and explicitly approved.**

Automated checks can catch syntax, documentation omissions and some naming problems; **human review remains essential** to establish whether names are genuinely clear. Do not claim CI guarantees semantic naming quality.

The [v2.0.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.3) is the current published baseline. The project maintainer agrees the scope and timing of changes and makes the final merge and release decisions. Please work within the agreed scope, test and document what you change, and don't publish preview images or releases unless we've agreed to do so.
