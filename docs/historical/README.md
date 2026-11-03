# Caffoot Lite — Historical documentation

This directory preserves version-specific release material and completed website-release planning for reference. **These are historical records, not instructions to repeat development or release work.**

## Archived materials

**Completed development handovers:** Each release-preparation PR moves the finished active handover into `docs/historical/development-handovers/` using a version-specific filename (for example `v2.0.3.md`). These documents are **historical snapshots**, never permission to restart old tasks. The [v2.0.3 handover](development-handovers/v2.0.3.md) is the first archived example.

- [Release notes](release-notes/) — v2.0.1 and v2.0.2 history plus v2.0.3 release notes.
- [Previous Portainer examples](portainer/) — older, published version-specific installation stacks. The [current v2.0.3 Portainer example](../../../portainer-v2.0.3.yaml) is kept in the repository root.
- [Website release preparation](website/Website-Release-Preparation.md) — the original Docker/SQLite website-launch planning record.

When a newer version is prepared for release, keep its Portainer YAML in the repository root and move the superseded version's YAML into this historical folder. Do not remove existing users' referenced files or alter their data volume mappings. Moving a file in `main` does not change previously published Git tags, releases or Docker images.

For the **current installation**, start with the [main README](../../README.md) and [installation guide](../../INSTALLATION.md). The README links directly to the latest published Portainer example.

Earlier standalone and Docker releases remain accessible through [GitHub Releases](https://github.com/Caffoot/Caffoot-Lite/releases).
