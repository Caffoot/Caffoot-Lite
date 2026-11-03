"""Focused checks for the safe, reusable release preflight."""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from verify_release import (  # noqa: E402
    ReleasePreflightError,
    check_release_files,
    normalise_version,
)


class ReleasePreflightTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.version = "v2.0.3"
        self.write_files()

    def write(self, name, content):
        destination = self.root / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content, encoding="utf-8")

    def write_files(self):
        v = self.version
        self.write("README.md", f"# Caffoot Lite {v}\n")
        self.write("INSTALLATION.md", f"# Caffoot Lite {v} — installation\n")
        self.write(
            "inventory.html",
            f"Installed Version</span><strong>Caffoot Lite {v}</strong>",
        )
        self.write(
            f"portainer-{v}.yaml",
            f"image: ghcr.io/caffoot/caffoot-lite:{v}\n",
        )
        self.write(
            f"docs/historical/release-notes/Release-Notes-{v}.md",
            f"# Caffoot Lite {v} — release notes\n",
        )
        self.write(
            f"docs/historical/development-handovers/{v}.md",
            "HISTORICAL — no longer active\n",
        )
        self.write(".github/workflows/publish-release.yml", "name: Release\n")

    def test_accepts_dotted_stable_versions_with_optional_prefix(self):
        self.assertEqual(normalise_version("2.0.3"), "v2.0.3")
        self.assertEqual(normalise_version("v2.1"), "v2.1")
        self.assertEqual(normalise_version(" 2.1 "), "v2.1")

    def test_rejects_unexpected_or_prerelease_version(self):
        for candidate in ("", "v2", "2.0.3-beta", "v2.0.3;echo unsafe"):
            with self.subTest(candidate=candidate):
                with self.assertRaises(ReleasePreflightError):
                    normalise_version(candidate)

    def test_complete_release_preparation_passes(self):
        self.assertEqual(check_release_files(self.root, "2.0.3"), "v2.0.3")

    def test_incorrect_about_version_is_caught(self):
        self.write("inventory.html", "Installed Version: Caffoot Lite v2.0.2")
        with self.assertRaisesRegex(ReleasePreflightError, "About page"):
            check_release_files(self.root, self.version)

    def test_extra_root_portainer_file_is_caught(self):
        self.write("portainer-v2.0.2.yaml", "previous version")
        with self.assertRaisesRegex(ReleasePreflightError, "Portainer stack"):
            check_release_files(self.root, self.version)

    def test_previous_image_publisher_is_caught(self):
        self.write(".github/workflows/v2-release-image.yml", "on: push\n")
        with self.assertRaisesRegex(ReleasePreflightError, "old tag-triggered"):
            check_release_files(self.root, self.version)

    def test_unarchived_handover_is_caught(self):
        self.write("docs/development-guide/Current-Development-Status.md", "active")
        with self.assertRaisesRegex(ReleasePreflightError, "Archive"):
            check_release_files(self.root, self.version)


if __name__ == "__main__":
    unittest.main()
