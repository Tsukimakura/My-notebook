PYTHON ?= python3
VENV ?= .venv
PORT ?= 8000
MKDOCS := $(VENV)/bin/mkdocs
# This project pins MkDocs 1.x. Suppress only Material's 2.0 migration notice.
export NO_MKDOCS_2_WARNING := 1

.PHONY: bootstrap serve build format lint check clean ai-bootstrap ai-serve test

bootstrap:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/python -m pip install --upgrade pip
	$(VENV)/bin/pip install -r requirements.txt
	npm ci --ignore-scripts

serve:
	$(MKDOCS) serve --dev-addr 127.0.0.1:$(PORT)

build:
	$(MKDOCS) build

format:
	$(PYTHON) scripts/format_notes.py docs drafts

lint:
	$(PYTHON) scripts/format_notes.py --check docs drafts
	node scripts/check_math.mjs docs drafts
	node scripts/check_attachments.mjs docs

check: lint
	$(MKDOCS) build --strict
	$(VENV)/bin/python scripts/check_privacy.py
	$(VENV)/bin/python scripts/check_privacy.py site

clean:
	$(MKDOCS) clean

ai-bootstrap:
	$(VENV)/bin/python -m pip install -r backend/requirements.txt

ai-serve: build
	$(VENV)/bin/python scripts/build_retrieval_index.py
	PUBLIC_ORIGIN=http://127.0.0.1:$(PORT) $(VENV)/bin/uvicorn backend.app:create_app --factory --host 127.0.0.1 --port $(PORT) --workers 1 --no-access-log --no-proxy-headers --no-server-header

test:
	$(VENV)/bin/python -m unittest discover -s tests -v
	node tests/test_frontend.cjs
