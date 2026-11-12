import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertVault } from '../scripts/lib/convert.js';
import { validate } from '../scripts/lib/validate.js';

const base = (over = {}) => ({
  countries: [],
  styles: ['~reggae.md', '~chaabi.md', '~berber.md'],
  instruments: [{ name: '~piano 🎹.md', icon: '🎹' }, { name: '~bass.md' }],
  ...over,
});
const country = (continent, fileName, text) => ({ continent, fileName, text });
const bandOf = (r, id) => r.entities.find((e) => e.type === 'band' && e.id === id);

test('band in two countries with different case merges into one', () => {
  const r = convertVault(
    base({
      countries: [
        country('europe', '🇲🇩 Moldova.md', '- Zdob si Zdub\n'),
        country('europe', '🇷🇴 Romania.md', '- Zdob Si Zdub\n'),
      ],
    }),
    {},
  );
  const bands = r.entities.filter((e) => e.type === 'band');
  assert.equal(bands.length, 1);
  assert.deepEqual(bands[0].fields.countries, ['moldova', 'romania']);
});

test('alias maps a typo tag to a listed style', () => {
  const r = convertVault(
    base({ countries: [country('america', '🇯🇲 Jamaica.md', '- Toots [[~raggae]]\n')] }),
    { raggae: 'reggae' },
  );
  assert.deepEqual(bandOf(r, 'toots').fields.styles, ['reggae']);
});

test('unlisted tag goes to tags and is counted as unknown', () => {
  const r = convertVault(
    base({ countries: [country('america', '🇺🇸 USA.md', '- Somebody [[~usa]]\n')] }),
    {},
  );
  assert.deepEqual(bandOf(r, 'somebody').fields.tags, ['usa']);
  assert.equal(r.report.unknownTags.usa, 1);
});

test('~w becomes the woman tag and is not unknown', () => {
  const r = convertVault(
    base({ countries: [country('america', '🇨🇺 Cuba.md', 'Brenda Navarrete [[~w]]\n')] }),
    {},
  );
  assert.deepEqual(bandOf(r, 'brenda-navarrete').fields.tags, ['woman']);
  assert.equal(r.report.unknownTags.w, undefined);
});

test('near-duplicate names stay separate and are reported', () => {
  const r = convertVault(
    base({ countries: [country('europe', '🇨🇿 Czech.md', '- Cankisou\n- Cankysou\n')] }),
    {},
  );
  assert.equal(r.entities.filter((e) => e.type === 'band').length, 2);
  assert.deepEqual(r.report.similarNames, [['Cankisou', 'Cankysou']]);
});

test('different bands with the same slug get a numeric suffix', () => {
  const r = convertVault(
    base({ countries: [country('europe', '🇨🇿 Czech.md', '- Dva\n- DVA!\n')] }),
    {},
  );
  assert.ok(bandOf(r, 'dva'));
  assert.ok(bandOf(r, 'dva-2'));
  assert.equal(r.report.slugCollisions.length, 1);
});

test('country without flag emoji has no flag field; with flag it is kept', () => {
  const r = convertVault(
    base({
      countries: [
        country('middle-east', 'Kurdistan.md', '- Aynur\n'),
        country('africa', '🇩🇿 Algeria.md', 'Text.\n- Khaled\n'),
      ],
    }),
    {},
  );
  const kurd = r.entities.find((e) => e.type === 'country' && e.id === 'kurdistan');
  assert.equal(kurd.fields.name, 'Kurdistan');
  assert.equal('flag' in kurd.fields, false);
  const dz = r.entities.find((e) => e.type === 'country' && e.id === 'algeria');
  assert.equal(dz.fields.flag, '🇩🇿');
  assert.equal(dz.fields.continent, 'africa');
  assert.match(dz.body, /Text\./);
});

test('header style and inline instrument both land on the band; result validates', () => {
  const r = convertVault(
    base({
      countries: [
        country('africa', '🇩🇿 Algeria.md', '[[~chaabi]]\n- Maurice El Medioni [[~piano 🎹]]\n'),
      ],
    }),
    {},
  );
  const b = bandOf(r, 'maurice-el-medioni');
  assert.deepEqual(b.fields.styles, ['chaabi']);
  assert.deepEqual(b.fields.instruments, ['piano']);
  assert.deepEqual(validate(r.entities), []);
  const piano = r.entities.find((e) => e.type === 'instrument' && e.id === 'piano');
  assert.equal(piano.fields.icon, '🎹');
  assert.equal(r.report.counts.bands, 1);
});

test('members and parentheticals reach the entity and the report', () => {
  const r = convertVault(
    base({
      countries: [
        country('america', '🇨🇺 Cuba.md', 'Buena Vista Social Club\n  Compay Segundo\nOmar Sosa (piano)\n'),
      ],
    }),
    {},
  );
  assert.deepEqual(bandOf(r, 'buena-vista-social-club').fields.members, ['Compay Segundo']);
  assert.ok(r.report.parentheticals.some((p) => /Omar Sosa/.test(p) && /piano/.test(p)));
});
