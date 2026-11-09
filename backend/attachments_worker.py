"""Fixed parser subprocess. Stdin/stdout only; no user filenames are opened."""
import base64
import io
import json
import resource
import sys
import warnings
import zipfile
from xml.etree import ElementTree

# Bound parser memory and CPU use separately from the serving process.
resource.setrlimit(resource.RLIMIT_AS, (192 * 1024 * 1024,) * 2)
resource.setrlimit(resource.RLIMIT_CPU, (6, 6))
resource.setrlimit(resource.RLIMIT_FSIZE, (0, 0))
resource.setrlimit(resource.RLIMIT_CORE, (0, 0))

from PIL import Image, ImageOps
from pypdf import PdfReader

Image.MAX_IMAGE_PIXELS = 8_000_000
warnings.simplefilter('error', Image.DecompressionBombWarning)


def process(files):
    result, pages = [], 0
    for file in files:
        raw = base64.b64decode(file['data'], validate=True)
        mime = file['mime']
        item = {'name': file['name'], 'mime': mime}
        if mime.startswith('image/'):
            with Image.open(io.BytesIO(raw)) as image:
                if Image.MIME.get(image.format) != mime or getattr(image, 'n_frames', 1) != 1:
                    raise ValueError()
                if image.width * image.height > 8_000_000 or max(image.size) > 8192:
                    raise ValueError()
                image.load()
                image = ImageOps.exif_transpose(image).convert('RGBA')
                image.thumbnail((1600, 1600))
                canvas = Image.new('RGB', image.size, 'white')
                canvas.paste(image, mask=image.getchannel('A'))
                output = io.BytesIO()
                canvas.save(output, format='JPEG', quality=85)
                data = output.getvalue()
                if len(data) > 1024 * 1024:
                    raise ValueError()
                item.update(kind='image', mime='image/jpeg', data=base64.b64encode(data).decode())
        elif mime == 'application/pdf':
            if not raw.startswith(b'%PDF-'):
                raise ValueError()
            pdf = PdfReader(io.BytesIO(raw), strict=True)
            if pdf.is_encrypted or not 1 <= len(pdf.pages) <= 30:
                raise ValueError()
            pages += len(pdf.pages)
            if pages > 40:
                raise ValueError()
            item.update(kind='pdf', data=file['data'], pages=len(pdf.pages))
        elif mime == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            # Read one bounded member without extracting a ZIP or following relationships.
            with zipfile.ZipFile(io.BytesIO(raw)) as archive:
                if len(archive.infolist()) > 1000 or sum(info.file_size for info in archive.infolist()) > 20 * 1024 * 1024:
                    raise ValueError()
                info = archive.getinfo('word/document.xml')
                if info.file_size > 1024 * 1024 or info.flag_bits & 1:
                    raise ValueError()
                xml = archive.read(info).decode('utf-8-sig')
            if '<!DOCTYPE' in xml.upper() or '<!ENTITY' in xml.upper():
                raise ValueError()
            root = ElementTree.fromstring(xml)
            text = '\n'.join(''.join(node.text or '' for node in paragraph.iter() if node.tag.endswith('}t'))
                             for paragraph in root.iter() if paragraph.tag.endswith('}p'))
            if not text.strip() or len(text) > 60000:
                raise ValueError()
            item.update(kind='text', text=text)
        else:
            text = raw.decode('utf-8-sig')
            if '\x00' in text or len(text) > 60000:
                raise ValueError()
            item.update(kind='text', text=text)
        result.append(item)
    return result


try:
    files = json.loads(sys.stdin.buffer.read(12 * 1024 * 1024 + 1))
    print(json.dumps(process(files)))
except Exception:
    # Do not reveal parser errors or document contents through logs.
    print('null')
