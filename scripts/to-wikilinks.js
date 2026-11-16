// One-off / idempotent: rewrite every entity file in the current on-disk format
// (references as [[wikilinks]], aliases from name). Run: node scripts/to-wikilinks.js [dataDir]
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIRS, loadAll, serializeEntity } from './lib/entity-file.js';

const dataDir = process.argv[2] ?? 'abduh-data';
const all = loadAll(dataDir);
for (const e of all) writeFileSync(join(dataDir, DIRS[e.type], `${e.id}.md`), serializeEntity(e));
console.log(`rewrote ${all.length} files`);
