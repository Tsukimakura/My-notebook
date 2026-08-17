PYTHON ?= python3
VENV ?= .venv
MKDOCS := $(VENV)/bin/mkdocs

.PHONY: bootstrap serve build check clean

bootstrap:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/python -m pip install --upgrade pip
	$(VENV)/bin/pip install -r requirements.txt
	npm ci --ignore-scripts

serve:
	$(MKDOCS) serve

build:
	$(MKDOCS) build

check:
	$(MKDOCS) build --strict

clean:
	$(MKDOCS) clean
