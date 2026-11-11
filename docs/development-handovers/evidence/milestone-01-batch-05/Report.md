# Stage 1 Upgrade And Regression Review

Batch 05 verification follows [the agreed specification](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790171609)
and [efficient testing procedure](https://github.com/Caffoot/Caffoot-Lite/issues/363#issuecomment-6800582534),
authorised by the owner's 11 November 2026 resumption instruction. The published
release remains v2.1. This is evidence for review, not Stage 1 final acceptance.

## Source And Changes

Starting remote/application checkpoint: `689afd827ef3192379b6baf7ef6d289d8f73da04`,
including rack-spacing PR #359. Batch 04 implementation checkpoint remains
`6eff8aa7d35fa2e78cdf505c9800250fd2563267`. Published v2.1 source is
`c3237114108cad9f7d4e57657b6aed5e0091a5ef`.

Only tests, the fictional fixture, this evidence and affected guides change.
Application code, approved designs, database/API contracts, workflows, root
README version and publication strategy are unchanged. No real `/data`, Pi,
Portainer stack or production service is used. Local private images:

| Source | Local Image ID |
| --- | --- |
| Published v2.1 | `sha256:ed76eeb2c5ac7a57ccd92dea5d07f49ea237c1d94589a128d56562fb1c43dd7d` |
| Current application | `sha256:e10d5b88505a798fc23bdba4c729ec063c474c5c58a37954eb2281fc9ee03c85` |

Both builds exited 0 using the existing Dockerfile and `proxy_ca` secret, with
full source revision labels checked by the rehearsal. These are local amd64
source builds, not published registry digests or a new ARM64 acceptance claim.

## Checks

| Check | Result And Evidence |
| --- | --- |
| Focused migration tests | [8 passed](focused-migration.txt), including 216 legacy grant/admin/active/MFA combinations, exact row preservation, failed-migration rollback, first-admin/new Staff and idempotency |
| Full-volume, two-image upgrade/restore | [Passed](upgrade-restore.txt): eight real-format fictional accounts, five stored sessions invalidated, four new role tables, unchanged old rows/private files, Read MFA and inheritance, repeated v11 startup, complete restore and successful matching-v2.1 startup/sign-in |
| Existing Chromium compatibility | [Passed](chromium.txt), exit 0 against local HTTPS/SQLite with `/usr/bin/chromium`; includes first-admin, Devices/IPAM/Racks, permissions, MFA, reservations, reset/import and retained accounts |
| Pinned stylesheet/template provenance | [2 passed](source-fidelity.txt): all twelve manifest source HTML/CSS hashes, exact stylesheets and template dependencies |
| Extra legacy HTML contract script | [Failed](approved-html.txt), exit 1: `.ipam-modal-body` selector comparison; see limitation below |
| Python compilation | `python -m compileall -q backend tests`, exit 0 |
| Full backend acceptance suite | Running at the first checkpoint; final result recorded in the completion update |
| Release/document consistency | `python scripts/verify_release.py` and the unchanged `release-documentation.yml` embedded check, exit 0; v2.1 remains current, all eight compatibility guide copies agree |
| Whitespace | `git diff --check`, exit 0 |

The [rehearsal guide](../../../development-guide/Upgrade-And-Restore-Rehearsal.md)
records the exact command, fixture, ordered-row and SHA-256/mode/UID/GID
comparison method, deployment sequence and mandatory owner production preflight.
The test creates and removes only uniquely named local Compose volumes.

Two development runs of the new rehearsal failed at the restore comparison.
The second diagnostic identified missing `tls/server.key`: the new test helper
had not closed its tar writer before reading/restoring the archive. It now
closes archive handles and checks that the private-key member exists before
upgrade. The snapshot helper also explicitly closes its SQLite connection before
enumerating files. The corrected run passed. These are test-helper corrections,
not application changes or unexplained retries. No private snapshot/secret
material is committed; the raw failed-run logs stay outside the repository.

## Reused Evidence And Coverage

At the exact starting head, existing Actions passed:
[backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43056683276),
[real Compose lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43056683551),
[required documentation](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43056683207),
[full history secret scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43056683219)
and [release safety preflight](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43056683266).
The latter's six release-only jobs, including publication, were skipped.
The unchanged real lifecycle result is reused; the new rehearsal separately
exercises actual Docker/Compose start, stop, recreation, upgrade and restoration.

Existing regression coverage is retained and reviewed: `test_role_policy.py`
(highest enabled grant, explicit denial, disabled/unknown/default deny),
`test_roles.py` and `test_role_admin_http.py` (lifecycle, membership,
stale/spoofed/replayed confirmations, atomic audit/revocation and HTTP guards),
`test_role_concurrency.py`/`test_mfa_concurrency.py` (real concurrent SQLite
writers), `test_required_mfa*.py` (legacy Read upgrade, mandatory/optional
enrolment/removal and all-session revocation), `test_administrator_roles.py`
(promotion and last-admin safeguards), `test_role_notifications.py`
(missing/unverified/verified/disabled email, SMTP absence, bounded queue and
delivery failure), and existing request-auth, inventory/import/history tests
(section/operation boundaries). Full-suite results must be read with the skips;
none establishes real SMTP delivery or a private genuine-export round trip.

## Visual Evidence And Review Gaps

Reuse the [Batch 04 report and desktop/mobile comparisons](../milestone-01-batch-04/Report.md),
including [desktop Users](../milestone-01-batch-04/comparisons/users-1440-live.png),
[mobile Users](../milestone-01-batch-04/comparisons/users-390-live.png) and
[mobile Manage User](../milestone-01-batch-04/features/manage-390.png).
Desktop Users and mobile Manage User were inspected again in this review;
no fresh screenshot capture or exhaustive new visual certification is claimed.
Users/sign-in/My Account runtime files match the prior evidence hashes. The
only subsequent stylesheet change is the approved scoped rack-search spacing
rule in `components.css` from #359; that global file's old hash is not reused
as though unchanged. All twelve pinned stylesheets remain byte-identical.

The [verified standalone reference record](../milestone-01-batch-04-comparison/Report.md#verified-references)
identifies the original 57,148-byte attachment by SHA-256
`4cd3c375cccd19509afa5b2e24a35f79101a15fecdd4a3053628a70c6e6a1002`.
Its existing additive mapping and final implementation comparisons are reused;
the attachment is not present in this checkout and has not been rehashed here.
It remains an additions reference, not a replacement for the pinned design.

The extra `approved-html-contract.cjs` failure is a pre-existing checker issue:
its `indexOf(selector + '{')` matches an earlier scoped `.ipam-modal-body` rule
inside `components.css`, then compares that declaration with the pinned base
rule. The actual base rule in `ipam.css` is unchanged and the canonical hash
test passes. The checker and relevant application sources predate this batch;
the only intervening CSS delta is the unrelated #359 rule. No CSS or checker
change is made, and this failed check is not counted as passed.

Owner review remains required. In particular, retain the two observations from
[the owner's Pi checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6800259099):
visible rack remove controls for a Read user (server deletion was denied), and
the legacy `User` Account Role label on Staff-only My Account. Neither is
silently redesigned or declared resolved here.

## Acceptance Boundary

**Batch 04 final Chromium, Firefox and WebKit acceptance remains outstanding.**
At the starting head, [browser run 43056683269](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43056683269)
failed during Chromium tool installation; Firefox/WebKit were cancelled during
setup and application steps were skipped. This existing #361 infrastructure
failure was not investigated or retried. Earlier/local passes do not replace
the required final-head result. Artifact-upload success does not mean a test ran.

PR #358 remains draft and unmerged; protected `main`, published v2.1, the
owner's private 8445 acceptance stack and production data are untouched.
No Stage 1 final acceptance, merge, tag, image publication or deployment is
claimed. The owner must review code, security/upgrade evidence and visual
results, and independently confirm the real backup/restore preflight before any
separately authorised deployment.
