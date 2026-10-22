# Documentation relocation and compatibility register

**Scope:** Documentation branch only. The published v1.3.0 application is unchanged.

## Completed

- 22 technical documents copied into subject directories with their original blob content retained.
- Five non-packaged root documents copied into subject directories with their original blob content retained.
- Documentation homepage, contributor guide, getting-started index and section indexes created.
- Root README, contributor guide and documentation homepage updated for selected canonical paths.

## Temporary compatibility locations

The 22 former docs root document paths and five former repository root document paths currently contain navigation stubs. These are **not** the authoritative technical documents. Keep them until all internal references, external references and release guidance are reviewed.

The five root stubs are:
- `DEVELOPMENT-WORKFLOW.md`
- `DISCOVERABILITY.md`
- `RELEASE-ACCEPTANCE.md`
- `RELEASE-CHECKLIST.md`
- `RELEASE-REVIEW.md`

## Release build dependencies

Source inspection of `app/package-release.cjs` found an explicit package input list containing:
- `RELEASE-NOTES-<version>.md`
- `LICENSE`
- `THIRD-PARTY-NOTICES.md`
- `INSTALLATION.md`
- `USER-GUIDE.md`
- `BACKUP-FORMAT.md`

Source inspection of `app/build-offline.cjs` also found `THIRD-PARTY-NOTICES.md` among its notice paths.

**Do not remove or move these release inputs** until the build and package paths are updated with approval, release verification is run and the resulting archive is inspected. Moving them is not required to complete documentation navigation.

`README.md`, `CONTRIBUTING.md`, `ROADMAP.md` and `SECURITY.md` should remain discoverable at the root.

## Outstanding checks

1. Search Markdown and source files for references to former locations.
2. Update relative links based on the *new document's* directory, not just its filename.
3. Check Markdown link destinations and fragment anchors.
4. Inspect GitHub workflow and release package references before considering any root release file move.
5. Decide whether temporary stubs can be removed without breaking links to prior documentation.
6. Review the resulting directory tree with the project owner.
7. Resume the v1.3.0 technical workflow audit, with P11/P12 and browser tests still open.

## Safety

Documentation moves and index updates are not evidence that application behaviour has changed or browser tests have passed. No production release, merge or application code change is authorised by this register.
