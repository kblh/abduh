import { execFileSync } from 'node:child_process';

const query = process.argv.slice(2).join(' ').trim();
if (!query) {
  console.error('usage: node scripts/apple-notes.js <search text>   (matches note name or body; read-only)');
  process.exit(1);
}

const JXA = `
function run(argv) {
  const q = argv[0];
  const app = Application('Notes');
  const hits = app.notes.whose({ _or: [{ name: { _contains: q } }, { plaintext: { _contains: q } }] })();
  return JSON.stringify(hits.map((n) => ({ name: n.name(), text: n.plaintext() })));
}`;

try {
  const out = execFileSync('osascript', ['-l', 'JavaScript', '-e', JXA, query], { encoding: 'utf8', timeout: 60000 });
  console.log(out.trim());
} catch (e) {
  console.error(
    'Could not read Apple Notes. Allow Terminal/Claude Code in System Settings > Privacy & Security > Automation (Notes). ' +
      (e.stderr ?? e.message),
  );
  process.exit(1);
}
