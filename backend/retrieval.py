"""Small bilingual BM25 index; no model, vector service, or writable database."""
from collections import Counter, defaultdict
import json
import math
from pathlib import Path
import re


def tokens(text):
    result = re.findall(r"[a-z0-9_]+", text.lower())
    for run in re.findall(r"[\u3400-\u9fff]+", text):
        result.extend(run)
        result.extend(run[i:i + 2] for i in range(len(run) - 1))
    return result


class Index:
    def __init__(self, path):
        self.docs = json.loads(Path(path).read_text(encoding="utf-8"))
        self.postings = defaultdict(list)
        self.lengths = []
        self.title_terms = []
        for i, doc in enumerate(self.docs):
            counts = Counter(tokens(doc["title"] + " " + doc["text"]))
            self.title_terms.append(set(tokens(doc["title"])))
            self.lengths.append(sum(counts.values()))
            for term, count in counts.items():
                self.postings[term].append((i, count))
        self.average = sum(self.lengths) / max(1, len(self.docs))

    def search(self, query, limit=6):
        scores = defaultdict(float)
        for term in set(tokens(query)):
            entries = self.postings.get(term, [])
            idf = math.log(1 + (len(self.docs) - len(entries) + .5) / (len(entries) + .5))
            # Single Chinese characters improve recall, but longer terms carry more meaning.
            weight = .15 if len(term) == 1 and ord(term) > 127 else 1
            for i, frequency in entries:
                denominator = frequency + 1.2 * (.25 + .75 * self.lengths[i] / max(1, self.average))
                title_boost = 1.6 if term in self.title_terms[i] else 1
                overview_weight = .35 if self.docs[i].get("overview") else 1
                scores[i] += weight * idf * frequency * 2.2 / denominator * title_boost * overview_weight
        found, seen = [], set()
        for i in sorted(scores, key=scores.get, reverse=True):
            doc = self.docs[i]
            if doc["url"] not in seen:
                found.append(doc)
                seen.add(doc["url"])
            if len(found) == limit:
                break
        return found
