const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const {IDBFactory} = require('fake-indexeddb');

async function setup(t, fetch, {rendering = true, storageState = {}, autoSave = true, retention = 'session', blockStorage = false, beforeScript, indexedDB} = {}) {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://notes.example.com/a-note/', runScripts: 'outside-only',
  });
  t.after(() => dom.window.close());
  const {window} = dom;
  window.indexedDB = indexedDB || new IDBFactory();
  window.structuredClone = structuredClone;
  window.TextEncoder = TextEncoder;
  window.TextDecoder = TextDecoder;
  for (const area of ['localStorage', 'sessionStorage']) {
    for (const [key, value] of Object.entries(storageState[area] || {})) window[area].setItem(key, value);
  }
  if (blockStorage) window.Storage.prototype.setItem = () => { throw new Error('blocked'); };
  if (window.document.readyState === 'loading') {
    await new Promise(resolve => window.document.addEventListener('DOMContentLoaded', resolve, {once: true}));
  }
  window.fetch = fetch;
  if (rendering) {
    for (const asset of ['markdown-it/markdown-it.min.js', 'dompurify/purify.min.js', 'katex/katex.min.js']) {
      window.eval(fs.readFileSync('docs/assets/vendor/' + asset, 'utf8'));
    }
  }
  if (beforeScript) beforeScript(window);
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai-layout.js', 'utf8'));
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai-store.js', 'utf8'));
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai-scope.js', 'utf8'));
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai-models.js', 'utf8'));
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai.js', 'utf8'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  await window.NotebookAIReady;
  window.document.querySelector('.notebook-ai-launch').click();
  const panel = window.document.querySelector('.notebook-ai');
  const get = name => panel.querySelector(`[data-${name}]`);
  const save = () => get('settings-form').dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));
  if (autoSave) {
    get('key').value = 'test-not-a-real-key';
    get('model').value = 'test-model';
    get('retention').value = retention;
    get('consent').checked = true;
    save();
  }
  get('question').value = '条件概率是什么？';
  const submit = async () => {
    get('chat-form').dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));
    await new Promise(resolve => setTimeout(resolve, 10));
    await window.NotebookAIFlush();
  };
  return {window, panel, get, submit, save};
}

test('model HTML stays text, citations stay same-origin, key only enters opted storage and auth header', async t => {
  let request;
  const {window, get, submit} = await setup(t, async (url, options) => {
    request = {url, ...options};
    return {ok: true, headers: new Headers({'Content-Type': 'application/json'}), json: async () => ({
      answer: '<img src=x onerror="alert(1)"> 笔记依据 [1] 模型补充 [2]',
      sources: [{id: 1, title: '<script>source</script>', url: '/probability/#conditional'},
        {id: 2, title: 'bad', url: '//evil.example/'}], expansion_failed: false,
    })};
  });
  await submit();
  assert.match(get('answer').textContent, /<img/);
  assert.equal(get('answer').querySelector('img'), null);
  assert.equal(get('sources').querySelector('script'), null);
  assert.equal(get('answer').querySelectorAll('a').length, 1);
  assert.equal(get('answer').querySelector('a').href, 'https://notes.example.com/probability/#conditional');
  assert.equal(request.url, '/api/jobs');
  assert.equal(request.headers.Authorization, 'Bearer test-not-a-real-key');
  assert.ok(!request.body.includes('test-not-a-real-key'));
  assert.ok(!JSON.stringify(window.localStorage).includes('test-not-a-real-key'));
  assert.match(window.sessionStorage.getItem('notebook-ai.credentials.v1'), /test-not-a-real-key/);
  assert.equal(window.document.cookie, '');
});

test('collapsing preserves the conversation and settings; clear key removes both storage copies', async t => {
  const {window, panel, get, submit} = await setup(t, answerResponse('old answer'));
  await submit();
  get('provider').value = 'anthropic';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.equal(get('key').value, '');
  assert.equal(get('model').value, '');
  get('key').value = 'test-secret';
  get('close').click();
  assert.equal(panel.hidden, true);
  assert.equal(get('key').value, 'test-secret');
  assert.equal(get('answer').textContent.trim(), 'old answer');
  window.document.querySelector('.notebook-ai-launch').click();
  get('clear').click();
  assert.equal(get('key').value, '');
  assert.equal(get('answer').textContent.trim(), 'old answer');
  assert.equal(get('consent').checked, false);
  assert.equal(window.sessionStorage.getItem('notebook-ai.credentials.v1'), null);
  assert.equal(window.localStorage.getItem('notebook-ai.credentials.v1'), null);
});

test('HTML proxy errors produce a useful message and allow retry', async t => {
  const {get, submit} = await setup(t, async () => ({ok: false, headers: new Headers({'Content-Type': 'text/html'})}));
  await submit();
  assert.match(get('status').textContent, /代理或服务器返回异常/);
  assert.equal(get('submit').disabled, false);
});

function answerResponse(answer) {
  return async () => ({ok: true, headers: new Headers({'Content-Type': 'application/json'}), json: async () => ({
    answer, sources: [{id: 1, title: '概率笔记', url: '/probability/#conditional'}], expansion_failed: false,
  })});
}

