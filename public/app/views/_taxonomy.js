// Shared template for styles and tags: register (list) and detail views.
import { h } from '../ui/dom.js';
import { bandRow, prose, sectionTitle } from '../ui/components.js';
import { normalize, prettyStyle } from '../text.js';
import { buildHash } from '../router.js';
import { plural } from '../labels.js';

export function registerView({ store, params }, o) {
  const q = params.query;
  const items = [...store.byId[o.group].values()].map((s) => ({ id: s.id, name: prettyStyle(s.name), n: o.bandsMap(store).get(s.id)?.length ?? 0 }));
  const byCount = q.sort === 'count';
  const sorted = [...items].sort(byCount ? (a, b) => b.n - a.n || (normalize(a.name) < normalize(b.name) ? -1 : 1) : (a, b) => (normalize(a.name) < normalize(b.name) ? -1 : 1));
  const reg = h('div', { class: 'register' });
  let text = '';
  const paint = () => {
    const list = sorted.filter((s) => normalize(s.name).includes(normalize(text)));
    const groups = new Map();
    for (const s of list) {
      const key = byCount ? '' : (/[a-z]/.test(normalize(s.name)[0]) ? normalize(s.name)[0].toUpperCase() : '#');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(s);
    }
    reg.replaceChildren(...[...groups].map(([letter, ss]) => h('div', { class: 'reg-group' },
      letter ? h('div', { class: 'reg-letter' }, letter) : null,
      ss.map((s) => h('a', { class: 'reg-line', href: `#/${o.route}/${encodeURIComponent(s.id)}` }, h('span', null, s.name), h('i', { class: 'leader' }), h('small', null, s.n))))));
    if (!list.length) reg.append(h('p', { class: 'hand-note' }, 'nic takového tu není'));
  };
  paint();
  return h('section', null,
    h('h1', { class: 'page-title' }, `${o.title} `, h('span', { class: 'count' }, items.length), h('em', { class: 'hand-note' }, o.note)),
    h('label', { class: 'search-field list-search' }, h('input', { type: 'search', placeholder: o.placeholder, 'aria-label': o.placeholder.replace('…', ''), autocomplete: 'off', onInput: (e) => { text = e.target.value; paint(); } })),
    h('p', { class: 'filters' }, h('span', { class: 'sort' }, 'ŘADIT ', h('a', { href: buildHash(o.route), 'aria-current': byCount ? null : 'true' }, 'A–Z'), h('a', { href: buildHash(o.route, { query: { sort: 'count' } }), 'aria-current': byCount ? 'true' : null }, 'počet kapel'))),
    reg);
}

export function detailView({ store, params, today }, o) {
  const entity = store.byId[o.group].get(params.id);
  const bands = o.bandsMap(store).get(entity.id) ?? [];
  const byCountry = new Map();
  for (const b of bands) for (const c of b.countries ?? []) byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
  const countries = [...byCountry].sort((a, b) => b[1] - a[1]);
  const enc = encodeURIComponent;
  let country = '', photo = false;
  const list = h('div');
  const paint = () => {
    const shown = bands.filter((b) => (!country || b.countries?.includes(country)) && (!photo || b.image));
    list.replaceChildren(...shown.slice(0, 8).map((b) => bandRow(store, b, { today })),
      h('p', { class: 'result-note' }, `${Math.min(8, shown.length)} z ${shown.length} · `, h('a', { href: `#/bands?${o.filterKey}=${enc(entity.id)}${country ? `&country=${enc(country)}` : ''}${photo ? '&photo=1' : ''}` }, 'všechny v seznamu kapel →')));
  };
  paint();
  const body = prose(entity.body);
  return h('article', { class: 'detail' },
    h('p', { class: 'breadcrumb' }, h('a', { href: `#/${o.route}` }, o.listLabel), ` / ${prettyStyle(entity.name)}`),
    h('header', { class: 'style-head' }, h('span', { class: `chip chip-${o.kind} chip-big` }, prettyStyle(entity.name)), h('span', { class: 'count-big' }, plural(bands.length, 'kapela', 'kapely', 'kapel'))),
    body || countries.length ? h('div', { class: 'two-col' },
      h('div', null, body ? [sectionTitle(o.aboutTitle), body] : null),
      countries.length ? h('aside', null, sectionTitle('Podle zemí'), h('ul', { class: 'plain-list' }, countries.slice(0, 8).map(([id, n]) => {
        const c = store.byId.countries.get(id);
        return h('li', null, h('a', { href: `#/bands?${o.filterKey}=${enc(entity.id)}&country=${enc(id)}` }, `${c?.flag ?? ''} ${c?.name ?? id}`.trim()), h('small', null, n));
      }))) : null) : null,
    sectionTitle('Kapely'),
    h('div', { class: 'filters' },
      h('select', { class: 'filter-select', 'aria-label': 'Země', onChange: (e) => { country = e.target.value; paint(); } }, h('option', { value: '' }, 'ZEMĚ ▾'), countries.map(([id, n]) => h('option', { value: id }, `${store.byId.countries.get(id)?.name ?? id} (${n})`))),
      h('label', { class: 'filter-check' }, h('input', { type: 'checkbox', onChange: (e) => { photo = e.target.checked; paint(); } }), ' S FOTKOU')),
    list);
}
