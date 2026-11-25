# Jak funguje Abduh

## Co to je

Abduh je webová aplikace jen pro čtení, která zobrazuje hudební sbírku: kapely, CD, poličky, styly, nástroje, země a tagy. Je napsaná v čistém JavaScriptu, CSS a HTML, bez frameworku a bez bundleru. Data jsou v repu jako textové soubory a na server se nahrávají jako jeden JSON.

## Hlavní myšlenka

```
abduh-data/ (Markdown soubory)  →  npm run build  →  public/data.json + public/img/  →  prohlížeč
```

1. Sbírka se spravuje jako Markdown soubory v `abduh-data/`.
2. **Build** je zvaliduje a slepí do jednoho `public/data.json` a zkopíruje obrázky.
3. **Aplikace** v `public/` je statická. Prohlížeč si stáhne `data.json` (asi 460 KB, 61 KB po zkomprimování), postaví si indexy v paměti a vše ostatní (hledání, filtry, stránky) dělá lokálně. Žádný server ani databáze.
4. **GitHub Actions** po každém pushi na `main` spustí build a nasadí složku `public/` na GitHub Pages.

## Složky

| Složka | Co v ní je |
|---|---|
| `abduh-data/` | **Zdroj pravdy.** Jeden `.md` soubor na entitu. |
| `abduh-data/bands`, `cds`, `shelves`, `countries`, `styles`, `instruments`, `tags` | Jednotlivé typy entit. |
| `abduh-data/images/` | Původní obrázky (AVIF 400×400), `bands/`, `cds/` a `instruments/`. |
| `public/` | **Hotová aplikace**, kterou servíruje web. |
| `public/index.html` | Jediná stránka, načte moduly. |
| `public/app/` | JavaScript aplikace. |
| `public/css/` | Styly: tokeny (barvy, písma), základ, komponenty, stránky. |
| `public/fonts/`, `public/icons/`, `public/logo.svg` | Písma (Archivo Black, Work Sans, Space Mono, lokálně), ikony aplikace (generuje `scripts/make-icons.mjs` z loga), logo (červený equalizer bez pozadí). |
| `public/data.json`, `public/img/` | **Generované buildem.** Jsou v gitu, takže jsou vidět v diffech, ale ručně se neupravují. |
| `public/dev/` | Jen pro vývoj: ukázková data (`fixture.json`) a stránka s komponenty. |
| `scripts/` | Nástroje pro práci s daty a build (Node.js). |
| `tests/` | Automatické testy. |
| `docs/` | Tento popis, návrh vzhledu `voicebox-DESIGN.md`, plány a report migrace. |
| `.github/workflows/pages.yml` | Nasazení na GitHub Pages. |
| `.claude/skills/abduh-add/` | Skill pro přidávání obsahu přes Claude. |
| `node_modules/`, `.superpowers/` | Závislosti a pracovní soubory, nejsou v gitu. |

## Formát dat

Každý soubor má nahoře strukturovaná data (YAML) a pod nimi volný text:

```
---
name: Tinariwen
aliases: [Tinariwen]     # jen pro Obsidian (našeptávání podle názvu), build ho zahodí
countries: ["[[mali]]"]  # odkazy na jiné entity: wikilink na ID (název souboru)
styles: ["[[tuareg]]"]
image: bands/tinariwen.avif
links:
  - type: spotify
    url: https://…
---
Volný text (bio).
```

Vazby jsou přes ID, ne přes pozici, a build zkontroluje, že všechna ID existují. ID je název souboru bez `.md` a musí být unikátní napříč všemi typy (wikilinky se hledají podle názvu souboru). Na disku jsou odkazy zapsané jako wikilinky `[[id]]`, aby je Obsidian uměl následovat a ukazoval zpětné odkazy. Při načtení se z nich zase stanou holá ID, takže zbytek aplikace a `data.json` se nezměnily. Parser přijímá i `[[id|text]]`, `[[složka/id]]` a holé ID. Pole `aliases` se vždy doplní z `name`. Člen kapely (`members`) je buď jméno, nebo wikilink na jinou kapelu (`"[[id]]"`, na webu je to odkaz); skript `add-entity` odkáže členy, kteří už ve sbírce jsou jako kapely, a obráceně: nová kapela nahradí textové jméno člena v ostatních kapelách odkazem. Jednorázově (a opakovatelně) přepíše všechny soubory do tohoto tvaru `node scripts/to-wikilinks.js`. Bio může obsahovat wikilinky na jiné entity (`[[id|text]]`, na webu odkaz). Jména kapel v bio odkazuje automaticky `add-entity` (nové bio) a hromadně `node scripts/link-bios.js [--write]` (včetně skloněných tvarů; bez `--write` jen přehled; opakovatelně, existující odkazy nechává). Aby šly přehledně vidět rozdíly v gitu, je každá entita samostatný soubor.