test('model picker follows provider, fills editable ID and sends the saved selection', async t => {
  let payload;
  const {window, get, save, submit} = await setup(t, async (url, options) => {
    payload = JSON.parse(options.body);
    return answerResponse('answer')();
  }, {autoSave: false});
  assert.ok([...get('model-choice').options].some(option => option.value === 'gpt-6.1-sol'));
  get('provider').value = 'deepseek';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.ok([...get('model-choice').options].some(option => option.value === 'deepseek-flash'));
  assert.ok(![...get('model-choice').options].some(option => option.value.startsWith('gpt-')));
  assert.equal(get('model-docs').hostname, 'api-docs.deepseek.com');
  assert.match(get('model-endpoint').textContent, /api\.deepseek\.com\/models/);
  get('model-choice').value = 'deepseek-flash';
  get('model-choice').dispatchEvent(new window.Event('change'));
  assert.equal(get('model').value, 'deepseek-flash');
  get('key').value = 'test-not-a-real-key';
  get('consent').checked = true;
  save();
  await submit();
  assert.equal(payload.provider, 'deepseek');
  assert.equal(payload.model, 'deepseek-flash');
  assert.equal(get('model-choice').disabled, false);
});

test('custom model IDs survive reload and provider switches without silent replacement', async t => {
  const saved = {provider: 'deepseek', models: {deepseek: 'my-custom-model', anthropic: 'claude-sonnet-5-5'}, retention: 'session'};
  const {window, get, save} = await setup(t, answerResponse('answer'), {autoSave: false, storageState: {
    localStorage: {'notebook-ai.preferences.v1': JSON.stringify(saved)},
  }});
  assert.equal(get('model').value, 'my-custom-model');
  assert.equal(get('model-choice').value, 'custom');
  get('provider').value = 'anthropic';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.equal(get('model-choice').value, 'claude-sonnet-5-5');
  assert.equal(get('model-docs').hostname, 'platform.claude.com');
  get('provider').value = 'deepseek';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.equal(get('model').value, 'my-custom-model');
  get('model-choice').value = 'custom';
  get('model-choice').dispatchEvent(new window.Event('change'));
  assert.equal(window.document.activeElement, get('model'));
  get('model').value = 'another-custom:1';
  get('model').dispatchEvent(new window.Event('input'));
  assert.equal(get('model-choice').value, 'custom');
  get('key').value = 'test-not-a-real-key';
  get('consent').checked = true;
  save();
  const preferences = JSON.parse(window.localStorage.getItem('notebook-ai.preferences.v1'));
  assert.equal(preferences.models.deepseek, 'another-custom:1');
  assert.equal(preferences.models.anthropic, 'claude-sonnet-5-5');
  assert.ok(!JSON.stringify(preferences).includes('test-not-a-real-key'));
});

test('typing an exact preset updates selection and catalog use makes no network requests', async t => {
  let calls = 0;
  const {window, get} = await setup(t, async () => { calls++; }, {autoSave: false});
  get('model').value = 'gpt-6-luna';
  get('model').dispatchEvent(new window.Event('input'));
  assert.equal(get('model-choice').value, 'gpt-6-luna');
  get('model').value = '';
  get('model').dispatchEvent(new window.Event('input'));
  assert.equal(get('model-choice').value, '');
  assert.equal(calls, 0);
  assert.match(get('model-note').textContent, /2026-11-08/);
});

test('renders headings, emphasis, lists, tables and fenced code', async t => {
  const answer = '## 笔记依据\n\n**条件概率**与*独立性*。[1]\n\n- 事件 A\n- 事件 B\n\n'
    + '| 名称 | 含义 |\n| --- | --- |\n| 条件概率 | 限定样本空间 |\n\n'
    + '```python\nvalues[99] = "<script>"\nformula = "$x_1$"\n```\n\n`$x$ [1]`';
  const {get, submit} = await setup(t, answerResponse(answer));
  await submit();
  const output = get('answer');
  assert.equal(output.querySelector('h2').textContent, '笔记依据');
  assert.equal(output.querySelector('strong').textContent, '条件概率');
  assert.equal(output.querySelectorAll('ul li').length, 2);
  assert.equal(output.querySelector('tbody td').textContent, '条件概率');
  assert.match(output.querySelector('pre code').textContent, /values\[99\]/);
  assert.match(output.querySelector('pre code').textContent, /\$x_1\$/);
  assert.equal(output.querySelector('pre .katex'), null);
  assert.equal(output.querySelector('pre a'), null);
  assert.equal(output.querySelector('script'), null);
  assert.equal(output.querySelectorAll('a').length, 1);
});

test('renders dollar and backslash math without losing LaTeX escapes or creating citations in math', async t => {
  const answer = String.raw`行内 $P(A\mid B)=\frac{P(A\cap B)}{P(B)}$，另一个 \(x_1^2\)。[1]

$$
\begin{pmatrix}1&2\\3&4\end{pmatrix}
$$

\[
E[X]=\sum_{i=1}^{n} x_i p_i
\]

公式内 $a[1]+\sqrt{x}$，未知引用 [99]。`;
  const {get, submit} = await setup(t, answerResponse(answer));
  await submit();
  const output = get('answer');
  assert.equal(output.querySelectorAll('.katex').length, 5);
  assert.equal(output.querySelectorAll('.katex-display').length, 2);
  assert.equal(output.querySelectorAll('.katex-error').length, 0);
  assert.equal(output.querySelectorAll('annotation[encoding="application/x-tex"]').length, 5);
  assert.match(output.querySelector('annotation').textContent, /\\frac/);
  assert.equal(output.querySelectorAll('a').length, 1);
  assert.equal(output.querySelector('.notebook-ai-math a'), null);
  assert.match(output.textContent, /\[99\]/);
});

