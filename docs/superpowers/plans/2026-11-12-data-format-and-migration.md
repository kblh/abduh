# Abduh – data format, migration and build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Obsidian music vault into `data/` (Markdown + YAML frontmatter, one file per entity) and build `public/data.json` from it with validation.

**Architecture:** Plain Node.js ESM scripts, no framework. Small pure modules in `scripts/lib/` (slug, parsing, classification, entity file IO, validation) with thin CLIs `scripts/migrate.js` and `scripts/build.js`. Migration runs in two passes; pass 1 only reports.

**Tech Stack:** Node.js >= 20, built-in `node:test`, one dependency: `yaml`.

**Spec:** `docs/superpowers/specs/2026-11-12-data-format-design.md`

## Global Constraints

- Entity files: `data/{bands,countries,styles,instruments}/<slug>.md`, YAML frontmatter + Markdown body.
- Slug: lowercase, no diacritics, no emoji, hyphens (`desert-blues`, `united-kingdom`).
- Band frontmatter: `name`, `countries` (>= 1, required), `styles`, `instruments`, `members` (strings), `tags`. Country: `name`, `continent` (`africa|america|asia|australia|europe|middle-east`), `flag`. Style: `name`. Instrument: `name`, `icon`.
- `~w` becomes tag `woman`. `raw/`, `~ Jazz/`, `~ eXperimental/` are ignored (the latter two listed in the report).
- Migration only reads the vault (`/Users/petr.kolacek/vaults/music`, passed as argument) and writes into this repo.
- Unknown `~` tags go to `tags` and into the report; nothing is dropped silently. Parentheticals such as `(1911 - 1970)` are only reported.
- Do not merge near-duplicate band names (Cankisou/Cankysou); only report them. Normalisation for merging = case, diacritics, whitespace, inline `[[~…]]` tags and trailing `#` removed; parentheses kept.
- Slug collision between different bands: suffix `-2`, `-3`, reported.
- `data.json` shape: `{ bands: [], countries: [], styles: [], instruments: [] }`; each item = frontmatter fields + `id` (slug) + `body` (raw Markdown); relations are forward IDs only.
- Build is deterministic (items sorted by `id`, stable key order) and fails on duplicate slug, missing required field, or relation to a non-existent ID.
- Alias dictionary lives in `scripts/tag-aliases.json` (`{ "raggae": "reggae", … }`), committed.

## Review Focus

- Cuba-style file with no `- ` bullets and no style headers: bare lines are bands, indented bare lines are members.
- Band under two country files with different case/diacritics ("Zdob si Zdub" vs "Zdob Si Zdub") merges into one with both countries.
- Name containing only an emoji, a trailing `#` (`Juan Formell [[~bass]]#`), or an inline tag with emoji (`[[~piano 🎹]]`).
- A file with an empty body or no bands (e.g. `Kurdistan.md` without flag) must still produce a country, with `flag` omitted.
- Two different bands whose names slugify the same must not overwrite each other's file.

---

### Task 1: Project scaffold and slug utilities

**Files:**
- Create: `package.json`, `.gitignore` (`node_modules/`), `scripts/lib/slug.js`
- Test: `tests/slug.test.js`

**Interfaces:**
- Produces: `slugify(s: string): string`; `normalizeName(s: string): string` (merge key: lowercase, diacritics stripped, inline `[[…]]` removed, trailing `#` removed, whitespace collapsed, parentheses kept); `stripEmoji(s: string): string`.

