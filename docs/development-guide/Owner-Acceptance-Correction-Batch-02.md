# Caffoot Lite v2.1 — Owner Acceptance Correction Batch 02

**Status:** **Approved by the product owner on 5 November 2026 for implementation of findings 01–04 only, after Codex credits reset.**  
**Parent plan:** [Issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282).  
**Development branch:** `feat/approved-modular-html-282`.  
**Baseline for this plan:** `0d54ef0e466a79720681a62ee828d44f7c0dc4e7` (completed Batch 01).  
**Twelve approved HTML sources:** revision `c26db4a56bbc30f95b56201e81a7a76d13c6037b`, as identified by `docs/development-guide/Approved-HTML-Integration.md`.  
**Origin:** Product owner's second private Docker/Safari review, 5 November 2026. Screenshots were shared in the review conversation but **are not attached to this document**.  
**Scope:** Findings **01–04 approved**. A fifth sidebar-spacing finding was added from the owner's subsequent Safari review and **awaits explicit approval of this document amendment before implementation**. This plan is not evidence of completed changes or tests.

## Scope and constraints

Use Issue #282, `AGENTS.md`, approved designs and existing v2.1 functional/security requirements. Preserve the light theme that the product owner likes. Preserve shared navigation, screen structure, all interactions, account controls, devices/IPAM/racks, existing records, Docker upgrade compatibility, Python/SQLite/APIs/security, and the ten Batch 01 corrections. Do not revise original pinned HTML/CSS, substitute a redesign, change frameworks, add features, or make unrelated visual changes.

The product owner explicitly approved this exact four-finding plan on 5 November 2026. **Codex implementation is authorised after credits reset**, not before. No additional work is authorised by this approval.

## Finding 01 — Network Racks Overview spacing does not match Devices

**Observed:** The first private review asked for tab-to-content spacing on Network Racks to match the consistent rhythm of the Devices page. Batch 01 changed Network Racks' tab-to-heading spacing from approximately 42px to the pinned source's 21px, but the owner rejected the resulting appearance in Safari on the second review. The gap still looks cramped relative to Devices.

**Owner's requested outcome:** Use the **live Devices Overview tabbed page** as the visual reference for the amount of breathing room between the main navigation tabs and the following overview section. Apply the same perceived spacing rhythm to Network Racks > Overview without changing its tab labels, cards, nested capacity tabs, counts or behaviour. This is an explicit owner-requested exception where it differs from the pinned Network Racks default.

**Verification:** Compare live Devices Overview and Network Racks Overview on equivalent desktop and mobile viewport sizes. Measure and capture the relevant content positions (main tabs to first section/heading, and section to metric cards) so the intended comparison is unambiguous. Verify adjacent Rack Inventory and Rack Accessories views are not unintentionally changed; no overflow or clipping.

## Finding 02 — Dashboard View IP Allocations action overlaps statistics

**Observed:** Dashboard > Overview > Network Allocation Overview shows the `View IP Allocations` button immediately against, or partially within the visual area of, the `Available` statistic. Both light and dark screenshots show insufficient separation.

**Required:** Place the existing `View IP Allocations` action **below all three statistics** (Assigned, Reserved, Available), with the same clear vertical separation as comparable Dashboard card actions. Keep its existing navigation/action and the underlying counts, status meanings and permissions unchanged.

**Verification:** Capture the Dashboard Overview card in both themes at desktop/mobile widths with empty data and representative populated values. Confirm no intersection or overlap in layout coordinates; click and keyboard-activate the existing action to reach the correct IPAM view.

## Finding 03 — Dark-theme presentation is inconsistent and hard to read

**Observed in Safari:** The light theme looks coherent but the dark theme is not consistently applied. Visible examples include a bright/white Device Inventory filter panel on a dark page; very dark headings and empty-state copy on dark surfaces; inconsistent control/input and table backgrounds; faint breadcrumbs, labels and secondary text; differing dark-treatment quality between Dashboard/Device Inventory and My Account. The user regards the current dark theme as **not acceptable for visual release**, across more than the four captured screenshots.

**Required outcome:** Make the **existing dark theme** coherent, readable and visually on par with the approved light theme across all **twelve approved screen areas** and their meaningful dialogs, tabs, toolbars, dropdowns, tables, empty states, account/settings/security views and common navigation. Treat dark-mode foreground/background, border, icon, button, focus, hover, disabled and status combinations as a connected system. Use the approved theme's established palette and styling where available; do not design a new theme or adjust the approved light-mode appearance as a shortcut. If an authorised dark source treatment is unclear or contradictory, flag the exact choice for owner decision before inventing a replacement.

