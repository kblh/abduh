// Renders app icons (PNG) from the logo geometry; full-bleed background for iOS/Android home screens.
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('public/logo.svg', 'utf8').replace(/ rx="7"/, '');
for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(Buffer.from(svg), { density: 72 * (size / 32) }).resize(size, size).png().toFile(`public/icons/${file}`);
  console.log(file);
}
