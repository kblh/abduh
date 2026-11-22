# Abduh – mapa souvislostí (mind map)

## Záměr a proč

Detail kapely, stylu, nástroje a tagu dnes ukazuje souvislosti jen jako seznamy (chipy, „Taky <styl>“, 3 podobné kapely). Uživatel chce **objevovat**: vybrat entitu a vizuálně vidět, s čím souvisí, a odtud putovat dál. Proto vznikne samostatný pohled „mapa souvislostí“ (mind map) dostupný z detailu kapely, stylu, nástroje a tagu.

## Co uživatel řekl

- Uprostřed kolečko vybrané entity. Od něj hvězdicovitě čáry k dalším souvisejícím kapelám přes styly, tagy, nástroje (a země).
- Uprostřed čáry je vidět typ vztahu, na konci menší kolečko související kapely.
- Zatím maximálně tři úrovně.
- Všechno interaktivní: klik na kolečko vede na detail té entity, to samé pro ostatní entity. Grafy pro styl, nástroj a tag jsou obdobné.
- „Plátno“ je většinou větší než viewport a pohyb po něm musí být plynulý.
- Technologii volím já. Vztahy: styl, nástroj, tag **i země** (odsouhlaseno).

## Cíle

- Pohled `Mapa` na detailu kapely, stylu, nástroje a tagu, jedním klikem odtud i zpět.
- Pohyb po plátně: tažení myší/prstem se setrvačností, zoom kolečkem/gestem pinch/tlačítky + − a „přizpůsobit“, klávesnice (šipky, + −, 0). Plátno je větší než viewport, výchozí pohled je vycentrovaný na střed a zvolený tak, aby byla vidět 1. úroveň.
- Plynulost: 60 fps při posouvání a zoomu na mobilu i desktopu u desítek až ~100 uzlů.
- Klik na kolečko = přechod na detail entity (kapela, styl, nástroj, tag, země). Klik na popisek vztahu = detail entity, která vztah tvoří (např. styl „rai“). Rozlišit klik od tažení (práh pohybu).
- Světlý/tmavý motiv a vzhled „psací stůl“ stávající appky (tokeny z `tokens.css`, fonty, chipy z label makeru pro popisky).
- Použitelné na dotyku i klávesnicí (uzly a popisky jsou skutečné odkazy, `Tab`, `Enter`).

## Mimo rozsah / anti-cíle

- Žádné editování grafu, žádné ukládání rozložení, žádné vyhledávání uvnitř mapy.
- Mapa pro zemi, CD a poličku (možný pozdější krok).
- Žádné postupné rozbalování uzlů v rámci mapy: klik na uzel jde na jeho detail a ten má svou mapu.
- Žádný framework, bundler ani nová runtime závislost (viz Omezení).
- Anti-cíl: „vlasatý míč“, kde se u velkého hubu (Francie 319 kapel, `mpb` 117) uzly slijí a nejde číst. Počet uzlů je vždy omezen.
- Nevymýšlet vztahy: čára existuje jen tam, kde to data říkají (sdílený styl/nástroj/tag/země, propojený člen).

## Omezení

- Vanilla ES moduly, bez build kroku frontendu, statický hosting (stejně jako zbytek appky). Data se berou z už načteného `store` (indexy `bandsByStyle`, `bandsByInstrument`, `bandsByTag`, `bandsByCountry`), žádný další request.
- Hash router: nová cesta `#/<sekce>/<id>/map` (např. `#/bands/tinariwen/map`) pro `bands`, `styles`, `instruments`, `tags`. `parseHash` se rozšíří o třetí segment; ostatní cesty zůstávají beze změny. Zpět v prohlížeči vrací z mapy na detail.
- Jen 639 kapel ze 2 727 má styl, 135 nástroj, 95 tag; země je u všech. Mapa se proto musí dobře chovat i u kapely jen se zemí a u kapely bez jakéhokoli souseda (prázdný stav s větou, ne rozbitý obrázek).

## Přístupy, které jsme zvažovali

