# Batch 7B — Original Requirement And State Mapping

**27 November 2026. All 16 original groups and 79 specifications retained.** 25 proposed new desktop light images (accounts 18, Staff 7), plus exactly three approved existing reuse references. Independent ChatGPT review and separate product-owner visual acceptance recorded in the [27 November decision](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7212506766); original provenance and targeted pre-publication refresh limitations remain.

The [owner-approved scope and written substitutions](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7211852349) control illustration counts. These are instructional mappings, not runtime test results. Original contracts remain historical traceability in [Batch 3](../../../../../development-guide/Milestone-01-Batch-3-Review.md#exact-outstanding-desktop-screenshot-requirements) and the [Batch 7 register](../../../../../development-guide/Milestone-01-Batch-7-Review.md#requirement-register). [Manifest](manifest.json) separates new and reused provenance.

## B3-R1 — Staff → Staff Members → Taylor → Manage Permissions, all four tabs

Original contract: Administrator; linked ordinary account, Roles memberships, Permissions Inherited/Override/Effective and Feature Disabled, Personal Details verification, Account Controls, Close/Done; pending MFA warning in Roles

Written procedure: [Roles-Section-Permissions-and-MFA — Review An Account](../../Roles-Section-Permissions-and-MFA.md#review-an-account).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R1-S01` — Personal Details. | Saved account Personal Details for Taylor/Tay; the linked Staff mismatch is not silently resolved. | [account-personal-details](account-personal-details.png) |
| `B3-R1-S02` — Roles saved memberships. | Approved Morgan saved Roles example only; Taylor’s membership review remains written. | [RE06](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-roles-1440-light.png) |
| `B3-R1-S03` — Permissions effective/disabled feature. | Approved Morgan inherited/effective No Access and Suppliers-disabled example only. | [RE04](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-permissions-1440-light.png) |
| `B3-R1-S04` — Account Controls. | Approved Morgan initial active account controls only; Close/Done remain written. | [RE02](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-1440-light.png) |
| `B3-R1-S05` — Pending MFA warning in Roles. | Owner-approved written pending-MFA warning and required-enrolment procedure; no QR or setup-secret illustration. | Written instructions |

## B3-R2 — Staff → Permissions → Manage Roles → + Create Role / Manage

Original contract: Administrator; Equipment Auditors, IT Assets Read, Enabled, protected built-ins, Review Changes/Cancel/Delete Role; blank/duplicate name rejection

Written procedure: [Roles-Section-Permissions-and-MFA — Create And Maintain Roles](../../Roles-Section-Permissions-and-MFA.md#create-and-maintain-roles).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R2-S01` — Create role. | Unsaved Equipment Auditors, IT Assets Read draft; creation/result checks remain written. | [role-configuration](role-configuration.png) |
| `B3-R2-S02` — Manage grants and enabled state. | Representative grant and Enabled controls in Create Role; saved Manage, disable/re-enable and Delete Role procedures remain written, not depicted outcomes. | [role-configuration](role-configuration.png) |
| `B3-R2-S03` — Protected built-ins. | Protected Staff Member and IT Staff identities in the directory; exact protections are explained in the guide. | [roles-directory](roles-directory.png) |
| `B3-R2-S04` — Review/Cancel. | Representative access review, specifically Dave’s override; role-definition Review Changes, Confirm and Cancel instructions remain written. | [access-change-review](access-change-review.png) |
| `B3-R2-S05` — Blank/duplicate/delete rejection. | Written blank/duplicate role-name limits and custom-role deletion protections; no exhaustive rejection images. | Written instructions |

## B3-R3 — Review Access Change

Original contract: Administrator; Tim/Dave membership and override before/after, Affected Accounts, Sessions To End, Confirm Change/Cancel; stale/expired nothing-saved outcome

Written procedure: [Roles-Section-Permissions-and-MFA — When A Preview Changes Or Expires](../../Roles-Section-Permissions-and-MFA.md#when-a-preview-changes-or-expires).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R3-S01` — Before/after access preview. | Dave’s Racks Read override changes to Inherit/Edit in an unconfirmed preview; Tim comparison remains the written worked example. | [access-change-review](access-change-review.png) |
| `B3-R3-S02` — Affected accounts and sessions. | One affected account and two stored sessions to end are visible in this particular preview. | [access-change-review](access-change-review.png) |
| `B3-R3-S03` — Confirmed result. | Written Confirm Change and refreshed effective-access checks; the preview is not a confirmed outcome. | Written instructions |
| `B3-R3-S04` — Cancel unchanged. | Cancel is visible; routine cancellation is explained in writing, not asserted as a screenshot of persistence. | [access-change-review](access-change-review.png) |
| `B3-R3-S05` — Stale/expired preview. | Written stale/expired-preview recovery in Troubleshooting: rejected confirmation saves nothing; review refreshed impact or reload. | Written instructions |

## B3-R4 — Account Controls → Make administrator

Original contract: Administrator; Alex with unverified email and later confirmed MFA/verified email, Make admin eligibility and disabled/enabled button; own/last-admin protected state

Written procedure: [Roles-Section-Permissions-and-MFA — Make An Existing User An Administrator](../../Roles-Section-Permissions-and-MFA.md#make-an-existing-user-an-administrator).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R4-S01` — Promotion missing prerequisites. | Morgan’s unavailable promotion, unenrolled authenticator and unverified email are the approved representative initial example; Alex’s earlier unverified stage remains written. | [RE02](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-1440-light.png) |
| `B3-R4-S02` — Completed MFA/email eligibility. | Alex’s Enrolled/Verified checks and available Make admin; no promotion claimed. | [account-administrator-eligible](account-administrator-eligible.png) |
| `B3-R4-S03` — Own/last-administrator protection. | Own signed-in administrator protected controls; fixture has exactly one active administrator. Independent last-administrator server rejection remains written, not newly tested. | [account-administrator-protected](account-administrator-protected.png) |

## B3-R5 — Account Controls → Disable Login / Enable Login / Delete User

Original contract: Administrator; non-self ordinary linked active then disabled login; deletion confirmation and Cancel; retained Staff record; no secrets

Written procedure: [Roles-Section-Permissions-and-MFA — Enable, Disable Or Delete A Login](../../Roles-Section-Permissions-and-MFA.md#enable-disable-or-delete-a-login).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R5-S01` — Active login controls. | Morgan’s initial active login management only. | [RE02](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-1440-light.png) |
| `B3-R5-S02` — Disabled login controls. | Sarah’s saved Disabled login with Active employment and Enable Login; not Left Company. | [account-login-disabled](account-login-disabled.png) |
| `B3-R5-S03` — Delete confirmation. | Native confirmation written exactly as “Delete sarah.lewis?”; cancelled during capture preparation. The matching image precedes confirmation. | [account-login-disabled](account-login-disabled.png) |
| `B3-R5-S04` — Delete result retains Staff. | Written deletion outcome retains Staff identity and equipment. No login was deleted for an illustrative result. | Written instructions |
| `B3-R5-S05` — Cancel unchanged. | Routine Cancel instructions keep the login; no native-dialog screenshot or fabricated substitute. | Written instructions |

## B3-R6 — Account Controls → Reset Password; sign-in → Change Your Password

Original contract: Administrator resets Jamie; target ordinary user; two empty temporary fields/Cancel/Reset Password; target empty new/confirm fields, mandatory-change warning and success/re-sign-in; mismatch/expiry

Written procedure: [Roles-Section-Permissions-and-MFA — Reset A Staff Member’s Password](../../Roles-Section-Permissions-and-MFA.md#reset-a-staff-members-password).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R6-S01` — Administrator reset empty fields. | Genuine Jamie administrator-reset dialogue with both temporary fields empty. | [account-reset-password](account-reset-password.png) |
| `B3-R6-S02` — Required password-change form. | Jamie’s restricted mandatory-change form after the actual isolated assisted reset; all passwords empty. | [mandatory-password-change](mandatory-password-change.png) |
| `B3-R6-S03` — Saved/re-sign-in result. | Written success message and fresh sign-in with personal password; no completed personal change claimed. | Written instructions |
| `B3-R6-S04` — Cancel unchanged. | Written Cancel, Close and Escape discard temporary entries. | Written instructions |
| `B3-R6-S05` — Mismatch/expiry rejection. | Written mismatch, reuse and five-minute expiry recovery; no individual validation captures. | Written instructions |

## B3-R7 — Sign In → Verify Your Identity / Secure Your Account

Original contract: Ordinary IT Staff requiring MFA; Username/Password, code challenge, Confirm MFA Setup/Back to Sign In; neutral failure/throttling; hide QR/setup key values

Written procedure: [Roles-Section-Permissions-and-MFA — Required Enrolment At Sign-In](../../Roles-Section-Permissions-and-MFA.md#required-enrolment-at-sign-in).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R7-S01` — Sign In empty fields. | Empty sign-in form. | [sign-in](sign-in.png) |
| `B3-R7-S02` — MFA challenge. | Tim IT Staff challenge after password verification; empty code, genuine placeholder dots and cleared password. | [authenticator-challenge](authenticator-challenge.png) |
| `B3-R7-S03` — Capture-safe required enrolment. | Owner-approved written Secure Your Account, QR/setup-key privacy and Confirm MFA Setup steps. Never expose or mask a live secret to manufacture evidence. | Written instructions |
| `B3-R7-S04` — Back to Sign In. | Back to Sign In visible; routine back-navigation instructions written. | [authenticator-challenge](authenticator-challenge.png) |
| `B3-R7-S05` — Neutral failure/throttling. | Written neutral failure, time checks, expired codes and temporary throttling; no authentication acceptance investigation. | Written instructions |

## B3-R8 — My Account → Security → Multi-Factor Authentication / Remove MFA

Original contract: Baseline Staff-only voluntary account; Start MFA enrolment, Confirm MFA, eligible Current Password/Current Authenticator Code/Confirm MFA Removal; mandatory account removal unavailable

Written procedure: [Roles-Section-Permissions-and-MFA — Voluntary Enrolment And Eligible Removal](../../Roles-Section-Permissions-and-MFA.md#voluntary-enrolment-and-eligible-removal).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R8-S01` — Voluntary enrolment safe state. | Safe baseline Jamie starting screen; no secret generated; shared with R11 password-change form. | [account-security-voluntary](account-security-voluntary.png) |
| `B3-R8-S02` — Eligible removal empty fields. | Priya’s baseline-only optional MFA removal form; empty password/code and Confirm MFA Removal. | [account-mfa-removal-eligible](account-mfa-removal-eligible.png) |
| `B3-R8-S03` — Mandatory removal unavailable. | Administrator MFA Enabled with no Remove MFA action; other required-role/access cases remain written. | [account-mfa-removal-protected](account-mfa-removal-protected.png) |
| `B3-R8-S04` — Cancel/rejection. | Written rejection and eligibility recheck; unsent fields do not alter MFA; no removal transaction or rejection suite claimed. | Written instructions |

## B3-R9 — My Account → Overview → Personal Details → Verify Email

Original contract: Active account, saved unverified then verified email; Send/Resend Confirmation Code, eight-digit field, Verify Email Address/Cancel; administrator warning; empty/malformed/stale address

Written procedure: [Roles-Section-Permissions-and-MFA — Prepare Verified Email Recovery](../../Roles-Section-Permissions-and-MFA.md#prepare-verified-email-recovery).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R9-S01` — Saved unverified email. | Saved fictional unverified Jamie address. | [account-email-unverified](account-email-unverified.png) |
| `B3-R9-S02` — Empty verification form. | Empty password and eight-digit code fields after a genuine request through the existing isolated local mail-sink fixture; Resend/Verify/Cancel controls visible. | [account-email-verification](account-email-verification.png) |
| `B3-R9-S03` — Verified status. | Written check for Verified status and changed-address effects. The image is still unverified; no external mail delivery or verification acceptance claimed. | Written instructions |
| `B3-R9-S04` — Cancel unchanged. | Cancel visible; written clearing/cancellation leaves verification unchanged. | [account-email-verification](account-email-verification.png) |
| `B3-R9-S05` — Empty/malformed/stale rejection. | Written saved-address prerequisite, malformed-address guidance and stale-profile recovery; no individual invalid-state captures. | Written instructions |

## B3-R10 — Forgot Password? → Request a Recovery Code → Reset Your Password

Original contract: Signed-out fictional recovery-owner; neutral response, empty eight-digit code/new/confirm/authenticator, Request Another Code/Back To Sign In/Recover Password; mismatch, invalid/expired proof, Password Updated; return to preceding MFA

Written procedure: [Roles-Section-Permissions-and-MFA — Recover Your Password From Sign-In](../../Roles-Section-Permissions-and-MFA.md#recover-your-password-from-sign-in).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R10-S01` — Recovery request. | Signed-out empty request form for the recovery-owner procedure. | [recovery-request](recovery-request.png) |
| `B3-R10-S02` — Neutral response. | Exact neutral response; fictional recovery-owner is intentionally not assumed eligible or reachable. | [recovery-reset](recovery-reset.png) |
| `B3-R10-S03` — Reset empty fields. | Empty recovery code, password, confirmation and optional authenticator fields; Recover/Request Another/Back visible. | [recovery-reset](recovery-reset.png) |
| `B3-R10-S04` — Password Updated. | Written Password Updated result and fresh sign-in; no recovery completion claimed. | Written instructions |
| `B3-R10-S05` — Invalid/expired/mismatch rejection. | Written mismatch, invalid/expired code and bounded attempt recovery; no email-delivery investigation. | Written instructions |
| `B3-R10-S06` — Back and preceding MFA return. | Back/Request Another controls pictured; preceding MFA-return and clearing behaviour remain written. | [recovery-request](recovery-request.png), [recovery-reset](recovery-reset.png) |

## B3-R11 — My Account → Security → Change Password; ended-session sign-in

Original contract: Active user, empty current/new/confirm; invalid current/mismatch; Your Session Has Ended after revoked/expired session

Written procedure: [Roles-Section-Permissions-and-MFA — Change Your Password From My Account](../../Roles-Section-Permissions-and-MFA.md#change-your-password-from-my-account).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-R11-S01` — Change Password empty fields. | Shared genuine Security screen has empty current/new/confirm fields; no extra image needed. | [account-security-voluntary](account-security-voluntary.png) |
| `B3-R11-S02` — Invalid current/mismatch. | Written invalid-current-password and mismatch rejection; saved password unchanged. | Written instructions |
| `B3-R11-S03` — Saved password result. | Written password-save result and revocation of all current sessions. | Written instructions |
| `B3-R11-S04` — Session ended sign-in. | Owner-approved written Your Session Has Ended / sign-in instructions; no routine ended-session image. | Written instructions |

## B3-S1 — Staff → Staff Members

Original contract: Staff Read then Administrator; Alex, Taylor and a blank migrated name, Find A Staff Member, All Statuses/Active/Left Company, View Details/Edit, login badges only for administrator; No matching Staff Members

Written procedure: [Staff-Members — Find A Staff Member](../../Staff-Members.md#find-a-staff-member).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-S1-S01` — Staff directory and login badges. | Administrator view with usernames, login badges and View Details/Edit. | [staff-directory-administrator](staff-directory-administrator.png) |
| `B3-S1-S02` — Name/status filters. | Name/username search and All Statuses controls visible; Active/Left Company and combined filters explained in writing. | [staff-directory-administrator](staff-directory-administrator.png) |
| `B3-S1-S03` — Blank migrated names. | Blank migrated name retained as Name Not Recorded; administrator username versus non-administrator privacy distinction visible. | [staff-directory-administrator](staff-directory-administrator.png), [staff-directory-non-administrator](staff-directory-non-administrator.png) |
| `B3-S1-S04` — No matches. | Written No matching Staff Members recovery: clear search and All Statuses before adding. | Written instructions |
| `B3-S1-S05` — Non-administrator badge visibility. | Staff Members Read only; employment status visible, no usernames/login badges, Edit or account administration. | [staff-directory-non-administrator](staff-directory-non-administrator.png) |

## B3-S2 — + Add Staff Member / Edit Staff Member

Original contract: Staff Edit; Alex no login, required names/optional fields, active Department/No Department, Staff Status, Create Caffoot Login unavailable for non-admin, Save/Cancel/Back; empty names/invalid email

Written procedure: [Staff-Members — Add A Person Without A Login](../../Staff-Members.md#add-a-person-without-a-login).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-S2-S01` — Staff-only Add. | Representative unsaved Staff-only Jordan draft with required names, Accounts and login off; Alex’s worked no-login procedure remains written. | [staff-add-form](staff-add-form.png) |
| `B3-S2-S02` — Edit with Department/status. | Jordan existing Department/status/job/location in Edit; no saved edit claimed. | [staff-edit-form](staff-edit-form.png) |
| `B3-S2-S03` — Non-admin login unavailable. | Written administrator prerequisite and unavailable non-administrator Create Caffoot Login control; exhaustive permission variants are written. | Written instructions |
| `B3-S2-S04` — Save result. | Written Save Staff Member and checking actual saved Staff Details; no claim the pictured Add draft was saved. | Written instructions |
| `B3-S2-S05` — Cancel/Back. | Owner-approved written Cancel/Back discard instructions. | Written instructions |
| `B3-S2-S06` — Empty name/invalid email. | Written required names and malformed/overlong email correction; no validation matrix photography. | Written instructions |

## B3-S3 — Staff Details → Create Login

Original contract: Administrator with Staff Edit; active Alex, optional login on, unique username and empty initial/confirm password, default Staff Member; duplicate username rejection retaining nonsecrets and clearing passwords; Left Company link rejection

Written procedure: [Staff-Members — Create And Link An Optional Caffoot Login](../../Staff-Members.md#create-and-link-an-optional-caffoot-login).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-S3-S01` — Active Staff Create Login. | Existing active Jordan Staff-only record with optional login on, unique username draft, baseline-role explanation and empty initial passwords; Alex example remains written. | [staff-create-login](staff-create-login.png) |
| `B3-S3-S02` — Unique username result. | Draft username only: successful combined save/link result checks remain written; image is not a created login. | [staff-create-login](staff-create-login.png) |
| `B3-S3-S03` — Duplicate username with cleared secrets. | Written exact duplicate-username message, case-insensitive example, retained nonsecrets and cleared password entries. | Written instructions |
| `B3-S3-S04` — Left Company link rejection. | Matching disabled/offboarded state accompanies written rejection of linking/creating login until Reactivate; image does not depict an attempted link. | [staff-left-company-retained](staff-left-company-retained.png) |
| `B3-S3-S05` — Cancel unchanged. | Routine Cancel leaves saved Staff and login unchanged. | Written instructions |

## B3-S4 — Edit Staff Member → Resolve Difference / Refresh Current Details

Original contract: Administrator with Staff Edit; Taylor/Tay saved name and different fictional emails; Keep Staff/Account/Leave Unchanged, save confirmation; stale rejection and refresh confirmation

Written procedure: [Staff-Members — Resolve A Difference Between Staff And Account Details](../../Staff-Members.md#resolve-a-difference-between-staff-and-account-details).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-S4-S01` — Saved Staff/account differences. | Genuine saved Taylor/Tay and email differences. | [staff-resolve-differences](staff-resolve-differences.png) |
| `B3-S4-S02` — Per-field resolution. | Per-field selectors currently Leave Both Values Unchanged; Keep Staff/Account choices and verification consequences remain written. | [staff-resolve-differences](staff-resolve-differences.png) |
| `B3-S4-S03` — Save confirmation. | Native confirmation written exactly in guide; no extra capture or confirmation tooling. | Written instructions |
| `B3-S4-S04` — Stale rejection. | Written stale-edit rejection preserves entries; no broad concurrency tests. | Written instructions |
| `B3-S4-S05` — Refresh confirmation. | Native Refresh Current Details confirmation written exactly; unsaved fields replaced only if confirmed. | Written instructions |

## B3-S5 — Staff Details / Account Controls → Mark As Left Company / Reactivate

Original contract: Administrator + Staff Edit; Alex with AC-LAP-07, confirmation/Cancel; Left Company + Disabled after save, retained assignment; Reactivate then still Disabled/Enable Login; self/last-admin rejection

Written procedure: [Staff-Members — Mark As Left Company Or Reactivate](../../Staff-Members.md#mark-as-left-company-or-reactivate).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B3-S5-S01` — Left Company confirmation. | Native quick-status and Add/Edit confirmation wording is written exactly in the guide; image is the later saved outcome, not a native confirmation. | [staff-left-company-retained](staff-left-company-retained.png) |
| `B3-S5-S02` — Cancel unchanged. | Owner-approved written Cancel leaves both Staff and linked login unchanged. | Written instructions |
| `B3-S5-S03` — Left Company and Disabled result. | Alex Left Company plus Disabled login; MFA/roles, outstanding AC-LAP-07 and assignment history retained. | [staff-left-company-retained](staff-left-company-retained.png) |
| `B3-S5-S04` — Reactivated but Disabled result. | Written Reactivate preserves history and leaves login Disabled; saved offboarding illustration supports that procedure without being relabelled as reactivated. | [staff-left-company-retained](staff-left-company-retained.png) |
| `B3-S5-S05` — Explicit enabled result. | Written separate Enable Login after Active employment; Sarah is a representative disabled Active account, not reactivated Alex or a completed enable outcome. | [account-login-disabled](account-login-disabled.png) |
| `B3-S5-S06` — Self/last-admin rejection. | Own/sole-active-administrator visual protection plus written self/last-admin rejection safeguards; no attempted bypass or native acceptance. | [account-administrator-protected](account-administrator-protected.png) |

All original IDs, titles and contracts remain retained. Representative people are named as actually depicted: Morgan reuse stays Morgan; Taylor/Tay is the saved profile example; Jordan supplies unsaved Staff/login forms; Alex supplies the exact AC-LAP-07 offboarding result. Shared or representative images never assert an uncaptured success, rejection, cancellation or later outcome.
