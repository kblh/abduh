import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { loadAll } from './lib/entity-file.js';
import { validate } from './lib/validate.js';
import { buildData } from './lib/build-data.js';

const dataDir = process.argv[2] ?? 'data';
const out = process.argv[3] ?? 'public/data.json';

const entities = loadAll(dataDir);
const errors = validate(entities);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(buildData(entities), null, 2) + '\n');
console.log(`built ${out}: ${entities.length} entities`);
