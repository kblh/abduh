# CD, images, links and add-skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `cd` entity, AVIF images and `links` to bands/CDs, scripts that write them deterministically, and a project skill `abduh-add` that uses them.

**Architecture:** Extend the existing pure-module design in `scripts/lib/` (entity IO, validation, build-data); add `image.js`, `slug`-based CD ids, `links.js`; thin CLIs call them. The skill only orchestrates web lookup and these CLIs.

**Tech Stack:** Node.js >= 20 ESM, `node:test`, `yaml`, new dependency `sharp` (AVIF).

**Spec:** `docs/superpowers/specs/2026-11-13-cds-images-links-design.md` (extends `2026-11-12-data-format-design.md`; existing code and tests in `scripts/`, `tests/`).

## Global Constraints

- Run tests with `npm test` (= `node --test`).
- CD file `data/cds/<slug>.md`; CD id = `<slug of first band id>-<slug of name>`, collision → `-2`, immutable afterwards. Frontmatter key order: `name, continent, flag, icon, bands, countries, year, label, styles, instruments, members, tags, image, image_source, links`.
- CD fields: `name`, `bands` (>= 1 existing band ids), `year`, `label`, `styles` (existing style ids), `tags` (free), `image` (optional), `image_source` (single URL string), `links`. Band gets `image`, `image_source`, `links`. CD country is not stored.
- Link: `{type, url}`; `type` ∈ `spotify, bandcamp, apple-music, youtube, website, wikipedia, discogs, other`; `url` must be `http(s)`.
- Images: `data/images/{bands,cds}/<slug>.avif`, 400×400 center-crop, small inputs upscaled, AVIF quality ~50 (target <= 30 kB); `image` field = path relative to `data/images/` (`cds/x.avif`). CD image is NOT required.
- Build: `data.json` group order `bands, cds, countries, styles, instruments`; `image` there is `img/<bands|cds>/<slug>.avif`; `public/img/` is cleared and filled by build; relations stay forward-only; warnings print but exit code stays 0, errors exit 1.
- `add-entity` supports only band and cd, rejects `image`/`image_source` input, refuses to overwrite unless `--force`, `--merge` fills only missing fields.
- Network: `http(s)` only, 10 MB cap, 15 s timeout, User-Agent set, `Content-Type` must be `image/*`.
- Skill never commits.

## Review Focus

- CD whose `bands` list includes an unknown band id, or is empty: build error naming the CD.
- `image` pointing to a missing file → error; an image file nobody references → warning only.
- Two CDs with the same title by different bands, and the same title by the same band: distinct ids (`-2` only on full collision).
- Non-square, tiny (< 400 px) and non-image (HTML page, wrong content type) inputs to `add-image`.
- Text with several links (duplicates, trailing punctuation `)` `,`, link inside Markdown/Notes text): `extractLinks` returns each URL once, cleaned.

---

### Task 1: Model, validation and build for CD, images and links

**Files:**
- Modify: `scripts/lib/entity-file.js` (TYPES/DIRS add `cd`→`cds`; KEY_ORDER), `scripts/lib/validate.js`, `scripts/lib/build-data.js`, `scripts/build.js`
- Create: `scripts/lib/images.js`
- Test: `tests/build.test.js` (update group-order assertion), new `tests/cd.test.js`, `tests/images.test.js`

**Interfaces:**
- Produces:
  - `validate(entities: Entity[], opts?: { imageExists?: (rel: string) => boolean }): string[]` (existing checks + CD rules above, link rules, image existence only when `imageExists` given)
  - `findOrphanImages(entities: Entity[], files: string[]): string[]` in `images.js` (`files` relative to `data/images/`)
  - `buildData` returns keys in order `bands, cds, countries, styles, instruments`; `image` mapped to `img/<rel>`
  - `build.js`: lists `data/images/**`, validates with `imageExists`, prints orphan warnings, clears and fills `public/img/`.

- [ ] **Step 1: Write failing tests** (`tests/cd.test.js`): `validate` errors for CD with `bands: []`, with `bands: ['nobody']`, with unknown style; for a link with `type: 'tiktok'`, with `url: 'ftp://x'`; no error for a valid CD without `image`; with `imageExists: () => false` a CD with `image: 'cds/a.avif'` errors naming the file; `findOrphanImages(entities, ['cds/a.avif','bands/z.avif'])` returns `['bands/z.avif']` when only `cds/a.avif` is referenced; `buildData` has `cds` after `bands` and `image === 'img/cds/a.avif'`; `serializeEntity` puts `bands` before `year` and `links` last. Update `tests/build.test.js` order assertion.
- [ ] **Step 2: Run** `npm test` → FAIL on the new tests.
- [ ] **Step 3: Implement** the signatures above in the listed files.
- [ ] **Step 4: Run** `npm test` → all PASS; `npm run build` still succeeds on current `data/` (`3007 entities` unchanged, `public/img/` empty).
- [ ] **Step 5: Commit** `feat: CD entity, images and links in model, validation and build`.

### Task 2: add-image (AVIF conversion)

**Files:**
- Create: `scripts/lib/image.js`, `scripts/add-image.js`
- Modify: `package.json` (dependency `sharp`; script `"add-image": "node scripts/add-image.js"`)
- Test: `tests/image.test.js` (fixtures generated with `sharp` in the test, no binary files committed)

