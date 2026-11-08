/* Only public IDs from the server catalog are sent back as retrieval scopes. */
window.NotebookScope = (host, changed = () => {}) => {
  host.innerHTML = `<details><summary>检索：<span data-scope-label>全部笔记</span></summary>
    <div class="notebook-ai-actions"><button type="button" data-current-note>当前笔记</button><button type="button" data-scope-clear>全部笔记</button></div>
    <label>范围<select data-scope-mode><option value="strict">仅检索所选笔记</option><option value="prefer">优先所选，允许补充</option></select></label>
    <label>查找笔记<input type="search" data-note-search placeholder="输入课程或笔记名"></label>
    <div data-note-tree class="notebook-ai-note-tree"></div><p data-scope-status role="status"></p></details>`;
  const get = name => host.querySelector(`[data-${name}]`);
  let catalog = null, loading = null;
  let ids = [], mode = 'strict';
  const sections = new Map();
  const notify = () => {
    get('scope-label').textContent = ids.length ? `已选 ${ids.length} 项` : '全部笔记';
    changed({ids: [...ids], mode});
  };
  const check = (item, target) => {
    const label = document.createElement('label');
    label.className = 'notebook-ai-note-choice';
    const box = document.createElement('input');
    box.type = 'checkbox'; box.checked = ids.includes(item.id); box.dataset.noteId = item.id;
    box.addEventListener('change', () => {
      if (box.checked && ids.length >= 100) {
        box.checked = false; get('scope-status').textContent = '最多选择 100 项，也可以直接选择整个课程。'; return;
      }
      ids = box.checked ? [...ids, item.id] : ids.filter(id => id !== item.id);
      get('scope-status').textContent = ''; notify();
    });
    label.append(box, document.createTextNode(item.title)); target.append(label);
  };
  const render = () => {
    if (!catalog) return;
    const tree = get('note-tree'); tree.replaceChildren();
    const query = get('note-search').value.trim().toLowerCase();
    const folders = new Map();
    const folderNode = folder => {
      if (folders.has(folder.path)) return folders.get(folder.path);
      const node = document.createElement('details');
      node.open = Boolean(query);
      const heading = document.createElement('summary');
      heading.textContent = folder.title; node.append(heading);
      check({id: folder.id, title: '选择整个目录'}, node);
      folders.set(folder.path, node);
      const parent = catalog.folders.filter(p => p.path !== folder.path && folder.path.startsWith(p.path))
        .sort((a, b) => b.path.length - a.path.length)[0];
      (parent ? folderNode(parent) : tree).append(node);
      return node;
    };
    for (const page of catalog.pages) {
      const parents = catalog.folders.filter(folder => page.path.startsWith(folder.path));
      if (query && !`${page.title} ${page.path} ${parents.map(p => p.title).join(' ')}`.toLowerCase().includes(query)) continue;
      const parent = parents.sort((a, b) => b.path.length - a.path.length)[0];
      const node = document.createElement('div');
      check(page, node);
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = '选择小节'; details.append(summary);
      details.addEventListener('toggle', async () => {
        if (!details.open || details.dataset.loaded) return;
        try {
          let records = sections.get(page.id);
          if (!records) {
            const response = await fetch(`/api/notes/${page.id}`);
            if (!response.ok) throw new Error();
            records = await response.json();
            if (!Array.isArray(records)) throw new Error();
            sections.set(page.id, records);
          }
          for (const section of records) check(section, details);
          details.dataset.loaded = 'true';
        } catch { get('scope-status').textContent = '小节加载失败，请重新展开。'; }
      });
      node.append(details); (parent ? folderNode(parent) : tree).append(node);
    }
    if (!tree.children.length) tree.textContent = '没有找到笔记。';
  };
  const load = async () => {
    if (catalog) return true;
    if (loading) return loading;
    loading = (async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) throw new Error();
        const value = await response.json();
        if (!Array.isArray(value.pages) || !Array.isArray(value.folders)) throw new Error();
        catalog = value; render(); get('scope-status').textContent = ''; return true;
      } catch { get('scope-status').textContent = '笔记目录加载失败，请重新展开。'; return false; }
      finally { loading = null; }
    })();
    return loading;
  };
  host.querySelector('details').addEventListener('toggle', () => { if (host.querySelector('details').open) void load(); });
  get('note-search').addEventListener('input', render);
  get('scope-mode').addEventListener('change', () => { mode = get('scope-mode').value; notify(); });
  get('scope-clear').addEventListener('click', () => { ids = []; render(); notify(); });
  get('current-note').addEventListener('click', async () => {
    if (!await load()) return;
    const page = catalog.pages.find(p => p.path.replace(/\/$/, '') === decodeURI(location.pathname).replace(/\/$/, ''));
    if (!page) { get('scope-status').textContent = '当前页面没有可检索的笔记。'; return; }
    ids = [page.id]; render(); notify();
  });
  return {
    value: () => ({ids: [...ids], mode}),
    restore: value => {
      ids = Array.isArray(value?.ids) ? value.ids.filter(id => typeof id === 'string').slice(0, 100) : [];
      mode = value?.mode === 'prefer' ? 'prefer' : 'strict';
      get('scope-mode').value = mode; render(); notify();
    },
  };
};
