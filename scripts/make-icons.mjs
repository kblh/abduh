// Renders app icons (PNG) from the logo: red bars on a full-bleed black square (iOS/Android home screens need an opaque background).
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const logo = readFileSync('public/logo.svg', 'utf8');
for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const inner = Math.round(size * 0.6);
  const bars = await sharp(Buffer.from(logo), { density: 72 * (inner / 32) }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0a0a0a' } })
    .composite([{ input: bars, gravity: 'centre' }]).png().toFile(`public/icons/${file}`);
  console.log(file);
}
