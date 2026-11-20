# K ověření

Průběžný seznam věcí, které je potřeba ověřit nebo rozhodnout na konci. Zdroj: hlášení agentů při doplňování bií a obrázků u kapel. Zapsáno 2026-11-19. Ke každé položce je ID kapely (soubor `abduh-data/bands/<id>.md`).

Značení: `[ ]` čeká, `[x]` vyřešeno.

## Stav zpracování bií a obrázků u kapel

Aktualizováno 2026-11-20 (po dávce u).

- Kapel celkem: 2 727. Bio má 2 157 (79 %), obrázek 1 415 (52 %).
- Se stylem a zemí: 638 kapel. Bez bia zbývá 116.
- Jen se zemí (bez stylu): 2 087 kapel. Bez bia zbývá 1 054.
- Dávky (150 kapel, 5 agentů po 30): pilot 60, hlavní průchod 570, opakování přeskočených 142, dávky d až o po 150 (kapely bez stylu, náhodný výběr z těch, které nikdo nezkoušel). Dávka l: bio 108, obrázky 86. Dávka m: bio 107, obrázky 73. Dávka n: bio 125, obrázky 50 (včetně 20 kapel přeskočených v m-03). Dávka o: bio 118, obrázky 57. Dávka p: bio 100, obrázky 46 (p-00 17/8, p-01 20/11, p-02 21/11, p-03 21/6, p-04 21/10). Dávka q: bio 109, obrázky 46 (q-00 27/15, q-01 19/13, q-02 20/8, q-03 20/6, q-04 23/4). Dávka r: bio 92, obrázky 43 (r-00 18/8, r-01 22/5, r-02 18/11, r-03 15/8, r-04 19/11). Dávka u (11 kapel, bio 3, obrázky 0). Dávka t (opakování 23 kapel nehledaných kvůli limitu): bio 6, obrázky 3. Dávka s (poslední nezkoušené, 84 kapel): bio 45, obrázky 24 (s-00 14/7, s-01 18/11, s-02 13/6).
- Nikdy nezkoušených kapel bez bia už nezbývá. Část kapel z dávek r a s se kvůli vyčerpanému limitu WebSearch nehledala vůbec (`issa-hassan`, `drita`, `kokoura`, `tezeta`, `tiago-sa`, `kana`, `jur-domingo`, část s-00) a jde zopakovat. Přeskočených a neověřených je asi 510 (viz oddíl 7).
- Odkazy v bio: po každé dávce se pouští `node scripts/link-bios.js --write` (jména kapel jako `[[id|text]]`); automatické odkazy občas zachytí název alba nebo běžné slovo, takové opravit zpět na text.
- Tip pro stahování obrázků z Wikimedie při chybě 429: `https://commons.wikimedia.org/wiki/Special:FilePath/<soubor>?width=800` (někdy vrací HTML, pak přímo z `upload.wikimedia.org`).
- Commity: poslední data v commitu `4f80429`. Poslední commit: dávka n (`2542b14`). Necommitnuto: dávky p až u, Gijs Levelt (kapela, 2 alba), obrázek nástroje trumpet a tento soubor.

Při každé další dávce aktualizuji tato čísla, doplním nové položky do oddílů 1 až 8 a vyřešené označím `[x]`.

## 1. Duplicity a překryvy záznamů

- [ ] `aynur` a `aynur-dogan`: stejná umělkyně, stejná fotka. Jeden záznam odstranit.
- [ ] `ambrogio-sparagna` a `ambrogio-sparagna-e-opi-orchestra-popolare-italiana`: skoro duplicita (druhý bez obrázku).
- [ ] `riccardo-tesi` a `riccardo-tesi-patrick-vaillant`: sólo a duo, spíš samostatné záznamy.
- [ ] `edyta-geppart-kroke`, `kroke`, `nigel-kennedy-kroke`: překryv.
- [ ] `tomatito` a `tomatito-michel-camilo`: překryv.
- [ ] `altan` a `altan-urag`: souvisí.
- [ ] `goran-bregovic` a `alkistis-protopsalti-goran-bregovic`: kombinovaný záznam.
- [ ] `hijaz` a `hijazz-omar-al-musfi`: dvě různé položky s podobným ID.
- [ ] `marina`, `marina-heredia`, `marina-herlop`: nejspíš různé osoby.
- [ ] `mitya-kuznecov` a `mitya-kuznecov-egor-strelnikov`: nejspíš sólo a duo.
- [ ] `seu-jorge` a `seu-jorge-almaz`: Almaz je jeho projekt, ověřit, zda je to duplicita.
- [ ] `okay-temiz` a `okay-temiz-oriental-wind-the-karnataka-college-of-percussion`: u druhého je bio i foto jen o Okay Temizovi.
- [ ] `ricardo-lemvo` a `ricardo-lemvo-makina-loca`: překryv.
- [ ] `fanfare-ciocarlia` a `fanfare-ciocarlia-vs-boban-and-marko-markovic-orchestra`; `boban-i-marko-markovic` (bio i foto jen o Bobanovi).
- [ ] `the-funk-ark` a `funk-ark`: pravděpodobně stejná kapela.
- [ ] `barana-co` a `barana-trio`: menší sestava téhož souboru.
- [ ] `lleuwen` a `lleuwen-steffan`: stejná osoba?
- [ ] `lo-griyo`, `kora-jazz-band`: ověřit, že nejsou překryty jiným záznamem.
- [ ] `kontrabando` a `alkis-zopoglou-kontrabando`: duplicita.
- [ ] `maher-sousou-cissoko` a `sousou-maher-cissoko`: duplicita.
- [ ] `toubab-krewe` a `toubab-krewe-kora-kamelengoni`: stejná kapela.
- [ ] `darko-rundek-cargo-orkestar`: ověřit, zda existuje i samostatný `darko-rundek`.
- [ ] `duoud` a `smadj`: Smadj je členem dua, ověřit překryv.
- [ ] `blanchard-gerard` a `gerard-blanchard`: duplicita.
- [ ] `ida-kelarova`, `ida-kelarova-a-jazz-famelija-guests`, `ida-kelarova-a-duzda-desiderius-a-jazz-famelija`: související uskupení.
- [ ] `iva-bittova`, `bittova`, `bittova-godar`: překryv.
- [ ] `sofia-papazoglou` a `nikos-papazoglou`: jiní umělci, ověřit.
- [ ] `seckou-keita` a `catrin-finch-seckou-keita`: sólo a duo.
- [ ] `kila-oki` a `kila`: spolupráce, překryv.
- [ ] `gotan-project-yann-tiersen` s `gotan-project` a `yann-tiersen`: kombinovaný záznam.
- [ ] `juan-formell` a `los-van-van`: ověřit překryv.
- [ ] `the-karindula-sessions`: je to kompilační album (Crammed Discs, 2011), spíš převést na CD.
- [ ] `almasala` a `al-nubatiyya`: jiné záznamy, ověřit.
- [ ] `chehade-brothers` a `the-chehade-brothers`: duplicita.
- [ ] `concha-buika`, `buika`, `buika-jacob-sureda`, `concha-buika-jacob-sureda`, `concha-buika-y-chucho-valdes`: až pět záznamů téže umělkyně.
- [ ] `lala-njava` a `njava`: nejspíš jiné entity (rodinná skupina).
- [ ] `johanna-juhola` a `alakotila-timo-johanna-juhola`: jiná entita.
- [ ] `lole-y-manuel` a `lole`: nejspíš tatáž zpěvačka sólově.
- [ ] `ferus-mustafov` a `sondorgo-ferus-mustafov`; `east-west-orchestra` a `east-west-ensemble`: ověřit překryv.
- [ ] `gotan-project` a `gotan-project-yann-tiersen`: spolupráce, ne duplicita.
- [ ] `corse-musiques-sacrees-sittimana-santa-in-bunifaziu`: terénní nahrávka Ocora, ne kapela.
- [ ] `balogh-kalman`, `balogh-kalman-the-gipsy-cimbalom-band`, `balogh-kalman-meta`: tři záznamy, překryv.
- [ ] `hector-zazou`, `hector-zazou-barbara-eramo-stefano-saletti`, `eva-quartet-hector-zazou`: spolupráce, ověřit.
- [ ] `ivan-gutierrez-madera` a `madera`: příbuzný záznam.
- [ ] `ofra-haza-madonna-of-the-east-1957-2000-aids`: chybné ID, správně `ofra-haza`; ověřit existenci jiného záznamu.
- [ ] `ar-braz-dan`: jméno ve sbírce je prohozené, správně Dan Ar Braz.
- [ ] `marina` (Marina Herlop má CD `marina-herlop-dja-dja`, `marina-herlop-pripyat`).
- [ ] `mahsa-marjan-vahdat` a `mahsa-vahdat-marjan-vahdat`: stejné duo (foto jen Mahsa).
- [ ] `kila` a `kila-oki`; `souad-massi` a `souad-asla`: překryv.
- [ ] `ross-daly` a `niki-tramba-ross-daly-labyrinth`: kolaborace.
- [ ] `qawwali-flamenco`: spíš projekt nebo album než kapela. `narodni-tanec-merengue`: generický název.
- [ ] `africa-express-presents-maison-des-jeunes`: album projektu Africa Express, ne kapela.
- [ ] `zulal` a podobně: viz rozpory zemí níže.
- [ ] Sloučeno už dříve: `cheikh-sidi-bemol` do `sidi-bemol` (hotovo, commit `7db7b75`). Bio o osobě Hocine Boukella (původní `cheikh-sidi-bemol`) ve zbylém záznamu chybí.
- [ ] (dávka l) `taraf-of-haidouks-kocani-orkestar` vs `taraf-de-haidouks` a `kocani-orkestar`: spolupráce dvou souborů, samostatné záznamy.
- [ ] (l) `didier-lockwood-raghunath-manet` vs `didier-lockwood`; `agnes-buen-garnas-jan-garbarek` vs `jan-garbarek`; `skruk-rim-banna` vs `rim-banna`: kolaborace vs. samostatní umělci.
- [ ] (l) `clejani-express` vs `lautari-de-clejani` a `viorica-si-ionita-din-clejani`: možná stejné uskupení.
- [ ] (dávka m) `madredeus-a-banda-cosmica` vs `madredeus`; `duo-brotto-lopez` vs `brotto-lopez`: stejné nebo překryvné záznamy.
- [ ] (m) `gabriel-marie-yacoub` vs `gabriel-yacoub`; `hector-zazou-barbara-eramo-stefano-saletti` vs `hector-zazou` a `eva-quartet-hector-zazou`; `mitya-kuznecov` vs `mitya-kuznecov-egor-strelnikov` (pravděpodobně duplicita); `annie-ebrel-quartet` (samostatná `annie-ebrel` neexistuje).
- [ ] Dávka n: `capitan-tifus` je dnes La Fanfarria del Capitán (samostatný soubor není).
- [ ] Dávka o: `klazz-brothers-edson-cordeir` (album, ne kapela; nejspíš duplicita jiného ID Klazz Brothers), `concha-buika-y-chucho-valdes` (spolupráce), `mahsa-vahdat-marjan-vahdat`.
- (dávka p) Žádné nové duplicity. Arat Kilo a Debo Band se odkazují přes Bruck Tesfaye (nejde o duplicitu).

## 2. Rozpor země ve sbírce a ve zdrojích

Opraveno: `vulgargrad` (Austrálie), `zoran-predin-the-gypsy-swing-band` (Slovinsko), `baaziz` (Alžírsko), `sidi-bemol` (+ Alžírsko).

