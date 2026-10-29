# Caffoot Lite development reference

Caffoot Lite v1.4 is the planned Docker and database application. The published [v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3) remains the standalone fallback and historical reference.

Start with the [current roadmap](../ROADMAP.md) and [v1.4 foundation plan](roadmaps/V1.4-FOUNDATION-AND-RELEASE-PLAN.md). GitHub issue [#105](https://github.com/Caffoot/Caffoot-Lite/issues/105) records current scope and owner decisions.

## References needed to develop v1.4

- [Existing application workflows](workflows/TECHNICAL-WORKFLOWS.md): how the standalone application behaves and preserves data
- [Coding and naming reference](standards/coding/DEVELOPER-CODING-AND-NAMING-REFERENCE.md): descriptive function names and source conventions
- [Development workflow](standards/technical/DEVELOPMENT-WORKFLOW.md): approvals, focused testing and release process
- [Architecture index](architecture/README.md): existing designs and proposals, which must not be mistaken for implemented v1.4 behaviour
- [Existing test evidence](testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md): recorded coverage to reuse where applicable
- [Backup format](../BACKUP-FORMAT.md): existing standalone data compatibility
- [Installation](../INSTALLATION.md), [user guide](../USER-GUIDE.md) and [security guidance](../SECURITY.md): published user-facing baseline

The application source, build scripts and automated tests remain under [app](../app/). Release documentation and packaging scripts remain at their existing paths until the v1.4 replacement is agreed.

Historical audit, planning and investigation files are not active development instructions. Their previous revisions remain in Git history. Do not rerun successful application tests merely because documentation changes. Keep the active documentation small and update only references affected by actual code or architecture decisions.
