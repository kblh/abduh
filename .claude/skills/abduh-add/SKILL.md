---
name: abduh-add
description: Přidá kapelu nebo album (CD) do sbírky Abduh (data/ v tomto repu) – i s obrázkem a odkazy. Použij na „přidej album Tassili od Tinariwen", „přidej kapelu X", na odkazy ze Spotify/Bandcampu/webu a na „importuj z Apple Notes".
---

# abduh-add

Přidává obsah do `data/` (Markdown + YAML frontmatter, viz `docs/superpowers/specs/`). Soubory nikdy nepiš ručně – vždy přes skripty níže. Nic necommituj.

## Postup

1. **Urči, co se přidává:** kapela, nebo CD (album). Vstupem je věta, URL (Spotify, Bandcamp, web…) nebo poznámka z Apple Notes (viz níže).
2. **Najdi údaje** z veřejných zdrojů (MusicBrainz + Cover Art Archive, Wikipedia, stránka za zadaným odkazem). Co nenajdeš, **nevymýšlej** a vynech. Pro CD: `name`, `bands`, `year`, `label`, odkazy. Pro kapelu: `name`, `countries` (povinné; když zemi nenajdeš, zeptej se), odkazy.
3. **Styly a nástroje** jen z existujících (`ls data/styles data/instruments`); jinak vynech. Tag `woman` je poznámka u žen.
4. **Zjisti, zda kapela existuje** (`ls data/bands`). Když ne, nejdřív ji přidej. Existující entity nepřepisuj; chybějící pole doplň přes `--merge` a jen s potvrzením uživatele.
5. **Zapiš entitu** – JSON na stdin:
   ```
   node scripts/add-entity.js [--merge] <<'JSON'
   {"type":"cd","fields":{"name":"Tassili","bands":["tinariwen"],"year":2011,"label":"Anti-","links":[{"type":"bandcamp","url":"https://…"}]}}
   JSON
   ```
   Vypíše `{id, created}`. Typy odkazů: spotify, bandcamp, apple-music, youtube, website, wikipedia, discogs, other (`node scripts/extract-links.js < text` je určí z URL). Země jsou ID ze `data/countries/`.
6. **Obrázek** (volitelný, jen když ho uživatel chce nebo je to cover k CD, který snadno najdeš): `node scripts/add-image.js <band|cd> <id> <url|soubor> [--source <url>]`. Převede na AVIF 400×400. Respektuj licence; `--source` uveď vždy.
7. **Ověř:** `npm run build` (musí skončit bez chyby).
8. **Shrň** uživateli, co bylo přidáno a co se nenašlo. Nic necommituj.

## Apple Notes

Jedna poznámka může obsahovat více odkazů.
1. `node scripts/apple-notes.js <hledaný text>` → JSON `[{name, text}]` (jen čtení; při prvním použití macOS vyžádá povolení Automation pro Notes).
2. Z `text` vytáhni odkazy: `node scripts/extract-links.js < text`.
3. Při více než jednom odkazu nejdřív **potvrď s uživatelem počet** a pak zpracuj každý jako samostatnou položku (kroky 1–7).

## Pozor

- Duplicitu hlídej: `add-entity` odmítne existující entitu. **Nikdy nepoužívej `--force`** (přepsal by existující entitu); doplnění chybějících polí dělá `--merge`, a to jen s potvrzením uživatele.
- Výměna už existujícího obrázku (`add-image --force`) jen na výslovné přání uživatele.
- Obrázky nejsou povinné ani u CD.
