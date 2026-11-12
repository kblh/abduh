const RELATIONS = [
  ['countries', 'country'],
  ['styles', 'style'],
  ['instruments', 'instrument'],
];

export function validate(entities) {
  const errors = [];
  const ids = { band: new Set(), country: new Set(), style: new Set(), instrument: new Set() };
  for (const e of entities) {
    if (ids[e.type].has(e.id)) errors.push(`duplicate ${e.type} id: ${e.id}`);
    ids[e.type].add(e.id);
  }
  for (const e of entities) {
    if (!e.fields.name) errors.push(`${e.type} ${e.id}: missing name`);
    if (e.type === 'country' && !e.fields.continent) errors.push(`country ${e.id}: missing continent`);
    if (e.type !== 'band') continue;
    if (!Array.isArray(e.fields.countries) || e.fields.countries.length === 0) {
      errors.push(`band ${e.id}: needs at least one country`);
    }
    for (const [field, target] of RELATIONS) {
      for (const ref of e.fields[field] ?? []) {
        if (!ids[target].has(ref)) errors.push(`band ${e.id}: ${field} refers to unknown ${target} "${ref}"`);
      }
    }
  }
  return errors;
}
