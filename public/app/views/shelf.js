import { h } from '../ui/dom.js';
import { bandRow, cdCard, prose, sectionTitle } from '../ui/components.js';

export function render({ store, params, today }) {
  const shelf = store.byId.shelves.get(params.id);
  const bands = (shelf.bands ?? []).map((id) => store.byId.bands.get(id)).filter(Boolean);
  const cds = (shelf.cds ?? []).map((id) => store.byId.cds.get(id)).filter(Boolean);
  return h('article', { class: 'detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/shelves' }, 'Poličky'), ` / ${shelf.name}`),
    h('h1', { class: 'detail-title' }, shelf.name),
    prose(shelf.body, store),
    !bands.length && !cds.length ? h('p', { class: 'hand-note' }, 'zatím prázdná polička') : null,
    bands.length ? h('div', null, sectionTitle('Kapely', bands.length), bands.map((b) => bandRow(store, b, { today }))) : null,
    cds.length ? h('div', null, sectionTitle('CD', cds.length), h('div', { class: 'cd-grid' }, cds.map((c) => cdCard(store, c)))) : null);
}
