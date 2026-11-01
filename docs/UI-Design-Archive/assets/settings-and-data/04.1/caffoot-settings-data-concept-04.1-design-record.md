# Caffoot Lite — Settings & Data — Visual Design 04.1 (Accepted Direction)

**Date:** 1 November 2026  
**Status:** **Product-owner accepted visual direction, 1 November 2026, with compact SMTP toggle correction applied. No application implementation authorised.**  
**Project:** Caffoot Lite, building on published v2.0.1  
**Reference:** GitHub issue #227, sections 11–12, and earlier Concept 13 records under issue #226.  
**Purpose:** Create a concrete, reproducible visual screen that can be reviewed and archived **without relying on ChatGPT conversation memory**. This is a **new reconstruction** based on the written brief, not a recovered copy of the lost original design.

## Exactly what is saved in this package

- `caffoot-settings-data-concept-04.1.html`: **the actual interactive screen design**, self-contained with its styles, scripts and Caffoot logo embedded. Opens in a browser without installation, login, internet access or a server.
- `caffoot-settings-data-backups-preview.png`: full-page desktop screenshot of the default Data & Backups view.
- `caffoot-settings-data-email-preview-v04.1.png`: full-page desktop screenshot of the Email Settings view.
- `caffoot-settings-data-maintenance-preview.png`: full-page desktop screenshot of the System Maintenance view.
- This design record: the permanent written layout, control and interaction specification for this precise draft.

## Global layout — the accepted style

- **Main application shell:** deep navy sidebar, Caffoot hedgehog/logo at top, device/IPAM/rack/audit/user navigation, **Settings & Data** selected near bottom, **My Account** separate, administrator identity and a single bottom **Collapse Menu** control.
- **Main region:** light grey-blue canvas, slim white application header, "Caffoot Lite › Settings & Data" breadcrumb, administrator indicator. Main page headline "Settings & Data" and orange "System Administration" eyebrow.
- **Brand and typography:** navy `#142b43` / `#203b55`, orange primary action `#ed8532`, white cards, restrained borders `#e1e8ee`, 9–15px corner radii, typography in the Inter/system sans-serif family; Title Case on all navigation, fields, headings and buttons.
- **Audience:** an administrator-only page. Do not mix personal password, MFA or appearance controls into it. Every ordinary user retains **My Account** separately.
- **Responsiveness:** wide two-column cards at desktop widths; stack at narrower widths. The prototype was rendered and checked for no horizontal overflow at 1440, 760 and 390 pixels.

## Screen A — Data & Backups (the default landing view)

Header: "Protect Your Caffoot Data" and a Docker/SQLite context cue. Two-column composition on wide displays:

**Left, larger card — Database Backup Guide:**

1. **Locate Your Actual Data Volume** — inspect your Caffoot Lite Docker/Portainer configuration; identify what maps to `/data`. Named volumes may have a Compose project prefix.
2. **Stop Caffoot Lite Safely** — do not take an arbitrary live file copy of SQLite.
3. **Archive the Data Volume** — show a `docker volume ls` lookup and an example stopped-stack archive command, each with a **Copy** action. Require replacement of `ACTUAL_VOLUME_NAME` with the user's verified name. This example is for Linux-host Docker and named volumes; bind mounts need different handling.
4. **Secure, Test and Restart** — verify/store the archive, restart the stack, and practise restores to an isolated test installation.

The instructions are **visible directly on the screen**, not buried behind an external documentation link. A caution box explains the stopped-application requirement and differences for a bind mount.

**Right card — Import Existing Inventory:** existing JSON migration from published standalone v1.3.3, with distinct Select File → Review → Confirm steps, a one-way-migration warning and an orange **Import Inventory** action. The actual application must use the published confirmation/safety rules.

**Right lower subsection — Storage & Recovery:** named volume default for a new Docker installation, protect existing mount mappings on upgrade, and optional link to the maintained full installation guide.

## Screen B — Email Settings

- A cohesive **navy header band** with "Email Settings", icon, explanation and a clear **Not Configured** status indicator. No email service is required for normal installation or operation.
- **Left/main SMTP form:** SMTP Server, Port, Connection Security (STARTTLS, SSL/TLS, unencrypted option shown *for explicit security review*, not approved as a safe production default), SMTP Authentication toggle, Username and masked Password; Sender Name and From Email Address.
- **Right contextual test panel:** recipient address and **Send Test Email** action, with clear distinction between testing and saving and a safe place for results/errors.
- **Bottom form actions:** Discard Changes and prominent orange **Save Email Settings**.
- **Below the form, "Email-Enabled Features":** shows the intended connection to **Password Recovery**, **Administrator Notifications**, **Audit & Report Delivery**, and eventual **Service Desk & Tickets**. These are design destinations, not claims about current v2.0.1 behaviour or a completed implementation. Product owner has recalled password recovery/notifications as part of the intended next development; precise inclusion and secure behaviour must be confirmed in the functional specification without another generic re-design.
- Real secret masking, persistence, access, recovery tokens, notification triggers and SMTP security are not implemented by the preview.

## Screen C — System Maintenance

- Two balanced cards: **Inventory Safety Check** and **Danger Zone**.
- Safety retains the existing on-demand read-only check. The prototype shows a clear call to action but never actually runs a check.
- Danger Zone keeps **Clear System / Clean Start** separate with warnings and deliberate confirmation. A working **preview-only modal** demonstrates the safeguard but its destructive action is permanently disabled.
- The final application must preserve the existing handling of users, permissions and history when inventory is cleared.

## Prototype behaviours and constraints

- Tabs **Data & Backups / Email Settings / System Maintenance** work.
- The single bottom sidebar Collapse/Expand control works.
- SMTP authentication toggle enables/disables the corresponding sample credential fields.
- Copy buttons attempt to copy the example command, subject to browser clipboard permissions.
- Test/send/save/import/safety controls show informative **prototype-only** messages; there are **no network requests, writes, user account changes, real email messages or live database checks**.
- Danger Zone modal can open and close, but cannot clear anything.
- All sample values, credentials and account information are illustrative.

## Approval and archival rules

1. **The product owner described Concept 04 as “perfect” and “almost identical” to the older accepted form.** The only requested correction was the SMTP Authentication switch being too long, caused by generic input CSS overriding its width. That is fixed in 04.1 to exactly 37 pixels, verified in Chromium. This visual direction is accepted; this is not permission to implement application code.
2. If approved, archive **both the exact HTML and the screenshots** with this design record in the repository's design documentation (with product-owner permission), and link them directly from issue #227. The issue's written notes alone are **not** a replacement for the actual visual.
3. Record any subsequent change as a new numbered revision, with a reason and screenshot, rather than silently replacing the earlier design.
4. Never equate visual approval with permission to start Caffoot Lite application coding, branches or releases.
5. Preserve Caffoot Lite v2.0.1 user data, feature behaviour, install compatibility and safety rules unless the product owner explicitly approves changing them.

## Concept 04.1 minor correction

The SMTP Authentication switch is now a compact fixed 37px toggle rather than a stretched input control; all other layout elements remain intact. Screenshot `caffoot-settings-data-email-preview-v04.1.png` captures the corrected result. The original historical earlier screenshot has not been recovered; 04.1 is a new reconstruction accepted as matching the agreed direction.