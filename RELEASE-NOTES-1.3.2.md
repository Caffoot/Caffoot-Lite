# Caffoot Lite v1.3.2 release notes

**Status:** Release candidate under review. Not yet published.
**Previous published stable release:** v1.3.1 (26 October 2026).

## Changes prepared for v1.3.2

- Device catalogue editing and preservation of historical assignments, including archived software and server services.
- Physical server and virtual machine naming, fixed device identity, virtual-device purposes and host-aware virtual hardware presentation.
- Hypervisor hosting selection and effective operating system display in device details and charts, preserving the original host OS when hosting is disabled.
- Refined application colours and dark-mode Settings readability.
- Inventory safety, recovery and relevant rack and IPAM usability improvements recorded in the merged release work.

## Compatibility and verification

Caffoot Lite remains a standalone offline HTML application. Preserve existing inventories and export JSON backups before upgrading. The product owner reported successful import of a v1.2.0 schema-v1 backup into the v1.3.2 candidate, with devices, racks and updated device names visible. This is a reported manual check, not exhaustive field-by-field verification. Existing CI checks and detailed evidence are tracked in issue #107. Remaining release documentation, packaging, compatibility and approval gates are open.

**Publication:** Do not describe this candidate as published, or list release assets or checksums, until the final release is approved and verified.
