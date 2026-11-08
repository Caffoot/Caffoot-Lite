# Issue #335 — Release Preparation Evidence

Authority: [6727760353](https://github.com/Caffoot/Caffoot-Lite/issues/335#issuecomment-6727760353), using the reviewed manifest 6727715674. Starting clean branch: `feat/approved-modular-html-282`, SHA `e39e58d1a270afd9f4cdae114668f5e2bb1fe771`. This is preparation for owner review, not merge/publication authority.

## Documentation Checkpoint

README, installation/upgrade/rollback instructions, current Portainer example, applicable user guides/compatibility copies, detailed prepared release notes, version-only About references and historical handover are prepared. The old Portainer example is preserved under historical/portainer; old release notes and old upgrade headings remain. The handover is archived at the existing verifier's required path with relative incoming/outgoing links repaired and evidence retained in its existing location.

The only application changes are two version string values, plus the matching browser version expectation. No function, UI structure, style, route, database/security policy or inventory behaviour is changed. All twelve pinned source files, provenance, release verifier and workflows remain unchanged. The About field label is retained to follow the existing verifier; the repository's v2.1 status is explicitly unreleased throughout preparation.

- Existing release preflight for v2.1: passed.
- Existing release-documentation/guide compatibility checks: passed.
- Release preflight unit tests: seven passed.
- Relative links affected by handover move: no unrepaired relative references found.
- Full regression and the one approved disposable upgrade: pending at this checkpoint.

## Verified Published Starting Image

[Image/source check](old-image-check.json): published `ghcr.io/caffoot/caffoot-lite:v2.0.3`, immutable digest `sha256:e3606870dfafd9178fd622727dd753f3cf2439574ab45f18807330ccaee5c116`, AMD64. The image has no revision label. All 45 packaged application files match published tag commit `986e73636e3dac198c7af11954fd11885eb60150`; no mismatches. This is stronger source evidence than assuming a missing label exists.

The single disposable exercise will use fictional full-/data state created with that old application, then upgrade the same isolated mount to the exact committed v2.1 candidate. It must record schema progression, logical record/account/security preservation, TLS/key identity and modes, restart/recreation and complete pre-upgrade restore. No result is claimed before execution. No owner/Pi data, installation or website is involved.

## Remaining Gates

Two genuine private v1.3.3 automated fixtures remain unavailable; the owner's successful manual import is separate evidence. Native owner acceptance is scenario-specific, not exhaustive screen-reader/touch or byte-for-byte private-import verification. Public AMD64/ARM64 image/accessibility verification belongs to a separately authorised publication. Website design/content and deployment remain separate. Final tested candidate/delivery SHAs, results and any limitations will be recorded in #335; no merge, tag, image push, release or installation change is authorised.
