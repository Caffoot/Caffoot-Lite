# Batch 7B — Static Verification

27 November 2026. Focused static documentation/image checks passed. Independent ChatGPT review and separate product-owner visual/privacy/caption/alt acceptance of new 7B images remain pending. No publication or application acceptance is implied.

[Pack record](README.md) · [All 16 groups / 79 specifications](Coverage.md) · [New and reused provenance](manifest.json)

| Check | Verified result and limit |
| --- | --- |
| New instructional PNG count | 25: accounts, roles and MFA 18/20; Staff 7/8; total 25/28 maximum |
| Approved existing reuse | Exactly RE02/RE04/RE06, referenced at original paths; 3/3 hashes also match the original recorded hash file |
| Hashes and decoded raster dimensions | 25 new and three reused images, 28/28 match manifest; all PNGs decode |
| Browser, viewport and theme | Chromium 156.0.8078.79, installed Playwright 1.62.0, light, scale 1; 24 viewports at 1440 × 1050 and one access review at 1440 × 1200; actual full-page raster dimensions recorded separately |
| Original 7B traceability | All 16 original groups, 79 unique specification IDs in original order, original labels and unabridged contracts retained; each mapped to actual direct/representative illustration and/or approved written instructions |
| Shared illustration | One Security screen illustrates both voluntary MFA starting controls and My Account password change; later section links to the same image rather than adding another capture |
| Guide presentation | All 25 new images and three approved reuse images embedded once across the two guides; 28 non-empty alt texts and captions match manifest strings |
| Accepted written procedures | All 170 original non-presentation paragraphs retained verbatim; only superseded screenshot/caption/variant paragraphs, status and provenance notices replaced; native-confirmation wording added |
| Relative destinations and anchors | 881 relative destinations and 233 applicable local heading/explicit anchors resolve across 15 affected Markdown documents |
| Markdown structure | Balanced fences, consistent table columns and git diff --check pass |
| Privacy and visual preparation | All 25 final PNGs opened individually; password and one-time-code fields asserted empty during capture; no QR/setup-secret capture or masking; only fictional identities and example.invalid email addresses; changed text checked against fixture secrets |
| Original requirement records | Batch 3 review unchanged; entire Batch 7 Requirement Register from its heading onwards remains byte-identical to the starting documentation revision |
| Batch 7A acceptance | 38/40 images accepted, 19 groups and 85 unique specifications retained; exact B2-17-S02 written substitution in Optional Features and live records; original dated blocked/verification text preserved as history |
| Batch 7A image and provenance preservation | 38/38 hashes/dimensions match; original PNG bytes and every original non-status provenance field retained; acceptance additions are administrative, not a recapture or runtime retest |
| Complete Git tree from authorised start | 42 paths differ: 13 existing documentation paths and 29 new pack paths (25 PNGs, three Markdown records, one manifest); all 2,132 other starting mode/blob identities preserved; no deletion or mode change |
| Application baseline preservation | Every existing path outside docs retains its complete mode/blob identity from pinned application baseline, including application, assets, configuration, schema, tests and AGENTS.md; schema remains 31 |
| Runtime/CI limit | Only the approved local fictional application states were prepared for instructional captures. No unrelated tests, comprehensive regression, full CI run/monitoring or deferred acceptance work |

Application/integration baseline: `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`. Starting documentation: `8c790ad91a969b35a2b610f7fe7dd4e8a87daea4`. Published v2.1: `c3237114108cad9f7d4e57657b6aed5e0091a5ef`. All three remote refs matched the authorised checkpoint before edits. Initial projectless workspace had no mounted checkout or saved fixture; the public authorised branch was fetched into a separate work directory. Unrelated workspace files were preserved. Existing browser automation was reused with repository fixture/navigation helpers; nothing was installed.

The existing local mail-sink fixture supplies only the email-confirmation request state. No real email delivery, successful verification or successful recovery is asserted. The recovery response for the fictional recovery-owner request establishes neither account existence nor eligibility. The access preview is unconfirmed, the custom role and optional login are drafts, and only the explicitly named saved profile, disabled-login and offboarding images are described as saved outcomes. Original Morgan reuse keeps its timestamp and complete actor/feature-metadata limitations.

[Batch 7A independent and owner acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7211815146) includes its stated limits: the independent reviewer did not recompute every hash or rerun the full static suite. This assignment's hash checks are separate static evidence, not an expansion of that earlier review claim. No 7A recapture, application retest or virtual-display tooling.

Delivery is confined to the authorised documentation branch. The pushed SHA and remote verification are reported at delivery; PR #472 remains open, draft and unmerged targeting milestone-1, with issue #366 open. Batch 7C–7H, Batch 8, native acceptance, private deployment, migration/upgrade/backup/restore rehearsals, private export investigation, security audit, website, PR promotion, merge, release and publication remain outside scope. Stop after 7B pending independent review and separate owner visual acceptance.
