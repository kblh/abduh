import { h, s } from '../ui/dom.js';
import { initials } from '../ui/components.js';
import { buildMap } from '../map/graph.js';
import { layoutRadial } from '../map/layout.js';
import { attachPanZoom } from '../map/pan-zoom.js';
import { buildHash } from '../router.js';
import { prettyStyle } from '../text.js';

const LIST = { band: 'bands', style: 'styles', instrument: 'instruments', tag: 'tags' };
const short = (t, max = 22) => (t.length <= max ? t : `${t.slice(0, max - 1)}…`);

function edgeLabel(e, a, b, f = 0.5) {
  const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
  const w = Math.max(24, e.label.length * 7.2 + 14);
  const inner = [s('rect', { class: 'map-label-bg', x: x - w / 2, y: y - 11, width: w, height: 22 }), s('text', { class: 'map-label-text', x, y: y + 4, 'text-anchor': 'middle' }, e.label)];
  return e.href ? s('a', { class: 'map-label', href: e.href }, ...inner) : s('g', { class: 'map-label' }, ...inner);
}

function nodeEl(n, p, store, i) {
  const clipId = `map-clip-${i}`;
  const content = [];
  if (n.image) {
    content.push(s('clipPath', { id: clipId }, s('circle', { cx: p.x, cy: p.y, r: p.r })));
    content.push(s('circle', { class: 'map-circle', cx: p.x, cy: p.y, r: p.r }));
    content.push(s('image', { href: n.image, x: p.x - p.r, y: p.y - p.r, width: p.r * 2, height: p.r * 2, 'clip-path': `url(#${clipId})`, preserveAspectRatio: 'xMidYMid slice' }));
  } else {
    content.push(s('circle', { class: 'map-circle', cx: p.x, cy: p.y, r: p.r }));
    const txt = n.kind === 'more' ? '…' : n.kind === 'band' ? initials(n.label) : initials(n.label).slice(0, 2);
    content.push(s('text', { class: 'map-initials', x: p.x, y: p.y + p.r * 0.2, 'text-anchor': 'middle', style: `font-size:${Math.round(p.r * 0.7)}px` }, txt));
    if (n.flag && p.r >= 20) content.push(s('text', { class: 'map-flag', x: p.x + p.r * 0.55, y: p.y - p.r * 0.55, 'text-anchor': 'middle' }, n.flag));
  }
  content.push(s('text', { class: 'map-name', x: p.x, y: p.y + p.r + 15, 'text-anchor': 'middle' }, short(n.label)));
  return s('a', { class: `map-node lvl-${n.level} kind-${n.kind}`, href: n.href, 'aria-label': n.label }, s('title', null, n.label), ...content);
}

export function render({ store, params }) {
  const { kind, id } = params;
  const group = { band: 'bands', style: 'styles', instrument: 'instruments', tag: 'tags' }[kind];
  const entity = store.byId[group].get(id);
  const name = kind === 'style' ? prettyStyle(entity.name) : entity.name;
  const detailHref = `#/${LIST[kind]}/${encodeURIComponent(id)}`;
  const back = h('a', { class: 'stamp-link map-back', href: detailHref }, '← zpět na detail');
  const { nodes, edges } = buildMap(store, { kind, id });

  if (nodes.length <= 1) {
    return h('article', { class: 'detail map-empty' },
      h('h1', { class: 'detail-title' }, name),
      h('p', { class: 'hand-note' }, 'zatím tu nic nesouvisí'), back);
  }

  const { pos, bounds } = layoutRadial(nodes);
  // first view: centre and the first ring (readable); "fit" button shows the whole map
  const ring = nodes.filter((n) => n.level <= 1).map((n) => pos.get(n.key));
  const startBounds = { minX: Math.min(...ring.map((p) => p.x - p.r)), maxX: Math.max(...ring.map((p) => p.x + p.r)), minY: Math.min(...ring.map((p) => p.y - p.r)), maxY: Math.max(...ring.map((p) => p.y + p.r)) };
  const world = s('g', { class: 'world' },
    s('g', { class: 'map-edges' }, edges.map((e) => { const a = pos.get(e.from), b = pos.get(e.to); return s('line', { class: `map-edge rel-${e.rel}`, x1: a.x, y1: a.y, x2: b.x, y2: b.y }); })),
    s('g', { class: 'map-labels' }, edges.map((e) => edgeLabel(e, pos.get(e.from), pos.get(e.to), e.from === nodes[0].key ? 0.62 : 0.5))),
    s('g', { class: 'map-nodes' }, nodes.map((n, i) => nodeEl(n, pos.get(n.key), store, i))));
  const svgEl = s('svg', { class: 'map-svg', role: 'group', 'aria-label': `Mapa souvislostí: ${name}` }, world);

  const stage = h('div', { class: 'map-stage', tabindex: '0', role: 'region', 'aria-label': `Mapa souvislostí: ${name}` }, svgEl);
  const pz = attachPanZoom(stage, {
    world,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    onChange: (t) => stage.classList.toggle('zoom-far', t.k < 0.45),
  });

  const btn = (label, aria, fn) => h('button', { class: 'map-btn', type: 'button', 'aria-label': aria, onClick: fn }, label);
  const controls = h('div', { class: 'map-controls' },
    btn('+', 'Přiblížit', () => pz.zoomBy(1.3)),
    btn('−', 'Oddálit', () => pz.zoomBy(1 / 1.3)),
    btn('⤢', 'Zobrazit celou mapu', () => pz.fit(bounds)));
  const title = h('div', { class: 'map-title' }, h('span', { class: 'eyebrow' }, 'MAPA'), h('strong', null, name), back);
  const wrap = h('div', { class: 'map-wrap' }, stage, title, controls);

  // fill the viewport below the header (and above the mobile tab bar); fit once the size is known
  let fitted = false;
  const resize = () => {
    const top = wrap.getBoundingClientRect().top;
    const tab = document.querySelector('.tabbar');
    const tabH = tab && getComputedStyle(tab).display !== 'none' ? tab.offsetHeight : 0;
    wrap.style.height = `${Math.max(240, innerHeight - top - tabH)}px`;
    if (!fitted && stage.clientWidth > 0) { fitted = true; pz.fit(startBounds); }
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  const onResize = () => {
    if (!wrap.isConnected) { removeEventListener('resize', onResize); ro.disconnect(); return; }
    resize();
  };
  addEventListener('resize', onResize);
  requestAnimationFrame(resize);
  return wrap;
}
