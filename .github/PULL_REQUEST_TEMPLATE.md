# Caffoot Lite — Change Review

Thank you for contributing. This checklist applies to **maintainers and community contributors**. Read [CONTRIBUTING.md](../CONTRIBUTING.md) and the [Coding And Naming Conventions](../docs/Development%20Guide/06-Coding-and-Naming-Conventions.md) before submitting.

## Purpose And Approval

- What is changing, and why does it benefit users or contributors?
- Link the relevant product-owner-approved scope, issue or confirmed defect. **Ideas in #222 are not authorisation to implement them.**
- Does this intentionally change a released v2.0.1 workflow or control? Identify any deviations requiring product-owner approval.

## Mandatory Contribution Checklist

- [ ] Every new or changed JavaScript/Python/CSS/HTML identifier has a clear, descriptive name following the established language conventions.
- [ ] User-facing headings, buttons, tabs, form labels, navigation and short statuses use agreed **Title Case**, with technical acronyms preserved. Explanatory prose remains readable.
- [ ] No new opaque `phase`/`stage`/`next`/temporary names or stale development-stage comments are introduced.
- [ ] All relevant callers, event handlers, selectors, imports and tests have been updated alongside any refactor.
- [ ] Affected development, user and configuration documentation is updated **in this PR**.
- [ ] Named function additions, removals, moves or renames are reflected in the [Function Index](../docs/Development%20Guide/Function-Index.md) with accurate source revision and navigation links; or explain why this PR makes no relevant function-index change.
- [ ] Existing behaviour, user data, permissions, MFA, import and installation compatibility have been checked as appropriate.
- [ ] Any unavoidable public contract or compatibility exception has been identified, justified and explicitly approved.

## Verification

List the tests or checks actually run, with outcomes and the source revision checked. Record any skipped, blocked or failed tests honestly. Do not report historical test results as current.

## Review And Merge

Changes that do not meet the naming, presentation, documentation and safety standards are returned for correction. Where a compatibility constraint requires an exception, explain it and obtain explicit approval. **Product-owner approval is required before merge; publishing a release requires separate approval.**

Historical [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215) and [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218) governed completed v2.0/v2.0.1 work, not every future change.
