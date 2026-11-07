"""Bounded, short-lived job results in RAM only. No credentials are stored here."""
import asyncio
from dataclasses import dataclass
import secrets
import time

RESULT_TTL_SECONDS = 120
MAX_JOBS = 64


@dataclass
class Job:
    id: str
    owner: str
    fingerprint: str
    state: str = "pending"
    stage: str = "retrieval"
    result: dict | None = None
    error: str = ""
    status: int = 200
    finished_at: float | None = None
    task: asyncio.Task | None = None

    def snapshot(self):
        data = {"job_id": self.id, "state": self.state, "stage": self.stage}
        if self.state == "completed":
            data["result"] = self.result
        elif self.state in ("failed", "cancelled"):
            data.update(error=self.error, status=self.status)
        return data


class JobStore:
    def __init__(self):
        self.records = {}

    def prune(self):
        now = time.monotonic()
        for job_id, job in list(self.records.items()):
            if job.finished_at is not None and now - job.finished_at >= RESULT_TTL_SECONDS:
                del self.records[job_id]

    def find(self, job_id, owner):
        self.prune()
        job = self.records.get(job_id)
        return job if job is not None and secrets.compare_digest(job.owner, owner) else None

    async def close(self):
        tasks = [job.task for job in self.records.values() if job.task is not None]
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        self.records.clear()
