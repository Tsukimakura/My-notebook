/* Attachments stay in tab memory. Only names, never file contents, enter history storage. */
window.NotebookAttachments = (panel, session, changed = () => {}, sessions = () => [session()]) => {
  const get = name => panel.querySelector(`[data-${name}]`);
  const types = {'png':'image/png', 'jpg':'image/jpeg', 'jpeg':'image/jpeg', 'webp':'image/webp', 'pdf':'application/pdf', 'txt':'text/plain', 'md':'text/markdown'};
  let queue = Promise.resolve(), busy = 0;
  const read = blob => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('无法读取附件。')); reader.readAsDataURL(blob);
  });
  const image = async (file, mime) => {
    const url = await read(new Blob([file], {type: mime}));
    const picture = new Image();
    await new Promise((resolve, reject) => { picture.onload = resolve; picture.onerror = () => reject(new Error('图片损坏或格式不支持。')); picture.src = url; });
    if (picture.naturalWidth * picture.naturalHeight > 8000000 || Math.max(picture.naturalWidth, picture.naturalHeight) > 8192) throw new Error('图片最多 800 万像素；请先缩小图片。');
    const scale = Math.min(1, 1600 / Math.max(picture.naturalWidth, picture.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(picture.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(picture.naturalHeight * scale));
    const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(picture, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL('image/jpeg', .85);
    if (result.length > 1400000) throw new Error('图片压缩后仍过大，请裁剪后重试。');
    return result;
  };
  const render = () => {
    const files = session()?._attachments || [];
    get('attachments').hidden = !files.length;
    if (!files.length) get('attachments').open = false;
    get('attachment-count').textContent = `附件 ${files.length} · 后续继续发送`;
    get('attachment-list').replaceChildren();
    for (const [index, file] of files.entries()) {
      const row = document.createElement('div'); row.className = 'notebook-ai-attachment';
      if (file.data_url.startsWith('data:image/jpeg;')) {
        const img = document.createElement('img'); img.src = file.data_url; img.alt = file.name; row.append(img);
      }
      const name = document.createElement('span'); name.textContent = file.name; row.append(name);
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '移除'; remove.setAttribute('aria-label', `移除 ${file.name}`);
      remove.addEventListener('click', () => { session()._attachments.splice(index, 1); render(); changed(); });
      row.append(remove); get('attachment-list').append(row);
    }
    get('attach').textContent = files.length ? `附件 ${files.length}` : '附件';
  };
  const add = files => {
    const target = session();
    if (!target) return Promise.resolve();
    busy++; changed();
    queue = queue.then(async () => {
      const previous = target._attachments || [];
      if (files.length + previous.length > 4) throw new Error('最多 4 个附件，请先移除不需要的文件。');
      const additions = [];
      for (const file of files) {
        const extension = file.name.split('.').pop().toLowerCase();
        const mime = types[extension] || (Object.values(types).includes(file.type) ? file.type : null);
        if (!mime || extension === 'svg' || file.type === 'image/svg+xml') throw new Error('支持 PNG、JPEG、WebP、PDF、TXT 和 Markdown；不支持 SVG 或可执行文件。');
        if (!file.size || file.size > 4 * 1024 * 1024) throw new Error('单个附件最多 4 MiB。');
        const name = file.name.replace(/[\\/\x00-\x1f]/g, '_').slice(0, 120) || 'attachment';
        const data_url = mime.startsWith('image/') ? await image(file, mime) : await read(new Blob([file], {type:mime}));
        additions.push({name, data_url});
      }
      const combined = [...previous, ...additions];
      const size = files => files.reduce((sum, file) => sum + file.data_url.split(',')[1].length * 3 / 4, 0);
      if (size(combined) > 8 * 1024 * 1024) throw new Error('附件合计最多 8 MiB。');
      const other = [...sessions()].filter(item => item !== target).reduce((sum, item) => sum + size(item?._attachments || []), 0);
      if (other + size(combined) > 16 * 1024 * 1024) throw new Error('本标签页附件暂存最多 16 MiB，请先移除其他对话的附件。');
      target._attachments = combined;
      if (target === session()) render();
    }).catch(error => { if (target === session()) get('status').textContent = error.message; })
      .finally(() => { busy--; changed(); });
    return queue;
  };
  get('attach').addEventListener('click', () => get('attachment-input').click());
  get('attachment-input').addEventListener('change', event => { void add([...event.target.files]); event.target.value = ''; });
  get('question').addEventListener('paste', event => {
    const files = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith('image/'));
    if (files.length) { event.preventDefault(); void add(files); }
  });
  get('chat-form').addEventListener('dragover', event => { if (event.dataTransfer?.types.includes('Files')) event.preventDefault(); });
  get('chat-form').addEventListener('drop', event => {
    const files = [...(event.dataTransfer?.files || [])];
    if (files.length) { event.preventDefault(); void add(files); }
  });
  return {render, add, get busy() { return busy > 0; }, files: () => session()?._attachments || []};
};
