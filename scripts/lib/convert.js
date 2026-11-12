import { parseCountryFile } from './parse-country.js';
import { normalizeName, slugify, stripEmoji } from './slug.js';

const cleanName = (n) => stripEmoji(n.replace(/\.md$/, '')).replace(/^[~^]\s*/, '').trim();

export function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

const addUnique = (arr, v) => {
  if (!arr.includes(v)) arr.push(v);
};

export function convertVault(input, aliases, bandAliases = {}) {
  const bandMap = new Map(Object.entries(bandAliases).map(([k, v]) => [normalizeName(k), v]));
  const report = {
    counts: {},
    unknownTags: {},
    parentheticals: [],
    skipped: [],
    similarNames: [],
    slugCollisions: [],
    ignoredFolders: [],
  };
  const aliasIds = new Set(Object.keys(aliases).map((k) => slugify(k)));
  const styles = new Map(input.styles.filter((s) => !aliasIds.has(slugify(cleanName(s)))).map((s) => [slugify(cleanName(s)), cleanName(s)]));
  const instruments = new Map(
    input.instruments.filter((i) => !aliasIds.has(slugify(cleanName(i.name)))).map((i) => [slugify(cleanName(i.name)), { name: cleanName(i.name), icon: i.icon }]),
  );

  const classify = (rawTag, band) => {
    const id = slugify(aliases[rawTag] ?? rawTag);
    if (id === 'w') addUnique(band.tags, 'woman');
    else if (styles.has(id)) addUnique(band.styles, id);
    else if (instruments.has(id)) addUnique(band.instruments, id);
    else {
      addUnique(band.tags, id);
      report.unknownTags[id] = (report.unknownTags[id] ?? 0) + 1;
    }
  };

  const entities = [];
  const bandsByKey = new Map();
  const usedSlugs = new Set();

  for (const c of input.countries) {
    const countryName = stripEmoji(c.fileName.replace(/\.md$/, ''));
    const countryId = slugify(countryName);
    const flag = c.fileName.match(/^\p{Regional_Indicator}{2}/u)?.[0];
    const parsed = parseCountryFile(c.text);
    entities.push({
      type: 'country',
      id: countryId,
      fields: { name: countryName, continent: c.continent, ...(flag && { flag }) },
      body: parsed.prose ? parsed.prose + '\n' : '',
    });
    for (const s of parsed.skipped) report.skipped.push(`${countryName}: ${s}`);

    for (const raw0 of parsed.bands) {
      const raw = { ...raw0, name: bandMap.get(normalizeName(raw0.name)) ?? raw0.name };
      const key = normalizeName(raw.name);
      const noise =
        !key ||
        key === normalizeName(countryName) ||
        /^#|:/.test(raw.name) ||
        raw.name.length > 70;
      if (noise) {
        report.skipped.push(`${countryName}: ${raw.name}`);
        continue;
      }
      let band = bandsByKey.get(key);
      if (!band) {
        let id = slugify(raw.name) || 'band';
        if (usedSlugs.has(id)) {
          const base = id;
          for (let n = 2; usedSlugs.has(id); n++) id = `${base}-${n}`;
          report.slugCollisions.push(`${raw.name} -> ${id}`);
        }
        usedSlugs.add(id);
        band = { type: 'band', id, fields: { name: raw.name, countries: [] }, body: '' };
        band.styles = [];
        band.instruments = [];
        band.tags = [];
        band.members = [];
        bandsByKey.set(key, band);
        entities.push(band);
      }
      addUnique(band.fields.countries, countryId);
      for (const t of [...raw.headerTags, ...raw.inlineTags]) classify(t, band);
      for (const m of raw.members) addUnique(band.members, m);
      for (const p of raw.parentheticals) report.parentheticals.push(`${countryName} / ${raw.name}: (${p})`);
    }
  }

  for (const b of bandsByKey.values()) {
    Object.assign(b.fields, { styles: b.styles, instruments: b.instruments, members: b.members, tags: b.tags });
    delete b.styles;
    delete b.instruments;
    delete b.tags;
    delete b.members;
  }
  for (const [id, name] of styles) entities.push({ type: 'style', id, fields: { name }, body: '' });
  for (const [id, i] of instruments) {
    entities.push({ type: 'instrument', id, fields: { name: i.name, ...(i.icon && { icon: i.icon }) }, body: '' });
  }

  const keys = [...bandsByKey.keys()].filter((k) => k.length >= 6);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      if (Math.abs(keys[i].length - keys[j].length) <= 2 && editDistance(keys[i], keys[j]) <= (keys[i].length >= 12 ? 2 : 1)) {
        report.similarNames.push([bandsByKey.get(keys[i]).fields.name, bandsByKey.get(keys[j]).fields.name]);
      }
    }
  }

  for (const type of ['band', 'country', 'style', 'instrument']) {
    report.counts[`${type}s`] = entities.filter((e) => e.type === type).length;
  }
  return { entities, report };
}
