# Documentation relocation verification plan

**Status:** Proposed procedure. Comprehensive validation has not yet run.

## Required checks

1. Record the branch revision and complete tracked file tree.
2. Inspect every Markdown file, resolving relative links and image paths against the directory containing each source document.
3. Verify local heading anchors and reference-style links. Record uncertain cases for manual review.
4. Check code-formatted paths and plain-text references to relocated documents, distinguishing historical mentions from active navigation.
5. Inspect release packaging scripts, GitHub workflows and other hard-coded file consumers.
6. Check all 27 compatibility stubs against canonical destinations and review inbound references.
7. Record broken references with source path, line, destination, correction and recheck result.
8. Document the revision, scope, unresolved exceptions and reviewer decision before sign-off.

## Future automation

A separately approved, read-only link checker could report missing Markdown targets, images and anchors with file and line numbers. It must be tested against reference links, fenced code blocks and heading rules before being treated as authoritative. No checker is implemented or executed by this plan.

## Compatibility policy

Retain the 27 temporary links by default to preserve older bookmarks. Removal needs a documented compatibility assessment and product owner approval. Retaining the links does not prove the canonical documentation is fully validated.

## Completion condition

Only declare relocation verification complete when all tracked Markdown links and relevant consumers have been checked at a recorded revision and all failures are resolved or explicitly accepted. This is a documentation gate, not evidence of application runtime tests.
