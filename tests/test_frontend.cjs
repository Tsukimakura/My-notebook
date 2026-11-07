const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');

async function setup(t, fetch) {
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