test('display matrices and determinants with standalone equals signs stay math instead of Setext headings', async t => {
  const answer = String.raw`矩阵写法：

\[
\boldsymbol z=
\begin{pmatrix}
z_1\\z_2
\end{pmatrix}
=
\begin{pmatrix}
\dfrac{x-\mu_1}{\sigma_1}\\[4pt]
\dfrac{y-\mu_2}{\sigma_2}
\end{pmatrix},
\]

行列式：

\[
\det\Sigma
=
\sigma_1^2\sigma_2^2(1-\rho^2).
\]

则笔记中的指数部分可写成 $-\frac{z_1^2-2\rho z_1z_2+z_2^2}{2(1-\rho^2)}$。`;
  const {get, submit} = await setup(t, answerResponse(answer));
  await submit();
  const output = get('answer');
  assert.equal(output.querySelector('h1, h2'), null);
  assert.equal(output.querySelectorAll('.katex-display').length, 2);
  assert.equal(output.querySelectorAll('.katex').length, 3);
  assert.equal(output.querySelectorAll('.katex-error').length, 0);
  const tex = [...output.querySelectorAll('annotation')].map(node => node.textContent);
  assert.ok(tex[0].includes(String.raw`z_1\\z_2`));
  assert.ok(tex[0].includes(String.raw`\\[4pt]`));
  assert.ok(tex[1].includes(String.raw`\det\Sigma`));
});

test('math precedence preserves Markdown headings and code and works with dollar math in nested blocks', async t => {
  const answer = String.raw`真正的一级标题
===

真正的二级标题
---

$$
a
=
b
$$

> \[
> x
> =
> y
> \]

- 推导：

  \[
  u
  =
  v
  \]

~~~latex
\[
code
=
literal
\]
~~~

    $$
    indented
    =
    code
    $$`;
  const {get, submit} = await setup(t, answerResponse(answer));
  await submit();
  const output = get('answer');
  assert.equal(output.querySelectorAll('h1').length, 1);
  assert.equal(output.querySelector('h1').textContent, '真正的一级标题');
  assert.equal(output.querySelectorAll('h2').length, 1);
  assert.equal(output.querySelector('h2').textContent, '真正的二级标题');
  assert.equal(output.querySelectorAll('.katex-display').length, 3);
  assert.equal(output.querySelectorAll('.katex-error').length, 0);
  assert.ok(output.querySelector('blockquote .katex-display'));
  assert.ok(output.querySelector('li .katex-display'));
  assert.equal(output.querySelectorAll('pre').length, 2);
  assert.equal(output.querySelector('pre .katex'), null);
  assert.match(output.querySelector('pre').textContent, /code\n=\nliteral/);
});

test('rejects scripts, dangerous links, external images and trusted-TeX commands', async t => {
  const answer = String.raw`<script>window.compromised = true</script>
<svg onload="alert(1)"></svg>
<iframe src="https://evil.example/"></iframe>
[bad](javascript:alert%281%29) [outside](https://evil.example/) ![pixel](https://evil.example/pixel)
<span class="notebook-ai-math" data-math-index="0">forged</span>
$\href{javascript:alert(1)}{click}$
$\includegraphics{https://evil.example/pixel}$
$\htmlClass{evil}{payload}$
[1]`;
  const {window, get, submit} = await setup(t, answerResponse(answer));
  await submit();
  const output = get('answer');
  assert.equal(window.compromised, undefined);
  assert.equal(output.querySelector('script, iframe, img, [onload], [onerror], .evil'), null);
  assert.equal(output.querySelectorAll('a').length, 1);
  assert.equal(output.querySelector('a').origin, window.location.origin);
  assert.equal(output.querySelectorAll('.notebook-ai-math').length, 3);
});

test('falls back to plain text when rendering dependencies are missing', async t => {
  const {get, submit} = await setup(t, answerResponse('**Answer** <img src=x onerror=alert(1)>'), {rendering: false});
  await submit();
  assert.match(get('answer').textContent, /\*\*Answer\*\*/);
  assert.equal(get('answer').querySelector('img'), null);
  assert.match(get('status').textContent, /排版资源未加载/);
});

test('math works in lists and quotes; escaped delimiters and code remain literal', async t => {
  const answer = String.raw`> $$x^2$$

- 行内 $x_1$。
- \(y_2\)

\$literal\$ and \$5

    $$code[1]$$

未闭合 $x 和 \(y。

[$z$](/probability/#conditional)`;
  const {get, submit} = await setup(t, answerResponse(answer));
  await submit();
  const output = get('answer');
  assert.equal(output.querySelectorAll('.katex').length, 4);
  assert.equal(output.querySelectorAll('.katex-error').length, 0);
  assert.ok(output.querySelector('blockquote .katex-display'));
  assert.equal(output.querySelectorAll('li .katex').length, 2);
  assert.match(output.querySelector('pre code').textContent, /\$\$code\[1\]\$\$/);
  assert.match(output.textContent, /\$literal\$/);
  assert.match(output.textContent, /未闭合 \$x/);
  assert.ok(output.querySelector('a .katex'));
});

const credentialName = 'notebook-ai.credentials.v1';
const preferenceName = 'notebook-ai.preferences.v1';
const snapshot = window => Object.fromEntries(['localStorage', 'sessionStorage'].map(area => [area,
  Object.fromEntries(Object.keys(window[area]).map(key => [key, window[area].getItem(key)])),
]));

