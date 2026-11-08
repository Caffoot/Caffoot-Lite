# Rack, Recovery And Brand Acceptance Evidence

The exact proposals for [#310](https://github.com/Caffoot/Caffoot-Lite/issues/310#issuecomment-6682698750), [#311](https://github.com/Caffoot/Caffoot-Lite/issues/311#issuecomment-6682723109) and [#317](https://github.com/Caffoot/Caffoot-Lite/issues/317#issuecomment-6682744379) are implemented. Their 6 November approvals are linked in [checks.json](checks.json). The final delivery SHA and local image revision are recorded in those issues. This is private acceptance work, not a release or the owner's final visual acceptance.

## What Changed

- Remove Accessory reuses `btn rack-danger`. Both drag paths retain their existing hooks and gain the pinned blue/red footprint, U-range label and pointer label. Overlays add no rack scroll height. Vertical drops use the existing scroll-preserving helper; no placement validation or speculative horizontal scroll correction was introduced.
- Saved email verification status appears beside Email Address. Unsaved/empty addresses cannot request verification. The inline password → request → code flow provides adjacent live feedback, preserves password re-authentication and clears secrets on cancel/navigation/completion. The new action row wraps within the existing card; its controls can shrink and labels wrap at enlarged text sizes.
- Forgot Password? is an obvious native disclosure using existing secondary styling. Only the username request appears initially. Pending feedback is immediate; every neutral response opens the same reset step. Request Another Code and Back To Sign In clear the appropriate fields. Success does not create a session. The backend, API payloads, username-only lookup, eligibility, MFA, proof expiry/replacement/single use, throttles, sessions and enumeration protections are unchanged.
- Sign In uses the exact two-sentence tagline, approved responsive typography and spacing in the runtime override stylesheet. About replaces only the existing tagline paragraph with the complete wording and bold first sentence. Versions, links, logo, short descriptor, body copy and layouts remain.

The twelve pinned HTML sources, extracted stylesheets and manifest are unchanged. README, website, #308 and #304 are excluded. The relevant recovery/developer guides, function map and active handover are updated.

## Checks

| Check | Result |
| --- | --- |
| Full backend suite | 425 run: 422 passed, three explicit skips. The skipped Docker test passed separately; two genuine private v1.3.3 fixture checks remain unavailable. |
| Existing full Chromium regression | Passed: setup/MFA, inventory/racks/IPAM/catalogues, permissions, shared editing, import/reset and saved data. |
| Focused browser batch | Passed: valid/invalid horizontal/vertical previews, both faces and rails, real temporary saves/reload, preserved internal scroll, Remove Accessory/cancel focus, verification/recovery failures/success, cancellation, navigation, resend, pending state, neutral UI and username-only payloads. UI mail/proof responses are mocked. |
| Layout and text | Passed in both themes: rack at 1440/1280/390; verification and About at 1440/1280/390/320; Sign In at 1440/1280/900/768/730/390/320. Root text at 200%, doubled Sign In/verification text and doubled About tagline reflow without document overflow. |
| Normal Inter font | 14 Sign In and eight About cases passed, using temporary downloaded font files supplied to the isolated browser. No font/dependency was added to the application. |
| Authentication visual runner | Six welcome/create/enrol/resume/complete/MFA states at desktop/mobile in both themes passed; test authenticator material was masked. |
| HTML provenance, syntax and release consistency | Passed; the published version remains v2.0.3 and nothing was published. |
| Docker | Local exact-commit private build and revision-label check passed; real Compose restart/recreation preserved SQLite and TLS. Final delivery build details are in GitHub. |
| Secret checks | Full reachable history passed with a network-disabled Gitleaks v8.24.3 scanner. Final delivery scan/result is recorded in GitHub. |

[Browser measurements](browser-results.json), [Inter layout results](inter-layout.json) and [runtime/capture hashes](checks.json) preserve bounded evidence. All data is fictional and isolated from the owner's installation. Reproduce the focused browser run with:

```sh
CAFFOOT_APPROVED_OWNER_BATCH=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/approved-owner-batch node tests/approved-visual.cjs
```

Use the established Playwright environment; `CAFFOOT_CHROMIUM_PATH` optionally selects an installed Chromium. Run the full regression with `node tests/browser-compat.cjs`, backend checks with `python3 -m unittest discover -s tests -v`, and opt-in Docker lifecycle with `CAFFOOT_DOCKER_SMOKE=1 python3 -m unittest tests.test_compose_lifecycle -v`. A managed proxy can supply the existing `CAFFOOT_BUILD_CA` setting for Docker tests.

## Rendered Review

Representative desktop/mobile captures were visually reviewed against the pinned treatment and the explicit approved amendments. The blue footprint overlays the candidate rows; the guided forms remain inside their card/column; the tagline fits the existing brand panel and About card. The earlier crowded 320px verification action row was corrected and the enlarged-text check passed. No unresolved mismatch was found in these reviewed states. This does not establish a universal pixel match or owner acceptance.

| View | Desktop Light | Mobile Dark |
| --- | --- | --- |
| Rack preview | [View](images/rack-preview-1440-light.png) | [View](images/rack-preview-390-dark.png) |
| Verification | [View](images/verification-1440-light.png) | [View](images/verification-390-dark.png) |
| Sign In | [View](images/sign-in-approved-1440-light.png) | [View](images/sign-in-approved-390-dark.png) |
| About | [View](images/about-approved-1440-light.png) | [View](images/about-approved-390-dark.png) |

## Remaining Private Acceptance

Chromium's synthetic drag events and desktop mobile-size emulation do not establish native Edge/Safari/Firefox drag or physical touch behaviour. Manual screen-reader and real browser zoom checks remain. The owner's saved verification state and SMTP/provider delivery history were not available; the missing recovery email is **not diagnosed or claimed fixed**. Mocked proofs/mail and a successful SMTP test do not prove recovery delivery. No private genuine migration export was supplied; this batch does not change migration.

## Private Docker Acceptance

1. Use a clean checkout of the development branch at the exact delivery SHA in #310/#311/#317. Verify `git rev-parse HEAD` and an empty `git status --short`. Keep the existing private test project's environment, name and `/data` mapping. Back up the entire private test data directory/volume and retain the previous local image. Do not use the owner's live installation for this acceptance run.
2. Build the exact commit locally, without publication:

   ```sh
   python3 scripts/build_private_acceptance.py --save ../caffoot-lite-private-acceptance.tar
   ```

   If required by your proxy, use the existing `--build-ca` option. The helper prints `caffoot-lite:private-<first 12 SHA characters>` and verifies its revision label. Load the private archive on the test host if necessary with `docker load --input`.
3. Keep the existing Compose configuration and volume mapping. Add only a local override naming that exact local image:

   ```yaml
   services:
     caffoot-lite:
       image: caffoot-lite:private-DELIVERY_SHA_PREFIX
   ```

   Replace the prefix and use the **existing private test project name**, original Compose file, environment and any existing overrides. Review the resolved volume mapping privately before recreation. Start without pulling or rebuilding:

   ```sh
   docker compose -p EXISTING_PRIVATE_PROJECT -f compose.yaml -f private-acceptance.yaml up -d --no-build --pull never
   ```

4. Confirm the image revision, health, retained inventory/accounts/permissions and existing MFA sign-in. Test Remove Accessory/cancel, valid/invalid accessory moves on both faces/rails, exact saved positions after reload and internal scroll after a successful vertical drop. Check keyboard controls, both themes and native browsers.
5. Check the saved email badge, dirty-address warning, password/request/code steps, resend, invalid/expired proof feedback and success with a fictional private test account and controlled mailbox. Check Forgot Password? pending/neutral feedback, reset/MFA and normal sign-in afterwards. Review provider delivery/spam records privately if mail is missing; do not publish addresses, secrets or codes.
6. Check exact tagline wording and the combined recovery layout on desktop/laptop/mobile, enlarged text and a screen reader. Confirm About version information and resource/licence links. Record owner acceptance separately in each issue. Retain the backup and previous image until acceptance is complete; rollback uses the unchanged private data mapping and normal backup policy.

No merge to main, image publication, owner deployment or release has occurred.
