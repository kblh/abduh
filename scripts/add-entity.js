import { readFileSync } from 'node:fs';
import { addEntity } from './lib/add-entity.js';

const args = process.argv.slice(2);
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  console.log(JSON.stringify(addEntity(input, { merge: args.includes('--merge'), force: args.includes('--force') })));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
