import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyLink, extractLinks } from '../scripts/lib/links.js';

test('classifyLink by host', () => {
  assert.equal(classifyLink('https://open.spotify.com/album/x'), 'spotify');
  assert.equal(classifyLink('https://tinariwen.bandcamp.com/album/tassili'), 'bandcamp');
  assert.equal(classifyLink('https://en.wikipedia.org/wiki/Tassili_(album)'), 'wikipedia');
  assert.equal(classifyLink('https://music.apple.com/us/album/x'), 'apple-music');
  assert.equal(classifyLink('https://www.youtube.com/watch?v=1'), 'youtube');
  assert.equal(classifyLink('https://www.discogs.com/release/1'), 'discogs');
  assert.equal(classifyLink('https://example.org'), 'website');
});

test('extractLinks returns each url once, cleaned, in order', () => {
  const text = 'Poslech: https://a.com/x), a také (https://b.com/y). https://a.com/x';
  assert.deepEqual(extractLinks(text), [
    { type: 'website', url: 'https://a.com/x' },
    { type: 'website', url: 'https://b.com/y' },
  ]);
});

test('extractLinks keeps balanced parentheses inside the url and handles quotes', () => {
  const r = extractLinks('"https://en.wikipedia.org/wiki/Tassili_(album)", http://x.org/a;');
  assert.deepEqual(r.map((l) => l.url), ['https://en.wikipedia.org/wiki/Tassili_(album)', 'http://x.org/a']);
});

test('extractLinks of empty text is empty', () => {
  assert.deepEqual(extractLinks(''), []);
});
