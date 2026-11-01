# Visual Asset Register — Source of Truth and Gaps

**Status as of 1 November 2026.** An issue description does **not** preserve a screenshot. Mark assets present in GitHub only after their actual bytes have been committed and verified. **No current original screen images have been recreated by guessing.**

| Visual reference | Status and actual filenames | Approval / role |
| --- | --- | --- |
| My Account — latest approved overview | **Present inside the verified [GitHub ZIP](assets/caffoot-ui-approved-artifacts-2026-11-01.zip)** as `my-account/approved-my-account-personal-details-2026-11-01.png`; original SHA-256 `ec177564f48a1e3100f9a198498b28d07fa9a0179c49ec12575964cd936d98dc` | **Approved** Personal Details, round profile image and application-wide typography/angled logo |
| Settings & Data 04.1 | **Interactive HTML and design record NOW IN GITHUB** (see [Settings & Data 04.1](assets/settings-and-data/04.1/caffoot-settings-data-concept-04.1.html) and [record](assets/settings-and-data/04.1/caffoot-settings-data-concept-04.1-design-record.md)); three original PNG screenshots are **in the GitHub ZIP** (not standalone GitHub preview files). Source pack: `caffoot-settings-data-concept-04.1-design-pack.zip`; SHA-256 `e77b4b30fee3e4e95eeb1f4415b202bd18ee811d56eafdbb5a096b68ea55896a` | **Approved direction**, with compact SMTP authentication switch |
| My Account earlier Draft 01 | **Historical interactive HTML and design record NOW IN GITHUB** (see [Draft 01](assets/my-account/draft-01-historical/caffoot-my-account-draft-01.html) and [record](assets/my-account/draft-01-historical/caffoot-my-account-draft-01-design-record.md)); four original PNG screenshots are **in the GitHub ZIP** (not standalone GitHub preview files). Source pack: `caffoot-my-account-draft-01-design-pack.zip`; SHA-256 `733b091e4b377d38f08e1fe30dbeb6972f4dcbd8396e184b9c299d51f8a3caa0` | **Superseded** overview; contains historical interactive panels and screenshots |
| Sign In / First-Time Setup | **Original visual not in GitHub**; documented in [#227](https://github.com/Caffoot/Caffoot-Lite/issues/227) | Approved text direction; original preview image not available |
| Dashboard / Device Inventory / Device Details / Device Editor / IPAM / Rack screens | **Original visual previews not all recoverable**; screen-by-screen agreements are preserved in [archive screens](screens/) and #227 | Use actual approved directions, not synthetic replacements |
| Change History → Audit Trail / Users & Permissions | **Original visual previews not confirmed available as files**; agreed design directions preserved in screen records | Preserve documented preferred layouts |

## Verified original-image archive — uploaded by the product owner

**Confirmed 1 November 2026:** [`assets/caffoot-ui-approved-artifacts-2026-11-01.zip`](assets/caffoot-ui-approved-artifacts-2026-11-01.zip) is now **in GitHub, on the draft PR #228 branch**. GitHub reports file size **2,891,301 bytes** and blob SHA-1 **`31ff2d38795876d5e36a06d51a4f4069b286d662`**, an exact match to the original ZIP's calculated Git blob hash; SHA-256 of original ZIP **`c2f7af01ffc471f45795806f04c34779acf9273c5f1c9d6b64512ed39171baa5`**. The original ZIP contains **13 successfully integrity-tested entries**, including **8 actual PNGs**, two interactive HTML references, their design records and a bundled README.

**What this means:** The actual approved **My Account Personal Details (round avatar)** PNG, all three **Settings & Data 04.1** screenshots and four superseded/historical My Account screenshots are **safely versioned as binary content inside the GitHub ZIP**. They can be downloaded and extracted to reconstruct the exact visual. **They are not individually previewable using GitHub Markdown yet** — extracting the 8 PNGs into dedicated GitHub paths is an optional convenience step, not missing source data. The **original images for other older approved screens remain unavailable**, as noted below.

## Currently version-controlled interactive references

- [Settings & Data 04.1 self-contained interactive HTML](assets/settings-and-data/04.1/caffoot-settings-data-concept-04.1.html) — approved visual direction, compact SMTP toggle
- [Settings & Data 04.1 detailed record](assets/settings-and-data/04.1/caffoot-settings-data-concept-04.1-design-record.md)
- [My Account Draft 01 self-contained interactive HTML](assets/my-account/draft-01-historical/caffoot-my-account-draft-01.html) — **superseded Overview**, useful historic Security/Appearance/Help interactions
- [My Account Draft 01 historical detailed record](assets/my-account/draft-01-historical/caffoot-my-account-draft-01-design-record.md)

The approved **My Account Personal Details** PNG is preserved **inside the verified GitHub ZIP** (not yet extracted as a standalone GitHub image). The older Draft 01 HTML MUST NOT be presented as that approved revision.

## Optional improvement — extract PNGs for native GitHub previews

The complete source images are **already stored** in the GitHub ZIP; the following dedicated paths would make those existing images directly previewable from Markdown without downloading the bundle:
- `my-account/approved-personal-details-overview-2026-11-01.png` (actual approved revised visual)
- `settings-and-data/04.1/` (exact approved self-contained interactive HTML, 3 PNG previews and written design record from the ZIP)
- `my-account/draft-01-historical/` (earlier interactive HTML, 4 PNG previews and historical design record; **superseded**)

**For optional standalone extraction:** copy the **original image bytes** from the verified GitHub ZIP, verify SHA-256 where supplied, visually inspect the individual GitHub image, update this register to **Standalone PNG Present**, and link the stable path. Do not reconstruct screenshots or link a temporary ChatGPT sandbox path in GitHub. Do not claim separate PNG files are committed before verifying them.

The user's uploaded ZIP is now **permanent GitHub branch storage**, subject to eventual merge of draft PR #228. The local copy and ChatGPT Library backup remain extra safeguards; the GitHub ZIP is the authoritative binary archive once PR #228 is merged.
