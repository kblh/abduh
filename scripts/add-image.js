import { addImage } from './lib/image.js';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--source'));
const [type, slug, src] = pos;
if (!type || !slug || !src) {
  console.error('usage: node scripts/add-image.js <band|cd|instrument> <slug> <url|file> [--source <url>] [--force]');
  process.exit(1);
}
try {
  console.log(await addImage({ type, slug, src, source: opt('source'), force: flag('force') }));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
