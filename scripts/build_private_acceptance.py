#!/usr/bin/env python3
"""Build one local acceptance image from an exact, clean Git commit; never publish."""
import argparse
import io
import json
from pathlib import Path
import subprocess
import tarfile
import tempfile


def build_private_acceptance(root, *, save=None, build_ca=None):
    def git(*args):
        return subprocess.check_output(["git", *args], cwd=root, text=True).strip()
    if git("branch", "--show-current") not in (
        "feat/approved-modular-html-282",
        "fix/341-rack-inventory-search-spacing",
    ):
        raise RuntimeError("Use an approved private acceptance branch for Issue #282 or #341")
    if git("status", "--porcelain"):
        raise RuntimeError("Commit the complete integration before building acceptance")
    revision = git("rev-parse", "HEAD")
    archive = subprocess.check_output(["git", "archive", "--format=tar", revision], cwd=root)
    tag = "caffoot-lite:private-" + revision[:12]
    with tempfile.TemporaryDirectory(prefix="caffoot-private-build-") as directory:
        with tarfile.open(fileobj=io.BytesIO(archive)) as source:
            source.extractall(directory, filter="data")
        trust = ["--secret", "id=proxy_ca,src=" + str(build_ca.resolve(strict=True))] if build_ca else []
        subprocess.run(["docker", "build", *trust, "--build-arg", "CAFFOOT_SOURCE_REVISION=" + revision,
                        "--tag", tag, directory], check=True)
    result = json.loads(subprocess.check_output(["docker", "image", "inspect", tag], text=True))[0]
    if result["Config"]["Labels"].get("org.opencontainers.image.revision") != revision:
        raise RuntimeError("Image source revision did not match")
    if save:
        subprocess.run(["docker", "save", "--output", str(save), tag], check=True)
    print(json.dumps({"commit": revision, "image": tag, "imageId": result["Id"],
                      "published": False, "archive": str(save) if save else None}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--save", type=Path, help="Optional private Docker archive destination")
    parser.add_argument("--build-ca", type=Path, help="Optional trusted CA bundle for a private build proxy")
    arguments = parser.parse_args()
    build_private_acceptance(Path(__file__).resolve().parents[1], save=arguments.save, build_ca=arguments.build_ca)
