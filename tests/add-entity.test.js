import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { addEntity, cdId } from '../scripts/lib/add-entity.js';
import { parseEntity } from '../scripts/lib/entity-file.js';

function setup() {
  const d = mkdtempSync(join(tmpdir(), 'abduh-ent-'));
  for (const s of ['bands', 'countries', 'styles']) mkdirSync(join(d, s));
  writeFileSync(join(d, 'countries', 'mali.md'), '---\nname: Mali\ncontinent: africa\n---\n');
  writeFileSync(join(d, 'styles', 'desert-blues.md'), '---\nname: desert blues\n---\n');
  writeFileSync(join(d, 'bands', 'tinariwen.md'), '---\nname: Tinariwen\ncountries:\n  - mali\n---\n');
  writeFileSync(join(d, 'bands', 'bombino.md'), '---\nname: Bombino\ncountries:\n  - mali\n---\n');
  return d;
}
const cd = (name, bands, extra = {}) => ({ type: 'cd', fields: { name, bands, ...extra } });
const read = (d, rel) => parseEntity('x', 'x', readFileSync(join(d, rel), 'utf8'));

test('cdId joins first band id and title slug', () => {
  assert.equal(cdId(['tinariwen', 'x'], 'Tassili'), 'tinariwen-tassili');
});

test('adds a CD with computed id', () => {
  const d = setup();
  const r = addEntity(cd('Tassili', ['tinariwen'], { year: 2011 }), { dataDir: d });
  assert.deepEqual(r, { id: 'tinariwen-tassili', created: true });
  assert.equal(read(d, 'cds/tinariwen-tassili.md').fields.year, 2011);
});

test('same title by another band gets a different id', () => {
  const d = setup();
  addEntity(cd('Live', ['tinariwen']), { dataDir: d });
  assert.equal(addEntity(cd('Live', ['bombino']), { dataDir: d }).id, 'bombino-live');
});

test('different title with same slug gets a numeric suffix', () => {
  const d = setup();
  addEntity(cd('Live!', ['tinariwen']), { dataDir: d });
  assert.equal(addEntity(cd('Live', ['tinariwen']), { dataDir: d }).id, 'tinariwen-live-2');
});

test('same CD again throws; merge fills only missing fields', () => {
  const d = setup();
  addEntity(cd('Tassili', ['tinariwen'], { label: 'Anti-' }), { dataDir: d });
  assert.throws(() => addEntity(cd('Tassili', ['tinariwen'], { year: 2011 }), { dataDir: d }), /exists/);
  const r = addEntity(cd('Tassili', ['tinariwen'], { year: 2011, label: 'Other' }), { dataDir: d, merge: true });
  assert.equal(r.created, false);
  const f = read(d, 'cds/tinariwen-tassili.md').fields;
  assert.equal(f.year, 2011);
  assert.equal(f.label, 'Anti-');
});

test('invalid input throws and leaves no file', () => {
  const d = setup();
  assert.throws(() => addEntity(cd('X', ['nobody']), { dataDir: d }), /nobody/);
  assert.equal(existsSync(join(d, 'cds', 'nobody-x.md')), false);
  assert.throws(
    () => addEntity({ type: 'band', fields: { name: 'B', countries: ['mali'], links: [{ type: 'nope', url: 'https://a.b' }] } }, { dataDir: d }),
    /link type/,
  );
  assert.equal(existsSync(join(d, 'bands', 'b.md')), false);
});

test('image fields in input are rejected', () => {
  const d = setup();
  assert.throws(() => addEntity(cd('X', ['tinariwen'], { image: 'cds/x.avif' }), { dataDir: d }), /image/);
});

test('adds a band', () => {
  const d = setup();
  assert.equal(addEntity({ type: 'band', fields: { name: 'Etran Finatawa', countries: ['mali'], styles: ['desert-blues'] } }, { dataDir: d }).id, 'etran-finatawa');
});
