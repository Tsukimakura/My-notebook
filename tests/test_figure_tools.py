"""Optional authoring tools: run with a Python that has Matplotlib and Pillow."""
import importlib.util
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

from scripts.figure_tools import arrow, box, canvas, label, save_figure


class FigureValidationTests(unittest.TestCase):
    def test_invalid_exports_do_not_create_directories(self):
        with TemporaryDirectory() as temporary:
            parent = Path(temporary) / "not-created"
            for path, options in ((parent / "bad.pdf", {}), (parent / "bad.svg", {"dpi": float("nan")}),
                                  (parent / "bad.png", {"quality": 101})):
                with self.subTest(path=path, options=options):
                    with self.assertRaises(ValueError):
                        save_figure(None, path, **options)
            self.assertFalse(parent.exists())

    def test_import_does_not_load_optional_dependencies(self):
        result = subprocess.run([sys.executable, "-c", "import sys; import scripts.figure_tools; "
                                 "assert 'matplotlib' not in sys.modules; assert 'PIL' not in sys.modules"],
                                cwd=Path(__file__).resolve().parents[1], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)


@unittest.skipUnless(importlib.util.find_spec("matplotlib") and importlib.util.find_spec("PIL"),
                     "Optional Matplotlib and Pillow authoring dependencies are not installed")
class FigureExportTests(unittest.TestCase):
    def test_independent_canvases_and_multi_format_exports(self):
        import matplotlib
        from PIL import Image

        original = dict(matplotlib.rcParams)
        fig, ax = canvas(figsize=(6, 3), title="Workflow", xlim=(0, 8), ylim=(0, 4))
        other, other_ax = canvas()
        box(ax, (2, 2), "Input")
        box(ax, (6, 2), "Output")
        arrow(ax, (3.4, 2), (4.6, 2), text="Transform", text_options={"color": "black"})
        label(ax, (4, .5), "Generic example", font_family="sans-serif")
        self.assertEqual(len(other_ax.patches), 0)
        self.assertIsNot(other, fig)
        with TemporaryDirectory() as temporary:
            root = Path(temporary) / "figures"
            for suffix in (".svg", ".png", ".webp"):
                path = root / ("workflow" + suffix)
                self.assertEqual(save_figure(fig, path), path)
            self.assertEqual(sorted(p.name for p in root.iterdir()), ["workflow.png", "workflow.svg", "workflow.webp"])
            svg = (root / "workflow.svg").read_text()
            self.assertIn("<text", svg)
            self.assertIn("Input", svg)
            self.assertIn("Output", svg)
            with Image.open(root / "workflow.png") as png, Image.open(root / "workflow.webp") as webp:
                self.assertEqual(png.size, webp.size)
                self.assertGreater(png.width, png.height)
                self.assertEqual(webp.format, "WEBP")
        self.assertEqual(dict(matplotlib.rcParams), original)


if __name__ == "__main__":
    unittest.main()
