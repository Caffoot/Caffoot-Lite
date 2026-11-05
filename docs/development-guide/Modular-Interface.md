# Modular Interface — Issue #282

This branch replaces the single presentation document with HTML screen modules, separate JavaScript and the twelve pinned approved stylesheets. It is development work for private acceptance, not a published release. The existing `/`, `/setup`, `/inventory` and inventory fragment entry points remain available.

## Source And Rendering

- `inventory.html` is the authenticated compatibility entry document. `setup.html` retains the approved sign-in and first-run layout.
- `interface/screens/navigation.html` contains the one sidebar and header. It is inserted once; changing sections replaces only the page content.
- `interface/screens/` contains Dashboard, Devices, Device Inventory, Details/forms, catalogues, IPAM, Racks, Users, Account, Settings, Audit Trail, migration and shared fragments.
- `interface/application.js` retains the existing inventory calculations, API bridges, edit reservations, form validation, delegated actions and permission controls. `interface/sign-in.js` handles account access.
- `interface/loader.js` loads the screen modules and styles before starting live actions. The application remains inert until session, permissions and central inventory have loaded.
- Templates contain numbered value slots and explicit includes. They are interpolated as strings without `eval`, generated functions or a framework. Existing escaping remains at the data-binding calls. Stored inventory values never become executable template source.

`interface/design-sources.json` maps all twelve immutable sources to their extracted CSS and SHA-256 digests. The CSS in those twelve files is copied directly from `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. The source-provenance test checks exact equality, not merely class names. Shared dialog mounting, functional controls, utility declarations and the existing theme preference are separate integration styles. Tailwind's element reset is excluded so it cannot change the approved HTML's native heading and element defaults.

Devices Overview, Inventory and catalogue sections select their own pinned stylesheet. Catalogue records use the approved header, KPI, toolbar and row fragments; existing management and drill-down actions still use the same handlers. The User Workspace uses the approved profile and permission grid, including disabled self-management controls. Device forms move existing controls into the source grids without replacing their listeners or API fields. Shared dialog rules target the overlay itself as well as its contents.

Dashboard Activity keeps the three existing CSV exports in the approved report card. The additional Network Reports button opens the existing detailed reports in an approved catalogue dialog. Section tab strips retain their scroll position and reveal the selected section after navigation or resizing.

The owner-approved [Correction Batch 01](Owner-Acceptance-Correction-Batch-01.md) adds explicit presentation exceptions: labelled header Close actions, consistent 42px ordinary form controls derived from the original Device/IPAM/Users controls, unboxed searchable options derived from the original device menu, an orange empty-inventory shortcut, and paired maintenance rows. The twelve extracted source stylesheets remain immutable. Existing selection, keyboard, discard confirmation and permission handlers remain authoritative; User Workspace closure restores focus to Manage.

The approved source designs remain in Git history. `future-design` is not restored. The original integration specification is unchanged.

## Access And Persistence

The new presentation resources use an explicit packaged-file allow-list. Application scripts, templates and styles require the same authenticated inventory access as `/inventory`; unknown paths and traversal attempts are not served. Only the three sign-in resources are public. API permissions remain authoritative, including section-specific field editing, MFA, concurrent device reservations and server validation.

Inventory and account data remain in the existing SQLite database. Schema migration 9 adds only a hashed, expiring email-proof table. Existing account IDs, passwords, MFA, permissions and inventory records are retained. Personal photographs remain private account data in SQLite. SMTP configuration keeps its existing private file beside the database, with protected secret readback.

## Account Security

Optional email verification requires an authenticated session, CSRF proof and the current password. Email proofs are bound to the account, current address and purpose, expire after fifteen minutes, and are consumed atomically. Password recovery is offered only for a verified address with configured delivery. Its public request response does not disclose whether an account exists or is eligible. Recovery never creates a session or removes MFA: accounts requiring an authenticator must supply it when confirming recovery. Password recovery revokes sessions. Email changes invalidate verification and outstanding proofs.

Email operations have a separate bounded request limit; the existing five-failures/fifteen-minute peer-and-username login limiter is unchanged. Significant blocked sign-ins produce protected, deduplicated audit events. Essential account/security notices go only to verified affected addresses and active verified administrators. Notices are coalesced for one minute per recipient and delivered through a bounded, best-effort queue. Mail failures do not undo account operations or prevent ordinary use. Delivery is not guaranteed across process termination, and no real external mail-provider result is claimed by the automated tests.

See [Account Recovery](Account-Recovery.md) for the strictly local emergency procedure. There is no HTTP endpoint for host recovery.

## Checks And Private Acceptance

Run the existing Python and Chromium suites and `tests/test_modular_interface.py`. The new tests cover presentation-resource access, exact CSS provenance, template dependencies, email proof expiry/replay/account binding, MFA-preserving recovery, notifications' recipient selection and host recovery.

`tests/approved-visual.cjs` serves the original pinned HTML over loopback HTTP and captures it alongside the live application using isolated demonstration data at 1440px and 390px. It also captures major tabs, catalogues and device-editor tabs. It does not read an existing installation's data. Different demonstration values are expected; screenshots and geometry alone do not establish pixel equality or owner acceptance. Set `CAFFOOT_VISUAL_OUTPUT` to choose a private output directory.

Build only from the clean implementation commit:

```sh
python scripts/build_private_acceptance.py --save /path/to/private-acceptance.tar
```

The script builds a local image from `git archive`, labels it with the exact commit and verifies that label. When a build proxy requires a private CA, add `--build-ca /path/to/trusted-ca-bundle.pem`. Docker mounts this optional bundle only while installing packages; it is not stored in the image. For the opt-in Compose lifecycle test, set `CAFFOOT_BUILD_CA` to the same bundle path. It has no image push, merge or release action. It must not be used as evidence of a successful build when dependency access fails. See the [Issue #282 handover](../development-handovers/v2.1-issue-282.md) for current results and limitations.


Batch 02 presentation corrections use `styles/themes.css` for the existing slate dark palette across page and external modal mounts; high-specificity shared controls consume theme tokens with unchanged light fallbacks. `sign-in-controls.css` applies that palette to the public authentication flow without changing protected asset access. The existing preference is also applied by `applySignInTheme` in `sign-in.js`. See the development handover for checkpoint status and remaining verification.
