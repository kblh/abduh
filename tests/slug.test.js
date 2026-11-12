import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, normalizeName, stripEmoji } from '../scripts/lib/slug.js';

test('slugify strips punctuation and diacritics into hyphens', () => {
  assert.equal(slugify("Ivory Coast - Cote d'Ivoire"), 'ivory-coast-cote-d-ivoire');
  assert.equal(slugify('Dub in da Trip'), 'dub-in-da-trip');
  assert.equal(slugify('Čechomor'), 'cechomor');
});

test('slugify drops ~ prefix and emoji', () => {
  assert.equal(slugify('~piano 🎹'), 'piano');
});

test('slugify of emoji only is empty', () => {
  assert.equal(slugify('🎹'), '');
});

test('stripEmoji removes emoji and flags and trims', () => {
  assert.equal(stripEmoji('🇩🇿 Algeria'), 'Algeria');
  assert.equal(stripEmoji('piano 🎹'), 'piano');
});

test('normalizeName ignores case, spacing and diacritics', () => {
  assert.equal(normalizeName('Zdob si Zdub'), normalizeName('Zdob Si  Zdub'));
  assert.equal(normalizeName('Čechomor'), normalizeName('cechomor'));
});

test('normalizeName drops inline tags and trailing hash', () => {
  assert.equal(normalizeName('Juan Formell [[~bass]]#'), 'juan formell');
});

test('normalizeName keeps parentheses', () => {
  assert.notEqual(
    normalizeName('Guillermo Portabales (1911 - 1970)'),
    normalizeName('Guillermo Portabales'),
  );
});
