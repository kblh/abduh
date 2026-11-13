import { h } from '../ui/dom.js';
import { bandRow, chip, flagList, initials, placeholderCard, sectionTitle } from '../ui/components.js';
import { recentlyAdded, isNew } from '../store.js';
import { prettyStyle } from '../text.js';
import { bigSearchField } from './search.js';
import { fmt } from '../labels.js';

const greeting = (d) => { const hr = d.getHours(); return hr < 5 ? 'Dobrou noc.' : hr < 10 ? 'Dobré ráno.' : hr < 18 ? 'Dobrý den.' : 'Dobrý večer.'; };
const TIPS = ['kora', 'cuba', 'rai', 'žena'];

export function render({ store, setQuery, today }) {
  const tiles = [['bands', 'kapel', '#/bands'], ['countries', 'zemí', '#/countries'], ['styles', 'stylů', '#/styles'], ['instruments', 'nástrojů', '#/instruments'], ['cds', 'cédéček', '#/cds'], ['shelves', 'poliček', '#/shelves']];
  const date = today.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' });

  const discover = h('div', { class: 'discover' });
  const roll = () => {
    const b = store.sortedBands[Math.floor(Math.random() * store.sortedBands.length)];
    if (!b) { discover.replaceChildren(h('p', { class: 'hand-note' }, 'sbírka je zatím prázdná')); return; }
    const flag = store.byId.countries.get(b.countries?.[0])?.flag;
    discover.replaceChildren(h('a', { class: 'discover-card', href: `#/bands/${encodeURIComponent(b.id)}` },
      b.image ? h('img', { class: 'thumb big', src: b.image, alt: '' }) : h('span', { class: 'thumb big' }, placeholderCard(initials(b.name), flag)),
      h('span', { class: 'discover-body' },
        h('span', { class: 'discover-name' }, b.name),
        flagList(store, b.countries ?? []),
        h('span', { class: 'chips' }, (b.styles ?? []).slice(0, 2).map((s) => chip(prettyStyle(store.byId.styles.get(s)?.name ?? s), null, 'style')),
          (b.instruments ?? []).slice(0, 2).map((i) => chip(`${store.byId.instruments.get(i)?.icon ?? ''} ${store.byId.instruments.get(i)?.name ?? i}`.trim(), null, 'instrument'))))));
  };
  roll();

  const fresh = recentlyAdded(store, 6);
  return h('section', { class: 'home' },
    h('p', { class: 'hand-note date' }, date),
    h('h1', { class: 'greeting' }, greeting(today)),
    bigSearchField('', (v) => setQuery(v)),
    h('p', { class: 'tips' }, 'zkus: ', TIPS.flatMap((t, i) => [i ? ' · ' : '', h('a', { href: `#/search?q=${encodeURIComponent(t)}` }, t)])),
    h('div', { class: 'tiles' }, tiles.map(([key, label, href]) => h('a', { class: 'tile', href }, h('span', { class: 'tile-n' }, fmt(store.byId[key].size)), h('span', { class: 'tile-l' }, label), h('span', { class: 'tile-go' }, 'procházet →')))),
    h('div', { class: 'home-cols' },
      fresh.length ? h('div', null, sectionTitle('Nově zapsané'), fresh.map((e) => e.bands
        ? h('a', { class: 'band-row cd-line', href: `#/cds/${encodeURIComponent(e.id)}` }, h('span', { class: 'row-body' }, h('span', { class: 'row-name' }, h('span', { class: 'row-title' }, e.name), isNew(e, today) ? h('span', { class: 'stamp-new' }, 'NOVÉ') : null), h('span', { class: 'row-meta' }, `CD · ${e.bands.map((b) => store.byId.bands.get(b)?.name).filter(Boolean).join(' & ')}`)))
        : bandRow(store, e, { today }))) : null,
      h('div', null, h('h2', { class: 'section-title' }, h('span', null, 'Náhodný objev'), h('button', { class: 'reroll', type: 'button', onClick: roll }, 'další ↻')), discover)));
}
