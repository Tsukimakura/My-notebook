const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');

async function setup(t, fetch, {rendering = true} = {}) {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://notes.example.com/a-note/', runScripts: 'outside-only',
  });
  t.after(() => dom.window.close());
  const {window} = dom;
  if (window.document.readyState === 'loading') {
    await new Promise(resolve => window.document.addEventListener('DOMContentLoaded', resolve, {once: true}));
  }
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new window.Event('close'));
  };
  window.fetch = fetch;
  if (rendering) {
    for (const asset of ['markdown-it/markdown-it.min.js', 'dompurify/purify.min.js', 'katex/katex.min.js']) {
      window.eval(fs.readFileSync('docs/assets/vendor/' + asset, 'utf8'));
    }
  }
  window.eval(fs.readFileSync('docs/javascripts/notebook-ai.js', 'utf8'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  window.document.querySelector('.notebook-ai-launch').click();
  const panel = window.document.querySelector('dialog');
  const get = name => panel.querySelector(`[data-${name}]`);
  get('key').value = 'test-not-a-real-key';
  get('model').value = 'test-model';
  get('question').value = '条件概率是什么？';
  get('consent').checked = true;
  const submit = async () => {
    panel.querySelector('form').dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));
    await new Promise(setImmediate);
  };
  return {window, panel, get, submit};
}

test('model HTML stays text, citations stay same-origin, keys stay out of storage and body', async t => {
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
  assert.equal(window.localStorage.length, 0);
  assert.equal(window.sessionStorage.length, 0);
  assert.equal(window.document.cookie, '');
});

test('closing clears key, question, answer and consent; changing provider clears credentials', async t => {
  const {window, panel, get} = await setup(t, async () => { throw new Error('unused'); });
  get('provider').value = 'anthropic';
  get('provider').dispatchEvent(new window.Event('change'));
  assert.equal(get('key').value, '');
  assert.equal(get('model').value, '');
  get('key').value = 'test-secret';
  get('answer').textContent = 'old answer';
  panel.close();
  assert.equal(get('key').value, '');
  assert.equal(get('question').value, '');
  assert.equal(get('answer').textContent, '');
  assert.equal(get('consent').checked, false);
});

test('HTML proxy errors produce a useful message and allow retry', async t => {
  const {get, submit} = await setup(t, async () => ({ok: false, headers: new Headers({'Content-Type': 'text/html'})}));
  await submit();
  assert.match(get('status').textContent, /后端尚未接入/);
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