- [ ] `jacques-brel`: ve sbírce Francie, Belgičan.
- [ ] `django-reinhardt`: ve sbírce Francie, Wikipedie uvádí Belgii (Liberchies).
- [ ] `carla-bruni`: narozena v Turíně, ve sbírce Francie.
- [ ] `osibisa`: vznikla v Londýně, ve sbírce Ghana.
- [ ] `bombay-dub-orchestra`: britský projekt, ve sbírce Indie.
- [ ] `peter-lipa`: ve sbírce Česko, Slovák z Prešova.
- [ ] `tito-puente`: ve sbírce USA i Kuba, narozen v USA.
- [ ] `africando`: ve sbírce USA, podle Wikipedie senegalská kapela.
- [ ] `minor-empire`: ve sbírce Turecko, turecko-kanadská z Toronta.
- [ ] `giora-feidman`: ve sbírce Argentina, argentinsko-izraelský.
- [ ] `zuco-103`: ve sbírce Brazílie, nizozemské uskupení z Rotterdamu.
- [ ] `da-lata`: londýnská kapela, ve sbírce Brazílie.
- [ ] `daniel-kahn-the-painted-bird`: kapela z Berlína, americký zpěvák.
- [ ] `mad-professor`: Velká Británie, ve sbírce Guyana.
- [ ] `sudan-baronian-s-taksim`: Souren Baronian's Taksim z New Yorku, ve sbírce Súdán/Arménie.
- [ ] `zulal`: trio z New Yorku, ve sbírce Arménie.
- [ ] `aman-aman`: valencijská skupina, ve sbírce Barcelona/Španělsko.
- [ ] `van-merwijks-music-machine`: Nizozemsko, ve sbírce Belgie.
- [ ] `ljiljana-buttler`: MusicBrainz uvádí Německo, ve sbírce Srbsko.
- [ ] `intik`: alžírská skupina, ve sbírce Francie.
- [ ] `trio-chemirani`: žije ve Francii, ve sbírce Írán.
- [ ] `l-arpeggiata`: evropský soubor staré hudby (Christina Pluhar), ve sbírce Francie.
- [ ] `rebellion-the-recaller`: působí v Německu, ve sbírce Gambie.
- [ ] `ahava-raba`: zdroje se rozcházejí (USA vs. Berlín).
- [ ] `toumast`: ve sbírce Mali, zdroje uvádějí Niger.
- [ ] `ezza`: ve sbírce Niger, působí ve Francii.
- [ ] `emmanuel-jal`: ve sbírce Sudán, jihosúdánsko-kanadský.
- [ ] `encardia`: soubor vznikl v Řecku, ve sbírce Itálie.
- [ ] `bajofondo-tango-club`: argentinsko-uruguayská, ve sbírce jen Argentina.
- [ ] `joe-zawinul`: Rakušan, ve sbírce USA.
- [ ] `joe-driscoll-sekou-kouyate`: americko-guinejské duo, ve sbírce Guinea.
- [ ] `kiran-ahluwalia`: Kanaďanka narozená v Indii, ve sbírce Indie a Spojené království.
- [ ] `karsh-kale`, `lura`, `ghalia-timnaa-benali`: drobné rozdíly v zemích podle zdrojů.
- [ ] `deladap`: Wikipedie ho popisuje jako rakouskou kapelu Stani Vany, ve sbírce Česko (bez bia).
- [ ] `konkoma`: londýnská afro-funk kapela, ve sbírce Ghana (bez bia).
- [ ] `nim-sofyan`: ve sbírce Austrálie a Turecko, MusicBrainz skupina z Rakouska (bez bia).
- [ ] `thilges`: Írán je podezřelý (bez bia).
- [ ] `owiny-sigoma-band`: anglo-keňská skupina, ve sbírce Keňa.
- [ ] `kora-jazz-band`: ve sbírce Guinea, členové původem ze Senegalu.
- [ ] `cheikh-sidi-bemol` / `sidi-bemol`: viz výše.
- [ ] `world-kora-trio`: ve sbírce Mali, trio amerického violoncellisty, malijského hráče na koru a francouzského perkusionisty.
- [ ] `bobo-rondelli`, `elena-ledda`, `enzo-avitabile`, `ska-j` a další: země sedí, ale styl pizzica je chybný (viz oddíl 3).
- [ ] `kofia`: švédsko-palestinská kapela z Göteborgu, ve sbírce Palestina.
- [ ] `filastine`: Grey Filastine (Los Angeles / Barcelona), ve sbírce Španělsko.
- [ ] `duoud`: pařížské duo (Smadj, Mehdi Haddab), ve sbírce Tunisko.
- [ ] `smadj`: francouzský hudebník tuniského původu.
- [ ] `george-brooks`: americký saxofonista, ve sbírce Indie (nejistá fotka, 18 fanoušků na Deezeru).
- [ ] `monika-jalili`: narozená v USA, částečně perského původu, ve sbírce Írán.
- [ ] `syriana`: britsko-syrský projekt, ve sbírce Sýrie.
- [ ] `violons-barbares`: francouzské trio ze Štrasburku, ve sbírce Mongolsko.
- [ ] `maher-sousou-cissoko`: švédsko-senegalské duo, ve sbírce Švédsko.
- [ ] `ani-cordero`: narozena v Bostonu, ve sbírce Portoriko.
- [ ] `lenka-lichtenberg`: kanadská umělkyně českožidovského původu, ve sbírce Česko.
- [ ] `eljuri`: MusicBrainz ji vede v USA, ve sbírce Ekvádor (bez bia).
- [ ] `trio-joubran`: palestinské trio z Nazaretu, ve sbírce Izrael.
- [ ] `carmen-souza`: Portugalka kapverdského původu, ve sbírce Kapverdy.
- [ ] `mo-kalamity`: francouzsko-kapverdská, ve sbírce Kapverdy.
- [ ] `gawaher`: Súdánka působící v Káhiře, ve sbírce Egypt.
- [ ] `magos-herrera`: mexická zpěvačka, ve sbírce Španělsko.
- [ ] `bugotak`: projekt z Novosibirska, ve sbírce Tuva/Rusko.
- [ ] `al-akhareen`: francouzsko-palestinsko-syrský projekt, ve sbírce Sýrie.
- [ ] `tamara-obrovac-quartet`: foto jen vedoucí kapely.
- [ ] `janka-nabay-and-the-bubu-gang`: sídlila v USA, ve sbírce Sierra Leone.
- [ ] `dengue-fever`: Los Angeles, ve sbírce Kambodža.
- [ ] `uusikuu`: sídlí v Tübingenu, ve sbírce Finsko.
- [ ] `debademba`: vznikla v Paříži, ve sbírce Mali.
- [ ] `fanga-maalem-abdallah-guinea`: francouzská afrobeatová kapela, ve sbírce Maroko.
- [ ] `alians` (Rusko vs. polská kapela) a `magica` (Kolumbie vs. rumunská): bez bia.
- [ ] `analog-players-society`: brooklynský projekt s guinejskou hudbou, ve sbírce Guinea.
- [ ] `deladap`: rakouská kapela (Stani Vana), ve sbírce Česko (bio teď je).
- [ ] `hans-ludemann-trio-ivoire`: německo-ivorské trio z Hamburku, ve sbírce Pobřeží slonoviny.
- [ ] `serge-teyssot-gay-khaled-aljaramani`: francouzsko-syrské duo, ve sbírce Sýrie.
- [ ] `electric-jalaba`: sídlí v Londýně, ve sbírce Maroko.
- [ ] `poza`: Amsterdam, ve sbírce Rusko (bez bia).
- [ ] `kotchnak`: založen ve Francii, ve sbírce Arménie.
- [ ] `mikidache`: Mayotte, ve sbírce Madagaskar.
- [ ] `the-shin`: vznikla ve Stuttgartu.
- [ ] `elliot-goldenthal`: americký skladatel, ve sbírce Mexiko.
- [ ] `alika`: uruguayskoargentinská, narozená v Montevideu.
- [ ] `la-chiva-gantiva`: sídlí v Bruselu, zakladatelé Kolumbijci.
- [ ] `vqee`: sólová zpěvačka z Keni žijící v Dánsku, ne kapela.
- [ ] `al-andaluz-project`: MusicBrainz uvádí Německo (Estampie z Mnichova).
- [ ] `dyaoule-pemba`: založila haitská zpěvačka, sídlí ve Francii.
- [ ] `aronas`: australský jazzový soubor, ve sbírce jiná země.
- [ ] `maguare`: sídlí v Gentu, ve sbírce Kolumbie.
- [ ] `gai-saber`: italská skupina z okcitánských údolí, ve sbírce Francie.
- [ ] `hughes-de-courson`: ve sbírce Egypt + Francie, bio uvádí jen Francii.
- [ ] `the-ukrainians`: britská skupina hrající ukrajinskou hudbu, ve sbírce Ukrajina.
- [ ] `la-negra`: zpěvačka Amparo Velasco Bautista, ne kapela.
- [ ] `trio-fado`: Berlín, ve sbírce Německo (sedí).
- [ ] `dub-colossus`: britsko-etiopský projekt, ve sbírce Etiopie.
- [ ] `deti-picasso`: armensko-ruská skupina, ve sbírce Rusko.
- [ ] `transsylvanians`: maďarský soubor založený v Berlíně, ve sbírce Německo.
- [ ] `anthony-joseph-the-spasm-band`: britsko-trinidadský, ve sbírce Trinidad (bio uvádí Velkou Británii).
- [ ] `dilec-koc`: spíš Dilek Koç (turecká zpěvačka), ve sbírce Řecko (bez bia).
- [ ] `opa`: MusicBrainz má řeckou O.P.A., ve sbírce Rusko (bez bia).
- [ ] (dávka l) `solas`: americká skupina (zal. 1996), ve sbírce Irsko.
- [ ] (l) `kanazoe-orkestra`: Toulouse (Francie), ve sbírce Burkina Faso. `levon-minassian`: Francie, ve sbírce Arménie. `badume-s-band`: Francie (Bretaň), ve sbírce Ethiopia. `marwan-abado`: Rakousko (narozen v Bejrútu), ve sbírce Palestina.
- [ ] (l) `oneira`: Sonicbids uvádí Marseille, ve sbírce Řecko. `quimbombo`: New York (kubánský son), ve sbírce Kuba. `otros-aires`: argentinská, založená v Barceloně, ve sbírce Španělsko. `orchestre-national-de-barbes`: alžírský soubor z Paříže. `tekameli` (MusicBrainz Španělsko vs. Francie), `la-panika` (Belgie vs. Francie), `strune` (Slovinsko vs. Makedonie), `les-triaboliques` (GB), `urs-karpatz` (země neověřena).
- [ ] (dávka m) `lonely-drifter-karen`: Brusel (Belgie), ve sbírce Švédsko. `klaus-paier-asja-valcic`: Rakousko a Chorvatsko, ve sbírce Německo. `jessie-evans`: USA, Berlín, dnes prý Brazílie. `paris-to-kyiv`: projekt Alexis Kochan (Kanada). `madrid-de-los-austrias`: vídeňské duo (Rakousko), ve sbírce Španělsko. `carlton-rara`: sólista z Paříže, ve sbírce Haiti. `invisible-system`: britský producent, ve sbírce Etiopie. `amanar`: Amanar de Kidal, identita středně jistá. `synthesis`: makedonská, jméno se opakuje.
- [ ] (m) `keyvan-chemirani`: narozen v Paříži, ve sbírce Írán. `anabel-santiago`: asturská zpěvačka, ve sbírce Argentina (narozena tam). `anonimi`: berlínská skupina hrající řeckou hudbu, země Řecko jen okrajově. `ghazal`: perskoindické duo Kalhor a Khan, ve sbírce India, identita méně jistá. `amarok`: španělská skupina z roku 1990 (existuje i polská stejného jména). `chalaban`: založeno v Budapešti.
- [ ] Dávka n: `paniks` (data Maďarsko, nalezená skupina ze Subotice v Srbsku), `kobo-town` (Trinidad a Tobago, vznik v Torontu), `galeet-dardashti` (Írán, působí v New Yorku), `transjoik` (Norsko, Sher Miandad Khan z Pákistánu), `kostadin-gugov` (Makedonie, narozen v Sofii), `paul-brady` (Irsko, je ze Severního Irska), `loreena-mckennitt` (Irsko, je Kanaďanka), `lou-seriol` (Francie, skupina z Piemontu v Itálii), `paolo-fresu` (Francie, je Ital ze Sardinie), `yvonne-sanchez` (Česko, narozená v Polsku), `kassav` (Francie, bio Guadeloupe), `bevinda` (Francie, portugalsko-francouzská), `kek-lang` (Maďarsko nepotvrzeno), `aziatic` (Belize, sólový interpret).
- [ ] Dávka o, země: `fanfare-vagabontu` (Moldova vs. Rumunsko/Francie), `ensemble-badila` (Indie vs. francouzské vedení), `maria-berasarte` (Portugalsko vs. baskická zpěvačka, Španělsko), `bebo-cigala` (Španělsko, Bebo je Kubánec), `moussa-diallo` (Mali vs. Dánsko), `radio-citizen` (Německo, Berlín/Mnichov), `vlatko-stefanovski-miroslav-tadic` (Bulharsko vs. Makedonie), `alee` (Francie vs. kanadská zpěvačka), `interzone` (Sýrie, identita jen z jména).
- [ ] (p) Země/styl: `malkit-singh` (Indie, žije v Anglii), `karantamba` (Senegal, zdroje Gambie), `sarazino` (Ekvádor, zdroje alžírský hudebník), `georges-lammam` (styl jazz, ve skutečnosti housle a zpěv, Libanon), `daiqing-tana` (Čína, Mongolka z Čching-chaje), `sondorgo-ferus-mustafov` (Maďarsko, Mustafov je Makedonec), `david-yengibarjan` (akordeonista žijící v Maďarsku), `joel-zwick` (režisér, ne hudebník; země Řecko podezřelá, nejspíš smazat).
- [ ] (p) Chybný styl `pizzica` (zdroje uvádějí Sicílii): `matilde-politi`, `unavantaluna`.
- [ ] (p) Chybné styly psychedelic/rock u tureckých záznamů: `nilufer-saritas`, `turkish-gypsies`, `luxus`, `engin-gurkey-nabiz` (perkusní/balkánský projekt).
- [ ] (p) `karolina` má styl sephardic, zdroje ji uvádějí jako izraelskou rock/soul/pop zpěvačku (Habanot Nechama).
- [ ] (p) `feryal-oney`: styl psychedelic/rock nesedí (zdroje ji zmiňují jen jako bývalou členku Kardeş Türküler).
- [ ] (q) Země/styl: `ghymes` (czech + slovakia, zdroje jen Slovensko), `transglobal-underground` (czech, jde o londýnskou skupinu), `amazigh-kateb` (france, narozen v Alžírsku), `les-pecheurs-de-perles` (iraq, skupina ve Francii), `kabako` (styl sephardic, jde o izraelskou skupinu na západoafrické perkuse), `becaye-aw` (mauritania, žije v Oslu), `nizar-rohana` (palestine, žije v Nizozemsku), `omar-ka-fula-band` a `mark-lotz-meets-omar-ka-a-fula-s-call` (senegal, Rotterdam / německý spoluhráč), `ersatzmuzika` (Rusko, sídlí v Berlíně), `skip-die` (Jižní Afrika, afro-nizozemský projekt), `da-cruz` (brasil, sídlí ve Švýcarsku), `irina-karamarkovic-band` (serbia, zdroje Priština), `the-spy-from-cairo` (usa, Moreno Visini z Itálie), `khac-chi-ensemble` (Vietnam, Vancouver), `mariana-montalvo` (Chile, žije v Paříži), `emad-sayyah` (styl jazz, jde o libanonského zpěváka belly dance hudby).
- [ ] (r) Země/styl: `zsaratnok` (Bulharsko, zdroje Maďarsko), `ska-cubano` (cuba, londýnský projekt), `zegar-zivi` (croatia, zpěváci Srbové, Womex uvádí Serbia), `silvia-filipe` (Polsko, MusicBrainz dvě portugalské Sílvie Filipe), `zabda` (Francie, nalezený umělec z Burkiny Faso), `mamadou-diabate` (Burkina Faso + Mali, zdroje malijský hráč na koru), `jawhar` (styl jazz, je to folk/šaabí), `cengiz-onural` (styl psychedelic/rock nesedí), `round-mountain` (styl country/bluegrass/appalachian nesedí duu z Santa Fe), `kaja` (soubor uvádí švédskou kapelu, Wikipedie jen Kajagoogoo).

