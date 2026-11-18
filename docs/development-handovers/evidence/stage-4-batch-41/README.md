# Batch 4.1 Supplier Management Evidence

The original application screenshots were captured on 18 November 2026 from `c79354da57e4981f1aa8dd519d42f2ba62113ff7`, using schema 21 and Chromium 156.0.8078.79. They show the authenticated Caffoot Lite application served locally over HTTPS with an isolated SQLite database. The browser journey creates fictional company, contact and note records through the implemented forms. The desktop viewport is 1440 × 1050 and the mobile viewport is 390 × 844. The [capture manifest](images/manifest.json) identifies each viewport and theme.

The screenshots show the temporary **Suppliers** workspace link and the four completed Supplier Details tabs. Device inventory provides the directory search and table styles. The Stage 3 Stock and Staff components provide the shared tabs, form fields, card and modal treatment. The archived Supplier HTML provides the approved interaction, field order and initially visible Contact entry. Review the [v2.2 draft guide](../../../how-tos/features-and-instructions/v2.2-draft/Supplier-Management.md) and [Batch 4.1 authority](https://github.com/Caffoot/Caffoot-Lite/issues/410).

## Supplier Details header correction

Sixteen captures from application commit `6069fb5dcc4acd547279e3173386f22b060acba9` show the corrected header on all four tabs. The same right-aligned action group contains **Back To Suppliers**, **Edit Supplier** and **Archive** for this protected example. The Note-history explanation appears beneath the entire group. At mobile width the group wraps within the content column. These are authenticated HTTPS/SQLite captures with fictional records, made in Chromium 156.0.8078.79 on 18 November 2026. [Owner approval](https://github.com/Caffoot/Caffoot-Lite/pull/414#issuecomment-6972319207) · [Capture manifest and file hashes](header-correction/manifest.json)

| Supplier Details tab | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Overview | [Desktop light](header-correction/overview-light-1440.png) | [Desktop dark](header-correction/overview-dark-1440.png) | [Mobile light](header-correction/overview-light-390.png) | [Mobile dark](header-correction/overview-dark-390.png) |
| Locations | [Desktop light](header-correction/locations-light-1440.png) | [Desktop dark](header-correction/locations-dark-1440.png) | [Mobile light](header-correction/locations-light-390.png) | [Mobile dark](header-correction/locations-dark-390.png) |
| Contacts | [Desktop light](header-correction/contacts-light-1440.png) | [Desktop dark](header-correction/contacts-dark-1440.png) | [Mobile light](header-correction/contacts-light-390.png) | [Mobile dark](header-correction/contacts-dark-390.png) |
| Notes | [Desktop light](header-correction/notes-light-1440.png) | [Desktop dark](header-correction/notes-dark-1440.png) | [Mobile light](header-correction/notes-light-390.png) | [Mobile dark](header-correction/notes-dark-390.png) |

The focused Supplier Chromium test passed against this commit. It verified Archive and Reactivate, Delete visibility and cancellation for an eligible company, and Back To Suppliers as the only header action for a Read user. It checked group boundaries and that the explanation sits below every button on each tab at 1440 × 1050 and 390 × 844 in both themes. All 16 captures passed the page-overflow and browser error checks.

### IT Assets foundation preservation check

The Batch 3.6 test introduced in `2badea1b163fe2d87cccf09debe064e6b5bb75db` compared shared sources byte for byte with its integration base `2e6c50ba4777b7500258d2a1a28317764d806020`. That base was appropriate when the test was added. Its `components.css` blob `50c420d1629481b1a255592cb036e9b0703b5065` predates four subsequently accepted changes.

| Stage 3 change | Stylesheet commit | Approval |
| --- | --- | --- |
| Inline Server Boot Storage checkbox | `084f465895d3cb2b08d3e9761f4c51937a685fff` | [PR #390 correction](https://github.com/Caffoot/Caffoot-Lite/pull/390#issuecomment-6910939328) |
| Spacing for existing ZFS Pool and VDEV actions | `2c55c616d372da2305a2c8cf4f1e3fcd72a3af43` | [PR #390 visual acceptance](https://github.com/Caffoot/Caffoot-Lite/pull/390#issuecomment-6911781710) |
| Spacing in the existing Reassign Device modal | `070b1b63301808a1a99eb5ed2d5f27bc7b7e14c2` | [PR #391 visual feedback](https://github.com/Caffoot/Caffoot-Lite/pull/391#issuecomment-6916930234) |
| Right-aligned Reassign Device footer actions | `3172143ea89902d770cca504051fd13525b2b96e` | [PR #391 action placement approval](https://github.com/Caffoot/Caffoot-Lite/pull/391#issuecomment-6917435327) |

The corrected test compares `components.css` with integration merge `53b04328c4f895bfc1f72f0416c43a519b2e8b42` (PR #391). Its blob `4a9d58a45e91c2994860753f9d6c76752deb61b2` matches the verified Batch 4.1 base and this branch byte for byte. The same preservation check also pinned an older `staff-directory.js`. Its corrected reference is merge `5de585aae716d2b4db8d568e0a23fcc8cddaf750` (PR #408), with current blob `5c7c88016921c3377e24e60e8482c0376a417d22` instead of `992775e9f032b2dd7b7a69f94cce268da8fc8bb9`. The changes incorporate the approved circulation screens, stale-edit safeguards and corrected Staff return wording. [Stock circulation approval](https://github.com/Caffoot/Caffoot-Lite/pull/389#issuecomment-6902308665) · [Stale Staff edits](https://github.com/Caffoot/Caffoot-Lite/pull/402) · [Staff return wording](https://github.com/Caffoot/Caffoot-Lite/pull/408)

All six byte-for-byte assertions remain in place. Four files retain the original pin, including the approved v2.1 design manifest. The shared stylesheet and Staff script are unchanged by this correction. The focused IT Assets foundation Chromium test passed with the repository Chromium job's Playwright 1.56.1 pin and local Chromium 156. The development runner on Playwright 1.62.1 encountered an already-handled dialog and left its temporary server listening. The first retries hit that old fixture and returned 401. Stopping the test server cleared the port for the successful run.

## Original Batch 4.1 screenshots

| Application screen | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Optional Features showing the Suppliers switch | [Desktop light](images/optional-features-light-1440.png) | [Desktop dark](images/optional-features-dark-1440.png) | [Mobile light](images/optional-features-light-390.png) | [Mobile dark](images/optional-features-dark-390.png) |
| Supplier Directory showing search, category filtering and the company row | [Desktop light](images/directory-light-1440.png) | [Desktop dark](images/directory-dark-1440.png) | [Mobile light](images/directory-light-390.png) | [Mobile dark](images/directory-dark-390.png) |
| Manage Supplier Categories showing the catalogue and local lifecycle actions | [Desktop light](images/categories-light-1440.png) | [Desktop dark](images/categories-dark-1440.png) | [Mobile light](images/categories-light-390.png) | [Mobile dark](images/categories-dark-390.png) |
| Add Supplier showing company information and Main Office Address | [Desktop light](images/add-supplier-light-1440.png) | [Desktop dark](images/add-supplier-dark-1440.png) | [Mobile light](images/add-supplier-light-390.png) | [Mobile dark](images/add-supplier-dark-390.png) |
| Add Supplier scrolled to the initial Contact entry, Add Another Contact and save controls | [Desktop light](images/add-supplier-contact-light-1440.png) | [Desktop dark](images/add-supplier-contact-dark-1440.png) | [Mobile light](images/add-supplier-contact-light-390.png) | [Mobile dark](images/add-supplier-contact-dark-390.png) |
| Overview showing the canonical company address and active location and contact counts | [Desktop light](images/overview-light-1440.png) | [Desktop dark](images/overview-dark-1440.png) | [Mobile light](images/overview-light-390.png) | [Mobile dark](images/overview-dark-390.png) |
| Locations showing the primary address and contacts at each office | [Desktop light](images/locations-light-1440.png) | [Desktop dark](images/locations-dark-1440.png) | [Mobile light](images/locations-light-390.png) | [Mobile dark](images/locations-dark-390.png) |
| Contacts showing the contact search and location filter | [Desktop light](images/contacts-light-1440.png) | [Desktop dark](images/contacts-dark-1440.png) | [Mobile light](images/contacts-light-390.png) | [Mobile dark](images/contacts-dark-390.png) |
| Contact Details showing Jo Patel’s linked locations, professional link and separate note | [Desktop light](images/contact-details-light-1440.png) | [Desktop dark](images/contact-details-dark-1440.png) | [Mobile light](images/contact-details-light-390.png) | [Mobile dark](images/contact-details-dark-390.png) |
| Notes showing company and contact notes and their creation attribution | [Desktop light](images/notes-light-1440.png) | [Desktop dark](images/notes-dark-1440.png) | [Mobile light](images/notes-light-390.png) | [Mobile dark](images/notes-dark-390.png) |

## Original Batch 4.1 verification

- The Supplier Chromium journey passed against the screenshot source commit. It exercised the administrator switch, feature-off denial, re-enable retention, the complete Add Supplier form, partial-contact validation, additional contacts, assigned and company-wide contact coverage, note ownership, Escape and discard, category creation/archive/reactivation, directory filtering and a Supplier-only Read session. Capture checks covered document width and browser page errors in all 40 views.
- The focused Python run passed 87 tests and skipped the opt-in two-image volume upgrade/restore rehearsal at application checkpoint `ac4a1a91bd9d1febf0ef34a7a8d0fa4ea2d8b3b1`. It covered schema migration and defaults, Supplier HTTP and feature settings, roles, audit filtering, stock schema, and application integrity. All five Supplier HTTP tests were rerun successfully after the archived-contact assignment safeguard at `4cc8998cf840242e769f5be0a8cacee92badaa4f`.
- The existing Optional Features browser workflow passed. The existing IT Assets foundation browser check failed its historical reference assertion for `interface/styles/components.css`. The untouched starting commit reproduces the failure and has the same stylesheet blob `4a9d58a45e91c2994860753f9d6c76752deb61b2` as the Supplier branch. The historical assertion expects `50c420d1629481b1a255592cb036e9b0703b5065`.
- The SHA-256 values of all twelve pinned v2.1 HTML sources match the application design manifest. The Supplier preview Git blob is `f85bcbd7467304b69508918270c8e2ed97bb817c`.

Independent integrated visual review and separate merge approval remain pending. Full Ready For Review CI, the deferred native and Raspberry Pi acceptance, and the Stage 6 compatibility and full-volume upgrade/restore rehearsal remain outstanding. The permanent past-supply protection was exercised using isolated database fixtures. Live association behaviour remains a Batch 4.3 acceptance item.
