#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { cp, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, slugify, validateFolderName, yamlString } from './helpers.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const templateDir = resolve(scriptDir, '../template');
const currentYear = new Date().getFullYear();
const today = new Date();
const dateDefault = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}.`;

async function askRequired(rl, label, defaultValue) {
  while (true) {
    const answer = (await rl.question(`${label}${defaultValue ? ` [${defaultValue}]` : ''}: `)).trim();
    const value = answer || defaultValue || '';
    if (value) return value;
    output.write('Ez a mező kötelező, kérlek adj meg egy értéket.\n');
  }
}

async function replaceTokens(directory, values) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await replaceTokens(path, values);
      continue;
    }

    if (entry.name === 'package.json.template') {
      // Renamed after replacement, so npm never sees the unrendered template.
    }

    const content = await readFile(path, 'utf8').catch(() => null);
    if (content === null) continue;
    let updated = content;
    for (const [key, value] of Object.entries(values)) {
      updated = updated.replaceAll(`{{${key}}}`, value);
    }
    if (updated !== content) await writeFile(path, updated, 'utf8');
  }
}

async function main() {
  const rl = createInterface({ input, output });
  try {
    output.write('\nSlidev védési prezentáció létrehozása\n');
    output.write('─────────────────────────────────────\n\n');

    const defaultFolder = 'vedes-prezentacio';
    let folder;
    while (true) {
      const rawFolder = await askRequired(rl, 'Projektmappa neve', defaultFolder);
      const validation = validateFolderName(rawFolder);
      if (validation.ok) {
        folder = slugify(validation.value);
        break;
      }
      output.write(`${validation.reason}\n`);
    }

    const title = await askRequired(rl, 'A védés / prezentáció címe', 'Portfólióvédés');
    const presenter = await askRequired(rl, 'Név', 'Hallgató neve');
    const institution = await askRequired(rl, 'Intézmény teljes neve', 'Eszterházy Károly Katolikus Egyetem');
    const institutionShort = await askRequired(rl, 'Intézmény rövid neve / logófelirat', 'EKKE');
    const program = await askRequired(rl, 'Szak / képzés', 'A szak megnevezése');
    const identifier = (await rl.question('Neptun-kód vagy azonosító (elhagyható): ')).trim();
    const city = await askRequired(rl, 'Helyszín', 'Eger');
    const date = await askRequired(rl, 'Védés dátuma', dateDefault);

    const targetValidation = validateFolderName(folder);
    if (!targetValidation.ok) throw new Error(targetValidation.reason);
    const targetDir = resolve(process.cwd(), folder);
    try {
      await stat(targetDir);
      throw new Error(`A célmappa már létezik: ${targetDir}\nVálassz másik mappanevet; meglévő fájlokat nem írok felül.`);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }

    const values = {
      TITLE: escapeHtml(title),
      TITLE_YAML: yamlString(title),
      PRESENTER: escapeHtml(presenter),
      INSTITUTION: escapeHtml(institution),
      INSTITUTION_SHORT: escapeHtml(institutionShort),
      PROGRAM: escapeHtml(program),
      IDENTIFIER: escapeHtml(identifier),
      IDENTIFIER_BLOCK: identifier ? `<p class="text-lg font-semibold opacity-80 mt-1">${escapeHtml(identifier)}</p>` : '',
      CITY: escapeHtml(city),
      DATE: escapeHtml(date),
      YEAR: escapeHtml((date.match(/\b(20\d{2})\b/) || [])[1] || String(currentYear)),
      PACKAGE_NAME: JSON.stringify(slugify(folder)),
    };

    await cp(templateDir, targetDir, { recursive: true, errorOnExist: true, force: false });
    await replaceTokens(targetDir, values);
    const pkgTemplate = join(targetDir, 'package.json.template');
    try {
      await rename(pkgTemplate, join(targetDir, 'package.json'));
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }

    output.write('\nElkészült a projekt.\n\n');
    output.write(`  cd ${folder}\n`);
    output.write('  pnpm install\n');
    output.write('  pnpm dev\n\n');
    output.write('A diák tartalmát a slides.md fájlban szerkesztheted.\n');
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  output.write(`\nHiba: ${error.message}\n`);
  process.exitCode = 1;
});