- (dávka s) Žádné nové duplicity.
- [ ] (s) Země/styl: `fofoulah` (senegal, zdroje londýnská skupina), `geko-jones` (Colombia, zdroje kolumbijsko-portorikánský původ, Brooklyn), `fenoamby` (Madagascar, MusicBrainz Réunion), `mussa-molo` (Senegal, zdroje Bordeaux).

## 3. Chybné styly ve sbírce

Styly jsem u kapel neměnil. Hlásili je agenti jako nesedící.

- [ ] Hromadně psychedelic/rock u tureckých kapel, které jsou ve skutečnosti folk, jazz nebo pop: `ahmet-aslan`, `arto-tuncboyaciyan`, `ayfer-duzdas`, `aynur-dogan`, `aynur`, `barana-co`, `barana-trio`, `bendeniz`, `burhan-ocal-the-trakya-all-stars`, `cem-yildiz`, `cemil-kocgun`, `cenk-erdogan`, `dolapdere-big-gang`, `ensemble-fisfuz`, `erkin-koray`, `grup-yorum`, `hakan-vreskala`, `istanbul-oriental-ensemble`, `kardes-turkuler`, `kirika`, `kolektif-istanbul`, `mercan-dede`, `mikail-aslan`, `mircan-kaya`, `norrda`, `oyku-berk`, `selim-sesler`, `suzan-kardes`, `taksim-trio`, `tarkan`, `ulas-hazar`, `yasemin-goksu`, `zeynep-karababa`, `rojda`, `okay-temiz`, `orient-expressions`.
- [ ] Hromadně pizzica u italských kapel, které nejsou ze Salenta: `acquaragia-drom`, `banda-ionica`, `bobo-rondelli`, `elena-ledda`, `enzo-avitabile`, `figli-di-madre-ignota`, `filippo-gambetta`, `funk-off`, `ipercussonici`, `l-orchestra-di-piazza-vittorio`, `luigi-cinque`, `mauro-palmas`, `nakaira`, `nando-citarella`, `nuova-agricola-associazione`, `petra-magoni-ferruccio-spinetti`, `piccola-banda-ikona`, `re-niliu`, `riccardo-tesi`, `rita-botto`, `roy-paci-aretuska`, `rumba-de-bodas`, `ska-j`, `uaragniaun`, `unnaddare`, `canto-antico`, `choer-de-neoneli`, `etta-scollo`, `la-banda-di-piazza-caricamento`, `baciamolemani`, `kantango`.
- [ ] Styl sephardic u kapel, které nejsou sefardské: `yinon-muallem`, `ara-malikian`, `ayala-asherov`, `beirut-oriental-ensemble`, `boogaloo`-styl a podobně (`gilad-atzmon-uk`, `hadar-noiberg`, `israeli-ethnic-ensemble`, `koby-israelite`, `kruzenshtern-parohod`, `oran-etkin`, `debka-fantasia`).
- [ ] Styl jazz: `julia-boutros`, `claude-chalhoub`, `dani-gurgel`, `eliane-elias`, `marcel-khalife`, `soumaya-baalbaki`, `tania-saleh`, `hanine-y-son-cubano`, `hoba-hoba-spirit` (nayda), `iness-mezel` (gnawa), `abaji`, `rima-khcheich`.
- [ ] Další rozpory: `easy-star-all-stars` (latin→reggae), `el-efecto` (mpb→prog rock), `elo-da-corrente` (mpb→hip hop), `marcelo-d2` (mpb→rap), `chango-spasiuk` (tango→chamamé), `childish-gambino`, `tomer-yosef`, `tanya-tagaq`, `buffy-sainte-marie`, `liz-carroll`, `curtis-eller-s-american-circus`, `lizz-wright`, `grace-jones`, `doreen-shaffer`, `renato-borghetti`, `marie-jo-therio`, `bethany-rufus`, `cabruera`, `bonsucesso-sambaclube`, `rabo-de-lagartixa`, `raina-rai`, `ahmed-soultan`.

- [ ] (s) Styl pravděpodobně chybný: `milagro-acustico` (pizzica), `the-third-planet` (pizzica), `mario-crispi` (pizzica, ve skutečnosti sicilský flétnista, zakladatel Agricantus).

## 4. Nejistá identita nebo slabý zdroj bia

- [ ] `yanka`: identita z jména a Bulharska.
- [ ] `cero39`: nejistá fotka (pravděpodobně Mauricio Álvarez).
- [ ] `norig`: zdroj slabý a vnitřně nekonzistentní.
- [ ] `ricardo-tete`: identita jen shodou jména, země a stylu.
- [ ] `banda-la-costena`, `cafe-preto`, `the-mystery-of-the-bulgarian-voices`: nejistá shoda s nalezenými zdroji.
- [ ] `latifa`: předpokládána Latifa Arfaoui.
- [ ] `william-vivanco`, `misia`, `bebel-gilberto`: identitu z fotky nelze potvrdit.
- [ ] `java`: spárováno podle země s francouzskou rapovou skupinou.
- [ ] `arev-folk-ensemble`: existuje i washingtonský Arev Armenian Dance Ensemble.
- [ ] `sheva`: velmi obecné jméno, bez CD.
- [ ] `magic-carpet`, `kiosk`: shoda podle jména a země, na Deezeru dva stejnojmenní umělci.
- [ ] `aquabella`, `bittova-godar`: střední jistota.
- [ ] `tom-fire` (solo umělec, ne kapela), `daphne`, `bajka`, `cristina-maria` (bio jen o výstavě).
- [ ] `amariszi`, `budzillus`, `trio-de-janeiro`, `lengualerta` (sólo umělec?).
- [ ] Bia jen z výsledků vyhledávače: `hypnotix`, `trio-yas`, `budapester-klezmer-band`, `vrelo`, `giulia-y-los-tellarini`, `gigi`, `diabel-cissokho`, `bezunesh-bekele`, `aman-aman`, `toumast`, `toure-raichel-collective`, `trio-madeira-brasil`, `tallari`, `zulal`, `les-go-de-koteba`, `edalat-nasibov`, `farlanders`, `jidder`, `lek-sen`, `bola`, `elisa-point`, `tiharea`, `papa-chango`, `najma`, `xaile` (Last.fm wiki), `mounawar` (Sonicbids), `namogodine` (Sonicbids), `christina-rosmini` (EverybodyWiki), `segun-damisa` (blog), `suely-mesquita` (Jazzapedia), `tony-hanna`, `faela`.
- [ ] Bia, která agenti přiznali z paměti nebo z domněnek (dávka b-00 a b-04): `abaji`, `abraham-inc`, `acquaragia-drom`, `afel-bocoum`, `ahmed-abdul-malik`, `abdallah-ag-oumbadougou`, `ambrogio-sparagna`, `16-horsepower`, `dona-onete`, `doreen-shaffer`, `ebo-taylor`, `eliane-elias`, `enzo-avitabile-bottari`. Dub Syndicate: rok „kolem 1982“.
- [ ] Velmi krátké bio (1–2 věty): `tarabband`, `anselmo-crew`, `christian-zehnder`, `romano-drom`, `braagas`, `marijata`, `deishovida`, `asita-hamidi-s-bazaar`, `acetre`, `el-gafla`, `jaleo-real`, `carlos-beceiro`, `antonina-krzyszton`, `orkiestra-sw-mikolaja`, `mariana-sadovska`, `emahoy-tsegue`, `baaziz`, `vlatko-stefanovski`, `piers-faccini`, `edalat-nasibov`, `djelimady-tounkara`, `los-angeles-azules`, `lizz-wright`, `amal-murkus`, `ali-hassan-kuban`, `rachid-taha`, `thalma-de-freitas`.
- [ ] Bio o jiném subjektu: `the-silk-road-ensemble` (jen o iniciativě), `andy-irvine-paul-brady` (jen Andy Irvine a album), `the-chieftains-featuring-ry-cooder` (album San Patricio), `stan-getz-joao-gilberto` (o albu), `mauricio-maestro-feat-nana-vasconcelos`, `zuzuka-poderosa-kush-arora` (spolupráce), `enver-izmailov-s-trio`, `balogh-kalman-the-gipsy-cimbalom-band`, `jiri-pavlica-hradistan-filharmonie-brno`, `mohamed-abozekry-heejaz-extended`, `rasmus-lyberth-band`, `zoran-predin-the-gypsy-swing-band`, `ricardo-lemvo-makina-loca`, `okay-temiz-oriental-wind-the-karnataka-college-of-percussion`.
- [ ] Datum úmrtí v bio (ověřit): `andrea-parodi` (2006), `jimmy-cliff` (rok 2025), `melingo` (2026), `ben-sharpa` (červenec 2018), `muluken-melesse` (duben 2024), `misia` (2024), `soriba-kouyate` (2010).
- [ ] Bio zapsané s odkazem, ale stránku agent neotevřel (údaje jen ze shrnutí hledání): Faiz Ali Faiz, Fernanda Porto, Forro in the Dark, Najma, Mazal, Ghalia Benali.

