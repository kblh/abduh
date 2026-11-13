export function normalize(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’‘ʼ`.]/g, '')
    .toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
}

export const prettyStyle = (name) => String(name ?? '').replace(/-/g, ' ');
