# Caffoot Lite v2.1 — Owner Acceptance Correction Batch 01

**Status:** **Approved by the product owner on 5 November 2026 for Codex implementation of findings 01–10 only.**  
**Parent plan:** [Issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282).  
**Development branch:** `feat/approved-modular-html-282`.  
**Baseline application commit:** `d85c72c07f1c61bd87105ff9b8d3d6cb217372ce`.  
**Approved visual source revision:** `c26db4a56bbc30f95b56201e81a7a76d13c6037b` (twelve files in `docs/development-guide/Approved-HTML-Integration.md`).  
**Origin:** Product owner's private v2.1 Docker review, 5 November 2026; empty new installation viewed in Safari on desktop. Screenshots were supplied in the review conversation but **are not attached to this GitHub document**.  
**Scope:** Precisely the ten findings below. This is a correction plan, not evidence that any change or test has been completed.

## Decision boundary

Follow Issue #282, `AGENTS.md`, existing functionality/security specifications and the twelve pinned HTML designs. Only the explicit owner-requested presentation refinements described below may differ from the pinned designs. Do not infer permission to replace or approximate other design elements.

The owner has approved this written ten-item correction plan for Codex implementation on 5 November 2026. No other changes are authorised. Where an exact presentation decision remains uncertain, compare with the pinned source and ask before departing from it. Where an exact presentation decision remains uncertain, compare with the pinned source and ask before departing from it.

## Findings and acceptance criteria

### 01 — MFA enrolment code persists on returned login

**Observed:** On a new installation, the administrator completed authenticator enrolment and verification. The app correctly returned to sign-in, but the prior verification code remained displayed in the MFA code field.

**Required:** On the enrolment-to-login transition, clear the prior authenticator verification code and any transient enrolment-only input state. The login form must not prefill the old code. Preserve the established login, MFA enforcement, account state and security flow.

**Verify:** Complete initial admin enrolment, confirm that sign-in is shown with the MFA field empty; then sign in with a newly entered valid code. Check the transition at desktop and mobile widths. Do not store or print actual MFA secrets/codes in evidence.

### 02 — Network Racks overview vertical spacing

**Observed:** On Network Racks > Overview the transition between the tab strip and rack overview/first metric cards appears tighter than the comparable Devices overview layout.

**Required:** Compare the live positions and spacing with the pinned Network Racks HTML and the approved Devices page. Restore the intended vertical rhythm, without changing cards, counts, tab functionality or unrelated sections.

**Verify:** Desktop/mobile screenshots and measured tab-to-section/card spacing; no overflow.

### 03 — Empty Device Inventory Add Device shortcut

**Observed:** On Devices > Device Inventory, an empty inventory displays a small plain-looking `Add Device` action beneath the empty-state message, inconsistent with the orange `Add Device` action at top right.

**Owner-requested refinement:** Retain both entry points. Style the empty-state action consistently with the existing approved top-right orange Add Device button. Both must open the same existing Add New Device workflow; no duplicate save logic.

**Verify:** Empty state at desktop/mobile; both buttons respond, open the same form and respect permissions.

### 04 — Create Network Rack button placement in Device Add/Edit

**Observed:** In Add New Device > General > Mounting & Rack Configuration, `+ Create Network Rack` sits awkwardly against the accompanying explanatory sentence rather than aligning with the intended action row.

**Required:** Align the button and its associated guidance according to the approved Device Add/Edit layout, including wrap/stack behaviour on small screens. Preserve the existing create-rack action, return to the device form and rack-selection logic.

**Verify:** Desktop/mobile with no rack available and with a rack available; keyboard access; no overlap.

### 05 — Device Add/Edit selector/dropdown presentation

**Observed:** Searchable Physical Device Type and Manufacturer dropdowns show conspicuous dark outlines and boxed individual option rows, inconsistent with surrounding controls. Software/Firmware Platform and Version look like small native default controls. Networking's available-IP selector has mismatched typography; related option controls need an audit within this scope.

**Required:** Restore the intended styling of the affected selectors against the approved form: border, background, focus state, text, option rows, search box, dimensions and visual alignment. Do **not** replace searchable selectors with non-searchable ones, remove dynamic choices, or modify their data, selection, validation, filtering or keyboard behaviour to achieve visual matching.

**Verify:** Open and closed states of device-type and manufacturer searchable selectors; selection/search/keyboard interaction; platform/version and networking choices; desktop/mobile, including focus and scroll handling.

### 06 — Consistent labelled modal Close action

**Observed:** Manage Device Types uses a clearer bordered `Close ×` header button; other modals use an icon-only cross.

**Explicit owner-requested design refinement:** Reuse the existing Manage Device Types labelled `Close ×` visual treatment for applicable modal **header close** controls throughout the application. Do not replace footer `Cancel`, `Save` or `Back to Details` actions or introduce an extra close control when a dialog intentionally lacks a header close action.

**Verify:** Modal coverage on desktop/mobile; labels fit; keyboard/focus behaviour; unsaved-change confirmation, dismissal and edit-reservation release all remain intact. If a particular dialog cannot safely use the common treatment, report it for owner decision rather than silently exempting it.

