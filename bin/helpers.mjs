/** Turn a human-readable project name into a safe, stable folder/package name. */
export function slugify(value, fallback = 'ekke-prezentacio') {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || fallback;
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

export function validateFolderName(value, language = 'hu') {
  const messages = language === 'en'
    ? {
        empty: 'The project folder name cannot be empty.',
        invalid: 'Use a simple folder name without a path or forbidden characters.',
        edge: 'A folder name cannot start or end with a dot or space.',
        reserved: 'This name is reserved by Windows and cannot be used as a folder name.',
      }
    : {
        empty: 'A projektmappa neve nem lehet üres.',
        invalid: 'Csak egy egyszerű mappanevet adj meg, útvonal vagy tiltott karakterek nélkül.',
        edge: 'A mappanév nem kezdődhet vagy végződhet ponttal vagy szóközzel.',
        reserved: 'Ez a név a Windows rendszerben nem használható mappanévként.',
      };
  const folder = String(value ?? '').trim();
  if (!folder) return { ok: false, reason: messages.empty };
  if (folder === '.' || folder === '..' || folder.includes('..') || /[<>:"/\\|?*\u0000-\u001f]/.test(folder)) {
    return { ok: false, reason: messages.invalid };
  }
  if (/^[. ]|[. ]$/.test(folder)) {
    return { ok: false, reason: messages.edge };
  }
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(folder)) {
    return { ok: false, reason: messages.reserved };
  }
  return { ok: true, value: folder };
}
