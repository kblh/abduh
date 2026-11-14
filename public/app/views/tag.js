import { detailView } from './_taxonomy.js';

export const render = (ctx) => detailView(ctx, { group: 'tags', route: 'tags', listLabel: 'Tagy', filterKey: 'tag', kind: 'tag', aboutTitle: 'O tagu', bandsMap: (s) => s.bandsByTag });