- [ ] Nejistá identita nebo slabý zdroj (dávka g): `vesna-petkovic` (předpokládaná jazzová zpěvačka z Niše), `tom-diakite`, `zalem-delarbre` (Viberate popisuje jiného Zalema), `gadjenko` (jen profil CMTRA), `une-anche-passe`, `mario-bihari-bachtale-apsa`, `kontrabando`, `alpargata`, `hamelmal-abate`, `balkansemblet`, `toque-de-caixa`, `soniquete`, `mohamed-ilyas-nyota-zameremeta-orchestra-of-zanzibar`, `didier-labbe-quartet` (jen listing), `filastine`, `binobin`, `rachel-magoola` (identita pravděpodobná), `shakti` (předpokládáno McLaughlin, ne belgická kapela), `romanyi-rota` (jediný blog), `erik-marchand-vs-rodolphe-burger`, `amira-saqati`, `agnes-herczku-nikola-parov` (bio o spolupráci), `klezzmates` (obecný obrázek), `cornelia-catanga`, `djeneba-seck`, `ricardo-ribeiro`, `oy` (shoda s Deezerem jen podle jména), `vujicsics` (identita nejistá), `zee-avi` (bio jedna věta), `darko-rundek-cargo-orkestar` (bio i foto jen o Rundkovi).
- [ ] Překlepy v bio z dávky g opravené ručně: `ahmad-zahir`, `svanevit`.
- [ ] Překlepy v bio z dávky h opravené ručně: `the-cambodian-space-project`, `blanchard-gerard`, `sheela-bringi`, `dirtwire`.
- [ ] Slabé zdroje nebo nejistá identita (dávka h): `dochas`, `marco-lacaille`, `teodulia`, `maza-meze`, `paloma-del-cerro`, `katerina-papadopoulou`, `kulin-ban`, `vershki-da-koreshki`, `afrissippi`, `minuit-guibolles`, `bugotak`, `cordas-do-sol`, `sayon-bamba`, `rosa-zaragoza`, `richard-galliano-eddy-louiss` (bio jen o obou zvlášť), `romano-drom` (podle MusicBrainz), `ensemble-pesnokhorki`, `sheela-bringi`, `katerina-fotinaki` (jedna věta), `rotfront` (jedna věta), `leilia`, `yva-las-vegass`, `jah-wobble-the-chinese-dub-orchestra`.
- [ ] `tony-gatlif`: filmový režisér, ne kapela. Bio jedna věta, ověřit, zda patří do sbírky. Datum úmrtí (2026) v bio není.
- [ ] `adjiri-odametey`: Bandcamp odkaz agent přidal bez otevření, já jsem ověřil (sedí).
- [ ] Slabé zdroje nebo nejistá identita (dávka i): `batata-y-su-rumba-palenquera`, `kv-express`, `vandor-vokal`, `kanizsa-csillagai`, `maui-y-los-sirenidos`, `guelewar`, `yasko-argirov`, `tzouganakis-michalis`, `troka`, `sissokho-yakhouba`, `pape-fall-african-salsa`, `sharkiat-fathy-salama`, `abelardo-carbono` (skupinová fotka), `caligagan` (sólista?), `dokhandeme`, `synnove-bjorset`, `trio-tesis-los-pasos-perdidos`, `razia-said`, `sacha-silva`, `viviane`, `zieti`, `cuarto-poder`, `la-banda-municipale-de-santiago-de-cuba`, `drunksouls`, `gang-chenpa`, `maraveyas-ilegal`, `alerta-pachuca`, `orquestra-arab-de-barcelona`, `eugene-mona`, `east-west-orchestra`.
- [ ] Překlepy v bio z dávky i opravené ručně: `systema-solar`, `oni-wytars` („Okcidentem“ → „Západem“).
- [ ] Neobratné formulace v bio z dávky j (nejdou přepsat přes `--merge`): `balval` („Poslechnout se dají prvky jazzu…“), `dyaoule-pemba` („poté prosadila“).
- [ ] Bio bez zdroje nebo slabý zdroj (dávka j): `netslov`, `g-ny`, `balval`, `triny`, `mucho-indio`, `new-york-gypsy-all-stars`, `tajne-slunce`, `brath`, `marlene-dorcena`, `nevoa`, `karavan-familia`, `la-bundu-band`, `titiman-flores`, `malevaje`, `ross-daly`, `renaud-garcia-fons`, `vlasta-redl`, `boikot`, `kadril`, `prague-ska-conspiracy`, `alkis-zopoglou-kontrabando`, `oreka-tx`, `dick-o-brass`, `rageous-gratoons`, `guadi-galego-guillermo-fernandez`, `vieux-diop`, `g8-transglobal`, `hoboud`, `boot`, `mamer`, `iva-nova`, `jacky-molard-quartet`.
- [ ] `little-cow` (Kistehén, Maďarsko): kapela identifikovaná, bio a obrázek zatím chybí.
- [ ] Slabé zdroje nebo nejistá identita (dávka k): `carmen-paris`, `dona-rosa`, `tie-and-the-love-process`, `trio-enserie`, `ibro-lolov`, `santa-macairo-orkestar`, `atash`, `terne-chave`, `dub-in-da-trip` (text může být smíchaný s jinou kapelou), `nisos`, `uxia`, `trio-tzane`, `asmara-allstars`, `paradox-trio`, `pressburger-klezmer-band`, `plu`, `fatma-zidan`, `uxukalhus`, `rona-hartner-dj-click`, `joe-arroyo-y-la-verdad` (bio o Joe Arroyovi), `philip-koutev` (o skladateli), `camerata-meiga`, `elio-reve-su-charangon`, `reelroad`, `brenna-mac-crimmon` (ve sbírce „Mac Crimmon“), `perunika-trio`, `mystere-trio`, `thiossane-ablaye-ndiaye`, `garcia` (český projekt, jméno obecné), `mohobub`, `poeta-magica` (jedna věta), `martirio` (jedna věta), `johannes-linstead`, `la33`, `mustapha-teddy-addy` (zkomolené jméno, patrně Mustapha Tettey Addy), `juliette` (přeskočeno, patrně Juliette Noureddine), `trio-erik-marchand`, `afro-cuban-all-stars`, `red-baraat`, `mabulu`, `dunja-knebl`, `ray-lema`.
- [ ] Překlep nebo neobratnost v bio z dávky k: zatím nezkontrolováno, projít `mohamed-mounir` až `babatunde-olatunji` a další podle potřeby.
- [ ] Název s překlepem: `freshly-ground` (správně Freshlyground).
- [ ] Diakritika v bio dávky g-00 agent po zápisu nekontroloval: projít `oliver-mtukudzi`, `sussan-deyhim`, `manos-hadjidakis`, `hanggai`, `tonton-david`, `mohamed-abdelwahab`, `darko-rundek-cargo-orkestar`, `omar-sosa`, `lenka-lichtenberg`, `angelique-kidjo`, `fishtank-ensemble`, `kaya-project`.
- [ ] (dávka l) Bio z jedné věty (jen MusicBrainz): `dona-dumitru-siminica`, `azagaia`, `carla-pires`, `coco-mbassi`, `urs-karpatz`.
- [ ] (l) Bio ze snippetů vyhledávání, slabší zdroj: `kassa-mady-diabata` (jiný přepis jména), `les-triaboliques`, `trio-kazanchis`, `tam-tam-orchestra`, `ultra-high-flamenco`, `minoo-javan`, `abdeljalil-kodssi`, `tejedor`, `ousmane-toure`, `edward-ii`, `l-herbe-folle`, `hadja-kouyate-hadja-kouyate-et-les-guineens`, `va-ta-ga`, `rosenbergs-sjua`, `stepanida-borisova`, `mauresca-fracas-dub`, `sto-zvirat`, `hijas-del-sol`, `timothee-le-bour-youen-bodros`, `rumberos-catalans`, `erika-emigrante`, `alekos-vretos`, `habadekuk`, `trio-balkano`, `d-callaos`, `alaw`, `valravn`.
- [ ] (l) `jonas-knutsson-horn-please`: bio je hlavně o Jonasu Knutssonovi. `lucas-van-merwijk-the-cubop-city-big-band`: zdroj označený jako propagační. `plantec`: rozcházející se roky vzniku (2001 vs. 2003, v bio obojí).
- [ ] (dávka m) Slabší zdroj nebo nejistá identita (bio zapsáno): `ahilea` (spíš sólový DJ), `makyzard`, `trio-tekke`, `mutinda`, `la-banda-del-pepo`, `grada`, `terrakota`, `dunkelbunt`, `neocekavany-dychanek`, `sign-of-thyme`, `dj-click`, `metamorphosis` (jediný zdroj festival), `moondo`, `shiran`, `gipsy-mafia`, `gudrun-holck`, `anissa-bensalah`, `lego` (sólista), `johnny-kowalski-and-the-sexy-weirdos`, `dirtmusic`, `erik-truffaz` a `ana-moura` (bio jen 1–2 věty), `ajam-band`, `maria-joao-mario-laginha` (jen dva údaje), `ramata-diakite`.
- [ ] (m) Slabší zdroj: `adrien-moignard` (souhrn z webů), `hector-zazou-barbara-eramo-stefano-saletti` (jediný zdroj AllMusic), `annie-ebrel-quartet` (bio o zpěvačce, ne o kvartetu), `anonimi`, `ghazal`, `amarok`.
- [ ] Dávka n, slabé zdroje nebo nejistá identita: `aly-keita` (en Wikipedie je o fotbalistovi), `mikea`, `jacinta`, `tram-des-balkans`, `malalma`, `per-og-lars-lilholt-next-stop-svabonius-folkband`, `finzi-mosaique-ensemble`, `omfo` (jediný zdroj blog), `rascasuelos`, `brotto-lopez`, `lavach`, `gaada-diwane-bechar`, `lalo-zanelli-ombu`, `laima-jansone`, `salamat`, `chouteira`, `raznotravie`, `kek-lang`, `alla-fagra`, `radio-babel-marseille`, `zaman-fabriq`, `forty-thieves-orkestar`, `fagel-roc`, `yacine-the-oriental-groove`, `aziatic`, `capitan-tifus` (rok vzniku se liší), `zulu-9-30`, `black-gandhi`, `peyoti-for-president`, `aline-de-lima`, `ernestine-deane`, `ukamau-y-ke`.
- [ ] `ida-kelarova-a-jazz-famelija-guests` a `ida-kelarova-a-duzda-desiderius-a-jazz-famelija`: bio je hlavně o Idě Kelarové. `petro-loukas-chalkias-company`: bio popisuje jen klarinetistu. `debruit-alsarah`: album Aljawal (2013). `afro-peruvian`: název žánru, ne kapela.
- [ ] Dávka o, slabé zdroje: `georgia-dagaki`, `ay-kherel`, `fanfare-vagabontu`, `wolfgang-meyerings-malbrook`, `les-noces-gitanes`, `donnisulana`, `alvik`, `almasala`, `brina`, `crew-peligrosos`, `rutkai-bori-es-a-specko-jedno`, `coeur-de-chauffe-gerard-tarquin`, `interzone`, `keltieg`, `mpho-and-uvimba-band`, `ze-manel`, `kiril` (ztotožněn podle země), `ridina-ahmedova`, `parne-gadje`, `volga`, `la-sarita`, `loyko`, `tucanas`, `jablkon`, `les-espoirs-de-coronthie`, `francoise-kucheida`, `shutka-roma-rap`, `l-chaim`, `sari-kaasinen-otawa`, `melina-kana`, `frederic-belinsky`, `papiers-d-armenies`, `lariba`, `ionica-minune`. U `ensemble-badila`, `erik-marchand-kreiz-breizh-akademi` (bio jen o Marchandovi) a `mari-boine-inna-zhelannaya-sergey-starostin` (rok alba nejistý) bio opatrné.
- [ ] (p) Pochybné nebo slabé obrázky: `moana-the-tribe` (jen zpěvačka), `eneida-marta` (banner FEMUA v pozadí, zkontrolovat ořez), `boris-kovac` (jen jeden člen), `jimi-tenor-and-kabukabu` (jen Jimi Tenor), `maddy-prior-carnival-band` (jen Maddy Prior), `sondorgo-ferus-mustafov` (jen členové Söndörgő), `stelafi` (420 px, 3 ze 4), `al-jawala` (300 px), `malawi-mouse-boys` (nízké rozlišení), `sapho` (nízké rozlišení), `kal` a `sa-dingding` (koncertní záběr s nápisem), `hoven-droven` (členové zády), `toorama` (další lidé v pozadí), `debo-band` (z boku), `tomatito` a `roce` (portréty jednotlivců), `hk` (živá fotka tří lidí).
- [ ] (p) Bio bez obrázku, jen obal alba nebo nic: `kunbe`, `08001`, `guillermo-portabales`, `la-chicana`, `egy-kiss-erzsi-zene`, `hasmik-harutyunyan`, `king-mensah`, `docuku`, `a-r-rahman-varttina`, `madredeus`, `sarband`, `jo-privat`, `cheick-tidiane-seck`, `afrocubism`, `michael-mcgoldrick`, `selvaganesh`, `karantamba`, `eda-zari`, `basiru-suso`, `arat-kilo`, `the-bollywood-brass-band`, `ando-drom`, `klezmerson`, `balla-kouyate-world-vision`, `max-pashm`, `las-hermanas-marquez`, `abdel-gadir-salim`, `engin-gurkey-nabiz`, `david-yengibarjan`, `alakotila-timo-johanna-juhola`, `afenginn`, `di-naye-kapelye`, `el-tanbura`, `georges-lammam`, `inge-thomson`, `manolo-caracol`, `mariam-matossian`, `nigun`, `sarazino`, `sileas`, `spook-the-guay`, `valderrama`, `daiqing-tana`, `samir-joubran`, `benjamin-escoriza`.
- [ ] (p) Obrázek `gijs-levelt` je profilová fotka ze Spotify, bez uvedené licence.
- [ ] (q) Slabé obrázky: `mory-kante` (v pozadí zlomky dalších lidí), `tcheka` (rozmazaný bubeník), `kaly-live-dub` (podpis fotografa v rohu), `yann-tiersen` (tmavý detail), `ghymes` (členové malí), `sergent-garcia` (LED obrazovka za zpěvákem), `bittova` a `boban-markovic-orkestar` (jen jedna osoba), `nigel-kennedy-kroke` (jen dva členové Kroke), `annbjorg-lien-bjorn-ole-rasch`, `chambao`, `elbicho`, `sandy-lopicic-orkestar` (jedna osoba, u dvou nejistá), `les-negresses-vertes` a `playing-for-change` (logo), `kepa-junkera` (ořez z videa, nápis 2009), `manu-chao` (část loga festivalu), `transglobal-underground` (zpěvačka už není ve skupině), `te-vaka` (tmavé), `da-cruz` (identita Deezer profilu neověřená), `nishtiman` a `startijenn` (Deezer).
- [ ] (q) Bio bez obrázku (jen obaly alb nebo nic): `glykeria` (vodoznak), `hradistan`, `camille` (red carpet se sponzory), `graveyard-train`, `irina-karamarkovic-band`, `mariana-montalvo`, `the-chehade-brothers`, `pepe-habichuela-the-bollywood-strings`, `nayan-ghosh` (130 px), `mounira-mitchala`, `ersatzmuzika`, `skip-die`, `44-leningrad`, `kilema`, `kalenda-maya`, `vruja`, `bidinte`, `azucar-moreno`, `zohreh-jooya`, `druzina`, `el-combolinga`, `kabako`, `nikola-parov`, `nizar-rohana`, `ordo-sakhna`, `pape-cheikh`, `stockholm-lisboa-project`, `becaye-aw`, `la-kumpania-zelwer`, `vicente-soto-sordera` a řada dalších z dávky q (agenti nehledali u všech).
- [ ] (r) Slabé obrázky: `les-yeux-noirs` (pohled shora, kapela malá), `mohamed-mouner` (275 px zvětšeno), `king-ayisoba` (druhý tanečník), `spiro` (3 ze 4), `trilok-gurtu-garbarek-zawinul-laswell` (jen Gurtu), `sally-nyolo`, `chava-alberstein`, `olof-arnalds`, `maria-joao` (jedna osoba; u Sally Nyolo část loga PMUC), `konono-no1` (ořez čtverce uřízne okraje), `rada-ternovnik` (tmavé), `ana-alcaide` a `jorge-drexler` (jeden člověk, Deezer), `ablaye-cissoko` (logo sponzorů), `chano-dominguez`, `ktu`, `jambinai`, `ry-cooder` (jeden člen), `zegar-zivi` (420 px), `makely-ka` neuvedeno, `jazz-mandolin-project`, `marina-heredia`, `true-live`, `yves-jamait` (Deezer, neprohlédnuto podrobně).
- [ ] (r) Bio bez obrázku (jen obal alba, nic nebo vynecháno): `meridian-brothers`, `vujicsics-ensemble`, `eduardo-bianco-and-juan-baptista-deambrogio`, `ami-koita`, `blakkayo`, `makadem`, `celt-islam`, `ondrej-smeykal`, `strobo`, `turlu-tursu`, `elisa-vellia`, `marc-andre-leger`, `szalonna-es-bandaja`, `israel-kamakawiwo-ole`, `malvela`, `balkanika`, `jacques-pellen`, `korai-orom`, `kumpania-algazarra`, `marcelo-delacroix`, `paprika-korps`, `shoghaken-ensemble`, `the-gentle-good`, `klezmofobia`, `zsaratnok`, `kumar`, `lucie-redlova`, `beata-bocek`, `karloma`, `fantazia`, `jagwa-music`, `magillah`, `toto-la-momposina` (text autora přes obraz), `tabla-beat-science`, `papawa`, `markus-james`, `loituma`, `cengiz-onural`, `ibrahim-djo-experience`, `jeri-jeri`, `dezoriental`, `rasha-uxia-maria-salgado`, `ivo-cicvarek-a-lada-simickova`.

