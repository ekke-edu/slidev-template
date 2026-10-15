# EKKE prezentációs sablon

Ez a Slidev-sablon az Eszterházy Károly Katolikus Egyetem hallgatóinak és oktatóinak készült. Használhatod kurzusbemutatóhoz, beadandóhoz, előadáshoz vagy akár szakdolgozati védéshez is. Az EKKE hivatalos logója alapból megjelenik a címlapon, a fejlécben és halvány vízjelként. A sablon közösségi kezdeményezés, nem az egyetem hivatalos kiadványa.

## Új prezentáció készítése parancssorból

Ha a sablont a GitHub-repóból szeretnéd használni, a Node.js telepítése után futtasd:

```sh
npx --yes --package=github:ekke-edu/slidev-template create-ekke-slidev
```

Megadhatod előre a mappa nevét is:

```sh
npx --yes --package=github:ekke-edu/slidev-template create-ekke-slidev --dir adatbazis-eloadas
```

A parancs rákérdez a prezentáció címére, az előadó nevére, a kurzusra, a szervezeti egységre és a dátumra. A kurzus és a szervezeti egység elhagyható. A kész prezentáció külön mappába kerül; meglévő mappát nem ír felül. Lépj be az új mappába, majd indítsd el:

```sh
cd adatbazis-eloadas
pnpm install --frozen-lockfile
pnpm dev
```

Ha a csomag később megjelenik az npm-en, ugyanez a generátor rövidebben is indítható lesz:

```sh
npm create ekke-slidev@latest -- adatbazis-eloadas
```

Az első npm-kiadás verziója `1.1.0` lesz, az `1.0.0` tag utáni minor kiadásként. A további kiadásoknál a Conventional Commits szerint írd a commitüzeneteket (`feat:` új funkció, `fix:` javítás, `docs:` dokumentáció, a kompatibilitást törő változást pedig `BREAKING CHANGE:` jelölje). A verziót és a megfelelő, `1.1.0` formátumú Git taget pnpm-mel emelheted:

```sh
pnpm release:patch
pnpm release:minor
pnpm release:major
```

Ezek a parancsok frissítik a `package.json` verzióját, majd Conventional Commit formátumú kiadási commitot és verziótaget készítenek. A parancs előtt commitold a munkádat, mert pnpm megköveteli a tiszta munkakönyvtárat. A kiadási commitot és taget ezután pushold, majd publikáld az npm-csomagot.

## Saját prezentáció készítése

### 1. Hozz létre egy saját példányt

Nyisd meg a GitHub-repót, kattints a **Use this template** gombra, majd válaszd a **Create a new repository** lehetőséget. Így a saját repód a sablon fájljaival indul. Ezután klónozd le a gépedre.

### 2. Indítsd el a prezentációt

Telepítsd a [Node.js 22.12 vagy újabb verzióját](https://nodejs.org/) és a pnpm 11-et. A repó mappájában futtasd:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

A terminálban megjelenő helyi címet nyisd meg a böngészőben. A `pnpm dev` parancsot futtatva a szerkesztések után a bemutató automatikusan frissül.

Ha npm-et használsz, a `npm install` és `npm run dev` parancsokkal is telepítheted a függőségeket és elindíthatod a diákat.

### 3. Cseréld ki a mintatartalmat

A prezentáció szövege a `slides.md` fájlban van. Cseréld ki a címlapon a prezentáció címét, a kurzus vagy alkalom nevét, az előadó adatait és a dátumot. A mezők szabadon alakíthatók: például szakdolgozati védéshez felveheted a szakot, témavezetőt vagy más, ott szükséges adatot; kurzusbemutatónál elhagyhatod a nem releváns mezőket. Ezután írd át a többi dia címeit és tartalmát. Új diát a `---` elválasztóval kezdhetsz. A `::header::` sor után a dia fejlécének szövege következik; a `::default::` után jön a dia tartalma.

A címlap szövege Markdownban van, ezért nyugodtan hagyhatsz üres sorokat a címsor és az adatok között. A címlap színeit, elrendezését és logóját a `layouts/ekke-cover.vue` kezeli; a szerkesztéshez elég a `slides.md` címlapján a címet és a `>` jellel kezdődő adatokat átírnod. Ha egy adat nem kell, töröld a teljes hozzá tartozó sort, a sort megelőző `>` jellel együtt.

Ha még nem használtad a Slidev-et, a [rövid útmutató](https://sli.dev/guide/) segít a Markdown, a kódblokkok, a képek és az elrendezések használatában.

### 4. Készíts PDF-et vagy tedd közzé

PDF-export:

```sh
pnpm export
```

GitHub Pages-közzétételhez a saját repódban nyisd meg a **Settings → Pages** oldalt, és a **Build and deployment → Source** beállításnál válaszd a **GitHub Actions** lehetőséget. Ezután a `main` ágra feltöltött módosítások automatikusan elindítják a közzétételt. Az elkészült oldal címe a repó **Settings → Pages** részén jelenik meg.

## Mit hol tudsz átírni?

- **Diák tartalma és címlap:** `slides.md`
- **Címlap elrendezése és stílusa:** `layouts/ekke-cover.vue`
- **Közös fejléc és vízjel:** `layouts/default.vue`
- **Átlátszó hátterű EKKE-logók:** `public/assets/ekke-logo-cover.png` (címlap, a kék-fehér határhoz igazított változat), `public/assets/ekke-logo.png` (vízjel) és `public/assets/ekke-logo-inverse.png` (sötét fejléc)
- **GitHub Pages munkafolyamat:** `.github/workflows/deploy.yml`

Az EKKE-logók az egyetem [hivatalos logóoldaláról](https://uni-eszterhazy.hu/kommunikacio/logok) származnak. Ha a bemutatót más intézményhez vagy saját, nem EKKE-s célra használod, cseréld le a logókat, és csak olyan képet vagy emblémát tegyél be, amelynek használatára jogosult vagy.

## Gyakran használt parancsok

| Parancs | Mire való? |
| --- | --- |
| `pnpm dev` | Helyi bemutató és szerkesztés |
| `pnpm build` | A közzétehető változat elkészítése a `dist/` mappába |
| `pnpm export` | PDF-export |
| `pnpm test` | A projektgenerátor ellenőrzése |

Ha hibába ütközöl, először ellenőrizd, hogy a Node.js és a pnpm megfelelő verziója van-e telepítve, majd futtasd újra a `pnpm install --frozen-lockfile` parancsot. Javaslatokat és javításokat szívesen fogadunk; a közreműködéshez lásd a [CONTRIBUTING.md](CONTRIBUTING.md) fájlt.
