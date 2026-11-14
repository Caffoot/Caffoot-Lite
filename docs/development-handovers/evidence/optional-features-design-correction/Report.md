# Optional Features — Approved Design Correction

The application now follows the approved Optional Features composition: a section
heading/explanation, the Your Information Stays Safe banner, separate Infrastructure
and Additional Features groups, and the original card structure with bottom status
badges and contextual switches. Saved organisation states remain authoritative.
This is a Stage 2 visual correction, separate from Staff preview PR #379.

**Awaiting product-owner visual approval. Do not merge, publish or deploy.**

## Sources And Mapping

Baseline: `221739ae8c1331d396977adb6e79dc910f39380d`, verified on remote
`milestone-1` before creating `fix/optional-features-approved-design`.
Initial implementation checkpoint: `59e06faff3e0c40b31bde3bf2e7f874044db42b9`.

Authority: [owner approval in #238](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6820547757),
the actual [integrated Optional Features HTML](https://github.com/Caffoot/Caffoot-Lite/blob/159424b56bb770ea6ab260764c4e9357d9c8667c/future-design/stage-2-previews/caffoot-optional-features-integrated-settings-review.html)
and the surrounding [pinned Settings & Data design](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/settings-data-draft-02.html).

| Approved HTML element | Corrected application |
| --- | --- |
| `#features-panel .panel-heading` | `.optional-features-panel .panel-heading`, same Optional Features heading and exact explanatory text; mock review badge omitted |
| `.note` with information icon | Same SVG, exact Your Information Stays Safe wording, background/border, padding, radius and text arrangement |
| Infrastructure heading and `#infrastructure.feature-grid` | Infrastructure heading and `#optional-feature-infrastructure.feature-grid`, ordered Devices, IP Address Management, Network Racks |
| Additional Features heading and `#additional.feature-grid` | Additional Features heading and `#optional-feature-additional.feature-grid`, ordered Suppliers, Equipment Lifecycle |
| `article.card.card-padded > .card-head` | Same article/header/icon/title/description hierarchy in `settings/optional-feature-card`; exact source SVG paths, icon colours and descriptions |
| `.separator` and `.feature-bottom` | Same divider followed by status on the left and contextual switch label/control on the right |
| `.status`, `.status.enabled`, `.status.planned` | Disabled, Enabled or Coming in Stage 4 from the real API state/availability; corresponding grey, green and amber treatments |
| `.toggle-label`, `.switch`, `.detail` | Enable Feature / Enabled / Not Available Yet labels, 40×23 px switches, associated labels and exact future-feature guidance; accessible names reflect enable/disable action |
| Two columns; one at 1050 px; mobile padding at 720 px | Same scoped card/grid breakpoints and component measurements |
| Existing Settings tabs and surrounding interface | Retained application header/logo/navigation, three original tab buttons and panels, feedback and footer; no illustrative shell or sample state copied |

New layout rules live in `interface/styles/components.css` and are scoped to
`.optional-features-panel`. The pinned `settings.css` and all twelve original design
sources/hashes are unchanged. The Function Index retains the same definitions with
updated declaration locations. No backend, database, schema or migration changes.

## Rendered Visual Review

Open the [side-by-side comparison](comparison.html) with its screenshots directory
or browse the [22 image files](screenshots). The actual unmodified approved HTML was
served locally and rendered in the same existing Chromium as the actual HTTPS
application. Its own illustrative switches produced the enabled reference state;
no replacement markup or edited reference styles were used. Application screenshots
use temporary fictional SQLite records and genuine saved feature settings.

Compared desktop (1440×950) and mobile (390×844) views of disabled/enabled states with
the source, then compared the baseline application against the correction in both
light and dark themes with the same mixed state (Devices/IPAM on, Racks off). The
pinned surrounding Settings source is also included. Visual inspection confirms the
restored heading/banner/group order, source card proportions, icons, description
spacing, dividers, badge placement and switch arrangement. Mobile cards stack and
planned-state badges/labels wrap within their cards. Native switches show the saved
state rather than the source's initial all-disabled illustration.

Visible differences retained deliberately under this task's boundaries:

- The live v2.1 header, logo, navigation, settings tabs and footer remain. The source's
  illustrative sidebar, Design Review badge and review footer are excluded. This
  changes the vertical starting position of the panel. The live mobile rail is
  65 px, while the illustrative source rail is 62 px; usable card widths differ.
- Live enabled, disabled and mixed states reflect the database. Feature-dependent
  navigation follows those states and existing permissions; no new grants appear.
- The original Optional Features HTML has no dark theme. The corrected dark view
  uses the existing slate palette and its existing good/warning/disabled tokens;
  no invented dark reference is claimed.
- The existing loading/error/status feedback is retained beneath the cards. Disable
  confirmation remains the existing browser confirmation, rather than importing the
  mock-up's demonstration dialog. Baseline/mixed captures were taken during the
  existing regression scenario; a transient IPAM-link notification appears in some.

This comparison is rendered evidence, not product-owner acceptance. Matching CSS,
hashes or passing tests alone does not establish visual fidelity. Pixel equality
with the mock shell or illustrative state is not claimed.

## Checks

**57 focused Python tests passed, with zero failures and zero skips:**

- [23 service, security, persistence and source-boundary checks](python-security-persistence.log):
  `test_feature_settings`, `test_feature_settings_http`,
  `test_optional_features_persistence`, `test_optional_features_visual_boundary`,
  `test_modular_interface`.
- [34 related regression checks](python-related-regressions.log):
  `test_feature_access`, `test_racks_off_preservation`,
  `test_optional_device_addresses`.

They cover fresh/upgrade/restart preservation, administrator/MFA/session/Origin/CSRF
requirements, malformed and unavailable mutations, disable acknowledgement, audit
atomicity, inventory/grant preservation, filtered access and Device/IPAM/Rack rules.
The existing three Settings panels/tab buttons are byte-preserved; all twelve pinned
stylesheets retain their exact provenance.

The enhanced [existing Optional Features Chromium runner](../../../../tests/optional-features-interface.cjs)
passed against real local HTTPS/SQLite. Its [log](browser.log) and
[measurements](browser-measurements.json) cover:

- Exact approved group/heading/banner/card copy and SVGs; real saved states after
  reload; contextual/associated labels; unavailable future controls.
- Deliberately simulated GET failure and recovery, pending-control disabling and
  failed POST rollback without changing saved choices, inventory or grants.
- Existing confirmation and cancellation (no POST), all-off essential administration,
  Rack/shelf omission preservation and type choices, permission-safe IPAM counts,
  no-subnet/cancel/stale/success linking and re-enabled Rack behaviour.
- 42 captures across the focused regression scenario, including 12 Optional Features
  views in enabled/disabled/mixed states across both themes and viewport sizes.
  The 22 selected review images here include baseline and actual source captures.
- No page exceptions, checked document overflow or status/switch row overflow.

JavaScript syntax, evidence hashes/links, unchanged backend/navigation/pinned-style
boundaries and whitespace were checked. Hosted checks are recorded in the draft PR
at its final candidate head. No full local suite, Azure, browser installation or
Docker setup was repeated. No real installation data, Raspberry Pi change, live
mail delivery or Safari/native-owner acceptance was exercised.

Reproduce the focused browser check with the existing Playwright/Chromium setup:

```sh
CAFFOOT_VISUAL_OUTPUT=/tmp/optional-features-evidence node tests/optional-features-interface.cjs
```

See [evidence metadata](evidence-metadata.json) for exact source revisions and image
hashes. Existing API/security contracts and feature defaults are unchanged. Staff
Members and Departments remain core; no IT Assets controls are introduced. Stop
for product-owner visual approval.
