"""Exercise the actual updater with a fake Docker executable, without a daemon."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


class UpdateTests(unittest.TestCase):
    def run_update(self, previous=False, fail_health=False, fail_pull=False):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            shutil.copyfile("deploy/update.sh", root / "update.sh")
            (root / ".env").write_text("NOTEBOOK_REPOSITORY=ghcr.io/test/notebook\n")
            (root / "compose.override.yml").write_text("services: {}\n")
            (root / ".state").mkdir()
            old = "NOTEBOOK_IMAGE=ghcr.io/test/notebook@sha256:" + "a" * 64 + "\n"
            new = "NOTEBOOK_IMAGE=ghcr.io/test/notebook@sha256:" + "b" * 64 + "\n"
            if previous:
                (root / ".state/current.env").write_text(old)
            executable = root / "docker"
            executable.write_text('''#!/usr/bin/env bash
set -eu
printf '%s\\n' "$*" >> "$MOCK_ROOT/calls"
if [[ "$1" == pull ]]; then
    if [[ "$FAIL_PULL" == 1 ]]; then exit 1; fi
elif [[ "$1" == image ]]; then
    printf 'ghcr.io/test/notebook@sha256:%064d\\n' 0 | tr '0' 'b'
elif [[ "$1" == compose && "$*" == *"ps -q notebook"* ]]; then
    echo mock-container
elif [[ "$1" == inspect ]]; then
    if [[ "$FAIL_HEALTH" == 1 ]]; then echo unhealthy; else echo healthy; fi
fi
''')
            executable.chmod(0o700)
            environment = {**os.environ, "PATH": str(root) + os.pathsep + os.environ["PATH"],
                           "MOCK_ROOT": str(root), "FAIL_HEALTH": str(int(fail_health)),
                           "FAIL_PULL": str(int(fail_pull))}
            result = subprocess.run(["bash", "update.sh"], cwd=root, env=environment,
                                    text=True, capture_output=True, timeout=10)
            state = root / ".state/current.env"
            current = state.read_text() if state.exists() else None
            calls = (root / "calls").read_text()
            saved = root / ".state/previous.env"
            return result, current, calls, saved.read_text() if saved.exists() else None, old, new

    def test_success_pins_digest_and_keeps_previous(self):
        result, current, calls, previous, old, new = self.run_update(previous=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(current, new)
        self.assertEqual(previous, old)
        self.assertEqual(calls.count("up -d --no-build notebook"), 1)

    def test_failed_health_restores_previous(self):
        result, current, calls, _, old, _ = self.run_update(previous=True, fail_health=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(current, old)
        self.assertEqual(calls.count("up -d --no-build notebook"), 2)

    def test_failed_pull_leaves_current_untouched(self):
        result, current, calls, _, old, _ = self.run_update(previous=True, fail_pull=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(current, old)
        self.assertNotIn("up -d", calls)

    def test_first_failed_deployment_does_not_claim_success(self):
        result, current, _, _, _, _ = self.run_update(fail_health=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIsNone(current)


if __name__ == "__main__":
    unittest.main()
