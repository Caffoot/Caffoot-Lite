# Caffoot Lite — Feature Brainstorm and Milestone Mapping

> **Original planning register — 5 November 2026; milestone membership updated 10 November 2026.** The long-term vision and six planning milestones remain in place, with later issue decisions and regrouping taking precedence. The individual ideas remain **proposals**, not approved implementation scope, delivery commitments or a release schedule. Use it alongside the [long-term vision](VISION.md) and [proposed milestones](PROPOSED-MILESTONES.md). Caffoot Lite v2.1 has since been published; [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282) preserves the implementation history.

## Our starting point

Caffoot Lite aims to become **a self-hosted IT management and identity platform that puts businesses back in control of their infrastructure, their users and their data**.

**Lite means simplicity in everything:** straightforward installation, understandable screens, minimal unnecessary complexity and control over what runs. A person should not need to understand a networking or identity protocol to complete an everyday task.

We began with Devices, IPAM and Racks. They are the foundation of the wider ambition, not the limit of the project.

## How to read this list

- **Existing #number:** an open GitHub issue already holds the idea. Discuss scope there instead of creating a duplicate.
- **New suggestion:** raised during brainstorming without a dedicated GitHub issue; create one only after discussing its boundaries, if prioritised. Existing ideas with issues are linked in the register.
- **Long-term ambition:** a product direction that needs discovery, security review and smaller agreed proposals before implementation.
- **Planning milestone:** a GitHub grouping (#20–#25) for related requests, **not** a release commitment. Boundaries and priority can be reviewed.

The current [public roadmap](../../ROADMAP.md) remains authoritative for published and actively approved work. These established planning groupings are *planning aids*, not a replacement.

## Brainstorm register

| Idea | Current record | Planning milestone | What it could help someone do |
| --- | --- | --- | --- |
| Core Assets: individual items, quantity stock and stock movements | [New #352](https://github.com/Caffoot/Caffoot-Lite/issues/352) | 1 — Everyday IT | Track and issue monitors, accessories and stock without unnecessary IPAM fields |
| Suppliers, locations, contacts and ongoing issues | [Existing #349](https://github.com/Caffoot/Caffoot-Lite/issues/349) | 1 — Everyday IT | Connect purchasing sources and contacts to equipment |
| Roles and user overrides | [Existing #350](https://github.com/Caffoot/Caffoot-Lite/issues/350) | 1 — Everyday IT | Enforce permissions across the connected workflows |
| Asset Data Quality foundations for non-networked stock | [Related #291](https://github.com/Caffoot/Caffoot-Lite/issues/291) | 3 — Inventory tools (earlier design dependency) | Avoid incorrectly flagging non-networked assets as missing IP addresses |
| Equipment purchase, warranty, lifecycle, optional documents and movement history | [Expanded #286](https://github.com/Caffoot/Caffoot-Lite/issues/286) | 1 — Everyday IT | Track lifecycle and documented location changes; explore limited related files without duplicating document management |
| QR codes and printable asset labels | [Existing #287](https://github.com/Caffoot/Caffoot-Lite/issues/287) | 3 — Inventory tools | Scan equipment to open its authorised record |
| Optional stocktakes and physical asset verification | [New #322](https://github.com/Caffoot/Caffoot-Lite/issues/322) | 3 — Inventory tools | Confirm documented equipment is physically present, with or without QR scanning |
| CSV import/export, safe duplicate preview and practical bulk updates | [Expanded #288](https://github.com/Caffoot/Caffoot-Lite/issues/288) | 3 — Inventory tools | Import from spreadsheets without silently duplicating or overwriting devices |
| Safe multiple-device duplication (templates rejected in later planning) | [Existing #289](https://github.com/Caffoot/Caffoot-Lite/issues/289) | 3 — Inventory tools | Duplicate similar devices safely without copying unique identity |
| Printable inventory and audit reports | [Existing #290](https://github.com/Caffoot/Caffoot-Lite/issues/290) | 3 — Inventory tools | Share a clear inventory with managers or auditors |
| Inventory completeness checks | [Existing #291](https://github.com/Caffoot/Caffoot-Lite/issues/291) | 3 — Inventory tools | Find missing locations, owners or key details without forcing every optional field |
| Organisation-specific asset information (closed, not planned) | [Closed #323](https://github.com/Caffoot/Caffoot-Lite/issues/323) | Not planned | Historical proposal; not part of the current work |
| Remembered inventory filters and saved views | [Existing #241](https://github.com/Caffoot/Caffoot-Lite/issues/241) | 3 — Inventory tools | Revisit frequently used lists without rebuilding the search |
| Multiple network interfaces, IP addresses and IPv6 | [Existing #231](https://github.com/Caffoot/Caffoot-Lite/issues/231) | 2 — Connected infrastructure | Document real-world network interfaces and addresses |
| Switch ports, patch panels, cabling, documented connection tracing and topology diagrams, including proposed PDF/draw.io/Visio-compatible exports | [Expanded #235](https://github.com/Caffoot/Caffoot-Lite/issues/235) | 2 — Connected infrastructure | Follow documented connections and share diagrams; explore editable draw.io files for compatible Nextcloud editors |
| Rename IP Address Blocks and organise unassigned networks | [New #312](https://github.com/Caffoot/Caffoot-Lite/issues/312) | 2 — Connected infrastructure | Fix block names and group imported networks without losing allocations |
| UPS/PDU power connections and documented downstream impact views | [New #313](https://github.com/Caffoot/Caffoot-Lite/issues/313) | 2 — Connected infrastructure | See what documented equipment depends on each power source |
| Equipment relationships and documented dependency impact views | [New #314](https://github.com/Caffoot/Caffoot-Lite/issues/314) | 2 — Connected infrastructure | Understand related infrastructure beyond individual cables |
| VLAN membership across switches, ports and devices | [New #315](https://github.com/Caffoot/Caffoot-Lite/issues/315) | 2 — Connected infrastructure | Find documented equipment using a selected VLAN |
| DNS and DHCP documentation for each network | [New #319](https://github.com/Caffoot/Caffoot-Lite/issues/319) | 2 — Connected infrastructure | Know which recorded services provide addressing and name resolution; no live DNS/DHCP service |
| People, departments and assigned devices | [Existing #232](https://github.com/Caffoot/Caffoot-Lite/issues/232) | 1 — Everyday IT | See who uses equipment and which team owns it |
| Equipment handover and reassignment history | [Existing #292](https://github.com/Caffoot/Caffoot-Lite/issues/292); related to #232 | 1 — Everyday IT | Understand when an asset changed hands |
| Device-linked support tickets and service desk | [Existing #233](https://github.com/Caffoot/Caffoot-Lite/issues/233) | 1 — Everyday IT | Report and resolve problems with the right context |
| IT documentation with version history | [Existing #237](https://github.com/Caffoot/Caffoot-Lite/issues/237) | 3 — Inventory tools | Keep procedures and records tied to relevant systems |
| Infrastructure monitoring, alerts and live status | [Existing #236](https://github.com/Caffoot/Caffoot-Lite/issues/236) | 4 — Optional IT operations | Notice and investigate meaningful problems |
| Optional network discovery and SNMP-assisted inventory | [New #320](https://github.com/Caffoot/Caffoot-Lite/issues/320) | 4 — Optional IT operations | Explore authorised, read-only assistance; feasibility, safety and optionality require separate approval |
| Endpoint inventory and device management | [Existing #293](https://github.com/Caffoot/Caffoot-Lite/issues/293) | 4 — Optional IT operations | Manage supported computers as well as document them |
| Patch management and deployment | [Existing #294](https://github.com/Caffoot/Caffoot-Lite/issues/294) | 4 — Optional IT operations | Understand and apply supported updates safely |
| Authorised remote assistance | [Existing #295](https://github.com/Caffoot/Caffoot-Lite/issues/295) | 4 — Optional IT operations | Help a person or troubleshoot a managed computer remotely |
| Simple operational automation | [Existing #296](https://github.com/Caffoot/Caffoot-Lite/issues/296) | 4 — Optional IT operations | Reduce repetitive approved IT tasks |
| Optional application sections or capabilities | [Existing #238](https://github.com/Caffoot/Caffoot-Lite/issues/238) | 1 — Everyday IT | Keep the core simple when advanced functions are not needed |
| LDAP, LLDAP and Active Directory integration | [Existing #240](https://github.com/Caffoot/Caffoot-Lite/issues/240) | 5 — Identity and access | Work alongside a business's existing directory |
| Standards-based self-hosted application SSO | [Existing #297](https://github.com/Caffoot/Caffoot-Lite/issues/297) | 5 — Identity and access | Give authorised users a consistent sign-in for supported applications |
| Domainless login for supported PCs | [Existing #298](https://github.com/Caffoot/Caffoot-Lite/issues/298); long-term ambition | 5 — Identity and access | Use a managed identity on computers without requiring a traditional domain |
| Computer enrolment and identity/device policies | [Existing #299](https://github.com/Caffoot/Caffoot-Lite/issues/299) | 5 — Identity and access | Manage which users and devices may access company systems |
| Offline sign-in and emergency identity recovery | **Required discovery topic, not a feature design** | 5 — Identity and access | Avoid unnecessary lockouts if the server or internet is unavailable |
| MSP customers and overlapping networks | [Existing #234](https://github.com/Caffoot/Caffoot-Lite/issues/234) | 6 — Larger organisations | Safely document separate customers using similar private addresses |
| Practical tutorials, community feedback and adoption | [Existing #239](https://github.com/Caffoot/Caffoot-Lite/issues/239) | Cross-cutting | Help people discover, install and learn the application |
| Secure remote access deployment guidance | [Existing #300](https://github.com/Caffoot/Caffoot-Lite/issues/300); cross-cutting | Across milestones | Reach a self-hosted service safely when away from the office |
| Backup, restore and migration experience | [Existing #301](https://github.com/Caffoot/Caffoot-Lite/issues/301); review current behaviour before scoping | Across milestones | Keep control of business data and recover when things go wrong |

**Important:** A proposed name here does **not** imply that the current application lacks every part of the behaviour. Before opening a new feature issue, compare the suggestion with the released functions and approved v2.1 work to avoid duplicates.

## Suggested milestone boundaries

These six groups correspond to [GitHub Milestones #20–#25](PROPOSED-MILESTONES.md). **Their numbers are organisational labels, not six promised releases.**

### Milestone 1 — Everyday IT Management

**The next planning priority after v2.1.** Plan Suppliers, core Assets/stock, People/Departments, assignments, handovers and full Service Desk together so that shared relationships and permissions are correct, while developing individually approved features in a sensible sequence. Lifecycle and small approved usability improvements also belong here.

**Dependencies:** preserve Devices, IPAM, Racks and published data; establish RBAC, employee-versus-login identity, stock movements, assignment history and safe linked records before implementation.

**Keep simple:** normal device creation stays quick, quantity stock does not need individual device records or IPAM, and no full CRM/procurement system is implied.

### Milestone 2 — Connected infrastructure

Build on existing IPAM and Devices to document network interfaces, switch ports and the links between them. Only then consider diagrams based on those recorded relationships.

**Dependencies:** agreed data models for interfaces and connections, careful migration and compatibility with existing inventory.

**Keep simple:** everyday devices should not require a detailed networking setup.

### Milestone 3 — Inventory Tools, Reporting & Verification

Build on established Devices, Assets, People and Service Desk records with CSV/JSON workflows, bulk and duplication improvements, QR labels, stocktakes, Data Quality, saved views, reports and IT documentation with history.

**Dependencies:** stable asset identities and assignment relationships, permission checks, atomic bulk changes and correct data preservation. Non-networked asset validity must be established in Milestone 01 rather than left to a later Data Quality update.

**Keep simple:** these supporting tools should reduce repetitive work without creating competing inventory or document systems.

### Milestone 4 — Optional IT operations

Explore genuine availability monitoring, then whether endpoint management, patching, remote assistance and automation are worthwhile. These are substantial separate areas, not a single feature.

**Dependencies:** security boundaries, operating-system support, network connectivity, notifications, maintenance burden and possible device-side components. **No agent, monitoring service or deployment architecture has been selected.**

**Keep simple:** someone who only wants inventory should not be required to install monitoring or endpoint-management components.

### Milestone 5 — Identity and access

Start by investigating integration with existing directories. Explore standards-based application SSO and, as a **long-term goal**, managed domainless computer sign-in. Traditional directory integration and domainless operation should both remain potential choices.

**Dependencies:** supported operating systems, identity protocols, account recovery, offline access, device enrolment, MFA, security audits and an agreed trust architecture. PC sign-in is **not** the same as web SSO.

**Keep simple:** use established standards and proven components; never create a proprietary authentication protocol merely for convenience. **No claim of Active Directory replacement or cross-platform PC login is approved or available today.**

### Milestone 6 — Larger organisations and service providers

Investigate customer separation, overlapping private addresses, permission boundaries and reliable operation at a larger scale.

**Dependencies:** correct data isolation and migration for existing single-organisation installations.

**Keep simple:** no mandatory multi-customer setup for a single business or home lab.

## Longer-term departmental direction

[Issue #353](https://github.com/Caffoot/Caffoot-Lite/issues/353) records a **future, unassigned** possibility for Maintenance, Facilities and Production to manage machinery, equipment, inspections and service schedules. No such work is authorised in the current IT-focused milestones. Shared departments and assets must continue to respect explicit #350 permissions.

## How the ideas connect

Some proposals become more useful when earlier capabilities exist. These are *possible dependencies*, not decisions to bundle features:

- **Suppliers, Devices and Assets → People/Departments → assignments and handovers → linked support tickets.** Plan the connected foundation together in Milestone 01; approve each detailed implementation separately.
- **Device interfaces → physical connections → topology diagrams.** Diagrams should reflect recorded facts rather than imply automatic discovery.
- **Inventory → monitoring → optional endpoint actions.** Knowing that a device exists is different from having authority to control it.
- **Existing directory integration → application SSO discovery → domainless PC login research.** These solve different problems and must have distinct security and acceptance requirements.
- **Data exports, recovery and permissions** matter across every milestone rather than appearing only at the end.

## What should we prioritise first?

Before converting ideas into scoped feature requests or version targets, discuss:

1. **Most useful near-term improvements:** which three everyday problems should we solve after v2.1?
2. **Core versus optional:** which capabilities must every installation have, and which should be explicitly enabled?
3. **Existing records:** do any new ideas actually belong as additions to open issues rather than separate requests?
4. **Security and operational burden:** which features need specialist review, device components or ongoing maintenance?
5. **Small releases:** can we deliver each benefit in manageable, independently testable increments?
6. **Community evidence:** what are existing users asking for, and what problems do prospective users face?

## Decisions and next steps

- **Agreed vision:** a self-hosted IT management and identity platform, with *Lite* meaning simplicity and data sovereignty at its core.
- **Planning updated 10 November 2026:** six GitHub Milestones #20–#25 remain; #232, #233 and #292 moved into Milestone 01 alongside new #352; nine inventory-tool issues moved to 03; Milestone 02 unchanged; future departmental idea #353 remains unassigned. See the current issue milestone fields and [#351 checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6764257679).
- **Not yet decided:** implementation approval for individual proposals, feature priorities, release versions, dates or whether to build each idea.
- **Next sensible step:** complete the linked Milestone 01 workflow, dependency and approved HTML design review, then seek separate implementation approval. Check for duplicates before adding further ideas.
- **Not affected:** the published v2.1 release, its approved designs, or existing functionality; future work still needs separate approval.
