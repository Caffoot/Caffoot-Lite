# Caffoot Lite — Development & Communication Principles

**Status:** Agreed working practice — 22 October 2026  
**Applies to:** All future Caffoot Lite planning, architecture reviews, development, testing, release discussions and chat handovers.

## Core principle

**Explain Caffoot development in plain English first.** The product owner understands infrastructure workflows and can follow some VBA/PHP concepts, but should never need to understand programming languages, source code or technical jargon to participate in decisions.

This reflects the product philosophy: **“Lite in effort. Not in features.”** Simplicity should apply to collaboration and maintenance as well as the end-user experience.

## How to explain work

For every substantial investigation, proposed change or result, explain:

1. **What we are looking at:** describe the feature or behaviour in everyday language.
2. **Why it matters:** explain the effect on Caffoot and its users.
3. **What we found or changed:** separate verified findings from assumptions and proposals.
4. **What happens next:** recommend a clear next step, including relevant risks or trade-offs.

Prefer short, accessible explanations and relatable analogies (for example, a filing cabinet for saving and loading inventory). Define technical terms when they are genuinely needed. Do not lead with code, acronyms, architecture diagrams or implementation details unless requested. Provide deeper technical detail on request without withholding information needed for an informed decision.

## Decision-making and honesty

- The product owner remains involved in and approves product and architectural decisions; familiarity with a programming language is **not** a reason to choose it.
- Evaluate technical options against Caffoot's goals: lightweight to use and deploy, secure, dependable and maintainable.
- Clearly distinguish **possible**, **proposed**, **agreed**, **implemented**, **tested**, **merged** and **published**.
- Do not claim tests passed, code was changed, or a release was published without evidence.
- Explain disadvantages, ongoing maintenance costs and uncertainties in understandable terms.
- Preserve the standalone, fully offline, single-HTML experience unless a separately approved decision changes that commitment.
- Use friendly, collaborative language; avoid condescension and unnecessary jargon.

## Mandatory handover section

Every future Caffoot Lite chat handover must include a section equivalent to:

> **Communication preference — agreed project principle:** Explain all development work in plain English first, as to a non-programmer. For each topic, cover what it is, why it matters, what was found or changed, and the recommended next step. Use everyday examples, define unavoidable technical terms, avoid code-heavy explanations unless requested, and keep product decisions accessible. Reference `docs/DEVELOPMENT-COMMUNICATION-PRINCIPLES.md`.

## Scope

This document establishes a communication and collaboration practice only. It does not approve any programming language, database, deployment architecture, application code change, merge or release.
