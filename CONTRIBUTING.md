# Contributing to Caffoot Lite

Thank you for helping improve Caffoot Lite. Contributions, bug reports, documentation improvements and suggestions are welcome.

## Getting started

Read the [project README](README.md), [documentation homepage](docs/README.md) and [development workflow](docs/standards/technical/DEVELOPMENT-WORKFLOW.md). You do not need to understand the entire codebase before reporting a problem or proposing an improvement.

## Reporting a problem

Open a GitHub issue with the version you used, what you expected, what happened and simple steps to reproduce the problem. Screenshots can help. Never include real passwords, secrets or private inventory information.

## Suggesting an improvement

Describe the problem you want to solve, who it affects and what a good outcome would look like. Discuss substantial changes in an issue before writing code.

## Making a contribution

Use a separate branch and a focused pull request. Explain what changed, why it changed and how it was checked. Follow the existing development standards and tests. Do not claim a test passed unless you actually ran it.

Caffoot Lite stores important inventory data. Changes to saving, loading, imports, migrations and validation must protect existing inventories and older backups. Stronger validation must not leave users unable to save or safely recover their data.

Preserve the standalone single HTML experience. Any future self-hosted functionality should not force existing standalone users to migrate.

## Documentation

Follow the [documentation policy](docs/standards/technical/TECHNICAL-DOCUMENTATION-POLICY.md). Document current behaviour separately from proposed changes, use British English in public-facing text and update the relevant technical workflows after significant changes.

## Review and release

A pull request is a proposal, not an automatic release. Maintainers review changes, compatibility, evidence and release readiness before merging or publishing.

## Finding work and release plans

Before starting a change, check the [GitHub planning and contributor handover](docs/roadmaps/GITHUB-PROJECT-AND-CONTRIBUTOR-PLAN.md) and the linked audit or roadmap issue. A milestone identifies intended release scope; it does not create a branch or authorise a change. Retain historical decisions, test evidence and compatibility requirements when contributing.
