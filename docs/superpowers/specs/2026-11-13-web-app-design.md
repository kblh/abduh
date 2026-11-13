# Abduh – webová aplikace (design)

## Záměr a proč

Abduh je osobní, read-only webová aplikace pro procházení hudební sbírky (~2 700 kapel, 140 zemí, ~120 stylů, 26 nástrojů, CD a poličky). Data jsou hotová v `public/data.json` (build z `data/`), vizuální návrhy jsou v `~/Desktop/Abduh – visual identity & screens.pdf` (15 stran, mobil 375 px + desktop 1280 px, světlý i tmavý motiv) a popis stylu v `design.md`.

Hlavní účel, který uživatel řekl: **hledat**. Aplikace je v první řadě rychlé a tolerantní hledání kapely/země/stylu/nástroje; procházení a „objevování" je druhořadé.

## Cíle

- Všechny obrazovky z návrhů: Domů, Kapely (seznam, detail), CD (seznam, detail), Styly (seznam, detail), Nástroje (seznam, detail), Země (seznam, detail), výsledky hledání, prázdný stav, 404. Mobil i desktop, světlý i tmavý motiv.
- Hledání je rychlé (výsledky při psaní, bez čekání) a je dosažitelné z každé obrazovky.
- Seznam 2 700 kapel zůstává plynulý.
- Vzhled „psací stůl" z návrhů: typewriter/rukopis/čitelná patková písma, štítky z label makeru jako chipy, indexové kartičky, razítkové odkazy; dekorace jen tiše v pozadí, ne na každém řádku.

## Nové oproti návrhům (navrhuji já, k odsouhlasení)

- **Poličky** (nová entita `shelf` v datech): seznam poliček a detail poličky (název, kapely a CD na ní). Návrhy je neobsahují; vizuálně použijí stejné komponenty jako ostatní seznamy (řádky kapel, mřížka CD). V navigaci na desktopu jako sedmá položka; na mobilu zůstává šest záložek z návrhu a Poličky jsou dostupné z dlaždice na Domů a z hledání. Na detailu kapely a CD sekce „Na poličkách" (jen když existuje).
- **Datum zápisu:** build k entitě doplní `added` (ISO datum prvního commitu souboru z `git log`; pokud git není k dispozici, pole chybí). Slouží pro „Nově zapsané", razítko NOVÉ (do 30 dnů od zápisu) a řazení „nově zapsané".
- **Přepínač motivu:** výchozí podle `prefers-color-scheme`, ruční přepínač, volba v `localStorage`.

## Mimo rozsah / anti-cíle

