# Caffoot Lite — Docker/SQLite edition (unreleased)

The Docker/SQLite edition of **Caffoot Lite** implements the approved central inventory application from [issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215). It serves the established v1.3.3 inventory interface with backend persistence, first-run administrator setup, MFA, administrator-managed users and device edit reservations. The supported v1.3.3 JSON backup import is a one-way migration, not an ongoing backup system. This is **not yet a published release**. Stage 2 Raspberry Pi 5 acceptance of inventory, multi-user workflows, persistence and a one-off manual file-copy restore has been completed. The approved Caffoot sign-in branding and genuine application screenshots have been completed and reviewed. The [root README](../README.md) shows the Docker edition using fictional inventory. Website preparation, the proportionate security review and explicit final release approval remain outstanding.

## HTTPS Docker Compose / Portainer setup

Set **your own** browser address and certificate identities before running Compose. Nothing is hard-coded for a particular installer. For example, in a local `.env` file alongside `compose.yaml`:

```dotenv
CAFFOOT_WEB_ADDRESS=https://10.128.20.3:8080
CAFFOOT_SERVER_ADDRESS=10.128.20.3
CAFFOOT_PORT=8080
```

Replace the example IP with your own. For an HTTPS reverse proxy, use the **external** browser origin (for example `https://inventory.example.uk`) and set `CAFFOOT_SERVER_ADDRESS` to the hostname or IP used by the proxy for the encrypted upstream connection. Never derive the trusted origin from client-supplied Host or forwarding headers. The web address and server address are required; the published port defaults to 8080 and must be between 1 and 65535; Compose refuses to start without them. Keep `.env` out of source control.

**For VPS or reverse-proxy deployments:** the Compose/Portainer `ports` mapping publishes Caffoot's HTTPS host port on the Docker host's network interfaces. If only your reverse proxy should connect, restrict access to that host port with your existing firewall or private network configuration; do not leave it unnecessarily reachable from the wider internet. For direct access, permit only the intended connections and use a trusted HTTPS certificate. Caffoot's own login, MFA and permissions remain mandatory whether accessed directly or through a proxy.

From the `next/` directory run `docker compose up --build -d`, then open `CAFFOOT_WEB_ADDRESS` in the browser. The application serves the inventory interface at `/inventory` and administrator/account setup at `/setup`. The health endpoint for direct access is `https://<server-address>:<published-port>/health`. The published port can be changed with `CAFFOOT_PORT`; the container always listens internally on port 8080. Include the published port in the browser address for direct access unless it is 443. For a reverse proxy, use the external HTTPS domain in `CAFFOOT_WEB_ADDRESS`, the application server IP/hostname in `CAFFOOT_SERVER_ADDRESS`, and the published host port in `CAFFOOT_PORT`. A self-signed certificate is generated once and stored under the persistent `/data/tls` volume path. A browser will not automatically trust it; verify the certificate identity/fingerprint out of band and establish trust before using real credentials. For a reverse proxy, configure HTTPS to the upstream and verify its certificate through an explicitly managed trust policy; do not assume plain HTTP upstream is supported.

To inspect the certificate fingerprint after startup, run this from the directory containing `compose.yaml`:

```sh
docker compose exec caffoot-next openssl x509 -in /data/tls/server.crt -noout -fingerprint -sha256 -subject -dates -ext subjectAltName
```

Compare the SHA-256 fingerprint against a separately trusted copy before trusting the certificate in your browser or reverse proxy. The certificate's Subject Alternative Name must include the IP address or hostname used to reach the Caffoot server. If you change `CAFFOOT_SERVER_ADDRESS` after first startup, the existing persisted certificate is **not** silently regenerated; inspect its identities and explicitly plan a safe replacement if required. Keep the private key private. A self-signed certificate is not publicly trusted merely because the application generated it.

The container's own HTTPS health check is a local liveness probe and does not establish external certificate trust. Do not delete the persistent data volume or host bind-mount folder if retaining inventory or certificate identity.  The certificate is not automatically renewed; before expiry, plan a controlled certificate rotation and update client/proxy trust. Never delete the data volume as a certificate-rotation shortcut.

## Full user instructions

For worked examples and detailed steps covering **Devices, IPAM, Racks, Users and MFA, Settings and Change History**, see the shared [Features and Instructions user guide](../docs/How%20To%27s/Features%20and%20Instructions/README.md). These same Markdown guides are intended for the future website help section; the short help inside **My account → Help & Guides** remains available without public Internet access.

## Approved visual identity and font availability

