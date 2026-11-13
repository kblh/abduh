import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../scripts/lib/validate.js';
import { findOrphanImages } from '../scripts/lib/images.js';
import { buildData } from '../scripts/lib/build-data.js';
import { serializeEntity } from '../scripts/lib/entity-file.js';

const country = { type: 'country', id: 'mali', fields: { name: 'Mali', continent: 'africa' }, body: '' };
const style = { type: 'style', id: 'desert-blues', fields: { name: 'desert blues' }, body: '' };
const band = { type: 'band', id: 'tinariwen', fields: { name: 'Tinariwen', countries: ['mali'] }, body: '' };
const cd = (fields) => ({ type: 'cd', id: 'tinariwen-tassili', fields: { name: 'Tassili', bands: ['tinariwen'], ...fields }, body: '' });
const base = [country, style, band];

test('valid CD without image is fine', () => {
  assert.deepEqual(validate([...base, cd({ year: 2011, styles: ['desert-blues'] })]), []);
});

test('CD with no bands is an error naming the CD', () => {
  const errs = validate([...base, cd({ bands: [] })]);
  assert.match(errs[0], /tinariwen-tassili/);
});

test('CD with unknown band or style is an error', () => {
  assert.match(validate([...base, cd({ bands: ['nobody'] })])[0], /nobody/);
  assert.match(validate([...base, cd({ styles: ['nope'] })])[0], /nope/);
});

test('link with unknown type or non-http url is an error', () => {
  assert.ok(validate([...base, cd({ links: [{ type: 'tiktok', url: 'https://x.com' }] })]).length > 0);
  assert.ok(validate([...base, cd({ links: [{ type: 'other', url: 'ftp://x.com' }] })]).length > 0);
  assert.deepEqual(validate([...base, cd({ links: [{ type: 'bandcamp', url: 'https://x.bandcamp.com' }] })]), []);
});

test('band links are validated too', () => {
  const b = { ...band, fields: { ...band.fields, links: [{ type: 'nope', url: 'https://a.b' }] } };
  assert.ok(validate([country, b]).length > 0);
});

test('missing image file is an error, only when imageExists is given', () => {
  const e = [...base, cd({ image: 'cds/a.avif' })];
  assert.deepEqual(validate(e), []);
  const errs = validate(e, { imageExists: () => false });
  assert.match(errs[0], /cds\/a\.avif/);
  assert.deepEqual(validate(e, { imageExists: () => true }), []);
});

test('findOrphanImages lists unreferenced files', () => {
  const e = [...base, cd({ image: 'cds/a.avif' })];
  assert.deepEqual(findOrphanImages(e, ['cds/a.avif', 'bands/z.avif']), ['bands/z.avif']);
});

test('buildData puts cds after bands and prefixes image with img/', () => {
  const data = buildData([...base, cd({ image: 'cds/a.avif' })]);
  assert.deepEqual(Object.keys(data), ['bands', 'cds', 'countries', 'styles', 'instruments']);
  assert.equal(data.cds[0].image, 'img/cds/a.avif');
});

test('serialize orders bands before year and links last', () => {
  const text = serializeEntity(cd({ year: 2011, links: [{ type: 'bandcamp', url: 'https://a.b' }], image: 'cds/a.avif', tags: ['x'] }));
  const i = (k) => text.indexOf(`\n${k}:`);
  assert.ok(i('name') < i('bands') && i('bands') < i('year') && i('year') < i('tags') && i('tags') < i('image') && i('image') < i('links'));
});
