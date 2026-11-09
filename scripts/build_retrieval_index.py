#!/usr/bin/env python3
"""Index only the built site's public search records, with MkDocs' exact anchors."""
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit, urljoin, quote


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


class SectionImages(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page, self.section, self.images = page, '', {}
        self.in_article = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article' and 'md-content__inner' in attrs.get('class', '').split():
            self.in_article = True
        if not self.in_article:
            return
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.section = '' if tag == 'h1' else attrs.get('id', '')
        if tag == 'img':
            url = urljoin('/' + self.page, attrs.get('src', ''))
            parsed = urlsplit(url)
            if (parsed.scheme or parsed.netloc or parsed.query or parsed.fragment or '\\' in url
                    or Path(unquote(parsed.path)).suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp')):
                return
            url = quote(unquote(parsed.path), safe='/')
            records = self.images.setdefault(self.section, [])
            if len(records) < 4 and not any(record['url'] == url for record in records):
                records.append({'url': url, 'alt': attrs.get('alt', '')[:300]})

    def handle_endtag(self, tag):
        if tag == 'article':
            self.in_article = False


def build(source, destination):
    docs = []
    images = {}
    site = Path(source).parent.parent
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
        if page not in images:
            path = site / unquote(urlsplit(page).path)
            if path.is_dir():
                path /= 'index.html'
            image_parser = SectionImages(page)
            if path.is_file() and path.resolve().is_relative_to(site.resolve()):
                html = path.read_text(encoding='utf-8')
                # The repeated navigation is much larger than many notes; parse only the article.
                start = html.find('<article')
                end = html.find('</article>', start)
                image_parser.feed(html[start:end + 10] if start >= 0 and end >= 0 else html)
            images[page] = image_parser.images
        page_title = page_titles.get(page, entry["title"])
        title = entry["title"] if page_title == entry["title"] else page_title + " · " + entry["title"]
        overview = (Path("docs") / unquote(parsed.path) / "index.md").is_file()
        for offset in range(0, len(text), 1800):
            docs.append({"title": title, "section": entry["title"], "page_title": page_title,
                         "overview": overview, "url": "/" + location,
                         "text": text[offset:offset + 2000], "images": images[page].get(unquote(parsed.fragment), [])})
    Path(destination).parent.mkdir(parents=True, exist_ok=True)
    Path(destination).write_text(json.dumps(docs, ensure_ascii=False), encoding="utf-8")
    print(f"Indexed {len(docs)} public sections/chunks")


if __name__ == "__main__":
    build(*(sys.argv[1:] or ["site/search/search_index.json", "build/retrieval.json"]))