- [ ] (s) Nejistá identita u zapsaného bia nebo slabé zdroje: `marka` (belgický zpěvák Serge Van Laeken, sedí jen jméno a země), `fenoamby`, `nathalie-natiembe`, `geko-jones`, `mario-crispi`, `contreo`, `ruba-shamshoum` (slabé zdroje).
- [ ] (s) Nejistá identita, bio nezapsáno: `mustafa-sayan` (tr.wikipedia je turecký houslista, v souboru psychedelic/rock), `joe-boden` (asi Jon Boden).

## 5. Obrázky: pochybné, obaly alba, vodoznaky

Obrázky u mnoha kapel jsou z Deezeru a agenti je často neprohlíželi nebo jen zběžně. Zdroj (`image_source`) je u nich obecná adresa Deezeru.

- [ ] Vodoznak Getty: `intik`.
- [ ] Bez ověřené identity (obrázek přidán bez bia nebo s nejistou shodou): `aline-lessa`, `adile-yadirgi`, `cris-aflalo`, `d-gary`, `dengbej-ehme`.
- [ ] Obrázek bez bia: `roha-band`, `rosa-zaragoza`, `yaaba-funk`.
- [ ] Nekvalitní, malé nebo stylizované fotky: `kokolo`, `suba` (223 px), `dorothy-ashby` (294×339), `mama-marjas` (330×202), `luigi-cinque` (stylizovaná), `luisa-maita`, `zeca-baleiro`, `esra-dalfidan`, `lilia-vera`, `pistolera`, `camane`, `tony-allen` (kresba).
- [ ] Fotka celé kapely nebo jiného člena místo portrétu: `eugenio-bennato`, `frank-london`, `joe-zawinul`, `selim-sesler`, `dead-combo`, `club-des-belugas`, `les-cowboys-fringants` (jen basák), `mostar-sevdah-reunion`, `senor-coconut` (Uwe Schmidt).
- [ ] Fotka je titulka alba s nápisem: `la-fanfare-du-belgistan`.
- [ ] Fotka ze zkoušky: `african-footprint-international`.
- [ ] Fotka s kruhovou značkou ve spodní části (možný vodoznak): `mbongwana-star`.
- [ ] Stylizovaná promo grafika nebo ilustrace místo fotky: `amadou-mariam`, `kaya-project`, `alsarah-the-nubatones`.
- [ ] Zvětšený výřez nižší kvality: `javier-ruibal`.
- [ ] Obal alba nebo foto neurčených osob místo fotky kapely (dávka g): `vera-bila`, `kofia`, `makis-ablianitis`, `filastine`, `baklava`, `binobin`, `duoud`, `amira-saqati`, `dva`, `karolina-cicha-spolka`, `syriana`, `hamelmal-abate`, `slavic-soul-party`, `the-shee`, `soniquete`, `tom-diakite`, `bleizi-ruz`, `louise-attaque`, `vesna-petkovic`, `une-anche-passe`, `estrella-morente`, `smadj`, `gadjenko`, `monika-jalili`.
- [ ] Obrázek bez ověření shody s Deezer profilem: `oy`, `george-brooks`, `bebel-gilberto`, `trio-chemirani`.
- [ ] Foto jen jednoho člena nebo zpěvačky místo kapely (dávka h): `ojos-de-brujo`, `tamara-obrovac-quartet`, `tony-gatlif`.
- [ ] Starší portrét nebo obal místo aktuální fotky: `gnonnas-pedro` (druhý Deezer profil `Gnonnas Pedro and His Dadjes Band`), `afrissippi` (logo na obalu), `al-akhareen`, `cordas-do-sol`, `dun-an-doras`, `vershki-da-koreshki`.
- [ ] Obrázek chybí kvůli Wikimedia 429: `babos-gyula`.
- [ ] Obrázek chybí kvůli Wikimedia 429 (dávka k): `enver-izmailov`, `petru-guelfucci`, `uxia`, `kila`, `philip-koutev`, `mabulu`, `afro-cuban-all-stars`, `dunja-knebl`, `mustapha-teddy-addy`.
- [ ] Fotka nebo obal nesedí k celé kapele (dávka k): `dub-colossus` (jeden muž), `deti-picasso` (zpěvačka), `mahsa-marjan-vahdat` (jen Mahsa), `trio-erik-marchand` (Erik Marchand), `red-baraat` (nejspíš Sunny Jain), `bustan-abraham`, `johannes-linstead` a `la33` (330 px).
- [ ] Obaly alba místo fotek (dávka k): `malick-pathe-sow`, `sonya-varoujian`, `santa-macairo-orkestar`, `rona-hartner-dj-click`, `fatma-zidan`, `uxukalhus`, `buena-vista-social-club`, `slonovski-bal`, `joe-arroyo-y-la-verdad`, `trio-tzane`, `asmara-allstars`, `paradox-trio`, `pressburger-klezmer-band`, `plu`, `anthony-joseph-the-spasm-band`, `transsylvanians`, `camerata-meiga`, `elio-reve-su-charangon`, `perunika-trio`, `mystere-trio`.
- [ ] Obrázek chybí kvůli Wikimedia 429 (dávka i): `antonio-zambujo` (jen detail obličeje), `fernhill`, `massilia-sound-system` (Deezer má logo), `pacific-curls`, `stella-rambisai-chiweshe`, `jarabe-de-palo`.
- [ ] Foto jen jednoho člena: `serge-teyssot-gay-khaled-aljaramani`, `mccoy-mrubata-greg-hadjiyorki-georgiades`, `abelardo-carbono`.
- [ ] Malé nebo nekvalitní: `lord-mouse-the-kalypso-cats` (330×273), `gerardo-nunez` (cca 300 px), `marco-calliari` (v pozadí jeho jméno).
- [ ] Obal alba místo fotky (dávka i): `chehade-brothers`, `janka-nabay-and-the-bubu-gang`, `uusikuu`, `kerkennai`, `erik-aliana`, `sissokho-yakhouba`, `ooleya-mint-amartichitt`, `ramiro-musotto`, `tzouganakis-michalis`, `fernhill`, `stella-rambisai-chiweshe`, `trio-tesis-los-pasos-perdidos`, `marful`, `jarabe-de-palo`, `nikos-kypourgos`, `maria-teresa-vera`, `sergey-starostin-s-vocal-family`, `trio-fado`, `johanna-juhola`, `lala-njava`, `jayme-stone-mansa-sissoko`, `cuarto-poder`, `la-banda-municipale-de-santiago-de-cuba`, `drunksouls`, `alerta-pachuca`, `orquestra-arab-de-barcelona`, `eugene-mona`, `kotchnak`, `momo-wandel-soumah`.
- [ ] Plakát místo fotky: `raina-rai`.
- [ ] Jen obal alba, ne fotka kapely (výběr): `bothy-band`, `carlou-d`, `yinon-muallem`, `briganti-di-terra-d-otranto`, `tumi-and-the-volume`, `tunji-oyelana`, `bulgarian-state-female-choir`, `kalascima`, `kamafei`, `kamel-el-harrachi`, `klezmer-conservatory-band`, `koby-israelite`, `kolektif-istanbul`, `kottarashky`, `l-orchestra-di-piazza-vittorio`, `emeline-michel`, `sandhya-sanjana`, `haydamaky`, `rotterdam-ska-jazz-foundation`, `kiosk`, `gevorg-dabagian`, `laver-bariu`, `magic-carpet`, `think-of-one`, `sierra-maestra`, `afion`, `monsieur-doumani`, `nuru-kane`, `swing-gadje`, `vocal-sampling`, `gloria-estefan`, `lleuwen-steffan`, `dusminguet`, `vulgargrad`, `tamara-suffren`, `boulpik`, `ole-lukkoye`, `muluken-melesse`, `123-min`, `ahava-raba`, `njava`, `geomungo-factory`, `tsuumi-sound-system`, `jaleo-real`, `eero-grundstrom`, `christina-rosmini`, `van-merwijks-music-machine`, `zva-12-28-band`, `dieuf-dieul-de-thies`, `bijan-chemirani`, `ojra-kiritchenko`, `maria-peszek`, `ale-moller-band`, `ansambl-mastika`, `aniada-a-noar`, `mazalda`, `palyrria`, `the-imagined-village`, `abdullah-chhadeh-nara`, `ljiljana-buttler`, `listolet`, `zen-zila`, `la-sabrosa-sabrosura`, `norig`, `cheikh-el-afrite`, `imperial-tiger-orchestra`, `yapa`, `les-brayauds`, `guto-pires`, `under-kontrol`, `soriba-kouyate`, `rupa-the-april-fishes`, `andy-irvine-paul-brady`, `cemil-kocgun`, `lo-griyo`, `kora-jazz-band`.
- [ ] Licence: fotky z tiskových stránek, Deezeru a Womexu nemají ověřenou licenci (týká se hlavně dávek b, c, d, e, f). Wikimedia fotky mají licenci na Commons.
- [ ] Zdroj fotky je jen obecná doména: `kamilya-jubran` (`the.akdn`), `salif-keita` (náhled Google), Deezer u většiny nových kapel.
- [ ] Wikimedia 429: chybí fotka u `cibelle`. Dohledat, až se limit uvolní (`https://upload.wikimedia.org/wikipedia/commons/3/35/Cibelle_ariel_martini.jpg`).
- [ ] (dávka l) Obrázek je, ale identita kapely je nejistá a bio chybí: `electro-bamako` (je to album Mamani Keity a Marca Minelliho, ne kapela), `oneira`, `quimbombo`. Zvážit odstranění obrázku.
- [ ] (l) Obaly alba místo fotky: `julio-pereira`, `osvaldo-montes-anibal-arias`, `benat-achiary`, `rumberos-catalans`, `plantec`, `altan-urag`, `erika-emigrante`, `valravn`, `habadekuk`, `samba-mapangala-virunga`, `bernard-kabanda`, `d-callaos`, `alaw`, `orchestra-ethiopia`, `dona-dumitru-siminica`, `azagaia`, `carla-pires`, `minyeshu`, `abjeez`, `tam-tam-orchestra`, `ultra-high-flamenco`, `minoo-javan`, `tejedor`, `mohammed-jimmy-mohammed`, `la-fanfare-en-petard`, `adjagas`, `kanazoe-orkestra`, `hilja-gronfors`, `l-herbe-folle`, `levon-minassian`, `badume-s-band`, `lucas-van-merwijk-the-cubop-city-big-band`, `mauresca-fracas-dub`, `otros-aires`, `va-ta-ga`, `stepanida-borisova`.
- [ ] (l) Jen jeden člen nebo slabá kvalita: `bratsch` (člen), `agnes-buen-garnas-jan-garbarek` (jen Garnås), `carlos-puebla` (snímek z videa), `rao-kyao` (323 px), `lokkhi-terra` (banner SXSW), `chiwoniso` (amatérská fotka).
- [ ] (dávka m) Obaly alba místo fotky: `samite`, `gothart`, `madrid-de-los-austrias`, `cacique-97`, `valentin-clastrier` (druhá osoba), `los-zafiros`, `henri-guedon`, `terrakota`, `bela-lakatos-the-gypsy-youth-project`, `duo-brotto-lopez`, `synthesis`, `jessie-evans`, `paris-to-kyiv`, `dirtmusic`, `velandia-y-la-tigra`, `salsa-celtica`, `faytinga`, `dhol-foundation`, `johnny-kowalski-and-the-sexy-weirdos`, `cie-rassegna`, `novalima`, `mammane-sani-et-son-orgue`, `ramata-diakite`.
- [ ] (m) Další obaly alba: `chalaban`, `krar-collective` (člen), `m-a-k-u-sound-system`, `la-dame-blanche`, `alboka`, `ghazal`. Jen jeden člen nebo malé: `annie-ebrel-quartet` (jen Annie Ebrel), `gyedu-blay-ambolley` (295×223).
- [ ] (m) Jen jeden člen, nízká kvalita nebo nejisté: `the-idan-raichel-project` (muž, nejistě Raichel), `maddy-prior-tim-hart` (asi jen jeden z dvojice), `klaus-paier-asja-valcic` (z profilu Klause Paiera), `amanar` (foto vůdce), `oum-kalsoum` (nízké rozlišení), `susana-seivane` (malá živá fotka), `jacky-molard`, `garmarna` (rozmazaná), `matt-molloy` (316×377), `marta-sebestyen` (živě s Muzsikás).
- [ ] Dávka n, jen jeden člen nebo slabší obrázek: `debruit-alsarah`, `richard-galliano-gabriele-mirabassi`, `macaco`, `ida-kelarova-a-duzda-desiderius-a-jazz-famelija`, `ahmad-al-khatib-youssef-hbeisch`, `wimme`, `lau`, `kobo-town` (tmavý), `tram-des-balkans` (nepotvrzená fotka).
- [ ] Dávka o, jen jeden člen nebo slabší obrázek: `catrin-finch-seckou-keita`, `liu-fang` (cedule EXIT), `mano-negra` (Manu Chao), `the-real-tuesday-weld`, `vlatko-stefanovski-miroslav-tadic`, `blue-king-brown`, `baloji`, `mitsoura` (logo), `rocketjuice-the-moon` (nepotvrzeno), `noir-desir` (Cantat), `mari-boine-inna-zhelannaya-sergey-starostin`, `erik-marchand-kreiz-breizh-akademi`, `jacky-molard-quartet-foune-diarra-trio`, `beirut`, `bachar-mar-khalife`, `sourakata-koite` (archivní), `the-unthanks` (nejisté), `farmers-market` (tmavý), `omar-pene`, `mamar-kassey` (kousek nápisu).
- (p) Ručně přes sed opraveno: `malkit-singh` (odstraněn český název filmu), `i-muvrini` (mluvnice), `afenginn` (předložka), `madredeus` (režisér Wim Wenders), `sondorgo-ferus-mustafov` (tamburašské). Soubory `aris-san-dam-dam.md` a `aris-san-sigal-boom-pam-pepeloma.md` přejmenovány ručně (hebrejský název dával prázdný slug).
- (q) Ručně opraveno: `gnawa-diffusion` (Kateba Yacina), `miss-platnum`, `irina-karamarkovic-band` (mluvnice), agentem `blick-bassy` a `ordo-sakhna` (přeformulovaná věta, „technoproducent“).
- (r) Ručně opraveno: `george-dalaras-glykeria` (čtvrť Plaka), `marina-heredia` (jméno Fallovy skladby), `jagwa-music` (formulace), `szalonna-es-bandaja` a `israel-kamakawiwo-ole` (před zápisem).

