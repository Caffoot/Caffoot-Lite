#!/usr/bin/env python3
"""Check release filenames and version details without publishing anything."""

import argparse
import html
import re
from pathlib import Path
from urllib.parse import unquote


GUIDE_NAMES = {
    "README.md", "Devices.md", "Getting-Started.md", "IPAM.md",
    "Migration-Backup-and-Restore.md", "Racks.md",
    "Settings-and-Change-History.md", "Users-Permissions-and-MFA.md",
}
LEGACY_GUIDE_ANCHORS = {'Devices.md': ['devices--creating-editing-and-managing-equipment',
                'what-a-device-record-represents',
                'prepare-before-you-add-a-device',
                'worked-example--add-a-switch',
                'view-an-existing-device',
                'edit-save-and-cancel',
                'duplicate-a-device',
                'remove-or-retire-a-device',
                'virtual-machines',
                'v21-device-forms',
                'v21-shelves-and-software',
                'v21-device-choice-and-location-corrections',
                'troubleshooting'],
 'Getting-Started.md': ['getting-started-with-caffoot-lite',
                        'your-first-visit',
                        'where-to-find-things',
                        'worked-example--build-a-small-lab-inventory',
                        'using-caffoot-with-colleagues',
                        'common-first-questions'],
 'IPAM.md': ['ipam--subnets-vlans-and-individual-addresses',
             'understand-the-records',
             'worked-example--add-one-subnet',
             'add-multiple-subnets',
             'edit-an-individual-ip',
             'reserve-and-release-a-spare-address',
             'give-an-address-to-a-device',
             'edit-delete-or-bulk-manage-networks',
             'common-questions'],
 'Migration-Backup-and-Restore.md': ['migration-backup-and-restore',
                                     'two-different-jobs',
                                     'before-you-migrate',
                                     'import-into-dockersqlite--step-by-step',
                                     'where-docker-data-lives',
                                     'make-a-manual-consistent-backup',
                                     'restore-safely',
                                     'distinguish-maintenance-from-recovery',
                                     'v21-upgrade-and-subnet-first-compatibility'],
 'README.md': ['caffoot-lite--features-and-instructions',
               'find-your-guide',
               'a-sensible-order-for-building-your-inventory',
               'how-the-shared-application-behaves',
               'help-inside-caffoot-lite',
               'draft-v22--not-published--not-production-guidance'],
 'Racks.md': ['racks--enclosures-and-equipment-placement',
              'what-is-recorded',
              'worked-example--create-a-rack',
              'mount-a-device-in-a-rack',
              'move-or-unmount-equipment',
              'add-an-accessory',
              'edit-the-rack-versus-correcting-dimensions',
              'delete-safely',
              'troubleshooting',
              'shelves-and-existing-placement'],
 'Settings-and-Change-History.md': ['settings-audit-trail-and-personal-preferences',
                                    'two-different-settings-areas',
                                    'my-account--step-by-step',
                                    'settings--data-administrator',
                                    'review-audit-trail',
                                    'example--a-change-made-by-a-colleague',
                                    'important-cautions',
                                    'email-and-the-audit-trail'],
 'Users-Permissions-and-MFA.md': ['users-permissions-and-multi-factor-authentication',
                                  'account-basics',
                                  'create-a-user--worked-example',
                                  'understand-the-permission-levels',
                                  'permissions-apply-to-changed-fields',
                                  'set-up-or-change-mfa',
                                  'change-an-accounts-status-or-permissions',
                                  'two-people-editing-at-once',
                                  'troubleshooting',
                                  'verified-email-and-password-recovery']}

UNRELEASED_PATTERN = re.compile(r"\b(?:unreleased|draft\s+v[0-9]|review candidate|private review only)\b", re.I)
VERSION_PATTERN = re.compile(r"v[0-9]+\.[0-9]+(?:\.[0-9]+)?\Z")


class ReleasePreflightError(ValueError):
    """A release file is missing or disagrees with the requested version."""


def normalise_version(value):
    """Accept versions such as 2.0.3, v2.0.3, 2.1 or v2.1."""
    candidate = value.strip()
    if not candidate.startswith("v"):
        candidate = "v" + candidate
    if not VERSION_PATTERN.fullmatch(candidate):
        raise ReleasePreflightError(
            "Enter a stable version such as 2.0.3 or 2.1 "
            "(the leading v is optional; pre-releases are not supported)."
        )
    return candidate


