import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildStore, isNew, recentlyAdded, recentlyChanged } from '../public/app/store.js';
import { data } from './web-fixture-data.js';

const store = buildStore(data);

test('indexes by country/style/instrument are sorted by normalized name', () => {
  assert.deepEqual(store.bandsByCountry.get('mali').map((b) => b.id), ['ali-farka-toure', 'ballake', 'kora-man', 'tinariwen']);
  assert.deepEqual(store.bandsByStyle.get('rai').map((b) => b.id), ['rai-band']);
  assert.equal(store.bandsByInstrument.get('kora').length, 2);
});

test('cdsByBand, shelvesOf, continentOf, sortedBands', () => {
  assert.equal(store.cdsByBand.get('tinariwen')[0].id, 'tinariwen-tassili');
  assert.deepEqual(store.shelvesOf('band', 'tinariwen').map((s) => s.id), ['desert']);
  assert.deepEqual(store.shelvesOf('cd', 'tinariwen-tassili').map((s) => s.id), ['desert']);
  assert.equal(store.continentOf('mali'), 'africa');
  assert.equal(store.sortedBands[0].id, 'ali-farka-toure');
});

test('dangling references and missing arrays do not throw', () => {
  assert.equal(store.cdsByBand.get('nobody')?.length, 1);
  assert.equal(store.byId.shelves.get('empty').name, 'Empty');
  assert.deepEqual(store.shelvesOf('band', 'lonely'), []);
  assert.doesNotThrow(() => buildStore({}));
});

test('isNew is true within 30 days, false after or without added', () => {
  const today = new Date('2026-12-01T12:00:00Z');
  assert.equal(isNew({ added: '2026-11-01' }, today), true);
  assert.equal(isNew({ added: '2026-10-31' }, today), false);
  assert.equal(isNew({}, today), false);
});

test('recentlyAdded skips entities without added, newest first', () => {
  assert.deepEqual(recentlyAdded(store, 5).map((e) => e.id), ['tinariwen-tassili', 'tinariwen']);
  assert.equal(recentlyAdded(store, 1).length, 1);
});

test('recentlyChanged sorts by modified, falling back to added', () => {
  const st = { data: { tags: [{ id: 'a', name: 'a', added: '2026-01-01' }, { id: 'b', name: 'b', added: '2025-01-01', modified: '2026-02-01' }, { id: 'c', name: 'c' }] } };
  assert.deepEqual(recentlyChanged(st, 'tags', 5).map((e) => e.id), ['b', 'a']);
  assert.equal(recentlyChanged(st, 'tags', 1).length, 1);
});
