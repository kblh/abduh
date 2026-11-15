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

test('shelf: merge appends new bands/cds without duplicates', () => {
  const d = setup();
  addEntity({ type: 'shelf', fields: { name: 'Poušť', bands: ['tinariwen'] } }, { dataDir: d });
  const r = addEntity({ type: 'shelf', fields: { name: 'Poušť', bands: ['tinariwen', 'bombino'] } }, { dataDir: d, merge: true });
  assert.deepEqual(r, { id: 'poust', created: false });
  assert.deepEqual(read(d, 'shelves/poust.md').fields.bands, ['tinariwen', 'bombino']);
});

test('adds a tag and rejects a band with an unknown tag', () => {
  const d = setup();
  assert.deepEqual(addEntity({ type: 'tag', fields: { name: 'New York' } }, { dataDir: d }), { id: 'new-york', created: true });
  assert.throws(() => addEntity({ type: 'band', fields: { name: 'X', countries: ['mali'], tags: ['ghost'] } }, { dataDir: d }), /unknown tag/);
  addEntity({ type: 'band', fields: { name: 'Y', countries: ['mali'], tags: ['new-york'] } }, { dataDir: d });
});

test('merge appends new links by url and keeps existing ones', () => {
  const d = setup();
  const sp = { type: 'spotify', url: 'https://open.spotify.com/album/x' };
  const bc = { type: 'bandcamp', url: 'https://x.bandcamp.com/album/y' };
  addEntity(cd('Tassili', ['tinariwen'], { links: [sp] }), { dataDir: d });
  addEntity(cd('Tassili', ['tinariwen'], { links: [sp, bc] }), { dataDir: d, merge: true });
  assert.deepEqual(read(d, 'cds/tinariwen-tassili.md').fields.links, [sp, bc]);
});

test('band members matching an existing band are written as wikilinks', () => {
  const d = setup();
  const r = addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['Bombino', 'Some Person'] } }, { dataDir: d });
  assert.equal(r.id, 'group');
  assert.deepEqual(read(d, 'bands/group.md').fields.members, ['[[bombino]]', 'Some Person']);
  assert.match(readFileSync(join(d, 'bands/group.md'), 'utf8'), /- "\[\[bombino\]\]"/);
});

test('member linking ignores case and diacritics and never links a band to itself', () => {
  const d = setup();
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'] } }, { dataDir: d });
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['group', 'TÍNARIWEN'] } }, { dataDir: d, merge: true });
  assert.deepEqual(read(d, 'bands/group.md').fields.members, ['group', '[[tinariwen]]']);
});

test('merge unions members without duplicates', () => {
  const d = setup();
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['Some Person'] } }, { dataDir: d });
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['Some Person', 'Bombino', 'Other'] } }, { dataDir: d, merge: true });
  assert.deepEqual(read(d, 'bands/group.md').fields.members, ['Some Person', '[[bombino]]', 'Other']);
});

test('merge fills bio only when the band has none', () => {
  const d = setup();
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'] }, body: 'První bio.\n' }, { dataDir: d });
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'] }, body: 'Druhé bio.\n' }, { dataDir: d, merge: true });
  assert.equal(read(d, 'bands/group.md').body, 'První bio.\n');
});

test('a new band turns matching plain-text members of other bands into links', () => {
  const d = setup();
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['Ibrahim Ag Alhabib', 'Someone Else'] } }, { dataDir: d });
  const r = addEntity({ type: 'band', fields: { name: 'Ibrahim Ag Alhabib', countries: ['mali'] } }, { dataDir: d });
  assert.deepEqual(r.linked, ['group']);
  assert.deepEqual(read(d, 'bands/group.md').fields.members, ['[[ibrahim-ag-alhabib]]', 'Someone Else']);
});

test('reverse linking ignores case and diacritics, leaves other bands alone, and skips merges', () => {
  const d = setup();
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['ÍBRAHIM ag alhabib'] } }, { dataDir: d });
  const before = readFileSync(join(d, 'bands/tinariwen.md'), 'utf8');
  addEntity({ type: 'band', fields: { name: 'Ibrahim Ag Alhabib', countries: ['mali'] } }, { dataDir: d });
  assert.deepEqual(read(d, 'bands/group.md').fields.members, ['[[ibrahim-ag-alhabib]]']);
  assert.equal(readFileSync(join(d, 'bands/tinariwen.md'), 'utf8'), before);
  const r = addEntity({ type: 'band', fields: { name: 'Ibrahim Ag Alhabib', countries: ['mali'], tags: [] } }, { dataDir: d, merge: true });
  assert.deepEqual(r.linked ?? [], []);
});

test('a failed write links nothing', () => {
  const d = setup();
  addEntity({ type: 'band', fields: { name: 'Group', countries: ['mali'], members: ['Ghost Person'] } }, { dataDir: d });
  assert.throws(() => addEntity({ type: 'band', fields: { name: 'Ghost Person', countries: ['nowhere'] } }, { dataDir: d }));
  assert.deepEqual(read(d, 'bands/group.md').fields.members, ['Ghost Person']);
});
