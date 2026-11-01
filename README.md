# Caffoot Lite v2.1 — Development Preview

**Infrastructure, Simplified.** Free, open-source infrastructure documentation for home labs and small IT teams: IP address management (IPAM), device inventory, network racks and secure multi-user access.

> **Unreleased preview — not the production release.** The `v2.1` branch is the approved development line. Its interface and features are still under owner review and further development. The released, supported version remains **[v2.0.1](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1)**, with production image `ghcr.io/caffoot/caffoot-lite:v2.0.1`. Never point an existing production stack at the preview image or share its production `/data` mount.

## Try the v2.1 preview

A separate, multi-architecture **test image** is built from this branch by [the preview build workflow](.github/workflows/v21-preview-image.yml). After its successful publication, the preview image tag is:

```text
ghcr.io/caffoot/caffoot-lite:v2.1-preview
```

Open **Portainer → Stacks → Add stack → Web editor**, paste [`portainer-v2.1-preview.yaml`](portainer-v2.1-preview.yaml), replace the example Pi/server IP address, and deploy as **caffoot-v21-preview**. The sample uses port **8444** and its **own named data volume** — not the live v2.0.1 database. Never swap the existing production service's image tag to try this. See the [preview installation and safety instructions](INSTALLATION.md#v21-development-preview--portainer-test-installation) before signing in.

If the image has not yet been built or the GHCR package is not public, Portainer cannot pull it. Confirm [GitHub Actions](https://github.com/Caffoot/Caffoot-Lite/actions/workflows/v21-preview-image.yml) succeeded before deploying. This is **not** a final release or upgrade recommendation.

## What is available in this development preview?

- **Premium, responsive Caffoot interface:** branded collapsible sidebar, clearer Dashboard, Devices directory and full details, IPAM, Rack views, Users, Settings & Data, and My Account, using the approved typography and palette.
- **Existing inventory functionality retained:** device and VM details, IPAM/subnet/VLAN records, front/rear rack views and printing, authorised changes, imports and shared SQLite inventory.
- **Optional account profiles:** First/Last Name, Display Name, optional unverified email and authenticated circular photographs, saved in the existing SQLite `/data` store. The original username remains the sign-in identifier.
- **Existing security retained:** password-based sign-in, MFA, role permissions, secure sessions and administrator-controlled access.

**Not yet built:** SMTP settings, verified-email recovery, protected full Audit Trail, assigned-user devices, support tickets and other future ideas. Future feature placeholders in the interface are not operational services. The existing Change History remains in place for now. See the [development status and remaining acceptance work](docs/v2.1-preview-status.md) and [owner-approved scope in issue #227](https://github.com/Caffoot/Caffoot-Lite/issues/227). PR [#229](https://github.com/Caffoot/Caffoot-Lite/pull/229) records the completed first 11 development stages before this dedicated branch was created.

## Data, backups and security

Caffoot Lite runs as a Docker/SQLite application with its database and HTTPS certificate material under the container's persistent `/data` directory. **The v2.1 preview must use separate test storage**. An existing v2.0.1 database would undergo forward-only schema migration when started under v2.1; do not experiment on your sole working copy or assume you can roll back that database to v2.0.1.

For your live system, keep its existing Portainer stack, image, HTTPS settings and `/data` mapping unchanged. Keep a consistent, protected backup of its entire `/data` directory. Follow the [published v2.0.1 installation and backup guide](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.1/INSTALLATION.md) for production use.

Only published **standalone v1.3.3** JSON backups are accepted for the established *one-way* inventory import. Import is not the ongoing backup system. This development preview should use disposable accounts and inventory wherever practical.

## Documentation

- [Install and test the v2.1 preview safely](INSTALLATION.md#v21-development-preview--portainer-test-installation)
- [Preview build/status, scope and checks](docs/v2.1-preview-status.md)
- [Detailed Features and Instructions](docs/How%20To%27s/Features%20and%20Instructions/README.md)
- [Architecture and Development Guide](docs/Development%20Guide/README.md)
- [Contributing](CONTRIBUTING.md) · [Community Participation](docs/Community-Participation.md) · [Report an issue](https://github.com/Caffoot/Caffoot-Lite/issues/new/choose)
- [Historical v2.0.1 release documentation](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.1/README.md) · [v1.3.3 standalone release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3)
- [Approved v2.1 scope #227](https://github.com/Caffoot/Caffoot-Lite/issues/227) · [Future Ideas Register #222](https://github.com/Caffoot/Caffoot-Lite/issues/222) (ideas only)

**Website:** [caffoot.co.uk](https://caffoot.co.uk) continues to describe the published release until the product owner separately approves publication of v2.1.

Caffoot Lite is open source and contributions are welcome. Changes to the application require a newly agreed and product-owner-approved specification; development previews are not production releases.
