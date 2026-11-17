import { icon } from '../ui/icons.js';
import { h } from '../ui/dom.js';
import { CONTINENTS, CONTINENT_ORDER, fmt, plural } from '../labels.js';
import { normalize } from '../text.js';

export function render({ store }) {
  const by = Object.fromEntries(CONTINENT_ORDER.map((k) => [k, []]));
  for (const c of store.byId.countries.values()) (by[c.continent] ?? (by[c.continent] = [])).push({ ...c, n: store.bandsByCountry.get(c.id)?.length ?? 0 });
  const sections = CONTINENT_ORDER.filter((k) => by[k]?.length).map((k) => {
    const items = by[k].sort((a, b) => (normalize(a.name) < normalize(b.name) ? -1 : 1));
    const total = items.reduce((s, c) => s + c.n, 0);
    const grid = h('div', { class: 'country-grid' });
    let all = false;
    const paint = () => {
      const shown = all ? items : items.slice(0, 10);
      grid.replaceChildren(...shown.map((c) => h('a', { class: 'country-item', href: `#/countries/${encodeURIComponent(c.id)}` }, h('span', null, `${c.flag ?? ''} ${c.name}`.trim()), h('small', null, c.n))),
        !all && items.length > 10 ? h('button', { class: 'more-btn', type: 'button', onClick: () => { all = true; paint(); } }, `+${items.length - 10} dalších →`) : null);
    };
    paint();
    return h('section', { class: 'continent', id: `c-${k}` },
      h('p', { class: 'hand-note continent-total' }, plural(total, 'kapela', 'kapely', 'kapel')),
      h('h2', { class: 'section-title' }, h('span', null, CONTINENTS[k] ?? k), h('small', null, plural(items.length, 'země', 'země', 'zemí'))), grid);
  });
  return h('section', null,
    h('h1', { class: 'page-title' }, icon('countries'), 'Země ', h('span', { class: 'count' }, fmt(store.byId.countries.size)), h('em', { class: 'hand-note' }, `${sections.length} kontinentů`)),
    h('div', { class: 'filters' }, CONTINENT_ORDER.filter((k) => by[k]?.length).map((k) => h('a', { class: 'filter-select', href: `#/countries`, onClick: (e) => { e.preventDefault(); document.getElementById(`c-${k}`)?.scrollIntoView({ behavior: 'smooth' }); } }, `${CONTINENTS[k]} ${by[k].length}`))),
    sections);
}
