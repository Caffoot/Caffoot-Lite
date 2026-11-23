# Set The Service Desk Time Zone

> **Draft v2.2 — Unreleased.** Use these instructions on an authorised v2.2 review installation. For the published v2.1 release, use its [installation guide](../../../../INSTALLATION.md).

The Service Desk uses one installation time zone for working hours, excluded dates and reporting dates. A named time zone follows local clock changes automatically. Ticket creation, updates and the live queue remain available while the time zone needs attention.

## Before You Start

- You need permission to edit the existing Portainer stack or Compose configuration. You also need a Caffoot Lite administrator account to verify the setting in the app.
- Find the name for your organisation in the [IANA Time Zone Database](https://www.iana.org/time-zones). Ask whoever manages your server if you are unsure of the right zone. `Europe/London` is an example for the UK. Choose the zone where your support calendar operates.
- Identify the current stack or Compose project and the existing mount ending in `:/data`. That mount holds the SQLite database and your accounts. Keep the same project, mount, image or build source, HTTPS address, server address, ports and network settings when changing the time zone.

## Update A Portainer Stack

1. In Portainer, open **Stacks** and select your existing Caffoot Lite stack.
2. Open **Editor** and find the Caffoot Lite service beneath `services`. Inside its existing `environment` mapping, add or replace the `TZ` entry at the same indentation as the other environment entries. This line is a **UK example only**.

   ```yaml
   TZ: "Europe/London"
   ```

3. Check that there is one `TZ` entry and that the current `volumes` mapping still points to the same `/data` storage. Check the existing addresses, ports and networks.
4. Use **Update the stack** to apply the edited configuration. For a Git-managed stack, make the equivalent edit in its actual source and apply it using the stack’s existing update method. The service may be briefly unavailable while the container is recreated.
5. Use [Check The Result](#check-the-result) after Caffoot Lite comes back.

The [draft Portainer example](portainer-v2.2-draft.yaml) shows where `TZ` goes. Its empty entry is intended for you to edit. The example takes an authorised private review image through `CAFFOOT_V22_PREVIEW_IMAGE`.

## Update A Docker Compose Installation

1. On the Docker host, open the directory from which you normally manage the existing Caffoot Lite Compose project.
2. In the Compose file that actually defines the Caffoot Lite service, add or replace `TZ` inside that service’s existing `environment` block. Match the indentation of the other environment entries. This line is a **UK example only**.

   ```yaml
   TZ: "Europe/London"
   ```

3. Check that you have retained your existing `/data` mapping, project name, addresses, ports and networks. Run `docker compose config --quiet` from the same project directory to validate the YAML, using the same `-f` or `-p` options you normally use.
4. Apply the change with `docker compose up -d`, keeping those same project and file options. Compose recreates the service with the updated environment. Restarting the existing container alone keeps its old environment.
5. Use [Check The Result](#check-the-result) after Caffoot Lite comes back.

For a separate review checkout, the [draft Docker Compose example](compose-v2.2-draft.yaml) shows the empty, editable `TZ` entry next to the existing environment and storage settings.

## Check The Result

1. Sign in to Caffoot Lite with your administrator account and authenticator.
2. Open **Settings & Data → Service Desk → Working Hours**. Under **Weekly Schedule Preview**, check that **Installation Time Zone** shows the IANA name you entered. A warning at the top of the settings panel means the app could not apply a valid zone.
3. Open **IT → Service Desk**. Check that **Service Desk Activity** can show period totals and **Technician Activity** again. The average may still be unavailable for a period containing a closure with incomplete working-time history. See [how the dashboard presents each case](Service-Desk-Tickets.md#read-service-desk-activity).

![Administrator warning in Working Hours when the deployment time zone is missing.](../../../development-handovers/evidence/service-desk-reporting/missing-timezone-desktop-light.png)

*Set a valid IANA zone in the deployment configuration and recreate the service to clear this warning.* [Capture details](../../../development-handovers/evidence/service-desk-reporting/README.md)

## If The Warning Persists

- Check the exact spelling and capitalisation of the IANA name, the indentation and whether the entry is under the Caffoot Lite service. Check that you edited and updated the actual running stack or project.
- Confirm that you are running the authorised v2.2 review build. Use the same storage mount and installation settings when applying a correction.
- A valid zone takes effect when the application applies it during startup. Eligible elapsed time already measured under known settings is retained. A closure that spans a period whose time zone was unknown has no complete duration. Later corrections allow accurate future measurements, including a new resolution attempt if the ticket is reopened.

See [set working hours and excluded dates](Service-Desk-Administration.md#configure-working-hours) for examples of calendar changes and clock changes.
