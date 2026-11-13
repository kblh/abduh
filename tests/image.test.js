import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { toAvifSquare, fetchImage, addImage } from '../scripts/lib/image.js';
import { parseEntity } from '../scripts/lib/entity-file.js';

const png = (w, h) =>
  sharp({ create: { width: w, height: h, channels: 3, background: '#c33' } }).png().toBuffer();

const resp = (body, type, status = 200) => async () =>
  new Response(body, { status, headers: { 'content-type': type } });

test('wide image becomes 400x400 AVIF', async () => {
  const out = await toAvifSquare(await png(1000, 500));
  const m = await sharp(out).metadata();
  assert.equal(m.compression, 'av1');
  assert.deepEqual([m.width, m.height], [400, 400]);
});

test('small image is upscaled to 400x400', async () => {
  const m = await sharp(await toAvifSquare(await png(100, 100))).metadata();
  assert.deepEqual([m.width, m.height], [400, 400]);
});

test('flat 1000x1000 image is under 30 kB', async () => {
  assert.ok((await toAvifSquare(await png(1000, 1000))).length < 30_000);
});

test('fetchImage rejects html and oversize, accepts image', async () => {
  await assert.rejects(fetchImage('https://x.test/a', { fetchFn: resp('<html>', 'text/html') }), /image/);
  await assert.rejects(fetchImage('https://x.test/a', { fetchFn: resp(Buffer.alloc(11 * 1024 * 1024), 'image/png') }), /large|size/i);
  await assert.rejects(fetchImage('ftp://x.test/a'), /http/);
  const buf = await png(10, 10);
  assert.ok((await fetchImage('https://x.test/a', { fetchFn: resp(buf, 'image/png') })).length > 0);
});

function setup() {
  const dataDir = mkdtempSync(join(tmpdir(), 'abduh-img-'));
  mkdirSync(join(dataDir, 'bands'));
  writeFileSync(join(dataDir, 'bands', 'tinariwen.md'), '---\nname: Tinariwen\ncountries:\n  - mali\n---\n');
  return dataDir;
}

test('addImage stores avif and sets image fields', async () => {
  const dataDir = setup();
  const src = join(dataDir, 'in.png');
  writeFileSync(src, await png(800, 600));
  const rel = await addImage({ type: 'band', slug: 'tinariwen', src, source: 'https://example.org/p', dataDir });
  assert.equal(rel, 'bands/tinariwen.avif');
  assert.ok(existsSync(join(dataDir, 'images', rel)));
  const e = parseEntity('band', 'tinariwen', readFileSync(join(dataDir, 'bands', 'tinariwen.md'), 'utf8'));
  assert.equal(e.fields.image, 'bands/tinariwen.avif');
  assert.equal(e.fields.image_source, 'https://example.org/p');
  assert.equal(e.fields.name, 'Tinariwen');
});

test('addImage refuses second image without force and unknown slug', async () => {
  const dataDir = setup();
  const src = join(dataDir, 'in.png');
  writeFileSync(src, await png(50, 50));
  await addImage({ type: 'band', slug: 'tinariwen', src, dataDir });
  await assert.rejects(addImage({ type: 'band', slug: 'tinariwen', src, dataDir }), /exists/);
  await assert.doesNotReject(addImage({ type: 'band', slug: 'tinariwen', src, dataDir, force: true }));
  await assert.rejects(addImage({ type: 'band', slug: 'nobody', src, dataDir }), /not found|missing/i);
});
