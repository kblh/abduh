import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildStore } from '../public/app/store.js';
import { filterBands } from '../public/app/filters.js';
import { data } from './web-fixture-data.js';

const store = buildStore({ ...data, bands: [...data.bands, { id: 'aela', name: 'Älä', countries: ['mali'], image: 'img/x.avif' }] });
const ids = (q) => filterBands(store, q).map((b) => b.id);

test('default order is A-Z by normalized name (diacritics ignored)', () => {
  assert.deepEqual(ids({}).slice(0, 2), ['aela', 'ali-farka-toure']);
});

test('country matches any of the band countries', () => {
  assert.ok(ids({ country: 'algeria' }).includes('tinariwen'));
  assert.ok(ids({ country: 'mali' }).includes('tinariwen'));
});

test('style, instrument and photo filters combine', () => {
  assert.deepEqual(ids({ style: 'desert-blues', instrument: 'guitar' }), ['ali-farka-toure', 'tinariwen']);
  assert.deepEqual(ids({ photo: '1' }), ['aela']);
});

test('sort=new puts dated bands first and undated last', () => {
  const r = ids({ sort: 'new' });
  assert.equal(r[0], 'tinariwen');
  assert.equal(r[1], 'aela');
});

test('unknown filter value gives an empty list, not an error', () => {
  assert.deepEqual(ids({ country: 'atlantis' }), []);
  assert.deepEqual(ids({ style: 'nope' }), []);
});
