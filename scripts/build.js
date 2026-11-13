import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadAll } from './lib/entity-file.js';
import { validate } from './lib/validate.js';
import { buildData } from './lib/build-data.js';
import { findOrphanImages } from './lib/images.js';

const dataDir = process.argv[2] ?? 'data';
const out = process.argv[3] ?? 'public/data.json';
const imagesDir = join(dataDir, 'images');
const outImg = join(dirname(out), 'img');

function listImages(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? listImages(join(dir, d.name), `${prefix}${d.name}/`) : [`${prefix}${d.name}`],
  );
}

const entities = loadAll(dataDir);
const files = listImages(imagesDir);
const fileSet = new Set(files);
const errors = validate(entities, { imageExists: (rel) => fileSet.has(rel) });
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
for (const o of findOrphanImages(entities, files)) console.warn(`warning: unreferenced image ${o}`);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(buildData(entities), null, 2) + '\n');
rmSync(outImg, { recursive: true, force: true });
mkdirSync(outImg, { recursive: true });
for (const f of files) {
  mkdirSync(dirname(join(outImg, f)), { recursive: true });
  cpSync(join(imagesDir, f), join(outImg, f));
}
console.log(`built ${out}: ${entities.length} entities, ${files.length} images`);
