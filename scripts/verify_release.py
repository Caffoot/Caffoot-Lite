#!/usr/bin/env python3
"""Check release filenames and version details without publishing anything."""

import argparse
import re
from pathlib import Path


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

    expected = {
        "README.md": readme_matches,
        "INSTALLATION.md": (
            installation.startswith(f"# Caffoot Lite {version} —")
        ),
        "inventory.html About page": (
            f"Installed Version</span><strong>Caffoot Lite {version}</strong>"
            in inventory or f"Published Release</label><b>{version}</b>" in modular_account
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
    if read_only:
        installation = _read_required(root, "INSTALLATION.md")
        match = re.match(r"# Caffoot Lite (v[0-9]+\.[0-9]+(?:\.[0-9]+)?) —", installation)
        if match is None:
            parser.error("Cannot detect the published version from INSTALLATION.md")
        requested = match.group(1)

    try:
        version = check_release_files(root, requested, allow_unreleased_readme=read_only)
    except ReleasePreflightError as error:
        parser.exit(1, f"Release preparation failed: {error}\n")

    if args.github_output:
        with open(args.github_output, "a", encoding="utf-8") as output_file:
            output_file.write(f"version={version}\n")

    if read_only:
        print(f"Published installation files agree for {version}; "
              "README version notices checked; nothing published.")
    else:
        print(f"Release preparation files agree for {version}; nothing published.")


if __name__ == "__main__":
    main()
