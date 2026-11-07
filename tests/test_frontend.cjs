const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');

async function setup(t, fetch, {rendering = true, storageState = {}, autoSave = true, retention = 'session', blockStorage = false} = {}) {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://notes.example.com/a-note/', runScripts: 'outside-only',
  });
  t.after(() => dom.window.close());
  const {window} = dom;
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
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai.js', 'utf8'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
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
    await new Promise(setImmediate);
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
  assert.equal(request.url, '/api/ask');
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

test('temporary keys restore after refresh without extending their expiry; transcript does not persist', async t => {
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
  assert.equal(get('new').disabled, true);
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

function sseResponse(text, chunkSize = 7) {
  const bytes = new TextEncoder().encode(text);
  return new Response(new ReadableStream({start(controller) {
    for (let start = 0; start < bytes.length; start += chunkSize) controller.enqueue(bytes.slice(start, start + chunkSize));
    controller.close();
  }}), {headers: {'Content-Type': 'text/event-stream'}});
}

const sseEvent = (name, data) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;

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

test('SSE parser handles UTF-8 and event boundaries split across network chunks', async t => {
  const wire = ': keep-alive\r\n\r\n' + sseEvent('progress', {stage: 'answer', elapsed: 8})
    + sseEvent('complete', {answer: '中文回答 $x_1$ [1]', sources: [{id: 1, title: '笔记', url: '/note/#section'}], truncated: false});
  let headers;
  const {get, submit} = await setup(t, async (url, options) => {
    headers = options.headers;
    return sseResponse(wire, 1);
  });
  await submit();
  assert.equal(headers.Accept, 'text/event-stream');
  assert.match(headers['Cache-Control'], /no-transform/);
  assert.match(get('answer').textContent, /中文回答/);
  assert.equal(get('answer').querySelectorAll('.katex').length, 1);
  assert.equal(get('answer').querySelector('a').pathname, '/note/');
  assert.match(get('status').textContent, /回答完成/);
});

test('SSE progress appears before completion and does not block reading', async t => {
  let finish;
  const response = new Response(new ReadableStream({start(controller) {
    const encoder = new TextEncoder();
    controller.enqueue(encoder.encode(sseEvent('progress', {stage: 'answer', elapsed: 16})));
    finish = () => { controller.enqueue(encoder.encode(sseEvent('complete', {answer: 'later', sources: [], truncated: false}))); controller.close(); };
  }}), {headers: {'Content-Type': 'text/event-stream'}});
  const {get, submit} = await setup(t, async () => response);
  await submit();
  assert.match(get('status').textContent, /已等待 16 秒/);
  assert.equal(get('answer'), null);
  assert.equal(get('close').disabled, false);
  get('close').click();
  finish();
  await new Promise(setImmediate);
  assert.match(get('answer').textContent, /later/);
});

test('an SSE error or missing final event is not accepted as an answer and permits retry', async t => {
  for (const wire of [sseEvent('progress', {stage: 'retrieval', elapsed: 0}), sseEvent('error', {error: '等待模型超时', status: 504})]) {
    let calls = 0;
    let retry;
    const {get, submit} = await setup(t, async (url, options) => {
      if (++calls === 1) return sseResponse(wire);
      retry = JSON.parse(options.body);
      return answerResponse('retry answer')();
    });
    await submit();
    assert.equal(get('answer'), null);
    assert.equal(get('submit').disabled, false);
    assert.equal(get('question').value, '条件概率是什么？');
    assert.match(get('status').textContent, /提前结束|等待模型超时/);
    await submit();
    assert.deepEqual(retry.history, []);
  }
});

test('size-limited and otherwise incomplete responses are never labeled complete', async t => {
  for (const reason of ['size_limit', 'incomplete']) {
    const {get, submit} = await setup(t, async () => sseResponse(sseEvent('complete', {
      answer: 'partial', sources: [], truncated: true, finish_reason: reason,
    })));
    await submit();
    assert.match(get('status').textContent, /长度上限|可能不完整/);
    assert.doesNotMatch(get('status').textContent, /回答完成/);
    get('new').click();
    assert.equal(get('continue').hidden, true);
  }
});
