const {test} = require('node:test');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');
const fs = require('node:fs');
function fixture(t, html) {
  const dom = new JSDOM(`<article>${html}</article>`, {url: 'https://notes.example.com/course/note/', runScripts: 'outside-only'});
  t.after(() => dom.window.close());
  dom.window.eval(fs.readFileSync('docs/javascripts/notebook-selection.js', 'utf8'));
  const root = dom.window.document.querySelector('article'), range = dom.window.document.createRange();
  range.selectNodeContents(root);
  return {window: dom.window, root, range, serialize: limit => dom.window.NotebookSelection.markdown(range, root, limit)};
}
const formula = '<span class="arithmatex"><span class="katex"><span class="katex-mathml"><math><annotation encoding="application/x-tex">x_1=\\frac{a}{b}</annotation></math></span><span class="katex-html" aria-hidden="true">garbled duplicate</span></span></span>';
test('selection recovers original TeX once and preserves emphasis, links, and code', t => {
  const {serialize} = fixture(t, `<p><strong>定义</strong> ${formula}，见 <a href="../book/#normal">教材</a> 与 <code>x_1</code>。</p><pre><code class="language-python">x = 1\nprint(x)</code></pre>`);
  const {markdown} = serialize();
  assert.match(markdown, /\*\*定义\*\*/);
  assert.equal(markdown.match(/\\frac/g).length, 1);
  assert.ok(!markdown.includes('garbled duplicate'));
  assert.match(markdown, /\[教材\]\(\/course\/book\/#normal\)/);
  assert.match(markdown, /```python\nx = 1\nprint\(x\)\n```/);
});
test('partial selection within a rendered equation expands to a complete math expression', t => {
  const {window, root, range, serialize} = fixture(t, `<p>outside ${formula} after</p>`);
  const text = root.querySelector('.katex-html').firstChild;
  range.setStart(text, 2); range.setEnd(text, 7);
  assert.equal(serialize().markdown, '\\(x_1=\\frac{a}{b}\\)');
});
test('partial links remain balanced and unsafe URLs are excluded', t => {
  const {root, range, serialize} = fixture(t, '<p><a href="https://example.org/book">chapter one</a> <a href="javascript:alert(1)">unsafe</a></p>');
  range.setStart(root.querySelector('a').firstChild, 8);
  assert.equal(serialize().markdown, '[one](https://example.org/book) unsafe');
});
test('excerpt limits do not split code fences or math', t => {
  const {serialize} = fixture(t, '<pre><code>' + 'x = 1;\n'.repeat(300) + '</code></pre>');
  const {markdown, clipped} = serialize(200);
  assert.equal(clipped, true); assert.ok(markdown.length <= 200);
  assert.equal(markdown.match(/```/g).length, 2);
  assert.match(markdown, /（节选）$/);
});

test('unrendered math retains its original delimiters and supports one-symbol formulas', t => {
  const {serialize} = fixture(t, String.raw`<p><span class="arithmatex">\(x\)</span></p><div class="arithmatex">\[x^2\]</div>`);
  const {markdown} = serialize();
  assert.match(markdown, /\\\(x\\\)/);
  assert.match(markdown, /\$\$\nx\^2\n\$\$/);
});
