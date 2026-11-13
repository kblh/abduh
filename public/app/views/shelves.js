import { h } from '../ui/dom.js';
import { emptyState } from '../ui/components.js';
import { normalize } from '../text.js';
import { plural } from '../labels.js';
import { shelfCovers } from '../filters.js';

function cover(store, shelf) {
  const imgs = shelfCovers(store, shelf);
  if (imgs.length >= 4) return h('span', { class: 'mosaic' }, imgs.map((src) => h('img', { src, alt: '', loading: 'lazy' })));
  if (imgs.length) return h('span', { class: 'mosaic mosaic-one' }, h('img', { src: imgs[0], alt: '', loading: 'lazy' }));
  return h('span', { class: 'mosaic mosaic-ph', 'aria-hidden': 'true' }, h('span', null, [...shelf.name][0]?.toUpperCase() ?? '?'));
}

export function render({ store }) {
  const shelves = [...store.byId.shelves.values()].sort((a, b) => (normalize(a.name) < normalize(b.name) ? -1 : 1));
  const title = h('h1', { class: 'page-title' }, 'Poličky ', h('span', { class: 'count' }, shelves.length));
  if (!shelves.length) return h('section', null, title, emptyState('Zatím tu není žádná polička.', null));
  return h('section', null, title, h('div', { class: 'shelf-grid' }, shelves.map((s) => {
    const meta = [s.bands?.length ? plural(s.bands.length, 'kapela', 'kapely', 'kapel') : '', s.cds?.length ? plural(s.cds.length, 'CD', 'CD', 'CD') : ''].filter(Boolean).join(' · ') || 'prázdná';
    return h('a', { class: 'shelf-card', href: `#/shelves/${encodeURIComponent(s.id)}` }, cover(store, s), h('span', { class: 'shelf-name' }, s.name), h('span', { class: 'shelf-meta' }, meta));
  })));
}
