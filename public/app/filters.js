import { normalize } from './text.js';

const nameCmp = (a, b) => {
  const x = normalize(a.name), y = normalize(b.name);
  return x < y ? -1 : x > y ? 1 : 0;
};

export function filterBands(store, q = {}) {
  let list = store.sortedBands;
  if (q.country) list = list.filter((b) => (b.countries ?? []).includes(q.country));
  if (q.style) list = list.filter((b) => (b.styles ?? []).includes(q.style));
  if (q.instrument) list = list.filter((b) => (b.instruments ?? []).includes(q.instrument));
  if (q.photo === '1') list = list.filter((b) => b.image);
  if (q.sort === 'new') {
    list = [...list].sort((a, b) => {
      if (a.added && b.added) return a.added < b.added ? 1 : a.added > b.added ? -1 : nameCmp(a, b);
      if (a.added) return -1;
      if (b.added) return 1;
      return nameCmp(a, b);
    });
  }
  return list;
}

export const letterOf = (name) => {
  const c = normalize(name)[0] ?? '#';
  return /[a-z]/.test(c) ? c.toUpperCase() : '#';
};

export function letterInfo(list) {
  const first = new Map(), count = new Map(), starts = new Set();
  list.forEach((b, i) => {
    const l = letterOf(b.name);
    if (!first.has(l)) { first.set(l, i); starts.add(i); }
    count.set(l, (count.get(l) ?? 0) + 1);
  });
  return { first, count, starts };
}

export function shelfCovers(store, shelf, limit = 4) {
  const items = [
    ...(shelf.bands ?? []).map((id) => store.byId.bands.get(id)),
    ...(shelf.cds ?? []).map((id) => store.byId.cds.get(id)),
  ];
  return items.filter((e) => e?.image).slice(0, limit).map((e) => e.image);
}
