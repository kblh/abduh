import { normalize } from './text.js';

const GROUPS = ['bands', 'cds', 'styles', 'instruments', 'countries', 'shelves'];
const TAG_ALIASES = { woman: ['woman', 'zena'] };

export function buildIndex(store) {
  const { byId } = store;
  const index = {};
  for (const g of GROUPS) {
    index[g] = [...byId[g].values()].map((e) => {
      const via = [];
      if (g === 'bands') {
        for (const c of e.countries ?? []) via.push({ reason: 'country', norm: normalize(byId.countries.get(c)?.name) });
        for (const s of e.styles ?? []) via.push({ reason: 'style', norm: normalize(byId.styles.get(s)?.name) });
        for (const i of e.instruments ?? []) via.push({ reason: 'instrument', norm: normalize(byId.instruments.get(i)?.name) });
        for (const t of e.tags ?? []) for (const a of [normalize(byId.tags.get(t)?.name ?? t), ...(TAG_ALIASES[t] ?? [])]) via.push({ reason: 'tag', norm: a });
      }
      return { id: e.id, norm: normalize(e.name), via: via.filter((v) => v.norm) };
    });
  }
  return index;
}

function nameRank(norm, nq, words) {
  if (norm.startsWith(nq)) return 0;
  if (words.every((w) => norm.startsWith(w) || norm.includes(` ${w}`))) return 1;
  return 2;
}

function match(entry, nq, words) {
  let reason = 'name';
  let viaOnly = false;
  for (const w of words) {
    if (entry.norm.includes(w)) continue;
    const v = entry.via.find((x) => x.norm.includes(w));
    if (!v) return null;
    if (!viaOnly) reason = v.reason;
    viaOnly = true;
  }
  return { id: entry.id, reason, rank: viaOnly ? 3 : nameRank(entry.norm, nq, words), norm: entry.norm };
}

export function search(index, query) {
  const nq = normalize(query);
  const groups = Object.fromEntries(GROUPS.map((g) => [g, []]));
  if (!nq) return { total: 0, groups };
  const words = nq.split(' ');
  let total = 0;
  for (const g of GROUPS) {
    groups[g] = index[g]
      .map((e) => match(e, nq, words))
      .filter(Boolean)
      .sort((a, b) => a.rank - b.rank || (a.norm < b.norm ? -1 : a.norm > b.norm ? 1 : 0))
      .map(({ id, reason }) => ({ id, reason }));
    total += groups[g].length;
  }
  return { total, groups };
}
