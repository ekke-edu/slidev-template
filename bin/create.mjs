#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { cp, lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, slugify, validateFolderName, yamlString } from './helpers.mjs';

const packageDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const templateFiles = [
  '.github',
  'layouts',
  'public',
  'template.gitignore',
  'slides.md',
  'vite.config.ts',
  'README.md',
  'LICENSE',
  'generator-pnpm-lock.yaml',
];

function parseArgs(args) {
  const values = args.filter((arg) => arg !== '--');
  if (values.includes('--help') || values.includes('-h')) return { help: true };
  const dirIndex = values.findIndex((arg) => arg === '--dir' || arg === '-d');
  const dirArg = dirIndex >= 0 ? values[dirIndex + 1] : undefined;
  const positional = dirIndex >= 0 ? undefined : values.find((arg) => !arg.startsWith('-'));
  return { dir: dirArg ?? positional };
}

function printHelp() {
  output.write(`EKKE Slidev prezentáció létrehozása

Használat:
  npm create ekke-slides@latest
  npm create ekke-slides@latest -- sajat-prezentacio
  npx --yes --package=github:ekke-edu/slidev-template create-ekke-slides --dir sajat-prezentacio

Opciók:
  -d, --dir <név>  A projektmappa neve (ha nincs megadva, a parancs rákérdez)
  -h, --help       Súgó megjelenítése
`);
}

async function ask(rl, label, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || defaultValue;
}

function defaultDate() {
  const today = new Date();
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}.`;
}

async function assertDestinationAvailable(targetDir) {
  try {
    await lstat(targetDir);
    throw new Error(`A célmappa már létezik: ${targetDir}\nVálassz másik nevet; meglévő fájlokat nem írok felül.`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function personalizeSlides(slides, values) {
  const courseLine = values.course
    ? `> ${escapeHtml(values.course)}`
    : '';
  const organizationLine = values.organization
    ? `> ${escapeHtml(values.organization)}`
    : '';
  const footerContext = values.course || values.organization;
  const footerLine = footerContext
    ? `${escapeHtml(footerContext)} · ${escapeHtml(values.date)}`
    : escapeHtml(values.date);

  return slides
    .replace('title: "A prezentáció címe"', `title: ${yamlString(values.title)}`)
    .replace('# A prezentáció címe', `# ${escapeHtml(values.title)}`)
    .replace('> [Kurzus, tantárgy vagy alkalom – opcionális]', courseLine)
    .replace('> **[Előadó neve]**', `> **${escapeHtml(values.presenter)}**`)
    .replaceAll('[Előadó neve]', escapeHtml(values.presenter))
    .replace('> [Szak / tanszék / szervezeti egység – opcionális]', organizationLine)
    .replace('> [Dátum]', `> ${escapeHtml(values.date)}`)
    .replace('[Kurzus / szervezeti egység – opcionális] · [Dátum]', footerLine);
}

async function createProject(folderInput, values) {
  const validation = validateFolderName(folderInput);
  if (!validation.ok) throw new Error(validation.reason);
  const folder = slugify(validation.value);
  const targetDir = resolve(process.cwd(), folder);
  await assertDestinationAvailable(targetDir);

  let created = false;
  try {
    await mkdir(targetDir);
    created = true;
    for (const file of templateFiles) {
      const targetName = file === 'template.gitignore'
        ? '.gitignore'
        : file === 'generator-pnpm-lock.yaml'
          ? 'pnpm-lock.yaml'
          : file;
      await cp(join(packageDir, file), join(targetDir, targetName), { recursive: true, errorOnExist: true, force: false });
    }

    const sourceManifest = JSON.parse(await readFile(join(packageDir, 'package.json'), 'utf8'));
    const projectManifest = {
      name: folder,
      private: true,
      type: 'module',
      packageManager: sourceManifest.packageManager,
      scripts: {
        dev: 'slidev --open',
        build: 'slidev build',
        export: 'slidev export',
      },
      devDependencies: sourceManifest.devDependencies,
    };
    await writeFile(join(targetDir, 'package.json'), `${JSON.stringify(projectManifest, null, 2)}\n`, 'utf8');

    const slidesPath = join(targetDir, 'slides.md');
    const slides = await readFile(slidesPath, 'utf8');
    await writeFile(slidesPath, personalizeSlides(slides, values), 'utf8');
    return { targetDir, folder };
  } catch (error) {
    if (created) await rm(targetDir, { recursive: true, force: true });
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const rl = createInterface({ input, output });
  try {
    output.write('\nEKKE Slidev prezentáció létrehozása\n');
    output.write('────────────────────────────────────\n\n');

    const folderInput = args.dir ?? await ask(rl, 'Projektmappa neve', 'ekke-prezentacio');
    const validation = validateFolderName(folderInput);
    if (!validation.ok) throw new Error(validation.reason);
    const folder = slugify(validation.value);
    const targetDir = resolve(process.cwd(), folder);
    await assertDestinationAvailable(targetDir);

    const values = {
      title: await ask(rl, 'A prezentáció címe', 'A prezentáció címe'),
      presenter: await ask(rl, 'Előadó neve', 'Előadó neve'),
      course: await ask(rl, 'Kurzus, tantárgy vagy alkalom neve (opcionális)'),
      organization: await ask(rl, 'Szak, tanszék vagy szervezeti egység (opcionális)'),
      date: await ask(rl, 'Dátum', defaultDate()),
    };

    const project = await createProject(folder, values);
    output.write(`\nElkészült a prezentáció: ${project.folder}\n\n`);
    output.write(`  cd ${project.folder}\n`);
    output.write('  pnpm install --frozen-lockfile\n');
    output.write('  pnpm dev\n\n');
    output.write('A tartalmat a slides.md fájlban szerkesztheted.\n');
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  output.write(`\nHiba: ${error.message}\n`);
  process.exitCode = 1;
});
