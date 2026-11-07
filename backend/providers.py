"""Fixed destinations only. Never log credentials, prompts, or upstream errors."""
from dataclasses import dataclass
import json

import httpx

ENDPOINTS = {
    "openai": "https://api.openai.com/v1/responses",
    "deepseek": "https://api.deepseek.com/chat/completions",
    "anthropic": "https://api.anthropic.com/v1/messages",
}
MAX_ANSWER_CHARACTERS = 64000


@dataclass(frozen=True)
class Completion:
    text: str
    # Normalized values only; never forward arbitrary upstream details.
    finish_reason: str = "stop"

    @property
    def truncated(self):
        return self.finish_reason != "stop"


class ProviderError(Exception):
    def __init__(self, message, status=502):
        super().__init__(message)
        self.status = status


async def complete(provider, key, model, system, prompt, max_tokens=8192, *, reasoning=True):
    headers = {"Authorization": "Bearer " + key}
    if provider == "openai":
        body = {"model": model, "instructions": system, "input": prompt,
                "max_output_tokens": max_tokens, "store": False}
    elif provider == "deepseek":
        body = {"model": model, "messages": [{"role": "system", "content": system},
                {"role": "user", "content": prompt}], "max_tokens": max_tokens}
        if not reasoning:
            body["thinking"] = {"type": "disabled"}
    elif provider == "anthropic":
        headers = {"x-api-key": key, "anthropic-version": "2023-06-01"}
        body = {"model": model, "system": system, "messages": [{"role": "user", "content": prompt}],
                "max_tokens": max_tokens}
    else:
        raise ProviderError("不支持的供应商。", 400)
    try:
        # No environment proxy, redirects, tools, remote files, or arbitrary base URL.
        async with httpx.AsyncClient(timeout=httpx.Timeout(180, connect=10, write=30, pool=10), trust_env=False,
                                     follow_redirects=False) as client:
            async with client.stream("POST", ENDPOINTS[provider], headers=headers, json=body) as response:
                if response.status_code in (401, 403):
                    raise ProviderError("供应商拒绝认证，请检查 key、账户权限及地区支持。", 401)
                if response.status_code == 429:
                    raise ProviderError("供应商额度不足或调用过于频繁，请稍后重试。", 429)
                if not 200 <= response.status_code < 300:
                    raise ProviderError("供应商调用失败，请检查模型 ID 和账户状态。")
                data = bytearray()
                async for chunk in response.aiter_bytes():
                    data.extend(chunk)
                    if len(data) > 1_000_000:
                        raise ProviderError("供应商响应超过大小限制。")
        result = json.loads(data)
        finish_reason = "incomplete"
        if provider == "openai":
            text = "\n".join(part["text"] for item in result.get("output", [])
                             if item.get("type") == "message" for part in item.get("content", [])
                             if part.get("type") == "output_text")
            if result.get("status") == "completed":
                finish_reason = "stop"
            elif (result.get("status") == "incomplete"
                  and (result.get("incomplete_details") or {}).get("reason") == "max_output_tokens"):
                finish_reason = "max_tokens"
        elif provider == "anthropic":
            text = "\n".join(part["text"] for part in result["content"] if part.get("type") == "text")
            if result.get("stop_reason") in ("end_turn", "stop_sequence"):
                finish_reason = "stop"
            elif result.get("stop_reason") == "max_tokens":
                finish_reason = "max_tokens"
        else:
            choice = result["choices"][0]
            text = choice["message"]["content"]
            if choice.get("finish_reason") == "stop":
                finish_reason = "stop"
            elif choice.get("finish_reason") == "length":
                finish_reason = "max_tokens"
        if not isinstance(text, str) or not text.strip():
            if finish_reason == "max_tokens":
                raise ProviderError("模型已用尽输出预算，但尚未返回正文。请缩小问题范围；本次调用仍可能产生费用。")
            raise ProviderError("模型未返回文字，请尝试其他模型或更短的问题。")
        if len(text) > MAX_ANSWER_CHARACTERS:
            return Completion(text[:MAX_ANSWER_CHARACTERS], "size_limit")
        return Completion(text, finish_reason)
    except httpx.TimeoutException:
        raise ProviderError("等待模型服务响应超时；已发出的调用仍可能产生费用，请稍后重试。", 504) from None
    except (httpx.HTTPError, ValueError, KeyError, TypeError, IndexError):
        raise ProviderError("模型服务暂时不可用，请稍后重试。") from None
