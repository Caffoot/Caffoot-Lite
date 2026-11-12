# Users, Roles And MFA — Batch 04 Review

Batch 04 implementation and local verification completed on 11 November 2026 for owner review. The published baseline remains v2.1. Work follows the [corrected specification](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790324888), [review checklist](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6794184419) and [specific Staff-only account-route approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6794069354). This report does not record product-owner acceptance or permission to deploy.

The interrupted workspace was preserved. On resume, local HEAD, remote `milestone-1` and draft PR #358 matched comparison checkpoint `233780e198ae4bb67794b80969a5b51160c3d00b`. No unexpected divergence was found. The [completed pre-implementation comparison](../milestone-01-batch-04-comparison/Report.md) was not repeated. Implementation checkpoint `a5bafb6ba4eccdefa8293d7e7219289fe179961b` was committed and pushed before final evidence work. The final SHA and final-head Actions outcomes are recorded in [issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351); do not infer their outcome from an earlier checkpoint.

## Implemented Behaviour

- Existing Overview retains four original KPI categories, two chart cards and the guide. Counts come from real account data; explanations reflect roles and Read/Edit MFA requirements.
- User List retains five columns, search/status/MFA filters and mobile Manage controls. Additional role badges and accurate MFA states fit within those cells. Add User retains optional personal details and adds password confirmation; the backend assigns only Staff Member by default.
- Manage Roles is fourth, after Overview, User List and Add User. Custom role create, rename, grants, enable/disable and delete use the real catalogue and server confirmation contract. Staff Member remains protected; Administrator remains independent.
- Manage User retains editable personal details, Save Personal Details, account activation, Administrator controls and Delete User. Multiple memberships and Inherit/No Access/Read/Edit choices extend the existing permission cards, showing backend inheritance and effective values. No table or standalone-prototype dialog replaces them.
- Each membership/override or role change opens a server-produced preview. Before/after roles, section choices, retained access, MFA and session effects are displayed. Cancellation saves nothing. A real stale confirmation returns renewed consequences without mutation and requires another explicit confirmation. SMTP feedback reports configuration, eligible verified recipients and queue state; it never establishes delivery.
- Mandatory existing-account MFA enrolment reuses the existing sign-in QR/manual-key/code presentation and ordinary-account endpoints. It creates no session, clears displayed setup material on completion/cancellation/page exit and requires fresh password/TOTP sign-in. First-administrator setup remains separate.
- Authenticated `/account` reuses the approved My Account interface for Staff-only users. Startup loads their own session/profile and authenticated static interface files, without an inventory-state request. Inventory, administrator and other-user data/API permissions remain server-enforced. Existing inventory users keep their normal destination and navigation.
- Eligible enrolled accounts see Remove MFA inside My Account Security. Password and six-digit code are required; the existing server transaction independently rechecks policy and revokes all sessions on success. Administrator status, enabled additional roles (including zero-grant roles) and effective wider access prevent removal.

## Interface Preservation

All twelve pinned design records and their original stylesheets remain unchanged; both provenance/template tests pass. Existing navigation, theme files, Users/My Account/sign-in source styles, modal width, profile grid and section-card grid remain the base. New CSS is restricted to the agreed additions and mandatory-enrolment state. Light-theme contrast corrections affect new role/removal controls; their dark states use the existing orange/slate convention. The generated QR image receives alternative text without a visual layout change.

The [preservation measurements](comparisons/preservation-measurements.json) compare the existing pre-implementation live measurements with the implemented Users Overview, User List, Add User and own-account modal at 1440px and 390px. There are no changes in the measured sidebar, header, main-content, KPI-grid or profile-grid widths, grid columns, padding, gaps and border radii where those components are present. The focused browser test also checks the existing 710px modal width, narrow-screen width, keyboard containment and 320/390/768/1440px document fit.

Added fields, memberships, explanation text and permission summaries naturally increase content height. The existing modal scrolling and responsive card/form/list patterns accommodate that content. No previously approved layout was replaced or restructured. Owner inspection remains necessary; measurements and green tests do not establish visual acceptance.

## Implemented Comparison Screenshots

