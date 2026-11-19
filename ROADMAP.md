# Caffoot Lite — Public Roadmap

**Infrastructure, Simplified.** Caffoot Lite is free, open-source IP address management, device inventory and network rack documentation for small businesses, IT teams and home labs.

This page helps visitors see what is available, what is being developed and which ideas are being considered. **An idea is not a promised feature or release date.** The product owner decides priorities and approves changes before development.

## Available now — v2.1

Caffoot Lite v2.1 was published on **8 November 2026**. The current release includes:

- Device inventory with improved physical-server and virtual-machine forms.
- Subnet-first IP address management (IPAM), optional VLANs and guided bulk subnet planning.
- Network rack documentation, front/rear views and equipment placement.
- Multi-user access, administrator-managed permissions, MFA, account/email workflows and Audit Trail.
- A modern, responsive light/dark interface and Docker/SQLite deployment with persistent data.

**[Install Caffoot Lite](INSTALLATION.md)** · **[See the latest release](https://github.com/Caffoot/Caffoot-Lite/releases/latest)** · **[Explore the features](docs/how-tos/features-and-instructions/README.md)**

## In development — v2.2, not published

**Milestone 01 — Everyday IT Management** targets v2.2. **Stages 1–4 have completed development and integration** on the separate `milestone-1` branch, verified at `c1b5f8008e8ba56840d9790e3ba1c7e91ad35e0b` (schema 24) on 19 November 2026. They are not published features in v2.1.

- **Stage 1 and 2:** accepted shared roles, IT Staff/MFA protections and optional Devices/IPAM/Racks foundations.
- **Stage 3:** accepted Staff Members/Departments, equipment assignments and My Equipment; optional IT Assets with receipt, stock movement, Device registration/reissue, Associated Equipment, direct handover and stock reporting.
- **Stage 4:** owner-accepted Supplier Management, company-owned Supplier Issues and Purchasing Dashboard, supplier/equipment integration and configurable Equipment Lifecycle. [Four merged batches #410–#413 and formal sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/369#issuecomment-7007760294).

**Next planned Stage 5:** The [Service Desk and Central Email Templates tracker #419](https://github.com/Caffoot/Caffoot-Lite/issues/419) records four frozen, owner-approved HTML designs and the agreed six-batch sequence [#420–#425](https://github.com/Caffoot/Caffoot-Lite/issues/420). **No Stage 5 application development or individual batch is authorised yet.** Ordinary Staff Member My/Department Tickets access and authorised IT Staff Service Desk access are already approved; later implementation must retain the agreed privacy and existing security model. No extra dashboards, KPIs, work-credit schemes or redesigned interfaces are authorised.

**Still outstanding:** explicitly deferred native Raspberry Pi/Safari and other manual evidence, Stage 6 integrated security/compatibility and full-volume upgrade/backup/restore acceptance, and separate owner approval for the final milestone merge, deployment and release. [Development Status](docs/development-guide/Development-Status.md), [Milestone tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351) and [draft v2.2 guides](docs/how-tos/features-and-instructions/v2.2-draft/README.md) contain the current boundaries.

**v2.2 remains unreleased.** No release date is promised. The draft guides are not published installation or upgrade instructions. The [six planning milestones](docs/product-direction/PROPOSED-MILESTONES.md) preserve earlier planning context, while later explicit owner decisions control current scope.

## Ideas under consideration — not yet scheduled

The community is welcome to suggest and discuss improvements. Current individual proposals include:

- [Multiple network interfaces, addresses per device and IPv6 (#231)](https://github.com/Caffoot/Caffoot-Lite/issues/231)
- [MSP customers and overlapping private IP ranges (#234)](https://github.com/Caffoot/Caffoot-Lite/issues/234)
- [Switch ports, connections and topology (#235)](https://github.com/Caffoot/Caffoot-Lite/issues/235)
- [Monitoring, alerts and live status (#236)](https://github.com/Caffoot/Caffoot-Lite/issues/236)
- [In-app documentation and revision history (#237)](https://github.com/Caffoot/Caffoot-Lite/issues/237)
- [LDAP/LLDAP/Active Directory sign-in (#240)](https://github.com/Caffoot/Caffoot-Lite/issues/240)
- [Saved filters and inventory views (#241)](https://github.com/Caffoot/Caffoot-Lite/issues/241)
- [Long-term departmental asset management (#353)](https://github.com/Caffoot/Caffoot-Lite/issues/353) — future direction only, outside the immediate IT scope.

Explore [all future requests](https://github.com/Caffoot/Caffoot-Lite/labels/future%20request) for more ideas and their discussions. These are proposals, not commitments to implement them.

## Help shape Caffoot Lite

You don't need to write code to contribute. Try the current release, share your experience, tell us what was difficult or suggest something useful.

- **[Suggest a feature or report a bug](https://github.com/Caffoot/Caffoot-Lite/issues/new/choose)** — use one issue per suggestion, so decisions remain easy to follow.
- **[Find ways to contribute](docs/Community-Participation.md)** — testing, documentation and practical feedback are welcome.
- **[Read the contribution guide](CONTRIBUTING.md)** — our shared standards for welcoming and constructive participation.

Please [report security vulnerabilities privately](SECURITY.md), not in public issues.

---

*Updated: 19 November 2026. Published v2.1, integrated unreleased work, Stage 5 planning and unscheduled proposals are distinguished above.*
