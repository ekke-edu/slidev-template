/** Turn a human-readable project title into a filesystem/npm-friendly slug. */
export function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'slidev-vedes';
}

/** Escape values inserted into HTML within Slidev markdown. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** JSON string literals are valid YAML scalars too, so quotes/newlines stay safe. */
export function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

export function validateFolderName(value) {
  const folder = String(value ?? '').trim();
  if (!folder) return { ok: false, reason: 'A célmappa neve nem lehet üres.' };
  if (folder === '.' || folder === '..' || /[\\/]/.test(folder) || folder.includes('..')) {
    return { ok: false, reason: 'Csak egy mappanév adható meg, útvonal nélkül.' };
  }
  if (/^[. ]|[. ]$/.test(folder)) {
    return { ok: false, reason: 'A mappanév nem kezdődhet vagy végződhet ponttal/szóközzel.' };
  }
  return { ok: true, value: folder };
}
