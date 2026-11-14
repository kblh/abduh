import { h } from '../ui/dom.js';
import { normalize } from '../text.js';
import { buildHash } from '../router.js';
import { plural } from '../labels.js';

export function render({ store, params }) {
  const az = params.query.sort !== 'count';
  const items = [...store.byId.instruments.values()].map((i) => ({ ...i, n: store.bandsByInstrument.get(i.id)?.length ?? 0 }))
    .sort(az ? (a, b) => (normalize(a.name) < normalize(b.name) ? -1 : 1) : (a, b) => b.n - a.n || (normalize(a.name) < normalize(b.name) ? -1 : 1));
  return h('section', null,
    h('h1', { class: 'page-title' }, 'Nástroje ', h('span', { class: 'count' }, items.length)),
    h('p', { class: 'filters' }, h('span', { class: 'sort' }, 'ŘADIT ', h('a', { href: buildHash('instruments'), 'aria-current': az ? 'true' : null }, 'A–Z'), h('a', { href: buildHash('instruments', { query: { sort: 'count' } }), 'aria-current': az ? null : 'true' }, 'počet kapel'))),
    h('div', { class: 'ins-grid' }, items.map((i) => h('a', { class: 'ins-card', href: `#/instruments/${encodeURIComponent(i.id)}` },
      h('span', { class: 'ins-icon' }, i.icon ?? '♪'), h('span', { class: 'ins-name' }, i.name), h('small', null, plural(i.n, 'kapela', 'kapely', 'kapel'))))));
}