- [ ] (s) Bio bez obrázku (jen obaly alb nebo nic): `ruba-shamshoum`, `fenoamby`, `griff`, `mara-aranda-solatge` (na Wikimedii je fotka se zakrytým obličejem), `geko-jones`, `contreo`, `mario-crispi`. Slabý obrázek: `fawzy-al-aiedy` (jen logo/nápis), `khun-narin` (skupinová fotka před plakátem).

## 6. Ruční úpravy souborů mimo skripty

Pravidlo je „data jen přes skripty“, tady byla odchylka. Zkontrolovat, že je výsledek v pořádku.

- [ ] Opravy, které jsem udělal já: `carla-hasset` (smazán odhadnutý odkaz `carlahassett.com`), `choer-de-neoneli` (smazána věta o rozporu), `mustafa-kandirali-ensemble` (Sbírka → Kompilace), `cuca-roseta` (Lisabonské → lisabonské), `zuco-103` (Vieiřiny → Vieirovy), `cemil-kocgun` (ve sbírce → psán též), `megafon` (odstraněna nepotvrzená jména členů), bia s poznámkami o rozporu (`aynur-dogan`, `aynur`, `banda-ionica`, `barana-co`, `barana-trio`, `piccola-banda-ikona`, `orient-expressions`, `asiaminor`), země u 4 kapel a sloučení Sidi Bemol.
- [ ] Opravy agentů: `iness-mezel`, `unni-lovlid`, `stoyan-yankoulov-elitsa-todorova`, `cheikh-sidi-bemol`, `ole-lukkoye`, `fanfare-ciocarlia-vs-boban-and-marko-markovic-orchestra`.
- [ ] Název kapely s překlepem: `carla-hasset` (správně Hassett), `bixiga-70` (název „Bixiga 70)“), `wanlov-the-kubulor` (zdroj píše Kubolor), `ivo-papasov` (Papazov), `radio-jarocho-jarocho` (zdvojené jméno), `gilzene-the-blue-light` (správně Gilzene & The Blue Light Mento Band), `budapester-klezmer-band` (Budapest Klezmer Band), `tockolotoc` (Točkolotoč), `aynur-dogan`, `daby-toure`, `amadou-diagne-introducing-amadou-diagne`.
- [x] (dávka l) `sophia-charai`: automatický odkaz na kapelu `nomada` v názvu alba „Blue Nomada“ vrácen na text. `minyeshu`: agent opravil překlep v bio ručním Editem.
- [x] (dávka m) agenti ručně opravili překlepy v bio: `miguel-czachowski`, `jamie-smith-s-mabon`; já `dragostin-folk-national` („Filipa Kuteva“).
- [x] (m) `gabriel-marie-yacoub`, `hector-zazou-barbara-eramo-stefano-saletti`: agent ručně odstranil nepodložená tvrzení („za svobodna Sauvet“, „italských hudebníků“).
- [ ] Dávka n: `xavier-blanco` (odstraněn odkaz na článek, nebyl to web umělce), `urban-trad` ("galicijské dudy"), `per-og-lars-lilholt-next-stop-svabonius-folkband` ("Larse").
- [x] Dávka o: agenti ručně opravili překlepy (`mercedes-peon`, `tigerstyle`, `erik-marchand-kreiz-breizh-akademi`, `antonio-chainho`, `volga`, `jacky-molard-quartet-foune-diarra-trio`, `the-growth-eternal`); já `gong-linna` („s Zollitschem“). Špatné automatické odkazy vráceny na text: `georgia-dagaki` (burdon), `interzone` (khaled), `tucanas` (catarina), `zita-swoon-group` (Moondog Jr.). U `bebo-cigala` agent odstranil blok `links` (odkaz na album).


