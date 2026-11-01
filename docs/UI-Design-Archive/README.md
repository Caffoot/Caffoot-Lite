# Caffoot Lite — Premium UI Design Archive

**Prepared:** 1 November 2026  
**Status:** Documentation-only draft pull request with the exact self-contained **Settings & Data 04.1** and **historical My Account Draft 01** interactive HTML version-controlled. **The original PNGs are now safely preserved inside the [verified GitHub design-asset ZIP](assets/caffoot-ui-approved-artifacts-2026-11-01.zip)**, which also includes the **approved My Account Personal Details image**. Those PNGs have not yet been extracted as individually previewable GitHub image files; see [Asset Register](02-asset-register.md).  
**Product-owner decision register:** [GitHub #227](https://github.com/Caffoot/Caffoot-Lite/issues/227)  
**Future Ideas Register:** [GitHub #222](https://github.com/Caffoot/Caffoot-Lite/issues/222)

## Why this exists

Screens previously had to be reconstructed several times because the actual approved visuals were left in separate chats. **Never rely on chat memory or a summary as the sole record of an accepted design.** Keep approval, the exact approved image, interactive reference when available, and the detailed screen behaviour together in version-controlled documentation.

## How to use these records

- **Shared design system:** [Global sidebar, branding, typography and layout](00-shared-design-system.md).
- **Individual screen agreements:** [Screens directory](screens/) — the approved directions have been copied from #227 into stable Markdown files. These documents record **layout, fields, states, permissions and owner corrections**. Do **not** re-open already settled design choices merely because the original artwork is missing.
- **Original visual-asset bundle:** [Download the actual approved-image and prototype ZIP from GitHub](assets/caffoot-ui-approved-artifacts-2026-11-01.zip) (2,891,301 bytes; SHA-256 `c2f7af01ffc471f45795806f04c34779acf9273c5f1c9d6b64512ed39171baa5`) — includes the approved revised My Account PNG, Settings & Data 04.1 previews, historical My Account previews and original HTML/records. The ZIP is verified, but the PNGs are not individual repository preview files.
- **Visual asset register:** [Present, absent and superseded images/prototypes](02-asset-register.md) — always distinguish images contained inside the GitHub ZIP from separately viewable files.
- **Frozen reference copy of issue #227:** [Owner decisions snapshot](01-issue-227-snapshot.md) — created from the issue text, not reconstructed from memory. The live issue remains the decision register for later changes.

## Current agreed state

1. **Sign In, First-Time Setup, Dashboard, Devices, Device Details, Device Editor, IPAM and Users:** chosen visual directions captured in the screen records.
2. **Network Racks:** preserve the existing v2.0.1 Rack interface and workflows, applying the agreed premium restyle; retain L/R rails, Front/Rear controls, printing, rack correction and existing safety.
3. **Change History → meaningful Audit Trail:** preferred direction is a compact event directory with a proper inspector, actor attribution, before/after information where appropriate, and no arbitrary 200-event cap. New capture/retention features need explicit technical specification.
4. **Settings & Data 04.1:** approved reconstructed visual, including in-page Docker/SQLite backup instructions, v1.3.3 import, safety and optional Email Settings with compact SMTP authentication toggle.
5. **My Account:** **latest revised visual approved** with First Name, Last Name, Email Address, editable Display Name, stable read-only Username, optional **round** profile image, and future personal services marked Planned. Its **text sizes, weights and slightly angled official Caffoot sidebar mark are the application-wide standard**.

## Rules for future iterations

- **Before approval:** keep drafts labelled Draft; don't quietly replace an earlier approved form.
- **On approval:** save the **exact** screenshot or exported render, actual interactive HTML where available, a field/interaction description, owner approval date, and any corrections. Commit all to GitHub and update #227.
- **Revisions:** use explicit version labels (e.g. 04.1 → 04.2), describe changes, and mark old variants Superseded rather than silently overwriting them.
- **No fictional completeness:** if an image is missing, say **missing**; preserve its decision record but do not invent an image or claim the source was recovered.
- **Do not build features from this archive alone.** Published v2.0.1 is the functional foundation; profile data, Audit Trail and Email capabilities require an owner-approved implementation scope before coding.

This archive contains **no application code changes** and is not approval to begin coding, create a release or alter deployed data.
