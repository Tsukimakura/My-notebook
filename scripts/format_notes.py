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
ORDERED_ITEM = re.compile(r"^(?P<indent>\s*)(?P<number>\d+)\.\s+(?P<body>.*)$")


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


def unclosed_fence_line(lines: list[str]) -> int | None:
    """Return the opening line of an unclosed fenced code block, if any.

    An unclosed fence makes all subsequent Markdown—including headings—render
    as code.  Conversely, a missing opening fence can make shell comments and
    preprocessor directives render as headings.  Formatting cannot infer where
    that fence belongs safely, so this is a hard validation error.
    """
    opener: tuple[str, int, int] | None = None
    for line_number, line in enumerate(lines, start=1):
        match = FENCE.match(line)
        if not match:
            continue
        marker = match.group("marker")
        if opener is None:
            opener = (marker[0], len(marker), line_number)
            continue
        character, length, _ = opener
        if marker[0] == character and len(marker) >= length:
            opener = None
    return opener[2] if opener else None


def normalize_display_math(lines: list[str]) -> list[str]:
    """Use ``$`` and ``$$`` as the source-level math delimiters."""
    fence: str | None = None
    result: list[str] = []
    for line in lines:
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
            result.append(line)
            continue
        stripped = line.strip()
        if fence is None and stripped in {r"\[", r"\]"}:
            indent = line[: len(line) - len(line.lstrip())]
            result.append(f"{indent}$$")
            continue
        if fence is None and stripped.startswith("$$") and stripped.endswith("$$") and len(stripped) > 4:
            indent = line[: len(line) - len(line.lstrip())]
            result.extend([f"{indent}$$", stripped[2:-2].strip(), f"{indent}$$"])
            continue
        result.append(line)
    return result


def normalize_inline_math(lines: list[str]) -> list[str]:
    """Convert legacy ``\\(...\\)`` inline delimiters to dollar delimiters."""
    fence: str | None = None
    result: list[str] = []
    for line in lines:
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
        if fence is None:
            line = re.sub(r"\\\((.*?)\\\)", r"$\1$", line)
        result.append(line)
    return result


def normalize_ordered_lists(lines: list[str]) -> list[str]:
    """Write ordered-list counters explicitly, including lists split by math.

    Markdown permits every item to be written as ``1.``, but a block formula
    can close and reopen the generated ``<ol>``. Explicit counters preserve
    the visible sequence in that valid-but-split HTML structure.
    """
    next_number: dict[int, int] = {}
    fence: str | None = None
    display_math_depth = 0
    result: list[str] = []

    for line in lines:
        fence_match = FENCE.match(line)
        if fence_match:
            marker = fence_match.group("marker")[0]
            fence = None if fence == marker else marker
            result.append(line)
            continue
        if fence is not None:
            result.append(line)
            continue

        stripped = line.strip()
        if stripped == "$$":
            display_math_depth = 0 if display_math_depth else 1
            result.append(line)
            continue

        item = ORDERED_ITEM.match(line)
        if item:
            indent = len(item.group("indent").expandtabs(4))
            for level in list(next_number):
                if level > indent:
                    del next_number[level]
            source_number = int(item.group("number"))
            number = next_number.get(indent, source_number if source_number != 1 else 1)
            next_number[indent] = number + 1
            result.append(f"{item.group('indent')}{number}. {item.group('body')}")
            continue

        if stripped and display_math_depth == 0:
            indentation = len(line) - len(line.lstrip())
            if is_heading(line) or not any(indentation > level for level in next_number):
                next_number.clear()
        result.append(line)
    return result


def indent_list_continuations(lines: list[str]) -> list[str]:
    """Keep display math and explanatory text inside their ordered-list item."""
    result = lines[:]
    fence: str | None = None
    index = 0
    while index < len(result):
        line = result[index]
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
            index += 1
            continue
        item = ORDERED_ITEM.match(line) if fence is None else None
        if not item:
            index += 1
            continue

        indent = item.group("indent")
        number = int(item.group("number"))
        next_index = index + 1
        while next_index < len(result):
            candidate = ORDERED_ITEM.match(result[next_index])
            if candidate and candidate.group("indent") == indent:
                break
            if is_heading(result[next_index]):
                break
            next_index += 1
        if next_index < len(result):
            candidate = ORDERED_ITEM.match(result[next_index])
            if candidate and int(candidate.group("number")) == number + 1:
                continuation_indent = f"{indent}    "
                needs_indent = any(
                    result[continuation] and not result[continuation].startswith(continuation_indent)
                    for continuation in range(index + 1, next_index)
                )
                if needs_indent:
                    for continuation in range(index + 1, next_index):
                        if result[continuation]:
                            result[continuation] = f"{continuation_indent}{result[continuation]}"
        index += 1
    return result


def surround_display_math(lines: list[str]) -> list[str]:
    """Keep display-math delimiters in standalone Markdown blocks."""
    result: list[str] = []
    fence: str | None = None
    in_display_math = False
    for index, line in enumerate(lines):
        match = FENCE.match(line)
        if match:
            marker = match.group("marker")[0]
            fence = None if fence == marker else marker
        delimiter = fence is None and line.strip() == "$$"
        opening = delimiter and not in_display_math
        closing = delimiter and in_display_math
        if not line and fence is None and result and result[-1] == "":
            continue
        if closing:
            while result and result[-1] == "":
                result.pop()
        if opening and result and result[-1] != "":
            result.append("")
        result.append(line)
        if delimiter:
            in_display_math = not in_display_math
        if closing and index + 1 < len(lines) and lines[index + 1] != "":
            result.append("")
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
    lines = normalize_display_math(lines)
    lines = normalize_inline_math(lines)
    lines = normalize_ordered_lists(lines)
    lines = indent_list_continuations(lines)
    lines = surround_display_math(lines)
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
    malformed_fences: list[tuple[Path, int]] = []
    for path in markdown_files([Path(value) for value in args.paths]):
        original = path.read_text(encoding="utf-8")
        formatted = format_text(original, path)
        unclosed_line = unclosed_fence_line(formatted.splitlines())
        if unclosed_line is not None:
            malformed_fences.append((path, unclosed_line))
        if original == formatted:
            continue
        changed.append(path)
        if not args.check:
            path.write_text(formatted, encoding="utf-8")

    if malformed_fences:
        print("Unclosed fenced code blocks:", file=sys.stderr)
        for path, line_number in malformed_fences:
            print(f"{path}:{line_number}", file=sys.stderr)
        return 1
    if args.check and changed:
        print("Markdown formatting is required:", file=sys.stderr)
        print("\n".join(str(path) for path in changed), file=sys.stderr)
        return 1
    if not args.check:
        print(f"Formatted {len(changed)} Markdown file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
