import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, slugify, validateFolderName, yamlString } from '../bin/helpers.mjs';
import { formatReleaseNotes } from '../scripts/release-notes.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const cli = join(root, 'bin', 'create.mjs');
const normalizeLineEndings = (value) => value.replace(/\r\n?/g, '\n');

async function runCli(cwd, args, answers = [], cliPath = cli, { askLanguage = false } = {}) {
  const languageFlag = args.findIndex((arg) => ['--lang', '--language', '-l'].includes(arg));
  const language = languageFlag >= 0 ? args[languageFlag + 1] : (askLanguage ? answers[0] : 'hu');
  const cliArgs = languageFlag >= 0 || askLanguage ? args : ['--lang', 'hu', ...args];
  const hasDirectory = args.some((arg, index) => {
    if (index > 0 && ['--lang', '--language', '-l', '--dir', '-d'].includes(args[index - 1])) return false;
    return !arg.startsWith('-') && !['--'].includes(arg);
  }) || args.some((arg) => ['--dir', '-d'].includes(arg));
  const prompts = language === 'en'
    ? [
      ...(askLanguage ? ['Language (hu/en)'] : []),
      ...(!hasDirectory ? ['Project folder name'] : []),
      'Presentation title', 'Presenter name', 'Course, subject, or event name',
      'Degree programme, department, or unit', 'Date',
    ]
    : [
      ...(askLanguage ? ['Nyelv / Language (hu/en)'] : []),
      ...(!hasDirectory ? ['Projektmappa neve'] : []),
      'A prezentáció címe', 'Előadó neve', 'Kurzus, tantárgy vagy alkalom neve',
      'Szak, tanszék vagy szervezeti egység', 'Dátum',
    ];
  const child = spawn(process.execPath, [cliPath, ...cliArgs], { cwd });
  let stdout = '';
  let stderr = '';
  let answered = 0;
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
    if (answered < prompts.length && stdout.includes(prompts[answered])) {
      child.stdin.write(`${answers[answered] ?? ''}\n`);
      answered += 1;
      if (answered === prompts.length) child.stdin.end();
    }
  });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const [status, signal] = await once(child, 'close');
  return { status, signal, stdout, stderr, answered };
}

test('slugify supports Hungarian names and returns a fallback for empty slugs', () => {
  assert.equal(slugify('Árvíztűrő előadás'), 'arvizturo-eloadas');
  assert.equal(slugify('!!!'), 'ekke-prezentacio');
});

test('HTML and YAML values are escaped for slides.md', () => {
  assert.equal(escapeHtml(`<tag a="'">&`), '&lt;tag a=&quot;&#39;&quot;&gt;&amp;');
  assert.equal(yamlString('Cím: "teszt"'), '"Cím: \\"teszt\\""');
});

test('folder validation blocks path traversal and Windows reserved names', () => {
  assert.equal(validateFolderName('eloadas-2026').ok, true);
  assert.equal(validateFolderName('../titkos').ok, false);
  assert.equal(validateFolderName('folder/name').ok, false);
  assert.equal(validateFolderName('CON').ok, false);
});

