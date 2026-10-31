# Caffoot Lite — website release material (draft, not published)

**Status: Stage 6 preparation only, 31 October 2026.** This is website-specific copy and a publication handover, **not** a second set of user guides, a new product specification, or approval to change the live website. [Issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) governs the product; [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218) records release readiness. **Caffoot Lite v2.0** is now the approved Docker/SQLite release designation under #215 §28; the final release date, production image/tag and live website publication remain pending.

The website source inspected for this draft is the private `Caffoot/Caffoot-Website` repository at `main`, commit `938a7e8a17b6ac30083c88ba0ac42c3d6fefa15b`. Its current `index.html` is a single-page site with sections including `#home`, `#about-lite`, `#features`, `#getting-started`, `#showcase`, `#lite`, `#download`, `#faq` and existing `#feature/*` views. The separate `llms.txt` also describes the currently published standalone HTML application. The existing live website has **not** been modified or independently browser-verified during this draft.

## Keep the two editions unambiguous

- **Published Caffoot Lite v1.3.3:** a standalone HTML application, with browser-local inventory storage and the existing JSON backup/restore workflow. It requires neither Docker nor an account. Keep its [published release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3) available.
- **Caffoot Lite v2.0 (Docker/SQLite):** published as v2.0, with the root-only source layout update planned for v2.0.1, bringing the familiar inventory screens to a central SQLite database, HTTPS, first-run administrator setup, MFA, account management and section permissions. Its supported JSON import is a **one-way migration from a fresh published v1.3.3 backup**, not an ongoing Docker backup/restore feature.

The website currently describes the published HTML edition accurately. **The website publication remains staged on its separate PR until the versioned production image and public access are verified.** In particular, do not replace the existing `releases/latest` download link with an unreleased `next-test` image, or turn standalone instructions into Docker instructions without explicitly distinguishing the editions.

## Website-ready copy — use only after the Docker edition is released

### Introductory section

**Headline:** Caffoot Lite v2.0. Familiar inventory, shared with your team.

**Introduction:** Document devices, IPv4 addresses, VLANs and network racks in one straightforward application. Choose the standalone HTML edition for an individual browser, or install Caffoot Lite with Docker to keep a shared inventory in SQLite for authorised colleagues. The familiar Devices, IPAM, Racks and Change History workflows remain at the heart of both.

**Supporting line:** Infrastructure, Simplified. From a small home lab to a team-maintained infrastructure inventory.

**Suggested edition labels:** “Standalone HTML — browser-local inventory” and “Docker/SQLite — shared server inventory”. Avoid “no installation required” as a description of the Docker edition.

### Short feature cards for the Docker edition

**Devices and equipment:** Keep device names, types, hardware, software, locations and supported historical details together. See related primary IP addresses and rack placement from the familiar inventory screens.

**IP address management:** Document IPv4 address blocks, Network/VLAN subnets, gateways, address allocations and reservations. IPAM and device records stay linked rather than becoming separate spreadsheets.

**Racks and equipment placement:** See rack elevations and available units, including front and rear equipment and supported accessories. Record where mounted devices actually live.

**Shared inventory and user access:** Authorised users work with one SQLite-backed inventory. Administrators create accounts and grant Devices, IPAM and Racks permissions; MFA is required for administrators and editing access. Temporary device edit reservations prevent two people editing the same device simultaneously.

**Change History and familiar controls:** Review recorded inventory changes, use existing managed lists and keep the familiar validation and confirmation steps. The Docker edition does not remove supported inventory information from published v1.3.3.

### Website installation summary

**Headline:** Run Caffoot Lite on your own server.

Install the Docker edition using Docker Compose or a Portainer stack, including on a Raspberry Pi 5. Set your HTTPS browser address, server certificate identity and published host port, and preserve the container's `/data` mount for its SQLite database and certificate. On first visit, create your own administrator and complete MFA. There are no preset administrator credentials.

