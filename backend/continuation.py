"""Authenticated answer context; no credentials, uploads, or hidden reasoning."""
import base64
import hashlib
import hmac
import json
import re

MAX_ANSWER_CHARACTERS = 262144
MAX_TOKEN_CHARACTERS = 600000


def seal_context(secret, key, provider, model, prompt):
    payload = json.dumps({'provider': provider, 'model': model, 'prompt': prompt}, ensure_ascii=False, separators=(',', ':')).encode()
    encoded = base64.urlsafe_b64encode(payload).decode()
    if len(encoded) > MAX_TOKEN_CHARACTERS:
        return ''
    signature = hmac.new(secret, key.encode() + b'\0' + encoded.encode(), hashlib.sha256).hexdigest()
    return encoded + '.' + signature


def open_context(secret, key, provider, model, token):
    if not isinstance(token, str) or len(token) > MAX_TOKEN_CHARACTERS + 65:
        raise ValueError('Invalid continuation context')
    encoded, separator, signature = token.rpartition('.')
    expected = hmac.new(secret, key.encode() + b'\0' + encoded.encode(), hashlib.sha256).hexdigest()
    if not separator or not hmac.compare_digest(signature, expected):
        raise ValueError('Invalid continuation context')
    value = json.loads(base64.b64decode(encoded, altchars=b'-_', validate=True))
    if value['provider'] != provider or value['model'] != model:
        raise ValueError('Different provider or model')
    return value['prompt']


def restart_at(text):
    """Replace an unfinished Markdown/math block rather than duplicate or split it."""
    fence, display, inline, offset = None, None, None, 0
    for line in text.splitlines(keepends=True):
        match = re.match(r'^\s{0,3}(`{3,}|~{3,})', line)
        if match:
            marker = match[1]
            if fence is None:
                fence = (marker[0], len(marker), offset)
            elif marker[0] == fence[0] and len(marker) >= fence[1]:
                fence = None
            offset += len(line)
            continue
        if fence:
            offset += len(line)
            continue
        for match in re.finditer(r'(?<!\\)(?:\$\$|\\\[|\\\]|(?<!\$)\$(?!\$))', line):
            marker, position = match[0], offset + match.start()
            if marker in ('$$', r'\['):
                if display and display[0] == marker:
                    display = None
                elif display is None:
                    display = (marker, position)
            elif marker == r'\]':
                if display and display[0] == r'\[':
                    display = None
            elif display is None:
                inline = None if inline is not None else position
        offset += len(line)
    # Keep surrounding inline Markdown balanced when replacing a dangling $ formula.
    inline_start = (text.rfind('\n\n', 0, inline) + 2 if '\n\n' in text[:inline] else 0) if inline is not None else None
    starts = [value for value in (fence[2] if fence else None, display[1] if display else None, inline_start) if value is not None]
    if starts:
        return min(starts)
    if text.rstrip().endswith(('.', '。', '!', '！', '?', '？', ':', '：', '```', '~~~')):
        return len(text)
    return text.rfind('\n\n') + 2 if '\n\n' in text else 0


def checked_continuation(value):
    if not isinstance(value, dict) or set(value) - {'token', 'answer', 'sources'}:
        raise ValueError()
    text, token, sources = value.get('answer'), value.get('token', ''), value.get('sources', [])
    if not isinstance(text, str) or not 1 <= len(text) < MAX_ANSWER_CHARACTERS:
        raise ValueError()
    if not isinstance(token, str) or len(token) > MAX_TOKEN_CHARACTERS + 65 or not isinstance(sources, list) or len(sources) > 32:
        raise ValueError()
    ids, urls, result = set(), set(), []
    for source in sources:
        if not isinstance(source, dict):
            raise ValueError()
        number, url = source.get('id'), source.get('url')
        if (type(number) is not int or not 1 <= number <= 32 or number in ids
                or not isinstance(url, str) or not url.startswith('/') or url.startswith('//')
                or len(url) > 2000 or url in urls):
            raise ValueError()
        ids.add(number); urls.add(url); result.append({'id': number, 'url': url})
    return {'answer': text, 'token': token, 'sources': result}
