import { h, svg } from '../ui/dom.js';
import { TAB_ICONS } from '../ui/icons.js';
import { bandRow, chip, flagList, initials, placeholderCard, sectionTitle } from '../ui/components.js';
import { recentlyChanged, isNew } from '../store.js';
import { prettyStyle } from '../text.js';
import { bigSearchField } from './search.js';

const TIPS = ['kora', 'cuba', 'rai', 'žena'];

export function render({ store, setQuery, today }) {
  const tiles = [['bands', 'kapel', '#/bands'], ['countries', 'zemí', '#/countries'], ['styles', 'stylů', '#/styles'], ['instruments', 'nástrojů', '#/instruments'], ['cds', 'cédéček', '#/cds'], ['shelves', 'poliček', '#/shelves'], ['tags', 'tagů', '#/tags']];

  const discover = h('div', { class: 'discover' });
  const roll = () => {
    const b = store.sortedBands[Math.floor(Math.random() * store.sortedBands.length)];
    if (!b) { discover.replaceChildren(h('p', { class: 'hand-note' }, 'sbírka je zatím prázdná')); return; }
    const flag = store.byId.countries.get(b.countries?.[0])?.flag;
    discover.replaceChildren(h('a', { class: 'discover-card', href: `#/bands/${encodeURIComponent(b.id)}` },
      b.image ? h('img', { class: 'thumb big round', src: b.image, alt: '' }) : h('span', { class: 'thumb big round' }, placeholderCard(initials(b.name), flag)),
      h('span', { class: 'discover-body' },
        h('span', { class: 'discover-name' }, b.name),
        flagList(store, b.countries ?? []),
        h('span', { class: 'chips' }, (b.styles ?? []).slice(0, 2).map((s) => chip(prettyStyle(store.byId.styles.get(s)?.name ?? s), null, 'style')),
          (b.instruments ?? []).slice(0, 2).map((i) => chip(`${store.byId.instruments.get(i)?.icon ?? ''} ${store.byId.instruments.get(i)?.name ?? i}`.trim(), null, 'instrument'))))));
  };
  roll();

  const fmtDate = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', timeZone: 'UTC' });
  const changedList = (group, nameOf, href) => {
    const items = recentlyChanged(store, group, 5);
    return items.length ? items.map((e) => h('a', { class: 'reg-line', href: `#/${group}/${encodeURIComponent(e.id)}` },
      h('span', null, nameOf(e)), isNew(e, today) ? h('span', { class: 'stamp-new' }, 'NOVÉ') : null, h('i', { class: 'leader' }), h('small', null, fmtDate(e.modified ?? e.added)))) : h('p', { class: 'hand-note' }, 'zatím nic');
  };
  const block = (title, key, body) => h('div', null, sectionTitle(title, 'NOVÉ A UPRAVENÉ', key), body);
  const freshBands = recentlyChanged(store, 'bands', 6);
  return h('section', { class: 'home' },
    bigSearchField('', (v) => setQuery(v)),
    h('p', { class: 'tips' }, 'zkus: ', TIPS.flatMap((t, i) => [i ? ' · ' : '', h('a', { href: `#/search?q=${encodeURIComponent(t)}` }, t)])),
    h('div', { class: 'tiles' }, tiles.map(([key, label, href]) => h('a', { class: key === 'bands' ? 'tile tile-main' : 'tile', href }, h('span', { class: 'tile-n' }, String(store.byId[key].size)), h('span', { class: 'tile-l' }, h('span', { class: 'tile-ic' }, svg(TAB_ICONS[key])), label)))),
    h('div', { class: 'home-cols' },
      block('Kapely', 'bands', freshBands.map((e) => bandRow(store, e, { today }))),
      h('div', null, h('h2', { class: 'section-title' }, h('span', null, 'Náhodný objev'), h('button', { class: 'reroll', type: 'button', onClick: roll }, 'další ↻')), discover)),
    h('div', { class: 'home-trio' },
      block('Styly', 'styles', changedList('styles', (e) => prettyStyle(e.name))),
      block('Nástroje', 'instruments', changedList('instruments', (e) => `${e.icon ?? '♪'} ${e.name}`)),
      block('Tagy', 'tags', changedList('tags', (e) => e.name))));
}
