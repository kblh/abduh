import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, buildHash } from '../public/app/router.js';

test('parseHash recognises the map route', () => {
  assert.deepEqual(parseHash('#/styles/rai/map'), { route: 'map', kind: 'style', id: 'rai', query: {} });
  assert.deepEqual(parseHash('#/bands/tinariwen/map'), { route: 'map', kind: 'band', id: 'tinariwen', query: {} });
  assert.deepEqual(parseHash('#/instruments/oud/map'), { route: 'map', kind: 'instrument', id: 'oud', query: {} });
  assert.deepEqual(parseHash('#/tags/woman/map'), { route: 'map', kind: 'tag', id: 'woman', query: {} });
  assert.equal(parseHash('#/bands/b%C3%A9la/map').id, 'béla');
});

test('unsupported map paths are notfound', () => {
  for (const h of ['#/countries/mali/map', '#/cds/x/map', '#/shelves/x/map', '#/bands/x/foo', '#/bands/x/map/y'])
    assert.equal(parseHash(h).route, 'notfound', h);
});

test('buildHash builds and round-trips the map route', () => {
  assert.equal(buildHash('map', { kind: 'band', id: 'béla' }), '#/bands/b%C3%A9la/map');
  const p = parseHash(buildHash('map', { kind: 'tag', id: 'woman' }));
  assert.deepEqual([p.route, p.kind, p.id], ['map', 'tag', 'woman']);
});