def _read_required(root, name):
    """Read an expected file, giving a clear reason when it is missing."""
    path = root / name
    if not path.is_file():
        raise ReleasePreflightError(f"Missing release file: {name}")
    return path.read_text(encoding="utf-8")


def _heading_version(text, name):
    """Read the product version from a release document's first heading."""
    match = re.match(r"# Caffoot Lite (v[0-9]+\.[0-9]+(?:\.[0-9]+)?)(?: — [^\n]+)?\s*\n", text)
    if not match:
        raise ReleasePreflightError(f"{name} title must identify its product version")
    return match.group(1)


def _check_root_stack(root, version):
    """Keep superseded stack examples in history rather than the root."""
    matching = sorted(path.name for path in root.glob("portainer-v*.yaml"))
    if matching != [f"portainer-{version}.yaml"]:
        raise ReleasePreflightError(
            "Keep only the current version's Portainer stack in the repository root. "
            f"Found: {matching}"
        )


def check_compatibility_files(root, version):
    """Protect published guide URLs and matching historical release records."""
    root = Path(root)
    official = root / "docs/how-tos/features-and-instructions"
    original = root / "docs/How To's/Features and Instructions"
    for directory in (official, original):
        found = {file.name for file in directory.glob("*.md")}
        if found != GUIDE_NAMES:
            raise ReleasePreflightError(f"Guide files missing or unexpected in {directory}")
    for name in sorted(GUIDE_NAMES):
        if (official / name).read_bytes() != (original / name).read_bytes():
            raise ReleasePreflightError(f"Published guide compatibility copy differs: {name}")
    if tuple(map(int, version[1:].split("."))) >= (2, 2):
        archive = root / "docs/historical/features-and-instructions/v2.1"
        if any(directory.is_symlink() for directory in (official, original, archive)):
            raise ReleasePreflightError("Compatibility directories must be real directories")
        if {p.name for p in archive.glob("*.md")} != GUIDE_NAMES:
            raise ReleasePreflightError("The complete archived v2.1 guide set is required")
        for name, anchors in LEGACY_GUIDE_ANCHORS.items():
            archived = _read_required(root, str(archive.relative_to(root) / name))
            if _heading_anchors(archived) != anchors:
                raise ReleasePreflightError(f"Archived v2.1 heading anchors changed: {name}")
            destination = f"../../historical/features-and-instructions/v2.1/{name}"
            for directory in (official, original):
                path = directory / name
                if path.is_symlink() or (archive / name).is_symlink():
                    raise ReleasePreflightError("Compatibility guides must be real files")
                notice = path.read_text(encoding="utf-8")
                if f"]({destination})" not in notice or "v2.1" not in notice:
                    raise ReleasePreflightError(f"Missing archived v2.1 destination: {path}")
                for anchor in anchors:
                    if (f'<a id="{anchor}"></a>' not in notice
                            or f"]({destination}#{anchor})" not in notice):
                        raise ReleasePreflightError(f"Missing legacy anchor or archived section: {path}#{anchor}")
                if name == "README.md":
                    target = f"../../how-tos/features-and-instructions/{version}/README.md"
                    if f"]({target})" not in notice or notice.find(target) > notice.find(destination):
                        raise ReleasePreflightError("Version index must prioritise the target guides")
                for target in re.findall(r"\]\(([^)]+)\)", notice):
                    local = (directory / target.split("#", 1)[0]).resolve()
                    if not local.is_file():
                        raise ReleasePreflightError(f"Broken compatibility destination: {path}: {target}")
        installation = _read_required(root, "INSTALLATION.md")
        for target in ("docs/historical/features-and-instructions/v2.1/README.md",
                       "docs/historical/installation/INSTALLATION-v2.1.md"):
            if f"]({target})" not in installation:
                raise ReleasePreflightError("Root installation must retain explicit v2.1 archive links")
    _read_required(root, "docs/development-guide/README.md")
    stacks = {p.stem.removeprefix("portainer-")
              for p in (root / "docs/historical/portainer").glob("portainer-v*.yaml")}
    notes = {p.stem.removeprefix("Release-Notes-")
             for p in (root / "docs/historical/release-notes").glob("Release-Notes-v*.md")} - {version}
    if stacks != notes:
        raise ReleasePreflightError("Historical release notes and Portainer examples disagree")


