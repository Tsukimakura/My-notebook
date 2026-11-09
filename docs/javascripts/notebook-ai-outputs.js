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
    const svg = element('svg', {width: 600, height: 360, viewBox: '0 0 600 360', 'font-family': 'system-ui, sans-serif', role: 'img', 'aria-label': title || '示意图'});
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
  // Conservative glyph widths also work before fonts load and in detached SVGs.
  const textWidth = (value, size = 16) => [...value].reduce((width, char) => width +
    (/\p{Mark}/u.test(char) ? 0 : /[\s]/u.test(char) ? .35 : /[MW@#%]/.test(char) ? 1 : char.codePointAt(0) >= 0x2e80 ? 1 : .7) * size, 0);
  const wrapText = (value, width, size = 16) => {
    const lines = [];
    for (const paragraph of value.split(/\n+/).filter(part => part.trim())) {
      let line = '';
      for (const word of paragraph.match(/[A-Za-z0-9_]+|[^A-Za-z0-9_]/gu) || ['']) {
        if (line && textWidth(line + word, size) > width) { lines.push(line.trimEnd()); line = ''; }
        for (const char of word) {
          if (line && textWidth(line + char, size) > width) { lines.push(line.trimEnd()); line = ''; }
          if (line || char.trim()) line += char;
        }
      }
      lines.push(line.trimEnd());
    }
    return lines.length ? lines : [''];
  };
  const multiline = (lines, x, y, size, palette) => {
    const label = element('text', {x, y, 'text-anchor': 'middle', 'font-size': size, fill: palette.ink});
    lines.forEach((line, index) => label.append(element('tspan', {x, dy: index ? size * 1.35 : 0}, line)));
    return label;
  };
  const bounds = (node, padding = 0) => ({left: node.x - node.w / 2 - padding, right: node.x + node.w / 2 + padding,
    top: node.y - node.h / 2 - padding, bottom: node.y + node.h / 2 + padding});
  const overlaps = (a, b, padding = 0) => a.left < b.right + padding && a.right > b.left - padding && a.top < b.bottom + padding && a.bottom > b.top - padding;
  const segmentHits = (a, b, box) => {
    // Clip a finite segment against an axis-aligned rectangle (Liang–Barsky).
    let low = 0, high = 1;
    const dx = b.x - a.x, dy = b.y - a.y;
    for (const [p, q] of [[-dx, a.x - box.left], [dx, box.right - a.x], [-dy, a.y - box.top], [dy, box.bottom - a.y]]) {
      if (Math.abs(p) < 1e-8) { if (q < 0) return false; }
      else { const ratio = q / p; if (p < 0) low = Math.max(low, ratio); else high = Math.min(high, ratio); }
    }
    return low <= high;
  };
  const segments = points => points.slice(1).map((point, index) => [points[index], point]);
  const diagram = spec => {
    if (!spec || !Array.isArray(spec.nodes) || !spec.nodes.length || spec.nodes.length > 24 || !Array.isArray(spec.edges) || spec.edges.length > 48) throw new Error('Invalid diagram');
    const nodes = new Map();
    for (const node of spec.nodes) {
      if (typeof node.id !== 'string' || !node.id || node.id.length > 80 || nodes.has(node.id)
          || !finite(node.x) || !finite(node.y) || node.x < 0 || node.x > 100 || node.y < 0 || node.y > 100) throw new Error('Invalid node');
      const label = text(node.label, 120), lines = wrapText(label, 136), box = node.shape === 'box';
      const labelWidth = Math.max(16, ...lines.map(line => textWidth(line))), labelHeight = lines.length * 21.6;
      const radius = Math.max(34, Math.hypot(labelWidth / 2 + 14, labelHeight / 2 + 10));
      nodes.set(node.id, {x: node.x * 7.2, y: node.y * 4.6, lines, label, box,
        w: box ? Math.max(88, labelWidth + 32) : radius * 2, h: box ? Math.max(52, labelHeight + 28) : radius * 2});
    }
    const list = [...nodes.values()];
    // Coordinates are layout hints. Separate colliding labels without changing graph connectivity.
    for (let pass = 0; pass < 100; pass++) {
      let changed = false;
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j], dx = b.x - a.x, dy = b.y - a.y;
        const overlapX = (a.w + b.w) / 2 + 42 - Math.abs(dx), overlapY = (a.h + b.h) / 2 + 42 - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;
        const axis = overlapX < overlapY ? 'x' : 'y';
        const shift = ((axis === 'x' ? overlapX : overlapY) / 2 + .1) * ((axis === 'x' ? dx : dy) < 0 ? -1 : 1);
        a[axis] -= shift; b[axis] += shift; changed = true;
      }
      if (!changed) break;
    }
    if (list.some((a, i) => list.slice(i + 1).some(b => overlaps(bounds(a, 12), bounds(b, 12))))) {
      const columns = Math.ceil(Math.sqrt(list.length)), cellW = Math.max(...list.map(n => n.w)) + 70, cellH = Math.max(...list.map(n => n.h)) + 70;
      list.forEach((node, index) => { node.x = index % columns * cellW; node.y = Math.floor(index / columns) * cellH; });
    }
    const offsetX = 100 - Math.min(...list.map(n => bounds(n).left)), offsetY = 100 - Math.min(...list.map(n => bounds(n).top));
    list.forEach(node => { node.x += offsetX; node.y += offsetY; });
    let width = Math.max(600, ...list.map(n => bounds(n).right + 100)), height = Math.max(300, ...list.map(n => bounds(n).bottom + 100));
    const title = wrapText(text(spec.title), width - 48, 19);
    const routeTop = Math.max(64, spec.title ? 28 + title.length * 25.65 : 64);
    const extraTop = routeTop - 64;
    list.forEach(node => { node.y += extraTop; }); height += extraTop;
    const {svg, palette} = base(''), arrow = `notebook-arrow-${++sequence}`;
    svg.classList.add('notebook-ai-diagram');
    svg.querySelector('title').textContent = text(spec.title) || '关系示意图';
    svg.setAttribute('aria-label', text(spec.title) || '关系示意图');
    const marker = element('marker', {id: arrow, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse'});
    marker.append(element('path', {d: 'M0 0 L10 5 L0 10 Z', fill: palette.ink}));
    const defs = element('defs'); defs.append(marker); svg.append(defs);
    const ports = node => [
      {x: node.x + node.w / 2 + 3, y: node.y, dx: 14, dy: 0}, {x: node.x - node.w / 2 - 3, y: node.y, dx: -14, dy: 0},
      {x: node.x, y: node.y + node.h / 2 + 3, dx: 0, dy: 14}, {x: node.x, y: node.y - node.h / 2 - 3, dx: 0, dy: -14},
    ];
    const routes = [];
    const route = (from, to) => {
      const dx = to.x - from.x, dy = to.y - from.y, distance = Math.hypot(dx, dy), ux = dx / distance, uy = dy / distance;
      const clearance = node => node.box ? Math.min(node.w / 2 / Math.abs(ux), node.h / 2 / Math.abs(uy)) + 4 : node.w / 2 + 4;
      const direct = [{x: from.x + ux * clearance(from), y: from.y + uy * clearance(from)}, {x: to.x - ux * clearance(to), y: to.y - uy * clearance(to)}];
      if (!list.some(node => node !== from && node !== to && segmentHits(...direct, bounds(node, 12)))) return direct;
      let best = null, bestCost = Infinity;
      const xs = [32, width - 32, ...list.flatMap(n => [bounds(n).left - 20, bounds(n).right + 20])];
      const ys = [routeTop, height - 32, ...list.flatMap(n => [bounds(n).top - 20, bounds(n).bottom + 20])];
      for (const start of ports(from)) for (const end of ports(to)) {
        const a = {x: start.x + start.dx, y: start.y + start.dy}, b = {x: end.x + end.dx, y: end.y + end.dy};
        const paths = [[a, {x: a.x, y: b.y}, b], [a, {x: b.x, y: a.y}, b],
          ...xs.map(x => [a, {x, y: a.y}, {x, y: b.y}, b]), ...ys.map(y => [a, {x: a.x, y}, {x: b.x, y}, b])];
        for (const middle of paths) {
          if (segments(middle).some(([p, q]) => list.some(node => segmentHits(p, q, bounds(node, 8))))) continue;
          const points = [start, ...middle, end].filter((point, i, all) => !i || Math.hypot(point.x - all[i - 1].x, point.y - all[i - 1].y) > .1);
          const cost = segments(points).reduce((sum, [p, q]) => sum + Math.hypot(q.x - p.x, q.y - p.y), 0) + points.length * 10;
          if (cost < bestCost) { best = points; bestCost = cost; }
        }
      }
      if (best) return best;
      // Dense graphs can need more than three bends. Search the obstacle corridors,
      // bounded by 24 nodes (at most 56 x 56 intersections), only as a fallback.
      const starts = ports(from), ends = ports(to);
      const anchor = port => ({x: port.x + port.dx, y: port.y + port.dy});
      const xsGrid = [...new Set([...xs, ...starts.map(p => anchor(p).x), ...ends.map(p => anchor(p).x)])].sort((a, b) => a - b);
      const ysGrid = [...new Set([...ys, ...starts.map(p => anchor(p).y), ...ends.map(p => anchor(p).y)])].sort((a, b) => a - b);
      const key = p => ysGrid.indexOf(p.y) * xsGrid.length + xsGrid.indexOf(p.x);
      const point = id => ({x: xsGrid[id % xsGrid.length], y: ysGrid[Math.floor(id / xsGrid.length)]});
      const roots = new Map(starts.map(p => [key(anchor(p)), p])), targets = new Map(ends.map(p => [key(anchor(p)), p]));
      const queue = [...roots.keys()], previous = new Map(queue.map(id => [id, null]));
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const id = queue[cursor], a = point(id);
        if (targets.has(id)) {
          const path = [a]; let parent = id;
          while (previous.get(parent) !== null) { parent = previous.get(parent); path.unshift(point(parent)); }
          const points = [roots.get(parent), ...path, targets.get(id)];
          return points.filter((p, i) => !i || i === points.length - 1
            || !((points[i - 1].x === p.x && p.x === points[i + 1].x) || (points[i - 1].y === p.y && p.y === points[i + 1].y)));
        }
        const x = id % xsGrid.length, y = Math.floor(id / xsGrid.length);
        for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
          if (nx < 0 || nx >= xsGrid.length || ny < 0 || ny >= ysGrid.length) continue;
          const next = ny * xsGrid.length + nx;
          if (previous.has(next) || list.some(node => segmentHits(a, point(next), bounds(node, 8)))) continue;
          previous.set(next, id); queue.push(next);
        }
      }
      throw new Error('No clear diagram route');
    };
    for (const edge of spec.edges) {
      const from = nodes.get(edge.from), to = nodes.get(edge.to);
      if (!from || !to || from === to) throw new Error('Invalid edge');
      const points = route(from, to), attrs = {fill: 'none', stroke: palette.ink, 'stroke-width': 2, 'stroke-linejoin': 'round', 'data-diagram-edge': ''};
      const line = points.length === 2 ? element('line', {...attrs, x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y})
        : element('polyline', {...attrs, points: points.map(p => `${p.x},${p.y}`).join(' ')});
      if (edge.arrow !== false) line.setAttribute('marker-end', `url(#${arrow})`);
      svg.append(line); routes.push({points, label: text(edge.label, 160)});
    }
    const occupied = list.map(node => bounds(node, 10)), legend = [];
    const allSegments = routes.flatMap(r => segments(r.points));
    for (const item of routes) {
      if (!item.label) continue;
      const lines = wrapText(item.label, 154, 15), w = Math.max(...lines.map(line => textWidth(line, 15))) + 16, h = lines.length * 20.25 + 12;
      let best = null, bestCost = Infinity;
      for (const [a, b] of segments(item.points)) {
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        if (length < 35) continue;
        const nx = -(b.y - a.y) / length, ny = (b.x - a.x) / length;
        for (const fraction of [.5, .3, .7]) for (const sign of [-1, 1]) for (const gap of [12, 28, 48]) {
          const distance = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2 + gap;
          const x = a.x + (b.x - a.x) * fraction + nx * sign * distance, y = a.y + (b.y - a.y) * fraction + ny * sign * distance;
          const box = {left: x - w / 2, right: x + w / 2, top: y - h / 2, bottom: y + h / 2};
          if (box.left < 16 || box.top < routeTop || box.right > width - 16 || box.bottom > height - 16
              || occupied.some(other => overlaps(box, other, 6)) || allSegments.some(([p, q]) => segmentHits(p, q, box))) continue;
          const cost = gap + Math.abs(fraction - .5) * length + (segments(item.points).length > 1 ? 10 : 0);
          if (cost < bestCost) { best = {x, y, box}; bestCost = cost; }
        }
      }
      if (best) {
        occupied.push(best.box);
        const group = element('g', {'data-diagram-label': ''});
        group.append(element('rect', {x: best.box.left, y: best.box.top, width: w, height: h, rx: 4, fill: palette.paper}),
          multiline(lines, best.x, best.y - (lines.length - 1) * 10.125 + 5, 15, palette));
        svg.append(group);
      } else {
        const [a, b] = segments(item.points).sort((a, b) => Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y) - Math.hypot(a[1].x - a[0].x, a[1].y - a[0].y))[0];
        const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2, number = legend.length + 1;
        svg.append(element('circle', {cx: x, cy: y, r: 12, fill: palette.paper, stroke: palette.line}),
          element('text', {x, y: y + 5, 'text-anchor': 'middle', 'font-size': 14, fill: palette.ink}, number));
        legend.push(`${number}. ${item.label}`);
      }
    }
    for (const node of list) {
      const group = element('g', {'data-diagram-node': '', 'aria-label': node.label});
      group.append(node.box ? element('rect', {x: node.x - node.w / 2, y: node.y - node.h / 2, width: node.w, height: node.h, rx: 8, fill: palette.paper, stroke: palette.ink, 'stroke-width': 2})
        : element('circle', {cx: node.x, cy: node.y, r: node.w / 2, fill: palette.paper, stroke: palette.ink, 'stroke-width': 2}),
        multiline(node.lines, node.x, node.y - (node.lines.length - 1) * 10.8 + 5, 16, palette));
      svg.append(group);
    }
    if (spec.title) svg.append(multiline(title, width / 2, 28, 19, palette));
    // Dense edge labels have a numbered key instead of covering the drawing.
    let legendY = height - 36;
    for (const entry of legend) {
      const lines = wrapText(entry, width - 80, 15), label = multiline(lines, width / 2, legendY, 15, palette);
      svg.append(label); legendY += lines.length * 20.25 + 12;
    }
    if (legend.length) height = legendY + 24;
    width = Math.ceil(width); height = Math.ceil(height);
    svg.setAttribute('width', width); svg.setAttribute('height', height); svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.setProperty('--notebook-diagram-width', `${width}px`);
    svg.querySelector('rect').setAttribute('width', width); svg.querySelector('rect').setAttribute('height', height);
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
    const block = document.createElement('figure'); block.className = 'notebook-ai-figure';
    if (svg.classList.contains('notebook-ai-diagram')) {
      const viewport = document.createElement('div'); viewport.className = 'notebook-ai-diagram-viewport'; viewport.tabIndex = 0;
      viewport.setAttribute('role', 'region'); viewport.setAttribute('aria-label', '示意图，可横向滚动'); viewport.append(svg); block.append(viewport);
    } else block.append(svg);
    const tools = document.createElement('figcaption'); tools.className = 'notebook-ai-output-tools';
    const serialize = () => new XMLSerializer().serializeToString(svg);
    tools.append(button('下载 SVG', () => download(serialize(), 'figure.svg', 'image/svg+xml')),
      button('下载 PNG', () => new Promise((resolve, reject) => {
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialize()), img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const width = Number(svg.getAttribute('width')), height = Number(svg.getAttribute('height'));
            const scale = Math.min(2, 2400 / Math.max(width, height));
            canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => { if (blob) { download(blob, 'figure.png'); resolve(); } else reject(new Error()); }, 'image/png');
          } catch (error) { reject(error); }
        };
        img.onerror = () => reject(new Error()); img.src = url;
      })));
    if (svg.classList.contains('notebook-ai-diagram')) {
      const viewport = block.firstElementChild;
      const fit = button('适应宽度', () => {
        const enabled = viewport.dataset.fit !== 'true'; viewport.dataset.fit = String(enabled);
        fit.textContent = enabled ? '原始大小' : '适应宽度'; fit.setAttribute('aria-pressed', String(enabled));
        viewport.setAttribute('aria-label', enabled ? '示意图，全图显示' : '示意图，可横向滚动');
      });
      fit.setAttribute('aria-pressed', 'false'); tools.append(fit);
    }
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
