const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');

test('pointer and keyboard theme switches preserve reading position and change the palette once', async t => {
  const dom = new JSDOM(`<body data-md-color-scheme="default"><form data-md-component="palette">
    <input type="radio" name="palette" id="light" data-md-color-scheme="default"><label for="dark">Dark</label>
    <input type="radio" name="palette" id="dark" data-md-color-scheme="slate"><label for="light">Light</label></form></body>`,
    {url: 'https://notes.example.com/a-note/', runScripts: 'outside-only'});
  const {window} = dom; t.after(() => window.close());
  if (window.document.readyState === 'loading') await new Promise(resolve => window.document.addEventListener('DOMContentLoaded', resolve, {once: true}));
  const frames = [];
  window.requestAnimationFrame = callback => frames.push(callback);
  window.scrollY = 5000; window.scrollX = 0;
  window.scrollTo = position => { window.scrollY = position.top; window.scrollX = position.left; };
  let changes = 0;
  for (const input of window.document.querySelectorAll('input')) input.addEventListener('change', () => {
    changes++;
    window.document.body.dataset.mdColorScheme = input.dataset.mdColorScheme;
    window.scrollY -= 534; // Reproduce a hidden-radio layout/focus scroll.
  });
  window.eval(fs.readFileSync('docs/javascripts/notebook-theme.js', 'utf8'));
  const flush = () => { while (frames.length) frames.shift()(0); };
  window.document.querySelector('label[for="dark"]').click(); flush();
  assert.equal(window.document.body.dataset.mdColorScheme, 'slate');
  assert.equal(window.scrollY, 5000);
  assert.equal(changes, 1);
  const dark = window.document.getElementById('dark'); dark.focus();
  dark.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true})); flush();
  assert.equal(window.document.body.dataset.mdColorScheme, 'default');
  assert.equal(window.document.activeElement.id, 'light');
  assert.equal(window.scrollY, 5000);
  assert.equal(changes, 2);
});
