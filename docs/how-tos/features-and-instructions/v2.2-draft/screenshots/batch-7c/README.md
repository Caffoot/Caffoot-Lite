# Batch 7C — Desktop Instructional Screenshots

> **Independent-review correction — 27 November 2026:** The new captures used Playwright **1.62.1**, as recorded dynamically at capture time. Earlier reused images retain their own versions and provenance. [Evidence, corrected 7E mappings and pending visual-gap proposal](../../../../../development-guide/Milestone-01-Batches-7C-7E-Review-Corrections.md). This documentation correction adds or changes no image.

**27 November 2026. 41 new desktop light images, maximum 42; 23 groups and 120 owned specifications retained, with shared references.** Independent ChatGPT review and separate product-owner visual/privacy/caption/alt acceptance remain pending. No publication approval.

Authority: [consolidated owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7217032947). [Coverage](Coverage.md) · [provenance manifest](manifest.json) · [verification](Verification.md). The category ceilings are ceilings, not quotas.

| Allocation | New images |
| --- | --- |
| Supplier management | 8 |
| Supplier Issues and Purchasing | 7 |
| IT Assets Dashboard | 5 |
| Stock intake and readiness | 7 |
| Device registration and reissue | 6 |
| Equipment and Supplier integration | 8 |

## Fixture, Sequence And Provenance

Application `000818f42e854e4a1fee8692b9ffaaa52b5c788d`, schema 31, from the exact approved merged branch; documentation reconciliation checkpoint `19e148efc866c054842c628ea2a6fde4420e2347`. All non-documentation mode/blob identities match that application baseline. No unmerged correction branch was integrated. Genuine disposable SQLite and local loopback HTTPS application on Linux, using existing installed Playwright 1.62.1 and Chromium 156.0.8078.79; no extra packages, browser, virtual display, cloud desktop or private deployment. No screenshot editing, cropping, masking, compositing or fabricated application UI.

The fixture reuses repository schema, account/MFA/role/Staff helpers and the existing Supplier, stock, Device and equipment browser-navigation patterns. Accounts, Sales and IT are fictional Departments. Sam Taylor has effective Devices, IT Assets, Suppliers, Staff Members, Departments and Service Desk Edit overrides on the protected baseline Staff Member role. training-admin is an active MFA-confirmed administrator; equipment.editor has only Devices/IT Assets Edit; equipment.reader has Devices/IT Assets Read; assets.reader has IT Assets Read alone; supplier.reader has Suppliers Read alone. Alex Morgan, Sarah Lewis and Priya Shah have only baseline Staff Member access and linked Active Staff records. All six optional features are enabled unless the per-image manifest records otherwise. Read/Edit grants apply only with the feature enabled; administrator access is independent of ordinary overrides. Baseline employees use /account, not the protected /inventory route.

All fixture credentials, enrolled-MFA material, session/cookie/CSRF values, SQLite files, TLS keys, capture drivers and disposable fixture snapshots remain untracked outside the repository. They are never included in guide images or manifests. Each image records its actor, actual account state, exact role memberships/overrides and feature snapshot, timestamp, browser, viewport, full-page raster dimensions and SHA-256. Most viewports are 1440 × 1050; the long Supplier company/contact draft uses 1440 × 1750. Full-page raster height is explicitly separate from viewport height. Images are retained at original resolution without page reduction.

Northlight has a Main Office, Leeds Branch, Jo Patel and Kim Cooper. Jo’s contact note and the company’s DEMO-104 note have distinct owners. Mouse delivery query moves to In Progress, its update is corrected with attribution, Kim replaces Jo, and Delivery Documentation is retired while its existing Issue remains. A concurrent separately saved Supplier note supplies the stale-revision rejection, where pictured.

The connected delivery is two Ready laptops and two quantity-based mice on 03/11/2026; a separately labelled one-unit individually tracked mouse demonstrates the other tracking mode. Fifty USB Keyboards (eight Ready, minimum ten) provide a separate arithmetic example. AST-LAP-014 is registered from one laptop without changing held total, issued to Alex on 05/11, explicitly associated with one mouse, then returned on 12/11 after the mouse’s separate return. Its working/data-preparation checks precede reissue to Sarah on 13/11. The same canonical identity, earlier holder, original movements and first-service date are retained. A direct-handover preview is cancelled and does not invent a second physical event. The independent AST-LAP-015 and shared Accounts printer AST-PRN-01 are separately identified fixtures.

Pre-handover employee views and support requests were captured before the return and retained with their original timestamps. They are not relabelled as later outcomes. Disposable fixture snapshots preserve those states for narrow later illustrations, not a product backup/restore or upgrade rehearsal. Later packs reuse genuinely matching original bytes.

The 51-original-supply illustration deliberately links the fifty-keyboard receipt, independent AST-LAP-015 and stock-derived AST-LAP-014 while the laptop/mouse receipt associations are temporarily removed. The stock-derived Device adds no receipt quantity. Both receipt links are then restored explicitly; original Supplier strings and receipt facts remain throughout. The quantity is not a current held-stock total.

