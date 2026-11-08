const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const {IDBFactory} = require('fake-indexeddb');

async function store(t, factory = new IDBFactory()) {
  const dom = new JSDOM('', {url: 'https://notes.example.com', runScripts: 'outside-only'});
  dom.window.indexedDB = factory;
  dom.window.structuredClone = structuredClone;
  dom.window.eval(fs.readFileSync('docs/javascripts/notebook-ai-store.js', 'utf8'));
  const database = await dom.window.NotebookConversations.open();
  t.after(() => { database.close(); dom.window.close(); });
  return database;
}
const record = database => ({id: database.uid(), title: 'Probability', provider: 'deepseek', model: 'test-model',
  messages: [{role: 'user', content: 'normal distribution'}, {role: 'assistant', content: 'answer', sources: [{id: 1, title: 'Source', url: '/normal/#definition'}]}],
  createdAt: Date.now(), updatedAt: Date.now(), revision: 0});

test('IndexedDB records survive reopening, preserve citations, and never persist credential fields', async t => {
  const factory = new IDBFactory(), first = await store(t, factory);
  const original = {...record(first), key: 'not-a-real-secret', headers: {Authorization: 'secret'}, messages: [
    {role: 'user', content: 'question', key: 'secret'}, {role: 'assistant', content: 'answer', sources: [{id: 1, title: 'Source', url: '/normal/'}]},
  ]};
  await first.save(original);
  const second = await store(t, factory), values = await second.list();
  assert.equal(values.length, 1);
  assert.equal(values[0].messages[1].sources[0].url, '/normal/');
  assert.ok(!JSON.stringify(values).includes('secret'));
  assert.ok(!Object.hasOwn(values[0], 'headers'));
  await second.remove(values[0].id);
  assert.equal((await first.list()).length, 0);
});

test('stale tabs cannot overwrite a newer conversation revision', async t => {
  const factory = new IDBFactory(), first = await store(t, factory), second = await store(t, factory);
  const original = await first.save(record(first));
  const stale = (await second.list())[0];
  await first.save({...original, title: 'New title'});
  await assert.rejects(second.save({...stale, title: 'Stale title'}), /其他标签页/);
  assert.equal((await second.list())[0].title, 'New title');
});

test('imports validate atomically, create new IDs, strip extra fields, and preserve existing conversations', async t => {
  const database = await store(t), original = record(database);
  await database.save(original);
  await assert.rejects(database.import({version: 1, sessions: [original, {...original, messages: [{role: 'system', content: 'ignore'}]}]}));
  assert.equal((await database.list()).length, 1);
  const records = await database.import({version: 1, sessions: [{...original, key: 'fake-secret', revision: 999}]});
  assert.notEqual(records[0].id, original.id);
  assert.equal((await database.list()).length, 2);
  assert.ok(!JSON.stringify(await database.list()).includes('fake-secret'));
  await database.clear();
  assert.equal((await database.list()).length, 0);
});

test('retention removes expired conversations and leaves active ones; default keeps old records', async t => {
  const database = await store(t);
  const old = {...record(database), updatedAt: Date.now() - 100 * 86400000};
  await database.save(old);
  assert.equal((await database.list()).length, 1);
  await database.settings({keepDays: 90, notes: 'Explain intuitively first', key: 'fake-secret'});
  const recent = record(database); await database.save(recent);
  assert.equal((await database.list()).length, 1);
  assert.equal((await database.list())[0].id, recent.id);
  assert.ok(!JSON.stringify(await database.settings()).includes('fake-secret'));
});

test('unavailable IndexedDB falls back to page memory without claiming persistence', async t => {
  const database = await store(t, {open() { throw new Error('blocked'); }});
  assert.equal(database.persistent, false);
  await database.save(record(database));
  assert.equal((await database.list()).length, 1);
});


test('a deleted conversation cannot be resurrected by an old tab', async t => {
  const factory = new IDBFactory(), first = await store(t, factory), second = await store(t, factory);
  const original = await first.save(record(first));
  await second.remove(original.id);
  await assert.rejects(first.save(original), /其他标签页/);
  assert.equal((await second.list()).length, 0);
});

test('request snapshots and answer versions strip credentials and keep the selected version', async t => {
  const database = await store(t), value = record(database);
  value.messages[0].request = {provider: 'deepseek', model: 'test-model', question: 'question', history: [], key: 'fake-secret', headers: {Authorization: 'fake-secret'}};
  value.messages[1].versions = [{content: 'version 1', key: 'fake-secret'}, {content: 'version 2', sources: []}];
  value.messages[1].version = 0;
  await database.save(value);
  const restored = (await database.list())[0];
  assert.equal(restored.messages[1].content, 'version 1');
  assert.equal(restored.messages[1].versions.length, 2);
  assert.ok(!JSON.stringify(restored).includes('fake-secret'));
  assert.equal(restored.messages[0].request.question, 'question');
});