def _heading_anchors(text):
    """List original guide section addresses, including repeated headings."""
    anchors = []
    seen = {}
    for heading in re.findall(r"^#{1,6} (.+)$", text, re.M):
        slug = re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")
        count = seen.get(slug, 0)
        seen[slug] = count + 1
        anchors.append(slug + (f"-{count}" if count else ""))
    return anchors


def _check_required_time_zone(stack):
    """Require the operator to supply their organisation's IANA time zone."""
    if not re.search(r'^\s*TZ:\s*"\$\{TZ:\?[^}]*IANA[^}]+\}"\s*$', stack, re.M):
        raise ReleasePreflightError("Portainer stack must require a configurable IANA TZ")


def _current_section(text, heading, name):
    """Read a required current section without scanning dated records below it."""
    match = re.search(r"(?ms)^## " + re.escape(heading) + r"[^\n]*\n(.*?)(?=^## |\Z)", text)
    if not match:
        raise ReleasePreflightError(f"Missing current release section in {name}: {heading}")
    return match[1]


def _current_paragraph(text, prefix, name):
    """Require a named current paragraph while preserving adjacent historical text."""
    matches = [line for line in text.splitlines() if line.startswith(prefix)]
    if len(matches) != 1:
        raise ReleasePreflightError(f"Missing or ambiguous current paragraph in {name}: {prefix}")
    return matches[0]


def publication_notice_scope(root, version):
    """Collect current public text; keep dated evidence and compatibility sections."""
    root = Path(root)
    names = ["README.md", "INSTALLATION.md", "compose.yaml", f"portainer-{version}.yaml",
             f"docs/historical/release-notes/Release-Notes-{version}.md", "inventory.html",
             "interface/screens/my-account.html", "interface/screens/settings.html",
             "interface/application.js", "ROADMAP.md", "SECURITY.md",
             "docs/Community-Participation.md", "docs/development-guide/README.md",
             "docs/historical/README.md", "docs/development-handovers/README.md",
             "docs/product-direction/VISION.md"]
    guides = root / f"docs/how-tos/features-and-instructions/{version}"
    names += [str(path.relative_to(root)) for path in sorted(guides.rglob("*"))
              if path.suffix in {".md", ".yaml", ".yml"}
              and "screenshots" not in path.relative_to(guides).parts]
    scope = {name: _read_required(root, name) for name in names}
    for name, heading in (("AGENTS.md", "Current release and next work"),
                          ("CONTRIBUTING.md", "Start With An Agreed Scope"),
                          ("docs/development-guide/Development-Status.md", "Current Boundary")):
        scope[f"{name} [{heading}]"] = _current_section(_read_required(root, name), heading, name)
    for name, prefix in (
        ("docs/product-direction/PROPOSED-MILESTONES.md", "> **Current direction:**"),
        ("docs/product-direction/FEATURE-BRAINSTORM.md", "> **Current direction:**"),
        ("AGENTS.md", "- Write approachable, thorough"),
        ("AGENTS.md", "- Maintain **version-specific truth**:"),
        ("CONTRIBUTING.md", "**Our standard for all current and future feature instructions"),
        ("CONTRIBUTING.md", "7. **Version and release accuracy:**"),
    ):
        scope[f"{name} [paragraph: {prefix}]"] = _current_paragraph(_read_required(root, name), prefix, name)
    for directory in ("docs/how-tos/features-and-instructions", "docs/How To's/Features and Instructions"):
        for guide in sorted(GUIDE_NAMES):
            name = f"{directory}/{guide}"
            text = _read_required(root, name)
            # Original section labels retain old addresses and historical wording.
            scope[f"{name} [compatibility introduction]"] = text.split("## Original v2.1 Sections", 1)[0]
    return scope


