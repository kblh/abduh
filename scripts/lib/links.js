const HOSTS = [
  [/(^|\.)spotify\.com$/, 'spotify'],
  [/(^|\.)bandcamp\.com$/, 'bandcamp'],
  [/^music\.apple\.com$/, 'apple-music'],
  [/(^|\.)youtube\.com$|^youtu\.be$/, 'youtube'],
  [/(^|\.)wikipedia\.org$/, 'wikipedia'],
  [/(^|\.)discogs\.com$/, 'discogs'],
];

export function classifyLink(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return 'website';
  }
  return HOSTS.find(([re]) => re.test(host))?.[1] ?? 'website';
}

function clean(url) {
  let u = url.replace(/["'>]+$/, '');
  for (;;) {
    const last = u.at(-1);
    if (last && '.,;:!?]'.includes(last)) u = u.slice(0, -1);
    else if (last === ')' && (u.match(/\(/g) ?? []).length < (u.match(/\)/g) ?? []).length) u = u.slice(0, -1);
    else break;
  }
  return u;
}

export function extractLinks(text) {
  const seen = new Set();
  const out = [];
  for (const m of text.matchAll(/https?:\/\/[^\s<>"' ]+/gi)) {
    const url = clean(m[0]);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ type: classifyLink(url), url });
  }
  return out;
}
