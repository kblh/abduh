import { normalize } from './text.js';

export async function loadData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const GROUPS = ['bands', 'cds', 'styles', 'instruments', 'countries', 'shelves', 'tags'];
const byName = (a, b) => {
  const x = normalize(a.name), y = normalize(b.name);
  return x < y ? -1 : x > y ? 1 : 0;
};

function groupBy(items, key) {
  const map = new Map();
  for (const item of items) {
    for (const k of item[key] ?? []) {
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(item);
    }
  }
  return map;
}

export function buildStore(data) {
  const byId = {};
  for (const g of GROUPS) byId[g] = new Map((data[g] ?? []).map((e) => [e.id, e]));
  const sortedBands = [...(data.bands ?? [])].sort(byName);
  const cdsByBand = groupBy([...(data.cds ?? [])].sort(byName), 'bands');
  const shelves = data.shelves ?? [];
  const shelvesOf = (type, id) => {
    const key = type === 'band' ? 'bands' : 'cds';
    return shelves.filter((s) => (s[key] ?? []).includes(id));
  };
  return {
    data,
    byId,
    sortedBands,
    bandsByCountry: groupBy(sortedBands, 'countries'),
    bandsByStyle: groupBy(sortedBands, 'styles'),
    bandsByInstrument: groupBy(sortedBands, 'instruments'),
    bandsByTag: groupBy(sortedBands, 'tags'),
    cdsByBand,
    shelvesOf,
    continentOf: (countryId) => byId.countries.get(countryId)?.continent ?? '',
  };
}

export function isNew(entity, today, days = 30) {
  if (!entity?.added) return false;
  const added = Date.parse(`${entity.added}T00:00:00Z`);
  if (Number.isNaN(added)) return false;
  const t = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.floor((t - added) / 864e5) <= days;
}

export function recentlyAdded(store, n) {
  return [...(store.data.bands ?? []), ...(store.data.cds ?? [])]
    .filter((e) => e.added)
    .sort((a, b) => (a.added < b.added ? 1 : a.added > b.added ? -1 : byName(a, b)))
    .slice(0, n);
}

// newest first by last change (modified, else added); only entities with a known date
export function recentlyChanged(store, group, n) {
  const when = (e) => e.modified ?? e.added;
  return [...(store.data[group] ?? [])]
    .filter(when)
    .sort((a, b) => (when(a) < when(b) ? 1 : when(a) > when(b) ? -1 : (a.rank ?? 99) - (b.rank ?? 99) || byName(a, b)))
    .slice(0, n);
}
