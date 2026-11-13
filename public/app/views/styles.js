import { h, svg } from '../ui/dom.js';
import { normalize, prettyStyle } from '../text.js';
import { buildHash } from '../router.js';
import { fmt } from '../labels.js';

export function render({ store, params }) {
  const q = params.query;
  const items = [...store.byId.styles.values()].map((s) => ({ id: s.id, name: prettyStyle(s.name), n: store.bandsByStyle.get(s.id)?.length ?? 0 }));
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
      ss.map((s) => h('a', { class: 'reg-line', href: `#/styles/${encodeURIComponent(s.id)}` }, h('span', null, s.name), h('i', { class: 'leader' }), h('small', null, s.n))))));
    if (!list.length) reg.append(h('p', { class: 'hand-note' }, 'nic takového tu není'));
  };
  paint();
  return h('section', null,
    h('h1', { class: 'page-title' }, 'Styly ', h('span', { class: 'count' }, items.length), h('em', { class: 'hand-note' }, 'rejstřík jako na konci knihy')),
    h('label', { class: 'search-field list-search' }, h('input', { type: 'search', placeholder: 'najít styl…', 'aria-label': 'Najít styl', autocomplete: 'off', onInput: (e) => { text = e.target.value; paint(); } })),
    h('p', { class: 'filters' }, h('span', { class: 'sort' }, 'ŘADIT ', h('a', { href: buildHash('styles'), 'aria-current': byCount ? null : 'true' }, 'A–Z'), h('a', { href: buildHash('styles', { query: { sort: 'count' } }), 'aria-current': byCount ? 'true' : null }, 'počet kapel'))),
    reg);
}
