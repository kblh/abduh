import { execFileSync } from 'node:child_process';

// the vault folder used to be called `data`; history before the rename lives there
const LEGACY_DIRS = ['data'];

export function addedDates(dataDir, { bulkThreshold = 50 } = {}) {
  const map = new Map();
  let out;
  let top; let prefixes;
  try {
    top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const own = execFileSync('git', ['rev-parse', '--show-prefix'], { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().replace(/\/$/, '');
    prefixes = [...new Set([own, ...LEGACY_DIRS])].filter(Boolean);
    out = execFileSync('git', ['log', '--no-renames', '--diff-filter=A', '--name-only', '--format=%x00%as', '--', ...prefixes], {
      cwd: top, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024,
    });
  } catch {
    return map;
  }
  const strip = (f) => { for (const p of prefixes) if (f.startsWith(`${p}/`)) return f.slice(p.length + 1); return f; };
  // newest commit first; iterating on and overwriting leaves the oldest add per file
  for (const block of out.split('\0').slice(1)) {
    const [date, ...rest] = block.split('\n');
    const files = rest.filter((f) => f.endsWith('.md')).map(strip);
    if (files.length > bulkThreshold) continue;
    for (const f of files) map.set(f.slice(0, -3), date.trim());
  }
  const today = new Date().toLocaleDateString('sv-SE');
  for (const args of [['ls-files', '--others', '--exclude-standard', '--', '.'], ['diff', '--cached', '--name-only', '--diff-filter=A', '--relative', '--', '.']]) {
    try {
      const files = execFileSync('git', args, { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
        .split('\n').filter((f) => f.endsWith('.md'));
      if (files.length > bulkThreshold) continue;
      for (const f of files) if (!map.has(f.slice(0, -3))) map.set(f.slice(0, -3), today);
    } catch { /* ignore */ }
  }
  return map;
}

// date of the last commit touching each file (bulk commits ignored); uncommitted changes count as today
export function modifiedDates(dataDir, { bulkThreshold = 50 } = {}) {
  const map = new Map();
  let top; let prefixes; let out;
  try {
    top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const own = execFileSync('git', ['rev-parse', '--show-prefix'], { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().replace(/\/$/, '');
    prefixes = [...new Set([own, ...LEGACY_DIRS])].filter(Boolean);
    out = execFileSync('git', ['log', '--no-renames', '--name-only', '--format=%x00%as', '--', ...prefixes], {
      cwd: top, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024,
    });
  } catch {
    return map;
  }
  const strip = (f) => { for (const p of prefixes) if (f.startsWith(`${p}/`)) return f.slice(p.length + 1); return f; };
  // newest commit first: the first date seen for a file is its last change
  for (const block of out.split('\0').slice(1)) {
    const [date, ...rest] = block.split('\n');
    const files = rest.filter((f) => f.endsWith('.md')).map(strip);
    if (files.length > bulkThreshold) continue;
    for (const f of files) if (!map.has(f.slice(0, -3))) map.set(f.slice(0, -3), date.trim());
  }
  const today = new Date().toLocaleDateString('sv-SE');
  for (const args of [['ls-files', '--others', '--exclude-standard', '--', '.'], ['diff', '--name-only', '--relative', 'HEAD', '--', '.']]) {
    try {
      const files = execFileSync('git', args, { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
        .split('\n').filter((f) => f.endsWith('.md'));
      if (files.length > bulkThreshold) continue;
      for (const f of files) map.set(f.slice(0, -3), today);
    } catch { /* ignore */ }
  }
  return map;
}
