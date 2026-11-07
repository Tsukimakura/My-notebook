FROM python:3.12-slim AS build
WORKDIR /build
COPY requirements.txt requirements.lock ./
RUN pip install --no-cache-dir -r requirements.txt
COPY mkdocs.yml ./
COPY docs ./docs
COPY scripts/build_retrieval_index.py ./scripts/build_retrieval_index.py
COPY scripts/check_privacy.py ./scripts/check_privacy.py
RUN python scripts/check_privacy.py docs && mkdocs build --strict && python scripts/check_privacy.py site && python scripts/build_retrieval_index.py

FROM python:3.12-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && useradd --uid 10001 --create-home notebook
COPY backend ./backend
COPY --from=build /build/site ./site
COPY --from=build /build/build/retrieval.json ./build/retrieval.json
USER 10001:10001
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=3s --start-period=30s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=2)"
CMD ["uvicorn", "backend.app:create_app", "--factory", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--no-access-log", "--no-proxy-headers", "--no-server-header", "--limit-concurrency", "32", "--timeout-keep-alive", "5"]
