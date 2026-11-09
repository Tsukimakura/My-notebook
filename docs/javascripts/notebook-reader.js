/* Selection stays on this device until the reader explicitly sends a question. */
(() => {
  const start = () => {
    if (document.querySelector('.notebook-selection-ask')) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'notebook-selection-ask'; button.hidden = true;
    button.textContent = '提问这段内容'; button.setAttribute('aria-label', '把选中的内容放入提问框');
    document.body.append(button);
    let snapshot = null, pressed = null, scheduled;
    const hide = () => { clearTimeout(scheduled); button.hidden = true; snapshot = null; pressed = null; };
    const selectionRoot = range => {
      const start = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
      const message = start?.closest('[data-answer],[data-user]');
      if (message?.contains(range.endContainer)) return {root: message, conversation: true};
      const messages = start?.closest('[data-messages]');
      if (messages?.contains(range.endContainer)) return {root: messages, conversation: true};
      const article = document.querySelector('.md-content__inner');
      if (article?.contains(range.startContainer) && article.contains(range.endContainer)) return {root: article, conversation: false};
      return null;
    };
    // Browser copying of KaTeX otherwise mixes visible glyphs with hidden MathML.
    document.addEventListener('copy', event => {
      if (event.defaultPrevented || !event.clipboardData || event.target.closest?.('input,textarea,[contenteditable="true"]')) return;
      const selection = window.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) return;
      const range = selection.getRangeAt(0), selected = selectionRoot(range);
      if (!selected?.conversation) return;
      const hasMath = [...selected.root.querySelectorAll('.katex,.arithmatex')].some(node => range.intersectsNode(node));
      if (!hasMath) return;
      const excerpt = window.NotebookSelection?.markdown(range, selected.root, 262144);
      if (!excerpt?.markdown) return;
      event.clipboardData.setData('text/plain', excerpt.markdown);
      event.preventDefault();
    });
    const update = () => {
      const selection = window.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) { hide(); return; }
      const range = selection.getRangeAt(0);
      const selected = selectionRoot(range);
      if (!selected || (!selected.conversation && document.querySelector('.notebook-home'))) { hide(); return; }
      const {root: article, conversation} = selected;
      const excerpt = window.NotebookSelection?.markdown(range, article);
      if (!excerpt?.markdown) { hide(); return; }
      const rect = range.getBoundingClientRect();
      if (rect.bottom < 64 || rect.top > innerHeight) { hide(); return; }
      snapshot = conversation ? {markdown: excerpt.markdown, kind: 'conversation',
        title: article.matches('[data-user]') ? '你的消息' : '对话内容',
        sessionId: document.querySelector('.notebook-ai')?.dataset.sessionId} : {markdown: excerpt.markdown,
        title: (article.querySelector('h1')?.textContent || document.title).replace(/¶$/, '').trim().slice(0, 100),
        url: location.pathname + location.hash};
      button.hidden = false;
      const width = button.offsetWidth || 130;
      const panel = document.querySelector('.notebook-ai:not([hidden])');
      const left = conversation && panel ? panel.getBoundingClientRect().left : 0;
      const right = !conversation && innerWidth > 900 && panel ? panel.getBoundingClientRect().left : innerWidth;
      const x = Math.max(left + 8, Math.min(right - width - 8, rect.left + rect.width / 2 - width / 2));
      let y = Math.min(innerHeight - 44, rect.bottom + 8);
      if (!conversation && innerWidth <= 900 && panel && y + 40 > panel.getBoundingClientRect().top) y = Math.max(64, rect.top - 44);
      button.style.left = `${x}px`; button.style.top = `${y}px`;
    };
    const schedule = event => {
      if (pressed || button.contains(event?.target)) return;
      clearTimeout(scheduled); scheduled = setTimeout(update, 80);
    };
    document.addEventListener('selectionchange', schedule);
    document.addEventListener('pointerup', schedule);
    document.addEventListener('pointerdown', event => { if (!button.contains(event.target)) hide(); });
    document.addEventListener('keyup', event => { if (event.key === 'Escape') hide(); else if (event.shiftKey) schedule(); });
    document.addEventListener('scroll', () => { if (!pressed) hide(); }, true);
    window.addEventListener('resize', hide);
    window.addEventListener('blur', hide);
    const ask = async detail => {
      if (!detail) return;
      hide();
      await window.NotebookAIReady;
      document.dispatchEvent(new CustomEvent('notebook:ask-selection', {detail}));
    };
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      clearTimeout(scheduled);
      // Mobile selection can collapse before click; keep the excerpt for this gesture.
      pressed = {detail: snapshot, x: event.clientX, y: event.clientY};
    });
    button.addEventListener('mousedown', event => event.preventDefault());
    button.addEventListener('pointerup', event => {
      if (!pressed || event.pointerType === 'mouse') return;
      const {detail, x, y} = pressed;
      if (Math.hypot(event.clientX - x, event.clientY - y) > 12) { hide(); return; }
      // Do not depend on a compatibility click after the native selection UI closes.
      void ask(detail);
    });
    button.addEventListener('pointercancel', hide);
    button.addEventListener('click', () => { void ask(pressed?.detail || snapshot); });
    if (typeof document$ !== 'undefined') document$.subscribe(hide);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
