import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAlbumId, fetchAlbumId } from '../scripts/lib/bandcamp.js';

const page = (props) => `<html><head><meta name="bc-page-properties" content="${props}"></head></html>`;

test('parseAlbumId reads the album id from page properties', () => {
  assert.equal(parseAlbumId(page('{&quot;item_type&quot;:&quot;a&quot;,&quot;item_id&quot;:123}')), 123);
});

test('parseAlbumId ignores tracks and pages without properties', () => {
  assert.equal(parseAlbumId(page('{&quot;item_type&quot;:&quot;t&quot;,&quot;item_id&quot;:5}')), null);
  assert.equal(parseAlbumId('<html></html>'), null);
});

test('fetchAlbumId throws on HTTP errors', async () => {
  await assert.rejects(fetchAlbumId('https://x.test/album/a', async () => ({ ok: false, status: 404 })), /404/);
});
