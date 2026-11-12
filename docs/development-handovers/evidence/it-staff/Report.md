# IT Staff — Implementation Review

Issue [#365](https://github.com/Caffoot/Caffoot-Lite/issues/365) is implemented on
`milestone-1`, starting from accepted Stage 1 source
`53252613cf5302d8e526324c0982b8807472e251`. The final issue body and the owner's
implementation instruction govern; earlier exact-match and unassigned-upgrade
proposals are superseded. This feature awaits private Raspberry Pi acceptance.
The implementation SHA and final automatic results are recorded in draft PR #358.

## What Changed

- Schema 12 follows the unchanged schema-11 migration. It rebuilds the built-in
  constraint in the existing transaction, preserving role IDs, dependent grants,
  memberships and triggers. It does not turn foreign-key checking off. Protected
  identities can have configurable grants/status; Staff Member keeps its stricter
  baseline protections. Only IT Staff is introduced.
- IT Staff starts enabled with Devices/IPAM/Racks Edit. Every existing active
  account receives it; disabled accounts do not. Existing custom roles, explicit
  overrides, Administrator flags, MFA secrets, profiles, inventory and history
  remain intact. Only missing overrides needed to preserve earlier Read or No
  Access are added. Effective section levels are verified before commit.
- Newly assigned accounts' sessions and email proofs are invalidated. Enabled
  IT Staff requires MFA even with three No Access overrides. Existing enrolment,
  sign-in, audit and confirmation safeguards are reused. Fresh IT Staff starts
  unassigned; first-admin and new ordinary accounts remain Staff-only.
- Administrators can review/confirm IT Staff grant/status and membership changes.
  Name/key/deletion protections apply in both the service and SQLite. The existing
  editor marks its name read-only and omits Delete; Staff Member remains locked.
- Manage User receives the approved permission explanation outside its existing
  three-card grid. No pinned template, stylesheet, screen layout, API shape,
  framework, future role or workflow is added. User instructions explain Dave and
  Tim, preserved overrides, intentional Inherit and mandatory MFA after upgrade.

## Checks

| Command / Check | Actual Result |
| --- | --- |
| `python -m unittest discover -s tests -p 'test_builtin_roles.py' -v` | [10 passed](builtin.txt), no skips; fresh defaults, 512-state migration matrix, minimal overrides, active/disabled/admin/custom-role cases, idempotency, rollback, foreign-key-on/off connections, generic built-in/Staff identity constraints, Dave/Tim, membership and required MFA |
| `python -m unittest discover -s tests -p 'test_role*.py' -v` | [41 passed](roles.txt), no skips; existing role administration, HTTP, concurrency, policy, notifications and the independently retained schema-10→11 migration tests |
| `python -m unittest discover -s tests -p 'test_required_mfa_http.py' -v` | [11 passed](mfa-http.txt), no skips, after the schema compatibility correction; legacy Read enrolment and mandatory enrolment/removal/session boundaries |
| `python -m unittest discover -s tests -p 'test_schema.py' -v` | [3 passed](schema.txt), no skips |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_BUILTIN_ROLES_ONLY=1 CAFFOOT_ROLES_OUTPUT=/workspace/work/it-staff/browser node tests/users-roles-interface.cjs` | [Passed](browser.txt), exit 0; real HTTPS/SQLite role defaults, membership clicks with preview/confirmation, protected name/deletion, editable grants, disable/re-enable, retained overrides, required-MFA response, three-card layout and mobile overflow |
| `python -m unittest discover -s tests -p 'test_modular_interface.py' -v` | [2 passed](provenance.txt), all twelve pinned source hashes/styles and template dependencies |
| Syntax and release consistency | Python compilation, changed JavaScript syntax, `python scripts/verify_release.py`, guide-copy equality, changed Markdown file links and whitespace checked; final results recorded with the commit |
| Function Index | 734 runtime definitions; shifted existing links remapped to identical declaration lines and the new schema migration helper indexed |

The role-service suite passed before the final foreign-key-off compatibility
correction; the migration, required-MFA HTTP and schema checks above ran after
that correction. The final automatic full-backend outcome is recorded in PR #358.

The first full local backend run executed **573 tests: 568 passed, one error,
four skips**. It exposed a migration error when a caller had foreign keys off:
dependent memberships survived dropping the parent and were restored twice.
The migration now explicitly clears saved dependent rows before rebuilding,
and the new connection-mode regression passes. The existing legacy Read HTTP
assertion also needed the approved IPAM/Racks No Access preservation overrides;
its updated 11-test file passes. That broad run is not presented as a pass.

Other development failures were test-fixture assumptions: role ID 2 was no
longer the first custom role; the MFA-start helper returns username then secret;
and the browser helper initially used an ambiguous tab selector, same-hash
navigation that retained stale user data/a modal, and `check()` despite the
existing preview flow deliberately resetting membership until confirmation.
The fixtures now use the actual role ID, helper return order, scoped tab,
document reload after external API writes, and click→preview→confirm. The corrected
focused results are above. No infrastructure retry or production-data test occurred.

The four broad-run skips were the two genuine private-v1.3.3-export checks and
the two opt-in Docker checks. No private export was supplied. The existing
two-image restore fixture and guide were updated for schema 12 but that opt-in
rehearsal was **not run for this feature**. Historical schema-11 Docker evidence
is not claimed as a schema-12 restore pass. Pi/ARM64 build, real SMTP delivery,
owner visual acceptance and complete private-volume recovery remain separate.

## Visual Review

[Dave desktop](it-staff-dave-1440.png), [Dave mobile](it-staff-dave-390.png) and
[IT Staff editor](it-staff-editor-1440.png) use fictional data. The mobile Dave
view and desktop editor were inspected: existing modal/card patterns remain;
the editor permits grant/status changes while retaining a protected name and
no Delete action. The browser checks the explanation and exactly three access
cards. These captures are review evidence, not product-owner acceptance.

## Files And Review Boundary

Runtime: `backend/schema.py`, `backend/roles.py`, `interface/application.js`.
Tests: `test_builtin_roles.py`, `test_role_migration.py`, `test_role_policy.py`,
`test_required_mfa_http.py`, `test_upgrade_restore.py`,
`fixtures/upgrade_restore.py`, `users-roles-interface.cjs` and
`builtin-roles-interface.cjs` under `tests/`.
Documentation: the Users/Permissions/MFA guide and its compatibility copy;
developer Architecture, Database, Authentication/Permissions, Code Reference,
Function Index, Role Permissions, README and Upgrade/Restore guide; active
Milestone 01 handover; and this evidence directory.

Contribution review covers descriptive names, British English, Title Case,
same-batch documentation, accurate function links, compatibility copies and
protected layouts. No source of the accepted schema-11 migration was rewritten.
A pre-existing custom role colliding with the `it_staff` key or IT Staff name
fails safely and rolls back; it is never silently converted or renamed.

Original Stage 1 acceptance remains at the starting SHA. This additional schema
and feature need new owner Raspberry Pi acceptance before any merge decision.
Keep PR #358 draft. Protected `main`, the published v2.1, CI definitions and the
owner's actual installation are untouched. No deployment, release, image
publication or acceptance of IT Staff is claimed.
