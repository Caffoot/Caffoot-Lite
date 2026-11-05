# Caffoot Lite — Feature Brainstorm and Milestone Mapping

> **Working discussion draft — 5 November 2026.** This is a **list of possibilities**, not a feature specification, approved scope, delivery commitment or release schedule. Use it alongside the [long-term vision](VISION.md) and [proposed milestones](PROPOSED-MILESTONES.md). Caffoot Lite v2.1 remains governed by [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282).

## Our starting point

Caffoot Lite aims to become **a self-hosted IT management and identity platform that puts businesses back in control of their infrastructure, their users and their data**.

**Lite means simplicity in everything:** straightforward installation, understandable screens, minimal unnecessary complexity and control over what runs. A person should not need to understand a networking or identity protocol to complete an everyday task.

We began with Devices, IPAM and Racks. They are the foundation of the wider ambition, not the limit of the project.

## How to read this list

- **Existing #number:** an open GitHub issue already holds the idea. Discuss scope there instead of creating a duplicate.
- **New suggestion:** raised during our brainstorming, with **no individual GitHub issue yet**. New future-request issues #292–#301 have been added for some earlier suggestions. If prioritised, create a specific future-request issue after discussing its boundaries.
- **Long-term ambition:** a product direction that needs discovery, security review and smaller agreed proposals before implementation.
- **Possible milestone:** where an idea might fit, **not** when it will ship. Milestones can overlap, move or be broken into smaller releases.

The current [public roadmap](../../ROADMAP.md) remains authoritative for published and actively approved work. The proposed groupings below are *planning aids*, not a replacement.

## Brainstorm register

| Idea | Current record | Possible milestone | What it could help someone do |
| --- | --- | --- | --- |
| Equipment purchase, warranty, lifecycle and retirement | **New suggestion** | 1 — Everyday assets | Know what needs replacing, repairing or retiring |
| QR codes and printable asset labels | **New suggestion** | 1 — Everyday assets | Scan equipment to open its authorised record |
| CSV import/export and practical bulk updates | **New suggestion** | 1 — Everyday assets | Move away from spreadsheets and reduce repeated typing |
| Reusable device templates | **New suggestion** | 1 — Everyday assets | Add similar equipment more quickly |
| Printable inventory and audit reports | **New suggestion** | 1 — Everyday assets | Share a clear inventory with managers or auditors |
| Inventory completeness checks | **New suggestion** | 1 — Everyday assets | Find missing locations, owners or key details without forcing every optional field |
| A few organisation-specific asset fields | **New suggestion** | 1 — Everyday assets | Record useful local details without changing the standard interface for everyone |
| Remembered inventory filters and saved views | [Existing #241](https://github.com/Caffoot/Caffoot-Lite/issues/241) | 1 — Everyday assets | Revisit frequently used lists without rebuilding the search |
| Multiple network interfaces, IP addresses and IPv6 | [Existing #231](https://github.com/Caffoot/Caffoot-Lite/issues/231) | 2 — Connected infrastructure | Document real-world network interfaces and addresses |
| Port-to-port connectivity and topology diagrams | [Existing #235](https://github.com/Caffoot/Caffoot-Lite/issues/235) | 2 — Connected infrastructure | Understand what connects to what |
| People, departments and assigned devices | [Existing #232](https://github.com/Caffoot/Caffoot-Lite/issues/232) | 3 — People and support | See who uses equipment and which team owns it |
| Equipment handover and reassignment history | [Existing #292](https://github.com/Caffoot/Caffoot-Lite/issues/292); related to #232 | 3 — People and support | Understand when an asset changed hands |
| Device-linked support tickets and service desk | [Existing #233](https://github.com/Caffoot/Caffoot-Lite/issues/233) | 3 — People and support | Report and resolve problems with the right context |
| IT documentation with version history | [Existing #237](https://github.com/Caffoot/Caffoot-Lite/issues/237) | 3 — People and support | Keep procedures and records tied to relevant systems |
| Infrastructure monitoring, alerts and live status | [Existing #236](https://github.com/Caffoot/Caffoot-Lite/issues/236) | 4 — Optional IT operations | Notice and investigate meaningful problems |
| Endpoint inventory and device management | [Existing #293](https://github.com/Caffoot/Caffoot-Lite/issues/293) | 4 — Optional IT operations | Manage supported computers as well as document them |
| Patch management and deployment | [Existing #294](https://github.com/Caffoot/Caffoot-Lite/issues/294) | 4 — Optional IT operations | Understand and apply supported updates safely |
| Authorised remote assistance | [Existing #295](https://github.com/Caffoot/Caffoot-Lite/issues/295) | 4 — Optional IT operations | Help a person or troubleshoot a managed computer remotely |
| Simple operational automation | [Existing #296](https://github.com/Caffoot/Caffoot-Lite/issues/296) | 4 — Optional IT operations | Reduce repetitive approved IT tasks |
| Optional application sections or capabilities | [Existing #238](https://github.com/Caffoot/Caffoot-Lite/issues/238) | Cross-cutting | Keep the core simple when advanced functions are not needed |
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

These six groups mirror [the proposed milestone document](PROPOSED-MILESTONES.md). **The numbers describe a possible discussion sequence, not six promised releases.**

### Milestone 1 — Everyday asset management

**First opportunity to explore after the v2.1 foundation is accepted.** Focus on practical improvements people notice immediately. Lifecycle data, reporting, bulk actions and QR codes could each be separate deliverables.

**Dependencies:** understand existing device fields, import/export behaviour, permissions and how labels refer to devices.

**Keep simple:** ordinary device creation must stay quick; don't require purchase or warranty information for every asset.

### Milestone 2 — Connected infrastructure

Build on existing IPAM and Devices to document network interfaces, switch ports and the links between them. Only then consider diagrams based on those recorded relationships.

**Dependencies:** agreed data models for interfaces and connections, careful migration and compatibility with existing inventory.

**Keep simple:** everyday devices should not require a detailed networking setup.

### Milestone 3 — People, assets and support

Add the human context: who holds equipment, what department owns it, useful handover history, documentation and potentially tickets.

**Dependencies:** clear separation between employees and login accounts; permissions, privacy and safe reassignment.

**Keep simple:** an employee should not need a technical inventory account merely to be associated with a laptop.

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

## How the ideas connect

Some proposals become more useful when earlier capabilities exist. These are *possible dependencies*, not decisions to bundle features:

- **Equipment records → assignments → handovers → linked support tickets.** A basic service desk could still be useful before every assignment feature exists.
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

- **Agreed vision for discussion:** a self-hosted IT management and identity platform, with *Lite* meaning simplicity and data sovereignty at its core.
- **Current proposal:** group ideas into six possible milestone areas.
- **Not yet decided:** feature priorities, definitive milestone order, release versions, dates, implementations or whether to build each idea.
- **Next sensible step:** review and rank the ideas with the product owner. Afterwards, record genuinely new ideas in individual **future request** issues and define the first small milestone. Avoid duplicates with existing issues.
- **Not affected:** v2.1 [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282), its approved designs, the existing public roadmap and current released functionality.
