# Caffoot Lite v2.2 — Stage 4 Batch 4.4 coding hand-off

**Date:** 18 November 2026. **Status:** owner-authorised for development **only**. This hand-off is a documentation-only starting checkpoint; no Batch 4.4 application functionality or tests are claimed complete.

## Exact GitHub position and authority

- Repository: `Caffoot/Caffoot-Lite`.
- **Only Batch 4.4 development branch:** `feat/stage-4-batch-4-4`; one draft PR to `milestone-1`. Continue on that branch and its PR. Do not open a competing implementation PR, modify `main`, merge, release or deploy.
- **Approved integration base:** `e67ca1590f1669d722c1ebe2ba11896035d0c49c`, the independently verified Batch 4.3 [PR #416](https://github.com/Caffoot/Caffoot-Lite/pull/416) merge commit. Batches 4.1 (#414), 4.2 (#415) and 4.3 (#416) are merged. The separate browser CI correction #417 is already merged; reuse its actual workflow; do not reopen issue #361.
- **Authoritative full specification:** [Issue #413 — Equipment Lifecycle](https://github.com/Caffoot/Caffoot-Lite/issues/413), including linked owner decisions, and [explicit development authorisation](https://github.com/Caffoot/Caffoot-Lite/issues/413#issuecomment-6982424332). [Stage 4 master record #369](https://github.com/Caffoot/Caffoot-Lite/issues/369) and repository AGENTS.md apply. Old "not authorised" status text in #413 is superseded by the later owner comment; no previously approved behaviour or pending technical check is waived.
- Scope is **only** Batch 4.4 Equipment Lifecycle. Formal Stage 4 final sign-off is separate after this batch.

## Mandatory sources — review before editing

1. `AGENTS.md`, `docs/development-guide/Approved-HTML-Integration.md`, `docs/development-guide/Development-Status.md`, current v2.2 long-form draft user guides and actual current code.
2. The complete #413 specification and all linked subsequent owner decisions, including first-service capture while feature off, permissions, lifespan defaults, retired filtering, settings validation and audit.
3. The three **exact, archived, accepted HTML functional designs** on `docs/milestone-01-stage-2-3-previews`. They are functional/layout references; **reuse the real existing site typography, spacing, button hierarchy, page width, Save/Cancel/discard conventions, responsive behaviour and both themes**:
   - `future-design/stage-4-previews/caffoot-it-dashboard-lifecycle-stage-4-approved-preview.html` — blob `4b9a139aec2818c9628a4589eeddcc0d866b5917`.
   - `future-design/stage-4-previews/caffoot-device-lifecycle-details-edit-stage-4-approved-preview.html` — blob `c64ffbfd361fe0d3a638c56c15b0d00349778e6a`.
   - `future-design/stage-4-previews/caffoot-lifecycle-settings-stage-4-approved-preview.html`, approved at commit `b4661555e8aafaac91ebe680cdb6ca4d08af7e37` — blob `a67f53e0c5a11644a2162edde912a7bc4b7d92c2`.
4. The pinned original v2.1 designs at `c26db4a56bbc30f95b56201e81a7a76d13c6037b` (paths listed in Approved-HTML-Integration), current Stage 3/Stage 4 real Device, Equipment/Stock, Settings, Dashboard and Device Type Manager code. Do not transplant a standalone preview or redesign established screens.

## Required implementation — exactly as approved

**Lifecycle data and settings**
- Four optional per-physical-Device dates: **Purchase Date**, **Original In Service Date**, **Warranty Expiry**, **Planned Replacement Date**. Existing Device status stays independent. Valid date-only values, purchase and first service not in the future, service may predate purchase; no extra chronology rule. No VM lifecycle dates or lifespans. Do not create historical/legacy dates by inference or backfill.
- Two independent **90-day** warning defaults (Warranty Expiry and Planned Replacement), administrator-configurable from **0 to 3,650 days**; 0 means today only plus overdue/expired. Lifespan defaults and exact eligible physical canonical Device types are in #413 (including Desktop/Laptop 3 years, Server 5, Switch and Layer 3 Switch 7, Unknown blank; **read the full table**, do not infer omitted types). Custom eligible physical types appear blank, configurable 1–100 years. Preserve underlying type identity on rename/archive; legacy `Server - Physical` internal ID must not introduce an extra public type.
- **Settings & Data → Optional Features → Equipment Lifecycle → Lifecycle Settings**: existing actual settings page with the approved two cards, Warning Periods and Expected Equipment Lifespan, existing Save Settings/Cancel/discard, admin only. Feature disabled preserves all saved data and suppresses its UI/warnings except its enable switch.

**First service and calculated dates**
- Capture Original In Service Date **once**, at the **first genuine issue of an eligible physical Device from stock**, atomically within the existing authorised stock transaction, including when Lifecycle is off. Receipt, preparation, holding/registering in stock do **not** count; never overwrite on return, reissue, handover, reassignment, movement or relocation. Existing dates survive reissue; Device Duplicate copies **none** of the four dates, manual override or lifecycle history. Authorised IT staff can manually enter/correct historical and infrastructure first-service dates through the existing Edit form.
- Warranty expiry may be **suggested** as Purchase Date + 12 calendar months, but is saved **only** after the user explicitly accepts it; do not silently replace an existing recorded warranty when purchase date changes.
- Calculated planned replacement = Original In Service Date + configured type lifespan, otherwise Purchase Date + lifespan; no date without both a baseline and configured lifespan. Admin manual override remains fixed across configuration/baseline updates. **Use Calculated Date** removes override via normal Save, and Cancel/discard preserves saved prior state. Handle 29 February → 28 February in a non-leap target year. No automated status/rack/IP update.

**Real application UI, permissions and warnings**
- **Device Details → Hardware → Hardware & Lifecycle → Equipment Lifecycle**: read-only lifecycle presentation. **Edit Device → Hardware & Lifecycle**: approved date fields, calculated/manual indication, optional warranty suggestion and reset; respect effective Devices Read/Edit, admin-only override/reset/settings privileges. **No date fields in Add or Duplicate forms**, no moving dates to General, no change to approved Device Identity Supplier field, no separate Lifecycle page or VM date controls.
- **IT Dashboard existing fourth tab → Lifecycle**; preserve original Overview, **Network Insights**, **Activity & Alerts** labels, contents and navigation. Four attention indicators, actionable warning categories, search, Include Retired Devices, and canonical Device Details drilldown. Do not invent a separate sidebar/Devices peer tab or dummy counts.
- Blank date has no warning. Past dates are Expired/Overdue; today through the inclusive configured threshold are Upcoming; beyond threshold no warning. Retired Devices excluded from **all four active counters**, dates retained for historical view when Include Retired Devices is selected, without inflating active counts. No automatic retirement, reminders, email, purchasing automation or stock movement changes.
- Enforce actual feature gates, per-user effective section permissions, MFA and server-side authorisation, audit previous/new values + actor/time, transaction/replay and historical/backup/restore safeguards. Preserve Batches 4.1–4.3 Suppliers and IT Assets flows.

## Mandatory engineering checks and genuine ambiguities

Before making material changes, inspect existing source and prove a compatible approach for:
1. **Date-only/timezone/calendar conventions** already used by Caffoot; calculate days by dates, not incidental browser timezone. Don't invent a business-day convention.
2. **First real issue detection** across all existing approved issuance paths, direct handover, held stock, returns and reissues. Retain an existing service date even when the switch is off or source equipment already has one.
3. **Device Type Manager identity** during rename, archive/retire and legacy type handling; preserve lifespan mappings and prevent unapproved type duplication.

If existing architecture cannot implement an approved rule, or a genuine owner decision is needed, **STOP and report exact conflict + minimal proposed change before altering behaviour**. Do not silently substitute a different requirement. No new CSV feature (#288), framework, bulk tooling, redesign, mock data, self-service, scheduled reminders or unrelated refactor.

## Development workflow — conserve limited Codex allowance without weakening checks

Work in the **existing single draft PR** on `feat/stage-4-batch-4-4`, not a fresh PR or branch. Prefer coherent internal checkpoints without extra PRs:

- **A — schema/storage/feature switch/settings/permissions/date calculations** with focused migrations and behaviour/security tests.
- **B — first-service atomic stock integration and duplication protection**, testing all genuinely affected stock/Device paths.
- **C — Device Details/Edit and lifecycle settings in existing v2.1-styled UI**, focused browser/keyboard/responsive/light/dark checks.
- **D — existing IT Dashboard Lifecycle fourth tab and warning counts**, permission/feature boundaries, retirement and drilldown tests.
- **E — thorough v2.2 draft user/admin guide, genuine application desktop/mobile light/dark screenshots and source-faithful evidence report, final focused checks and handover**.

Each checkpoint must be coherent, tested to the extent claimed, committed and **pushed early**, with actual SHA, passing/failing/not-run checks and remaining work disclosed. No polling or waiting for full GitHub CI during draft development. Preserve version-specific v2.1 documentation. New long-form v2.2 guides should include prerequisites, exact buttons, permissions, step-by-step procedures, realistic fictional examples, Cancel/Save, warning boundaries, date rules, troubleshooting and related links, with genuine current screenshots and provenance. Never substitute the approved prototype as screenshot evidence.

**Ready For Review, merge, release and deployment are NOT authorised by this instruction.** Keep draft, wait for owner visual acceptance of the *real integrated application*, independent readiness review and separately approved Ready For Review transition. Then run required GitHub backend/Docker/Chromium/Firefox/WebKit/docs/security checks on the actual final head. Later formal Stage 4 and milestone-wide acceptance remain separate.

**Credit rule:** approximately 9% of weekly Codex credits were reported remaining when authorising this batch. Attempt the full exact scope only if feasible without shortcuts; otherwise stop at a **pushed, honest, reviewable partial checkpoint** and provide a precise continuation hand-off. Do not consume credits reproducing already-approved mock-ups or monitoring CI.

## Checkpoint A — data and authorised settings

The owner approved [Device Type Archive and Unarchive and first-issue date validation](https://github.com/Caffoot/Caffoot-Lite/issues/413#issuecomment-6982869999). Schema 24 adds separate lifecycle storage and settings, with no inferred Device dates. The reserved Device edit and administrator settings services validate, calculate and audit saved dates. Device readers receive lifecycle data only when the feature is enabled. An SQLite backup and restore test checks that dates and settings survive reinitialisation.

The feature switch stays unavailable in the application during this checkpoint. First stock issue, archive operations, the approved interface, complete v2.2 instructions and application screenshots are pending. All application visual acceptance and the final checks scheduled for Ready For Review are pending.