For the exact stack, commands, folder ownership, direct HTTPS certificate trust and reverse-proxy requirements, use the [Docker/Portainer installation guide](../INSTALLATION.md). The container listens internally on port `8080`; its host port is configurable. Do not copy example host IP addresses, expose an unreleased test image as production-ready, or suggest plain HTTP upstream.

### Website migration and backup summary

**Headline:** Bring your v1.3.3 inventory with you.

Use a **fresh JSON backup exported by published Caffoot Lite v1.3.3**, then review and explicitly confirm the one-way inventory import after your Docker administrator and MFA are configured. If your standalone HTML application is older than v1.3.3, update to v1.3.3 and export again first. Existing user accounts, MFA, roles and permissions are not replaced by this import.

**Docker backups are different:** your running installation keeps its records in the persistent SQLite database and HTTPS files under `/data`. Back up and restore the persistent data using trusted external Docker/volume or file-backup tools; a stopped-container copy is a straightforward way to obtain a consistent file backup. Keep protected backups off the Docker host and verify recovery. **Do not advertise ongoing Docker JSON export/restore within the app.** Read the [migration and backup guide](How%20To%27s/Features%20and%20Instructions/Migration-Backup-and-Restore.md).

### FAQ entries that distinguish editions

**Do I need Docker?** No for the published standalone HTML edition. The shared, multi-user SQLite edition is installed through Docker Compose or Portainer.

**Where is my inventory stored?** In the standalone HTML edition, inventory is kept in that browser and protected with exported JSON backups. In the Docker edition, the shared authoritative inventory lives in SQLite on the server's persistent `/data` mount.

**Can colleagues use Caffoot Lite together?** The Docker edition supports authorised simultaneous use, including viewing a device while someone else edits it and independent edits of different devices. One device has a single editing reservation at a time. The standalone HTML edition does not have this shared account/server model.

**How do I move from the HTML version?** Upgrade to and export a fresh backup from published v1.3.3, then use the Docker application's import review and final confirmation. This is one-way inventory migration.

**What protects my Docker inventory?** HTTPS, sign-in, required MFA for administrative/edit access and server-enforced permissions protect access. You remain responsible for trusted HTTPS deployment, protecting the server and making external, verified backups of persistent data. No software can guarantee perfect security.

### Short release announcement — hold until explicit approval

**Headline:** Caffoot Lite v2.0 — shared inventory, familiar workflows.

The familiar Caffoot Lite inventory experience is now available in a Docker/SQLite edition, alongside the published standalone HTML application. Keep track of your Devices, IPAM, Racks and Change History with administrator-managed accounts, MFA and a central database. Bring supported inventory over using a fresh published v1.3.3 backup and its review process, then protect your new installation with external backups.

Read the installation and [step-by-step user guides](How%20To%27s/Features%20and%20Instructions/README.md) before getting started. **The v2.0 version name is approved. Publication, production image and download links require the final Stage 8 release gate.**

## Single-source help and link map

Do **not** copy the seven detailed guides into the website repository. Link readers to these existing Markdown files (or use this single canonical content source if a later separately approved website integration is implemented). The in-app **My account → Help & Guides** already has six locally readable topics and eight external “Read full guide” links; **About Caffoot Lite → User Guide** already links to the shared index. Reuse these destinations rather than creating competing instructions.

