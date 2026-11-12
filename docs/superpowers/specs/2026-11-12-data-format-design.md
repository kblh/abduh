# Abduh – datový formát a migrace (design)

## Záměr

Abduh je webová aplikace (SPA, vanilla JS/CSS/HTML, možná PWA), která zobrazuje (pouze čte) osobní hudební sbírku: hudebníky/kapely, styly, nástroje a země. Každá entita má v aplikaci list a detail. **Vzhled a pohledy aplikace jsou mimo rozsah tohoto dokumentu** – řeší se později.

Tento dokument pokrývá jen: (1) formát dat v repu, (2) jednorázovou migraci ze stávajícího Obsidian vaultu, (3) build krok, který data připraví pro aplikaci.

Proč: data se budou doplňovat ručně a pomocí Claude skillů, takže musí být čitelná, diffovatelná v gitu a odolná proti překlepům. Aplikace potřebuje jen rychlé čtení.

## Cíle

- Jeden Markdown soubor na entitu, strukturovaná data v YAML frontmatteru, volný text v těle.
- Vazby mezi entitami přes ID (slug), ne přes pozici v souboru.
- Build skript vygeneruje jeden `data.json` pro aplikaci a zvaliduje vazby (neexistující ID = chyba).
- Migrační skript převede stávající vault do nové struktury.

## Mimo rozsah / anti-cíle

- Zápis z aplikace (aplikace je jen read-only).
- Návrh UI, routování, PWA.
- Úprava zdrojového vaultu. Migrace z něj jen čte.
- Soubory v `raw/` ve vaultu (byl to pokus) se **ignorují**.
- Alba/diskografie: ve vaultu nejsou. Pole se přidá, až bude k dispozici zdroj dat.
- Nepoužívat JSON jako zdroj pravdy (ruční editace je křehká).

## Zdroj (vault `/Users/petr.kolacek/vaults/music`)

- Země: `Africa/`, `America/`, `Asia/`, `Australia/`, `Europe/`, `Middle East/` (140 souborů, název `🇩🇿 Algeria.md`; ve složkách jsou i regiony bez státu, např. Kurdistan, Tibet, Hawaii, Tuva). Kontinent = složka.
- Uvnitř souboru země: volný text o zemi, hlavičky stylu `[[~styl]]` a pod nimi odrážky `- Kapela`; členové kapely jsou odsazené odrážky. Některé soubory (např. Cuba) hlavičky stylu nemají a kapely jsou i jako holé řádky bez `- `; styly jsou pak jen inline tagy `[[~rap]]`.
- Inline tagy u kapely: `[[~piano 🎹]]` (nástroj), `[[~rap]]` (styl), `[[~w]]` aj.
- `~styles/` a `~instruments/`: soubory s jen nadpisem (seznam platných stylů/nástrojů, ~100 / ~30). Emoji v názvu nástroje je ikona.
- `~ Jazz/`, `~ eXperimental/`: volné poznámky mimo hlavní strukturu (viz otevřené body).

## Cílová struktura

```
data/
  bands/<slug>.md
  countries/<slug>.md
  styles/<slug>.md
  instruments/<slug>.md
scripts/
  migrate.*      jednorázově: vault -> data/
  build.*        data/ -> public/data.json (+ validace)
```

Slug = malými písmeny, bez diakritiky a emoji, pomlčky (`desert-blues`, `united-kingdom`).

### Frontmatter

**Kapela** (`bands/`)
```yaml
name: Maurice El Medioni
countries: [algeria]          # povinné, >= 1
styles: [chaabi]              # volitelné
instruments: [piano]          # volitelné
members: [Compay Segundo]     # volitelné, jen jména (řetězce)
tags: [woman]                 # volné poznámky, viz níže
```
Tělo = volitelné bio (Markdown).

**Země** (`countries/`): `name`, `continent` (africa|america|asia|australia|europe|middle-east), `flag` (emoji, volitelné). Tělo = volný text o zemi.

**Styl** (`styles/`): `name`. Tělo volitelné.

**Nástroj** (`instruments/`): `name`, `icon` (emoji, volitelné). Tělo volitelné.

### Tagy

Pole `tags` je pro vše, co není styl, nástroj ani země: `woman` (z `~w`; poznámka, že jde o ženu, protože ze jména to není vždy jasné), `usa`, `diaspora`, `fusion`, `politic` atd. Tagy jsou volný seznam bez vlastních souborů.

## Migrace

