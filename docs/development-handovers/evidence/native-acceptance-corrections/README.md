# Native Acceptance Correction Batch — Development Evidence

**26 November 2026. Unreleased v2.2; independent review and owner visual acceptance pending.**

Baseline: `milestone-1` at `eff18a7acc2ec78e251562882c41af154bd929ed`, schema 31. The initial workspace was an older `work` checkout; the remote milestone ref was verified and fetched before the dedicated `fix/native-acceptance-corrections` branch was created. No unexplained baseline discrepancy remains.

Authority: [checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7188882370), [owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7189258357), the uploaded five-correction development request and [native pause after Test 69](https://github.com/Caffoot/Caffoot-Lite/issues/452#issuecomment-7188789117).

## Exact Changes

| Correction | Implemented Behaviour |
| --- | --- |
| Audit labels | Only known optional-feature Settings events receive fallback display names for IT Assets, Equipment Lifecycle and Suppliers. Recorded friendly names take precedence. Original labels, IDs, saved JSON, historical evidence and exports are retained. |
| Field alignment | Align the profile grid at the top of each field so the email verification indicator below the input cannot displace Display Name. |
| Manage Permissions | Responsive 980px desktop maximum; four ordered tabs: Personal Details, Roles, Permissions, Account Controls. Header, badges, Close, tabs and footer/Done remain visible. Selected content scrolls. Tab switching, immediate account changes and role confirmations retain unsaved personal details and their original saved revision. Existing individual save/confirmation mechanisms and light/dark styling remain. |
| Employment security | Staff Members Edit can manage unlinked employment status and permitted linked employment details. Linked status changes also require administrator authority. Left Company atomically disables the linked login and revokes sessions and email/password-change proofs. Reactivation leaves login disabled; enabling/linking while Staff are Left Company is rejected. Existing assignment eligibility checks reject inactive recipients. Self-disable and last-active-administrator safeguards remain server enforced. |
| Department data | Successful assignment, shared Department changes, stock issue, reassignment, return or write-off refresh an open Department or invalidate it for a fresh read on entry. Request generations reject older responses. Returned/ended Device custody events appear in Department History. No polling or blanket application refresh was added. |

Schema remains **31**. Startup reconciliation disables legacy inactive Staff's enabled logins within the existing initialisation transaction, records an explicitly attributed Application upgrade event, revokes sessions/proofs and is idempotent. It preflights all affected administrator accounts and rolls back with a product-owner-approval error if reconciliation would remove every active administrator. No private or running installation was reconciled.

The write-path review covered Staff add/edit/quick-status/login-only operations, account create/enable operations, the shared account-link helper, bootstrap, profile synchronisation, inventory reset and startup migrations. Bootstrap creates active Staff; profile/reset paths do not enable logins or change employment status. Assignment and stock recipient checks use current Staff eligibility within their existing write transactions. Existing records, custody, tickets, history, MFA enrolment and credentials are retained. No HR functionality or new dependency was added.

## Checks Actually Executed

| Check | Result And Limits |
| --- | --- |
| `PYTHONPATH=tests:. python -m unittest tests.test_staff_directory tests.test_account_security tests.test_schema -q` | **43 passed**. Includes linked/unlinked editor permissions, Staff Edit requirement for administrators, atomic offboarding/rollback, session/email/password-change proof revocation, reactivation, enable/link/create restrictions, self/last-admin safeguards, safe/idempotent reconciliation and whole-upgrade rollback on an administrator conflict. |
| `PYTHONPATH=tests:. python -m unittest tests.test_staff_directory_http -q` | **17 passed**. Includes HTTP permission rejection, lost-session denial after offboarding, blocked enabling before reactivation and retained disabled state afterwards, privacy and stale edits. |
| `PYTHONPATH=tests:. python -m unittest tests.test_device_assignments tests.test_stock_circulation tests.test_shared_devices tests.test_staff_directory_migration -q` | **69 passed**. Existing recipient rechecks, assignments, custody/history retention, returns and Department/employee access remain covered. |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_CORRECTIONS_OUTPUT=work/native-corrections-pinned node tests/native-acceptance-corrections.cjs` | **Passed** in Chromium 155.0.8059.79. Four ordered tabs, desktop/narrow dimensions, light/dark, visible fixed controls/Done, keyboard tab navigation, aligned inputs, retained drafts through tab/role/account changes, explicit personal-detail save, friendly audit names/details/export and original database bytes, real Department assignment/change/return refresh, delayed stale-response rejection and related Staff/Device/My Equipment views. **No page errors.** [Machine-readable results](browser-results.json). |
| Local Docker build, schema import, HTTPS health and bundled source | **Passed** using the existing `proxy_ca` BuildKit secret option with the session certificate bundle, TLS verification retained. Exact source label `bf5a016039b9812c0825644b47c6b619bbad653e`; non-root `10001:10001`; schema 31. [Image and health evidence](docker-smoke.json). |
| Focused tests inside that Docker image | **43 passed** against the image's backend. Test files were streamed into the disposable container's `/tmp`; no host backend mount was substituted. [Result](docker-tests.txt). |
| Syntax, source hashes, screenshot hashes and affected Markdown links | Checked locally; screenshot runtime hashes match the pinned source. Broader legacy browser fixtures were adapted to the new tabs/wording and syntax checked, without repeating their full journeys. |

Initial runs exposed old independent-status test expectations and browser-fixture setup/navigation assumptions; these were corrected before the passing results above. Docker's first package fetch failed certificate trust without the existing secret option; the normal trusted-secret build passed. A host bind mount could not expose tests to the non-root container, so disposable test sources were streamed to its own `/tmp` instead. None of these initial attempts is presented as a pass.

## Application Screenshots

The **16 PNGs are genuine viewport captures from the running HTTPS application**, with fictional people and equipment. They are not previews or generated illustrations. Application source: [`bf5a016039b9812c0825644b47c6b619bbad653e`](https://github.com/Caffoot/Caffoot-Lite/tree/bf5a016039b9812c0825644b47c6b619bbad653e); all recorded runtime file hashes were checked against that Git revision. The later evidence commit changes tests/docs/evidence only. [Source hashes and layout geometry](browser-results.json) · [PNG hashes](screenshot-sha256.json).

Desktop: 1440×1000. Narrow: 390×844. Keyboard navigation additionally checked at 390×600. Only the selected content scrolls; the footer remains in the viewport. The author inspected representative Personal Details, Roles, Permissions and Account Controls captures, including narrow dark mode. This is development evidence, not product owner visual acceptance.

| Tab | Desktop Light | Desktop Dark | Narrow Light | Narrow Dark |
| --- | --- | --- | --- | --- |
| Personal Details | [Desktop Light](screenshots/permissions-personal-1440-light.png) | [Desktop Dark](screenshots/permissions-personal-1440-dark.png) | [Narrow Light](screenshots/permissions-personal-390-light.png) | [Narrow Dark](screenshots/permissions-personal-390-dark.png) |
| Roles | [Desktop Light](screenshots/permissions-roles-1440-light.png) | [Desktop Dark](screenshots/permissions-roles-1440-dark.png) | [Narrow Light](screenshots/permissions-roles-390-light.png) | [Narrow Dark](screenshots/permissions-roles-390-dark.png) |
| Permissions | [Desktop Light](screenshots/permissions-permissions-1440-light.png) | [Desktop Dark](screenshots/permissions-permissions-1440-dark.png) | [Narrow Light](screenshots/permissions-permissions-390-light.png) | [Narrow Dark](screenshots/permissions-permissions-390-dark.png) |
| Account Controls | [Desktop Light](screenshots/permissions-controls-1440-light.png) | [Desktop Dark](screenshots/permissions-controls-1440-dark.png) | [Narrow Light](screenshots/permissions-controls-390-light.png) | [Narrow Dark](screenshots/permissions-controls-390-dark.png) |

Open this report at its evidence commit SHA to keep every relative screenshot link revision pinned.

## Delivery And Remaining Gates

The correction branch is pushed and [draft PR #470](https://github.com/Caffoot/Caffoot-Lite/pull/470) targets `milestone-1`. It must remain draft for independent review and product owner visual acceptance. Automatic approval review initially rejected PR creation because it did not recognise authorisation in the uploaded request. A retry after checking the explicit user-provided Delivery instructions succeeded; no bypass or alternative publication route was used.

No merge, deployment, image publication, release or acceptance issue closure was performed. Native acceptance remains **paused after Test 69; Test 70 is next**. Native Safari, actual mobile hardware, ARM64/Pi checks, supported production upgrades and complete-volume backup/restore remain in their separately authorised stages. No full regression or CI polling was performed. Preserve all outstanding [#366 release requirements](https://github.com/Caffoot/Caffoot-Lite/issues/366) and [#443 final comprehensive audit](https://github.com/Caffoot/Caffoot-Lite/issues/443).

## Files Changed

The implementation changes the five employment/account backend files, six interface files, focused tests and their directly affected tab/status fixtures, the five affected draft guides, the function map and development evidence. The complete baseline-to-correction file list follows.

```text
backend/permissions.py
backend/schema.py
backend/staff_directory.py
backend/staff_employment.py
backend/staff_identity.py
docs/development-guide/Development-Status.md
docs/development-guide/Function-Index.md
docs/development-handovers/evidence/native-acceptance-corrections/README.md
docs/development-handovers/evidence/native-acceptance-corrections/browser-results.json
docs/development-handovers/evidence/native-acceptance-corrections/docker-smoke.json
docs/development-handovers/evidence/native-acceptance-corrections/docker-tests.txt
docs/development-handovers/evidence/native-acceptance-corrections/screenshot-sha256.json
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-1440-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-1440-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-390-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-390-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-permissions-1440-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-permissions-1440-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-permissions-390-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-permissions-390-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-personal-1440-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-personal-1440-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-personal-390-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-personal-390-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-roles-1440-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-roles-1440-light.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-roles-390-dark.png
docs/development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-roles-390-light.png
docs/development-handovers/milestone-01.md
docs/how-tos/features-and-instructions/v2.2-draft/Audit-Trail.md
docs/how-tos/features-and-instructions/v2.2-draft/Departments-and-Shared-Equipment.md
docs/how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md
docs/how-tos/features-and-instructions/v2.2-draft/Roles-Section-Permissions-and-MFA.md
docs/how-tos/features-and-instructions/v2.2-draft/Staff-Members.md
interface/application.js
interface/equipment.js
interface/screens/users.html
interface/staff-directory.js
interface/stock-intake.js
interface/styles/components.css
tests/browser-compat.cjs
tests/builtin-roles-interface.cjs
tests/device-assignments-interface.cjs
tests/native-acceptance-corrections.cjs
tests/owner-acceptance-batch-01.cjs
tests/staff-account-workflow.cjs
tests/staff-directory-interface.cjs
tests/stage-6-6-account-security-interface.cjs
tests/test_staff_directory.py
tests/test_staff_directory_http.py
tests/users-roles-interface.cjs
```
