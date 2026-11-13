import { orderedFields } from './entity-file.js';

const GROUPS = { bands: 'band', cds: 'cd', shelves: 'shelf', countries: 'country', styles: 'style', instruments: 'instrument' };

export function buildData(entities) {
  const out = {};
  for (const [group, type] of Object.entries(GROUPS)) {
    out[group] = entities
      .filter((e) => e.type === type)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map((e) => {
        const f = orderedFields(e.fields);
        if (f.image) f.image = `img/${f.image}`;
        return { id: e.id, ...f, body: e.body };
      });
  }
  return out;
}
