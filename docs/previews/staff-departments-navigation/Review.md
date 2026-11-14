# Visual Review — Preview Only, Do Not Merge

Open [preview.html](preview.html) for the interactive review or browse the
[52 screenshots](gallery.html). All records, usernames and counts are fictional.
The preview is self-contained and makes no API requests. Theme and persona controls
are in the clearly labelled review panel at the lower right.

## What To Inspect

- Staff Directory, Department-name search, Details and Add/Edit forms in both themes.
  Create Login starts off; an administrator may reveal Username, Password and
  Confirm Password. The migrated blank-name record remains blank.
- Department archive/reactivation and retained membership. Archived Departments
  cannot be selected for new Staff membership. Only the never-associated Design Lab
  offers Delete Permanently, with confirmation.
- Permissions Overview, User List, Add User, Manage Roles and the original account
  management dialog. Devices, IPAM, Network Racks, Staff Members, Departments and
  IT Assets are separate controls. Inherit and explicit overrides remain distinct;
  protected roles/admins, MFA warnings and review-before-confirmation are retained.
- Expanded IT/Staff groups, collapsed groups and the existing narrow/collapsed icon
  rail. IT Assets starts hidden. The separate review feature switch does not grant
  rights and is not an application setting.
- Staff-only and Department-only sample views. They show only their permitted
  destinations. Non-administrator Staff views contain no linked-login details.

## Source Fidelity Comparison

The existing v2.1 shell and components remain the design authority. The preview
embeds the actual source CSS unchanged, uses the exact navigation brand/top bar and
Users list/dialog/profile/permission templates, and follows `application.js`'s
existing Users and role composition. Measured sidebar widths are 215 px on desktop
and 65 px on narrow screens; no alternate sidebar, typography, palette or card style
is proposed. Offline system font fallbacks match those available to the application.
The twelve original design hashes were checked during packaging.

Proposed visual additions are limited to grouped navigation and the new Staff and
Department content composed from those existing rows, forms and cards. Permissions
adds three section choices in the same controls. Six grant summaries wrap in mobile
rows; no source stylesheet is changed. The extra sample notice and floating controls
belong only to this review harness. Existing destinations shown as context are not
replacement screen designs. The archived Stage 3 HTML supplied functional direction,
not styles or assignment/stock content. See the exact
[source map and hashes](source-manifest.json) and [fidelity table](README.md#authority-and-source-fidelity).

## Verification And Limits

Chromium inspection passed 48 assertions and captured 52 views across desktop/mobile,
light/dark, collapsed navigation, restricted personas, forms and Permissions dialogs.
Checked views have no document overflow; six-section mobile grant summaries remain
readable. Keyboard checks cover modal focus containment, Escape and restored focus.
The sample password confirmation, no-storage behaviour, independent profile edits,
name/Department search and combined account filters were exercised. No page errors,
external requests or application/API calls were observed.

Two inspection selectors initially matched several elements and were made precise.
Inspection also corrected preview-only multi-word search, restored combined Users
filters and ensured extra grant summaries wrap. These corrections do not touch
runtime files. Managed Chromium blocks file URLs, so browser inspection used the
same HTML through local static HTTP; no browser policy was changed. This is neither
a deployed-application security test nor product-owner visual acceptance.

## Integration Concerns Requiring Review

The [integration notes](README.md#integration-gates--documentation-only) identify:

1. Section-appropriate entry/navigation for Staff-only and Department-only accounts,
   preserving existing inventory route guards and grants.
2. Minimal Department labels/eligible choices for Staff users without general
   Departments Read, with server validation and archived-membership rules.
3. A reviewed server-owned way to expose Department deletion eligibility; current
   read responses do not contain historical-association capability information.
4. Wiring the original Permissions UI to existing six-section server confirmation,
   session/MFA rules and independent future IT Assets feature state.

None of these technical proposals is implemented here. All production backend,
schema, API, styles, templates, JavaScript and tests are unchanged from the approved
baseline. Stop for product-owner visual review and explicit integration approval.
