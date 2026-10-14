# create-slidev-vedes

Interaktív parancssori generátor Slidev-alapú védési prezentációkhoz. A meglévő `portfolio-vedes-b9xgep` projekt vizuális irányából indul ki: sötétkék–arany színvilág, saját címlap, egyedi fejléc és vízjel. A szöveges tartalom általános védési folyamatra van előkészítve, nem másolja át a korábbi személyes diákat.

## Használat közvetlenül GitHubról

Miután a repository felkerült GitHubra, a CLI helyi telepítés nélkül futtatható:

```bash
npx --yes --package=github:ekke-edu/slidev-template create-slidev-vedes
```

A parancs bekéri a projektmappát, a prezentáció címét, a nevet, az intézményt, annak rövid nevét, a képzést, az opcionális azonosítót, a helyszínt és a dátumot. Ezután létrehozza a mappát, beleírja az adatokat a sablonba, és megjeleníti a következő parancsokat.

```bash
cd vedes-prezentacio
pnpm install
pnpm dev
```

A generátor soha nem ír felül már létező mappát.

## Használat npm csomagként

Ha a projektet publikálod az npm registrybe, telepítés nélkül így is használható:

```bash
npm create slidev-vedes@latest
```

## Fejlesztés és teszt

Node.js 20 vagy újabb verzió szükséges.

```bash
npm test
npm run create
```

A sablon fájljai a `template/` mappában találhatók, a CLI a `bin/create.mjs` fájlban van. A generált projekt a saját `slides.md` fájlját szabadon szerkesztheti, a sablonfrissítések nem írják felül a már legenerált prezentációkat.

## Stílus testreszabása

Az alapszínek: `#1a2a5a` (sötétkék), `#c8a048` (arany), fehér. A generáláskor megadott intézménynév és rövidítés az SVG fájlokba is bekerül. Hivatalos intézményi logó esetén cseréld le az `assets/header.svg`, `assets/cover.svg` és `assets/watermark.svg` fájlokat, figyelembe véve a logó felhasználási feltételeit.

## Megjegyzés

A repository a prezentációs vázat és a CLI-t tartalmazza. A tényleges szakmai tartalmat a prezentáció készítőjének kell megírnia és ellenőriznie.
