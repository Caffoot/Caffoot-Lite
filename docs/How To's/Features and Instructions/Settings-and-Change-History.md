# Settings, Change History and Personal Preferences

[← All feature guides](README.md)

## Two different settings areas

**Settings & Data** is an administrator-only system area. **My account** is available to every signed-in user for personal settings, security and Help & Guides. Keeping them separate means a read-only colleague can update their own password or appearance preference without receiving inventory administration rights.

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
- **Inventory Safety Check:** inspect the built-in inventory safety information before making potentially destructive changes.
- **Danger Zone — Clear System / Clean Start:** a deliberate destructive inventory operation with confirmation. Do not use it as a repair shortcut or without understanding what will be cleared.

Managed device types, manufacturers/models and locations are available through the relevant existing device catalogue controls. They remain governed by their actual permissions; these are not new system-wide settings for every viewer.

## Review Change History

1. Choose **Change History** in the sidebar if your access allows it.
2. Inspect recent entries for successful device changes, IPAM saves or rack movements.
3. Use the existing filtering/review controls shown in that section when available; do not assume history itself is an editor or a data restore facility.
4. To investigate an unexpected entry, reopen the underlying device, address or rack to check the authoritative saved values.

### Example — a change made by a colleague

Suppose *lab-switch-01* receives an updated device note. The editor saves the device. Another authorised user can reopen that device and see its updated note, and review the corresponding entry in **Change History**. The page does not continually poll while a record is already open, but navigating or reopening fetches the latest saved inventory.

## Important cautions

- **Settings & Data** is administrator-only. **My account** belongs to each signed-in user.
- Appearance choice is browser-local; the shared database stores the authoritative inventory.
- Change History helps explain actions but does not replace a consistent external database backup.
- Clear System and one-way v1.3.3 import have different consequences. Review their confirmation carefully.

See [Users, Permissions and MFA](Users-Permissions-and-MFA.md) and [Migration, Backup and Restore](Migration-Backup-and-Restore.md).