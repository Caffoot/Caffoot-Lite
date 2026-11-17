# IT Assets Dashboard And Stock Reporting

Draft v2.2 implementation for [issue #396](https://github.com/Caffoot/Caffoot-Lite/issues/396). This extends IT Assets with an Overview tab using the existing application shell, stock cards, controls, tables and light/dark conventions. The separate application-wide Dashboard and stock writers are retained.

`GET /api/it-assets/report?days=30` (or `90`, with an optional recorded `category`) uses the existing authenticated stock request boundary. Reads run within its consistent database transaction. Unknown, repeated or invalid filters are rejected. IT Assets Read and its enabled feature are required, including for administrators. Existing session, MFA and account checks apply.

`backend/stock_reporting.py:read_stock_report` reuses journal-derived item balances and canonical stock projections. It counts registered units once, includes standalone returned Devices and older outstanding assignments, and preserves the difference between current possession and historical movements. Written Off and movement buckets use persisted business dates, inclusive of today and the preceding 29/89 days. Effective corrected quantities replace original quantities in these reports; compensation records are not counted again. Direct handovers change custody without adding physical issues to the movement chart. Counts are returned as decimal text to preserve large totals in JavaScript.

Low Stock applies only to quantity-based items with an explicitly configured minimum, and only when their complete Ready To Issue total is strictly below that minimum. Equality, absent minimums and individual tracking do not warn. Existing View / Update remains the minimum/readiness editor.

## Aggregate And Detail Permissions

The latest owner decision in #396 permits complete organisation-wide stock aggregates and per-item Low Stock warnings for IT Assets viewers without Devices Read. It does not permit individual Device records, registered-unit identifiers or a separate Device-only stock breakdown. The reporting response omits classification for those viewers and keeps aggregate cards informational; stock warnings can open authorised catalogue details. Recent Activity uses the permission-filtered movement projection. The existing stock detail projection now omits hidden registered units and their individual readiness history; complete item totals remain accurate.

With Devices Read and its enabled feature, the dashboard provides the three-way classification and navigation to authorised stock, assignment and movement views. Read-only viewers receive no mutation controls. Existing stock forms and write permissions remain authoritative.

## IT Staff Default Compatibility

Schema 20 adds IT Assets Edit to the built-in IT Staff role. Before changing the grant, it captures existing configured policies, including inactive accounts and those awaiting MFA. Where the new inherited grant would change a non-administrator's level, an individual No Access/Read override preserves the prior level; existing overrides are retained. It verifies section access and configured non-administrator permissions before committing. Administrator safeguards remain unchanged. The numbered migration and persisted overrides provide the upgrade record; reinitialisation does not repeat it. No ordinary new account is automatically assigned IT Staff. Fresh databases receive the new built-in default with IT Assets still independently disabled until configured.

See the [review evidence and verification limits](../development-handovers/evidence/stock-dashboard/Report.md). The last combined reporting/role test result was not retained across the usage-limit interruption; final focused review and owner visual approval remain outstanding. No full local regression, CI monitoring, merge or deployment is claimed.
