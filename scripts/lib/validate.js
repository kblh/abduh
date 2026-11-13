const RELATIONS = {
  band: [['countries', 'country'], ['styles', 'style'], ['instruments', 'instrument']],
  cd: [['bands', 'band'], ['styles', 'style']],
  shelf: [['bands', 'band'], ['cds', 'cd']],
};
export const LINK_TYPES = ['spotify', 'bandcamp', 'apple-music', 'youtube', 'website', 'wikipedia', 'discogs', 'other'];

export function validate(entities, opts = {}) {
  const errors = [];
  const ids = { band: new Set(), cd: new Set(), shelf: new Set(), country: new Set(), style: new Set(), instrument: new Set() };
  for (const e of entities) {
    if (ids[e.type].has(e.id)) errors.push(`duplicate ${e.type} id: ${e.id}`);
    ids[e.type].add(e.id);
  }
  for (const e of entities) {
    const label = `${e.type} ${e.id}`;
    if (!e.fields.name) errors.push(`${label}: missing name`);
    if (e.type === 'country' && !e.fields.continent) errors.push(`${label}: missing continent`);
    if (e.type === 'band' && (!Array.isArray(e.fields.countries) || e.fields.countries.length === 0)) {
      errors.push(`${label}: needs at least one country`);
    }
    if (e.type === 'cd' && (!Array.isArray(e.fields.bands) || e.fields.bands.length === 0)) {
      errors.push(`${label}: needs at least one band`);
    }
    for (const [field, target] of RELATIONS[e.type] ?? []) {
      for (const ref of e.fields[field] ?? []) {
        if (!ids[target].has(ref)) errors.push(`${label}: ${field} refers to unknown ${target} "${ref}"`);
      }
    }
    for (const l of e.fields.links ?? []) {
      if (!LINK_TYPES.includes(l?.type)) errors.push(`${label}: bad link type "${l?.type}"`);
      if (!/^https?:\/\//i.test(l?.url ?? '')) errors.push(`${label}: link url must be http(s): "${l?.url}"`);
    }
    if (e.fields.image && opts.imageExists && !opts.imageExists(e.fields.image)) {
      errors.push(`${label}: image file missing: ${e.fields.image}`);
    }
  }
  return errors;
}
