# WF-14: Public Repository and First-Time User Experience Review

**Status:** In progress as at 23 October 2026. First-time owner manual walkthrough completed; public repository review and final sign-off remain outstanding.
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


## Product owner visual screenshot review, 23 October 2026

The product owner opened v1.3.0 with a small fictional demonstration inventory and supplied screenshots of **Devices > Overview (Device Intelligence Overview)** and **Network Racks > Rack Overview**. The owner confirmed that the main Dashboard has not changed, while the Devices and Racks overview screens have changed. The supplied Devices view shows Overview, Hardware, Operating Systems, Software & Services and Data Quality tabs, with four demo devices. The supplied Rack Overview shows two racks, 36U physical capacity, two mounted devices, one accessory and capacity/occupancy summaries. This is **owner-provided visual evidence**, not an automated browser test or proof of all functionality. The README gallery still points to the original `device-inventory.png` and `rack-management.png` images; replacement images have not yet been committed to the repository. Before updating the gallery, confirm whether the existing device inventory and rack elevation images should remain as additional examples, or be replaced with the new overview screenshots. The existing main Dashboard screenshot may be retained subject to its original image accuracy. WF-14 and M-030 remain open.


## Five-image gallery approval and binary asset staging, 23 October 2026

The product owner approved retaining the existing Dashboard, Device Inventory and Rack Elevation images and adding two v1.3.0 overview images. The owner supplied a separate Rack Overview PNG and an earlier Devices Intelligence Overview PNG. Both were inspected as 1870 × 942 and 1862 × 941 pixel screenshots respectively, with fictional demo data. Prepared filenames `devices-overview-v1.3.0.png` and `rack-overview-v1.3.0.png` and a two-image ZIP for transfer. **The binary images are not yet in the GitHub branch** because the available repository file update action only supports UTF-8 text and the image transfer route has not been completed. Accordingly, the README gallery must not link to these paths until the files are committed and verified. Remaining steps: add both PNGs to `docs/screenshots/`, extend the README gallery to five images with accurate alt text, verify links and rendering, reconcile master audit and then seek merge approval. No application or browser tests were executed, and no application code changed.


## Five-image README gallery implementation, 23 October 2026

The product owner uploaded `docs/screenshots/devices-overview-v1.3.0.png` (74,275 bytes) and `docs/screenshots/rack-overview-v1.3.0.png` (83,753 bytes) to the existing documentation branch. Confirmed both through GitHub directory metadata alongside the three unchanged original screenshots. Updated `README.md` to display five images: Dashboard, Device Intelligence Overview, Rack Overview, Device Inventory and Rack Elevation. The two new images were supplied from the product owner's v1.3.0 visual check with fictional demo inventory. The original detailed inventory and rack elevation screenshots were retained as agreed. **Verification executed:** GitHub file existence/size retrieval and README Markdown link target comparison. **Not executed:** browser rendering, image content regression, application test suite or release packaging. The gallery change is committed only on the documentation branch, not merged to public `main`. WF-14's wider public review and M-030 remain open.


## Installation feature and navigation correction, 23 October 2026

Reviewed `INSTALLATION.md` against published v1.3.0 release metadata and the v1.3.0 source navigation. The guide identified v1.3.0 as current but prominently titled its feature introduction `What's new in v1.2.0` and used `Racks` rather than the current `Network Racks` sidebar label in first steps. Updated the heading and text to describe the v1.3.0 Network Racks workspace while preserving v1.2.0 as historical background. Corrected the first steps navigation label. Verification: read back the revised guide text and compared the labels with inspected source. No browser or application tests were run. Wider M-030 and WF-14 checks remain open; no application change, merge or release.


## User guide release framing correction, 23 October 2026

