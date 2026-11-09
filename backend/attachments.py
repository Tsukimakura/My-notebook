"""Bounded, in-memory attachments. No remote fetches or user-supplied paths."""
import asyncio
import base64
import binascii
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

MAX_FILES = 4
MAX_FILE_BYTES = 4 * 1024 * 1024
MAX_TOTAL_BYTES = 8 * 1024 * 1024
MAX_REQUEST_BYTES = 12 * 1024 * 1024
MIMES = ('image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain', 'text/markdown')


class AttachmentError(ValueError):
    pass


def checked_files(value):
    if not isinstance(value, list) or len(value) > MAX_FILES:
        raise AttachmentError('每次最多 4 个附件。')
    total, result = 0, []
    for item in value:
        if not isinstance(item, dict) or set(item) != {'name', 'data_url'}:
            raise AttachmentError('附件格式无效。')
        name, data = item['name'], item['data_url']
        if (not isinstance(name, str) or not 1 <= len(name) <= 120
                or any(ord(c) < 32 for c in name) or '/' in name or '\\' in name
                or not isinstance(data, str) or len(data) > MAX_FILE_BYTES * 4 // 3 + 100):
            raise AttachmentError('附件名称或大小无效；单个文件最多 4 MiB。')
        match = re.fullmatch(r'data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})', data)
        if not match or match[1] not in MIMES:
            raise AttachmentError('仅支持 PNG、JPEG、WebP、PDF、UTF-8 TXT 和 Markdown。')
        try:
            raw = base64.b64decode(match[2], validate=True)
        except (ValueError, binascii.Error):
            raise AttachmentError('附件编码无效。') from None
        total += len(raw)
        if not raw or len(raw) > MAX_FILE_BYTES or total > MAX_TOTAL_BYTES:
            raise AttachmentError('单个附件最多 4 MiB，合计最多 8 MiB。')
        result.append({'name': name, 'mime': match[1], 'data': match[2]})
    return result


async def normalize(files):
    """Decode in a separate, resource-limited process; never write uploads to disk."""
    if not files:
        return []
    process = await asyncio.create_subprocess_exec(
        sys.executable, '-m', 'backend.attachments_worker',
        stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.DEVNULL)
    try:
        async with asyncio.timeout(10):
            output, _ = await process.communicate(json.dumps(files).encode())
        if process.returncode or len(output) > MAX_REQUEST_BYTES:
            raise AttachmentError('附件校验失败或超出处理限额，请缩小文件后重试。')
        result = json.loads(output)
        if not isinstance(result, list):
            raise AttachmentError('附件损坏或超出限制：图片最多 800 万像素；PDF 须未加密且每份不超过 30 页；文本须为 UTF-8。')
        return result
    except (TimeoutError, json.JSONDecodeError):
        raise AttachmentError('附件处理超时或文件损坏，请缩小文件后重试。') from None
    finally:
        if process.returncode is None:
            process.kill()
            await process.communicate()


def figure_path(site_dir, url):
    if not isinstance(url, str) or not url.startswith('/') or url.startswith('//') or '\\' in url:
        return None
    parsed = urlsplit(url)
    if parsed.query or parsed.fragment or parsed.scheme or parsed.netloc:
        return None
    base = Path(site_dir).resolve()
    path = (base / unquote(parsed.path).lstrip('/')).resolve()
    if not path.is_relative_to(base) or path.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
        return None
    return path if path.is_file() and path.stat().st_size <= MAX_FILE_BYTES else None


async def note_figures(site_dir, sources):
    files, figures, seen = [], [], set()
    for source in sources:
        for image in source.get('images', [])[:4]:
            url = image.get('url')
            if url in seen or len(figures) >= 4:
                continue
            path = figure_path(site_dir, url)
            if path is None:
                continue
            seen.add(url)
            raw = path.read_bytes()
            if sum(len(base64.b64decode(item['data'])) for item in files) + len(raw) > MAX_TOTAL_BYTES:
                continue
            mime = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'}[path.suffix.lower()]
            file = {'name': f'note-figure-{len(figures) + 1}{path.suffix.lower()}', 'mime': mime,
                    'data': base64.b64encode(raw).decode()}
            # A bad published asset must not break an otherwise valid text answer.
            try:
                clean = (await normalize([file]))[0]
            except AttachmentError:
                continue
            files.append(clean)
            figures.append({'url': url, 'caption': str(image.get('alt', '笔记配图'))[:300], 'source_id': source['id'], 'name': file['name']})
    return files, figures