## New Images

| Image | Caption |
| --- | --- |
| [supplier-locations.png](supplier-locations.png) | Northlight has a Main Office and Leeds Branch. Jo is a company-wide contact; the Main Office has protected deletion rules. |
| [supplier-contact.png](supplier-contact.png) | Kim is an unsaved location-specific contact for Leeds; company-wide and selected-location scopes are independent choices. |
| [contact-note.png](contact-note.png) | This unsaved note belongs to Jo, rather than the company. Keep factual work information in the appropriate note owner. |
| [supplier-notes.png](supplier-notes.png) | Saved company and contact notes retain their owners and authors. Supplier Note history protects the company from deletion; Archive retains it. |
| [supplier-issue-add.png](supplier-issue-add.png) | The Issue is still a draft; its inline Delivery Documentation category has already been saved separately. No stock or employee ticket changes result. |
| [supplier-issue-update.png](supplier-issue-update.png) | Saved In Progress Issue with a dated update. The status belongs to Supplier work; it is separate from employee tickets and stock. |
| [supplier-issue-handover.png](supplier-issue-handover.png) | Kim is now the linked contact. The corrected update retains its original author/date and a correction attribution; earlier contact notes are not transferred. |
| [issue-category-retired.png](issue-category-retired.png) | Retiring Delivery Documentation retains the existing Issue and offers Reactivate. It is not Supplier company-category archiving. |
| [purchasing-journey.png](purchasing-journey.png) | The connected journey has one active Supplier Issue. Purchasing totals concern Suppliers and their Issues, not an employee Service Desk queue. |
| [supplier-issues.png](supplier-issues.png) | The saved Issue remains linked to its retired category and Kim. Status and category filters narrow this Supplier list. |
| [supplier-archive-protection.png](supplier-archive-protection.png) | Archive is a proposed lifecycle action, retaining notes, Issues and equipment links. This confirmation is cancelled for the continuing journey. |
| [stock-empty.png](stock-empty.png) | Before the first receipt, the isolated journey has no stock. Empty totals do not authorise receiving a delivery twice. |
| [receive-laptops.png](receive-laptops.png) | The unsaved receipt records two checked, Ready laptops with an explicitly selected Northlight link. The summary is a proposal, not saved stock. |
| [receipt-history.png](receipt-history.png) | The original two-laptop receipt is saved with its checks, date, Sam and Supplier. Later associations and readiness history are separate records. |
| [receive-individual.png](receive-individual.png) | A separate individually tracked demonstration mouse is an unsaved one-unit receipt. It is additional to the journey’s two quantity-based mice. |
| [receive-existing.png](receive-existing.png) | Receive More retains the laptop’s matching identity and shared specifications. This extra delivery draft is cancelled; the saved journey remains two laptops. |
| [readiness-eight-of-fifty.png](readiness-eight-of-fifty.png) | Fifty keyboards are physically held; only eight are Ready against minimum ten. The minimum compares Ready units, rather than the full held quantity. |
| [stock-mixed-overview.png](stock-mixed-overview.png) | Mixed quantity and individually tracked stock use complete held totals. The 90-day reporting control affects movement reporting, not current stock arithmetic. |
| [low-stock-drill.png](low-stock-drill.png) | The Low Stock drill-down identifies the eight-Ready keyboard item below minimum ten. Clear Dashboard Filters returns to the full stock list. |
| [supplier-add.png](supplier-add.png) | A representative unsaved Northlight company/contact draft. The continuing journey already has its saved Northlight record; this demonstration draft is discarded, rather than creating a duplicate. |
| [supplier-disable-impact.png](supplier-disable-impact.png) | Only the administrator sees Disable. Review the actual affected sections and retained-history warning before confirming; this preview is cancelled. |
| [supplier-categories.png](supplier-categories.png) | Supplier company categories have their own Archive and Reactivate controls. This catalogue is independent of Issue Categories and company lifecycle actions. |
| [assets-only-protected.png](assets-only-protected.png) | IT Assets Read without Devices Read receives complete aggregate totals, while Device identities, classifications and Device drill-down stay protected. |
| [read-only-stock-details.png](read-only-stock-details.png) | IT Assets Read can inspect stock details and recorded checks, but cannot change readiness or receive or issue stock. |
| [register-ast-lap-014.png](register-ast-lap-014.png) | The Device draft selects one Ready laptop from the two-unit receipt. Registration will retain one permanent AST-LAP-014 identity and will not assign it. |
| [registered-stock-accounting.png](registered-stock-accounting.png) | The laptop item still represents two held units: one unregistered Ready unit plus AST-LAP-014 as a registered Ready Device. Never add the Device row to the item total again. |
| [reissue-to-alex.png](reissue-to-alex.png) | This is the unsaved first issue of the already registered Ready Device to Alex. The explicit issue will reduce held/Ready by one and preserve Device identity. |
| [alex-saved-custody.png](alex-saved-custody.png) | Saved current custody belongs to Alex. The original Device and assignment history remain the authoritative identity; registration was a different event. |
| [minimal-supplier-chooser.png](minimal-supplier-chooser.png) | This Devices/IT Assets editor has no Suppliers Read. It can choose the minimal company identity; typing alone is not an explicit canonical link. The Device draft is discarded. |
| [bulk-device-supplier.png](bulk-device-supplier.png) | The administrator is confirming links on two original Devices. This proposal does not change custody, stock or configuration. |
| [bulk-device-supplier-rejected.png](bulk-device-supplier-rejected.png) | A real edit reservation on one selected Device rejects the entire proposed Supplier assignment. Neither Device receives a partial link. |
| [receipt-supplier-removal.png](receipt-supplier-removal.png) | Removing this one current association retains the original Northlight receipt text and delivery facts. It is not deletion or a stock adjustment. |
| [receipt-supplier-unlinked.png](receipt-supplier-unlinked.png) | The current link is removed while Northlight remains the original receipt Supplier text. The receipt quantity, checks and date are unchanged. |
| [supplier-original-fifty-one.png](supplier-original-fifty-one.png) | For this association demonstration, Northlight is linked to the original fifty-keyboard receipt, independent AST-LAP-015 and stock-derived AST-LAP-014. The original-supply metric is 51: the stock-derived Device adds no extra receipt quantity. Laptop/mouse receipt links are restored next. |
| [receipt-multiple-assignment.png](receipt-multiple-assignment.png) | Two receipt associations are proposed together for restoration to Northlight. Each original Supplier string and physical delivery stays recorded. |
| [supplier-reader-protected-equipment.png](supplier-reader-protected-equipment.png) | Suppliers Read alone does not reveal Device or stock equipment rows. Their independent Read rights are required. |
| [alex-before-handover.png](alex-before-handover.png) | Alex sees the personally assigned AST-LAP-014 and outstanding mouse, plus the Accounts printer shared through current membership. This is the preserved pre-handover state. |
| [returned-device-readiness-protection.png](returned-device-readiness-protection.png) | The returned registered Device cannot be made Ready by increasing the stock item’s receipt-readiness total. Its own Prepare Returned Equipment checks are required; this out-of-range draft is discarded. |
| [awaiting-device-not-reissuable.png](awaiting-device-not-reissuable.png) | AST-LAP-014 is Awaiting Preparation, so it is absent from the Ready registered Device chooser. The returned identity and history remain saved. |
| [same-device-sarah-history.png](same-device-sarah-history.png) | Sarah now holds the same AST-LAP-014. Alex’s ended custody and actual return remain in its history; preparation and reissue did not create a replacement identity or restart first service. |
| [supplier-issue-stale-rejected.png](supplier-issue-stale-rejected.png) | A separately saved company note makes this Issue form stale. Its attempted update is rejected; refresh and review current information before trying again. |

