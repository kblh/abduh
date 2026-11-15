import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../scripts/lib/validate.js';
import { buildData } from '../scripts/lib/build-data.js';

const country = { type: 'country', id: 'cuba', fields: { name: 'Cuba', continent: 'america' }, body: '' };
const style = { type: 'style', id: 'son', fields: { name: 'son' }, body: '' };
const mk = (id, fields) => ({ type: 'band', id, fields: { name: id, ...fields }, body: '' });

test('valid data has no errors', () => {
  assert.deepEqual(validate([country, style, mk('omara', { countries: ['cuba'], styles: ['son'] })]), []);
});

test('band without countries is an error naming the band', () => {
  const errs = validate([country, mk('omara', { countries: [] })]);
  assert.equal(errs.length, 1);
  assert.match(errs[0], /omara/);
});

test('relation to a missing country is an error', () => {
  const errs = validate([country, mk('omara', { countries: ['nowhere'] })]);
  assert.match(errs[0], /omara.*nowhere/);
});

test('relation to a missing style is an error', () => {
  const errs = validate([country, mk('omara', { countries: ['cuba'], styles: ['missing'] })]);
  assert.match(errs[0], /omara.*missing/);
});

test('duplicate id within a type is an error', () => {
  const errs = validate([country, mk('omara', { countries: ['cuba'] }), mk('omara', { countries: ['cuba'] })]);
  assert.ok(errs.some((e) => /duplicate/i.test(e) && /omara/.test(e)));
});

test('buildData groups by type, sorts by id and adds id and body', () => {
  const data = buildData([mk('zed', { countries: ['cuba'] }), country, mk('abe', { countries: ['cuba'] })]);
  assert.deepEqual(data.bands.map((b) => b.id), ['abe', 'zed']);
  assert.deepEqual(Object.keys(data), ['bands', 'cds', 'shelves', 'countries', 'styles', 'instruments', 'tags']);
  assert.equal(data.countries[0].id, 'cuba');
  assert.equal(data.countries[0].body, '');
});

test('buildData is deterministic regardless of input order', () => {
  const a = [mk('zed', { countries: ['cuba'] }), country, mk('abe', { countries: ['cuba'] })];
  const b = [...a].reverse();
  assert.equal(JSON.stringify(buildData(a)), JSON.stringify(buildData(b)));
});

test('buildData sets added only for entities in the map', () => {
  const b = mk('x', { countries: ['cuba'] });
  assert.equal(buildData([country, b], new Map([['bands/x', '2026-11-01']])).bands[0].added, '2026-11-01');
  assert.equal('added' in buildData([country, b]).bands[0], false);
});

test('same id in two different types is an error (wikilinks resolve by file name)', () => {
  const errs = validate([country, { type: 'tag', id: 'cuba', fields: { name: 'cuba' }, body: '' }]);
  assert.match(errs.join('\n'), /cuba.*country.*tag|cuba.*tag.*country/);
});

test('member wikilink to a missing band is an error, to an existing band is fine', () => {
  const ok = validate([country, mk('a', { countries: ['cuba'] }), mk('b', { countries: ['cuba'], members: ['[[a]]', 'Plain Name'] })]);
  assert.deepEqual(ok, []);
  const bad = validate([country, mk('b', { countries: ['cuba'], members: ['[[ghost]]'] })]);
  assert.match(bad.join('\n'), /b.*members.*ghost/);
});

test('buildData turns linked members into {id, name} and keeps plain names', () => {
  const data = buildData([country, mk('a', { name: 'Alpha', countries: ['cuba'] }), mk('b', { countries: ['cuba'], members: ['[[a]]', 'Plain Name'] })]);
  assert.deepEqual(data.bands.find((x) => x.id === 'b').members, [{ id: 'a', name: 'Alpha' }, 'Plain Name']);
});
