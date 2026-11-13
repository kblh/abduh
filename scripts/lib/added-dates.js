import { execFileSync } from 'node:child_process';

export function addedDates(dataDir, { bulkThreshold = 50 } = {}) {
  const map = new Map();
  let out;
  try {
    out = execFileSync('git', ['log', '--no-renames', '--diff-filter=A', '--name-only', '--relative', '--format=%x00%as', '--', '.'], {
      cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024,
    });
  } catch {
    return map;
  }
  // newest commit first; iterating on and overwriting leaves the oldest add per file
  for (const block of out.split('\0').slice(1)) {
    const [date, ...rest] = block.split('\n');
    const files = rest.filter((f) => f.endsWith('.md'));
    if (files.length > bulkThreshold) continue;
    for (const f of files) map.set(f.slice(0, -3), date.trim());
  }
  return map;
}
