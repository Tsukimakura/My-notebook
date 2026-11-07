"""Short request jobs: ownership, deduplication, cancellation, bounds, and expiry."""
import asyncio
import json
from pathlib import Path
import tempfile
import time
import threading
import unittest
from unittest.mock import AsyncMock, patch

from starlette.requests import Request
from starlette.testclient import TestClient

from backend.app import create_app, Limits
from backend.jobs import Job, JobStore, RESULT_TTL_SECONDS
from backend.providers import Completion, ProviderError


class JobTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "index.html").write_text("notebook")
        self.index = self.root / "index.json"
        self.index.write_text(json.dumps([{"title": "概率", "url": "/probability/", "text": "条件概率 正态分布"}]))
        self.app = create_app(self.root, self.index, "https://notes.example.com")
        self.headers = {"Origin": "https://notes.example.com", "Authorization": "Bearer test-not-a-real-key"}
        self.body = {"provider": "deepseek", "model": "test-model", "question": "请讲解正态分布"}
        self.job_id = "a" * 32

    def tearDown(self):
        self.temp.cleanup()

    def client(self):
        return TestClient(self.app, base_url="https://notes.example.com")

    def create(self, client, job_id=None, body=None, headers=None):
        return client.post("/api/jobs", headers={**self.headers, "X-Notebook-Request-ID": job_id or self.job_id, **(headers or {})}, json=body or self.body)

    def poll(self, client, job_id=None, headers=None):
        return client.post(f"/api/jobs/{job_id or self.job_id}/result", headers={**self.headers, **(headers or {})}, json={})

    def finish(self, client, job_id=None):
        for _ in range(100):
            result = self.poll(client, job_id)
            self.assertEqual(result.status_code, 200, result.text)
            if result.json()["state"] != "pending":
                return result.json()
            time.sleep(0.005)
        self.fail("job did not finish")

    def test_creation_returns_before_generation_and_polling_does_not_repeat_calls(self):
        can_finish = threading.Event()
        async def reply(*args, **kwargs):
            if args[5:] == (700,):
                return Completion("条件概率 正态分布")
            async with asyncio.timeout(2):
                while not can_finish.is_set():
                    await asyncio.sleep(0.005)
            return Completion("answer", "max_tokens")
        mock = AsyncMock(side_effect=reply)
        with self.client() as client, patch("backend.app.complete", mock):
            result = self.create(client)
            self.assertEqual(result.status_code, 202)
            first = self.poll(client)
            self.assertEqual(first.json()["state"], "pending")
            can_finish.set()
            final = self.finish(client)
            self.assertTrue(final["result"]["truncated"])
            self.assertEqual(final["result"]["answer"], "answer")
            for _ in range(10):
                self.assertEqual(self.poll(client).json(), final)
            self.assertEqual(mock.await_count, 2)
            self.assertEqual(first.headers["cache-control"], "no-store")
            self.assertNotIn("test-not-a-real-key", result.text + first.text + json.dumps(final))

    def test_same_request_id_is_idempotent_and_changed_input_is_rejected(self):
        mock = AsyncMock(side_effect=[Completion("正态"), Completion("one answer")])
        with self.client() as client, patch("backend.app.complete", mock):
            self.assertEqual(self.create(client).status_code, 202)
            self.assertEqual(self.create(client).status_code, 202)
            self.assertEqual(self.create(client, body={**self.body, "question": "different"}).status_code, 409)
            self.assertEqual(self.create(client, headers={"Authorization": "Bearer another-test-key"}).status_code, 409)
            final = self.finish(client)
            self.assertEqual(final["result"]["answer"], "one answer")
            self.assertEqual(mock.await_count, 2)

    def test_only_the_original_key_and_same_origin_can_read_or_cancel_results(self):
        mock = AsyncMock(side_effect=[Completion("正态"), Completion("private answer")])
        with self.client() as client, patch("backend.app.complete", mock):
            self.create(client)
            self.finish(client)
            other = {"Authorization": "Bearer another-test-key"}
            self.assertEqual(self.poll(client, headers=other).status_code, 404)
            self.assertEqual(client.post(f"/api/jobs/{self.job_id}/cancel", headers={**self.headers, **other}, json={}).status_code, 404)
            self.assertEqual(self.poll(client, headers={"Origin": "https://evil.example"}).status_code, 403)
            self.assertEqual(self.poll(client, headers={"Host": "evil.example"}).status_code, 403)
            self.assertEqual(self.poll(client, headers={"Sec-Fetch-Site": "cross-site"}).status_code, 403)
            self.assertNotIn("private answer", self.poll(client, headers=other).text)

    def test_failures_are_sanitized_and_finished_results_expire(self):
        for failure in (ProviderError("认证失败", 401), RuntimeError("fake-secret /internal/path")):
            with self.client() as client, patch("backend.app.complete", AsyncMock(side_effect=failure)):
                self.create(client)
                final = self.finish(client)
                self.assertEqual(final["state"], "failed")
                self.assertNotIn("fake-secret", json.dumps(final))
                self.assertNotIn("/internal/path", json.dumps(final))
                with patch("backend.jobs.RESULT_TTL_SECONDS", -1):
                    self.assertEqual(self.poll(client).status_code, 404)

    def test_active_and_result_capacity_are_bounded_and_cancelled_jobs_release_slots(self):
        async def slow(*args, **kwargs):
            await asyncio.sleep(60)
        with self.client() as client, patch("backend.app.complete", slow):
            for number in range(4):
                self.assertEqual(self.create(client, f"{number:032x}").status_code, 202)
            self.assertEqual(self.create(client, "f" * 32).status_code, 429)
            self.assertEqual(client.post(f"/api/jobs/{0:032x}/cancel", headers=self.headers, json={}).status_code, 200)
            for _ in range(100):
                result = self.create(client, "f" * 32)
                if result.status_code == 202:
                    break
                time.sleep(0.005)
            self.assertEqual(result.status_code, 202)
            self.assertEqual(self.poll(client, f"{0:032x}").json()["state"], "cancelled")
        with self.client() as client, patch("backend.app.complete", slow), patch("backend.app.MAX_JOBS", 1):
            self.assertEqual(self.create(client).status_code, 202)
            self.assertEqual(self.create(client, "b" * 32).status_code, 429)

    def test_cancel_before_task_starts_does_not_leak_a_concurrency_slot(self):
        async def exercise():
            limits = Limits()
            with patch("backend.app.Limits", return_value=limits):
                app = create_app(self.root, self.index, "https://notes.example.com")
            mock = AsyncMock(return_value=Completion("never invoked"))
            async with app.router.lifespan_context(app):
                def request(path, body, params=None):
                    async def receive():
                        return {"type": "http.request", "body": json.dumps(body).encode(), "more_body": False}
                    headers = {**self.headers, "Content-Type": "application/json", "X-Notebook-Request-ID": self.job_id}
                    return Request({"type": "http", "method": "POST", "path": path, "app": app,
                        "path_params": params or {}, "headers": [(k.lower().encode(), v.encode()) for k, v in headers.items()]}, receive)
                create = next(route.endpoint for route in app.routes if getattr(route, "path", "") == "/api/jobs")
                cancel = next(route.endpoint for route in app.routes if getattr(route, "path", "") == "/api/jobs/{job_id}/cancel")
                with patch("backend.app.complete", mock):
                    self.assertEqual((await create(request("/api/jobs", self.body))).status_code, 202)
                    self.assertEqual(limits.active, 1)
                    await cancel(request("/api/jobs/x/cancel", {}, {"job_id": self.job_id}))
                    await asyncio.sleep(0.001)
                    self.assertEqual(limits.active, 0)
                    mock.assert_not_called()
        asyncio.run(exercise())

    def test_invalid_and_oversized_creations_never_call_the_provider(self):
        with self.client() as client, patch("backend.app.complete", AsyncMock()) as mock:
            for job_id in ("", "bad/id", "A" * 32):
                result = client.post("/api/jobs", headers={**self.headers, "X-Notebook-Request-ID": job_id}, json=self.body)
                self.assertEqual(result.status_code, 400)
            result = client.post("/api/jobs", headers={**self.headers, "X-Notebook-Request-ID": self.job_id, "Content-Type": "application/json"}, content="x" * 20001)
            self.assertEqual(result.status_code, 413)
            mock.assert_not_called()

    def test_store_prunes_finished_results_without_another_model_call(self):
        store = JobStore()
        job = Job("a" * 32, "owner-hash", "request-hash", state="completed", result={"answer": "temporary"}, finished_at=time.monotonic() - RESULT_TTL_SECONDS - 1)
        store.records[job.id] = job
        self.assertIsNone(store.find(job.id, job.owner))
        self.assertEqual(store.records, {})

    def test_repeated_cancellation_cannot_extend_a_finished_record_lifetime(self):
        records = []
        def record(*args):
            job = Job(*args)
            records.append(job)
            return job
        mock = AsyncMock(side_effect=[Completion("正态"), Completion("answer")])
        with self.client() as client, patch("backend.app.complete", mock), patch("backend.app.Job", record):
            self.create(client)
            self.finish(client)
            finished_at = records[0].finished_at
            self.assertIsNotNone(finished_at)
            for _ in range(3):
                client.post(f"/api/jobs/{self.job_id}/cancel", headers=self.headers, json={})
                self.assertEqual(records[0].finished_at, finished_at)
            self.assertIsNone(records[0].result)

    def test_background_generation_has_a_deadline_even_without_a_connected_browser(self):
        async def slow(*args, **kwargs):
            await asyncio.sleep(60)
        with self.client() as client, patch("backend.app.complete", slow), patch("backend.app.STREAM_TIMEOUT_SECONDS", 0.02):
            self.assertEqual(self.create(client).status_code, 202)
            final = self.finish(client)
            self.assertEqual(final["state"], "failed")
            self.assertEqual(final["status"], 504)
            self.assertIn("等待回答超时", final["error"])