### 07 — Standard single-line field control heights

**Observed:** On IPAM > Add Subnet, `Subnet Type` and `IP Address Block` selectors are shorter than CIDR, Gateway IP and Description inputs. Similar height inconsistencies occur in other forms, including User Workspace permissions and Device Add/Edit controls.

**Explicit owner-requested design refinement:** Apply a consistent **approved-derived** height, vertical alignment, padding and border treatment to ordinary single-line inputs, selects, searchable triggers and number fields across affected forms. Preserve appropriate sizing for textareas, checkboxes, specialised controls, validation/help text and responsive layouts. Do not introduce an arbitrary global pixel height without checking the pinned designs and existing control behaviours.

**Verify:** Side-by-side input/select rows in Add Subnet, Device Add/Edit, User Workspace and other affected shared controls at desktop/mobile widths; option menus and focus appearance; no clipped text.

### 08 — Remove unnecessary technical/development copy

**Observed:** Audit Trail > Recording Coverage includes low-level explanatory footnotes such as `Audit records remain read-only...` and `Caffoot Lite · Read-only, permission-filtered history · Stored centrally in SQLite`. The owner reports similar unnecessary implementation commentary elsewhere. Wording such as `V2.1 · IN DEVELOPMENT` also needs review for correctness at release.

**Owner-requested content refinement:** Remove or rewrite demonstrably unnecessary implementation/development footnotes across the **twelve approved screen areas**, including the two Audit Trail footer lines and comparable technical bottom-of-page text. Keep text users need for safe operation: security boundaries, validation, permission consequences, backup warnings, actionable guidance, and any truthful status about functionality not yet complete. Do not claim unfinished capabilities are finished. Where status wording carries a material product claim, flag it for owner decision rather than conceal it.

**Verify:** Record each text removal/rewording and why it is non-essential; check the Audit Trail and Settings page specifically; confirm security, backup and permission guidance is preserved.

### 09 — User Management workspace width, controls and copy

**Observed:** Users & Permissions > User List > Manage opens the administrator's protected user workspace. The workspace feels narrow for its content; Devices/IPAM/Racks permission selects are substantially shorter than the main personal-detail fields. Technical implementation wording is also visible.

**Required:** Compare modal width/layout to the pinned User Workspace design; improve width only as necessary to match its approved presentation and fit content. Apply finding 07 to permission selectors. Remove genuinely unnecessary implementation commentary under finding 08, while retaining meaningful account/permission guidance.

**Critical preservation:** The signed-in administrator's self-protection, disabled manage controls and server-enforced permissions remain unchanged. The shown administrator is intentionally protected; this is not a defect.

**Verify:** Administrator and manageable non-self account workspaces, desktop/mobile, scrolling and save controls; no ability to self-disable/demote/delete or bypass section permissions.

### 10 — Settings & Data card-row alignment

**Observed:** On Settings & Data > System Maintenance, differently sized cards cause visually uneven alignment between the left and right columns, despite an otherwise cohesive layout.

**Explicit owner-requested refinement:** Make cards intended to share a visual grid row align cleanly in height and vertical boundaries, with reasonable content-dependent height and responsive stacking. Do not artificially give every card on the page one fixed height, clip warnings, move destructive actions unsafely, or change the maintenance/backup flows.

**Verify:** Desktop row alignment and mobile stacking; varying message lengths; all controls, safeguards and warning text remain visible.

## Coordinated implementation and verification — owner-approved scope

1. Review the baseline commit, exact approved sources and this document; identify affected shared components, avoiding ten overlapping cosmetic patches.
2. Implement only findings 01–10 as one coordinated correction batch; use focused, meaningful Git commits/checkpoints on the existing branch and preserve the baseline history.
3. Check targeted functionality: MFA enrolment/login transition, both Add Device entry points, rack creation/return, searchable selectors, networking/IPAM choices, modal dismissal/edit locks, account permissions and user actions, saved data and security behaviour.
4. Compare affected layouts and controls on desktop **and mobile** against approved sources, noting exactly which owner-approved exceptions have been applied. Include open dropdowns, empty states, modal overflow and keyboard interaction. Captures alone are not acceptance.
5. Run the relevant regression tests and record exact commands, results, limitations and final commit SHA in the existing Issue #282 development handover. Keep unrelated tests and investigations proportionate, reuse valid previous evidence and report tests not rerun.
6. Push only to `feat/approved-modular-html-282`. **Do not modify `main`, PR #281 or the original approved source HTML; do not merge, publish an image or release.**
7. After reviewing the completed development evidence, the owner will separately build the next **private** image on their Docker host and perform another visual/functionality review. No automatic sign-off.

## Owner review decision

- [x] Owner approves this exact written correction plan and authorises Codex implementation (5 November 2026).
- [ ] Owner requests amendments before implementation.

**Owner approval authorises the specified implementation only, not a merge, publication, release or final visual acceptance.** No application changes, automated verification of the proposed fixes, or owner acceptance of the final result are claimed by this document.
