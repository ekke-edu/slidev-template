# {{TITLE}}

Ez a projekt a [Slidev](https://sli.dev/) alapú EKKE nem hivatalos sablonból készült.

## Indítás

Node.js 20+ és pnpm szükséges.

```bash
pnpm install
pnpm dev
```

A fejlesztői szerver kiírja a helyi címet, ahol a prezentációt megnyithatod.

## Szerkesztés

- A diák tartalma: `slides.md`
- A közös diaelrendezés: `layouts/default.vue`
- Színek és arculati elemek: `layouts/default.vue`, illetve `assets/`
- Export PDF-be: `pnpm export`
- Build: `pnpm build`

A `slides.md` fájlban a szögletes zárójelben szereplő útmutatókat cseréld le a saját tartalmadra. A felesleges diákat törölheted, újakat a `---` elválasztóval vehetsz fel.

## Arculat

Az alapértelmezett vizuális rendszer sötétkék (`#1a2a5a`), arany (`#c8a048`) és fehér színekre épül. A generáláskor megadott intézménynév és rövidítés bekerül az SVG arculati elemekbe. Ha az intézmény hivatalos logóját kell használnod, cseréld le az `assets/header.svg`, `assets/cover.svg` és `assets/watermark.svg` fájlokat a megfelelő, felhasználásra engedélyezett arculati elemekre.

## GitHub Pages

A repository `main` ágára pusholva a workflow buildeli és közzéteszi a prezentációt GitHub Pagesre. A repó GitHub-beállításainál a **Settings → Pages → Build and deployment → Source → GitHub Actions** opciót válaszd.
