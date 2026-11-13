export function findOrphanImages(entities, files) {
  const used = new Set(entities.map((e) => e.fields.image).filter(Boolean));
  return files.filter((f) => !used.has(f));
}
