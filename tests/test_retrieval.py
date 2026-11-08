"""Overview retrieval stays useful as courses grow and headings change."""
import json
from pathlib import Path
import tempfile
import unittest

from backend.retrieval import Index


class OverviewRetrievalTests(unittest.TestCase):
    query = "请总结普通物理学 II 课程目前已有的知识体系"

    def make_index(self, lessons=15, scope_heading="Assumptions and scope"):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        records = []

        def section(page, heading, text, *, anchor="", overview=False):
            title = "Homework" if "/homework/" in page else "Physics course · 普通物理学 II"
            records.append({"page_title": title,
                            "title": heading, "section": heading,
                            "url": page + anchor, "text": text, "overview": overview})

        section("/physics/", "Physics course", "Course introduction", overview=True)
        section("/physics/", "Learning route", "All course topics " * 200,
                anchor="#route", overview=True)
        section("/physics/", scope_heading, "Current scope and topics not yet covered",
                anchor="#scope", overview=True)
        for number in range(1, lessons + 1):
            page = f"/physics/{number:02d}-lesson/"
            section(page, f"Lecture {number}", "Previous · Next")
            section(page, f"{number}. Field equations", f"Lesson {number} substantive physics " * 200,
                    anchor="#equations")
            if number == 1:
                section(page, "Applicability / 适用范围", "Limits of the field approximation", anchor="#scope")
        section("/physics/homework/", "Assignments", "Homework navigation", overview=True)
        section("/physics/homework/01-assignment/", "Worked problems", "Homework solutions")
        section("/physics/assets/", "Figure sources", "Figure attribution")
        section("/physics/source-map/", "Source map", "Source inventory")
        path = Path(temporary.name) / "index.json"
        path.write_text(json.dumps(records))
        return Index(path)

    def test_overview_covers_fifteen_lessons_with_substantive_excerpts_and_scope(self):
        docs = self.make_index().search(self.query)
        self.assertEqual(len(docs), 18)
        self.assertEqual(docs[0]["section"], "Learning route")
        self.assertEqual(docs[1]["section"], "Assumptions and scope")
        for number in range(1, 16):
            with self.subTest(lesson=number):
                doc = next(d for d in docs if f"/{number:02d}-lesson/" in d["url"])
                self.assertIn(f"Lesson {number} substantive physics", doc["text"])
                self.assertTrue(doc["url"].endswith("#equations"))
        self.assertFalse(any("/homework/" in d["url"] or "/assets/" in d["url"]
                             or "/source-map/" in d["url"] for d in docs))
        self.assertLessEqual(sum(len(d["text"]) for d in docs), 24000)

    def test_scope_heading_variants_are_reserved_even_with_a_small_explicit_limit(self):
        for heading in ("Coverage boundary", "Assumptions and scope", "适用范围", "覆盖边界"):
            with self.subTest(heading=heading):
                docs = self.make_index(scope_heading=heading).search(self.query, limit=3)
                self.assertEqual(len(docs), 3)
                self.assertEqual(docs[1]["section"], heading)
                self.assertTrue(any("/01-lesson/" in d["url"] for d in docs))

    def test_large_course_remains_bounded(self):
        docs = self.make_index(lessons=40).search(self.query)
        self.assertEqual(len(docs), 32)
        self.assertLessEqual(sum(len(d["text"]) for d in docs), 24000)
        self.assertEqual(len({d["url"] for d in docs}), len(docs))
        self.assertTrue(any(d["section"] == "Assumptions and scope" for d in docs))

    def test_strict_scope_can_still_select_auxiliary_homework_pages(self):
        index = self.make_index()
        folder = next(f for f in index.catalog()["folders"] if f["path"] == "/physics/homework/")
        docs = index.search("总结", scope={"ids": [folder["id"]], "mode": "strict"})
        self.assertEqual({d["page"] for d in docs},
                         {"/physics/homework/", "/physics/homework/01-assignment/"})
        self.assertTrue(all(not d["outside_scope"] for d in docs))

    def test_topical_search_keeps_its_default_result_limit(self):
        docs = self.make_index(lessons=40).search("substantive physics")
        self.assertEqual(len(docs), 12)

    def test_selected_lesson_keeps_its_own_applicability_section(self):
        index = self.make_index()
        page = next(p for p in index.catalog()["pages"] if p["path"] == "/physics/01-lesson/")
        docs = index.search("总结", scope={"ids": [page["id"]], "mode": "strict"})
        self.assertEqual({d["url"] for d in docs},
                         {"/physics/01-lesson/#equations", "/physics/01-lesson/#scope"})


if __name__ == "__main__":
    unittest.main()