Reviewed `USER-GUIDE.md` against the published v1.3.0 scope and current source labels. Its introductory Devices section was still headed `v1.2.0 Devices & Intelligence` despite describing the v1.3.0 guide, and its Settings section was headed `(v1.1.1)` and repeated the same tab list. Revised the headings to describe the current v1.3.0 experience, retained historical origin in prose and removed the repeated Settings explanation. Preserved backup, restore, recovery and browser storage cautions. The current source includes the `Software & Firmware` form label and `Software & Services` overview label, which refer to different interfaces and must not be conflated. **Executed:** textual source and revised-document checks. **Not executed:** browser or automated application tests. M-030 and the wider WF-14 review remain open.


## Everyday workflow guidance improvement, 23 October 2026

Expanded `USER-GUIDE.md` first-use guidance for adding devices, selecting subnets/IP addresses and opening Network Racks. Checked current v1.3.0 source for the `Add Device`, `Add Rack`, `Rack Inventory`, `Manage Subnets` and `Bulk Edit Range` labels, and the distinct `Software & Firmware` editing tab and `Software & Services` reporting tab. The revised guide asks users to confirm their network address choices and rack capacity before saving; it does not claim automatic validation beyond what was inspected. Verification consisted of source text inspection and guide edits, **not** browser walkthrough or automated tests. Full first-time task validation remains outstanding under WF-14, with M-030 open.


## First backup and restore guidance checkpoint, 23 October 2026

Added a short first-backup and safe-restore walkthrough to `USER-GUIDE.md`. It explains where to find Download Backup, retaining exported JSON outside the browser, saving a backup before replacement imports, the replace-not-merge behaviour, and checking devices, IPAM and racks afterwards. The existing local browser storage and advanced recovery warnings remain. Compared with documented v1.3.0 backup workflow; this was document inspection only, not an executed import, restore, browser test or automated test. M-030 and WF-14 remain open.


## First-time journey cross-document checkpoint, 23 October 2026

Compared the published-release first-use instructions in `README.md`, `INSTALLATION.md` and `USER-GUIDE.md`. The download instructions were present, but the first meaningful action and first manual backup were separated across documents. Added a concise `Your first five minutes` paragraph immediately after the README download instructions, linking opening the HTML file, creating an IP Address Block and subnet, adding a device and exporting a JSON backup from Settings & Data. It also states that backup export is manual and importing a backup replaces, rather than merges, inventory. This is a documentation navigation improvement, not a completed end-to-end new-user browser test. Release asset download, opening the HTML and completing a real backup remain unexecuted in this checkpoint. M-030 and WF-14 remain open.


## Published release first-use verification boundary, 23 October 2026

Fetched `app/caffoot-lite.html` directly from Git tag `v1.3.0` and from the documentation branch. Both Git blobs have SHA `e8a24f6370a1bb572287aad91a314a3e4a189d94`, confirming the inspected application source matches the published tag's source file. Checked the tagged source for the labels `Manage Subnets`, `Add Device`, `Add Rack`, `Rack Overview`, `Back Up & Restore`, `Download Backup` and `Choose Backup File`; all were found. Independently queried the published GitHub v1.3.0 release metadata and confirmed that its HTML, ZIP and checksum assets are listed. Attempted to fetch the published release ZIP in the available testing environment, but GitHub DNS resolution failed, so no release archive was downloaded or inspected. **Not executed:** checksum recalculation, ZIP extraction, browser opening, first subnet/device entry, backup export, restore or visual walkthrough. These are explicit outstanding verification tasks, not passed tests. A safe owner walkthrough should use a separate browser profile with fictional data, open the downloaded published HTML, create a sample subnet and device, export JSON, check the saved file, and only test restoration with disposable inventory. M-030 and WF-14 remain open.


## Owner manual first-time opening checkpoint, 23 October 2026

The product owner reported that the published Caffoot Lite v1.3.0 HTML opened successfully in a newly created browser profile and displayed an empty inventory. This is **owner-executed manual browser evidence**, not an automated test or independent browser observation. The subsequent fictional subnet, device and backup export walkthrough remains outstanding. No application changes, merge or release were authorised.


## Owner first subnet creation checkpoint, 23 October 2026

