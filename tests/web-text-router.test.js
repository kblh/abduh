import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, prettyStyle } from '../public/app/text.js';
import { parseHash, buildHash } from '../public/app/router.js';

test('normalize strips diacritics, case, hyphens and extra spaces', () => {
  assert.equal(normalize('Raï'), 'rai');
  assert.equal(normalize('A-Capella  X'), 'a capella x');
  assert.equal(normalize('Čech'), 'cech');
  assert.equal(normalize(undefined), '');
});

test('prettyStyle replaces hyphens', () => assert.equal(prettyStyle('a-capella'), 'a capella'));

test('parseHash routes', () => {
  assert.equal(parseHash('').route, 'home');
  assert.equal(parseHash('#/').route, 'home');
  assert.deepEqual(parseHash('#/bands/tinariwen'), { route: 'band', id: 'tinariwen', query: {} });
  assert.deepEqual(parseHash('#/bands?country=mali&photo=1').query, { country: 'mali', photo: '1' });
  assert.equal(parseHash('#/search?q=ra%C3%AF').query.q, 'raï');
  assert.equal(parseHash('#/nope').route, 'notfound');
  assert.equal(parseHash('#/bands/%E0%A4%A').route, 'notfound');
  assert.equal(parseHash('#/bands/a/b').route, 'notfound');
});

test('buildHash omits empty query values and encodes', () => {
  assert.equal(buildHash('bands', { query: { country: 'mali', style: '' } }), '#/bands?country=mali');
  assert.equal(buildHash('search', { query: { q: 'raï' } }), '#/search?q=ra%C3%AF');
});

test('round trip for every route', () => {
  const list = ['bands', 'cds', 'styles', 'instruments', 'countries', 'shelves'];
  const one = ['band', 'cd', 'style', 'instrument', 'country', 'shelf'];
  assert.equal(parseHash(buildHash('home')).route, 'home');
  assert.equal(parseHash(buildHash('search', { query: { q: 'x y' } })).query.q, 'x y');
  list.forEach((r, i) => {
    assert.equal(parseHash(buildHash(r)).route, r);
    const p = parseHash(buildHash(one[i], { id: 'a b' }));
    assert.deepEqual([p.route, p.id], [one[i], 'a b']);
  });
});
