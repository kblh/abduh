import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { convertVault, editDistance } from './lib/convert.js';
import { DIRS, serializeEntity } from './lib/entity-file.js';
import { slugify } from './lib/slug.js';

const COUNTRY_FOLDERS = ['Africa', 'America', 'Asia', 'Australia', 'Europe', 'Middle East'];
const SPECIAL = ['~styles', '~instruments'];

const mdFiles = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : []);

function readVault(vaultDir) {
  const countries = COUNTRY_FOLDERS.flatMap((folder) =>
    mdFiles(join(vaultDir, folder)).map((fileName) => ({
      continent: slugify(folder),
      fileName,
      text: readFileSync(join(vaultDir, folder, fileName), 'utf8'),
    })),
  );
  const styles = mdFiles(join(vaultDir, '~styles'));
  const instruments = mdFiles(join(vaultDir, '~instruments')).map((name) => ({
    name,
    icon: name.match(/\p{Extended_Pictographic}️?/u)?.[0],
  }));
  const ignoredFolders = readdirSync(vaultDir)
    .filter((n) => !n.startsWith('.') && statSync(join(vaultDir, n)).isDirectory())
    .filter((n) => !COUNTRY_FOLDERS.includes(n) && !SPECIAL.includes(n))
    .sort();
  return { countries, styles, instruments, ignoredFolders };
}

function proposeAliases(report, entities) {
  const known = entities.filter((e) => e.type === 'style' || e.type === 'instrument').map((e) => e.id);
  const proposed = {};
  for (const tag of Object.keys(report.unknownTags)) {
    if (tag.length < 4) continue;
    const max = tag.length < 6 ? 1 : 2;
    const hit = known.find((k) => k !== tag && editDistance(tag, k) <= max);
    if (hit) proposed[tag] = hit;
  }
  return proposed;
}

function listedPairs(entities) {
  const ids = entities.filter((e) => e.type === 'style' || e.type === 'instrument').map((e) => e.id);
  const out = [];
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++)
      if (ids[i].length >= 5 && editDistance(ids[i], ids[j]) <= 1) out.push([ids[i], ids[j]]);
  return out;
}

const list = (items) => (items.length ? items.map((i) => `- ${i}`).join('\n') : '- (none)');

function renderReport(report, proposed, pairs) {
  const unknown = Object.entries(report.unknownTags).sort((a, b) => b[1] - a[1]);
  return [
    '# Migration report',
    '## Counts',
    list(Object.entries(report.counts).map(([k, v]) => `${k}: ${v}`)),
    '## Ignored folders',
    list(report.ignoredFolders),
    '## Unknown tags (stored in `tags`)',
    list(unknown.map(([t, n]) => `${t} (${n}x)`)),
    '## Proposed aliases (copy approved ones to scripts/tag-aliases.json)',
    list(Object.entries(proposed).map(([a, b]) => `${a} -> ${b}`)),
    '## Similar names among listed styles/instruments',
    list(pairs.map((p) => p.join(' ~ '))),
    '## Parentheticals (not stored)',
    list(report.parentheticals),
    '## Skipped lines',
    list(report.skipped),
    '## Similar band names (not merged)',
    list(report.similarNames.map((p) => p.join(' ~ '))),
    '## Slug collisions',
    list(report.slugCollisions),
    '',
  ].join('\n\n');
}

export function migrate(vaultDir, o = {}) {
  const dataDir = o.dataDir ?? 'data';
  const reportPath = o.reportPath ?? 'docs/migration-report.md';
  const aliasesPath = o.aliasesPath ?? 'scripts/tag-aliases.json';
  const aliases = existsSync(aliasesPath) ? JSON.parse(readFileSync(aliasesPath, 'utf8')) : {};

  const bandAliasesPath = o.bandAliasesPath ?? 'scripts/band-aliases.json';
  const bandAliases = existsSync(bandAliasesPath) ? JSON.parse(readFileSync(bandAliasesPath, 'utf8')) : {};
  const vault = readVault(vaultDir);
  const { entities, report } = convertVault(vault, aliases, bandAliases);
  report.ignoredFolders = vault.ignoredFolders;
  const proposedAliases = proposeAliases(report, entities);
  const markdown = renderReport(report, proposedAliases, listedPairs(entities));

  mkdirSync(join(reportPath, '..'), { recursive: true });
  writeFileSync(reportPath, markdown);

  if (o.write) {
    if (existsSync(dataDir) && readdirSync(dataDir).length > 0 && !o.force) {
      throw new Error(`${dataDir} is not empty; pass --force to overwrite`);
    }
    for (const e of entities) {
      const dir = join(dataDir, DIRS[e.type]);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, `${e.id}.md`), serializeEntity(e));
    }
  }
  return { report, markdown, proposedAliases, entities };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const vault = args.find((a) => !a.startsWith('--'));
  if (!vault) {
    console.error('usage: node scripts/migrate.js <vaultDir> [--write] [--force]');
    process.exit(1);
  }
  const r = migrate(vault, { write: args.includes('--write'), force: args.includes('--force') });
  console.log(r.markdown);
}
