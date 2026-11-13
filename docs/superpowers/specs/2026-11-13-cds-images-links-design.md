# Abduh – CD, obrázky, odkazy a skill pro přidávání (design)

Navazuje na `2026-11-12-data-format-design.md` (formát dat, migrace, build). Zde jen rozšíření. UI aplikace zůstává mimo rozsah.

## Záměr

Sbírka bude růst o nahrávky (CD/alba) a u vybraných kapel a CD o obrázek a odkazy (Spotify, Bandcamp, web…). Nový obsah se bude přidávat skillem, ne ručně: uživatel řekne „přidej album Tassili od Tinariwen" nebo dá odkaz (i z Apple Notes) a skill najde data, stáhne a převede obrázek, zapíše soubory a ověří build.

## Cíle

- Nová entita `cd` (soubory `data/cds/<slug>.md`), stejný formát jako ostatní entity.
- Volitelný obrázek u kapely a CD, uložený v repu jako AVIF 400×400 px.
- Pole `links` u kapely i CD.
- Deterministické skripty (přidání obrázku, zápis entity), které skill volá. Skill nezapisuje soubory „od ruky".
- Skill `abduh-add` v repu (`.claude/skills/abduh-add/SKILL.md`).

## Mimo rozsah / anti-cíle

- Obrázky u všech kapel (jen vybrané). Obrázek u CD **není povinný**.
- Ukládání originálů obrázků do gitu; hotlinking cizích obrázků.
- Zápis z webové aplikace; návrh UI.
- Automatický git commit skillem (skill změny jen ohlásí).
- Migrace CD z vaultu (ve vaultu nejsou).

## Datový model

**CD** (`data/cds/<slug>.md`)
```yaml
name: Tassili
bands: [tinariwen]          # >= 1, ID existujících kapel
year: 2011                  # volitelné
label: Anti-                # volitelné
styles: [desert-blues]      # volitelné, vlastní styl alba
tags: []
image: cds/tinariwen-tassili.avif   # volitelné
image_source: https://...           # volitelné, odkud obrázek pochází
links:
  - {type: bandcamp, url: https://...}
```
Tělo = poznámky (Markdown). Slug CD = `<slug první kapely>-<slug názvu>` (např. `tinariwen-tassili`), při kolizi `-2`.

**Kapela**: přibývají `image`, `image_source`, `links` (stejný tvar).

**Odkaz**: `{type, url}`; `type` ∈ `spotify, bandcamp, apple-music, youtube, website, wikipedia, discogs, other`; `url` musí být `http(s)`. Neznámý typ je chyba validace (kdo chce jiný typ, použije `other`).

Pořadí klíčů ve frontmatteru: `name, continent, flag, icon, bands, countries, year, label, styles, instruments, members, tags, image, image_source, links`.

**Obrázky**: `data/images/bands/<slug>.avif`, `data/images/cds/<slug>.avif`; pole `image` je cesta relativní k `data/images/`. AVIF, čtverec 400×400 (ořez na střed), převod nástrojem `sharp`.

## Build a validace

- `data.json` dostane skupinu `cds` (řazeno podle `id`, stejně jako ostatní). Vazby zůstávají jednosměrné (CD → kapely); zpětné seznamy si spočítá aplikace.
- Validace: CD má ≥ 1 kapelu a všechny existují; `image` ukazuje na existující soubor; `links` mají povolený `type` a `http(s)` URL; osiřelé soubory v `data/images/` (nikým neodkazované) jsou chyba nebo varování (rozhodne builder; výchozí varování).
- Build zkopíruje odkazované obrázky do `public/img/` a v `data.json` je `image` cesta k nim.

## Skripty (deterministické, volá je skill)

- `scripts/add-image.js <band|cd> <slug> <url|soubor> [--source <url>]`: stáhne/načte obrázek, ořízne na čtverec 400 px, uloží AVIF, nastaví `image` (a `image_source`) ve frontmatteru entity. Přepsání existujícího obrázku jen s `--force`.
- `scripts/add-entity.js`: přijme JSON (typ, pole, tělo) na stdin, zvaliduje, vypočítá slug, zapíše soubor a odmítne přepsat existující entitu (kromě `--force`). Vypíše výsledné ID.

