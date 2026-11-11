# 07 — Function and code reference

## In simple terms

This page tells you where to look. Search for a function's exact name, then read the source and its callers before changing anything. Line numbers change, so this guide uses file paths and searchable identifiers.

For the full source-pinned list of named declarations, owning bridge methods and selected maintenance helpers with current line locations, see the [Function Index](Function-Index.md). It complements this short maintainer reference; the index contains no reference counts or example-call-site report and is not a runtime call graph.

## Entry points

| Source | Search terms | Responsibility |
| --- | --- | --- |
| [`backend/server.py`](../../backend/server.py) | `Handler.do_GET`, `Handler.do_POST`, `Handler.handle_import`, `main` | HTTPS entry point and request routing |
| [`backend/schema.py`](../../backend/schema.py) | `SCHEMA_VERSION`, `initialise_database` | SQLite definitions and migrations |
| [`backend/inventory.py`](../../backend/inventory.py) | `reconstruct_inventory`, `stage_inventory`, `inspect_export` | Source-shaped inventory, import storage, export format |
| [`interface/application.js`](../../interface/application.js) | `renderDevicesHTML`, `renderRackHubV13`, `refreshCentralInventory`, `postInventory`, `applyAllowedControls` | Inventory calculations, actions and server integration; HTML lives in `interface/screens/` |
| [`interface/sign-in.js`](../../interface/sign-in.js) and [`setup.html`](../../setup.html) | `/api/setup`, `/api/login` | Account setup and sign-in |

Presentation corrections use `renderDeviceCategoryCatalogue`, `renderCatalogueRecord` and `renderCatalogueButton` for approved catalogue fragments, and `revealActiveSectionTabs` for narrow section navigation. Existing catalogue saves and permissions remain in their original handlers.

See [Modular Interface](Modular-Interface.md) for the Issue #282 presentation modules, pinned sources and private acceptance boundaries.

The Issue #309 tab icons use `renderSectionTabIcon`. `revealSectionTab` scrolls a navigation row horizontally to show a focused or selected tab, and `revealActiveSectionTabs` retains the existing selected-tab behaviour after rendering or resizing. The shared 16px content entrance and icon styling live in `interface/styles/components.css`; Audit Trail's single totals block follows its tabs in `interface/screens/audit-trail.html`.

## Inventory writers and validators

| File | Search terms |
| --- | --- |
| [`device_saves.py`](../../backend/device_saves.py) | `save_reserved_device`, `create_device`, `delete_reserved_device` |
| [`ipam_saves.py`](../../backend/ipam_saves.py) | `change_independent_allocation`, `change_bulk_allocations` |
| [`collection_saves.py`](../../backend/collection_saves.py) | `change_inventory_record`, `change_ipam_subnet_and_vlan_records`, `delete_subnet_with_dependencies` |
| [`device_catalogue.py`](../../backend/device_catalogue.py) | `change_device_catalogue` |
| [`settings_saves.py`](../../backend/settings_saves.py) | `save_inventory_setting` |
| [`reset_inventory.py`](../../backend/reset_inventory.py) | `reset_inventory` |
| [`ipam_repair.py`](../../backend/ipam_repair.py) | `apply_ipam_repairs` |
| [`application_integrity.py`](../../backend/application_integrity.py) | `validate_detached_application_state` |
| [`rack_validation.py`](../../backend/rack_validation.py) | `find_rack_import_conflicts` |

## Accounts and editing

On `milestone-1`, `schema.py:migrate_role_permissions` and `verify_role_migration` introduce and check schema 11 within the existing upgrade transaction. `role_policy.py:assign_staff_member` is shared by first-administrator setup and ordinary account creation. `evaluate_role_policy` combines enabled role grants and individual overrides, and `AccountRolePolicy.allows` applies account, section and MFA safeguards. Authentication, sessions, recovery and the Users response use the same evaluator. See [Shared Roles And Account Permissions](Role-Permissions.md) for development boundaries and rollback requirements.

