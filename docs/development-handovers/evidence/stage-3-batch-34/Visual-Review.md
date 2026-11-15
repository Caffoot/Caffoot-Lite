# Consolidated Batch 3.4 Visual Review

Final visual corrections follow verified starting HEAD
`49b9c8bef2a529d355d9b12f2114443fa683876a`, as authorised in
[issue #368 comment #6884722532](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6884722532).
The current screenshot matrix and `browser-results.json` include both corrections.
Earlier status-action review runtime: `163b4e0ff12ab5cddaa7f69a97f74b9f30522e88`.
This remains draft PR #382 against `milestone-1`.
**Product-owner visual and functional acceptance is outstanding.**

## Final Visual Corrections — 14 November 2026

Only `interface/styles/equipment.css` changes application behaviour:

- The inactive notice has the heading's existing horizontal inset: 20px on
  desktop and 14px at the existing mobile breakpoint. The direct-sibling
  selector affects only this notice, preserving its wording and other tips.
- Enabled, unselected Device labels at rest use `--theme-text` in dark Assign
  Equipment dialogs, following the existing Device software-choice convention.
  The selector excludes selected, hovered and disabled rows. Light mode is
  unchanged; the established selected/hover/focus styles remain in effect.

`final-visual-preservation.json` confirms that every other tracked backend and
interface file matches the starting HEAD byte-for-byte. The accepted status
control position, Device footer, eligibility, permissions, schema and navigation
are unchanged. No runtime function or Function Index location changes.

**Actual checks on both corrections together:**

- `PYTHONPATH=tests:. python3 -m unittest test_device_assignments test_device_assignments_http -v`:
  **18 passed**, no failures or skips, 2.079 seconds.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_EQUIPMENT_OUTPUT=/workspace/work/batch34-final-visual/screenshots node tests/device-assignments-interface.cjs`:
  **passed**, 40 real-application captures at 1440px/390px in light/dark,
  zero page errors and no document overflow. The flow retains the functional,
  permission, privacy and MFA checks described below.
- New assertions measure notice alignment against the heading on active/inactive
  administrator and restricted-reader views. They exercise checked/unchecked,
  hover, keyboard selection/focus and native disabled Device choices in all four
  size/theme combinations. The disabled fixture is restored before capture;
  no Device eligibility is changed. Dark idle foreground is `rgb(241, 245, 249)`;
  light idle remains `rgb(49, 81, 107)`. Selected dark colours remain the existing
  warning palette. Computed measurements are in `browser-results.json`.
- JavaScript syntax, source-preservation and whitespace checks passed. Visual
  inspection confirms the corrected notice inset and legible unselected labels.

The complete 40-image matrix was refreshed from this run. The original archived
references and `reference-hashes.json` remain unchanged. No full-suite, Docker,
whole browser-compatibility or IPAM-contract rerun was needed for these two
scoped stylesheet corrections. No comprehensive accessibility certification or
native Pi/Safari result is claimed.

## Correction And Preservation

`renderStaffDetails()` now places its existing Mark Inactive / Reactivate action
immediately after the profile/login content and before Assigned Equipment and
Assignment History. Only the equipment insertion's position changes. The
existing button markup, styling, Staff Edit condition, confirmation and handler
are byte-for-byte unchanged. Restricted Staff readers do not receive the action.

`visual-review-preservation.json` verifies that earlier placement change against its reviewed base.
The other Staff renderers and all handlers match after removing the equipment
insertion from both versions. Device Details, assignment presentation/CSS,
Departments, navigation, My Account and backend source were not modified by that placement correction.
No function was added, renamed or moved to a different line, so Function Index
locations remain unchanged and were checked.

## Actual Application Matrix

All captures below come from the real HTTPS/SQLite application using fictional
fixtures. Each row was exercised at 1440×950 and 390×844, in Light and Dark.
Full-page captures retain long Staff/account content; open dialogs use viewport
captures so their fixed backdrop is shown accurately. Tables retain their
existing local horizontal scrolling on mobile. No document overflow or browser
page errors were observed across the 40 measured captures.

| View | 1440 Light | 1440 Dark | 390 Light | 390 Dark |
| --- | --- | --- | --- | --- |
| Active Staff, Administrator | [Image](staff-1440-light.png) | [Image](staff-1440-dark.png) | [Image](staff-390-light.png) | [Image](staff-390-dark.png) |
| Inactive Staff, Administrator | [Image](staff-inactive-1440-light.png) | [Image](staff-inactive-1440-dark.png) | [Image](staff-inactive-390-light.png) | [Image](staff-inactive-390-dark.png) |
| Active Staff, Restricted Reader | [Image](staff-restricted-active-1440-light.png) | [Image](staff-restricted-active-1440-dark.png) | [Image](staff-restricted-active-390-light.png) | [Image](staff-restricted-active-390-dark.png) |
| Inactive Staff, Restricted Reader | [Image](staff-restricted-inactive-1440-light.png) | [Image](staff-restricted-inactive-1440-dark.png) | [Image](staff-restricted-inactive-390-light.png) | [Image](staff-restricted-inactive-390-dark.png) |
| Assign Equipment From Staff | [Image](staff-assignment-1440-light.png) | [Image](staff-assignment-1440-dark.png) | [Image](staff-assignment-390-light.png) | [Image](staff-assignment-390-dark.png) |
| Device Assigned To Staff | [Image](device-1440-light.png) | [Image](device-1440-dark.png) | [Image](device-390-light.png) | [Image](device-390-dark.png) |
| Initial Department Assignment Dialog | [Image](assignment-1440-light.png) | [Image](assignment-1440-dark.png) | [Image](assignment-390-light.png) | [Image](assignment-390-dark.png) |
| Department-Owned Device | [Image](device-shared-1440-light.png) | [Image](device-shared-1440-dark.png) | [Image](device-shared-390-light.png) | [Image](device-shared-390-dark.png) |
| My Equipment, Both Sections | [Image](personal-1440-light.png) | [Image](personal-1440-dark.png) | [Image](personal-390-light.png) | [Image](personal-390-dark.png) |
| Preserved My Account | [Image](my-account-1440-light.png) | [Image](my-account-1440-dark.png) | [Image](my-account-390-light.png) | [Image](my-account-390-dark.png) |

## Reference Comparison

The original Staff assignment, Device Assigned To and equipment-journey HTMLs
were read and their exact archive hashes checked against
`2dd0f86e008a7018926b6c4b866c7122263bec58`; see `reference-hashes.json`.
The current accepted interface and the owner's explicit placement correction
remain the first authority. The pinned v2.1 My Account/Device modal and existing
styles were preserved; this review does not substitute the standalone preview's
older Staff profile form or single-section My Equipment behaviour.

Source and rendered comparison checked the Staff profile/login → status action
→ equipment/history order, the original Staff assignment table/history-row
structure, and the existing Device modal tab/card/footer structure. Initial
allocation uses existing form/dialog conventions without Return/Reassign/stock
actions. Personal equipment has exactly the two approved section headings;
Department equipment stays Department-owned. My Account retains its profile,
appearance, security and planned My Devices/My Tickets cards. No Department
Details screen or alternative Department presentation was introduced.

The new controls/headings use Title Case; the exact owner-approved personal
section names are retained. Existing footer casing is recorded below rather
than changed without authorisation. This is source/visual verification evidence,
not a claim of pixel identity with a functional preview or owner acceptance.

## Earlier Status-Placement Checks

- **46 focused Python tests passed**, no failures or skips, 10.064 seconds:
  `test_device_assignments`, `test_device_assignments_http`,
  `test_staff_directory`, `test_staff_directory_http`.
- **Extended `tests/device-assignments-interface.cjs` passed**, with 40 captures
  and zero page errors. It measures status-action order/geometry after profile
  content and above equipment at both widths/themes; tests confirmation cancel,
  actual inactivation and reactivation; compares complete assignment/history and
  linked-account responses before/after; checks original Edit and Manage Login
  workflows; and covers active/inactive restricted readers without edit/login/
  allocation controls. A forbidden restricted status POST returns 403.
- The same flow verifies Staff multi-allocation, Device-to-Department allocation,
  retained Device footer/navigation, current Department ownership, separate
  employee equipment sections, membership refresh, no employee inventory-state
  requests, inventory API denial, enrolled-reader MFA and preserved My Account
  Security/MFA-enrolment controls. Desktop/Laptop/Printer eligibility is unchanged.
- **Existing `tests/staff-directory-interface.cjs` passed** for accepted Staff
  form/CRUD/login/navigation behaviour. JavaScript syntax, Function Index
  locations, source-preservation checks and whitespace checks passed.

Initial extensions needed test-navigation corrections for retained Staff Details
state, the existing Cancel-to-directory behaviour and closing Manage Login's
modal before navigating. No application navigation or behaviour was changed to
satisfy those test assumptions. Final affected browser runs completed successfully.
No full backend suite, Docker run or unrelated IPAM contract rerun was performed
for this presentation-only correction. No comprehensive assistive-technology or
numeric colour-contrast audit is claimed.

## Remaining Visual Discrepancies — Documented, Not Changed

The inactive-notice inset and dark unselected-label findings from the previous
review are corrected above under the explicit two-item approval.

**Inherited Device footer casing:** `Edit device` and `Delete device` remain
sentence case in the accepted existing modal. See `device-1440-dark.png`.
The owner expressly excluded these labels from this correction; they remain for
separate review.

There are **no remaining failures in the focused or affected local browser
checks for these two corrections**. The known pre-existing IPAM CSS contract
failure was not changed or rerun. Product-owner visual and functional acceptance
remains outstanding; native Pi/Safari acceptance has not been performed here.
