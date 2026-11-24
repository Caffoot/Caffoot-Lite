# Stage 6.5 Integrated Regression

24 November 2026 · Milestone 01, unreleased v2.2. The checkout and remote `milestone-1` both identified `2380334970e1162ad6811f1703a91dcfc863b803` as the starting revision. All application checks in this report used that source and SQLite schema 29. The review branch adds regression assertions and evidence. [Starting revision](https://github.com/Caffoot/Caffoot-Lite/commit/2380334970e1162ad6811f1703a91dcfc863b803) · [Owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7132587750) · [Review PR #448](https://github.com/Caffoot/Caffoot-Lite/pull/448)

## Environment

The disposable environment ran Debian 13.7 AMD64, Linux 6.18.57, Python 3.12.14, SQLite 3.53.1, Node 24.22.3 and Playwright 1.62.1. Backend suites used temporary SQLite databases, real loopback HTTP handlers for API checks and a loopback SMTP receiver for mail checks. The browser journeys used the running application over loopback HTTPS and fictional records and accounts. The Docker daemon was 29.9.2 with Compose 2.40.3.

## Coverage And Results

| Area | Applicable earlier evidence | Observed at schema 29 |
| --- | --- | --- |
| Account eligibility, MFA and recovery | Accepted Stage 6.1 Add User, two-step recovery and Change Password flows. | Live API checks covered Administrator, scoped IT edit, ordinary Staff, read-only and no-access outcomes, account eligibility and effective role overrides. MFA and session checks covered enrolment and revocation. The Chromium recovery journey rejected unequal passwords, incorrect current credentials, an invalid recovery proof and missing MFA. It also verified a successful reset, proof consumption, session revocation and successful sign-in. |
| Inventory, IPAM and Racks | Stage 6.3 preserved linked inventory, disabled Racks and their saved data. | Explicit IP linking, failed and replayed changes, rack placement and collision validation, history permissions and optional-feature persistence passed. Denied feature or permission calls and invalid IPAM writes preserved the saved rows. |
| Staff, Departments and assignments | Stages 3 and 6.4 covered directory permissions, history and shared custody. | The directory API enforced Staff and Department permissions separately. Shared assignments kept the same Device and custody IDs on each Department's view. Mixed Staff and Department recipients, duplicates, stale edits, an empty Department list and re-adding an archived Department were refused. Existing archived relationships remained usable by eligible members until removed. |
| Stock, accessories and handover | Stage 6.4 verified original Department and custody-recipient issues through return, reassignment, reissue and write-off. | Canonical Devices retained one physical identity. Relationship changes preserved issue records, quantities and held balances. Physical return and reassignment followed the existing preparation and accessory safeguards. Correction compensation, stale and concurrent writes, audit failure rollback and denied read/edit writes were checked against the ledger. |
| Suppliers, Purchasing and Lifecycle | The schema 28 recovery rehearsal retained Device and receipt Supplier relationships, purchasing issues and Lifecycle records. | Supplier and purchasing checks exercised receipt provenance, persisted issue status and history, counts and atomic edits. Lifecycle checks exercised policy, Device validation, permissions, warranty and replacement views. Browser journeys exercised Supplier selection, cancelling or discarding edits, saved relationship retention and Lifecycle navigation. |
| Service Desk and notifications | Stage 5 accepted technician and employee workspaces, activity reports, templates, branding and the existing notification events. Stage 6.4 verified shared and accessory custody. | Live ticket checks covered creation, assignment, employee replies, internal notes, attachment bytes, status and reopening, reporting, email settings and branding. Department changes took effect on the current custody. Earlier physical custody and unverifiable historical accessory conversations stayed protected. Revoked users were denied replies and direct downloads. After accessory return, Device handover and a new accessory issue, the new holder could raise a personal ticket and download its file. The old conversation remained unavailable, and denied operations left the database unchanged. Queue checks withheld delivery from removed or otherwise ineligible recipients and deduplicated eligible addresses. |
| Protected replacement | Stage 6.2 verified a genuine v1.3.3 export with fictional data, protected Device conflict reporting and rollback. | The new test linked an original Department stock issue to one Device shared by two Departments. A compatible import with IT Assets, Suppliers and Lifecycle off preserved all non-inventory rows, including the custody and ticket history. An import omitting that Device returned HTTP 400 and left the database dump unchanged. Employee ticket access stayed gated while IT Assets was off and both Departments could download the saved file after it was enabled. Existing cases confirmed Administrator-only conflict details, late dependency validation and whole-transaction rollback. Chromium used the published v1.3.3 **Download Backup** control with fictional data, then completed review, cancellation, successful import and protected rejection against v2.2. |
| Upgrade and recovery | The pinned Docker rehearsals below cover supported upgrade and stopped-volume restore paths. | The populated schema 28 → 29 fixture checked preserved IDs, original stock records and balances, archived relationships, foreign keys and rollback on injected migration failure. Fresh database and repeat-startup checks covered the current migration implementation. |

[Stage 6.1 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/347#issuecomment-7124253298) · [Stage 6.2 evidence](../stage-6-2/README.md) · [Stage 6.3 evidence](../stage-6-3/README.md) · [Stage 6.4 evidence](../stage-6-4/README.md) · [Stage 6.4 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/431#issuecomment-7132417522)

## Local Commands

Run these commands from the repository root.

```sh
PYTHONPATH=tests python3 -m unittest -v \
  test_associated_ticket_custody test_shared_devices test_protected_import_http \
  test_shared_device_schema test_service_desk_http test_service_desk_attachments \
  test_email_templates_http test_feature_settings_http test_required_mfa_http \
  test_role_admin_http test_session_http test_account_email_http

PYTHONPATH=tests python3 -m unittest -v \
  test_optional_ip_http test_ipam_saves test_rack_validation test_staff_directory_http \
  test_department_details_http test_device_handovers_http test_stock_corrections \
  test_suppliers_http test_equipment_lifecycle test_history_http \
  test_optional_features_persistence test_modular_interface test_genuine_export

PYTHONPATH=tests python3 -m unittest -v \
  test_protected_import_http.ProtectedImportHttpTests.test_shared_accessory_custody_and_ticket_access_survive_protected_import

PYTHONPATH=tests python3 -m unittest -v \
  test_role_migration test_staff_directory_migration test_device_assignments_http \
  test_stock_circulation test_service_desk_calendar

PYTHONPATH=tests python3 -m unittest -v \
  test_associated_ticket_custody.AssociatedAccessoryVisibility.test_new_physical_holder_can_report_an_accessory_without_inheriting_its_history
```

The five runs passed **257** backend tests (90, 101, 1, 64 and 1). The second run also skipped **two** cases requiring a private legacy export. The first run preceded the addition of the protected import and physical handover tests. An initial handover test request omitted the association ID and received the expected HTTP 409. The final test retains the rejection and uses the ID from the live equipment picker for the successful request. The release documentation consistency script from the existing workflow passed locally, including release identifiers and byte-for-byte agreement between published guide paths.

```sh
CAFFOOT_DOCKER_SMOKE=1 CAFFOOT_BUILD_CA=/etc/ssl/certs/ca-certificates.crt \
  python3 -m unittest discover -s tests -p test_compose_lifecycle.py -v
```

The Compose smoke test passed. The new assertions checked the full schema version sequence, SQLite integrity and foreign keys at initial startup, after restart and after recreation. The existing checks confirmed that the same volume retained its records, TLS certificate and protected account email state. The local build used the Dockerfile's existing optional CA secret to trust the workspace proxy.

## Browser Checks

Chromium 156.0.8078.79 passed `tests/shared-devices-interface.cjs`, `tests/service-desk-reporting-interface.cjs`, `tests/recovery-confirmation.cjs`, `tests/equipment-lifecycle-interface.cjs`, `tests/equipment-suppliers-interface.cjs` and `tests/stage-6-2-import-interface.cjs`. The shared custody journey checked responsive access at 1,440, 390 and 320 px and reported no page errors. The Users and Roles and session expiry journeys passed, including the Staff write denials, expired reads and writes, and re-sign-in with MFA. The Email Templates journey passed in Playwright's Chromium headless shell 151.0.7922.34 after that executable was installed. It checked the authenticated ticket link, mail settings, wording and branding.

Firefox 153.0 and automated WebKit 26.5 each passed the established feature and placement, Users and Roles, and native select journeys. These checked the feature and read matrix, placement, cancelled and rejected changes, role overrides, MFA, Staff profile and feature-setting denials, keyboard interaction, desktop/mobile layout, targeted axe checks and absence of page errors in the monitored journeys. WebKit also passed the separate Lifecycle journey.

Browser prerequisites were Playwright 1.62.1, axe-core 4.14.0 and the published `v1.3.3` tag and pinned visual reference in the local Git history. The browser packages and host libraries were installed in scratch space. The original Firefox launch stalled on the sandboxed host. The disposable runner used writable XDG directories and set `MOZ_DISABLE_CONTENT_SANDBOX`, `MOZ_DISABLE_GMP_SANDBOX` and `MOZ_DISABLE_RDD_SANDBOX` for Firefox. The larger WebKit workflow image exceeded the local Docker daemon's storage limit, so the checks used Playwright's local Linux WPE WebKit engine with its runtime libraries. The environment adjustments left the application and its test assertions intact.

```sh
export CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium
export CAFFOOT_AXE_SOURCE="$NODE_PATH/axe-core/axe.min.js"

node tests/shared-devices-interface.cjs
node tests/service-desk-reporting-interface.cjs
node tests/recovery-confirmation.cjs
node tests/equipment-lifecycle-interface.cjs
node tests/equipment-suppliers-interface.cjs
node tests/stage-6-2-import-interface.cjs
node tests/email-templates-interface.cjs
CAFFOOT_ROLES_ENGINE=chromium node tests/users-roles-interface.cjs
node tests/session-expiry-interface.cjs

for engine in firefox webkit; do
  CAFFOOT_PI_ENGINE="$engine" node tests/pi-acceptance-corrections.cjs
  CAFFOOT_ROLES_ENGINE="$engine" node tests/users-roles-interface.cjs
  CAFFOOT_VISUAL_ENGINE="$engine" CAFFOOT_HOST_SELECT_REVIEW=1 \
    CAFFOOT_SUBNET_FIRST=1 CAFFOOT_VISUAL_FILTER='^$' node tests/approved-visual.cjs
done
CAFFOOT_LIFECYCLE_ENGINE=webkit node tests/equipment-lifecycle-interface.cjs
```

The accepted shared-device, accessory and confidentiality-warning images remain the visual reference for those screens. [Stage 6.4 application gallery](../stage-6-4/README.md#application-screenshots)

## Pinned Upgrade And Recovery Evidence

- Stage 6.2 verified schema 10 → 28, including original security and inventory records and expected withdrawal of old sessions and affected email proof. Its Docker candidate was `2107de3668b08c5abdfdae6fe231a3114bbfc380`. The fresh browser run above covered the published export and protected import path. [Stage 6.2 Docker log](../stage-6-2/schema-10-to-28.txt)
- Stage 6.3 verified exact stopped-volume restoration of schemas 10 and 28 with their matching images, including database rows and blobs, file hashes, modes, ownership, TLS identity, restart and recreation. The schema 28 candidate was `5645bc4f91b8090a3eef62673c817bfaa6b10966`. [Stage 6.3 report](../stage-6-3/README.md)
- Stage 6.4 verified schema 10 → 29, populated schema 28 → 29 and exact schema 28 restore with its matching image. The schema 29 Docker candidate was `57ca30e15f2d61d2bb4689c6ca1a3600973df3c7`. That run predates the final schema 29 sequence-preservation and accessory ticket follow-ups. Their current-revision coverage is the focused schema, role migration, custody and import verification above. [Stage 6.4 Docker log](../stage-6-4/recovery.txt)

## Remaining Acceptance

- The executed application checks confirmed no defect requiring corrective implementation. The full backend and browser workflow suites and the final-head Git history scan are for independent CI review.
- Two genuine private legacy-export checks require separately authorised data. The fictional export came from the published control.
- Native Raspberry Pi and Safari, Portainer, restored private installation, off-host backup tooling, Stage 3.4 manual acceptance and third-party password-manager autofill remain outstanding. Stopped-volume evidence covers quiescent archives and matching-image restores. Active writers and SQLite sidecars were outside the rehearsals.
- Stage 6.7 final documentation, website preparation and approval, Stage 6.8 independent audit, final-head CI review and separate merge, publication and deployment approvals remain outstanding. Published v2.1 remains the current release. [Documentation gate #366](https://github.com/Caffoot/Caffoot-Lite/issues/366) · [Website sequence](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7129391028) · [Final audit #443](https://github.com/Caffoot/Caffoot-Lite/issues/443)