def check_publication_notices(root, version):
    """Reject leftover candidate notices and incorrect current-version claims."""
    scope = publication_notice_scope(root, version)
    number = r"v[0-9]+\.[0-9]+(?:\.[0-9]+)?"
    candidate = re.compile(
        r"\bunreleased\b|\b(?:release|review)[ -]candidate\b|"
        r"\b(?:private|isolated)[ -]review\b|CAFFOOT_V22_PREVIEW_IMAGE|"
        r"\bnot (?:yet )?(?:published|production guidance)\b|"
        r"\bfuture publication target\b|"
        r"\bdraft\s+(?:" + number + r"|guides?|instructions?|release notes?|"
        r"Portainer|Compose|examples?|configuration|installation)\b|"
        + number + r"\s+draft\b|"
        r"\bno public\s+(?:multi-architecture\s+)?" + number + r"\s+(?:image|release)|"
        r"\bno supported production (?:upgrade|recovery)\b|"
        r"\b(?:production upgrade(?: and recovery)?|recovery|release|native/manual) "
        r"acceptance (?:remain[s]?|is) outstanding\b", re.I)
    claims = re.compile(
        r"(" + number + r")\s+(?:is|remains)\s+(?:the\s+)?"
        r"(?:(?:only|current|currently)\s+)*(?:published|released|latest|current)"
        r"(?:\s+(?:Docker/SQLite|production))?\s*(?:release|download|baseline)?|"
        r"(?:current|latest|published)\s+(?:release|download|baseline)\s*(?:is|[—:=-])?\s*(?:Caffoot Lite\s+)?(" + number + r")|"
        r"(?:available now|install the published release)\s*[—:=-]\s*(" + number + r")", re.I)
    descriptions = re.compile(
        r"(?:(?:these\s+)?(?:instructions|guides)\s+(?:describe|cover)\s+(?:Caffoot Lite\s+)?|"
        r"(?:target(?: version)?|current version)\s*[:—=-]?\s*)(" + number + r")", re.I)
    for name, text in scope.items():
        # Addresses and retained HTML anchors can contain historical words.
        visible = re.sub(r"\]\([^)]+\)", "]", text)
        visible = re.sub(r"https?://[^\s\"'<>]+", "", visible)
        visible = html.unescape(re.sub(r"<[^>]+>", " ", visible))
        visible = re.sub(r"[*_`\[\]]", "", visible)
        if candidate.search(visible):
            raise ReleasePreflightError(f"Publication rejects obsolete candidate notice in {name}")
        for match in claims.finditer(visible):
            claimed = next(group for group in match.groups() if group)
            if claimed.lower() != version:
                raise ReleasePreflightError(f"Publication rejects stale current-version claim in {name}: {claimed}")
        for match in descriptions.finditer(visible):
            if match[1].lower() != version:
                raise ReleasePreflightError(f"Publication rejects target mismatch in {name}: {match[1]}")
        title = re.search(r"(?m)^# (?:Caffoot Lite )?(" + number + r")\b", visible)
        if title and title[1].lower() != version and "[compatibility introduction]" not in name:
            raise ReleasePreflightError(f"Publication rejects target title mismatch in {name}: {title[1]}")
        _check_publication_links(root, name.split(" [", 1)[0], text)
    # These are maintained current indexes, so a missing target is also an error.
    for name in (f"docs/how-tos/features-and-instructions/{version}/README.md",
                 "docs/development-guide/Development-Status.md [Current Boundary]",
                 "docs/development-guide/README.md", "ROADMAP.md",
                 "AGENTS.md [Current release and next work]",
                 "CONTRIBUTING.md [Start With An Agreed Scope]"):
        if version not in scope[name]:
            raise ReleasePreflightError(f"Publication target {version} missing from {name}")
    return tuple(scope)


def _check_publication_links(root, name, text):
    """Check local document and image destinations, including section addresses."""
    source = Path(root) / name
    for target in re.findall(r"\]\(([^)]+)\)", text):
        if re.match(r"[a-z]+:|/", target, re.I):
            continue
        path, _, fragment = unquote(target).partition("#")
        destination = (source.parent / path).resolve() if path else source
        if not destination.exists():
            raise ReleasePreflightError(f"Publication rejects broken local link in {name}: {target}")
        if fragment and destination.suffix == ".md":
            contents = destination.read_text(encoding="utf-8")
            if fragment not in _heading_anchors(contents) and f'id="{fragment}"' not in contents:
                raise ReleasePreflightError(f"Publication rejects broken section link in {name}: {target}")


