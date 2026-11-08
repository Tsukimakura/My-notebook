/* Small, delegated enhancements survive Material's instant navigation. */
(() => {
  let mayScrollToReference = true;
  let paletteViewport = null, paletteChange = 0;
  const changePalette = input => {
    if (!input) return;
    const position = paletteViewport || {left: scrollX, top: scrollY};
    paletteViewport = position;
    const change = ++paletteChange;
    input.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (change !== paletteChange) return;
      window.scrollTo({...position, behavior: 'instant'});
      paletteViewport = null;
    }));
  };
  const settleReference = () => {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id), address = location.href;
    if (!target?.closest('.md-content')) return;
    Promise.resolve(document.fonts?.ready).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (mayScrollToReference && location.href === address && target.isConnected) target.scrollIntoView({block: 'start', behavior: 'instant'});
    })));
  };
  document.addEventListener('notebook:math-ready', settleReference);
  document.addEventListener('wheel', () => { mayScrollToReference = false; paletteViewport = null; paletteChange++; }, {passive: true});
  document.addEventListener('touchmove', () => { mayScrollToReference = false; paletteViewport = null; paletteChange++; }, {passive: true});
  const openSearch = () => {
    const toggle = document.getElementById('__search');
    if (!toggle) return;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change', {bubbles: true}));
    document.querySelector('[data-md-component="search-query"]')?.focus();
  };
  document.addEventListener('click', event => {
    const palette = event.target.closest('[data-md-component="palette"] label[for]');
    if (palette) {
      // Native label activation focuses the hidden radio and can scroll a long page.
      event.preventDefault(); changePalette(document.getElementById(palette.htmlFor));
    }
    if (event.target.closest('[data-open-search]')) openSearch();
    if (event.target.closest('[data-open-ai]')) document.querySelector('.notebook-ai-launch')?.click();
    const reference = event.target.closest('.notebook-ai a[href]');
    if (reference?.href === location.href && location.hash) { mayScrollToReference = true; settleReference(); }
  });
  document.addEventListener('keydown', event => {
    if (['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) && event.target.closest?.('[data-md-component="palette"]')) {
      const inputs = [...document.querySelectorAll('[data-md-component="palette"] input')];
      const current = inputs.findIndex(input => input.dataset.mdColorScheme === document.body.dataset.mdColorScheme);
      const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1;
      const next = inputs[(current + direction + inputs.length) % inputs.length];
      if (next) { event.preventDefault(); event.stopPropagation(); changePalette(next); next.focus({preventScroll: true}); }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); openSearch();
    }
  }, true);
  const refresh = () => {
    mayScrollToReference = true;
    settleReference();
    document.body.classList.toggle('notebook-homepage', Boolean(document.querySelector('.notebook-home')));
    for (const link of document.querySelectorAll('.notebook-topnav a')) {
      const path = new URL(link.href).pathname;
      if (path === location.pathname || (path !== '/' && location.pathname.startsWith(path))) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    const shortcut = document.querySelector('[data-search-shortcut]');
    if (shortcut && /Mac|iPhone|iPad/.test(navigator.platform)) shortcut.textContent = '⌘ K';
    const article = document.querySelector('.md-content__inner');
    article?.classList.remove('notebook-page-enter');
    if (article && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void article.offsetWidth;
      article.classList.add('notebook-page-enter');
    }
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = hash && document.getElementById(hash);
    if (target && target.closest('.md-content') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.classList.add('notebook-target');
      target.addEventListener('animationend', () => target.classList.remove('notebook-target'), {once: true});
    }
  };
  window.addEventListener('hashchange', refresh);
  if (typeof document$ !== 'undefined') document$.subscribe(refresh);
  else document.addEventListener('DOMContentLoaded', refresh);
})();
