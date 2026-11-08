# Issue #331 — Catalogue Source Record

The [approved catalogue](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698683599) and [execution specification](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698734229) define the scope. The static arrays are offline historical suggestions, not support or hardware-compatibility claims. No runtime web lookup or backend whitelist has been added. Saved/custom values remain available even when absent from suggestions.

## Primary Release Checks

The implementation uses the approved literal families, with the following primary-vendor checks for disputed/new entries:

| Families | Primary source and result |
| --- | --- |
| macOS | [Apple version guide](https://support.apple.com/en-gb/109033), [security releases](https://support.apple.com/en-gb/100100): Tahoe 26 confirmed; 27 Golden Gate unverified and omitted. Direct version-guide requests were rate-limited; indexed official Apple results/security records supplied the confirmed subset. |
| Ubuntu | [Release cycle](https://ubuntu.com/about/release-cycle), [published releases](https://releases.ubuntu.com/): 26.10 and 26.04 confirmed. Server suggestions remain LTS only, desktop includes the approved interim releases. |
| Debian/Fedora/Mint | [Debian releases](https://www.debian.org/releases/), [Fedora 45 announcement](https://fedoramagazine.org/announcing-fedora-linux-45/), [Mint releases](https://linuxmint.com/download_all.php): Debian 13 stable (14 testing excluded), Fedora 45 published, main Mint line through 22.3; no LMDE substitution. |
| CentOS/RHEL/Rocky/Alma | [CentOS Linux](https://www.centos.org/centos-linux/), [Stream](https://www.centos.org/centos-stream/), [RHEL lifecycle](https://access.redhat.com/support/policy/updates/errata), [Rocky release notes](https://docs.rockylinux.org/latest/releases/), [Alma notes](https://wiki.almalinux.org/release-notes/): separate Linux/Stream families; Rocky/Alma 10/9/8, no invented 7; Alma 10.3 beta excluded. |
| SUSE/openSUSE | [SLES 16 announcement](https://www.suse.com/news/suse-linux-enterprise-server-16-ai-ready-long-term-support/), [Leap 16 release](https://news.opensuse.org/2025/10/01/next-chapter-opens-with-leap-release/): GA confirmed, so 16 and 16.0 included. Tumbleweed remains Custom snapshots. |
| Proxmox/XCP-ng/Hyper-V | [Proxmox releases](https://www.proxmox.com/en/about/company-details/press-releases), [XCP-ng releases](https://docs.xcp-ng.org/releases/), [Microsoft Hyper-V](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/overview): Proxmox 9.2/9.1/9.0 and approved 8.x labels confirmed; XCP-ng 8.3/8.2/8.1; Hyper-V uses Windows host release families. KVM remains Custom. Separate #327 selector acceptance is not declared resolved by adding data. |
| pfSense | [Official version table](https://docs.netgate.com/pfsense/en/latest/releases/versions.html): CE 2.9.0 and Plus 26.07 confirmed; independent CE/Plus arrays. Plus 26.10 TBD excluded. Only approved older labels included. |
| OPNsense | [Community](https://docs.opnsense.org/releases.html), [Business](https://docs.opnsense.org/BE_releases.html): independent trains through 26.7 and 26.10 respectively. |
| Sophos/PAN-OS | [Sophos 21.5 notes](https://docs.sophos.com/releasenotes/index.html?productGroupID=nsg&productID=xg&versionID=21.5): conservative approved subset through 21.5. Unverified Sophos 22 and PAN-OS 12 excluded. Existing FortiOS/Synology historical lists retained. |
| QNAP | [Release notes](https://www.qnap.com/en-uk/release-notes/overview), [h6.0 GA announcement](https://www.qnap.com/th-th/news/2026/qnap-officially-releases-quts-hero-h6-0-official-featuring-dual-nas-high-availability-immutable-snapshots-and-more): h6.0 confirmed; QTS 6.1/hero h6.1 beta excluded. Keep h-prefix distinct. |
| TrueNAS | [Software status](https://www.truenas.com/docs/softwarestatus/), [CORE 13.3 notes](https://www.truenas.com/docs/core/13.3/gettingstarted/corereleasenotes/): SCALE 25.10 and CORE 13.3 confirmed. SCALE 27 RC excluded. |
| Unraid | [7.2 stable release notes](https://docs.unraid.net/unraid-os/release-notes/7.2.0/): 7.2 confirmed, included ahead of approved historic families. |
| OpenWrt/VyOS | [OpenWrt published downloads](https://downloads.openwrt.org/releases/), [VyOS 1.4 documentation](https://docs.vyos.io/en/1.4/): approved stable families retained; no rolling/beta guesses. |

Windows/Windows Server/ESXi/FortiOS/Synology retain the approved historical arrays. Hardware-dependent Cisco, Junos, Aruba, UniFi, Omada and embedded firmware use Custom rather than invented universal versions. Generic historical `pfSense`, `OPNsense` and `CentOS` strings are preserved without guessing editions. Other unverified future versions stay Custom only.

## Local Software And Preservation

The approved matrix is encoded as static `platformContexts` on existing/new built-ins, retaining all original keys. Context intersects declared device types, the actual guest/device platform and existing hide preferences; it does not certify package availability for every recorded release/model. The editor explicitly asks the user to check edition/release/model availability. Custom entries retain their existing type scope. Nothing is automatically installed or selected.

Vendor locality references include the [Netgate package list](https://docs.netgate.com/pfsense/en/latest/packages/list.html), [OPNsense plugins](https://docs.opnsense.org/plugins.html), [Synology Package Center](https://www.synology.com/en-sg/dsm/packages), QNAP's published application/release catalogue and [PaperCut embedded software](https://www.papercut.com/discover/products-at-a-glance/mfd-copier-embedded-software/). UniFi console application names, including the owner's InnerSpace case, follow the explicitly approved catalogue. No AP receives a remotely hosted controller recommendation; printer drivers and OS/firmware records remain historical catalogue records, not new local-app suggestions.

Archived, hidden, custom, missing-catalogue and out-of-context selections render as checked **Previously recorded — review** controls. Only explicit unticking removes them. Legacy top-level software flags retain their storage location rather than being silently migrated. Unknown hardware/other metadata is not guessed to be software. Details shows all assigned recognised software, including exceptions. Backup format and catalogue settings remain unchanged.