**Interfaces:**
- Consumes: `parseEntity`, `serializeEntity`, `DIRS` (entity-file.js).
- Produces:
  - `toAvifSquare(input: Buffer): Promise<Buffer>` (400×400, center crop, upscale)
  - `fetchImage(url: string, opts?: { fetchFn?: typeof fetch }): Promise<Buffer>` (limits per Global Constraints; rejects non-`image/*` and oversize)
  - `addImage(o: { type: 'band'|'cd', slug: string, src: string, source?: string, force?: boolean, dataDir?: string }): Promise<string>` returns the stored relative path; `src` is URL or local file; writes `data/images/<type>s/<slug>.avif`, sets `image` (and `image_source` when `source` or a URL `src` is given) in the entity's frontmatter; refuses when entity missing, or when an image exists and not `force`.
  - CLI: `node scripts/add-image.js <band|cd> <slug> <url|file> [--source <url>] [--force]`.

- [ ] **Step 1: Write failing tests:** a 1000×500 PNG → output decodes (via `sharp(...).metadata()`) as `avif`, 400×400; a 100×100 input → 400×400; output of a flat-color 1000×1000 PNG < 30 kB; `fetchImage` with injected `fetchFn` returning `text/html` rejects, returning 11 MB rejects, returning a PNG resolves; `addImage` on a temp `dataDir` with a band file writes the avif file and sets `image: bands/<slug>.avif`; second call without `force` rejects; unknown slug rejects.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** (`npm install sharp`); quality 50, `effort` low enough for fast tests; fetch via global `fetch` with `AbortSignal.timeout(15000)` and a User-Agent header.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: add-image with AVIF conversion`.

### Task 3: add-entity

**Files:**
- Create: `scripts/lib/add-entity.js`, `scripts/add-entity.js`
- Modify: `package.json` (script `"add-entity"`)
- Test: `tests/add-entity.test.js`

**Interfaces:**
- Consumes: `loadAll`, `serializeEntity`, `validate`, `slugify`.
- Produces:
  - `cdId(bandIds: string[], name: string): string` (`<bandIds[0]>-<slugify(name)>`)
  - `addEntity(input: { type: 'band'|'cd', fields: Record<string, unknown>, body?: string }, opts?: { dataDir?: string, merge?: boolean, force?: boolean }): { id: string, created: boolean }`
  - Behaviour: band id = `slugify(name)`, CD id = `cdId(...)`; on id collision of a *different* entity (different `name`) append `-2`, `-3`…; same name + same bands = existing entity → throws unless `merge` (fill missing fields only) or `force` (replace); rejects `image`/`image_source`; after the write the whole `data/` must pass `validate`, otherwise the write is rolled back and the errors thrown.
  - CLI: `node scripts/add-entity.js [--merge] [--force] < input.json`, prints `{id, created}` as JSON.

- [ ] **Step 1: Write failing tests** (temp `dataDir` with a country, a style, a band): CD `Tassili` by `tinariwen` → id `tinariwen-tassili`; same title by another band → different id; second CD with same title+band without merge throws, with `--merge` fills missing `year` and keeps an existing `label`; unknown `bands` id throws and leaves no file; `image` in input throws; band with `links` of bad type throws and leaves no file.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the signatures; read existing file with `parseEntity` for merge.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: add-entity script`.

### Task 4: Link extraction, Apple Notes reader and the skill

**Files:**
- Create: `scripts/lib/links.js`, `scripts/extract-links.js`, `scripts/apple-notes.js`, `.claude/skills/abduh-add/SKILL.md`
- Modify: `README.md` (short usage: add via skill, scripts)
- Test: `tests/links.test.js`

**Interfaces:**
- Produces:
  - `classifyLink(url: string): 'spotify'|'bandcamp'|'apple-music'|'youtube'|'wikipedia'|'discogs'|'website'` (by host; `*.bandcamp.com` and `open.spotify.com` included; anything else `website`)
  - `extractLinks(text: string): { type: string, url: string }[]` (every `http(s)` URL once in order of appearance, trailing `.,;:)]` and quotes stripped)
  - `node scripts/extract-links.js < text` prints that as JSON.
  - `node scripts/apple-notes.js <search text>` prints JSON `[{name, text}]` of notes whose name or body contains the search text, using `osascript -l JavaScript` (Notes app, read-only).
  - Skill `abduh-add`: follows Spec §Skill: decide band vs CD; look up metadata from public sources (MusicBrainz/Cover Art Archive, Wikipedia, the page behind a given link) and never invent missing fields; create missing band first (country required, ask if unknown); call `add-entity`, then `add-image` when a cover/photo is found, then `npm run build`; summarise; no commit. Apple Notes: run `apple-notes.js`, `extract-links.js`, confirm the number of links with the user before processing several.

- [ ] **Step 1: Write failing tests:** `classifyLink('https://open.spotify.com/album/x') === 'spotify'`, `'https://tinariwen.bandcamp.com/album/tassili' === 'bandcamp'`, `'https://en.wikipedia.org/wiki/Tassili_(album)' === 'wikipedia'`, `'https://example.org' === 'website'`; `extractLinks('Poslech: https://a.com/x), a také (https://b.com/y). https://a.com/x')` returns exactly the two URLs `https://a.com/x` and `https://b.com/y` in that order; empty text → `[]`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `links.js` and the three CLIs; write `SKILL.md` (frontmatter `name: abduh-add`, a description triggering on „přidej album/kapelu", Spotify/Bandcamp links, Apple Notes) and the README section.
- [ ] **Step 4: Run** `npm test` → PASS. Manual check (needs user's macOS permission for Notes automation): `node scripts/apple-notes.js <word>` prints JSON; if permission is denied, record it and tell the user how to grant it.
- [ ] **Step 5: End-to-end smoke in a temp copy of `data/`:** `add-entity` a CD for an existing band, `add-image` with a local PNG, `build` → exits 0 and `public/img/cds/<id>.avif` exists; then discard the temp copy (do not commit sample data).
- [ ] **Step 6: Commit** `feat: link extraction, Apple Notes reader and abduh-add skill`.
