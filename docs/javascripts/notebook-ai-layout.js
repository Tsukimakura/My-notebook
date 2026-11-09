/* Desktop split view; mobile uses the visible viewport as a dedicated chat view. */
window.NotebookPanelLayout = panel => {
  const handle = panel.querySelector('[data-resize]');
  if (!handle) return;
  const mobile = window.matchMedia?.('(max-width: 900px)') || {matches: false};
  const name = 'notebook-ai.layout.v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(name)) || {}; } catch { /* Defaults work without storage. */ }
  let preferred = Number.isFinite(saved.width) && saved.width > 0 ? saved.width : null;
  const root = document.documentElement.style;
  const bounds = () => ({min: 320, max: Math.max(320, Math.min(760, innerWidth - 480))});
  const clamp = value => Math.round(Math.max(bounds().min, Math.min(bounds().max, value)));
  const width = () => clamp(preferred || Math.min(480, innerWidth * .34));
  const apply = () => {
    root.setProperty('--notebook-ai-width', `${width()}px`);
    handle.hidden = mobile.matches;
    handle.setAttribute('aria-orientation', 'vertical');
    handle.setAttribute('aria-label', '调整问答栏宽度');
    handle.setAttribute('aria-valuemin', String(bounds().min));
    handle.setAttribute('aria-valuemax', String(bounds().max));
    handle.setAttribute('aria-valuenow', String(width()));
    const viewport = window.visualViewport;
    root.setProperty('--notebook-ai-viewport-height', `${viewport?.height || innerHeight}px`);
    root.setProperty('--notebook-ai-viewport-top', `${viewport?.offsetTop || 0}px`);
  };
  const persist = () => {
    try { localStorage.setItem(name, JSON.stringify(preferred ? {width: preferred} : {})); } catch { /* Page-only resizing still works. */ }
  };
  handle.addEventListener('keydown', event => {
    if (mobile.matches || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    preferred = clamp(event.key === 'Home' ? bounds().min : event.key === 'End' ? bounds().max
      : width() + (event.key === 'ArrowLeft' ? 1 : -1) * (event.shiftKey ? 48 : 16));
    apply(); persist();
  });
  handle.addEventListener('dblclick', () => { preferred = null; apply(); persist(); });
  let cancelDrag = () => {};
  handle.addEventListener('pointerdown', event => {
    if (mobile.matches || event.button !== 0) return;
    event.preventDefault();
    cancelDrag();
    const initial = panel.getBoundingClientRect().width, start = event.clientX;
    let latest = initial, frame = null;
    document.body.classList.add('notebook-ai-resizing');
    handle.setPointerCapture?.(event.pointerId);
    const flush = () => {
      frame = null;
      preferred = clamp(latest);
      // One geometry write per frame; no storage or layout reads during movement.
      root.setProperty('--notebook-ai-width', `${preferred}px`);
      handle.setAttribute('aria-valuenow', String(preferred));
    };
    const move = next => {
      if (next.pointerId !== event.pointerId) return;
      latest = initial + start - next.clientX;
      if (frame === null) frame = requestAnimationFrame(flush);
    };
    const end = next => {
      if (next?.pointerId !== undefined && next.pointerId !== event.pointerId) return;
      if (next?.type === 'pointerup') latest = initial + start - next.clientX;
      if (frame !== null) cancelAnimationFrame(frame);
      flush();
      window.removeEventListener('blur', end);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', end);
      handle.removeEventListener('lostpointercapture', end);
      if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      document.body.classList.remove('notebook-ai-resizing');
      cancelDrag = () => {};
      persist();
    };
    cancelDrag = end;
    window.addEventListener('blur', end);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
    handle.addEventListener('lostpointercapture', end);
  });
  let viewportFrame = null;
  const refresh = () => {
    cancelDrag();
    if (viewportFrame === null) viewportFrame = requestAnimationFrame(() => { viewportFrame = null; apply(); });
  };
  window.addEventListener('resize', refresh);
  window.visualViewport?.addEventListener('resize', refresh);
  window.visualViewport?.addEventListener('scroll', refresh);
  mobile.addEventListener?.('change', refresh);
  apply();
};