The Docker edition uses the existing Caffoot hedgehog artwork and **“Infrastructure, Simplified.”** on the first-run administrator and sign-in screen. The setup and inventory interfaces request the approved **Inter** font when an external font service is reachable. When it is not, readable local system-font fallbacks apply. Internet access is **not required** for normal local HTTPS sign-in, MFA, inventory access, editing or SQLite database operations. This is an approved appearance-only difference from published v1.3.3; it does not change any inventory workflow.

## Verification status

The existing backend checks and focused HTTPS/Chromium test run in GitHub Actions. They cover first-run MFA, central inventory and Change History, user creation and access permissions, competing device edit reservations, familiar Devices/IPAM/Racks forms, Clean Start and a real v1.3.3 backup created by the published exporter. These checks are not an exhaustive proof of every published v1.3.3 interaction. The agreed real Raspberry Pi 5 acceptance has been completed and recorded in [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218).

The existing `tests/test_compose_lifecycle.py` is an **opt-in** Docker milestone test. Run the `Next Docker Compose lifecycle` GitHub Actions workflow manually at an integration milestone to verify published port configuration, persistent SQLite data and TLS certificate continuity across restart and recreation. The product owner has now completed the agreed Raspberry Pi 5/Portainer Stage 2 acceptance, including container recreation and a manual stopped-container backup/restore. That acceptance does **not** replace the later release security review, nor prove automated or off-host backup protection.

## Simplest Portainer Web editor installation (prebuilt test image)

For your Raspberry Pi 5, use **Stacks → Add stack → Web editor** and paste the complete configuration from [portainer-stack.yaml](portainer-stack.yaml). There is no Git source, username, token or Docker build needed on the Pi. The prebuilt `next-test` Docker image is built on the **Next** branch for `linux/arm64` (Pi 5) and `linux/amd64`. It is an **unreleased integration test image**, not a published Caffoot Lite release.

Before deploying: confirm that the GitHub container package `ghcr.io/caffoot/caffoot-lite-next:next-test` is **public**. GitHub initially creates new packages private; the repository owner must change the package visibility to public under its package settings. A public GHCR image can then be pulled anonymously by Portainer. Don't enter a GitHub personal access token in Portainer for a public container image.

The sample is already configured to persist data at `/portainer/Files/AppData/Config/caffoot_data`. On the Pi prepare the folder first:

```sh
sudo install -d -m 0750 -o 10001 -g 10001 /portainer/Files/AppData/Config/caffoot_data
```

Replace the illustrative address `10.128.20.3` with your Pi's real address if different. If port `8443` is occupied, change both `8443:8080` in the `ports` line and `:8443` in `CAFFOOT_WEB_ADDRESS`, as well as `CAFFOOT_PORT`. Keep `8080` after the colon in the port mapping because that is the container's fixed internal port. This stack uses the same SQLite backend, authentication and HTTPS implementation as the Git/Compose installation described below.

When an updated test image is explicitly built at a future milestone, use Portainer's **Pull latest image** option when updating this stack; an existing running container does not change just because the registry tag changes. Do not use an unreleased `next-test` image as a production release.

## Raspberry Pi 5 installation through Portainer

This uses the existing **Next** Docker Compose application, not a different image or inventory implementation. Portainer can deploy a Compose file directly from a Git repository, so you do not need to copy project files onto the Pi. Choose the Pi's ordinary Docker Standalone environment in Portainer.

**1. Prepare the data folder on the Pi.** In a terminal on the Raspberry Pi, run:

```sh
sudo install -d -m 0750 -o 10001 -g 10001 /portainer/Files/AppData/Config/caffoot_data
```

The container runs as user/group `10001:10001`. Only the `caffoot_data` directory needs those permissions; **do not change permissions or ownership on the parent AppData folders or any other container's data**.

**2. Add the stack.** In Portainer, open **Stacks → Add stack → Git repository** and enter:

| Portainer field | Value |
| --- | --- |
| Stack name | `caffoot-next` |
| Repository URL | `https://github.com/Caffoot/Caffoot-Lite.git` |
| Repository reference / branch | `Next` |
| Compose path | `next/compose.yaml` |

Portainer retrieves this branch and builds the application image using the existing `next/Dockerfile`. Leave automatic GitOps updates off for this unreleased Pi acceptance installation; update deliberately while development is ongoing. If Portainer asks for a source, choose **Create new source / Git repository**. Do not choose `main`, which is the published HTML application's branch.

**3. Set the four stack environment variables** using Portainer's **Environment variables** section. The values below are *illustrative*: replace `10.128.20.3` with the Pi's actual address, and pick an unused host port (here `8443`).

```dotenv
CAFFOOT_WEB_ADDRESS=https://10.128.20.3:8443
CAFFOOT_SERVER_ADDRESS=10.128.20.3
CAFFOOT_PORT=8443
CAFFOOT_DATA_PATH=/portainer/Files/AppData/Config/caffoot_data
```

