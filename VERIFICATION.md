# Ověření výstupu

Datum: 18. října 2026.

Návštěvník má projít od představení přes projekty, výsledky a lektorskou činnost až k médiím a původním zdrojům. Obsah teče z `content/portfolio.json` do předem sestaveného HTML; interakce běží místně v prohlížeči. Web nemá serverové API ani externí datové připojení.

## Provedené kontroly

| Oblast | Výsledek |
| --- | --- |
| Sestavení | `npm run build` úspěšné |
| Statická kontrola | `npm run check` úspěšné; 46 vnitřních odkazů, 44 unikátních ID |
| Obsah | 9 zdrojů, všechny faktické datové položky odkazují na existující ID zdroje |
| Syntaxe | Soubory klienta, šablony a sestavení prošly kontrolou JavaScriptu |
| Responzivita | V prohlížeči ověřeny šířky 320, 390, 768, 1024 a 1440 px; žádné vodorovné přetékání |
| Projektové filtry | Vzdělávání zobrazí dvě aktivity; Vše obnoví tři položky |
| Časová osa | Filtr 2025 zobrazí tři milníky; Vše obnoví osm |
| Graf | Přepnutí na večerní špičku mění graf i jeho přístupný popis; zůstává označen jako smyšlená data |
| Dialog | Otevře se detail; zaostří se zavírací tlačítko; Escape zavře okno a vrátí focus na spouštěcí odkaz |
| Citace | Odkaz otevře příslušný zdroj, změní fragment a zaostří záhlaví zdroje |
| Mobilní navigace | Menu se otevře, `aria-expanded` se změní, po volbě sekce se zavře |
| Konzole | Při místním ověření nebyly zachyceny chyby ani varování |
| HTTP | HTML, JavaScript a OG obrázek vracejí 200; neexistující stránka vrací 404 |
| Média | Žádné vzdálené obrázky, vložená videa ani iframe třetích stran; fotografie jsou pouze odkazy |
| Kontakty | Žádné mailto/tel odkazy, e-mail ani telefon ve strukturovaných datech |
| SEO | Titulek, popis, jazyk, jediný H1, ProfilePage/Person, canonical podle konfigurace a vlastní OG PNG |
| Stav náhledu | `noindex, nofollow`, robots.txt blokuje procházení; indexaci lze zapnout po schválení |
| Bezpečné vykreslení | Editovaný text se escapuje; chybějící citace vyvolá chybu sestavení |

## Rozsah a meze

Jde o kontrolu funkčnosti, zobrazení a vybraných prvků přístupnosti. Nebyl proveden certifikační audit WCAG, test ve všech prohlížečích, samostatný test se čtečkou obrazovky ani měření Lighthouse/Core Web Vitals v reálné produkci.

Celý obsah je přítomen v sestaveném HTML. Varianta bez JavaScriptu a tiskové styly jsou připraveny v kódu, nebyly však samostatně ručně otestovány se všemi kombinacemi prohlížečů a asistivních technologií.

Vercel konfigurace je připravena, ale nasazení do Vercel účtu uživatele nebylo provedeno. Případný soukromý Sites náhled používá samostatný hosting a nemění vlastnictví ani přístup k Vercelu.

## GitHub Pages

Ověřeno sestavení s adresou `https://hphugosm.github.io/honza-smrz-portfolio` a kontrola cest k souborům v podadresáři. Výstup má správnou canonical URL a Open Graph URL. Stejný generátor nadále podporuje nasazení v kořeni domény.
