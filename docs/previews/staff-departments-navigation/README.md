# Preview Only — Staff, Departments And Grouped Navigation

**Do not merge or integrate.** Open [preview.html](preview.html) directly in a
browser. It is one self-contained, offline HTML file: styles, templates, logo,
sample data and interactions are embedded. No application server, account,
network request or installation is required. All names and records are fictional.
Sample changes reset on reload; no passwords or records are stored in browser storage.

Managed Chromium here blocks `file://` navigation. The same self-contained file
was inspected over local static HTTP. If your browser also blocks file URLs, run
`python -m http.server 8767 --bind 127.0.0.1` in this directory and open
`http://127.0.0.1:8767/preview.html`. This starts no Caffoot application or API.

Use **Preview Only · Sample Data · Controls** at the lower right to switch light/dark
theme and Administrator, Staff Editor/Reader or Department Editor/Reader views.
The separate IT Assets review checkbox starts off and only simulates navigation
visibility. It is not a proposed feature-setting control. Close the review panel
to inspect the application layout. Existing sidebar collapse and group expansion
are interactive; narrow screens use the existing icon rail.

Start at Staff Members. Try a Department-name search, View Details, Add/Edit,
Inactive/reactivation, or the migrated **Name Not Recorded** example. Admins can
preview optional Create Login or Manage Login in Permissions; ordinary Staff
views contain no login information. The Department examples include active,
archived, historically associated and never-associated records. Only the never-used
Design Lab offers permanent deletion. Permissions retains Overview, User List,
Add User, Manage Roles, account profiles/controls, protected roles, individual
Inherit/No Access/Read/Edit choices, MFA warnings and review/confirmation dialogs.
All operations change sample memory only. No assignment, stock or ticket controls exist.

## Authority And Source Fidelity

