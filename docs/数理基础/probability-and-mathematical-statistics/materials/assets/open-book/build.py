#!/usr/bin/env python3
"""Build a self-contained, print-ready HTML from the paginated Markdown source.

Requirements: Python Markdown, Node.js and this repository's KaTeX dependency.
Run: python3 build.py knowledge; python3 build.py exercises
Print the generated HTML in Chromium at A4, scale 100%, margins none,
headers/footers off. Every source PAGE becomes one numbered sheet.
"""
from pathlib import Path
import argparse
import base64
import html
import json
import re
import subprocess
import markdown

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / 'package.json').exists())
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('book', choices=['knowledge', 'exercises'])
args = parser.parse_args()
config = {
    'knowledge': {'title': '知识讲解', 'pages': 12, 'footer': '知识目录见第 1 页'},
    'exercises': {'title': '重点题目与标准解答', 'pages': 6, 'footer': '每页两题 · 题号顺序与页码一致'},
}[args.book]
source = (HERE / (args.book + '.md.txt')).read_text()
parts = re.split(r'<!-- page: ([^|]+) \| (.*?) -->', source)
pages = []
maths = []

def protect_math(match):
    raw = match.group()
    display = raw.startswith('$$')
    expr = raw[2:-2] if display else raw[1:-1]
    index = len(maths)
    maths.append({'expr': expr.strip(), 'display': display})
    return f'MATHPLACEHOLDER{index}END'

for i in range(1, len(parts), 3):
    key, title, body = parts[i:i+3]
    columns = body.split('<!-- column -->')
    if len(columns) != 2:
        raise ValueError(f'{key}: expected two columns')
    rendered = []
    for col in columns:
        safe = re.sub(r'\$\$[\s\S]*?\$\$|(?<!\$)\$[^\n$]+\$(?!\$)', protect_math, col)
        rendered.append(markdown.markdown(safe, extensions=['tables', 'sane_lists']))
    pages.append((key.strip(), title.strip(), rendered))
if len(pages) != config['pages']:
    raise ValueError(f'Expected {config["pages"]} sheets, got {len(pages)}')

node = """const k=require('katex');let input='';process.stdin.on('data',d=>input+=d);process.stdin.on('end',()=>{const out=JSON.parse(input).map(m=>k.renderToString(m.expr,{displayMode:m.display,throwOnError:true,strict:'error',output:'htmlAndMathml'}));process.stdout.write(JSON.stringify(out));});"""
result = subprocess.run(['node', '-e', node], input=json.dumps(maths), text=True, capture_output=True, cwd=ROOT)
if result.returncode:
    raise RuntimeError(result.stderr)
formulas = json.loads(result.stdout)

def restore(s):
    s = re.sub(r'<p>(MATHPLACEHOLDER\d+END)</p>', r'\1', s)
    return re.sub(r'MATHPLACEHOLDER(\d+)END', lambda m: formulas[int(m[1])], s)

css_path = ROOT / 'node_modules/katex/dist/katex.min.css'
css = css_path.read_text()
def embed_font(m):
    p = css_path.parent / m[1]
    mime = 'font/woff2' if p.suffix == '.woff2' else 'font/woff' if p.suffix == '.woff' else 'font/ttf'
    return 'url(data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()+')'
css = re.sub(r'url\((fonts/[^)]+)\)', embed_font, css)
style = '''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html,body { margin:0; padding:0; color:#111; background:#e7e7e7; }
body { font-family:"Noto Serif CJK SC","Songti SC",SimSun,serif; font-size:11pt; line-height:1.48; }
.sheet { width:210mm; height:297mm; margin:6mm auto; padding:10mm 12mm 12mm; position:relative; background:white; break-after:page; }
.sheet:last-child { break-after:auto; }
.eyebrow { font:8.5pt "Noto Sans CJK SC",sans-serif; letter-spacing:.03em; color:#444; display:flex; justify-content:space-between; }
h2 { font-family:"Noto Sans CJK SC",sans-serif; font-size:16pt; line-height:1.3; margin:2.5mm 0 4mm; padding:0 0 2mm; border-bottom:1.2pt solid #222; }
.columns { display:grid; grid-template-columns:1fr 1fr; column-gap:7mm; }
.column { min-width:0; height:253mm; }
h3 { font-family:"Noto Sans CJK SC",sans-serif; font-size:11.5pt; line-height:1.35; margin:3mm 0 1.6mm; padding:1mm 1.4mm; background:#ededed; border-left:2pt solid #333; break-after:avoid; }
h3:first-child { margin-top:0; }
p { margin:0 0 2mm; text-align:justify; overflow-wrap:break-word; }
strong { font-weight:700; }
ul,ol { margin:1mm 0 2mm; padding-left:4.4mm; }
li { margin:0 0 1.1mm; }
table { width:100%; border-collapse:collapse; font-size:9.5pt; line-height:1.35; margin:1.5mm 0 2.5mm; }
th,td { border-bottom:.5pt solid #bbb; padding:1.2mm .8mm; text-align:left; vertical-align:top; }
th { background:#f3f3f3; border-top:.7pt solid #555; font-weight:600; }
thead { display:table-header-group; }
.katex { font-size:1.03em; }
.katex-display { margin:.42em 0 .5em; text-align:center; }
.katex-display>.katex { white-space:nowrap; }
.diagram { width:100%; height:auto; max-height:37mm; display:block; margin:1mm 0; }
.footer { position:absolute; bottom:6.5mm; left:12mm; right:12mm; border-top:.5pt solid #aaa; padding-top:1.4mm; display:flex; justify-content:space-between; font:8pt "Noto Sans CJK SC",sans-serif; color:#333; }
@media print { html,body { background:white; } .sheet { margin:0; } }
'''
sheets = []
for number, (key, title, cols) in enumerate(pages, 1):
    sheets.append(f'<section class="sheet" id="{key}" data-page="{number}"><div class="eyebrow"><span>概率论和数理统计 · {html.escape(config["title"])}</span><span>第一至三章 §3.4</span></div><h2>{number:02d}　{html.escape(title)}</h2><div class="columns"><div class="column">{restore(cols[0])}</div><div class="column">{restore(cols[1])}</div></div><div class="footer"><span>2026-11-05　｜　{html.escape(config["footer"])}</span><span>{number} / {len(pages)}</span></div></section>')
# Recheck layout after fonts have loaded. This audit is also exposed for CDP.
script = '''
window.auditBooklet=()=>({pages:document.querySelectorAll('.sheet').length,columns:[...document.querySelectorAll('.column')].map((c,i)=>({page:Math.floor(i/2)+1,column:i%2+1,height:c.clientHeight,used:Math.ceil(c.lastElementChild.getBoundingClientRect().bottom-c.getBoundingClientRect().top),overflow:c.scrollHeight-c.clientHeight})),wide:[...document.querySelectorAll('.katex-display')].map(e=>({page:+e.closest('.sheet').dataset.page,width:e.scrollWidth,available:e.clientWidth,tex:e.querySelector('annotation')?.textContent})).filter(e=>e.width>e.available+2)});
document.fonts.ready.then(()=>{document.documentElement.dataset.ready='true';});
'''
output = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>概统 · BOOKTITLE</title><style>'+css+'\n'+style+'</style></head><body>'+''.join(sheets)+'<script>'+script+'</script></body></html>'
output = output.replace('BOOKTITLE', html.escape(config['title']))
(HERE / (args.book + '.html')).write_text(output)
print(f'Built {len(pages)} sheets, {len(formulas)} formulas, self-contained HTML ({len(output):,} characters).')
