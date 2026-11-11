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
  assert.equal(svg.querySelectorAll('[data-diagram-node] > rect').length,1);
  assert(Number(svg.querySelector('line').getAttribute('x2')) < Number(svg.querySelector('[data-diagram-node] > rect').getAttribute('x')));
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


const velocityDiagram = {title:'速度分解与磁场中的回旋',nodes:[
  {id:'v',label:'速度 v',x:10,y:50,shape:'circle'},
  {id:'vpar',label:'v∥',x:40,y:75,shape:'box'},
  {id:'vperp',label:'v⊥',x:40,y:25,shape:'box'},
  {id:'B',label:'B',x:70,y:50,shape:'box'},
  {id:'circle',label:'匀速圆周',x:90,y:25,shape:'circle'},
],edges:[{from:'v',to:'vpar',label:'分解'},{from:'v',to:'vperp',label:'分解'},
  {from:'vperp',to:'circle',label:'q v⊥×B 提供向心力'},{from:'B',to:'circle',label:'决定转向'}]};
const rectangle = node => {
  const rect=node.querySelector('rect'), circle=node.querySelector('circle');
  return rect ? {left:+rect.getAttribute('x'),top:+rect.getAttribute('y'),right:+rect.getAttribute('x') + +rect.getAttribute('width'),bottom:+rect.getAttribute('y') + +rect.getAttribute('height')}
    : {left:+circle.getAttribute('cx') - +circle.getAttribute('r'),top:+circle.getAttribute('cy') - +circle.getAttribute('r'),right:+circle.getAttribute('cx') + +circle.getAttribute('r'),bottom:+circle.getAttribute('cy') + +circle.getAttribute('r')};
};
const intersects = (a,b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

test('velocity diagram keeps full labels clear of nodes and other labels and remains scrollable', t => {
  const {output,root}=fixture(t), svg=output.diagram(velocityDiagram);
  const nodes=[...svg.querySelectorAll('[data-diagram-node]')].map(rectangle);
  const labels=[...svg.querySelectorAll('[data-diagram-label]')].map(rectangle);
  assert.equal(labels.length,4);
  for (let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++) assert.ok(!intersects(nodes[i],nodes[j]));
  for (let i=0;i<labels.length;i++) {
    for(const node of nodes) assert.ok(!intersects(labels[i],node));
    for(const other of labels.slice(i+1)) assert.ok(!intersects(labels[i],other));
  }
  const circle=svg.querySelector('[aria-label="匀速圆周"] circle');
  assert.ok(+circle.getAttribute('r')>40);
  const long=output.diagram({...velocityDiagram,edges:[{from:'vperp',to:'circle',label:'垂直速度分量受到的磁力提供圆周运动所需的向心力'}]});
  assert.ok([...long.querySelectorAll('text')].some(label=>label.querySelectorAll('tspan').length>1));
  const titled=output.diagram({title:'长标题'.repeat(30),nodes:[{id:'only',label:'节点',x:50,y:50}],edges:[]});
  const titleLabel=titled.lastElementChild;
  assert.ok(titleLabel.querySelectorAll('tspan').length>1);
  const titleBottom=+titleLabel.getAttribute('y')+[...titleLabel.querySelectorAll('tspan')].reduce((sum,line)=>sum+ +line.getAttribute('dy'),0)+6;
  assert.ok(rectangle(titled.querySelector('[data-diagram-node]')).top>titleBottom);
  const code=root.ownerDocument.createElement('code'), pre=root.ownerDocument.createElement('pre');
  code.className='language-diagram';code.textContent=JSON.stringify(velocityDiagram);pre.append(code);root.append(pre);output.render(root);
  assert.equal(root.querySelector('.notebook-ai-diagram-viewport').tabIndex,0);
  assert.ok(+root.querySelector('svg').getAttribute('width')>=600);
  const fit=[...root.querySelectorAll('button')].find(button=>button.textContent==='适应宽度');
  fit.click();assert.equal(root.querySelector('.notebook-ai-diagram-viewport').dataset.fit,'true');
  assert.equal(fit.getAttribute('aria-pressed'),'true');
  fit.click();assert.equal(root.querySelector('.notebook-ai-diagram-viewport').dataset.fit,'false');
});

test('diagram routes an edge around an intervening node and separates coincident nodes', t => {
  const {output}=fixture(t);
  const svg=output.diagram({nodes:[{id:'a',label:'A',x:0,y:50,shape:'box'},{id:'block',label:'obstacle',x:50,y:50,shape:'box'},
    {id:'b',label:'B',x:100,y:50,shape:'box'}],edges:[{from:'a',to:'b',label:'绕开节点'}]});
  const edge=svg.querySelector('polyline[data-diagram-edge]');assert.ok(edge);
  const points=edge.getAttribute('points').split(' ').map(value=>value.split(',').map(Number));
  const box=rectangle(svg.querySelector('[aria-label="obstacle"]'));
  for(let i=1;i<points.length;i++) {
    const [a,b]=[points[i-1],points[i]];
    assert.ok(a[0]===b[0]||a[1]===b[1]);
    if(a[0]===b[0]&&a[0]>box.left&&a[0]<box.right) assert.ok(Math.max(a[1],b[1])<=box.top||Math.min(a[1],b[1])>=box.bottom);
    if(a[1]===b[1]&&a[1]>box.top&&a[1]<box.bottom) assert.ok(Math.max(a[0],b[0])<=box.left||Math.min(a[0],b[0])>=box.right);
  }
  const crowded=output.diagram({nodes:Array.from({length:12},(_,i)=>({id:String(i),label:'同一点的节点 '+i,x:50,y:50,shape:'box'})),edges:[]});
  const boxes=[...crowded.querySelectorAll('[data-diagram-node]')].map(rectangle);
  for(let i=0;i<boxes.length;i++) for(const other of boxes.slice(i+1)) assert.ok(!intersects(boxes[i],other));
});


test('dense diagrams retain all connections without drawing through unrelated nodes', t => {
  const {output}=fixture(t);
  const nodes=Array.from({length:24},(_,i)=>({id:String(i),label:'node '+i,x:i%4*30,y:Math.floor(i/4)*20,shape:'box'}));
  const svg=output.diagram({nodes,edges:[{from:'5',to:'18',label:'跨越多行的关系'},{from:'8',to:'15',label:'另一个关系'}]});
  assert.equal(svg.querySelectorAll('[data-diagram-node]').length,24);
  assert.equal(svg.querySelectorAll('[data-diagram-edge]').length,2);
  assert.equal(svg.querySelector('foreignObject,script,[href],[onload]'),null);
});

test('figures use the active body palette and existing figures update when the theme changes', async t => {
  const {window,root,output}=fixture(t);
  const light={ink:'#29372e',paper:'#fdfdf9',line:'#dfe4d9'},dark={ink:'#c7c7c2',paper:'#000000',line:'#292929'};
  for(const [key,value] of Object.entries(light)) window.document.documentElement.style.setProperty('--notebook-'+key,value);
  const setBody=palette=>{for(const [key,value] of Object.entries(palette)) window.document.body.style.setProperty('--notebook-'+key,value);};
  setBody(dark);window.document.body.dataset.mdColorScheme='slate';
  const pre=window.document.createElement('pre'),code=window.document.createElement('code');code.className='language-diagram';
  code.textContent=JSON.stringify({title:'Theme test',nodes:[{id:'a',label:'A',x:10,y:50},{id:'b',label:'B',x:90,y:50}],edges:[{from:'a',to:'b'}]});
  pre.append(code);root.append(pre);output.render(root);
  const svg=root.querySelector('svg');
  assert.equal(svg.querySelector('rect').getAttribute('fill'),dark.paper);
  assert.equal(svg.querySelector('[data-diagram-node] text').getAttribute('fill'),dark.ink);
  const viewBox=svg.getAttribute('viewBox');
  setBody(light);window.document.body.dataset.mdColorScheme='default';
  await new Promise(resolve=>window.setTimeout(resolve,0));
  assert.equal(svg.querySelector('rect').getAttribute('fill'),light.paper);
  assert.equal(svg.querySelector('[data-diagram-node] text').getAttribute('fill'),light.ink);
  assert.equal(svg.getAttribute('viewBox'),viewBox);
  assert.equal(root.querySelectorAll('svg').length,1);
});