**Specific acceptance checks:**
- In Device Inventory, the filter card, fields, table, empty-state headline/supporting text, add button and headings must all use appropriate contrasting dark-theme surfaces and text.
- Dashboard, Devices, IPAM, Network Racks, Audit Trail, Users & Permissions, My Account and Settings & Data must have consistent, readable cards and body text. Check the remaining approved areas through their existing screen states too.
- Test modal backdrops, header/close buttons, sticky footer actions, native and searchable selectors (open and closed), focus rings, form labels/helper text, error/success warnings and permission-disabled states for legibility without altering their meaning or operation.
- Ensure theme selection (Light/Dark/System) and persistence continue to work; System must follow the existing system preference behaviour. Light mode must not regress.
- Inspect actual rendered desktop and mobile captures in **both themes**, not merely the presence of CSS classes. Record observed before/after mismatches and the measured colours/contrast of representative combinations; remediate genuinely unreadable combinations. Do not claim blanket accessibility compliance based on screenshots alone.
- Keep permission/security warnings visually distinguishable, and retain the deliberate dark rack-elevation/fascia visualisation where it is intentionally themed independently of the page.

**Implementation guardrail:** Investigate scoped/overriding style rules and shared theme tokens first; prefer targeted, maintainable fixes to scattered high-specificity overrides. This is diagnosis guidance, not approval for an architecture rewrite or sweeping CSS refactor. Fix presentation only, with no alterations to application logic.

## Finding 04 — Shared header profile photo is not circular

**Observed:** The photo appears correctly circular on My Account but in the top-right shared `My Account` button it appears with flattened top/bottom edges rather than a circle.

**Required:** Display the shared-header profile photograph within a true square crop, circle-masked, centred and without distortion, while preserving the current header button size, text, click action and layout. The placeholder/avatar state should remain correct. Preserve upload, removal and account-photo persistence; do not introduce image files or alter user records.

**Verification:** Review the shared header with a portrait or non-square photograph and with no photograph. Check both light/dark themes, desktop/mobile widths and browser resizing. Confirm the account button remains clickable and photo changes/removal still appear in the header without incorrect cropping or distortion.

## Finding 05 — Shared sidebar navigation spacing is inconsistent across pages (amendment awaiting approval)

**Observed:** During the same private Safari review, the owner noticed that the vertical spacing/height of the left-hand navigation items appears different on Audit Trail and Users & Permissions compared with Dashboard, Devices, IPAM and Settings & Data. The sidebar is intended to be shared and visually consistent throughout the application.

**Requested result:** Make sidebar menu item heights, vertical gaps, icon/text alignment, selected/hover states and section spacing visually identical as the user navigates between all twelve screen areas. Use the current Dashboard/Devices/IPAM/Settings sidebar as the **owner-provided visual reference**. Preserve existing sidebar width, logo, header, footer, collapse/expand behaviour, navigation, permissions and responsiveness. Do not introduce new menu items or redesign the shared sidebar.

**Verify:** Compare computed menu item rectangles and vertical gaps before/after navigation through Dashboard, Devices, IPAM, Network Racks, Audit Trail, Users & Permissions, My Account and Settings & Data, in both themes and desktop/mobile layouts. Confirm no screen-specific CSS overrides alter the shared sidebar's metrics and that menu interactions still work. If measurements are identical and the difference is an optical effect, report the exact evidence and obtain an owner decision before changing approved styling.

**Approval boundary:** This is an **additional owner-requested finding** recorded after the initial four-item plan was approved. It is **not authorised for Codex implementation until the owner explicitly approves this amendment**.

## Acceptance procedure — approved scope, to begin after Codex credits reset

1. Confirm the exact baseline branch/commit, approved sources, Batch 01 acceptance evidence and `AGENTS.md`. Implement **only findings 01–04**, and finding 05 **only if this amendment receives explicit owner approval**, in one coordinated batch.
2. Establish accurate before/after live comparisons, particularly Devices-to-Racks spacing and the dark/light contrast audit; preserve original reference and evidence separately.
3. Protect the light theme as a regression baseline and check all twelve screen areas in dark mode, desktop and mobile, with representative opened controls and dialogs. Check the four approved functional behaviours and, if approved, the fifth shared-sidebar consistency behaviour; use existing test infrastructure and proportionate security/functional checks.
4. Save meaningful checkpoints and the final verified results to the development branch, with exact SHAs, a clear test matrix, limitations and a handover entry. **Do not claim owner visual approval** based on CI or screenshots alone.
5. **Do not modify `main`, PR #281, approved HTML source files or unrelated functionality. Do not merge, push Docker images to registries or publish/release anything.**
6. After completion and evidence review, the owner will separately build a new **private local Docker image** on their Pi/Portainer host and review it in Safari. Preserve the existing private test volume, administrator, MFA and SMTP configuration.

## Owner decision

- [x] Approved by product owner on 5 November 2026 for Codex implementation **after credits reset**.
- [ ] Owner approves the proposed Finding 05 amendment as an addition to Batch 02.
- [ ] Request further amendments to this plan.

**Current approval authorises findings 01–04 only; finding 05 is awaiting owner approval.** No merge, publication, release or final visual acceptance is authorised. No finding is claimed fixed or tested by this approval record.
