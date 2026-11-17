import { DIRS, orderedFields } from './entity-file.js';

const GROUPS = { bands: 'band', cds: 'cd', shelves: 'shelf', countries: 'country', styles: 'style', instruments: 'instrument', tags: 'tag' };

const memberLink = /^\[\[([^\]|#]+)\]\]$/;

export function buildData(entities, added = new Map(), modified = new Map()) {
  const out = {};
  const bandName = new Map(entities.filter((e) => e.type === 'band').map((e) => [e.id, e.fields.name]));
  for (const [group, type] of Object.entries(GROUPS)) {
    out[group] = entities
      .filter((e) => e.type === type)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map((e) => {
        const f = orderedFields(e.fields);
        if (f.image) f.image = `img/${f.image}`;
        if (type === 'band' && f.members) {
          f.members = f.members.map((m) => {
            const id = typeof m === 'string' ? m.match(memberLink)?.[1].trim().split('/').pop() : null;
            return id ? { id, name: bandName.get(id) ?? id } : m;
          });
        }
        const when = added.get(`${DIRS[type]}/${e.id}`);
        if (when) f.added = when;
        const changed = modified.get(`${DIRS[type]}/${e.id}`);
        if (changed && changed !== when) f.modified = changed;
        return { id: e.id, ...f, body: e.body };
      });
  }
  return out;
}
