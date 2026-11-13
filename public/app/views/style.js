import { h } from '../ui/dom.js';
import { bandRow, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { plural } from '../labels.js';

export function render({ store, params, today }) {
  const style = store.byId.styles.get(params.id);
  const bands = store.bandsByStyle.get(style.id) ?? [];
  const byCountry = new Map();
  for (const b of bands) for (const c of b.countries ?? []) byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
  const countries = [...byCountry].sort((a, b) => b[1] - a[1]);
  let country = '', photo = false;
  const list = h('div');
  const paint = () => {
    const shown = bands.filter((b) => (!country || b.countries?.includes(country)) && (!photo || b.image));
    list.replaceChildren(...shown.slice(0, 8).map((b) => bandRow(store, b, { today })),
      h('p', { class: 'result-note' }, `${Math.min(8, shown.length)} z ${shown.length} · `, h('a', { href: `#/bands?style=${encodeURIComponent(style.id)}${country ? `&country=${encodeURIComponent(country)}` : ''}${photo ? '&photo=1' : ''}` }, 'všechny v seznamu kapel →')));
  };
  paint();
  const body = prose(style.body);
  return h('article', { class: 'detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/styles' }, 'Styly'), ` / ${prettyStyle(style.name)}`),
    h('header', { class: 'style-head' }, h('span', { class: 'chip chip-style chip-big' }, prettyStyle(style.name)), h('span', { class: 'count-big' }, plural(bands.length, 'kapela', 'kapely', 'kapel'))),
    body || countries.length ? h('div', { class: 'two-col' },
      h('div', null, body ? [sectionTitle('O stylu'), body] : null),
      countries.length ? h('aside', null, sectionTitle('Podle zemí'), h('ul', { class: 'plain-list' }, countries.slice(0, 8).map(([id, n]) => {
        const c = store.byId.countries.get(id);
        return h('li', null, h('a', { href: `#/bands?style=${encodeURIComponent(style.id)}&country=${encodeURIComponent(id)}` }, `${c?.flag ?? ''} ${c?.name ?? id}`.trim()), h('small', null, n));
      }))) : null) : null,
    sectionTitle('Kapely'),
    h('div', { class: 'filters' },
      h('select', { class: 'filter-select', 'aria-label': 'Země', onChange: (e) => { country = e.target.value; paint(); } }, h('option', { value: '' }, 'ZEMĚ ▾'), countries.map(([id, n]) => h('option', { value: id }, `${store.byId.countries.get(id)?.name ?? id} (${n})`))),
      h('label', { class: 'filter-check' }, h('input', { type: 'checkbox', onChange: (e) => { photo = e.target.checked; paint(); } }), ' S FOTKOU')),
    list);
}
