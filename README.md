# abduh

Osobní hudební sbírka: data v `abduh-data/` (Markdown + YAML), build do `public/data.json` a `public/img/`.

- `npm run build` – validace a build dat
- `npm test` – testy
- `npm run migrate -- <vault>` – jednorázová migrace z Obsidian vaultu
- `npm run serve` – webová aplikace na http://localhost:5173 (nejdřív `npm run build`); `?fixture=1` načte ukázková data z `public/dev/fixture.json` (CD, obrázky, poličky), `scripts/make-fixture.mjs` je přegeneruje
- Přidávání obsahu: skill `abduh-add` (kapely, CD, obrázky, odkazy), používá `scripts/add-entity.js`, `scripts/add-image.js`, `scripts/extract-links.js`, `scripts/apple-notes.js`
- Jak aplikace funguje (data, build, stránky, vzhled, pasti): `docs/jak-to-funguje.md`; návrh vzhledu `docs/voicebox-DESIGN.md`
- Návrh a plány: `docs/superpowers/`
