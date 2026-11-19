# Abduh – podklady pro grafické návrhy

Cíl: nechat si nakreslit návrhy obrazovek. Kód píšeme sami (vanilla JS/CSS/HTML), takže od nástrojů chceme **jen vizuály**, žádný kód ani framework.

Postup: 1) společný kontext (níže), 2) prompt pro Claude Design, 3) prompt pro Stitch (po obrazovkách). Prompty jsou anglicky, protože je nástroje zvládají lépe; obsah dat zůstává v původním jazyce.

---

## Společný kontext (vlož na začátek obou promptů)

**Product:** Abduh is a personal, read-only web app for browsing my world-music collection. It is a single-page app (later a PWA), used mostly on a phone, also on desktop. No accounts, no editing in the UI.

**Real data (design for these numbers):**
- ~2,700 bands/musicians, 140 countries (grouped by 6 continents: Africa, America, Asia, Australia, Europe, Middle East), ~120 styles (e.g. rai, chaabi, desert blues, afrobeat, klezmer, cumbia, gnawa), 26 instruments (kora, oud, sitar, kamancheh, hurdy-gurdy, guitar, piano…).
- A fifth entity, CDs/albums, will start almost empty and grow slowly.
- Every entity has a **list page and a detail page**: bands, CDs, styles, instruments, countries.
- Most bands have **no image** – only a selected few have a square 400×400 photo. CDs have a square cover (optional). The design must look good and consistent with and without images (placeholders: country flag emoji, initials, instrument icon emoji).
- A band belongs to one or more countries, has styles, instruments, member names, optional links (Spotify, Bandcamp, website…), optional tags (e.g. "woman"), and a free-text bio in Czech/English.
- A country has a flag emoji, a continent, and a free-text description (history); styles and instruments have a name and, for instruments, an emoji icon.
- Language of the UI: Czech. Band names are international (Latin script, diacritics).

**Mood – "my writing desk":** The feeling must be: *I am looking at my own desk. I use a typewriter, a fountain pen, a label maker for labelling objects, a handwritten diary.* Everything is **stylized and simple – flat, no photorealism, no skeuomorphic textures, no 3D, no heavy shadows**. Desk objects only drift through the background as quiet, low-contrast flat silhouettes/line drawings (typewriter, fountain pen, ink bottle, label maker, paper clips, stamp, pencil, loose notes, coffee ring, a ruler); they never compete with the content and are decorative only. Warm, curious, calm, dense but readable; a personal archive/catalogue rather than a streaming-service clone. Avoid generic "SaaS dashboard" look and stock music clichés (no vinyl-with-headphones icons).

**Visual language (derive everything from the desk):**
- **Colors:** warm paper background (cream/ivory, slightly aged), ink-blue or ink-black text (fountain-pen ink), one accent from a label maker (e.g. embossed-tape red or label-tape black with white text), a secondary muted tone such as typewriter-ribbon red/faded green. Dark theme = a dark desk / night lamp (deep brown-black, warm paper-white text), not cold gray.
- **Typography:** three roles. (1) **Typewriter monospace/slab** for headings, counts and catalogue numbers (Special Elite / Courier Prime / IBM Plex Mono style). (2) **Handwriting / fountain-pen script** used sparingly for notes, bios, annotations and small marginal comments (Caveat / Reenie Beanie / Homemade Apple style, must stay legible and support Czech diacritics). (3) A **very readable serif or humanist text face** for long text and lists. Label-maker style (uppercase, tracked-out, on a strip) for chips and tags.
- **Components as desk objects (flat, stylized):** chips/tags = label-maker tape strips; list rows = index-card or ruled-notebook lines; cards = paper notes or index cards with a paper clip or tape corner; section headings = typed with a ribbon underline; dividers = hand-drawn pen lines; counts = typewriter numerals; search field = a typed line on paper with a blinking cursor; buttons/links = rubber stamps or stuck labels; bottom tab bar = tabbed dividers (index-card tabs). Photos = square prints with a small tape/corner, slightly rotated (a few degrees at most).
- **Placeholders without image:** a typed index card with initials in typewriter font plus the country flag emoji.
- **Details:** subtle paper grain at most (flat, vector-like), hand-drawn underline/circle for active states, ink-smudge or stamp for "new", pencil check marks. Motion ideas (optional): objects slowly drifting in the background, label "printing out" on arrival.
- **Restraint:** big lists (2,700 rows) must stay clean and fast to scan – the desk flavour lives in type, colour, labels and a few background objects, not in decoration on every row.

**Constraints:** mobile-first (375 px) plus desktop (1280 px); light and dark theme; accessible contrast; big lists must be scannable (alphabet index, counts, filters); no login, no cart, no player.

**Deliverable:** visual designs only (no code, no framework). Consistent component set: top navigation, search field, filter chips, list rows, cards (with and without image), detail header, link buttons, tag/chip, empty state.

---

## Prompt pro Claude Design

