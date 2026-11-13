import { h } from '../ui/dom.js';
import { cdCard, chip, linkButtons, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { czDate } from '../labels.js';

export function render({ store, params }) {
  const cd = store.byId.cds.get(params.id);
  const bands = (cd.bands ?? []).map((id) => store.byId.bands.get(id)).filter(Boolean);
  const cover = cd.image
    ? h('img', { class: 'cover big-cover', src: cd.image, alt: cd.name })
    : h('div', { class: 'cover cover-ph big-cover' }, h('span', { class: 'cover-ph-title' }, cd.name), h('span', { class: 'cover-ph-note' }, `bez obalu${cd.year ? ` · ${cd.year}` : ''}`));
  const rows = [
    cd.year ? ['ROK', String(cd.year)] : null,
    cd.label ? ['VYDAVATEL', cd.label] : null,
    cd.styles?.length ? ['STYL', h('span', { class: 'chips' }, cd.styles.map((s) => chip(prettyStyle(store.byId.styles.get(s)?.name ?? s), `#/styles/${encodeURIComponent(s)}`, 'style')))] : null,
    cd.added ? ['ZAPSÁNO', czDate(cd.added)] : null,
  ].filter(Boolean);
  const others = (store.cdsByBand.get(cd.bands?.[0]) ?? []).filter((c) => c.id !== cd.id);
  const shelves = store.shelvesOf('cd', cd.id);
  const notes = prose(cd.body);
  return h('article', { class: 'detail cd-detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: '#/cds' }, 'Cédéčka'), ` / ${cd.name}`),
    h('header', { class: 'detail-head' }, cover,
      h('div', { class: 'detail-main' },
        h('p', { class: 'eyebrow' }, ['CD', 'ALBUM', cd.year].filter(Boolean).join(' · ')),
        h('h1', { class: 'detail-title' }, cd.name),
        h('p', { class: 'cd-bands' }, bands.map((b, i) => [i ? ' & ' : '', h('a', { href: `#/bands/${encodeURIComponent(b.id)}` }, b.name, ' →')])),
        rows.length ? h('dl', { class: 'facts' }, rows.flatMap(([k, v]) => [h('dt', null, k), h('dd', null, v)])) : null,
        cd.links?.length ? linkButtons(cd.links) : null)),
    notes ? h('div', null, sectionTitle('Poznámky'), notes) : null,
    others.length ? h('div', null, sectionTitle(`Další od ${bands[0]?.name ?? ''}`), h('div', { class: 'cd-grid' }, others.map((c) => cdCard(store, c)))) : null,
    shelves.length ? h('div', null, sectionTitle('Na poličkách'), h('div', { class: 'chips' }, shelves.map((s) => chip(s.name, `#/shelves/${encodeURIComponent(s.id)}`, 'instrument')))) : null);
}
