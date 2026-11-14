import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildStore } from '../public/app/store.js';
import { buildIndex, search } from '../public/app/search.js';
import { data } from './web-fixture-data.js';

const idx = buildIndex(buildStore(data));
const ids = (r, g) => r.groups[g].map((h) => h.id);

test('empty, whitespace and regex-like queries are safe', () => {
  for (const q of ['', '   ', '(*', '\\', '[', '.*']) {
    const r = search(idx, q);
    assert.equal(r.total, 0);
  }
});

test('instrument match gives the instrument and bands via relation', () => {
  const r = search(idx, 'kora');
  assert.deepEqual(ids(r, 'instruments'), ['kora']);
  assert.equal(r.groups.bands.find((h) => h.id === 'ballake').reason, 'instrument');
  assert.equal(r.groups.bands.find((h) => h.id === 'kora-man').reason, 'name');
  assert.equal(r.groups.bands[0].id, 'kora-man', 'name hit ranks before relation hit');
});

test('diacritics are ignored in both directions', () => {
  assert.deepEqual(ids(search(idx, 'rai'), 'bands').slice(0, 1), ['rai-band']);
  assert.ok(ids(search(idx, 'RAÏ'), 'styles').includes('rai'));
  assert.deepEqual(ids(search(idx, 'ballake'), 'bands'), ['ballake']);
});

test('all words must match', () => {
  assert.deepEqual(ids(search(idx, 'ali toure'), 'bands'), ['ali-farka-toure']);
  assert.equal(search(idx, 'ali zzz').total, 0);
});

test('woman and žena both find the tagged band via tag', () => {
  for (const q of ['woman', 'žena']) {
    const hit = search(idx, q).groups.bands.find((h) => h.id === 'rai-band');
    assert.equal(hit.reason, 'tag');
  }
});

test('bands are found via country and style names', () => {
  assert.equal(search(idx, 'algeria').groups.bands.find((h) => h.id === 'tinariwen').reason, 'country');
  assert.equal(search(idx, 'desert blues').groups.bands.find((h) => h.id === 'tinariwen').reason, 'style');
});

test('all six groups are searched and total counts them', () => {
  const r = search(idx, 'tass');
  assert.deepEqual(ids(r, 'cds'), ['tinariwen-tassili']);
  assert.equal(search(idx, 'desert').groups.shelves[0].id, 'desert');
  assert.equal(search(idx, 'mali').groups.countries[0].id, 'mali');
  assert.equal(r.total, 1);
});

test('tags are matched through their tag entity name', () => {
  const store = buildStore({
    bands: [{ id: 'x', name: 'Xband', countries: ['mali'], tags: ['new-york'] }],
    countries: [{ id: 'mali', name: 'Mali', continent: 'africa' }],
    tags: [{ id: 'new-york', name: 'new york' }],
  });
  assert.equal(store.byId.tags.get('new-york').name, 'new york');
  const hit = search(buildIndex(store), 'york').groups.bands[0];
  assert.deepEqual(hit, { id: 'x', reason: 'tag' });
});

test('tags are a searchable group', () => {
  const store = buildStore({ bands: [], tags: [{ id: 'new-york', name: 'new york' }, { id: 'poet', name: 'poet' }] });
  const r = search(buildIndex(store), 'york');
  assert.deepEqual(r.groups.tags, [{ id: 'new-york', reason: 'name' }]);
  assert.equal(r.total, 1);
});
