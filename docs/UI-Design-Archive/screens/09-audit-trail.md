<!-- Snapshot of owner decisions in issue #227, archived 1 November 2026. Main issue remains the living decision register. -->

[Archive Index](../README.md) · [Current owner decisions](https://github.com/Caffoot/Caffoot-Lite/issues/227)

### 9. Change History → Meaningful Audit Trail — Agreed Design Direction ✅

**The product owner has discussed and preferred this direction repeatedly. DO NOT replace it with a cosmetic restyle of the weak v2.0.1 event list.** The compact card-based preview shown on 1 November 2026 was **not approved**: it wastes space and still tells the user too little.

**Previously captured in [#222, Concept 10](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553582075) and [revision 2](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553626968):**

- Use a **compact, full-width, readable event directory**, with columns helping users identify **when**, **who**, **what happened**, **which object** (device, IPAM record, rack, etc.) and the **result**. Do not use enormous separated cards for a handful of vague entries.
- Selecting an event opens a **detailed event inspection view**. For genuinely useful auditing, show changed fields with **before → after** where appropriate, while protecting/redacting secrets. Design must distinguish **what v2.0.1 actually recorded** from information a future audit system will start recording.
- Aim to cover meaningful device, IPAM and rack changes, plus relevant settings, user/permissions and authentication/security events **as agreed in the detailed functional scope**. These extra event classes and actor attribution are proposed audit capabilities, not current stored facts.
- Keep useful **search/filter** and clear **Export History** access; plan usable reporting/export without promising data or formats the old history never held.
- The existing **200-event retention cap is inadequate** and should **not carry over as an arbitrary fixed low limit** into the future Audit Trail. Select a practical durable SQLite history strategy, efficient pagination and sensible administrator/retention safeguards during detailed implementation planning. **Past entries already discarded cannot be reconstructed.**
- Respect existing application permissions, protect personal/sensitive information and avoid unnecessary complexity.

**What is settled:** the overall design and product need for a **proper Audit Trail**, including its space-efficient event list, selectable inspection, meaningful changes and removal of the arbitrary 200-event cap as the target direction.

**What is not yet claimed:** an approved technical schema, precise event catalogue, retention policy, implementation, backfill of old history, or finished visual design. Those are implementation details to agree with the product owner **without restarting the previously settled design conversation**. Only the owner authorises implementation.
