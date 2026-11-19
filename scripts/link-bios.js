// Links band names in bios as wikilinks. Default is a dry run (report only).
// Usage: node scripts/link-bios.js [--write] [--only id1,id2] [dataDir]
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIRS, loadAll, serializeEntity } from './lib/entity-file.js';
import { buildMatchers, linkBody } from './lib/link-bio.js';

const args = process.argv.slice(2);
const write = args.includes('--write');
const oi = args.indexOf('--only');
const only = oi >= 0 ? new Set(args[oi + 1].split(',')) : null;
const dataDir = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--only') ?? 'abduh-data';

const all = loadAll(dataDir);
const bands = all.filter((e) => e.type === 'band');
const matchers = buildMatchers(bands);
let files = 0; let links = 0;
for (const b of bands) {
  if (!b.body || (only && !only.has(b.id))) continue;
  const r = linkBody(b.body, b.id, matchers, b.fields.name);
  if (!r.links.length) continue;
  files++; links += r.links.length;
  console.log(`${b.id}: ${r.links.map((l) => `${l.text}→${l.id}`).join('; ')}`);
  if (write) writeFileSync(join(dataDir, DIRS.band, `${b.id}.md`), serializeEntity({ ...b, body: r.body }));
}
console.log(`${write ? 'wrote' : 'dry run:'} ${links} links in ${files} bios`);
