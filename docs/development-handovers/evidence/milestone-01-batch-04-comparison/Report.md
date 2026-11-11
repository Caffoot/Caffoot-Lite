# Users And Permissions — Before Implementation

Comparison made on 11 November 2026 at clean application source `632fb5aebc7feb1415d0cfb6eb1c8e40258806b1`, following the [corrected Batch 04 specification](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790324888). This is a comparison checkpoint, not an implemented or accepted interface.

## Verified References

The owner supplied both HTML attachments. Their bytes match [the recorded identities](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6793571535):

| Reference | Bytes | SHA-256 |
| --- | ---: | --- |
| `caffoot_stage1_users_permissions_mockup.html` | 57,148 | `4cd3c375cccd19509afa5b2e24a35f79101a15fecdd4a3053628a70c6e6a1002` |
| `caffoot_stage1_v21_users_roles_revised_review.html` | 63,232 | `397a7b1a37acd4e652f7faeaf322fc0acf35682a3f692bf629bc6b3f83b5f2c2` |

The implementation base remains `interface/screens/users.html`, `interface/styles/users.css`, the existing Users handlers in `interface/application.js`, and their pinned `future-design/approved/users-permissions-draft-02.html` at `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. The attachments are demonstrations of additions. Neither is a replacement layout or a source of production permission decisions. Original attachments and pinned assets have not been modified or copied into runtime files.

## Comparison And Additive Mapping

| Area | Observed Difference In The Demonstrations | Implementation Constraint |
| --- | --- | --- |
| Shell and navigation | Both demonstrations have their own shell, review badge, context text, footer and simplified icons. Their mobile header/account button differs from the live interface. | Keep the live sidebar, header, account button, navigation, spacing, typography and responsive rules. Do not copy demonstration shell CSS. |
| Existing tabs | The original places Manage Roles before Add User; the revised places it fourth. The live and pinned interface have Overview, User List and Add User. | Preserve the original three tabs and their order. Add Manage Roles fourth using the same existing navigation pattern. |
| Overview | The original demonstration replaces Active Users and MFA Enrolled with MFA Required and Setup Pending. The revised demonstration restores the four existing categories. Both show additional role/MFA chart content. | Keep the four KPI cards, two chart cards and Access, Made Simple guide. Use real counts and accurate role/MFA explanations within those components. Do not replace cards or rebuild the grid. |
| User List | Both show multiple roles and required/optional/pending MFA in the same broad five-column structure. Their mobile row actions, badges and filters have different spacing and placement. | Keep the current five columns, search/status/MFA filters, row structure and existing mobile Manage button placement. Extend content within the corresponding cells. Wrap new badges locally without changing the list layout. |
| Add User | Both include password confirmation. Demonstration IDs, hints, field sizes and button details differ. | Insert Confirm Initial Password into the current form, retaining optional personal details and existing submit/reset controls. Staff Member comes from the backend. |
| Manage User | The original replaces editable personal details with a reduced read-only display and omits the full lifecycle controls. The revised restores editable fields and lifecycle controls, but wraps and rearranges them in bordered panels, uses a wider modal, and places actions in a separate footer. | Keep the current modal dimensions, header/body/actions, profile form, Save Personal Details, account activation, independent Administrator and Delete User controls. Insert role membership and review controls; retain own-account and last-administrator safeguards. Do not copy either demonstration dialog. |
| Section permissions | Both demonstrations use a table for inheritance, overrides and effective rights, unlike the existing three responsive permission cards. | Extend the existing per-section cards with server-provided inherited/effective values and Inherit/No Access/Read/Edit selection. The agreed controls can fit without replacing the card grid with a table. |
| Manage Roles and impact confirmation | Both demonstrate a role list/editor and a separate confirmation, with fictional roles, local mutation, simulated stale state and SMTP toggle. | Add the agreed area and dialogs using existing cards, form fields and confirmation conventions. Use the Batch 03 catalogue, preview and confirmation APIs; show actual stale and queue responses. No demo handlers or fixtures enter runtime code. |
| Legacy rights | The original fictional legacy user uses explicit denial for missing grants. The revised demonstration uses Inherit. | Follow the approved backend migration and policy. Missing legacy grants mean Inherit; deliberate No Access remains a separate override. |

No mandatory change to an existing approved layout has been identified for this additive approach. The additional content will naturally increase row or dialog content height where necessary; existing scroll and responsive structures remain the base. If implementation reveals a need to widen, replace, reorder or otherwise restructure an existing component beyond these agreed additions, stop for explicit owner approval before making that change. This finding is not owner acceptance of a future implementation.

The attachments do not demonstrate the full existing-account sign-in or My Account flows. Their implementation must extend the existing approved setup/security forms and requires its own functional and visual verification; this comparison does not claim those flows have been tested.

## Browser Evidence

Chromium `/usr/bin/chromium` with Playwright captured both references at 1440 × 950 and 390 × 844: Overview, User List, Add User, Manage Roles, Manage User and role-change preview. All 24 prototype captures completed with no JavaScript page errors or document overflow in those views. External network requests were blocked for the prototypes; a local intercepted HTTP response served their exact HTML bytes because Chromium policy rejected `file://` navigation. The references were not changed to make them render.

