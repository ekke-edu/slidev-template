#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { cp, lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, slugify, validateFolderName, yamlString } from './helpers.mjs';

const packageDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const templateFiles = [
  '.github/workflows/deploy.yml',
  'layouts',
  'public',
  'template.gitignore',
  'slides.md',
  'vite.config.ts',
  'LICENSE',
  'generator-pnpm-lock.yaml',
];

const messages = {
  hu: {
    language: 'Nyelv / Language (hu/en)',
    invalidLanguage: 'Válassz nyelvet: hu vagy en.',
    header: 'EKKE Slidev prezentáció létrehozása',
    folder: 'Projektmappa neve',
    folderDefault: 'ekke-prezentacio',
    title: 'A prezentáció címe',
    titleDefault: 'A prezentáció címe',
    presenter: 'Előadó neve',
    presenterDefault: 'Előadó neve',
    course: 'Kurzus, tantárgy vagy alkalom neve (opcionális)',
    organization: 'Szak, tanszék vagy szervezeti egység (opcionális)',
    date: 'Dátum',
    exists: 'A célmappa már létezik: {path}\nVálassz másik nevet; meglévő fájlokat nem írok felül.',
    created: 'Elkészült a prezentáció: {folder}',
    editHint: 'A tartalmat a slides.md fájlban szerkesztheted.',
    dirHelp: 'A projektmappa neve (ha nincs megadva, a parancs rákérdez)',
    langHelp: 'A felületi nyelv: hu vagy en (alapértelmezés: kérdezzen rá)',
  },
  en: {
    language: 'Language (hu/en)',
    invalidLanguage: 'Choose a language: hu or en.',
    header: 'Create an EKKE Slidev presentation',
    folder: 'Project folder name',
    folderDefault: 'ekke-presentation',
    title: 'Presentation title',
    titleDefault: 'Presentation title',
    presenter: 'Presenter name',
    presenterDefault: 'Presenter name',
    course: 'Course, subject, or event name (optional)',
    organization: 'Degree programme, department, or unit (optional)',
    date: 'Date',
    exists: 'The destination folder already exists: {path}\nChoose another name; existing files will not be overwritten.',
    created: 'Presentation created: {folder}',
    editHint: 'Edit the presentation content in slides.md.',
    dirHelp: 'Project folder name (prompted if omitted)',
    langHelp: 'Interface language: hu or en (prompt if omitted)',
  },
};

function parseArgs(args) {
  const result = {};
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--help' || value === '-h') result.help = true;
    else if (value === '--dir' || value === '-d') result.dir = args[++index];
    else if (value === '--lang' || value === '--language' || value === '-l') result.language = args[++index];
    else if (value === '--') continue;
    else if (!value.startsWith('-') && !result.dir) result.dir = value;
  }
  return result;
}

function printHelp() {
  output.write(`EKKE Slidev prezentáció létrehozása / Create an EKKE Slidev presentation

Használat / Usage:
  npm create ekke-slides@latest
  npm create ekke-slides@latest -- sajat-prezentacio
  npm create ekke-slides@latest -- --lang en --dir my-presentation
  npx --yes --package=github:ekke-edu/slidev-template create-ekke-slides --dir sajat-prezentacio

Opciók / Options:
  -d, --dir <name>   ${messages.hu.dirHelp} / ${messages.en.dirHelp}
  -l, --lang <hu|en> ${messages.hu.langHelp} / ${messages.en.langHelp}
  -h, --help         Súgó megjelenítése / Show help
`);
}

function normalizeLanguage(value) {
  const language = String(value ?? '').trim().toLowerCase();
  if (['hu', 'magyar', 'hungarian'].includes(language)) return 'hu';
  if (['en', 'english', 'angol'].includes(language)) return 'en';
  return undefined;
}

async function chooseLanguage(rl, requestedLanguage) {
  if (requestedLanguage) {
    const language = normalizeLanguage(requestedLanguage);
    if (!language) throw new Error(`${messages.hu.invalidLanguage} / ${messages.en.invalidLanguage}`);
    return language;
  }

  while (true) {
    const answer = (await rl.question(`${messages.hu.language} [hu]: `)).trim();
    if (!answer) return 'hu';
    const language = normalizeLanguage(answer);
    if (language) return language;
    output.write(`${messages.hu.invalidLanguage} / ${messages.en.invalidLanguage}\n`);
  }
}

async function ask(rl, label, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || defaultValue;
}

function defaultDate(language) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return language === 'en' ? `${year}-${month}-${day}` : `${year}.${month}.${day}.`;
}

