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

import { letterInfo } from '../public/app/filters.js';

test('letterInfo computes first index, counts and row starts in one pass', () => {
  const list = [{ name: 'Älä' }, { name: 'Ali' }, { name: 'Bob' }, { name: '9bach' }];
  const info = letterInfo(list);
  assert.equal(info.first.get('A'), 0);
  assert.equal(info.first.get('B'), 2);
  assert.equal(info.first.get('#'), 3);
  assert.equal(info.count.get('A'), 2);
  assert.deepEqual([...info.starts], [0, 2, 3]);
  assert.deepEqual(letterInfo([]).first.size, 0);
});

import { shelfCovers } from '../public/app/filters.js';

test('shelfCovers takes the first four items with an image: bands first, then CDs', () => {
  const s = buildStore({
    bands: [{ id: 'a', name: 'A', image: 'img/a.avif' }, { id: 'b', name: 'B' }, { id: 'c', name: 'C', image: 'img/c.avif' }, { id: 'd', name: 'D', image: 'img/d.avif' }],
    cds: [{ id: 'x', name: 'X', bands: ['a'], image: 'img/x.avif' }, { id: 'y', name: 'Y', bands: ['a'], image: 'img/y.avif' }],
    shelves: [{ id: 's', name: 'S', bands: ['a', 'b', 'c', 'd', 'ghost'], cds: ['x', 'y'] }, { id: 'e', name: 'E' }],
  });
  assert.deepEqual(shelfCovers(s, s.byId.shelves.get('s')), ['img/a.avif', 'img/c.avif', 'img/d.avif', 'img/x.avif']);
  assert.deepEqual(shelfCovers(s, s.byId.shelves.get('e')), []);
});
