import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMatchers, linkBody } from '../scripts/lib/link-bio.js';
import { validate } from '../scripts/lib/validate.js';

const band = (id, name) => ({ type: 'band', id, fields: { name }, body: '' });
const ms = buildMatchers([band('eliza-carthy', 'Eliza Carthy'), band('afro-celt-sound-system', 'Afro Celt Sound System'), band('khaled', 'Khaled'), band('opa', 'Opa'), band('kila', 'Kila')]);
const link = (t, self = 'x') => linkBody(t, self, ms).body;

test('links an exact name', () => {
  assert.equal(link('Hrála s Eliza Carthy.'), 'Hrála s [[eliza-carthy|Eliza Carthy]].');
});
test('links declined forms and keeps the text', () => {
  assert.equal(link('Vystoupil s Khaledem.'), 'Vystoupil s [[khaled|Khaledem]].');
  assert.equal(link('Píseň od Elizy Carthy.'), 'Píseň od [[eliza-carthy|Elizy Carthy]].');
});
test('links only the first mention and not inside existing links', () => {
  assert.equal(link('Khaled a znovu Khaled.'), '[[khaled|Khaled]] a znovu Khaled.');
  assert.equal(link('[[khaled|Khaled]] a Khaled.'), '[[khaled|Khaled]] a Khaled.');
});
test('skips the band itself, short and stoplisted names, and part-words', () => {
  assert.equal(link('Khaled zpívá.', 'khaled'), 'Khaled zpívá.');
  assert.equal(link('Opa a Kila.'), 'Opa a Kila.');
  assert.equal(link('Khaledovo album.'), 'Khaledovo album.');
});
test('validate rejects a body link to an unknown entity', () => {
  const b = { ...band('a', 'A'), fields: { name: 'A', countries: ['c'] }, body: 'viz [[nikdo|X]]' };
  const c = { type: 'country', id: 'c', fields: { name: 'C', continent: 'x' }, body: '' };
  assert.match(validate([b, c])[0], /unknown entity "nikdo"/);
});
