# Settings, Audit Trail and Personal Preferences

[← All feature guides](README.md)

*Some screenshots show an earlier Docker edition for orientation. The instructions describe the published v2.1 interface; older images should not be mistaken for new v2.1 captures.*

## Two different settings areas

**Settings & Data** is an administrator-only system area. **My account** is available to every signed-in user for personal settings, security and Help & Guides. Keeping them separate means a read-only colleague can update their own password or appearance preference without receiving inventory administration rights.

All signed-in users can find short, locally readable topics under **My account → Help & Guides**, with links to these longer guides.

![Caffoot Lite My account Help and Guides with expandable help topics](../../screenshots/help-guides.png)

## My account — step by step

1. Choose **My account** near the bottom of the sidebar.
2. Select the **Security** section to manage your password and authenticator enrolment. Follow the current prompts; entering an MFA code in the application is not the same as entering it into a documentation website.
3. Select **Appearance** to choose **Light Mode**, **Dark Mode** or **Use System Setting**. Your selection is stored in *this browser*. It does not change another person's appearance.
4. Choose **Help & Guides**. Expand any existing topic to read brief instructions without depending on an external website. Select its **Read full guide** link to open the longer instructions in a *new tab*, when GitHub is reachable.
5. Choose **About Caffoot Lite** for the product name, version status, documentation links and licence information.

## Settings & Data (administrator)

Open **Settings & Data** in the sidebar with an administrator account. The existing system controls include:

- **Import Inventory / Import from published v1.3.3:** choose a supported JSON export and review the proposed inventory replacement before confirming it. This is *one-way migration*; not a routine backup/restore service.
- **Database backups:** guidance for external Docker/volume/database backup tooling. The running Docker edition has no ongoing in-browser JSON backup export.
- **Inventory Safety Check:** choose **Check Inventory Safety** to reload the central inventory and run the existing on-demand consistency checks without changing saved records.
- **Danger Zone — Clear System / Clean Start:** a deliberate destructive inventory operation with confirmation. Do not use it as a repair shortcut or without understanding what will be cleared.

Managed device types, manufacturers/models and locations are available through the relevant existing device catalogue controls. They remain governed by their actual permissions; these are not new system-wide settings for every viewer.

## Review Audit Trail

1. Choose **Audit Trail** in the sidebar if your access allows it.
2. Inspect recent entries for successful device changes, IPAM saves or rack movements.
3. Use the existing filtering/review controls shown in that section when available; do not assume history itself is an editor or a data restore facility.
4. To investigate an unexpected entry, reopen the underlying device, address or rack to check the authoritative saved values.

### Example — a change made by a colleague

Suppose *lab-switch-01* receives an updated device note. The editor saves the device. Another authorised user can reopen that device and see its updated note, and review the corresponding entry in **Audit Trail**. The page does not continually poll while a record is already open, but navigating or reopening fetches the latest saved inventory.

## Important cautions

- **Settings & Data** is administrator-only. **My account** belongs to each signed-in user.
- Appearance choice is browser-local; the shared database stores the authoritative inventory.
- Change History helps explain actions but does not replace a consistent external database backup.
- Clear System and one-way v1.3.3 import have different consequences. Review their confirmation carefully.

See [Users, Permissions and MFA](Users-Permissions-and-MFA.md) and [Migration, Backup and Restore](Migration-Backup-and-Restore.md).

## Email And Audit Trail

Administrators configure optional outgoing delivery under Settings & Data → Email and can send a test message. Working test delivery does not verify an account address or prove recovery eligibility. Keep mail credentials private. Normal inventory work does not require SMTP.

Audit Trail includes the approved secondary navigation before relevant cards, filters and recorded detail. Visibility and private detail are permission-filtered; limited users must not receive unrelated sections. Inventory history remains attributed and bounded, including complete bulk subnet counts with omitted-detail notices. It is not a restoration mechanism.
