import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { DIRS, parseEntity, serializeEntity } from './entity-file.js';

const MAX_BYTES = 10 * 1024 * 1024;
const UA = 'abduh-music-collection/1.0 (personal project)';

export async function toAvifSquare(input) {
  return sharp(input)
    .resize(400, 400, { fit: 'cover', position: 'centre', withoutEnlargement: false })
    .avif({ quality: 50, effort: 4 })
    .toBuffer();
}

export async function fetchImage(url, { fetchFn = fetch } = {}) {
  if (!/^https?:\/\//i.test(url)) throw new Error(`only http(s) urls are allowed: ${url}`);
  const res = await fetchFn(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000), redirect: 'follow' });
  if (!res.ok) throw new Error(`download failed (${res.status}): ${url}`);
  if (!(res.headers.get('content-type') ?? '').toLowerCase().startsWith('image/')) {
    throw new Error(`not an image content type: ${res.headers.get('content-type')}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) throw new Error(`image too large (${buf.length} bytes, limit ${MAX_BYTES})`);
  return buf;
}

export async function addImage({ type, slug, src, source, force = false, dataDir = 'data' }) {
  if (!['band', 'cd'].includes(type)) throw new Error(`unsupported type ${type}`);
  const file = join(dataDir, DIRS[type], `${slug}.md`);
  if (!existsSync(file)) throw new Error(`${type} ${slug} not found`);
  const rel = `${DIRS[type]}/${slug}.avif`;
  const target = join(dataDir, 'images', rel);
  if (existsSync(target) && !force) throw new Error(`image already exists: ${rel} (use --force)`);

  const isUrl = /^https?:\/\//i.test(src);
  const input = isUrl ? await fetchImage(src) : readFileSync(src);
  const avif = await toAvifSquare(input);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, avif);
  const e = parseEntity(type, slug, readFileSync(file, 'utf8'));
  e.fields.image = rel;
  const origin = source ?? (isUrl ? src : undefined);
  if (origin) e.fields.image_source = origin;
  writeFileSync(file, serializeEntity(e));
  return rel;
}