These are final application renders, not the earlier reference-only set. `approved` filenames mean the pinned historical source. They do not mean owner approval of Batch 04. Each browser comparison uses disposable HTTPS/SQLite fixtures. The pinned sources and feature tests have different fictional accounts/counts; pixel equivalence of their content is not claimed. The sign-in source opens its first-run demonstration while the application fixture has an existing administrator; compare presentation with that state difference in mind.

| Existing View | Implemented Desktop | Pinned Desktop | Implemented Mobile | Pinned Mobile |
| --- | --- | --- | --- | --- |
| Overview | [Implemented](comparisons/users-1440-live.png) | [Pinned](comparisons/users-1440-approved.png) | [Implemented](comparisons/users-390-live.png) | [Pinned](comparisons/users-390-approved.png) |
| User List | [Implemented](comparisons/users-list-1440-live.png) | [Pinned](comparisons/users-list-1440-approved.png) | [Implemented](comparisons/users-list-390-live.png) | [Pinned](comparisons/users-list-390-approved.png) |
| Add User | [Implemented](comparisons/users-add-1440-live.png) | [Pinned](comparisons/users-add-1440-approved.png) | [Implemented](comparisons/users-add-390-live.png) | [Pinned](comparisons/users-add-390-approved.png) |
| Editable Manage User | [Implemented](comparisons/editable/user-workspace-1440-live.png) | [Pinned](comparisons/editable/user-workspace-1440-approved.png) | [Implemented](comparisons/editable/user-workspace-390-live.png) | [Pinned](comparisons/editable/user-workspace-390-approved.png) |
| Existing Account Controls, Scrolled | [Implemented](comparisons/editable/user-workspace-1440-live-controls.png) | [Pinned](comparisons/editable/user-workspace-1440-approved-controls.png) | [Implemented](comparisons/editable/user-workspace-390-live-controls.png) | [Pinned](comparisons/editable/user-workspace-390-approved-controls.png) |
| My Account Overview | [Implemented](comparisons/my-account-1440-live.png) | [Pinned](comparisons/my-account-1440-approved.png) | [Implemented](comparisons/my-account-390-live.png) | [Pinned](comparisons/my-account-390-approved.png) |
| My Account Security | [Implemented](comparisons/account-security-1440-live.png) | [Pinned](comparisons/account-security-1440-approved.png) | [Implemented](comparisons/account-security-390-live.png) | [Pinned](comparisons/account-security-390-approved.png) |
| Existing Sign-In Presentation | [Implemented](comparisons/sign-in-1440-live.png) | [Pinned](comparisons/sign-in-1440-approved.png) | [Implemented](comparisons/sign-in-390-live.png) | [Pinned](comparisons/sign-in-390-approved.png) |

The comparison folders also retain own-account protection captures and measurements. The application source files used for these renders are identified by [SHA-256](source-files.json); the final committed tree contains those files. The Overview was recaptured after shortening its MFA explanation to keep the existing chart action on one line.

| Agreed Addition Or Behaviour | Evidence |
| --- | --- |
| Role catalogue and multiple memberships | [Manage Roles](features/roles-list-1440.png), [multiple roles](features/multiple-roles-1440.png) |
| Role editor | [Desktop](features/role-editor-1440.png), [mobile](features/role-editor-390.png), [dark mobile](features/role-editor-dark-390.png) |
| Create preview and shared impact | [Create](features/create-preview-1440.png), [two-account preview](features/shared-role-preview-1440.png), [server impact without confirmation proof](features/shared-role-impact.json) |
| Real stale-preview renewal | [Desktop](features/stale-preview-1440.png), [mobile](features/stale-preview-390.png) |
| Extended existing Manage User | [Desktop](features/manage-1440.png), [mobile](features/manage-390.png), [320px](features/manage-320.png), [768px](features/manage-768.png) |
| Existing lifecycle controls retained | [Desktop](features/account-controls-1440.png), [mobile](features/account-controls-390.png) |
| Mandatory pre-login enrolment | [Desktop](features/required-enrolment-1440.png), [mobile](features/required-enrolment-390.png) |
| Eligible optional MFA removal | [Desktop](features/optional-removal-1440.png), [mobile](features/optional-removal-390.png), [dark desktop](features/optional-removal-dark-1440.png) |
| Staff-only own-account access | [My Account](features/staff-my-account-390.png) |
| Honest missing-SMTP guidance | [Actual notification feedback](features/notification-feedback-1440.png) |

