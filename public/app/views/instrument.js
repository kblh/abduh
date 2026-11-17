import { h } from '../ui/dom.js';
import { bandRow, cdCard, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { plural } from '../labels.js';

export function render({ store, params, today }) {
  const ins = store.byId.instruments.get(params.id);
  const bands = store.bandsByInstrument.get(ins.id) ?? [];
  const countries = new Map(), styles = new Map();
  for (const b of bands) {
    for (const c of b.countries ?? []) countries.set(c, (countries.get(c) ?? 0) + 1);
    for (const s of b.styles ?? []) styles.set(s, (styles.get(s) ?? 0) + 1);
  }
  let country = '', style = '';
  const list = h('div');
  const paint = () => {
    const shown = bands.filter((b) => (!country || b.countries?.includes(country)) && (!style || b.styles?.includes(style)));
    list.replaceChildren(...shown.slice(0, 12).map((b) => bandRow(store, b, { today })),
      h('p', { class: 'result-note' }, `${Math.min(12, shown.length)} z ${shown.length} · `, h('a', { href: `#/bands?instrument=${encodeURIComponent(ins.id)}${country ? `&country=${encodeURIComponent(country)}` : ''}${style ? `&style=${encodeURIComponent(style)}` : ''}` }, 'všechny v seznamu kapel →')));
  };
  paint();
  const cds = [...new Set(bands.flatMap((b) => store.cdsByBand.get(b.id) ?? []))];
  const body = prose(ins.body);
  const sel = (label, map, nameOf, set) => h('select', { class: 'filter-select', 'aria-label': label, onChange: (e) => { set(e.target.value); paint(); } }, h('option', { value: '' }, `${label} ▾`), [...map].sort((a, b) => b[1] - a[1]).map(([id, n]) => h('option', { value: id }, `${nameOf(id)} (${n})`)));
  return h('article', { class: 'detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/instruments' }, 'Nástroje'), ` / ${ins.name}`),
    h('header', { class: 'detail-head' }, ins.image ? h('img', { class: 'ins-big ins-photo', src: ins.image, alt: ins.name, width: 200, height: 200 }) : h('div', { class: 'ins-big' }, ins.icon ?? '♪'),
      h('div', { class: 'detail-main' }, h('p', { class: 'eyebrow' }, 'NÁSTROJ'), h('h1', { class: 'detail-title' }, ins.name, h('small', { class: 'count' }, ` ${plural(bands.length, 'kapela', 'kapely', 'kapel')}`)), body)),
    sectionTitle('Kdo na ni hraje'),
    h('div', { class: 'filters' },
      sel('ZEMĚ', countries, (id) => store.byId.countries.get(id)?.name ?? id, (v) => { country = v; }),
      sel('STYL', styles, (id) => prettyStyle(store.byId.styles.get(id)?.name ?? id), (v) => { style = v; })),
    list,
    cds.length ? h('div', null, sectionTitle('Na cédéčkách'), h('div', { class: 'cd-grid' }, cds.slice(0, 6).map((c) => cdCard(store, c)))) : null);
}
