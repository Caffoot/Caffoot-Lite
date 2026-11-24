# Import Legacy Inventory Or Upgrade Docker

> **Draft v2.2 — Unreleased.** These instructions describe the Stage 6.2 review build and an isolated upgrade rehearsal. For a live v2.1 installation, use the [published v2.1 guidance](https://github.com/Caffoot/Caffoot-Lite/blob/v2.1/docs/how-tos/features-and-instructions/Migration-Backup-and-Restore.md).

Choose the procedure for the installation you already have.

| Starting point | Procedure |
| --- | --- |
| The standalone v1.3.3 HTML application | Export its inventory with **Download Backup**, then use [Import legacy inventory](#import-legacy-inventory). This is a one-way transfer of inventory into Docker. |
| An existing Caffoot Lite v2.1 Docker installation | Follow [Upgrade a v2.1 Docker installation](#upgrade-a-v21-docker-installation). The application upgrades the existing SQLite database on startup. |
| A Docker installation that needs recovery | Use your external backup tooling and the [matching image and complete backup](#roll-back-using-the-complete-pre-upgrade-backup). A standalone inventory JSON file cannot recover a Docker installation. |

## Import Legacy Inventory

### Before You Start

- In the standalone application, check that you are using the [published v1.3.3 HTML version](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3). If you use an older HTML version, follow that application's upgrade guidance, open your inventory in v1.3.3 and check it before exporting.
- Set up the destination Docker installation with persistent `/data`, HTTPS and an active Administrator account with MFA enrolled. Import requires Edit access to **Devices**, **IPAM** and **Racks** together. All three features must be enabled under **Settings & Data → Optional Features**. See [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md).
- Keep your original HTML and JSON file somewhere private. The export can include equipment and network details. If the destination already contains inventory, use the [complete backup procedure](#make-a-complete-pre-upgrade-backup) before replacing it.

### Export, Review And Confirm

1. In published v1.3.3, open **Settings & Data**. Under **Back Up & Restore**, select **Download Backup**. Keep the downloaded JSON file.
2. Sign into the Docker application as Administrator. Open **Settings & Data → Data & Backups**. In **Import Existing Inventory**, select **Import v1.3.3 Inventory** and choose the JSON file from v1.3.3.
3. If the review lists Access Points, choose the correct mounting type for each one and select **Continue**. The import clears existing rack assignments for the Access Points in this review. For example, choose **Wall Mounted** for a Landing Access Point fitted to a corridor wall.
4. In the replacement review, compare the **Current** and **Import** counts for Devices, Racks, Subnets and IPAM allocations. If **Review legacy computer mounting corrections** appears, check each proposed change. For example, a Workshop Laptop with an obsolete **Rack Mounted** value may be proposed as **Desktop** with location **Unknown**. Select **I approve these mounting corrections** only if those changes are right.
5. To leave the destination unchanged, choose **Cancel**. To proceed, check **I understand that this replaces all existing central inventory (not user accounts or permissions)** and select **Confirm Import**. The application validates the replacement again and shows **Inventory imported.** after it succeeds.
6. Open **Devices**, **IPAM** and **Network Racks** and verify the results. Check representative device names, notes and custom fields, linked IP allocations and rack positions. For example, the Reception Desktop should still show asset tag `TRAIN-204` and its saved IP allocation. Existing Docker users, permissions, MFA, audit records and private settings stay with the destination.

![Import Inventory from v1.3.3 lists a Landing Access Point awaiting a mounting choice.](../../../development-handovers/evidence/stage-6-2/01-access-point-review.png)

*Choose the mounting for every listed Access Point before continuing to the counts.*

![The replacement review shows inventory counts, a Workshop Laptop mounting correction and both approval controls.](../../../development-handovers/evidence/stage-6-2/02-replacement-review.png)

*Review the counts and the proposed change to the Workshop Laptop before approving replacement.*

![The Data and Backups screen displays the Inventory imported confirmation.](../../../development-handovers/evidence/stage-6-2/03-import-success.png)

*After the confirmation appears, check the Device, IPAM and rack records themselves.*

### If A Device Is Protected

An existing Device can have Staff or Department assignment history, a handover, a stock link or movement history, associated equipment, a Supplier association, Lifecycle information or Service Desk ticket history. Those relationships still count when an optional feature is switched off. The import keeps an identical reviewed Device record, its stored revision and its linked records.

If the reviewed backup changes or omits any protected Device, Caffoot Lite rejects the entire replacement. **Backup Import Could Not Continue** lists each affected Device, **changed in the backup** or **missing from the backup**, and its protected relationship types. For example, the Reception Desktop could be missing from a backup while a renamed Workshop Laptop could conflict with its Lifecycle record. The dialog confirms that no inventory or associated records have changed. Replacement can also be rejected at confirmation if someone records a new relationship after your preview.

![Backup Import Could Not Continue lists a missing Reception Desktop with a Supplier association and a changed Workshop Laptop with a Lifecycle record.](../../../development-handovers/evidence/stage-6-2/04-protected-import-rejection.png)

*Both conflicts appear in the same rejection. Keep the original backup and review the file and mounting choices before starting again.*

| What you see | What to check |
| --- | --- |
| **Import v1.3.3 Inventory** is unavailable | Confirm the session belongs to an active MFA-enrolled Administrator and that Devices, IPAM and Racks are enabled. |
| A validation error appears | Check that you selected a fresh JSON export from published v1.3.3 and that the file is no larger than 10 MiB. If the legacy inventory has an invalid relationship, correct it in the source application and download a fresh export. |
| A protected Device is changed or missing | Use the list in the rejection dialog to check that you chose the intended backup and, where applicable, the correct mounting choices. Proceed only if the reviewed backup leaves every listed Device identical. If the only copy conflicts, stop and keep the current installation and the original export. |
| The review expires, you sign out or the application restarts | Choose the file again and repeat the review. Reviews are temporary and specific to your session. |

The screenshots use fictional inventory captured in the working application. See the [Stage 6.2 evidence record](../../../development-handovers/evidence/stage-6-2/README.md) for source revisions and checked scenarios.

## Upgrade A v2.1 Docker Installation

The Stage 6.2 rehearsal used published v2.1 schema 10 and reached v2.2 schema 28 on a disposable copy. The review procedure below applies to an authorised isolated installation. Keep the v2.1 production instance on its published version until a release and deployment have been approved.

### Make A Complete Pre-Upgrade Backup

1. Record the exact current image tag or digest, the stack or Compose project, and the storage mounted at `/data`. A named volume can have a stack or project prefix. A bind mount is a host directory. Record the HTTPS address, port and existing private configuration so you can recreate the same stack.
2. Stop the source container so the installation is consistent. Use your usual external Docker or host backup tool to copy the **whole** `/data` mount. Include `caffoot.sqlite3`, SQLite sidecars when present, `smtp-settings.json` and `account-email-secret.key` when present, `tls/` including certificate and private key, and any other installation files. Preserve file ownership and modes.
3. Check that the backup contains the expected files and can be read. Keep an access-controlled copy outside the Docker host. Keep the old image and stack definition available with the backup. Restore verification for the complete volume is handled in Stage 6.3.

### Start The Review Image And Check The Result

1. Use a separate disposable installation and a consistent copy of the stopped v2.1 `/data`. Confirm that the test stack cannot see your production mount. Use the authorised v2.2 review image for the intended revision and architecture.
2. Keep the test stack's existing `/data` mapping and working HTTPS/network settings when you replace the image. For Portainer, edit the existing test stack and replace its image reference. For Compose, change the image in the existing test definition and recreate the service in the same project. Confirm the volume mapping before starting. The application applies the pending migrations on startup.
3. Check that the instance becomes healthy and that it still presents the trusted certificate. Existing sessions end and affected outstanding email proofs are revoked. Sign in again. Legacy Readers and other active accounts moved to **IT Staff** may need to enrol an authenticator, even if their inventory access remains **No Access**. Existing authenticator details are retained. See [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md#what-an-existing-account-may-show-after-upgrade).
4. Verify representative Devices, linked IPAM and Racks records, preferences and Audit Trail entries. Check a saved profile, existing Read and Edit access and Administrator sign-in. Check that the private email settings remain readable. The upgrade maintains configured legacy access while applying the new MFA requirements.
5. Recreate the isolated container again against the same mount and repeat the health, sign-in and sample record checks. The rehearsal also checked SQLite integrity, foreign keys and unchanged rows on repeat startup. If startup fails, preserve the stopped copy and review the container log before trying again.

### Roll Back Using The Complete Pre-Upgrade Backup

Stop the upgraded container and keep a separate copy of its data if you need to investigate it. Use the external backup tool to restore the **complete matching pre-upgrade data** into a stopped, isolated target. Start it with the **matching v2.1 image and stack settings**. Check the TLS identity, MFA sign-in, inventory, profiles, permissions and private settings before relying on the recovered installation. Restoring the snapshot returns data to the time it was taken. Keep the v2.1 image away from the upgraded schema-28 database.

See [Docker recovery guidance](../../../../INSTALLATION.md#external-backup-and-recovery-of-your-docker-installation) and the [historical upgrade and restore rehearsal](../../../development-guide/Upgrade-And-Restore-Rehearsal.md) for the distinction between source upgrade evidence and complete-volume restoration.
