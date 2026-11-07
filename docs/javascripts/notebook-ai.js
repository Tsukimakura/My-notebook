/* BYOK credentials live only in this input; no storage, cookies, URL, or analytics. */
document.addEventListener("DOMContentLoaded", () => {
  const launch = document.createElement("button");
  launch.className = "notebook-ai-launch";
  launch.textContent = "问笔记";
  launch.type = "button";
  const panel = document.createElement("dialog");
  panel.className = "notebook-ai";
  panel.setAttribute("aria-label", "笔记 AI 助手");
  // Fixed markup only; model Markdown is separately parsed and sanitized below.
  panel.innerHTML = `
    <div class="notebook-ai-heading"><h2>问笔记</h2><button type="button" data-close aria-label="关闭">×</button></div>
    <p>先检索本站笔记，再结合模型知识回答。补充内容会单独标注，请核对来源。</p>
    <details><summary>密钥、隐私与费用说明</summary>
      <p>使用你自己的 API key，调用费用由你承担。每次提问通常调用两次模型：扩展检索词和生成回答。</p>
      <p>key 仅保存在当前页面内存中，关闭面板或刷新后清除；经 HTTPS、Cloudflare 和本站后端转发给所选供应商。本站后端不持久化 key、问题或回答，也不写入应用日志。</p>
      <p>问题及检索到的公开笔记片段会发送给供应商，供应商的数据处理政策仍然适用。不要输入其他密码、服务器凭据或敏感个人信息。</p>
    </details>
    <form autocomplete="off">
      <label>供应商<select data-provider><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option><option value="anthropic">Anthropic</option></select></label>
      <label>模型 ID<input data-model required maxlength="100" placeholder="填写该供应商账户可用的模型 ID" autocomplete="off" spellcheck="false"></label>
      <label>API key<input data-key type="password" required maxlength="512" autocomplete="off" spellcheck="false"></label>
      <button type="button" data-clear>清除 key 和回答</button>
      <label>你的问题<textarea data-question required maxlength="4000" rows="4" placeholder="例如：条件概率和事件独立有什么区别？"></textarea></label>
      <label class="notebook-ai-consent"><input type="checkbox" data-consent required>我了解密钥转发、数据发送和费用说明</label>
      <button type="submit" data-submit>检索并回答</button>
    </form>
    <p data-status role="status" aria-live="polite"></p>
    <div data-answer class="notebook-ai-answer"></div>
    <ol data-sources class="notebook-ai-sources" aria-label="本次检索来源"></ol>`;
  document.body.append(launch, panel);
  const get = (name) => panel.querySelector(`[data-${name}]`);
  let pending = null;
  const clear = () => {
    get("key").value = "";
    get("question").value = "";
    get("answer").replaceChildren();
    get("sources").replaceChildren();
    get("status").textContent = "";
    get("consent").checked = false;
  };
  launch.addEventListener("click", () => panel.showModal());
  get("close").addEventListener("click", () => panel.close());
  panel.addEventListener("close", () => { pending?.abort(); clear(); });
  get("clear").addEventListener("click", clear);
  get("provider").addEventListener("change", () => {
    get("key").value = "";
    get("model").value = "";
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
  const render = (answer, sources) => {
    const target = get("answer");
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
    get("sources").replaceChildren();
    for (const source of sources) {
      const url = safeURL(source.url);
      if (!url) continue;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.textContent = source.title;
      item.append(link);
      get("sources").append(item);
    }
    return Boolean(formatted);
  };
  panel.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    get("answer").replaceChildren();
    get("sources").replaceChildren();
    get("status").textContent = "正在扩展检索词、检索笔记并生成回答，请稍候……";
    get("submit").disabled = true;
    get("clear").disabled = true;
    get("close").disabled = true;
    // Keep the key in the input rather than copying it into long-lived state.
    pending = new AbortController();
    const timer = setTimeout(() => pending?.abort(), 115000);
    try {
      const response = await fetch("/api/ask", {
        method: "POST", credentials: "omit", cache: "no-store", redirect: "error",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${get("key").value.trim()}`},
        body: JSON.stringify({provider: get("provider").value, model: get("model").value.trim(), question: get("question").value.trim()}),
        signal: pending.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("AI 后端尚未接入，或代理返回异常。请稍后重试。");
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "请求失败，请稍后重试。");
      if (panel.open) {
        const formatted = render(data.answer, data.sources);
        get("status").textContent = !formatted
          ? "回答已收到，排版资源未加载，暂以纯文本显示。请刷新页面后重试。"
          : data.expansion_failed
          ? "检索词扩展失败，本次已使用原问题检索。以下链接是检索来源，引用不代表结论已经核验。"
          : "回答完成。以下链接是检索来源，引用不代表结论已经核验。";
      }
    } catch (error) {
      if (panel.open) get("status").textContent = error.name === "AbortError"
        ? "请求超时。已发出的供应商调用仍可能产生费用。" : error.message;
    } finally {
      clearTimeout(timer);
      pending = null;
      get("submit").disabled = false;
      get("clear").disabled = false;
      get("close").disabled = false;
    }
  });
  window.addEventListener("pagehide", clear);
});
