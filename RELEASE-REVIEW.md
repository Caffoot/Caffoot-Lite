# Private pre-release review — 10 October 2026

Candidate: `1.0.0-rc.1`. Planned stable version: `1.0.0`, subject to final manual acceptance and explicit owner publication approval. This review is a focused engineering review, not a formal security audit or accessibility certification.

## Privacy and source/history scope

Reviewed the main-branch history through `12568fd0c8dcf71218909a7abd127b233e954bb3`: 208 commits, 226 unique blobs, including 222 readable text blobs and four branding image blobs. Recursive trees were retrieved for every commit, including deleted historical development documents. Only `main` was returned by the branch inventory. Later changes in this preparation pass are also reviewed and tested before the new commit.

Common private-key markers, GitHub/AWS/OpenAI token patterns, email-address patterns, and quoted password/secret/API-key/access-token assignments produced no findings in the text blobs. Pattern scanning cannot prove that arbitrary credentials or sensitive prose are absent. IPv4 values reviewed are source examples, placeholders and automated-test fixtures; no saved inventory/credential export was found among repository paths. Current starter inventory arrays and IPAM are empty.

Legacy source retains names of historical server/software options (for example Swan, Planet and TMS) and old NetMini/Personal development terminology in commit history. These are compatibility labels and development history, not actual customer inventory or credentials. This review does not rewrite history or remove historical detail keys needed to read older backups. The owner's software copyright attribution and repository identity are intentional public-facing information. Branding image bytes are packaged as the approved project assets; no separate metadata/ownership certification is claimed.

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

See `RELEASE-ACCEPTANCE.md`: Safari upgrade/move/rename steps 1–7 and VoiceOver steps 1–6 need explicit owner results on the latest candidate. A previous release-note claim of a completed VoiceOver walkthrough was unsupported by the detailed roadmap and has been corrected. Stable version bump and final rerun follow acceptance; publication remains a separate owner decision.
