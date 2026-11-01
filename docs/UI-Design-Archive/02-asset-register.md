# Visual Asset Register — Source of Truth and Gaps

**Status as of 1 November 2026.** An issue description does **not** preserve a screenshot. Mark assets present in GitHub only after their actual bytes have been committed and verified. **No current original screen images have been recreated by guessing.**

| Visual reference | Status and actual filenames | Approval / role |
| --- | --- | --- |
| My Account — latest approved overview | **Available in design session, NOT in GitHub:** `caffoot_lite_my_account_dashboard.png`; SHA-256 `ec177564f48a1e3100f9a198498b28d07fa9a0179c49ec12575964cd936d98dc` | **Approved** Personal Details, round profile image and application-wide typography/angled logo |
| Settings & Data 04.1 | **Available in design session, NOT in GitHub:** `caffoot-settings-data-concept-04.1-design-pack.zip`; SHA-256 `e77b4b30fee3e4e95eeb1f4415b202bd18ee811d56eafdbb5a096b68ea55896a` | **Approved direction**, with compact SMTP authentication switch |
| My Account earlier Draft 01 | **Available in design session, NOT in GitHub:** `caffoot-my-account-draft-01-design-pack.zip`; SHA-256 `733b091e4b377d38f08e1fe30dbeb6972f4dcbd8396e184b9c299d51f8a3caa0` | **Superseded** overview; contains historical interactive panels and screenshots |
| Sign In / First-Time Setup | **Original visual not in GitHub**; documented in [#227](https://github.com/Caffoot/Caffoot-Lite/issues/227) | Approved text direction; original preview image not available |
| Dashboard / Device Inventory / Device Details / Device Editor / IPAM / Rack screens | **Original visual previews not all recoverable**; screen-by-screen agreements are preserved in [archive screens](screens/) and #227 | Use actual approved directions, not synthetic replacements |
| Change History → Audit Trail / Users & Permissions | **Original visual previews not confirmed available as files**; agreed design directions preserved in screen records | Preserve documented preferred layouts |

## Files to place into the repository when available

Create `docs/UI-Design-Archive/assets/` with consistent subfolders:
- `my-account/approved-personal-details-overview-2026-11-01.png` (actual approved revised visual)
- `settings-and-data/04.1/` (exact approved self-contained interactive HTML, 3 PNG previews and written design record from the ZIP)
- `my-account/draft-01-historical/` (earlier interactive HTML, 4 PNG previews and historical design record; **superseded**)

**Mandatory procedure:** copy the **original files**, verify SHA-256 where supplied, visually inspect the version-controlled preview, update this register to **Present in GitHub**, and link the stable repo path. Do not link a temporary ChatGPT sandbox path in GitHub. Do not mark any non-existent files as archived. Avoid committing experimental image/font binaries not needed for the design handover.

The user has also been provided one combined local pack, `caffoot-ui-approved-artifacts-2026-11-01.zip`, containing the original files available in the current design session. Its local download link is **not permanent GitHub storage**.
