# Private pre-release review — 10 October 2026

Version: `1.0.0`, prepared privately after owner-reported acceptance; publication approval and public release are complete. This review is a focused engineering review, not a formal security audit or accessibility certification.

## Privacy and source/history scope

Reviewed the main-branch history through `12568fd0c8dcf71218909a7abd127b233e954bb3`: 208 commits, 226 unique blobs, including 222 readable text blobs and four branding image blobs. Recursive trees were retrieved for every commit, including deleted historical development documents. Only `main` was returned by the branch inventory; the tag-ref inventory was empty. Later changes in this preparation pass are also reviewed and tested before the new commit.

Common private-key markers, GitHub/AWS/OpenAI token patterns, email-address patterns, and quoted password/secret/API-key/access-token assignments produced no findings in the text blobs. Pattern scanning cannot prove that arbitrary credentials or sensitive prose are absent. IPv4 values reviewed are source examples, placeholders and automated-test fixtures; no saved inventory/credential export was found among repository paths. Current starter inventory arrays and IPAM are empty.

Legacy source retains names of historical server/software options (for example Swan, Planet and TMS) and old NetMini/Personal development terminology in commit history. These are compatibility labels and development history, not actual customer inventory or credentials. This review does not rewrite history or remove historical detail keys needed to read older backups. The owner's software copyright attribution and repository identity are intentional public-facing information. The three PNG branding files had no metadata keys reported by Pillow. Branding image bytes are packaged as the approved project assets; no ownership certification is claimed.

The generated HTML embeds styling, fonts and branding. Normal use does not need outbound requests. The only application `fetch` is the manually invoked public GitHub latest-release check: fixed URL, no inventory payload, credentials omitted, no referrer. Following Official releases is a user-initiated external navigation. Developer source still references Tailwind/Font Awesome CDNs and must not be distributed as the offline artifact.

Browser-local data is unencrypted; JSON exports can contain sensitive infrastructure details. This is documented. Audit history, preferences and recovery snapshots are stored separately and are not included in standard inventory backups. No analytics, telemetry upload, WebSocket or beacon API was identified in current source. Escaping/import/rollback tests remain release gates.

## Licence verification and packaging

Direct build dependencies are pinned to Tailwind CSS 3.4.17 and Font Awesome Free 6.4.0. Repository copies of their licence texts were compared to the installed package licence files after `npm ci`: both match after trimming surrounding whitespace. The build embeds the complete app MIT licence, third-party notices, Font Awesome text (icons/code/fonts licences) and Tailwind MIT text into the standalone HTML. Users can open Software licences from About Caffoot Lite offline.

The release package script repeats dependency-notice comparison, requires matching app/package versions, verifies embedded licence markers, and builds a version-named ZIP with exactly the reviewed members. It compares every extracted member's SHA-256 against its source bytes. The ZIP includes the runnable HTML, app/third-party licences, installation/user guides, backup contract and clearly fictional backup examples. SHA256SUMS records member hashes inside the ZIP, with HTML/ZIP hashes beside it.

This verifies the licences for the runtime components actually embedded; it is not a claim of legal advice or a licence audit of every build-only transitive tool. Caffoot branding policy remains separate from the code licence.

## Upgrade/data contract evidence

Schema-v1 and legacy populated fixtures exercise actual normalisation, unchanged input JSON, unknown field/historical details preservation, device/IPAM repair and unsupported-schema rejection. Migration now operates on a detached copy instead of mutating the caller's parsed backup. The future Pro transactional importer is specified but not implemented or tested.

The new generated-file browser test covers export, import into a moved/renamed HTML copy, cancellation, unsupported future schemas, reload persistence, offline feedback/guide and licence access. Automated results must be green before owner testing. Chromium results do not establish Safari file storage behaviour or actual VoiceOver announcements.

## Remaining manual evidence

See `RELEASE-ACCEPTANCE.md` for owner-reported Safari appearance, positive VoiceOver feedback and confirmed backup export/restore/reopen acceptance. Individual numbered checklist results were not separately reported; the record does not claim formal screen-reader or accessibility certification. Stable version preparation and automated rerun follow this acceptance; publication remains a separate owner decision.

### Local file storage scope

The upgrade test observed shared browser storage across original and renamed HTML paths in the CI Chromium profile. Do not assume separate folders protect separate inventories: restoring in a new copy can change data visible in the old copy. Other browsers may isolate paths. Keep an exported JSON backup outside the browser; use a separate browser profile for isolated test inventories. The test asserts restoration and persistence according to the observed scope instead of assuming isolation.

## Final automated result

All checks passed for source commit `be6eac2304fd4dd60582d3c884b61fc85767dba0`, workflow `38063343516`. This includes all existing browser checks and the new populated upgrade test. The verified version-named ZIP and checksum list were uploaded as a private Actions artifact. No tag, public release or visibility change was made. Subsequent owner-reported Safari and VoiceOver feedback is recorded in RELEASE-ACCEPTANCE.md; stable 1.0.0 subsequently passed its full automated rerun.


## Publication completed — 10 October 2026

The owner explicitly approved making `sdelnevo/Caffoot-Lite` public and publishing Caffoot Lite v1.0.0 with the prepared downloads. The owner changed repository visibility to public. The final stable source commit `6f5d38e6959016fb236763f8f7a241de14d23c83` passed the complete automated suite in [workflow 38064002992](https://github.com/caffoot/Caffoot-Lite/actions/runs/38064002992). [Publication workflow 38065143351](https://github.com/caffoot/Caffoot-Lite/actions/runs/38065143351) verified that exact artifact, finalised release-note wording without changing runnable HTML, checked package member hashes and uploaded asset digests, then published the stable release.

[Caffoot Lite v1.0.0](https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.0.0) includes `Caffoot-Lite-1.0.0.zip`, `Caffoot-Lite.html` and `SHA256SUMS`. The tag points to the tested source commit. Earlier private-preparation results below are retained as historical evidence.
