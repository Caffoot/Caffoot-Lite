# Caffoot Lite — Pull Request

Thanks for helping improve Caffoot Lite! A short, clear explanation is more useful than a long development diary. See [CONTRIBUTING.md](../CONTRIBUTING.md) for our community writing and coding standards.

## Why are we making this change?

Tell us what problem this solves or what it improves. Link the relevant issue and agreed scope so reviewers can find the discussion. An idea or feature request alone isn't approval to start implementation.

## What changed?

Explain the main changes in everyday language. If you've left anything for a later release, mention it here.

## How have you checked it?

List the tests or checks you **actually ran**, with results. Mention any failed, skipped or unavailable checks honestly. Don't present an earlier test run as evidence for new changes.

## Anything to be aware of?

Note any effect on existing data, permissions, MFA, backups, Docker installations or user workflows. If nothing changes for existing users, a short sentence is enough. Keep sensitive security details in the [private reporting process](../SECURITY.md), not in public PR discussion.

## Before we merge

Tick the checks relevant to your change. If one doesn't apply, say so rather than doing unnecessary work.

- [ ] The pull request description **and our linked issue/PR progress comments** are written in friendly, clear British English for community readers. They explain what changed, why it matters, what was checked and what happens next. See [Before Posting An Issue Or Pull Request Update](../CONTRIBUTING.md#before-posting-an-issue-or-pull-request-update). **This applies to every PR, including maintainer and AI-assisted work.**
- [ ] This change follows the agreed scope and links the relevant issue or decision.
- [ ] New code names, folder paths and interface labels follow our [naming conventions](../docs/development-guide/06-Coding-and-Naming-Conventions.md).
- [ ] New or changed code comments are accurate, understandable and written in plain British English.
- [ ] Callers, imports, selectors, tests and documentation affected by a rename or refactor have been updated.
- [ ] Relevant user and developer guides, plus the active handover (when one exists), or the [archived v2.0.3 handover](../docs/historical/development-handovers/v2.0.3.md), have been updated where needed.
- [ ] If functions were added, removed or renamed, the [Function Index](../docs/development-guide/Function-Index.md) is accurate, or the reason no update is needed is explained.
- [ ] Existing functionality, permissions, security and installation compatibility have been checked as appropriate.
- [ ] Tests run, results and any remaining limitations are described above.

**Maintainer review:** Check public explanations and progress comments as well as the code. If the writing is too technical or unclear, ask for a clearer version before approving the merge. Green automated checks do not verify writing quality.

We review changes against the agreed scope, coding standards and actual test evidence. **The project maintainer must approve a merge; publishing a release is a separate decision.**

The completed v2.0/v2.0.1 work in [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215) and [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218) is historical context, not a new restriction on improvements.
