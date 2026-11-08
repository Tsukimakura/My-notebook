/* BYOK credentials are saved only by explicit settings, with a fixed expiry. */
document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector(".notebook-ai")) return;
  let ready;
  window.NotebookAIReady = new Promise(resolve => { ready = resolve; });
  const launch = document.createElement("button");
  launch.className = "notebook-ai-launch";
  launch.textContent = "问笔记";
  launch.type = "button";
  launch.disabled = true;
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "notebook-ai");
  const panel = document.createElement("aside");
  panel.id = "notebook-ai";
  panel.hidden = true;
  panel.className = "notebook-ai";
  panel.setAttribute("aria-label", "笔记 AI 助手");
  // Fixed markup only; model Markdown is parsed and sanitized separately.
  panel.innerHTML = `
    <div class="notebook-ai-heading"><h2>问笔记</h2><div>
      <button type="button" data-settings aria-expanded="false">设置</button>
      <button type="button" data-new>新对话</button>
      <button type="button" data-close aria-label="收起对话栏">×</button>
    </div></div>
    <div class="notebook-ai-session-bar"><label>对话<select data-session aria-label="切换对话"></select></label>
      <details><summary>管理</summary>
        <label>名称<input data-session-title maxlength="100"></label>
        <label>记录保存<select data-history-days><option value="0">一直保留</option><option value="30">30 天无新消息后删除</option><option value="90">90 天无新消息后删除</option></select></label>
        <div class="notebook-ai-actions"><button type="button" data-delete-session>删除此对话</button><button type="button" data-export>导出全部</button><button type="button" data-import>导入</button><button type="button" data-clear-sessions>清空全部</button></div>
        <input type="file" data-import-file accept="application/json,.json" hidden>
        <p>记录保存在此浏览器，清除网站数据会删除记录。导出文件不含 API key。</p>
      </details></div>
    <p data-session-status role="status"></p>
    <p data-summary class="notebook-ai-summary"></p>
    <section data-settings-view hidden aria-label="AI 设置">
    <form data-settings-form autocomplete="off">
      <label>供应商<select data-provider><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option><option value="anthropic">Anthropic</option></select></label>
      <label>常用模型<select data-model-choice aria-describedby="notebook-ai-model-note"></select></label>
      <label>模型 ID（可手动修改）<input data-model required maxlength="100" placeholder="选择上方模型，或填写账户可用的模型 ID" autocomplete="off" spellcheck="false" aria-describedby="notebook-ai-model-note"></label>
      <p id="notebook-ai-model-note" data-model-note></p>
      <details><summary>模型 ID 是什么？到哪里查看？</summary>
        <p>模型 ID 是 API 调用时识别模型的名称，需要与官方文档中的写法完全一致。打开当前供应商的 <a data-model-docs target="_blank" rel="noopener noreferrer">官方模型目录</a>，复制其中的 API 模型 ID；不要复制网页聊天产品的显示名称或其他平台的 ID。</p>
        <p>也可以按 <a data-model-api-docs target="_blank" rel="noopener noreferrer">官方模型列表 API 文档</a>，使用自己的 key 查询 <code data-model-endpoint></code>，查看返回的 <code>data[].id</code>。请在自己信任的本地工具中操作，不要把 key 粘贴到第三方查询网站。</p>
        <p>常用列表由站点维护者定期更新，不代表当前 key 一定有权限。未列出的模型可选择“自定义”后手动输入；实际可用性、价格及接口支持以供应商和账户为准。</p>
      </details>
      <label>API key<input data-key type="password" required maxlength="512" autocomplete="off" spellcheck="false"></label>
      <label>密钥保存时间<select data-retention>
        <option value="session">临时：当前标签页，最多 2 小时</option>
        <option value="7">在此浏览器记住 7 天</option>
        <option value="30">在此浏览器记住 30 天</option>
      </select></label>
      <p>默认临时保存。7 天和 30 天会把 key 保存到此设备的浏览器中，同源脚本可以读取；请只在自己的设备上启用。到期不再使用，下次打开时清除。收起对话栏不会清除 key。</p>
      <details><summary>密钥、隐私与费用说明</summary>
        <p>key 经 HTTPS、Cloudflare 和本站后端转发给所选供应商；后端不将 key、问题或回答写入磁盘或应用日志。任务生成最多持续 4 分钟，结果仅在内存中暂存，完成后 2 分钟过期并定期清除，便于网络恢复后查询。</p>
        <p>每次提问通常调用两次模型，回答生成预算上限为 8,192 tokens（推理模型可能将思考计入预算），详细回答可能花费更多时间和费用。当前问题、最近几轮对话及检索到的公开笔记片段会发送给供应商，供应商的数据处理政策仍然适用。</p>
        <p>聊天记录保存在此浏览器，不自动同步到其他设备。不要输入其他密码、服务器凭据或敏感个人信息。</p>
      </details>
      <label class="notebook-ai-consent"><input type="checkbox" data-consent required>我了解密钥保存与转发、对话发送和费用说明</label>
      <div class="notebook-ai-actions"><button type="submit" data-save>保存设置</button><button type="button" data-clear>清除已保存 key</button></div>
    </form>
    <p data-settings-status role="status"></p>
    </section>
    <section data-chat-view class="notebook-ai-chat" aria-label="笔记对话">
    <div class="notebook-ai-tools">
    <div data-note-scope></div>
    <details data-memory-view class="notebook-ai-memory"><summary>记忆</summary>
      <label>这段对话的记忆<textarea data-session-memory maxlength="2000" rows="3" placeholder="旧对话的摘要，也可以自己填写"></textarea></label>
      <div class="notebook-ai-actions"><button type="button" data-summarize>整理旧对话</button><button type="button" data-clear-memory>清除这段记忆</button></div>
      <label>所有对话使用的学习偏好<textarea data-learning-notes maxlength="2000" rows="2" placeholder="例如：先讲直觉，再给出推导"></textarea></label>
      <label class="notebook-ai-consent"><input type="checkbox" data-auto-summary>自动整理旧对话（会额外调用模型）</label>
      <p>记忆和学习偏好会随问题发送给所选供应商。整理只处理旧对话，近期问答仍直接保留。</p>
    </details></div>
    <button type="button" data-earlier hidden>查看更早的消息</button>
    <div data-messages class="notebook-ai-messages" aria-label="对话记录">
      <p>根据笔记提问，也可以继续追问。回答中的笔记链接会在左侧打开。</p>
    </div>
    <p data-status role="status" aria-live="polite"></p>
    <form data-chat-form autocomplete="off">
      <label>你的问题<textarea data-question required maxlength="4000" rows="3" placeholder="例如：条件概率和事件独立有什么区别？"></textarea></label>
      <div class="notebook-ai-actions"><button type="submit" data-submit>发送</button><button type="button" data-stop hidden>停止等待</button><button type="button" data-continue hidden>准备续写</button></div>
    </form></section>`;
  document.body.append(launch, panel);
  const get = name => panel.querySelector(`[data-${name}]`);
  let current = null, database = null, visibleCount = 40, restoring = false;
  let sessionPreferences = {keepDays: 0, notes: '', autoSummary: false};
  const conversations = new Map(), running = new Map();
  let writes = Promise.resolve();
  const noteScope = window.NotebookScope?.(get("note-scope"), value => {
    if (current && !restoring) { current.scope = value; void persist(current); }
  });
  const persist = session => {
    if (!database || !conversations.has(session.id)) return writes;
    // Serialize writes, reading the latest revision when each queued write starts.
    writes = writes.then(async () => {
      if (!conversations.has(session.id)) return;
      const saved = await database.save(session);
      session.revision = saved.revision;
    }).catch(error => {
      get("session-status").textContent = error.name === "QuotaExceededError" ? "浏览器空间不足，请先导出对话。"
        : error.name === "Error" ? error.message : "保存失败，请导出对话后再刷新。";
    });
    return writes;
  };
  window.NotebookAIFlush = () => writes;
  const historyTurns = session => {
    const result = [];
    for (let i = 1; i < session.messages.length; i++) {
      const user = session.messages[i - 1], answer = session.messages[i];
      if (user.role === "user" && !user.failed && answer.role === "assistant") result.push({question: user.content, answer: answer.content});
    }
    return result;
  };
  let pending = null;
  let turns = [];
  let lastIncomplete = false;
  let credential = null;
  let expiryTimer = null;
  const credentialName = "notebook-ai.credentials.v1";
  const preferenceName = "notebook-ai.preferences.v1";
  const providers = ["openai", "deepseek", "anthropic"];
  const modelCatalog = window.NOTEBOOK_AI_MODELS || {};
  const syncModelChoice = () => {
    const value = get("model").value.trim();
    const known = [...get("model-choice").options].some(option => option.value === value);
    get("model-choice").value = value && known ? value : value ? "custom" : "";
  };
  const showModels = provider => {
    const catalog = modelCatalog[provider];
    get("model-choice").replaceChildren(new Option("请选择模型", ""));
    for (const model of catalog?.models || []) {
      get("model-choice").add(new Option(`${model.name} · ${model.id}`, model.id));
    }
    get("model-choice").add(new Option("自定义：手动输入模型 ID", "custom"));
    get("model-note").textContent = catalog
      ? `列表核对日期：${catalog.checked}。选择后仍可修改 ID，保存设置后生效。`
      : "常用列表暂不可用，仍可手动输入模型 ID。";
    // Links come only from the shipped public catalog, never from model output.
    for (const [name, url] of [["model-docs", catalog?.docs], ["model-api-docs", catalog?.apiDocs]]) {
      if (url) get(name).href = url;
      else get(name).removeAttribute("href");
    }
    get("model-endpoint").textContent = catalog?.endpoint || "供应商的模型列表接口";
    syncModelChoice();
  };
  get("model-choice").addEventListener("change", () => {
    const choice = get("model-choice").value;
    if (choice === "custom") {
      get("model").focus();
      get("model").select();
    } else get("model").value = choice;
  });
  get("model").addEventListener("input", syncModelChoice);
  const storage = (area, action, name, value) => {
    try { return window[area][action](name, value); } catch { return null; }
  };
  const read = (area, name) => {
    try { return JSON.parse(storage(area, "getItem", name)); } catch { return null; }
  };
  const saved = read("localStorage", preferenceName);
  const preferences = {provider: providers.includes(saved?.provider) ? saved.provider : "openai",
    models: {}, retention: ["session", "7", "30"].includes(saved?.retention) ? saved.retention : "session"};
  for (const provider of providers) {
    if (typeof saved?.models?.[provider] === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(saved.models[provider])) {
      preferences.models[provider] = saved.models[provider];
    }
  }
  const summary = () => {
    get("summary").textContent = `${preferences.provider} · ${preferences.models[preferences.provider] || "请设置模型"} · ${credential?.provider === preferences.provider ? "key 已就绪" : "请在设置中填写 key"}`;
  };
  const forget = (all = true) => {
    const previous = credential;
    credential = null;
    clearTimeout(expiryTimer);
    for (const area of ["sessionStorage", "localStorage"]) {
      const stored = read(area, credentialName);
      if (all || (area === previous?.area && stored?.expiresAt === previous.expiresAt && stored?.key === previous.key)) {
        storage(area, "removeItem", credentialName);
      }
    }
    get("key").value = "";
    get("consent").checked = false;
    summary();
  };
  const scheduleExpiry = () => {
    clearTimeout(expiryTimer);
    if (credential) expiryTimer = setTimeout(() => {
      // Browser timers are capped at ~24.8 days; recheck before expiring 30-day keys.
      if (credential && credential.expiresAt > Date.now()) { scheduleExpiry(); return; }
      forget(false);
      get("settings-status").textContent = "已保存的 key 到期，请重新填写。";
    }, Math.min(credential.expiresAt - Date.now(), 2147483647));
  };
  for (const area of ["sessionStorage", "localStorage"]) {
    const value = read(area, credentialName);
    if (value && providers.includes(value.provider) && typeof value.key === "string"
        && /^[!-~]{8,512}$/.test(value.key) && value.consent === true
        && Number.isFinite(value.expiresAt) && value.expiresAt > Date.now()
        && value.expiresAt <= Date.now() + 30 * 86400000) {
      if (value.provider === preferences.provider) credential = {...value, area};
    } else storage(area, "removeItem", credentialName);
  }
  get("provider").value = preferences.provider;
  get("model").value = preferences.models[preferences.provider] || "";
  showModels(preferences.provider);
  get("retention").value = preferences.retention;
  get("key").value = credential?.key || "";
  get("consent").checked = Boolean(credential);
  summary();
  scheduleExpiry();
  const showSettings = show => {
    get("settings-view").hidden = !show;
    get("chat-view").hidden = show;
    get("settings").setAttribute("aria-expanded", String(show));
    get("settings").textContent = show ? "返回对话" : "设置";
  };
  const showPanel = show => {
    panel.hidden = !show;
    document.body.classList.toggle("notebook-ai-open", show);
    launch.hidden = show;
    launch.setAttribute("aria-expanded", String(show));
  };
  launch.addEventListener("click", () => {
    showPanel(true);
    if (!credential || !preferences.models[preferences.provider]) showSettings(true);
  });
  get("close").addEventListener("click", () => { showPanel(false); launch.focus(); });
  get("settings").addEventListener("click", () => showSettings(get("settings-view").hidden));
  get("clear").addEventListener("click", () => {
    forget();
    get("settings-status").textContent = "已清除浏览器和当前页面保存的 key。";
  });
  get("new").addEventListener("click", () => { activate(newSession()); });
  get("provider").addEventListener("change", () => {
    get("key").value = get("provider").value === credential?.provider ? credential.key : "";
    get("model").value = preferences.models[get("provider").value] || "";
    showModels(get("provider").value);
    get("consent").checked = false;
  });
  get("settings-form").addEventListener("submit", event => {
    event.preventDefault();
    if (pending) return;
    const provider = get("provider").value;
    const model = get("model").value.trim();
    const key = get("key").value.trim();
    if (!providers.includes(provider) || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(model)
        || !/^[!-~]{8,512}$/.test(key) || !get("consent").checked) {
      get("settings-status").textContent = "请填写有效的模型 ID 和 key，并确认隐私与费用说明。";
      return;
    }
    const changed = provider !== preferences.provider || model !== preferences.models[preferences.provider];
    forget();
    preferences.provider = provider;
    preferences.models[provider] = model;
    preferences.retention = ["7", "30"].includes(get("retention").value) ? get("retention").value : "session";
    storage("localStorage", "setItem", preferenceName, JSON.stringify(preferences));
    const duration = preferences.retention === "session" ? 2 * 3600000 : Number(preferences.retention) * 86400000;
    const area = preferences.retention === "session" ? "sessionStorage" : "localStorage";
    credential = {provider, key, consent: true, expiresAt: Date.now() + duration, area};
    const value = JSON.stringify(credential);
    storage(area, "setItem", credentialName, value);
    const stored = storage(area, "getItem", credentialName) === value;
    get("key").value = key;
    get("consent").checked = true;
    scheduleExpiry();
    summary();
    get("settings-status").textContent = stored ? "设置已保存。" : "浏览器禁止存储，key 仅在本页暂存，刷新后需重新填写。";
    if (changed && current.messages.length) activate(newSession());
    else if (current.provider !== provider || current.model !== model) {
      current.provider = provider; current.model = model;
      void persist(current); refreshSessions();
    }
    showSettings(false);
    get("status").textContent = stored ? "设置已保存，可以开始提问。" : get("settings-status").textContent;
    get("question").focus();
  });
  window.addEventListener("storage", event => {
    if ((event.key === credentialName || event.key === null) && credential?.area === "localStorage") {
      // Do not remove a new value just written by another tab (no storage-event loop).
      credential = null;
      clearTimeout(expiryTimer);
      get("key").value = "";
      get("consent").checked = false;
      summary();
      get("settings-status").textContent = "其他标签页更改了密钥，请刷新或重新设置。";
    }
  });
  const safeURL = (value) => {
    if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return null;
    const url = new URL(value, location.origin);
    return url.origin === location.origin ? url.href : null;
  };
  const markdown = typeof window.markdownit === "function" ? window.markdownit({
    html: false, linkify: false, breaks: true, maxNesting: 20,
  }).disable("image") : null;
  if (markdown) {
    // Answer links stay on this site. References use URLs from our source index.
    markdown.validateLink = (value) => {
      try {
        const url = new URL(value, location.origin);
        return url.origin === location.origin && !url.username && !url.password
          && ["http:", "https:"].includes(url.protocol);
      } catch { return false; }
    };
    const closingAt = (text, delimiter, from) => {
      let end = text.indexOf(delimiter, from);
      while (end >= 0) {
        let slashes = 0;
        for (let i = end - 1; i >= 0 && text[i] === "\\"; i--) slashes++;
        if (slashes % 2 === 0) return end;
        end = text.indexOf(delimiter, end + delimiter.length);
      }
      return -1;
    };
    const mathPlaceholder = (tokens, index, options, env) => {
      const token = tokens[index];
      const id = env.math.push({source: token.content, display: token.meta.display}) - 1;
      const tag = token.block ? "div" : "span";
      return `<${tag} class="notebook-ai-math" data-math-index="${id}"></${tag}>`;
    };
    // Parse math before Markdown can consume its backslashes or underscores.
    markdown.inline.ruler.before("escape", "notebook_math", (state, silent) => {
      const rest = state.src.slice(state.pos);
      const open = ["\\(", "\\[", "$$", "$"].find(marker => rest.startsWith(marker));
      if (!open) return false;
      const close = open === "\\(" ? "\\)" : open === "\\[" ? "\\]" : open;
      const start = state.pos + open.length;
      const end = closingAt(state.src, close, start);
      if (end < 0 || end === start || end + close.length > state.posMax) return false;
      const source = state.src.slice(start, end);
      if (open === "$" && (/^\s|\s$/.test(source) || source.includes("\n"))) return false;
      if (!silent) {
        const token = state.push("notebook_math", "", 0);
        token.content = source;
        token.meta = {display: open === "$$" || open === "\\["};
      }
      state.pos = end + close.length;
      return true;
    });
    markdown.renderer.rules.notebook_math = mathPlaceholder;
    // Setext headings scan ahead for '='/'-' lines. Capture the whole formula
    // before that rule can treat a standalone equation sign as a heading underline.
    markdown.block.ruler.before("lheading", "notebook_math_block", (state, first, last, silent) => {
      if (state.sCount[first] - state.blkIndent >= 4) return false;
      const line = state.src.slice(state.bMarks[first] + state.tShift[first], state.eMarks[first]);
      const open = line.startsWith("$$") ? "$$" : line.startsWith("\\[") ? "\\[" : null;
      if (!open) return false;
      const close = open === "$$" ? "$$" : "\\]";
      const parts = [];
      for (let next = first; next < last; next++) {
        if (next > first && state.sCount[next] < state.blkIndent && !state.isEmpty(next)) break;
        const part = next === first ? line.slice(open.length)
          : state.src.slice(state.bMarks[next] + state.tShift[next], state.eMarks[next]);
        const end = closingAt(part, close, 0);
        if (end >= 0) {
          if (part.slice(end + close.length).trim()) return false;
          if (silent) return true;
          parts.push(part.slice(0, end));
          const token = state.push("notebook_math_block", "", 0);
          token.block = true;
          token.content = parts.join("\n").trim();
          token.meta = {display: true};
          token.map = [first, next + 1];
          state.line = next + 1;
          return true;
        }
        parts.push(part);
      }
      return false;
    }, {alt: ["paragraph", "blockquote", "list"]});
    markdown.renderer.rules.notebook_math_block = mathPlaceholder;
    markdown.inline.ruler.before("link", "notebook_citation", (state, silent) => {
      if (state.linkLevel > 0) return false;
      const match = /^\[(\d{1,3})\](?![\[(])/.exec(state.src.slice(state.pos));
      if (!match || !state.env.sources.has(Number(match[1]))) return false;
      if (!silent) {
        const token = state.push("notebook_citation", "", 0);
        token.content = match[1];
      }
      state.pos += match[0].length;
      return true;
    });
    markdown.renderer.rules.notebook_citation = (tokens, index, options, env) => {
      const id = tokens[index].content;
      const source = env.sources.get(Number(id));
      const url = safeURL(source.url);
      const escape = markdown.utils.escapeHtml;
      return url ? `<a href="${escape(url)}" title="${escape(source.title)}">[${id}]</a>` : `[${id}]`;
    };
  }
  const render = (answer, sources, target, sourceList) => {
    target.replaceChildren();
    const formatted = markdown && window.DOMPurify?.isSupported && window.katex;
    if (formatted) {
      const env = {sources: new Map(sources.map(s => [s.id, s])), math: []};
      const fragment = window.DOMPurify.sanitize(markdown.render(answer, env), {
        ALLOWED_TAGS: ["p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "s", "blockquote",
          "ul", "ol", "li", "pre", "code", "table", "thead", "tbody", "tr", "th", "td", "a", "span", "div"],
        ALLOWED_ATTR: ["class", "href", "title", "start", "data-math-index"],
        ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false, RETURN_DOM_FRAGMENT: true,
      });
      target.append(fragment);
      // Only our math tokens reach KaTeX; raw model HTML was escaped and sanitized.
      for (const node of target.querySelectorAll(".notebook-ai-math[data-math-index]")) {
        const math = env.math[Number(node.getAttribute("data-math-index"))];
        if (!math) continue;
        try {
          window.katex.render(math.source, node, {displayMode: math.display,
            output: "htmlAndMathml", trust: false, throwOnError: false,
            strict: "ignore", maxExpand: 200, maxSize: 20});
        } catch { node.textContent = math.source; }
      }
    } else {
      target.textContent = answer;
    }
    sourceList.replaceChildren();
    for (const source of sources) {
      const url = safeURL(source.url);
      if (!url) continue;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.textContent = source.title + (source.outside_scope ? "（补充）" : "");
      item.append(link);
      sourceList.append(item);
    }
    return Boolean(formatted);
  };
  const addMessage = (role, text) => {
    const message = document.createElement("article");
    message.className = `notebook-ai-message notebook-ai-${role}`;
    message.setAttribute("aria-label", role === "user" ? "你的问题" : "模型回答");
    const label = document.createElement("strong");
    label.className = "notebook-ai-role";
    label.textContent = role === "user" ? "你" : "笔记助手";
    const content = document.createElement("div");
    content.className = role === "user" ? "notebook-ai-question" : "notebook-ai-answer";
    content.setAttribute(role === "user" ? "data-user" : "data-answer", "");
    content.textContent = text;
    message.append(label, content);
    const sources = document.createElement("ol");
    if (role === "assistant") {
      sources.className = "notebook-ai-sources";
      sources.setAttribute("data-sources", "");
      sources.setAttribute("aria-label", "本轮检索来源");
      message.append(sources);
    }
    get("messages").append(message);
    // Bound DOM/memory growth during long study sessions.
    while (get("messages").children.length > visibleCount) get("messages").firstElementChild.remove();
    return {message, content, sources};
  };
  const scrollMessages = () => { get("messages").scrollTop = get("messages").scrollHeight; };
  const nearBottom = () => {
    const box = get("messages");
    return box.scrollHeight - box.scrollTop - box.clientHeight < 100;
  };
  const requestBody = question => {
    const historyAnswer = text => text.length <= 4000 ? text
      : text.slice(0, 600) + "\n[历史回答中段已省略，以下为末尾]\n" + text.slice(-3300);
    const history = turns.slice(-3).flatMap(turn => [
      {role: "user", content: turn.question.slice(0, 1000)},
      {role: "assistant", content: historyAnswer(turn.answer)},
    ]);
    const payload = {provider: current.provider, model: current.model, question, history};
    if (current.summary || sessionPreferences.notes) payload.memory = {summary: current.summary || "", notes: sessionPreferences.notes || ""};
    if (noteScope?.value().ids.length) payload.scope = noteScope.value();
    // Stay below the existing 20 KB proxy/body cap, including UTF-8 and JSON escaping.
    const bytes = value => new TextEncoder().encode(JSON.stringify(value)).length;
    while (history.length && (history.reduce((n, item) => n + item.content.length, 0) > 8000 || bytes(payload) > 18000)) {
      history.splice(0, 2);
    }
    return bytes(payload) <= 18000 ? JSON.stringify(payload) : null;
  };
  const readAnswer = async response => {
    const type = response.headers.get("content-type") || "";
    if (!type.includes("application/json")) {
      const ray = response.headers.get("cf-ray") || "";
      const reference = /^[a-f0-9]+-[A-Z0-9]+$/i.test(ray) ? `，追踪编号 ${ray}` : "";
      const error = new Error(`代理或服务器返回异常（HTTP ${response.status || "未知"}${reference}），请稍后重试。`);
      error.retryable = response.status >= 500;
      throw error;
    }
    let data;
    try { data = await response.json(); }
    catch {
      const error = new Error("任务查询响应未完整收到，请稍后重试。");
      error.retryable = true;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(data?.error || "请求失败，请稍后重试。");
      error.retryable = response.status >= 500;
      throw error;
    }
    return data;
  };
  const jobRequest = async (path, body, key, signal, id, timeout = 12000, keepalive = false) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal.aborted) abort();
    signal.addEventListener("abort", abort, {once: true});
    const timer = setTimeout(abort, timeout);
    try {
      const response = await fetch(path, {
        method: "POST", credentials: "omit", cache: "no-store", redirect: "error", keepalive,
        headers: {"Content-Type": "application/json", "Accept": "application/json",
          "Cache-Control": "no-store, no-transform", "Authorization": `Bearer ${key}`,
          "X-Notebook-Request-ID": id},
        body, signal: controller.signal,
      });
      return await readAnswer(response);
    } catch (error) {
      if (error.name === "TypeError" || error.name === "NetworkError" || (error.name === "AbortError" && !signal.aborted)) {
        error.retryable = true;
      }
      throw error;
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
    }
  };
  const pause = (milliseconds, signal) => new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, milliseconds);
    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, {once: true});
  });
  const runQuestion = async (body, key, signal, progress) => {
    const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, "0")).join("");
    const path = `/api/jobs/${id}`;
    let finished = false;
    let mayExist = false;
    let confirmed = false;
    try {
      try {
        mayExist = true;
        const data = await jobRequest("/api/jobs", body, key, signal, id);
        // Immediate results are accepted as well as the normal asynchronous job reply.
        if (typeof data?.answer === "string") { finished = true; return data; }
        if (data?.job_id !== id) throw new Error("任务响应格式异常，请刷新页面后重试。");
        confirmed = true;
      } catch (error) {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        if (!error.retryable) { mayExist = false; throw error; }
        // The creation response may have been lost. Look up this ID; never submit again.
        progress("reconnect");
      }
      let failures = 0;
      while (true) {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        let data;
        try {
          data = await jobRequest(`${path}/result`, "{}", key, signal, id);
          failures = 0;
        } catch (error) {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
          if (!error.retryable) {
            if (!confirmed) throw new Error("未能确认任务是否已创建，没有自动重新调用模型。请稍后检查网络再试；已发出的调用仍可能产生费用。");
            throw error;
          }
          progress("reconnect");
          if (++failures > 5) throw new Error("任务状态查询多次失败，没有自动重新提问；已发出的调用仍可能产生费用。");
          await pause(2000, signal);
          continue;
        }
        if (data?.job_id !== id) throw new Error("任务查询响应格式异常，请稍后重试。");
        confirmed = true;
        if (data.state === "completed") { finished = true; return data.result; }
        if (data.state === "failed" || data.state === "cancelled") {
          finished = true;
          throw new Error(data.error || "模型未能完成回答，请稍后重试。");
        }
        if (data.state !== "pending") throw new Error("任务状态异常，请稍后重试。");
        progress(data.stage === "answer" ? "answer" : "retrieval");
        await pause(2000, signal);
      }
    } finally {
      if (!finished && mayExist) {
        // Best effort, including pagehide. No new model calls are made by cancellation.
        void jobRequest(`${path}/cancel`, "{}", key, new AbortController().signal, id, 3000, true).catch(() => {});
      }
    }
  };
  const incompleteMessage = reason => reason === "max_tokens"
    ? "回答达到模型输出上限，尚未完成。可准备续写，或把问题拆成几个部分。"
    : reason === "size_limit"
    ? "回答达到本站单条长度上限，后续内容未展示。可分部分继续提问。"
    : "供应商未正常完成这条回答，内容可能不完整。可准备续写或稍后重试。";

  get("stop").addEventListener("click", () => {
    const job = running.get(current.id);
    if (job) { job.stopped = true; job.controller.abort(); }
  });
  get("continue").addEventListener("click", () => {
    if (pending || !lastIncomplete) return;
    get("question").value = "请继续上一条未完成的回答，从断点接着讲解；若最后一个公式或代码块未写完，请将它完整重写，再继续后续内容。";
    get("question").focus();
    get("status").textContent = "已准备续写问题。点击发送后才会调用模型并按实际用量计费。";
  });
  get("chat-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (pending) return;
    if (credential && credential.expiresAt <= Date.now()) forget(false);
    if (!credential || credential.provider !== current.provider) {
      showSettings(true);
      get("settings-status").textContent = "请先保存设置；key 可能已到期或被清除。";
      return;
    }
    if (current.messages.length >= 1998) { get("status").textContent = "这段对话已很长，请新建对话。"; return; }
    const session = current;
    const question = get("question").value.trim();
    if (!question || question.length > 4000) return;
    const body = requestBody(question);
    if (!body) {
      get("status").textContent = "问题和记忆过长，请缩短后再发送。";
      return;
    }
    if (!turns.length && !get("messages").querySelector("article")) get("messages").replaceChildren();
    const userRecord = {role: "user", content: question, pending: true, scope: noteScope?.value()};
    session.messages.push(userRecord);
    session.draft = ""; session.updatedAt = Date.now();
    if (session.title === "新对话") session.title = question.slice(0, 32);
    void persist(session); refreshSessions();
    addMessage("user", question);
    get("question").value = "";
    get("status").textContent = "正在检索笔记并等待模型回答，你可以继续浏览左侧笔记……";
    for (const name of ["submit", "save", "continue"]) get(name).disabled = true;
    get("stop").hidden = false;
    scrollMessages();
    const controller = new AbortController();
    pending = controller;
    const job = {controller, stopped: false, status: "正在提交问题"};
    running.set(session.id, job); refreshSessions(); updateMemory();
    const started = performance.now();
    let completed = false;
    const timer = setTimeout(() => controller.abort(), 265000);
    let phase = "正在提交问题";
    const drawProgress = () => {
      const seconds = Math.floor((performance.now() - started) / 1000);
      job.status = `${phase}，已等待 ${seconds} 秒`;
      if (current === session) get("status").textContent = job.status;
    };
    const progress = stage => {
      phase = stage === "answer" ? "正在等待模型生成回答"
        : stage === "reconnect" ? "网络暂时不稳定，正在查询已有任务状态"
        : "正在扩展检索词并检索笔记";
      drawProgress();
    };
    // Elapsed time is a local monotonic clock, independent of server packets.
    drawProgress();
    const ticker = setInterval(drawProgress, 1000);
    document.addEventListener("visibilitychange", drawProgress);
    try {
      const data = await runQuestion(body, credential.key, controller.signal, progress);
      if (typeof data?.answer !== "string" || !data.answer.trim() || !Array.isArray(data.sources)) {
        throw new Error("回答格式异常，请稍后重试。");
      }
      completed = true;
      userRecord.pending = false;
      session.messages.push({role: "assistant", content: data.answer, sources: data.sources,
        truncated: data.truncated === true, finish_reason: data.finish_reason, scope: userRecord.scope});
      session.updatedAt = Date.now();
      session.status = data.expansion_failed ? "已按原问题检索。" : "";
      if (data.coverage?.overview && data.coverage.scope_pages > data.coverage.pages) {
        session.status = `本轮参考了 ${data.coverage.pages}/${data.coverage.scope_pages} 篇笔记。`;
      }
      void persist(session);
      job.finished = true;
      if (current === session) {
        const follow = nearBottom(), top = get("messages").scrollTop;
        renderSession();
        if (follow) scrollMessages(); else get("messages").scrollTop = top;
      }
    } catch (error) {
      userRecord.pending = false; userRecord.failed = true;
      session.draft = question;
      session.status = error.name === "AbortError"
        ? `${job.stopped ? "已停止等待" : "请求超时"}。已发出的供应商调用仍可能产生费用。`
        : `${error.message}（等待 ${Math.round((performance.now() - started) / 1000)} 秒）`;
      void persist(session);
      job.finished = true;
      if (current === session) {
        renderSession();
        if (!get("question").value) get("question").value = question;
        get("status").textContent = session.status;
      }
    } finally {
      clearTimeout(timer);
      clearInterval(ticker);
      document.removeEventListener("visibilitychange", drawProgress);
      running.delete(session.id); refreshSessions();
      if (current === session) {
        pending = null;
        for (const name of ["submit", "save", "continue"]) get(name).disabled = false;
        get("continue").hidden = !lastIncomplete;
        get("stop").hidden = true;
        updateMemory();
      }
      if (completed && sessionPreferences.autoSummary && conversations.has(session.id)) void summarizeSession(session, true);
    }
  });
  get("question").addEventListener("keydown", event => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.isComposing) {
      event.preventDefault();
      get("chat-form").requestSubmit();
    }
  });
  // Instant navigation only replaces the notebook container, leaving this panel and job polling alive.
  // BFCache returns must recheck credential expiry.
  window.addEventListener("pageshow", () => {
    if (credential && credential.expiresAt <= Date.now()) forget(false);
    scheduleExpiry();
  });
  window.addEventListener("pagehide", () => {
    clearTimeout(expiryTimer);
    for (const job of running.values()) job.controller.abort();
  });

  const refreshSessions = () => {
    get("session").replaceChildren();
    for (const session of [...conversations.values()].sort((a, b) => b.updatedAt - a.updatedAt)) {
      get("session").add(new Option(session.title + (running.has(session.id) ? " · 生成中" : ""), session.id));
    }
    if (current) { get("session").value = current.id; get("session-title").value = current.title; }
  };
  const renderSession = () => {
    turns = historyTurns(current);
    const last = current.messages.at(-1);
    lastIncomplete = last?.role === "assistant" && last.truncated === true;
    get("messages").replaceChildren();
    for (const record of current.messages.slice(-visibleCount)) {
      const output = addMessage(record.role, record.content);
      if (record.failed) {
        output.message.classList.add("notebook-ai-failed");
        output.message.querySelector(".notebook-ai-role").textContent = "你 · 未完成";
        const retry = document.createElement("button"); retry.type = "button"; retry.textContent = "重新填写";
        retry.addEventListener("click", () => {
          get("question").value = record.content; noteScope?.restore(record.scope); get("question").focus();
        });
        output.message.append(retry);
      }
      if (record.role === "assistant") {
        const formatted = render(record.content, record.sources || [], output.content, output.sources);
        if (!formatted && !current.status) current.status = "排版资源未加载，暂以纯文本显示。";
        const remember = document.createElement("button");
        remember.type = "button"; remember.textContent = "记住这条";
        remember.addEventListener("click", () => {
          const selection = window.getSelection();
          const selected = selection?.rangeCount && output.content.contains(selection.getRangeAt(0).commonAncestorContainer)
            ? selection.toString().trim() : "";
          const note = selected || record.content;
          const combined = [current.summary, note].filter(Boolean).join("\n");
          if (combined.length > 2000) { get("status").textContent = "记忆放不下整条回答，请先选中要记住的一小段文字。"; return; }
          current.summary = combined; get("session-memory").value = combined;
          get("memory-view").open = true; void persist(current); updateMemory();
        });
        output.message.append(remember);
        if (record.truncated) {
          const warning = document.createElement("p"); warning.className = "notebook-ai-warning";
          warning.textContent = incompleteMessage(record.finish_reason);
          output.message.insertBefore(warning, output.content);
        }
      }
    }
    get("earlier").hidden = current.messages.length <= visibleCount;
    updateMemory();
    const job = running.get(current.id);
    pending = job?.controller || null;
    for (const name of ["submit", "save", "continue"]) get(name).disabled = Boolean(pending);
    get("stop").hidden = !pending;
    get("continue").hidden = !lastIncomplete;
    get("status").textContent = (job && !job.finished ? job.status : "") || (lastIncomplete ? incompleteMessage(last.finish_reason) : current.status || "");
  };
  const activate = session => {
    if (current && current.draft !== get("question").value) {
      current.draft = get("question").value; void persist(current);
    }
    current = session; visibleCount = 40;
    preferences.provider = session.provider;
    if (session.model) preferences.models[session.provider] = session.model;
    get("provider").value = session.provider; get("model").value = session.model;
    showModels(session.provider);
    get("key").value = credential?.provider === session.provider ? credential.key : "";
    get("consent").checked = credential?.provider === session.provider;
    restoring = true; noteScope?.restore(session.scope); restoring = false;
    get("question").value = session.draft || "";
    get("session-title").value = session.title;
    get("session-memory").value = session.summary || "";
    storage("sessionStorage", "setItem", "notebook-ai.active-session", session.id);
    refreshSessions(); renderSession(); scrollMessages(); summary();
  };
  const newSession = () => {
    const now = Date.now();
    const session = {id: window.NotebookConversations.uid(), title: "新对话", provider: preferences.provider,
      model: preferences.models[preferences.provider] || "", scope: {ids: [], mode: "strict"}, messages: [], draft: "",
      createdAt: now, updatedAt: now, revision: 0, summary: "", summaryThrough: 0};
    conversations.set(session.id, session); void persist(session); return session;
  };
  get("session").addEventListener("change", () => { const session = conversations.get(get("session").value); if (session) activate(session); });
  get("session-title").addEventListener("change", () => {
    current.title = get("session-title").value.trim().slice(0, 100) || "新对话";
    get("session-title").value = current.title; void persist(current); refreshSessions();
  });
  get("question").addEventListener("change", () => { current.draft = get("question").value; void persist(current); });
  get("earlier").addEventListener("click", () => {
    const oldHeight = get("messages").scrollHeight, top = get("messages").scrollTop;
    visibleCount += 40; renderSession();
    get("messages").scrollTop = get("messages").scrollHeight - oldHeight + top;
  });
  get("history-days").addEventListener("change", async () => {
    sessionPreferences.keepDays = Number(get("history-days").value);
    try { await database.settings(sessionPreferences); }
    catch { get("session-status").textContent = "保存失败，请导出对话后再刷新。"; }
  });
  const deleteSessions = async all => {
    if (!confirm(all ? "清空此浏览器的全部对话？" : running.has(current.id) ? "停止生成并删除这段对话？" : "删除这段对话？")) return;
    const ids = all ? [...conversations.keys()] : [current.id];
    for (const id of ids) { running.get(id)?.controller.abort(); conversations.delete(id); }
    await writes;
    try {
      for (const id of ids) await database.remove(id);
      current = null; activate(conversations.values().next().value || newSession());
    } catch { get("session-status").textContent = "删除失败，请重试。"; }
  };
  get("delete-session").addEventListener("click", () => { void deleteSessions(false); });
  get("clear-sessions").addEventListener("click", () => { void deleteSessions(true); });
  get("export").addEventListener("click", async () => {
    await writes;
    const records = [...conversations.values()].map(window.NotebookConversations.clean);
    const blob = new Blob([JSON.stringify({version: 1, sessions: records, memory: {notes: sessionPreferences.notes || ""}}, null, 2)], {type: "application/json"});
    const link = document.createElement("a"), url = URL.createObjectURL(blob);
    link.href = url; link.download = "notebook-conversations.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  get("import").addEventListener("click", () => get("import-file").click());
  get("import-file").addEventListener("change", async () => {
    const file = get("import-file").files[0]; if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error("请选择小于 20 MB 的会话文件。");
      await writes;
      const bundle = JSON.parse(await file.text());
      const imported = await database.import(bundle);
      if (!sessionPreferences.notes && typeof bundle.memory?.notes === "string" && bundle.memory.notes.length <= 2000) {
        sessionPreferences.notes = bundle.memory.notes;
        get("learning-notes").value = sessionPreferences.notes;
        await database.settings(sessionPreferences);
      }
      for (const session of imported) conversations.set(session.id, session);
      if (imported.length) activate(imported[0]);
    } catch (error) { get("session-status").textContent = error.name === "Error" ? error.message : "文件内容不正确，请选择本站导出的 JSON 文件。"; }
    get("import-file").value = "";
  });
  const updateMemory = () => {
    if (!current) return;
    const older = Math.max(0, historyTurns(current).length - 3);
    get("summarize").disabled = running.has(current.id) || older <= current.summaryThrough;
    get("clear-memory").disabled = !current.summary;
  };
  get("session-memory").addEventListener("change", () => {
    current.summary = get("session-memory").value.trim();
    if (!current.summary) current.summaryThrough = Math.max(0, historyTurns(current).length - 3);
    void persist(current); updateMemory();
  });
  get("clear-memory").addEventListener("click", () => {
    current.summary = ""; current.summaryThrough = Math.max(0, historyTurns(current).length - 3); get("session-memory").value = "";
    void persist(current); updateMemory();
  });
  const saveLearningPreferences = async () => {
    sessionPreferences.notes = get("learning-notes").value.trim();
    sessionPreferences.autoSummary = get("auto-summary").checked;
    try { await database.settings(sessionPreferences); }
    catch { get("session-status").textContent = "学习偏好未能保存，请重试。"; }
  };
  get("learning-notes").addEventListener("change", saveLearningPreferences);
  get("auto-summary").addEventListener("change", saveLearningPreferences);
  const summarizeSession = async (session, automatic = false) => {
    if (running.has(session.id) || !conversations.has(session.id)) return;
    const older = historyTurns(session).slice(0, -3);
    const start = Math.min(session.summaryThrough || 0, older.length);
    if (older.length <= start || (automatic && older.length - start < 4)) return;
    if (!credential || credential.expiresAt <= Date.now() || credential.provider !== session.provider) {
      if (!automatic) { showSettings(true); get("settings-status").textContent = "请先填写这个供应商的 key。"; }
      return;
    }
    const originalSummary = session.summary;
    const batch = older.slice(start, start + 3);
    const history = batch.flatMap(turn => [{role: "user", content: turn.question.slice(0, 800)},
      {role: "assistant", content: turn.answer.slice(0, 1200)}]);
    const payload = {provider: session.provider, model: session.model, question: "整理旧对话", task: "summary",
      history, memory: {summary: originalSummary || ""}};
    while (new TextEncoder().encode(JSON.stringify(payload)).length > 18000) {
      const longest = history.reduce((a, b) => a.content.length > b.content.length ? a : b);
      if (longest.content.length <= 200) return;
      longest.content = longest.content.slice(0, -200);
    }
    const controller = new AbortController();
    const job = {controller, stopped: false, status: "正在整理记忆"};
    const began = performance.now();
    running.set(session.id, job); refreshSessions();
    if (current === session) { pending = controller; renderSession(); }
    const draw = () => {
      job.status = `正在整理记忆，已等待 ${Math.floor((performance.now() - began) / 1000)} 秒`;
      if (current === session) get("status").textContent = job.status;
    };
    const ticker = setInterval(draw, 1000), timeout = setTimeout(() => controller.abort(), 265000);
    try {
      const result = await runQuestion(JSON.stringify(payload), credential.key, controller.signal, () => {});
      if (result.truncated || typeof result.answer !== "string" || !result.answer.trim() || result.answer.length > 2000) {
        throw new Error("记忆未整理完整，原有记忆已保留。");
      }
      if (!conversations.has(session.id)) return;
      if (session.summary !== originalSummary) throw new Error("记忆已修改，本次整理没有覆盖你的修改。");
      session.summary = result.answer.trim(); session.summaryThrough = start + batch.length;
      session.status = `记忆已整理至第 ${session.summaryThrough} 轮。`;
      if (current === session) get("session-memory").value = session.summary;
      void persist(session);
    } catch (error) {
      session.status = error.name === "AbortError" ? "记忆整理已停止，原有记忆已保留。" : error.message;
    } finally {
      clearInterval(ticker); clearTimeout(timeout); running.delete(session.id); refreshSessions();
      if (current === session) renderSession();
    }
  };
  get("summarize").addEventListener("click", () => { void summarizeSession(current); });
  database = await window.NotebookConversations.open();
  let records;
  try { sessionPreferences = await database.settings(); records = await database.list(); }
  catch { database.fallback(); sessionPreferences = await database.settings(); records = []; }
  get("history-days").value = String(sessionPreferences.keepDays);
  get("learning-notes").value = sessionPreferences.notes || "";
  get("auto-summary").checked = sessionPreferences.autoSummary === true;
  for (const session of records) {
    // A page reload cannot safely recreate an upstream request that may already be billed.
    for (const message of session.messages) if (message.pending) {
      message.pending = false; message.failed = true;
      session.draft = session.draft || message.content;
      session.status = "上次回答未保存，可以重新发送。";
    }
    conversations.set(session.id, session);
  }
  const active = storage("sessionStorage", "getItem", "notebook-ai.active-session");
  activate(conversations.get(active) || conversations.values().next().value || newSession());
  if (!database.persistent) get("session-status").textContent = "浏览器未允许保存对话，记录仅保留在当前页面。";
  await writes; launch.disabled = false; ready();
});
