---
name: abduh-add
description: Přidá nebo doplní kapelu/umělce, album (CD) nebo poličku ve sbírce Abduh (abduh-data/ v tomto repu) – s odkazy (Spotify, Bandcamp, web), obrázkem, českým bio, členy a výběrem alb. Použij na „přidej album Tassili od Tinariwen", „přidej kapelu X", „doplň kapelu Y", „založ poličku Z", „dej to na poličku Z", na odkazy ze Spotify/Bandcampu/webu a na „importuj z Apple Notes".
---

# abduh-add

Přidává a doplňuje obsah v `abduh-data/` (Markdown + YAML frontmatter, viz `docs/jak-to-funguje.md`). Soubory nikdy nepiš ručně – vždy přes skripty níže. Nic necommituj.

Co nenajdeš, **nevymýšlej** a vynech. Respektuj licence; texty nekopíruj, shrň je vlastními slovy.

## Přidání kapely / umělce

Vstupem je URL (Spotify, Bandcamp, web) nebo jméno.

1. **Zjisti jméno a zemi** ze zdroje (stránka za odkazem, MusicBrainz, Wikipedie). Země je povinná (`ls abduh-data/countries`); když ji nenajdeš, zeptej se.
2. **Zjisti, zda už existuje:** `ls abduh-data/bands | grep <slug>` a porovnej i jména bez diakritiky (`add-entity` stejně odmítne duplicitu).
   - **Existuje:** přečti soubor a doplň **vše, co chybí** přes `--merge` (odkazy, obrázek, bio, členové). `--merge` doplňuje jen prázdná pole, nic nepřepisuje, takže se na něj nemusíš ptát. Pak pokračuj bodem 6 a zeptej se na dosud nezařazená alba.
   - **Neexistuje:** založ nový záznam.
