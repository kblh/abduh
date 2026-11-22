// Radial tree layout: deterministic, no simulation.
export const LAYOUT = { radius: [0, 260, 480, 680], nodeR: [46, 30, 22, 16], minGap: 24 };

export function layoutRadial(nodes, opts = LAYOUT) {
  const { radius, nodeR, minGap } = opts;
  const kids = new Map();
  for (const n of nodes) if (n.parent != null) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n]);
  const leaves = new Map();
  const count = (n) => {
    const k = kids.get(n.key) ?? [];
    const v = k.length ? k.reduce((s, c) => s + count(c), 0) : 1;
    leaves.set(n.key, v);
    return v;
  };
  const root = nodes.find((n) => n.parent == null);
  const pos = new Map();
  if (!root) return { pos, bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 } };
  count(root);

  // angles (radians), sector per node proportional to leaves
  const angle = new Map();
  const place = (n, from, to) => {
    angle.set(n.key, (from + to) / 2);
    const k = kids.get(n.key) ?? [];
    const wt = (c) => Math.sqrt(leaves.get(c.key));
    const total = k.reduce((s, c) => s + wt(c), 0);
    let a = from;
    for (const c of k) { const w = (to - from) * wt(c) / total; place(c, a, a + w); a += w; }
  };
  place(root, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI);

  // radius per level: base radius, enlarged so neighbours on a circle keep a gap and levels do not touch
  const maxLevel = Math.max(...nodes.map((n) => n.level));
  const rad = [0];
  for (let lv = 1; lv <= maxLevel; lv++) {
    let r = Math.max(radius[lv] ?? radius.at(-1) + (lv - radius.length + 1) * 200, rad[lv - 1] + (nodeR[lv - 1] ?? 16) + (nodeR[lv] ?? 16) + minGap * 2);
    const at = nodes.filter((n) => n.level === lv).map((n) => angle.get(n.key)).sort((a, b) => a - b);
    const need = 2 * (nodeR[lv] ?? 16) + minGap;
    for (let i = 0; i < at.length; i++) {
      const d = i + 1 < at.length ? at[i + 1] - at[i] : at[0] + 2 * Math.PI - at[i];
      if (at.length > 1 && d > 1e-9) r = Math.max(r, need / (2 * Math.sin(Math.min(d, Math.PI) / 2)));
    }
    rad.push(r);
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const r = nodeR[n.level] ?? 16;
    const R = n.level === 0 ? 0 : rad[n.level];
    const a = angle.get(n.key);
    const p = { x: Math.round(R * Math.cos(a) * 100) / 100 + 0, y: Math.round(R * Math.sin(a) * 100) / 100 + 0, r };
    if (n.level === 0) { p.x = 0; p.y = 0; }
    pos.set(n.key, p);
    minX = Math.min(minX, p.x - r); maxX = Math.max(maxX, p.x + r); minY = Math.min(minY, p.y - r); maxY = Math.max(maxY, p.y + r);
  }
  return { pos, bounds: { minX, minY, maxX, maxY } };
}
