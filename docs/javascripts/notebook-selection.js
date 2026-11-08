/* Serialize a DOM selection as Markdown, treating rendered math as one atom. */
window.NotebookSelection = {
  markdown(range, root, limit = 2000) {
    let remaining = limit - 8, clipped = false, stopped = false;
    const intersects = node => { try { return range.intersectsNode(node); } catch { return false; } };
    const skip = element => element.hidden || element.matches('.headerlink,.md-clipboard,.md-content__button,.linenos,.linenodiv,script,style,button,input');
    const selectedText = node => {
      if (!intersects(node)) return '';
      let text = node.nodeValue || '';
      const start = node === range.startContainer ? range.startOffset : 0;
      const end = node === range.endContainer ? range.endOffset : text.length;
      return text.slice(start, end);
    };
    const plain = node => {
      if (!intersects(node)) return '';
      if (node.nodeType === 3) return selectedText(node);
      if (node.nodeType !== 1 || skip(node)) return '';
      return [...node.childNodes].map(plain).join('');
    };
    const emit = (text, atomic = false) => {
      if (!text) return '';
      if (text.length <= remaining) { remaining -= text.length; return text; }
      clipped = true; stopped = true;
      if (atomic) { remaining = 0; return ''; }
      let shortened = text.slice(0, Math.max(0, remaining)).replace(/[\uD800-\uDBFF]$/, '');
      if ((shortened.match(/\\+$/)?.[0].length || 0) % 2) shortened = shortened.slice(0, -1);
      remaining = 0;
      return shortened;
    };
    const wrap = (before, after, content) => {
      if (remaining <= before.length + after.length) { clipped = true; return ''; }
      remaining -= before.length + after.length;
      const value = content();
      if (!value.trim()) { remaining += before.length + after.length; return ''; }
      return before + value + after;
    };
    const escape = text => text.replace(/[\\`*_\[\]<>~]/g, '\\$&');
    const url = value => {
      if (typeof value !== 'string' || !value.trim()) return null;
      try {
        const parsed = new URL(value, location.href);
        if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) return null;
        const href = parsed.origin === location.origin ? parsed.pathname + parsed.search + parsed.hash : parsed.href;
        return href.replace(/\(/g, '%28').replace(/\)/g, '%29');
      } catch { return null; }
    };
    const visit = node => {
      if (!intersects(node)) return '';
      if (stopped || remaining <= 0) { clipped = true; return ''; }
      if (node.nodeType === 3) return emit(escape(selectedText(node)));
      if (node.nodeType !== 1 || skip(node)) return '';
      const children = () => [...node.childNodes].map(visit).join('');
      // A range inside KaTeX's visible glyphs still includes the original full formula.
      if (node.matches('.arithmatex,.katex-display,.katex')) {
        const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
        let tex = annotation?.textContent;
        if (!tex && node.matches('.arithmatex')) tex = node.textContent.trim().replace(/^\\[([]|\\[)\]]$/g, '');
        if (tex) {
          const display = node.matches('div.arithmatex,.katex-display') || Boolean(node.querySelector('.katex-display'));
          return emit(display ? `\n\n$$\n${tex}\n$$\n\n` : `\\(${tex}\\)`, true);
        }
      }
      if (node.matches('.katex-mathml,.katex-html,annotation,[aria-hidden="true"]')) return '';
      if (node.tagName === 'PRE') {
        const value = plain(node);
        const ticks = Math.max(3, ...[...value.matchAll(/`+/g)].map(match => match[0].length + 1));
        const fence = '`'.repeat(ticks);
        const language = node.querySelector('code')?.className.match(/language-([\w+-]+)/)?.[1] || '';
        return wrap(`\n\n${fence}${language}\n`, `\n${fence}\n\n`, () => emit(value));
      }
      if (node.tagName === 'CODE') {
        const value = plain(node), ticks = Math.max(1, ...[...value.matchAll(/`+/g)].map(match => match[0].length + 1));
        return wrap('`'.repeat(ticks) + ' ', ' ' + '`'.repeat(ticks), () => emit(value));
      }
      if (node.tagName === 'A') {
        const href = url(node.getAttribute('href'));
        return href ? wrap('[', `](${href})`, children) : children();
      }
      if (['STRONG', 'B'].includes(node.tagName)) return wrap('**', '**', children);
      if (['EM', 'I'].includes(node.tagName)) return wrap('*', '*', children);
      if (['S', 'DEL'].includes(node.tagName)) return wrap('~~', '~~', children);
      if (node.tagName === 'BR') return emit('\n');
      if (node.tagName === 'LI') {
        const ordered = node.parentElement?.tagName === 'OL';
        const number = ordered ? [...node.parentElement.children].indexOf(node) + Number(node.parentElement.start || 1) : 0;
        return wrap(`\n${ordered ? number + '.' : '-'} `, '\n', children);
      }
      if (/^H[1-6]$/.test(node.tagName)) return wrap('\n\n' + '#'.repeat(Number(node.tagName[1])) + ' ', '\n\n', children);
      if (node.tagName === 'DETAILS' && !node.open) return node.querySelector('summary') ? visit(node.querySelector('summary')) : '';
      if (node.tagName === 'TR') return wrap('\n\n', '\n\n', () => [...node.children].filter(intersects).map(visit).join(' · '));
      if (['P', 'DIV', 'BLOCKQUOTE', 'UL', 'OL', 'TABLE'].includes(node.tagName)) return wrap('\n\n', '\n\n', children);
      return children();
    };
    const markdown = [...root.childNodes].map(visit).join('').replace(/\n{3,}/g, '\n\n').trim();
    return {markdown: markdown + (clipped && markdown ? '\n\n（节选）' : ''), clipped};
  },
};
