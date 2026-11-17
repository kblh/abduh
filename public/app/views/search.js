import { h, svg } from '../ui/dom.js';
import { bandRow, cdCard, flagList, sectionTitle } from '../ui/components.js';
import { search } from '../search.js';
import { prettyStyle } from '../text.js';
import { fmt } from '../labels.js';

const TABS = [['all', 'Vše'], ['bands', 'Kapely'], ['cds', 'CD'], ['instruments', 'Nástroje'], ['styles', 'Styly'], ['countries', 'Země'], ['shelves', 'Poličky'], ['tags', 'Tagy']];
const REASON = { name: 've jménu', country: 'podle země', style: 'podle stylu', instrument: 'podle nástroje', tag: 'podle štítku' };
const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';
const LIMIT = 40;

export function bigSearchField(value, onInput, { autofocus = false } = {}) {
  const input = h('input', { type: 'search', value, placeholder: 'kapela, země, styl, nástroj…', 'aria-label': 'Hledat', autocomplete: 'off', onInput: (e) => onInput(e.target.value) });
  if (autofocus) queueMicrotask(() => input.focus());
  return h('label', { class: 'search-field big-search' }, svg(ICON), input);
}

export function render({ store, index, params, setQuery }) {
  let q = params.query.q ?? '';
  let tab = 'all';
  let expanded = false;
  const count = h('span', { class: 'result-count', 'aria-live': 'polite' });
  const tabs = h('div', { class: 'tabs', role: 'tablist' });
  const results = h('div', { class: 'results' });

  const link = (href, ...kids) => h('a', { class: 'result-line', href }, ...kids);
  const sections = {
    bands: (hits, ctx) => {
      const by = {};
      for (const x of hits) by[x.reason] = (by[x.reason] ?? 0) + 1;
      const note = Object.entries(by).map(([r, n]) => `${n} ${n === 1 ? 'shoda' : n < 5 ? 'shody' : 'shod'} ${REASON[r]}`).join(', ');
      const shown = expanded || tab === 'bands' ? hits : hits.slice(0, LIMIT);
      return h('section', null, sectionTitle('Kapely', hits.length),
        shown.map((x) => bandRow(store, store.byId.bands.get(x.id), { today: ctx.today })),
        h('p', { class: 'result-note' }, note),
        shown.length < hits.length ? h('button', { class: 'stamp', type: 'button', onClick: () => { expanded = true; paint(); } }, `ZOBRAZIT VŠECH ${hits.length}`) : null);
    },
    cds: (hits) => h('section', null, sectionTitle('CD', hits.length), h('div', { class: 'cd-grid' }, hits.map((x) => cdCard(store, store.byId.cds.get(x.id))))),
    instruments: (hits) => h('section', null, sectionTitle('Nástroje', hits.length), hits.map((x) => {
      const i = store.byId.instruments.get(x.id);
      return link(`#/instruments/${encodeURIComponent(i.id)}`, h('span', null, i.name), h('small', null, store.bandsByInstrument.get(i.id)?.length ?? 0));
    })),
    styles: (hits) => h('section', null, sectionTitle('Styly', hits.length), hits.map((x) => {
      const s = store.byId.styles.get(x.id);
      return link(`#/styles/${encodeURIComponent(s.id)}`, h('span', null, prettyStyle(s.name)), h('small', null, store.bandsByStyle.get(s.id)?.length ?? 0));
    })),
    countries: (hits) => h('section', null, sectionTitle('Země', hits.length), hits.map((x) => {
      const c = store.byId.countries.get(x.id);
      return link(`#/countries/${encodeURIComponent(c.id)}`, h('span', null, `${c.flag ?? ''} ${c.name}`.trim()), h('small', null, store.bandsByCountry.get(c.id)?.length ?? 0));
    })),
    tags: (hits) => h('section', null, sectionTitle('Tagy', hits.length), hits.map((x) => {
      const t = store.byId.tags.get(x.id);
      return link(`#/tags/${encodeURIComponent(t.id)}`, h('span', null, t.name), h('small', null, store.bandsByTag.get(t.id)?.length ?? 0));
    })),
    shelves: (hits) => h('section', null, sectionTitle('Poličky', hits.length), hits.map((x) => {
      const s = store.byId.shelves.get(x.id);
      return link(`#/shelves/${encodeURIComponent(s.id)}`, h('span', null, s.name), h('small', null, (s.bands?.length ?? 0) + (s.cds?.length ?? 0)));
    })),
  };

  function paint() {
    const r = search(index, q);
    const counts = { all: r.total, ...Object.fromEntries(Object.entries(r.groups).map(([k, v]) => [k, v.length])) };
    count.textContent = q.trim() ? `${fmt(r.total)} výsledků` : '';
    tabs.replaceChildren(...TABS.map(([key, label]) => h('button', { type: 'button', role: 'tab', class: 'tab', 'aria-selected': tab === key ? 'true' : 'false', onClick: () => { tab = key; paint(); } }, `${label} ${counts[key]}`)));
    tabs.hidden = !q.trim();
    results.replaceChildren();
    if (!q.trim()) return;
    if (r.total === 0) {
      results.append(h('p', { class: 'hand-note' }, 'nic — zkus „griot“ nebo „Mali“'));
      return;
    }
    const ctx = { today: new Date() };
    for (const key of ['bands', 'cds', 'instruments', 'styles', 'countries', 'shelves', 'tags']) {
      if ((tab === 'all' || tab === key) && r.groups[key].length) results.append(sections[key](r.groups[key], ctx));
    }
  }

  const field = bigSearchField(q, (v) => { q = v; expanded = false; setQuery(v, { rerender: false }); paint(); }, { autofocus: !q });
  field.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); results.querySelector('a')?.focus(); }
  });
  results.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = [...results.querySelectorAll('a')];
    const i = links.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === 'ArrowUp' && i === 0) field.querySelector('input').focus();
    else links[Math.max(0, Math.min(links.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))].focus();
  });
  paint();
  return h('section', { class: 'search-view' }, h('div', { class: 'search-head' }, field, count), tabs, results);
}
