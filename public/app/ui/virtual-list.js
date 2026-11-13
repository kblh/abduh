import { h } from './dom.js';

const lists = new Set();
function repaintAll() {
  for (const el of lists) {
    if (el.isConnected) el.paint();
    else if (el.__seen) lists.delete(el);
  }
}
addEventListener('scroll', repaintAll, { passive: true });
addEventListener('resize', repaintAll);
addEventListener('hashchange', () => setTimeout(() => { for (const el of lists) if (!el.isConnected) lists.delete(el); }, 0));

export function virtualList({ items, rowHeight, renderRow, overscan = 8 }) {
  let data = items;
  const el = h('div', { class: 'vlist', style: `position:relative;height:${data.length * rowHeight}px` });
  const rows = new Map(); // index -> node, reused across paints so focus survives scrolling

  function paint(force = false) {
    if (force) { rows.forEach((n) => n.remove()); rows.clear(); }
    const top = el.getBoundingClientRect().top;
    const first = Math.max(0, Math.floor(-top / rowHeight) - overscan);
    const last = Math.min(data.length, Math.ceil((innerHeight - top) / rowHeight) + overscan);
    for (const [i, node] of rows) {
      if ((i < first || i >= last) && !node.contains(document.activeElement)) { node.remove(); rows.delete(i); }
    }
    for (let i = first; i < last; i++) {
      if (rows.has(i)) continue;
      const row = renderRow(data[i], i);
      row.style.cssText += `;position:absolute;left:0;right:0;top:${i * rowHeight}px;height:${rowHeight}px`;
      rows.set(i, row);
      el.append(row);
    }
  }

  lists.add(el);
  el.paint = paint;
  requestAnimationFrame(() => { el.__seen = true; paint(true); });

  el.update = (next) => {
    data = next;
    el.style.height = `${data.length * rowHeight}px`;
    const top = el.getBoundingClientRect().top + scrollY;
    if (scrollY > top) scrollTo({ top: top - 80, behavior: 'instant' });
    paint(true);
  };
  el.scrollToIndex = (i) => scrollTo({ top: el.getBoundingClientRect().top + scrollY + i * rowHeight - 70, behavior: 'instant' });
  return el;
}