test('temporary keys restore without extending expiry; conversation storage is separate from credentials', async t => {
  const first = await setup(t, answerResponse('temporary answer'));
  await first.submit();
  const before = JSON.parse(first.window.sessionStorage.getItem(credentialName));
  const next = await setup(t, async () => { throw new Error('unexpected'); }, {storageState: snapshot(first.window), autoSave: false});
  assert.equal(next.get('key').value, 'test-not-a-real-key');
  assert.equal(JSON.parse(next.window.sessionStorage.getItem(credentialName)).expiresAt, before.expiresAt);
  assert.equal(next.get('answer'), null);
  assert.ok(!JSON.stringify(snapshot(first.window)).includes('temporary answer'));
  assert.equal(before.expiresAt > Date.now() + 119 * 60000, true);
});

test('7 and 30 day persistence is opt-in, has a fixed expiry, and can be explicitly removed', async t => {
  for (const days of [7, 30]) {
    const first = await setup(t, answerResponse('ok'), {retention: String(days)});
    const stored = JSON.parse(first.window.localStorage.getItem(credentialName));
    assert.ok(Math.abs(stored.expiresAt - Date.now() - days * 86400000) < 3000);
    assert.equal(first.window.sessionStorage.getItem(credentialName), null);
    const next = await setup(t, answerResponse('ok'), {autoSave: false, storageState: {localStorage: snapshot(first.window).localStorage}});
    assert.equal(next.get('key').value, stored.key);
    await next.submit();
    assert.equal(JSON.parse(next.window.localStorage.getItem(credentialName)).expiresAt, stored.expiresAt);
    next.get('clear').click();
    assert.equal(next.window.localStorage.getItem(credentialName), null);
    assert.ok(!next.get('summary').textContent.includes(stored.key));
  }
});

test('expired and malformed saved credentials are removed and never sent', async t => {
  for (const value of ['{bad json', JSON.stringify({key: 'test-not-a-real-key', provider: 'openai', consent: true, expiresAt: Date.now() - 100})]) {
    let requests = 0;
    const {window, get, submit} = await setup(t, async () => { requests++; }, {
      autoSave: false, storageState: {localStorage: {[credentialName]: value}},
    });
    assert.equal(window.localStorage.getItem(credentialName), null);
    assert.equal(get('key').value, '');
    await submit();
    assert.equal(requests, 0);
    assert.match(get('settings-status').textContent, /先保存设置/);
  }
});

test('expiry is rechecked before sending even if the browser throttled timers', async t => {
  let calls = 0;
  const {window, get, submit} = await setup(t, async () => { calls++; });
  window.Date.now = () => Date.now() + 3 * 3600000;
  await submit();
  assert.equal(calls, 0);
  assert.equal(get('key').value, '');
  assert.equal(window.sessionStorage.getItem(credentialName), null);
});

test('follow-ups include bounded successful turns; each answer keeps its own sources and new chat clears context', async t => {
  const requests = [];
  const {get, submit} = await setup(t, async (url, options) => {
    requests.push(JSON.parse(options.body));
    return {ok: true, headers: new Headers({'Content-Type': 'application/json'}), json: async () => ({
      answer: `回答 ${requests.length} [1]`, sources: [{id: 1, title: `笔记 ${requests.length}`, url: `/note-${requests.length}/`}],
    })};
  });
  await submit();
  get('question').value = '再举一个例子';
  await submit();
  assert.deepEqual(requests[1].history, [{role: 'user', content: '条件概率是什么？'}, {role: 'assistant', content: '回答 1 [1]'}]);
  assert.equal(get('messages').querySelectorAll('[data-answer]').length, 2);
  assert.equal(get('messages').querySelectorAll('[data-answer] a')[0].pathname, '/note-1/');
  assert.equal(get('messages').querySelectorAll('[data-answer] a')[1].pathname, '/note-2/');
  get('new').click();
  get('question').value = '新问题';
  await submit();
  assert.deepEqual(requests[2].history, []);
});

test('UTF-8 history is pruned as full pairs under the proxy limit', async t => {
  const requests = [];
  const {get, submit} = await setup(t, async (url, options) => {
    requests.push(options.body);
    return answerResponse('长'.repeat(4000))();
  });
  for (let i = 0; i < 5; i++) {
    get('question').value = '问'.repeat(2000);
    await submit();
  }
  for (const body of requests) {
    assert.ok(Buffer.byteLength(body, 'utf8') <= 18000);
    const history = JSON.parse(body).history;
    assert.equal(history.length % 2, 0);
    assert.ok(history.length <= 6);
  }
});

test('reading and collapsing while pending do not abort; failed rounds do not enter history', async t => {
  let resolve;
  let signal;
  const {window, panel, get, submit} = await setup(t, async (url, options) => {
    signal = options.signal;
    return new Promise(r => { resolve = r; });
  });
  await submit();
  assert.equal(get('close').disabled, false);
  assert.equal(get('settings').disabled, false);
  assert.equal(get('new').disabled, false);
  get('close').click();
  assert.equal(signal.aborted, false);
  // Material replaces only its container, not the body-mounted chat panel.
  const container = window.document.createElement('main');
  container.setAttribute('data-md-component', 'container');
  window.document.body.prepend(container);
  container.replaceWith(window.document.createElement('main'));
  resolve(await answerResponse('background answer')());
  await new Promise(setImmediate);
  assert.match(get('answer').textContent, /background answer/);
  assert.equal(panel.hidden, true);
  window.document.querySelector('.notebook-ai-launch').click();
  assert.equal(panel.hidden, false);
  assert.equal(window.document.querySelectorAll('.notebook-ai').length, 1);
});

