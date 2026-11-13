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
