"""Fixed destinations only. Never log credentials, prompts, or upstream errors."""
from dataclasses import dataclass
import json

import httpx

ENDPOINTS = {
    "openai": "https://api.openai.com/v1/responses",
    "deepseek": "https://api.deepseek.com/chat/completions",
    "anthropic": "https://api.anthropic.com/v1/messages",
}
from backend.continuation import MAX_ANSWER_CHARACTERS

DEFAULT_MAX_TOKENS = 32768


@dataclass(frozen=True)
class Completion:
    text: str
    # Normalized values only; never forward arbitrary upstream details.
    finish_reason: str = "stop"
    usage: dict | None = None

    @property
    def truncated(self):
        return self.finish_reason != "stop"


class ProviderError(Exception):
    def __init__(self, message, status=502):
        super().__init__(message)
        self.status = status


def supports_images(provider, model):
    return provider in ('openai', 'anthropic') or (provider == 'deepseek' and model in ('deepseek-flash', 'deepseek-v4-flash-vision-exp'))


def attachment_content(provider, prompt, attachments):
    content = [{"type": "input_text" if provider == "openai" else "text", "text": prompt}]
    for file in attachments:
        if file['kind'] != 'text':
            content.append({"type": "input_text" if provider == "openai" else "text",
                            "text": json.dumps({"attachment_name": file['name'], "kind": file['kind']}, ensure_ascii=False)})
        if file['kind'] == 'text':
            content.append({"type": "input_text" if provider == "openai" else "text",
                            "text": json.dumps({"attachment_name": file['name'], "untrusted_text": file['text']}, ensure_ascii=False)})
        elif provider == 'openai':
            data = f"data:{file['mime']};base64,{file['data']}"
            content.append({"type": "input_image", "image_url": data, "detail": "auto"} if file['kind'] == 'image'
                           else {"type": "input_file", "filename": file['name'], "file_data": data})
        elif provider == 'deepseek' and file['kind'] == 'image':
            content.append({'type': 'image_url', 'image_url': {'url': f"data:{file['mime']};base64,{file['data']}"}})
        elif provider == 'anthropic':
            content.append({"type": "image" if file['kind'] == 'image' else "document",
                            "source": {"type": "base64", "media_type": file['mime'], "data": file['data']}})
        else:
            raise ProviderError('当前 DeepSeek 接口未接入 PDF；请改用支持 PDF 的模型，或上传题目截图。', 400)
    return content


async def complete(provider, key, model, system, prompt, max_tokens=DEFAULT_MAX_TOKENS, *, reasoning=True, attachments=None, previous_answer=None):
    headers = {"Authorization": "Bearer " + key}
    content = attachment_content(provider, prompt, attachments) if attachments else prompt
    if provider == 'deepseek' and attachments and all(file['kind'] == 'text' for file in attachments):
        content = '\n\n'.join(part['text'] for part in content)
    if provider == "openai":
        body = {"model": model, "instructions": system, "input": [{"role": "user", "content": content}] if attachments else prompt,
                "max_output_tokens": max_tokens, "store": False}
    elif provider == "deepseek":
        body = {"model": model, "messages": [{"role": "system", "content": system},
                {"role": "user", "content": content}], "max_tokens": max_tokens}
        if not reasoning:
            body["thinking"] = {"type": "disabled"}
    elif provider == "anthropic":
        headers = {"x-api-key": key, "anthropic-version": "2023-06-01"}
        body = {"model": model, "system": system, "messages": [{"role": "user", "content": content}],
                "max_tokens": max_tokens}
    else:
        raise ProviderError("不支持的供应商。", 400)
    if previous_answer is not None:
        followup = "接续上一条回答。只输出后续内容；若 prompt.continuation_repair 给出了未完成区块，则从该区块起完整补写。不要重讲已完成的部分，不重新检索或改动引用编号。"
        if provider == 'openai':
            body['input'] = [{'role': 'user', 'content': content}, {'role': 'assistant', 'content': previous_answer}, {'role': 'user', 'content': followup}]
        else:
            body['messages'].extend([{'role': 'assistant', 'content': previous_answer}, {'role': 'user', 'content': followup}])
    try:
        # No environment proxy, redirects, tools, remote files, or arbitrary base URL.
        async with httpx.AsyncClient(timeout=httpx.Timeout(220, connect=10, write=30, pool=10), trust_env=False,
                                     follow_redirects=False) as client:
            async with client.stream("POST", ENDPOINTS[provider], headers=headers, json=body) as response:
                if response.status_code in (401, 403):
                    raise ProviderError("供应商拒绝认证，请检查 key、账户权限及地区支持。", 401)
                if response.status_code == 429:
                    raise ProviderError("供应商额度不足或调用过于频繁，请稍后重试。", 429)
                if attachments and response.status_code in (400, 413, 422):
                    raise ProviderError("模型未接受附件；请确认模型支持附件类型，或缩小文件后手动重试。", 400)
                if not 200 <= response.status_code < 300:
                    raise ProviderError("供应商调用失败，请检查模型 ID 和账户状态。")
                data = bytearray()
                async for chunk in response.aiter_bytes():
                    data.extend(chunk)
                    if len(data) > 4_000_000:
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
        raw_usage = result.get('usage') or {}
        usage = {}
        for name, value in [('input_tokens', raw_usage.get('input_tokens', raw_usage.get('prompt_tokens'))),
                            ('output_tokens', raw_usage.get('output_tokens', raw_usage.get('completion_tokens'))),
                            ('reasoning_tokens', (raw_usage.get('output_tokens_details') or raw_usage.get('completion_tokens_details') or {}).get('reasoning_tokens'))]:
            if type(value) is int and 0 <= value <= 1000000000:
                usage[name] = value
        if len(text) > MAX_ANSWER_CHARACTERS:
            return Completion(text[:MAX_ANSWER_CHARACTERS], "size_limit", usage)
        return Completion(text, finish_reason, usage)
    except httpx.TimeoutException:
        raise ProviderError("等待模型服务响应超时；已发出的调用仍可能产生费用，请稍后重试。", 504) from None
    except (httpx.HTTPError, ValueError, KeyError, TypeError, IndexError):
        raise ProviderError("模型服务暂时不可用，请稍后重试。") from None
