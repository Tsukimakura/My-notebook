#!/usr/bin/env python3
"""Normalize and validate the Markdown conventions used by this notebook."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

FENCE = re.compile(r"^(?P<indent>\s*)(?P<marker>`{3,}|~{3,})(?P<info>.*)$")
HEADING = re.compile(r"^(?P<marks>#{1,6})\s+(?P<title>.*?)\s*$")
NUMBER_PREFIX = re.compile(r"^\d+\s+")


def is_heading(line: str) -> re.Match[str] | None:
    return HEADING.match(line)


def visible_heading_indexes(lines: list[str]) -> list[int]:
    indexes: list[int] = []
    fence: str | None = None
    for index, line in enumerate(lines):
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
            continue
        if fence is None and is_heading(line):
            indexes.append(index)
    return indexes


def title_from_path(path: Path) -> str:
    return NUMBER_PREFIX.sub("", path.stem).strip() or "Untitled note"


def normalize_headings(lines: list[str], path: Path) -> list[str]:
    indexes = visible_heading_indexes(lines)
    top_level = [index for index in indexes if lines[index].startswith("# ")]
    if not top_level:
        lines = [f"# {title_from_path(path)}", "", *lines]
        indexes = visible_heading_indexes(lines)
        top_level = [0]

    first_h1 = top_level[0]
    section_levels = [
        len(is_heading(lines[index]).group("marks"))
        for index in indexes
        if index != first_h1 and len(is_heading(lines[index]).group("marks")) > 1
    ]
    offset = min(0, 2 - min(section_levels)) if section_levels else 0

    fence: str | None = None
    previous_level = 1
    seen_h1 = False
    for index, line in enumerate(lines):
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
            continue
        if fence is not None:
            continue
        heading = is_heading(line)
        if not heading:
            continue

        level = len(heading.group("marks"))
        title = heading.group("title")
        if level == 1 and not seen_h1:
            seen_h1 = True
            previous_level = 1
            lines[index] = f"# {title}"
            continue

        desired = 2 if level == 1 else max(2, level + offset)
        desired = min(desired, previous_level + 1)
        lines[index] = f"{'#' * desired} {title}"
        previous_level = desired
    return lines


def normalize_fences(lines: list[str]) -> list[str]:
    fence: str | None = None
    result: list[str] = []
    for line in lines:
        match = FENCE.match(line)
        if not match:
            result.append(line)
            continue

        marker = match.group("marker")[0]
        if fence is None:
            fence = marker
            if not match.group("info").strip():
                line = f"{match.group('indent')}{match.group('marker')}text"
        elif fence == marker:
            fence = None
        result.append(line)
    return result


def surround_headings(lines: list[str]) -> list[str]:
    result: list[str] = []
    fence: str | None = None
    for index, line in enumerate(lines):
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
        heading = is_heading(line) if fence is None else None
        if heading and result and result[-1] != "":
            result.append("")
        result.append(line)
        if heading and index + 1 < len(lines) and lines[index + 1] != "":
            result.append("")
    return result


def format_text(text: str, path: Path) -> str:
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    lines = normalize_headings(lines, path)
    lines = normalize_fences(lines)
    lines = surround_headings(lines)
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines) + "\n"


def markdown_files(roots: list[Path]) -> list[Path]:
    files: list[Path] = []
    for root in roots:
        if root.is_file() and root.suffix == ".md":
            files.append(root)
        elif root.is_dir():
            files.extend(root.rglob("*.md"))
    return sorted(files)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", default=["docs", "drafts"])
    parser.add_argument("--check", action="store_true", help="fail if formatting is needed")
    args = parser.parse_args()

    changed: list[Path] = []
    for path in markdown_files([Path(value) for value in args.paths]):
        original = path.read_text(encoding="utf-8")
        formatted = format_text(original, path)
        if original == formatted:
            continue
        changed.append(path)
        if not args.check:
            path.write_text(formatted, encoding="utf-8")

    if args.check and changed:
        print("Markdown formatting is required:", file=sys.stderr)
        print("\n".join(str(path) for path in changed), file=sys.stderr)
        return 1
    if not args.check:
        print(f"Formatted {len(changed)} Markdown file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
