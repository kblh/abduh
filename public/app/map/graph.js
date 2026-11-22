import { normalize, prettyStyle } from '../text.js';
import { buildHash } from '../router.js';

export const DEFAULT_LIMITS = { total: 80, l1: 12, l2: 3, l3: 2, countryL1: 3, countryOnlyL1: 8 };

const STRENGTH = { member: 0, style: 1, instrument: 2, tag: 3, country: 4 };
const GROUP = { style: 'styles', instrument: 'instruments', tag: 'tags', country: 'countries', band: 'bands' };
const nameCmp = (a, b) => { const x = normalize(a.name), y = normalize(b.name); return x < y ? -1 : x > y ? 1 : 0; };
const enc = encodeURIComponent;
const hrefOf = (kind, id) => `#/${GROUP[kind]}/${enc(id)}`;

function entityName(store, kind, id) {
  const e = store.byId[GROUP[kind]].get(id);
  if (kind === 'style') return prettyStyle(e?.name ?? id);
  if (kind === 'tag' && id === 'woman') return 'žena';
  return e?.name ?? id;
}

export function buildMap(store, { kind, id }, limits = DEFAULT_LIMITS) {
  const centre = store.byId[GROUP[kind]]?.get(id);
  if (!centre) return { nodes: [], edges: [] };

  const reverseMembers = new Map();
  for (const b of store.data.bands ?? []) {
    for (const m of b.members ?? []) {
      if (m && typeof m === 'object' && store.byId.bands.has(m.id)) {
        if (!reverseMembers.has(m.id)) reverseMembers.set(m.id, []);
        reverseMembers.get(m.id).push(b.id);
      }
    }
  }
  const bandOf = (bid) => store.byId.bands.get(bid);

  // all relations of a band: { rel, relId, others: [bandId] }
  const relationsOf = (band) => {
    const out = [];
    const mem = new Set();
    for (const m of band.members ?? []) if (m && typeof m === 'object' && store.byId.bands.has(m.id)) mem.add(m.id);
    for (const r of reverseMembers.get(band.id) ?? []) mem.add(r);
    mem.delete(band.id);
    if (mem.size) out.push({ rel: 'member', relId: null, others: [...mem] });
    for (const [rel, field, index] of [['style', 'styles', store.bandsByStyle], ['instrument', 'instruments', store.bandsByInstrument], ['tag', 'tags', store.bandsByTag], ['country', 'countries', store.bandsByCountry]]) {
      for (const rid of band[field] ?? []) out.push({ rel, relId: rid, others: (index.get(rid) ?? []).map((b) => b.id).filter((x) => x !== band.id) });
    }
    return out;
  };

  const richness = (b) => relationsOf(b).length;
  const bandNode = (b, level, parent) => ({
    key: `band:${b.id}`, kind: 'band', id: b.id, label: b.name, level, parent,
    ...(b.image ? { image: b.image } : {}), ...(store.byId.countries.get(b.countries?.[0])?.flag ? { flag: store.byId.countries.get(b.countries[0]).flag } : {}),
    href: hrefOf('band', b.id),
  });
  const edgeLabel = (rel, relId) => (rel === 'member' ? 'člen' : entityName(store, rel, relId));
  const edgeHref = (rel, relId) => (rel === 'member' || relId == null ? null : hrefOf(rel, relId));

  const nodes = [];
  const edges = [];
  const used = new Set();
  const centreKey = `${kind}:${id}`;
  nodes.push(kind === 'band' ? bandNode(centre, 0, null)
    : { key: centreKey, kind, id, label: entityName(store, kind, id), level: 0, parent: null, ...(centre.image ? { image: centre.image } : {}), href: hrefOf(kind, id) });
  used.add(centreKey);

  // candidates of a band node (excluding used nodes and an optional relation)
  const candidatesOf = (band, exclude) => {
    const best = new Map();
    for (const r of relationsOf(band)) {
      if (exclude && r.rel === exclude.rel && r.relId === exclude.relId) continue;
      for (const o of r.others) {
        if (used.has(`band:${o}`)) continue;
        const c = best.get(o) ?? { id: o, count: 0, rel: r.rel, relId: r.relId };
        c.count++;
        if (STRENGTH[r.rel] < STRENGTH[c.rel]) { c.rel = r.rel; c.relId = r.relId; }
        best.set(o, c);
      }
    }
    return [...best.values()].map((c) => ({ ...c, band: bandOf(c.id) })).filter((c) => c.band)
      .sort((a, b) => STRENGTH[a.rel] === 4 && STRENGTH[b.rel] !== 4 ? 1 : STRENGTH[b.rel] === 4 && STRENGTH[a.rel] !== 4 ? -1
        : b.count - a.count || (b.band.image ? 1 : 0) - (a.band.image ? 1 : 0) || nameCmp(a.band, b.band));
  };

  const add = (parent, c, level) => {
    if (nodes.length >= limits.total) return false;
    const n = bandNode(c.band, level, parent.key);
    nodes.push(n);
    used.add(n.key);
    edges.push({ from: parent.key, to: n.key, rel: c.rel, relId: c.relId, label: edgeLabel(c.rel, c.relId), href: edgeHref(c.rel, c.relId) });
    return true;
  };

  // level 1
  let l1;
  if (kind === 'band') {
    const cands = candidatesOf(centre, null);
    const strong = cands.filter((c) => c.rel !== 'country');
    const countryCap = strong.length ? limits.countryL1 : limits.countryOnlyL1;
    const countryC = cands.filter((c) => c.rel === 'country').slice(0, countryCap);
    l1 = [...strong.slice(0, limits.l1), ...countryC].slice(0, Math.max(limits.l1, strong.length ? 0 : limits.countryOnlyL1));
    const shown = new Set(l1.map((c) => c.id));
    const left = cands.filter((c) => !shown.has(c.id));
    const groups = new Map();
    for (const c of left) { const k = `${c.rel}|${c.relId}`; groups.set(k, [...(groups.get(k) ?? []), c]); }
    const top = [...groups.entries()].filter(([, g]) => g[0].rel !== 'member').sort((a, b) => STRENGTH[a[1][0].rel] - STRENGTH[b[1][0].rel] || b[1].length - a[1].length)[0];
    if (top) {
      const { rel, relId } = top[1][0];
      const index = { style: store.bandsByStyle, instrument: store.bandsByInstrument, tag: store.bandsByTag, country: store.bandsByCountry }[rel];
      const n = (index.get(relId) ?? []).filter((b) => b.id !== id && !shown.has(b.id)).length;
      l1.more = n > 0 ? { rel, relId, n } : null;
    } else l1.more = null;
  } else {
    const index = { style: store.bandsByStyle, instrument: store.bandsByInstrument, tag: store.bandsByTag }[kind];
    const cands = (index.get(id) ?? []).map((b) => ({ id: b.id, band: b, count: richness(b), rel: kind, relId: id }))
      .sort((a, b) => b.count - a.count || (b.band.image ? 1 : 0) - (a.band.image ? 1 : 0) || nameCmp(a.band, b.band));
    l1 = cands.slice(0, limits.l1);
    const left = cands.length - l1.length;
    l1.more = left > 0 ? { rel: kind, relId: id, n: left } : null;
  }
  const centreNode = nodes[0];
  const level1 = [];
  for (const c of l1) if (add(centreNode, c, 1)) level1.push(nodes.at(-1));
  if (l1.more && nodes.length < limits.total) {
    const m = l1.more;
    const key = `more:${centreKey}:${m.rel}:${m.relId}`;
    nodes.push({ key, kind: 'more', label: `+${m.n} dalších`, level: 1, parent: centreKey, href: `#/bands?${m.rel}=${enc(m.relId)}` });
    edges.push({ from: centreKey, to: key, rel: m.rel, relId: m.relId, label: edgeLabel(m.rel, m.relId), href: edgeHref(m.rel, m.relId) });
  }

  // levels 2 and 3
  const exclude = kind === 'band' ? null : { rel: kind, relId: id };
  const expand = (parents, level, cap) => {
    const next = [];
    for (const p of parents) {
      const band = bandOf(p.id);
      const all = candidatesOf(band, exclude);
      const strong = all.filter((c) => c.rel !== 'country');
      const pick = (strong.length ? strong : all).slice(0, cap);
      for (const c of pick) if (add(p, c, level)) next.push(nodes.at(-1));
    }
    return next;
  };
  const level2 = expand(level1, 2, limits.l2);
  expand(level2, 3, limits.l3);
  return { nodes, edges };
}
