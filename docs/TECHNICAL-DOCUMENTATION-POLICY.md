# Caffoot Lite Technical Documentation Policy

**Status:** Agreed policy, introduced during the v1.3.0 technical baseline investigation on 22 October 2026.

## Mandatory rules

1. Every significant change to Caffoot Lite must review the affected technical workflow documentation.
2. Any new or changed functionality, processing, storage, validation, error handling, dependency or data relationship **must be added to or updated in** the technical workflow documentation as part of that change.
3. Documentation must describe actual implemented behaviour and must distinguish verified code inspection, verified tests, unresolved questions and proposals.
4. Documentation changes are part of the definition of done. Significant work is not ready for release until its relevant technical documentation has been updated and reviewed.
5. Record source file paths, function names, ordered processing steps, relevant dependencies, failure behaviour, validation and data protection safeguards, applicable version and verification evidence.
6. Preserve an accurate baseline for each published release. Never silently replace historical descriptions with later behaviour.
7. Keep the current published release documentation accessible from `main`. Develop and review updates on branches before merging them.
8. Use British English for public facing writing. Do not use dashes as punctuation. Preserve required technical identifiers exactly.
9. Explain work to the product owner in plain English first. Technical documentation may use precise developer terminology.
10. If a significant defect, unsafe behaviour or ambiguity is found, log its evidence and severity. Investigate and propose a remedy before declaring the relevant workflow verified. Any application code fix requires explicit approval and separate testing and release control.

## Baseline project sequence

- First, inspect the exact v1.3.0 release and document all existing workflows.
- Second, reconcile gaps against tests and runtime behaviour. Correct confirmed significant defects through separately approved maintenance work.
- Third, review and merge verified baseline documentation into `main`.
- Fourth, resume the v1.4.0 feasibility investigation using the verified baseline.

This policy does not itself authorise modifications to application code, a database, Docker deployment or a release.
