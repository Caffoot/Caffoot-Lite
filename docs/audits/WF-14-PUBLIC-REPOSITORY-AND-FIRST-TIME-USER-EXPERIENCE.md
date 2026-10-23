# WF-14: Public Repository and First-Time User Experience Review

**Status:** Planned, not started. Agreed 23 October 2026.
**Baseline:** Published Caffoot Lite v1.3.0.
**Scope boundary:** New workstream following the original v1.3.0 documentation audit WF-01 to WF-13. This is not a renaming of WF-11, WF-12 or WF-13.

## Purpose

Make the public Caffoot Lite repository accurate, understandable and welcoming for people encountering the application for the first time. The product owner's immediate priority is public release accuracy and reducing avoidable barriers to trying the application, ahead of speculative new functionality. Do not assume low adoption has any one proven cause.

## Review areas

1. **Published release truth:** Compare README, installation instructions, user guide, security guidance, roadmap, release notes and feature descriptions with the actually published v1.3.0 HTML and ZIP. Correct outdated version statements, inaccurate capability claims and misleading screenshots.
2. **First-time path:** Check whether a new visitor can identify what Caffoot Lite does, supported environments, how to download and open it, where their data is stored, how to back it up, and how to get help.
3. **Navigation and discoverability:** Review repository landing page, documentation links, structure, images, GitHub release assets, licences and contribution/support routes. Confirm archived documentation is not presented as current.
4. **Website consistency:** Provide clear, accurate public feature and workflow references for the separate website project. Website changes or publication are not implied by this scope.
5. **Safety and expectations:** State offline/local browser storage, export/restore limitations and recovery guidance accurately. Do not claim automatic backups, live monitoring, a hosted service or multi-user support in v1.3.0.
6. **Adoption evidence:** If available, record owner-provided traffic, release downloads and qualitative user friction as a baseline. Do not introduce telemetry into the offline app or promise adoption gains.

## Acceptance criteria

- Every current public-facing document is reviewed against the published release and either corrected or recorded as accurate, with evidence.
- The README and getting-started path are checked from the perspective of a new user, including the actual download/open/first-backup journey.
- Public navigation links and documentation references are checked, including the temporary compatibility stubs and archived historical notes.
- Screenshots and feature descriptions accurately reflect v1.3.0 and use British English.
- Any issues needing code changes are entered into the roadmap and handled through the permanent seven-stage process; documentation work does not silently alter application behaviour.
- Automated checks and relevant manual checks are recorded as executed, not assumed.
- The workstream has a dated reconciliation and explicit owner approval before merging or publishing.

## Dependencies and sequencing

Complete and reconcile the original WF-01 to WF-13 audit first, while correcting any confirmed serious public misinformation or user-data safety issue as a priority. Keep the existing roadmap maintenance candidates, including the public-documentation version drift finding M-030, visible until resolved. Confirm release packaging dependencies before relocating or editing release documentation.

**Authorisation:** Creating and maintaining this planning document is documentation work on the existing branch. No application source changes, merge to `main`, release, website publication or GitHub ruleset changes are authorised by this record.


## Preliminary public documentation link checkpoint, 23 October 2026

This is a focused prerequisite check during WF-13, not the start or completion of the full WF-14 first-time user review. Inspected relative Markdown links in `README.md`, `INSTALLATION.md`, `USER-GUIDE.md`, `SECURITY.md` and `ROADMAP.md` on the documentation branch. Fourteen distinct linked text or licence targets were successfully fetched from the repository, including current release notes, archived historical notes and release guidance. Three linked PNG screenshots (`docs/screenshots/dashboard.png`, `docs/screenshots/device-inventory.png`, `docs/screenshots/rack-management.png`) could not be validated using the UTF-8 text file reader, which returned a binary decoding error. Their existence and rendering are **unverified, not failed**. External URLs, anchors, image appearance and the published main branch were not checked. No application tests were run. WF-14 remains planned and not signed off.


## First-time installation guide correction, 23 October 2026

Read the published-release instructions in `README.md` and `INSTALLATION.md` on the documentation branch. `INSTALLATION.md` identified v1.3.0 as current near the top but its later `Complete release package` section still directed new readers to the v1.2.0 ZIP. Updated that section to name the v1.3.0 release and ZIP, retaining a clearly historical link to v1.2.0. This is a confirmed **documentation inconsistency**, not an application defect. The release asset's live availability, archive contents and actual browser opening remain to be checked independently. M-030 remains open for wider public document reconciliation; WF-14 is not signed off. No application tests were executed.


## Published v1.3.0 asset listing verification, 23 October 2026

Queried the official GitHub release metadata for tag `v1.3.0` (release ID `419573857`). The public, non-prerelease release was published on 21 October 2026. GitHub lists three uploaded assets: `Caffoot-Lite-1.3.0.zip` (4,501,694 bytes), `Caffoot-Lite.html` (7,700,748 bytes) and `SHA256SUMS` (173 bytes). Their published names match the revised installation instructions. The release metadata also publishes SHA-256 digest fields for the ZIP and HTML assets. This confirms asset listing and naming only; file downloads, checksum recalculation, ZIP contents, browser opening and screenshot image validation remain outstanding. The release description records historical test claims from 21 October; these were not independently rerun during this audit. No application tests were executed or release changes made. WF-14 remains planned, with this preliminary evidence retained.


## README screenshot target verification, 23 October 2026

Queried the GitHub repository directory metadata for `docs/screenshots/` on the documentation branch. All three README targets exist as files: `dashboard.png` (343,858 bytes), `device-inventory.png` (303,519 bytes), and `rack-management.png` (358,454 bytes). The earlier UTF-8 decoding errors came from attempting to read binary PNG files with a text reader and are not missing-file evidence. This verifies repository path existence, **not** image appearance, currency against published v1.3.0, rendering in GitHub or presence on `main`. Visual review and release comparison remain open. No application tests were run.


## Screenshot identity comparison with main, 23 October 2026

Retrieved GitHub directory metadata for `docs/screenshots/` on both `main` and the documentation branch. `dashboard.png`, `device-inventory.png` and `rack-management.png` each have the same Git blob SHA and byte size on both branches. Therefore the three image files are byte-identical across these branches. This does not verify their visual content or whether the screenshots represent the published v1.3.0 interface. Image inspection and release comparison remain open. No browser or application tests were executed.


## Screenshot provenance and source terminology review, 23 October 2026

Queried the latest GitHub commit affecting each README screenshot on `main`. All three were last changed by commit `cc4cfce5f9cfe6974dc2cad9ca72ab065a58b98f`, dated 11 October 2026, before publication of v1.3.0 on 21 October. This timing creates a need for visual comparison but does **not** establish that any image is outdated. Inspected the current v1.3.0 source HTML on the documentation branch and found the Rack Overview, Rack Inventory and Rack Accessories navigation labels. These textual checks do not establish that the screenshots depict those screens or their current layouts. The image binaries could not be visually inspected through the available text-only GitHub retrieval route. Retain screenshot currency as **unverified** until images can be viewed alongside the released application. No screenshot or application file was changed and no browser test was run.
