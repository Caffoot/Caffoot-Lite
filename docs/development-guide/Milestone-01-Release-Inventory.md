# Milestone 01 — Draft v2.2 Release Inventory

> **Working inventory, not release notes or final feature approval.** 26 November 2026. Published baseline [v2.1](https://github.com/Caffoot/Caffoot-Lite/tree/v2.1) `c3237114108cad9f7d4e57657b6aed5e0091a5ef`, schema 10; unreleased integration [milestone-1 checkpoint](https://github.com/Caffoot/Caffoot-Lite/tree/fdc677920bfc52f48f641b3d6d1344c902a6a9b0) `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`, schema 31. Authority: [#366 inventory requirement](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7185503954) and [approved work plan](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7196554739).

## Initial feature reconciliation

The following is a starting map from merged PR titles and existing status/evidence, not an exhaustive or independently verified list of individual changes. Expand each row into individual feature/fix entries with exact issue/PR, final source references, guide and screenshot references, applicable version, permissions, evidence and outstanding checks. Classify each entry as user-visible, security/data integrity, deployment, documentation or internal maintenance. Only verified, owner-approved material may feed final website and release notes; no website changes authorised.

| Area | Candidate delivered scope | References | Review state |
| --- | --- | --- | --- |
| Accounts | Configurable IT Staff role, individual overrides, preserved previous grants on upgrade, MFA and account/session safeguards | [#358](https://github.com/Caffoot/Caffoot-Lite/pull/358), [#365](https://github.com/Caffoot/Caffoot-Lite/issues/365) | PR description reviewed; final source/guide reconciliation pending |
| Infrastructure | Rack search spacing; optional feature controls; independent Device addressing and explicit IPAM linking; Rack preservation | #359, #371–#376, #380 | Merge-title inventory; reconcile detailed changes |
| Staff and Departments | Directory and Department foundation/APIs, interface, assignments, My Equipment and Department Details | #377–#382, #386 | Reconcile with later #453, #465–#466, #470 |
| IT Assets | Optional module, intake, stock, issue/return/write-off, registration/reissue, associated equipment, prepared handover, correction, confirmation, overview and low-stock reporting | #387–#393, #398 | Detailed source/guide reconciliation pending |
| Safeguards and usability | VM hardware/category labels, essential audit access, stale Staff edits, Device identity, concurrent password changes, expired-session sign-in, help text | #399, #401–#403, #405–#406, #408 | Individual change reconciliation pending |
| Suppliers and lifecycle | Supplier management, Issues/Purchasing, equipment integration and lifecycle warnings | #414–#416, #418; issues #410–#413 | Individual change reconciliation pending |
| Service Desk | Ticket foundation, IT queue, My Tickets/Department Tickets, administration/reporting, templates/branding, notifications | #437–#442; issues #420–#425 | Reconcile shared-device privacy and later refinements |
| Stage 6 | Recovery confirmation, protected legacy import, shared-device handling, bounded HTTPS listen queue, unified Staff administration | #444–#445, #447, #451, #453 | Detail and evidence reconciliation pending |
| Stage 6.6 | Security, Staff administration and validation; My Equipment/unread replies/Audit Trail; visual consistency and dark mode | #465–#467 | Expand each approved issue and individual fix |
| Native corrections | Friendly known optional-feature audit labels; aligned profile fields; four-tab Manage Permissions with visible Done and retained edits; linked employment/login safeguards and upgrade reconciliation; Department refresh and custody history | [#470](https://github.com/Caffoot/Caffoot-Lite/pull/470), [evidence](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/docs/development-handovers/evidence/native-acceptance-corrections/README.md), [checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7196414155) | Five targeted native Safari checks recorded as passed; wider acceptance pending |
| Verification/internal | Historical secret-scan handling, browser/CI fixes, local integrated regression and backup/restore rehearsal | #395, #417, #446, #448, #449, #469 | Not automatically new user-facing functionality; distinguish evidence from shipped change |

## Merged PR discovery ledger

The closed-PR query targeting milestone-1 returned 61 records, of which 59 have a recorded merge date. This ledger also identifies Stage 1 PR #358 (merged into main before the milestone integration); it is not an exhaustive history of all other base branches. Reconcile earlier/main merges, non-PR commits and any missing records against final source. A closed PR without a merge date is not automatically a delivered feature.

| PR | Title | Merge checkpoint / status |
| --- | --- | --- |
| [#358](https://github.com/Caffoot/Caffoot-Lite/pull/358) | Stage 1 configurable role and access foundation | `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a` (main) |
| [#470](https://github.com/Caffoot/Caffoot-Lite/pull/470) | Correct the five approved native acceptance findings | `fdc677920bfc52f48f641b3d6d1344c902a6a9b0` |
| [#469](https://github.com/Caffoot/Caffoot-Lite/pull/469) | Investigate supplemental Optional Features browser test (#468) | `eff18a7acc2ec78e251562882c41af154bd929ed` |
| [#467](https://github.com/Caffoot/Caffoot-Lite/pull/467) | Stage 6.6 Batch 3 — visual consistency and dark mode | `f707162720127b8912f8bceef02e23278c885c56` |
| [#466](https://github.com/Caffoot/Caffoot-Lite/pull/466) | Stage 6.6 Batch 2 — My Equipment, unread replies and Audit Trail | `8d5b36bbb6e7778ba708653a496e31761edc5cef` |
| [#465](https://github.com/Caffoot/Caffoot-Lite/pull/465) | Stage 6.6 Batch 1 — Security, Staff administration and validation | `f3c0959f8e381e3bb57b7ec0c7f7af5075036cc4` |
| [#453](https://github.com/Caffoot/Caffoot-Lite/pull/453) | Unify Staff administration for v2.2 (#452) | `66917d12a79dbc232596b2ce8416841e82868c00` |
| [#451](https://github.com/Caffoot/Caffoot-Lite/pull/451) | #450 candidate — bounded HTTPS listen queue for interface startup | `f20693163eb6563b5d6d8cf64f12aee68724c04a` |
| [#449](https://github.com/Caffoot/Caffoot-Lite/pull/449) | Document the verified private Raspberry Pi acceptance runbook | `4d20838df94f5616f20caae019abd5b43724e5b8` |
| [#448](https://github.com/Caffoot/Caffoot-Lite/pull/448) | Stage 6.5 — Integrated regression | `68df336856b1a710c375b34f16b4bb3eae5689e6` |
| [#447](https://github.com/Caffoot/Caffoot-Lite/pull/447) | Stage 6.4 — Shared Devices | `2380334970e1162ad6811f1703a91dcfc863b803` |
| [#446](https://github.com/Caffoot/Caffoot-Lite/pull/446) | Verify Stage 6.3 complete-volume backup and recovery | `957969ba1b44465472765e47f91117ca7c87d177` |
| [#445](https://github.com/Caffoot/Caffoot-Lite/pull/445) | Stage 6.2: Protect Device history during legacy inventory import | `5645bc4f91b8090a3eef62673c817bfaa6b10966` |
| [#444](https://github.com/Caffoot/Caffoot-Lite/pull/444) | Stage 6.1 password confirmation for account recovery | `2107de3668b08c5abdfdae6fe231a3114bbfc380` |
| [#442](https://github.com/Caffoot/Caffoot-Lite/pull/442) | Stage 5.6 \| Send approved Service Desk notifications | `7771320014e6736212b224e3ef47cf047436dd33` |
| [#441](https://github.com/Caffoot/Caffoot-Lite/pull/441) | Add email templates and company branding to Settings | `e708c2f5069ec5ff1a429e66bb1cc0d0769e36f3` |
| [#440](https://github.com/Caffoot/Caffoot-Lite/pull/440) | Add Service Desk settings and activity reporting | `7b651af631b18e68da4160d1e29ef1a957c8f7cc` |
| [#439](https://github.com/Caffoot/Caffoot-Lite/pull/439) | Add My Tickets and Department Tickets | `4600ec7bf6a0751af02fbcf003b7f299547cdfd9` |
| [#438](https://github.com/Caffoot/Caffoot-Lite/pull/438) | Add the IT Service Desk to Caffoot Lite | `d477256bd5ac12aa8f485deda7fa3b9d3fc69172` |
| [#437](https://github.com/Caffoot/Caffoot-Lite/pull/437) | Add the Service Desk ticket foundation | `d2b7ead0027ba3579ea96c865a3a4b6cb63037a2` |
| [#429](https://github.com/Caffoot/Caffoot-Lite/pull/429) | docs: align Milestone 01 status and Stage 5 readiness | `8120c72054211217c3d0df8a27702da478d78e50` |
| [#418](https://github.com/Caffoot/Caffoot-Lite/pull/418) | Stage 4 Batch 4.4: Equipment Lifecycle (#413) | `c1b5f8008e8ba56840d9790e3ba1c7e91ad35e0b` |
| [#417](https://github.com/Caffoot/Caffoot-Lite/pull/417) | CI: replace timed-out WebKit dependency setup with verified container (#361) | `1e5c23f99e05aa742cc9d2cd05de813898bd23d6` |
| [#416](https://github.com/Caffoot/Caffoot-Lite/pull/416) | Stage 4 Batch 4.3 — Equipment Supplier Integration | `e67ca1590f1669d722c1ebe2ba11896035d0c49c` |
| [#415](https://github.com/Caffoot/Caffoot-Lite/pull/415) | Stage 4 Batch 4.2 — Supplier Issues and Purchasing Dashboard | `3165457b8c8f824da3e6156f4bf3ce276d7905cd` |
| [#414](https://github.com/Caffoot/Caffoot-Lite/pull/414) | Stage 4.1 \| Supplier Management | `ea6e86c15e207d32795641b52685ae1ec6a828df` |
| [#409](https://github.com/Caffoot/Caffoot-Lite/pull/409) | Make the comprehensive documentation standard permanent | `0f54c2b5808cb6288ba52a26d78acebd50c3f3eb` |
| [#408](https://github.com/Caffoot/Caffoot-Lite/pull/408) | Correct two outdated Stage 3 interface help messages | `5de585aae716d2b4db8d568e0a23fcc8cddaf750` |
| [#407](https://github.com/Caffoot/Caffoot-Lite/pull/407) | Expand Stage 1–3 user and administrator documentation | `f61adcb5b64694b505b006b427adea70b68a2909` |
| [#406](https://github.com/Caffoot/Caffoot-Lite/pull/406) | Issue #400 — return expired sessions to approved sign-in screen | `753b3266893987addb11406ef8303adb03c3c112` |
| [#405](https://github.com/Caffoot/Caffoot-Lite/pull/405) | Protect concurrent account password changes | `8272ffffdb1b116390c1a5446e369f1a784811ee` |
| [#404](https://github.com/Caffoot/Caffoot-Lite/pull/404) | Document stop-and-simplify rule for overcomplicated workflows | `b7045d03d99d0f91ca385508cb8c55565b3ad6a4` |
| [#403](https://github.com/Caffoot/Caffoot-Lite/pull/403) | Protect Device type and identity during normal edits | `be7c3aa21ff31d68dbe68a075f6dfe7756751f10` |
| [#402](https://github.com/Caffoot/Caffoot-Lite/pull/402) | Prevent stale Staff edits and status changes | `a9bc3412b2fc43075b429e87c8cde9febd57e1b1` |
| [#401](https://github.com/Caffoot/Caffoot-Lite/pull/401) | Fix essential administrator audit history when inventory features are disabled | `cb5ae4d904ba281a7ac1be2da3e2dfaa5d463b88` |
| [#399](https://github.com/Caffoot/Caffoot-Lite/pull/399) | Fix VM hardware display and server category labels | `3ff192748e9d6e4f8eaea2c3b93b6d96082ae6aa` |
| [#398](https://github.com/Caffoot/Caffoot-Lite/pull/398) | Add IT Assets Overview, stock reporting and per-item Low Stock warnings | `558286c2430ebee40246180d9f09aefdbb46f6b9` |
| [#395](https://github.com/Caffoot/Caffoot-Lite/pull/395) | Run full regression only at final review, not during draft development | `18ca1aff78c61023ecc68fee1b0e083fa7252d30` |
| [#393](https://github.com/Caffoot/Caffoot-Lite/pull/393) | Confirm Issue Equipment before recording stock | `6222d8a87e4a02dd4e69f070e11777d2ec82b591` |
| [#392](https://github.com/Caffoot/Caffoot-Lite/pull/392) | Correct Stock Movement with retained history and safe Return Equipment integration | `505ec1a60daccdfed4c2c36c9379a29ea6f5367d` |
| [#391](https://github.com/Caffoot/Caffoot-Lite/pull/391) | Add associated equipment and prepared Device reassignment | `53b04328c4f895bfc1f72f0416c43a519b2e8b42` |
| [#390](https://github.com/Caffoot/Caffoot-Lite/pull/390) | Add Device stock registration, reissue and approved hardware fields | `6276225e5d527c83f2ffaf36812ab7c7c5a5269f` |
| [#389](https://github.com/Caffoot/Caffoot-Lite/pull/389) | Add IT Assets issue, return and write-off workflows | `7f11598b50bbb1fbd11893a2ad34bc152ff12ed1` |
| [#388](https://github.com/Caffoot/Caffoot-Lite/pull/388) | Add Receive Stock and Stock Inventory for IT Assets | `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` |
| [#387](https://github.com/Caffoot/Caffoot-Lite/pull/387) | Add IT Assets foundation with an independent feature switch | `774dee3ecaaf1d50ba94dbf55891aa4b79b853c5` |
| [#386](https://github.com/Caffoot/Caffoot-Lite/pull/386) | Add Department Details for Staff and shared equipment | `2e6c50ba4777b7500258d2a1a28317764d806020` |
| [#385](https://github.com/Caffoot/Caffoot-Lite/pull/385) | Synchronise approved v2.1 documentation into Milestone 01 | `47c2ebe3d9249199c0c42dc71fd571b9f6411641` |
| [#383](https://github.com/Caffoot/Caffoot-Lite/pull/383) | Correct milestone status and add draft v2.2 user guides | `ff7a088bbe8e24322c84106e417ab1b03f3dfe70` |
| [#382](https://github.com/Caffoot/Caffoot-Lite/pull/382) | Add canonical Device assignments and My Equipment | `05b162aa10a74994c970d0b6dbf111dc59b47513` |
| [#381](https://github.com/Caffoot/Caffoot-Lite/pull/381) | Stage 3 Batch 3.3 — Staff And Departments Interface Integration (Draft) | `7ec4ac27eddb1f798fdfcf9fff09b761c7bebd86` |
| [#380](https://github.com/Caffoot/Caffoot-Lite/pull/380) | Restore approved Optional Features design (Stage 2 correction) | `953956ef41d036ce3f94d8d8d29fcd10c1c2377e` |
| [#379](https://github.com/Caffoot/Caffoot-Lite/pull/379) | Preview Only — Do Not Merge: Stage 3 Batch 3.3 Staff and navigation | No recorded merge date — reconcile; not counted as merged |
| [#378](https://github.com/Caffoot/Caffoot-Lite/pull/378) | Stage 3 Batch 3.2 — Staff Members and Departments backend APIs | `221739ae8c1331d396977adb6e79dc910f39380d` |
| [#377](https://github.com/Caffoot/Caffoot-Lite/pull/377) | Stage 3 Batch 3.1 — Staff Members and Departments database foundation | `97368e734f3e8008a9acc929b999a198eca1cf3f` |
| [#376](https://github.com/Caffoot/Caffoot-Lite/pull/376) | Correct Stage 2 Raspberry Pi acceptance findings | `519842b46861c85fde0eebf78298117c2346599d` |
| [#375](https://github.com/Caffoot/Caffoot-Lite/pull/375) | Stage 2 Batch 5: final integration verification | `bda35d73398820f49c8c1cf0647aa1c8c92bbf2e` |
| [#374](https://github.com/Caffoot/Caffoot-Lite/pull/374) | Stage 2 Batch 4: Optional Features interface and Rack preservation | `8192bb4438a1615f3b3c640d59deff2dfdde07be` |
| [#373](https://github.com/Caffoot/Caffoot-Lite/pull/373) | Stage 2 Batch 3: optional Device addresses and explicit IPAM linking | `89ad05eab13f7a429dcbd5f4266a26e52f5de8d2` |
| [#372](https://github.com/Caffoot/Caffoot-Lite/pull/372) | Stage 2 Batch 2: enforce feature access and protect inventory projections | `339ed5f1d7f7415e126553ad06a89411d34cc0f9` |
| [#371](https://github.com/Caffoot/Caffoot-Lite/pull/371) | Stage 2 Batch 1 — Optional Features foundation (schema 13 and settings API) | `1541916e1720da51a1757c6831daae37d775bd24` |
| [#362](https://github.com/Caffoot/Caffoot-Lite/pull/362) | Fix Ubuntu mirror failures in browser checks (#361) | No recorded merge date — reconcile; not counted as merged |
| [#359](https://github.com/Caffoot/Caffoot-Lite/pull/359) | Fix Rack Inventory search-to-card spacing (#341) | `689afd827ef3192379b6baf7ef6d289d8f73da04` |

## Version-to-version source change register

Both recursive trees were returned without truncation. Comparing blob paths and SHAs identifies 1588 added, modified or removed paths across the repository (1447 added, 141 modified, 0 removed). The following 276 paths exclude docs/ and common image/font assets to focus the next source reconciliation. Renames appear as add/remove. File-level differences are not feature counts, and no content diff has been audited simply by enumerating paths. Review changed documentation/images via the separate documentation register; consider assets where they affect the interface. Compare actual content and map every relevant path to the release entries, identifying internal-only changes and any uncovered changes.

| Path | Change | Review |
| --- | --- | --- |
| [.github/ISSUE_TEMPLATE/bug_report.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/ISSUE_TEMPLATE/bug_report.yml) | Modified | Pending |
| [.github/workflows/backend-tests.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/workflows/backend-tests.yml) | Modified | Pending |
| [.github/workflows/browser-compat.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/workflows/browser-compat.yml) | Modified | Pending |
| [.github/workflows/compose-lifecycle.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/workflows/compose-lifecycle.yml) | Modified | Pending |
| [.github/workflows/git-history-secrets.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/workflows/git-history-secrets.yml) | Modified | Pending |
| [.github/workflows/optional-features-supplemental.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/workflows/optional-features-supplemental.yml) | Added | Pending |
| [.github/workflows/release-documentation.yml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.github/workflows/release-documentation.yml) | Modified | Pending |
| [.gitleaksignore](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/.gitleaksignore) | Modified | Pending |
| [AGENTS.md](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/AGENTS.md) | Modified | Pending |
| [backend/account_email.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/account_email.py) | Modified | Pending |
| [backend/account_security.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/account_security.py) | Modified | Pending |
| [backend/accounts.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/accounts.py) | Modified | Pending |
| [backend/application_integrity.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/application_integrity.py) | Modified | Pending |
| [backend/assignment_closure.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/assignment_closure.py) | Added | Pending |
| [backend/audit_events.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/audit_events.py) | Modified | Pending |
| [backend/authentication.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/authentication.py) | Modified | Pending |
| [backend/collection_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/collection_saves.py) | Modified | Pending |
| [backend/device_addresses.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_addresses.py) | Added | Pending |
| [backend/device_assignments.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_assignments.py) | Added | Pending |
| [backend/device_catalogue.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_catalogue.py) | Modified | Pending |
| [backend/device_handovers.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_handovers.py) | Added | Pending |
| [backend/device_rack_fields.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_rack_fields.py) | Added | Pending |
| [backend/device_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_saves.py) | Modified | Pending |
| [backend/device_stock.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_stock.py) | Added | Pending |
| [backend/device_storage.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_storage.py) | Added | Pending |
| [backend/email_logo.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/email_logo.py) | Added | Pending |
| [backend/email_rendering.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/email_rendering.py) | Added | Pending |
| [backend/email_template_catalogue.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/email_template_catalogue.py) | Added | Pending |
| [backend/email_templates.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/email_templates.py) | Added | Pending |
| [backend/equipment_associations.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/equipment_associations.py) | Added | Pending |
| [backend/equipment_lifecycle_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/equipment_lifecycle_schema.py) | Added | Pending |
| [backend/equipment_lifecycle.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/equipment_lifecycle.py) | Added | Pending |
| [backend/equipment_supplier_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/equipment_supplier_schema.py) | Added | Pending |
| [backend/equipment_suppliers.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/equipment_suppliers.py) | Added | Pending |
| [backend/feature_settings.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/feature_settings.py) | Added | Pending |
| [backend/handover_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/handover_schema.py) | Added | Pending |
| [backend/history_permissions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/history_permissions.py) | Modified | Pending |
| [backend/import_drafts.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/import_drafts.py) | Modified | Pending |
| [backend/import_service.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/import_service.py) | Modified | Pending |
| [backend/inventory_projection.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/inventory_projection.py) | Added | Pending |
| [backend/inventory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/inventory.py) | Modified | Pending |
| [backend/ipam_linking.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ipam_linking.py) | Added | Pending |
| [backend/ipam_reconciliation.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ipam_reconciliation.py) | Modified | Pending |
| [backend/ipam_repair.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ipam_repair.py) | Modified | Pending |
| [backend/ipam_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ipam_saves.py) | Modified | Pending |
| [backend/normalisation_addresses.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/normalisation_addresses.py) | Modified | Pending |
| [backend/permissions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/permissions.py) | Modified | Pending |
| [backend/profiles.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/profiles.py) | Modified | Pending |
| [backend/recover_admin.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/recover_admin.py) | Modified | Pending |
| [backend/request_auth.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/request_auth.py) | Modified | Pending |
| [backend/reset_inventory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/reset_inventory.py) | Modified | Pending |
| [backend/role_policy.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/role_policy.py) | Added | Pending |
| [backend/roles.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/roles.py) | Added | Pending |
| [backend/schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/schema.py) | Modified | Pending |
| [backend/server.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/server.py) | Modified | Pending |
| [backend/service_desk_access.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_access.py) | Added | Pending |
| [backend/service_desk_attachments.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_attachments.py) | Added | Pending |
| [backend/service_desk_calendar.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_calendar.py) | Added | Pending |
| [backend/service_desk_email.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_email.py) | Added | Pending |
| [backend/service_desk_reads.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_reads.py) | Added | Pending |
| [backend/service_desk_reporting.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_reporting.py) | Added | Pending |
| [backend/service_desk_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_schema.py) | Added | Pending |
| [backend/service_desk_settings.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk_settings.py) | Added | Pending |
| [backend/service_desk.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/service_desk.py) | Added | Pending |
| [backend/sessions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/sessions.py) | Modified | Pending |
| [backend/settings_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/settings_saves.py) | Modified | Pending |
| [backend/shared_device_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/shared_device_schema.py) | Added | Pending |
| [backend/shared_devices.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/shared_devices.py) | Added | Pending |
| [backend/smtp_settings.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/smtp_settings.py) | Modified | Pending |
| [backend/staff_directory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/staff_directory.py) | Added | Pending |
| [backend/staff_employment.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/staff_employment.py) | Added | Pending |
| [backend/staff_identity.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/staff_identity.py) | Added | Pending |
| [backend/stock_circulation.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/stock_circulation.py) | Added | Pending |
| [backend/stock_corrections.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/stock_corrections.py) | Added | Pending |
| [backend/stock_intake.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/stock_intake.py) | Added | Pending |
| [backend/stock_reporting.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/stock_reporting.py) | Added | Pending |
| [backend/stock_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/stock_schema.py) | Added | Pending |
| [backend/subnet_validation.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/subnet_validation.py) | Modified | Pending |
| [backend/supplier_issue_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/supplier_issue_schema.py) | Added | Pending |
| [backend/supplier_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/supplier_schema.py) | Added | Pending |
| [backend/suppliers.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/suppliers.py) | Added | Pending |
| [backend/ticket_software.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ticket_software.py) | Added | Pending |
| [CONTRIBUTING.md](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/CONTRIBUTING.md) | Modified | Pending |
| [Dockerfile](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/Dockerfile) | Modified | Pending |
| [INSTALLATION.md](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/INSTALLATION.md) | Modified | Pending |
| [interface/application.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js) | Modified | Pending |
| [interface/email-templates.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/email-templates.js) | Added | Pending |
| [interface/equipment.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/equipment.js) | Added | Pending |
| [interface/installed-software-catalogue.json](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/installed-software-catalogue.json) | Added | Pending |
| [interface/lifecycle.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/lifecycle.js) | Added | Pending |
| [interface/loader.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/loader.js) | Modified | Pending |
| [interface/screens/audit-trail.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/audit-trail.html) | Modified | Pending |
| [interface/screens/dashboard.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/dashboard.html) | Modified | Pending |
| [interface/screens/device-details.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/device-details.html) | Modified | Pending |
| [interface/screens/device-inventory.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/device-inventory.html) | Modified | Pending |
| [interface/screens/device-management.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/device-management.html) | Modified | Pending |
| [interface/screens/devices.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/devices.html) | Modified | Pending |
| [interface/screens/migration.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/migration.html) | Modified | Pending |
| [interface/screens/my-account.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/my-account.html) | Modified | Pending |
| [interface/screens/navigation.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/navigation.html) | Modified | Pending |
| [interface/screens/service-desk.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/service-desk.html) | Added | Pending |
| [interface/screens/settings.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/settings.html) | Modified | Pending |
| [interface/screens/shared.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/shared.html) | Modified | Pending |
| [interface/screens/users.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/users.html) | Modified | Pending |
| [interface/service-desk.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/service-desk.js) | Added | Pending |
| [interface/sign-in.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/sign-in.js) | Modified | Pending |
| [interface/staff-directory.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/staff-directory.js) | Added | Pending |
| [interface/stock-intake.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/stock-intake.js) | Added | Pending |
| [interface/styles/audit-trail.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/audit-trail.css) | Modified | Pending |
| [interface/styles/components.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/components.css) | Modified | Pending |
| [interface/styles/dashboard-lifecycle.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/dashboard-lifecycle.css) | Added | Pending |
| [interface/styles/device-details-lifecycle.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/device-details-lifecycle.css) | Added | Pending |
| [interface/styles/device-management-lifecycle.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/device-management-lifecycle.css) | Added | Pending |
| [interface/styles/equipment.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/equipment.css) | Added | Pending |
| [interface/styles/service-desk.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/service-desk.css) | Added | Pending |
| [interface/styles/settings-email-templates.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/settings-email-templates.css) | Added | Pending |
| [interface/styles/settings-lifecycle.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/settings-lifecycle.css) | Added | Pending |
| [interface/styles/shared.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/shared.css) | Modified | Pending |
| [interface/styles/sign-in-controls.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/sign-in-controls.css) | Modified | Pending |
| [interface/styles/staff.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/staff.css) | Added | Pending |
| [interface/styles/stock.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/stock.css) | Added | Pending |
| [interface/styles/suppliers.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/suppliers.css) | Added | Pending |
| [interface/styles/themes.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/themes.css) | Modified | Pending |
| [interface/styles/uk-date-controls.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/uk-date-controls.css) | Added | Pending |
| [interface/styles/users.css](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/styles/users.css) | Modified | Pending |
| [interface/suppliers.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/suppliers.js) | Added | Pending |
| [interface/uk-date-controls.js](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/uk-date-controls.js) | Added | Pending |
| [inventory.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/inventory.html) | Modified | Pending |
| [portainer-v2.1.yaml](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/portainer-v2.1.yaml) | Modified | Pending |
| [README.md](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/README.md) | Modified | Pending |
| [ROADMAP.md](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/ROADMAP.md) | Modified | Pending |
| [scripts/build_private_acceptance.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/scripts/build_private_acceptance.py) | Modified | Pending |
| [setup.html](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/setup.html) | Modified | Pending |
| [tests/account-rack-permissions.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/account-rack-permissions.cjs) | Added | Pending |
| [tests/approved-owner-batch.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/approved-owner-batch.cjs) | Modified | Pending |
| [tests/approved-visual.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/approved-visual.cjs) | Modified | Pending |
| [tests/associated-equipment-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/associated-equipment-interface.cjs) | Added | Pending |
| [tests/browser-compat.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/browser-compat.cjs) | Modified | Pending |
| [tests/builtin-roles-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/builtin-roles-interface.cjs) | Added | Pending |
| [tests/confirmed_permissions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/confirmed_permissions.py) | Added | Pending |
| [tests/department-details-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/department-details-interface.cjs) | Added | Pending |
| [tests/device-assignments-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-assignments-interface.cjs) | Added | Pending |
| [tests/device-editor-approved.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-editor-approved.cjs) | Modified | Pending |
| [tests/device-editor-fidelity.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-editor-fidelity.cjs) | Modified | Pending |
| [tests/device-form-followups.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-form-followups.cjs) | Modified | Pending |
| [tests/device-handover-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-handover-interface.cjs) | Added | Pending |
| [tests/device-stock-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-stock-interface.cjs) | Added | Pending |
| [tests/device-storage-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/device-storage-interface.cjs) | Added | Pending |
| [tests/email-templates-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/email-templates-interface.cjs) | Added | Pending |
| [tests/enabled_inventory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/enabled_inventory.py) | Added | Pending |
| [tests/equipment-lifecycle-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/equipment-lifecycle-interface.cjs) | Added | Pending |
| [tests/equipment-suppliers-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/equipment-suppliers-interface.cjs) | Added | Pending |
| [tests/feature-access.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/feature-access.cjs) | Added | Pending |
| [tests/fixtures/recovery_browser.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/fixtures/recovery_browser.py) | Added | Pending |
| [tests/fixtures/schema-v10.sql](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/fixtures/schema-v10.sql) | Added | Pending |
| [tests/fixtures/service_desk_reporting.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/fixtures/service_desk_reporting.py) | Added | Pending |
| [tests/fixtures/stage_6_3_recovery.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/fixtures/stage_6_3_recovery.py) | Added | Pending |
| [tests/fixtures/upgrade_restore.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/fixtures/upgrade_restore.py) | Added | Pending |
| [tests/it-assets-foundation-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/it-assets-foundation-interface.cjs) | Added | Pending |
| [tests/native-acceptance-corrections.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/native-acceptance-corrections.cjs) | Added | Pending |
| [tests/optional-features-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/optional-features-interface.cjs) | Added | Pending |
| [tests/optional-ip.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/optional-ip.cjs) | Added | Pending |
| [tests/owner-acceptance-batch-01.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/owner-acceptance-batch-01.cjs) | Modified | Pending |
| [tests/owner-batch-02-actions.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/owner-batch-02-actions.cjs) | Modified | Pending |
| [tests/pi-acceptance-corrections.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/pi-acceptance-corrections.cjs) | Added | Pending |
| [tests/rack-location-defaults.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/rack-location-defaults.cjs) | Modified | Pending |
| [tests/recovery-confirmation.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/recovery-confirmation.cjs) | Added | Pending |
| [tests/service-desk-reporting-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/service-desk-reporting-interface.cjs) | Added | Pending |
| [tests/session-expiry-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/session-expiry-interface.cjs) | Added | Pending |
| [tests/shared-devices-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/shared-devices-interface.cjs) | Added | Pending |
| [tests/staff-account-workflow.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/staff-account-workflow.cjs) | Added | Pending |
| [tests/staff-directory-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/staff-directory-interface.cjs) | Added | Pending |
| [tests/stage-6-2-import-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stage-6-2-import-interface.cjs) | Added | Pending |
| [tests/stage-6-6-account-security-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stage-6-6-account-security-interface.cjs) | Added | Pending |
| [tests/stage-6-6-sign-in-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stage-6-6-sign-in-interface.cjs) | Added | Pending |
| [tests/stock-circulation-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stock-circulation-interface.cjs) | Added | Pending |
| [tests/stock-correction-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stock-correction-interface.cjs) | Added | Pending |
| [tests/stock-dashboard-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stock-dashboard-interface.cjs) | Added | Pending |
| [tests/stock-intake-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stock-intake-interface.cjs) | Added | Pending |
| [tests/stock-issue-confirmation.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/stock-issue-confirmation.cjs) | Added | Pending |
| [tests/subnet-first-ipam.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/subnet-first-ipam.cjs) | Modified | Pending |
| [tests/subnet-private-corrections.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/subnet-private-corrections.cjs) | Modified | Pending |
| [tests/suppliers-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/suppliers-interface.cjs) | Added | Pending |
| [tests/test_account_security.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_account_security.py) | Modified | Pending |
| [tests/test_administrator_roles.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_administrator_roles.py) | Modified | Pending |
| [tests/test_assignment_closure.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_assignment_closure.py) | Added | Pending |
| [tests/test_assisted_password_reset_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_assisted_password_reset_http.py) | Added | Pending |
| [tests/test_associated_equipment_resolution.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_associated_equipment_resolution.py) | Added | Pending |
| [tests/test_associated_equipment_writes_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_associated_equipment_writes_http.py) | Added | Pending |
| [tests/test_associated_equipment_writes.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_associated_equipment_writes.py) | Added | Pending |
| [tests/test_associated_ticket_custody.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_associated_ticket_custody.py) | Added | Pending |
| [tests/test_authentication.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_authentication.py) | Modified | Pending |
| [tests/test_builtin_roles.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_builtin_roles.py) | Added | Pending |
| [tests/test_collection_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_collection_saves.py) | Modified | Pending |
| [tests/test_compose_lifecycle.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_compose_lifecycle.py) | Modified | Pending |
| [tests/test_department_details_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_department_details_http.py) | Added | Pending |
| [tests/test_device_assignments_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_assignments_http.py) | Added | Pending |
| [tests/test_device_assignments.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_assignments.py) | Added | Pending |
| [tests/test_device_catalogue.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_catalogue.py) | Modified | Pending |
| [tests/test_device_handover_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_handover_schema.py) | Added | Pending |
| [tests/test_device_handovers_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_handovers_http.py) | Added | Pending |
| [tests/test_device_handovers.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_handovers.py) | Added | Pending |
| [tests/test_device_reissue.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_reissue.py) | Added | Pending |
| [tests/test_device_stock.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_stock.py) | Added | Pending |
| [tests/test_device_storage.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_device_storage.py) | Added | Pending |
| [tests/test_email_templates_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_email_templates_http.py) | Added | Pending |
| [tests/test_equipment_associations_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_equipment_associations_http.py) | Added | Pending |
| [tests/test_equipment_associations.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_equipment_associations.py) | Added | Pending |
| [tests/test_equipment_lifecycle.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_equipment_lifecycle.py) | Added | Pending |
| [tests/test_feature_access.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_feature_access.py) | Added | Pending |
| [tests/test_feature_settings_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_feature_settings_http.py) | Added | Pending |
| [tests/test_feature_settings.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_feature_settings.py) | Added | Pending |
| [tests/test_history_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_history_http.py) | Modified | Pending |
| [tests/test_history_permissions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_history_permissions.py) | Modified | Pending |
| [tests/test_https_smoke.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_https_smoke.py) | Modified | Pending |
| [tests/test_import_boundary.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_import_boundary.py) | Modified | Pending |
| [tests/test_import_drafts.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_import_drafts.py) | Modified | Pending |
| [tests/test_import_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_import_http.py) | Modified | Pending |
| [tests/test_inventory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_inventory.py) | Modified | Pending |
| [tests/test_ipam_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_ipam_saves.py) | Modified | Pending |
| [tests/test_it_asset_feature.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_it_asset_feature.py) | Added | Pending |
| [tests/test_it_asset_stock_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_it_asset_stock_schema.py) | Added | Pending |
| [tests/test_login_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_login_http.py) | Modified | Pending |
| [tests/test_mfa_concurrency.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_mfa_concurrency.py) | Added | Pending |
| [tests/test_modular_interface.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_modular_interface.py) | Modified | Pending |
| [tests/test_optional_device_addresses.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_optional_device_addresses.py) | Added | Pending |
| [tests/test_optional_features_persistence.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_optional_features_persistence.py) | Added | Pending |
| [tests/test_optional_features_visual_boundary.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_optional_features_visual_boundary.py) | Added | Pending |
| [tests/test_optional_ip_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_optional_ip_http.py) | Added | Pending |
| [tests/test_password_change_concurrency_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_password_change_concurrency_http.py) | Added | Pending |
| [tests/test_permissions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_permissions.py) | Modified | Pending |
| [tests/test_protected_import_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_protected_import_http.py) | Added | Pending |
| [tests/test_rack_shelf_associations.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_rack_shelf_associations.py) | Modified | Pending |
| [tests/test_racks_off_preservation.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_racks_off_preservation.py) | Added | Pending |
| [tests/test_request_auth.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_request_auth.py) | Modified | Pending |
| [tests/test_required_mfa_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_required_mfa_http.py) | Added | Pending |
| [tests/test_required_mfa.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_required_mfa.py) | Added | Pending |
| [tests/test_reserved_device_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_reserved_device_saves.py) | Modified | Pending |
| [tests/test_reset_inventory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_reset_inventory.py) | Modified | Pending |
| [tests/test_role_admin_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_role_admin_http.py) | Added | Pending |
| [tests/test_role_concurrency.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_role_concurrency.py) | Added | Pending |
| [tests/test_role_migration.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_role_migration.py) | Added | Pending |
| [tests/test_role_notifications.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_role_notifications.py) | Added | Pending |
| [tests/test_role_policy.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_role_policy.py) | Added | Pending |
| [tests/test_roles.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_roles.py) | Added | Pending |
| [tests/test_service_desk_attachments.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_service_desk_attachments.py) | Added | Pending |
| [tests/test_service_desk_calendar.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_service_desk_calendar.py) | Added | Pending |
| [tests/test_service_desk_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_service_desk_http.py) | Added | Pending |
| [tests/test_service_desk_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_service_desk_schema.py) | Added | Pending |
| [tests/test_session_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_session_http.py) | Modified | Pending |
| [tests/test_session_invalidation.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_session_invalidation.py) | Modified | Pending |
| [tests/test_sessions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_sessions.py) | Modified | Pending |
| [tests/test_settings_saves.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_settings_saves.py) | Modified | Pending |
| [tests/test_shared_device_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_shared_device_schema.py) | Added | Pending |
| [tests/test_shared_devices.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_shared_devices.py) | Added | Pending |
| [tests/test_smtp_settings_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_smtp_settings_http.py) | Modified | Pending |
| [tests/test_staff_directory_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_staff_directory_http.py) | Added | Pending |
| [tests/test_staff_directory_migration.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_staff_directory_migration.py) | Added | Pending |
| [tests/test_staff_directory.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_staff_directory.py) | Added | Pending |
| [tests/test_staff_section_permissions.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_staff_section_permissions.py) | Added | Pending |
| [tests/test_stage_6_3_recovery.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_stage_6_3_recovery.py) | Added | Pending |
| [tests/test_stage_6_4_recovery.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_stage_6_4_recovery.py) | Added | Pending |
| [tests/test_stock_circulation.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_stock_circulation.py) | Added | Pending |
| [tests/test_stock_corrections.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_stock_corrections.py) | Added | Pending |
| [tests/test_stock_intake.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_stock_intake.py) | Added | Pending |
| [tests/test_stock_reporting.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_stock_reporting.py) | Added | Pending |
| [tests/test_subnet_first.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_subnet_first.py) | Modified | Pending |
| [tests/test_supplier_schema.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_supplier_schema.py) | Added | Pending |
| [tests/test_suppliers_http.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_suppliers_http.py) | Added | Pending |
| [tests/test_unassigned_device_returns.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_unassigned_device_returns.py) | Added | Pending |
| [tests/test_upgrade_restore.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_upgrade_restore.py) | Added | Pending |
| [tests/test_user_profile_administration.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/test_user_profile_administration.py) | Modified | Pending |
| [tests/uk-date-controls.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/uk-date-controls.cjs) | Added | Pending |
| [tests/unassigned-device-return-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/unassigned-device-return-interface.cjs) | Added | Pending |
| [tests/users-roles-interface.cjs](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/users-roles-interface.cjs) | Added | Pending |
| [tests/visual_fixtures.py](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/tests/visual_fixtures.py) | Modified | Pending |

## Outstanding release gates

No native/manual acceptance resumed; Test 70 next on owner authorisation. Supported upgrade and complete-volume backup/restore final acceptance, further correction reconciliation, independent #443 audit, documentation/screenshot approval, main merge, published image verification and separate release/website authorisations remain outstanding. Staff deletion #471 is future Milestone 10 scope, not a v2.2 feature. No changes to production, main, website or existing published instructions.
