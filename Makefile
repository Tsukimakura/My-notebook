PYTHON ?= python3
VENV ?= .venv
MKDOCS := $(VENV)/bin/mkdocs

.PHONY: bootstrap serve build format lint check clean

bootstrap:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/python -m pip install --upgrade pip
	$(VENV)/bin/pip install -r requirements.txt
	npm ci --ignore-scripts

serve:
	$(MKDOCS) serve

build:
	$(MKDOCS) build

format:
	$(PYTHON) scripts/format_notes.py docs drafts

lint:
	$(PYTHON) scripts/format_notes.py --check docs drafts

check: lint
	$(MKDOCS) build --strict

clean:
	$(MKDOCS) clean
