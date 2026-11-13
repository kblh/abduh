import { h } from '../ui/dom.js';
import { emptyState } from '../ui/components.js';
import { normalize } from '../text.js';
import { plural } from '../labels.js';

export function render({ store }) {
  const shelves = [...store.byId.shelves.values()].sort((a, b) => (normalize(a.name) < normalize(b.name) ? -1 : 1));
  const title = h('h1', { class: 'page-title' }, 'Poličky ', h('span', { class: 'count' }, shelves.length));
  if (!shelves.length) return h('section', null, title, emptyState('Zatím tu není žádná polička.', null));
  return h('section', null, title, shelves.map((s) => h('a', { class: 'result-line', href: `#/shelves/${encodeURIComponent(s.id)}` },
    h('span', null, s.name), h('small', null, [s.bands?.length ? plural(s.bands.length, 'kapela', 'kapely', 'kapel') : '', s.cds?.length ? plural(s.cds.length, 'CD', 'CD', 'CD') : ''].filter(Boolean).join(' · ') || 'prázdná'))));
}