- [ ] **Step 1: Write failing tests** in `tests/slug.test.js` (`node:test`): `slugify('Ivory Coast - Cote d\'Ivoire') === 'ivory-coast-cote-d-ivoire'`; `slugify('~piano 🎹') === 'piano'`; `slugify('Dub in da Trip') === 'dub-in-da-trip'`; `normalizeName('Zdob si Zdub') === normalizeName('Zdob Si  Zdub')`; `normalizeName('Juan Formell [[~bass]]#') === 'juan formell'`; `normalizeName('Guillermo Portabales (1911 - 1970)') !== normalizeName('Guillermo Portabales')`; `slugify('🎹') === ''`.
- [ ] **Step 2: Run** `node --test tests/` → FAIL (module missing).
- [ ] **Step 3: Implement** the three functions in `scripts/lib/slug.js`; use `String.prototype.normalize('NFD')` plus `\p{Extended_Pictographic}` / regional-indicator removal for emoji. Add `package.json` (`"type": "module"`, `"scripts": {"test": "node --test tests/", "migrate": "node scripts/migrate.js", "build": "node scripts/build.js"}`, dependency `yaml`), run `npm install`.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: scaffold project and slug utilities`.

### Task 2: Entity file IO, validation and build

**Files:**
- Create: `scripts/lib/entity-file.js`, `scripts/lib/validate.js`, `scripts/build.js`
- Test: `tests/entity-file.test.js`, `tests/build.test.js` (fixture dirs created in a temp dir inside the test)

**Interfaces:**
- Consumes: `slugify` (Task 1).
- Produces:
  - `type Entity = { type: 'band'|'country'|'style'|'instrument', id: string, fields: Record<string, unknown>, body: string }`
  - `serializeEntity(e: Entity): string` (frontmatter with fixed key order `name, continent, flag, icon, countries, styles, instruments, members, tags`, empty fields omitted; then blank line and body)
  - `parseEntity(type, id, text: string): Entity`
  - `loadAll(dataDir: string): Entity[]`
  - `validate(entities: Entity[]): string[]` (list of error messages; empty = ok)
  - `buildData(entities: Entity[]): object` (the `data.json` shape above)
  - CLI `node scripts/build.js [dataDir=data] [out=public/data.json]` exits 1 and prints errors when `validate` is non-empty.

- [ ] **Step 1: Write failing tests:** round trip `parseEntity(serializeEntity(e))` equals `e` for a band with members and tags; `validate` returns an error naming the band for `countries: []`, for `countries: ['nowhere']`, for a band `styles: ['missing']`, and for duplicate id within one type; `buildData` output has sorted ids and `id`/`body` on each item; two `buildData` runs on shuffled input are `deepEqual`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** with the `yaml` package; `loadAll` takes id from the file name. Create the output directory in `build.js`.
- [ ] **Step 4: Run** `npm test` → PASS; also `node scripts/build.js` on an empty `data/` produces four empty arrays.
- [ ] **Step 5: Commit** `feat: entity IO, validation and build`.

### Task 3: Vault country-file parser

**Files:**
- Create: `scripts/lib/parse-country.js`
- Test: `tests/parse-country.test.js`

**Interfaces:**
- Consumes: `stripEmoji` (Task 1).
- Produces: `parseCountryFile(text: string): { prose: string, bands: RawBand[], skipped: string[] }` where `RawBand = { name: string, members: string[], headerTags: string[], inlineTags: string[], parentheticals: string[] }`. Tags are raw names without `~`, emoji and whitespace (`piano`, `w`).
- Rules: a line consisting only of `[[~x]]` tags is a style header and applies to following bands until the next header. If the file contains any line starting with `- `, those top-level bullets are bands, indented lines under a band are its members, and other non-empty lines are prose. If the file has no `- ` bullets (Cuba), every non-empty, non-header, non-indented line is a band and indented lines are members. Lines that fit none of this go to `skipped`.

- [ ] **Step 1: Write failing tests** with inline samples taken from the vault: (a) Algeria text (prose line, `[[~berber]] [[~gnawa]]`, bullets, `Maurice El Medioni [[~piano 🎹]]` → `inlineTags: ['piano']`, `headerTags: ['chaabi']`); (b) Cuba text (no bullets, Buena Vista Social Club has 5 members, `Juan Formell [[~bass]]#` → name `Juan Formell`, `Omar Sosa (piano)` → name `Omar Sosa`, `parentheticals: ['piano']`); (c) prose lines end up in `prose`, not `bands`; (d) an unparseable line appears in `skipped`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** line-by-line state machine; regex for tags `\[\[~([^\]]+)\]\]`, trailing `#` trimmed, parentheticals extracted from the end of the name.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: parse vault country files`.

