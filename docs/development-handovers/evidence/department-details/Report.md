# Department Details — implementation review

**Status: draft implementation for product-owner review, not final acceptance.**
Started from verified `milestone-1` HEAD `ff7a088bbe8e24322c84106e417ab1b03f3dfe70`.
Runtime source and final captures: `80adee938c47011efa518a9fd2ac55b55346462e`.
The later evidence commit does not change runtime code.

## Agreed scope and visual authority

The owner's 15 November 2026 instruction approves the attached interactive Department
Details composition and four tabs, while expressly requiring integration into the
existing v2.1 design. It supersedes the attachment's earlier proposal/unapproved notices.
Relevant issue direction: [#232](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6891493202),
[#368](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6891498910) and
[tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351).

Attachment SHA-256: `c074d850640e7ba649ea13a4eb532fec29c41746ce9303a42c14242c97e6b366`.
Preview HTML SHA-256: `6914387a157d41ab95cdc9ed65ceb97b25d58f9cb4ba1b61204847ce77adfffe`.
Neither its standalone shell, fictional records, simulated permissions nor CSS is
imported into runtime source.

The implementation retains the preview's Department header/status, four tabs, two
Overview information cards and three metrics, Staff table, Department equipment table
with assignment history, and separate activity card. It uses the application's
existing header helper, buttons, SVG symbols, badges, cards, information rows, tabs
and assignment-table conventions. Header actions follow the existing Staff Details
header convention. The five directory columns, Add Department and Manage workflows
remain; View Details is additive in the existing action column. Long Department names
reuse the existing Staff name layout and truncation treatment to keep actions clear on mobile.

Visual inspection compared the captured tabs in desktop/mobile and light/dark with the
accepted composition and existing v2.1 component conventions. The standalone preview's
extra banner, security selector and sample account are absent. New layout CSS is scoped
to Department content. A new Overview separator was corrected to the existing theme
border token and the browser flow/captures were repeated. This is a source/convention
and rendered-screen review, not a claim of pixel equality with a standalone preview
or final owner acceptance. Wide tables and the tab strip retain horizontal scrolling
on narrow screens, matching existing application conventions.

## Functionality and access

- Overview reads the real Department and shows Staff/Device totals only from successful,
  independently authorised requests. Restricted or failed data is Not Available, not zero.
- Staff Members filters fully paginated existing records by current Department ID, includes
  retained inactive membership and opens the existing Staff Details screen. No new member
  editor, duplicated Staff record or membership contract is added.
- Equipment uses the canonical Department assignment query and protected Device projection.
  Personal Staff allocations and another Department's equipment are excluded. View Device
  opens the original record. Current holder labels follow renames; history retains the
  stored recipient label, actor and real date.
- History combines only matching Department events returned by the existing Audit Trail
  service and canonical Department assignment records, ordered by their stored dates.
  No date, lifecycle event, return, reassignment or stock movement is invented.
- Existing server checks enforce sessions, MFA, section rights and Devices feature-off.
  No backend, API contract, schema, role, feature switch or Device eligibility rule changes.
  IT Asset assignment data remains unavailable; no IT Asset permission or feature is added.
- Manage, rename, archive/reactivate and safe deletion still use the original handlers.
  Archive retains current and historical associations. Department Read confers no Staff,
  Device, IT Asset or account-administration rights.

**History limitation:** the existing audit filter does not return Department events to
many limited accounts, and can also withhold them when inventory features are disabled.
Those views show available assignments or an honest empty state. The screen is not a
new complete Department audit service; a broader history contract would require its own
approval. No such contract was introduced.

## Checks actually performed

- **49 focused backend/HTTP tests passed:**
  `PYTHONPATH=tests python3 -m unittest test_department_details_http test_staff_directory_http test_device_assignments_http test_staff_directory test_device_assignments`.
  These cover independent rights, unenrolled MFA, session/origin restrictions, feature-off,
  canonical personal/Department separation, immutable history/attribution, archived
  associations and deletion protection. Snapshot comparisons prove reads did not change
  the fixture's stored inventory, directory, assignments or history.
- **New real HTTPS/SQLite browser flow passed:**
  `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/department-details-interface.cjs`.
  Four-tab/keyboard navigation, Staff/Device detail links, full pagination beyond 100 Staff,
  independent read-only accounts, restricted and empty views, safe unused deletion,
  rename/archive/reactivate, history retention and Devices-off passed. **28 genuine PNGs**,
  zero JavaScript page errors and no document overflow at 1440/390px in light/dark.
- **Existing Staff interface browser test passed:**
  `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/staff-directory-interface.cjs`.
  Existing Staff CRUD, optional login, grouped navigation, accepted form layout and
  six-section Permissions remain functional.
- JavaScript syntax, changed Python test syntax, the existing release-documentation check,
  Markdown/image/anchor targets, all eight byte-identical published guide pairs, Function
  Index locations and `git diff --check` were checked. The index was regenerated within
  its existing documented scope: **847 definitions**.
- Source comparisons preserve accepted Staff renderers/forms, Department editor markup,
  every backend/schema file and existing shared/page styles. Only three runtime files
  change: Staff module, its scoped stylesheet and two configuration lines in application.js.
  Published installation, release/history records and prior screenshots are untouched.

During check development, a fixture reused a Device ordinal and a browser helper assumed
that selecting the current sidebar item returned to the directory. The fixture was fixed
and the helper now uses Back To Departments; final runs passed. Final mobile inspection
also found a long-name/action overlap, corrected with the existing Staff name layout and an
additional browser overlap assertion; all 28 captures were refreshed afterwards. These were check setup
errors, not unresolved application failures.

No full local suite, Docker build, upgrade/restore rehearsal, native Safari/mobile-device
or Raspberry Pi run was performed. Hosted checks are recorded separately in the PR.
Batch 3.4 native acceptance remains deferred. Existing excluded Device footer casing and
the known baseline IPAM CSS contract difference remain untouched. No merge, release,
deployment, production change or final acceptance is claimed.

## Real application screenshots

Open the [inline screenshot gallery](Gallery.md) or individual PNGs below.

All captures use fictional SQLite fixtures through the application's real protected
services. No mocked responses, DOM styling substitutions or image editing. Source hashes
and geometry are in [Browser Checks](Browser-Checks.json); PNG hashes/dimensions are in
[Capture Manifest](Capture-Manifest.json). The files below were copied byte-for-byte from
the final capture run.

| View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Departments Directory | [1440px light](screenshots/directory-1440-light.png) | [1440px dark](screenshots/directory-1440-dark.png) | [390px light](screenshots/directory-390-light.png) | [390px dark](screenshots/directory-390-dark.png) |
| Overview | [1440px light](screenshots/overview-1440-light.png) | [1440px dark](screenshots/overview-1440-dark.png) | [390px light](screenshots/overview-390-light.png) | [390px dark](screenshots/overview-390-dark.png) |
| Staff Members | [1440px light](screenshots/staff-1440-light.png) | [1440px dark](screenshots/staff-1440-dark.png) | [390px light](screenshots/staff-390-light.png) | [390px dark](screenshots/staff-390-dark.png) |
| Equipment | [1440px light](screenshots/equipment-1440-light.png) | [1440px dark](screenshots/equipment-1440-dark.png) | [390px light](screenshots/equipment-390-light.png) | [390px dark](screenshots/equipment-390-dark.png) |
| History | [1440px light](screenshots/history-1440-light.png) | [1440px dark](screenshots/history-1440-dark.png) | [390px light](screenshots/history-390-light.png) | [390px dark](screenshots/history-390-dark.png) |

Additional states: [Department Read only](screenshots/department-only-390-dark.png),
[Department + Staff Read](screenshots/department-staff-390-dark.png),
[Department + Devices Read](screenshots/department-devices-390-dark.png),
[empty Staff](screenshots/empty-staff.png), [empty equipment](screenshots/empty-equipment.png),
[empty history](screenshots/empty-history.png),
[archived Department equipment](screenshots/archived-equipment-390-dark.png) and
[Devices disabled](screenshots/devices-disabled-390-dark.png).

## Product-owner review

Review all four tabs, independent access/empty states and the retained directory/manage
controls. Real implementation screenshots and behaviour still require the owner's review
before any separate merge approval. Keep the PR draft targeting `milestone-1`.
