# Caffoot Lite — Architecture Decisions

This log distinguishes accepted product direction from technical decisions still awaiting evidence. Changes to architecture require review against the product vision and existing backup compatibility.

## ADR-001 — One product, Caffoot Lite

**Status:** Accepted — 21 October 2026

Caffoot Lite is the sole actively developed product. A separate Pro edition is no longer planned. "Lite" refers to ease of use rather than a reduced feature set. This does not establish a permanent licensing, pricing or commercial model.

**Consequences:** Plan one coherent product architecture and roadmap. Do not split code or documentation into Lite and Pro editions without a new explicit decision.

## ADR-002 — Preserve the experience during architecture work

**Status:** Accepted — 21 October 2026

v1.4.0 prioritises data and architecture foundations rather than new end-user features. Preserve existing navigation, layout, workflows and behaviour; validate v1.3.0 JSON backup migration and rollback. Existing published releases remain a reference point.

## ADR-003 — Device identity and asset numbering

**Status:** Direction accepted; detailed schema pending audit — 21 October 2026

Every device requires a permanent internal identity independent of hostname, address, user, location and visible asset number. Plan configurable human-readable asset numbering (prefix, start number, formatting, and support for existing asset tags). Resolve uniqueness, import collisions, deletion and history rules before implementation.

## ADR-004 — Deployment and storage

**Status:** Open — evaluation required

Actively evaluate Docker deployment and database-backed storage, including SQLite and PostgreSQL, alongside the current browser-storage architecture. No technology is selected before code audit, operational/security assessment and migration design. Easy setup and durable storage are required outcomes.

## ADR-005 — Internet-facing security

**Status:** Future requirement; not implemented by this decision

Design for safe operation behind Caddy or Nginx Proxy Manager with secure individual logins, administrator MFA by default, role/group/department authorisation, and future LDAP/OIDC integration. A reverse proxy alone is not a security boundary. **The current standalone application must not be represented as safe for public internet exposure or multi-user use.**

## ADR-006 — Device-centred support context

**Status:** Future design requirement

Future tickets should be linked primarily to a device record, while retaining the requester/contact and other relevant participants. Device history should connect assignment, location, configuration, software, services and incidents. Access to sensitive records must be permission-controlled.

## ADR-007 — Optional subnet-derived VLAN suggestion

**Status:** Future design candidate

Explore an optional rule selecting an IPv4 octet to suggest a VLAN number (e.g., third octet of 192.168.10.0/24 suggests VLAN 10). Require validation, manual override and network/customer scoping; never assume this is a universal one-to-one mapping.
