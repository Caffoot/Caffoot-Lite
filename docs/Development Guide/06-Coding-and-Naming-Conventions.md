# 06 — Coding And Naming Conventions

## In Simple Terms

A contributor should be able to search for an identifier and understand what it does. **Meaningful names, consistent UI wording and accurate documentation are mandatory contribution standards for all future Caffoot Lite development**, whether a change comes from the product team or the community. See [CONTRIBUTING.md](../../CONTRIBUTING.md) and the [source-pinned Function Index](Function-Index.md).

The patterns below reflect the released v2.0.1 source. Existing historical names are not endorsements of opaque or version-based naming. **Clarity and maintainability are valid reasons to rename code** during approved work.

## JavaScript And HTML

| Kind | Naming rule | Examples |
| --- | --- | --- |
| Functions | Descriptive lower `camelCase`; prefer action + domain noun | `getDeviceById`, `renderDevicesHTML`, `validateRackPlacement` |
| Reading and display | `get…` / `render…`; distinguish data access from markup | `getDeviceById`, `renderDevicesHTML` |
| Checking and planning | `validate…` / `plan…` before applying changes | `validateRackPlacement` |
| Changing state | `save…` / `apply…`; make side effects clear | `applyAllowedControls` |
| Variables | Descriptive lower `camelCase` | `activeSettingsSection`, `selectedRackId` |
| Constants | Established `UPPER_SNAKE_CASE` for shared immutable configuration | `STORAGE_KEY` (historical example) |
| HTML IDs and action hooks | Descriptive semantic `kebab-case`; match all event consumers | `device-detail-panel`, `data-action` |
| CSS classes | Descriptive semantic `kebab-case` naming component and purpose | `rack-accessory-item`, `rack-accessory-port` |

Avoid placeholders such as `phase3Thing`, `tempHandler2`, `newFeature` or version labels masquerading as explanations. Some current functions and hooks still contain historical `next` or `v13` prefixes. Review these deliberately during approved clean-up; replace them consistently, including callers, DOM selectors, tests and docs.

## Python

Use descriptive `snake_case` for functions, variables and module names, `PascalCase` for classes and exceptions, and `UPPER_SNAKE_CASE` for constants. Existing examples: `initialise_database`, `reconstruct_inventory`, `save_reserved_device`, `set_permission`, `SCHEMA_VERSION`, `SESSION_SECONDS`, `Handler`, `ImportDrafts`.

Follow established responsibility boundaries: `server.py` handles requests, `permissions.py` determines access, `device_saves.py` handles device writes and `schema.py` defines SQLite migrations. Avoid extra layers without an approved need.

## User-Facing UI Text

Use **Title Case** consistently for navigation, page headings, tabs, buttons, form labels, table headings and brief statuses: **Add User**, **Back To All Users**, **No Access**, **Read Only**, **MFA Enrolled**. Keep technical acronyms correctly capitalised: IPAM, MFA, VLAN, LDAP, SQLite. Use ordinary sentence case for help text, instructions, error details and paragraphs, prioritising readability and accessibility.

Apply the same approved design principles, terminology and labels throughout the light and dark interfaces.

## Refactoring And Compatibility

Renaming existing identifiers for contributor clarity is welcome **when the change has been approved**; it is not limited to cases where the original identifier caused a bug. However, a source-level refactor must be complete and verified. Search for dynamic references, event handlers, selectors, inline attributes, tests and documentation as well as direct function calls.

Preserve published inventory record fields such as `rackAccessories`, `ipAllocations`, `primaryIp`, `rackId`, `deviceId` and `virtualHostId` unless a separately approved compatibility plan intentionally changes their public meaning or representation. Python/SQL names such as `record_json` and `base_revision` must also remain compatible. An API payload key must match both frontend and backend, and cannot be renamed casually.

## Code Comments And Docstrings — Written For Everyone

**Source comments are public-facing documentation for the Caffoot Lite community.** Write them in clear **British English** for a reader who is learning to code or has no programming background. The intended audience is a person trying to understand the application, **not a professional developer or an AI tool**.

For comments in JavaScript, Python, HTML, CSS and other project-owned code:

- Explain **what the code does** in ordinary words. Where helpful, also explain **why it does it**, what may change and what problem it prevents.
- Use short, complete, accurate explanations and define specialist terminology when it is necessary.
- Make important security, data-protection, compatibility or unusual behaviour understandable without assuming prior knowledge.
- Avoid unexplained acronyms, dense jargon, AI-facing prompts, personal shorthand, phase/stage labels and temporary development notes.
- Do not comment on every self-explanatory statement; unnecessary comments can make code harder to understand.
- Keep comments in step with the code. Update or remove a comment when its explanation becomes inaccurate.

For example, prefer:

```javascript
// Stop another user from editing this device while someone else is saving changes.
// This prevents one person's work from accidentally replacing another person's work.
```

over a cryptic note such as `// lock CAS v2, retry handler`.

Names and comments work together: use descriptive identifiers, then use plain-language comments to clarify the behaviour or reasoning that the name alone cannot convey. Longer explanations belong in maintained guides, with clear links from the relevant code.

## Documentation And Function Index

**Keep the documentation accurate as you work.** When functions are added, deleted, moved or renamed, regenerate and review [`Function-Index.md`](Function-Index.md) in the **same PR**, with the correct source snapshot, function links and reference locations. Its textual call-like reference counts do not establish whether a function is used. Documentation for interfaces, components, configuration, security, user workflows and data relationships belongs in the relevant guides too; not every individual line requires an index entry.

Apply the public-facing comment standard above to source comments and docstrings. Correct stale descriptions (some v2.0.1 backend modules still mention 'offline' or 'future' despite serving requests).

## Acceptance And Review

Contributions that do not meet these standards **must not be merged** until corrected, or a strictly necessary compatibility exception is explicitly documented and approved. Apply a proportionate combination of automated checks and human review; automated naming patterns alone cannot judge descriptive quality.

Before implementing, check the current main-branch source, the relevant approved specification and tests, and the [Function And Code Reference](07-Function-and-Code-Reference.md). [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215) and [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218) remain important **historical** implementation records, but do not govern future releases. [#222](https://github.com/Caffoot/Caffoot-Lite/issues/222) is an ideas register, not permission to start a feature.