| File | Search terms |
| --- | --- |
| [`accounts.py`](../../backend/accounts.py) | `bootstrap_first_admin`, `confirm_admin_mfa` |
| [`authentication.py`](../../backend/authentication.py) | `verify_active_password`, `authenticate`, `MFAEnrolmentRequired` |
| [`mfa.py`](../../backend/mfa.py) | `new_secret`, `provisioning_uri`, `verify_code` |
| [`sessions.py`](../../backend/sessions.py) | `login_session`, `session_account`, `revoke_account_sessions` |
| [`request_auth.py`](../../backend/request_auth.py) | `authorised_mutation`, `authorised_inventory_import` |
| [`permissions.py`](../../backend/permissions.py) | `can_access`, `set_permission`, `can_replace_inventory` |
| [`account_security.py`](../../backend/account_security.py) | `change_own_password`, `begin_mfa_enrolment`, `start_required_mfa_enrolment`, `confirm_required_mfa_enrolment`, `remove_own_mfa` |
| [`account_email.py`](../../backend/account_email.py) | `issue_email_proof`, `confirm_email_proof`, `notify_security_change` |
| [`recover_admin.py`](../../backend/recover_admin.py) | `recover_sole_administrator` (local host command only) |
| [`http_security.py`](../../backend/http_security.py) | `session_cookie`, `require_same_origin` |
| [`tls.py`](../../backend/tls.py) | `ensure_certificate` |

## Migration path

Start in [`import_drafts.py`](../../backend/import_drafts.py) (`ImportDrafts.begin` and `confirm`), follow [`import_review.py`](../../backend/import_review.py) (`prepare_published_export_review`) and [`import_service.py`](../../backend/import_service.py) (`preview_published_export` and `replace_from_published_export`). Existing conditional corrections are in [`access_point_review.py`](../../backend/access_point_review.py) and [`legacy_mounting.py`](../../backend/legacy_mounting.py).

