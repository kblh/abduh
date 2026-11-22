import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildStore } from '../public/app/store.js';
import { buildMap, DEFAULT_LIMITS } from '../public/app/map/graph.js';

const countries = [{ id: 'mali', name: 'Mali', flag: 'M' }, { id: 'france', name: 'France' }, { id: 'peru', name: 'Peru' }];
const styles = [{ id: 'rai', name: 'rai' }, { id: 'desert-blues', name: 'desert-blues' }, { id: 'hub', name: 'hub' }];
const instruments = [{ id: 'oud', name: 'oud' }];
const tags = [{ id: 'woman', name: 'woman' }];
const mk = (bands) => buildStore({ bands, countries, styles, instruments, tags });
const ids = (g, level) => g.nodes.filter((n) => n.level === level).map((n) => n.id);

test('band with only a country gets country edges', () => {
  const g = buildMap(mk([{ id: 'a', name: 'A', countries: ['mali'] }, { id: 'b', name: 'B', countries: ['mali'] }, { id: 'c', name: 'C', countries: ['peru'] }]), { kind: 'band', id: 'a' });
  assert.deepEqual(ids(g, 1), ['b']);
  assert.ok(g.edges.every((e) => e.rel === 'country' && e.label === 'Mali' && e.href === '#/countries/mali'));
});

test('band without neighbours is just the centre', () => {
  const g = buildMap(mk([{ id: 'a', name: 'A', countries: ['peru'] }]), { kind: 'band', id: 'a' });
  assert.equal(g.nodes.length, 1);
  assert.equal(g.edges.length, 0);
});

test('unknown id gives empty graph', () => assert.deepEqual(buildMap(mk([]), { kind: 'band', id: 'zz' }), { nodes: [], edges: [] }));

test('hub is limited and has a +N more node', () => {
  const bands = [{ id: 'c0', name: 'C0', styles: ['hub'] }];
  for (let i = 1; i < 40; i++) bands.push({ id: `c${i}`, name: `C${String(i).padStart(2, '0')}`, styles: ['hub'] });
  for (let i = 0; i < 330; i++) bands.push({ id: `f${i}`, name: `F${i}`, countries: ['france'] });
  const g = buildMap(mk(bands), { kind: 'style', id: 'hub' });
  assert.ok(g.nodes.length <= DEFAULT_LIMITS.total);
  const more = g.nodes.find((n) => n.kind === 'more');
  assert.ok(more);
  assert.match(more.label, /^\+\d+ dalších$/);
  assert.equal(more.href, '#/bands?style=hub');
  const g2 = buildMap(mk(bands), { kind: 'band', id: 'f0' });
  assert.ok(g2.nodes.length <= DEFAULT_LIMITS.total);
  assert.equal(g2.nodes.find((n) => n.kind === 'more').href, '#/bands?country=france');
});

test('deterministic, each node once', () => {
  const store = mk([{ id: 'a', name: 'A', styles: ['rai'] }, { id: 'b', name: 'B', styles: ['rai'], countries: ['mali'] }, { id: 'c', name: 'C', styles: ['rai'], countries: ['mali'] }, { id: 'd', name: 'D', countries: ['mali'] }]);
  const g = buildMap(store, { kind: 'band', id: 'a' });
  assert.deepEqual(g, buildMap(store, { kind: 'band', id: 'a' }));
  const keys = g.nodes.map((n) => n.key);
  assert.equal(new Set(keys).size, keys.length);
  assert.deepEqual(ids(g, 2), ['d']);
});

test('centre style, instrument and tag', () => {
  const store = mk([{ id: 'a', name: 'A', styles: ['rai'], instruments: ['oud'], tags: ['woman'] }, { id: 'b', name: 'B', styles: ['rai'] }, { id: 'c', name: 'C', instruments: ['oud'] }, { id: 'd', name: 'D', tags: ['woman'] }]);
  for (const [kind, id, rel, label] of [['style', 'rai', 'style', 'rai'], ['instrument', 'oud', 'instrument', 'oud'], ['tag', 'woman', 'tag', 'žena']]) {
    const g = buildMap(store, { kind, id });
    assert.equal(g.nodes[0].kind, kind);
    assert.ok(g.nodes.filter((n) => n.level === 1).every((n) => n.kind === 'band'));
    const l1 = g.edges.filter((e) => e.from === g.nodes[0].key);
    assert.ok(l1.length >= 2 && l1.every((e) => e.rel === rel && e.label === label));
  }
});

test('linked members both ways; dangling ignored', () => {
  const store = mk([{ id: 'a', name: 'A', members: [{ id: 'b', name: 'B' }, { id: 'ghost', name: 'G' }, 'Text Person'] }, { id: 'b', name: 'B' }]);
  const ga = buildMap(store, { kind: 'band', id: 'a' });
  assert.deepEqual(ids(ga, 1), ['b']);
  assert.equal(ga.edges[0].rel, 'member');
  assert.equal(ga.edges[0].href, null);
  assert.deepEqual(ids(buildMap(store, { kind: 'band', id: 'b' }), 1), ['a']);
});

test('hrefs are encoded', () => {
  const g = buildMap(mk([{ id: 'béla', name: 'Béla', styles: ['rai'] }, { id: 'x', name: 'X', styles: ['rai'] }]), { kind: 'band', id: 'x' });
  assert.equal(g.nodes.find((n) => n.id === 'béla').href, '#/bands/b%C3%A9la');
});

test('strong relation beats country; country capped on level 1', () => {
  const bands = [{ id: 'a', name: 'A', styles: ['rai'], countries: ['mali'] }, { id: 's', name: 'S', styles: ['rai'], countries: ['mali'] }];
  for (let i = 0; i < 10; i++) bands.push({ id: `m${i}`, name: `M${i}`, countries: ['mali'] });
  const g = buildMap(mk(bands), { kind: 'band', id: 'a' });
  assert.equal(g.edges.find((e) => e.to === 'band:s').rel, 'style');
  assert.equal(g.edges.filter((e) => e.from === 'band:a' && e.rel === 'country' && e.to.startsWith('band:')).length, DEFAULT_LIMITS.countryL1);
});

test('+N node survives a member group and counts the whole relation', () => {
  const bands = [{ id: 'a', name: 'A', styles: ['hub'], members: [{ id: 'm1', name: 'M1' }, { id: 'm2', name: 'M2' }] }, { id: 'm1', name: 'M1' }, { id: 'm2', name: 'M2' }];
  for (let i = 0; i < 40; i++) bands.push({ id: `s${i}`, name: `S${String(i).padStart(2, '0')}`, styles: ['hub'] });
  const g = buildMap(mk(bands), { kind: 'band', id: 'a' });
  const more = g.nodes.find((n) => n.kind === 'more');
  assert.ok(more);
  assert.equal(more.href, '#/bands?style=hub');
  const shown = g.nodes.filter((n) => n.level === 1 && n.kind === 'band').length;
  assert.equal(more.label, `+${40 - g.nodes.filter((n) => n.level === 1 && /^s\d+$/.test(n.id ?? '')).length} dalších`);
  assert.ok(shown >= 2);
});
