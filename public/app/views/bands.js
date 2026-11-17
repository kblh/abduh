import { icon } from '../ui/icons.js';
import { h } from '../ui/dom.js';
import { virtualList } from '../ui/virtual-list.js';
import { bandRow } from '../ui/components.js';
import { filterBands, letterInfo, letterOf } from '../filters.js';
import { normalize, prettyStyle } from '../text.js';
import { buildHash } from '../router.js';
import { fmt } from '../labels.js';

export function render({ store, params, today }) {
  const q = params.query;
  const href = (patch) => buildHash('bands', { query: { ...q, ...patch } });
  const all = filterBands(store, q);
  let text = '';
  const current = () => (text ? all.filter((b) => normalize(b.name).includes(normalize(text))) : all);

  const select = (key, label, map, nameOf) => {
    const entries = [...map.entries()].map(([id, bands]) => [id, nameOf(id), bands.length]).sort((a, b) => normalize(a[1]) < normalize(b[1]) ? -1 : 1);
    return h('select', { class: 'filter-select', 'aria-label': label, onChange: (e) => { location.hash = href({ [key]: e.target.value }); } },
      h('option', { value: '' }, `${label} ▾`),
      entries.map(([id, name, n]) => h('option', { value: id, selected: q[key] === id }, `${name} (${n})`)));
  };
  const active = (key, label) => q[key] ? h('a', { class: 'filter-on', href: href({ [key]: '' }), 'aria-label': `Zrušit filtr ${label}` }, `${label}: ${store.byId[{ country: 'countries', style: 'styles', instrument: 'instruments', tag: 'tags' }[key]].get(q[key])?.name ?? q[key]} ×`) : null;

  const count = h('span', { class: 'count' });
  const letters = h('div', { class: 'letter-bar', role: 'navigation', 'aria-label': 'Abecední rejstřík' });
  let list;

  let cur = all;
  let info = letterInfo(all);

  function letterRow(b, i) {
    const row = h('div', { class: 'vrow' }, bandRow(store, b, { today }));
    if (q.sort !== 'new' && info.starts.has(i)) {
      const l = letterOf(b.name);
      row.append(h('span', { class: 'letter-mark' }, l, h('small', null, info.count.get(l))));
    }
    return row;
  }

  function refreshMeta() {
    cur = current();
    info = letterInfo(cur);
    count.textContent = `${fmt(cur.length)} z ${fmt(store.sortedBands.length)}`;
    letters.replaceChildren(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => info.first.has(l)
      ? h('button', { type: 'button', class: 'letter', onClick: () => list.scrollToIndex(info.first.get(l)) }, l)
      : h('span', { class: 'letter off' }, l)));
    letters.hidden = q.sort === 'new';
    return cur;
  }

  list = virtualList({ items: all, rowHeight: 66, renderRow: letterRow });
  refreshMeta();
  const search = h('label', { class: 'search-field list-search' }, h('input', { type: 'search', placeholder: 'hledat v kapelách…', 'aria-label': 'Hledat v kapelách', autocomplete: 'off',
    onInput: (e) => { text = e.target.value; list.update(refreshMeta()); } }));

  return h('section', { class: 'list-view' },
    h('h1', { class: 'page-title' }, icon('bands'), 'Kapely ', count, q.country ? h('em', { class: 'hand-note' }, `jen ${store.byId.countries.get(q.country)?.name ?? q.country}`) : null),
    search,
    h('div', { class: 'filters' },
      active('country', 'ZEMĚ'), active('style', 'STYL'), active('instrument', 'NÁSTROJ'), active('tag', 'TAG'),
      !q.country ? select('country', 'ZEMĚ', store.bandsByCountry, (id) => store.byId.countries.get(id)?.name ?? id) : null,
      !q.style ? select('style', 'STYL', store.bandsByStyle, (id) => prettyStyle(store.byId.styles.get(id)?.name ?? id)) : null,
      !q.instrument ? select('instrument', 'NÁSTROJ', store.bandsByInstrument, (id) => store.byId.instruments.get(id)?.name ?? id) : null,
      h('label', { class: 'filter-check' }, h('input', { type: 'checkbox', checked: q.photo === '1', onChange: (e) => { location.hash = href({ photo: e.target.checked ? '1' : '' }); } }), ' JEN S FOTKOU'),
      h('span', { class: 'sort' }, 'ŘADIT ', h('a', { href: href({ sort: '' }), 'aria-current': q.sort === 'new' ? null : 'true' }, 'A–Z'), h('a', { href: href({ sort: 'new' }), 'aria-current': q.sort === 'new' ? 'true' : null }, 'nově zapsané'))),
    letters, list);
}
