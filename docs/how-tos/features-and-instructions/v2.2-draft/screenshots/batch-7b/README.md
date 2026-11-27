# Batch 7B — Desktop Instructional Screenshots

**27 November 2026. 25 proposed new images: accounts, roles and MFA 18; Staff Members 7.** Exactly three existing approved reuse images are referenced separately. Independent ChatGPT review and separate product-owner visual acceptance recorded in the [27 November decision](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7212506766); original provenance and targeted pre-publication refresh limitations remain. No publication approval.

Authority: [Batch 7B scope and method](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7211852349), [desktop light decision](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7210689297) and [accepted Batch 7A presentation](../batch-7a/README.md). The maximum 28 is a ceiling. Native deletion and Left Company confirmations use the approved exact-wording substitutions. One Security screen serves both voluntary MFA enrolment and password change. No mandatory image distinction was dropped.

[Coverage: all 16 groups / 79 specifications](Coverage.md) · [New and reused provenance manifest](manifest.json) · [Static verification](Verification.md)

Application `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`, schema 31; documentation start `8c790ad91a969b35a2b610f7fe7dd4e8a87daea4`. The initial projectless workspace had no repository/fixture mounted. The authorised branch was fetched into an isolated work directory without altering unrelated files. Existing installed Playwright and local headless Chromium were used; no package, browser, virtual display or other tooling was installed. Application/interface/assets are byte-identical to the pinned baseline.

The disposable fictional local HTTPS/SQLite fixture reuses repository account/role/Staff helpers and the existing `tests/fixtures/recovery_browser.py` local mail sink for the email-request screen. The capture driver follows the existing Staff/account navigation helpers. No real mailbox, private deployment or external delivery was exercised. recovery-owner is a fictional requested username, not a claim of an existing or eligible account. Secrets, cookies, codes, fixture database, TLS keys and capture scripts remain outside tracked files.

New captures use Chromium 156.0.8078.79, Playwright 1.62.0, light theme at scale 1. Twenty-four viewports are 1440 × 1050; the longer access review uses 1440 × 1200 so before/after rights and both confirmation actions remain legible. Full-page rasters are explicitly recorded and are not represented as viewport dimensions. All final PNGs were opened individually. Three replaced framing attempts remain untracked and are not guide illustrations. No editing, masking, cropping, compositing or fabricated UI.

Actors: training-admin is the sole active MFA-confirmed administrator with access to all eight sections, subject to enabled features. directory.reader has Staff Member and Staff Members Read only, with MFA confirmed. Jamie has baseline-only access and no authenticator before the assisted-reset illustration; Priya has baseline-only access with voluntary enrolled MFA. Tim and Dave have IT Staff; Dave retains Devices Read and Racks Read overrides in the unconfirmed review. All six optional features are enabled for new captures. Per-image snapshots record actual subject status, roles, overrides, effective grants and feature settings. No Access is represented by absence from effective grants; administrator access applies independently of that ordinary-grant map.

Taylor’s account uses Tay while the Staff record uses Taylor; the email difference is deliberately unresolved. Alex is eligible for promotion in the earlier illustration but is not promoted. Later Alex is offboarded, retaining MFA/roles and AC-LAP-07. Sarah’s disabled login retains Active employment. The administrator directory predates Alex’s change; the non-administrator directory follows it. No later image relabels an earlier state.

## New Images

