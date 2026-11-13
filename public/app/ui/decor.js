// Quiet flat desk objects in the margins (desktop only, decorative).
const STROKE = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
const OBJECTS = [
  { cls: 'decor-pen', svg: `<svg viewBox="0 0 220 40" ${STROKE}><path d="M4 20l34-9v18z"/><rect x="38" y="9" width="120" height="22" rx="6"/><rect x="158" y="7" width="58" height="26" rx="8"/><path d="M168 12v16"/></svg>` },
  { cls: 'decor-ink', svg: `<svg viewBox="0 0 80 90" ${STROKE}><path d="M26 18h28v10l14 10v40a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V38l14-10z"/><rect x="26" y="6" width="28" height="12"/><rect x="24" y="50" width="32" height="20" rx="2"/></svg>` },
  { cls: 'decor-clip', svg: `<svg viewBox="0 0 40 110" ${STROKE}><path d="M28 20v62a10 10 0 0 1-20 0V22a14 14 0 0 1 28 0v56"/></svg>` },
  { cls: 'decor-typewriter', svg: `<svg viewBox="0 0 160 110" ${STROKE}><rect x="18" y="52" width="124" height="48" rx="6"/><rect x="34" y="22" width="92" height="30"/><path d="M26 22h108M40 66h80M40 78h80M40 90h80"/><circle cx="14" cy="38" r="8"/><circle cx="146" cy="38" r="8"/></svg>` },
];

export function mountDecor(shell) {
  if (matchMedia('(max-width: 1099px)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'decor';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = OBJECTS.map((o) => `<span class="decor-item ${o.cls}">${o.svg}</span>`).join('');
  shell.append(layer);
}
