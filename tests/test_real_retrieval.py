"""Regression questions against the built notebook, including exact source anchors."""
from pathlib import Path
import unittest
from urllib.parse import unquote, urlsplit

from backend.retrieval import Index


@unittest.skipUnless(Path("build/retrieval.json").exists(), "Build the website and retrieval index first")
class RealNotebookTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = Index("build/retrieval.json")

    def test_combined_normal_question_covers_both_dimensions(self):
        docs = self.index.search("请结合一维正态分布，详细讲解二维正态分布")
        self.assertTrue(any("ch02/03-continuous-distributions" in d["url"] and "正态分布" in d["title"] for d in docs))
        self.assertTrue(any("ch03/04-bivariate-normal" in d["url"] for d in docs))

    def test_course_overview_covers_all_existing_classes_and_scope(self):
        docs = self.index.search("请总结普通物理学 II 课程目前已有的知识体系")
        course = Path("docs/数理基础/general-physics-ii")
        lessons = sorted(p.stem for p in course.glob("[0-9][0-9]-*.md"))
        self.assertTrue(lessons)
        for lesson in lessons:
            with self.subTest(lesson=lesson):
                self.assertTrue(any(f"/{lesson}/" in d["url"] for d in docs))
        index_text = (course / "index.md").read_text()
        scope_heading = next(line[3:] for line in index_text.splitlines()
                             if line.startswith("## ") and "scope" in line.casefold())
        self.assertTrue(all("general-physics-ii/" in d["url"] for d in docs))
        self.assertTrue(any(d.get("section") == scope_heading for d in docs))
        self.assertFalse(any(any(f"/{folder}/" in d["url"] for folder in ("assets", "source-map", "homework")) for d in docs))
        self.assertLessEqual(len(docs), 32)
        self.assertLessEqual(sum(len(d["text"]) for d in docs), 24000)

    def test_selecting_course_folder_includes_its_landing_page(self):
        folder = next(f for f in self.index.catalog()["folders"] if f["path"].endswith("/general-physics-ii/"))
        docs = self.index.search("总结", scope={"ids": [folder["id"]], "mode": "strict"})
        self.assertTrue(any(d["overview"] for d in docs))
        self.assertTrue(all("general-physics-ii/" in d["url"] for d in docs))

    def test_selected_page_and_section_scopes_are_enforced(self):
        catalog = self.index.catalog()
        page = next(p for p in catalog["pages"] if "ch02/03-continuous-distributions/" in p["path"])
        scope = {"ids": [page["id"]], "mode": "strict"}
        docs = self.index.search("二维正态分布 standardization", scope=scope)
        self.assertTrue(docs)
        self.assertTrue(all("ch02/03-continuous-distributions/" in d["url"] for d in docs))
        section = self.index.catalog(page["id"])[0]
        docs = self.index.search("总结", scope={"ids": [section["id"]], "mode": "strict"})
        self.assertTrue(all(d["url"] == section["url"] for d in docs))
        with self.assertRaises(ValueError):
            self.index.search("test", scope={"ids": ["../../.env"], "mode": "strict"})

    def test_real_topics_and_resolvable_citations(self):
        cases = [
            ("条件概率 独立性 conditional probability independence", "probability-and-mathematical-statistics"),
            ("AVL 树 旋转 rotations", "lecture-01-avl"),
            ("流水线 数据冒险 pipeline hazards", "20-pipelining"),
            ("MCTS 蒙特卡洛树搜索", "11-monte-carlo-tree-search"),
            ("高斯定律 电场 Gauss law electric field", "02-continuous-charge-and-gauss-law"),
        ]
        for query, expected in cases:
            with self.subTest(query=query):
                docs = self.index.search(query)
                self.assertTrue(any(expected in d["url"] for d in docs))
                for doc in docs:
                    parts = urlsplit(doc["url"])
                    file = Path("site") / unquote(parts.path).lstrip("/")
                    if file.is_dir():
                        file /= "index.html"
                    self.assertTrue(file.is_file(), doc["url"])
                    if parts.fragment:
                        self.assertIn('id="' + unquote(parts.fragment) + '"', file.read_text())


if __name__ == "__main__":
    unittest.main()
