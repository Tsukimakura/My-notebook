/* Selection stays on this device until the reader explicitly sends a question. */
(() => {
  const start = () => {
    if (document.querySelector('.notebook-selection-ask')) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'notebook-selection-ask'; button.hidden = true;
    button.textContent = '提问这段内容'; button.setAttribute('aria-label', '把选中的笔记内容放入提问框');
    document.body.append(button);
    let snapshot = null, pressed = null, scheduled;
    const hide = () => { clearTimeout(scheduled); button.hidden = true; snapshot = null; pressed = null; };
    const update = () => {
      const selection = window.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed || document.querySelector('.notebook-home')) { hide(); return; }
      const range = selection.getRangeAt(0);
      const article = document.querySelector('.md-content__inner');
      if (!article?.contains(range.startContainer) || !article.contains(range.endContainer)) { hide(); return; }
      const excerpt = window.NotebookSelection?.markdown(range, article);
      if (!excerpt?.markdown) { hide(); return; }
      const rect = range.getBoundingClientRect();
      if (rect.bottom < 64 || rect.top > innerHeight) { hide(); return; }
      snapshot = {markdown: excerpt.markdown,
        title: (article.querySelector('h1')?.textContent || document.title).replace(/¶$/, '').trim().slice(0, 100),
        url: location.pathname + location.hash};
      button.hidden = false;
      const width = button.offsetWidth || 130;
      const panel = document.querySelector('.notebook-ai:not([hidden])');
      const right = innerWidth > 900 && panel ? panel.getBoundingClientRect().left : innerWidth;
      const x = Math.max(8, Math.min(right - width - 8, rect.left + rect.width / 2 - width / 2));
      let y = Math.min(innerHeight - 44, rect.bottom + 8);
      if (innerWidth <= 900 && panel && y + 40 > panel.getBoundingClientRect().top) y = Math.max(64, rect.top - 44);
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
