# Stage 6.6 — Unified Staff administration

**Owner-approved functional reference, 24 November 2026 — issue [#452](https://github.com/Caffoot/Caffoot-Lite/issues/452).**

- [Approved interactive HTML, revision 3](./caffoot-unified-staff-administration-approved-r3.html) · [immutable original archive commit](https://github.com/Caffoot/Caffoot-Lite/blob/abbab8ad8f44857d5005c718578d6812c08f1560/future-design/stage-6-6-previews/caffoot-unified-staff-administration-approved-r3.html).
- Original file: `caffoot-452-preview-r3.html`, 21,271 bytes. Git blob SHA: `58ee4c5c18381ab3397a23e539b976d88cc142fa`; SHA-256: `92307ae9984e29601b8c1c405916743a831aa9a0b8b720e3f7bd024e7bd55209`. Archived byte-for-byte, no changes to HTML.
- [Owner approval and approved scope](https://github.com/Caffoot/Caffoot-Lite/issues/452#issuecomment-7136470493), [existing screen preservation instruction](https://github.com/Caffoot/Caffoot-Lite/issues/452#issuecomment-7136326463), [navigation clarification](https://github.com/Caffoot/Caffoot-Lite/issues/452#issuecomment-7136112547).

## Integration boundary

This is a standalone simulated functional reference, **not** a replacement layout or CSS source and not a running application or security test. Integrate the approved changes into the existing Caffoot Lite UI; retain existing navigation, approved screens, layout, components, themes and unaffected behaviour. Preserve Staff Members as the single individual administration entry point, compact table with adjacent actions and status badges, administrator-only linked username display/search, optional login creation, and Manage Permissions with a defined gap below Assigned Roles. Retain Departments and existing Permissions → Manage Roles including custom role creation and all existing security safeguards; the demo's omissions do not remove features. No additional menu or redesign authorised.

The exact profile reconciliation, verified email/security, self-service/audit and route compatibility contract remains to be approved before implementation. No application change, merge, deployment or release approval is implied. Stage 6.6 acceptance remains paused; prior evidence is retained. Published v2.1 is unchanged; v2.2 is unreleased.

## Batch 1 — Approved interactive references, 25 November 2026

The owner approved the following standalone simulated journeys for Stage 6.6 Batch 1. Source reference: integration `66917d12a79dbc232596b2ce8416841e82868c00`, schema 29. [Approved batch scope](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7159433267).

- [Design 01 — Sign In](./Caffoot-Lite-Stage-6.6-Design-01-Sign-In.html) — 21,915 bytes; Git blob SHA `34787612d38a10ed26a0f3b4b0efc35e1bb26f46`; SHA-256 `5e708a903ac7388dafc34e0ced8c4d66ad46c52bc9736613910e8024a2e8c6b1`.
- [Design 02 — Administrator Reset Password](./Caffoot-Lite-Stage-6.6-Design-02-Reset-Password.html) — 18,704 bytes; Git blob SHA `f7f0e5f7912ca93864e3ea6bf58bdbf506f8d862`; SHA-256 `0d47734f841a74e9a8dd7601062f3d7cbb90101900779c864f1fd87118dc0f9a`.

Both HTML files are archived byte-for-byte, including their original trailing newline. Design 01 owner review: [#462](https://github.com/Caffoot/Caffoot-Lite/issues/462#issuecomment-7159564782). Design 02 owner approved the interactive reset preview on 25 November and requested archival with Design 01; see #460 for the agreed non-administrator target restrictions. The temporary mascot/font fallbacks are not approved replacement branding. Other account controls in Design 02 are intentionally inactive. Preserve the actual application layout, styles, controls, recovery and enrolment workflows except explicitly approved changes. These files are fictional simulations only, not application implementations or proof of authentication/security. Technical approval, the remaining designs and explicit Batch 1 development authorisation are outstanding. No main, integration, deployment or release changes authorised.