- PWA (manifest, service worker, offline) – samostatný pozdější krok.
- Zápis/editace z aplikace, účty, přehrávač, košík.
- Překlad dat: UI je česky, **jména entit se zobrazují tak, jak jsou v datech (anglicky)**; hledá se jen v nich. Slugy stylů se zobrazí s mezerami místo pomlček (`a-capella` → „a capella").
- Žádný framework ani bundler.
- Nevymýšlet obsah: prvky z návrhů, ke kterým v datech nic není, se **nezobrazí** (kategorie nástroje „strunný", popis stylu, „příbuzné styly", podoblast země „Maghreb", číslo katalogu „č. 2208", ručně psané poznámky typu „začít s Tassili"). Pokud pole do dat přibude, doplní se zobrazení. Bio/popis se zobrazí z `body`, když je neprázdné.
- Failure: pomalé psaní v hledání, trhání při posouvání seznamu, dekorace rušící obsah.

## Omezení

- Vanilla JS (ES moduly), CSS, HTML; bez build kroku pro frontend. Statické soubory v `public/`, použitelné z libovolného statického hostingu. Existující `npm run build` zůstává zdrojem `public/data.json` a `public/img/`.
- Mobile-first (375 px) + desktop (1280 px), čitelný kontrast, ovladatelné klávesnicí.
- Data se načtou jednou (`data.json`, ~460 KB, ~61 KB gzip); loading a chybový stav.
- Obrázky jsou AVIF (400×400); většina kapel obrázek nemá.

## Přístupy, které jsme zvažovali

- **A. Čisté ES moduly bez buildu – vybráno.** `public/index.html` + moduly, hash router, hledací index v paměti. Nejjednodušší, odpovídá zadání „vanilla", žádná nová závislost.
- B. Vite (stále vanilla JS) – dev server, minifikace; přidává závislost a druhý build, přínos u této velikosti malý.
- C. Staticky předgenerované stránky (~3 000 HTML) – pro SEO, které soukromá sbírka nepotřebuje; zbytečně komplikuje build.

## Rozhodnutí

### Struktura a směrování

Hash router, adresy: `#/`, `#/bands`, `#/bands/:id`, `#/cds`, `#/cds/:id`, `#/styles`, `#/styles/:id`, `#/instruments`, `#/instruments/:id`, `#/countries`, `#/countries/:id`, `#/shelves`, `#/shelves/:id`, `#/search?q=…`. Filtry seznamů jsou v query (`#/bands?country=mali&style=desert-blues&photo=1&sort=new`), aby šly sdílet a fungovalo Zpět. Neznámá adresa nebo ID → 404 z návrhu.

Rozložení: `public/index.html`, `public/app/` (router, data, search, views, komponenty), `public/css/` (tokeny, komponenty, motivy). Data modul postaví z `data.json` indexy podle ID a zpětné vazby (kapely podle země/stylu/nástroje, CD podle kapely, poličky podle položky).

### Hledání (priorita)

- Čistý modul bez DOM (testovatelný v `node --test`): `buildIndex(data)`, `search(index, query)`.
- Normalizace: malá písmena, odstranění diakritiky (NFD), sjednocení mezer a pomlček.
- Prohledává se: název kapely, CD, stylu, nástroje, země. Kapela je navíc nalezitelná přes název své země, stylů a nástrojů (u kapely se označí důvod: „podle nástroje"). Členové a bio se **nehledají**.
- Víceslovný dotaz: všechna slova musí sedět (AND).
- Pořadí: shoda na začátku názvu > na začátku slova v názvu > uvnitř názvu > shoda přes vazbu; uvnitř skupiny abecedně.
- Výsledky jsou seskupené podle entit (Kapely, CD, Styly, Nástroje, Země, Poličky) s počty a záložkami „Vše / Kapely / …"; prázdný výsledek ukáže text z návrhu.
- Pole hledání je v hlavičce každé obrazovky, na Domů velké; klávesa `/` na něj skočí; psaní aktualizuje výsledky okamžitě (`history.replaceState`, ne nový záznam v historii na každý znak); Enter nebo opuštění pole nechá adresu sdílitelnou.

### Seznamy

- Kapely: virtualizovaný seznam s pevnou výškou řádku (renderuje se jen okno kolem viewportu), A–Z index (písmena bez položek zašedlá), filtry Země / Styl / Nástroj / Jen s fotkou, řazení A–Z a Nově zapsané, hlavička s počtem „84 z 2 714". Aktivní filtr je černý štítek s ×.
- CD: mřížka obalů; bez obalu karta s názvem a rokem; filtry Kapela / Rok / S obalem; řazení.
- Styly: rejstřík podle písmen se tečkovaným vedením k počtu kapel, řazení A–Z / počet.
- Nástroje: mřížka karet s ikonou (emoji `icon`) a počtem; řazení A–Z / počet.
- Země: seskupené podle kontinentu (Afrika, Amerika, Asie, Austrálie, Evropa, Blízký východ), vlajka + počet kapel; kontinentové záložky; zkrácený výpis + „+N dalších".
- Poličky: řádky s názvem a počtem položek.

### Detaily

- Kapela: foto nebo zástupná karta (iniciály + vlajka), země, chipy stylů a nástrojů (odkazují na detail), razítkové odkazy (Spotify, Bandcamp, …), členové (jen když jsou), bio z `body`, diskografie (CD kapely, jinak „zatím žádné cédéčko"), „Taky <první styl>" (až 3 další kapely), „Na poličkách".
- CD: obal, kapely (odkazy), rok, vydavatel, styl, zapsáno, odkazy, poznámky z `body`, „Další od <kapela>", „Na poličkách".
- Styl: štítek s názvem, počet kapel, rozpis podle zemí, tabulka kapel s filtry Země a S fotkou, náhled prvních 8 a odkaz „všechny v seznamu kapel" (předfiltrované).
- Nástroj: ikona, název, počet, kapely (filtry Země, Styl), „Na cédéčkách".
- Země: vlajka, kontinent, počet, chipy stylů s počty, text historie z `body` (u dlouhého „číst dál"), kapely seskupené podle stylu s odkazem „celý styl".
- Polička: název, kapely a CD na ní.
- Domů: pozdrav podle denní doby a datum, velké hledání s tipy („zkus: kora · Kuba · raï · žena"), dlaždice s počty (kapely, země, styly, nástroje, CD, poličky), Nově zapsané (posledních 6 podle `added`), Náhodný objev (náhodná kapela, tlačítko „další").

### Vzhled

Tokeny (barvy, písma, spacing) se odvodí z PDF a uloží jako CSS proměnné; světlý (papír) a tmavý (noční lampa) motiv přes `data-theme`. Tři písma jako v návrzích (psací stroj, rukopis, patkové); **fonty se hostují lokálně** (woff2 v `public/fonts/`), aby aplikace fungovala i offline po přidání PWA. Chipy, razítkové odkazy, indexové kartičky a kontury jsou CSS (ne obrázky); dekorační předměty na stole jsou inline SVG, nízký kontrast, jen na desktopu a v hlavičkách/prázdných stavech, žádná dekorace na řádcích seznamů. Respektuje `prefers-reduced-motion`.

Navigace: desktop horní lišta (Domů, Kapely, CD, Styly, Nástroje, Země, Poličky) + hledání; mobil spodní lišta se šesti záložkami z návrhu.

### Testování

- Jednotkové testy (`node --test`, ve stylu stávajících testů): normalizace a hledání (diakritika, AND, pořadí, shoda přes vazbu), router (parse/serialize adres a query), stavba indexů a zpětných vazeb, výpočet NOVÉ/`added`.
- Ruční ověření v prohlížeči: každá obrazovka v mobilní i desktopové šířce, oba motivy, kapela bez fotky, prázdné CD, 404, výkon seznamu 2 700 kapel.

### Upřesnění (mé rozhodnutí po kontrole návrhu stavitelem)

- **Tagy:** zobrazují se jako chip/štítek u kapely, v seznamech jen tag `woman` jako černý štítek „ŽENA" (jako v návrzích); ostatní tagy jen na detailu kapely, text tak, jak je v datech. Hledání tagy zahrnuje jako shoda přes vazbu („podle štítku"); slova `woman` i `žena` se mapují na tag `woman` (jediná výjimka z pravidla „bez překladu", protože štítek „ŽENA" je v návrzích). Tip na Domů zůstává „zkus: kora · Kuba · raï · žena", ale „Kuba" se hledá jako `cuba`, takže tip použije anglické názvy z dat (`kora · cuba · rai · žena`).
- **`added` a „nové":** build ignoruje hromadné commity (commit, který přidal víc než 50 datových souborů, se bere jako import a `added` z něj se nepřiřadí). Entity bez `added` se v „Nově zapsané" nezobrazí a nedostanou razítko NOVÉ; Domů pak sekci „Nově zapsané" skryje, když je prázdná. Řazení „nově zapsané" řadí podle `added` sestupně, shodu rozhodne abeceda; entity bez `added` jsou na konci. Bez git historie (shallow clone, CI) pole chybí a „nové" prvky se skryjí.
- **Zdroj pravdy o schématu:** `scripts/lib/` (zejména `validate.js`, `entity-file.js`) je autoritativní. Pole CD: `name`, `bands` (ID), `year`, `label`, `styles`, `image`, `links`, `body`; polička: `name`, `bands`, `cds`, `body`; kapela: `name`, `countries`, `styles`, `instruments`, `members`, `tags`, `image`, `links`, `body`. Úprava `scripts/build.js` kvůli `added` je součástí tohoto úkolu; frontend plán tedy začíná build/datovým krokem. Datový modul je defenzivní vůči chybějícím polím.
- **Testovací data:** protože v reálných datech nejsou CD, obrázky, bio ani plná polička, přidá se vývojový fixture (`public/dev/fixture.json`, načtený přes `?fixture=1`; necommituje se do `data/`, nepoužívá se v produkci) s ukázkovými CD, obrázky, poličkou a bio, aby šly ověřit všechny stavy.
- **Navigace:** PDF je autoritativní. Šest mobilních záložek je Domů, Kapely, CD, Styly, Nástroje, Země; hledání není záložka, ale pole v hlavičce každé obrazovky (na mobilu ikona/pole nahoře, jak je v návrhu).
- **Více zemí u kapely:** zobrazí se všechny vlajky (v hlavičce řádku do tří, zbytek „+N"); zástupná karta používá vlajku první země; filtr Země sedí, když kapela má danou zemi mezi kterýmikoli.

## Co zbývá na stavitele

Přesné hodnoty tokenů a výběr písem (podle PDF), rozdělení souborů, implementace virtualizace, podoba SVG dekorací a zástupných karet, přesné texty UI mimo návrhy, přístupnostní detaily (focus, aria). Hosting není rozhodnutý (statické soubory z `public/`).
