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

test('prose, headings and region lines are skipped, not made into bands', () => {
  const r = convertVault(
    base({
      countries: [
        country(
          'europe',
          '🇪🇸 Spain.md',
          'Population: 7.6 million\n## Scotland\nSpain (Andalusia)\n16 Horsepower\n' +
            'Military rule, corruption, a huge wealth gap, crime and natural disasters have rendered it fragile\n',
        ),
      ],
    }),
    {},
  );
  assert.deepEqual(
    r.entities.filter((e) => e.type === 'band').map((e) => e.id),
    ['16-horsepower'],
  );
  assert.equal(r.report.skipped.length, 4);
});

test('band aliases merge spelling variants; alias-source styles are not created', () => {
  const r = convertVault(
    base({
      styles: ['~a-capella.md', '~acapella.md'],
      countries: [
        country('europe', '🇬🇧 United Kingdom.md', '- Transglobal Undeground [[~acapella]]\n'),
        country('europe', '🇫🇷 France.md', '- Transglobal Underground\n'),
      ],
    }),
    { acapella: 'a-capella' },
    { 'Transglobal Undeground': 'Transglobal Underground' },
  );
  const bands = r.entities.filter((e) => e.type === 'band');
  assert.equal(bands.length, 1);
  assert.equal(bands[0].fields.name, 'Transglobal Underground');
  assert.deepEqual(bands[0].fields.countries, ['united-kingdom', 'france']);
  assert.deepEqual(bands[0].fields.styles, ['a-capella']);
  assert.deepEqual(r.entities.filter((e) => e.type === 'style').map((e) => e.id), ['a-capella']);
});

test('image lines and the placeholder "Various" are not bands', () => {
  const r = convertVault(
    base({ countries: [country('europe', '🇪🇸 Spain.md', 'andalusia-flag.png\n![[map.png]]\n<img src="a.png">\nVarious\nReal Band\n')] }),
    {},
  );
  assert.deepEqual(r.entities.filter((e) => e.type === 'band').map((e) => e.id), ['real-band']);
});

test('prose lines go to the country body', () => {
  const r = convertVault(
    base({ countries: [country('africa', '🇧🇫 Burkina Faso.md', 'Population: 16.3 million\nCapital: Ouagadougou\nSome Band\n')] }),
    {},
  );
  const c = r.entities.find((e) => e.type === 'country');
  assert.match(c.body, /Population: 16\.3 million/);
  assert.match(c.body, /Capital: Ouagadougou/);
  assert.doesNotMatch(c.body, /Some Band/);
});

test('tags on member lines are reported, not dropped silently', () => {
  const r = convertVault(
    base({ countries: [country('america', '🇨🇺 Cuba.md', 'Buena Vista\n  Ruben Gonzalez [[~piano 🎹]]\n')] }),
    {},
  );
  assert.ok(r.report.skipped.some((s) => /Ruben Gonzalez/.test(s) && /piano/.test(s)));
});

test('report counts bands without style; ~w creates no style entity', () => {
  const r = convertVault(
    base({ styles: ['~rai.md', '~w.md'], countries: [country('africa', '🇩🇿 Algeria.md', '- A Band\n')] }),
    {},
  );
  assert.equal(r.report.counts.bandsWithoutStyle, 1);
  assert.equal(r.entities.some((e) => e.type === 'style' && e.id === 'w'), false);
});