async function assertDestinationAvailable(targetDir, language) {
  try {
    await lstat(targetDir);
    throw new Error(messages[language].exists.replace('{path}', targetDir));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function personalizeSlides(slides, values) {
  const placeholders = values.language === 'en'
    ? {
      title: 'The presentation title',
      course: '> [Course, subject, or event – optional]',
      presenter: '[Presenter name]',
      organization: '> [Degree programme / department / unit – optional]',
      date: '[Date]',
      footer: '[Course / department – optional] · [Date]',
    }
    : {
      title: 'A prezentáció címe',
      course: '> [Kurzus, tantárgy vagy alkalom – opcionális]',
      presenter: '[Előadó neve]',
      organization: '> [Szak / tanszék / szervezeti egység – opcionális]',
      date: '[Dátum]',
      footer: '[Kurzus / szervezeti egység – opcionális] · [Dátum]',
    };
  const courseLine = values.course ? \`> \${escapeHtml(values.course)}\` : '';
  const organizationLine = values.organization ? \`> \${escapeHtml(values.organization)}\` : '';
  const footerContext = values.course || values.organization;
  const footerLine = footerContext
    ? \`\${escapeHtml(footerContext)} · \${escapeHtml(values.date)}\`
    : escapeHtml(values.date);

  return slides
    .replace(\`title: "\${placeholders.title}"\`, \`title: \${yamlString(values.title)}\`)
    .replace(\`# \${placeholders.title}\`, \`# \${escapeHtml(values.title)}\`)
    .replace(placeholders.course, courseLine)
    .replace(\`> **\${placeholders.presenter}**\`, \`> **\${escapeHtml(values.presenter)}**\`)
    .replaceAll(placeholders.presenter, escapeHtml(values.presenter))
    .replace(placeholders.organization, organizationLine)
    .replace(\`> \${placeholders.date}\`, \`> \${escapeHtml(values.date)}\`)
    .replace(placeholders.footer, footerLine);
}

async function createProject(folderInput, values) {
  const validation = validateFolderName(folderInput, values.language);
  if (!validation.ok) throw new Error(validation.reason);
  const folder = slugify(validation.value, values.language === 'en' ? 'ekke-presentation' : 'ekke-prezentacio');
  const targetDir = resolve(process.cwd(), folder);
  await assertDestinationAvailable(targetDir, values.language);

  let created = false;
  try {
    await mkdir(targetDir);
    created = true;
    for (const file of templateFiles) {
      const sourceName = file === 'slides.md' && values.language === 'en' ? 'slides.en.md' : file;
      const targetName = file === 'template.gitignore'
        ? '.gitignore'
        : file === 'generator-pnpm-lock.yaml'
          ? 'pnpm-lock.yaml'
          : file;
      const targetPath = join(targetDir, targetName);
      await mkdir(dirname(targetPath), { recursive: true });
      await cp(join(packageDir, sourceName), targetPath, { recursive: true, errorOnExist: true, force: false });
    }

    const chosenReadme = values.language === 'hu' ? 'README.hu.md' : 'README.md';
    const alternateReadme = values.language === 'hu' ? 'README.md' : 'README.hu.md';
    const alternateReadmeName = values.language === 'hu' ? 'README.en.md' : 'README.hu.md';
    await cp(join(packageDir, chosenReadme), join(targetDir, 'README.md'));
    await cp(join(packageDir, alternateReadme), join(targetDir, alternateReadmeName));

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
  let language = 'hu';
  try {
    language = await chooseLanguage(rl, args.language);
    const text = messages[language];
    output.write(`\n${text.header}\n`);
    output.write('────────────────────────────────────\n\n');

    const folderInput = args.dir ?? await ask(rl, text.folder, text.folderDefault);
    const validation = validateFolderName(folderInput, language);
    if (!validation.ok) throw new Error(validation.reason);
    const folder = slugify(validation.value, language === 'en' ? 'ekke-presentation' : 'ekke-prezentacio');
    const targetDir = resolve(process.cwd(), folder);
    await assertDestinationAvailable(targetDir, language);

    const values = {
      language,
      title: await ask(rl, text.title, text.titleDefault),
      presenter: await ask(rl, text.presenter, text.presenterDefault),
      course: await ask(rl, text.course),
      organization: await ask(rl, text.organization),
      date: await ask(rl, text.date, defaultDate(language)),
    };

    const project = await createProject(folder, values);
    output.write(`\n${text.created.replace('{folder}', project.folder)}\n\n`);
    output.write(`  cd ${project.folder}\n`);
    output.write('  pnpm install --frozen-lockfile\n');
    output.write('  pnpm dev\n\n');
    output.write(`${text.editHint}\n`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  output.write(`\n${messages.hu.error ?? 'Hiba'} / ${messages.en.error ?? 'Error'}: ${error.message}\n`);
  process.exitCode = 1;
});