test('changing provider and saving starts a new conversation; remembered models are per provider', async t => {
  let last;
  const {window, get, save, submit} = await setup(t, async (url, options) => {
    last = JSON.parse(options.body);
    return answerResponse('old provider answer')();
  });
  await submit();
  get('provider').value = 'deepseek';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.equal(get('key').value, '');
  get('key').value = 'test-deepseek-key';
  get('model').value = 'my-available-model';
  get('consent').checked = true;
  save();
  get('question').value = '新供应商问题';
  await submit();
  assert.deepEqual(last.history, []);
  assert.equal(last.provider, 'deepseek');
  get('provider').value = 'openai';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.equal(get('model').value, 'test-model');
});

test('failed requests restore the question, allow retry, and are not replayed as history', async t => {
  let calls = 0;
  let retried;
  const {get, submit} = await setup(t, async (url, options) => {
    if (++calls === 1) return {ok: false, headers: new Headers({'Content-Type': 'application/json'}), json: async () => ({error: '模型暂不可用'})};
    retried = JSON.parse(options.body);
    return answerResponse('retry works')();
  });
  await submit();
  assert.equal(get('question').value, '条件概率是什么？');
  assert.equal(get('submit').disabled, false);
  await submit();
  assert.deepEqual(retried.history, []);
});

test('blocked browser storage falls back to page memory with a clear notice', async t => {
  const {window, get, submit} = await setup(t, answerResponse('memory works'), {blockStorage: true, retention: '30'});
  assert.match(get('status').textContent, /浏览器禁止存储/);
  assert.equal(window.localStorage.getItem(credentialName), null);
  assert.equal(window.sessionStorage.getItem(credentialName), null);
  await submit();
  assert.match(get('answer').textContent, /memory works/);
});

test('explicit clearing in another tab invalidates a persistent key in memory', async t => {
  let calls = 0;
  const {window, get, submit} = await setup(t, async () => { calls++; }, {retention: '7'});
  window.localStorage.removeItem(credentialName);
  window.dispatchEvent(new window.StorageEvent('storage', {key: credentialName, newValue: null}));
  assert.equal(get('key').value, '');
  await submit();
  assert.equal(calls, 0);
});

test('stop waiting aborts the browser request, unlocks retry, and states possible charges', async t => {
  const {window, get, submit} = await setup(t, async (url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new window.DOMException('Aborted', 'AbortError')));
  }));
  await submit();
  get('stop').click();
  await new Promise(setImmediate);
  assert.match(get('status').textContent, /已停止等待.*仍可能产生费用/);
  assert.equal(get('submit').disabled, false);
  assert.equal(get('question').value, '条件概率是什么？');
});

test('partial answer stays marked, and preparing continuation does not create a paid request', async t => {
  const requests = [];
  const tail = 'UNFINISHED_FORMULA_TAIL';
  const partial = '开头'.repeat(5000) + tail;
  const {get, submit} = await setup(t, async (url, options) => {
    requests.push(JSON.parse(options.body));
    return {ok: true, headers: new Headers({'Content-Type': 'application/json'}), json: async () => ({
      answer: requests.length === 1 ? partial : '完整续写。', sources: [],
      truncated: requests.length === 1, finish_reason: requests.length === 1 ? 'max_tokens' : 'stop',
    })};
  });
  get('question').value = '请详细讲解二维正态分布';
  await submit();
  assert.match(get('status').textContent, /尚未完成/);
  assert.equal(get('continue').hidden, false);
  assert.equal(get('messages').querySelectorAll('.notebook-ai-warning').length, 1);
  get('continue').click();
  assert.equal(requests.length, 1);
  assert.match(get('question').value, /请继续上一条/);
  assert.match(get('status').textContent, /点击发送后才会调用/);
  await submit();
  assert.equal(requests.length, 2);
  assert.ok(requests[1].history[1].content.endsWith(tail));
  assert.match(requests[1].history[1].content, /中段已省略/);
  assert.ok(requests[1].history[1].content.length <= 4000);
  assert.equal(get('continue').hidden, true);
  assert.equal(get('messages').querySelectorAll('.notebook-ai-warning').length, 1);
});


const jsonResponse = (data, status = 200) => ({ok: status >= 200 && status < 300, status,
  headers: new Headers({'Content-Type': 'application/json'}), json: async () => data});
const answerData = {answer: '完整回答 $x_1$', sources: [], truncated: false};

test('elapsed time advances locally without receiving a server message and stops after completion', async t => {
  let finish;
  let now = 0;
  let tick;
  let cleared = false;
  const {window, get, submit} = await setup(t, async () => new Promise(resolve => { finish = () => resolve(jsonResponse(answerData)); }), {
    beforeScript(window) {
      window.performance.now = () => now;
      window.setInterval = callback => { tick = callback; return 123; };
      window.clearInterval = id => { if (id === 123) cleared = true; };
    },
  });
  await submit();
  assert.match(get('status').textContent, /已等待 0 秒/);
  now = 1000; tick();
  assert.match(get('status').textContent, /已等待 1 秒/);
  now = 4200; tick();
  assert.match(get('status').textContent, /已等待 4 秒/);
  now = 133000;
  window.document.dispatchEvent(new window.Event('visibilitychange'));
  assert.match(get('status').textContent, /已等待 133 秒/);
  finish();
  await new Promise(setImmediate);
  assert.equal(cleared, true);
  const status = get('status').textContent;
  now = 200000;
  window.document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(get('status').textContent, status);
});

