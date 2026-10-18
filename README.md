# Honza Smrž — osobní portfolio

Kompletní český web s projekty, úspěchy, lektorskými aktivitami, médii, časovou osou a devíti primárními zdroji. Obsah byl ověřen 18. října 2026.

## GitHub Pages

Cílový web: [hphugosm.github.io/honza-smrz-portfolio](https://hphugosm.github.io/honza-smrz-portfolio/).

Workflow `.github/workflows/pages.yml` při změně větve `main` sestaví web, spustí kontroly a nasadí výstup `dist/`. Používá oficiální GitHub Actions připnuté ke konkrétním verzím. Žádné přístupové údaje nejsou součástí projektu.

`SITE_URL` přebírá skutečnou adresu z metadat GitHub Pages. Z její cesty se odvodí prefix pro CSS, JavaScript i favicon, takže web funguje také pod názvem repozitáře. Zachovaná je podpora hostingu v kořeni domény i Vercelu.

Místní ověření stejné cesty:

```sh
SITE_URL=https://hphugosm.github.io/honza-smrz-portfolio npm run build
npm run check
BASE_PATH=/honza-smrz-portfolio npm run preview
```

Web na GitHub Pages je veřejný. Nastavení `meta.indexable: false` zachovává označení noindex, ale není přístupovou ochranou.

Dokumentace: [GitHub Pages s vlastním workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Spuštění

Potřebujete Node.js 22 nebo novější. Projekt nemá externí balíčky ani instalační krok.

```sh
npm run dev
```

Otevřete adresu vypsanou v terminálu. Po změně obsahu nebo stylů znovu spusťte build a obnovte prohlížeč. Volný port lze zvolit například `PORT=4386 npm run dev`.

```sh
npm run build
npm run check
npm run preview
```

Výstup je v `dist/`. Obsah se vykresluje při sestavení do HTML, takže je dostupný bez JavaScriptu a může být indexován bez spouštění klientské aplikace. JavaScript přidává filtry, změnu ilustračního grafu, mobilní menu a přístupné detaily projektů.

## Editace obsahu

Hlavní soubor je **`content/portfolio.json`**:

| Pole | Účel |
| --- | --- |
| `meta` | Jméno, titulek, popis, datum ověření, adresa a indexace |
| `copy` | Návrhové motto a stav schválení |
| `sources` | Zdrojové URL, vydavatelé a přesný rozsah doložených tvrzení |
| `about`, `projects` | Profil, projekty, role a omezení veřejných podkladů |
| `achievements` | Výsledky včetně přesné kategorie a kola |
| `experience`, `timeline` | Studium, akce a časové milníky |
| `mediaAssets` | Odkazy na veřejné fotografie s nevyřešenými právy |

Každá faktická položka obsahuje pole `sources` se seznamem ID zdrojů. Build odmítne chybějící citaci. Při změně údajů ověřte zdroj a upravte `verifiedAt`. Současný ročník studia se z dřívějšího ročníku automaticky nepočítá.

Pro rozvržení upravte `src/render.mjs`, pro barvy a responzivitu `src/style.css`, pro interakce `src/app.js`. Data jsou obyčejný JSON bez vazby na CMS. Angličtina není součástí této verze; celý obsah je česky a bez nefunkčního jazykového přepínače.

## Ověřené údaje a návrhové texty

- Vítězství je týmové: Jan Smrž a Robin János Morvai, **Robin & Honza**.
- **Energetický detektiv** je oficiální název soutěžního zadání. Nepřisuzujeme týmu neověřený stack, algoritmus, přesnost, vlastní produkt ani zveřejněný kód.
- Bobřík 2025: **183 bodů, dělené 19. místo v základním kole Senior**. Postupová listina není dokladem skutečné účasti v ústředním kole 2026.
- Krajská soutěž 2026 je uvedena jako **nominace**, bez pořadí.
- Náboj: týmové výsledky **Praha / Senior**, nikoli mezinárodní umístění.
- Rozsah 36 hodin patří robotickému kurzu jako celku, nikoli Janově osobní výuce.
- Úvodní motto je označené jako návrh, nikoli Janův výrok. Nadpisy a ilustrace jsou redakční zpracování.
- Kontakty, osobní GitHub, datum narození a osobní technologický stack nejsou přidány.

Po Janově schválení konkrétního úvodního textu lze nastavit `copy.status` na `approved` a vhodně upravit `copy.note`. Při změně na schválený text se značka návrhu u motta skryje. Formulace v oddílu „Autorské zpracování“ vychází z `copy.note`.

## Fotografie a práva

Web **nestahuje ani nezobrazuje fotografie či televizní záznamy třetích stran**. Obsahuje pouze odkazy na vydavatele a seznam obrazových podkladů. Ilustrace v hero, projektových kartách, grafu a mediálním náhledu vznikly pro tento návrh. Graf používá smyšlená data a není výsledkem modelu z hackathonu.

Pokud později doplníte fotografii, zaznamenejte autora, držitele práv, rozsah svolení, povinný kredit, datum a správnou identifikaci Jana. Schválený místní soubor vložte do `public/` a přidejte jej do šablony s popisným `alt`, rozměry a případně `loading="lazy"`. Původní položky `mediaAssets` jsou registr odkazů a zůstávají bez automatického vykreslování obrázků. Samotné přepnutí příznaku v registru neslouží jako systém publikace fotografií.

## Vercel

`vercel.json` nastavuje statický projekt, build `npm run build`, výstup `dist` a základní bezpečnostní hlavičky. V projektu zvolte Node.js 22/24 LTS. Není potřeba API, databáze, tajný klíč ani analytika.

1. Nahrajte **obsah tohoto adresáře** do svého Git repozitáře a importujte jej ve Vercelu.
2. Pokud je projekt v podadresáři, nastavte odpovídající Root Directory.
3. Framework Preset: **Other**; Build Command: **npm run build**; Output Directory: **dist**.
4. Pro produkční origin nastavte `SITE_URL` na skutečnou adresu (HTTPS bez parametrů a koncového lomítka, případně s cestou repozitáře), případně `meta.siteUrl`. Adresu nikde nehádáme. Bez explicitní adresy může build na Vercelu použít systémovou `VERCEL_PROJECT_PRODUCTION_URL`.
5. Spusťte nasazení a zkontrolujte výslednou adresu. Tento balíček nebyl nasazen do vašeho Vercel účtu.

Oficiální dokumentace: [konfigurace projektu](https://vercel.com/docs/project-configuration).

### SEO a schválení k veřejné indexaci

Návrh má `meta.indexable: false`. To je záměrný výchozí stav před schválením osobní prezentace. Není to přístupová ochrana. Soukromý náhled v Sites má vlastní řízení přístupu.

Pro schválenou veřejnou verzi nastavte `meta.indexable: true` a skutečný `SITE_URL`. Build vytvoří canonical URL, Open Graph s vlastním obrázkem PNG 1200 × 630, Twitter card, JSON-LD ProfilePage/Person, sitemap a robots.txt. Při `VERCEL_ENV=preview` zůstává noindex i tehdy, když je produkční indexace zapnutá. Bez produkčního originu se indexace nezapne a canonical se nevymýšlí.

## Přístupnost a výkon

Sémantické sekce, jediný H1, skip link, viditelné zaostření, stavová oznámení filtrů, klávesové ovládání, nativní dialog s navrácením focusu a zavíráním Escape, alternativní popis grafu a podpora `prefers-reduced-motion`. Odkazy s novou kartou to uvádějí čtečkám. Obsah je čitelný bez JavaScriptu, externích fontů a cookies. Přidán je i tiskový styl a stránka 404.

`npm run check` ověřuje odkazy, ID, zdroje, metadata, místní soubory, syntaxi a základní obsahová omezení. Nenahrazuje komplexní audit WCAG; rozsah skutečně provedeného ověření je v `VERIFICATION.md`.
