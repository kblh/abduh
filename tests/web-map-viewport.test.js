import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zoomAt, fitTransform, panBy, inertiaStep, exceedsDragThreshold, K_MIN, K_MAX } from '../public/app/map/viewport.js';

const toWorld = (t, px, py) => ({ x: (px - t.x) / t.k, y: (py - t.y) / t.k });
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test('zoomAt keeps the point under the cursor fixed', () => {
  const t = { x: 30, y: -20, k: 1 };
  const before = toWorld(t, 200, 150);
  const t2 = zoomAt(t, 2, 200, 150);
  const after = toWorld(t2, 200, 150);
  near(after.x, before.x); near(after.y, before.y);
  assert.equal(t2.k, 2);
});

test('zoomAt clamps scale', () => {
  assert.equal(zoomAt({ x: 0, y: 0, k: 1 }, 100, 0, 0).k, K_MAX);
  assert.equal(zoomAt({ x: 0, y: 0, k: 1 }, 0.001, 0, 0).k, K_MIN);
});

test('fitTransform fits and centres bounds', () => {
  const b = { minX: -1000, minY: -500, maxX: 1000, maxY: 500 };
  const t = fitTransform(b, { w: 1000, h: 500 }, 40);
  assert.ok(t.k < 0.5 && t.k > 0.4);
  near(t.x, 500); near(t.y, 250);
  assert.ok(fitTransform({ minX: -10, minY: -10, maxX: 10, maxY: 10 }, { w: 1000, h: 500 }).k <= 1);
});

test('panBy', () => assert.deepEqual(panBy({ x: 1, y: 2, k: 3 }, 10, -5), { x: 11, y: -3, k: 3 }));

test('inertiaStep decays to zero', () => {
  let v = { x: 1, y: -0.5 }, sum = 0, i = 0;
  for (; i < 2000 && (v.x || v.y); i++) { const s = inertiaStep(v, 16); v = s.v; sum += s.dx; }
  assert.deepEqual(v, { x: 0, y: 0 });
  assert.ok(sum > 0 && sum < 1000);
});

test('drag threshold', () => {
  assert.equal(exceedsDragThreshold(3, 3), false);
  assert.equal(exceedsDragThreshold(4, 4), true);
  assert.equal(exceedsDragThreshold(0, 5.1), true);
});
