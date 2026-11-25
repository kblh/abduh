import { h } from '../ui/dom.js';
import { cdCard, chip, linkButtons, prose, sectionTitle } from '../ui/components.js';
import { prettyStyle } from '../text.js';
import { czDate } from '../labels.js';
import { effectiveTheme } from '../ui/theme.js';

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
  const notes = prose(cd.body, store);
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
    shelves.length ? h('div', null, sectionTitle('Na poličkách'), h('div', { class: 'chips' }, shelves.map((s) => chip(s.name, `#/shelves/${encodeURIComponent(s.id)}`, 'instrument')))) : null,
    cdPlayer(cd));
}

// Bandcamp's embed needs the numeric album id (bandcamp_id), not the album URL.
// Its colors are URL params, so the src follows the app theme (toggle or system setting).
const PLAYER_COLORS = { dark: ['0a0a0a', 'ef4444'], light: ['fafafa', 'dc2626'] };
const playerSrc = (id) => {
  const [bg, link] = PLAYER_COLORS[effectiveTheme()];
  return `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=${bg}/linkcol=${link}/tracklist=true/artwork=small/`;
};

// Spotify's embed takes the album id from the album link; the theme is a URL param too (0 = dark).
const spotifyId = (cd) => {
  for (const l of cd.links ?? []) {
    const m = l.type === 'spotify' && /open\.spotify\.com\/(?:intl-[a-z]+\/)?album\/([A-Za-z0-9]+)/.exec(l.url);
    if (m) return m[1];
  }
  return null;
};
const spotifySrc = (id) => `https://open.spotify.com/embed/album/${id}?theme=${effectiveTheme() === 'dark' ? 0 : 1}`;

// Bandcamp wins when the CD has both; Spotify is the fallback.
function cdPlayer(cd) {
  const hasLink = (cd.links ?? []).some((l) => l.type === 'bandcamp');
  let frame, srcFor;
  if (hasLink && Number.isInteger(cd.bandcamp_id)) {
    srcFor = () => playerSrc(cd.bandcamp_id);
    frame = h('iframe', { class: 'bandcamp-player', src: srcFor(), title: `Bandcamp: ${cd.name}`, loading: 'lazy' });
  } else if (spotifyId(cd)) {
    srcFor = () => spotifySrc(spotifyId(cd));
    frame = h('iframe', { class: 'spotify-player', src: srcFor(), title: `Spotify: ${cd.name}`, loading: 'lazy', allow: 'encrypted-media' });
  } else return null;
  const refresh = () => {
    if (!frame.isConnected) { observer.disconnect(); mq.removeEventListener('change', refresh); return; }
    const src = srcFor();
    if (frame.getAttribute('src') !== src) frame.setAttribute('src', src);
  };
  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', refresh);
  return h('div', null, sectionTitle('Přehrávač'), frame);
}