The product owner reported that the fictional IP Address Block and Network / VLAN subnet creation step in the fresh-profile published v1.3.0 application saved as expected. This is owner-executed manual browser evidence; no screenshot, storage readback or automated test result was independently inspected. The next manual check is adding fictional device `TEST-SW01` with address `192.168.50.10`, then confirming its Device Inventory and IPAM entries. Backup export and restore remain outstanding. WF-14 and M-030 remain open.


## Owner first device and prerequisite discovery, 23 October 2026

The product owner reported that the fictional test device saved correctly after first creating a rack and adding a location in the published v1.3.0 fresh-profile walkthrough. This is owner-reported manual browser evidence, not an independently observed or automated test. The additional location/rack steps reveal a first-time guidance gap: instructions should explain when these prerequisites are needed for the chosen mounting configuration. Do not assume every device requires a rack. IPAM allocation for the test device has not yet been separately confirmed; ask the owner before marking it passed. Backup export and restore remain outstanding. WF-14 and M-030 remain open.


## Owner first device IPAM allocation confirmation, 23 October 2026

The product owner confirmed that fictional device `TEST-SW01` appears correctly in IPAM with address `192.168.50.10` following successful device save. This is owner-reported manual browser evidence, not automated verification. The next first-time test is Download Backup and checking that a nonempty JSON file is saved while the active inventory remains visible. Backup restore is not yet attempted. The location/rack setup guidance gap remains to be addressed. WF-14 and M-030 remain open.


## Owner first backup export checkpoint, 23 October 2026

The product owner reported that the JSON backup downloaded correctly from the published v1.3.0 application after creating a fictional subnet, location, rack and device and confirming its IPAM allocation. This is owner-reported manual browser evidence of the download action, not an independently inspected backup file. File size, JSON contents, continued visibility of the active inventory and successful restoration have not yet been verified. The owner has been asked to confirm a nonempty download and unchanged inventory before any restore exercise. The location/rack prerequisite guidance gap remains open. WF-14 and M-030 remain open; no automated application tests were executed.


## Owner first backup file size confirmation, 23 October 2026

The product owner confirmed that the downloaded JSON backup is approximately 3 KB, establishing that the downloaded file is nonempty. The file's contents, schema and ability to restore remain uninspected. Continued visibility of `TEST-SW01` and its IPAM allocation after export has been requested but is not yet confirmed. This is owner-reported manual evidence, not an automated test. WF-14 and M-030 remain open.


## Owner post-export inventory persistence confirmation, 23 October 2026

The product owner confirmed that following Download Backup, `TEST-SW01` remains visible and its address `192.168.50.10` remains correctly allocated in IPAM. The downloaded JSON file was previously reported to be approximately 3 KB. These are owner-executed manual checks in a separate browser profile using fictional data, not automated tests or independent inspection of the JSON contents. First-time launch, subnet, location, rack, device save, IPAM allocation, nonempty backup download and post-export inventory persistence have now been reported successful. Restore behaviour and backup contents remain unverified; do not mark the full first-time journey complete. The first-time location/rack guidance gap remains open. WF-14 and M-030 remain open.


## Restore preview checkpoint preparation, 23 October 2026

Following owner confirmation that the fictional inventory remains intact after backup export, the published v1.3.0 application source and tagged user guide were inspected for the restore entry point. The source labels the action `Choose Backup File` under `Settings & Data` and `Back Up & Restore`; its explanatory text says the backup is reviewed before confirmation and a safety copy is verified. The tagged user guide states that restoration replaces the active inventory rather than merging records. These are source and documentation inspection findings, not an executed restore test. The owner has been asked to select the downloaded fictional JSON in the separate test profile and stop at the review or confirmation stage, reporting what appears without confirming replacement. The restore preview and completion remain outstanding. The first-time location/rack guidance gap remains open; WF-14 and M-030 remain open.


## Restore action label usability finding, 23 October 2026

