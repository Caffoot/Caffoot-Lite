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

**Milestone 01 — Everyday IT Management** targets v2.2. Stage 1 roles/IT Staff is accepted via PR #358. Stage 2 optional Devices/IPAM/Racks is accepted; Stage 3 Batches 3.1–3.4 add core Staff Members and Departments, initial Device assignments and My Equipment on the separate `milestone-1` branch. **Batch 3.4 manual acceptance is deferred, not passed.** See [exact checkpoints](docs/development-guide/Development-Status.md) and [tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351).

Approved milestone direction still awaiting dependent implementation includes:

- Independently optional IT Assets, quantity stock and later assignment/return workflows ([#352](https://github.com/Caffoot/Caffoot-Lite/issues/352), [#292](https://github.com/Caffoot/Caffoot-Lite/issues/292)).
- Suppliers in Stage 4 and linked Service Desk work in Stage 5 ([#349](https://github.com/Caffoot/Caffoot-Lite/issues/349), [#233](https://github.com/Caffoot/Caffoot-Lite/issues/233)).
- Stage 6 integrated compatibility, complete-volume upgrade/restore and final acceptance.

**v2.2 is not publicly installable.** No release date is promised. The [six planning milestones](docs/product-direction/PROPOSED-MILESTONES.md) organise later work without approving every proposal. Their dated original structure remains historical context, not an alternative to later issue decisions.

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

*Updated: 15 November 2026. Published v2.1, unreleased implementation, approved pending work and unscheduled proposals are distinguished above.*
