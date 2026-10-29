# Caffoot Lite

Caffoot Lite is an inventory application for small IT teams.

## Published release: v1.3.3

**v1.3.3 is the published, usable HTML application.** For the existing release, its documentation, downloads and source, see [the v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3).

## Next: Docker and SQLite development

**Next is under active development and is not ready to replace v1.3.3.** Its goal is to preserve the published v1.3.3 inventory experience while moving authoritative inventory storage to a central SQLite backend, with approved multi-user access.

The single approved scope and acceptance specification is [issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215). No unapproved inventory redesign or feature expansion is planned.

For the current **development-only** Docker Compose configuration, HTTPS certificate guidance, tests and implementation status, see [next/README.md](next/README.md). The current backend does **not** provide the complete inventory UI or supported production migration.

Existing v1.3.3 users should continue using the published release. The planned one-way migration into Next will require a fresh JSON backup exported from published v1.3.3 after the import workflow is completed and verified. Older HTML versions must first upgrade to v1.3.3 before exporting.
