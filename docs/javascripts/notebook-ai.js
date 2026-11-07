/* BYOK credentials are saved only by explicit settings, with a fixed expiry. */
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".notebook-ai")) return;
  const launch = document.createElement("button");
  launch.className = "notebook-ai-launch";
  launch.textContent = "问笔记";
  launch.type = "button";
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
    <p data-summary class="notebook-ai-summary"></p>
    <section data-settings-view hidden aria-label="AI 设置">
    <form data-settings-form autocomplete="off">
      <label>供应商<select data-provider><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option><option value="anthropic">Anthropic</option></select></label>
      <label>模型 ID<input data-model required maxlength="100" placeholder="填写账户可用的模型 ID，只需设置一次" autocomplete="off" spellcheck="false"></label>
      <label>API key<input data-key type="password" required maxlength="512" autocomplete="off" spellcheck="false"></label>
      <label>密钥保存时间<select data-retention>
        <option value="session">临时：当前标签页，最多 2 小时</option>
        <option value="7">在此浏览器记住 7 天</option>
        <option value="30">在此浏览器记住 30 天</option>
      </select></label>
      <p>默认临时保存。7 天和 30 天会把 key 保存到此设备的浏览器中，同源脚本可以读取；请只在自己的设备上启用。到期不再使用，下次打开时清除。收起对话栏不会清除 key。</p>
      <details><summary>密钥、隐私与费用说明</summary>
        <p>key 经 HTTPS、Cloudflare 和本站后端转发给所选供应商；后端不持久化 key、问题或回答，也不写入应用日志。</p>
        <p>每次提问通常调用两次模型，回答生成预算上限为 8,192 tokens（推理模型可能将思考计入预算），详细回答可能花费更多时间和费用。当前问题、最近几轮对话及检索到的公开笔记片段会发送给供应商，供应商的数据处理政策仍然适用。</p>
        <p>对话只保留在当前页面内存中；刷新会清除对话，站内笔记跳转会保留。不要输入其他密码、服务器凭据或敏感个人信息。</p>
      </details>
      <label class="notebook-ai-consent"><input type="checkbox" data-consent required>我了解密钥保存与转发、对话发送和费用说明</label>
      <div class="notebook-ai-actions"><button type="submit" data-save>保存设置</button><button type="button" data-clear>清除已保存 key</button></div>
    </form>
    <p data-settings-status role="status"></p>
    </section>
    <section data-chat-view class="notebook-ai-chat" aria-label="笔记对话">
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
  let pending = null;
  let turns = [];
  let lastIncomplete = false;
  let credential = null;
  let expiryTimer = null;
  const credentialName = "notebook-ai.credentials.v1";
  const preferenceName = "notebook-ai.preferences.v1";
  const providers = ["openai", "deepseek", "anthropic"];
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
    get("summary").textContent = `${preferences.provider} · ${preferences.models[preferences.provider] || "请设置模型"} · ${credential ? "key 已就绪" : "请在设置中填写 key"}`;
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
  get("new").addEventListener("click", () => {
    if (pending) return;
    turns = [];
    lastIncomplete = false;
    get("continue").hidden = true;
    get("messages").replaceChildren();
    get("question").value = "";
    get("status").textContent = "已开始新对话。";
  });
  get("provider").addEventListener("change", () => {
    get("key").value = get("provider").value === credential?.provider ? credential.key : "";
    get("model").value = preferences.models[get("provider").value] || "";
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
    // Never silently send a previous provider's conversation to a new one.
    if (changed) {
      turns = [];
      lastIncomplete = false;
      get("continue").hidden = true;
      get("messages").replaceChildren();
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
    markdown.block.ruler.before("paragraph", "notebook_math_block", (state, first, last, silent) => {
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
      link.textContent = source.title;
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
    while (get("messages").children.length > 40) get("messages").firstElementChild.remove();
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
    const payload = {provider: preferences.provider, model: preferences.models[preferences.provider], question, history};
    // Stay below the existing 20 KB proxy/body cap, including UTF-8 and JSON escaping.
    const bytes = value => new TextEncoder().encode(JSON.stringify(value)).length;
    while (history.length && (history.reduce((n, item) => n + item.content.length, 0) > 8000 || bytes(payload) > 18000)) {
      history.splice(0, 2);
    }
    return bytes(payload) <= 18000 ? JSON.stringify(payload) : null;
  };
  const readAnswer = async response => {
    const type = response.headers.get("content-type") || "";
    if (type.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "请求失败，请稍后重试。");
      return data;
    }
    if (!response.ok || !type.includes("text/event-stream") || !response.body?.getReader) {
      const ray = response.headers.get("cf-ray") || "";
      const reference = /^[a-f0-9]+-[A-Z0-9]+$/i.test(ray) ? `，追踪编号 ${ray}` : "";
      throw new Error(`代理或服务器返回异常（HTTP ${response.status || "未知"}${reference}），请稍后重试。`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8", {fatal: true});
    let buffer = "";
    let bytes = 0;
    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) throw new Error("回答连接提前结束，尚未收到完整结果；已发出的调用仍可能产生费用。");
        bytes += value.byteLength;
        if (bytes > 1_000_000) throw new Error("回答数据超过大小限制。");
        buffer = (buffer + decoder.decode(value, {stream: true})).replace(/\r\n/g, "\n");
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) >= 0) {
          const lines = buffer.slice(0, boundary).split("\n");
          buffer = buffer.slice(boundary + 2);
          const name = lines.find(line => line.startsWith("event:"))?.slice(6).trim();
          const payload = lines.filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
          if (!payload) continue;
          const data = JSON.parse(payload);
          if (name === "error") throw new Error(data.error || "模型未能完成回答，请稍后重试。");
          if (name === "complete") return data;
          if (name === "progress") {
            const stage = data.stage === "answer" ? "正在等待模型生成回答" : "正在扩展检索词并检索笔记";
            const seconds = Number.isFinite(data.elapsed) && data.elapsed >= 0 ? Math.round(data.elapsed) : 0;
            get("status").textContent = `${stage}，已等待 ${seconds} 秒。你可以继续浏览笔记……`;
          }
        }
      }
    } finally {
      try { await reader.cancel(); } catch { /* The connection may already be closed. */ }
      reader.releaseLock();
    }
  };
  const incompleteMessage = reason => reason === "max_tokens"
    ? "回答达到模型输出上限，尚未完成。可准备续写，或把问题拆成几个部分。"
    : reason === "size_limit"
    ? "回答达到本站单条长度上限，后续内容未展示。可分部分继续提问。"
    : "供应商未正常完成这条回答，内容可能不完整。可准备续写或稍后重试。";
  let stopped = false;
  get("stop").addEventListener("click", () => { stopped = true; pending?.abort(); });
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
    if (!credential) {
      showSettings(true);
      get("settings-status").textContent = "请先保存设置；key 可能已到期或被清除。";
      return;
    }
    const question = get("question").value.trim();
    if (!question || question.length > 4000) return;
    const body = requestBody(question);
    if (!body) {
      get("status").textContent = "问题编码后过长，请缩短问题。";
      return;
    }
    if (!turns.length && !get("messages").querySelector("article")) get("messages").replaceChildren();
    const userMessage = addMessage("user", question);
    get("question").value = "";
    get("status").textContent = "正在检索笔记并等待模型回答，你可以继续浏览左侧笔记……";
    for (const name of ["submit", "new", "save", "continue"]) get(name).disabled = true;
    get("stop").hidden = false;
    scrollMessages();
    stopped = false;
    const controller = new AbortController();
    pending = controller;
    const started = performance.now();
    const timer = setTimeout(() => controller.abort(), 265000);
    try {
      const response = await fetch("/api/ask", {
        method: "POST", credentials: "omit", cache: "no-store", redirect: "error",
        headers: {"Content-Type": "application/json", "Accept": "text/event-stream",
          "Cache-Control": "no-store, no-transform", "Authorization": `Bearer ${credential.key}`},
        body, signal: controller.signal,
      });
      const data = await readAnswer(response);
      if (typeof data.answer !== "string" || !data.answer.trim() || !Array.isArray(data.sources)) {
        throw new Error("回答格式异常，请稍后重试。");
      }
      const follow = nearBottom();
      const output = addMessage("assistant", "");
      const formatted = render(data.answer, data.sources, output.content, output.sources);
      lastIncomplete = data.truncated === true;
      if (lastIncomplete) {
        const warning = document.createElement("p");
        warning.className = "notebook-ai-warning";
        warning.textContent = incompleteMessage(data.finish_reason);
        output.message.insertBefore(warning, output.content);
      }
      turns.push({question, answer: data.answer});
      turns = turns.slice(-3);
      if (follow) scrollMessages();
      const notices = [];
      if (lastIncomplete) notices.push(incompleteMessage(data.finish_reason));
      if (!formatted) notices.push("排版资源未加载，暂以纯文本显示。刷新页面会清除对话。");
      if (data.expansion_failed) notices.push("检索词扩展失败，已使用原问题检索，请核对笔记来源。");
      get("status").textContent = notices.join(" ") || "回答完成，可以继续追问。引用不代表结论已经核验。";
    } catch (error) {
      userMessage.message.classList.add("notebook-ai-failed");
      if (!get("question").value) get("question").value = question;
      get("status").textContent = error.name === "AbortError"
        ? `${stopped ? "已停止等待" : "请求超时"}。已发出的供应商调用仍可能产生费用。`
        : `${error.message}（等待 ${Math.round((performance.now() - started) / 1000)} 秒）`;
    } finally {
      clearTimeout(timer);
      pending = null;
      for (const name of ["submit", "new", "save", "continue"]) get(name).disabled = false;
      get("continue").hidden = !lastIncomplete;
      get("stop").hidden = true;
    }
  });
  get("question").addEventListener("keydown", event => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.isComposing) {
      event.preventDefault();
      get("chat-form").requestSubmit();
    }
  });
  // Instant navigation only replaces the notebook container, leaving this panel and fetch alive.
  // Full reloads clear conversations; BFCache returns must recheck credential expiry.
  window.addEventListener("pageshow", () => {
    if (credential && credential.expiresAt <= Date.now()) forget(false);
    scheduleExpiry();
  });
  window.addEventListener("pagehide", () => {
    clearTimeout(expiryTimer);
    pending?.abort();
  });
});
