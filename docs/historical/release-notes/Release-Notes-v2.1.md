# Caffoot Lite v2.1 — Release Notes

**Simplicity in everything.** Your infrastructure. Your users. Your data.

These are the v2.1 release notes. For the confirmed publication status and downloads, consult the [official GitHub Releases page](https://github.com/Caffoot/Caffoot-Lite/releases). Public AMD64 and ARM64 images must be verified through the release workflow; website publication and deployment are separate decisions.

## A Fresh, Modern Interface Built Around Simplicity

v2.1 replaces the previous presentation with the twelve pinned, owner-approved modular HTML designs. Shared navigation, responsive cards/forms, icons, light/dark themes and local Help & Guides use plain HTML, CSS and JavaScript with the existing Python/SQLite application. No replacement framework or new authoritative browser database is introduced. Sign In and About carry the approved tagline. The public source provenance remains pinned at `c26db4a56bbc30f95b56201e81a7a76d13c6037b`.

The Dashboard, Devices, IPAM, Network Racks, Users, My Account, Audit Trail and Settings & Data keep their existing responsibilities. Main navigation spacing, tab icons, accessible focus reveal and approved hierarchy corrections are included. The print mode remains an optional existing choice; it has not become the default.

## Devices, Physical Hosts And Virtual Machines

- Add/Edit/Duplicate follows the approved form cards and grouping, with internal scrolling, accessible actions, local errors, useful focus and a Notes area that fills the available workspace. Duplicate uses its subtitle rather than an extra banner; all existing formatting actions and stored notes remain.
- Eligible physical servers expose the hosting checkbox on General. When enabled, dedicated hypervisor product/version selectors replace ordinary OS selection in that form. Hypervisor products are excluded from ordinary OS/Installed Software choices without deleting catalogue or historical assignments.
- Virtual Machine deployment uses eligible saved physical hosts, VM purpose and allocated CPU/RAM/storage/network resources. Inapplicable physical/rack/hardware controls are hidden. Existing eligibility, conditional fields, guest relationships and safety confirmations remain.
- Contextual OS/version/software choices refresh immediately and retain supported custom/historical records. Proxmox VE, Hyper-V and ESXi lists remain distinct. The approved catalogue and 100-character software/service name validation are consistent across create/edit/server boundaries.
- Rack selection can default Location Area while preserving saved values and deliberate overrides. Optional shelf associations, supported shelf creation, location display and reviewed atomic shelf removal/retirement retain existing permission and five-minute editing-reservation safeguards.
- The read-only Details header uses the approved accessible Close control; other accepted Details/Device screens are preserved.

## Subnet-first IPAM

- Devices select a named subnet without first choosing VLAN. VLAN is derived and read-only, or Not assigned. Choose an Available IP appears above manual Primary IP; both use the same saved address and existing allocation/reservation checks.
- Newly created addressable subnets require a unique trimmed/case-insensitive name and explicit LAN, Management or VPN purpose. VLAN is optional. VPN may omit a gateway; any supplied gateway must be usable and unconflicted. LAN/Management and legacy unclassified records retain required gateways.
- Historical missing purposes and duplicated names are not silently migrated or renamed. Unrelated edits/import retain existing values and representations; a deliberate rename must meet uniqueness. Optional values are not fabricated as VLAN 0 or an invented gateway.
- Separate Add Single Subnet and Add Multiple Subnets actions retain the existing IP allocation Bulk Edit Range. Optional collapsed Address Block/private-range planning precedes subnet creation. Parent blocks may be broader; addressable children remain /23–/30.
- Capacity guidance explains theoretical equal-sized capacity and suitable child prefixes, accounting for Every 10th spacing. It does not silently change the selected prefix or imply that ranges are available. Users still choose according to device/address needs.
- Consecutive, Every 10th Subnet and Custom CIDRs use an editable preview with individual names, purposes, optional VLANs, descriptions and gateways. Manual gateways/custom drafts survive Back where applicable and are revalidated. Desktop tables and stacked mobile rows scroll with actions available.
- Creation is limited to 1–50 subnets **per operation**, not per installation. The server validates fresh state and commits the optional parent, all children, catalogue and attributed audit together, or saves none. Three disjoint batches totalling 150 are covered by tests.
- A block may strictly contain an independent unparented network without adopting it. Its IDs, parent absence, names, VLAN, devices and allocations remain unchanged; parent filters follow explicit links only. Real network overlaps, equal/partial ranges, unrelated blocks and ownership conflicts remain rejected. Empty block deletion cannot detach independent inventory; explicit children still protect a block.

## Network Racks

Approved front/rear placement, U occupancy, dimensions, horizontal/vertical accessories, valid/invalid previews, keyboard controls, collision validation and saved positions remain. Remove Accessory styling and successful vertical-drop scroll preservation are restored without redesigning drag-and-drop. Shelf relationships and removal review work with linked devices and permissions. Existing rack printing and optional same-tab route remain; no speculative horizontal scrolling correction or default print-mode change is included.

## Accounts, Email And Security

My Account provides the approved personal/profile, password/MFA, appearance, Help and About views. Users and system Settings & Data remain administrator-managed. New accounts have no inventory rights until granted; administrators and editors retain required MFA. Existing field-level cross-section editing checks and device reservations remain server-enforced.

Saved email is optional. Verification status and guided eight-digit confirmation make ownership visible. Forgot Password? remains **username-only**; requests return neutral responses and do not reveal eligibility or delivery. Recovery requires an active eligible account, verified email and configured delivery, retains MFA requirements and revokes existing sessions after a successful reset. It cannot recover loss of both an administrator password and authenticator.

Eight-digit proofs bind to opaque challenges, expire after fifteen minutes and work once. Five failed confirmations exhaust a challenge; the durable account/purpose failure budget survives resends and restarts. Existing throttles, concurrency and account isolation remain. Schema 10 deliberately invalidates outstanding old-format email proofs on upgrade; request a new code. SMTP delivery is operationally dependent and no previously missing message is claimed fixed without evidence of its cause.

The private `account-email-secret.key`, when created, belongs beside SQLite in `/data`. It is not part of a database-only copy. Back it up securely with the matching full installation; never replace a missing key while usable challenges exist.

## Audit Trail And Settings & Data

Audit Trail places secondary navigation before relevant cards and retains metrics, filters, tables, tabs and security notices. Attributed events and inventory history remain bounded and permission-filtered. Bulk subnet summaries report the actual total/range while retaining omitted-detail notices; private information is not exposed to unrelated readers. The existing event-detail styling corrections are retained. Audit/history is not a database restore mechanism.

Settings & Data retains administrator inventory migration, safety checks, maintenance and optional SMTP configuration. My Account keeps personal appearance/help settings. Existing locally readable help works without fetching a public website; external full-guide links need network access. Canonical and legacy guide URLs remain byte-identical for older installed versions.

## Upgrade, Backup And Compatibility

Follow [INSTALLATION.md](../../../INSTALLATION.md#upgrading-v203-to-v21). Stop and protect the **entire** existing `/data` mount, including SQLite/sidecars, TLS, private account-email key when present and all other installation files, with original ownership/modes. Preserve the current mount, environment, HTTPS origin and ports. Do not substitute a fresh volume or import JSON as an upgrade step.

The application applies additive migrations through schema 10. Existing inventory, accounts, MFA, permissions and history are retained. Rollback requires the complete matching pre-upgrade backup and old image; an older binary must not open the upgraded database. Post-backup changes are not recovered by that rollback.

Published standalone v1.3.3 JSON import remains one-way inventory migration with explicit review and transactional confirmation; it does not import accounts/MFA or replace external Docker backup. The owner successfully imported a genuine saved v1.3.3 backup privately. **Two automated genuine private-fixture tests remain unrun**, and that manual success is not counted as their pass.

## Verification And Limits

Accepted application checkpoint `e39e58d1a270afd9f4cdae114668f5e2bb1fe771` passed backend (494 run, 491 passed, three established skips), full Chromium/editor, Firefox, Linux WebKit, real AMD64 Docker lifecycle and full-history secret checks. Owner native Pi/ARM64/macOS Safari acceptance covers the scenarios recorded in #329; it is not exhaustive touch/screen-reader, device or import-field coverage. Linux WebKit is not native Safari.

The separate release-preparation evidence records the one disposable published-v2.0.3 → exact v2.1 candidate full-`/data` check and any limitations in [the v2.1 handover](../development-handovers/v2.1.md) and [Issue #335](https://github.com/Caffoot/Caffoot-Lite/issues/335). The initial exercise preserved the tested old data/security and restart/recreation state but failed its final restore from a harness archive-layout error. After separate owner approval, one corrected exercise passed all eight preservation/restart/restore checks, including authenticated access to the complete restored v2.0.3 installation. Both results remain recorded; the specific restore-verification gap is resolved. This uses fictional AMD64 data, not private owner fixtures or an ARM64 upgrade test. Do not treat a pending or failed test as passed. Publication-time AMD64/ARM64 manifest and anonymous registry-access checks are recorded in the actual release workflow; private native builds alone do not prove a public image exists.

Existing guide screenshots are labelled as earlier-edition orientation, not new v2.1 captures. No website image, article or redesign has been implemented in this batch.

## Deferred And Separate

Public IP/WAN (#231), MSP customer isolation (#234), JavaScript restructuring (#304), further Address Block organisation (#312), deferred secondary-tab pixel polish, default print-mode changes, an additional password confirmation field and the website makeover remain outside this release-preparation scope. This release does not promise those proposals.

## Community And Source Records

Thank you to the product owner and community contributors who reported problems, tested private builds and improved the guides. Approved work is tracked through [#282](https://github.com/Caffoot/Caffoot-Lite/issues/282), including #305/#306, #308/#309, #310/#311, #317, #327/#328, #329/#330, #331/#332 and #333. [#335](https://github.com/Caffoot/Caffoot-Lite/issues/335) records the separately authorised preparation and evidence; [PR #336](https://github.com/Caffoot/Caffoot-Lite/pull/336) records the approved source merge. Website publication and deployment remain separate decisions.
