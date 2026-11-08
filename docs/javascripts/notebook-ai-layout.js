/* Responsive pointer and keyboard resizing; only numeric layout preferences persist. */
window.NotebookPanelLayout = panel => {
  const handle = panel.querySelector('[data-resize]');
  if (!handle) return;
  const mobile = window.matchMedia?.('(max-width: 900px)') || {matches: false};
  const name = 'notebook-ai.layout.v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(name)) || {}; } catch { /* Defaults work without storage. */ }
  const preferred = {};
  for (const key of ['width', 'height']) if (Number.isFinite(saved[key]) && saved[key] > 0) preferred[key] = saved[key];
  const limits = () => mobile.matches
    ? {key: 'height', min: Math.min(300, innerHeight * .85), max: innerHeight * .85, initial: innerHeight * .55}
    : {key: 'width', min: 340, max: Math.max(340, Math.min(760, innerWidth - 520)), initial: Math.min(480, innerWidth * .32)};
  const clamp = (value, bounds) => Math.round(Math.max(bounds.min, Math.min(bounds.max, value)));
  const apply = () => {
    const width = clamp(preferred.width || Math.min(480, innerWidth * .32), {min: 340, max: Math.max(340, Math.min(760, innerWidth - 520))});
    const height = clamp(preferred.height || innerHeight * .55, {min: Math.min(300, innerHeight * .85), max: innerHeight * .85});
    document.documentElement.style.setProperty('--notebook-ai-width', `${width}px`);
    document.documentElement.style.setProperty('--notebook-ai-height', `${height}px`);
    const bounds = limits(), value = bounds.key === 'height' ? height : width;
    handle.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical');
    handle.setAttribute('aria-label', mobile.matches ? '调整问答栏高度' : '调整问答栏宽度');
    handle.setAttribute('aria-valuemin', String(Math.round(bounds.min)));
    handle.setAttribute('aria-valuemax', String(Math.round(bounds.max)));
    handle.setAttribute('aria-valuenow', String(value));
  };
  const persist = () => { try { localStorage.setItem(name, JSON.stringify(preferred)); } catch { /* Page-only resizing still works. */ } };
  handle.addEventListener('keydown', event => {
    const bounds = limits();
    let direction = mobile.matches ? {ArrowUp: 1, ArrowDown: -1}[event.key] : {ArrowLeft: 1, ArrowRight: -1}[event.key];
    if (direction === undefined && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    preferred[bounds.key] = event.key === 'Home' ? bounds.min : event.key === 'End' ? bounds.max
      : Number(handle.getAttribute('aria-valuenow')) + direction * (event.shiftKey ? 48 : 16);
    preferred[bounds.key] = clamp(preferred[bounds.key], bounds); apply(); persist();
  });
  handle.addEventListener('dblclick', () => { delete preferred[limits().key]; apply(); persist(); });
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    const bounds = limits(), rect = panel.getBoundingClientRect();
    const start = mobile.matches ? event.clientY : event.clientX;
    const initial = mobile.matches ? rect.height : rect.width;
    document.body.classList.add('notebook-ai-resizing');
    const move = next => {
      if (next.pointerId !== event.pointerId) return;
      const position = bounds.key === 'height' ? next.clientY : next.clientX;
      preferred[bounds.key] = clamp(initial + start - position, bounds); apply();
    };
    const end = next => {
      if (next?.pointerId !== undefined && next.pointerId !== event.pointerId) return;
      window.removeEventListener('blur', end);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end); document.removeEventListener('pointercancel', end);
      document.body.classList.remove('notebook-ai-resizing'); persist();
    };
    window.addEventListener('blur', end);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);
  });
  window.addEventListener('resize', apply);
  mobile.addEventListener?.('change', apply);
  apply();
};
