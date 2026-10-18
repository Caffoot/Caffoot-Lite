# Release Checklist

Use this checklist for every Caffoot Lite release, including patch releases. Keep changes on a reviewable branch and do not publish until the release owner approves.

## Before merging
- [ ] Confirm version in application, package metadata, release notes and filenames.
- [ ] Run the full local release command and confirm every automated check passes.
- [ ] Test the built standalone HTML in a browser and offline.
- [ ] Test JSON backup export, import/restore, and persistence with disposable data.
- [ ] Review security, rollback and compatibility changes as appropriate.
- [ ] Review README, INSTALLATION, USER-GUIDE, ROADMAP, BACKUP-FORMAT, release notes and relevant design documents for version accuracy, links and unfinished draft wording.
- [ ] Update and manually review the built-in offline Help & Guides topics for any new or changed features, controls, labels, safety guidance and navigation.
- [ ] Confirm source on the review branch matches the tested build; inspect merge changes.
- [ ] Merge only after review and owner approval.

## Publishing
- [ ] Create the version tag from the intended main commit.
- [ ] Publish the release with approved release notes, versioned ZIP, standalone HTML and SHA256SUMS.
- [ ] Check that Latest/pre-release settings are correct.
- [ ] Verify public downloads and compare SHA256 checksums with the original local build.
- [ ] Verify the ZIP opens and includes the intended guides, licences and notices.

## After publishing
- [ ] Update main-branch documentation from release-candidate to published status in a separate reviewable documentation change.
- [ ] Verify latest-release links and release asset names.
- [ ] Confirm the release tag remains unchanged after documentation-only housekeeping.
- [ ] Merge the documentation closeout change after review.
- [ ] Delete completed development/housekeeping branches only after all changes are safely merged.
- [ ] Record any remaining follow-ups for the next milestone.

## v1.1.0 closeout record — 18 October 2026

Published release: https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.1.0

The owner confirmed successful automated release, manual browser/offline and backup/restore tests. The downloaded ZIP and extracted release HTML matched the original local build hashes:

- ZIP: `3FBD5A5050C998D5A49FC834F0E0E13C0C88CFCD9433334777CFEFCA65468239`
- HTML: `0D5901373F50A9081AF6211B1D9BA0ED9832374857191983DBE3ACB52C62111C`

Documentation closeout and branch deletion remain subject to review and completion.

## v1.1.1 closeout record — 18 October 2026

Published release: https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.1.1

- [x] Owner completed nine browser acceptance checks, including offline operation and disposable backup/restore.
- [x] Automated regression suite, standalone build and versioned ZIP packaging passed.
- [x] GitHub Actions validation passed after updating the version check to follow package metadata.
- [x] PR #39 reviewed and merged into `main` with owner approval.
- [x] Public stable v1.1.1 release verified with ZIP, standalone HTML and SHA256SUMS assets.
- [ ] Compare public asset SHA256 hashes with the original locally generated artifacts; record results when checked.
- [ ] Merge the separate v1.1.1 documentation closeout PR after review.

This record is historical; the reusable checklist above remains unchecked for the next release.
