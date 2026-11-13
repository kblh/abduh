import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { addedDates } from '../scripts/lib/added-dates.js';

const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, stdio: 'pipe' });

test('bulk commits are ignored, later single adds get a date', () => {
  const d = mkdtempSync(join(tmpdir(), 'abduh-git-'));
  git(d, 'init', '-q');
  mkdirSync(join(d, 'data/bands'), { recursive: true });
  for (let i = 0; i < 60; i++) writeFileSync(join(d, `data/bands/b${i}.md`), '---\nname: x\n---\n');
  git(d, 'add', '.'); git(d, 'commit', '-q', '-m', 'import');
  writeFileSync(join(d, 'data/bands/new.md'), '---\nname: New\n---\n');
  git(d, 'add', '.'); git(d, 'commit', '-q', '-m', 'add');
  const m = addedDates(join(d, 'data'));
  assert.match(m.get('bands/new'), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(m.has('bands/b1'), false);
  assert.equal(m.size, 1);
});

test('not a git repo gives an empty map', () => {
  const d = mkdtempSync(join(tmpdir(), 'abduh-nogit-'));
  mkdirSync(join(d, 'data'));
  assert.deepEqual([...addedDates(join(d, 'data'))], []);
});
