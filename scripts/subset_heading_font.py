#!/usr/bin/env python3
"""Optional font maintenance: python3 scripts/subset_heading_font.py INPUT.ttc.

Requires fontTools + brotli, only when regenerating the checked-in WOFF2.
The site and Docker build do not need these tools or the original font.
"""
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

source = sys.argv[1]
characters = set(chr(i) for i in range(32, 592))
for path in Path("docs").rglob("*.md"):
    characters.update(path.read_text(encoding="utf-8"))
characters.update("午后书房学科课程浏览笔记问学习思考参考资料设置记忆")
font = TTFont(source, fontNumber=2 if source.endswith(".ttc") else -1, recalcTimestamp=False)
options = subset.Options()
options.flavor = "woff2"
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
worker = subset.Subsetter(options=options)
worker.populate(text="".join(sorted(characters)))
worker.subset(font)
for name in font["name"].names:
    replacement = {1: "Notebook Serif", 3: "NotebookSerif-Regular", 4: "Notebook Serif Regular", 6: "NotebookSerif-Regular"}.get(name.nameID)
    if replacement:
        name.string = replacement.encode(name.getEncoding())
font.flavor = "woff2"
font.save("docs/assets/fonts/notebook-serif.woff2")
print("Saved local heading font subset")