`CAFFOOT_DATA_PATH` selects the **host** folder that is mounted at `/data` **inside** the container. The other three settings are the approved HTTPS browser address, certificate identity and external port. The container always listens on internal port `8080`. For a reverse proxy, set `CAFFOOT_WEB_ADDRESS` to the actual public HTTPS URL, use the Pi's actual HTTPS server address for `CAFFOOT_SERVER_ADDRESS`, and set `CAFFOOT_PORT` to the port the proxy reaches. Keep the proxy's upstream connection HTTPS and verify the upstream certificate.

**4. Select Deploy the stack.** Once it is running and healthy, use your configured HTTPS address. The first visit opens the account setup workflow: choose your own first administrator username/password and complete compulsory MFA. There is no preset administrator. If you have inventory from published v1.3.3, export a fresh JSON backup from that version, then use Next's Settings import review and explicit confirmation. Migration never replaces accounts.

For a directly accessed self-signed HTTPS server, check the certificate's fingerprint and Subject Alternative Name against the Pi's trusted server information **before** using real credentials. You can inspect them from Portainer's container **Console** using:

```sh
openssl x509 -in /data/tls/server.crt -noout -fingerprint -sha256 -subject -dates -ext subjectAltName
```

Do not simply click past browser certificate warnings. Establish trust using the approved HTTPS procedure above. The database and certificate persist under the host's `caffoot_data` folder; leave this folder intact when recreating or updating the container. Back up and restore it with the existing external volume/container backup process, not the one-way v1.3.3 JSON migration.

If you do not set `CAFFOOT_DATA_PATH`, the original `caffoot_data` Docker-managed named volume remains the default. Avoid changing `CAFFOOT_DATA_PATH` after setup without deliberately moving your existing persisted data.

## External backup and recovery of your Docker installation

The Docker edition does **not** offer an ongoing in-app JSON export/restore service. The fresh **v1.3.3** JSON import described below is only for one-way migration.

The application stores its SQLite database at `/data/caffoot.sqlite3`, with persistent HTTPS certificate material under `/data/tls`. Keep the **entire** `/data` mount when recreating or updating the container. On the example Pi Portainer stack, this is the host folder `/portainer/Files/AppData/Config/caffoot_data`.

Use your existing external container/volume backup solution. For a straightforward **manual copy**, first stop the Caffoot container so SQLite is no longer being written, then copy the entire persistent data directory to a separately protected backup location. Start the container again once copying is complete. For restoration, stop the container, restore the backed-up persistent files into the correctly mapped data directory with their original ownership and permissions, and start the container. Verify your account sign-in, inventory and HTTPS identity. **Do not delete your only working database or certificate files to test restoration.** A disposable test environment or separate temporary restore location is preferable.

On the Raspberry Pi test host, the product owner successfully recreated the running container without losing inventory, then separately stopped it, copied its data, restored the copied database and restarted with the existing inventory functioning. That was a **local manual recovery exercise**: it was **not** an off-device backup and would not protect against failure or loss of the Pi's storage. Real deployments should secure backup copies **outside the Docker host** and verify their restore process. Protect backups containing user credentials and TLS private-key material.

## Published v1.3.3 import compatibility boundary

The source of truth is the **published** `v1.3.3` tag, particularly `app/caffoot-lite.html` (`createInventoryBackup`, `validateBackupVersion`, `normaliseImportedBackupAndPlanLegacyMountRepairs`, `planLegacyComputerMountingCorrections` and `findAccessPointMountConflictsInBackup`). Next accepts only backups freshly exported from published v1.3.3; users of earlier HTML versions must upgrade to v1.3.3 first.

Published v1.3.3 retains both the legacy computer mounting review and the Access Point mounting review in its import path. A freshly exported, healthy v1.3.3 inventory ordinarily needs neither, but these safeguards must not be removed merely because older-version imports are unsupported. Preserve the source-ordered validation and explicit user review when a v1.3.3 export actually triggers them. Do **not** expand this into support for older backup formats or add new migration prompts. The live Next import retains the published reviews and requires explicit confirmation before replacing inventory in a SQLite transaction.

## Private genuine v1.3.3 export regression

The optional `tests/test_genuine_export.py` round-trip check covers all inventory collections, optional/historical fields, device ordering, and repeated staging against an actual exported backup. Keep the backup **outside the repository**. The test skips when the environment variable is unset (including normal GitHub Actions). The uploaded reference export is not published or embedded in source control. The test verifies only lossless staging/reconstruction, **not** the published UI import's full validation, review or confirmation sequence.