During the owner's first-time manual walkthrough, the product owner proposed renaming the `Choose Backup File` button to `Restore Data`, since the existing label describes file selection rather than the intended task. The suggested supporting text should explain that a saved JSON backup is selected and reviewed before confirmation, and that restoration replaces rather than merges the current inventory. Record as an open WF-14 first-time usability improvement and v1.3.1 roadmap proposal. This is a proposal, not an implemented change or completed restore test. Published v1.3.0 continues to use `Choose Backup File`.


## Owner successful backup validation and restore checkpoint, 23 October 2026

The product owner reported that after selecting the exported fictional JSON backup and pressing OK, Caffoot Lite validated the file and the restore process worked. This confirms owner-executed manual validation and restore of the approximately 3 KB backup in the isolated testing browser profile. It is not an automated test or independent inspection of backup contents. The owner has not yet explicitly confirmed the complete post-restore set of device, subnet, rack, location and IPAM records, so detailed record parity remains outstanding. The first-time journey has now exercised the restore operation; do not describe full end-to-end data parity as verified until the final inventory check is reported. The `Choose Backup File` to `Restore Data` usability proposal and first-time location/rack guidance gap remain open. WF-14 and M-030 remain open.


## Completed owner first-time journey and post-restore record check, 23 October 2026

The product owner confirmed that after restoring the approximately 3 KB fictional JSON backup, all five expected inventory elements remained present: device `TEST-SW01`, its `192.168.50.10` IPAM allocation, the test subnet, location and rack. Combined with earlier owner reports, the published v1.3.0 first-time journey from fresh-profile launch through subnet, location, rack and device creation, IPAM verification, backup export, validation and restore is **complete as an owner-executed manual walkthrough**. This does not establish automated test coverage, independent JSON content inspection or cross-browser compatibility. The separate first-time location/rack guidance improvement and proposed `Restore Data` button label remain open. WF-14 as a broader public repository review, M-030 and WF-13 remain open. No application behaviour change, merge or release was performed.


## First-time rack prerequisite documentation improvement, 23 October 2026

Updated `README.md` and `USER-GUIDE.md` on the documentation branch to clarify the tested sequence for a rack-mounted first device: create subnet, location and rack before selecting rack placement in Add Device. The guides explicitly distinguish this from devices using a suitable non-rack mounting option; do not claim all devices require racks. This addresses the first-time guidance gap observed in the owner-executed published v1.3.0 walkthrough. Reviewed the existing README and user guide wording and the owner manual evidence; documentation edit only, not an application behaviour change or a newly executed browser test. `Choose Backup File` to `Restore Data` remains a proposed UI copy improvement for v1.3.1. Broader WF-14, WF-13 and M-030 remain open.


## README first impression and download discoverability checkpoint, 23 October 2026

Reviewed current `README.md`, `INSTALLATION.md`, `USER-GUIDE.md` and `CONTRIBUTING.md` against the completed owner-executed v1.3.0 first-time walkthrough. The README placed its actionable download and first-use instructions below release details, large security guidance and screenshots. On the documentation branch, moved the existing `Download and run` and `Your first five minutes` instructions near the introduction, added a short `Try Caffoot Lite` invitation and immediate local browser storage and manual JSON backup caution. The full security warning and existing screenshot and technical sections remain. The original download instructions were moved, not duplicated. This is a documentation usability change, not evidence of increased adoption. No new application tests were executed. Outstanding: review GitHub rendered layout and link usability, wider WF-14 public guidance, proposed `Restore Data` UI label, WF-13 and M-030.


## Website project reference handover, 23 October 2026

Created `docs/website/WEBSITE-PROJECT-HANDOVER.md` on the documentation branch and linked it from `docs/features/FEATURE-OVERVIEW.md`. The handover identifies the published v1.3.0 release, current website-facing feature overview, first-time user and installation guides, technical workflows, five screenshot file paths, safety boundaries, owner manual test evidence and website consistency checklist. It explicitly distinguishes documentation-branch material from published `main`, current functionality from proposals, and site review from actual website publication. The live website at `https://caffoot.co.uk` has not been independently audited in this checkpoint. No new application or website tests executed; no application code changed, merged or released. Wider WF-14, WF-13 and M-030 remain open.


