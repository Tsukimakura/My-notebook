/* Data-only figures and explicit downloads. No model HTML, SVG, scripts, or remote assets execute. */
window.NotebookOutputs = (() => {
  const ns = 'http://www.w3.org/2000/svg';
  let sequence = 0;
  const text = (value, limit = 100) => typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, limit) : '';
  const finite = value => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e9;
  const element = (tag, attrs = {}, label) => {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    if (label !== undefined) node.textContent = label;
    return node;
  };
  const colors = () => {
    const style = getComputedStyle(document.documentElement);
    return {ink: style.getPropertyValue('--notebook-ink').trim() || '#26382d', paper: style.getPropertyValue('--notebook-paper').trim() || '#fff', line: style.getPropertyValue('--notebook-line').trim() || '#d5ded1'};
  };
  const base = title => {
    const palette = colors();
    const svg = element('svg', {width: 600, height: 360, viewBox: '0 0 600 360', role: 'img', 'aria-label': title || '示意图'});
    svg.append(element('title', {}, title || '示意图'), element('rect', {x: 0, y: 0, width: 600, height: 360, fill: palette.paper}));
    if (title) svg.append(element('text', {x: 300, y: 26, 'text-anchor': 'middle', 'font-size': 19, fill: palette.ink}, title));
    return {svg, palette};
  };
  const plot = spec => {
    if (!spec || !Array.isArray(spec.series) || !spec.series.length || spec.series.length > 4) throw new Error('Invalid plot');
    let total = 0;
    for (const series of spec.series) {
      if (!Array.isArray(series.points) || series.points.length < 2 || series.points.length > 512) throw new Error('Invalid points');
      for (const point of series.points) if (!Array.isArray(point) || point.length !== 2 || !point.every(finite)) throw new Error('Invalid coordinates');
      total += series.points.length;
    }
    if (total > 1500) throw new Error('Too many points');
    const all = spec.series.flatMap(series => series.points);
    let xmin = Math.min(...all.map(p => p[0])), xmax = Math.max(...all.map(p => p[0]));
    let ymin = Math.min(0, ...all.map(p => p[1])), ymax = Math.max(0, ...all.map(p => p[1]));
    if (xmin === xmax) { xmin -= 1; xmax += 1; }
    if (ymin === ymax) { ymin -= 1; ymax += 1; }
    const x = value => 75 + (value - xmin) / (xmax - xmin) * 495;
    const y = value => 285 - (value - ymin) / (ymax - ymin) * 225;
    const {svg, palette} = base(text(spec.title));
    const format = value => Number(value.toPrecision(3)).toString();
    for (let tick = 0; tick <= 4; tick++) {
      const xv = xmin + (xmax - xmin) * tick / 4, yv = ymin + (ymax - ymin) * tick / 4;
      svg.append(element('line', {x1: 75, y1: y(yv), x2: 570, y2: y(yv), stroke: palette.line}),
        element('text', {x: 66, y: y(yv) + 5, 'text-anchor': 'end', 'font-size': 15, fill: palette.ink}, format(yv)),
        element('text', {x: x(xv), y: 307, 'text-anchor': 'middle', 'font-size': 15, fill: palette.ink}, format(xv)));
    }
    svg.append(element('path', {d: 'M75 50 V285 H580', fill: 'none', stroke: palette.ink, 'stroke-width': 1.5}),
      element('text', {x: 325, y: 332, 'text-anchor': 'middle', 'font-size': 17, fill: palette.ink}, text(spec.x_label, 60)),
      element('text', {x: 18, y: 170, transform: 'rotate(-90 18 170)', 'text-anchor': 'middle', 'font-size': 17, fill: palette.ink}, text(spec.y_label, 35)));
    const strokes = ['#51785b', '#b17732', '#537a9c', '#a05d71'];
    spec.series.forEach((series, i) => {
      svg.append(element('polyline', {points: series.points.map(p => `${x(p[0]).toFixed(2)},${y(p[1]).toFixed(2)}`).join(' '), fill: 'none', stroke: strokes[i], 'stroke-width': 2.5}),
        element('text', {x: 85 + i * 125, y: 354, 'font-size': 14, fill: strokes[i]}, text(series.name, 16)));
    });
    return svg;
  };
  const diagram = spec => {
    if (!spec || !Array.isArray(spec.nodes) || !spec.nodes.length || spec.nodes.length > 24 || !Array.isArray(spec.edges) || spec.edges.length > 48) throw new Error('Invalid diagram');
    const nodes = new Map();
    for (const node of spec.nodes) {
      if (typeof node.id !== 'string' || !node.id || node.id.length > 80 || nodes.has(node.id)
          || !finite(node.x) || !finite(node.y) || node.x < 0 || node.x > 100 || node.y < 0 || node.y > 100) throw new Error('Invalid node');
      nodes.set(node.id, {x: 70 + node.x * 4.6, y: 75 + node.y * 2.1, label: text(node.label, 32), box: node.shape === 'box'});
    }
    const {svg, palette} = base(text(spec.title)), arrow = `notebook-arrow-${++sequence}`;
    const marker = element('marker', {id: arrow, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse'});
    marker.append(element('path', {d: 'M0 0 L10 5 L0 10 Z', fill: palette.ink}));
    const defs = element('defs'); defs.append(marker); svg.append(defs);
    for (const edge of spec.edges) {
      const from = nodes.get(edge.from), to = nodes.get(edge.to);
      if (!from || !to || from === to) throw new Error('Invalid edge');
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      if (distance < 1) throw new Error('Nodes overlap');
      const ux = (to.x - from.x) / distance, uy = (to.y - from.y) / distance;
      const clearance = node => node.box ? Math.min(52 / Math.abs(ux), 25 / Math.abs(uy)) + 3 : 36;
      const start = clearance(from), end = clearance(to);
      if (distance < start + end + 5) throw new Error('Nodes overlap');
      const line = element('line', {x1: from.x + ux * start, y1: from.y + uy * start, x2: to.x - ux * end, y2: to.y - uy * end, stroke: palette.ink, 'stroke-width': 2});
      if (edge.arrow !== false) line.setAttribute('marker-end', `url(#${arrow})`);
      svg.append(line, element('text', {x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - 9, 'text-anchor': 'middle', 'font-size': 15, fill: palette.ink}, text(edge.label, 40)));
    }
    for (const node of nodes.values()) {
      svg.append(node.box ? element('rect', {x: node.x - 52, y: node.y - 25, width: 104, height: 50, rx: 8, fill: palette.paper, stroke: palette.ink, 'stroke-width': 2})
        : element('circle', {cx: node.x, cy: node.y, r: 33, fill: palette.paper, stroke: palette.ink, 'stroke-width': 2}),
      element('text', {x: node.x, y: node.y + 5, 'text-anchor': 'middle', 'font-size': 16, fill: palette.ink}, node.label));
    }
    return svg;
  };
  const csv = rows => '\ufeff' + rows.map(row => row.map(value => {
    let cell = String(value);
    const start = cell.replace(/^[\s\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]+/u, '');
    if (/^[=+@-]/.test(start) && !/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(start)) cell = "'" + cell;
    return '"' + cell.replace(/"/g, '""') + '"';
  }).join(',')).join('\r\n');
  const parseCSV = input => {
    const rows = [], row = []; let cell = '', quoted = false, ended = false, cells = 0;
    const push = () => { row.push(cell); cell = ''; ended = false; if (++cells > 20000 || row.length > 100) throw new Error('CSV too large'); };
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if (quoted) { if (c === '"') { if (input[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; ended = true; } } else cell += c; }
      else if (c === '"' && !cell && !ended) quoted = true;
      else if (c === ',') push();
      else if (c === '\n' || c === '\r') { if (c === '\r' && input[i + 1] === '\n') i++; push(); rows.push(row.splice(0)); }
      else { if (ended) throw new Error('Invalid CSV'); cell += c; }
    }
    if (quoted) throw new Error('Unclosed CSV');
    if (cell || row.length || ended) { push(); rows.push(row); }
    return rows;
  };
  const download = (value, name, mime) => {
    const blob = value instanceof Blob ? value : new Blob([value], {type: mime});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const button = (label, action) => {
    const node = document.createElement('button'); node.type = 'button'; node.textContent = label;
    node.addEventListener('click', async () => { try { await action(); } catch { node.textContent = '导出失败，请复制原文'; } });
    return node;
  };
  const figure = svg => {
    const block = document.createElement('figure'); block.className = 'notebook-ai-figure'; block.append(svg);
    const tools = document.createElement('figcaption'); tools.className = 'notebook-ai-output-tools';
    const serialize = () => new XMLSerializer().serializeToString(svg);
    tools.append(button('下载 SVG', () => download(serialize(), 'figure.svg', 'image/svg+xml')),
      button('下载 PNG', () => new Promise((resolve, reject) => {
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialize()), img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 720;
            canvas.getContext('2d').drawImage(img, 0, 0, 1200, 720);
            canvas.toBlob(blob => { if (blob) { download(blob, 'figure.png'); resolve(); } else reject(new Error()); }, 'image/png');
          } catch (error) { reject(error); }
        };
        img.onerror = () => reject(new Error()); img.src = url;
      })));
    block.append(tools); return block;
  };
  const render = target => {
    for (const code of target.querySelectorAll('pre > code')) {
      if (code.dataset.notebookOutput) continue;
      code.dataset.notebookOutput = 'true';
      const language = code.className.match(/language-([\w-]+)/)?.[1]?.toLowerCase(), value = code.textContent;
      if (value.length > 262144) continue;
      const tools = document.createElement('div'); tools.className = 'notebook-ai-output-tools';
      try {
        if (language === 'plot' || language === 'diagram') {
          const svg = (language === 'plot' ? plot : diagram)(JSON.parse(value)), pre = code.parentElement;
          const details = document.createElement('details'), summary = document.createElement('summary'); summary.textContent = '绘图数据'; details.append(summary);
          pre.before(figure(svg), details); details.append(pre);
        }
        if (language === 'json' || language === 'plot' || language === 'diagram') {
          const json = JSON.stringify(JSON.parse(value), null, 2);
          tools.append(button('下载 JSON', () => download(json, 'data.json', 'application/json')));
        } else if (language === 'csv') {
          const rows = parseCSV(value);
          tools.append(button('下载 CSV', () => download(csv(rows), 'data.csv', 'text/csv;charset=utf-8')));
        } else tools.append(button('下载文本', () => download(value, 'code.txt', 'text/plain;charset=utf-8')));
      } catch { tools.append(button('下载文本', () => download(value, 'data.txt', 'text/plain;charset=utf-8'))); }
      code.parentElement.after(tools);
    }
    for (const table of target.querySelectorAll('table')) {
      if (table.dataset.notebookOutput) continue;
      table.dataset.notebookOutput = 'true';
      const tools = document.createElement('div'); tools.className = 'notebook-ai-output-tools';
      tools.append(button('下载 CSV', () => {
        const rows = [...table.rows].map(row => [...row.cells].map(cell => {
          const clone = cell.cloneNode(true);
          for (const math of clone.querySelectorAll('.katex')) math.replaceWith(document.createTextNode(math.querySelector('annotation[encoding="application/x-tex"]')?.textContent || math.textContent));
          return clone.textContent;
        }));
        download(csv(rows), 'table.csv', 'text/csv;charset=utf-8');
      })); table.after(tools);
    }
  };
  return {render, csv, plot, diagram, download, answer(record, format) {
    if (format === 'json') download(JSON.stringify({answer: record.content, sources: record.sources || [], truncated: record.truncated === true, finish_reason: record.finish_reason, usage: record.usage || {}}, null, 2), 'answer.json', 'application/json');
    else download(record.content, format === 'md' ? 'answer.md' : 'answer.txt', 'text/plain;charset=utf-8');
  }};
})();