| | Co | Pro | Proti |
|---|---|---|---|
| A. SVG + vlastní layout + vlastní pan/zoom (vybráno) | SVG plátno, jedna `<g>` s transformem, radiální rozložení spočtené deterministicky, vlastní pan/zoom nad Pointer Events | žádná závislost, stabilní tvar mapy (stejná entita = stejná mapa), odkazy a text jsou skutečné DOM prvky (přístupnost, CSS motivy, fotky v kolečkách), ~100 uzlů je pro SVG malé | pan/zoom (setrvačnost, pinch) píšeme sami, asi 150 řádků a testy matematiky |
| B. SVG + d3-zoom + d3-force | knihovny z d3, force simulace | hotový zoom, přetahování uzlů | ~30 KB vendorovaných modulů bez bundleru (závislosti d3-zoom: selection, transition, drag, interpolate…), force rozložení je nestabilní (každé otevření trochu jiné) a hvězdice je lepší spočítat přímo |
| C. Canvas nebo WebGL (Sigma.js, Cytoscape) | vykreslení do bitmapy | škáluje na tisíce uzlů | nepotřebujeme (limit ~100 uzlů), ztratíme odkazy, přístupnost a stylování CSS, těžká závislost |

Vybráno A, protože odpovídá stylu projektu (vanilla, žádné závislosti) a dává předvídatelnou, čitelnou hvězdici. Pokud by vlastní pan/zoom nevyšel plynule, náhradou je d3-zoom (B) jen pro pohyb; layout zůstává.

## Návrh

### Model grafu (čistá funkce, testovatelná v `node --test`)

`buildMap(store, {kind, id}) → { nodes, edges }`. Uzly: entita (`kind`, `id`, `label`, `image?`, `level`) a pomocný uzel „+N dalších“. Hrana: `from`, `to`, `rel` (`style|instrument|tag|country|member`), `relId` (id sdílené entity, pro odkaz z popisku), `label`.

- **Střed kapely:** úroveň 1 jsou kapely sdílející s ní styl, nástroj, tag, zemi nebo propojeného člena. Hrana nese vztah (např. „styl · rai“, „nástroj · oud“, „země · Mali“). Kapela sdílející víc vztahů má jednu hranu s tím nejsilnějším vztahem (pořadí: člen, styl, nástroj, tag, země; ostatní sdílené se přidají do popisku nebo se vypustí, rozhodne builder).
- **Střed stylu / nástroje / tagu:** úroveň 1 jsou kapely, které ho mají; popisek hrany je druh vztahu („styl“, „nástroj“, „tag“). Z těchto kapel jdou dál hrany k dalším kapelám přes jejich *ostatní* vztahy (ne přes střed).
- **Úroveň 2 a 3:** z každé kapely další kapely přes její vztahy. Kapela se na mapě objeví **nejvýše jednou** (strom, nejkratší cesta); střed se neopakuje.
- **Limity (výchozí hodnoty, doladí builder podle vzhledu):** celkem ≤ ~80 uzlů; úroveň 1 ≤ 12, úroveň 2 ≤ 3 na uzel, úroveň 3 ≤ 2 na uzel. Kvóty napříč vztahy: silné vztahy (člen, styl, nástroj, tag) mají přednost, země dostane nejvýš 3 místa na úrovni 1 (u kapely jen se zemí až 8), aby slabý vztah neutopil silné.
- **Výběr kandidátů:** deterministicky, ne náhodně: víc sdílených vztahů výš, pak kapela s fotkou, pak abecedně. Stejná entita tedy vždy dá stejnou mapu.
- **Zkrácení hubů:** u vztahu, kde zbylo víc kapel, vznikne malý uzel „+112 dalších“ odkazující na seznam kapel filtrovaný tímto vztahem (existující `#/bands?style=…`, `country=…`; pro nástroj a tag podle toho, co filtry umí, jinak na detail entity).

### Rozložení (čistá funkce)

Radiální strom: střed v bodě (0, 0); úroveň *n* na kružnici poloměru *rₙ*; každá větev dostane úhlový sektor úměrný počtu potomků, děti jsou ve sektoru rodiče, aby se hrany nekřížily. Souřadnice se spočtou jednou při otevření, žádná simulace. Rozměry plátna vyjdou z maximálního poloměru (jednotky tisíc px) a jsou typicky větší než viewport.

### Vykreslení a interakce

