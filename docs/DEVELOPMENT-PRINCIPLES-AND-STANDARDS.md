# Caffoot Lite Development Principles and Standards

Status: Working baseline for technical documentation. These principles guide reviews and proposals; they do not themselves authorise application code changes or a release.

## Purpose
This document records the design and engineering principles agreed during the v1.3.0 technical workflow audit. Read it alongside TECHNICAL-DOCUMENTATION-POLICY.md, TECHNICAL-WORKFLOWS.md and FUNCTION-NAMING-AND-REFERENCE.md.

Each principle has a plain English meaning and an implementation expectation. Where an existing implementation differs, record the evidence and proposed improvement in the audit and maintenance roadmap. Do not silently change established behaviour.

## P01. Single source of truth
**Plain English:** Write an important rule once and use it wherever the same rule applies.

**Technical expectation:** Centralise genuinely shared calculations, validations and business rules behind well-defined interfaces. Avoid independent implementations that can drift apart. Do not combine functions whose responsibilities, inputs or safeguards materially differ.

**Current audit example:** Rack occupancy is calculated in several places. The published v1.3.0 source shows inconsistent treatment of vertically mounted accessories between individual rack summaries, printed capacity figures and other rack views. A shared occupancy rule is a candidate for investigation, not yet an approved implementation.

**Review question:** Do multiple features independently decide the same fact, and could they disagree?

## P02. Protect user data
**Plain English:** Never risk losing or silently changing someone's inventory for convenience.

**Technical expectation:** Preserve existing valid state when operations fail. Explicitly handle malformed data, persistence failures and recovery paths. Record any intentional normalisation.

**Review question:** What happens to the previous valid inventory if this operation fails at each stage?

## P03. Preserve supported compatibility
**Plain English:** Existing users should be able to keep using their legitimate saved inventories and backups.

**Technical expectation:** Keep stable persisted identifiers and documented legacy migrations unless a deliberate compatibility decision is reviewed and tested. User-facing label changes must not casually rename stored values.

**Current audit example:** Prefer the labels 'Vertically Mounted PDU' and 'Vertically Mounted Cable Manager' in the interface, while retaining stored type identifiers such as `pdu_vertical` and `cable_vertical`.

**Review question:** Will a valid older backup still load correctly?

## P04. Validate before committing changes
**Plain English:** Check changes before they become permanent, and do not claim success if saving fails.

**Technical expectation:** Validate candidate state, preserve rollback information, verify persistence where required and communicate failures accurately. Distinguish source-level guarantees from browser-tested behaviour.

**Review question:** Can the interface show success while the change was not saved?

## P05. Consistent behaviour and terminology
**Plain English:** Similar actions should work alike, and wording should be understandable.

**Technical expectation:** Apply consistent form, confirmation, error and navigation patterns. Use British English in public-facing documents and clear labels in the interface. Retain precise technical concepts in developer documentation when they explain safeguards.

**Review question:** Does this feature behave and read consistently with comparable features?

## P06. Keep the application understandable
**Plain English:** Choose solutions that a future developer can safely understand and maintain.

**Technical expectation:** Prefer clear boundaries, explicit data flows and small well-named functions over unnecessary abstraction. Explain technical decisions in plain English as well as developer-level detail.

**Review question:** Could a new contributor explain this rule and its dependencies without guessing?

## P07. Document significant behaviour changes
**Plain English:** If the way Caffoot Lite works changes, its technical explanation must change too.

**Technical expectation:** Review and update the affected technical workflows, naming references, tests and maintenance roadmap whenever relevant. Distinguish current behaviour, proposed behaviour and verified behaviour.

**Review question:** Which documents and tests become inaccurate if this change is made?

## P08. Test normal, failure and recovery paths
**Plain English:** A feature must work when everything goes right and protect users when things go wrong.

**Technical expectation:** Include positive, negative, compatibility, failure injection and regression scenarios as appropriate. Never report a proposed test as executed.

**Review question:** What important failure would our current tests miss?

## P09. Share rules, separate responsibilities
**Plain English:** Reuse genuinely identical logic without making unrelated features depend on each other.

**Technical expectation:** Keep calculations, mutation validation, persistence and presentation responsibilities distinguishable. A shared read-only occupancy calculation need not replace the full set of mutation safeguards.

**Review question:** Would this abstraction strengthen consistency without weakening an existing safeguard?

## P10. Evidence before release
**Plain English:** Release decisions must be based on what we have actually checked.

**Technical expectation:** Classify each finding as source-confirmed, automated-test-confirmed, browser-verified or proposed. Assess severity and regression risk before assigning work to v1.3.1 or a later version. No source code change, merge or release is authorised by this document alone.

**Review question:** What evidence supports the claim that this is fixed and safe?

## Review checklist
For each significant change, reviewers should record:
1. The existing behaviour and supporting source references.
2. The shared rule or responsibility involved and whether reuse is appropriate.
3. Data integrity and backward compatibility effects.
4. Failure, rollback and recovery behaviour.
5. User-facing terminology and interaction consistency.
6. Technical documentation and function-reference changes.
7. Automated and manual regression evidence.
8. Whether the change belongs in maintenance or a future feature release.

## Audit status and maintenance relationship
This document records agreed engineering direction. The v1.3.0 audit remains ongoing. The rack occupancy findings and vertically mounted accessory terminology proposal require assessment against the existing maintenance roadmap to avoid duplicate entries. The suggested shared occupancy implementation has not been approved, coded or browser-tested.

## Document maintenance
Review this file when architectural decisions introduce a new principle, refine an existing one or establish a justified exception. Keep the rationale and affected workflows traceable.
