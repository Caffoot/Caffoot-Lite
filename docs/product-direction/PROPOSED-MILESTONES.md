# Caffoot Lite — Long-Term Planning Milestones

> **Agreed planning structure — 5 November 2026.** Six GitHub Milestones #20–#25 group future requests under the agreed [product vision](VISION.md); they do not constitute an approved development schedule. No future version number, date, feature scope or technical architecture is agreed by this document.

## Where we are today

**Published:** v2.0.3 provides Devices, IPAM, Racks, shared SQLite inventory, account permissions and multi-factor authentication.

**Approved work in progress:** v2.1's interface and agreed changes are governed by [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282). Completing and accepting that work comes first. These planning milestones add nothing to its scope.

## Established planning milestones

GitHub Milestones #20–#25 group future requests by the **benefit to users**, not by a chosen technology. Their existence does not approve any individual implementation, and priorities or boundaries may change after discussion.

### Milestone 01 (#20) — Easier everyday asset management

**Outcome:** An administrator can find, record and maintain useful information about equipment without repeating work.

Potential ideas:
- Asset lifecycle: purchase dates, warranties, status, replacements and retirement.
- Simple device templates and more useful bulk import/export.
- QR labels linking to authorised device records.
- Clear reports and documentation-completeness checks.
- [Remembered filters and saved views — #241](https://github.com/Caffoot/Caffoot-Lite/issues/241).

**To decide:** Which tasks are genuinely time-consuming today? What is the simplest useful first release? Which information must remain optional?

### Milestone 02 (#21) — Understand how infrastructure fits together

**Outcome:** Users can see not only what equipment exists but also how it is connected and addressed.

Existing proposals:
- [Multiple interfaces, IP addresses and IPv6 — #231](https://github.com/Caffoot/Caffoot-Lite/issues/231).
- [Switch ports, connections and topology diagrams — #235](https://github.com/Caffoot/Caffoot-Lite/issues/235).

**To decide:** How connections should be recorded, what diagrams can accurately show from entered data, and how existing inventory is preserved.

### Milestone 03 (#22) — Connect assets to people and support

**Outcome:** An IT team can understand who uses an asset, what needs attention and where to find related help.

Existing proposals:
- [People, departments and assigned assets — #232](https://github.com/Caffoot/Caffoot-Lite/issues/232).
- [Device-linked support tickets — #233](https://github.com/Caffoot/Caffoot-Lite/issues/233).
- [In-app IT documentation and revision history — #237](https://github.com/Caffoot/Caffoot-Lite/issues/237).

**To decide:** Whether employee records require login accounts, access/privacy rules, and which links between people, assets and tickets are actually useful.

### Milestone 04 (#23) — Add optional IT operations capabilities

**Outcome:** Teams can spot and respond to real infrastructure problems without making inventory complicated for everyone.

Existing proposals and possible extensions:
- [Monitoring, alerts and status history — #236](https://github.com/Caffoot/Caffoot-Lite/issues/236).
- Explore endpoint management, patching, automation and authorised remote support **only after separate discussion**.
- [Optional application sections — #238](https://github.com/Caffoot/Caffoot-Lite/issues/238).

**To decide:** The operational cost, lightweight deployment options, permissions and what happens when a managed device is offline. No device agent or monitoring architecture has been chosen.

### Milestone 05 (#24) — Offer genuine identity and access choice

**Outcome:** Organisations can manage access through a self-hosted platform, with a long-term route towards domainless computer sign-in and application SSO.

Potential stages to explore:
- [Optional LDAP, LLDAP and Active Directory integration — #240](https://github.com/Caffoot/Caffoot-Lite/issues/240), preserving local administrator recovery.
- Investigate standards-based self-hosted identity services for supported applications.
- Investigate domainless sign-in for supported computers, alongside optional traditional directory integration.
- Work out device enrolment, access removal, offline sign-in, emergency recovery and auditability.

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
- Redesigning the current application or changing [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282).

Those require future discussion and explicit approval.
