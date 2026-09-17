#!/usr/bin/env python3
"""Validate and package the game directory as a Playables-style ZIP.

The ZIP contains the *contents* of game/ at archive root so index.html is a
root entry, matching the YouTube Playables bundle structure.
"""

from __future__ import annotations

import argparse
import sys
import zipfile
from pathlib import Path

from validate_bundle import validate


def package(bundle: Path, output: Path) -> int:
    errors, _ = validate(bundle)
    if errors:
        print("\nPackaging aborted because local preflight failed.")
        return 1

    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        output.unlink()

    files = sorted(path for path in bundle.rglob("*") if path.is_file())
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, path.relative_to(bundle).as_posix())

    with zipfile.ZipFile(output, "r") as archive:
        names = archive.namelist()
        if "index.html" not in names:
            print("FAIL: packaged ZIP does not contain root index.html")
            output.unlink(missing_ok=True)
            return 1

    print(f"\nCreated: {output}")
    print(f"Archive files: {len(files)}")
    print(f"Archive size: {output.stat().st_size} bytes")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bundle", default="game", help="Game bundle directory")
    parser.add_argument(
        "--output",
        default="build/inspection-sprint-exp001.zip",
        help="Output ZIP path",
    )
    args = parser.parse_args()
    return package(Path(args.bundle), Path(args.output))


if __name__ == "__main__":
    sys.exit(main())