## Support discoverability and status accuracy checkpoint, 23 October 2026

Reconciled the WF-14 document header from `Planned, not started` to `In progress`, reflecting completed owner manual first-time testing and ongoing public repository review. Inspected README, installation guide, user guide, security policy, contribution guide and documentation index for issue and support links. README did not provide a direct GitHub Issues entry point. Added a `Need help or found a problem?` section linking user and installation guides, GitHub Issues, contribution guidance and security policy. It asks for reproducible reports without exposing sensitive inventory data and directs security concerns away from public issue details. Source text inspection only; external link response, rendered GitHub layout and actual issue submission were not tested. WF-14, WF-13 and M-030 remain open.


## Main branch comparison checkpoint, 23 October 2026

Executed GitHub `main` versus documentation branch comparison. The working branch is 202 commits ahead, zero behind, with 34 changed files in the comparison. The changes reported are documentation, repository contribution template, and two README screenshot PNGs; no application source path is listed as changed. Directly fetched README from both refs: the working branch contains `Try Caffoot Lite`, `Download and run` near the top and `Need help or found a problem?`, whereas those new improvements have not been merged to public `main`. The comparison is GitHub metadata and text inspection, not a browser-rendered review, test execution or approval to merge. Before merge, review the complete changed-file set and verify the public-facing link targets and screenshots. WF-13, WF-14 and M-030 remain open.


## Public documentation link target checkpoint, 23 October 2026

Executed GitHub repository path retrieval on the documentation branch for 32 distinct local link targets referenced by the public README, installation guide, user guide and docs index. All 32 requested paths resolved, including five screenshot PNG files, release notes, security and contribution documents, user guides and documentation index destinations. For PNGs, base64 retrieval was used to verify existence without treating binary files as UTF-8 text. This establishes file existence at the branch ref only, not GitHub rendered Markdown, image appearance, external link availability, anchor correctness, published `main` parity or browser behaviour. No application tests executed. WF-13, WF-14 and M-030 remain open; no merge or release.


## Release link and public rendering checkpoint, 23 October 2026

Inspected `README.md`, `INSTALLATION.md`, `RELEASE-NOTES-1.3.0.md` and `docs/releases/RELEASE-CHECKLIST.md` on the documentation branch. Current public getting-started text and installation guidance identify published v1.3.0 and link to the official GitHub release area. Standardised mixed `caffoot`/`Caffoot` GitHub repository URL casing in README and installation guide to `Caffoot/Caffoot-Lite`. This is a URL text consistency edit, not a claim that links have been followed. Attempted to retrieve the public GitHub latest-release page, working branch directory and rendered README with the web viewer, but all returned `DisabledError`. Therefore external HTTP response, live redirect target, rendered Markdown, image appearance and browser download remain unverified in this checkpoint. No application tests were executed. WF-13, WF-14 and M-030 remain open. Documentation-only branch commits, no merge or release.


## Public wording and Caffoot naming checkpoint, 23 October 2026

Inspected the current README, user guide, installation guide, public roadmap and feature overview for misleading current-version headings, internal audit phrasing in user-facing instructions and inconsistent repository branding. Updated README heading `v1.2.0 Devices & Intelligence` to `Device inventory and intelligence` without rewriting historical release references. Removed the first-time audit walkthrough aside from the user guide's device instructions. Standardised `Caffoot/Caffoot-Lite` repository spelling in the roadmap header and user guide's GitHub links. Retained established technical file names and historical release references. This was source text review and direct documentation edits; no rendered GitHub inspection, browser tests or application tests were executed. WF-13, WF-14 and M-030 remain open; master audit remains in progress. Documentation branch commits only, no merge or release.
