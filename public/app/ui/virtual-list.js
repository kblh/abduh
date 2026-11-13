import { h } from './dom.js';

export function virtualList({ items, rowHeight, renderRow, overscan = 8 }) {
  let data = items;
  const el = h('div', { class: 'vlist', style: `position:relative;height:${data.length * rowHeight}px` });
  let range = [-1, -1];

  function paint(force = false) {
    const top = el.getBoundingClientRect().top;
    const first = Math.max(0, Math.floor(-top / rowHeight) - overscan);
    const last = Math.min(data.length, Math.ceil((innerHeight - top) / rowHeight) + overscan);
    if (!force && first === range[0] && last === range[1]) return;
    range = [first, last];
    const frag = document.createDocumentFragment();
    for (let i = first; i < last; i++) {
      const row = renderRow(data[i], i);
      row.style.cssText += `;position:absolute;left:0;right:0;top:${i * rowHeight}px;height:${rowHeight}px`;
      frag.append(row);
    }
    el.replaceChildren(frag);
  }

  const onScroll = () => {
    if (!el.isConnected && el.__seen) { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); return; }
    if (el.isConnected) el.__seen = true;
    paint();
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  requestAnimationFrame(() => paint(true));

  el.update = (next) => {
    data = next;
    el.style.height = `${data.length * rowHeight}px`;
    const top = el.getBoundingClientRect().top + scrollY;
    if (scrollY > top) scrollTo(0, top - 80);
    paint(true);
  };
  el.scrollToIndex = (i) => scrollTo(0, el.getBoundingClientRect().top + scrollY + i * rowHeight - 70);
  return el;
}