## Original Reuse And Limits

RE07 and RE08 were opened and verified suitable only for their narrow original dashboard/directory subjects. The Suppliers interface, Supplier CSS, Supplier backend and Supplier schema are unchanged between source `dff3692046936cee21e949fdd3b0627ef58f1c45` and the approved baseline. Original image bytes and hashes remain unchanged. The old sidebar is not certified current. Per-file timestamp and complete actor/feature snapshots were not recorded originally; those gaps remain explicit, rather than invented. [Original provenance](../../../../../development-handovers/evidence/stage-6-6-batch-3/README.md).

- [RE07](../../../../../development-handovers/evidence/stage-6-6-batch-3/screenshots/purchasing-dashboard-light-1440.png): Original Northlight Purchasing Dashboard only: two Open Issues, one In Progress and one Resolved. It is a separate original fixture, not the later one-Issue journey outcome.
- [RE08](../../../../../development-handovers/evidence/stage-6-6-batch-3/screenshots/supplier-directory-light-1440.png): Original Supplier Directory only: active Northlight, two locations and two contacts. Retain the original fixture, category choices and provenance; this is not a later capture.

## Written Coverage And Delivery Boundary

Coverage retains every original group, owned state, original contract and shared reference. Routine validation, Cancel/Back, repetitive filters/status variants, no-match/empty alternatives and repeated stale-state remedies are written in the existing accepted guides. The precise map identifies every unpictured variant; images do not imply an unobserved saved outcome or exhaustive runtime acceptance. Important permission, retained-history, stock arithmetic, protected readiness and distinct transactional rejection illustrations are identified explicitly. Separate application functional/security acceptance remains intact.

Correction Batches 1–2 targeted refresh backlog, original correction evidence and accepted 7A/7B bytes/provenance remain preserved. No extra authentication, Staff, virtual-Device or sidebar refresh captures. Batches 7F–7H/8, cloud desktop, full regression, CI monitoring, private deployment, native acceptance, upgrade/recovery, private exports, security audit and website work remain excluded. PR #472 remains draft/open/unmerged; #366 open. No release or publication. Each pack requires its separate committed, pushed and remotely verified checkpoint before the next pack’s documentation delivery; final independent review and separate owner acceptance remain mandatory.
