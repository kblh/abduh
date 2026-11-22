// Pure transform math. T = { x, y, k }: screen = world * k + (x, y).
export const K_MIN = 0.25;
export const K_MAX = 3;
const clamp = (k) => Math.min(K_MAX, Math.max(K_MIN, k));

export function zoomAt(t, factor, px, py) {
  const k = clamp(t.k * factor);
  const f = k / t.k;
  return { x: px - (px - t.x) * f, y: py - (py - t.y) * f, k };
}

export function fitTransform(bounds, size, pad = 40) {
  const w = bounds.maxX - bounds.minX, h = bounds.maxY - bounds.minY;
  const k = Math.min(1, clamp(Math.min((size.w - 2 * pad) / w, (size.h - 2 * pad) / h)));
  const cx = (bounds.minX + bounds.maxX) / 2, cy = (bounds.minY + bounds.maxY) / 2;
  return { x: size.w / 2 - cx * k, y: size.h / 2 - cy * k, k };
}

export const panBy = (t, dx, dy) => ({ x: t.x + dx, y: t.y + dy, k: t.k });

// v in px/ms; exponential decay, stops below 0.01 px/ms
export function inertiaStep(v, dtMs, friction = 0.006) {
  const f = Math.exp(-friction * dtMs * 1.0);
  const nv = { x: v.x * f, y: v.y * f };
  const dx = v.x * dtMs, dy = v.y * dtMs;
  if (Math.hypot(nv.x, nv.y) < 0.01) return { v: { x: 0, y: 0 }, dx, dy };
  return { v: nv, dx, dy };
}

export const exceedsDragThreshold = (dx, dy, threshold = 5) => Math.hypot(dx, dy) > threshold;
