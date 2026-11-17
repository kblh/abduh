// Bandcamp embed needs the numeric album id, which is not in the album URL.
// It is in the page's <meta name="bc-page-properties"> ({"item_type":"a","item_id":123}).
export async function fetchAlbumId(url, fetchFn = fetch) {
  const res = await fetchFn(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return parseAlbumId(await res.text());
}

export function parseAlbumId(html) {
  const m = html.match(/<meta[^>]+name="bc-page-properties"[^>]+content="([^"]*)"/i);
  if (!m) return null;
  try {
    const p = JSON.parse(m[1].replace(/&quot;/g, '"'));
    return p.item_type === 'a' && Number.isInteger(p.item_id) ? p.item_id : null;
  } catch {
    return null;
  }
}
