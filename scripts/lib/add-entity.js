import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIRS, loadAll, parseEntity, serializeEntity } from './entity-file.js';
import { normalizeName, slugify } from './slug.js';
import { validate } from './validate.js';

export const cdId = (bandIds, name) => `${bandIds[0]}-${slugify(name)}`;

const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export function addEntity(input, { dataDir = 'data', merge = false, force = false } = {}) {
  const { type, fields, body = '' } = input;
  if (!['band', 'cd'].includes(type)) throw new Error(`unsupported type: ${type}`);
  if ('image' in fields || 'image_source' in fields) {
    throw new Error('image fields are set only by add-image');
  }
  if (!fields.name) throw new Error('name is required');
  if (type === 'cd' && !(fields.bands?.length > 0)) throw new Error('cd needs at least one band');

  const dir = join(dataDir, DIRS[type]);
  const baseId = type === 'cd' ? cdId(fields.bands, fields.name) : slugify(fields.name);
  if (!baseId) throw new Error('cannot derive an id from the name');

  let id = baseId;
  let existing = null;
  for (let n = 2; ; n++) {
    const file = join(dir, `${id}.md`);
    if (!existsSync(file)) break;
    const e = parseEntity(type, id, readFileSync(file, 'utf8'));
    if (normalizeName(e.fields.name) === normalizeName(fields.name)) {
      existing = e;
      break;
    }
    id = `${baseId}-${n}`;
  }

  if (existing && !merge && !force) throw new Error(`${type} ${id} already exists (use --merge or --force)`);

  let entity = { type, id, fields: { ...fields }, body };
  if (existing && merge) {
    const merged = { ...existing.fields };
    for (const [k, v] of Object.entries(fields)) if (isEmpty(merged[k])) merged[k] = v;
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

  const errors = validate(loadAll(dataDir));
  if (errors.length) {
    if (previous === null) rmSync(file);
    else writeFileSync(file, previous);
    throw new Error(`invalid data, nothing written:\n${errors.join('\n')}`);
  }
  return { id, created: !existing };
}
