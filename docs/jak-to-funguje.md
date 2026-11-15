# Jak funguje Abduh

## Co to je

Abduh je webová aplikace jen pro čtení, která zobrazuje hudební sbírku: kapely, CD, poličky, styly, nástroje, země a tagy. Je napsaná v čistém JavaScriptu, CSS a HTML, bez frameworku a bez bundleru. Data jsou v repu jako textové soubory a na server se nahrávají jako jeden JSON.

## Hlavní myšlenka

```
data/ (Markdown soubory)  →  npm run build  →  public/data.json + public/img/  →  prohlížeč
```

1. Sbírka se spravuje jako Markdown soubory v `data/`.
2. **Build** je zvaliduje a slepí do jednoho `public/data.json` a zkopíruje obrázky.
3. **Aplikace** v `public/` je statická. Prohlížeč si stáhne `data.json` (asi 460 KB, 61 KB po zkomprimování), postaví si indexy v paměti a vše ostatní (hledání, filtry, stránky) dělá lokálně. Žádný server ani databáze.
4. **GitHub Actions** po každém pushi na `main` spustí build a nasadí složku `public/` na GitHub Pages.

## Složky

| Složka | Co v ní je |
|---|---|
| `data/` | **Zdroj pravdy.** Jeden `.md` soubor na entitu. |
| `data/bands`, `cds`, `shelves`, `countries`, `styles`, `instruments`, `tags` | Jednotlivé typy entit. |
| `data/images/` | Původní obrázky (AVIF 400×400), `bands/` a `cds/`. |
| `public/` | **Hotová aplikace**, kterou servíruje web. |
| `public/index.html` | Jediná stránka, načte moduly. |
| `public/app/` | JavaScript aplikace. |
| `public/css/` | Styly: tokeny (barvy, písma), základ, komponenty, stránky. |
| `public/fonts/`, `public/icons/`, `public/logo.svg` | Písma, ikony aplikace, logo. |
| `public/data.json`, `public/img/` | **Generované buildem.** Jsou v gitu, takže jsou vidět v diffech, ale ručně se neupravují. |
| `public/dev/` | Jen pro vývoj: ukázková data (`fixture.json`) a stránka s komponenty. |
| `scripts/` | Nástroje pro práci s daty a build (Node.js). |
| `tests/` | Automatické testy. |
| `docs/` | Návrhy, plány a report migrace. |
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

Vazby jsou přes ID, ne přes pozici, a build zkontroluje, že všechna ID existují. ID je název souboru bez `.md` a musí být unikátní napříč všemi typy (wikilinky se hledají podle názvu souboru). Na disku jsou odkazy zapsané jako wikilinky `[[id]]`, aby je Obsidian uměl následovat a ukazoval zpětné odkazy. Při načtení se z nich zase stanou holá ID, takže zbytek aplikace a `data.json` se nezměnily. Parser přijímá i `[[id|text]]`, `[[složka/id]]` a holé ID. Pole `aliases` se vždy doplní z `name`. Člen kapely (`members`) je buď jméno, nebo wikilink na jinou kapelu (`"[[id]]"`, na webu je to odkaz); skript `add-entity` odkáže členy, kteří už ve sbírce jsou jako kapely, a obráceně: nová kapela nahradí textové jméno člena v ostatních kapelách odkazem. Jednorázově (a opakovatelně) přepíše všechny soubory do tohoto tvaru `node scripts/to-wikilinks.js`. Aby šly přehledně vidět rozdíly v gitu, je každá entita samostatný soubor.

## Obsidian