### Task 4: Classification, merging and report

**Files:**
- Create: `scripts/lib/convert.js`, `scripts/tag-aliases.json` (initial `{}`)
- Test: `tests/convert.test.js`

**Interfaces:**
- Consumes: `parseCountryFile` (Task 3), `normalizeName`/`slugify` (Task 1), `Entity` (Task 2).
- Produces:
  - `type VaultInput = { countries: { continent: string, fileName: string, text: string }[], styles: string[], instruments: { name: string, icon?: string }[] }` (styles = file names, instruments from `~instruments/` file names, icon = trailing emoji)
  - `convertVault(input: VaultInput, aliases: Record<string,string>): { entities: Entity[], report: Report }`
  - `type Report = { counts: Record<string,number>, unknownTags: Record<string,number>, parentheticals: string[], skipped: string[], similarNames: string[][], slugCollisions: string[], ignoredFolders: string[] }`
  - Behaviour: aliases applied to tag names first; tag in styles list → style, in instruments list → instrument, `w` → `woman`, anything else → `tags` and `unknownTags`; band merge key = `normalizeName`; country `flag` taken from the leading emoji of `fileName` if present, name = file name without flag and `.md`; `similarNames` groups bands whose names are within edit distance 2 after normalisation but not equal.

- [ ] **Step 1: Write failing tests:** band in two countries with different case merges to one with both country ids; `~raggae` with alias `{raggae: 'reggae'}` and styles containing `reggae` becomes style `reggae`; unlisted `~usa` ends in `tags` and `unknownTags.usa === 1`; `~w` → `tags: ['woman']`; `Cankisou` and `Cankysou` stay two bands and appear in `similarNames`; two distinct bands slugifying to the same slug get `-2`; `Kurdistan.md` without flag yields country without `flag`; header style and inline instrument both land on the band.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `convertVault`; style and instrument entities are created for every listed name, even unused ones.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: convert parsed vault into entities`.

### Task 5: Migration CLI (two passes) and first real run

**Files:**
- Create: `scripts/migrate.js`
- Modify: `scripts/tag-aliases.json`
- Test: `tests/migrate.test.js` (small fake vault in a temp dir)

**Interfaces:**
- Consumes: `convertVault` (Task 4), `serializeEntity` (Task 2).
- Produces: CLI `node scripts/migrate.js <vaultDir> [--write]`. Reads folders `Africa, America, Asia, Australia, Europe, "Middle East"` (continent = slugified folder name), `~styles`, `~instruments`; ignores `raw`, `~ Jazz`, `~ eXperimental` (reported). Without `--write` it prints the report and writes `docs/migration-report.md` and prints a proposed alias list (each unknown tag within edit distance 2 of a listed style/instrument, e.g. `raggae → reggae`, plus `acapella → a-capella`-type pairs among listed names), writing nothing to `data/`. With `--write` it writes entity files to `data/`, refusing to overwrite a non-empty `data/` unless `--force`.

- [ ] **Step 1: Write failing test** on the fake vault: without `--write` no `data/` files appear and report mentions the ignored folders; with `--write` files exist and `loadAll` + `validate` return no errors.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the CLI; read files with `fs`, use `readdirSync` per folder (avoid shell globbing: file names contain emoji and spaces).
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Real pass 1:** run `node scripts/migrate.js /Users/petr.kolacek/vaults/music`. Expected: report with counts around 140 countries, ~450 band lines, unknown tags listed. **Stop and show the report and the proposed alias list to the user; wait for approval and edits to `scripts/tag-aliases.json`.**
- [ ] **Step 6: After approval, real pass 2:** `node scripts/migrate.js /Users/petr.kolacek/vaults/music --write`, then `npm run build`. Expected: build exits 0. Spot check 5 bands (Maurice El Medioni, Buena Vista Social Club, Zdob si Zdub, one band with `~w`) against the vault.
- [ ] **Step 7: Commit** `feat: migrate vault into data/` including `data/` and `docs/migration-report.md`.
