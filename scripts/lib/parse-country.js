import { stripEmoji } from './slug.js';

const TAG = /\[\[~([^\]]+)\]\]/g;

function tagsOf(text) {
  return [...text.matchAll(TAG)].map((m) => stripEmoji(m[1]));
}

function withoutTags(text) {
  return text.replace(TAG, '').replace(/\s+/g, ' ').trim();
}

function parseBand(text, headerTags) {
  const inlineTags = tagsOf(text);
  let name = withoutTags(text).replace(/#+$/, '').trim();
  const parentheticals = [];
  let m;
  while ((m = name.match(/\s*\(([^()]*)\)\s*$/))) {
    parentheticals.unshift(m[1].trim());
    name = name.slice(0, m.index).trim();
  }
  return { name, text: text.trim(), members: [], memberTags: [], headerTags: [...headerTags], inlineTags, parentheticals };
}

export function parseCountryFile(text) {
  const lines = text.split('\n');
  const bulletMode = lines.some((l) => /^- /.test(l));
  const prose = [];
  const bands = [];
  const skipped = [];
  let headerTags = [];
  let current = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    const indented = /^\s/.test(line);
    const trimmed = line.trim().replace(/^-\s+/, '');

    if (!indented && !/^- /.test(line) && withoutTags(line) === '' && tagsOf(line).length) {
      headerTags = tagsOf(line);
      current = null;
      continue;
    }
    if (indented) {
      if (current) {
        current.members.push(withoutTags(trimmed));
        if (tagsOf(trimmed).length) current.memberTags.push({ member: withoutTags(trimmed), tags: tagsOf(trimmed) });
      }
      else skipped.push(trimmed);
      continue;
    }
    if (bulletMode) {
      if (/^- /.test(line)) {
        current = parseBand(trimmed, headerTags);
        bands.push(current);
      } else {
        prose.push(line.trim());
      }
      continue;
    }
    current = parseBand(trimmed, headerTags);
    bands.push(current);
  }
  return { prose: prose.join('\n'), bands, skipped };
}
