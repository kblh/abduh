// Fills `bandcamp_id` (for the embedded player) on every CD that has a Bandcamp album link.
// Only fills empty ones. Usage: node scripts/add-bandcamp-ids.js [dataDir]
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIRS, loadAll, serializeEntity } from './lib/entity-file.js';
import { fetchAlbumId } from './lib/bandcamp.js';

const dataDir = process.argv[2] ?? 'abduh-data';
for (const cd of loadAll(dataDir).filter((e) => e.type === 'cd')) {
  if (cd.fields.bandcamp_id) continue;
  const link = (cd.fields.links ?? []).find((l) => l.type === 'bandcamp' && /\/album\//.test(l.url));
  if (!link) continue;
  try {
    const id = await fetchAlbumId(link.url);
    if (!id) { console.log(`${cd.id}: id not found`); continue; }
    cd.fields.bandcamp_id = id;
    writeFileSync(join(dataDir, DIRS.cd, `${cd.id}.md`), serializeEntity(cd));
    console.log(`${cd.id}: ${id}`);
  } catch (e) {
    console.log(`${cd.id}: ${e.message}`);
  }
}