test('polling obtains a completed job with exactly one creation and keeps key out of IDs and bodies', async t => {
  const calls = [];
  const {get, submit} = await setup(t, async (url, options) => {
    calls.push({url, ...options});
    const id = options.headers['X-Notebook-Request-ID'];
    if (url === '/api/jobs') return jsonResponse({job_id: id, state: 'pending'}, 202);
    return jsonResponse({job_id: id, state: 'completed', result: answerData});
  });
  await submit();
  assert.equal(calls.filter(call => call.url === '/api/jobs').length, 1);
  assert.equal(calls.length, 2);
  assert.match(calls[0].headers['X-Notebook-Request-ID'], /^[a-f0-9]{32}$/);
  for (const call of calls) {
    assert.equal(call.headers.Authorization, 'Bearer test-not-a-real-key');
    assert.ok(!call.url.includes('test-not-a-real-key'));
    assert.ok(!call.body.includes('test-not-a-real-key'));
  }
  assert.match(get('answer').textContent, /完整回答/);
});

test('losing a creation response recovers by querying the same ID without resubmitting', async t => {
  const calls = [];
  const {get, submit} = await setup(t, async (url, options) => {
    calls.push(url);
    if (url === '/api/jobs') throw new TypeError('network error');
    return jsonResponse({job_id: options.headers['X-Notebook-Request-ID'], state: 'completed', result: answerData});
  });
  await submit();
  assert.equal(calls.filter(url => url === '/api/jobs').length, 1);
  assert.equal(calls.filter(url => url.endsWith('/result')).length, 1);
  assert.match(get('answer').textContent, /完整回答/);
});

test('a temporary polling failure retries only the status query', async t => {
  const calls = [];
  let queries = 0;
  const {get, submit} = await setup(t, async (url, options) => {
    calls.push(url);
    const id = options.headers['X-Notebook-Request-ID'];
    if (url === '/api/jobs') return jsonResponse({job_id: id, state: 'pending'}, 202);
    if (++queries === 1) return jsonResponse({error: 'temporary gateway error'}, 502);
    return jsonResponse({job_id: id, state: 'completed', result: answerData});
  }, {beforeScript(window) {
    const original = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay) => original(callback, delay === 2000 ? 0 : delay);
  }});
  await submit();
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(calls.filter(url => url === '/api/jobs').length, 1);
  assert.equal(queries, 2);
  assert.match(get('answer').textContent, /完整回答/);
});

test('expired jobs and provider failures never start a new generation automatically', async t => {
  for (const expired of [true, false]) {
    let creations = 0;
    const {get, submit} = await setup(t, async (url, options) => {
      const id = options.headers['X-Notebook-Request-ID'];
      if (url === '/api/jobs') { creations++; return jsonResponse({job_id: id, state: 'pending'}, 202); }
      if (url.endsWith('/cancel')) return jsonResponse({job_id: id, state: 'cancelled'});
      return expired ? jsonResponse({error: '任务不存在、已过期或服务已更新'}, 404)
        : jsonResponse({job_id: id, state: 'failed', error: '模型已用尽输出预算', status: 502});
    });
    await submit();
    assert.equal(creations, 1);
    assert.equal(get('answer'), null);
    assert.match(get('status').textContent, /已过期|输出预算/);
    assert.equal(get('submit').disabled, false);
  }
});

test('stopping a pending job sends a cancellation without another creation', async t => {
  const calls = [];
  const {get, submit} = await setup(t, async (url, options) => {
    calls.push(url);
    const id = options.headers['X-Notebook-Request-ID'];
    return jsonResponse({job_id: id, state: url.endsWith('/cancel') ? 'cancelled' : 'pending', stage: 'answer'}, url === '/api/jobs' ? 202 : 200);
  });
  await submit();
  assert.match(get('status').textContent, /等待模型/);
  get('stop').click();
  await new Promise(setImmediate);
  assert.match(get('status').textContent, /已停止等待/);
  assert.equal(calls.filter(url => url === '/api/jobs').length, 1);
  assert.equal(calls.filter(url => url.endsWith('/cancel')).length, 1);
  assert.equal(get('submit').disabled, false);
});

test('unknown outcome of creation never causes an automatic second model request', async t => {
  const calls = [];
  const {get, submit} = await setup(t, async (url, options) => {
    calls.push(url);
    if (url === '/api/jobs') throw new TypeError('network error');
    return jsonResponse({error: 'unknown request'}, 404);
  });
  await submit();
  assert.equal(calls.filter(url => url === '/api/jobs').length, 1);
  assert.equal(get('answer'), null);
  assert.match(get('status').textContent, /未能确认任务是否已创建/);
});

test('size-limited and otherwise incomplete job results remain marked and allow manual continuation', async t => {
  for (const reason of ['size_limit', 'incomplete']) {
    const {get, submit} = await setup(t, async (url, options) => {
      const id = options.headers['X-Notebook-Request-ID'];
      return jsonResponse(url === '/api/jobs' ? {job_id: id, state: 'pending'}
        : {job_id: id, state: 'completed', result: {answer: 'partial', sources: [], truncated: true, finish_reason: reason}});
    });
    await submit();
    assert.match(get('status').textContent, /长度上限|可能不完整/);
    assert.doesNotMatch(get('status').textContent, /回答完成/);
    get('new').click();
    assert.equal(get('continue').hidden, true);
  }
});

