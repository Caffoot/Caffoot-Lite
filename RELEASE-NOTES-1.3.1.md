# Caffoot Lite v1.3.1 release notes

**Status:** Stable maintenance release v1.3.1
**Previous stable release:** v1.3.0
**Release date:** 26 October 2026

## Overview

Caffoot Lite v1.3.1 builds on v1.3.0 with inventory safety, rack capacity, IP address management and physical hypervisor relationship improvements. The standalone HTML application remains the intended distribution format.

## Changes in this release

- **Inventory safety and recovery:** Protect inventory and in-memory state when relevant saves fail, including device deletion, rack creation, location and graphics updates, import rollback and startup recovery. See issue #94 and its merged pull requests.
- **Rack capacity:** Vertical PDU and Vertical Cable Manager accessories do not consume numbered rack U capacity. Ordinary horizontal accessories still count. Existing stored accessory identifiers are preserved. See issue #140 and PR #142.
- **IP address management:** Preserve address notes and historical reservations during individual and relevant bulk address release operations and legacy import. See issue #92 and PR #123. This does not claim all future IPAM roadmap items are complete.
- **Physical hypervisor and virtual machine relationships:** Improve physical host and guest handling, explicit guest resolution safeguards and the placement of Add and Edit host controls under General. Preserve historical and custom host values where covered by the documented migration and browser checks. See issues #91, #93 and #134.

## Compatibility and limitations

This release is designed to retain existing inventories and historical JSON backup compatibility. Existing user inventories must not be overwritten for testing. Unresolved wider workflow audit findings remain tracked in the central findings programme and are not implicitly certified by this maintenance release.

## Verification

The final application revision [`debb040`](https://github.com/Caffoot/Caffoot-Lite/commit/debb04075717a8985d19357ff6e9a5ab8f26e8a3) passed [standalone build and Chromium verification](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40290694847) and [release validation and package verification](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40291173317). Packaging verified the versioned ZIP, expected members, licences, embedded notices and extracted byte hashes, including legacy and schema-v1 backup fixture checks. The product owner also reported successful offline operation and JSON backup acceptance on an earlier correctly versioned candidate. These are distinct forms of evidence, and wider audit findings remain open.

The release includes the verified `Caffoot-Lite-1.3.1.zip`, standalone `Caffoot-Lite.html`, and `SHA256SUMS` for download verification.
