// Dev-only: builds public/dev/fixture.json + sample AVIF images from the real data.
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const real = JSON.parse(readFileSync('public/data.json', 'utf8'));
const pick = (arr, ids) => ids.map((id) => arr.find((x) => x.id === id)).filter(Boolean);
const today = new Date();
const daysAgo = (n) => new Date(today - n * 864e5).toISOString().slice(0, 10);

const swatch = async (file, color) => sharp({ create: { width: 400, height: 400, channels: 3, background: color } }).avif().toFile(`public/dev/img/${file}`);
await swatch('tinariwen.avif', '#3c6078');
await swatch('khaled.avif', '#c05a3a');
await swatch('tassili.avif', '#c88c4c');
await swatch('heart.avif', '#2a3856');

const bands = pick(real.bands, ['tinariwen', 'ali-farka-toure', 'bombino', 'songhoy-blues', 'khaled', 'rachid-taha', 'zdob-si-zdub', 'tamikrest', 'terakaft', 'toumani-diabate']);
const by = Object.fromEntries(bands.map((b) => [b.id, b]));
Object.assign(by.tinariwen, { image: 'dev/img/tinariwen.avif', added: daysAgo(3), members: ['Ibrahim Ag Alhabib', 'Abdallah Ag Alhousseyni'], body: 'Tuarežský kolektiv ze severu Mali. Elektrické kytary a zpěv v jazyce tamašek.' });
if (by.khaled) Object.assign(by.khaled, { image: 'dev/img/khaled.avif', added: daysAgo(10) });
if (by['rachid-taha']) by['rachid-taha'].tags = ['woman'];
if (by.bombino) by.bombino.added = daysAgo(1);
if (by['zdob-si-zdub']) by['zdob-si-zdub'].countries = ['moldova', 'romania', 'ukraine'].filter((c) => real.countries.some((x) => x.id === c)).concat(by['zdob-si-zdub'].countries).slice(0, 3);

const cds = [
  { id: 'tinariwen-tassili', name: 'Tassili', bands: ['tinariwen'], year: 2011, label: 'Anti-', styles: by.tinariwen.styles, image: 'dev/img/tassili.avif', added: daysAgo(2), body: 'Nahráno převážně akusticky v alžírské poušti.', links: [{ type: 'bandcamp', url: 'https://example.com' }, { type: 'spotify', url: 'https://example.com' }] },
  { id: 'tinariwen-amassakoul', name: 'Amassakoul', bands: ['tinariwen'], year: 2004 },
  { id: 'ali-farka-toure-in-the-heart-of-the-moon', name: 'In the Heart of the Moon', bands: ['ali-farka-toure', 'toumani-diabate'], year: 2005, image: 'dev/img/heart.avif', added: daysAgo(40) },
  { id: 'rachid-taha-diwan', name: 'Diwân', bands: ['rachid-taha'], year: 1998 },
  { id: 'khaled-kenza', name: 'Kenza', bands: ['khaled'], year: 1999, label: 'Barclay' },
  { id: 'bombino-nomad', name: 'Nomad', bands: ['bombino'], year: 2013 },
].filter((c) => c.bands.every((b) => by[b]));
const shelves = [
  { id: 'desert-blues', name: 'Desert blues', bands: ['tinariwen', 'bombino', 'tamikrest'].filter((b) => by[b]), cds: ['tinariwen-tassili'] },
  { id: 'empty', name: 'Prázdná polička' },
];
const keep = (list, key) => new Set(bands.flatMap((b) => b[key] ?? []));
const countries = real.countries.filter((c) => keep(0, 'countries').has(c.id));
const styles = real.styles.filter((s) => keep(0, 'styles').has(s.id) || cds.some((c) => c.styles?.includes(s.id)));
const instruments = real.instruments.filter((i) => keep(0, 'instruments').has(i.id));
writeFileSync('public/dev/fixture.json', JSON.stringify({ bands, cds, shelves, countries, styles, instruments }, null, 1) + '\n');
console.log({ bands: bands.length, cds: cds.length, countries: countries.length, styles: styles.length, instruments: instruments.length });
