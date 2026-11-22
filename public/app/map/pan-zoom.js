import { zoomAt, fitTransform, panBy, inertiaStep, exceedsDragThreshold } from './viewport.js';

// Pointer-based pan (with inertia), pinch, wheel and keyboard zoom for an SVG <g> inside `el`.
export function attachPanZoom(el, { world, onChange, reducedMotion = false } = {}) {
  let t = { x: 0, y: 0, k: 1 };
  let frame = 0, inertia = 0, dragged = false, suppressClick = false;
  const pointers = new Map();
  let start = null, vel = { x: 0, y: 0 }, lastTime = 0, pinch = null;

  const paint = () => { frame = 0; world.setAttribute('transform', `translate(${t.x} ${t.y}) scale(${t.k})`); onChange?.(t); };
  const set = (nt) => { t = nt; if (!frame) frame = requestAnimationFrame(paint); };
  const size = () => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, left: r.left, top: r.top }; };
  const stopInertia = () => { if (inertia) cancelAnimationFrame(inertia); inertia = 0; };
  const centre = () => { const s = size(); return [s.w / 2, s.h / 2]; };
  const pair = () => { const [a, b] = [...pointers.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; };

  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopInertia();
    if (e.buttons === 0 || e.pointerType === 'mouse') for (const [pid] of pointers) if (pid !== e.pointerId) pointers.delete(pid);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) { start = { x: e.clientX, y: e.clientY }; dragged = false; vel = { x: 0, y: 0 }; lastTime = e.timeStamp; }
    else if (pointers.size === 2) { pinch = pair(); dragged = true; }
  });

  el.addEventListener('pointermove', (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, cur);
    if (pointers.size === 1) {
      if (!dragged && exceedsDragThreshold(cur.x - start.x, cur.y - start.y)) {
        dragged = true;
        try { el.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
        el.classList.add('is-dragging');
      }
      if (dragged) {
        const dx = cur.x - prev.x, dy = cur.y - prev.y, dt = Math.max(1, e.timeStamp - lastTime);
        vel = { x: 0.6 * (dx / dt) + 0.4 * vel.x, y: 0.6 * (dy / dt) + 0.4 * vel.y };
        lastTime = e.timeStamp;
        set(panBy(t, dx, dy));
      }
    } else if (pointers.size === 2 && pinch) {
      const next = pair(), s = size();
      set(panBy(zoomAt(t, next.d / pinch.d, pinch.cx - s.left, pinch.cy - s.top), next.cx - pinch.cx, next.cy - pinch.cy));
      pinch = next;
    }
  });

  const end = (e) => {
    if (!pointers.delete(e.pointerId)) return;
    pinch = null;
    if (pointers.size === 1) { const [rest] = pointers.values(); start = { ...rest }; vel = { x: 0, y: 0 }; }
    if (pointers.size > 0) return;
    el.classList.remove('is-dragging');
    if (dragged) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 50);
      if (!reducedMotion && e.type === 'pointerup' && e.timeStamp - lastTime < 80 && Math.hypot(vel.x, vel.y) > 0.05) {
        let prevT = performance.now(), v = { x: Math.max(-2, Math.min(2, vel.x)), y: Math.max(-2, Math.min(2, vel.y)) };
        const step = (now) => {
          const r = inertiaStep(v, Math.min(48, now - prevT));
          prevT = now; v = r.v;
          set(panBy(t, r.dx, r.dy));
          inertia = v.x || v.y ? requestAnimationFrame(step) : 0;
        };
        inertia = requestAnimationFrame(step);
      }
    }
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);

  // a drag must not open the link under the finger
  el.addEventListener('click', (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);

  el.addEventListener('dragstart', (e) => e.preventDefault());
  el.addEventListener('wheel', (e) => {
    e.preventDefault();
    stopInertia();
    const s = size();
    const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
    set(zoomAt(t, Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - s.left, e.clientY - s.top));
  }, { passive: false });

  el.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const [cx, cy] = centre();
    const pan = { ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60] }[e.key];
    if (pan && e.target === el) { e.preventDefault(); set(panBy(t, ...pan)); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); set(zoomAt(t, 1.2, cx, cy)); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); set(zoomAt(t, 1 / 1.2, cx, cy)); }
    else if (e.key === '0') { e.preventDefault(); api.refit?.(); }
  });

  const api = {
    get: () => t,
    set,
    fit(bounds) { api.refit = () => { const s = size(); set(fitTransform(bounds, s)); }; api.refit(); },
    zoomBy(f) { stopInertia(); const [cx, cy] = centre(); set(zoomAt(t, f, cx, cy)); },
    wasDrag: () => dragged,
  };
  return api;
}