- (s) Ručně opraveno: agenti `milagro-acustico`, `fofoulah`, `fawzy-al-aiedy`.

## 7. Přeskočené kapely (bez bia a obrázku)

U kapel ve vzorku „styl + země“ zbývá asi 100 bez bia, u kapel bez stylu ve všech dávkách celkem několik set. Hlavní důvody: nejistá identita, obecné jméno, žádný zdroj. Seznam ID drží soubory ve scratchpadu (`left.txt`, `nostyle3.txt`). Až pokročí zpracování, vygeneruji aktuální seznam tady.

- [ ] Rozhodnout, jestli se mají zpracovat ručně, nebo smazat jako nedohledatelné.
- [ ] Dávka g, nezpracováno kvůli limitům Wikipedie a MusicBrainz (kandidáti na další kolo): `radio-rumeli`, `chants-sacres-gitans-en-povence`, `hassan-erraji-arabesque`, `kerkennai`, `vandor-vokal`, `hijazz-omar-al-musfi`, `benedikta`, `talyn-duulal`, `analogue-birds`, `hekuran-xhamballi`, `tomas-san-miguel-txalaparta`, `la-familia`, `aiwa`, `isabelle-bazin`, `anna-rynefors-erik-ask-upmark`, `al-akhareen`, `temenik-electric`, `polykandriotis-thanassis`, `dorantes`, `ziveli-orkestar`.
- [ ] Dávka h, nezpracováno kvůli chybám zdrojů: `fanga-maalem-abdallah-guinea`, `batata-y-su-rumba-palenquera`, `the-magic-tombolinos`, `chehade-brothers`, `janka-nabay-and-the-bubu-gang`, `alians`, `aurelio-martinez`, `dobranotch`, `pancho-alvarez`, `kerkennai`, `vandor-vokal`, `analogue-birds`, `ziveli-orkestar`, `polykandriotis-thanassis`, `prosti-dumi`, `isabelle-bazin`, `berkovska-duchova-muzika`, `talyn-duulal`.
- [ ] Dávka k, nezpracováno (Wikipedie 429, čas): `carnem`, `mdungu`, `ensemble-tumbash`, `the-bisserov-sisters-trakiiskata-troika`, `colomach`, `os-cempes`, `deluxe`, `forgotten-fish-memory-orchestra`, `bukarester-tango`, `claire-zalamansky`, `costa-rico`, `lenacay`, `juana-fe`, `ernesto-tito-puentes`, `kanaku-y-el-tigre`, `lautari-de-clejani`, `kuku-sebsebe`, `sam-tshabalala`, `bal-interterrestre`, `basco`, `haydee-alba`, `caci-vorba`, `mustafa-al-sunni`, `dedale`, `ti-coca`, `muzykanci`, `altiplano-siyavush-kerimi`, `romengo`, `sistema-de-sonido-urbano`, `florina-brass-band`, `o-questrada`, `the-alaev-family`, `markku-lepisto`, `at-tambur`, `aljibe`, `actitud-maria-marta`, `enamorada-madalena`, `shezar`, `zumrad-xalfa`.
- [ ] Dávka k, přeskočeno jako nejisté: `kartick-gotam`, `opa`, `taltos`, `ottilie-b-denis-pean`, `el-reloj-secreto`, `forilalou`, `kapten-bolja`, `nomada`, `jonianet-saze-ensemble`, `pau-i-treva`, `bombolesse`, `calgija`, `hungry-for-hungary`, `sevane-et-manu`, `dilec-koc`, `dimitris-eustathiou`, `gipsy-burek-orkestar`, `niki-tramba-ross-daly-labyrinth`, `andrea-fultz`, `trillke-trio`.
- [ ] Dávka j, přeskočeno jako nejisté: `tassili`, `the-arab-summit`, `el-hadj-n-diaye`, `mamia-cherif`, `herminia`, `sete-saias`, `loop`, `byvala-horni-volta`, `here-be-dragons`, `dirty-honkers`, `afro-guinguette`, `doudou-swing`, `bei-bei`, `img`, `azalai`, `sabugo-tente-firme`, `yalla-babo-express-orchestra`, `psalite-pujol-gil`, `no-mad`, `easternox`, `kalakuta-orchestra`, `bko-quintet`, `stefan-kozka`, `manuel-aranda`, `grupo-de-musica-tradicional-do-igaem`, `kojato-and-the-afro-latin-cougaritas`, `cumbia-ya`, `extra-golden`, `danjal`.
- [ ] Dávka j, obrázek bez bia: `ganef`, `mo-rockin-project`, `la-minor`, `hk-les-saltimbanks`, `majorstuen`, `viorica-si-ionita-din-clejani`, `the-paradise-bangkok-molam-international-band`, `wipidoup`.
- [ ] Dávka i, přeskočeno jako nejisté: `ziveli-orkestar`, `kirstine-sand`, `moya`, `the-magic-tombolinos`, `zaragraf`, `mzetamze`, `el-brujo-y-su-timba`, `imaz-elia`, `biorchestr`, `zirp`, `togo-tempo`, `karuan`, `antiquark`, `6-australes`, `anubia`, `na-lua`, `aljub-krama`, `folk-error`, `petit-taraf-grand-barouf`, `yona`, `captain-cumbia-y-su-combo`, `la-internacional-sonora-balkanera`, `sabu`, `iconium-ensemble`, `daxar`, `radio-malanga`, `joi-sound-system`, `poza`, `duo-voces-del-caney`, `ethioda`, `nabila`, `sleeping-camels`, `gadalzen`, `ayo-nelson-homaiah`, `abyssinia-infinite`, `fernanda-maria-and-others`.
- [ ] Dávka h, přeskočeno jako nejisté: `tantra`, `tatouages`, `prague-klezmerim`, `ancoradoiro`, `the-sexican`, `nawel`, `girault-guillard-quartet`, `kurosh`, `radiant-arcadia`, `maut`, `violentrio`, `luz-katharine`, `la-olla-express`, `minuit-six-heures`, `flour-de-rose`, `pouro-sinto`, `romano-trip`, `kila-oki`, `d-aqui-dub`, `manuel-luna`, `al-nubatiyya`, `phaedro-s-funeral`, `abonesh-adinew`, `grupo-de-gaitas-do-igaem`, `something-secret`, `ton-rullo`, `adjabel`, `dialect-music`, `roi-xordo`, `gotan-project-yann-tiersen`, `radio-rumeli`, `chants-sacres-gitans-en-povence`, `hassan-erraji-arabesque`, `benedikta`, `hekuran-xhamballi`, `tomas-san-miguel-txalaparta`, `la-familia`, `aiwa`, `anna-rynefors-erik-ask-upmark`, `myrddin`, `rromano-dives`, `romashka`, `la-zikabilo`, `color-humano`, `napra`.
- [ ] Dávka g, přeskočeno jako nejisté: `trio-cornemuse`, `chinese-turkestan`, `hiss`, `eljuri`, `porok-karpo`, `tend-m`, `machu-picchu`, `alambig-electrik`, `kiko-ruiz-ravi-prasad`, `ensemble-takht-musical-de-tunis`, `kabuta-mukulu`, `chalga`, `suna`, `bole-2-harlem`, `cimbaliband`, `hooshere-bezdikian`, `rosa-negra`, `after-phurikana`, `fimber-bravo`, `paloma-suanzes`, `nina-stiller`, `loubistok`, `tesi-vaillant-trovesi`, `ayhan-sicimoglu`, `marenostrum`, `sam-karpienia`, `maria-mulata`, `killah-p`, `no-blues`, `karamba-dioubate`, `loulou-djine`, `sukke`, `niftys`, `kamenko`, `kostas-pavlidis`.
- (dávka l) Nezpracováno nebo přeskočeno jako nejisté, bez bia i obrázku:
  - l-00: `zohreh`, `history`, `strune`.
  - l-01: `lole`, `tekameli`, `la-panika`, `skruk-rim-banna`, `rudy-nini-flores`, `handala`, `eva-hren-sladcore`, `dhais`, `malee-divy`, `pandeiroums`, `sendreiovci`, `fraser-fifield-band-with-nedyalko-nedyalkov-and-georgi-petrov`, `laxula`, `groove-power-project-ii`.
  - l-02: `swang` (možná finské kvarteto Sväng), `damba`, `de-cara-a-la-pared`, `markopoulos-ksilouris`.
  - l-03: `ravi-prasad`, `ensemble-zalm`, `papa-noel`, `cinqui-so`, `la-mine-de-rien`, `euzen`.
  - l-04: `didier-lockwood-raghunath-manet`, `taraf-of-haidouks-kocani-orkestar`, `clejani-express`, `boya`, `montanaro`, `kan`, `phonix`, `la-manouche`, `bajanski-bal`, `manuel-moneo`, `miura1go`, `aga-shio`.
- (l) Bio bez obrázku (kapely, kde se fotka nenašla): ke zpracování později, hlavně `sweeney-s-men`, `india-martinez`, `dudu-tassa`, `malia`, `habib-faye`, `erik-marchand`, `orchestre-national-de-barbes`, `galandum-galundaina`, `kassa-mady-diabata`, `les-triaboliques`, `trio-kazanchis`, `abdeljalil-kodssi`, `ousmane-toure`, `amampondo`, `achieng-abura`, `hijas-del-sol`, `rosenbergs-sjua`.
- (dávka m) Nezpracováno nebo přeskočeno jako nejisté, bez bia i obrázku:
  - m-00: `sianye`, `selim-s-evade`, `eduardo-paniagua-jorge-rozemblum`, `hundreds-of-thousands-of-haitians-live-and-work-illegally-in-the-dr` (není umělec, název titulku; smazat?), `trio-mopmu`, `nathanaelle`.
  - m-02: `yarga-sound-system`, `shanahan-co`, `los-rumbers`, `sajra-tambaj`, `hugo-westerdahl`.
  - m-01: `chouval-brass`, `rantoboko`, `rila`, `dites-34`, `mitya-kuznecov`, `mitya-kuznecov-egor-strelnikov`. Bio bez obrázku: `djeli-moussa-conde` (obal sdílí cizí osoba), `gabriel-marie-yacoub`, `hector-zazou-barbara-eramo-stefano-saletti`, `amarok`, `keyvan-chemirani`, `anonimi`, `anabel-santiago`.
  - m-03 (agent nehledal na webu, stojí za opakování): `trio-nocturna`, `ida-kelarova-a-jazz-famelija-guests`, `nmb-brass-band`, `zafa`, `said-chraibi`, `aline-de-lima`, `xavier-blanco`, `beyond-the-moon`, `zulu-9-30`, `black-gandhi`, `richard-galliano-gabriele-mirabassi`, `bopeioi-etaipoi`, `peyoti-for-president`, `debruit-alsarah`, `agnes-herczku-agi-szaloki-szilvia-bognar`, `galeet-dardashti`, `mont-joia`, `nunu`, `juju`, `stokkcity`.
  - m-04: `dierdre`, `michele-fromenteau`, `ensemble-al-asdeka`, `solace`, `dertum`, `a-banda-de-poi`.
