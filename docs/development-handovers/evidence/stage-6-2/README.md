# Stage 6.2 Legacy Import And Upgrade Evidence

24 November 2026. [Owner-approved corrective behaviour](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7124722536) · [Review PR #445](https://github.com/Caffoot/Caffoot-Lite/pull/445) · [Draft administrator instructions](../../../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md)

| Source | Revision |
| --- | --- |
| Published v1.3.3 HTML, export schema 1 | [`65d9e016c6ddefcd43f236cacdf78fa168e7472f`](https://github.com/Caffoot/Caffoot-Lite/commit/65d9e016c6ddefcd43f236cacdf78fa168e7472f) |
| Published v2.1 Docker source, SQLite schema 10 | [`c3237114108cad9f7d4e57657b6aed5e0091a5ef`](https://github.com/Caffoot/Caffoot-Lite/commit/c3237114108cad9f7d4e57657b6aed5e0091a5ef) |
| Starting `milestone-1` integration, unreleased v2.2, SQLite schema 28 | [`2107de3668b08c5abdfdae6fe231a3114bbfc380`](https://github.com/Caffoot/Caffoot-Lite/commit/2107de3668b08c5abdfdae6fe231a3114bbfc380) |
| Stage 6.2 import runtime and original review and success captures, SQLite schema 28 | [`222439bd82bc46d63cb3d232fde801cc378d426e`](https://github.com/Caffoot/Caffoot-Lite/commit/222439bd82bc46d63cb3d232fde801cc378d426e) |
| Protected import rejection padding and refreshed rejection captures, SQLite schema 28 | [`9458ef86e5588a096a6b2fca6bc9d757a31abaaa`](https://github.com/Caffoot/Caffoot-Lite/commit/9458ef86e5588a096a6b2fca6bc9d757a31abaaa) |

## Correction And Focused Backend Verification

The initial verification found that a confirmed import could silently delete Supplier and Lifecycle information for Devices without tickets. It also found generic HTTP 503 responses when assignment or stock relationships prevented deletion. The correction resolves protected relationships before final confirmation where the reviewed Device records are available, and rechecks current relationships under the write lock. The dependency check covers Staff and Department assignments, handovers, stock units and stock linked through assignments, equipment associations, Supplier and Lifecycle rows, and Service Desk history linked directly or through a Device's stock unit. Ticket events, messages, attachments and closures stay with their ticket. Existing standalone audit records remain in the audit trail. Edit reservations are temporary and keep their existing replacement behaviour.

| Focused check | Result |
| --- | --- |
| Identical protected Devices with optional features disabled | Passed. The same SQLite row IDs, revisions and Device JSON survived reordering. Compared complete non-inventory rows, including assignments, stock movements, equipment associations, Supplier and Lifecycle rows, permissions, tickets, events, messages and attachments. A saved attachment remained downloadable. |
| Missing and changed protected Devices | Passed. A single preview listed all four affected Devices, conflict reasons and relationship types. A non-Administrator received no conflict details. The complete database dump was unchanged. |
| Preview and confirmation timing | Passed. Access Point choices exposed conflicts as soon as a candidate existed. An assignment added after a clean preview was detected at confirmation. Rejected drafts could no longer be confirmed. |
| Late failure | Passed. An injected failure during IP allocation insertion rolled back protected ordering changes, unprotected Device deletion and all other writes. The database dump matched the pre-import dump. |
| Existing supported import and interface contracts | Passed. Focused tests covered ordinary replacement, session and draft safeguards, same-origin/CSRF, explicit approval, cancellation, mounting and historical fields. The pinned design stylesheet comparison and template resolution passed. The Staff/Department preservation case passed. |

Local Linux AMD64, Python 3.12.14 and SQLite 3.53.1. **102 passed** across the focused import/assignment/Service Desk run and the three modular-interface/Staff directory checks. Two private fixture cases skipped. The shallow checkout initially lacked the pinned stylesheet source. Fetching its recorded revision allowed the unchanged source check to pass.

```sh
PYTHONPATH=tests python -m unittest -v \
  test_protected_import_http test_inventory test_import_http test_import_drafts \
  test_import_boundary test_import_review test_approved_migration_boundary \
  test_full_import_boundary test_migration_confirmation_handoff \
  test_migration_legacy_review_handoff test_genuine_export \
  test_device_assignments.DeviceAssignmentTests.test_clean_start_clears_assignments_while_delete_and_import_protect_them \
  test_service_desk_http.ServiceDeskHttpTests.test_device_deletion_and_compatible_inventory_replacement
PYTHONPATH=tests python -m unittest -v test_modular_interface \
  test_staff_directory_migration.StaffDirectoryMigrationTests.test_import_retains_directory_and_clean_start_clears_operational_staff_data
```

## Published Export And Browser Captures

The [focused Chromium runner](../../../../tests/stage-6-2-import-interface.cjs) loaded the exact tagged HTML over loopback. The tagged HTML SHA-256 was `130f328947216da8e12e5abdcc08f6107640dc77ea3fc0395fadc09d5172ec6a`. The runner populated fictional browser inventory, including older mounting states, and clicked **Settings & Data → Download Backup**. The unchanged published control generated the JSON files. The runner then selected those files through the actual v2.2 review, cancellation and confirmation screens. All records and accounts in the captures were fictional.

**Passed.** The Access Point choice and legacy computer approval were exercised. The cancelled import left the complete database unchanged. Confirmed inventory survived reload, including the Device ID, asset tag, notes, custom field, inventory setting, IP allocation, VLAN relation and rack placement and dimensions. A second genuine browser download omitted one protected Device and changed another. The destination listed both conflicts and preserved the complete database. Re-importing the compatible first download retained both protected Device rows and revisions, including the Supplier and Lifecycle records.

Captured on Chromium 156.0.8078.79 with Playwright 1.62.1 and Node 24.22.3 on Debian 13 AMD64. Desktop light mode used a 1440 × 960 viewport. The v2.2 browser used loopback HTTPS and its disposable SQLite database.

| Capture | What it shows |
| --- | --- |
| [Access Point review](01-access-point-review.png) | Landing Access Point needs a mounting decision. |
| [Replacement review](02-replacement-review.png) | Inventory counts, the proposed laptop mounting correction and confirmation choices. |
| [Successful import](03-import-success.png) | The application confirms that inventory was imported. |

### Protected Import Rejection Captures

The four captures below were taken on 24 November 2026 from the padded rejection dialog using the runtime and browser runner in `9458ef86e5588a096a6b2fca6bc9d757a31abaaa`. Chromium 156.0.8078.79 and Playwright 1.62.1 ran with Node 24.22.3 on Debian 13 AMD64, using the same fictional inventory and loopback HTTPS setup. The dialog lists the missing Supplier-linked Reception Desktop and changed Workshop Laptop with a Lifecycle record.

| Viewport | Light mode | Dark mode | Measured padding |
| --- | --- | --- | --- |
| Desktop, 1440 × 960 | [Desktop light](04-protected-import-rejection.png) | [Desktop dark](04-protected-import-rejection-desktop-dark.png) | 28 px |
| Mobile, 390 × 844 | [Mobile light](04-protected-import-rejection-mobile-light.png) | [Mobile dark](04-protected-import-rejection-mobile-dark.png) | 24 px |

The genuine Chromium run passed the rejection, conflict text, unchanged database and Close checks in all four views. The modular interface's template resolution and pinned stylesheet checks also passed.

To reproduce, fetch the published `v1.3.3` tag and run the browser test using the repository's existing Playwright setup.

```sh
git fetch origin tag v1.3.3
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium \
CAFFOOT_STAGE62_SCREENSHOTS=/tmp/caffoot-stage62-captures \
node tests/stage-6-2-import-interface.cjs
```

## Earlier Isolated Docker Upgrade — Reused Evidence

The original verification built both exact source revisions with their repository Dockerfiles. It ran on Linux AMD64 with Docker 29.9.2, Compose 2.40.3 and container Python 3.12.16 / SQLite 3.53.4. The [recorded run output](schema-10-to-28.txt) includes the local image IDs. The existing [upgrade fixture](../../../../tests/fixtures/upgrade_restore.py) was populated under the published application and supplemented with fictional linked inventory, attributed history and a profile image. The application migrated a separate consistent copy through all 18 steps, creating the 40 expected tables. The original schema-10 data was unchanged.

- Preserved inventory, Device revisions, IP/subnet/VLAN and rack links, history, eight accounts and profiles, authenticator state, original grants and email-attempt records. SMTP settings, key and TLS files retained contents, permissions and ownership. Eight Staff links were backfilled. Newer operational records were tested on separate schema-28 fixtures.
- Six stored sessions and one outstanding affected email proof were intentionally revoked. The old session cookie failed. Enrolled Reader and Editor access stayed at its prior level. Legacy active users with pending or absent MFA were prompted to enrol where required. The disabled account remained blocked.
- Trusted HTTPS checks, SQLite integrity and foreign-key checks, and Docker recreation passed. Repeated startup preserved the snapshot. The disposable resources were removed.

The correction touches import rather than schema or startup. The Docker rehearsal is reused at its recorded starting revision. Earlier v2.1 Raspberry Pi compatibility evidence remains historical. [Prior Pi check](https://github.com/Caffoot/Caffoot-Lite/issues/218#issuecomment-6545137773)

## Remaining Acceptance

A genuine export was downloaded from published v1.3.3 with fictional data. The two automated checks that need a separately authorised private production export remain unverified. Independent code and visual review, final-head CI and explicit owner merge approval are outstanding. Native Raspberry Pi and Safari acceptance remain separate. Complete-volume restoration belongs to Stage 6.3. Recheck affected paths after relevant Stage 6.4 or 6.5 changes.