test('a stalled short query times out and recovers by querying without recreating the job', async t => {
  let creates = 0;
  let polls = 0;
  const {window, get, submit} = await setup(t, async (url, options) => {
    const id = options.headers['X-Notebook-Request-ID'];
    if (url === '/api/jobs') { creates++; return jsonResponse({job_id: id, state: 'pending'}, 202); }
    if (url.endsWith('/cancel')) return jsonResponse({job_id: id, state: 'cancelled'});
    if (++polls === 1) return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new window.DOMException('timeout', 'AbortError')));
    });
    return jsonResponse({job_id: id, state: 'completed', result: answerData});
  }, {beforeScript(window) {
    const original = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay) => original(callback, delay === 12000 || delay === 2000 ? 0 : delay);
  }});
  await submit();
  await new Promise(resolve => setTimeout(resolve, 40));
  assert.equal(creates, 1);
  assert.equal(polls, 2);
  assert.match(get('answer').textContent, /完整回答/);
});

test('manual scope selection sends public IDs and clears back to all notes', async t => {
  let request;
  const fetch = async (url, options) => {
    if (url === '/api/notes') return {ok: true, json: async () => ({folders: [], pages: [{id: 'a'.repeat(24), title: 'Current note', path: '/a-note/'}]})};
    request = JSON.parse(options.body);
    return answerResponse('answer')();
  };
  const {get, window, submit} = await setup(t, fetch);
  get('current-note').click();
  await new Promise(setImmediate);
  assert.match(get('scope-label').textContent, /1/);
  await submit();
  assert.deepEqual(request.scope, {ids: ['a'.repeat(24)], mode: 'strict'});
  get('scope-clear').click();
  get('question').value = 'next';
  await submit();
  assert.equal(request.scope, undefined);
  assert.equal(get('scope-label').textContent, '全部笔记');
});

test('conversation switching keeps simultaneous answers in their original conversations', async t => {
  let resolveFirst;
  const fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    if (body.question === 'first question') return new Promise(resolve => { resolveFirst = resolve; });
    return answerResponse('second answer')();
  };
  const {window, get, submit} = await setup(t, fetch);
  get('question').value = 'first question'; await submit();
  const firstID = get('session').value;
  get('new').click();
  assert.notEqual(get('session').value, firstID);
  get('question').value = 'second question'; await submit();
  assert.match(get('messages').textContent, /second answer/);
  resolveFirst(await answerResponse('first answer')());
  await new Promise(resolve => setTimeout(resolve, 15)); await window.NotebookAIFlush();
  assert.ok(!get('messages').textContent.includes('first answer'));
  get('session').value = firstID; get('session').dispatchEvent(new window.Event('change'));
  assert.match(get('messages').textContent, /first answer/);
  assert.ok(!get('messages').textContent.includes('second answer'));
  assert.equal(get('submit').disabled, false);
});

test('refresh restores conversation text, model, and citations from IndexedDB', async t => {
  const indexedDB = new IDBFactory();
  const first = await setup(t, answerResponse('saved answer'), {indexedDB});
  await first.submit(); await first.window.NotebookAIFlush();
  const next = await setup(t, answerResponse('next answer'), {indexedDB, autoSave: false});
  assert.match(next.get('messages').textContent, /saved answer/);
  assert.equal(next.get('model').value, 'test-model');
  assert.equal(next.get('sources').querySelector('a').pathname, '/probability/');
  assert.equal(next.get('session').options.length, 1);
});

require('./test_conversations.cjs');


test('old-turn summaries and learning preferences persist and reach only their intended conversations', async t => {
  const requests = [], indexedDB = new IDBFactory();
  const fetch = async (url, options) => {
    const body = JSON.parse(options.body); requests.push(body);
    return answerResponse(body.task === 'summary' ? '已理解正态分布，接下来研究条件分布。' : 'answer')();
  };
  const first = await setup(t, fetch, {indexedDB});
  first.get('learning-notes').value = '先讲直觉';
  first.get('learning-notes').dispatchEvent(new first.window.Event('change'));
  for (let i = 1; i <= 6; i++) { first.get('question').value = `question ${i}`; await first.submit(); }
  assert.equal(requests.filter(body => body.task === 'summary').length, 0);
  assert.equal(first.get('summarize').disabled, false);
  first.get('summarize').click();
  await new Promise(resolve => setTimeout(resolve, 15)); await first.window.NotebookAIFlush();
  const summary = requests.find(body => body.task === 'summary');
  assert.equal(summary.history.length, 6);
  assert.equal(summary.history[0].content, 'question 1');
  assert.equal(summary.history.at(-2).content, 'question 3');
  assert.match(first.get('session-memory').value, /已理解正态/);
  const next = await setup(t, fetch, {indexedDB});
  assert.equal(next.get('learning-notes').value, '先讲直觉');
  next.get('question').value = 'follow-up'; await next.submit();
  assert.match(requests.at(-1).memory.summary, /已理解正态/);
  assert.equal(requests.at(-1).memory.notes, '先讲直觉');
  assert.equal(requests.at(-1).history.at(-2).content, 'question 6');
  next.get('new').click(); next.get('question').value = 'new topic'; await next.submit();
  assert.equal(requests.at(-1).memory.summary, '');
  assert.equal(requests.at(-1).memory.notes, '先讲直觉');
  assert.deepEqual(requests.at(-1).history, []);
});