- [ ] Dávka n: `trio-nocturna`, `nmb-brass-band`, `zafa`, `beyond-the-moon`, `stokkcity`, `nour`, `bopeioi-etaipoi`, `mont-joia`, `nunu`, `tandava`, `paniks`, `trini`, `scarecrow`, `fegegeta`, `h3fk`, `kali-cerchen`, `michel-bismut`, `kontogiannis-ksintaris`, `east-meets-west`, `folkinger`, `polyphonies-corses`, `lombarda`, `olli-mood`, `sevda`. (U `afro-peruvian` viz oddíl 4.)
- [ ] Dávka o, přeskočeno: `gadje`, `le-choeur-de-la-roquette`, `bongani`, `klezmer-alliance`, `la-coixinera-l-escandall`, `wab`, `john-jones`, `ming`, `unite`, `gacha-empega`, `mardjane-chemirani`, `concha-buika-jacob-sureda`, `fanfara-tirana` (zdroj: worldmusiccentral.org, vedoucí Ahmet Caushi), `yarga-sound-system-yagra`, `sonido-vegetal`, `saturnes`, `l-assoce-pikante`, `mos`, `las-ninas`, `alee`, `laurent-cavalie`, `combo-de-la-muerte`, `jiang-ting`, `dessalegn-melku`, `asikides-tal-ben-ari`, `2009`, `armenia-dudukayin-ansambl` (nehledáno), `princess-china-music-orchestra`, `sissy-atanassova`, `eric-seva`-obrázek.
- [ ] (dávka p) Přeskočeno, bez bia i obrázku (nic nenalezeno nebo nejistá identita): `cenk-bosnali-bosna-ekspres`, `rua`, `boreale`, `zoneblue`, `bakos-arpad-friends`, `sinsonte-ensamble`, `patato-lucrecia-paquito` (spíš titul alba), `mariachi-tecalitlan`, `cris-aflalo` (obrázek je, bio chybí), `gothenburg-gadjos`, `italie`, `grannar`, `ulman` (poslední čtyři neprozkoumané kvůli limitům), `lemonada`, `karantinis-manos`, `manigold`, `a-cadeillan`, `xiradela`, `les-voix-de-l-emotion`, `caesar-gator`, `zuri`, `adile-yadirgi` (obrázek je, bio chybí), `saite-an-saite`, `feryal-oney`, `macumbia`, `catarina`, `rodrigo-miguez`, `kerlox-dub-band`, `sibongile-mbambo`, `watafiti`, `suzy`, `mosaica`, `7soisorkestra`, `nilufer-saritas`, `turkish-gypsies`, `luxus`, `udu`, `ebtesam`, `guru-martins`, `charanga`, `jess-hall`, `joel-zwick`, `ensemble-al-ala-de-marrakech`, `abidin-ensemble`, `sylvester-agbedoglo`, `imidiwen`, `aminata-kamissoko`, `shem-tov-levy-ensemble`, `marcia-maria`, `unavantaluna`.
- [ ] (p) Nejistá identita u zapsaného bia: `amira` (předpoklad Amira Medunjanin, v souboru není odkaz), `roce` (francouzský rapper Rocé, pravděpodobné), `moana-the-tribe` (bio z Wikipedie o Moaně Maniapoto), `jimi-tenor-and-kabukabu`.
- [ ] (p) Slabší zdroje bia: `tu-nokwe`, `moneim-adwan`, `jonas-simonson`, `matilde-politi`, `basiru-suso`, `eda-zari`, `shelta`, `docuku`, `la-chicana`, `nigun`, `klezmerson`, `nishtiman`, `balla-kouyate-world-vision`, `max-pashm`, `hk` (rok vzniku 2006 vs. 2009).
- [ ] (dávka q) Přeskočeno, bez bia i obrázku: `katryna`, `sandra-bel`, `jacques-cloarec`, `ora-sittner-youval-micenmacher`, `ziganamama`, `mancuso-marangolo`, `sibel`, `strada`, `marcos-lamy`, `douglas-din`, `thiago-correa`, `lade`, `laura-conti-ombra-gaia`, `rosa-reis`, `walter`, `dunya`, `sa`, `skarnio`, `caio-bosco`, `emad-sayyah`, `derya`, `camur`, `ozgur-kiyat`, `gasper`, `viamedina`, `ankata`, `mar-na`, `malietes`, `shu-de`, `eva-quartet-hector-zazou`, `eendo`, `doctor-l`, `dassi-elad`, `hussein-el-masry`, `etna`, `mamadou-barry`, `miriam-aziz`, `acqua-di-fonte`, `doa`, `fraternity`, `bachas-mont-joia`.
- [ ] (q) Nejistá identita u zapsaného bia: `livia-lucas` (jediný rozhovor z roku 2006), `roce` už výše; `hallvard-t-bjorgum-co` (zdroje jen o houslistovi Hallvardu T. Bjørgumovi, odkaz website vede na grappa.no), `luciana-oliveira` (spárováno podle stylu), `maak-s-spirit-gnawa-express` (bio o kapele Mâäk's Spirit).
- [ ] (q) Slabé zdroje: `la-kumpania-zelwer`, `les-pecheurs-de-perles`, `druzina`, `kabako`, `sandy-lopicic-orkestar`, `bidinte` (jen dvě věty), `kalenda-maya`, `cabuya`, `orka`, `kolinda`, `sol-i-serena`, `begona-olavide`, `zalo-solo`, `manuela-rodrigues`, `ibrahim-nabo`, `fia-na-roca` a `klezmafour` (jen jazykové Wikipedie), `dandelion-wine` (odkaz na Wikipedii se nepodařilo ověřit). Úmrtí `pepe-habichuela-the-bollywood-strings` (2026) a `mariana-montalvo` (2017) z jednoho zdroje, v bio neuvedeno.
- [ ] (dávka r) Přeskočeno, bez bia i obrázku: `urban-sevdah`, `behiye-suren`, `pedram-derakhshani`, `kabbalah`, `xil-rios`, `makan-badje-tounkara`, `serenata-guayanesa`, `armelle-ita`, `tammurriata-di-scafati`, `ecoalaize`, `meta`, `la-revuelta` (poslední osm neprozkoumáno kvůli rozpočtu WebSearch), `caapora`, `bo-da`, `kibris-in-sesi`, `bella-ciao`, `radio-mundial`, `silvia-filipe`, `souad-asla`, `stefano-valla-attilio-rocca-ettore-losini`, `almadraba`, `tancaruja`, `frontline-guerrilla-sonora`, `jitka-suranska-iren-lovasz-michal-elia-kamal`, `fred`, `mamadou-diabate`, `zabda`, `klez-mez`, `kazak`, `mango-gadzi`, `cesar-de-paula-projecto-s-a-mbalance`, `pedro-aledo-ensemble-mediterraneen`, `dengbej-ehme`, `laura-finocchiaro`, `metaphysics`, `moksha-ensemble`, `saf`, `elveda-rumeli`, `the-incredible-istanbul-gipsy-band`, `kariya-koto-ensemble`, `la-squadra`, `los-chicharrons`, `preto-tu`, `makondo`, `taraful-george-udila`, `marian-badoi-trio`, `voo-voo-haydamaky`, `avalon`, `mosaic`, `nova`, `kaja`, `kantango`, `somi-de-granadas`, `buenos-aires-tango-beat`, `bulut`, `lava`, `lalezar`, `round-mountain`.
- [ ] (r) Nejistá identita u zapsaného bia nebo slabé zdroje: `celt-islam`, `mohamed-mouner` (název Mouner, bio o Mohamedu Mounirovi), `szalonna-es-bandaja` (odkaz wikipedia vede na článek o vedoucím), `george-dalaras-glykeria` (dvojice, bio popisuje oba zvlášť), `kumar` (dva různí Kumar), `marc-andre-leger`, `elisa-vellia`, `noid`, `markus-james` (propagační materiály), `papawa`, `jacques-pellen` (jen dvě věty), `dezoriental`, `makely-ka`, `blakkayo`, `makadem`. Úmrtí `toto-la-momposina` (2026) převzato z Wikipedie.

- [ ] (dávka s) Přeskočeno, bez bia i obrázku: `nim-sofyan`, `karmete`, `toma-sidibe`, `flow-mc`, `partopi-tao-group`, `toubab-all-stars`, `zabe-i-babe`, `black-bazar`, `dub-o-net`, `tezeta`, `tiago-sa`, `kana`, `jur-domingo`, `l-orient-imaginaire`, `la-25e-corde`, `tres`, `nedret-ural`, `sabir`, `fokatelep`, `issa-hassan`, `drita`, `kokoura`, `free-planet-radio` (Deezer artist 1970431), `glik`, `dasaz`, `le-bus-rouge`, `claudio-n`, `aleas`, `asa`, `grazia`, `galego` (Deezer 6987883), `zoi-tiganouria` (Deezer 3896931), `rumberes-dels-garrotan` (Deezer 1266129), `madina-n-diaye` (jen stub), `mustafa-sayan`, `joe-boden`. Část se nehledala kvůli limitu WebSearch.

- [ ] (dávka t) Slabé zdroje bia: `radio-rumeli` (jen GoOut, členové neověřeni), `kokoura` (země Senegal, členové z Burkiny Faso, Senegalu, Brazílie, Nizozemska), `benedikta`, `hassan-erraji-arabesque` (zdroje se neshodují, kde žije). Fotky z dávky t vizuálně nekontrolovány: `grannar`, `hassan-erraji-arabesque`, `chants-sacres-gitans-en-povence` (v ID překlep Povence). Bez fotky: `radio-rumeli`, `benedikta`, `kokoura`.
- [ ] (dávka t) Přeskočeno i podruhé: `issa-hassan`, `drita` (existuje Drita Albanian Folk Orchestra z LA), `aiwa` (asi francouzská skupina, soubor Iraq), `tezeta`, `tiago-sa`, `kana`, `jur-domingo`, `ulman`, `italie`, `armenia-dudukayin-ansambl`, `talyn-duulal`, `hekuran-xhamballi`, `tomas-san-miguel-txalaparta`, `la-familia`, `isabelle-bazin`, `ziveli-orkestar`, `gothenburg-gadjos`.

- [ ] (dávka u) Slabé zdroje: `polykandriotis-thanassis` (jen discovergreece.com), `hijazz-omar-al-musfi` (jen drummerszone.com). Bez fotky: `anna-rynefors-erik-ask-upmark`, `polykandriotis-thanassis`, `hijazz-omar-al-musfi`. Přeskočeno: `trio-nocturna`, `nmb-brass-band`, `zafa`, `beyond-the-moon`, `bopeioi-etaipoi`, `mont-joia`, `nunu`, `stokkcity`.

## 8. Ostatní

- [ ] `README.md`, `design.md`, `upravy.md`, `.obsidian/appearance.json`, `graph.json`, `community-plugins.json`, `plugins/`, `_views/Kapely.base`, `_views/Tady.base`: tvoje necommitnuté změny (nebo ne moje), rozhodnout, co se commitne.
- [ ] Motiv Obsidianu Abduh: v Obsidianu jsem ho nezkoušel. Ověřit vzhled, velikost písma a funkčnost filtru v `_views/Tady.base`.
- [ ] Zapnutí motivu v `appearance.json` a `accentColor: "#bff55c"` (přebíjí červenou z motivu).
- [ ] Přehrávač Bandcamp na detailu CD: `sara-gioielli` album se nepřehrává (0 streamovatelných skladeb).