| Website destination | Authoritative source in Caffoot Lite |
| --- | --- |
| Help index | [Features and Instructions](How%20To%27s/Features%20and%20Instructions/README.md) |
| First visit / getting started | [Getting Started](How%20To%27s/Features%20and%20Instructions/Getting-Started.md) |
| Equipment | [Devices](How%20To%27s/Features%20and%20Instructions/Devices.md) |
| Addressing | [IPAM](How%20To%27s/Features%20and%20Instructions/IPAM.md) |
| Rack elevations | [Racks](How%20To%27s/Features%20and%20Instructions/Racks.md) |
| Preferences and history | [Settings and Change History](How%20To%27s/Features%20and%20Instructions/Settings-and-Change-History.md) |
| Accounts, roles and MFA | [Users, Permissions and MFA](How%20To%27s/Features%20and%20Instructions/Users-Permissions-and-MFA.md) |
| Data migration / external backup | [Migration, Backup and Restore](How%20To%27s/Features%20and%20Instructions/Migration-Backup-and-Restore.md) |
| Docker, Portainer and HTTPS | [Installation guide](../INSTALLATION.md) |
| Feature overview / downloads | [Repository README](../README.md) |

**Website HTML link destinations while staging on `Next`:** `https://github.com/Caffoot/Caffoot-Lite/blob/main/docs/How%20To%27s/Features%20and%20Instructions/` followed by the exact guide filename above; the installation destination is `https://github.com/Caffoot/Caffoot-Lite/blob/Next/INSTALLATION.md`. These are **development-source** links, not promises about the eventual published branch. At release, check the chosen permanent destinations and verify them before replacing website links. Use `rel="noopener noreferrer"` with any `target="_blank"` links.

## Verified genuine screenshots for the website

All nine source images were captured from the real Docker/SQLite app with fictional inventory, visually accepted by the product owner and saved under [`docs/screenshots/`](screenshots/). **No mock-ups or personal inventory.** Use the actual PNG files, not the older HTML-era website `assets/dashboard.png`/`assets/devices.png`/`assets/racks.png` if presenting the new Docker edition. Add suitable `alt` text when displaying them; older standalone screenshots should remain clearly labelled as belonging to the standalone edition if retained.

| Website context | Source image | Suggested accessible alt text |
| --- | --- | --- |
| Main Docker overview | [Dashboard](screenshots/dashboard.png) | Caffoot Lite Network Insights with sample IP address, device and rack summaries |
| Branded access | [Sign-in](screenshots/sign-in.png) | Caffoot Lite sign-in page before credentials are entered |
| Devices | [Device inventory](screenshots/devices-inventory.png) | Fictional desktop and switch records in Caffoot Lite Devices |
| Device detail | [Device details](screenshots/device-details.png) | Read-only switch details with network, hardware and location tabs |
| IPAM subnet management | [Subnets](screenshots/ipam-subnets.png) | Caffoot Lite subnet list showing a sample Lab Network |
| IPAM allocations | [Addresses](screenshots/ipam-addresses.png) | Sample IP address grid showing assigned, reserved and free addresses |
| Rack management | [Rack elevation](screenshots/racks.png) | Front elevation of a fictional rack containing mounted network equipment |
| Self-service help | [Help and Guides](screenshots/help-guides.png) | My account Help and Guides topics for signed-in users |
| User administration | [Users](screenshots/users.png) | User Management overview showing sample roles and MFA enrolment counts |

## Publication handover — no action before approval

1. Keep the live `Caffoot-Website/main` and current standalone download, backup/security guidance, SEO text and `llms.txt` unchanged during Stage 6. The website source is currently single-page with hash-based features; no architecture change is authorised by this preparation.
2. At the approved release gate, decide and verify which URLs identify the actual published Docker edition, its version, downloadable image and canonical guides. Do not link the website's production download button to `next-test`.
3. Distinguish standalone/browser JSON backups from Docker/external SQLite backups in **all affected** feature pages, FAQ, hero text, screenshots and metadata. Do not simply globally replace “HTML” with “Docker”.
4. Remove retired-product marketing from the existing website's creator description, FAQ, editions panel and informational metadata. Do not invent a replacement product.
5. Recheck the final accessible website links, image descriptions, mobile/desktop presentation and published text **after** a separately approved website update. This draft is not evidence of live-site rendering or launch.
6. Stage 7's proportionate security review has been completed and recorded in #218. Stage 8 remains the explicit product-owner release and website-publication approval.

