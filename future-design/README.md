# Original UI references for Issue #244

These are the **only design archives supplied by the product owner** for the fresh UI discussion. They are references, not application code or approval to implement anything.

## Supplied ZIP files — verified on 1 November 2026

**1. `caffoot-ui-approved-artifacts-2026-11-01.zip`** — preserved here **unchanged**, with its exact Git blob SHA `31ff2d38795876d5e36a06d51a4f4069b286d662` and SHA-256 `c2f7af01ffc471f45795806f04c34779acf9273c5f1c9d6b64512ed39171baa5`. It contains:
- The **approved revised My Account** Personal Details screenshot (round profile image).
- The **Settings & Data 04.1** interactive HTML, design record and three screenshots.
- Earlier **My Account Draft 01** HTML, record and four screenshots; **historical/superseded**, not the approved revised My Account screen.

**2. `caffoot-settings-data-concept-04.1-design-pack.zip`** — also supplied by the owner, SHA-256 `e77b4b30fee3e4e95eeb1f4415b202bd18ee811d56eafdbb5a096b68ea55896a`. It contains exactly five files: the Settings & Data 04.1 HTML, its design record, and three screenshots. **Every one of those five files was checked and is byte-for-byte identical to the matching files inside archive 1 above.** Archive 1 therefore preserves all of its actual design contents without a second duplicate binary ZIP.

The second ZIP itself was provided in the discussion but is **not independently stored in this GitHub folder**; GitHub's available connector cannot upload this local binary attachment directly. Do not imply that it has been separately committed. The supplied design files it contains are nevertheless all preserved unchanged in archive 1.

## Current visual designs — exact standalone HTML now preserved in GitHub

These files are **subsequent new designs**, prepared after the original two ZIPs. They are not part of those older ZIPs. Each accepted HTML file is stored byte-for-byte in GitHub's `future-design` directory, so the agreed visual source is not dependent on a conversation download.

| Screen | Source file | Product-owner status |
| --- | --- | --- |
| **My Account** | [Draft 06](approved/my-account-draft-06.html) | **Approved and locked**. Global application visual/layout/navigation standard, including top-right My Account, clean sidebar, personal details and planned non-functional cards. |
| **Settings & Data** | [Draft 02](approved/settings-data-draft-02.html) | **Approved and locked**. Three tabs, backup/SMTP/maintenance reference; “Administrator Only” badge removed, actual permissions unchanged. |
| **Dashboard** | [Draft 02](approved/dashboard-draft-02.html) | **Approved under owner's stated correction, now met**. The three illustrative-data banners were removed from Overview, Network Insights and Activity & Alerts. |
| **Devices — Device Inventory** | [Draft 02](approved/devices-inventory-draft-02.html) | **Approved and locked**. Same form layout and Add Device placement as Draft 01; table rows use **Details only** instead of an overlapping three-dot menu. Existing edit/duplicate/delete/rack actions remain in the real v2.0.1 Details dialog. The catalogue/management screens are separately preserved in Devices Management Batch 02. |
| **Devices — Overview / Device Intelligence** | [Draft 03](approved/devices-overview-draft-03.html) | **Approved and locked**. All five Device Intelligence tabs retained; clicking chart categories opens Device Inventory directly with the matching filter, following existing v2.0.1 behaviour. No extra result lists or redundant helper strip below the charts. |
| **Devices — Types, Locations and Catalogues** | [Batch 02](approved/devices-management-batch-02.html) | **All six screens approved and locked**: Types, Locations, Manufacturers, Models, Software and Server Services. Add/Edit Manufacturer and Add/Edit Custom Software support multiple device types via checkboxes. Preserve existing management rules, built-in vs custom entries, archive/restore and filtered Inventory navigation. |
| **Devices — Device Details and Add/Edit/Duplicate forms** | [Batch 04](approved/devices-details-forms-batch-04.html) | **Approved by product owner**. All form layouts and interactions passed; device-type-aware OS lists retained from Batch 02, searchable inline multi-select software/services and quick-add from Batch 03, and real action labels replaced mock-up “Preview Add/Save/Restore/Delete” wording. Standalone design remains intentionally non-persistent. Physical Hardware is never shown for VMs. |
| **IPAM — Overview, IP Addresses and Manage Subnets** | [Draft 01](approved/ipam-draft-01.html) | **Owner-approved and locked**. Group IP Address Blocks with their networks/VLANs (for example Corporate Infrastructure), while preserving the published v2.0.1 IP address tile/grid behaviour, host ranges, filters, status semantics, gateway/device IP safeguards and subnet-management workflows. Interactive sample data are non-persistent. |
| **Sign In / First Run** | [Draft 02](references/sign-in-first-run-draft-02.html) | **Preferred early design, not formally locked**. Upright-logo CSS correction to Draft 01; verify full styling and flows before final acceptance. |

**The Dashboard preview's figures, names, IPs, activity and warnings are still made-up layout samples; they are not a new data source.** The owner's decision was to remove the repetitive on-screen sample-data banners, not to alter the v2.0.1 saved-data model.

**Only the standalone HTML sources are preserved in this directory.** The companion screenshot-and-HTML design ZIPs remain available as chat downloads and have **not** been committed as binaries. Do not claim the ZIP packs or their screenshots are stored here. Render the HTML to inspect the visual forms.

**Publication rule:** no Docker/GHCR preview images may be published publicly before the product owner approves the completed application release. Approval of a mockup is not permission to implement or release it.

## Missing source designs — do not invent or misrepresent

The owner **did not receive downloadable copies** of the designed Sign In / First-Time Setup, Dashboard, Devices, IPAM or Network Racks screens. Those original design screenshots/HTML **are not present in either supplied ZIP**. The existing `docs/screenshots` files elsewhere in the repository represent the published application, not proof of approved redesign artwork.

A newer **Dashboard Draft 02** and **Sign In / First Run Draft 02** have since been created and are separately identified above. The original older mockups remain unavailable; **Devices now has accepted Inventory, Overview / Device Intelligence and the six-screen Types, Locations and Catalogues batch. Device Details and Add/Edit/Duplicate forms are now also approved and preserved in Batch 04; IPAM now has an owner-approved standalone Draft 01 preserved here; Network Racks have not yet received a new standalone screen design under #244**. Do not invent files or claim that older missing artwork was recovered.

## Working boundary

- Issue [#244](https://github.com/Caffoot/Caffoot-Lite/issues/244) records the current scope and decisions.
- `main` / published v2.0.1 is the functional baseline.
- No business logic changes, especially to Rack operation or VM behaviour. Only optional SMTP Mail and My Account first name, last name, display name, email address and profile image are proposed functional additions.
- This `future-design` folder is **temporary**. Remove it after the finished redesign is delivered and accepted, as the product owner directed. Its presence is not permission to alter the running application.
