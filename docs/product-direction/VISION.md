# Caffoot Lite — Long-Term Product Vision

> **Discussion draft — 5 November 2026.** This describes the direction we are exploring, not features available today or development work approved to begin. The [public roadmap](../../ROADMAP.md) remains the source for released and currently approved work.

## Why Caffoot Lite exists

**A self-hosted IT management and identity platform that puts businesses back in control of their infrastructure, their users and their data.**

That is the long-term ambition for Caffoot Lite.

We started with Devices, IP Address Management (IPAM) and Network Racks because every useful IT management platform needs a clear picture of what an organisation owns and operates. Those are the starting point, not the limit of what Caffoot Lite could become.

Many small businesses need capable IT tools but do not have dedicated specialists for every system. The software should help them manage their IT without requiring them to understand the underlying technical details just to perform an everyday task.

## What “Lite” means

**Simple to use, not simplistic in what it can do.**

“Lite” is a design philosophy, not a promise that the product will always have few features. It means:

- **Straightforward to start:** clear installation, setup and maintenance guidance, with sensible defaults.
- **Understandable to use:** familiar language, consistent navigation and everyday tasks that do not require specialist knowledge.
- **Complexity kept out of the way:** show advanced options only when they are needed, without hiding important safety information.
- **Choice without clutter:** organisations use the capabilities they need without having to configure everything else.
- **Clear control:** administrators understand where their data is, who can access it and how to recover it.

The engineering behind the software may become sophisticated. That complexity should not be unnecessarily passed on to the people using it.

## Who it is for

**Small Businesses, IT Teams and Home Labs** are our audience today and remain central to the long-term direction.

A home-lab user should be able to document a handful of devices without setting up a helpdesk or identity service. A growing business should be able to expand into more capable management without starting over with another product.

## The long-term direction

These are areas to explore, **not commitments to build every capability**.

### Infrastructure and assets

Keep an accurate record of devices, IP addresses, racks and their connections. Explore equipment lifecycle, warranties, assigned assets, reporting, network interfaces and visual topology.

### People and IT support

Explore employee and department records, equipment assignment, a practical service desk and clear documentation linked to the people and systems concerned.

### Monitoring and operations

Explore optional infrastructure and device monitoring, meaningful alerts, endpoint management, patching and authorised remote support. The smallest useful experience should come before enterprise-scale complexity.

### Identity and access

The eventual ambition is **domainless computer sign-in and access management**, with a self-hosted identity service that can serve organisations without requiring a traditional Windows Active Directory domain.

**Working alongside existing directories is also important.** Organisations should have a choice: integrate existing directory services where appropriate or, in the longer term, explore managing supported identities and devices without a traditional domain.

Computer sign-in, application single sign-on and directory integration are different technical capabilities. Any implementation will need separately approved designs, secure standards-based components, independent security review and reliable recovery arrangements. We must not assume that current Caffoot Lite user accounts can already sign users into computers.

## Data sovereignty by design

Our goal is to let organisations retain practical control over their information and the services they rely on:

- Run the platform on infrastructure they control, without a mandatory vendor-hosted management account.
- Know where data is stored and how to export, back up, restore and migrate it.
- Control administrators, permissions and security policies.
- Choose integrations rather than being required to use an external cloud service for ordinary operation.
- Allow authorised people to work securely from outside the building, without treating direct public exposure as a safe default.
- Plan for failures: loss of internet, power or an identity server must not turn recoverable problems into unnecessary lockouts.

**Self-hosted does not automatically mean secure, private or highly available.** Those outcomes require careful engineering, deployment choices, updates, tested recovery and honest guidance.

## How this vision guides decisions

When considering a feature, ask:

1. What everyday problem will this solve, and who needs it?
2. Can someone understand the workflow without knowing the technology underneath?
3. Can it be introduced without making existing simple tasks harder?
4. Does it preserve control over data, access and recovery?
5. Can it be optional or introduced in smaller, useful steps?
6. What security, maintenance and compatibility responsibilities does it create?

Features should earn their place by making the product more useful, not by making a longer feature list.

## What is available now

The published **v2.0.3** release provides self-hosted device inventory, IPv4 IPAM, rack documentation, a central SQLite database, permissions, multi-user access and multi-factor authentication for relevant accounts.

The **v2.1 interface** is under approved development in [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282). It is not yet released.

**Domainless computer sign-in, SSO, remote management, service desk and monitoring are not features of the current release.** They belong to the long-term discussion until their requirements, risks and implementation are individually approved.

## From vision to work

The accompanying [proposed milestones](PROPOSED-MILESTONES.md) groups possible future work into understandable outcomes. It does not authorise development, assign release numbers or promise dates.

Individual feature discussions and decisions belong in [GitHub Issues labelled `future request`](https://github.com/Caffoot/Caffoot-Lite/labels/future%20request). The product owner approves scope before implementation.
