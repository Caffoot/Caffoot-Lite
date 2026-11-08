# Approved HTML interface integration — source and acceptance record

**Current status:** This is the preserved integration/source record. For the current modular implementation and owner acceptance, read [Modular Interface](Modular-Interface.md) and the [v2.1 handover archived for release preparation](../historical/development-handovers/v2.1.md). The twelve source revisions and hashes remain authoritative.

This record accompanies [issue #280](https://github.com/Caffoot/Caffoot-Lite/issues/280).

## What we are building

Integrate the **actual markup and CSS** from each approved standalone HTML design into the existing Caffoot Lite application. Connect every visible action to the working JavaScript and Python/SQLite implementation. This is one **complete interface acceptance batch**, not permission to change any existing business rule.

The approved visual files remain in Git history. Do **not** restore `future-design` to `main`. The source revision pinned here is `c26db4a56bbc30f95b56201e81a7a76d13c6037b`, so subsequent edits to other branches cannot silently change what we agreed to use.

## Approved design sources

| Area | Original approved HTML |
| --- | --- |
| Dashboard | [dashboard-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/dashboard-draft-02.html) |
| My Account and shared header/navigation | [my-account-draft-06.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/my-account-draft-06.html) |
| Settings & Data | [settings-data-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/settings-data-draft-02.html) |
| Devices Overview | [devices-overview-draft-03.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-overview-draft-03.html) |
| Device Inventory | [devices-inventory-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-inventory-draft-02.html) |
| Device Details and Add/Edit/Duplicate | [devices-details-forms-batch-04.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-details-forms-batch-04.html) |
| Devices management and six catalogues | [devices-management-batch-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-management-batch-02.html) |
| IPAM | [ipam-draft-01.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/ipam-draft-01.html) |
| Network Racks | [racks-draft-04.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/racks-draft-04.html) |
| Users & Permissions | [users-permissions-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/users-permissions-draft-02.html) |
| Sign In and First Run | [sign-in-first-run-draft-03.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/sign-in-first-run-draft-03.html) |
| Audit Trail | [audit-trail-draft-01.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/audit-trail-draft-01.html) |

All 12 files have been checked as retrievable from that Git revision. The previous attempt mistakenly left the original Devices nested navigation and patched existing screens instead of carrying across these approved structures. Do not treat CSS similarity alone as implementation.

## Application files and compatibility

- `inventory.html`: main navigation, Dashboard, Devices, IPAM, Racks, Users, Settings & Data, My Account and Audit Trail.
- `setup.html`: Sign In, first administrator setup and MFA enrolment.
- Keep existing supporting assets, authenticated Python API, SQLite schema, saved inventory, permissions, edit reservations and Docker mounting unchanged unless separately approved.
- The design files show demonstration data and illustrative interactions. They do **not** replace live queries, permission-aware actions or existing storage.
- The shared navigation must be implemented **once** and remain identical while moving between application sections. Verify the sidebar, top-right account control, collapse and nested links against the approved HTML as well as their live actions.
- Preserve the published v2.0.3 functional baseline: hardware tab only for physical devices; hypervisor-managed VMs; manufacturer and software multi-type selections; all IPAM and Rack functions including L/R rails, front/rear views, printing and drag-and-drop; all six Help topics and eight guide links; permissions, MFA, backups, exports and imports.
- Under the product owner's explicit 4 November 2026 scope clarification in [#280](https://github.com/Caffoot/Caffoot-Lite/issues/280), approved optional personal details and images, SMTP/email and meaningful Audit Trail functionality **are included** in this same integration batch. Preserve the approved security and recovery boundaries in [#227](https://github.com/Caffoot/Caffoot-Lite/issues/227); do not invent further features.

## Acceptance before another owner Docker test

- [ ] All 12 source files mapped to their *actual* live screens and action handlers.
- [ ] Shared sidebar and header matched to approved HTML and checked on every section.
- [ ] Every major page, form, popup and tab compared side by side against the approved HTML at desktop and mobile widths.
- [ ] All existing data fields and user actions preserved and usable.
- [ ] Read-only users and individual Devices/IPAM/Racks permissions tested on the server and in the interface.
- [ ] Device editing, reservations, VM relationships and multi-type catalogue selection tested.
- [ ] IPAM, racks, authentication, account, maintenance and printing workflows tested.
- [ ] Browser, backend, documentation, security and installation checks pass on the actual final revision.
- [ ] The packed private Docker build source is verified to contain that revision, not an older screenshot or partial build.
- [ ] The owner reviews a **single complete live application** and approves appearance separately from merging.

## Current status

**In progress — not visually accepted.** Development in draft PR #281 began from working `main`; rejected UI shortcuts from PR #279 are not part of the approved source integration.

As at the current branch development checkpoint:
- Shared header/sidebar, Sign In/First Run, Dashboard, several Devices catalogues, IPAM, Racks overview, Users list and parts of My Account and Audit Trail have live HTML integrations. IPAM Draft 01 now also includes the approved Address Allocations and Manage Subnets page components, wired to the existing live network chooser, address search/filter/ranges, protected editing and VLAN ownership warnings. Chromium acceptance covers those navigation and control paths. These still require the final side-by-side acceptance, including mobile and cross-section behaviour.
- The approved Users & Permissions Draft 02 Overview and Add/Manage optional personal-detail forms now use live account data and administrator-only APIs. The Add User save is atomic with the existing username/password and preserves default no-access; changing a profile does not alter the sign-in identity, MFA, permissions or account role. Contact email remains unverified until an approved verification flow is implemented.
- Profile image upload/removal for My Account and the initial retained/attributable Audit Trail event capture have been implemented with targeted permission tests. Newly saved IPAM allocation, subnet/VLAN and Rack changes can now capture a strict allow-list of non-sensitive structural before/after values; private notes, arbitrary fields and credentials are never copied into these snapshots. Existing permission-filtered history responses continue to prevent users from seeing changes or details outside their authorised inventory sections. The previous 200-event retention limit is not applied to SQLite history; this has a dedicated regression test.
- The approved Settings & Data Draft 02 page has been integrated from its source markup and component styles. The Data & Backups and System Maintenance buttons call existing protected application actions, rather than the standalone design's illustrative handlers. This area still requires desktop/mobile visual sign-off.
- Optional SMTP administration is implemented with a new administrator + MFA + CSRF protected API, masked readback (no secret in responses), data-volume file mode `0600`, password preservation when the same SMTP username is retained, STARTTLS/SSL transport, explicit review of unencrypted transport, a rate-limited Send Test Email action and non-secret audit events. These are tested with mock SMTP delivery, not against a real external mail provider.
- The approved Device Details Batch 04 view now uses its original information-card, header, tab and footer styling with live stored device data. Physical-hypervisor and VM details retain the published hardware, guest/host and rack boundaries. Chromium checks cover both device kinds and mobile stacking. This is functional test coverage, **not** the owner's final visual sign-off.
- The Device Add/Edit modal now uses the approved Batch 04 frame and five form tabs, retaining the existing saved fields and handlers. The virtual machine allocation card is in General and the physical hypervisor controls are in Software & Firmware, as in the approved design. The accompanying Chromium regression checks exercise Add/Edit, physical hypervisors, VM ownership, and narrow-screen layout. **These latest checks are committed but have not yet been reported as passing by GitHub Actions.**
- **Still outstanding:** full source-by-source visual acceptance for the Device Editor, any remaining Rack or catalogue screens, verified email ownership, password recovery, approved security notifications and last-resort host-only administrator recovery; further meaningful/detail-level Audit Trail coverage; full IPAM interaction and final side-by-side visual acceptance. SMTP configuration alone does **not** enable recovery or notifications.
- The Chromium regression must be evaluated on the **final branch head**; older checks that passed before these changes, or early failing tests corrected mid-development, are not final acceptance evidence.

PR #281 remains **draft and unmerged**. PR #277 and PR #279 remain separate and unmerged. No private acceptance Docker package, public image, release or production deployment has been authorised.

## Source-by-source status register — 4 November 2026

This is a **working register, not a pass certificate**. For each screen, verify (1) the exact approved presentation, (2) connected functionality, (3) desktop/mobile behaviour and relevant security tests **on the same commit**. Do not mark any screen completed merely because approved CSS classes exist or the old functionality still works. No screen is currently confirmed to have passed all three checks.

| Approved HTML source | Current assessment | What to check next |
| --- | --- | --- |
| Dashboard Draft 02 | Partly integrated; fidelity unverified | Complete original tabs, cards and responsive layout |
| My Account Draft 06 and shared navigation | Partly integrated; fidelity unverified | Profile workspace, common header/sidebar, every page |
| Settings & Data Draft 02 | Partly integrated; fidelity unverified | Complete source structures and forms |
| Devices Overview Draft 03 | All five original panel structures integrated; **not yet verified** | Execute latest Chromium, compare source and live desktop/mobile UI, and verify filtering/empty states |
| Devices Inventory Draft 02 | Approved toolbar/results/table skeleton integrated with live records; **fidelity unverified** | Run full Chromium, confirm original row details/empty states and desktop/mobile presentation |
| Device Details / Add/Edit Batch 04 | Partly integrated; fidelity unverified | Verify original card structure, physical/VM editors and actions |
| Device Management and six catalogues Batch 02 | Partly integrated; fidelity unverified | Confirm all six views, forms and multi-type selection |
| IPAM Draft 01 | Partly integrated; fidelity unverified | New active pages exist, but inspect old dialogs and all live controls |
| Network Racks Draft 04 | Core approved Rack View, Equipment, Settings, Accessories and Add/Edit modal structures integrated; **not verified** | Complete placement/0U accessory modal source fidelity and live desktop/mobile, drag, permission, persistence and print checks |
| Users & Permissions Draft 02 | Partly integrated; fidelity unverified | Check full User Workspace, Add/Manage and permission states |
| Sign In & First Run Draft 03 | Partly integrated; fidelity unverified | Confirm original login, setup and conditional MFA screens |
| Audit Trail Draft 01 | Partly integrated; fidelity unverified | Complete directory/detail/export and protected event coverage |

**Important separation:** existing Python/SQLite storage, permissions, MFA, rack and IPAM validation, data migration and save handlers are the functional baseline to preserve. That a handler works **does not prove** the interface is correct. Equally, the old screen's presence does not mean the backend must be rewritten.

**Additional approved work still open:** verified email ownership, secure password recovery, important account/security notifications, host-only sole-administrator recovery and remaining Audit Trail events/exports. SMTP configuration alone is not recovery.

**Next step for each row:** compare pinned approved source with actual live markup, correct any wrong structure, connect every approved control to existing handlers, run tests, compare desktop/mobile views, record evidence and commit SHA. Change the assessment to *verified* only when all checks pass. No acceptance Docker review, merge or release before the entire batch is complete and internally verified.

### Devices Overview Draft 03 — source correction checkpoint (4 November 2026)

- On `c88f166`, the **Devices by Type** and **Devices by Location** panels in `renderDevicesHTML()` were changed from legacy generic Tailwind cards to the original approved Draft 03 `intelligence-two > intelligence-card > intelligence-card-head / divider / intelligence-chart > intelligence-chart-row` structure, including the source's icons, captions and chart tracks. Card content still comes from actual saved device data; the existing `device-intelligence-drilldown` handler continues to open filtered Device Inventory. The four live overview metrics were preserved.
- On `236f136`, browser test assertions were added for the original two-card structure, icons/headings, live Desktop type breakdown and its navigation to filtered Device Inventory.
- **Verification so far:** the large HTML inline script and the browser test JavaScript passed syntax parsing. **No GitHub Actions runs have been reported on this branch head; the new Chromium test has not been run, and desktop/mobile visual fidelity has not been signed off.** This is a **partial Devices Overview correction**, not a completed screen or an accepted design.
- Other Devices Overview tabs (Hardware, Operating Systems, Software & Services, Data Quality) still use mismatched old panel structures. The screen-by-screen fidelity register therefore remains **Mismatch confirmed** until those are replaced and all screens tested.

### Devices Hardware Draft 03 — source correction (4 November 2026)

- Commit `aca2649`: replaced the old Hardware overview cards with the **actual approved Draft 03 Hardware panel markup** copied from the pinned source, including the three `intelligence-metric` cards and original Manufacturer, Model and Mounting Methods card/chart containers. The illustrative data was replaced by live inventory counts. The existing `device-hardware-drilldown` action still opens filtered inventory; no storage, permission or placement logic was changed.
- Commit `5a8ca28`: added Chromium assertions for the original three-card structure and a saved mounting-method drill-down.
- **Verification:** the updated HTML inline script and the browser test file passed JavaScript syntax parsing. No GitHub Actions workflow run is reported for this code. Real Chromium execution and desktop/mobile visual comparison remain outstanding. This is **not a completed or accepted Devices Overview**: Operating Systems, Software & Services and Data Quality panels still need their original source HTML integrated, and the complete screen needs acceptance checks.


### Devices Overview Draft 03 — batched OS, Software and Data Quality source integration (4 November 2026)

- Commit `59fe237`: replaced the remaining legacy Operating Systems, Software & Services and Data Quality cards with the **actual panel markup from the pinned approved `devices-overview-draft-03.html`**, not CSS approximations. These use the approved `intelligence-panel`, `intelligence-card`, `intelligence-chart-row`, `intelligence-quality-card` and original source headings/captions.
- The sample preview's figures were connected to live saved inventory: `getEffectiveDevicePlatform()` continues to distinguish hypervisor hosts from guests, recorded software/service selections retain their existing catalogue filtering, the archived-software card still links to preserved saved device records, and Data Quality remains calculated from the live inventory. The original View Device Inventory buttons are wired to the live navigation action. No backend, device assignment, security or storage logic changed.
- Commit `b6f039`: added tests for all three original panels, real operating-system and optional software drill-downs, saved Data Quality counts and missing-IP filtering, and the narrow-screen quality-card grid.
- **Verification status:** inline and browser-test JavaScript parse successfully; source-level checks find exactly one of each of the five approved intelligence panels and no remaining generic legacy chart block in that renderer. **No Chromium test run or visual sign-off on the current code has been reported**. Do not mark Devices Overview fully verified. This checkpoint supersedes the earlier open-panel statements in the two previous Devices Overview checkpoints above.


### Batched Devices Inventory Draft 02 source correction (4 November 2026)

- Commit `e0bde9a`: replaced the old live Inventory toolbar/results/table wrapper with the **approved `devices-inventory-draft-02.html` structural markup**. The original Search Devices layout, exactly five primary filters, result heading with integrated Sort control, and original card/table container now use the approved source, rather than restyled old layout.
- Values and controls remain bound to existing inventory functions: search, dynamic device types/status/locations, network assignment, mounting, ordering, saved row data and device detail buttons. Existing collision-aware unknown-location labelling and the empty-state user actions were preserved. The existing Device Intelligence filter context now uses the approved linked context class.
- Commit `082126f`: added Chromium checks for exact filter count and Sort placement, live search and sort interactions, saved device results and single-column mobile filter layout.
- Follow-up commit `26130ae`: brought dynamic Device Inventory name/details, missing-location labelling, hardware cells and no-results styling closer to the original approved table presentation, while keeping saved values and existing actions.
- **Verification:** the whole inline application JavaScript and browser test file parse. No live Chromium or side-by-side visual test has been confirmed on the current head. Dynamic table rows, conditional empty states and complete responsive presentation still require source-fidelity review; **do not call Device Inventory completed or accepted**.


### Network Racks Draft 04 — batched approved-interface conversion (4 November 2026)

The source of visual truth is the **pinned** `future-design/approved/racks-draft-04.html` at commit `c26db4a`. The live interface must replace old markup, not merely adopt its CSS.

- Commit `16f2759` used the approved Rack Draft 04 CSS and replaced the old Rack View workspace with the original `rack-detail-workspace`, elevation frame/scroll, Front/Rear controls, side rail, capacity, available U and opposite-face card structures. Existing rack data and secure action dispatch were retained.
- Commit `29acd00` converted rack device/accessory/empty-U rows to the approved Rack 04 element hierarchy, and converted Equipment and Rack Settings to the approved card/tables and specification grid. Existing placement, correction, deletion and per-face data handlers remain connected.
- Commit `1a29fc6` replaced the old Rack Accessories list with the approved `rack-directory` cards and wired a dedicated action to open the selected rack's real Equipment tab, rather than the standalone preview.
- Commits `a5c524b` and `6738e9e` replaced the Add/Edit/Correction Rack form presentation with the approved modal/header/field-grid structure while retaining field IDs, form handler, required-name validation, custom height, physical correction confirmation and original permissions.
- Commits `cbec194` and `dd4ea8d` added real Chromium test cases covering the elevation and side panels, mobile grid, Front/Rear/0U structure, Equipment and Settings, Accessories directory and saved 0U records, and Rack Add/Edit/locked-dimensions presentation.
- **Verification:** current application and browser-test JavaScript passed syntax checks. The new Chromium suite has **not run** on this code; real desktop/mobile visual fidelity, working drag-and-drop after markup conversion, role-specific access, printing and full persistence need testing. **Placement and vertical accessory editor modals remain separately pending exact approved source-fidelity checks.** No Rack screen is accepted or owner-approved yet.

### IPAM Draft 01 — live editor and safety-dialog integration (4 November 2026)

The visual authority remains the pinned `future-design/approved/ipam-draft-01.html` at `c26db4a`. The Overview, Address Allocations and Manage Subnets page structures were already integrated before this checkpoint and were **not reimplemented** here.

The following *existing live IPAM modal workflows* were moved from legacy Tailwind layouts to the original Draft 01 `ipam-modal-head`, `ipam-modal-body`, `ipam-form-grid`, `ipam-field` and `ipam-modal-actions` presentation:

- **Configure IP Address:** retains live status, hostname, IPAM notes and historical reservation handling. A device-owned IP leaves status and hostname locked while allowing authorised IPAM notes changes; gateway IPs remain protected.
- **Add/Edit Subnet and IP Address Block:** retains saved CIDR, gateway, VLAN, parent block, description, type locking, contextual gateway suggestion, original permission checks and protected deletion action.
- **Bulk Edit Range:** uses the approved Draft 01 From/To IP Address inputs instead of exposing implementation-specific host offsets. Those inputs convert into the *existing* bounded allocation planner, retaining the 512-address limit, reserve/release actions, protected gateway/device addresses and preview-before-apply central save.
- **Bulk confirmation, blocked deletion and deletion confirmation:** use the same approved modal family while retaining existing data-dependent previews and server-side save, dependency checks and revalidation before deletion.

Changes were committed on the draft branch at `83e8f4a`, `a15be83` and `65dcc2f`. Chromium regression assertions were extended at `f15fdb0`, `540d564` and `feb10c9` for the original modal structure, narrow-screen field grids, persistent IPAM notes, owner restrictions, bulk preview/edit return, protected deletion and live SQLite saves.

**Verification boundary:** the full application inline JavaScript and updated browser-test JavaScript have passed syntax parsing during these edits. **The new Chromium tests have not been executed on this branch head; no new GitHub Actions success is claimed.** Live desktop/mobile source-by-source visual comparison, complete permission and workflow regression, private Docker acceptance and final owner review remain outstanding. These screens are **implemented, not verified or accepted**. PR #281 stays draft, unmerged and unpublished.

## GitHub Actions operation and cross-session handover — 4 November 2026

This is a **working access/verification record**, not a change in the owner's agreed development process or a pass certificate. Read this before asking the owner to run development workflows.

- **Responsibility:** The assistant handles development, commits, workflow results and test-log investigation wherever its available tools permit. The owner is **not** expected to understand or routinely trigger Actions. The owner-only `Publish Caffoot Lite` manual release workflow is separate, subject to its existing release controls. **Do not dispatch that release workflow for testing.**
- **Connection verified on 4 November:** The GitHub plugin was installed/enabled with its app-specific setting **Allow all actions**; repository `Caffoot/Caffoot-Lite` reported `admin: true`, `push: true` and `pull: true`. Reading PR #281, its files, Actions job logs, and writing commits/comments all worked. **Do not assume lost OAuth permission, suggest reconnecting, or ask the owner to restore access without a demonstrated connection failure.**
- **Different capabilities are separate:** The tools available in the 13:32–13:44 UTC session had no operation to dispatch a **fresh** `workflow_dispatch` run. They could inspect existing runs and rerun a failed *existing* job, but rerunning an earlier job does **not** verify a newer commit. The reason for this tool difference is **unknown**; do not invent one. Check currently available actions again on the next session rather than assuming they have or have not changed.
- **Earlier automation evidence:** Six PR-triggered checks began at **10:25 UTC** on commit `54d388a` and passed (browser, backend, Docker lifecycle, release preflight, secret scan and documentation). The workflow declarations at `.github/workflows/browser-compat.yml` and `backend-tests.yml` support `pull_request` and `workflow_dispatch`. These are not proof of current-commit success.
- **Later evidence:** Owner-dispatched Chromium run [41839867102](https://github.com/Caffoot/Caffoot-Lite/actions/runs/41839867102) against `bccf24e` failed at `tests/browser-compat.cjs:717` on the Software & Services visibility assertion, **after** log milestones for MFA/sign-in, IPAM saves, Rack view, location management and device save. Whether the failed assertion indicates timing or an application defect remains unresolved.
- **Latest test-only correction:** Commit `1a05ddc` adds `await approvedSoftware.waitFor({state:'visible'})` ahead of that assertion. A JavaScript syntax parse succeeded. A check of the branch and Actions listing immediately after the commit found **no new run** for `1a05ddc`; do not call it browser-tested. No application, approved design, backend or security code was changed in this test-only correction.
- **Required next-session sequence:** Verify the PR's *actual head* and whether a current-commit run exists; inspect job outcomes and logs, then correct only demonstrated test or application defects. GitHub REST Actions run collections may be read with the connected GitHub `fetch` capability if a commit-scoped workflow-run helper returns nothing (that helper may exclude manually dispatched runs). New commits to files matched by workflow `pull_request.paths` may normally trigger checks, but **do not assume** automatic triggering succeeded: confirm an actual run ID and commit SHA. If no safe trigger is exposed and no run starts, report the blockage plainly; do not silently change workflow triggers or ask the owner to administer routine CI as the default process.
- **Design/release boundaries:** This workflow investigation does not relax the requirement to compare all 12 pinned HTML originals, preserve saved SQLite data/permissions/MFA/IPAM/Racks/security, and complete functional, server security, desktop/mobile and visual verification before one private owner acceptance build. PR #281 stays **draft and unmerged**. No public image, tag, release or production change.

### Investigation update — the PR warning and missing automatic checks (4 November 2026)

The owner's observation that an on-screen PR warning appeared when automatic Actions ceased **must not be dismissed**. Verified evidence:

- The most recent `pull_request` workflow runs found for PR #281 began at **10:25:19 UTC**, using head `54d388a`, and succeeded. Later browser/backend runs found were manually dispatched, not automatically triggered.
- The GitHub reference `refs/pull/281/merge` was still `1b909104` when inspected after the latest development commits. Its recorded parents were `main` at `36515996` and PR head **`54d388a`**. It has **not refreshed to the latest PR head** in the observed records.
- The live PR API returned `mergeable: null`, `mergeable_state: "unknown"`, so **an actual merge conflict is not yet confirmed**. GitHub's commit comparison showed the PR branch **ahead of `main` by 183 commits, behind by 0**, with `main` as merge base; that does not suggest an ordinary divergent-file conflict.
- GitHub's published Actions documentation states that workflows using the `pull_request` event do not run when the pull request has a merge conflict. Thus a PR mergeability problem is a **plausible connection to missing checks, not yet a proved root cause**. Do not repeat the earlier unverified assurance that the warning is unrelated.

**Next investigation:** Read the actual PR warning and up-to-date mergeability/check status, and check whether GitHub refreshes `refs/pull/281/merge` after changes. If the warning points to a real conflict, identify precisely which files and the safe resolution before acting. Do **not** silently change the PR base, force-push, switch to privileged `pull_request_target`, remove security restrictions, or merge the draft PR merely to get CI running.

### Pinned-source class-family audit — 4 November 2026 (NOT a visual pass)

Compared **body markup class names** from all 12 original designs at pinned `c26db4a` against `inventory.html` (or `setup.html` for Sign In). This was a static text-presence scan of distinctive component class families, **not** a run of the application, source DOM-hierarchy equality, CSS computation, screenshot comparison, interaction check or responsive acceptance. Missing markers identify specific source-fidelity work; present markers do **not** establish that a screen is correct.

| Approved source | Distinctive body class names missing in live source | Required follow-up |
| --- | ---: | --- |
| Dashboard Draft 02 | 11 | Check exact sections containing `db-slimrow`, `db-insights-4`, `db-section`, `db-grid`, `db-report-buttons` and source status/filter components. |
| My Account Draft 06 | 0 | Full DOM/interaction/responsive comparison outstanding. |
| Settings & Data Draft 02 | 0 | Full comparison outstanding. |
| Devices Overview Draft 03 | 0 | Verify all five panels and live filters, not just class presence. |
| Devices Inventory Draft 02 | 0 | Verify dynamic rows, filters, empty states and mobile layout. |
| Device Details and Forms Batch 04 | 38 | Audit `catalog-modal-*` and `device-review-*` inline editors, physical/VM and service fields against original approved structures; preserve real field IDs and save/security paths. |
| Devices Management Batch 02 | 12 | Original catalogue editor `catalog-modal-*`, `catalog-type-*` wrappers/fields/multi-type selection not present in live source; fix actual dialogs rather than restyling old ones. |
| IPAM Draft 01 | 1 | `ipam-modal-overlay` absent; inspect the approved overlay vs the shared live authenticated modal container before deciding if this is a true structural mismatch. |
| Network Racks Draft 04 | 0 | Full DOM/interaction/permissions/desktop/mobile comparison outstanding. |
| Users & Permissions Draft 02 | 0 | Full comparison and role-specific tests outstanding. |
| Sign In & First Run Draft 03 | 0, against `setup.html` | Verify the actual setup/MFA/sign-in flows and responsiveness. |
| Audit Trail Draft 01 | 0 | Protected event detail/export/permission tests outstanding. |

**Action boundary:** Do not implement unapproved layouts or assume one missing class requires new storage. Copy the specific original structure and styles where needed, keeping the live authenticated JavaScript/Python/SQLite actions. No final design-acceptance claims until real browser and desktop/mobile checks run on the same revision.

**Actions investigation update:** In a current read, PR #277 and PR #279 each returned `mergeable:true`; PR #281 remained `mergeable_state:unknown` with the synthetic merge reference stuck at 10:25 UTC. Latest `main` is a direct ancestor of PR #281, so an ordinary divergent-file conflict is not established. Neither a GitHub-side incident nor a conflict is confirmed as the root cause. Do not change merge or workflow settings without identifying a specific supported corrective action.

### Verified catalogue and Dashboard source-integration batches — 4 November 2026

**Latest code and test checkpoint:** [`36c4b5d`](https://github.com/Caffoot/Caffoot-Lite/commit/36c4b5d3a86c0bd2558002dd87fd32bc01134820) on `feat/approved-html-full-interface`, draft PR #281. The following are source-integration and automated-test milestones, **not** complete design acceptance.

- **Catalogue modal source:** commits `574c7a7` and `c4cf96d` integrated the pinned Devices Management Batch 02 catalogue header, field groups, multi-device-type checkbox grids, explanatory text and footer into the live custom/built-in Manufacturer and Model editors, Custom Software editor and Server Services editor. Original save handlers, input identifiers, catalogue association rules and SQLite persistence remain connected. Chromium tests exercise the new source structure and 390px stacking.
- **Device Types and Locations management:** commits `3107d5b` and `e2fd9d3` connected the approved catalogue manager list, source field layout, rename and protected-delete confirmation components to existing actions. Existing protected `Unknown` entries and confirmed deletion behaviour are preserved. Chromium tests check both managers and cancellation paths; source-by-source screenshots remain outstanding.
- **Dashboard Draft 02:** commits `74d95ce`, `ac02cfb`, `8a34663` and `36c4b5d` integrated original four-card Network Insights hierarchy, clickable Rack Details grid, Overview metric cards, original card heads/icons, recent-device status rows, source Quick Access buttons and six Overview information cards. All counts and rack/device information come from saved inventory. Chromium tests cover source structure, navigation availability and mobile Network Insights stacking. **Activity & Alerts and complete desktop/mobile source-fidelity comparisons remain outstanding.**

**Automatic GitHub Actions restored:** feature-branch push triggers now run development checks without owner intervention. This recovery is recorded in [PR #281 comment 6633113520](https://github.com/Caffoot/Caffoot-Lite/pull/281#issuecomment-6633113520). The old synthetic PR merge reference remains stale but is **not** blocking push-triggered development CI. Earlier workflow troubleshooting and the former “no runs on branch head” notes in this document are historical; do **not** reopen that investigation or ask the owner to dispatch routine tests.

**All four Actions checks completed successfully on `36c4b5d`:** [Chromium compatibility](https://github.com/Caffoot/Caffoot-Lite/actions/runs/41851786904), [backend tests](https://github.com/Caffoot/Caffoot-Lite/actions/runs/41851786852), [release documentation consistency](https://github.com/Caffoot/Caffoot-Lite/actions/runs/41851786984), [Git history secret scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/41851787033). The app-only `574c7a7` browser run had an intermittent failure waiting for a Dashboard Inventory Health warning; the full Chromium suite subsequently passed on later commits. Treat this as a watch item, **not** a proven bug fix.

**Still required before owner acceptance:** complete source-to-live desktop/mobile screenshots for all twelve pinned designs; finish Dashboard Activity & Alerts, remaining Device Details/Add/Edit and management/source modal fidelity; verify every role, security and core workflow; complete approved email verification, recovery and notifications; verify complete private Docker image provenance. No screen has been visually accepted, no acceptance image has been published, and PR #281 remains draft/unmerged.

## Development standards

Follow [CONTRIBUTING.md](../../CONTRIBUTING.md), the [Coding and Naming Conventions](06-Coding-and-Naming-Conventions.md) and the [Function Index](Function-Index.md). Describe source and test changes in plain British English, and keep the Function Index accurate if live functions are added or renamed.