| Image | Original direct/representative state references | Caption |
| --- | --- | --- |
| [access-change-review.png](access-change-review.png) | `B3-R3-S01`, `B3-R3-S02` | Dave’s proposed Racks change replaces the Read override with Inherit, giving effective Edit. One account and two stored sessions would be affected. This preview was cancelled. |
| [account-administrator-eligible.png](account-administrator-eligible.png) | `B3-R4-S02` | Alex’s authenticator is enrolled and email verified, so Make admin is available. No promotion has been applied. |
| [account-administrator-protected.png](account-administrator-protected.png) | `B3-R4-S03` | The signed-in account is also the only active administrator in this fixture. Its own disable, demotion, reset and deletion controls are protected. |
| [account-email-unverified.png](account-email-unverified.png) | `B3-R9-S01` | Jamie’s saved fictional address is Not Verified. Save Personal Details alone does not verify an address. |
| [account-email-verification.png](account-email-verification.png) | `B3-R9-S02` | The existing isolated mail-sink fixture supplied the confirmation-request state. Current Password and Email Confirmation Code are empty. This illustration does not establish external mail delivery. |
| [account-login-disabled.png](account-login-disabled.png) | `B3-R5-S02` | Sarah’s saved login is Disabled while employment remains Active. Enable Login is available; this is not an offboarding result. |
| [account-mfa-removal-eligible.png](account-mfa-removal-eligible.png) | `B3-R8-S02` | Priya’s enrolled MFA is optional for her baseline-only access. The expanded removal form has empty password and authenticator fields; no removal has been submitted. |
| [account-mfa-removal-protected.png](account-mfa-removal-protected.png) | `B3-R8-S03` | This administrator’s MFA is mandatory. Security shows MFA Enabled and provides no Remove MFA action. |
| [account-personal-details.png](account-personal-details.png) | `B3-R1-S01` | Saved Personal Details for taylor.cole: the account uses Tay Cole and an unverified email. Resolve any saved Staff/account differences separately. |
| [account-reset-password.png](account-reset-password.png) | `B3-R6-S01` | Reset Password for Jamie Taylor, before entry or confirmation. Both temporary password fields are empty. |
| [account-security-voluntary.png](account-security-voluntary.png) | `B3-R8-S01`, `B3-R11-S01` | Jamie has the baseline Staff Member role and no wider grants. Security shows the empty password-change form and safe voluntary MFA starting screen; enrolment has not begun. |
| [authenticator-challenge.png](authenticator-challenge.png) | `B3-R7-S02` | Tim’s IT Staff account requires the authenticator challenge after password entry. The password has cleared and the code field is empty; the dots are the application’s placeholder. |
| [mandatory-password-change.png](mandatory-password-change.png) | `B3-R6-S02` | After an assisted reset, Jamie must choose a personal password before entering the workspace. Both new password fields are empty. |
| [recovery-request.png](recovery-request.png) | `B3-R10-S01` | Request a Recovery Code starts with an empty Username field. Recovery prerequisites and the administrator fallback remain visible. |
| [recovery-reset.png](recovery-reset.png) | `B3-R10-S02`, `B3-R10-S03` | The neutral response after requesting recovery for fictional recovery-owner confirms neither eligibility nor delivery. All recovery, password and authenticator fields are empty. |
| [role-configuration.png](role-configuration.png) | `B3-R2-S01`, `B3-R2-S02` | Equipment Auditors is an unsaved role draft with IT Assets Read. Review Changes is still required; this role has not been created. |
| [roles-directory.png](roles-directory.png) | `B3-R2-S03` | Manage Roles shows the protected Staff Member baseline and the enabled IT Staff definition. |
| [sign-in.png](sign-in.png) | `B3-R7-S01` | The sign-in form starts with empty Username and Password fields. |
| [staff-add-form.png](staff-add-form.png) | `B3-S2-S01` | An unsaved Add Staff Member draft using fictional Jordan Rivers. Create Caffoot Login is off; no new Staff record has been saved from this draft. |
| [staff-create-login.png](staff-create-login.png) | `B3-S3-S01` | The existing Jordan record has an unsaved optional login draft. The two initial password fields are empty and the default role is Staff Member. |
| [staff-directory-administrator.png](staff-directory-administrator.png) | `B3-S1-S01`, `B3-S1-S03` | Administrator view: usernames and login badges help distinguish Staff identities, including a migrated record whose name is not recorded. |
| [staff-directory-non-administrator.png](staff-directory-non-administrator.png) | `B3-S1-S05` | Staff Members Read view after Alex’s employment change: employment status is visible, while linked usernames, login badges and editing actions are absent. |
| [staff-edit-form.png](staff-edit-form.png) | `B3-S2-S02` | Edit Staff Member displays Jordan’s existing Department, job title and location. This illustration does not claim an edit has been saved. |
| [staff-left-company-retained.png](staff-left-company-retained.png) | `B3-S5-S03` | Saved offboarding result: Alex is Left Company, the linked login is Disabled and AC-LAP-07 remains assigned. No equipment return has been recorded. |
| [staff-resolve-differences.png](staff-resolve-differences.png) | `B3-S4-S01`, `B3-S4-S02` | Taylor/Tay and the two fictional email addresses are saved differences. Both resolution selectors still say Leave Both Values Unchanged. |

