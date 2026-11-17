import { h, svg } from './dom.js';

// shared stroke icons (24x24, currentColor)
const ICON = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="miter" aria-hidden="true">${body}</svg>`;
// tab bar (icon only) and home tiles
export const TAB_ICONS = {
  home: ICON('<path d="M3 11L12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6"/>'),
  bands: ICON('<rect x="9" y="3" width="6" height="11"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  shelves: ICON('<path d="M4 3h16v18H4zM4 12h16M8 6v3M12 6v3M8 15v3M12 15v3"/>'),
  styles: ICON('<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>'),
  instruments: ICON('<path d="M3 5h18v14H3zM8 12v7M12 5v14M16 12v7"/>'),
  cds: ICON('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>'),
  tags: ICON('<path d="M3 3h9l9 9-9 9-9-9zM8 8h.01"/>'),
  countries: ICON('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.5 3.5 3.5 14.5 0 18M12 3c-3.5 3.5-3.5 14.5 0 18"/>'),
};

// decorative icon for headings and tiles
export const icon = (key, cls = 'title-ic') => (TAB_ICONS[key] ? h('span', { class: cls, 'aria-hidden': 'true' }, svg(TAB_ICONS[key])) : null);