- Čte vault, zapisuje do `data/`. Spustí se jednorázově; výsledek se zkontroluje a commitne.
- Kapela, která se objeví ve více souborech zemí (po normalizaci jména), se sloučí do jedné s více `countries`.
- Styl kapely = poslední hlavička `[[~styl]]` nad ní + inline `~` tagy, které jsou ve `~styles/`. Nástroj = inline tag ze `~instruments/`. Ostatní `~` tagy → `tags`.
- Slovník sloučení překlepů/variant (např. `~raggae`→`reggae`, `~gipsy`→`gypsy`, `~acapella`→`a-capella`): vytvoří se jako samostatný soubor a **předloží se uživateli ke schválení před zápisem dat**.
- Odrážky v závorce typu `(1911 - 1970)` nebo `(piano)` se nezahodí potichu: skript je vypíše do reportu pro ruční kontrolu.
- Migrace vypíše report: počty entit, tagy bez zařazení, kapely s nejistým zařazením.
- Obrázky a HTML se ignorují (jako v README vaultu).

## Build

- `data/` → `public/data.json`: pole entit se vzájemnými ID. Validace: neexistující slug ve vazbě, duplicitní slug, chybějící povinné pole = chyba buildu.
- Build je deterministický (stejný vstup = stejný výstup) kvůli čistým diffům.

## Rozhodnuto uživatelem

- Formát: Markdown + YAML frontmatter, jeden soubor na entitu; migrační skript ano.
- `~w` = poznámka „žena".
- `raw/` ignorovat.
- Vzhled aplikace později.

## Moje volby (ke kontrole)

- `tags` jako volný seznam; `members` jen jako jména.
- Slugy bez diakritiky; kontinent z názvu složky.
- Jazyk implementace skriptů (Node.js, protože app je JS; build bez závislostí kromě parseru YAML) – nechává se na builderovi.

## Další upřesnění (moje volby po kontrole čtenářem)

- **Migrace má dva průchody.** Průchod 1 nic nezapisuje do `data/`: vypíše report a navrhne slovník sloučení tagů (soubor `scripts/tag-aliases.json`, zůstává v repu trvale, protože ho použije i budoucí skill). Průchod 2 zapíše `data/` až po schválení slovníku uživatelem.
- **Neznámý `~` tag** (není ve `~styles/` ani `~instruments/`, není ve slovníku) jde do `tags` a objeví se v reportu. Nikdy se neztratí potichu.
- **Přiřazení stylu:** hlavička `[[~styl]]` platí pro všechny kapely pod ní až do další hlavičky. Inline tagy se přidávají. Parser je heuristický; správnost zajišťuje report, ne parser.
- **Odsazená odrážka = člen** předchozí kapely. Pokud vypadá jinak (poznámka apod.), jde do reportu.
- **Normalizace jména kapely pro sloučení:** velikost písmen, diakritika, bílé znaky, odstranění inline `[[~…]]` tagů a koncového `#`. Závorky se při slučování neodstraňují (`Guillermo Portabales (1911 - 1970)` se nesloučí s variantou bez závorky; jde do reportu). Stejné normalizované jméno ve více zemích = jedna kapela s více zeměmi. Slug kolize jiných kapel se stejným slugem: přípona `-2`, a hlášení v reportu.
- **Kontinent** se bere ze složky bez výjimek (`Middle East/` → `middle-east`). **Vlajka** se bere z úvodního emoji názvu souboru; kde chybí (Kurdistan), zůstane prázdná.
- **Závorky u kapel** (roky, `(piano)`) se nepárují do polí, jen se vypíšou do reportu. Schéma pro ně zatím pole nemá.
- **Tvar `data.json`:** objekt seskupený podle typu (`bands`, `countries`, `styles`, `instruments`), každá položka má `id` a pole ze frontmatteru, vazby jsou jen jednosměrně přes ID (kapela → země/styl/nástroj), těla zůstávají jako surový Markdown. Aplikace si zpětné vazby spočítá sama. Tvar se může změnit, až bude jasné UI.
- **`members`** jsou prosté řetězce; propojení na kapely se odkládá.

## Otevřené / nechává se na builderovi

- Jazyk a struktura skriptů, volba YAML knihovny.
- Co s `~ Jazz/` a `~ eXperimental/` (volné poznámky); výchozí: ignorovat a vypsat v reportu migrace.
- Sloučení zjevných variant jmen kapel (Cankisou/Cankysou): výchozí je neslučovat automaticky, jen hlásit podobná jména v reportu.