```
Design the visual identity and key screens for "Abduh", a personal read-only web app for browsing a world-music collection. I only want designs (a small design system plus screens), not code.

[paste "Společný kontext" here]

Please produce:

1. A compact design system built on the "my writing desk" language above: color palette (light = paper desk, dark = night lamp), type system (typewriter face + handwriting face + readable text face, all supporting Czech diacritics), a small set of flat background desk objects (typewriter, fountain pen, ink bottle, label maker, paper clips, stamp, notes) with rules for how sparsely they appear, spacing scale, and components: top nav / bottom tab bar on mobile, search field, filter chips, alphabet jump index, list row (with and without image), card, detail header, link button, tag chip, empty state.

2. Screens, each in mobile (375 px) and desktop (1280 px):
   - Home: global search, counts per entity, "recently added", "random discovery".
   - Bands list: 2,700 items – search, filters (country, style, instrument, with image only), sort, A–Z index.
   - Band detail: optional photo, name, flags of countries, style and instrument chips, members, external links, discography (CDs), bio. Show a variant WITHOUT photo.
   - CDs list (grid of covers) and CD detail (cover, band(s), year, label, links, notes).
   - Styles list and style detail (description + bands).
   - Instruments list (emoji icon + count) and instrument detail (bands that play it).
   - Countries list grouped by continent (flag, count) and country detail (flag, history text, bands grouped by style).
   - Global search results across all entities.
   - Empty state (no CDs yet) and 404.

3. Explore 2–3 distinct visual directions first (short moodboard-level frames), then develop the one I pick into the full set. Explain in one sentence per direction what makes it different.

Use realistic sample content: Tinariwen (Mali/Algeria, desert blues, guitar), Khaled (Algeria, rai), Buena Vista Social Club (Cuba), Zdob si Zdub (Moldova), Rachid Taha, Omara Portuondo, Ali Farka Toure, plus ~20 more across all continents.
```

---

## Prompty pro Stitch (po obrazovkách)

Stitch funguje nejlíp, když se zadá jedna obrazovka po druhé a drží se stejný styl. Každý prompt začíná stejným stylovým blokem.

**Stylový blok (vlož před každý prompt):**

```
App: "Abduh" – personal world-music collection browser, Czech UI. Mood: "I am looking at my own writing desk" – typewriter, fountain pen, label maker, handwritten diary. Everything flat, stylized and simple, no photorealism, no 3D; desk objects (typewriter, pen, ink bottle, label maker, paper clips, stamp) only drift quietly in the low-contrast background. Warm cream paper background, ink-blue/black text, one label-tape accent colour. Typewriter font for headings and numbers, handwriting font for notes and bios, readable serif for lists. Chips = label-maker tape strips, cards = index cards/paper notes, bottom tabs = index-card dividers. Flags and emoji as visual anchors. Not a streaming-service clone, not a SaaS dashboard. Mobile-first 375 px, also produce a desktop 1280 px version. Provide light and dark theme (dark = night lamp, warm). Design only, no code. Keep components consistent across all screens; long lists must stay clean and scannable.
```

**1. Home**
```
Home screen: big global search field, four count tiles (2,718 Kapely, 140 Země, 123 Styly, 26 Nástroje) linking to lists, a "Nově přidáno" horizontal strip, a "Náhodný objev" card (band with flag, styles, instrument chips). Bottom tab bar on mobile: Kapely, CD, Styly, Nástroje, Země.
```

**2. Seznam kapel**
```
Bands list with ~2,700 rows. Each row: small square thumbnail OR placeholder (flag emoji on colored tile), band name, country flags, up to 3 style chips. Sticky search field, filter chips (Země, Styl, Nástroj, Jen s obrázkem), sort menu, and an A–Z jump index on the right edge. Show a variant with the filter sheet open.
```

**3. Detail kapely**
```
Band detail for "Tinariwen" (Mali, Algeria; desert blues, tishoumaren; guitar). Header with square photo, name, flags, style and instrument chips, members list, link buttons (Spotify, Bandcamp, Web), discography as a row of CD covers, then a long Czech bio. Also design the variant for a band WITHOUT a photo (placeholder using flag and initials).
```

**4. Seznam CD + detail CD**
```
CDs list as a grid of square covers (title, band, year) and CD detail (large cover, title, band link(s), year, label, link buttons, notes). Include an empty state for "Zatím žádná CD" with a friendly illustration-free message.
```

**5. Styly (seznam + detail)**
```
Styles list (about 120 items): name, number of bands, small row of 3 flags of the most common countries, sortable by name or count. Style detail "rai": short description and a list of bands grouped by country.
```

**6. Nástroje (seznam + detail)**
```
Instruments list (26 items) as a grid of large emoji icons with name and band count (kora, oud, sitar, kamancheh, hurdy-gurdy, guitar, piano, sax…). Instrument detail "kora": the bands that play it, as list rows.
```

**7. Země (seznam + detail)**
```
Countries list grouped by continent (Africa, America, Asia, Australia, Europe, Middle East), each item a flag, country name and band count; optional compact world-map variant. Country detail "Alžírsko": big flag, a long Czech history text, and bands grouped by style (berber, gnawa, rai, chaabi).
```

**8. Hledání a prázdné stavy**
```
Global search results grouped by entity (Kapely, CD, Styly, Nástroje, Země) with highlighted matches and counts per group. Also: a "no results" empty state and a 404 page in the same style.
```

---

## Tipy

- Po prvním výsledku si vyžádejte **2–3 vizuální směry** a teprve pak jeden rozpracujte do všech obrazovek; ušetří to přepracování.
- Nechte si vždy navrhnout **variantu bez obrázku**: většina kapel obrázek mít nebude.
- Motiv psacího stolu hlídejte: předměty jen jako tichý plochý podklad, žádný fotorealismus ani textury. Pokud nástroj přehání (dekorace na každém řádku), napište „less decoration in lists, keep desk objects only in the background and header".
- Z výstupu si zapište: paleta (hex), tři písma (psací stroj / rukopis / text), podoba štítku (chip) a karty. Půjdou rovnou do CSS proměnných; písma najdeme na Google Fonts.
- Výstupy (screenshoty, případně export) ukládejte do `docs/design/` – později z nich vezmeme barvy, písma a komponenty do CSS.
