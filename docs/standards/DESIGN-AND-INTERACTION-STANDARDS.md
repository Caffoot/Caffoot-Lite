# Caffoot Lite Design and Interaction Standards

**Status:** Product owner agreed design direction, 24 October 2026. Proposed standard for review. This document does not claim that shared components have been implemented or tested.

## Purpose

Make Caffoot Lite predictable, accessible and easier to maintain by designing common interface patterns once and reusing them wherever their meaning and behaviour match. Visual consistency is a usability and safety requirement, not decoration.

## Design principles

1. **Understandable first:** Use plain British English, familiar names and clear explanations of what an action will do. Avoid unnecessary technical language.
2. **One pattern for one purpose:** Reuse common layouts, controls, warnings, confirmation flows and relationship diagrams. Do not independently recreate a component that already meets the same need.
3. **Shared behaviour, explicit differences:** Centralise shared behaviour and tests, but never combine operations with different safety rules merely because their buttons look alike.
4. **Protect user data:** Show the affected records and consequences before destructive or relationship changing actions. Never silently delete or reassign dependent records. Cancellation must leave state unchanged.
5. **Accessible by design:** All information shown visually must also be available as readable text. Support keyboard navigation, focus management, clear control labels and screen reader announcements. Never rely on colour alone.
6. **Responsive and lightweight:** Work in the standalone HTML application, including narrow screens and offline use, without requiring a server. Future Docker screens should retain familiar patterns.
7. **Compatibility:** Do not force new visual or data models to rewrite or invalidate older inventories. Keep historic and custom fields where appropriate.
8. **Test and document:** Record the component contract, its consumers, variations, failure handling and test coverage. A shared component change requires regression checks for every affected use.

## Initial shared pattern catalogue

| Pattern | Common responsibility | Important variation |
| --- | --- | --- |
| Form actions | Consistent Save, Cancel and Edit placement, labels, state and feedback | Each form retains its own validation and persistence requirements |
| Confirmation review | Explain consequences, identify affected records, provide explicit confirmation and cancellation | Destructive actions need stronger safeguards than ordinary edits |
| Relationship diagram | Show an object and its dependencies using labelled nodes and connectors | Different relationships have different validity and lifecycle rules |
| Dependency decision list | Show each dependent record and capture a deliberate outcome | Some actions permit reassignment, unassignment or retirement |
| Status and warning message | Consistent severity, language, iconography and accessible explanation | Warnings must not be mistaken for blocking errors |
| Empty and unknown states | Explain missing, unassigned, unsupported and archived values | Unknown does not mean invalid and unassigned does not mean deleted |
| Responsive information card | Consistent readable summary and accessible actions | Dense inventories may require a text list instead of a diagram |

## Hosted virtual device relationship example

A physical host is a labelled parent node connected to each dependent virtual device, regardless of its eventual virtual category. Show the same devices in a readable list, including their type and relationship status. During host deletion, offer each dependent device an explicit choice to reassign to a valid host, remain unassigned with previous host identity preserved, or be retained as retired. Do not implicitly delete virtual devices. If no alternative host exists, reassignment is not required. A host retirement is distinct from deletion.

The current v1.3.0 source only has explicit `virtualHostId` selection for virtual servers. Broader virtual categories and shared diagram components are proposed, not implemented. See [technical workflows](../workflows/TECHNICAL-WORKFLOWS.md), [compatibility matrix](../testing/LEGACY-BACKUP-IMPORT-COMPATIBILITY-MATRIX.md) and [findings programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md).

## Proposed development and review gate

Before building or changing an interface, identify the matching shared pattern and document any genuine exception. Review visual consistency, terminology, accessibility, mobile behaviour, validation, save and cancel behaviour, and dependencies. Test the shared component directly and its affected consumers. Record which tests actually ran. Reconcile workflow, test, findings and roadmap references before approval.

**Outstanding:** Inventory existing UI patterns, agree component boundaries and ownership, select an implementation architecture suitable for the single HTML application, define detailed accessibility and visual tokens, implement and test. None of these activities is recorded as complete here.
