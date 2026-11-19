# Batch 4.4 Equipment Lifecycle Application Evidence — Historical Capture

> **Original pre-correction screenshots.** These captures predate the approved UK DD/MM/YYYY date controls and public Device Type label changes. Their original revision and SHA-256 manifest are retained unchanged. The [new 19 November 2026 owner-approved evidence](../stage-4-batch-44-corrected/README.md) contains 48 updated real-application captures and is the current visual reference; do not use the older images below as proof of the corrected date fields.

This report accompanies [issue #413](https://github.com/Caffoot/Caffoot-Lite/issues/413) and [draft PR #418](https://github.com/Caffoot/Caffoot-Lite/pull/418). The application revision captured is [`dc412fb5d51f7ba8b74522a35bad213be26a6e12`](https://github.com/Caffoot/Caffoot-Lite/commit/dc412fb5d51f7ba8b74522a35bad213be26a6e12). It uses schema 24 on the approved Batch 4.3 integration base.

## Application Screenshots

The PNGs come from the real HTTPS application running locally against a disposable SQLite database with fictional data and signed-in test accounts. The browser used the application's light and dark theme controls. The [capture manifest](screenshots.json) records the revision, Chromium version, UTC capture time, viewport and SHA-256 for each unedited PNG. Device form captures show the Hardware tab scrolled to the lifecycle fields.

| Screen | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark | What To Review |
| --- | --- | --- | --- | --- | --- |
| IT Dashboard Lifecycle | [1440 light](images/dashboard-light-1440.png) | [1440 dark](images/dashboard-dark-1440.png) | [390 light](images/dashboard-light-390.png) | [390 dark](images/dashboard-dark-390.png) | Fourth tab, four real metrics, search and filters, retired history, and Device links. |
| Device Details | [1440 light](images/device-details-light-1440.png) | [1440 dark](images/device-details-dark-1440.png) | [390 light](images/device-details-light-390.png) | [390 dark](images/device-details-dark-390.png) | Equipment Lifecycle inside Hardware & Lifecycle, alongside the existing hardware information. |
| Edit Device | [1440 light](images/device-edit-light-1440.png) | [1440 dark](images/device-edit-dark-1440.png) | [390 light](images/device-edit-light-390.png) | [390 dark](images/device-edit-dark-390.png) | Four date inputs, suggestion awaiting explicit approval, calculated mode and existing form footer. |
| Lifecycle Settings | [1440 light](images/settings-light-1440.png) | [1440 dark](images/settings-dark-1440.png) | [390 light](images/settings-light-390.png) | [390 dark](images/settings-dark-390.png) | Warning Periods and Expected Equipment Lifespan inside Optional Features, with Save Settings and Cancel. |
| Device Type Manager | [1440 light](images/device-types-light-1440.png) | [1440 dark](images/device-types-dark-1440.png) | [390 light](images/device-types-light-390.png) | [390 dark](images/device-types-dark-390.png) | Existing manager with a custom archived type and the separate Unarchive and Delete actions. |

## Comparison With Approved References

- The Dashboard keeps **Overview**, **Network Insights** and **Activity & Alerts**. The fourth tab uses the existing tab strip, Dashboard cards and canonical Device Details. The Lifecycle additions follow the [archived Dashboard HTML](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-4-previews/caffoot-it-dashboard-lifecycle-stage-4-approved-preview.html) at blob `4b9a139aec2818c9628a4589eeddcc0d866b5917).
- Device Details keeps the Hardware card and Edit Device keeps the existing tab structure, footer and discard prompt. Lifecycle uses the [archived Device HTML](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-4-previews/caffoot-device-lifecycle-details-edit-stage-4-approved-preview.html) at blob `c64ffbfd361fe0d3a638c56c15b0d00349778e6a) and the [pinned v2.1 Device forms](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-details-forms-batch-04.html).
- Lifecycle Settings opens from the enabled Equipment Lifecycle card and uses the established Settings & Data controls. The two cards follow the [archived Settings HTML](https://github.com/Caffoot/Caffoot-Lite/blob/b4661555e8aafaac91ebe680cdb6ca4d08af7e37/future-design/stage-4-previews/caffoot-lifecycle-settings-stage-4-approved-preview.html) at blob `a67f53e0c5a11644a2162edde912a7bc4b7d92c2) and the [pinned v2.1 Settings & Data](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/settings-data-draft-02.html).
- Archive and Unarchive use the existing catalogue row actions. The manager still has a separate Delete workflow. The behaviour follows the [owner's Device Type and first service decision](https://github.com/Caffoot/Caffoot-Lite/issues/413#issuecomment-6982869999).

## Local Verification

- The focused backend suites cover the schema 23 upgrade, SQLite backup and reinitialisation, separate feature and permission checks, administrator settings, range and leap-year rules, audit visibility, archive/rename retention, and first service during a genuine stock issue. Stock tests exercise future, current and past UTC dates, replay, rollback, preparation, reissue and legacy returns without assigning a first-service date to historical equipment.
- The Chromium lifecycle journey uses the normal sign-in and feature toggle, saves and discards Lifecycle Settings, checks keyboard tab navigation and warning filters, drills down to Device Details, and exercises warranty acceptance, manual override and reset. The journey verifies Devices Read and Edit independently of administrator access, read-only replacement dates, mobile table layout, and feature-off visibility. Reproduce it using [the Chromium journey](../../../../tests/equipment-lifecycle-interface.cjs).
- The existing Supplier Integration, Optional Features and IT Assets foundation Chromium journeys passed. The tests preserve the previous settings panels and locked style sources while allowing the approved Lifecycle additions.

The [v2.2 draft user and administrator guide](../../../how-tos/features-and-instructions/v2.2-draft/Equipment-Lifecycle.md) includes step-by-step instructions and captioned examples.

## Acceptance Pending

Product-owner visual acceptance and the independent readiness review remain pending. The full GitHub checks at Ready For Review, complete Docker lifecycle suite, native Safari and Raspberry Pi evidence, and broader Stage 6 compatibility and restore checks remain outside this local verification. PR #418 remains a draft.
