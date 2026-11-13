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
  assert.deepEqual(Object.keys(data), ['bands', 'cds', 'shelves', 'countries', 'styles', 'instruments']);
  assert.equal(data.countries[0].id, 'cuba');
  assert.equal(data.countries[0].body, '');
});

test('buildData is deterministic regardless of input order', () => {
  const a = [mk('zed', { countries: ['cuba'] }), country, mk('abe', { countries: ['cuba'] })];
  const b = [...a].reverse();
  assert.equal(JSON.stringify(buildData(a)), JSON.stringify(buildData(b)));
});