test('automatic summaries require opt-in and do not overwrite memory with truncated output', async t => {
  let summaries = 0;
  const fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    if (body.task === 'summary') {
      summaries++;
      return jsonResponse({answer: 'partial', sources: [], truncated: true, finish_reason: 'max_tokens'});
    }
    return answerResponse('answer')();
  };
  const {window, get, submit} = await setup(t, fetch);
  get('session-memory').value = '保留这条记忆'; get('session-memory').dispatchEvent(new window.Event('change'));
  for (let i = 0; i < 7; i++) { get('question').value = `question ${i}`; await submit(); }
  assert.equal(summaries, 0);
  get('auto-summary').checked = true; get('auto-summary').dispatchEvent(new window.Event('change'));
  get('question').value = 'next'; await submit();
  await new Promise(resolve => setTimeout(resolve, 15)); await window.NotebookAIFlush();
  assert.equal(summaries, 1);
  assert.equal(get('session-memory').value, '保留这条记忆');
  assert.match(get('status').textContent, /原有记忆已保留/);
  get('clear-memory').click();
  get('question').value = 'after clearing memory'; await submit();
  assert.equal(summaries, 1);
  assert.equal(get('session-memory').value, '');
});

test('manual memory edits made during summarization are never overwritten', async t => {
  let finishSummary;
  const {window, get, submit} = await setup(t, async (url, options) => {
    if (JSON.parse(options.body).task === 'summary') return new Promise(resolve => { finishSummary = resolve; });
    return answerResponse('answer')();
  });
  for (let i = 0; i < 6; i++) { get('question').value = `question ${i}`; await submit(); }
  get('summarize').click(); await new Promise(setImmediate);
  get('session-memory').value = '我的手动修改'; get('session-memory').dispatchEvent(new window.Event('change'));
  finishSummary(await answerResponse('model summary')());
  await new Promise(resolve => setTimeout(resolve, 15)); await window.NotebookAIFlush();
  assert.equal(get('session-memory').value, '我的手动修改');
  assert.match(get('status').textContent, /没有覆盖/);
});

test('each conversation restores its own selected-note scope', async t => {
  const requests = [];
  const {window, get, submit} = await setup(t, async (url, options) => {
    if (url === '/api/notes') return {ok: true, json: async () => ({folders: [], pages: [{id: 'b'.repeat(24), title: 'Current note', path: '/a-note/'}]})};
    requests.push(JSON.parse(options.body)); return answerResponse('answer')();
  });
  get('current-note').click(); await new Promise(setImmediate);
  const first = get('session').value;
  get('new').click();
  assert.equal(get('scope-label').textContent, '全部笔记');
  get('session').value = first; get('session').dispatchEvent(new window.Event('change'));
  assert.match(get('scope-label').textContent, /1/);
  get('question').value = 'use selected note'; await submit();
  assert.deepEqual(requests[0].scope.ids, ['b'.repeat(24)]);
});


test('panel width resizes with keyboard, clamps to reading space, and restores numeric preferences', async t => {
  const {window, get} = await setup(t, answerResponse('answer'));
  const handle = get('resize');
  assert.equal(handle.getAttribute('aria-orientation'), 'vertical');
  const initial = Number(handle.getAttribute('aria-valuenow'));
  handle.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
  assert.equal(Number(handle.getAttribute('aria-valuenow')), initial + 16);
  handle.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'End', bubbles: true}));
  assert.equal(handle.getAttribute('aria-valuenow'), handle.getAttribute('aria-valuemax'));
  const saved = window.localStorage.getItem('notebook-ai.layout.v1');
  const next = await setup(t, answerResponse('answer'), {storageState: {localStorage: {'notebook-ai.layout.v1': saved}}});
  assert.equal(next.get('resize').getAttribute('aria-valuenow'), handle.getAttribute('aria-valuenow'));
  assert.ok(!saved.includes('test-not-a-real-key'));
});

test('mobile separator changes panel height without consuming the entire notebook viewport', async t => {
  const {window, get} = await setup(t, answerResponse('answer'), {beforeScript: window => {
    window.innerWidth = 390; window.innerHeight = 844;
    window.matchMedia = () => ({matches: true, addEventListener() {}});
  }});
  const handle = get('resize');
  assert.equal(handle.getAttribute('aria-orientation'), 'horizontal');
  handle.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'End', bubbles: true}));
  assert.ok(Number(handle.getAttribute('aria-valuenow')) <= 844 * .85);
  handle.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Home', bubbles: true}));
  assert.equal(handle.getAttribute('aria-valuenow'), '300');
});

test('welcome suggestions fill the question without calling a model and references start folded', async t => {
  let calls = 0;
  const {window, get, panel, submit} = await setup(t, async () => { calls++; return answerResponse('answer [1]')(); });
  panel.querySelector('[data-prompt="normal"]').click();
  assert.match(get('question').value, /一维正态分布/);
  assert.equal(window.document.activeElement, get('question'));
  assert.equal(calls, 0);
  await submit();
  assert.equal(calls, 1);
  assert.equal(panel.querySelector('.notebook-ai-references').open, false);
  assert.match(panel.querySelector('.notebook-ai-references summary').textContent, /参考笔记 · 1/);
});
