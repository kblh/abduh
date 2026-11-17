import { h } from '../ui/dom.js';
import { bandRow, chip, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { CONTINENTS, plural } from '../labels.js';

export function render({ store, params, today }) {
  const country = store.byId.countries.get(params.id);
  const bands = store.bandsByCountry.get(country.id) ?? [];
  const groups = new Map();
  for (const b of bands) for (const s of (b.styles?.length ? b.styles : [''])) { if (!groups.has(s)) groups.set(s, []); groups.get(s).push(b); }
  const ordered = [...groups].sort((a, b) => (a[0] === '') - (b[0] === '') || b[1].length - a[1].length);
  const body = prose(country.body);
  const long = (country.body ?? '').length > 700;
  if (body && long) body.classList.add('clamped');
  return h('article', { class: 'detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/countries' }, 'Země'), ` / ${CONTINENTS[country.continent] ?? ''} / ${country.name}`),
    h('header', { class: 'detail-head' },
      h('div', { class: 'flag-big' }, country.flag ?? '🏳'),
      h('div', { class: 'detail-main' },
        h('p', { class: 'eyebrow' }, `ZEMĚ · ${(CONTINENTS[country.continent] ?? '').toUpperCase()}`),
        h('h1', { class: 'detail-title' }, country.name), h('small', { class: 'count' }, plural(bands.length, 'kapela', 'kapely', 'kapel')),
        h('div', { class: 'chips' }, ordered.filter(([s]) => s).slice(0, 6).map(([s, bs]) => chip(`${prettyStyle(store.byId.styles.get(s)?.name ?? s)} · ${bs.length}`, `#/bands?country=${encodeURIComponent(country.id)}&style=${encodeURIComponent(s)}`, 'style'))))),
    body ? h('div', null, sectionTitle('Hudba a historie'), body, long ? h('button', { class: 'more-btn', type: 'button', onClick: (e) => { body.classList.remove('clamped'); e.target.remove(); } }, 'číst dál ↓') : null) : null,
    ordered.map(([s, bs]) => h('section', { class: 'style-group' },
      h('header', { class: 'group-head' },
        s ? chip(prettyStyle(store.byId.styles.get(s)?.name ?? s), null, 'style') : h('span', { class: 'hand-note' }, 'bez stylu'),
        h('small', null, plural(bs.length, 'kapela', 'kapely', 'kapel')),
        s ? h('a', { class: 'group-link', href: `#/styles/${encodeURIComponent(s)}` }, 'celý styl →') : null),
      bs.map((b) => bandRow(store, b, { today })))));
}
