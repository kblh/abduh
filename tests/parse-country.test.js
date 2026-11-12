import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCountryFile } from '../scripts/lib/parse-country.js';

const ALGERIA = `Druhá největší země Afriky.
1954 – 1962 – Alžírská válka

[[~berber]] [[~gnawa]]
- Akli D
- Iness Mezel

[[~chaabi]]
- Kamel El Harrachi
- Maurice El Medioni [[~piano 🎹]]
`;

const CUBA = `Buena Vista Social Club
  Compay Segundo
  Eliades Ochoa
  Ibrahim Ferrer
    Ibrahim Ferrer Jr
  Manuel Guajiro Mirabal [[~trumpet 🎺]]
  Ruben Gonzalez [[~piano 🎹]]
Omara Portuondo

Brenda Navarrete [[~w]] [[~percussions]] [[~jazz]]

Juan Formell [[~bass]]#
Omar Sosa (piano)
Guillermo Portabales (1911 - 1970)
`;

test('bulleted file: prose goes to prose, bullets are bands', () => {
  const r = parseCountryFile(ALGERIA);
  assert.match(r.prose, /Druhá největší země Afriky/);
  assert.match(r.prose, /Alžírská válka/);
  assert.deepEqual(r.bands.map((b) => b.name), ['Akli D', 'Iness Mezel', 'Kamel El Harrachi', 'Maurice El Medioni']);
});

test('header tags apply to bands until the next header', () => {
  const r = parseCountryFile(ALGERIA);
  assert.deepEqual(r.bands[0].headerTags, ['berber', 'gnawa']);
  assert.deepEqual(r.bands[2].headerTags, ['chaabi']);
});

test('inline tags are cleaned of emoji and removed from the name', () => {
  const r = parseCountryFile(ALGERIA);
  const m = r.bands[3];
  assert.equal(m.name, 'Maurice El Medioni');
  assert.deepEqual(m.inlineTags, ['piano']);
});

test('file without bullets: bare lines are bands, indented lines are members', () => {
  const r = parseCountryFile(CUBA);
  const bv = r.bands[0];
  assert.equal(bv.name, 'Buena Vista Social Club');
  assert.equal(bv.members.length, 6);
  assert.ok(bv.members.includes('Manuel Guajiro Mirabal'));
  assert.equal(r.bands[1].name, 'Omara Portuondo');
  assert.equal(r.prose, '');
});

test('multiple inline tags, trailing hash and parentheticals', () => {
  const r = parseCountryFile(CUBA);
  const byName = Object.fromEntries(r.bands.map((b) => [b.name, b]));
  assert.deepEqual(byName['Brenda Navarrete'].inlineTags, ['w', 'percussions', 'jazz']);
  assert.ok(byName['Juan Formell']);
  assert.deepEqual(byName['Juan Formell'].inlineTags, ['bass']);
  assert.deepEqual(byName['Omar Sosa'].parentheticals, ['piano']);
  assert.deepEqual(byName['Guillermo Portabales'].parentheticals, ['1911 - 1970']);
});

test('an indented line with no band above it is reported as skipped', () => {
  const r = parseCountryFile('  orphan member\n');
  assert.deepEqual(r.bands, []);
  assert.deepEqual(r.skipped, ['orphan member']);
});
