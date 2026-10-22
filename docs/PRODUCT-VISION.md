# Your infrastructure. Without the infrastructure.

## Lite in effort. Not in features.

**It needs recording? Just Caffoot it.**

Caffoot Lite is an approachable infrastructure and IT management application for home labs, small businesses, IT teams and managed service providers. Its purpose is to make recording, understanding and supporting infrastructure feel natural.

"Lite" describes the effort required to use Caffoot, not an artificial limit on its capabilities. Powerful features should be discoverable when needed, without making everyday tasks complicated.

## Product principles

- **One actively developed product:** Caffoot Lite is the current product and roadmap. A separate Caffoot Pro edition is not currently planned. This statement makes no promise about future commercial models, services or licensing.
- **Preserve intuitive workflows:** Architectural improvements must not needlessly change familiar forms, navigation, dashboards or interactions.
- **Device-centred records:** A device is the primary source of technical context for inventory, location, assignment, software, services, network relationships and future support history.
- **Permanent identity:** Devices should have immutable internal identifiers distinct from user-facing asset numbers, hostnames and IP addresses.
- **Simple deployment:** Docker and database-backed approaches are candidates if they simplify long-term ownership without imposing needless administration.
- **Data continuity:** Existing inventories and valid backups require a tested migration path, clear recovery procedures and data-integrity safeguards.
- **Security by design:** Any future internet-facing, multi-user deployment must have tested authentication, authorisation, administrator MFA and safe reverse-proxy configuration before being described as internet-ready.
- **Approachable first:** Advanced capabilities must not require users to understand advanced networking concepts just to complete ordinary tasks.

## Architectural direction, not feature promises

Future design may accommodate user/device assignment, groups, departments, LDAP/OIDC, support tickets linked to devices, customer/network contexts with overlapping address spaces, and optional subnet-to-VLAN assignment rules. These are long-term requirements for evaluation, not shipped features or committed delivery dates.

## v1.4.0 boundary

v1.4.0 is the **Data & Architecture Foundations** milestone: audit the published v1.3.0 implementation; compare storage, database and deployment options; design durable identifiers, migration, backup and recovery; and agree implementation and testing gates.

**No new end-user functionality is planned for v1.4.0.** Any architectural migration must preserve the existing user experience and prove backup compatibility before release.
