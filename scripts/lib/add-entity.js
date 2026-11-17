import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIRS, loadAll, parseEntity, serializeEntity, unwikilink } from './entity-file.js';
import { normalizeName, slugify } from './slug.js';
import { validate } from './validate.js';

const SAFE_ID = /^[a-z0-9-]+$/;
const sameSet = (a = [], b = []) => a.length === b.length && a.every((x) => b.includes(x));

export const cdId = (bandIds, name) => `${bandIds[0]}-${slugify(name)}`;

const isLink = (m) => typeof m === 'string' && /^\[\[[^\]]+\]\]$/.test(m);

// Members that are already bands in the collection become wikilinks ("[[id]]"); the rest stay plain names.
function linkMembers(members, dataDir, ownName) {
  if (!Array.isArray(members)) return members;
  const byName = new Map(loadAll(dataDir).filter((e) => e.type === 'band').map((e) => [normalizeName(e.fields.name ?? ''), e.id]));
  const own = normalizeName(ownName);
  return members.map((m) => (typeof m === 'string' && !isLink(m) && normalizeName(m) !== own && byName.has(normalizeName(m)) ? `[[${byName.get(normalizeName(m))}]]` : m));
}

// A new band replaces plain-text members with the same name in other bands by a wikilink.
function linkExistingMembers(dataDir, id, name) {
  const key = normalizeName(name);
  const linked = [];
  for (const e of loadAll(dataDir)) {
    if (e.type !== 'band' || e.id === id || !Array.isArray(e.fields.members)) continue;
    let changed = false;
    const members = e.fields.members.map((m) => {
      if (typeof m !== 'string' || isLink(m) || normalizeName(m) !== key) return m;
      changed = true;
      return `[[${id}]]`;
    });
    if (!changed) continue;
    e.fields.members = members;
    writeFileSync(join(dataDir, DIRS.band, `${e.id}.md`), serializeEntity(e));
    linked.push(e.id);
  }
  return linked;
}

const memberKey = (m) => (isLink(m) ? unwikilink(m) : normalizeName(m));

const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export function addEntity(input, { dataDir = 'abduh-data', merge = false, force = false } = {}) {
  const { type, fields, body = '' } = input;
  if (!['band', 'cd', 'shelf', 'tag', 'style', 'instrument'].includes(type)) throw new Error(`unsupported type: ${type}`);
  if ('image' in fields || 'image_source' in fields) {
    throw new Error('image fields are set only by add-image');
  }
  if (!fields.name) throw new Error('name is required');
  if (type === 'cd') {
    if (!(fields.bands?.length > 0)) throw new Error('cd needs at least one band');
    for (const b of fields.bands) if (typeof b !== 'string' || !SAFE_ID.test(b)) throw new Error(`invalid band id: ${b}`);
  }

  const dir = join(dataDir, DIRS[type]);
  const baseId = type === 'cd' ? cdId(fields.bands, fields.name) : slugify(fields.name);
  if (!baseId) throw new Error('cannot derive an id from the name');

  let id = baseId;
  let existing = null;
  for (let n = 2; ; n++) {
    const file = join(dir, `${id}.md`);
    if (!existsSync(file)) break;
    const e = parseEntity(type, id, readFileSync(file, 'utf8'));
    if (normalizeName(e.fields.name) === normalizeName(fields.name) && (type !== 'cd' || sameSet(e.fields.bands, fields.bands))) {
      existing = e;
      break;
    }
    id = `${baseId}-${n}`;
  }

  if (existing && !merge && !force) throw new Error(`${type} ${id} already exists (use --merge to complete missing fields)`);

  if (type === 'band' && fields.members) fields.members = linkMembers(fields.members, dataDir, fields.name);
  let entity = { type, id, fields: { ...fields }, body };
  if (existing && merge) {
    const merged = { ...existing.fields };
    for (const [k, v] of Object.entries(fields)) {
      if (type === 'shelf' && (k === 'bands' || k === 'cds') && Array.isArray(v)) merged[k] = [...new Set([...(merged[k] ?? []), ...v])];
      else if (type === 'band' && k === 'members' && Array.isArray(v)) {
        const have = new Set((merged.members ?? []).map(memberKey));
        merged.members = [...(merged.members ?? []), ...v.filter((m) => !have.has(memberKey(m)))];
      }
      else if (k === 'tags' && Array.isArray(v)) merged.tags = [...new Set([...(merged.tags ?? []), ...v])];
      else if (k === 'links' && Array.isArray(v)) {
        const have = new Set((merged.links ?? []).map((l) => l.url));
        merged.links = [...(merged.links ?? []), ...v.filter((l) => !have.has(l.url))];
      } else if (isEmpty(merged[k])) merged[k] = v;
    }
    entity = { type, id, fields: merged, body: existing.body || body };
  } else if (existing && force) {
    const keep = {};
    for (const k of ['image', 'image_source']) if (existing.fields[k]) keep[k] = existing.fields[k];
    entity.fields = { ...fields, ...keep };
  }

  const file = join(dir, `${id}.md`);
  const previous = existing ? readFileSync(file, 'utf8') : null;
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, serializeEntity(entity));

  let errors;
  try {
    errors = validate(loadAll(dataDir));
  } catch (e) {
    errors = [e.message];
  }
  if (errors.length) {
    if (previous === null) rmSync(file);
    else writeFileSync(file, previous);
    throw new Error(`invalid data, nothing written:\n${errors.join('\n')}`);
  }
  const result = { id, created: !existing };
  if (type === 'band' && !existing) {
    const linked = linkExistingMembers(dataDir, id, fields.name);
    if (linked.length) result.linked = linked;
  }
  return result;
}
