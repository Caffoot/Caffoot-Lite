# Device Stock Registration, Reissue And Hardware Evidence

> Draft v2.2 — Not Yet Published. Review evidence for
> [draft PR #390](https://github.com/Caffoot/Caffoot-Lite/pull/390), targeting
> `milestone-1`. No owner visual acceptance, merge, release or deployment is claimed.

## Scope And Safeguards

Starting integration revision: `7f11598b50bbb1fbd11893a2ad34bc152ff12ed1`.
One feature branch: `feat/it-assets-device-registration-reissue`.

| Checkpoint | Pushed Commit | Actual Check At That Checkpoint |
| --- | --- | --- |
| Preflight/source mapping | `fe0eabc` | Read-only source, transaction and approved-reference review |
| Atomic registration backend | `e1e15a6` | 152 focused backend tests passed |
| Existing Add Device integration | `5af850b` | Real Chromium stock/Device entry routes, prefill, save accounting and cancellation passed |
| Separate reissue | `970fcc0` | 94 affected backend tests passed; expanded ten-test reissue suite and actual Chromium reissue passed |
| Optional hardware/manufacturers | `3a9d323` | 107 focused backend tests and real Chromium storage/catalogue journey passed |
| Draft guidance/source preparation | `2f56ce6` | Draft guide, feature/privacy and custom-preference checks; complete local verification started |
| Inline compatibility safeguard | `3f52974` | Actual browser validation and final 36 changed-screen captures passed |

The [technical mapping](../../../development-guide/Device-Stock-Registration-and-Reissue.md)
records the exact write boundaries and API routes. Device creation, managed IPAM
changes, stock linkage, transfer and audit share one immediate transaction.
The normal Device writer is reused without an internal commit. Reissue creates a
new permanent assignment and matching physical issue without updating the Device.
Historical allocation restrictions and immutable Schema 16/17 definitions remain.
No migration, second inventory or assignment database is introduced.

Actor-scoped operation references, request digests and versions protect identical
retries, changed/stale requests and competing writes. Both independent Edit rights,
live session/MFA, eligibility and recipient status are checked under the write lock;
the HTTP handlers retain Origin, CSRF, content-type, size and duplicate-field checks.
Stock possession is journalled explicitly. The normal direct Device route retains
its independent rights and optional IPAM/Racks behaviour.

Storage Type is separate from capacity. Optional physical Server Boot/ZFS records
never calculate or overwrite legacy RAID/capacity/drive count. A selected existing
Boot Pool is referenced once. UPS/PDU changes add approved manufacturer suggestions
only, including Ubiquiti, using the existing custom/hidden-preference mechanism.

## Final Verification

Runtime/capture source: **`3f5297480cadafbf257cacdd2a6ead44bfd6bfe7`**.
The complete local backend, compatibility and Docker checks began at
`2f56ce610598f10ea6f8cf3b8fb81b806465eb08`; the only later runtime change is the
inline unavailable-type message, covered by the final focused browser flow.
The backend and schema source did not change between those checkpoints.
The final evidence commit adds documentation, captures and a capture-only Details tab selection; runtime bytes are unchanged. Final-head Actions
results are recorded in [PR #390 checks](https://github.com/Caffoot/Caffoot-Lite/pull/390/checks)
and its final verification comment; do not substitute an earlier run for that HEAD.

| Check Actually Run | Result |
| --- | --- |
| `python -m unittest discover -s tests -v` | **835 run: 831 passed, four skipped**, 233.805 seconds |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-compat.cjs` | Passed the complete existing compatibility script, including approved editor, IPAM/Racks, permissions, MFA, reservations, Clean Start and one-way import checks |
| Final `tests/device-stock-interface.cjs` | Passed real HTTPS/SQLite registration from both entry points, common-only prefill, blank individual fields, quantity transfer, cancellation, reissue/current Staff assignment, unavailable-type inline validation and feature-off concealment; **16 captures**, zero page errors |
| Final `tests/device-storage-interface.cjs` | Passed normal Boot Storage without ZFS, Pool/VDEV save/edit and single Boot Pool reference, Details display, preserved legacy RAID/capacity, applicable Laptop controls, UPS/PDU suggestions and saved custom/hidden preference preservation; **20 captures**, zero page errors |
| Opt-in `test_compose_lifecycle.py` with `CAFFOOT_DOCKER_SMOKE=1` | **One passed**, 121.307 seconds; configurable HTTPS port and retained TLS/database/security state through restart/recreate |
| Repository release-documentation workflow command | Passed, including byte-identical published guide compatibility copies |
| Changed Markdown local links, Python compilation, changed JavaScript syntax and `git diff --check` | Passed |

The first local Docker build failed because Alpine did not trust this environment's
proxy certificate. The successful lifecycle run used the repository's existing
`CAFFOOT_BUILD_CA=/etc/ssl/certs/ca-certificates.crt` option, passed through the
existing build secret. TLS verification stayed enabled; no Dockerfile/Compose
change, public image, release or deployment was needed. Temporary test containers
and their volume were removed by the lifecycle test.

The four complete-backend skips were the opt-in Docker test (run successfully
separately above), **two private genuine v1.3.3-export tests** without the private
fixture, and the Stage 6 opt-in complete-volume upgrade/restore rehearsal. Native
Raspberry Pi/Safari acceptance also remains deferred. Automated WebKit checks do
not establish native Safari acceptance. Initial new harness import/fixture and
navigation-selector errors were corrected before the reported passing runs.

## Implemented Scope

| Approved Area | Implementation |
| --- | --- |
| Brand New / Get From Stock | Existing Add Device form and authorised Stock Item Details action; protected compatible quantity Ready selection and common prefill |
| Atomic identity/accounting | Normal Device writer inside caller-owned transaction; exactly one canonical Device/unit/registered movement, original receipt item retained, held total unchanged |
| Reissue | Separate protected transaction, genuine held/Ready eligibility, new immutable assignment/issue, original Device/configuration/history unchanged |
| Permissions/privacy | Independent Devices and IT Assets Edit; live session/MFA, write-lock checks, restricted recipient picker, feature-off concealment and safe employee relationships |
| Storage Type | Optional applicable physical Add/Edit control and Details persistence, blank/custom historic values retained |
| Physical Server storage | Optional ordinary boot, named Pools/VDEVs, accepted layouts and one existing Boot Pool reference; independent legacy RAID/capacity/drive count |
| UPS/PDU manufacturers | Complete approved suggestions including Ubiquiti; no models, Supplier changes or historic rewrites |
| Documentation/evidence | Draft step-by-step guide, active indexes/handover, source Function Index and genuine changed-screen gallery |

No migration is required. Protected Schema 16 stock definitions, Schema 17 closure
and original Device Details HTML are unchanged. No Associated Equipment, corrections,
dashboards/Low Stock, Supplier directory, Service Desk, stocktakes, retirement,
backup/release or website feature is introduced.

## Owner-Approved Boot Storage Checkbox Correction — Updated Visual Evidence

The product owner identified the oversized, detached **Record Boot Storage**
checkbox in the original Server hardware screenshots and approved a narrow
presentation correction plus a registered-stock readiness limit.

The correction is in commits `084f465` and `7bda5ef`: a compact, inline 17 px
checkbox within the existing approved Device form, and readiness editing that
cannot move the registered Ready portion of quantity-based stock. Focused backend
and actual-browser regression tests are part of the PR.

**Eight affected genuine screenshots were re-captured** from the corrected
application source at `e2520afedf62ea5d63681adb5d2bcd73cc3ca1e7` through the existing
`tests/device-storage-interface.cjs` Chromium test, with fictional records.
[The capture workflow](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43830964329) succeeded; it had read-only repository
permissions. Both desktop/mobile and light/dark states were checked.
The one-off capture workflow is removed in the evidence-update commit.

Those eight images replace only the corresponding original **ordinary Boot Storage**
and **existing ZFS Boot Pool** PNGs in the gallery below. The other **28 genuine
images** remain from the original runtime source
`3f5297480cadafbf257cacdd2a6ead44bfd6bfe7`; they were not altered.
The [manifest](capture-manifest.json) gives SHA-256, byte length and the
actual source for each refreshed screenshot. No image was artificially
retouched, and no owner visual acceptance or merge is claimed.
Final-head Actions must still be verified after this evidence commit.

## Changed-Screen Gallery

**36 genuine screenshots**, fictional data, desktop **1440 × 1050** and mobile
**390 × 1050**, light and dark. Screenshots include the real page/modal scrolling
position; taller full-page PNGs can include the underlying page behind the fixed
modal. The capture helpers verify the actual selected theme and page overflow.
The [stock results](stock/browser-results.json), [storage results](storage/browser-results.json)
and [SHA-256/source manifest](capture-manifest.json) pin the captures to the runtime
source above. Earlier accepted screenshots are unchanged. This is review evidence,
not owner visual approval.

| Changed View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Get From Stock In Existing General Tab | [View](stock/get-from-stock-desktop-light.png) | [View](stock/get-from-stock-desktop-dark.png) | [View](stock/get-from-stock-mobile-light.png) | [View](stock/get-from-stock-mobile-dark.png) |
| Desktop Shared Storage Type | [View](stock/desktop-storage-type-desktop-light.png) | [View](stock/desktop-storage-type-desktop-dark.png) | [View](stock/desktop-storage-type-mobile-light.png) | [View](stock/desktop-storage-type-mobile-dark.png) |
| Stock Item Registration Action | [View](stock/stock-registration-action-desktop-light.png) | [View](stock/stock-registration-action-desktop-dark.png) | [View](stock/stock-registration-action-mobile-light.png) | [View](stock/stock-registration-action-mobile-dark.png) |
| Reissue Existing Device | [View](stock/reissue-existing-device-desktop-light.png) | [View](stock/reissue-existing-device-desktop-dark.png) | [View](stock/reissue-existing-device-mobile-light.png) | [View](stock/reissue-existing-device-mobile-dark.png) |
| Ordinary Server Boot Storage | [View](storage/server-independent-boot-desktop-light.png) | [View](storage/server-independent-boot-desktop-dark.png) | [View](storage/server-independent-boot-mobile-light.png) | [View](storage/server-independent-boot-mobile-dark.png) |
| Existing ZFS Boot Pool Link | [View](storage/server-zfs-boot-pool-desktop-light.png) | [View](storage/server-zfs-boot-pool-desktop-dark.png) | [View](storage/server-zfs-boot-pool-mobile-light.png) | [View](storage/server-zfs-boot-pool-mobile-dark.png) |
| ZFS Pool And VDEV Controls | [View](storage/server-zfs-vdev-desktop-light.png) | [View](storage/server-zfs-vdev-desktop-dark.png) | [View](storage/server-zfs-vdev-mobile-light.png) | [View](storage/server-zfs-vdev-mobile-dark.png) |
| Server Storage Details | [View](storage/server-storage-details-desktop-light.png) | [View](storage/server-storage-details-desktop-dark.png) | [View](storage/server-storage-details-mobile-light.png) | [View](storage/server-storage-details-mobile-dark.png) |
| Laptop Storage Type Without Server Controls | [View](storage/laptop-storage-type-desktop-light.png) | [View](storage/laptop-storage-type-desktop-dark.png) | [View](storage/laptop-storage-type-mobile-light.png) | [View](storage/laptop-storage-type-mobile-dark.png) |

See the [draft step-by-step user guide](../../../how-tos/features-and-instructions/v2.2-draft/Device-Stock-Registration-and-Reissue.md).
Owner visual acceptance and separate merge approval remain outstanding. Native
Pi/Safari, private genuine-export and Stage 6 restore acceptance stay deferred.
v2.1 remains published; `main` and the website are outside this batch.