## Obsidian

Složka `abduh-data/` je zároveň Obsidian vault (otevřít přes „Open folder as vault"). Build ji neovlivní, čte jen složky s entitami.

- `abduh-data/.obsidian/` – sdílené nastavení (wikilinky, základní pluginy, šablony). Místní stav (`workspace.json`) je v `.gitignore`.
- `abduh-data/_views/*.base` – pohledy v Bases: Kapely (tabulka a karty s obrázky), CD (tabulka a karty), Police, Země, Styly, Nástroje, Tagy.
- `abduh-data/_templates/` – šablony pro nové entity (příkaz „Insert template"). Novou poznámku je potřeba vytvořit ve správné složce (`bands/`, `cds/`…), její název je ID.
- Kapely dané země, stylu nebo tagu a CD kapely se ukazují v panelu zpětných odkazů, bez dalšího kódu.

## Build proces

Spouští se `npm run build` (soubor `scripts/build.js`):

1. načte všechny `.md` z `abduh-data/` (`scripts/lib/entity-file.js`),
2. zvaliduje (`validate.js`: povinná pole, existence odkazů, formát odkazů, chybějící obrázky),
3. z gitu zjistí datum prvního commitu každého souboru (`added`) a datum posledního commitu, který ho změnil (`modified`, jen pokud se liší od `added`). Z toho se počítají sekce „nové a upravené" na homepage a razítko NOVÉ (do 30 dnů od `added`). Hromadné commity přes 50 souborů se ignorují (původní import, přejmenování `data/` → `abduh-data/`; starou cestu `data/` čte `added-dates.js` taky). Necommitnuté nové i změněné soubory dostanou dnešní datum. Protože datum je jen den, `build-data.js` navíc přidá `rank` (0 = nejnovější podle pořadí v gitu) 12 nejnovějším záznamům každé skupiny, aby se záznamy ze stejného dne řadily podle skutečného pořadí a ne podle abecedy,
4. zapíše `public/data.json` (`build-data.js`) a zkopíruje použité obrázky do `public/img/`.

Pokud validace selže, build skončí chybou a nic nezapíše.

## Aplikace (`public/app/`)

- **`main.js`** je vstupní bod: načte data, postaví hlavičku a záložky, hlídá změnu adresy a vykresluje stránky. Obsluhuje klávesové zkratky: `/` a `⌘K` (Ctrl+K) přesunou kurzor do globálního hledání (velké pole na homepage a hledání, jinak pole v hlavičce, na mobilu otevřou stránku hledání).
- **`router.js`** čte adresu za `#` (hash router): `#/bands/tinariwen`, `#/search?q=kora`. Filtry jsou taky v adrese, takže se dají sdílet a funguje tlačítko Zpět.
- **`store.js`** postaví z `data.json` indexy (kapely podle země, stylu, nástroje, tagu, CD podle kapely, poličky podle položky). `recentlyChanged(store, group, n)` řadí podle `modified ?? added`, při shodě podle `rank`, pak podle jména.
- **`search.js`** je hledání: ignoruje diakritiku, velikost písmen, pomlčky a apostrofy, víc slov musí sedět všechna.
- **`filters.js`** řadí a filtruje kapely.
- **`views/`** je jeden soubor na stránku (home, bands, band, cds, cd, styles, style, instruments, instrument, countries, country, shelves, shelf, tags, tag, search, notfound). `_taxonomy.js` je sdílená šablona rejstříku (A, B, C + hledání) a detailu pro styly, nástroje a tagy; `instruments.js`, `styles.js` a `tags.js` jsou jen volání `registerView`.
- **`ui/`** jsou sdílené kousky: `components.js` (řádek kapely, karta CD, chipy, razítkové odkazy, `sectionTitle(text, count, iconKey)`), `icons.js` (čárové SVG ikony pro záložky, dlaždice a nadpisy: home, bands, cds, shelves, styles, instruments, countries, tags; `icon(key)`), `virtual-list.js` (vykresluje jen viditelné řádky, proto je seznam 2 700 kapel plynulý), `theme.js` (světlý a tmavý motiv), `dom.js` (pomocná funkce na tvorbu prvků).

### Podoba stránek

- **Homepage:** hledání, dlaždice s počty (Kapely přes celou šířku na mobilu, 2 sloupce do 479 px, 3 od 480 px), pak 12 nejnovějších kapel, trojice Styly / Nástroje / Tagy (po 5 nově zapsaných nebo upravených, s datem a razítkem NOVÉ) a úplně dole Náhodný objev. CD na homepage nejsou.
- **Detail kapely** (nejdůležitější pohled): hlavička (foto, země, odkazy), bio a členové, vedle Diskografie pravý sloupec Styly (chipy), Nástroje a Tagy (chip + u nástroje fotka + zkrácený popis, 140 znaků). Sekce se zobrazí jen při obsahu. Pak „Taky <styl>" a poličky.
- **Detail nástroje:** velká fotka (nebo velké písmeno názvu), popis, počet kapel pod názvem (`.detail-main > .count`), filtry země a stylu. U nástrojů se nezobrazují emoji (pole `icon` v datech zůstává nepoužité).
- **Nadpisy stránek** (`.page-title`) a sekcí (`.section-title`) jsou flex s ikonou; poznámka a počet se zalamují jako celek na nový řádek.

### Vzhled (VoiceBox)

Vzhled vychází z `docs/voicebox-DESIGN.md`: černá, bílá a jediná červená `#ef4444` (akcenty, ikony), nadpisy Archivo Black, text Work Sans, mono Space Mono, tloušťka rámečků 2 px, žádné zaoblení (kromě kruhových avatarů), žádné stíny. Tmavý motiv je invertovaná paleta (není ve specifikaci). Tokeny jsou v `public/css/tokens.css`, základ v `base.css`, komponenty v `components.css`, stránky v `views.css`. Vlajky zemí jsou emoji. Placeholder miniatury mají kontrastní pozadí bez rámečku.

Pasti, na které jsme narazili:

- **Řádek seznamu kapel má 66 px** a musí odpovídat `rowHeight` ve `views/bands.js` (virtuální seznam) i `--row-h` v tokenech.
- **Grid a `nowrap` text:** auto stopa roztáhne sloupec na min-content a přeteče. Používat `minmax(0, 1fr)` a `min-width: 0`.
- **Hlavička** se na mobilu vejde do jednoho řádku až do 250 px díky `clamp()` u loga a nástrojů. Na mobilu jsou v záložkách jen ikony (Domů, Kapely, Poličky, Styly, Nástroje, Země); CD a Tagy jsou jen v desktopové navigaci a na homepage.
- Čísla se na dlaždicích píšou bez mezery jako oddělovač tisíců (nbsp přetékal).
- Okno prohlížeče při testech nejde pod ~600 px, úzké šířky se ověřují přes iframe dané šířky.

## Skripty (`scripts/`)

- `build.js` – popsáno výše.
- `add-entity.js` – zapíše kapelu, CD, poličku, tag, styl nebo nástroj (JSON na vstupu, hlídá duplicity; ID jsou unikátní napříč typy, např. `lira` je kapela, a proto nástroj je `lira-nastroj`). `--merge` doplní prázdná pole a připojí nové odkazy, členy, tagy nebo položky na poličku.
- `add-image.js` – stáhne obrázek (nebo vezme lokální soubor) a převede ho na AVIF 400×400 oříznutím na čtverec. Typy `band`, `cd`, `instrument`. Když server vrátí chybu (např. Wikimedia 429), stáhnout přes `curl -A "Mozilla/5.0"` a předat lokální cestu.
- `add-bandcamp-ids.js` – každému CD s odkazem na Bandcamp album doplní `bandcamp_id` (číselné ID alba z HTML stránky). Podle něj detail CD na konci stránky ukáže embed přehrávač Bandcampu. Nemá-li CD použitelné Bandcamp ID, ukáže se embed přehrávač Spotify (odvozený z odkazu na album, nic se neukládá); má-li obojí, vyhrává Bandcamp.
- `extract-links.js`, `apple-notes.js` – pomůcky pro skill.
- `migrate.js` – jednorázový převod ze starého Obsidian vaultu (už proběhl).
- `serve.js` – lokální server, `make-fixture.mjs` – ukázková data, `make-icons.mjs` – ikony aplikace z loga.

## Příkazy

- `npm run build` – validace a build.
- `npm run serve` – lokální běh na http://localhost:5173 (`?fixture=1` načte ukázková data).
- `npm test` – testy.

## Nasazení

Při každém pushi na `main` workflow `pages.yml` udělá: checkout s celou historií (potřeba kvůli datu `added`), `npm ci`, `npm test`, `npm run build` a nahraje `public/` na GitHub Pages. Aplikace je na `https://kblh.github.io/abduh/`. Pokud testy nebo build selžou, nic se nenasadí.

## Přidávání obsahu

Většinou přes skill `abduh-add` (např. `/abduh-add <odkaz na Spotify>`). Ten dohledá údaje, zavolá `add-entity.js` a `add-image.js` a ověří build. Soubory v `abduh-data/` se ručně nepíšou, aby byl formát vždy správný.

## Redesign (stav)

Redesign podle VoiceBox je hotový jako kosmetický (CSS) s úpravami `views/` (homepage, detail kapely, nadpisy). Níže jsou původní úvahy o šablonách; zatím se nic z nich nezavádí.

### Původní úvahy

Stránky se dnes staví v JavaScriptu (`public/app/views/`, pomocná funkce `h()`), ne ze šablon. Je to záměr: žádná závislost, žádný build navíc a texty z dat se vkládají přes textové uzly, takže se nemusí ošetřovat znaky HTML. Možné alternativy:

- **SSG (11ty a podobně):** při buildu by se vygenerovalo asi 3 000 HTML souborů. Hodilo by se pro SEO a stránky bez JavaScriptu, ale soukromá sbírka SEO nepotřebuje a build by se zkomplikoval. Hledání, filtry a virtuální seznam by stejně potřebovaly JS.
- **Šablony v prohlížeči (`<template>` + `cloneNode`):** HTML by bylo v souborech nebo v `index.html` a JS by jen doplnil data (přes `textContent`). Žádný SSG ani závislost. Dynamické části (filtry, podmínky, virtuální seznam) by zůstaly v JS.

#### Který redesign co zasáhne

- **Kosmetický** (barvy, písma, rozestupy, tvary prvků): řeší jen CSS. Stačí upravit `public/css/tokens.css` (barvy, písma, rozměry) a `components.css` (chipy, razítka, karty). JavaScript se skoro nemění.
- **Strukturální** (jiné rozložení stránek, jiné seskupení prvků): zasáhne `views/`. Šablony by pomohly tím, že markup je vidět jako HTML a mění se na jednom místě, logika ale zůstane v JS.

#### Kdy by šablony dávaly smysl

Hlavní přínos je při použití vizuálních návrhů z nástrojů (Claude Design, Stitch, Figma), které umí exportovat HTML a CSS. Export by se dal vložit do `<template>` a doplnit `data-` atributy, místo aby se ručně přepisoval do `h()` volání.

Nevýhody: víc míst, která se musí shodovat (HTML a JS; překlep v `data-` atributu se neprojeví chybou), spousta malých šablon pro komponenty a přepsání všech stránek.

#### Doporučený postup

1. Zatím nic neměnit.
2. Až bude redesign, rozhodnout, jestli je kosmetický, nebo strukturální.
3. U strukturálního přepsat na šablony postupně: nejdřív jednu stránku, ověřit, že to opravdu zrychlí práci s exportem z designového nástroje, a teprve potom zbytek.