Published inventory behaviour comes from [tagged v1.3.3 source](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html), including `createInventoryBackup`, `validateBackupVersion` and `normaliseImportedBackupAndPlanLegacyMountRepairs`. For declarations and search locations in this prepared modular v2.1 application, use the [Function Index](Function-Index.md). Older source investigations remain in the [historical Git snapshot](https://github.com/Caffoot/Caffoot-Lite/tree/049262f196be494074f698a72f377153f202171b/docs/required-only), not as new specifications.

See [coding conventions](06-Coding-and-Naming-Conventions.md) and [tests](08-Testing-and-Maintenance.md).

Rack printing uses `printRackElevation` for the existing document and default separate print view. `printRackElevationInFrame` is the explicitly selected same-tab trial. `readRackDimension` and `formatRackDimension` read saved modern/legacy dimensions without inventing values; `rackPhysicalDetails` supplies defaults only for a new rack. See the Issue #306 section of [Modular Interface](Modular-Interface.md) for the trial and acceptance gate.

The approved owner follow-up uses `updateRackDragPointerLabel` and `clearRackDragPointerLabel` with the pinned preview styles. Vertical drops reuse `renderRackViewPreservingScrollPosition`; placement validation and persistence are unchanged. `initialiseAccountEmailVerification` connects the saved verification badge and guided inline form to the existing proof endpoints. On Sign In, `resetRecoveryFlow` clears secret fields and `showRecoveryFeedback` keeps neutral results visible. The recovery backend remains username-only. See [Account Recovery](Account-Recovery.md).

Email proof helpers now use `email_proof_secret`, `email_attempts_remaining`, `issue_email_proof` and `confirm_email_proof` for account-bound eight-digit challenges. Schema 10 and the approved transition are documented in [Account Recovery](Account-Recovery.md). The exact inventory trial route preserves the default print action and its security boundary.

## Device Editor Amendments

`initialiseDeviceTabs` moves existing controls into the approved form cards, with General hosting, VM visibility and the flexible Notes workspace. `isDeviceEditorHypervisorProduct` filters offered form choices; `renderDeviceEditorRetainedSoftware` explains preserved assignments without removing stored keys. `refreshDeviceEditorHostVersionChoices` retains custom versions alongside existing suggestions. `showDeviceEditorFeedback` and `bindDeviceEditorValidation` reveal editor-local errors and the first relevant field. Other screens retain their existing feedback. The [Issue #327 plan](Issue-327-Device-Forms-Plan.md) records the owner amendments and preservation rules.

## Rack Shelf Associations

`backend/shelf_associations.py::validate_device_shelf_association` checks the optional stable shelf reference without allocating device U. `backend/collection_saves.py::remove_linked_rack_shelf` checks the reviewed shelf/device revisions and existing reservations, then commits explicit reassignment/retirement, shelf deletion and history together. Existing device save permissions include the new placement field. See the [Issue #331 contract](Issue-331-Implementation.md).


The editor shelf helpers are `initialiseDeviceShelfFields`, `refreshDeviceShelfFields`, `openRackShelfCreation`/`returnFromRackShelfCreation` and `openRackShelfRemovalReview`. The existing Rack bridge exposes `reviewShelf` and `removeShelf` for the reviewed atomic operation. `getRackShelfLocation` derives the current location without copying U into device records.

## Contextual Device Software

`getDeviceSoftwareContext` uses the device/guest OS or the physical host's dedicated hosting product. `getDeviceSoftwareSuggestions` intersects static platform metadata, type scope and existing hide preferences. `getDeviceSoftwareCatalogueEntries` and `isDeviceSoftwareSelected` supply the separate historical retention path; `renderDeviceEditorRetainedSoftware` renders removable checked exceptions. `refreshDeviceSoftwareSuggestions` captures selections before refreshing choices. `preserveLegacyDeviceSoftwareFlags` retains original top-level storage locations using an unchanged source snapshot. The version map remains an offline suggestion list, with sources/exclusions in [Issue #331 catalogue record](Issue-331-Catalogue-Sources.md). No backend OS/software whitelist is introduced.


## Device Choice And Location Corrections

`refreshDeviceEditorContext` refreshes type/deployment/purpose-dependent fields; `getRecordedDevicePlatform` distinguishes saved historical values from new choices. `clearDeviceDraftPlatformVersion` clears a replaced product's draft version. `refreshDeviceEditorDropdowns` updates existing searchable captions without sending business-change events. `defaultDeviceLocationFromRack` applies a matching rack area only to an eligible new draft, respecting its manual-override state. These flags belong to the draft, not inventory or SQLite. The existing `safe_device_differences` helper records only the two named OS fields as bounded before/after values. See [Issue #332](Issue-332-Device-Corrections.md).

The [Issue #333 follow-up](Issue-333-Private-Acceptance.md) keeps host product/version refresh in one ordered change handler so real keyboard events cannot read the previous product. Physical Rack Mounted forms require Rack; missing/stale rack failures use the existing modal-local feedback and Rack focus. Shelf rules and backend permissions/reservations remain unchanged.

The [Issue #329 implementation](Issue-329-Subnet-First-IPAM.md) extends the existing subnet transaction with new-record purpose/optional-field validation and a 50-created-network limit. `openMultipleSubnets`, `generateSubnetBatchPreview`, `getSubnetBatchIssues` and `renderSubnetBatchPreview` provide the approved review workflow. `refreshDeviceSubnetSelectionCascade` now selects named networks before displaying a read-only VLAN. `visible_subnet_batch_reason` rebuilds bounded IPAM-only summaries without forwarding free-text history to restricted readers.


The [private #329 corrections](Issue-329-Private-Corrections.md) add `subnetNameConflicts` for historical-safe browser checks, `formatSubnetValidationMessage` for user-readable hierarchy feedback and `showSubnetFormError` for visible field-linked messages. Generation supports subnet-sized strides and validated editable CIDRs; server mutation checks enforce new/renamed name uniqueness within the existing transaction. Approved optional planning and select presentation do not change stored relationships or native control semantics.

The [planning/capacity follow-up](Issue-329-Planning-and-Capacity.md) adds `calculateSubnetCapacity` and `updateSubnetCapacityGuidance`, with no stored or automatic prefix change. Browser/server hierarchy helpers allow only strict containment of an independent network by a block. Parent filters still use explicit links. Reviewed block deletion skips independent device/allocation ownership, while all network deletion checks and explicit-child guards remain.