test('release notes group Conventional Commits and omit the release commit', () => {
  const notes = formatReleaseNotes('1.3.2', [
    { sha: '1111111111111111111111111111111111111111', subject: 'feat(cli): add English prompts (#8)', body: '' },
    { sha: '2222222222222222222222222222222222222222', subject: 'fix: prevent output collision (#9)', body: '' },
    { sha: '3333333333333333333333333333333333333333', subject: 'docs: translate README (#10)', body: 'BREAKING CHANGE: the README default language changed.' },
    { sha: '4444444444444444444444444444444444444444', subject: 'chore(release): v1.3.2', body: '' },
  ]);

  assert.match(notes, /## Features\n\n- cli: add English prompts/);
  assert.match(notes, /## Fixes\n\n- prevent output collision/);
  assert.match(notes, /## Breaking changes/);
  assert.match(notes, /## Documentation/);
  assert.doesNotMatch(notes, /chore\(release\)/);
});

test('CLI creates a personalized Slidev project with transparent logos and a matching package manifest', async (t) => {
  const generatorManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  assert.equal(generatorManifest.name, 'create-ekke-slides');
  assert.equal(generatorManifest.version, '1.3.2');
  assert.deepEqual(generatorManifest.bin, { 'create-ekke-slides': './bin/create.mjs' });

  const workingDir = await mkdtemp(join(tmpdir(), 'create-ekke-slides-'));
  t.after(() => rm(workingDir, { recursive: true, force: true }));

  const result = await runCli(workingDir, ['Árvíztűrő-előadás'], [
    'Témakör: "SQL"',
    '<Kiss & Társa>',
    'Adatbázisok',
    '',
    '2026.10.15.',
  ]);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Elkészült a prezentáció/, result.stdout + result.stderr);
  const projectDir = join(workingDir, 'arvizturo-eloadas');
  const slides = await readFile(join(projectDir, 'slides.md'), 'utf8');
  const generatedGitignore = await readFile(join(projectDir, '.gitignore'), 'utf8');
  const manifest = JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf8'));
  const assetNames = await readdir(join(projectDir, 'public', 'assets'));
  const projectWorkflows = await readdir(join(projectDir, '.github', 'workflows'));

  assert.match(slides, /title: "Témakör: \\\"SQL\\\""/);
  assert.match(slides, /# Témakör: &quot;SQL&quot;/);
  assert.match(slides, /&lt;Kiss &amp; Társa&gt;/);
  assert.match(slides, /Adatbázisok/);
  assert.equal(
    normalizeLineEndings(generatedGitignore),
    normalizeLineEndings(await readFile(join(root, '.gitignore'), 'utf8')),
  );
  assert.doesNotMatch(slides, /\[Előadó neve\]|\[Dátum\]/);
  assert.equal(manifest.name, 'arvizturo-eloadas');
  assert.equal(manifest.private, true);
  assert.equal(manifest.bin, undefined);
  assert.deepEqual(projectWorkflows, ['deploy.yml']);
  assert.deepEqual(assetNames.sort(), ['ekke-logo-cover.png', 'ekke-logo-inverse.png', 'ekke-logo.png']);
  assert.equal(
    normalizeLineEndings(await readFile(join(projectDir, 'pnpm-lock.yaml'), 'utf8')),
    normalizeLineEndings(await readFile(join(root, 'pnpm-lock.yaml'), 'utf8')),
  );
  assert.equal(
    normalizeLineEndings(await readFile(join(root, 'generator-pnpm-lock.yaml'), 'utf8')),
    normalizeLineEndings(await readFile(join(root, 'pnpm-lock.yaml'), 'utf8')),
    'Keep the publishable generator lockfile in sync with the development lockfile.',
  );
  assert.match(result.stdout, /pnpm install --frozen-lockfile/);
});

test('CLI refuses to overwrite an existing project directory', async (t) => {
  const workingDir = await mkdtemp(join(tmpdir(), 'create-ekke-slides-existing-'));
  t.after(() => rm(workingDir, { recursive: true, force: true }));
  const targetDir = join(workingDir, 'already-there');
  await mkdir(targetDir);
  await writeFile(join(targetDir, 'keep.txt'), 'leave this alone');

  const result = await runCli(workingDir, ['already-there']);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /A célmappa már létezik/);
  assert.equal(await readFile(join(targetDir, 'keep.txt'), 'utf8'), 'leave this alone');
  assert.deepEqual(await readdir(targetDir), ['keep.txt']);
});

test('CLI lets the user choose English and creates a project with matching documentation', async (t) => {
  const workingDir = await mkdtemp(join(tmpdir(), 'create-ekke-slides-english-'));
  t.after(() => rm(workingDir, { recursive: true, force: true }));

  const result = await runCli(workingDir, [], [
    'en',
    'campus-talk',
    'An Introduction',
    'Campus Talk',
    'Databases',
    'Computer Science',
    '2026-10-26',
  ], cli, { askLanguage: true });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Create an EKKE Slidev presentation/);
  assert.match(result.stdout, /Presentation created: campus-talk/);
  const projectDir = join(workingDir, 'campus-talk');
  assert.equal(await readFile(join(projectDir, 'README.md'), 'utf8'), await readFile(join(root, 'README.md'), 'utf8'));
  assert.equal(await readFile(join(projectDir, 'README.hu.md'), 'utf8'), await readFile(join(root, 'README.hu.md'), 'utf8'));
});

test('CLI includes .gitignore in generated projects from the packed template file', async (t) => {
  const workingDir = await mkdtemp(join(tmpdir(), 'create-ekke-slides-npm-install-'));
  t.after(() => rm(workingDir, { recursive: true, force: true }));
  const installedPackage = join(workingDir, 'node_modules', 'create-ekke-slides');
  await mkdir(installedPackage, { recursive: true });

  for (const file of [
    '.github/workflows/deploy.yml', 'bin', 'layouts', 'public', 'template.gitignore', 'slides.md', 'vite.config.ts', 'README.md', 'README.hu.md',
    'LICENSE', 'generator-pnpm-lock.yaml', 'slides.en.md', 'package.json',
  ]) {
    const destination = join(installedPackage, file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(join(root, file), destination, { recursive: true });
  }

  const installedCli = join(installedPackage, 'bin', 'create.mjs');
  const result = await runCli(workingDir, ['npm-installed-demo'], [
    'NPM telepített csomag teszt',
    'Tesztelő',
    '',
    '',
    '2026.10.16.',
  ], installedCli);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(await readFile(join(workingDir, 'npm-installed-demo', '.gitignore'), 'utf8'),
    await readFile(join(root, 'template.gitignore'), 'utf8'));
});

test('English generation uses English slide content and personalizes every cover field', async (t) => {
  const workingDir = await mkdtemp(join(tmpdir(), 'create-ekke-slides-english-content-'));
  t.after(() => rm(workingDir, { recursive: true, force: true }));

  const result = await runCli(workingDir, ['--lang', 'en', '--dir', 'english-deck'], [
    'An Introduction',
    'Campus Talk',
    'Databases',
    'Computer Science',
    '2026-10-26',
  ]);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  const slides = await readFile(join(workingDir, 'english-deck', 'slides.md'), 'utf8');
  assert.match(slides, /Background and context/);
  assert.match(slides, /# An Introduction/);
  assert.match(slides, /> Databases/);
  assert.match(slides, /> \*\*Campus Talk\*\*/);
  assert.match(slides, /Computer Science · 2026-10-26/);
  assert.doesNotMatch(slides, /Háttér és kiindulópont|A prezentáció címe|Előadó neve/);
});

test('cover title and metadata stay in separate bounded areas', async () => {
  const cover = await readFile(join(root, 'layouts', 'ekke-cover.vue'), 'utf8');
  assert.match(cover, /max-height: 34%/);
  assert.match(cover, /max-height: 27%/);
  assert.match(cover, /font-size: clamp\(1\.9rem, 5\.2vw, 4rem\)/);
});
