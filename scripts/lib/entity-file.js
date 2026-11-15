import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

export const TYPES = ['band', 'cd', 'shelf', 'country', 'style', 'instrument', 'tag'];
export const DIRS = { band: 'bands', cd: 'cds', shelf: 'shelves', country: 'countries', style: 'styles', instrument: 'instruments', tag: 'tags' };
export const KEY_ORDER = ['name', 'aliases', 'continent', 'flag', 'icon', 'bands', 'cds', 'countries', 'year', 'label', 'styles', 'instruments', 'members', 'tags', 'image', 'image_source', 'links', 'added'];

// Fields that hold references to other entities. On disk they are Obsidian wikilinks
// ("[[mali]]"); in memory (validate, build, add-entity) they are plain ids.
export const REF_FIELDS = ['bands', 'cds', 'countries', 'styles', 'instruments', 'tags'];

export const wikilink = (id) => `[[${id}]]`;

export function unwikilink(v) {
  if (typeof v !== 'string') return v;
  const m = v.match(/^\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]$/);
  return m ? m[1].trim().split('/').pop() : v;
}

const mapRefs = (fields, fn) =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, REF_FIELDS.includes(k) && Array.isArray(v) ? v.map(fn) : v]));

const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export function orderedFields(fields) {
  const keys = Object.keys(fields).filter((k) => !isEmpty(fields[k]));
  const rank = (k) => (KEY_ORDER.includes(k) ? KEY_ORDER.indexOf(k) : KEY_ORDER.length);
  keys.sort((a, b) => rank(a) - rank(b));
  return Object.fromEntries(keys.map((k) => [k, fields[k]]));
}

export function serializeEntity(e) {
  const withLinks = mapRefs(e.fields, (id) => wikilink(unwikilink(id)));
  // aliases make Obsidian suggest entities by name, not only by file name (the id)
  const fm = YAML.stringify(orderedFields({ ...withLinks, aliases: e.fields.name ? [e.fields.name] : [] }));
  return `---\n${fm}---\n` + (e.body ? `\n${e.body}` : '');
}

export function parseEntity(type, id, text) {
  const m = text.match(/^---\n([\s\S]*?)\n?---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${type}/${id}: missing frontmatter`);
  const { aliases, ...raw } = YAML.parse(m[1]) ?? {};
  const fields = mapRefs(raw, unwikilink);
  const body = m[2].replace(/^\n/, '');
  return { type, id, fields, body };
}

export function loadAll(dataDir) {
  const out = [];
  for (const type of TYPES) {
    const dir = join(dataDir, DIRS[type]);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
      out.push(parseEntity(type, f.slice(0, -3), readFileSync(join(dir, f), 'utf8')));
    }
  }
  return out;
}