- Jedno `<svg>` přes celou pracovní plochu pod hlavičkou; vnitřní `<g class="world">` s `transform: translate/scale`. Hrany jako čáry (nebo mírné křivky), uprostřed popisek vztahu jako label-maker štítek (odkaz na entitu vztahu), uzly jako kolečka: střed největší, úroveň 1 menší, 2 a 3 ještě menší; fotka v kolečku (`<clipPath>`/`<image>`) nebo iniciály a vlajka stejně jako placeholder v appce. Název kapely pod nebo vedle kolečka.
- Uzly a popisky jsou `<a href="#/…">` (SVG a), takže klik, klávesnice a „otevřít v nové záložce“ fungují bez vlastního kódu. Hover/focus zvýrazní uzel a cestu ke středu.
- Pan/zoom: Pointer Events (myš, dotyk, pero), `wheel` se zoomem ke kurzoru, dva prsty = pinch, setrvačnost po puštění, meze zoomu (např. 0,25–3), tlačítka + − a „přizpůsobit“, klávesy. Změna transformu přes `requestAnimationFrame`, `touch-action: none` na plátně, aby gesto nescrollovalo stránku. Tažení nad prahem (≈5 px) potlačí následný klik.
- Popisky vztahů a názvy se při malém zoomu skryjí (levelem detailu), aby při oddálení zůstala čitelná struktura.
- `prefers-reduced-motion`: bez setrvačnosti a animace přiblížení.
- Prázdná mapa (žádný soused): věta „zatím tu nic nesouvisí“ a odkaz zpět na detail.

### Napojení do appky

- `router.js`: třetí segment `map` → route `bands-map|styles-map|…` (nebo `map` s parametrem kindu; volba builderu), `buildHash` umí totéž.
- `views/map.js`: společný view pro všechny čtyři entity; sestaví graf, layout a plátno.
- Odkaz „Mapa“ jako razítkové tlačítko v hlavičce detailu kapely, stylu, nástroje a tagu (stávající komponenta `linkButtons`/stamp styl); na mapě odkaz „zpět na detail“.
- Styly v `views.css` a tokeny z `tokens.css`; žádné nové fonty.

### Testy

- `buildMap`: kapela jen se zemí, kapela bez souseda, kapela s hubem (limit uzlů dodržen, „+N dalších“ vznikne), deterministický výsledek, kapela nikdy dvakrát, střed stylu/nástroje/tagu.
- Layout: žádné překryvy kolečka stejné úrovně nad minimální vzdálenost, děti uvnitř sektoru rodiče.
- Pan/zoom matematika (zoom ke kurzoru, meze, přizpůsobit) jako čistá funkce.
- `parseHash`/`buildHash` pro cestu `/map`.
- Ověření v prohlížeči (build + `npm run serve`): pohyb, zoom, klik na kolečko, klik na popisek, mobilní velikost, tmavý motiv.

## Co zbývá na builderovi

Přesné velikosti kolečka, poloměrů a limitů; zda je hrana přímá nebo zakřivená; jak zobrazit víc sdílených vztahů mezi týmiž dvěma kapelami; tvar routy; přesný vzhled tlačítek a popisků v rámci stávajícího motivu.

## Rozhodnutí z kontroly návrhu (moje volby, k připomínkám)

- **Člen (`member`):** v datech je `members` pole kapely; položka je buď text, nebo propojený objekt `{id, name}` (odkaz na jinou kapelu, dnes 7 kapel). Hrana vznikne oběma směry (kapela má člena X, i kapela, která uvádí tuto kapelu jako člena). Další typ uzlu (osoba) nevzniká.
- **Odkazy „+N dalších“:** všechny čtyři filtry (`style`, `instrument`, `tag`, `country`) umí `#/bands?<filtr>=<id>`, odkaz vede vždy tam. Odkaz na detail entity jako záloha se nepoužije (u středu by vedl na stránku, na které uživatel je).
- **Země:** je jen vztah (štítek na hraně, odkaz na detail země), ne uzel a ne střed. Na úrovních 2 a 3 se země použije, jen když kapela nemá žádný silnější vztah, jinak by u velkých hubů (`mpb`, 117 kapel) zaplavila mapu.
- **Tlačítko „Mapa“:** v hlavičce detailu každé ze čtyř entit (společná komponenta); odkaz „zpět na detail“ na mapě je obyčejný `#/…` odkaz, ne `history.back()`, aby fungoval i z přímého odkazu.
- **Route:** `parseHash` vrací `route: 'map'`, `kind` (`band|style|instrument|tag`) a `id`; `buildHash('map', {kind, id})`.
- **Rozložení stránky:** mapa je celoplošná pod hlavičkou (nad spodní lištou na mobilu), stránka se na ní neposouvá, jen plátno; patička se na mapě nezobrazuje.
