import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { migrate } from '../scripts/migrate.js';
import { loadAll } from '../scripts/lib/entity-file.js';
import { validate } from '../scripts/lib/validate.js';

function fakeVault() {
  const v = mkdtempSync(join(tmpdir(), 'vault-'));
  for (const d of ['Africa', '~styles', '~instruments', 'raw', '~ Jazz']) mkdirSync(join(v, d));
  writeFileSync(join(v, 'Africa', '🇩🇿 Algeria.md'), 'Text.\n[[~rai]]\n- Khaled [[~piano 🎹]]\n- Faudel [[~raii]]\n');
  writeFileSync(join(v, '~styles', '~rai.md'), '# rai\n');
  writeFileSync(join(v, '~instruments', '~piano 🎹.md'), '# piano\n');
  writeFileSync(join(v, 'raw', 'tinariwen.md'), '# Tinariwen\n');
  writeFileSync(join(v, '~ Jazz', 'Flute.md'), '[[~flute]]\n');
  return v;
}
const opts = () => {
  const out = mkdtempSync(join(tmpdir(), 'out-'));
  return { dataDir: join(out, 'data'), reportPath: join(out, 'report.md'), aliasesPath: join(out, 'aliases.json') };
};

test('pass 1 writes no data, but reports ignored folders and a proposed alias', () => {
  const o = opts();
  const r = migrate(fakeVault(), o);
  assert.equal(existsSync(o.dataDir), false);
  assert.match(r.markdown, /raw/);
  assert.match(r.markdown, /~ Jazz/);
  assert.equal(r.proposedAliases.raii, 'rai');
  assert.ok(existsSync(o.reportPath));
});

test('--write produces a valid data directory', () => {
  const o = opts();
  migrate(fakeVault(), { ...o, write: true });
  const all = loadAll(o.dataDir);
  assert.deepEqual(validate(all), []);
  assert.ok(all.some((e) => e.type === 'band' && e.id === 'khaled'));
  assert.ok(all.some((e) => e.type === 'country' && e.id === 'algeria' && e.fields.continent === 'africa'));
});

test('--write refuses to overwrite a non-empty data directory without force', () => {
  const o = opts();
  migrate(fakeVault(), { ...o, write: true });
  assert.throws(() => migrate(fakeVault(), { ...o, write: true }), /not empty/);
  assert.doesNotThrow(() => migrate(fakeVault(), { ...o, write: true, force: true }));
  assert.ok(readdirSync(o.dataDir).length > 0);
});
