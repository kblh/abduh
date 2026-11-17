import { h } from '../ui/dom.js';
import { bandRow, cdCard, chip, countryLinks, initials, linkButtons, placeholderCard, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { CONTINENTS } from '../labels.js';

// first paragraph, cut at a word boundary
function excerpt(body, max = 140) {
  const p = String(body ?? '').split(/\n\s*\n/).map((x) => x.trim()).find(Boolean);
  if (!p) return '';
  return p.length <= max ? p : `${p.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export function render({ store, params, today }) {
  const band = store.byId.bands.get(params.id);
  const first = band.countries?.[0];
  const continent = CONTINENTS[store.continentOf(first)] ?? '';
  const letter = (initials(band.name)[0] ?? '#');
  const flag = store.byId.countries.get(first)?.flag;

  const photo = band.image
    ? h('div', { class: 'photo round' }, h('img', { src: band.image, alt: band.name }))
    : h('div', { class: 'photo photo-ph round' }, h('span', { class: 'photo-initials' }, initials(band.name)), flag ? h('span', { class: 'photo-flag' }, flag) : null);

  // styles, instruments (with photo when available) and tags as chips beside the discography
  const chipsBox = (title, key, chipList) => (chipList.length ? h('div', null, sectionTitle(title, chipList.length, key), h('div', { class: 'chips' }, chipList)) : null);
  const styleChips = (band.styles ?? []).map((st) => chip(prettyStyle(store.byId.styles.get(st)?.name ?? st), `#/styles/${encodeURIComponent(st)}`, 'style'));
  // instruments and tags: chip, below it the photo (if any) and a trimmed description
  const factBox = (title, key, ids, group, labelOf) => {
    if (!ids.length) return null;
    return h('div', null, sectionTitle(title, ids.length, key), h('div', { class: 'facts-list' }, ids.map((id) => {
      const e = store.byId[group].get(id);
      const ex = excerpt(e?.body);
      return h('div', { class: 'fact-item' },
        chip(labelOf(id, e), `#/${group}/${encodeURIComponent(id)}`, 'style'),
        e?.image || ex ? h('div', { class: 'fact-body' }, e?.image ? h('img', { class: 'fact-img', src: e.image, alt: '', loading: 'lazy', width: 64, height: 64 }) : null, ex ? h('p', { class: 'fact-ex' }, ex) : null) : null);
    })));
  };
  const instrumentsBox = factBox('Nástroje', 'instruments', band.instruments ?? [], 'instruments', (id, e) => `${e?.icon ?? ''} ${e?.name ?? id}`.trim());
  const tagsBox = factBox('Tagy', 'tags', band.tags ?? [], 'tags', (id, e) => (id === 'woman' ? 'ŽENA' : (e?.name ?? id)));
  const side = [chipsBox('Styly', 'styles', styleChips), instrumentsBox, tagsBox].filter(Boolean);
  const sideBox = side.length ? h('aside', { class: 'facets' }, side) : null;
  const cds = store.cdsByBand.get(band.id) ?? [];
  const style0 = band.styles?.[0];
  const similar = style0 ? (store.bandsByStyle.get(style0) ?? []).filter((b) => b.id !== band.id).slice(0, 3) : [];
  const shelves = store.shelvesOf('band', band.id);
  const bio = prose(band.body);
  const members = band.members?.length ? h('aside', { class: 'members' }, sectionTitle('Členové'), h('ul', null, band.members.map((m) => h('li', null, typeof m === 'string' ? m : h('a', { href: `#/bands/${encodeURIComponent(m.id)}` }, m.name))))) : null;

  return h('article', { class: 'detail band-detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/bands' }, 'Kapely'), ` / ${letter} / ${band.name}`),
    h('header', { class: 'detail-head' },
      photo,
      h('div', { class: 'detail-main' },
        h('p', { class: 'eyebrow' }, ['KAPELA', continent.toUpperCase()].filter(Boolean).join(' · ')),
        h('h1', { class: 'detail-title' }, band.name),
        countryLinks(store, band.countries ?? []),
        band.links?.length ? linkButtons(band.links) : null)),
    bio || members ? h('div', { class: 'two-col' }, bio ? h('div', null, sectionTitle('O kapele'), bio) : h('div'), members) : null,
    h('div', { class: sideBox ? 'two-col' : null },
      h('div', null, sectionTitle('Diskografie', `${cds.length} CD`, 'cds'),
        cds.length ? h('div', { class: 'cd-grid' }, cds.map((c) => cdCard(store, c))) : h('p', { class: 'hand-note' }, 'zatím žádné cédéčko')),
      sideBox),
    similar.length ? h('div', null, sectionTitle(`Taky ${prettyStyle(store.byId.styles.get(style0)?.name ?? style0)}`), similar.map((b) => bandRow(store, b, { today }))) : null,
    shelves.length ? h('div', null, sectionTitle('Na poličkách'), h('div', { class: 'chips' }, shelves.map((s) => chip(s.name, `#/shelves/${encodeURIComponent(s.id)}`, 'instrument')))) : null);
}