3. **Odkazy:** najdi kapelu na Spotify i Bandcampu (a případně web, Wikipedie). Přidej jen ty, u kterých jsi si jistý, že jde o stejného umělce. Typy: spotify, bandcamp, apple-music, youtube, website, wikipedia, discogs, other (`node scripts/extract-links.js < text`).
4. **Obrázek:** najdi kandidáty (Wikimedia Commons, tisková fotka na webu kapely, Bandcamp). **Předlož je uživateli (URL, zdroj, licence) a použij až po schválení.** Pak `node scripts/add-image.js band <id> <url|soubor> --source <stránka>` (AVIF 400×400). Když stažení selže, stáhni soubor `curl -sL -A "Mozilla/5.0"` a předej lokální cestu. Existující obrázek `add-image` nepřepíše (`--force` jen na výslovné přání).
5. **Bio:** najdi krátké bio (2–4 věty, Wikipedie, Bandcamp, Spotify „About"), **přelož ho do češtiny** a vlastními slovy shrň. Zapiš do pole `body` (viz příklad). Existující bio nepřepisuj.
6. **Alba:** najdi alba (MusicBrainz release groups typu album, Bandcamp, Spotify), odeber ta, která už jsou v databázi (`ls abduh-data/cds | grep ^<id>-`), a **zeptej se, která chce uživatel zařadit** (viz „Interaktivní rozhodování"). Vybraná alba zařaď podle „Přidání alba".
7. **Členové** (u kapely, ne u sólisty): vyhledej členy (Wikipedie, MusicBrainz) a dej je do `members` jako jména. Člen, který už je v databázi jako samostatná kapela/umělec (stejné jméno bez ohledu na velikost písmen a diakritiku), se **sám propojí** odkazem (`"[[id]]"`, na webu je to odkaz). Platí to i obráceně: když **založíš novou kapelu**, kterou jiná kapela uvádí jen jako textové jméno člena, `add-entity` ji tam nahradí odkazem a vypíše ID upravených kapel v poli `linked` (zmiň je v shrnutí). Při `--merge` se zpětně nelinkuje. Nic dalšího dělat nemusíš.
8. **Styly, nástroje a tagy** jen z existujících (`ls abduh-data/styles abduh-data/instruments abduh-data/tags`); jinak vynech. Styl je hudební žánr; nástroj, země a tag (místo, přívlastek, poznámka – např. `woman` u žen, `dublin`, `diaspora`) nepatří do `styles`. Nový tag nejdřív vytvoř: `{"type":"tag","fields":{"name":"new york"}}` přes `add-entity.js` (pole `tags` u kapely pak obsahuje jeho ID).
9. **Zapiš** (JSON na stdin; `--merge` jen pro existující):
   ```
   node scripts/add-entity.js [--merge] <<'JSON'
   {"type":"band","fields":{"name":"Tinariwen","countries":["mali"],"styles":["tuareg"],"members":["Ibrahim Ag Alhabib","Abdallah Ag Alhousseyni"],"links":[{"type":"spotify","url":"https://…"},{"type":"bandcamp","url":"https://…"}]},"body":"Krátké bio v češtině.\n"}
   JSON
   ```
   Vypíše `{id, created}`.
10. **Prolinkuj bio:** `add-entity` sám odkáže jména jiných kapel v bio nové kapely (`[[id|text]]`, i skloněné tvary). Aby se odkazy objevily i v bio ostatních kapel, které novou kapelu zmiňují, spusť po zápisu (a po doplnění obrázku) `node scripts/link-bios.js --write` (bez `--write` jen vypíše návrh). Uveď v shrnutí počet nových odkazů.
11. **Ověř:** `npm run build` (musí skončit bez chyby) a **shrň**, co bylo přidáno, doplněno a co se nenašlo.

## Přidání alba

Vstupem je URL (Spotify, Bandcamp, web), nebo se tento postup volá z „Přidání kapely".

1. **Zjisti údaje** ze zdroje: `name`, kapela (`bands`, existující ID; neexistující kapelu nejdřív přidej), `year`, `label` jen když ho znáš. Tipy: Spotify stránka alba má v `og:description` „Kapela · album · rok · počet skladeb"; Bandcamp má v `og:title` „Album, by Kapela" a obal v `og:image`.
2. **Odkazy:** najdi album na Spotify **i** Bandcampu a přidej oba, které existují (stejná kapela a album).
3. **Zapiš** (CD ID je `<kapela>-<název>`): 
   ```
   node scripts/add-entity.js [--merge] <<'JSON'
   {"type":"cd","fields":{"name":"Tassili","bands":["tinariwen"],"year":2011,"links":[{"type":"spotify","url":"https://…"},{"type":"bandcamp","url":"https://…"}]}}
   JSON
   ```
   Když album existuje, doplň odkazy a obrázek přes `--merge` (připojí nové odkazy podle URL).
4. **Obrázek:** vyhledej obal (Bandcamp `og:image`, Cover Art Archive, Spotify) a **rovnou ho použij**: `node scripts/add-image.js cd <id> <url|soubor> --source <stránka alba>`.
5. **Přehrávač:** má-li album odkaz na Bandcamp, spusť `node scripts/add-bandcamp-ids.js` (doplní `bandcamp_id` všem CD, kterým chybí; na detailu CD pak je embed přehrávač). Ručně `bandcamp_id` nezapisuj.
6. **Ověř:** `npm run build`.

## Interaktivní rozhodování

Výběr alb i schválení obrázku předlož přehledně. Vždy funguje tabulka v textu: **Název | Rok | Vydavatel | Obal (URL) | Už v databázi**.
- Je-li dostupný nástroj `AskUserQuestion` (Claude Code, Claude Desktop), použij ho: pro alba `multiSelect` s položkami „Název (rok)", pro obrázky jednu volbu s kandidáty. Náhled (`preview`) je jen text, obrázky v něm nejsou.
- Chce-li uživatel vidět obaly a zaškrtávat je, můžeš ve Claude Desktop vytvořit stránku jako Artifact (tabulka s obaly z Cover Art Archive a zaškrtávátka). Výběr se ale musí vrátit zpět do konverzace; ověř, že to nástroj v dané verzi umí, jinak použij textovou tabulku.
- Bez odpovědi nic nezařazuj.

## Poličky

Polička (`type: "shelf"`) je pojmenovaný seznam kapel a/nebo CD (obojí může být na jedné poličce). Pole: `name` (povinné), `bands` a `cds` (ID existujících kapel / CD; obě pole jsou volitelná, může být i prázdná polička). Nemá obrázek ani odkazy.
- Před zápisem ověř, že všechna ID existují (`ls abduh-data/bands abduh-data/cds`); neexistující kapelu nebo CD nejdřív přidej. Validace jinak zápis odmítne.
- Nová polička: `{"type":"shelf","fields":{"name":"Pouštní blues","bands":["tinariwen"],"cds":["tinariwen-tassili"]}}` přes `add-entity.js`.
- Přidání na existující poličku: `--merge` s týmž `name` připojí nové ID do `bands`/`cds` (bez duplicit), existující položky nechá; jen s potvrzením uživatele.

## Apple Notes

Jedna poznámka může obsahovat více odkazů.
1. `node scripts/apple-notes.js <hledaný text>` → JSON `[{name, text}]` (jen čtení; při prvním použití macOS vyžádá povolení Automation pro Notes).
2. Z `text` vytáhni odkazy: `node scripts/extract-links.js < text`.
3. Při více než jednom odkazu nejdřív **potvrď s uživatelem počet** a pak zpracuj každý jako samostatnou položku (kapela nebo album podle odkazu).

## Pozor

- Odkazy v textu bio jsou wikilinky `[[id|text]]`; ručně je nepiš, dělá je `add-entity` a `scripts/link-bios.js`. Chybný odkaz oprav tak, že `[[id|text]]` změníš zpět na `text` (u jednoslovných názvů, které jsou i běžná slova, případně přidej jméno do `STOPLIST` v `scripts/lib/link-bio.js`).

- **Nikdy nepoužívej `--force`** (přepsal by existující entitu). Doplnění chybějících polí dělá `--merge`.
- `--merge` doplňuje jen prázdná pole; u `links`, `members` a `tags` připojí nové položky, existující nechá; bio a ostatní vyplněná pole nepřepíše.
- Výměna už existujícího obrázku (`add-image --force`) jen na výslovné přání uživatele.
- Obrázek kapely se použije až po schválení; obal alba se použije rovnou. Obrázky nejsou povinné.
- Ve sbírce jsou ID unikátní napříč všemi typy (kapela a tag nemohou mít stejné ID).
- Styl nebo nástroj, který neexistuje, jde založit přes `add-entity.js` (`{"type":"instrument","fields":{"name":"txalaparta"},"body":"popis česky"}`, u stylu `"type":"style"`). Zakládej je jen na žádost uživatele nebo když je nutně potřebuješ; u kapely jinak nevymýšlej styl.
- Nástroje mají jen `name`, popis (`body`, česky, vlastními slovy) a volitelně obrázek: `node scripts/add-image.js instrument <id> <url|soubor> --source <stránka>`. Emoji se nepoužívají.
- Když je ID obsazené jiným typem (např. `lira` je kapela), použij jiný název (`lira (nástroj)` → `lira-nastroj`).
