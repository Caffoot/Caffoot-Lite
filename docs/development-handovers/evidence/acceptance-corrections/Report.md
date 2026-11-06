# Acceptance Corrections — Verification And Private Review

The authorised corrections for #308, #311 and #325 are implemented. The uncontested #326 restorations and saved host/guest workflows are implemented and checked; two precise design/compatibility decisions remain open. This is a continuation of the interrupted batch, retaining valid local work and evidence rather than restarting it.

Starting checkpoint: `f528396dc57d25d304b67290d6507d02dce0eb09`. Pushed implementation checkpoints: `5d4a8bf46fff835d9b97031c938095a31294035a` and `3fcc03dd649b86204e77233b4a95290a4e6f2341`. The final delivery SHA, exact private image identity and final GitHub check links are recorded in all four issues; this report and its runtime hashes are committed in that delivery.

## What Changed

| Issue | Implemented result |
| --- | --- |
| #308 | Exact authenticated `/inventory?rack-print=same-tab` direct-entry/reload route, identified purpose-based internal names and references, current Development Guide/comment corrections and regenerated Function Index (637 definitions, including 17 owning bridge methods, `frame.onload` and the private-build helper). External inventory/API/form keys remain unchanged. The immutable manifest retains its historical integration-entry names. |
| #311 | Approved eight-digit text codes, opaque challenge identifier, keyed context-bound digests, private installation secret, additive schema 10 and upgrade invalidation of old proofs. Five failed confirmations per challenge and account/purpose within 15 minutes persist across resends, database reopen, server restart and recreation. Atomic consumption, username-only neutral requests, current password/MFA checks, account isolation and password-reset session revocation remain enforced. |
| #325 | Asset History timeline buttons reuse the existing `audit-row-button` class; click, keyboard, selected details and focus return are retained. Explicit physical-host eligibility remains required for VM creation. |
| #326 | Pinned source card hierarchy, compact 17×17px hosting checkbox, host grid, independent OS card, 38px searches, 39px inline creation fields, labels/help, × close control, tab scroll reset and duplicate footer return. Legacy OS values, explicit host flags, missing legacy host identity and unknown guest metadata survive the exercised editor paths. No OS/software selection silently enables hosting. |

The original twelve HTML files, twelve extracted stylesheets and source manifest are unchanged. No #304 restructuring, #306 reopening, root README/website work, dependencies, production change, merge, publication, deployment or release is included.

## Actual Checks

| Check | Result and scope |
| --- | --- |
| Full backend | **443 run: 440 passed, three skipped** in 48.754 seconds. Docker opt-in passed separately; two private genuine v1.3.3 fixture checks were unavailable. Backend code is unchanged after this run. |
| Eight-digit security | All 16 challenge tests passed within the full suite: leading zeroes/digests, challenge binding/replacement, expiry, durable resend/reopen budgets, invalid input, MFA failure, concurrent single use/failure ceiling, account/purpose isolation, normal MFA sign-in, private-key permissions/symlink/missing-key behaviour, account disable and schema upgrade preservation. Existing and complete mocked-mail HTTP flows cover neutral eligibility/throttling, verified-email prerequisite, password reset and session revocation. |
| Direct route | Explicit discovered test passed for authenticated entry/reload, permissions, response headers and rejection of unrelated paths/queries. It is now included in the full suite; an earlier misplaced method had not been discovered, which the handover records. |
| Existing Chromium regression | Passed against the completed implementation: setup/MFA, responsive catalogue/editor coverage, real saves/reload, inventory/IPAM/Racks, permissions, reservations, import and reset. Final delivery rerun and GitHub results are linked in the issue comments. |
| Main editor/source comparisons | **208** cases: eleven Add/Edit/Duplicate/type scenarios × applicable tabs × 1440×950/390×844 × light/dark. Dialog bounds, card order, card padding, footer actions, close control, compact checkbox/search sizes, tab entry scroll and page overflow assertions passed. These are bounded geometry checks, not a claim that every live control matches the standalone preview. |
| Expanded inline comparisons | **20** cases at desktop/mobile in both themes: 12 measured matches; eight Software/Server Service cases retain the **80/100-character conflict** pending approval. Other compared labels/actions/input geometry match. These eight are not recorded as full-fidelity passes. |
| Host/guest persistence | Real isolated API saves: Proxmox OS/software alone remains ineligible; explicit host creates guests; guest edit/duplicate/reload retains relationships; incomplete legacy host assignment/unknown fields survive; unflagged physical copies stay unflagged and known legacy OS values remain visible. |
| Guided account browser checks | Passed request/success/failure/resend/cancel/navigation, neutral feedback, username-only payloads, eight-digit numeric-keyboard/maxlength and padded `00001234` paste. Desktop/laptop/mobile, both themes and enlarged text pass the existing focused matrix. Browser mail/proof responses are mocked; backend HTTP flows separately exercise real code verification with mocked delivery. |
| Audit timeline | Eight 1440/1280/390/320px light/dark cases with twelve real saved fictional events passed click/Enter/details/focus/style checks. Existing 320px header overflow is 1px both with and without the button class; the styling introduces none. |
| Docker lifecycle | Passed separately in 100.653 seconds: build/start/restart/recreation, retained SQLite and TLS, same private key/hash with mode 0600, and failed-attempt record retained. |
| Provenance/documentation | Both modular source/template tests, approved HTML contract, JavaScript syntax, release consistency and regenerated index/source-link checks passed. Current published release remains v2.0.3. |
| History secrets | Network-disabled Gitleaks v8.24.3 scans the full reachable history; final exact-commit result is recorded in GitHub. Three initial source-checksum false positives were verified against file bytes and resolved by recording hash and path separately before pushing; no scanner rule was suppressed. |
| ARM64 build | **Failed**, exact `3fcc03d` checkpoint, base-image shell `exec format error`. This worker advertises AMD64 only; no ARM64 image or Pi execution is claimed. The Dockerfile is unchanged afterwards. |