## Approved Existing Reuse

These three unchanged original desktop light images depict **Morgan Reed**, not the new capture fixture. Source `bf5a016039b9812c0825644b47c6b619bbad653e`, schema 31, Chromium 155.0.8059.79; viewport and raster 1440 × 1000. Original per-file timestamps and complete actor/feature metadata were not recorded; those limits remain explicit. Existing Batch 7 assessment found interface/backend unchanged to the application baseline. New hash verification identifies the existing bytes only.

| Reuse ID | Original image | Narrow approved caption |
| --- | --- | --- |
| RE02 | [permissions-controls-1440-light.png](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-controls-1440-light.png) | Morgan’s initial Active employment/login controls; promotion unavailable. This is not Alex’s later eligibility or offboarding result. |
| RE04 | [permissions-permissions-1440-light.png](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-permissions-1440-light.png) | Morgan’s inherited and effective No Access example, including Suppliers Feature Disabled. This is not a later access-change result. |
| RE06 | [permissions-roles-1440-light.png](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshots/permissions-roles-1440-light.png) | Morgan’s saved membership: protected Staff Member selected, IT Staff unchecked. This is not a subsequent membership change. |

[Original provenance](../../../../../development-handovers/evidence/native-acceptance-corrections/README.md) and [original hashes](../../../../../development-handovers/evidence/native-acceptance-corrections/screenshot-sha256.json) remain preserved. Dark/mobile variants remain development evidence and are not embedded as instructional images in these two guides.

## Native Confirmations And Written Substitutions

- Deletion example: **“Delete sarah.lewis?”** The genuine dialog was observed and cancelled; no deletion result is claimed.
- Staff Details example: **“Mark As Left Company Alex Morgan? Any linked login will be disabled and active sessions ended. Equipment, tickets and history are retained.”** The genuine dialog was confirmed for the saved fictional offboarding illustration.
- Add/Edit example: **“Mark As Left Company? Any linked login will be disabled and active sessions ended. Equipment, tickets and history are retained.”** Exact application wording is retained in the guide.

Invalid passwords, duplicate usernames, malformed emails, expired codes, routine Save/Cancel/Back/refresh, exhaustive permission combinations, pending-MFA/QR/setup steps, ordinary success/redirect/ended-session notices and reactivation/Enable Login outcomes remain written instructions under the owner’s explicit substitutions. Native reconciliation/refresh confirmations are written exactly. Existing genuine application-rendered reset and access-review dialogues remain illustrated. No confirmation implementation was replaced.

## Batch 7A Administrative Completion

[Independent review and owner decision](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7211815146) accept all **38 images out of the maximum 40**, across the original 19 groups and 85 specifications. The exact written substitution **“Disable Network Racks? Saved data and permissions will be retained.”** is inserted in Optional Features. Live coverage, guide status, manifest, register and PR status are reconciled; dated blocked/review records and original provenance remain preserved. No 7A recapture or retest.

## Delivery Boundary

Only authorised documentation, pack records and new images change. No tracked application, configuration, schema, test or AGENTS.md change; no unrelated application tests, full regression/CI monitoring, cloud desktop, virtual display, private Pi deployment, native acceptance, upgrade/migration/backup/restore rehearsal, private export investigation, security audit, website, Batch 7C–7H, Batch 8, PR promotion, merge, release or publication. PR #472 stays open/draft/unmerged targeting milestone-1; issue #366 stays open. The historical 7B execution stop is superseded for 7C–7E by the later consolidated owner approval; separate acceptance remains required for those packs.
