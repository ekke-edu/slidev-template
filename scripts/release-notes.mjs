import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryUrl = 'https://github.com/ekke-edu/slidev-template';

const categories = [
  ['Features', 'feat'],
  ['Fixes', 'fix'],
  ['Performance', 'perf'],
  ['Documentation', 'docs'],
  ['Other changes', 'other'],
];

export function formatReleaseNotes(version, commits) {
  const grouped = new Map(categories.map(([heading]) => [heading, []]));
  const breakingChanges = [];

  for (const commit of commits) {
    if (/^chore\(release\):\s*v?\d+\.\d+\.\d+/i.test(commit.subject)) continue;

    const conventional = commit.subject.match(/^([a-z]+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/i);
    const type = conventional?.[1]?.toLowerCase();
    const scope = conventional?.[2];
    const description = conventional?.[4];
    const category = categories.find(([, matchingType]) => matchingType === type)?.[0] ?? 'Other changes';
    const title = conventional
      ? `${scope ? `${scope}: ` : ''}${description}`
      : commit.subject;
    const shortSha = commit.sha.slice(0, 7);
    const link = `[${shortSha}](${repositoryUrl}/commit/${commit.sha})`;
    const isBreaking = Boolean(conventional?.[3]) || /^BREAKING CHANGE:/m.test(commit.body ?? '');
    const line = `- ${isBreaking ? '**Breaking:** ' : ''}${title} (${link})`;

    grouped.get(category).push(line);
    if (isBreaking) breakingChanges.push(line);
  }

  const sections = [`# Changes in ${version}`];
  if (breakingChanges.length) sections.push(`## Breaking changes\n\n${breakingChanges.join('\n')}`);

  for (const [heading] of categories) {
    const lines = grouped.get(heading);
    if (lines.length) sections.push(`## ${heading}\n\n${lines.join('\n')}`);
  }

  if (sections.length === 1) sections.push('No user-facing changes were found in the Conventional Commit messages.');
  return `${sections.join('\n\n')}\n`;
}

function readCommits(previousTag, currentTag) {
  const revisionRange = previousTag ? `${previousTag}..${currentTag}` : currentTag;
  const log = execFileSync('git', [
    'log', '--no-merges', '-z', '--format=%H%x09%s%x09%b', revisionRange,
  ], { encoding: 'utf8' });

  return log.split('\0').filter(Boolean).map((record) => {
    const firstTab = record.indexOf('\t');
    const secondTab = record.indexOf('\t', firstTab + 1);
    return {
      sha: record.slice(0, firstTab).trim(),
      subject: record.slice(firstTab + 1, secondTab).trim(),
      body: record.slice(secondTab + 1).trim(),
    };
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [, , previousTag = '', currentTag] = process.argv;
  if (!currentTag) {
    process.stderr.write('Usage: node scripts/release-notes.mjs <previous-tag> <current-tag>\n');
    process.exitCode = 2;
  } else {
    process.stdout.write(formatReleaseNotes(currentTag, readCommits(previousTag, currentTag)));
  }
}
