# Contributing To Caffoot Lite

Thank you for helping improve Caffoot Lite. We want contributors to find understandable code, reliable documentation and an approachable review process. **The same standards apply to maintainers and outside contributors.**

## Start With An Agreed Scope

Caffoot Lite v2.0.1 is the released Docker/SQLite baseline. Before writing code, read the [Development Guide](docs/Development%20Guide/README.md), the [Coding And Naming Conventions](docs/Development%20Guide/06-Coding-and-Naming-Conventions.md), and the [Function Index](docs/Development%20Guide/Function-Index.md). Check existing source, tests and relevant approved GitHub decisions.

An idea in [Future Ideas Register #222](https://github.com/Caffoot/Caffoot-Lite/issues/222) is **not** implementation approval. Discuss proposed features or changes and obtain the product owner's explicit agreement on their scope before implementation. Historical issues #215 and #218 describe completed release work; they are not blanket restrictions on future versions.

Keep changes focused and explain which agreement or identified defect they address. Do not add speculative features, unnecessary infrastructure or unrelated architecture changes.

## Mandatory Naming And UI Standards

Every new or modified code component must use a meaningful, searchable name that tells a reader **what it is or what it does**, not when or in which development phase it was written.

- **JavaScript:** descriptive `camelCase` functions and variables, preferably verb plus domain, such as `renderDeviceDetails`, `validateRackPlacement` and `saveUserPermissions`.
- **Python:** descriptive `snake_case` functions, methods, modules and variables; `PascalCase` classes and `UPPER_SNAKE_CASE` constants.
- **HTML/CSS:** descriptive semantic `kebab-case` IDs, classes and event/action hooks; keep selectors, event handlers, accessibility labels and CSS aligned.
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

Do not leave documentation for a later release or for another contributor.

- Update the relevant guides for changed behaviour, controls, data flows, deployment steps, configuration or security rules.
- **When functions are added, removed, moved or renamed, regenerate and review** [`docs/Development Guide/Function-Index.md`](docs/Development%20Guide/Function-Index.md) in the same pull request, keeping its source revision and links truthful. The index is a navigation aid, **not** proof that a function is unused; textual reference counts are not a call graph.
- Update the [Function And Code Reference](docs/Development%20Guide/07-Function-and-Code-Reference.md) and other architecture or user guides where affected.
- New source lines do not each need an entry in a function index. Every meaningful new or changed function should be indexed; document components and behaviour at the appropriate level.
- Remove outdated user-facing development terminology in the part of the application being changed.

## Protect Existing Installations

Preserve user data, permissions, existing features and self-hosted installation compatibility unless an explicitly approved specification changes them. Renaming an **internal identifier** is different from renaming an API payload key, exported record field, database column, user-visible file format or other established contract. External contract changes require separate compatibility review, migration planning and approval.

Review permissions and MFA enforcement on the **server**, not merely by hiding interface controls. Test related editing rights across Devices, IPAM and Racks; consider existing device edit reservations, backups, import, security and concurrent users where relevant.

## Before Opening A Pull Request

1. Confirm the change's approved scope and explain it in plain British English.
2. Review the code and references before renaming; change callers, selectors, tests and documentation together.
3. Run proportionate tests and record actual results. Say plainly what was not run or could not be checked.
4. Complete the pull request template, including the naming, UI, documentation, Function Index and compatibility checks.
5. Respond constructively to review feedback. **Non-conforming contributions are not accepted or merged until corrected or an unavoidable compatibility exception is documented and explicitly approved.**

Automated checks can catch syntax, documentation omissions and some naming problems; **human review remains essential** to establish whether names are genuinely clear. Do not claim CI guarantees semantic naming quality.

The [v2.0.1 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1) remains the published baseline. Each future change must be separately authorised, reviewed, tested and approved before merge. Publication requires its own approval.
