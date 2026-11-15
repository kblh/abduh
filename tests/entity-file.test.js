import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serializeEntity, parseEntity, loadAll } from '../scripts/lib/entity-file.js';

const band = {
  type: 'band',
  id: 'buena-vista-social-club',
  fields: {
    name: 'Buena Vista Social Club',
    countries: ['cuba'],
    members: ['Compay Segundo', 'Ibrahim Ferrer'],
    tags: ['woman'],
  },
  body: 'Bio text.\n',
};

test('serialize/parse round trip keeps fields and body', () => {
  const back = parseEntity('band', band.id, serializeEntity(band));
  assert.deepEqual(back, band);
});

test('serialize writes keys in fixed order and omits empty fields', () => {
  const text = serializeEntity({
    type: 'band',
    id: 'x',
    fields: { tags: ['a'], styles: [], countries: ['cuba'], name: 'X' },
    body: '',
  });
  assert.match(text, /^---\nname: X\naliases:\n {2}- X\ncountries:\n {2}- "\[\[cuba\]\]"\ntags:\n {2}- "\[\[a\]\]"\n---\n/);
  assert.doesNotMatch(text, /styles/);
});

test('parseEntity handles a file without body', () => {
  const e = parseEntity('style', 'rai', '---\nname: rai\n---\n');
  assert.deepEqual(e, { type: 'style', id: 'rai', fields: { name: 'rai' }, body: '' });
});

test('loadAll reads every type directory and takes id from file name', () => {
  const dir = mkdtempSync(join(tmpdir(), 'abduh-'));
  mkdirSync(join(dir, 'styles'));
  mkdirSync(join(dir, 'bands'));
  writeFileSync(join(dir, 'styles', 'rai.md'), '---\nname: rai\n---\n');
  writeFileSync(join(dir, 'bands', 'khaled.md'), '---\nname: Khaled\ncountries: [algeria]\n---\n');
  const all = loadAll(dir);
  assert.deepEqual(all.map((e) => `${e.type}:${e.id}`).sort(), ['band:khaled', 'style:rai']);
});

test('serialize writes references as wikilinks and adds aliases from name', () => {
  const text = serializeEntity({
    type: 'band',
    id: 'tinariwen',
    fields: { name: 'Tinariwen', countries: ['mali'], styles: ['tuareg'], members: ['Ibrahim'] },
    body: '',
  });
  assert.match(text, /^---\nname: Tinariwen\naliases:\n {2}- Tinariwen\ncountries:\n {2}- "\[\[mali\]\]"\nstyles:\n {2}- "\[\[tuareg\]\]"\nmembers:\n {2}- Ibrahim\n---\n/);
});

test('parse unwraps wikilinks (plain, aliased, path-qualified) and drops aliases', () => {
  const e = parseEntity(
    'band',
    'x',
    '---\nname: X\naliases:\n  - X\ncountries:\n  - "[[mali]]"\n  - "[[countries/niger|Niger]]"\nstyles:\n  - tuareg\n---\n',
  );
  assert.deepEqual(e.fields, { name: 'X', countries: ['mali', 'niger'], styles: ['tuareg'] });
});

test('wikilink references round trip to the same in-memory entity', () => {
  const e = { type: 'cd', id: 'a-b', fields: { name: 'B', bands: ['a'], year: 2000 }, body: 'x\n' };
  assert.deepEqual(parseEntity('cd', 'a-b', serializeEntity(e)), e);
});
