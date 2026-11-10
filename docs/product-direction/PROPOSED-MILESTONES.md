# Caffoot Lite — Long-Term Planning Milestones

> **Original planning structure agreed 5 November 2026; Milestones 01–03 regrouped 10 November 2026.** Six GitHub Milestones #20–#25 group future requests under the agreed [product vision](VISION.md); they do not constitute an approved development schedule. No future version number, date, feature scope or technical architecture is agreed by this document.

## Where we are today

**Published:** v2.1 provides Devices, subnet-first IPAM, Network Racks, Audit Trail, shared SQLite inventory, account permissions, multi-factor authentication and the refreshed interface. [Release details](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.1).

**Completed v2.1 work:** the published interface and accepted changes are recorded in [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282) and the v2.1 release. These planning milestones concern future work, not the completed v2.1 scope.

## Established planning milestones

GitHub Milestones #20–#25 group future requests by the **benefit to users**, not by a chosen technology. Their existence does not approve any individual implementation, and priorities or boundaries may change after discussion.

### Milestone 01 (#20) — Everyday IT Management

**Outcome:** An IT team can record equipment and stock, manage suppliers and staff, assign equipment, handle returns and support users through a connected, straightforward experience.

Current planning issues:
- [Role-based permissions and per-user overrides — #350](https://github.com/Caffoot/Caffoot-Lite/issues/350).
- [Optional sections for agreed non-core capabilities — #238](https://github.com/Caffoot/Caffoot-Lite/issues/238). **Core Assets is not optional.**
- [Suppliers, branches, contacts and supplier notes/issues — #349](https://github.com/Caffoot/Caffoot-Lite/issues/349).
- [Core Assets: individually tracked equipment, quantity stock and stock movement history — #352](https://github.com/Caffoot/Caffoot-Lite/issues/352).
- [People, departments and device/asset assignments — #232](https://github.com/Caffoot/Caffoot-Lite/issues/232).
- [Equipment handovers and reassignment history — #292](https://github.com/Caffoot/Caffoot-Lite/issues/292).
- [Full device/asset-linked Service Desk and support tickets — #233](https://github.com/Caffoot/Caffoot-Lite/issues/233).
- [Equipment lifecycle, warranties and replacement planning — #286](https://github.com/Caffoot/Caffoot-Lite/issues/286).
- [Rack Inventory search-to-card spacing — #341](https://github.com/Caffoot/Caffoot-Lite/issues/341).
- [Confirm initial password when creating a user — #347](https://github.com/Caffoot/Caffoot-Lite/issues/347).
- [Milestone planning checkpoint — #351](https://github.com/Caffoot/Caffoot-Lite/issues/351).
- [#323 — organisation-specific asset information](https://github.com/Caffoot/Caffoot-Lite/issues/323) is **closed, Not Planned**, and must not be treated as delivery scope.

**To decide:** Exact record relationships, permissions and privacy, asset quantity versus individual tracking, staff assignment and return workflows, support ticket behaviour, safe migration and the approved HTML interfaces. Plan these connected capabilities together to avoid later retrofits; that does **not** authorise one monolithic implementation or prescribe an unapproved technical architecture. The [latest #351 checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6764257679) supersedes the earlier milestone-wide development sequence. Feature-level decisions in their issues remain in force.

### Milestone 02 (#21) — Connected Infrastructure

**Outcome:** Users can see not only what equipment exists but also how it is connected and addressed.

Existing proposals (unchanged):
- [Multiple interfaces, IP addresses and IPv6 — #231](https://github.com/Caffoot/Caffoot-Lite/issues/231).
- [Switch ports, patch panels, cabling, topology diagrams and connection tracing — #235](https://github.com/Caffoot/Caffoot-Lite/issues/235).
- [IP Address Block organisation after import — #312](https://github.com/Caffoot/Caffoot-Lite/issues/312).
- [Documented UPS/PDU power dependencies and impact view — #313](https://github.com/Caffoot/Caffoot-Lite/issues/313).
- [Equipment relationships and dependency impact view — #314](https://github.com/Caffoot/Caffoot-Lite/issues/314).
- [VLAN membership across devices and ports — #315](https://github.com/Caffoot/Caffoot-Lite/issues/315).
- [Optional DNS/DHCP service documentation for each network — #319](https://github.com/Caffoot/Caffoot-Lite/issues/319).

**To decide:** How connections and dependencies should be recorded, what diagrams and tracing can accurately show from entered data, which IPAM/DNS/DHCP fields already exist, and how existing inventory is preserved. No active scanning or network discovery is part of this milestone.

### Milestone 03 (#22) — Inventory Tools, Reporting & Verification

**Outcome:** Build on the connected everyday IT management foundations with faster inventory operations, clear documentation, accurate verification and practical reporting.

Current planning issues:
- [Saved views and remembered inventory filters — #241](https://github.com/Caffoot/Caffoot-Lite/issues/241).
- [QR labels linking to authorised asset records — #287](https://github.com/Caffoot/Caffoot-Lite/issues/287).
- [CSV import/export and safe bulk updates — #288](https://github.com/Caffoot/Caffoot-Lite/issues/288).
- [Safe multiple-device duplication — #289](https://github.com/Caffoot/Caffoot-Lite/issues/289). The older issue title refers to reusable templates, but the owner rejected templates during later planning; follow the issue's latest approved decisions.
- [Inventory reports — #290](https://github.com/Caffoot/Caffoot-Lite/issues/290).
- [Data Quality and inventory completeness — #291](https://github.com/Caffoot/Caffoot-Lite/issues/291).
- [Optional stocktakes and asset verification — #322](https://github.com/Caffoot/Caffoot-Lite/issues/322).
- [Audit & Report Delivery — #340](https://github.com/Caffoot/Caffoot-Lite/issues/340).
- [Portable JSON inventory export — #346](https://github.com/Caffoot/Caffoot-Lite/issues/346).
- [In-app IT documentation and revision history — #237](https://github.com/Caffoot/Caffoot-Lite/issues/237).

**To decide:** How tools operate on both Devices and Assets where relevant, safe imports/exports and bulk changes, QR and stocktake identity, report scope, permission checks and lightweight documentation. Although #291 is grouped here, any existing missing-IP behaviour conflicting with Milestone 01's non-networked asset requirements must be handled explicitly during earlier design, not postponed blindly.

### Milestone 04 (#23) — Add optional IT operations capabilities

**Outcome:** Teams can spot and respond to real infrastructure problems without making inventory complicated for everyone.

Existing proposals and possible extensions:
- [Monitoring, alerts and status history — #236](https://github.com/Caffoot/Caffoot-Lite/issues/236).
- Explore endpoint management, patching, automation and authorised remote support **only after separate discussion**.
- [Optional application sections — #238](https://github.com/Caffoot/Caffoot-Lite/issues/238).
- [Optional network discovery and SNMP-assisted inventory feasibility — #320](https://github.com/Caffoot/Caffoot-Lite/issues/320), separately investigated and off by default.

**To decide:** The operational cost, lightweight deployment options, permissions and what happens when a managed device is offline. No device agent or monitoring architecture has been chosen.

### Milestone 05 (#24) — Offer genuine identity and access choice

**Outcome:** Organisations can manage access through a self-hosted platform, with a long-term route towards domainless computer sign-in and application SSO.

Potential stages to explore:
- [Optional LDAP, LLDAP and Active Directory integration — #240](https://github.com/Caffoot/Caffoot-Lite/issues/240), preserving local administrator recovery.
- Investigate standards-based self-hosted identity services for supported applications.
- Investigate domainless sign-in for supported computers, alongside optional traditional directory integration.
- Work out device enrolment, access removal, offline sign-in, emergency recovery and auditability.
- [Complete account, permission and sign-in audit event coverage — #339](https://github.com/Caffoot/Caffoot-Lite/issues/339), subject to separate approval.

**To decide:** Identity models, supported operating systems, security architecture and recovery design. **Do not build a new authentication protocol or promise an Active Directory replacement before those decisions and independent security validation.**

Identity work may require multiple substantial releases. It must not be bundled casually with an unrelated feature.

### Milestone 06 (#25) — Support larger and more varied organisations

**Outcome:** Growing businesses and service providers can manage more complex environments without compromising the experience of existing users.

Potential directions:
- [MSP customer separation and overlapping networks — #234](https://github.com/Caffoot/Caffoot-Lite/issues/234).
- Safe permissions and data isolation across organisations or customers.
- Practical deployment, backup, recovery and maintenance at different scales.
- [Adoption, tutorials and community feedback — #239](https://github.com/Caffoot/Caffoot-Lite/issues/239).

**To decide:** Whether customer separation is needed in the core experience, and how existing single-organisation installations would migrate safely.

## Future departmental asset direction — not scheduled

[Issue #353](https://github.com/Caffoot/Caffoot-Lite/issues/353) records possible future Maintenance, Facilities and Production asset management, such as manufacturing machinery and service schedules. It has **no assigned milestone or implementation approval**. The current core Assets proposal [#352](https://github.com/Caffoot/Caffoot-Lite/issues/352) remains **IT-focused**, without unnecessary assumptions that would prevent later, separately approved departmental uses. Department membership does not replace [#350](https://github.com/Caffoot/Caffoot-Lite/issues/350) permissions.

## What must remain true at every stage

- The normal inventory experience stays simple.
- Additional capabilities are not silently enabled for people who do not need them.
- Existing data, permissions and supported upgrade paths are protected.
- Security and recovery are designed alongside features, not left until release day.
- Each milestone can be broken into independently useful, reviewable improvements.
- No feature is called delivered until it is implemented, verified and released.

## How ideas become approved work

1. Discuss the user problem in plain language.
2. Check whether an [existing future request](https://github.com/Caffoot/Caffoot-Lite/labels/future%20request) already covers it.
3. Agree the smallest useful behaviour, dependencies, risks and acceptance checks.
4. Record the product owner's explicit approval in a specific GitHub issue.
5. Only then assign a release target or begin development.

The [public roadmap](../../ROADMAP.md) should list only released work, genuinely active approved work and clearly labelled ideas. These milestones must not be presented as a delivery promise.

## Deliberately left for later

- Concrete release numbers after v2.1.
- Delivery dates or estimates.
- A decision to implement all of these possibilities.
- Authentication, device-agent or modular-architecture choices.
- Reopening the completed v2.1 integration recorded in [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282) without new evidence and approval.

Those require future discussion and explicit approval.
