const LISTS = { bands: 'band', cds: 'cd', styles: 'style', instruments: 'instrument', countries: 'country', shelves: 'shelf' };
const NOTFOUND = { route: 'notfound', id: null, query: {} };

export function parseHash(hash) {
  const raw = String(hash ?? '').replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  try {
    const query = {};
    for (const pair of qs.split('&').filter(Boolean)) {
      const [k, v = ''] = pair.split('=');
      query[decodeURIComponent(k)] = decodeURIComponent(v);
    }
    const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
    if (seg.length === 0) return { route: 'home', id: null, query };
    if (seg[0] === 'search' && seg.length === 1) return { route: 'search', id: null, query };
    if (seg[0] in LISTS) {
      if (seg.length === 1) return { route: seg[0], id: null, query };
      if (seg.length === 2) return { route: LISTS[seg[0]], id: seg[1], query };
    }
    return NOTFOUND;
  } catch {
    return NOTFOUND;
  }
}

export function buildHash(route, { id, query = {} } = {}) {
  const seg = route === 'home' ? '' : route === 'search' ? 'search'
    : Object.entries(LISTS).find(([, one]) => one === route)?.[0] ?? route;
  const q = Object.entries(query).filter(([, v]) => v !== '' && v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `#/${seg}${id != null ? `/${encodeURIComponent(id)}` : ''}${q ? `?${q}` : ''}`;
}
