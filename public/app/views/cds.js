import { h } from '../ui/dom.js';
import { cdCard, emptyState } from '../ui/components.js';
import { buildHash } from '../router.js';
import { normalize } from '../text.js';

export function render({ store, params }) {
  const q = params.query;
  const href = (patch) => buildHash('cds', { query: { ...q, ...patch } });
  const all = [...store.byId.cds.values()];
  const title = h('h1', { class: 'page-title' }, 'Cédéčka ', h('span', { class: 'count' }, all.length), all.length ? h('em', { class: 'hand-note' }, 'sbírka teprve roste') : null);
  if (!all.length) return h('section', null, title, emptyState('Zatím tu není žádné cédéčko.', 'Až nějaké zapíšu do sbírky, objeví se tady – s obalem, nebo jako kartička s názvem.', { label: 'PROJÍT KAPELY →', href: '#/bands' }));

  let list = all.filter((c) => (!q.kapela || c.bands?.includes(q.kapela)) && (!q.rok || String(c.year) === q.rok) && (q.cover !== '1' || c.image));
  const cmp = { az: (a, b) => normalize(a.name) < normalize(b.name) ? -1 : 1, rok: (a, b) => (a.year ?? 0) - (b.year ?? 0), new: (a, b) => (b.added ?? '').localeCompare(a.added ?? '') || (normalize(a.name) < normalize(b.name) ? -1 : 1) };
  list = [...list].sort(cmp[q.sort] ?? cmp.new);

  const bandIds = [...new Set(all.flatMap((c) => c.bands ?? []))];
  const years = [...new Set(all.map((c) => c.year).filter(Boolean))].sort();
  const sel = (key, label, opts) => h('select', { class: 'filter-select', 'aria-label': label, onChange: (e) => { location.hash = href({ [key]: e.target.value }); } },
    h('option', { value: '' }, `${label} ▾`), opts.map(([v, t]) => h('option', { value: v, selected: q[key] === v }, t)));
  return h('section', null, title,
    h('div', { class: 'filters' },
      sel('kapela', 'KAPELA', bandIds.map((id) => [id, store.byId.bands.get(id)?.name ?? id])),
      sel('rok', 'ROK', years.map((y) => [String(y), String(y)])),
      h('label', { class: 'filter-check' }, h('input', { type: 'checkbox', checked: q.cover === '1', onChange: (e) => { location.hash = href({ cover: e.target.checked ? '1' : '' }); } }), ' S OBALEM'),
      h('span', { class: 'sort' }, 'ŘADIT ', [['az', 'A–Z'], ['new', 'nově zapsané'], ['rok', 'rok']].map(([k, l]) => h('a', { href: href({ sort: k }), 'aria-current': (q.sort ?? 'new') === k ? 'true' : null }, l)))),
    list.length ? h('div', { class: 'cd-grid' }, list.map((c) => cdCard(store, c))) : h('p', { class: 'hand-note' }, 'nic takového tu není'));
}
