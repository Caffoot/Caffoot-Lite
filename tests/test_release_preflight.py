"""Focused checks for the safe, reusable release preflight."""

import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from verify_release import (  # noqa: E402
    ReleasePreflightError,
    check_release_files,
    check_repository_files,
    publication_notice_scope,
    GUIDE_NAMES,
    LEGACY_GUIDE_ANCHORS,
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
        self.write("docs/development-guide/README.md", "Developer guidance\n")
        for name in GUIDE_NAMES:
            for directory in ("docs/how-tos/features-and-instructions", "docs/How To's/Features and Instructions"):
                self.write(f"{directory}/{name}", "Published guide\n")

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

    def test_product_subtitle_keeps_exact_release_version_check(self):
        self.write("README.md", f"# Caffoot Lite {self.version} — Everyday IT Management\n")
        self.assertEqual(check_release_files(self.root, self.version), self.version)

    def test_unreleased_readme_is_only_accepted_for_read_only_check(self):
        self.write("README.md", "# Caffoot Lite v2.2 — Everyday IT Management\n"
                   "v2.2 is unreleased. v2.0.3 remains the published download.\n")
        self.write("docs/Release-Notes-v2.2.md", "# Caffoot Lite v2.2 — Notes\nDraft — Unreleased.\n")
        self.assertEqual(check_release_files(self.root, self.version,
                                            allow_unreleased_readme=True), self.version)
        with self.assertRaisesRegex(ReleasePreflightError, "README.md"):
            check_release_files(self.root, self.version)
        with self.assertRaisesRegex(ReleasePreflightError, "portainer-v2.2.yaml"):
            check_release_files(self.root, "v2.2")

    def test_unreleased_readme_needs_notice_and_draft_notes(self):
        self.write("README.md", "# Caffoot Lite v2.2 — Everyday IT Management\n"
                   "v2.0.3 remains published.\n")
        self.write("docs/Release-Notes-v2.2.md", "Draft — Unreleased.\n")
        with self.assertRaisesRegex(ReleasePreflightError, "README.md"):
            check_release_files(self.root, self.version, allow_unreleased_readme=True)
        self.write("README.md", "# Caffoot Lite v2.2 — Everyday IT Management\n"
                   "v2.2 is unreleased. v2.0.3 remains published.\n")
        self.write("docs/Release-Notes-v2.2.md", "Released.\n")
        with self.assertRaisesRegex(ReleasePreflightError, "README.md"):
            check_release_files(self.root, self.version, allow_unreleased_readme=True)
        (self.root / "docs/Release-Notes-v2.2.md").unlink()
        with self.assertRaisesRegex(ReleasePreflightError, "Missing release file"):
            check_release_files(self.root, self.version, allow_unreleased_readme=True)

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




class CandidatePreflightTests(unittest.TestCase):
    """Exercise the transition without an image, running application or network."""

    setUp = ReleasePreflightTests.setUp
    write = ReleasePreflightTests.write
    write_files = ReleasePreflightTests.write_files

    def prepare_candidate(self):
        shutil.rmtree(self.root)
        self.root.mkdir()
        self.version = "v2.0.3"
        self.write_files()
        self.version = "v2.2"
        repository = Path(__file__).resolve().parents[1]
        archive = "docs/historical/features-and-instructions/v2.1"
        for name in GUIDE_NAMES:
            self.write(f"{archive}/{name}", (repository / archive / name).read_text())
            target = f"../../historical/features-and-instructions/v2.1/{name}"
            notice = f"# v2.1 Guide\n[Published v2.1 guide]({target})\n"
            if name == "README.md":
                notice = ("# Versioned Guides\n"
                          "[v2.2 guides](../../how-tos/features-and-instructions/v2.2/README.md)\n"
                          f"v2.2 is unreleased; [v2.1 archive]({target})\n")
            notice += "## Original v2.1 Sections\n"
            for anchor in LEGACY_GUIDE_ANCHORS[name]:
                notice += f'<a id="{anchor}"></a>\n[Original v2.1 section]({target}#{anchor})\n'
            for directory in ("docs/how-tos/features-and-instructions", "docs/How To's/Features and Instructions"):
                self.write(f"{directory}/{name}", notice)
        self.write("docs/historical/portainer/portainer-v2.0.3.yaml", "image: old published\n")
        (self.root / "portainer-v2.0.3.yaml").unlink()
        v = self.version
        self.write("README.md", f"# Caffoot Lite {v} — Everyday IT Management\n"
                   f"{v} is unreleased.\n")
        self.write("INSTALLATION.md", f"# Caffoot Lite {v} — Installation\nDraft {v} — Unreleased.\n"
                   "[v2.1 guides](docs/historical/features-and-instructions/v2.1/README.md)\n"
                   "[v2.1 installation](docs/historical/installation/INSTALLATION-v2.1.md)\n")
        self.write(f"docs/historical/release-notes/Release-Notes-{v}.md",
                   f"# Caffoot Lite {v} — Release notes\nDraft — Unreleased.\n")
        self.write("docs/historical/installation/INSTALLATION-v2.1.md", "Published v2.1 guide\n")
        self.write("docs/historical/portainer/portainer-v2.1.yaml", "image: published\n")
        self.write("docs/historical/release-notes/Release-Notes-v2.1.md", "Published v2.1 notes\n")
        self.write("inventory.html", '<script src="/interface/loader.js"></script>')
        guide = ("https://github.com/Caffoot/Caffoot-Lite/blob/" + "a" * 40
                 + f"/docs/how-tos/features-and-instructions/{v}/README.md")
        self.write("interface/screens/my-account.html", f"Installed Version</label><b>{v}</b>"
                   f"{v} is an unreleased review candidate."
                   f'<a href="{guide}">Guides</a>')
        self.write("interface/screens/settings.html", f'<a href="{guide}">Guides</a>')
        self.write("interface/application.js", f"Installed Version</span><strong>Caffoot Lite {v}</strong>"
                   f"{v} is an unreleased review candidate."
                   f"const guideRoot = '{guide.removesuffix('README.md')}';")
        stack = ("# UNRELEASED, private review only\nservices:\n  caffoot-lite:\n"
                 "    image: ${CAFFOOT_V22_PREVIEW_IMAGE:?Set CAFFOOT_V22_PREVIEW_IMAGE to your private review image}\n"
                 "    environment:\n      TZ: \"${TZ:?Set TZ to your organisation's IANA time zone}\"\n")
        self.write(f"portainer-{v}.yaml", stack)
        self.write(f"docs/how-tos/features-and-instructions/{v}/portainer-{v}.yaml", stack)
        self.write(f"docs/how-tos/features-and-instructions/{v}/README.md", "Draft v2.2 — Unreleased.\n")
        self.write("docs/development-handovers/milestone-01.md", "Active v2.2 — unreleased.\n")

    def change(self, name, before, after):
        self.write(name, (self.root / name).read_text().replace(before, after))

    def prepare_final_release(self):
        self.prepare_candidate()
        for name in ("README.md", "INSTALLATION.md", "docs/historical/release-notes/Release-Notes-v2.2.md"):
            content = (self.root / name).read_text().splitlines()[0] + "\nPublished release.\n"
            self.write(name, content)
        self.write("INSTALLATION.md", (self.root / "INSTALLATION.md").read_text()
                   + "[v2.1 guides](docs/historical/features-and-instructions/v2.1/README.md)\n"
                   "[v2.1 installation](docs/historical/installation/INSTALLATION-v2.1.md)\n")
        self.write("portainer-v2.2.yaml", "services:\n  caffoot-lite:\n    image: ghcr.io/caffoot/caffoot-lite:v2.2\n"
                   "    environment:\n      TZ: \"${TZ:?Set TZ to your organisation's IANA time zone}\"\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/portainer-v2.2.yaml",
                   (self.root / "portainer-v2.2.yaml").read_text())
        for name in ("interface/screens/my-account.html", "interface/application.js"):
            self.change(name, "v2.2 is an unreleased review candidate.",
                        "v2.2 is the current release.")
        for directory in ("docs/how-tos/features-and-instructions", "docs/How To's/Features and Instructions"):
            for name in GUIDE_NAMES:
                path = f"{directory}/{name}"
                text = (self.root / path).read_text()
                text = text.replace("v2.2 — Unreleased", "v2.2 — Current Release")
                text = text.replace("v2.2 is unreleased;", "v2.2 is published;")
                text = text.replace("the development target, not a published production upgrade", "the current release")
                text = text.replace("the unreleased v2.2 target", "v2.2")
                self.write(path, text)
        self.write("docs/how-tos/features-and-instructions/v2.2/README.md", "Published v2.2 guides.\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/Devices.md", "Published Device guide.\n")
        (self.root / "docs/development-handovers/milestone-01.md").unlink()
        self.write("docs/historical/development-handovers/v2.2.md", "HISTORICAL\nRelease acceptance: complete\n")
        for name in ("compose.yaml", "SECURITY.md", "docs/Community-Participation.md",
                     "docs/historical/README.md", "docs/development-handovers/README.md",
                     "docs/product-direction/VISION.md"):
            self.write(name, "Version-specific history is retained.\n")
        for name in ("ROADMAP.md", "docs/development-guide/README.md"):
            self.write(name, "Caffoot Lite v2.2 is the current release.\n")
        for name, heading in (("AGENTS.md", "Current release and next work"),
                              ("CONTRIBUTING.md", "Start With An Agreed Scope"),
                              ("docs/development-guide/Development-Status.md", "Current Boundary")):
            self.write(name, f"## {heading}\nv2.2 is the current release.\n"
                       "## Historical Record\nv2.1 remains the published release. Draft v2.2 — Unreleased.\n")
        for name in ("docs/product-direction/PROPOSED-MILESTONES.md",
                     "docs/product-direction/FEATURE-BRAINSTORM.md"):
            self.write(name, "> **Current direction:** v2.2 is the current release.\n"
                       "> **Historical decision update:** Draft v2.2 — Unreleased.\n")
        for name, paragraphs in (
            ("AGENTS.md", "- Write approachable, thorough guidance.\n"
                          "- Maintain **version-specific truth**: use accurate release wording.\n"),
            ("CONTRIBUTING.md", "**Our standard for all current and future feature instructions is accuracy.**\n"
                                "7. **Version and release accuracy:** use accurate release wording.\n"),
        ):
            self.write(name, (self.root / name).read_text() + "\n## Documentation policy\n" + paragraphs)

    def test_target_only_candidate_readme_passes(self):
        self.prepare_candidate()
        self.assertNotIn("v2.1", (self.root / "README.md").read_text())
        self.assertEqual(check_repository_files(self.root), "v2.2")

    def test_target_only_candidate_still_requires_complete_previous_archive(self):
        archives = [f"docs/historical/features-and-instructions/v2.1/{name}" for name in GUIDE_NAMES]
        archives += ["docs/historical/installation/INSTALLATION-v2.1.md",
                     "docs/historical/portainer/portainer-v2.1.yaml",
                     "docs/historical/release-notes/Release-Notes-v2.1.md"]
        for name in archives:
            with self.subTest(name=name):
                self.prepare_candidate()
                (self.root / name).unlink()
                with self.assertRaises(ReleasePreflightError):
                    check_repository_files(self.root)

    def test_candidate_cannot_be_published(self):
        self.prepare_candidate()
        with self.assertRaisesRegex(ReleasePreflightError, "Publication rejects"):
            check_release_files(self.root, "v2.2")

    def test_final_release_passes_both_paths(self):
        self.prepare_final_release()
        self.assertEqual(check_release_files(self.root, "v2.2"), "v2.2")
        self.assertEqual(check_repository_files(self.root), "v2.2")

    def test_candidate_requires_matching_document_versions(self):
        for name in ("README.md", "INSTALLATION.md", "docs/historical/release-notes/Release-Notes-v2.2.md"):
            with self.subTest(name=name):
                self.prepare_candidate()
                self.change(name, "# Caffoot Lite v2.2", "# Caffoot Lite v2.3")
                with self.assertRaises(ReleasePreflightError):
                    check_repository_files(self.root)

    def test_candidate_requires_each_unreleased_notice(self):
        for name in ("README.md", "INSTALLATION.md", "docs/historical/release-notes/Release-Notes-v2.2.md"):
            with self.subTest(name=name):
                self.prepare_candidate()
                self.write(name, (self.root / name).read_text().splitlines()[0] + "\nPublished.\n")
                with self.assertRaisesRegex(ReleasePreflightError, "unreleased notice"):
                    check_repository_files(self.root)

    def test_candidate_requires_both_installed_about_versions_and_notices(self):
        for name in ("interface/screens/my-account.html", "interface/application.js"):
            for before, after in (("Version</", "Release</"), ("v2.2</", "v2.1</"),
                                  ("unreleased review candidate", "published release")):
                with self.subTest(name=name, before=before):
                    self.prepare_candidate()
                    self.change(name, before, after)
                    with self.assertRaises(ReleasePreflightError):
                        check_repository_files(self.root)

    def test_candidate_requires_private_image_required_zone_and_stack_notice(self):
        for before, after in (("${CAFFOOT_V22_PREVIEW_IMAGE:?Set CAFFOOT_V22_PREVIEW_IMAGE to your private review image}",
                               "ghcr.io/caffoot/caffoot-lite:v2.2"),
                              ("${TZ:?Set TZ to your organisation's IANA time zone}", "Europe/London"),
                              ("UNRELEASED", "Published")):
            with self.subTest(before=before):
                self.prepare_candidate()
                self.change("portainer-v2.2.yaml", before, after)
                with self.assertRaises(ReleasePreflightError):
                    check_repository_files(self.root)

    def test_candidate_rejects_additional_root_stack(self):
        self.prepare_candidate()
        self.write("portainer-v2.1.yaml", "old stack")
        with self.assertRaisesRegex(ReleasePreflightError, "Portainer stack"):
            check_repository_files(self.root)

    def test_candidate_rejects_changed_mounts_or_ports_against_guide_example(self):
        self.prepare_candidate()
        self.write("portainer-v2.2.yaml", (self.root / "portainer-v2.2.yaml").read_text() + "ports: [9999:8080]\n")
        with self.assertRaisesRegex(ReleasePreflightError, "differs"):
            check_repository_files(self.root)

    def test_candidate_requires_real_permanent_guide_links(self):
        for name in ("interface/screens/my-account.html", "interface/screens/settings.html", "interface/application.js"):
            for before, after in (("a" * 40, "v2.2"), ("/v2.2/", "/v2.2-draft/"),
                                  ("a" * 40, "b" * 40)):
                with self.subTest(name=name, after=after):
                    self.prepare_candidate()
                    self.change(name, before, after)
                    with self.assertRaises(ReleasePreflightError):
                        check_repository_files(self.root)
        self.prepare_candidate()
        self.change("interface/screens/my-account.html", "README.md", "Missing.md")
        with self.assertRaisesRegex(ReleasePreflightError, "Missing release file"):
            check_repository_files(self.root)

    def test_candidate_requires_active_handover_and_guide_notice(self):
        for name in ("docs/development-handovers/milestone-01.md", "docs/how-tos/features-and-instructions/v2.2/README.md"):
            with self.subTest(name=name):
                self.prepare_candidate()
                self.write(name, "Published.\n")
                with self.assertRaises(ReleasePreflightError):
                    check_repository_files(self.root)

    def test_compatibility_and_historical_records_remain_required(self):
        for name in ("docs/How To's/Features and Instructions/Devices.md",
                     "docs/historical/portainer/portainer-v2.1.yaml",
                     "docs/historical/installation/INSTALLATION-v2.1.md"):
            with self.subTest(name=name):
                self.prepare_candidate()
                (self.root / name).unlink()
                with self.assertRaises(ReleasePreflightError):
                    check_repository_files(self.root)
                self.write(name, "Published guide\n")
        self.prepare_candidate()
        self.write("docs/how-tos/features-and-instructions/Devices.md", "different")
        with self.assertRaisesRegex(ReleasePreflightError, "compatibility copy differs"):
            check_repository_files(self.root)

    def test_publication_requires_completed_archived_handover(self):
        self.prepare_final_release()
        self.write("docs/historical/development-handovers/v2.2.md", "Not accepted yet\n")
        with self.assertRaisesRegex(ReleasePreflightError, "completed handover"):
            check_release_files(self.root, "v2.2")
        self.write("docs/historical/development-handovers/v2.2.md", "Release acceptance: complete\n")
        self.write("docs/development-handovers/milestone-01.md", "active")
        with self.assertRaisesRegex(ReleasePreflightError, "Archive the active"):
            check_release_files(self.root, "v2.2")

    def test_publication_rejects_private_image_and_comment_only_public_target(self):
        self.prepare_final_release()
        self.write("portainer-v2.2.yaml", "# image: ghcr.io/caffoot/caffoot-lite:v2.2\nimage: private:review\n")
        with self.assertRaisesRegex(ReleasePreflightError, "final public image"):
            check_release_files(self.root, "v2.2")

    def test_publication_rejects_private_guide_stack(self):
        self.prepare_final_release()
        self.write("docs/how-tos/features-and-instructions/v2.2/portainer-v2.2.yaml", "image: private:review\n")
        with self.assertRaisesRegex(ReleasePreflightError, "final public stack"):
            check_release_files(self.root, "v2.2")

    def test_read_only_keeps_older_published_and_split_baseline_paths(self):
        self.assertEqual(check_repository_files(self.root), "v2.0.3")
        self.write("README.md", "# Caffoot Lite v2.2 — Everyday IT Management\n"
                   "v2.2 is unreleased. v2.0.3 remains published.\n")
        self.write("docs/Release-Notes-v2.2.md", "Draft — Unreleased.\n")
        self.assertEqual(check_repository_files(self.root), "v2.0.3")

    def test_publication_rejects_leftover_notices(self):
        for name, notice in (("INSTALLATION.md", "Draft — Unreleased.\n"),
                             ("docs/historical/release-notes/Release-Notes-v2.2.md", "Draft — Unreleased.\n"),
                             ("interface/screens/my-account.html", "v2.2 is an unreleased review candidate.\n"),
                             ("interface/screens/settings.html", "v2.2 is unreleased.\n"),
                             ("docs/how-tos/features-and-instructions/v2.2/README.md", "Draft — Unreleased.\n"),
                             ("docs/how-tos/features-and-instructions/v2.2/Devices.md", "> **Draft v2.2 — Unreleased.**\n")):
            with self.subTest(name=name):
                self.prepare_final_release()
                self.write(name, (self.root / name).read_text() + notice)
                with self.assertRaisesRegex(ReleasePreflightError, "Publication rejects"):
                    check_release_files(self.root, "v2.2")

    def test_final_portainer_requires_supplied_iana_zone(self):
        valid = '      TZ: "${TZ:?Set TZ to your organisation\'s IANA time zone}"\n'
        for replacement in ("", '      TZ: "Europe/London"\n',
                            '      TZ: "${TZ:-Europe/London}"\n', '      TZ: "${TZ}"\n',
                            '      TZ: "${TZ:?Set a zone}"\n'):
            with self.subTest(replacement=replacement):
                self.prepare_final_release()
                for name in ("portainer-v2.2.yaml", "docs/how-tos/features-and-instructions/v2.2/portainer-v2.2.yaml"):
                    self.change(name, valid, replacement)
                with self.assertRaisesRegex(ReleasePreflightError, "configurable IANA TZ"):
                    check_release_files(self.root, "v2.2")

    def test_publication_scans_every_declared_current_surface(self):
        self.prepare_final_release()
        self.write("docs/how-tos/features-and-instructions/v2.2/nested/Guide.md", "These instructions describe v2.2.\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/compose-v2.2.yaml", "services: {}\n")
        scope = publication_notice_scope(self.root, "v2.2")
        for surface in scope:
            with self.subTest(surface=surface):
                name = surface.split(" [", 1)[0]
                before = (self.root / name).read_text()
                notice = "Draft v2.2 — Unreleased. v2.1 remains the published release.\n"
                if "[paragraph:" in surface:
                    selected = scope[surface]
                    self.write(name, before.replace(selected, selected + " " + notice.strip(), 1))
                elif "[Current" in surface or "[Start" in surface:
                    first, rest = before.split("\n", 1)
                    self.write(name, first + "\n" + notice + rest)
                else:
                    self.write(name, notice + before)
                with self.assertRaisesRegex(ReleasePreflightError, "Publication rejects"):
                    check_release_files(self.root, "v2.2")
                self.write(name, before)

    def test_publication_rejects_notice_variants_and_stale_version_claims(self):
        notices = ("Private-review-only instructions.", "Isolated review instance.",
                   "Draft v2.2 guides", "Draft Portainer example", "v2.2 review candidate",
                   "v2.2 is not yet published.", "Future publication target only.",
                   "No public v2.2 image is available.", "No supported production upgrade is offered.",
                   "v2.2 production upgrade and recovery acceptance remain outstanding.",
                   "v2.1 remains the published release.", "v2.1 remains the current published download.",
                   "v2.1 is the published Docker/SQLite baseline.", "Current release: v2.1",
                   "v2.1 is the only currently published release.",
                   "**Published baseline:** [Caffoot Lite v2.1](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.1).",
                   "## Available now — v2.1", "## Install The Published Release — v2.1",
                   "These instructions describe v2.3.", "Current development target: v2.3")
        for notice in notices:
            with self.subTest(notice=notice):
                self.prepare_final_release()
                self.write("docs/how-tos/features-and-instructions/v2.2/Devices.md", notice + "\n")
                with self.assertRaisesRegex(ReleasePreflightError, "Publication rejects"):
                    check_release_files(self.root, "v2.2")

    def test_publication_preserves_historical_and_product_draft_words(self):
        self.prepare_final_release()
        for name in ("README.md", "docs/historical/release-notes/Release-Notes-v2.2.md",
                     "docs/how-tos/features-and-instructions/v2.2/README.md"):
            self.write(name, (self.root / name).read_text() + "Save as Draft and publish email templates.\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/screenshots/README.md",
                   "Historical v2.2 draft — unreleased review evidence.\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/screenshots/example-draft.png", "Image fixture\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/Devices.md",
                   'These instructions describe v2.2. Save as Draft, Saved Draft Ready and publish email templates.\n'
                   'Cancel the Device draft. v2.1 was published in 2026.\n'
                   '<a id="department-details--unreleased-v22"></a>\n'
                   '[Original image](screenshots/example-draft.png)\n')
        self.assertEqual(check_release_files(self.root, "v2.2"), "v2.2")
        self.assertEqual(check_repository_files(self.root), "v2.2")

    def test_publication_requires_target_in_current_indexes_and_status(self):
        for name in ("docs/how-tos/features-and-instructions/v2.2/README.md", "ROADMAP.md",
                     "docs/development-guide/README.md", "docs/development-guide/Development-Status.md"):
            with self.subTest(name=name):
                self.prepare_final_release()
                self.change(name, "v2.2", "v2.3")
                with self.assertRaisesRegex(ReleasePreflightError, "target|mismatch|current-version"):
                    check_release_files(self.root, "v2.2")

    def test_current_paragraph_cannot_be_omitted_to_bypass_publication_scan(self):
        self.prepare_final_release()
        self.write("docs/product-direction/PROPOSED-MILESTONES.md",
                   "> **Historical decision update:** Draft v2.2 — Unreleased.\n")
        with self.assertRaisesRegex(ReleasePreflightError, "Missing or ambiguous current paragraph"):
            check_release_files(self.root, "v2.2")

    def test_current_section_cannot_be_omitted_to_bypass_publication_scan(self):
        self.prepare_final_release()
        self.write("docs/development-guide/Development-Status.md", "## Historical Record\nv2.2\n")
        with self.assertRaisesRegex(ReleasePreflightError, "Missing current release section"):
            check_release_files(self.root, "v2.2")

    def test_archive_and_both_compatibility_destinations_and_anchors_are_required(self):
        archive = "docs/historical/features-and-instructions/v2.1/Devices.md"
        for fault in ("archive", "archive heading", "anchor", "section link", "destination", "index"):
            with self.subTest(fault=fault):
                self.prepare_candidate()
                if fault == "archive":
                    (self.root / archive).unlink()
                elif fault == "archive heading":
                    self.change(archive, "## What a device record represents", "## Renamed section")
                else:
                    for directory in ("docs/how-tos/features-and-instructions", "docs/How To's/Features and Instructions"):
                        name = f"{directory}/Devices.md"
                        if fault == "anchor":
                            self.change(name, '<a id="what-a-device-record-represents"></a>', '')
                        elif fault == "section link":
                            self.change(name, "Devices.md#what-a-device-record-represents", "Devices.md#missing")
                        elif fault == "destination":
                            self.change(name, "../../historical/features-and-instructions/v2.1/Devices.md", "v2.2/Devices.md")
                        else:
                            self.change(f"{directory}/README.md", "../../how-tos/features-and-instructions/v2.2/README.md", "v2.2/README.md")
                with self.assertRaises(ReleasePreflightError):
                    check_repository_files(self.root)

    def test_root_installation_keeps_v21_archive_access_after_publication(self):
        for target in ("docs/historical/features-and-instructions/v2.1/README.md",
                       "docs/historical/installation/INSTALLATION-v2.1.md"):
            with self.subTest(target=target):
                self.prepare_final_release()
                self.change("INSTALLATION.md", target, "README.md")
                with self.assertRaisesRegex(ReleasePreflightError, "explicit v2.1 archive"):
                    check_release_files(self.root, "v2.2")

    def test_publication_checks_active_links_and_retained_section_addresses(self):
        for target in ("Missing.md", "README.md#missing"):
            with self.subTest(target=target):
                self.prepare_final_release()
                self.write("docs/how-tos/features-and-instructions/v2.2/Devices.md", f"[Read guide]({target})\n")
                with self.assertRaisesRegex(ReleasePreflightError, "broken.*link"):
                    check_release_files(self.root, "v2.2")
        self.write("docs/how-tos/features-and-instructions/v2.2/README.md", "# v2.2 Guides\n\n## Using Devices\n")
        self.write("docs/how-tos/features-and-instructions/v2.2/Devices.md", "[Read guide](README.md#using-devices)\n")
        self.assertEqual(check_release_files(self.root, "v2.2"), "v2.2")


if __name__ == "__main__":
    unittest.main()
