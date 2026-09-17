#!/usr/bin/env python3
"""Local preflight validator for a YouTube Playables game bundle.

This does not replace the official YouTube Playables Test Suite or certification.
It verifies only constraints that can be checked from local bundle files.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

MIB = 1024 * 1024
MAX_FILES = 8000
MAX_FILE_SIZE = 30 * MIB
RECOMMENDED_FILE_SIZE = 512 * 1024
MAX_TOTAL_SIZE = 250 * MIB
ALLOWED_NAME = re.compile(r"^[A-Za-z0-9_.-]+$")
SDK_MARKER = '<script src="https://www.youtube.com/game_api/v1"></script>'


def format_bytes(value: int) -> str:
    if value < 1024:
        return f"{value} B"
    if value < MIB:
        return f"{value / 1024:.1f} KiB"
    return f"{value / MIB:.2f} MiB"


def validate(root: Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if not root.exists() or not root.is_dir():
        return [f"Bundle directory does not exist: {root}"], warnings

    index = root / "index.html"
    if not index.is_file():
        errors.append("Missing root index.html")

    files = [path for path in root.rglob("*") if path.is_file()]

    if len(files) > MAX_FILES:
        errors.append(f"File count {len(files)} exceeds hard limit {MAX_FILES}")

    total_size = 0
    for path in files:
        size = path.stat().st_size
        total_size += size
        rel = path.relative_to(root)

        for part in rel.parts:
            if not ALLOWED_NAME.match(part):
                errors.append(f"Unsupported filename/path component: {rel}")
                break

        if size >= MAX_FILE_SIZE:
            errors.append(f"File exceeds 30 MiB hard limit: {rel} ({format_bytes(size)})")
        elif size >= RECOMMENDED_FILE_SIZE:
            warnings.append(
                f"File exceeds 512 KiB recommendation: {rel} ({format_bytes(size)})"
            )

    if total_size >= MAX_TOTAL_SIZE:
        errors.append(
            f"Bundle exceeds 250 MiB hard limit: {format_bytes(total_size)}"
        )

    if index.is_file():
        text = index.read_text(encoding="utf-8", errors="replace")
        sdk_pos = text.find(SDK_MARKER)
        adapter_pos = text.find("./src/youtube_adapter.js")
        game_pos = text.find("./src/game.js")

        if sdk_pos < 0:
            errors.append("Required YouTube Playables SDK script tag not found in index.html")
        else:
            if adapter_pos >= 0 and sdk_pos > adapter_pos:
                errors.append("Playables SDK must load before youtube_adapter.js")
            if game_pos >= 0 and sdk_pos > game_pos:
                errors.append("Playables SDK must load before game.js")

        absolute_local_refs = re.findall(r'(?:src|href)=["\']/(?!/)[^"\']+', text)
        if absolute_local_refs:
            errors.append("Absolute local file reference(s) found in index.html")

    print("YouTube Playables local bundle preflight")
    print(f"Bundle: {root.resolve()}")
    print(f"Files: {len(files)} / {MAX_FILES}")
    print(f"Uncompressed total: {format_bytes(total_size)} / 250 MiB")

    if warnings:
        print("\nWARNINGS")
        for item in warnings:
            print(f"- {item}")

    if errors:
        print("\nFAIL")
        for item in errors:
            print(f"- {item}")
    else:
        print("\nPASS")
        print("- Local static bundle checks passed.")
        print("- This is NOT an official YouTube Test Suite/certification result.")

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "bundle",
        nargs="?",
        default="game",
        help="Path to the game bundle directory (default: game)",
    )
    args = parser.parse_args()

    errors, _ = validate(Path(args.bundle))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
