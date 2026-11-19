export function normalize(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’‘ʼ`.]/g, '')
    .toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
}

export const prettyStyle = (name) => String(name ?? '').replace(/-/g, ' ');

// "[[id|text]]" / "[[id]]" -> plain text (for excerpts)
export const stripWikilinks = (s) => String(s ?? '').replace(/\[\[([^\]|#]+)(?:\|([^\]]*))?\]\]/g, (_, id, t) => t ?? id);
