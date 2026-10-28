# Caffoot Lite v1.3.2 release notes

**Version:** v1.3.2.
**Status:** Published stable release (27 October 2026).
**Previous stable release:** v1.3.1 (26 October 2026).

## Changes in v1.3.2

- Device catalogue editing and preservation of historical assignments, including archived software and server services.
- Physical server and virtual machine naming, fixed device identity, virtual-device purposes and host-aware virtual hardware presentation.
- Hypervisor hosting selection and effective operating system display in device details and charts, preserving the original host OS when hosting is disabled.
- Refined application colours and dark-mode Settings readability.
- Inventory safety, recovery and relevant rack and IPAM usability improvements recorded in the merged release work.

## Compatibility and verification

Caffoot Lite remains a standalone offline HTML application. Preserve existing inventories and export JSON backups before upgrading. The product owner reported successful import of a v1.2.0 schema-v1 backup into the v1.3.2 build, with devices, racks and updated device names visible. This is a reported manual check, not exhaustive field-by-field verification. The integrated v1.3.2 build passed release validation, consolidated Chromium regression, documentation consistency and history secret scanning. The release package passed version, ZIP content and extracted-file integrity checks. Detailed evidence and remaining wider audit findings are tracked in issue #107.

