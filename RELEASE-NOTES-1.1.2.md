# Caffoot Lite v1.1.2 — Release Candidate Notes

**Status:** Draft release candidate — not merged, tagged or published. The stable public release remains v1.1.1.

## Highlights

- **Security hardening:** Additional regression checks for backup JSON validation, hostile object properties, browser-storage recovery, output escaping and malformed rack accessory placement.
- **Release privacy checks:** A release gate checks repository or extracted development-folder paths for likely private/generated data and validates the two approved fictional backup fixtures. It does not establish that Git history or file contents are free of secrets.
- **Network surface guard:** A static regression test monitors known browser network APIs and the explicit GitHub latest-release check. This is not a substitute for runtime network inspection.
- **Safer release packaging:** The packager requires the source application version to match npm package metadata and verifies the ZIP member allowlist, embedded notices, dependency licence copies and extracted file hashes.
- **Documentation:** Security reporting and browser-local inventory storage limitations are documented. Access point mounting terminology uses Tabletop / Shelf Mounted, Ceiling Mounted, Wall Mounted and Pole Mounted; older backup mounting values remain subject to compatibility checks.

## Tailwind CSS v4 dependency upgrade (integrated and tested)

- Upgraded the offline build from Tailwind CSS v3.4.17 to **Tailwind CSS v4.3.3** with **@tailwindcss/cli v4.3.0** and **@parcel/watcher v2.6.0**.
- The owner ran a clean `npm ci` installation and `npm audit --audit-level=moderate`, reporting **zero vulnerabilities** in the installed dependency tree at test time (down from seven reported on the v3 baseline).
- The owner ran the earlier **21-step** experimental pipeline successfully, then tested a clean checkout of the combined integration branch with **all 27 release pipeline steps passing**, including both new XSS regression checks and standalone HTML/ZIP packaging.
- The owner manually verified test-data import, screens, light/dark themes, wireless access point and desktop configuration, modals, and Escape-key behaviour without observing regressions.
- Tailwind v4 and the new XSS regression tests were integrated into the v1.1.2 security-hardening branch through PR #43. The build-time dependency audit does not establish that the application is free of all vulnerabilities; broader security review remains outstanding.

## Upgrade and data safety

**Export and safely retain a JSON backup before switching versions.** Inventory resides in browser local storage rather than inside the HTML. Moving or renaming a local `file://` application can change browser storage scope and make an existing inventory appear absent. Verify the restored data before deleting any backup.

Caffoot Lite remains a standalone offline-capable HTML application. The optional, user-initiated GitHub release check is the known outbound network call; no automatic inventory upload is intended.

## Security scope and limitations

These improvements are defensive safeguards and automated regression tests, **not** a formal security audit or a guarantee against all malicious inputs. Browser local storage and exported backups are not encrypted by Caffoot Lite. Protect exported inventories accordingly.

## Release verification — outstanding

- [x] Development-stage automated release pipeline passed before the v1.1.2 version bump.
- [x] Owner verified fresh-browser startup, disposable device backup export/import and offline operation.
- [x] Package-version consistency safeguard passed before the version bump.
- [ ] Complete historical repository and sensitive-content review.
- [x] Update and audit the experimental Tailwind v4 build dependencies; clean npm audit reported zero vulnerabilities. 
- [x] Owner inspected browser network activity during normal use; no unexpected outbound HTTP(S) requests observed. Remaining dynamic HTML surfaces require review.
- [ ] Review documentation and built-in Help & Guides for v1.1.2 consistency.
- [x] Owner ran the full v1.1.2 release pipeline successfully; the uploaded candidate ZIP passed initial integrity, manifest and sensitive-pattern checks.
- [x] Owner confirmed the v1.1.2 About screen and offline browser navigation.
- [x] Integrated Tailwind v4 build passed clean-install release packaging and integrity checks; all 27 release steps and owner browser smoke tests passed.
- [x] Clean checkout of the combined integration branch passed the complete release pipeline and ZIP integrity checks before documentation-only updates.
- [ ] Re-run final release packaging and inspect artifacts after the documentation updates.
- [ ] Obtain explicit owner approval before merging, tagging or publishing.
