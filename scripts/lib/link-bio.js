// Automatic linking of band names in bios: "Eliza Carthy" -> "[[eliza-carthy|Eliza Carthy]]".
// Declined Czech forms ("Elizy Carthy") keep their text in the label: "[[eliza-carthy|Elizy Carthy]]".
import { normalizeName } from './slug.js';

const L = 'A-Za-zÀ-ɏ'; // letters incl. diacritics
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Czech case endings added to a (possibly vowel-stripped) stem, by the ending of the nominative.
const SUFFIX = {
  a: ['y', 'e', 'ě', 'u', 'ou', 'ám', 'ách', 'ami'],
  cons: ['a', 'u', 'ovi', 'em', 'y', 'ů', 'ům', 'ech'],
};

// Names that are also ordinary words / too short or generic: never linked automatically.
export const STOPLIST = new Set(['opa', 'kila', 'oi', 'garcia', 'dona rosa', 'rodrigo', 'cuba', 'africa', 'brasil', 'gypsy',
  // album titles / generic words / first names
  'metamorphosis', 'interzone', 'mosaic', 'kabbalah', 'galego', 'magica', 'madera', 'marina', 'karolina', 'shakti', 'kurosh']);

function tokenPattern(tok) {
  const base = esc(tok);
  if (tok.length < 3 || /^[A-Z0-9&.]+$/.test(tok) || /\d/.test(tok)) return base; // acronyms, numbers, short words: exact
  const end = tok.at(-1).toLowerCase();
  if (end === 'a') return `(?:${esc(tok.slice(0, -1))}(?:${SUFFIX.a.join('|')})|${base})`;
  if ('aeiouyáéíóúůý'.includes(end)) return base; // other vowel endings: indeclinable
  return `${base}(?:${SUFFIX.cons.join('|')})?`;
}

export function buildMatchers(bands) {
  const byKey = new Map(); // normalized name -> [id]
  for (const b of bands) {
    const names = new Set([b.fields.name, ...(b.fields.aliases ?? [])].filter(Boolean));
    for (const n of names) {
      const k = normalizeName(n);
      if (!byKey.has(k)) byKey.set(k, new Set());
      byKey.get(k).add(b.id);
    }
  }
  const matchers = [];
  for (const b of bands) {
    const name = b.fields.name;
    if (!name) continue;
    const key = normalizeName(name);
    const ids = byKey.get(key);
    if (ids.size !== 1) continue; // ambiguous
    if (STOPLIST.has(key)) continue;
    const toks = name.split(/\s+/);
    if (toks.length === 1 && name.length < 6) continue; // short single-word names are too ambiguous
    if (!/^\p{Lu}|^\d/u.test(name)) continue; // lowercase names are common words
    const re = new RegExp(`(?<![${L}0-9\\[|])${toks.map((t) => tokenPattern(t)).join('\\s+')}(?![${L}0-9\\]|])`, 'u');
    matchers.push({ id: b.id, name, re, words: toks.length });
  }
  // longer names first, so "Afro Celt Sound System" wins over "Afro"
  matchers.sort((a, b) => b.name.length - a.name.length);
  return matchers;
}

// Links the first mention of every other band. Returns { body, links: [{id, text}] }.
export function linkBody(body, selfId, matchers, selfName = '') {
  const self = normalizeName(selfName);
  let out = body;
  const links = [];
  const done = new Set([...out.matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)].map((m) => m[1].trim()));
  for (const m of matchers) {
    if (m.id === selfId || done.has(m.id)) continue;
    if (self && self.includes(normalizeName(m.name))) continue; // own name mentioned in the text
    // never inside an existing wikilink
    const parts = out.split(/(\[\[[^\]]*\]\])/);
    for (let i = 0; i < parts.length; i += 2) {
      const hit = m.re.exec(parts[i]);
      if (!hit) continue;
      const text = hit[0];
      parts[i] = `${parts[i].slice(0, hit.index)}[[${m.id}|${text}]]${parts[i].slice(hit.index + text.length)}`;
      links.push({ id: m.id, text });
      done.add(m.id);
      break;
    }
    out = parts.join('');
  }
  return { body: out, links };
}