## Skill `abduh-add`

Vstup: věta („přidej album Tassili od Tinariwen", „přidej kapelu X"), odkaz (Spotify, Bandcamp, web…), nebo odkaz/poznámka z Apple Notes.

Chování:
1. Zjistí, jestli jde o kapelu nebo CD; vyhledá data (název, kapela, rok, label, země kapely, odkazy, cover) z veřejných zdrojů (MusicBrainz/Cover Art Archive, Wikipedia, stránka odkazu). Co nenajde, nevymýšlí a neuvede.
2. Pokud kapela neexistuje, vytvoří ji (včetně země; styl jen ze seznamu existujících stylů/nástrojů, jinak bez stylu); existující entity nikdy nepřepisuje, jen doplní chybějící pole se souhlasem uživatele.
3. Volá `add-entity.js`, u CD/kapely s obrázkem `add-image.js`, pak `npm run build`.
4. Vypíše shrnutí (co přidal, co nenašel). Nic necommituje.
5. Apple Notes: načte text poznámky přes `osascript` (JXA), vytáhne odkazy a zpracuje je jako výše. Jeden odkaz = jedna položka; hromadné zpracování seznamu odkazů jen po potvrzení počtu.

## Rozhodnuto uživatelem

- AVIF, 400 px, pro kapely i CD. Obrázky jen u vybraných kapel, u CD povinné nejsou.
- Skill přidává z promptu a z odkazů (včetně Apple Notes).
- Odkazy u kapel i CD, více jich může být (Spotify, Bandcamp, web…).

## Moje volby (ke kontrole)

- Slug CD `<kapela>-<název>`; jednosměrné vazby; `image_source` jako pole; `sharp` jako konvertor; výchozí varování pro osiřelé obrázky; skill nic nekomituje.
- Povolené typy odkazů jako výše, s `other` jako záchytným typem.
- Projektový skill v `.claude/skills/` (ne v uživatelském adresáři).

## Další upřesnění (moje volby po kontrole čtenářem)

- **Země CD** se neukládá; odvozuje se z kapel (aplikace/build). CD má jen pole z modelu výše.
- **`styles` u CD** se validují proti existujícím stylům stejně jako u kapel; `tags` jsou volný seznam. Aliasy (`tag-aliases.json`) se použijí jen v migraci, ne v `add-entity.js`.
- **`image_source`** je jeden řetězec (URL); „pole" v předchozí větě znamená „pole frontmatteru".
- **ID CD je po vytvoření neměnné**, i když se později změní kapely. Kolize slugu = přípona `-2`. Přejmenování (nový slug) je mimo rozsah.
- **`add-entity.js`** umí jen kapely a CD, odmítne `image`/`image_source` na vstupu (ty nastavuje jen `add-image.js`), a má režim `--merge`, který doplní jen chybějící pole existující entity (bez přepsání vyplněných).
- **Pořadí volání skillu:** `add-entity` → `add-image` → `npm run build`.
- **Obrázky:** vstup menší než 400 px se zvětší (nezamítne se); ořez vždy na střed; kvalita AVIF kolem 50 (rozhodne builder podle výsledné velikosti, cíl ≤ 30 kB). `sharp` je přijatelná nativní závislost.
- **Build:** varování se vypíšou a build skončí kódem 0; `public/img/` se před kopírováním vyčistí; `image` v `data.json` je `img/<bands|cds>/<slug>.avif` (relativně k `public/`).
- **Síť:** jen `http(s)`, limit 10 MB a 15 s na stažení, rozumný User-Agent (MusicBrainz ho vyžaduje), kontrola typu obsahu `image/*`.
- **Existující data** (`data/bands`, `countries`…) se nepřepisují; serializér jen dostane nové klíče do pořadí.

## Otevřené / nechává se na builderovi

- Přesný způsob čtení Apple Notes (JXA skript, hledání poznámky podle názvu/odkazu) a práva k Automation.
- Zdroje metadat a jejich pořadí; zpracování chyb sítě.
- Struktura skriptů a testy (konverze se testuje na malém vzorovém obrázku v `tests/`).
