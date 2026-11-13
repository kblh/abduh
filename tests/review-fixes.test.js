import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { addEntity } from '../scripts/lib/add-entity.js';
import { addImage } from '../scripts/lib/image.js';
import { extractLinks } from '../scripts/lib/links.js';

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'abduh-fix-'));
  const d = join(root, 'data');
  for (const s of ['bands', 'countries']) mkdirSync(join(d, s), { recursive: true });
  writeFileSync(join(d, 'countries', 'mali.md'), '---\nname: Mali\ncontinent: africa\n---\n');
  writeFileSync(join(d, 'bands', 'a.md'), '---\nname: A\ncountries:\n  - mali\n---\n');
  writeFileSync(join(d, 'bands', 'b.md'), '---\nname: B\ncountries:\n  - mali\n---\n');
  return { root, d };
}
const cd = (name, bands) => ({ type: 'cd', fields: { name, bands } });

test('C1: band id with path characters is rejected and nothing is written outside', () => {
  const { root, d } = setup();
  assert.throws(() => addEntity(cd('x', ['../../outside']), { dataDir: d }));
  assert.equal(existsSync(resolve(d, 'cds', '../../outside-x.md')), false);
  assert.equal(existsSync(join(root, 'outside-x.md')), false);
});

test('C2: addImage rejects slugs with path characters', async () => {
  const { d } = setup();
  const src = join(d, 'in.png');
  writeFileSync(src, await sharp({ create: { width: 10, height: 10, channels: 3, background: '#000' } }).png().toBuffer());
  await assert.rejects(addImage({ type: 'band', slug: '../bands/a', src, dataDir: d }), /slug/i);
});

test('I1: a broken file in data/ rolls the new file back', () => {
  const { d } = setup();
  writeFileSync(join(d, 'bands', 'bad.md'), '---\nname: [bad\n---\n');
  assert.throws(() => addEntity(cd('Q', ['a']), { dataDir: d }));
  assert.equal(existsSync(join(d, 'cds', 'a-q.md')), false);
});

test('I2: same title with a different band set is a different CD, never merged into', () => {
  const { d } = setup();
  addEntity(cd('Live', ['a']), { dataDir: d });
  const r = addEntity(cd('Live', ['a', 'b']), { dataDir: d });
  assert.equal(r.id, 'a-live-2');
  assert.deepEqual(addEntity(cd('Live', ['a']), { dataDir: d, merge: true }), { id: 'a-live', created: false });
});

test('I5: the already-exists error does not suggest --force', () => {
  const { d } = setup();
  addEntity(cd('Live', ['a']), { dataDir: d });
  assert.throws(() => addEntity(cd('Live', ['a']), { dataDir: d }), (e) => /merge/.test(e.message) && !/--force/.test(e.message));
});

test('I3: extractLinks handles markdown links, bold and typographic quotes', () => {
  const urls = (t) => extractLinks(t).map((l) => l.url);
  assert.deepEqual(urls('[https://a.com](https://a.com)'), ['https://a.com']);
  assert.deepEqual(urls('„https://a.com/x“'), ['https://a.com/x']);
  assert.deepEqual(urls('**https://a.com/x**'), ['https://a.com/x']);
  assert.deepEqual(urls('https://a.com/x… další'), ['https://a.com/x']);
});

const build = (root) =>
  spawnSync('node', [resolve('scripts/build.js'), 'data', join(root, 'out', 'data.json')], { cwd: root, encoding: 'utf8' });

test('I4: build copies only referenced images, ignores dotfiles, keeps foreign files in img/', async () => {
  const { root, d } = setup();
  const png = await sharp({ create: { width: 10, height: 10, channels: 3, background: '#000' } }).avif().toBuffer();
  mkdirSync(join(d, 'images', 'bands'), { recursive: true });
  writeFileSync(join(d, 'images', 'bands', 'a.avif'), png);
  writeFileSync(join(d, 'images', 'bands', 'orphan.avif'), png);
  writeFileSync(join(d, 'images', '.DS_Store'), 'x');
  writeFileSync(join(d, 'bands', 'a.md'), '---\nname: A\ncountries:\n  - mali\nimage: bands/a.avif\n---\n');
  mkdirSync(join(root, 'out', 'img'), { recursive: true });
  writeFileSync(join(root, 'out', 'img', 'precious.txt'), 'keep');
  const r = build(root);
  assert.equal(r.status, 0);
  assert.match(r.stderr, /orphan\.avif/);
  assert.doesNotMatch(r.stderr, /DS_Store/);
  assert.equal(existsSync(join(root, 'out', 'img', 'bands', 'a.avif')), true);
  assert.equal(existsSync(join(root, 'out', 'img', 'bands', 'orphan.avif')), false);
  assert.equal(readFileSync(join(root, 'out', 'img', 'precious.txt'), 'utf8'), 'keep');
});

test('build exits 1 when a referenced image file is missing', () => {
  const { root, d } = setup();
  writeFileSync(join(d, 'bands', 'a.md'), '---\nname: A\ncountries:\n  - mali\nimage: bands/a.avif\n---\n');
  const r = build(root);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /a\.avif/);
});
