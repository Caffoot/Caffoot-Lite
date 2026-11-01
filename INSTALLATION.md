# Caffoot Lite v2.0.1 — Docker / SQLite installation

Caffoot Lite **v2.0.1** packages the established Docker/SQLite application in a clean repository-root layout. It preserves the approved v2.0 functionality: central SQLite inventory, familiar Devices/IPAM/Racks/Change History, administrator setup, MFA, permissions and simultaneous multi-user access. Only **published standalone v1.3.3 JSON inventory backups** are accepted for one-way migration. For everyday use, follow the [Features and Instructions guides](docs/How%20To's/Features%20and%20Instructions/README.md).

The published [v2.0 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0) remains unchanged. For v2.0.1, use the tagged production image `ghcr.io/caffoot/caffoot-lite:v2.0.1` **after** the [v2.0.1 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1) and its multi-platform image build are confirmed. The earlier `next-test` image is not the production package.

## HTTPS Docker Compose / Portainer setup

Set **your own** browser address and certificate identities before running Compose. Nothing is hard-coded for a particular installer. For example, in a local `.env` file alongside `compose.yaml`:

```dotenv
CAFFOOT_WEB_ADDRESS=https://192.168.1.100:8080
CAFFOOT_SERVER_ADDRESS=192.168.1.100
CAFFOOT_PORT=8080
```

Replace the example IP with your own. For an HTTPS reverse proxy, use the **external** browser origin (for example `https://inventory.example.uk`) and set `CAFFOOT_SERVER_ADDRESS` to the hostname or IP used by the proxy for the encrypted upstream connection. Never derive the trusted origin from client-supplied Host or forwarding headers. The web address and server address are required; the published port defaults to 8080 and must be between 1 and 65535; Compose refuses to start without them. Keep `.env` out of source control.

**For VPS or reverse-proxy deployments:** the Compose/Portainer `ports` mapping publishes Caffoot's HTTPS host port on the Docker host's network interfaces. If only your reverse proxy should connect, restrict access to that host port with your existing firewall or private network configuration; do not leave it unnecessarily reachable from the wider internet. For direct access, permit only the intended connections and use a trusted HTTPS certificate. Caffoot's own login, MFA and permissions remain mandatory whether accessed directly or through a proxy.

From the repository root run `docker compose up --build -d`, then open `CAFFOOT_WEB_ADDRESS` in the browser. The application serves the inventory interface at `/inventory` and administrator/account setup at `/setup`. The health endpoint for direct access is `https://<server-address>:<published-port>/health`. The published port can be changed with `CAFFOOT_PORT`; the container always listens internally on port 8080. Include the published port in the browser address for direct access unless it is 443. For a reverse proxy, use the external HTTPS domain in `CAFFOOT_WEB_ADDRESS`, the application server IP/hostname in `CAFFOOT_SERVER_ADDRESS`, and the published host port in `CAFFOOT_PORT`. A self-signed certificate is generated once and stored under the persistent `/data/tls` volume path. A browser will not automatically trust it; verify the certificate identity/fingerprint out of band and establish trust before using real credentials. For a reverse proxy, configure HTTPS to the upstream and verify its certificate through an explicitly managed trust policy; do not assume plain HTTP upstream is supported.

To inspect the certificate fingerprint after startup, run this from the directory containing `compose.yaml`:

```sh
docker compose exec caffoot-lite openssl x509 -in /data/tls/server.crt -noout -fingerprint -sha256 -subject -dates -ext subjectAltName
```

Compare the SHA-256 fingerprint against a separately trusted copy before trusting the certificate in your browser or reverse proxy. The certificate's Subject Alternative Name must include the IP address or hostname used to reach the Caffoot server. If you change `CAFFOOT_SERVER_ADDRESS` after first startup, the existing persisted certificate is **not** silently regenerated; inspect its identities and explicitly plan a safe replacement if required. Keep the private key private. A self-signed certificate is not publicly trusted merely because the application generated it.

The container's own HTTPS health check is a local liveness probe and does not establish external certificate trust. Do not delete the persistent data volume or host bind-mount folder if retaining inventory or certificate identity.  The certificate is not automatically renewed; before expiry, plan a controlled certificate rotation and update client/proxy trust. Never delete the data volume as a certificate-rotation shortcut.

## Full user instructions

For worked examples and detailed steps covering **Devices, IPAM, Racks, Users and MFA, Settings and Change History**, see the shared [Features and Instructions user guide](docs/How%20To%27s/Features%20and%20Instructions/README.md). These same Markdown guides are intended for the future website help section; the short help inside **My account → Help & Guides** remains available without public Internet access.

## Approved visual identity and font availability

The Docker edition uses the existing Caffoot hedgehog artwork and **“Infrastructure, Simplified.”** on the first-run administrator and sign-in screen. The inventory interface now serves its core Tailwind utilities from the bundled local stylesheet rather than executing remote Tailwind JavaScript. The setup and inventory interfaces request the approved **Inter** font when an external font service is reachable. When it is not, readable local system-font fallbacks apply. Internet access is **not required** for normal local HTTPS sign-in, MFA, inventory access, editing or SQLite database operations. This is an approved appearance-only difference from published v1.3.3; it does not change any inventory workflow.

## Verification status

The existing backend checks and focused HTTPS/Chromium test run in GitHub Actions. They cover first-run MFA, central inventory and Change History, user creation and access permissions, competing device edit reservations, familiar Devices/IPAM/Racks forms, Clean Start and a real v1.3.3 backup created by the published exporter. These checks are not an exhaustive proof of every published v1.3.3 interaction. The agreed real Raspberry Pi 5 acceptance has been completed and recorded in [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218).

The existing `tests/test_compose_lifecycle.py` is an **opt-in** Docker milestone test. The `Next Docker Compose lifecycle` GitHub Actions workflow passed during Stage 8, verifying published port configuration, persistent SQLite data and TLS certificate continuity across restart and recreation. The product owner has now completed the agreed Raspberry Pi 5/Portainer Stage 2 acceptance, including container recreation and a manual stopped-container backup/restore. That acceptance does **not** replace the later release security review, nor prove automated or off-host backup protection.

## Official v2.0.1 Portainer installation

For a simple **new** installation, use **Portainer → Stacks → Add stack → Web editor**. Copy the entire [v2.0.1 stack](portainer-v2.0.1.yaml) and change the example server address and port. The default storage is a Docker-managed **named volume**; there is no host folder to create. Its image is `ghcr.io/caffoot/caffoot-lite:v2.0.1` (ARM64 Raspberry Pi 5 and AMD64 PC). Confirm the [v2.0.1 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1) and image workflow succeeded before pulling it. The GHCR package must be **Public** to permit anonymous pulls; never embed an access token in a public stack.

The supplied example uses **192.168.1.100:8443 as a placeholder**. Replace it with the address of your server before deploying. Its standard storage mapping is:

```yaml
volumes:
  - caffoot_data:/data
```

The stack declares `caffoot_data` in a separate top-level `volumes:` section. Docker automatically creates and manages this persistent volume. For a normal new installation, you do **not** need to create or change the permissions of a host folder. The actual volume may have a project/stack prefix (for example, `yourstack_caffoot_data`): use **Portainer → Volumes** to identify the real name.

**Prefer a custom host folder?** You can replace the named-volume mapping with `/srv/caffoot-lite/data:/data` or another folder of your choice. For the optional bind mount, prepare the folder with permissions for the container's non-root UID/GID `10001:10001`:

```sh
sudo install -d -m 0750 -o 10001 -g 10001 /srv/caffoot-lite/data
```

If using a bind mount, the now-unused top-level `volumes: caffoot_data:` declaration can be removed. Any other valid host path is fine if it is writable by the application user.

**Existing installations must retain their current `/data` mapping.** Changing an existing host path to a new named volume without migrating data can cause the application to appear empty while the original database remains in the previous storage location.


If 8443 is occupied, change **both** the published `ports` value (e.g. `8444:8080`) and `CAFFOOT_WEB_ADDRESS` / `CAFFOOT_PORT`. Keep internal port `8080` fixed. After deployment, open the configured HTTPS address, complete first-run administrator setup and required MFA. Check the certificate identity and establish trust before entering real credentials, as explained above.

If upgrading an existing Docker deployment, make a consistent external backup of the data mounted at `/data` while the container is stopped, **retain the same existing named volume or host folder mounted as `/data`**, and update the existing Portainer stack's image tag. Do not create a separate empty stack or attach a new empty volume to an existing database.

## Building directly from the source repository

Clone the v2.0.1 release and use the repository-root [`compose.yaml`](compose.yaml) and [`Dockerfile`](Dockerfile). Set your local `.env` values as shown above, then run `docker compose up --build -d` from the root. For Portainer's Git-repository mode, use repository `https://github.com/Caffoot/Caffoot-Lite.git`, reference `v2.0.1` and Compose path `compose.yaml`. The repository-root `compose.yaml` already uses the named `caffoot_data` volume by default. For an existing deployment that uses a host folder, keep the existing `CAFFOOT_DATA_PATH` value in `.env` (or your existing mapping) instead of moving to a fresh volume. You can explicitly set `CAFFOOT_DATA_PATH=/srv/caffoot-lite/data` for a new custom bind-mount installation, after preparing that directory with the correct permissions. Compose may prefix named volumes with the project name; check the actual volume name before running backups.

The service is named `caffoot-lite`, and the image build copies `backend/`, `inventory.html`, `setup.html` and the required `assets/` from the root. The same `/data` backup and HTTPS rules apply.

## External backup and recovery of your Docker installation

The Docker edition does **not** offer an ongoing in-app JSON export/restore service. The fresh **v1.3.3** JSON import described below is only for one-way migration.

The application stores its SQLite database at `/data/caffoot.sqlite3`, with persistent HTTPS certificate material under `/data/tls`. Keep the **entire** `/data` mount when recreating or updating the container. For new installations, the default is a **Docker-managed named volume**, not an ordinary host directory. Docker may prefix the name with the stack or Compose project name. Existing installations may instead use a custom host directory, which must be preserved.

Use your existing external container/volume backup solution. For a straightforward **manual copy**, first stop the Caffoot container so SQLite is no longer being written, then copy the entire persistent data directory to a separately protected backup location.

**Named-volume backup:** In **Portainer → Volumes**, identify the **actual** volume used by the Caffoot Lite stack; the name may include the stack name. Confirm that it contains the expected database and `tls` directory. With Caffoot Lite stopped, use a trusted Docker volume-backup utility or temporary helper container to copy the complete volume contents. Do not assume the files are always under `/var/lib/docker/volumes`; Docker chooses the storage location.

**Host-directory backup:** If you chose a bind mount such as `/srv/caffoot-lite/data:/data`, stop Caffoot Lite and copy the **entire configured host directory**, including SQLite and TLS files.

**Restoring a named-volume backup:** Stop the target container, identify and verify the intended persistent volume, restore the full saved contents (including database and TLS files, retaining correct permissions/ownership), restart and verify sign-in, inventory and HTTPS identity. Test a restore in a separate, disposable installation whenever practical. Never overwrite your only working data to test the backup. Start the container again once copying is complete. For restoration, stop the container, restore the backed-up persistent files into the correctly mapped data directory with their original ownership and permissions, and start the container. Verify your account sign-in, inventory and HTTPS identity. **Do not delete your only working database or certificate files to test restoration.** A disposable test environment or separate temporary restore location is preferable.

On the Raspberry Pi test host, the product owner successfully recreated the running container without losing inventory, then separately stopped it, copied its data, restored the copied database and restarted with the existing inventory functioning. That was a **local manual recovery exercise**: it was **not** an off-device backup and would not protect against failure or loss of the Pi's storage. Real deployments should secure backup copies **outside the Docker host** and verify their restore process. Protect backups containing user credentials and TLS private-key material.

## Published v1.3.3 import compatibility boundary

The source of truth is the **published** `v1.3.3` tag, particularly [`app/caffoot-lite.html` at the v1.3.3 tag](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html) (`createInventoryBackup`, `validateBackupVersion`, `normaliseImportedBackupAndPlanLegacyMountRepairs`, `planLegacyComputerMountingCorrections` and `findAccessPointMountConflictsInBackup`). v2.0.1 accepts only backups freshly exported from published v1.3.3; users of earlier HTML versions must upgrade to v1.3.3 first.

Published v1.3.3 retains both the legacy computer mounting review and the Access Point mounting review in its import path. A freshly exported, healthy v1.3.3 inventory ordinarily needs neither, but these safeguards must not be removed merely because older-version imports are unsupported. Preserve the source-ordered validation and explicit user review when a v1.3.3 export actually triggers them. Do **not** expand this into support for older backup formats or add new migration prompts. The live v2.0.1 import retains the published reviews and requires explicit confirmation before replacing inventory in a SQLite transaction.

## Private genuine v1.3.3 export regression

The optional `tests/test_genuine_export.py` round-trip check covers all inventory collections, optional/historical fields, device ordering, and repeated staging against an actual exported backup. Keep the backup **outside the repository**. The test skips when the environment variable is unset (including normal GitHub Actions). The uploaded reference export is not published or embedded in source control. The test verifies only lossless staging/reconstruction, **not** the published UI import's full validation, review or confirmation sequence.
