# Visual Review — Preview Only, Do Not Merge

The corrected [interactive preview](preview.html) restores the approved Staff
form and directory actions. Browse the [52 refreshed views](gallery.html) and the
[side-by-side source comparison](comparisons.html), with 22 additional captures.
All records are fictional. This remains an isolated visual preview; application
integration is paused pending product-owner review.

## Corrections To Inspect

- Personal Details occupies the left column. The separate Caffoot Login card is
  on the right, with account fields, Default Role and MFA guidance inside it.
  Equipment And Ticket Access is a separate guidance card beneath it, with no
  operational equipment or ticket controls. Create Caffoot Login starts off.
- The approved field order is restored: names, full-width Email, Department/Job
  Title, Telephone/Location and full-width Staff Status. Staff Add/Edit and
  Department forms use consistent labels and 42 px inputs/selects. Required login
  indicators and the username/password hints stay with their fields.
- Add Staff Member and Add Department remain orange header actions. Staff Details
  now has its primary Edit Staff Member action at the top right. Headers wrap
  below the title on narrow screens. Form actions retain Cancel then orange Save
  at the bottom right.
- Directory rows have separate orange View Details and authorised neutral Edit.
  Read-only users get View Details alone. There is no directory-row Create Login.
  Staff records and combined forms retain Create Login/Manage Login in Permissions;
  ordinary Staff editors see no linked-account controls or details.

## Actual Visual Comparison

Both original files were rendered unmodified from
`docs/milestone-01-stage-2-3-previews` at
`159424b56bb770ea6ab260764c4e9357d9c8667c`:
`caffoot-staff-member-login-preview.html` and
`caffoot-staff-directory-assignments-preview.html`. The pinned
`users-permissions-draft-02.html` was rendered from
`c26db4a56bbc30f95b56201e81a7a76d13c6037b`. They used the same existing Chromium,
font availability and viewport sizes as the corrected preview. Staff comparison
captures isolate the actual rendered form grid/directory; pinned Users captures
show the whole page. None reconstructs the approved HTML.

The [comparison page](comparisons.html) places the actual approved sources on the
left and the correction on the right. Visual inspection covered login off/on
against **both** Staff references, dark styling, mobile card order, separate row
actions and the pinned Users header/form conventions. The left/right card widths,
aligned tops, separate guidance stack, field sequence, default-role/MFA placement
and distinct View Details/Edit actions now follow the approved composition. The
mobile form reads Personal Details, Login, guidance, then Save/Cancel, without
heading/action overlap. Department Add/Edit screenshots show aligned input/select
controls in both themes and viewport sizes.

The comparison also makes these retained differences visible:

- Current v2.1 colours, typography, logo, controls and the accepted grouped navigation
  remain, including the 65 px mobile rail. The captured form width is 293 px
  versus 299 px in the archive at the same phone viewport. The twelve pinned
  files and current runtime sources are unchanged.
- Inputs/selects are consistently 42 px; the archived Staff controls have a 39 px
  minimum. The pinned Users form uses its existing natural control sizing. The
  shared palette, border treatment and orange action convention remain; pixel-for-
  pixel identity across these different forms is not claimed.
- The Add/Edit title is in the current page header, with the sample notice above
  it, rather than repeating the archive's Staff Members heading above an editor
  heading. The source form's Clear Form is replaced by the retained Save/Cancel
  convention explicitly required in this correction.
- Optional-field/archive guidance, blank migrated details and the explicit
  non-operational equipment note add some height. Fictional directory columns and
  statuses remain as previously previewed; archived equipment columns/actions are
  excluded. The floating review controls belong only to the harness.

These are observations from rendered views, not a declaration of visual acceptance.
Matching source hashes, CSS and automated checks do not prove visual fidelity.
The product owner must review the corrected preview before any integration.

## Focused Verification And Limits

**179 preview assertions passed**: the existing 48 interaction checks and 131
correction checks. The correction check is reproducible with
[check-visual-corrections.cjs](check-visual-corrections.cjs); see the
[run instructions](README.md#focused-visual-correction-check). It checks 1440,
1024, 768 and 390 px in both themes, card order, consistent control heights/labels,
header fit, form footer placement, separate permitted row actions, login actions
and restricted Staff access. The original interaction checks also cover archived
membership/deletion, name/Department search, migrated blanks, profile independence,
role inheritance/overrides, protected roles/admins, MFA presentation, keyboard
focus, Escape, password confirmation and account filters.

No page errors, API calls, external resource requests or checked document overflow
were observed. The 52-view gallery was refreshed at 1440×1000 and 390×844 in both
themes. Additional comparison captures use the same viewports. Exact dimensions,
checks and hashes are in [inspection-results.json](inspection-results.json).

A geometry check initially compared viewport coordinates while focus was scrolling;
it now compares document coordinates. The original login preview opens its editor
directly, so reference capture respects that state instead of trying its hidden Add
button. These were inspection-script failures, corrected before the reported pass.
Managed Chromium blocks file URLs; inspection used the same standalone HTML over
local static HTTP without changing browser policy. No new browser, Azure or Docker
setup was used. Application suites were not rerun for these preview-only changes.
This is neither deployed-application security testing nor owner visual acceptance.

## Integration Remains Unauthorised

The existing [integration gates](README.md#integration-gates--documentation-only)
remain: section-appropriate entry, minimal Department-label/eligible-choice access,
server-owned deletion eligibility and real Permissions/session/MFA wiring. No
production backend, schema, API, styles, templates, JavaScript or tests changed.
Stop for product-owner visual review. Do not merge, integrate or deploy.
