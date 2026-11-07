from pathlib import Path
import tempfile
import unittest

from scripts.check_privacy import inspect


class PrivacyGuardTests(unittest.TestCase):
    def test_blocks_credential_and_private_files(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / ".env"
            path.write_text("API_KEY=" + "sk-" + "a" * 40)
            self.assertEqual(set(inspect(path)), {"private-file", "provider-token"})
            template = Path(temp) / ".env.example"
            template.write_text("PUBLIC_ORIGIN=https://notes.example.com\n")
            self.assertEqual(inspect(template), [])

    def test_blocks_private_provenance_but_allows_course_names(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "docs" / "note.md"
            path.parent.mkdir()
            path.write_text("source: " + "course_" + "123_sub_456")
            self.assertIn("internal-course-directory", inspect(path))
            path.write_text("source: 课程资料/人工智能引论/lecture-record-01\n")
            self.assertEqual(inspect(path), [])
