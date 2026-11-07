#!/usr/bin/env python3
"""Index only the built site's public search records, with MkDocs' exact anchors."""
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def build(source, destination):
    docs = []
    entries = json.loads(Path(source).read_text(encoding="utf-8"))["docs"]
    page_titles = {e["location"]: e["title"] for e in entries if "#" not in e["location"]}
    for entry in entries:
        location = entry["location"]
        parsed = urlsplit(location)
        if parsed.scheme or parsed.netloc or location.startswith(("/", "\\")) or ".." in parsed.path.split("/"):
            raise ValueError("Search record is not a local public page")
        parser = PlainText()
        parser.feed(entry["text"])
        text = " ".join(parser.parts).strip()
        if not text:
            continue
        page = location.split("#")[0]
        page_title = page_titles.get(page, entry["title"])
        title = entry["title"] if page_title == entry["title"] else page_title + " · " + entry["title"]
        overview = (Path("docs") / unquote(parsed.path) / "index.md").is_file()
        for offset in range(0, len(text), 1800):
            docs.append({"title": title, "section": entry["title"], "page_title": page_title,
                         "overview": overview, "url": "/" + location,
                         "text": text[offset:offset + 2000]})
    Path(destination).parent.mkdir(parents=True, exist_ok=True)
    Path(destination).write_text(json.dumps(docs, ensure_ascii=False), encoding="utf-8")
    print(f"Indexed {len(docs)} public sections/chunks")


if __name__ == "__main__":
    build(*(sys.argv[1:] or ["site/search/search_index.json", "build/retrieval.json"]))
