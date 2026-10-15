/** Turn a human-readable project name into a safe, stable folder/package name. */
export function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'ekke-prezentacio';
}

/** Escape text inserted into the HTML portions of slides.md. */
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
  if (!folder) return { ok: false, reason: 'A projektmappa neve nem lehet üres.' };
  if (folder === '.' || folder === '..' || folder.includes('..') || /[<>:"/\\|?*\u0000-\u001f]/.test(folder)) {
    return { ok: false, reason: 'Csak egy egyszerű mappanevet adj meg, útvonal vagy tiltott karakterek nélkül.' };
  }
  if (/^[. ]|[. ]$/.test(folder)) {
    return { ok: false, reason: 'A mappanév nem kezdődhet vagy végződhet ponttal vagy szóközzel.' };
  }
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(folder)) {
    return { ok: false, reason: 'Ez a név a Windows rendszerben nem használható mappanévként.' };
  }
  return { ok: true, value: folder };
}