def _check_installed_about(root, version, *, candidate=False):
    """Check both modular About presentations, retaining older published layouts."""
    inventory = _read_required(root, "inventory.html")
    if "/interface/loader.js" in inventory:
        account = _read_required(root, "interface/screens/my-account.html")
        application = _read_required(root, "interface/application.js")
        if f"Installed Version</label><b>{version}</b>" not in account:
            raise ReleasePreflightError("Release version does not match My Account About page")
        if f"Installed Version</span><strong>Caffoot Lite {version}</strong>" not in application:
            raise ReleasePreflightError("Release version does not match Settings About page")
        if candidate:
            for name, text in (("My Account", account), ("Settings", application)):
                if not re.search(re.escape(version) + r" is an unreleased review candidate", text):
                    raise ReleasePreflightError(f"{name} About needs its unreleased candidate notice")
    elif f"Installed Version</span><strong>Caffoot Lite {version}</strong>" not in inventory:
        raise ReleasePreflightError("Release version does not match inventory.html About page")


def _check_guide_links(root, version):
    """Require existing permanent guide paths pinned to one immutable revision."""
    account = _read_required(root, "interface/screens/my-account.html")
    settings = _read_required(root, "interface/screens/settings.html")
    application = _read_required(root, "interface/application.js")
    prefix = "https://github.com/Caffoot/Caffoot-Lite/blob/"
    suffix = f"/docs/how-tos/features-and-instructions/{version}/"
    pattern = re.escape(prefix) + r"([0-9a-f]{40})" + re.escape(suffix)
    pins = set()
    for name, text in (("My Account", account), ("Settings", settings), ("Help", application)):
        roots = re.findall(pattern, text)
        if not roots or "v2.2-draft/" in text:
            raise ReleasePreflightError(f"{name} needs permanent commit-pinned guide links")
        pins.update(roots)
        for target in re.findall(re.escape(prefix) + r"[^\s\"'<>]+", text):
            if "/features-and-instructions/" not in target:
                continue
            if not re.match(pattern, target):
                raise ReleasePreflightError(f"Incorrect permanent guide link in {name}")
            filename = target.split(suffix, 1)[1].split("#", 1)[0]
            if filename:
                _read_required(root, f"docs/how-tos/features-and-instructions/{version}/{filename}")
    if len(pins) != 1:
        raise ReleasePreflightError("Help guide revisions disagree")
    _read_required(root, f"docs/how-tos/features-and-instructions/{version}/README.md")


def check_candidate_files(root, version):
    """Validate an unreleased candidate for read-only development checks only."""
    root = Path(root)
    version = normalise_version(version)
    notes_path = f"docs/historical/release-notes/Release-Notes-{version}.md"
    documents = {name: _read_required(root, name)
                 for name in ("README.md", "INSTALLATION.md", notes_path)}
    for name, text in documents.items():
        if _heading_version(text, name) != version:
            raise ReleasePreflightError(f"Candidate version does not match {name}")
        if not re.search(r"\b(?:draft[^\n]*unreleased|" + re.escape(version) + r" is unreleased)\b", text, re.I):
            raise ReleasePreflightError(f"{name} needs an explicit unreleased notice")
    # This v2.2 transition keeps the previous release's complete archive without
    # requiring the target README to advertise that release as current.
    previous = "v2.1"
    for name in (f"docs/historical/installation/INSTALLATION-{previous}.md",
                 f"docs/historical/portainer/portainer-{previous}.yaml",
                 f"docs/historical/release-notes/Release-Notes-{previous}.md"):
        _read_required(root, name)
    stack = _read_required(root, f"portainer-{version}.yaml")
    images = re.findall(r"^\s*image:\s*(.+?)\s*$", stack, re.M)
    if images != ["${CAFFOOT_V22_PREVIEW_IMAGE:?Set CAFFOOT_V22_PREVIEW_IMAGE to your private review image}"]:
        raise ReleasePreflightError("Candidate stack must require the private review image")
    _check_required_time_zone(stack)
    if not re.search(r"\bunreleased\b", stack, re.I):
        raise ReleasePreflightError("Candidate stack needs an unreleased notice")
    guide_stack = _read_required(root, f"docs/how-tos/features-and-instructions/{version}/portainer-{version}.yaml")
    if stack != guide_stack:
        raise ReleasePreflightError("Root candidate stack differs from the maintained guide example")
    _check_root_stack(root, version)
    _check_installed_about(root, version, candidate=True)
    _check_guide_links(root, version)
    guides = _read_required(root, f"docs/how-tos/features-and-instructions/{version}/README.md")
    if not re.search(r"draft[^\n]*unreleased", guides, re.I):
        raise ReleasePreflightError("Permanent candidate guides need an unreleased notice")
    handover = _read_required(root, "docs/development-handovers/milestone-01.md")
    if version not in handover or not re.search(r"unreleased", handover, re.I):
        raise ReleasePreflightError("Candidate needs an active unreleased target handover")
    _read_required(root, ".github/workflows/publish-release.yml")
    if (root / ".github/workflows/v2-release-image.yml").exists():
        raise ReleasePreflightError("The old tag-triggered publishing workflow must be removed")
    check_compatibility_files(root, version)
    for directory in ("docs/how-tos/features-and-instructions", "docs/How To's/Features and Instructions"):
        index = _read_required(root, f"{directory}/README.md")
        if f"{version} is unreleased" not in index:
            raise ReleasePreflightError("Candidate version indexes need an explicit unreleased notice")
    return version


