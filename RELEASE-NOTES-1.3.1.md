# Caffoot Lite v1.3.1 release notes

**Status:** Release candidate, not published.  
**Published stable release:** v1.3.0.  
**Release date:** Not assigned.  

## Overview

This maintenance candidate builds on v1.3.0 with inventory safety, rack capacity, IP address management and physical hypervisor relationship improvements. The standalone HTML application remains the intended distribution format. The exact release candidate and its evidence must pass issue #95 and the release approval gate in issue #106 before publication.

## Changes prepared for this candidate

- **Inventory safety and recovery:** Protect inventory and in-memory state when relevant saves fail, including device deletion, rack creation, location and graphics updates, import rollback and startup recovery. See issue #94 and its merged pull requests.
- **Rack capacity:** Vertical PDU and Vertical Cable Manager accessories do not consume numbered rack U capacity. Ordinary horizontal accessories still count. Existing stored accessory identifiers are preserved. See issue #140 and PR #142.
- **IP address management:** Preserve address notes and historical reservations during individual and relevant bulk address release operations and legacy import. See issue #92 and PR #123. This does not claim all future IPAM roadmap items are complete.
- **Physical hypervisor and virtual machine relationships:** Improve physical host and guest handling, explicit guest resolution safeguards and the placement of Add and Edit host controls under General. Preserve historical and custom host values where covered by the documented migration and browser checks. See issues #91, #93 and #134.

## Compatibility and limitations

The candidate is designed to retain existing inventories and historical JSON backup compatibility. Automated tests and release packaging must be verified on the correctly versioned candidate; automated Chromium evidence does not replace a direct offline browser and backup acceptance check where required. Existing user inventories must not be overwritten for testing. Unresolved wider workflow audit findings remain tracked in the central findings programme and are not implicitly certified by this maintenance release.

## Final verified release candidate, 26 October 2026

The final `main` revision [`debb040`](https://github.com/Caffoot/Caffoot-Lite/commit/debb04075717a8985d19357ff6e9a5ab8f26e8a3) includes the approved test-only PR #152 correction to offline Chromium regression expectations. [Standalone build and Chromium verification 40290694847](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40290694847) and [release validation and package verification 40291173317](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40291173317) passed on this exact SHA. Package verification confirmed `Caffoot-Lite-1.3.1.zip`, expected ZIP members, licences, embedded notices and extracted byte hashes, together with legacy/schema-v1 backup fixture checks. Candidate Actions artifact ID `12635737479` remains unpublished. Previous owner-reported offline and JSON backup acceptance was on the earlier correctly versioned candidate, not a new manual run on final `main`. Wider audit findings remain open. **Publication still requires explicit separate owner approval** and public asset/download checksum verification after release.

## Publication gate

Do not treat this file as publication approval. Before a public release, reconcile issues #95 and #106, confirm the exact tested candidate SHA, ZIP members and version, record actual tests and remaining findings, obtain separate product owner approval for merging into `main` and publishing, then update the stable release documentation. Preserve the existing published v1.3.0 assets and notes.
