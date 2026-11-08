"""Bounded bilingual retrieval with topic coverage and public-note scopes."""
from collections import Counter, defaultdict
import hashlib
import json
import math
from pathlib import Path
import re
from urllib.parse import unquote


def tokens(text):
    result = re.findall(r"[a-z0-9_]+", text.lower())
    for run in re.findall(r"[\u3400-\u9fff]+", text):
        result.extend(run)
        result.extend(run[i:i + 2] for i in range(len(run) - 1))
    return result


def identifier(value):
    return hashlib.sha256(value.encode()).hexdigest()[:24]


def normalized(value):
    return re.sub(r"[\W_]+", "", value.casefold().replace("Ⅱ", "II"))


class Index:
    def __init__(self, path):
        self.docs = json.loads(Path(path).read_text(encoding="utf-8"))
        self.pages, self.scopes, self.groups = {}, {}, {}
        for i, doc in enumerate(self.docs):
            page = doc["url"].split("#")[0]
            doc["page"] = page
            self.pages.setdefault(page, {"id": identifier(page), "title": doc.get("page_title", doc["title"]),
                                         "path": unquote(page), "sections": {}})
            self.pages[page]["sections"].setdefault(doc["url"], {
                "id": identifier(doc["url"] + "#section"), "title": doc.get("section", doc["title"]), "url": doc["url"]})
            self.scopes.setdefault(identifier(page), set()).add(i)
            self.scopes.setdefault(identifier(doc["url"] + "#section"), set()).add(i)
            parts = page.strip("/").split("/")
            # MkDocs page URLs end in a slash; all ancestors are selectable folders.
            for depth in range(1, len(parts)):
                folder = "/" + "/".join(parts[:depth]) + "/"
                key = identifier("folder:" + folder)
                self.scopes.setdefault(key, set()).add(i)
                self.groups.setdefault(folder, {"id": key, "path": unquote(folder), "title": unquote(parts[depth - 1])})
        # Directory landing-page titles supply bilingual course names to child pages.
        self.course_titles = {d["page"]: d.get("page_title", d["title"]) for d in self.docs if d.get("overview")}
        for folder, group in self.groups.items():
            self.scopes[group["id"]].update(i for i, doc in enumerate(self.docs) if doc["page"] == folder)
            group["title"] = self.course_titles.get(folder, group["title"])
        self.postings = defaultdict(list)
        self.lengths, self.title_terms, self.terms = [], [], []
        for i, doc in enumerate(self.docs):
            parents = " ".join(title for folder, title in self.course_titles.items() if doc["page"].startswith(folder))
            counts = Counter(tokens(doc["title"] + " " + parents + " " + doc["text"]))
            self.title_terms.append(set(tokens(doc["title"])))
            self.terms.append(set(counts))
            self.lengths.append(sum(counts.values()))
            for term, count in counts.items():
                self.postings[term].append((i, count))
        self.average = sum(self.lengths) / max(1, len(self.docs))

    def catalog(self, page_id=None):
        if page_id is not None:
            page = next((p for p in self.pages.values() if p["id"] == page_id), None)
            return list(page["sections"].values()) if page else None
        return {"folders": list(self.groups.values()), "pages": [
            {k: v for k, v in page.items() if k != "sections"} for page in self.pages.values()]}

    def validate_scope(self, scope):
        if not isinstance(scope, dict) or set(scope) - {"ids", "mode"}:
            raise ValueError
        ids, mode = scope.get("ids", []), scope.get("mode", "prefer")
        if (not isinstance(ids, list) or len(ids) > 100 or mode not in ("strict", "prefer")
                or any(not isinstance(key, str) or key not in self.scopes for key in ids)):
            raise ValueError
        return {"ids": list(dict.fromkeys(ids)), "mode": mode}

    def rank(self, query, allowed=None, overview=False):
        scores = defaultdict(float)
        for term in set(tokens(query)):
            entries = self.postings.get(term, [])
            idf = math.log(1 + (len(self.docs) - len(entries) + .5) / (len(entries) + .5))
            weight = .15 if len(term) == 1 and ord(term) > 127 else 1
            for i, frequency in entries:
                if allowed is not None and i not in allowed:
                    continue
                denominator = frequency + 1.2 * (.25 + .75 * self.lengths[i] / max(1, self.average))
                title_boost = 1.6 if term in self.title_terms[i] else 1
                scores[i] += weight * idf * frequency * 2.2 / denominator * title_boost
        clean = normalized(query)
        for i in scores:
            section = re.split(r"[（(]", self.docs[i].get("section", self.docs[i]["title"]))[0]
            if len(clean) >= 3 and normalized(section) == clean:
                scores[i] += 30
            if self.docs[i].get("overview") and not overview:
                scores[i] *= .7
        meaningful = {t for t in tokens(query) if len(t) > 1}
        if meaningful:
            scores = {i: score for i, score in scores.items() if any(
                term in self.terms[i] for term in meaningful)}
        threshold = max(scores.values(), default=0) * .25
        return sorted((i for i in scores if scores[i] >= threshold), key=lambda i: (-scores[i], i))

    def search(self, query, limit=12, *, expanded="", scope=None):
        return self.retrieve(query, limit, expanded=expanded, scope=scope)[0]

    def retrieve(self, query, limit=12, *, expanded="", scope=None):
        scope = self.validate_scope(scope or {})
        selected = set().union(*(self.scopes[key] for key in scope["ids"])) if scope["ids"] else None
        overview = bool(re.search(r"总结|知识体系|知识框架|学习路线|概览|综述|overview|summari[sz]|syllabus", query, re.I))
        course = None
        for folder, title in sorted(self.course_titles.items(), key=lambda item: -len(item[0])):
            if any(len(normalized(alias)) >= 4 and normalized(alias) in normalized(query)
                   for alias in re.split(r"[·|]", title)):
                course = {i for i, doc in enumerate(self.docs) if doc["page"].startswith(folder)}
                break
        allowed = selected if selected is not None else course
        queries = [query]
        # Keep separate concepts separate: one long query otherwise crowds out prerequisites.
        for part in re.split(r"结合|对比|比较|以及|与|和|，|、|versus|\bvs\b", query, flags=re.I):
            part = re.sub(r"^(?:请|详细|简单|讲解|解释|介绍|分析|一下|说明)+", "", part).strip(" ，。？?")
            if len(part) >= 3:
                queries.append(part)
                # Univariate notes commonly use the unqualified concept heading.
                if part.startswith("一维"):
                    queries.append(part[2:])
        try:
            plan = json.loads(expanded)
            additions = plan.get("queries", []) if isinstance(plan, dict) else []
            queries.extend(q[:200] for q in additions[:4] if isinstance(q, str) and q.strip())
        except (ValueError, TypeError):
            if expanded.strip():
                queries.extend(expanded[:1000].splitlines()[:4])
        queries = list(dict.fromkeys(queries))[:8]
        found, urls, per_page = [], set(), Counter()
        budget = 24000

        def add(i, cap=2, size=2000):
            nonlocal budget
            doc = self.docs[i]
            if doc["url"] in urls or per_page[doc["page"]] >= cap or len(found) >= limit or budget < 300:
                return False
            text = doc["text"][:min(size, budget)]
            found.append({**doc, "text": text})
            urls.add(doc["url"])
            per_page[doc["page"]] += 1
            budget -= len(text)
            return True

        if overview and allowed is not None:
            # Cover each content page before taking extra excerpts from any one page.
            pages = defaultdict(list)
            for i in sorted(allowed):
                pages[self.docs[i]["page"]].append(i)
            def auxiliary(page):
                return bool(re.search(r"/(?:assets|source-map|references)(?:/|$)", page))
            if selected is None and any(not auxiliary(p) for p in pages):
                pages = {p: ids for p, ids in pages.items() if not auxiliary(p)}
            ordered = sorted(pages, key=lambda p: (auxiliary(p), not any(self.docs[i].get("overview") for i in pages[p]), p))
            for page in ordered:
                indices = pages[page]
                preferred = sorted(indices, key=lambda i: (
                    not bool(re.search(r"Main results|核心结论|Learning route|Coverage boundary|知识体系|学习路线", self.docs[i].get("section", ""), re.I)),
                    "#" in self.docs[i]["url"], i))
                add(preferred[0], cap=2, size=1500)
            for page in ordered:
                for i in pages[page]:
                    if re.search(r"Coverage boundary|The central idea|适用|范围", self.docs[i].get("section", ""), re.I):
                        add(i, size=1200)
        else:
            rankings = [self.rank(q, allowed, overview) for q in queries]
            # Reserve one result per subtopic before filling from the combined ranking.
            for ranking in rankings[1:] + rankings[:1]:
                for i in ranking:
                    if add(i):
                        break
            fused = defaultdict(float)
            for ranking in rankings:
                for position, i in enumerate(ranking[:30]):
                    fused[i] += 1 / (60 + position)
            for i in sorted(fused, key=lambda i: (-fused[i], i)):
                add(i)
        if selected is not None and not found:
            for i in sorted(selected):
                add(i)
        if selected is not None and scope["mode"] == "prefer" and len(found) < limit:
            # Keep at least two thirds of the excerpt budget inside the selected notes.
            extra = 0
            for i in self.rank(query + " " + expanded[:1000], overview=overview):
                if i not in selected and extra < max(1, limit // 3) and add(i):
                    extra += 1
        relevant_pages = {self.docs[i]["page"] for i in allowed} if allowed is not None else set()
        coverage = {"pages": len({d["page"] for d in found}), "scope_pages": len(relevant_pages),
                    "overview": overview}
        # Explicit provenance, without accepting arbitrary paths from the client.
        for doc in found:
            doc["outside_scope"] = selected is not None and not any(
                self.docs[i]["url"] == doc["url"] for i in selected)
        coverage["outside"] = sum(d["outside_scope"] for d in found)
        return found, coverage
