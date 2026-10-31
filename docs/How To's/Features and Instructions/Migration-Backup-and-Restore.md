# Migration, Backup and Restore

[← All feature guides](README.md)

## Two different jobs

**Import from published Caffoot Lite v1.3.3** is a **one-way migration** from the earlier single-browser HTML application into the Docker/SQLite inventory.

**Ongoing Docker backup and restore** means protecting the application's persistent SQLite database and HTTPS identity using tools outside Caffoot Lite. It is **not** a repeat of the old browser JSON export feature.

## Before you migrate

1. Identify the version of the *HTML* Caffoot Lite file you currently use. Direct imports into the Docker edition are supported from **published v1.3.3** only.
2. If your HTML copy is older, update it to v1.3.3 first, review its inventory and export a fresh JSON backup from that published version.
3. Keep the original HTML file and backup somewhere safe. Migration is one-way, and does not turn your new Docker database back into an HTML backup.
4. Set up the Docker edition with its first administrator, MFA, HTTPS and persistent **/data** directory **before** importing. Import does not create or replace the administrator's password/MFA/user accounts.

## Import into Docker/SQLite — step by step

1. Sign in as an administrator.
2. Open **Settings & Data** and find the **Import Inventory** section heading.
3. Under **Import from published v1.3.3**, choose **Choose Backup File** and select the fresh JSON export from published v1.3.3.
4. Read the **Import Inventory from v1.3.3** review screen. Check device, IPAM, rack and historical/custom fields, plus any required corrections. Where access-point mounting choices are required, review each selection; older mount assignments may need to be cleared for those specific records.
5. If anything looks wrong, **Cancel**, correct the source or review choice as appropriate, then start again. The review is not the final save.
6. Explicitly **Confirm** the supported inventory replacement only when the proposed results are correct.
7. After completion, navigate through **Devices**, **IPAM**, **Racks**, **Settings** and **Change History** to check the imported inventory and linked information.

The importer preserves supported inventory data and relationships. It does **not** import user accounts, passwords, roles or MFA from the standalone browser edition. Never use a migration import as an informal way to merge two independent Docker installations.

## Where Docker data lives

The container uses **/data/caffoot.sqlite3** for SQLite and **/data/tls** for persistent HTTPS certificate material. The data mount must survive image updates and container recreation.

In the tested Raspberry Pi Portainer example, the host directory is:

    /portainer/Files/AppData/Config/caffoot_data

Choose the correct host path for your actual installation rather than assuming the Pi example applies to every machine. The Docker process uses a non-root account; see the [installation guide](../../../INSTALLATION.md) for ownership and Compose/Portainer settings.

## Make a manual consistent backup

Use your existing trusted Docker, server or NAS backup tools. For a simple **stopped-container** file backup:

1. Ensure no one is making inventory changes; stop the Caffoot container in Portainer or Docker.
2. Copy the **entire persistent data directory**, including the database and TLS certificate/key material, to a protected backup destination.
3. Verify that the copy contains the expected database and TLS files.
4. Start the normal container again and confirm that sign-in and inventory still work.
5. Store a separate backup **off the Caffoot server** for resilience against hardware failure, and protect the files from unauthorised access.

Do not copy an actively changing SQLite database as ordinary files and assume it is consistent. Use a stopped-container copy or a backup utility that explicitly supports SQLite consistency.

## Restore safely

A restoration test is safest in a *separate test folder/isolated installation* rather than by overwriting your only functioning database.

1. Check that the backup is complete and corresponds to the intended installation.
2. Stop the target container, then restore the saved data directory into the path mounted as **/data**, retaining correct ownership/permissions.
3. Start the target container and verify HTTPS identity, administrator sign-in, inventory, related IPAM/rack data and any account permissions.
4. Keep the original known-working files until recovery has been verified. Do not delete your only database or TLS private key just to run an acceptance test.

The product owner verified a local stopped-container copy/restore on a disposable Raspberry Pi test host. That proves basic local recovery, **not** that a separate off-site backup already exists or that storage failure cannot cause data loss.

## Distinguish maintenance from recovery

- **Container recreate/update:** should retain the existing mounted data, but does not itself make a backup.
- **v1.3.3 JSON import:** a one-way inventory migration, not a Docker database backup.
- **Clear System / Clean Start:** a destructive inventory maintenance action, not a restore mechanism.
- **Change History:** explains saved changes but is not a copy of the application database.

For exact deployment examples, environment names and certificate verification, follow [Docker and Portainer installation](../../../INSTALLATION.md).