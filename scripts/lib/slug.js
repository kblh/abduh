const EMOJI = /[\p{Extended_Pictographic}\p{Regional_Indicator}️‍]/gu;

export function stripEmoji(s) {
  return s.replace(EMOJI, '').replace(/\s+/g, ' ').trim();
}

function stripDiacritics(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '');
}

export function slugify(s) {
  return stripDiacritics(stripEmoji(s))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeName(s) {
  return stripDiacritics(s)
    .replace(/\[\[[^\]]*\]\]/g, '')
    .replace(/#+\s*$/, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
