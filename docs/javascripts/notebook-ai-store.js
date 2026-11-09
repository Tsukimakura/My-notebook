/* Conversation records only. Credentials are deliberately outside this database. */
window.NotebookConversations = (() => {
  const text = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
  const cleanScope = value => ({ids: Array.isArray(value?.ids) ? value.ids.filter(id => /^[a-f0-9]{24}$/.test(id)).slice(0, 100) : [],
    mode: value?.mode === 'prefer' ? 'prefer' : 'strict'});
  const quote = value => {
    if (!value || typeof value.markdown !== 'string' || !value.markdown.trim() || value.markdown.length > 2200) return null;
    let url = '';
    try {
      const parsed = new URL(value.url, location.origin);
      if (typeof value.url === 'string' && value.url.startsWith('/') && !value.url.startsWith('//')
          && value.url.length <= 800 && parsed.origin === location.origin) url = value.url;
    } catch { /* Keep the excerpt even if its old source URL is no longer valid. */ }
    return {markdown: value.markdown, title: text(value.title, 100), url};
  };
  const sources = value => (Array.isArray(value) ? value : []).slice(0, 32).filter(source =>
    Number.isInteger(source?.id) && typeof source.url === 'string' && source.url.startsWith('/') && !source.url.startsWith('//'))
    .map(source => ({id: source.id, title: text(source.title, 500), url: text(source.url, 2000), outside_scope: source.outside_scope === true}));
  const figures = value => (Array.isArray(value) ? value : []).slice(0, 4).flatMap(file => {
    try {
      const url = new URL(file?.url, location.origin);
      if (typeof file.url !== 'string' || !file.url.startsWith('/') || file.url.startsWith('//')
          || url.origin !== location.origin || url.search || url.hash || url.pathname.startsWith('/api/')
          || !/\.(png|jpe?g|webp)$/i.test(url.pathname)) return [];
      return [{url: url.pathname, caption: text(file.caption, 300), source_id: Number.isInteger(file.source_id) ? file.source_id : 0}];
    } catch { return []; }
  });
  const usage = value => Object.fromEntries(['input_tokens', 'output_tokens', 'reasoning_tokens']
    .filter(key => Number.isSafeInteger(value?.[key]) && value[key] >= 0 && value[key] <= 1000000000).map(key => [key, value[key]]));
  const response = value => ({content: text(value.content, 262144), sources: sources(value.sources),
    truncated: value.truncated === true, finish_reason: text(value.finish_reason, 30), figures: figures(value.figures), continuation: text(value.continuation, 600065), usage: usage(value.usage)});
  const request = value => {
    if (!value || !['openai', 'deepseek', 'anthropic'].includes(value.provider)
        || typeof value.model !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(value.model)
        || typeof value.question !== 'string' || !value.question.trim() || value.question.length > 4000) return null;
    const history = value.history || [];
    if (!Array.isArray(history) || history.length > 6 || history.length % 2 || history.some((item, i) =>
        item?.role !== (i % 2 ? 'assistant' : 'user') || typeof item.content !== 'string' || !item.content || item.content.length > 4000)
        || history.reduce((size, item) => size + item.content.length, 0) > 8000) return null;
    const result = {provider: value.provider, model: value.model, question: value.question,
      history: history.map(item => ({role: item.role, content: item.content}))};
    if (value.requires_attachments === true) result.requires_attachments = true;
    if (value.note_images === true) result.note_images = true;
    if (value.scope) result.scope = cleanScope(value.scope);
    if (value.memory) result.memory = {summary: text(value.memory.summary, 2000), notes: text(value.memory.notes, 2000)};
    return result;
  };
  const clean = value => {
    if (!value || !/^[a-f0-9]{32}$/.test(value.id) || !Array.isArray(value.messages)
        || value.messages.length > 2000 || !['openai', 'deepseek', 'anthropic'].includes(value.provider)) throw new Error('会话格式不正确。');
    const now = Date.now();
    return {id: value.id, title: text(value.title, 100) || '新对话', provider: value.provider,
      model: text(value.model, 100), scope: cleanScope(value.scope), draftQuote: quote(value.draftQuote), draft: text(value.draft, 4000),
      createdAt: Number.isFinite(value.createdAt) ? Math.min(now, value.createdAt) : now,
      updatedAt: Number.isFinite(value.updatedAt) ? Math.min(now, value.updatedAt) : now,
      revision: Number.isSafeInteger(value.revision) && value.revision >= 0 ? value.revision : 0,
      summary: text(value.summary, 2000), summaryThrough: Number.isSafeInteger(value.summaryThrough) ? Math.min(Math.floor(value.messages.length / 2), Math.max(0, value.summaryThrough)) : 0,
      messages: value.messages.map(message => {
        if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string'
            || message.content.length > 262144) throw new Error('消息格式不正确。');
        const result = {role: message.role, content: message.content, failed: message.failed === true,
          pending: message.pending === true, quote: quote(message.quote), truncated: message.truncated === true,
          finish_reason: text(message.finish_reason, 30), scope: cleanScope(message.scope), sources: sources(message.sources)};
        result.figures = figures(message.figures);
        result.continuation = text(message.continuation, 600065);
        result.usage = usage(message.usage);
        result.files = (Array.isArray(message.files) ? message.files : []).slice(0, 4).map(file => ({name: text(file?.name, 120)}));
        if (message.role === 'user') result.request = request(message.request);
        if (message.role === 'assistant' && Array.isArray(message.versions)) {
          const versions = message.versions.filter(version => typeof version?.content === 'string' && version.content.length <= 262144).slice(0, 10).map(response);
          if (versions.length) {
            result.versions = versions;
            result.version = Math.max(0, Math.min(versions.length - 1, Number.isInteger(message.version) ? message.version : versions.length - 1));
            Object.assign(result, versions[result.version]);
          }
        }
        return result;
      })};
  };
  const preferencesRecord = value => ({id: 'preferences', keepDays: [30, 90].includes(value?.keepDays) ? value.keepDays : 0,
    notes: text(value?.notes, 2000), autoSummary: value?.autoSummary === true});
  const uid = () => [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
  const open = async () => {
    let db = null;
    try {
      db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('notebook-ai-conversations', 1);
        request.onupgradeneeded = () => {
          request.result.createObjectStore('sessions', {keyPath: 'id'});
          request.result.createObjectStore('settings', {keyPath: 'id'});
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = request.onblocked = () => reject(new Error('浏览器未允许保存对话。'));
      });
      db.onversionchange = () => db.close();
    } catch { /* Private or restricted browsers can still use page memory. */ }
    const ram = new Map(), meta = new Map();
    const transaction = (store, mode, action) => new Promise((resolve, reject) => {
      if (!db) {
        try { resolve(action(null, store === 'sessions' ? ram : meta)); } catch (error) { reject(error); }
        return;
      }
      const tx = db.transaction(store, mode);
      let value;
      tx.oncomplete = () => resolve(value);
      tx.onerror = tx.onabort = () => reject(tx.notebookError || tx.error || new Error('对话保存失败。'));
      action(tx.objectStore(store), null, result => { value = result; }, tx);
    });
    const getAll = () => transaction('sessions', 'readonly', (store, memory, done) => {
      if (memory) return [...memory.values()].map(value => structuredClone(value));
      store.getAll().onsuccess = event => done(event.target.result);
    });
    const settings = async value => {
      if (value !== undefined) {
        const record = preferencesRecord(value);
        await transaction('settings', 'readwrite', (store, memory) => memory ? memory.set(record.id, record) : store.put(record));
        return record;
      }
      return preferencesRecord(await transaction('settings', 'readonly', (store, memory, done) => {
        if (memory) return memory.get('preferences');
        store.get('preferences').onsuccess = event => done(event.target.result);
      }));
    };
    return {
      get persistent() { return Boolean(db); }, fallback: () => { db?.close(); db = null; }, close: () => db?.close(), uid, clean, settings,
      list: async () => {
        const preferences = await settings();
        const records = await getAll();
        const visible = [];
        for (const record of records) {
          if (preferences.keepDays && Date.now() - record.updatedAt >= preferences.keepDays * 86400000) {
            await transaction('sessions', 'readwrite', (store, memory) => memory ? memory.delete(record.id) : store.delete(record.id));
          } else {
            try { visible.push(clean(record)); } catch { /* Ignore malformed imported or obsolete records. */ }
          }
        }
        return visible.sort((a, b) => b.updatedAt - a.updatedAt);
      },
      save: async value => {
        const record = clean(value);
        return transaction('sessions', 'readwrite', (store, memory, done, tx) => {
          const put = previous => {
            if ((previous && previous.revision !== record.revision) || (!previous && record.revision !== 0)) {
              if (tx) { tx.notebookError = new Error('此对话已在其他标签页更新，请刷新后再继续。'); tx.abort(); }
              else throw new Error('此对话已在其他标签页更新，请刷新后再继续。');
              return;
            }
            const updated = {...record, revision: record.revision + 1};
            if (memory) { memory.set(record.id, structuredClone(updated)); return updated; }
            store.put(updated); done(updated);
          };
          if (memory) return put(memory.get(record.id));
          store.get(record.id).onsuccess = event => put(event.target.result);
        });
      },
      remove: id => transaction('sessions', 'readwrite', (store, memory) => memory ? memory.delete(id) : store.delete(id)),
      clear: () => transaction('sessions', 'readwrite', (store, memory) => memory ? memory.clear() : store.clear()),
      import: async data => {
        if (data?.version !== 1 || !Array.isArray(data.sessions) || data.sessions.length > 100) throw new Error('请选择本站导出的会话文件（每次最多 100 个会话）。');
        // Validate everything before writing anything; imported IDs never overwrite live sessions.
        const records = data.sessions.map(value => clean({...value, id: uid(), revision: 0}));
        for (const record of records) for (const message of record.messages) {
          if (message.pending) { message.pending = false; message.failed = true; }
        }
        await transaction('sessions', 'readwrite', (store, memory) => {
          for (const record of records) {
            record.revision = 1;
            if (memory) memory.set(record.id, structuredClone(record)); else store.put(record);
          }
        });
        return records;
      },
    };
  };
  return {open, uid, clean, quote, request, figures};
})();
