#!/usr/bin/env python3
"""Local preflight validator for a YouTube Playables game bundle.

This does not replace the official YouTube Playables Test Suite or certification.
It verifies only constraints and static-policy checks that can be evaluated from
local bundle files.
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
SDK_URL = "https://www.youtube.com/game_api/v1"
SDK_MARKER = f'<script src="{SDK_URL}"></script>'
TEXT_SUFFIXES = {".html", ".htm", ".js", ".mjs", ".css", ".json", ".txt"}
URL_RE = re.compile(r"https?://[^\s\"'<>)]*")

# Current Playables requirements prohibit using browser locale APIs to choose
# locale and prohibit Page Visibility-style lifecycle control. Keep these as
# hard local-preflight errors so accidental regressions are caught early.
FORBIDDEN_PATTERNS = {
    r"\bnavigator\.language\b": "Browser locale API navigator.language is not allowed for Playables locale selection",
    r"\bnavigator\.languages\b": "Browser locale API navigator.languages is not allowed for Playables locale selection",
    r"\bdocument\.visibilityState\b": "Page Visibility API must not be used for Playables pause/resume",
    r"\bdocument\.hidden\b": "Page Visibility API must not be used for Playables pause/resume",
    r"[\"']visibilitychange[\"']": "Page Visibility event must not be used for Playables pause/resume",
}

# These are not blanket JavaScript prohibitions, but current Playables review
# guidance warns that they can prevent the code from being evaluated. Surface
# them as warnings rather than inventing a stronger rule than YouTube states.
REVIEWABILITY_WARNINGS = {
    r"\beval\s*\(": "eval() may make the Playable difficult to review",
    r"\bWebAssembly\b": "WebAssembly may make the Playable difficult to review",
    r"\bnew\s+Worker\s*\(": "Web Workers may make the Playable difficult to review",
    r"\bSharedWorker\s*\(": "Shared Workers may make the Playable difficult to review",
}


def format_bytes(value: int) -> str:
    if value < 1024:
        return f"{value} B"
    if value < MIB:
        return f"{value / 1024:.1f} KiB"
    return f"{value / MIB:.2f} MiB"


def read_text(path: Path) -> str | None:
    if path.suffix.lower() not in TEXT_SUFFIXES:
        return None
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return None


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

        text = read_text(path)
        if text is None:
            continue

        for pattern, message in FORBIDDEN_PATTERNS.items():
            if re.search(pattern, text):
                errors.append(f"{rel}: {message}")

        for pattern, message in REVIEWABILITY_WARNINGS.items():
            if re.search(pattern, text):
                warnings.append(f"{rel}: {message}")

        for url in URL_RE.findall(text):
            if url != SDK_URL:
                errors.append(
                    f"{rel}: unexpected external URL '{url}'. Playables bundles should not make external calls outside permitted Google/YouTube technical requirements"
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

    # De-duplicate deterministic static findings so the report stays readable.
    errors = list(dict.fromkeys(errors))
    warnings = list(dict.fromkeys(warnings))

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
        print("- No forbidden locale/Page Visibility patterns were found.")
        print("- No unexpected external URLs were found in text bundle files.")
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
