# abduh

Osobní hudební sbírka: data v `data/` (Markdown + YAML), build do `public/data.json` a `public/img/`.

- `npm run build` – validace a build dat
- `npm test` – testy
- `npm run migrate -- <vault>` – jednorázová migrace z Obsidian vaultu
- Přidávání obsahu: skill `abduh-add` (kapely, CD, obrázky, odkazy), používá `scripts/add-entity.js`, `scripts/add-image.js`, `scripts/extract-links.js`, `scripts/apple-notes.js`
- Návrh a plány: `docs/superpowers/`
