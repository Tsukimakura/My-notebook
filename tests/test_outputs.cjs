const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const fixture = t => {
  const dom = new JSDOM('<html><body><div id="answer"></div></body></html>', {url:'https://notes.example.com/',runScripts:'outside-only'});
  t.after(()=>dom.window.close());
  dom.window.eval(fs.readFileSync('docs/javascripts/notebook-ai-outputs.js','utf8'));
  return {window:dom.window, output:dom.window.NotebookOutputs, root:dom.window.document.getElementById('answer')};
};

test('plot rendering uses finite data points and never executes labels or expressions', t => {
  const {output}=fixture(t);
  const svg=output.plot({title:'<script>alert(1)</script>',x_label:'z/R',y_label:'E/E0',series:[{name:'field',points:[[0,1],[1,.293],[2,.106]]}]});
  assert.equal(svg.querySelectorAll('polyline').length,1);
  assert.equal(svg.querySelector('script'),null);
  assert.match(svg.textContent,/<script>alert\(1\)<\/script>/);
  assert.equal(svg.querySelector('[onload],[href]'),null);
  for (const points of [[[0,NaN],[1,2]],[[0,1],[1,Infinity]],[[0,1],[1,'fetch("https://evil")']]]) {
    assert.throws(()=>output.plot({series:[{points}]}));
  }
});

test('diagram rendering builds local SVG primitives without model attributes or URLs', t => {
  const {output,window}=fixture(t);
  const svg=output.diagram({title:'charge to field',nodes:[{id:'q',label:'<img onerror=x>',x:10,y:50,href:'https://evil'}, {id:'e',label:'E',x:90,y:50,shape:'box'}],edges:[{from:'q',to:'e',label:'force'}]});
  assert.equal(svg.querySelectorAll('circle').length,1);
  assert.equal(svg.querySelectorAll('rect').length,2);
  assert(Number(svg.querySelector('line').getAttribute('x2')) < Number(svg.querySelectorAll('rect')[1].getAttribute('x')));
  assert.equal(svg.querySelector('script,img,foreignObject,[href],[onerror]'),null);
  const xml=new window.XMLSerializer().serializeToString(svg);
  assert.equal((xml.match(/xmlns=/g)||[]).length,1);
  assert.match(xml,/&lt;img onerror=x&gt;/);
});

test('data diagrams become figures with PNG/SVG downloads while invalid plots remain readable code', t => {
  const {root,output}=fixture(t);
  const pre=root.ownerDocument.createElement('pre'), code=root.ownerDocument.createElement('code');
  code.className='language-plot';code.textContent=JSON.stringify({series:[{points:[[0,1],[1,0]]}]});pre.append(code);root.append(pre);
  output.render(root);
  assert.ok(root.querySelector('figure svg'));
  assert.match(root.querySelector('figcaption').textContent,/SVG.*PNG/);
  assert.equal(root.querySelector('details').open,false);
  assert.ok(root.querySelector('details pre code'));
  const bad=root.ownerDocument.createElement('pre'), source=root.ownerDocument.createElement('code');
  source.className='language-plot';source.textContent='{"series":"run code"}';bad.append(source);root.append(bad);
  output.render(bad.parentElement);
  assert.match(bad.textContent,/run code/);
});

test('CSV exports neutralize spreadsheet formulas while retaining signed scientific numbers', t => {
  const {output}=fixture(t);
  const csv=output.csv([['=HYPERLINK("https://evil")','\t+SUM(1,2)','@cmd','-1.2e-3','-2','a,b','a"b']]);
  assert.match(csv,/"'=HYPERLINK/);
  assert.match(csv,/"'\t\+SUM/);
  assert.match(csv,/"'@cmd/);
  assert.match(csv,/"-1\.2e-3"/);
  assert.match(csv,/"-2"/);
  assert.match(csv,/"a,b"/);
  assert.match(csv,/"a""b"/);
});

test('whole answer JSON download excludes continuation capsules and includes the complete answer', t => {
  const {window,output}=fixture(t);let blob;
  window.URL.createObjectURL=value=>{blob=value;return 'blob:local';};window.URL.revokeObjectURL=()=>{};
  window.HTMLAnchorElement.prototype.click=()=>{};
  output.answer({content:'full answer',sources:[],usage:{output_tokens:10},continuation:'private-context'},'json');
  assert.equal(blob.type,'application/json');
  const reader=new window.FileReader();
  return new Promise(resolve=>{reader.onload=()=>{const value=JSON.parse(reader.result);assert.equal(value.answer,'full answer');assert.equal(value.continuation,undefined);resolve();};reader.readAsText(blob);});
});
