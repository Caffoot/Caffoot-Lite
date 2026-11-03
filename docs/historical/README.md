# Caffoot Lite — Historical documentation

This directory preserves version-specific release material and completed website-release planning for reference. **These are historical records, not instructions to repeat development or release work.**

## Archived materials

**Completed development handovers:** Each release-preparation PR moves the finished active handover into `docs/historical/development-handovers/` using a version-specific filename (for example `v2.0.3.md`). These documents are **historical snapshots**, never permission to restart old tasks. This folder will first appear when a handover is actually archived at a future release gate.

- [Release notes](release-notes/) — published v2.0.1 and v2.0.2 release notes.
- [Portainer examples](portainer/) — version-specific installation stacks associated with those releases.
- [Website release preparation](website/Website-Release-Preparation.md) — the original Docker/SQLite website-launch planning record.

With each future release, its notes and corresponding Portainer example can be kept in these folders. Moving a file in `main` does not alter previously published Git tags, releases or Docker images.

For the **current installation**, start with the [main README](../../README.md) and [installation guide](../../INSTALLATION.md). The README links directly to the latest published Portainer example.

Earlier standalone and Docker releases remain accessible through [GitHub Releases](https://github.com/Caffoot/Caffoot-Lite/releases). Approved interface designs are retained separately under [`future-design/`](../../future-design/).
