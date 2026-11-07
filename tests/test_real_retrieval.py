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