The 208-case matrix was reused after later value-preservation refinements; targeted saved workflows and current captures verified those refinements. Final inline styles/accessible names were checked by the expanded matrix and final regression. Early stale source-text assertions and a save/redraw wait were corrected in the harness and affected checks passed; no intermediate failure is represented as a pass.

Reproduction with the established isolated Playwright/Chromium environment:

```sh
python3 -m unittest discover -s tests -v
node tests/browser-compat.cjs
CAFFOOT_DEVICE_EDITOR_FIDELITY=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/editor-review node tests/approved-visual.cjs
CAFFOOT_DEVICE_EDITOR_FIDELITY=1 CAFFOOT_DEVICE_EDITOR_INLINE_ONLY=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/inline-review node tests/approved-visual.cjs
CAFFOOT_ACCEPTANCE_CORRECTIONS=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/audit-review node tests/approved-visual.cjs
CAFFOOT_APPROVED_OWNER_BATCH=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/account-review node tests/approved-visual.cjs
CAFFOOT_DOCKER_SMOKE=1 python3 -m unittest discover -s tests -p test_compose_lifecycle.py -v
```

`CAFFOOT_CHROMIUM_PATH` may select an installed Chromium. The existing Docker `CAFFOOT_BUILD_CA` option supports a managed proxy. Run browser runners sequentially because they use the same local test port. All fixtures are fictional and disposable; none uses the owner's installation.

## Visual Evidence And Open Decisions

[Editor matrix and preservation decisions](Editor-Matrix.md), [208 comparisons with complete deduplicated field/card/action sets](editor-comparisons.json), [20 expanded comparisons](inline-editor-results.json), [saved workflows](device-workflows.json), [Audit cases](audit-button-results.json) and [runtime/capture hashes](checks.json) retain the actual results. Original 33-state baseline evidence remains intact.

| Reviewed view | Live | Pinned source |
| --- | --- | --- |
| Physical Software & Firmware | [View](images/physical-software-live.png) | [View](images/physical-software-source.png) |
| Compact hosting control | [View](images/hosting-compact-live.png) | [View](images/hosting-compact-source.png) |
| VM General, mobile dark | [View](images/vm-general-mobile-dark.png) | [View](images/vm-general-mobile-source.png) |

Additional review images: [Audit desktop light](images/audit-history-desktop-light.png), [Audit mobile dark](images/audit-history-mobile-dark.png), [eight-digit verification mobile dark](images/verification-mobile-dark.png), [Sign In mobile dark](images/sign-in-mobile-dark.png). The source supplies light layout; live dark colours use the existing shared palette. Different fictional values, catalogue content, required permission/validation fields and retained controls can change card heights. Captures do not establish a pixel-identical or owner-accepted design.

Two #326 decisions remain **unapproved**:

1. [Preservation placements](https://github.com/Caffoot/Caffoot-Lite/issues/326#issuecomment-6684664810) for existing hardware/catalogue, custom OS/version, VLAN/available-IP/create, rack-create and Notes tools absent from the preview. Existing controls remain functional at baseline placements; they have not been deleted or moved under this proposal.
2. [Software/service maximum length](https://github.com/Caffoot/Caffoot-Lite/issues/326#issuecomment-6688818756): existing live/catalogue validation is 80, preview is 100. Retain 80 pending an approved compatibility exception or separately authorised consistent change. Do not raise only the inline limit.

Full #326 fidelity and final owner acceptance remain blocked by those decisions. Native Safari/Edge/Firefox, physical mobile/touch, manual screen-reader and real browser zoom remain owner checks. The earlier private verification-mail completion was accepted on an earlier build; complete private Forgot Password delivery/reset/MFA/normal sign-in on this new build remains pending. The original missing recovery email is not diagnosed or claimed fixed. Two genuine private migration fixtures were not supplied.

## Private Docker Acceptance

Use only an isolated private test installation. The native image built by this worker is **linux/amd64**; its exact tag, image ID and revision label are in the final issue comments. It cannot be treated as a Raspberry Pi image. For Pi, build the exact delivery commit on a compatible native ARM64 private builder and inspect `Architecture` and the revision label before use. Do not publish it.

1. Fetch the development branch in a clean test checkout, select the exact final SHA recorded in the four issues, and verify `git rev-parse HEAD` and empty `git status --short`. Back up the entire private test `/data` mapping and retain the old local image. Include the SQLite database, TLS and private SMTP files and, once created, **account-email-secret.key**, preserving private permissions. Never publish this secret or copy it into the image. Existing old-format outstanding codes are invalidated by schema 10; request fresh codes after upgrade. A missing key with usable challenges requires restoration of its matching private backup; do not invent a replacement.
2. Build locally on the target architecture:

   ```sh
   python3 scripts/build_private_acceptance.py --save ../caffoot-lite-private-acceptance.tar
   docker image inspect caffoot-lite:private-DELIVERY_SHA_PREFIX
   ```

   Replace the prefix with the first 12 characters of the exact final SHA. The helper verifies the revision label; add `--build-ca` only if the private proxy needs it. Check the architecture explicitly. Load the archive privately if moving it to a compatible test host.
3. Use the existing private test Compose project, environment, original files/overrides and exact `/data` mapping. Add a local image override, review the resolved mappings privately, then recreate only that test service:

   ```yaml
   services:
     caffoot-lite:
       image: caffoot-lite:private-DELIVERY_SHA_PREFIX
   ```

   ```sh
   docker compose -p EXISTING_PRIVATE_TEST_PROJECT -f compose.yaml -f private-acceptance.yaml up -d --no-build --pull never
   ```

4. Check health, retained inventory/accounts/permissions and MFA sign-in. Test the opt-in print URL by direct entry and reload; normal printing remains default. Review Asset History buttons with keyboard/click and real saved fictional history. Check Add/Edit/Duplicate on each applicable tab and type at desktop/laptop/mobile, both themes and enlarged text. Confirm custom/catalogue/network/Notes controls remain usable. Do not accept the two pending design decisions implicitly.
5. With fictional records, explicitly enable a physical server's hosting checkbox and choose its hypervisor under Software & Firmware. Save, then create/edit/duplicate/reload a guest and check its host relationship. Proxmox OS/software alone must not enable hosting. Check collision/permission/edit-reservation rules and existing accessory previews, saved positions and vertical-drop scroll behaviour as adjacent regressions.
6. With a controlled fictional mailbox, request a fresh eight-digit verification/recovery code, preserve leading zeroes, check incorrect/expired/resend feedback, MFA, success and session revocation, then normal sign-in. Check persistence after restart/recreation and private key mode/backup. Review actual provider delivery privately if mail is missing; a successful SMTP test alone does not prove recovery delivery. Check keyboard focus/live announcements with a screen reader.
7. Record owner results in the relevant issues. Keep the backup/previous image until accepted. Schema 10 rollback requires the matching pre-upgrade backup and previous image; do not point an older schema runtime at upgraded data. No commands have been run against the owner's installation.

- [x] Preserve and continue valid interrupted work.
- [x] Implement uncontested corrections and complete recorded local checks.
- [x] Commit detailed evidence and update the active handover.
- [ ] Owner decisions on both #326 questions.
- [ ] Native ARM64 image and private Pi/native-browser/mail/accessibility acceptance.
- [ ] Merge/publication/release: not authorised.