Složka `data/` je zároveň Obsidian vault (otevřít přes „Open folder as vault"). Build ji neovlivní, čte jen složky s entitami.

- `data/.obsidian/` – sdílené nastavení (wikilinky, základní pluginy, šablony). Místní stav (`workspace.json`) je v `.gitignore`.
- `data/_views/*.base` – pohledy v Bases: Kapely (tabulka a karty s obrázky), CD (tabulka a karty), Police, Země, Styly, Nástroje, Tagy.
- `data/_templates/` – šablony pro nové entity (příkaz „Insert template"). Novou poznámku je potřeba vytvořit ve správné složce (`bands/`, `cds/`…), její název je ID.
- Kapely dané země, stylu nebo tagu a CD kapely se ukazují v panelu zpětných odkazů, bez dalšího kódu.

## Build proces

Spouští se `npm run build` (soubor `scripts/build.js`):

1. načte všechny `.md` z `data/` (`scripts/lib/entity-file.js`),
2. zvaliduje (`validate.js`: povinná pole, existence odkazů, formát odkazů, chybějící obrázky),
3. z gitu zjistí datum prvního commitu každého souboru a uloží ho jako `added`. Z toho se počítá „Nově zapsané" a razítko NOVÉ. Hromadné importy přes 50 souborů se ignorují, nové necommitnuté soubory dostanou dnešní datum (`added-dates.js`),
4. zapíše `public/data.json` (`build-data.js`) a zkopíruje použité obrázky do `public/img/`.

Pokud validace selže, build skončí chybou a nic nezapíše.

## Aplikace (`public/app/`)

- **`main.js`** je vstupní bod: načte data, postaví hlavičku a záložky, hlídá změnu adresy a vykresluje stránky.
- **`router.js`** čte adresu za `#` (hash router): `#/bands/tinariwen`, `#/search?q=kora`. Filtry jsou taky v adrese, takže se dají sdílet a funguje tlačítko Zpět.
- **`store.js`** postaví z `data.json` indexy (kapely podle země, stylu, nástroje, tagu, CD podle kapely, poličky podle položky).
- **`search.js`** je hledání: ignoruje diakritiku, velikost písmen, pomlčky a apostrofy, víc slov musí sedět všechna.
- **`filters.js`** řadí a filtruje kapely.
- **`views/`** je jeden soubor na stránku (home, bands, band, cds, cd, styles, style, instruments, instrument, countries, country, shelves, shelf, tags, tag, search, notfound). `_taxonomy.js` je sdílená šablona pro styly a tagy.
- **`ui/`** jsou sdílené kousky: `components.js` (řádek kapely, karta CD, chipy, razítkové odkazy), `virtual-list.js` (vykresluje jen viditelné řádky, proto je seznam 2 700 kapel plynulý), `theme.js` (světlý a tmavý motiv), `dom.js` (pomocná funkce na tvorbu prvků), `decor.js` (dekorace na stole).

Hodně logiky (hledání, router, indexy, filtry) je v čistých modulech bez prohlížeče, takže se dá testovat.

## Skripty (`scripts/`)

- `build.js` – popsáno výše.
- `add-entity.js` – zapíše kapelu, CD, poličku nebo tag (JSON na vstupu, hlídá duplicity). `--merge` doplní prázdná pole a připojí nové odkazy nebo položky na poličku.
- `add-image.js` – stáhne obrázek a převede ho na AVIF 400×400.
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

Většinou přes skill `abduh-add` (např. `/abduh-add <odkaz na Spotify>`). Ten dohledá údaje, zavolá `add-entity.js` a `add-image.js` a ověří build. Soubory v `data/` se ručně nepíšou, aby byl formát vždy správný.

## Možný redesign

Stránky se dnes staví v JavaScriptu (`public/app/views/`, pomocná funkce `h()`), ne ze šablon. Je to záměr: žádná závislost, žádný build navíc a texty z dat se vkládají přes textové uzly, takže se nemusí ošetřovat znaky HTML. Možné alternativy:

- **SSG (11ty a podobně):** při buildu by se vygenerovalo asi 3 000 HTML souborů. Hodilo by se pro SEO a stránky bez JavaScriptu, ale soukromá sbírka SEO nepotřebuje a build by se zkomplikoval. Hledání, filtry a virtuální seznam by stejně potřebovaly JS.
- **Šablony v prohlížeči (`<template>` + `cloneNode`):** HTML by bylo v souborech nebo v `index.html` a JS by jen doplnil data (přes `textContent`). Žádný SSG ani závislost. Dynamické části (filtry, podmínky, virtuální seznam) by zůstaly v JS.

### Který redesign co zasáhne

- **Kosmetický** (barvy, písma, rozestupy, tvary prvků): řeší jen CSS. Stačí upravit `public/css/tokens.css` (barvy, písma, rozměry) a `components.css` (chipy, razítka, karty). JavaScript se skoro nemění.
- **Strukturální** (jiné rozložení stránek, jiné seskupení prvků): zasáhne `views/`. Šablony by pomohly tím, že markup je vidět jako HTML a mění se na jednom místě, logika ale zůstane v JS.

### Kdy by šablony dávaly smysl

Hlavní přínos je při použití vizuálních návrhů z nástrojů (Claude Design, Stitch, Figma), které umí exportovat HTML a CSS. Export by se dal vložit do `<template>` a doplnit `data-` atributy, místo aby se ručně přepisoval do `h()` volání.

Nevýhody: víc míst, která se musí shodovat (HTML a JS; překlep v `data-` atributu se neprojeví chybou), spousta malých šablon pro komponenty a přepsání všech stránek.

### Doporučený postup

1. Zatím nic neměnit.
2. Až bude redesign, rozhodnout, jestli je kosmetický, nebo strukturální.
3. U strukturálního přepsat na šablony postupně: nejdřív jednu stránku, ověřit, že to opravdu zrychlí práci s exportem z designového nástroje, a teprve potom zbytek.
