# Caffoot Lite v2.2 — Docker / SQLite installation

> **Draft v2.2 — Unreleased.** No public v2.2 image or supported production upgrade/recovery is offered. The procedure below is for separately authorised isolated review only.

**Using published v2.1?** Follow the [v2.1 feature guides](docs/historical/features-and-instructions/v2.1/README.md) and [v2.1 installation guide](docs/historical/installation/INSTALLATION-v2.1.md). These archived instructions remain available for existing installations.

This guide explains the existing draft examples for an installation that has already been authorised for isolated review. A container is the running application; an image is the packaged application it starts from. A Docker volume or bind mount holds persistent data outside that replaceable container. A new empty mount creates a new installation; it does not copy an existing one.

## Decide Which Procedure Applies

| Your situation | Start here |
| --- | --- |
| New, separately authorised disposable v2.2 review instance | Follow this guide with a distinct stack/project, endpoint and empty storage. |
| Existing Docker instance or review data that must survive | Identify its image and actual `/data` first; use [upgrade, backup and recovery](docs/how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md). Never paste a new-install example over its settings. |
| Published standalone v1.3.3 HTML inventory | Prepare the destination first, then use [one-way legacy import](docs/how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md#import-legacy-inventory). Its JSON is not a Docker installation backup. |

## Prerequisites And Preparation

1. Obtain authorisation for the exact review revision and installation. Identify the Docker host, operator, intended browser address and a free host port. Have access to Docker Engine with the **Docker Compose plugin**, or an existing Portainer environment capable of running a Docker stack. Host administrator/Docker permissions can expose the installation's secrets; limit them appropriately.
2. Check that the actual image supports the host architecture, such as AMD64 or ARM64. No public multi-architecture v2.2 image is available. Do not use an image for another architecture or infer successful startup from a successful build.
3. Reserve separate storage and capacity for the image/build, growing SQLite data, ticket attachment bytes, profile/branding images and complete protected backup copies. No universal minimum disk/RAM requirement is specified. Check free capacity for the intended workload and retention; the 100 MB attachment allowance is per ticket, not an installation storage cap.
4. Choose a distinct review project/stack, container identity, host endpoint and data mount. Keep production and other installations inaccessible to this review stack. Copied data may contain active accounts, private files and SMTP settings: isolate it and use controlled mail destinations before exercising notifications. Never reuse a production mount for an isolated review.
5. Keep the existing repository YAML unchanged. Make your installation-specific copy or Portainer editor configuration privately. Protect saved environment/configuration and backups. Do not put passwords, mail credentials or private certificates in Git, tickets or screenshots.
6. Select the organisation's IANA time zone before starting. `Europe/London` is a **UK example**, not a default. The draft examples require `TZ` through the shell, a private environment file or Portainer stack environment settings. There is no default; an empty or missing value fails configuration validation. Use an IANA name, not a fixed clock offset. [Time zone configuration and warnings](docs/how-tos/features-and-instructions/v2.2/Service-Desk-Time-Zone.md)

## Understand The Draft Examples

[Portainer candidate](portainer-v2.2.yaml) takes an authorised private image through `CAFFOOT_V22_PREVIEW_IMAGE`; it has **no public v2.2 tag**. It uses example server IP `192.168.1.100`, host port 8443, fixed container name `caffoot-lite`, and named `caffoot_data` storage. Those values must be reviewed for a new isolated instance so it cannot collide with another installation.

[Compose draft](docs/how-tos/features-and-instructions/v2.2/compose-v2.2.yaml) builds from the authorised source checkout. Its `build.context: ../../../..` resolves from the draft directory to the repository root, using the root Dockerfile. It requires web/server environment values, defaults the published port to 8080 and uses `${CAFFOOT_DATA_PATH:-caffoot_data}:/data`. Do not move this file to another directory and assume its relative build context still resolves correctly. Use the explicit file path from the repository root as shown below, or deliberately correct a private copy's context to the verified source root.

The root `compose.yaml` is also a source-build configuration. It passes the operator's `TZ` through without a default; if unset, the application retains its missing-zone warning and incomplete Service Desk metrics. Set it explicitly for a usable support calendar. Root `portainer-v2.2.yaml` and `INSTALLATION.md` prepare the unreleased v2.2 candidate.

Both draft files are complete **unreleased release-candidate configurations**, not a supported production upgrade. Their comments identify `ghcr.io/caffoot/caffoot-lite:v2.2` solely as a future publication target; no active setting pulls that tag. The Compose file keeps its source build and Portainer keeps its required private-image option. After the required acceptance and separate owner approval for release finalisation, prepare the intended public tag in the root and guide Portainer examples before strict release preflight. Its availability remains conditional on the unchanged owner-only publication workflow building and pushing the exact tested revision, verifying AMD64/ARM64 and anonymous public access, and then publishing the GitHub Release. Public installation directions and announcements must wait for that verification and their separate approval. The Compose source-build route remains available. Preserve the actual architecture, project and `/data` mount during any separately approved transition.

### Environment And Ports

For fictional Aster Services, a direct review endpoint might be `https://192.0.2.40:8446`. Documentation-range addresses below are illustrations; replace them with reachable addresses for your host.

| Setting | Meaning and checks |
| --- | --- |
| `CAFFOOT_WEB_ADDRESS` | Exact canonical HTTPS browser origin, such as `https://192.0.2.40:8446`. No path, trailing slash, credentials, query or fragment. For a reverse proxy, use its external HTTPS origin. This also supplies the trusted origin used for protected requests and links; do not derive it from arbitrary forwarding headers. |
| `CAFFOOT_SERVER_ADDRESS` | Hostname/IP used to establish the application's TLS identity, without a scheme or port. For direct access, align it with the host part of the browser URL. The TLS source accepts comma-separated identities if genuinely needed. Existing stored certificates are not silently regenerated when it changes. |
| `CAFFOOT_PORT` | Published **host** port, numeric 1–65535. Set it consistently with the browser URL and left side of `ports`. It does not change the fixed internal listener. |
| `ports` | Host-to-container mapping. For the example: `8446:8080`; preserve the container side **8080**. The supplied examples publish on Docker host interfaces; restrict reachability using the intended network/firewall. |
| `TZ` | The support calendar's installation-wide IANA zone, e.g. `Europe/London` for a UK team or the correct zone elsewhere. It has no silent UTC/browser fallback for Service Desk metrics. |
| `/data` mapping | Persist the actual named volume or bind directory. Preserve it exactly for existing installations. Docker may prefix a named volume with the project/stack name. |

Illustrative service fragment for a **new isolated** instance only (not a complete stack):

```yaml
environment:
  TZ: "Europe/London" # UK example only
  CAFFOOT_WEB_ADDRESS: "https://192.0.2.40:8446"
  CAFFOOT_SERVER_ADDRESS: "192.0.2.40"
  CAFFOOT_PORT: "8446"
ports:
  - "8446:8080"
```

The image defaults to `/data/caffoot.sqlite3` and `/data/tls`. Advanced `CAFFOOT_DB_PATH` or `CAFFOOT_TLS_DIR` overrides change what storage must be persisted and backed up; the supplied examples do not need them. Do not relocate those paths casually. The default listener binds inside the container on `0.0.0.0:8080`.

## Choose Persistent Storage

1. For a new standard instance, retain a named volume declaration and its `:/data` mapping. Docker creates it. Record the actual mount source from the container inspection, not merely the short YAML name.
2. For a deliberately chosen bind mount, use a new host directory, for example `/srv/caffoot-review/data:/data`, and prepare its access for container UID/GID **10001:10001**. On a standard rootful host, an administrator can prepare a new directory with `sudo install -d -m 0750 -o 10001 -g 10001 /srv/caffoot-review/data`. Rootless Docker/user namespaces may map host IDs differently; verify ownership as seen inside the container rather than applying guessed IDs to existing data.
3. Keep the complete mount: SQLite stores accounts/MFA/permissions, inventory, Staff/custody, tickets/messages/attachment bytes, templates and branding. TLS files, optional private SMTP settings and the account-email proof key also persist as files. See [complete backup contents](docs/how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md#back-up-a-complete-installation).
4. Before changing an existing container, record its mount and preserve that exact storage. A renamed project, new volume or extra enclosing directory can make an old installation appear empty. Never remove a volume or use `docker compose down -v` as an update or repair step.

## Method 1 — Portainer Stack Editor

1. In the authorised Docker environment, verify that the exact private review image exists locally or is available through an explicitly authorised private pull route. Inspect its full `org.opencontainers.image.revision` label, image identity and architecture. A local private image name follows the established `caffoot-lite:private-<first-12-of-SHA>` pattern only when it was actually built from that source; a tag alone is not proof. Do not publish it to make a pull work.
2. In Portainer choose **Stacks → Add stack**, use a distinct review name, then **Web editor**. Paste a private copy of the [Portainer candidate](portainer-v2.2.yaml).
3. Supply the correct IANA `TZ` and `CAFFOOT_V22_PREVIEW_IMAGE` through the stack's environment settings, or replace the `image:` expression in this private editor copy with the verified authorised image reference. The required-variable expressions intentionally fail when no image or time zone is supplied. Never insert a token into a shared stack definition.
4. Review/change the example addresses, all three host-port references, `TZ`, container name and storage for this isolated instance. Keep the service name `caffoot-lite`. For an existing instance, stop here and follow its preserved upgrade/configuration procedure instead of changing its mount.
5. Select **Deploy the stack**. Check the container's actual image, mount, running status and health in Portainer. A local-only image must already exist on the selected Docker host; do not request a registry re-pull for it. If image access fails, stop and resolve the authorised image route; no public v2.2 registry fallback is specified.
6. Continue with HTTPS verification and initial setup below. Deployment/healthy status alone does not prove browser trust, authentication or data preservation.

Portainer labels can vary by installed version. The established flow uses **Web editor** for creation and the existing stack's **Editor → Update the stack** for updates. Use the update procedure and storage mapping established for your existing installation.

## Method 2 — Docker Compose Source Build

Use a separate isolated instance for v2.2 review; keep production on the published release.

1. Use a clean checkout at the exact authorised application candidate and record `git rev-parse HEAD`. Keep local changes/other branches safe. Confirm that the Dockerfile and draft build context identify this checkout. Never label an unverified working tree as an exact source revision.
2. In the shell from that repository root, provide the values for your isolated instance. Example only:

   ```sh
   export CAFFOOT_WEB_ADDRESS='https://192.0.2.40:8446'
   export CAFFOOT_SERVER_ADDRESS='192.0.2.40'
   export CAFFOOT_PORT='8446'
   export TZ='Europe/London' # UK example only; choose your organisation's zone
   ```

3. Put your private configuration copy beside the original draft file, using a distinct filename, so `../../../..` still resolves to the same source root; if storing it elsewhere, explicitly set its build context to the absolute verified source root. The `TZ` expression reads the exported IANA name; no YAML edit is needed for it. A private `.env` file can supply these values instead; use an explicit `--env-file /path/to/private.env` consistently if it is outside Compose's normal environment-file location. Keep it outside Git and protect it as installation configuration. Retain the intended `/data` mapping. Use a distinct project consistently; for illustration, commands below use `aster-review`. In every command replace `/path/to/private-review.yaml` with the absolute path to that edited private copy.
4. Validate the configuration without starting services:

   ```sh
   docker compose -p aster-review -f /path/to/private-review.yaml config --quiet
   ```

   Check the private configuration's correct build context before running the commands. Do not print expanded configuration containing secrets into public records.

5. Build from the verified clean source, supplying its actual full SHA as the build argument (replace `VERIFIED_FULL_SHA`):

   ```sh
   docker compose -p aster-review -f /path/to/private-review.yaml build --build-arg CAFFOOT_SOURCE_REVISION=VERIFIED_FULL_SHA
   docker compose -p aster-review -f /path/to/private-review.yaml up -d
   ```

   The label records what the builder supplies; verify it against the source and actual resulting image. The draft file itself sets no revision build argument. If a private build proxy needs an extra trusted CA, the Dockerfile supports the existing BuildKit secret `proxy_ca`; follow the approved environment's trusted-build configuration. Do not disable certificate verification or invent a different source/image as a workaround.

6. With the same file/project options, use `docker compose ps` and `docker compose logs caffoot-lite` to check startup, and inspect the actual image architecture/revision and `/data` mount. Keep logs private. Use **Ctrl+C** to stop following logs, not to delete storage.

The Dockerfile uses Python 3.12 Alpine with OpenSSL and IANA tzdata, packages the backend/setup/interface and required local assets, and runs as `10001:10001`. Its source revision label defaults to `development` unless supplied. Build-context ignore files and explicit COPY paths are packaging controls; they do not certify an arbitrary private checkout contains no secrets.

## Verify HTTPS Identity Before Setup

1. Open the configured HTTPS browser address only after confirming it is the intended container/host. The server creates a self-signed certificate/key once under `/data/tls` and reuses them. A browser warning is expected for an untrusted self-signed issuer; do not enter credentials until the identity is independently verified and trust established.
2. From trusted host administration, inspect the certificate using the same Compose file/project options, or the equivalent exec into the intended Portainer container:

   ```sh
   docker compose -p aster-review -f /path/to/private-review.yaml exec caffoot-lite openssl x509 -in /data/tls/server.crt -noout -fingerprint -sha256 -subject -dates -ext subjectAltName
   ```

3. Compare the SHA-256 fingerprint with a separately trusted copy and check the Subject Alternative Name includes the hostname/IP actually used. Keep `server.key` private. The generated certificate is not automatically publicly trusted or automatically renewed; plan controlled rotation before expiry and update client/proxy trust.
4. If the identity has changed unexpectedly, stop and verify mount/image/host before trusting it. Changing `CAFFOOT_SERVER_ADDRESS` does not silently replace the stored certificate. An incomplete certificate/key pair is a startup error, not permission to delete the whole volume.
5. For an authorised reverse proxy, keep the external HTTPS origin and encrypted upstream identity consistent and explicitly verify the upstream certificate. The source server serves HTTPS; this guide establishes no plain-HTTP upstream or automatic certificate-service procedure.

The container health check requests `https://127.0.0.1:8080/health` without checking certificate trust. It establishes local liveness only. Check the browser endpoint, actual certificate, authentication and persisted data separately.

## Create The Initial Administrator And First Sign-In

A fresh database has no fixed/default administrator password and no public registration. Restrict reachability while completing the initial setup so only the intended administrator can claim it. Outgoing email is not required for initial administration.

1. Open the trusted browser origin; `/setup` serves setup/sign-in. On an empty database choose **Get Started**, then **Create Your Administrator**. Enter your chosen **Username**, **Password** and **Confirm Password**. For a fictional example use `aster.admin`, with a unique secret stored securely rather than a published example password.
2. Choose **Continue To Authenticator Setup**. Correct any field error, including mismatched confirmation, before continuing. **Back** returns to the welcome step before account submission; an already created pending administrator should resume enrolment rather than create another account.
3. On **Secure Your Account**, scan the private QR code with your authenticator. If needed use **Can't scan? Show setup key**. Enter the current six-digit **Authenticator Code** and choose **Confirm MFA Setup**. Keep the QR code, setup key and authenticator codes private. An invalid code leaves setup incomplete; check the selected account and device clock before trying again.
4. At **You're All Set!**, choose **Continue to Sign In**. Enter **Username** and **Password**, then **Sign In**. The enrolled account sees **Verify Your Identity**: enter **Authenticator Code** and choose **Verify & Sign In**.
5. If setup was interrupted, use **Finish Administrator Setup → Continue Enrolment** with the original credentials. Do not clear the database to restart enrolment. Unexpected first-run setup on an existing installation is a reason to stop and check the mount.
6. After sign-in, use **My Account** to review personal/security settings and verify an email address when SMTP is configured. A successful SMTP test is not account verification or recovery eligibility. Later promotion of another administrator has its own verified-email/MFA/no-pending-password-change requirements; the initial setup exception is deliberate. [Accounts and MFA](docs/how-tos/features-and-instructions/v2.2/Roles-Section-Permissions-and-MFA.md)
7. An administrator reviews **Settings & Data → Optional Features**, granting section access separately, and checks **Service Desk → Working Hours → Installation Time Zone**. Fresh feature choices and employee equipment eligibility follow their guides; do not assume every optional section is enabled. [Initial workflow index](docs/how-tos/features-and-instructions/v2.2/README.md)

## Confirm Startup And Persistence

1. Confirm the intended container is running/healthy and read its relevant logs for migration, origin, TLS or storage errors. Health confirms local liveness; check access and data separately.
2. Sign in through trusted HTTPS and check the expected installation: existing accounts/data for an upgrade/recovery, or the new setup for a deliberately empty review instance. Open representative permitted records and verify feature choices and the applied time zone.
3. As part of separately authorised installation verification, recreate/restart using the **same** mount and settings, then check sign-in, HTTPS fingerprint and records remain. Recreating is not a backup. Do not run deletion or recovery rehearsals merely because this guide lists verification steps.
4. Retain image identity, configuration and a protected complete off-host backup/recovery plan. [Backup, recovery and matching-image rollback](docs/how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md#back-up-a-complete-installation)

## Troubleshoot Without Discarding Data

| Symptom | Checks and safe response |
| --- | --- |
| Image missing, pull denied or wrong architecture | Confirm selected Docker host, authorised local/private image identity and architecture. A private local tag is not a public registry image. Stop rather than publish or guess a v2.2 tag. |
| Build cannot verify package-server TLS | Check the approved trusted CA/BuildKit-secret configuration with the environment administrator. Keep TLS verification enabled; no build was performed here. |
| Container does not start | Read the targeted logs and validate actual web origin, numeric host port, server identity, mount permissions and database compatibility. Startup initialises/migrates the database before serving HTTPS; a later configuration failure does not prove no migration occurred. Preserve that copy and use matching-image recovery if needed. |
| Address unreachable or host port occupied | Check reachable host/DNS, matching URL and left port mapping, firewall and another container using that port. Keep internal 8080; do not stop unrelated services or change an existing mount to fix networking. |
| Browser certificate warning/mismatch | Compare independent trusted fingerprint, SAN, date/expiry and actual host/mount. Establish trust deliberately. Do not bypass an unexplained warning or delete persistent identity. |
| Permission denied writing data/private file | Check `10001:10001` inside the container, rootless mappings, layout and restrictive file modes; do not make credential files world-readable. |
| Empty setup appears for an existing installation | Stop, inspect actual mount/project/volume name and archive layout. Do not create a replacement administrator on the wrong empty volume. |
| Service Desk time warning | Set the correct valid IANA `TZ` in the actual service configuration and recreate with the same storage/settings. Metrics may remain incomplete for unknown historical periods; ticket operations continue. |
| Sign-in/MFA fails | Confirm intended instance/account, actual system/device time and current authenticator. Use the documented account/recovery controls; never edit database security flags as an installation shortcut. |
| Storage is full | Stop new writes as appropriate, preserve current files, and arrange capacity/backup with the host administrator. Do not delete database, ticket bytes or TLS material to make room. |

[Time zone](docs/how-tos/features-and-instructions/v2.2/Service-Desk-Time-Zone.md) · [Service Desk administration](docs/how-tos/features-and-instructions/v2.2/Service-Desk-Administration.md) · [Legacy import, upgrade and recovery](docs/how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md) · [Draft guides](docs/how-tos/features-and-instructions/v2.2/README.md)

## Upgrade, Backup And Recovery

For an existing Docker instance, read [the accepted upgrade and complete-volume recovery procedure](docs/how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md) before changing anything. Preserve the actual `/data` mount, environment, HTTPS identity and matching image; take a consistent protected backup of the complete stopped volume. JSON import is a one-way legacy inventory migration, never a Docker upgrade or full backup. Rollback requires the complete matching pre-upgrade backup and old image, never an old binary against a newer database. Supported v2.1 → v2.2 upgrade, complete-volume recovery and private-export acceptance for the final candidate remain release gates; do not experiment against production or the only live copy.

## Before A Public v2.2 Installation Is Offered

Separately verify the exact final image revision, AMD64/ARM64 availability and anonymous public pull, new installation, supported upgrade and complete-volume recovery. Obtain release approval before activating `ghcr.io/caffoot/caffoot-lite:v2.2` in the root stack or removing unreleased/private-review notices. Current source-build Compose and private-image Portainer settings remain in effect until that authorised transition.
