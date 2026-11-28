# Caffoot Lite — Historical documentation

This directory preserves version-specific release material and completed website-release planning for reference. **These are historical records, not instructions to repeat development or release work.**

## Archived materials

**Completed development handovers:** Each release-preparation PR moves the finished active handover into `docs/historical/development-handovers/` using a version-specific filename (for example `v2.0.3.md`). These documents are **historical snapshots**, never permission to restart old tasks. The [v2.0.3 handover](development-handovers/v2.0.3.md) is the first archived example.

- [Release notes](release-notes/) — version history, including earlier releases and explicitly unreleased v2.2 notes; the original release-preparation wording is preserved inside the records.
- [Complete v2.1 feature guides](features-and-instructions/v2.1/README.md) — all eight original guides, with their existing screenshot paths retained.
- [Published v2.1 installation guide](installation/INSTALLATION-v2.1.md) — original claims retained, with links corrected for this location.
- [Previous Portainer examples](portainer/) — older, published version-specific installation stacks. The [published v2.1 Portainer example](portainer/portainer-v2.1.yaml) is archived here.
- [Website release preparation](website/Website-Release-Preparation.md) — the original Docker/SQLite website-launch planning record.

When a newer version is prepared for release, keep its Portainer YAML in the repository root and move the superseded version's YAML into this historical folder. Do not remove existing users' referenced files or alter their data volume mappings. Moving a file in `main` does not change previously published Git tags, releases or Docker images.

The [root README](../../README.md) and [root installation guide](../../INSTALLATION.md) prepare unreleased v2.2 on this branch; isolated review is not a production release.

Earlier standalone and Docker releases remain accessible through [GitHub Releases](https://github.com/Caffoot/Caffoot-Lite/releases).