Approved baseline: `221739ae8c1331d396977adb6e79dc910f39380d`, accepted PR #378.
Scope: [Batch 3.3 preview authorisation](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6878028705),
[#232](https://github.com/Caffoot/Caffoot-Lite/issues/232) and
[#368](https://github.com/Caffoot/Caffoot-Lite/issues/368).

| Existing v2.1 source | Reuse in this preview | Proposed difference |
| --- | --- | --- |
| `interface/screens/navigation.html` | Exact brand, icon symbols and top bar; existing sidebar/item/collapse classes | Add expandable IT and Staff groups, move the existing destinations inside them, relabel Users as Permissions |
| `interface/styles/shared.css`, `components.css`, `dialogs.css`, `users.css`, `themes.css`, `utilities.css` | Embedded byte-for-byte in runtime stylesheet order | No changes to these source styles; a separate preview stylesheet handles grouped navigation, the approved Staff composition, aligned Staff/Department controls and the review harness |
| `interface/screens/users.html` | Exact list, row, management dialog, profile, grant and account-control templates | Reuse row/form components for Staff/Departments; extend the same Permissions grant controls to six independent sections |
| `interface/screens/shared.html` | Existing Users section header and tab conventions | Permissions label and truthful sample-only explanatory text |
| `interface/application.js` | Existing Users/role rendering structure, highest-role/override presentation, protected role identities, MFA and confirmation flow conventions | Local fictional-data callbacks replace every API operation; no runtime code is loaded or modified |
| Twelve approved HTML sources at `c26db4a56bbc30f95b56201e81a7a76d13c6037b` | Original hashes checked during packaging; My Account/shared navigation and Users & Permissions are the main design references | No replacement design or framework |
| Archived Staff login/directory HTML at `159424b56bb770ea6ab260764c4e9357d9c8667c` | Approved left Personal Details/right Caffoot Login composition, separate security guidance, optional login, fields, name-or-Department search and separate View Details/Edit actions | Structural layout restored using current v2.1 colours and components; Save/Cancel retained; no assignment or stock interfaces |

The preview uses the same offline system font fallbacks as the application; it
does not download Inter or Font Awesome. Icons use the existing embedded SVGs.
The source manifest records all followed/embedded file hashes and all twelve pins.
The external sample notice and review controls are explicitly preview-only.
Legacy Dashboard/Devices/IPAM/Racks/Audit/Settings/My Account destinations remain
available for navigation context; their context panels are not replacement designs
or proposed application changes. Equipment pages are not implemented.

## Integration Gates — Documentation Only

1. **Staff-only and Department-only entry.** Current `/inventory`, session
   `can_enter_inventory` and frontend entry/action guards depend on Devices/IPAM/Racks
   access. Later integration needs reviewed, additive section-appropriate workspace
   entry and navigation/session projection. Keep the existing inventory meaning,
   URL contracts and server section checks; do not grant inventory to enter Staff.
   `/account` must retain existing personal-account access. Preview persona switches
   demonstrate the desired destinations, not a live security implementation.
2. **Department labels and selection without general directory access.** Staff APIs
   currently return `departmentId`; they do not supply Department names. Propose a
   minimal read-only projection: Staff Read may resolve labels only for Departments
   referenced by Staff records it may read; Staff Edit may obtain bounded eligible
   choices containing only ID/name/eligibility. Do not return membership lists,
   counts, history, contacts, account information or general Department management.
   Archived choices are excluded for new membership; the existing archived label
   may be retained only for the Staff record already linked to it. Existing backend
   mutation checks remain authoritative. Endpoint/projection shape and access checks
   need owner review before implementation; no Departments API is broadened here.
3. **Deletion eligibility.** Current Department read responses do not expose whether
   a Department was ever associated. This preview uses explicit fictional history
   flags. Review a bounded server-owned deletion capability/projection, or an agreed
   refusal-first workflow, before integration; never infer safety from the current
   Staff list or its counts. Current backend refusal remains required.
4. **Permissions and optional IT Assets.** Extend the existing six-section backend
   model in the original frontend controls and server preview/confirmation protocol.
   Real proofs, session counts, revocation and MFA consequences must come from that
   existing service. Configuring IT Assets rights must not enable its feature.
   The real feature switch is outside this preview. Staff/account profiles and
   statuses remain independent, and linked login identity remains admin-only.

These are integration proposals for review, not authorisation to change any API,
runtime guard, route, feature switch or screen. Visual acceptance is also separate
from backend/security acceptance.

## Rebuilding And Review Evidence

Run `python docs/previews/staff-departments-navigation/build_preview.py` from the
repository to reproduce the standalone HTML and [source manifest](source-manifest.json).
The generator reads accepted source files without writing them. The preview-only
JavaScript is not part of the runtime Function Index; no runtime declarations move.

The initial checkpoint was committed and pushed as
`616b836` before wider inspection. The corrected preview passed **179 preview checks**
and refreshed **52 screenshots**, with **22 additional reference/comparison captures** at 1440×1000 and 390×844 in light and dark themes.
See the [screenshot gallery](gallery.html), [inspection record](inspection-results.json)
and [concise review report](Review.md). The [side-by-side comparison](comparisons.html)
uses browser captures of both actual approved Staff files and the pinned Users design. The checks include optional login validation,
migrated blanks, restricted personas, archive/deletion, profile independence,
six-section role/override presentation, protected administrator/role controls,
form composition, uniform control heights, responsive ordering, header actions and
separate authorised View Details/Edit actions,
keyboard focus and account filters. No page errors, API calls, external resource
requests or checked document overflow were found. Mobile six-section grant summaries
wrap using word separators while retaining the existing source styles.

Source styles and runtime files remain unchanged; all twelve pinned hashes match.
No working-application backend, browser suite, Docker or Raspberry Pi verification
is claimed or needed for this isolated preview. The managed file-URL limitation
above remains. Product-owner visual acceptance and separate integration authorisation
are required before any application work.

### Focused Visual Correction Check

With an existing Playwright/Chromium installation and the static server above, run
`node docs/previews/staff-departments-navigation/check-visual-corrections.cjs`.
`PREVIEW_URL` and `CHROMIUM_PATH` can override the local URL/browser. An optional
first argument writes the JSON result. No dependency installation or application
server is required. This checks 131 assertions at 1440, 1024, 768 and 390 px in both
themes. The existing 48 interaction checks were also rerun. Geometry checks support
the actual [visual comparison](comparisons.html); they do not establish owner acceptance.