Displayed account names, QR keys and codes belong only to disposable fictional test accounts. No real installation data or production credentials were used.

## Verified Checks

| Check | Actual Result |
| --- | --- |
| `python -m compileall -q backend tests` | Passed |
| `python -m unittest discover -s tests -v` | [562 tests, no failures/errors, three existing skips](backend.txt) |
| Account HTTP regression file | [21 tests passed](account-http.txt), including authenticated `/account`, static-resource authentication, Staff inventory denial and zero-grant role removal ineligibility |
| Existing Chromium compatibility suite | [Passed](browser-regression.txt): first-admin, inventory editing/selection, account profiles, voluntary MFA, Staff/Read restrictions, concurrent reservations, reset and import |
| Focused Users/roles/MFA browser suite | [Passed](users-interface.txt), with [scenario results](features/results.json): multiple roles, two-account impact, cancellation, real stale state, inherited/overridden rights, role lifecycle, profile/activation/Administrator/delete controls, mandatory enrolment, Staff denial and removal/session revocation |
| Targeted axe-core 4.14.0 checks | [Seven scans, zero violations](accessibility-summary.json), using WCAG 2 A/AA and 2.1 AA rules on the added editor, preview, membership/permission, required-enrolment and optional-removal areas, including dark additions |
| Manual completion of axe contrast cases | Native select arrow images and two dark-dialog text nodes prevented automatic background detection. Computed text/background contrasts were checked and screenshots inspected: 11.55:1 for light selects, 16.30:1 for dark selects and 9.85:1 for the dark text nodes. These are recorded alongside the automated incomplete results, not silently counted as automatic passes. |
| Keyboard and responsive checks | Header Close/Cancel returns focus; new dialogs contain Tab/Shift+Tab and Escape closes the top layer; existing user modal containment and retained controls checked; no document overflow in tested 320/390/768/1440px views |
| Design and documentation checks | Both pinned-source/template tests, all 733 Function Index declaration locations, compatibility guide copies, changed Markdown links, JavaScript syntax, release-document consistency and whitespace checks passed |

Reproduce the focused suite with `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_AXE_SOURCE=/path/to/axe-core/axe.min.js CAFFOOT_ROLES_OUTPUT=/temporary/evidence node tests/users-roles-interface.cjs`. It also supports `CAFFOOT_ROLES_ENGINE=firefox` or `webkit`. The existing Actions jobs install isolated Playwright/axe tools and run this suite in all three engines. No runtime dependency or new application framework is introduced.

At implementation checkpoint `a5bafb6ba4eccdefa8293d7e7219289fe179961b`, all six PR workflows passed: [backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43031846242), [Chromium/Firefox/WebKit](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43031846060), [real Docker lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43031846096), [documentation](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43031846223), [history scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43031846254) and [release-safety preflight](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43031846569). This comprises eight successful jobs; six release-only jobs were skipped. The publication step did not run. Final-head results are reported separately in #351.

## Review Boundary And Limits

The two private genuine v1.3.3 export checks remain skipped locally; no private export was supplied. The opt-in local Docker test is covered by the separate real Actions lifecycle job. No production SMTP delivery, live installation upgrade or complete private backup/restore rehearsal was performed. Existing TOTP timing/replay behaviour is unchanged. Accessibility evidence is scoped automated/manual checking of these additions, not a claim of complete site certification or assistive-technology testing.

Developer, API, architecture, security, community guides, compatibility copies, Function Index and active handover are updated in this batch. No known Batch 04 implementation blocker remains. The owner must review the implemented appearance and behaviour; green checks do not approve the interface.

Stop after Batch 04. No Batch 05, PR #358 or rack-spacing PR #359 merge, protected `main` change, deployment or publication is authorised or performed.
