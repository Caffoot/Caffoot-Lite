# Issue #329 — Private Acceptance Corrections

The owner authorised this batch in [6725970600](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725970600), preserving the [partial acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725918893). Development starts from `028c4edc73ca09640703713c1099fba52316a6a4`. Exact final delivery SHA, workflow links and pass/fail receipt are recorded in #329 on `feat/approved-modular-html-282`.

## Changes

1. Native select appearance is explicitly removed, retaining real selects, existing sizes, fonts, colours and disabled/focus behaviour with a consistent chevron. The shared padding remains consistent when a backing select becomes searchable. Searchable popups retain their existing controls and keyboard behaviour; listboxes and forced-colour native rendering are protected. The [inventory](select-inventory.json) covers 82 static selects, plus generated preview controls. Runtime checks cover all main pages, Device/Rack/User editors, email settings, Active Subnet and the explicitly reported Gateway Convention.
2. Add Multiple starts with Starting Subnet Address, Subnet Prefix, Number of Subnets and Gateway Convention. Block/private-range planning is optional and secondary, collapsed on the normal path. Existing choices, quick fills, /23–/30 addressable limits and broader parent ranges remain. Small windows use internal scrolling and fixed actions at the existing modal width.
3. Errors stay within the modal, linked to actual fields/rows, with prominent summaries. Parent/child and independent-network conflicts are explained without internal IDs. Server details remain available in the API response; they are translated for display. Preview-specific validation keeps its accessibility markers until its own checks clear them.
4. Choose an Available IP Address appears before manual Primary IP entry, within the existing Network Identity card. Both inputs still update the same address with existing reservation/ownership protection; subnet-first selection and read-only VLAN remain.
5. Consecutive remains default. Every 10th advances ten subnet-sized ranges (for /24: .10, .20, .30). Custom allows independently editable CIDRs. Server CIDR/overlap/gateway/count validation is unchanged. Auto suggestions follow valid CIDR edits, while manual gateways are retained. Back preserves custom entries with unchanged generation settings; changing start/prefix/mode recalculates ranges. Invalid custom drafts can return to their preview for correction; nothing invalid can save.
6. New/deliberately renamed addressable subnet names are unique across the installation after trimming/case comparison, on client and both server boundaries inside the existing transaction. Historical duplicate names remain intact during unrelated edits/import, including their unchanged outer spaces. Block naming remains separate. Concurrent name conflicts yield one successful transaction, with no partial batch or false success history.
7. Address Block containment was investigated and a [precise narrow exception proposed](../../../development-guide/Issue-329-Private-Corrections.md#address-block-decision--proposal-only). **This remains a proposal, not an implemented rule change.** The existing rejection is preserved and tested. Owner approval is required before allowing contained independent networks without adoption.

All twelve pinned approved HTML files, provenance and extracted source styles remain unchanged. No framework, dependency, schema, API route, permissions, authentication/MFA, device reservation, WAN/MSP or website change is included.

## Actual Evidence

- [Full backend](backend-final.txt): **492 run, 489 passed, three established skips**. Includes security, permissions, data preservation, migration/import/export, reservation and audit regressions.
- [Focused model](model-final.txt): **19 passed**, including both name boundaries, historical duplicate import/edit, atomic parent/batch rollback, distinct-range name concurrency, resolved Every 10th/Custom records and unchanged block rejection.
- [Correction browser audit](focused.txt): four groups passed locally. Existing seven subnet-first groups passed during integration. Final integrated engine/workflow results on the final pushed SHA are recorded in #329; a pending candidate run is not a pass.
- [Viewport/select measurements](private-corrections.json): four widths (1440, 1366, 390, 320), two themes, Gateway Convention compared with the adjacent input before/after Back, main-page/modal variants and explicit footer visibility. [Source structures](source-comparisons.json): Single and Device frames/field treatment retain the pinned structures with approved amendments.
- [Documentation compatibility](documentation.txt), syntax and whitespace checks passed; Function Index regenerated. Canonical/compatibility user guides agree.

The generic backend Docker opt-in skip is covered when the dedicated real Docker lifecycle workflow passes. Two genuine private v1.3.3 fixture tests remain unavailable. The worker is Linux AMD64; no native Safari or Pi test is claimed, and no ARM64 image is supplied.

Earlier failed runs are retained as history: old browser fixtures reused names across batches, a hidden native backing select was initially treated as a visible field, a shared input listener cleared row invalid markers, and the first browser CI identified inconsistent searchable padding, an asynchronous email refresh and WebKit's differing native-select height. Each is addressed in scope; those runs are not labelled passed.

## Visual Comparison

Reference revision remains `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. Single and Device structure comparisons are retained. The generator's simpler ordering and custom spacing are explicit owner amendments, not an unmodified pinned prototype. Its desktop two-column and mobile stacked fields use the existing IPAM frame/grid. The small-window correction shares the existing preview scroll/action rules.

Gateway Convention measures 42px like the adjacent approved input. In the available WebKit source preview the native automatic select can measure 47px; the corrected control deliberately follows the approved input treatment and explicit owner dropdown amendment. Full native-select pixel parity with the uncorrected automatic source control is therefore not claimed. Native macOS Safari remains the decisive private visual check.

Reviewed representative images: [desktop](generator-1440-light.png), [mobile dark](generator-390-dark.png), [320px window](generator-320-dark.png) and [parent error](parent-error.png). All screenshots use fictional isolated data. Final workflow artifacts provide the engine-specific full captures; permanent measurements/images here avoid relying only on expiring artifacts.

## Private Acceptance And Pending Decision

Use a clean checkout of the exact final SHA recorded in #329. Build natively on the owner's Pi through `python3 scripts/build_private_acceptance.py`; the expected local tag is `caffoot-lite:private-<first 12 SHA characters>`. Verify ARM64 and the full image revision. Follow the established private 8445 workflow only when authorised, keeping ports, volumes, environment and secrets; change only the image line. Keep a verified backup and do not assume older versions understand new subnet-first records. No build or stack change has been performed on the owner's installation.

On actual Safari, check:

1. Gateway Convention and Prefix at normal and enlarged text/zoom, before/after Preview/Back; Single Subnet, Active Subnet and representative Device/Rack/User/Settings dropdown text, chevrons, heights, keyboard and touch in both themes.
2. Four-field-first flow without a block, optional new/existing/none and quick fills. Distinguish a valid broad block from a genuine parent/child mismatch; messages must be visible and useful.
3. Consecutive and Every 10th with /24 and another prefix; Custom CIDR editing, invalid/duplicate ranges, Back with invalid drafts, manual gateway retention, names/purposes/VLAN and atomic Save. Check 1/10/50 and reject 51.
4. Duplicate trimmed/case-varied names on create/rename, historical duplicates with unrelated edits, Cancel/reload and backup/import. No historical name should be rewritten.
5. Available-IP before manual IP in Device Add/Edit/Duplicate; both update the same saved value. Recheck accepted subnet/VLAN cascade, reservations and saved allocations.
6. Desktop/mobile/small-window scrolling and visible actions, including expanded optional planning and prominent errors. Confirm all previously accepted paths remain good.

The Address Block exception remains pending under the exact linked proposal. Continue to expect the old independent-network rejection until a separate owner decision is recorded. Product-owner private acceptance, two private fixtures and that decision remain distinct from automated completion. No merge, image publication, public deployment, release or production/Portainer change is authorised.