def check_repository_files(root):
    """Choose the read-only candidate, published or older split-baseline check."""
    root = Path(root)
    installation = _read_required(root, "INSTALLATION.md")
    version = _heading_version(installation, "INSTALLATION.md")
    readme = _read_required(root, "README.md")
    readme_version = _heading_version(readme, "README.md")
    if readme_version != version:
        # Retain the earlier approved split README/published-installation path.
        return check_release_files(root, version, allow_unreleased_readme=True)
    notes = _read_required(root, f"docs/historical/release-notes/Release-Notes-{version}.md")
    stack = _read_required(root, f"portainer-{version}.yaml")
    modern = tuple(map(int, version[1:].split("."))) >= (2, 2)
    if (modern and any(UNRELEASED_PATTERN.search(t) for t in (readme, installation, notes, stack))
            or "CAFFOOT_V22_PREVIEW_IMAGE" in stack
            or (root / "docs/development-handovers/milestone-01.md").exists()):
        return check_candidate_files(root, version)
    return check_release_files(root, version)


def check_release_files(root, version, *, allow_unreleased_readme=False):
    """Verify the requested version is consistent across the release files."""
    root = Path(root)
    version = normalise_version(version)
    readme = _read_required(root, "README.md")
    installation = _read_required(root, "INSTALLATION.md")
    inventory = _read_required(root, "inventory.html")
    modular_account = (_read_required(root, "interface/screens/my-account.html")
                       if "/interface/loader.js" in inventory else "")
    stack_name = f"portainer-{version}.yaml"
    stack = _read_required(root, stack_name)
    notes_path = f"docs/historical/release-notes/Release-Notes-{version}.md"
    notes = _read_required(root, notes_path)

    readme_heading = re.match(
        r"# Caffoot Lite (v[0-9]+\.[0-9]+(?:\.[0-9]+)?)(?: — [^\n]+)?\s*\n",
        readme,
    )
    readme_matches = bool(readme_heading and readme_heading.group(1) == version)
    if not readme_matches and allow_unreleased_readme and readme_heading:
        # A read-only PR check may prepare the next version while preserving
        # the published installation files. Explicit publication stays strict.
        next_version = readme_heading.group(1)
        draft_notes = _read_required(root, f"docs/Release-Notes-{next_version}.md")
        readme_matches = bool(
            re.search(re.escape(next_version) + r" is unreleased", readme, re.I)
            and f"{version} remains" in readme
            and re.search(r"draft[^\n]*unreleased", draft_notes, re.I)
        )

    for name, text in (("README.md", readme), ("INSTALLATION.md", installation), (notes_path, notes)):
        if name == "README.md" and allow_unreleased_readme:
            continue
        modern = tuple(map(int, version[1:].split("."))) >= (2, 2)
        notice = re.search(r"(?im)^(?:>\s*)?(?:\*\*)?draft[^\n]*unreleased", text)
        if notice or (modern and UNRELEASED_PATTERN.search(text)):
            raise ReleasePreflightError(f"Publication rejects unreleased candidate content in {name}")
    public_image = f"ghcr.io/caffoot/caffoot-lite:{version}"
    if re.findall(r"^\s*image:\s*(.+?)\s*$", stack, re.M) != [public_image]:
        raise ReleasePreflightError("Publication requires the final public image in the root stack")
    if "CAFFOOT_V22_PREVIEW_IMAGE" in stack or UNRELEASED_PATTERN.search(stack):
        raise ReleasePreflightError("Publication rejects private-only or unreleased stack configuration")

    expected = {
        "README.md": readme_matches,
        "INSTALLATION.md": (
            installation.startswith(f"# Caffoot Lite {version} —")
        ),
        "inventory.html About page": (
            f"Installed Version</span><strong>Caffoot Lite {version}</strong>"
            in inventory or f"Published Release</label><b>{version}</b>" in modular_account
            or f"Installed Version</label><b>{version}</b>" in modular_account
        ),
        stack_name: (
            f"image: ghcr.io/caffoot/caffoot-lite:{version}" in stack
        ),
        notes_path: (notes.startswith(f"# Caffoot Lite {version} —")),
    }
    for file_name, matches in expected.items():
        if not matches:
            raise ReleasePreflightError(
                f"Release version {version} does not match {file_name}"
            )

    if tuple(map(int, version[1:].split("."))) >= (2, 2):
        _check_required_time_zone(stack)
        check_publication_notices(root, version)
        _check_installed_about(root, version)
        _check_guide_links(root, version)
        guide_stack = _read_required(root, f"docs/how-tos/features-and-instructions/{version}/portainer-{version}.yaml")
        if guide_stack != stack:
            raise ReleasePreflightError("Publication requires the same final public stack in the permanent guide")
        for name in ("interface/screens/my-account.html", "interface/screens/settings.html", "interface/application.js"):
            text = _read_required(root, name)
            if re.search(re.escape(version) + r" is (?:an? )?unreleased", text, re.I):
                raise ReleasePreflightError(f"Publication rejects unreleased About/help content in {name}")
        handover = _read_required(root, f"docs/historical/development-handovers/{version}.md")
        if "Release acceptance: complete" not in handover:
            raise ReleasePreflightError("Publication requires an archived completed handover")
        if (root / "docs/development-handovers/milestone-01.md").exists():
            raise ReleasePreflightError("Archive the active milestone handover before publication")

    matching_stacks = sorted(path.name for path in root.glob("portainer-v*.yaml"))
    if matching_stacks != [stack_name]:
        raise ReleasePreflightError(
            "Keep only the current version's Portainer stack in the "
            f"repository root. Found: {matching_stacks}"
        )

    _read_required(
        root, f"docs/historical/development-handovers/{version}.md"
    )
    _read_required(root, ".github/workflows/publish-release.yml")
    if (root / ".github/workflows/v2-release-image.yml").exists():
        raise ReleasePreflightError(
            "The old tag-triggered publishing workflow must be removed "
            "before enabling one-click releases."
        )
    if (root / "docs/development-guide/Current-Development-Status.md").exists():
        raise ReleasePreflightError(
            "Archive the current development handover before publication."
        )

    check_compatibility_files(root, version)
    return version


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--version",
        help="Version to release, e.g. 2.0.3. "
        "Omit only for a safe pull-request consistency check.",
    )
    parser.add_argument(
        "--github-output",
        help="Optional path used by GitHub Actions to receive the normalised version.",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    requested = args.version
    read_only = requested is None
    try:
        version = (check_repository_files(root) if read_only
                   else check_release_files(root, requested))
    except ReleasePreflightError as error:
        parser.exit(1, f"Release preparation failed: {error}\n")

    if args.github_output:
        with open(args.github_output, "a", encoding="utf-8") as output_file:
            output_file.write(f"version={version}\n")

    if read_only:
        print(f"Read-only repository consistency passed for {version}; nothing published.")
    else:
        if tuple(map(int, version[1:].split("."))) >= (2, 2):
            for name in publication_notice_scope(root, version):
                print(f"Publication notice/link/version scan passed: {name}")
        print(f"Release preparation files agree for {version}; nothing published.")


if __name__ == "__main__":
    main()