The existing `tests/approved-visual.cjs` runner captured the live HTTPS/SQLite Users overview, list, add form and own-account modal alongside the exact pinned source at both widths. The baseline fixture contains a single real test administrator; pinned and prototype screens contain their own different fictional examples. Counts, usernames, content height and chart lengths are therefore not a pixel-equivalence test. The browser rendered the current development branch, including its intentionally pending UI integration; old permission controls were not used to grant access.

An additional isolated fixture created a second account through `backend.permissions.create_user`, then captured its editable Manage User form and the scrolled lifecycle controls alongside a pinned non-owner account. No production data or account was used. These are render/source comparisons, not a full accessibility audit or regression suite. Required integration, keyboard/focus, accessibility, backend and cross-browser checks remain part of Batch 04.

### Comparison Screenshots

Each group includes desktop and mobile captures. `approved` means the pinned source, not approval of the new implementation. Full measurements are in [visual-measurements.json](visual-measurements.json), [prototype-measurements.json](prototype-measurements.json) and [editable/visual-measurements.json](editable/visual-measurements.json).

| View | Live v2.1 Structure | Pinned Source | Original Demonstration | Revised Demonstration |
| --- | --- | --- | --- | --- |
| Overview, desktop | [Live](users-1440-live.png) | [Pinned](users-1440-approved.png) | [Original](prototype-original-overview-1440.png) | [Revised](prototype-revised-overview-1440.png) |
| Overview, mobile | [Live](users-390-live.png) | [Pinned](users-390-approved.png) | [Original](prototype-original-overview-390.png) | [Revised](prototype-revised-overview-390.png) |
| User List, desktop | [Live](users-list-1440-live.png) | [Pinned](users-list-1440-approved.png) | [Original](prototype-original-list-1440.png) | [Revised](prototype-revised-list-1440.png) |
| User List, mobile | [Live](users-list-390-live.png) | [Pinned](users-list-390-approved.png) | [Original](prototype-original-list-390.png) | [Revised](prototype-revised-list-390.png) |
| Add User, desktop | [Live](users-add-1440-live.png) | [Pinned](users-add-1440-approved.png) | [Original](prototype-original-add-1440.png) | [Revised](prototype-revised-add-1440.png) |
| Add User, mobile | [Live](users-add-390-live.png) | [Pinned](users-add-390-approved.png) | [Original](prototype-original-add-390.png) | [Revised](prototype-revised-add-390.png) |
| Manage User, desktop | [Live](editable/user-workspace-1440-live.png) | [Pinned](editable/user-workspace-1440-approved.png) | [Original](prototype-original-manage-1440.png) | [Revised](prototype-revised-manage-1440.png) |
| Manage User, mobile | [Live](editable/user-workspace-390-live.png) | [Pinned](editable/user-workspace-390-approved.png) | [Original](prototype-original-manage-390.png) | [Revised](prototype-revised-manage-390.png) |

Lifecycle controls: [live desktop](editable/user-workspace-1440-live-controls.png), [pinned desktop](editable/user-workspace-1440-approved-controls.png), [live mobile](editable/user-workspace-390-live-controls.png), [pinned mobile](editable/user-workspace-390-approved-controls.png). Additional role and preview screenshots use `prototype-{original|revised}-{roles|preview}-{1440|390}.png`.

## Checkpoint Boundary

Only comparison documentation and evidence are added at this checkpoint. No application, backend, schema, pinned source or Function Index declarations change. Batch 04 implementation and final owner visual review remain outstanding. No Batch 05, protected `main` change, merge, deployment or publication.
