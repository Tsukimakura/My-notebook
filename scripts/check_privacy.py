#!/usr/bin/env python3
"""Fail a release on credential-shaped text or private files; never print values.

With no arguments, inspect tracked working-tree files. Path arguments inspect a
build input/output directory instead. Binary contents and visual image content
require separate review; this guard is not a guarantee that all PII is detected.
"""
from pathlib import Path
import re
import subprocess
import sys

SECRET_PATTERNS = {
    "private-key": re.compile(rb"-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----"),
    "provider-token": re.compile(rb"(?<![A-Za-z0-9])(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|LTAI[A-Za-z0-9]{12,}|xox[baprs]-[A-Za-z0-9-]{16,})"),
}
PRIVATE_SUFFIXES = {".pem", ".key", ".p12", ".pfx"}
TEXT_SUFFIXES = {".md", ".txt", ".json", ".html", ".svg", ".js", ".mjs", ".cjs", ".py", ".css", ".yml", ".yaml", ".sh", ".example", ".service", ".timer", ".lock", ".c"}
SOURCE_MARKERS = {
    "private-source-directory": re.compile(r"~/(?:aid-docs|GP-docs)/"),
    "internal-course-directory": re.compile(r"course_\d+_sub_\d+"),
    "shared-conversation": re.compile(r"https://(?:chatgpt\.com/share|chat\.openai\.com/share|claude\.ai/share)/"),
}


def inspect(path):
    issues = []
    name = path.name.lower()
    if ((name == ".env" or name.startswith(".env.")) and name != ".env.example"
            or path.suffix.lower() in PRIVATE_SUFFIXES
            or name in {"credentials.json", "id_rsa", "id_ed25519", "id_ecdsa"}
            or name.startswith("secrets.")):
        issues.append("private-file")
    if path.suffix.lower() not in TEXT_SUFFIXES and path.suffix:
        return issues
    content = path.read_bytes()
    for label, pattern in SECRET_PATTERNS.items():
        if pattern.search(content):
            issues.append(label)
    if "docs" in path.parts or "site" in path.parts:
        text = content.decode("utf-8", errors="replace")
        for label, pattern in SOURCE_MARKERS.items():
            if pattern.search(text):
                issues.append(label)
    return issues


def main(args):
    if args:
        paths = [p for arg in args for p in Path(arg).rglob("*") if p.is_file()]
    else:
        names = subprocess.check_output(["git", "ls-files", "-z"]).decode().split("\0")
        paths = [Path(name) for name in names if name and Path(name).is_file()]
    failed = False
    for path in paths:
        for issue in inspect(path):
            print(f"{path}: {issue} (value withheld)", file=sys.stderr)
            failed = True
    print(f"Privacy guard checked {len(paths)} files.")
    return int(failed)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
