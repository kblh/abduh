import { icon } from './icons.js';
import { h } from './dom.js';
import { prettyStyle } from '../text.js';
import { isNew } from '../store.js';

const LINK_LABELS = { spotify: 'SPOTIFY', bandcamp: 'BANDCAMP', 'apple-music': 'APPLE MUSIC', youtube: 'YOUTUBE', website: 'WEB', wikipedia: 'WIKIPEDIE', discogs: 'DISCOGS', other: 'ODKAZ' };

export const initials = (name) =>
  String(name ?? '').split(/\s+/).filter((w) => /^[\p{L}\p{N}]/u.test(w)).slice(0, 2).map((w) => [...w][0].toUpperCase()).join('') || '?';

export function placeholderCard(text, flag) {
  return h('span', { class: 'ph', 'aria-hidden': 'true' }, h('span', { class: 'ph-text' }, text), flag ? h('span', { class: 'ph-flag' }, flag) : null);
}

export function flagList(store, countryIds = [], max = 3) {
  const flags = countryIds.map((c) => store.byId.countries.get(c)?.flag).filter(Boolean);
  return h('span', { class: 'flags', title: countryIds.map((c) => store.byId.countries.get(c)?.name ?? c).join(', ') },
    flags.slice(0, max).join(' '), flags.length > max ? h('span', { class: 'more' }, ` +${flags.length - max}`) : null);
}

export function chip(label, href, kind = 'tag') {
  return h(href ? 'a' : 'span', { class: `chip chip-${kind}`, href }, label);
}

export function stampLink(label, url) {
  return h('a', { class: 'stamp-link', href: url, target: '_blank', rel: 'noopener noreferrer' }, `${label} ↗`);
}

export const linkButtons = (links = []) =>
  h('div', { class: 'stamp-links' }, links.map((l) => stampLink(LINK_LABELS[l.type] ?? 'ODKAZ', l.url)));

export function sectionTitle(text, count, iconKey) {
  return h('h2', { class: 'section-title' }, h('span', null, iconKey ? icon(iconKey) : null, text), count != null ? h('small', null, count) : null);
}

export function emptyState(title, text, cta) {
  return h('div', { class: 'empty-state' },
    h('span', { class: 'empty-art', 'aria-hidden': 'true' }, '✎'),
    h('p', { class: 'empty-title' }, title),
    text ? h('p', { class: 'empty-text' }, text) : null,
    cta ? h('a', { class: 'stamp-link', href: cta.href }, cta.label) : null);
}

export function bandRow(store, band, { today = new Date(), showNew = true } = {}) {
  const flag = store.byId.countries.get(band.countries?.[0])?.flag;
  const thumb = band.image
    ? h('img', { class: 'thumb round', src: band.image, alt: '', loading: 'lazy', width: 50, height: 50 })
    : h('span', { class: 'thumb thumb-ph round' }, placeholderCard(initials(band.name), flag));
  const styles = (band.styles ?? []).map((s) => prettyStyle(store.byId.styles.get(s)?.name ?? s));
  const instruments = (band.instruments ?? []).map((i) => {
    const ins = store.byId.instruments.get(i);
    return ins?.name ?? i;
  });
  return h('a', { class: 'band-row', href: `#/bands/${encodeURIComponent(band.id)}` },
    thumb,
    h('span', { class: 'row-body' },
      h('span', { class: 'row-name' },
        h('span', { class: 'row-title' }, band.name),
        (band.tags ?? []).includes('woman') ? h('span', { class: 'label-black' }, 'ŽENA') : null,
        showNew && isNew(band, today) ? h('span', { class: 'stamp-new' }, 'NOVÉ') : null),
      h('span', { class: 'row-meta' }, flagList(store, band.countries ?? []), ' ', [...styles, ...instruments].join(' · '))));
}

export function cdCard(store, cd) {
  const names = (cd.bands ?? []).map((b) => store.byId.bands.get(b)?.name).filter(Boolean).join(' & ');
  const cover = cd.image
    ? h('img', { class: 'cover', src: cd.image, alt: '', loading: 'lazy' })
    : h('span', { class: 'cover cover-ph' }, h('span', { class: 'cover-ph-title' }, cd.name), h('span', { class: 'cover-ph-note' }, `bez obalu${cd.year ? ` · ${cd.year}` : ''}`));
  return h('a', { class: 'cd-card', href: `#/cds/${encodeURIComponent(cd.id)}` },
    cover, h('span', { class: 'cd-title' }, cd.name), h('span', { class: 'cd-meta' }, [names, cd.year].filter(Boolean).join(' · ')));
}

export function prose(body) {
  const paras = String(body ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paras.length ? h('div', { class: 'prose' }, paras.map((p) => h('p', null, p))) : null;
}

export function countryLinks(store, ids = []) {
  return h('span', { class: 'country-links' }, ids.map((id) => {
    const c = store.byId.countries.get(id);
    return h('a', { href: `#/countries/${encodeURIComponent(id)}` }, c?.flag ? `${c.flag} ` : '', c?.name ?? id);
  }));
}
