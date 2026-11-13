import { h } from '../ui/dom.js';
import { bandRow, cdCard, chip, countryLinks, initials, linkButtons, placeholderCard, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { CONTINENTS } from '../labels.js';

export function render({ store, params, today }) {
  const band = store.byId.bands.get(params.id);
  const first = band.countries?.[0];
  const continent = CONTINENTS[store.continentOf(first)] ?? '';
  const letter = (initials(band.name)[0] ?? '#');
  const flag = store.byId.countries.get(first)?.flag;

  const photo = band.image
    ? h('div', { class: 'photo' }, h('img', { src: band.image, alt: band.name }))
    : h('div', { class: 'photo photo-ph' }, h('span', { class: 'photo-initials' }, initials(band.name)), flag ? h('span', { class: 'photo-flag' }, flag) : null);

  const chips = [
    ...(band.styles ?? []).map((s) => chip(prettyStyle(store.byId.styles.get(s)?.name ?? s), `#/styles/${encodeURIComponent(s)}`, 'style')),
    ...(band.instruments ?? []).map((i) => { const ins = store.byId.instruments.get(i); return chip(`${ins?.icon ?? ''} ${ins?.name ?? i}`.trim(), `#/instruments/${encodeURIComponent(i)}`, 'instrument'); }),
    ...(band.tags ?? []).map((t) => chip(t === 'woman' ? 'ŽENA' : t, null, 'tag')),
  ];
  const cds = store.cdsByBand.get(band.id) ?? [];
  const style0 = band.styles?.[0];
  const similar = style0 ? (store.bandsByStyle.get(style0) ?? []).filter((b) => b.id !== band.id).slice(0, 3) : [];
  const shelves = store.shelvesOf('band', band.id);
  const bio = prose(band.body);
  const members = band.members?.length ? h('aside', { class: 'members' }, sectionTitle('Členové'), h('ul', null, band.members.map((m) => h('li', null, m)))) : null;

  return h('article', { class: 'detail band-detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/bands' }, 'Kapely'), ` / ${letter} / ${band.name}`),
    h('header', { class: 'detail-head' },
      photo,
      h('div', { class: 'detail-main' },
        h('p', { class: 'eyebrow' }, ['KAPELA', continent.toUpperCase()].filter(Boolean).join(' · ')),
        h('h1', { class: 'detail-title' }, band.name),
        countryLinks(store, band.countries ?? []),
        chips.length ? h('div', { class: 'chips' }, chips) : null,
        band.links?.length ? linkButtons(band.links) : null)),
    bio || members ? h('div', { class: 'two-col' }, bio ? h('div', null, sectionTitle('O kapele'), bio) : h('div'), members) : null,
    sectionTitle('Diskografie', `${cds.length} CD`),
    cds.length ? h('div', { class: 'cd-grid' }, cds.map((c) => cdCard(store, c))) : h('p', { class: 'hand-note' }, 'zatím žádné cédéčko'),
    similar.length ? h('div', null, sectionTitle(`Taky ${prettyStyle(store.byId.styles.get(style0)?.name ?? style0)}`), similar.map((b) => bandRow(store, b, { today }))) : null,
    shelves.length ? h('div', null, sectionTitle('Na poličkách'), h('div', { class: 'chips' }, shelves.map((s) => chip(s.name, `#/shelves/${encodeURIComponent(s.id)}`, 'instrument')))) : null);
}
