import { readFileSync } from 'node:fs';
import { extractLinks } from './lib/links.js';

console.log(JSON.stringify(extractLinks(readFileSync(0, 'utf8')), null, 2));
