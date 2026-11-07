/* BYOK credentials live only in this input; no storage, cookies, URL, or analytics. */
document.addEventListener("DOMContentLoaded", () => {
  const launch = document.createElement("button");
  launch.className = "notebook-ai-launch";
  launch.textContent = "问笔记";
  launch.type = "button";
  const panel = document.createElement("dialog");
  panel.className = "notebook-ai";
  panel.setAttribute("aria-label", "笔记 AI 助手");
  // Fixed markup only. All user/model text is rendered using text nodes below.
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
  const render = (answer, sources) => {
    const target = get("answer");
    target.replaceChildren();
    const byId = new Map(sources.map((s) => [s.id, s]));
    let end = 0;
    for (const match of answer.matchAll(/\[(\d+)\]/g)) {
      target.append(document.createTextNode(answer.slice(end, match.index)));
      const source = byId.get(Number(match[1]));
      const url = source && safeURL(source.url);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.textContent = match[0];
        link.title = source.title;
        target.append(link);
      } else target.append(document.createTextNode(match[0]));
      end = match.index + match[0].length;
    }
    target.append(document.createTextNode(answer.slice(end)));
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
        render(data.answer, data.sources);
        get("status").textContent = data.expansion_failed
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
