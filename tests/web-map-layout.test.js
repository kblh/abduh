import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutRadial, LAYOUT } from '../public/app/map/layout.js';

const N = (key, level, parent) => ({ key, level, parent });
const tree = () => {
  const nodes = [N('c', 0, null)];
  for (let i = 0; i < 12; i++) nodes.push(N(`a${i}`, 1, 'c'));
  for (let i = 0; i < 3; i++) nodes.push(N(`b${i}`, 2, 'a0'));
  for (let i = 0; i < 2; i++) nodes.push(N(`d${i}`, 2, 'a5'));
  return nodes;
};
const ang = (p) => ((Math.atan2(p.y, p.x) * 180 / Math.PI + 90) % 360 + 360) % 360;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test('centre at origin', () => {
  const { pos } = layoutRadial(tree());
  assert.deepEqual([pos.get('c').x, pos.get('c').y, pos.get('c').r], [0, 0, LAYOUT.nodeR[0]]);
});

test('level-1 nodes keep minimum distance', () => {
  const { pos } = layoutRadial(tree());
  const l1 = [...Array(12).keys()].map((i) => pos.get(`a${i}`));
  for (let i = 0; i < l1.length; i++) for (let j = i + 1; j < l1.length; j++) assert.ok(dist(l1[i], l1[j]) >= 2 * LAYOUT.nodeR[1] + LAYOUT.minGap - 1e-6);
});

test('descendants stay in the parent sector (no crossing)', () => {
  const { pos } = layoutRadial(tree());
  const a0 = ['a0', 'b0', 'b1', 'b2'].map((k) => ang(pos.get(k)));
  const rest = ['a1', 'a5', 'd0', 'd1', 'a11'].map((k) => ang(pos.get(k)));
  const lo = Math.min(...a0), hi = Math.max(...a0);
  assert.ok(rest.every((a) => a < lo || a > hi));
  const a5 = ['a5', 'd0', 'd1'].map((k) => ang(pos.get(k)));
  assert.ok(['a4', 'a6'].every((k) => ang(pos.get(k)) < Math.min(...a5) || ang(pos.get(k)) > Math.max(...a5)));
});

test('only centre: bounds are the centre circle', () => {
  const { bounds } = layoutRadial([N('c', 0, null)]);
  assert.deepEqual(bounds, { minX: -LAYOUT.nodeR[0], minY: -LAYOUT.nodeR[0], maxX: LAYOUT.nodeR[0], maxY: LAYOUT.nodeR[0] });
});

test('deterministic and handles any node kind', () => {
  assert.deepEqual([...layoutRadial(tree()).pos], [...layoutRadial(tree()).pos]);
  assert.doesNotThrow(() => layoutRadial([N('c', 0, null), { key: 'more:x', level: 1, parent: 'c', kind: 'more' }]));
});
