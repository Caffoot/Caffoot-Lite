#!/usr/bin/env python3
"""Check release filenames and version details without publishing anything."""

import argparse
import re
from pathlib import Path


GUIDE_NAMES = {
    "README.md", "Devices.md", "Getting-Started.md", "IPAM.md",
    "Migration-Backup-and-Restore.md", "Racks.md",
    "Settings-and-Change-History.md", "Users-Permissions-and-MFA.md",
}
UNRELEASED_PATTERN = re.compile(r"\b(?:unreleased|draft|review candidate|private review only)\b", re.I)
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
    _read_required(root, "docs/development-guide/README.md")
    stacks = {p.stem.removeprefix("portainer-")
              for p in (root / "docs/historical/portainer").glob("portainer-v*.yaml")}
    notes = {p.stem.removeprefix("Release-Notes-")
             for p in (root / "docs/historical/release-notes").glob("Release-Notes-v*.md")} - {version}
    if stacks != notes:
        raise ReleasePreflightError("Historical release notes and Portainer examples disagree")


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
    readme = documents["README.md"]
    baseline = re.search(r"(v[0-9]+\.[0-9]+(?:\.[0-9]+)?) remains", readme)
    if not baseline or baseline[1] == version:
        raise ReleasePreflightError("Candidate README must retain its published baseline")
    previous = baseline[1]
    for name in (f"docs/historical/installation/INSTALLATION-{previous}.md",
                 f"docs/historical/portainer/portainer-{previous}.yaml",
                 f"docs/historical/release-notes/Release-Notes-{previous}.md"):
        _read_required(root, name)
    stack = _read_required(root, f"portainer-{version}.yaml")
    images = re.findall(r"^\s*image:\s*(.+?)\s*$", stack, re.M)
    if images != ["${CAFFOOT_V22_PREVIEW_IMAGE:?Set CAFFOOT_V22_PREVIEW_IMAGE to your private review image}"]:
        raise ReleasePreflightError("Candidate stack must require the private review image")
    if not re.search(r'TZ:\s*"\$\{TZ:\?[^}]*IANA[^}]+\}"', stack):
        raise ReleasePreflightError("Candidate stack must require a configurable IANA TZ")
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
        _check_installed_about(root, version)
        _check_guide_links(root, version)
        guide_index = _read_required(root, f"docs/how-tos/features-and-instructions/{version}/README.md")
        if UNRELEASED_PATTERN.search(guide_index):
            raise ReleasePreflightError("Publication rejects unreleased permanent guides")
        guide_directory = root / f"docs/how-tos/features-and-instructions/{version}"
        for guide in guide_directory.glob("*.md"):
            if re.search(r"(?im)^>\s*\*\*draft[^\n]*unreleased", guide.read_text(encoding="utf-8")):
                raise ReleasePreflightError(f"Publication rejects unreleased guide: {guide.name}")
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
        print(f"Release preparation files agree for {version}; nothing published.")


if __name__ == "__main__":
    main()
