/* Small, delegated enhancements survive Material's instant navigation. */
(() => {
  const openSearch = () => {
    const toggle = document.getElementById('__search');
    if (!toggle) return;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change', {bubbles: true}));
    document.querySelector('[data-md-component="search-query"]')?.focus();
  };
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-search]')) openSearch();
    if (event.target.closest('[data-open-ai]')) document.querySelector('.notebook-ai-launch')?.click();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); openSearch();
    }
  });
  const refresh = () => {
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
